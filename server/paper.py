"""Practice with pretend dollars: a paper-money wallet. Simulation only.

Nothing here touches real money: there are no deposits, withdrawals or prizes,
and no leverage or shorting. The wallet itself lives in the user's browser; this
module is the one tested place that prices fills, values the wallet and runs the
habit coach, so the numbers the app shows always come from the same maths.

Wallet shape (shared with ``frontend/src/lib/practice.ts``)::

    {"cash": 10.0, "positions": {"BTC": {"qty": 0.0001, "cost": 5.0}}}

``cost`` is the USDT spent on what is still held, fees included, so
``value - cost`` is the open gain or loss on a coin.

The coach only describes what the user just did (it never says what to buy or
sell next). Notes are returned as ids plus numbers; the app words them in
EN/FR/AR.
"""

from __future__ import annotations

import asyncio
import math
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from typing import Any, Literal

import requests
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from advisor_engine import (
    BINANCE_API,
    BINANCE_BASE_NAMES,
    GRADE_HISTORY,
    GRADE_UNIVERSE,
    get_binance_klines,
    get_grade_reference,
    get_market_weather,
    grade_closes,
    percent_change,
)

from . import stats

# ── the rules of the game ───────────────────────────────────────────────────
START_USDT = 1000.0  # the default; the app lets a visitor start with 100, 500 or 1000
FEE_RATE = 0.001  # 0.1% per trade, like a Binance spot taker fee
SPREAD = 0.0005  # 0.05%: buys fill a little above the market price, sells a little below
MIN_TRADE_USDT = 1.0
TND_FALLBACK = 2.95  # TND per USD when the rate can't be fetched

# coach thresholds
FOMO_7D_PCT = 15.0
PANIC_24H_PCT = -10.0
CONCENTRATION_SHARE = 0.5
OVERTRADE_COUNT = 5  # this many trades within 24 hours, the new one included
DAY_MS = 24 * 3600 * 1000

EPS = 1e-9


class TradeError(ValueError):
    """A trade the wallet can't make. ``code`` is what the app translates."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


# ── pure maths (unit tested) ────────────────────────────────────────────────


def fill_price(mid: float, side: str) -> float:
    """Buys pay the spread above the market price, sells get it below."""
    return mid * (1 + SPREAD) if side == "buy" else mid * (1 - SPREAD)


def quote_buy(mid: float, usdt: float) -> dict[str, float]:
    """Spend ``usdt`` (fee included) on a coin priced ``mid``."""
    price = fill_price(mid, "buy")
    fee = usdt * FEE_RATE
    qty = (usdt - fee) / price
    return {
        "mid": mid,
        "price": price,
        "qty": qty,
        "gross": usdt,  # what leaves the cash balance
        "fee": fee,
        "spread_cost": qty * (price - mid),
        "net": usdt - fee,  # what actually buys coin
    }


def quote_sell(mid: float, qty: float) -> dict[str, float]:
    """Sell ``qty`` coins priced ``mid``; ``net`` is the USDT that lands in cash."""
    price = fill_price(mid, "sell")
    gross = qty * price
    fee = gross * FEE_RATE
    return {
        "mid": mid,
        "price": price,
        "qty": qty,
        "gross": gross,
        "fee": fee,
        "spread_cost": qty * (mid - price),
        "net": gross - fee,
    }


def clean_wallet(raw: dict[str, Any] | None) -> dict[str, Any]:
    """A wallet with only sane numbers and tracked coins; a fresh one if empty."""
    if not isinstance(raw, dict):
        return {"cash": START_USDT, "positions": {}}
    cash = _num(raw.get("cash"), START_USDT)
    positions: dict[str, dict[str, float]] = {}
    for base, pos in (raw.get("positions") or {}).items():
        base = str(base).upper()
        if base not in GRADE_UNIVERSE or not isinstance(pos, dict):
            continue
        qty = _num(pos.get("qty"), 0.0)
        if qty > 0:
            positions[base] = {"qty": qty, "cost": max(0.0, _num(pos.get("cost"), 0.0))}
    return {"cash": max(0.0, cash), "positions": positions}


def _num(value: Any, default: float) -> float:
    try:
        n = float(value)
    except (TypeError, ValueError):
        return default
    return n if math.isfinite(n) else default


def apply_buy(wallet: dict[str, Any], base: str, mid: float, usdt: float) -> tuple[dict[str, float], dict[str, Any]]:
    """Validate and apply a buy. Returns (fill, wallet_after)."""
    cash = wallet["cash"]
    if usdt < MIN_TRADE_USDT - EPS:
        raise TradeError("min_trade", f"The smallest trade is {MIN_TRADE_USDT:g} USDT.")
    if usdt > cash + EPS:
        raise TradeError("insufficient_cash", "Not enough practice cash for that.")
    usdt = min(usdt, cash)
    fill = quote_buy(mid, usdt)
    positions = {k: dict(v) for k, v in wallet["positions"].items()}
    pos = positions.setdefault(base, {"qty": 0.0, "cost": 0.0})
    pos["qty"] += fill["qty"]
    pos["cost"] += usdt
    after = {"cash": _tidy(cash - usdt), "positions": positions}
    return fill, after


def apply_sell(wallet: dict[str, Any], base: str, mid: float, fraction: float) -> tuple[dict[str, float], dict[str, Any]]:
    """Sell a share (0 < fraction <= 1) of what's held. No shorting: you can
    only sell coins you have. Selling everything is allowed below the minimum,
    so small leftovers never get stuck."""
    pos = wallet["positions"].get(base)
    if not pos or pos["qty"] <= 0:
        raise TradeError("no_position", f"You don't hold any {base} in practice.")
    if not 0 < fraction <= 1:
        raise TradeError("bad_amount", "Choose how much to sell.")
    sell_all = fraction >= 1 - EPS
    qty = pos["qty"] if sell_all else pos["qty"] * fraction
    fill = quote_sell(mid, qty)
    if not sell_all and fill["gross"] < MIN_TRADE_USDT - EPS:
        raise TradeError("min_trade", f"The smallest trade is {MIN_TRADE_USDT:g} USDT.")
    positions = {k: dict(v) for k, v in wallet["positions"].items()}
    if sell_all:
        positions.pop(base)
    else:
        positions[base] = {"qty": pos["qty"] - qty, "cost": pos["cost"] * (1 - fraction)}
    after = {"cash": _tidy(wallet["cash"] + fill["net"]), "positions": positions}
    return fill, after


def _tidy(x: float) -> float:
    return 0.0 if abs(x) < EPS else x


def value_wallet(
    wallet: dict[str, Any],
    prices: dict[str, float],
    start_usdt: float = START_USDT,
    btc_hold_qty: float | None = None,
) -> dict[str, Any]:
    """Mark the wallet at market prices; P&L is against the starting balance.
    ``btc_hold_qty`` is what the same start would have bought in BTC on day one."""
    rows = []
    coins_value = 0.0
    for base, pos in wallet["positions"].items():
        price = prices.get(base)
        value = pos["qty"] * price if price else None
        if value is not None:
            coins_value += value
        rows.append(
            {
                "base": base,
                "qty": pos["qty"],
                "cost": pos["cost"],
                "price": price,
                "value": value,
                "pnl": None if value is None else value - pos["cost"],
                "pnl_pct": None if value is None or pos["cost"] <= 0 else (value / pos["cost"] - 1) * 100,
            }
        )
    total = wallet["cash"] + coins_value
    for row in rows:
        row["share"] = None if row["value"] is None or total <= 0 else row["value"] / total
    rows.sort(key=lambda r: -(r["value"] or 0))
    btc = prices.get("BTC")
    hold = btc_hold_qty * btc if btc_hold_qty and btc else None
    return {
        "cash": wallet["cash"],
        "positions": rows,
        "value": total,
        "pnl": total - start_usdt,
        "pnl_pct": (total / start_usdt - 1) * 100 if start_usdt > 0 else None,
        "btc_hold_value": hold,
        "btc_hold_pnl_pct": None if hold is None else (hold / start_usdt - 1) * 100,
    }


def coach(
    side: str,
    base: str,
    coin: dict[str, Any],
    weather: str | None,
    wallet_after: dict[str, Any],
    prices: dict[str, float],
    recent_ts: list[float],
    now_ms: float,
) -> list[dict[str, Any]]:
    """Plain rules about the user's own behaviour on this trade. Each note is
    an id plus the numbers its sentence needs; none of them suggests a trade."""
    notes: list[dict[str, Any]] = []
    change_7d = coin.get("change_7d")
    change_24h = coin.get("change_24h")

    if side == "buy" and change_7d is not None and change_7d > FOMO_7D_PCT:
        notes.append({"id": "fomo", "base": base, "pct": round(change_7d, 1)})

    if side == "sell" and change_24h is not None and change_24h < PANIC_24H_PCT:
        notes.append({"id": "panic", "base": base, "pct": round(change_24h, 1)})

    if side == "buy":
        valued = value_wallet(wallet_after, prices)
        mine = next((p for p in valued["positions"] if p["base"] == base), None)
        if mine and mine["share"] is not None and mine["share"] > CONCENTRATION_SHARE:
            notes.append({"id": "concentration", "base": base, "pct": round(mine["share"] * 100)})

    if side == "buy" and coin.get("risk") == "high" and weather == "stormy":
        notes.append({"id": "storm", "base": base})

    today = 1 + sum(1 for ts in recent_ts if 0 <= now_ms - ts < DAY_MS)
    if today >= OVERTRADE_COUNT:
        notes.append({"id": "overtrading", "count": today})

    return notes


# ── live market data ────────────────────────────────────────────────────────

_lock = threading.Lock()
_tickers: tuple[float, dict[str, dict[str, float]]] | None = None
_closes: dict[str, tuple[float, list[float]]] = {}
_market: tuple[float, dict[str, Any]] | None = None
_tnd: tuple[float, float, bool] | None = None
TICKER_TTL = 10.0
CLOSES_TTL = 900.0
MARKET_TTL = 60.0
TND_TTL = 12 * 3600.0


def live_tickers() -> dict[str, dict[str, float]]:
    """Last price and 24h change for every tracked coin, in one Binance call."""
    global _tickers
    if _tickers and time.time() - _tickers[0] < TICKER_TTL:
        return _tickers[1]
    symbols = "[" + ",".join(f'"{b}USDT"' for b in GRADE_UNIVERSE) + "]"
    r = requests.get(f"{BINANCE_API}/api/v3/ticker/24hr", params={"symbols": symbols}, timeout=10)
    r.raise_for_status()
    out = {}
    for row in r.json():
        base = str(row.get("symbol", "")).removesuffix("USDT")
        price = _num(row.get("lastPrice"), 0.0)
        if base in GRADE_UNIVERSE and price > 0:
            out[base] = {"price": price, "change_24h": _num(row.get("priceChangePercent"), 0.0)}
    with _lock:
        _tickers = (time.time(), out)
    return out


def _coin_closes(base: str) -> list[float]:
    hit = _closes.get(base)
    if hit and time.time() - hit[0] < CLOSES_TTL:
        return hit[1]
    try:
        klines = get_binance_klines(f"{base}USDT", limit=GRADE_HISTORY)
        closes = [_num(row[4], 0.0) for row in klines if len(row) >= 5]
    except Exception:
        return hit[1] if hit else []
    with _lock:
        _closes[base] = (time.time(), closes)
    return closes


def tnd_rate() -> tuple[float, bool]:
    """TND per USD (USDT is treated as 1 USD). Returns (rate, live?)."""
    global _tnd
    if _tnd and time.time() - _tnd[0] < TND_TTL:
        return _tnd[1], _tnd[2]
    try:
        r = requests.get("https://open.er-api.com/v6/latest/USD", timeout=8)
        rate = _num(r.json().get("rates", {}).get("TND"), 0.0)
        if rate > 0:
            _tnd = (time.time(), rate, True)
            return rate, True
    except Exception:
        pass
    if _tnd:
        return _tnd[1], _tnd[2]
    return TND_FALLBACK, False


def market() -> dict[str, Any]:
    """Every tracked coin with its live price, recent moves, karat and risk,
    plus the market weather and the TND rate. Cached for a minute (prices are
    refreshed separately every 10 seconds)."""
    global _market
    if _market and time.time() - _market[0] < MARKET_TTL:
        cached = _market[1]
    else:
        with ThreadPoolExecutor(max_workers=8) as pool:
            closes_f = {b: pool.submit(_coin_closes, b) for b in GRADE_UNIVERSE}
            ref_f = pool.submit(get_grade_reference)
            weather_f = pool.submit(get_market_weather)
            tnd_f = pool.submit(tnd_rate)
            closes = {b: f.result() for b, f in closes_f.items()}
            try:
                ref = ref_f.result()
            except Exception:
                ref = None
            try:
                weather = weather_f.result().get("state", "unknown")
            except Exception:
                weather = "unknown"
            rate, rate_live = tnd_f.result()
        coins = []
        for base in GRADE_UNIVERSE:
            grade = grade_closes(closes[base], ref) if closes[base] else None
            coins.append(
                {
                    "base": base,
                    "name": BINANCE_BASE_NAMES.get(base, base),
                    "closes": closes[base],
                    "karat": (grade or {}).get("karat"),
                    "risk": (grade or {}).get("risk"),
                }
            )
        cached = {"coins": coins, "weather": weather, "tnd_rate": rate, "tnd_live": rate_live}
        with _lock:
            _market = (time.time(), cached)

    tickers = live_tickers()
    coins = []
    for c in cached["coins"]:
        t = tickers.get(c["base"])
        if not t:
            continue
        closes = c["closes"]
        coins.append(
            {
                "base": c["base"],
                "name": c["name"],
                "price": t["price"],
                "change_24h": t["change_24h"],
                "change_7d": percent_change(t["price"], closes[-8]) if len(closes) >= 8 else None,
                "karat": c["karat"],
                "risk": c["risk"],
            }
        )
    return {
        "coins": coins,
        "weather": cached["weather"],
        "tnd_rate": cached["tnd_rate"],
        "tnd_live": cached["tnd_live"],
        "rules": {
            "start_usdt": START_USDT,
            "fee_rate": FEE_RATE,
            "spread": SPREAD,
            "min_trade_usdt": MIN_TRADE_USDT,
        },
    }


# ── HTTP ────────────────────────────────────────────────────────────────────

router = APIRouter(prefix="/api/paper")


class StateRequest(BaseModel):
    wallet: dict[str, Any] | None = None
    start_usdt: float = START_USDT
    btc_hold_qty: float | None = None


class QuoteRequest(BaseModel):
    side: Literal["buy", "sell"]
    base: str
    usdt: float | None = None  # buys: USDT to spend, fee included
    fraction: float | None = None  # sells: share of the position, 0..1
    wallet: dict[str, Any] | None = None
    recent_ts: list[float] = Field(default_factory=list)  # earlier trades, ms since epoch


def _prices(m: dict[str, Any]) -> dict[str, float]:
    return {c["base"]: c["price"] for c in m["coins"]}


@router.post("/state")
async def paper_state(req: StateRequest) -> JSONResponse:
    """Market rows for the practice screen plus the wallet valued at live prices."""
    try:
        m = await asyncio.to_thread(market)
    except Exception as exc:
        return JSONResponse({"ok": False, "code": "price_unavailable", "error": str(exc)}, status_code=502)
    prices = _prices(m)
    wallet = clean_wallet(req.wallet)
    btc = prices.get("BTC")
    # what the starting balance buys in BTC right now: the app keeps the first
    # one it sees as the "if you had just held BTC" line
    benchmark = quote_buy(btc, req.start_usdt)["qty"] if btc else None
    return JSONResponse(
        {
            "ok": True,
            **m,
            "wallet": wallet,
            "valuation": value_wallet(wallet, prices, req.start_usdt, req.btc_hold_qty),
            "benchmark_btc_qty": benchmark,
        },
        headers={"Cache-Control": "no-store"},
    )


@router.post("/quote")
async def paper_quote(req: QuoteRequest) -> JSONResponse:
    """Price a practice trade at the live market price, apply it to the wallet
    sent in, and run the habit coach on it. Stateless: the app keeps the wallet."""
    base = req.base.strip().upper().removesuffix("USDT")
    if base not in GRADE_UNIVERSE:
        return _error("unknown_coin", f"{base} isn't in the practice list.")
    try:
        m = await asyncio.to_thread(market)
    except Exception as exc:
        return JSONResponse({"ok": False, "code": "price_unavailable", "error": str(exc)}, status_code=502)
    prices = _prices(m)
    coin = next((c for c in m["coins"] if c["base"] == base), None)
    if not coin:
        return JSONResponse({"ok": False, "code": "price_unavailable", "error": "No live price."}, status_code=502)
    wallet = clean_wallet(req.wallet)
    try:
        if req.side == "buy":
            fill, after = apply_buy(wallet, base, coin["price"], _num(req.usdt, 0.0))
        else:
            fill, after = apply_sell(wallet, base, coin["price"], _num(req.fraction, 0.0))
    except TradeError as exc:
        return _error(exc.code, str(exc))
    await asyncio.to_thread(stats.bump, "practice_trade")
    now_ms = time.time() * 1000
    notes = coach(req.side, base, coin, m["weather"], after, prices, req.recent_ts, now_ms)
    return JSONResponse(
        {
            "ok": True,
            "fill": {"side": req.side, "base": base, **fill},
            "wallet_after": after,
            "notes": notes,
            "ts": now_ms,
        },
        headers={"Cache-Control": "no-store"},
    )


def _error(code: str, message: str) -> JSONResponse:
    return JSONResponse({"ok": False, "code": code, "error": message}, status_code=400)
