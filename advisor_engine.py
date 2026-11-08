from __future__ import annotations

import math
import re
import statistics
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Any
from xml.etree import ElementTree

import os

import requests


COINGECKO_API = "https://api.coingecko.com/api/v3"
# api.binance.com returns HTTP 451 from US IPs (where Vercel functions run by
# default); data-api.binance.vision is Binance's public market-data mirror
# serving the same /api/v3 endpoints without the geo-block.
BINANCE_API = os.environ.get("BINANCE_API_BASE", "https://data-api.binance.vision")
FEAR_GREED_API = "https://api.alternative.me/fng/"
NEWS_FEEDS = (
    "https://www.coindesk.com/arc/outboundfeeds/rss/",
    "https://cointelegraph.com/rss",
    "https://decrypt.co/feed",
)


DEFAULT_ASSETS = ["bitcoin", "ethereum"]
DEFAULT_BINANCE_SYMBOLS = ["BTCUSDT", "ETHUSDT"]
BINANCE_QUOTE_ASSETS = ("USDT", "USDC", "FDUSD", "BTC", "ETH", "BNB", "EUR", "TRY")
COINGECKO_TO_BINANCE = {
    "bitcoin": "BTCUSDT",
    "ethereum": "ETHUSDT",
    "solana": "SOLUSDT",
    "chainlink": "LINKUSDT",
    "injective-protocol": "INJUSDT",
    "og-fan-token": "OGUSDT",
    "arbitrum": "ARBUSDT",
    "render-token": "RENDERUSDT",
}
BINANCE_BASE_NAMES = {
    "BTC": "Bitcoin",
    "ETH": "Ethereum",
    "SOL": "Solana",
    "LINK": "Chainlink",
    "INJ": "Injective",
    "OG": "OG Fan Token",
    "ARB": "Arbitrum",
    "RENDER": "Render",
}


class DataFetchError(RuntimeError):
    pass


@dataclass(frozen=True)
class Holding:
    coin_id: str
    amount: float
    average_buy_price: float | None = None


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _safe_float(value: Any, default: float = 0.0) -> float:
    try:
        if value is None:
            return default
        parsed = float(value)
        if math.isnan(parsed) or math.isinf(parsed):
            return default
        return parsed
    except (TypeError, ValueError):
        return default


def _get_json(url: str, params: dict[str, Any] | None = None, timeout: int = 15) -> Any:
    # CoinGecko's free tier rate-limits bursts (429); one brief fires several calls.
    for attempt in range(3):
        response = requests.get(url, params=params, timeout=timeout)
        if response.status_code == 429 or response.status_code >= 500:
            if attempt < 2:
                time.sleep(1.5 * (attempt + 1))
                continue
        if response.status_code >= 400:
            raise DataFetchError(f"{url} returned HTTP {response.status_code}")
        return response.json()
    raise DataFetchError(f"{url} returned HTTP {response.status_code}")


def normalize_asset_ids(raw_assets: str | list[str] | None) -> list[str]:
    if raw_assets is None:
        return DEFAULT_ASSETS.copy()
    if isinstance(raw_assets, str):
        assets = raw_assets.split(",")
    else:
        assets = raw_assets
    normalized = []
    for asset in assets:
        coin_id = str(asset).strip().lower()
        if coin_id and coin_id not in normalized:
            normalized.append(coin_id)
    return normalized or DEFAULT_ASSETS.copy()


def normalize_binance_symbols(raw_assets: str | list[str] | None, quote_asset: str = "USDT") -> list[str]:
    if raw_assets is None:
        return DEFAULT_BINANCE_SYMBOLS.copy()
    if isinstance(raw_assets, str):
        assets = raw_assets.split(",")
    else:
        assets = raw_assets

    symbols: list[str] = []
    for asset in assets:
        symbol = infer_binance_symbol(str(asset), quote_asset)
        if symbol and symbol not in symbols:
            symbols.append(symbol)
    return symbols or DEFAULT_BINANCE_SYMBOLS.copy()


def infer_binance_symbol(asset: str, quote_asset: str = "USDT") -> str:
    quote = quote_asset.strip().upper() or "USDT"
    raw = asset.strip()
    if not raw:
        return ""
    lower = raw.lower()
    if lower in COINGECKO_TO_BINANCE:
        return COINGECKO_TO_BINANCE[lower]
    compact = raw.replace("/", "").replace("-", "").replace("_", "").upper()
    if any(compact.endswith(quote_candidate) for quote_candidate in BINANCE_QUOTE_ASSETS):
        return compact
    return f"{compact}{quote}"


def split_binance_symbol(symbol: str, fallback_quote: str = "USDT") -> tuple[str, str]:
    upper = symbol.upper()
    for quote in BINANCE_QUOTE_ASSETS:
        if upper.endswith(quote) and len(upper) > len(quote):
            return upper[: -len(quote)], quote
    quote = fallback_quote.strip().upper() or "USDT"
    return upper.removesuffix(quote), quote


def parse_holdings(raw_holdings: Any) -> list[Holding]:
    holdings: list[Holding] = []
    if not isinstance(raw_holdings, list):
        return holdings
    for item in raw_holdings:
        if not isinstance(item, dict):
            continue
        coin_id = str(item.get("coin_id", "")).strip().lower()
        amount = _safe_float(item.get("amount"))
        avg_buy = item.get("average_buy_price")
        parsed_avg = _safe_float(avg_buy, default=0.0) if avg_buy not in ("", None) else None
        if coin_id and amount > 0:
            holdings.append(Holding(coin_id=coin_id, amount=amount, average_buy_price=parsed_avg or None))
    return holdings


def get_market_prices(asset_ids: list[str], vs_currency: str = "usd") -> list[dict[str, Any]]:
    ids = ",".join(asset_ids)
    params = {
        "vs_currency": vs_currency,
        "ids": ids,
        "order": "market_cap_desc",
        "per_page": max(1, len(asset_ids)),
        "page": 1,
        "sparkline": "true",
        "price_change_percentage": "1h,24h,7d,30d",
    }
    data = _get_json(f"{COINGECKO_API}/coins/markets", params=params)
    if not isinstance(data, list):
        raise DataFetchError("CoinGecko markets response was not a list")
    return data


def get_market_chart(coin_id: str, days: int = 45, vs_currency: str = "usd") -> dict[str, Any]:
    params = {"vs_currency": vs_currency, "days": days, "interval": "daily"}
    data = _get_json(f"{COINGECKO_API}/coins/{coin_id}/market_chart", params=params)
    prices = data.get("prices", [])
    volumes = data.get("total_volumes", [])
    if not prices:
        raise DataFetchError(f"No chart prices returned for {coin_id}")
    return {"prices": prices, "volumes": volumes}


def get_binance_24hr(symbol: str) -> dict[str, Any]:
    params = {"symbol": symbol.upper()}
    data = _get_json(f"{BINANCE_API}/api/v3/ticker/24hr", params=params, timeout=10)
    if not isinstance(data, dict):
        raise DataFetchError(f"Binance ticker response was invalid for {symbol}")
    return data


def get_binance_klines(symbol: str, interval: str = "1d", limit: int = 45) -> list[list[Any]]:
    params = {"symbol": symbol.upper(), "interval": interval, "limit": limit}
    data = _get_json(f"{BINANCE_API}/api/v3/klines", params=params, timeout=10)
    if not isinstance(data, list):
        raise DataFetchError(f"Binance kline response was invalid for {symbol}")
    return data


def binance_klines_to_chart(klines: list[list[Any]]) -> dict[str, Any]:
    prices = []
    volumes = []
    for row in klines:
        if len(row) < 8:
            continue
        timestamp = int(_safe_float(row[0]))
        close_price = _safe_float(row[4])
        quote_volume = _safe_float(row[7])
        prices.append([timestamp, close_price])
        volumes.append([timestamp, quote_volume])
    return {"prices": prices, "volumes": volumes}


def binance_klines_to_candles(klines: list[list[Any]], days: int = 30) -> list[list[float]]:
    """Daily candles for the coin chart: [open_time_ms, open, high, low, close]."""
    candles = []
    for row in klines[-days:]:
        if len(row) < 5:
            continue
        candles.append([int(_safe_float(row[0]))] + [_safe_float(row[i]) for i in (1, 2, 3, 4)])
    return candles


def binance_ticker_to_market(
    ticker: dict[str, Any],
    klines: list[list[Any]],
    quote_asset: str = "USDT",
) -> dict[str, Any]:
    symbol = str(ticker.get("symbol", "")).upper()
    base, quote = split_binance_symbol(symbol, quote_asset)
    closes = [_safe_float(row[4]) for row in klines if len(row) >= 5]
    current_price = _safe_float(ticker.get("lastPrice"))
    previous_7d = closes[-8] if len(closes) >= 8 else None
    previous_30d = closes[-31] if len(closes) >= 31 else None
    return {
        "id": symbol.lower(),
        "pair": symbol,
        "base_asset": base,
        "quote_asset": quote,
        "source": "Binance Spot",
        "symbol": base,
        "name": BINANCE_BASE_NAMES.get(base, base),
        "image": None,
        "current_price": current_price,
        "market_cap_rank": None,
        "market_cap": None,
        "total_volume": _safe_float(ticker.get("quoteVolume")),
        "sparkline_in_7d": {"price": closes[-7:]},
        "candles": binance_klines_to_candles(klines, days=30),
        "price_change_percentage_24h": _safe_float(ticker.get("priceChangePercent")),
        "price_change_percentage_7d_in_currency": percent_change(current_price, previous_7d) or 0.0,
        "price_change_percentage_30d_in_currency": percent_change(current_price, previous_30d) or 0.0,
        "ath": None,
    }


def get_fear_greed() -> dict[str, Any]:
    try:
        data = _get_json(FEAR_GREED_API, timeout=10)
        first = data.get("data", [{}])[0]
        score = int(first.get("value", 50))
        return {
            "score": score,
            "status": first.get("value_classification", "Neutral"),
            "updated_at": first.get("timestamp"),
        }
    except Exception:
        return {"score": 50, "status": "Neutral", "updated_at": None}


# Global stats barely move minute-to-minute, and a brief rebuild already spends
# most of the CoinGecko free-tier per-minute budget on markets/charts — so serve
# a 5-min memo instead of competing for the last request slot every rebuild.
_GLOBAL_MARKET_TTL = 300.0
_last_global_market: dict[str, Any] | None = None
_last_global_market_at = 0.0


def get_global_market() -> dict[str, Any]:
    global _last_global_market, _last_global_market_at
    if _last_global_market is not None and time.time() - _last_global_market_at < _GLOBAL_MARKET_TTL:
        return _last_global_market
    try:
        data = _get_json(f"{COINGECKO_API}/global", timeout=10).get("data", {})
        total_market_cap = data.get("total_market_cap", {}).get("usd")
        total_volume = data.get("total_volume", {}).get("usd")
        market_cap_change = data.get("market_cap_change_percentage_24h_usd")
        btc_dominance = data.get("market_cap_percentage", {}).get("btc")
        eth_dominance = data.get("market_cap_percentage", {}).get("eth")
        _last_global_market = {
            "total_market_cap_usd": total_market_cap,
            "total_volume_usd": total_volume,
            "market_cap_change_24h": market_cap_change,
            "btc_dominance": btc_dominance,
            "eth_dominance": eth_dominance,
        }
        _last_global_market_at = time.time()
        return _last_global_market
    except Exception:
        if _last_global_market is not None:
            return _last_global_market
        return {
            "total_market_cap_usd": None,
            "total_volume_usd": None,
            "market_cap_change_24h": None,
            "btc_dominance": None,
            "eth_dominance": None,
        }


# Market regime: is BTC above its 200-day average? The 2021-2026 backtest
# (scripts/backtest.py) showed STRONG setups only beat the market while BTC
# held that line — in risk-off tapes (2022, much of 2025) they lost money — so
# a risk-off regime caps every score just below the STRONG threshold.
REGIME_MA_DAYS = 200
_REGIME_TTL = 3600.0
_last_regime: dict[str, Any] | None = None
_last_regime_at = 0.0


def regime_from_closes(closes: list[float]) -> dict[str, Any]:
    """Classify the regime from daily BTC closes (oldest first, last = current)."""
    if len(closes) < REGIME_MA_DAYS:
        return {"state": "unknown", "label": "Unknown"}
    price = closes[-1]
    ma = sum(closes[-REGIME_MA_DAYS:]) / REGIME_MA_DAYS
    risk_on = price > ma
    return {
        "state": "risk_on" if risk_on else "risk_off",
        "label": "Risk-on" if risk_on else "Risk-off",
        "btc_price": price,
        "btc_ma200": ma,
        "distance_pct": percent_change(price, ma),
    }


_btc_closes: list[float] = []
_btc_closes_at = 0.0
BTC_HISTORY_DAYS = REGIME_MA_DAYS + 10


def get_btc_closes() -> list[float]:
    """Daily BTC closes (oldest first), cached for an hour; shared by the old
    regime and the market weather. Keeps the last good series on failure."""
    global _btc_closes, _btc_closes_at
    if _btc_closes and time.time() - _btc_closes_at < _REGIME_TTL:
        return _btc_closes
    try:
        klines = get_binance_klines("BTCUSDT", limit=BTC_HISTORY_DAYS)
        closes = [_safe_float(row[4]) for row in klines if len(row) >= 5]
    except Exception:
        try:
            chart = get_market_chart("bitcoin", days=BTC_HISTORY_DAYS)
            closes = [_safe_float(row[1]) for row in chart["prices"]]
        except Exception:
            closes = []
    if len(closes) >= REGIME_MA_DAYS:
        _btc_closes, _btc_closes_at = closes, time.time()
        return closes
    return _btc_closes or closes


def get_market_regime() -> dict[str, Any]:
    global _last_regime, _last_regime_at
    if _last_regime is not None and time.time() - _last_regime_at < _REGIME_TTL:
        return _last_regime
    regime = regime_from_closes(get_btc_closes())
    if regime["state"] == "unknown" and _last_regime is not None:
        return _last_regime  # last-known-good beats "unknown"
    if regime["state"] != "unknown":
        _last_regime = regime
        _last_regime_at = time.time()
    return regime


# ── Market weather (headline since 2026-11) ─────────────────────────────────
# The 2021-2026 study found BTC vs its 50-day average separates good and bad
# months far better than the 200-day line (median next 30 days +3.0% above it
# vs -2.1% below; the 200-day split was +0.8% vs -0.2%). So the weather leads
# with the 50-day line, uses the 200-day line to tell a dip from a downtrend,
# and turns "calm" into "choppy" when the crowd is overheated.
WEATHER_FAST_MA = 50
GREED_HOT = 80  # Fear & Greed at or above this = euphoric crowd
FUNDING_HOT = 0.0005  # 0.05% per 8h on perpetuals = longs paying up, crowded
BINANCE_FUTURES_API = os.environ.get("BINANCE_FUTURES_API_BASE", "https://fapi.binance.com")
FUNDING_SYMBOLS = ("BTCUSDT", "ETHUSDT", "SOLUSDT")
_FUNDING_TTL = 900.0
_funding: tuple[float, float | None] | None = None


def get_avg_funding() -> float | None:
    """Average last funding rate of the majors' perpetuals (a fraction per 8h),
    or None when the futures API can't be reached (it is geo-blocked in places)."""
    global _funding
    if _funding is not None and time.time() - _funding[0] < _FUNDING_TTL:
        return _funding[1]

    def one(symbol: str) -> float | None:
        try:
            data = _get_json(f"{BINANCE_FUTURES_API}/fapi/v1/premiumIndex", params={"symbol": symbol}, timeout=5)
            return float(data["lastFundingRate"])
        except Exception:
            return None

    with ThreadPoolExecutor(max_workers=len(FUNDING_SYMBOLS)) as pool:
        rates = [r for r in pool.map(one, FUNDING_SYMBOLS) if r is not None]
    value = sum(rates) / len(rates) if rates else None
    _funding = (time.time(), value)
    return value


def weather_from(closes: list[float], fear_greed: float | None = None,
                 funding: float | None = None) -> dict[str, Any]:
    """Calm / choppy / stormy from daily BTC closes (oldest first), plus the
    crowd's temperature. ``hot`` lists what turned a calm market choppy."""
    if len(closes) < WEATHER_FAST_MA:
        return {"state": "unknown"}
    price = closes[-1]
    ma50 = sum(closes[-WEATHER_FAST_MA:]) / WEATHER_FAST_MA
    ma200 = sum(closes[-REGIME_MA_DAYS:]) / REGIME_MA_DAYS if len(closes) >= REGIME_MA_DAYS else None
    above50 = price > ma50
    above200 = None if ma200 is None else price > ma200
    hot = []
    if fear_greed is not None and fear_greed >= GREED_HOT:
        hot.append("greed")
    if funding is not None and funding >= FUNDING_HOT:
        hot.append("funding")
    if above50:
        state = "choppy" if hot else "calm"
    elif above200 is False:
        state = "stormy"
    else:
        state = "choppy"
    return {
        "state": state,
        "btc_price": price,
        "btc_ma50": ma50,
        "btc_ma200": ma200,
        "vs_ma50_pct": percent_change(price, ma50),
        "vs_ma200_pct": percent_change(price, ma200) if ma200 else None,
        "above_ma50": above50,
        "above_ma200": above200,
        "btc_change_7d": percent_change(price, closes[-8]) if len(closes) >= 8 else None,
        "fear_greed": fear_greed,
        "funding_pct": None if funding is None else round(funding * 100, 4),
        "hot": hot,
    }


def get_market_weather(sentiment: dict[str, Any] | None = None) -> dict[str, Any]:
    fng = (sentiment or get_fear_greed()).get("score")
    return weather_from(get_btc_closes(), fng, get_avg_funding())


# ── Karat & Risk grades (headline since 2026-11) ────────────────────────────
# The same study found the old 0-100 setup score had no cross-sectional edge
# (rank IC ~0.00 at 7 days), while:
#   * calm coins with a 90-day uptrend (skipping the last week) did better than
#     the rest: rank IC +0.09 at 7 days, +0.11 on 2024-26 alone -> the Karat;
#   * a coin's 30-day volatility rank predicts its next 30-day volatility
#     (rank IC 0.63, right in every month) and drawdown depth -> the Risk grade.
# Both are ranks against one fixed reference set (the tracked coins), so every
# coin, tracked or not, is graded on the same scale. The old score is still
# computed and logged privately for comparison.
GRADE_UNIVERSE = (
    "BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "DOGE", "AVAX", "LINK",
    "DOT", "LTC", "INJ", "NEAR", "ATOM", "TRX", "UNI", "AAVE", "SUI",
)
VOL_DAYS = 30
MOM_DAYS = 90
MOM_SKIP = 7
GRADE_HISTORY = MOM_DAYS + 10  # daily candles fetched per coin
KARAT_BANDS = ((80.0, 24), (60.0, 22), (40.0, 18), (20.0, 14))
KARAT_FLOOR = 10
ROUGH_MONTH_Z = 1.65  # a 1-in-20 month under a normal model (crypto tails are fatter)
_GRADE_REF_TTL = 3600.0
_grade_ref: dict[str, Any] | None = None
_grade_ref_at = 0.0
_grade_ref_lock = threading.Lock()


def grade_inputs(closes: list[float]) -> dict[str, Any] | None:
    """30-day volatility (stdev of daily log returns) and 90-day momentum
    skipping the last week. Momentum is None for coins younger than ~3 months."""
    if len(closes) < VOL_DAYS + 1:
        return None
    window = closes[-(VOL_DAYS + 1):]
    if any(c <= 0 for c in window):
        return None
    rets = [math.log(b / a) for a, b in zip(window, window[1:])]
    mom = None
    if len(closes) >= MOM_DAYS + 1 and closes[-1 - MOM_DAYS] > 0:
        mom = closes[-1 - MOM_SKIP] / closes[-1 - MOM_DAYS] - 1
    return {"vol30": statistics.stdev(rets), "mom90": mom}


def _share_below(x: float, ref: list[float]) -> float:
    """x's rank among the reference values as a 0..1 share. For a coin in the
    reference set this equals its plain rank, matching the shadow log."""
    if len(ref) < 2:
        return 0.5
    return min(1.0, sum(1 for v in ref if v < x) / (len(ref) - 1))


def karat_for(trend_score: float) -> int:
    for floor, karat in KARAT_BANDS:
        if trend_score >= floor:
            return karat
    return KARAT_FLOOR


def grade_from_inputs(inputs: dict[str, Any], ref: dict[str, Any]) -> dict[str, Any]:
    vol, mom = inputs["vol30"], inputs["mom90"]
    calm = _share_below(-vol, [-v for v in ref["vol30"]])
    risk_rank = _share_below(vol, ref["vol30"])
    risk = "low" if risk_rank < 1 / 3 else "medium" if risk_rank < 2 / 3 else "high"
    out: dict[str, Any] = {
        "karat": None,
        "trend_score": None,
        "calm_pct": round(100 * calm),
        "momentum_pct": None,
        "mom90_pct": None,
        "risk": risk,
        "typical_day_pct": round(vol * 100, 2),
        "rough_month_pct": round((math.exp(-ROUGH_MONTH_Z * vol * math.sqrt(30)) - 1) * 100, 1),
    }
    if mom is not None:
        mom_rank = _share_below(mom, ref["mom90"])
        trend = 100 * (calm + mom_rank) / 2
        out.update(
            karat=karat_for(trend),
            trend_score=round(trend, 1),
            momentum_pct=round(100 * mom_rank),
            mom90_pct=round(mom * 100, 1),
        )
    return out


def get_grade_reference() -> dict[str, Any] | None:
    """The reference distribution (30-day volatility and 90-day momentum of the
    tracked coins), cached for an hour; the last good one on failure."""
    global _grade_ref, _grade_ref_at
    with _grade_ref_lock:
        if _grade_ref is not None and time.time() - _grade_ref_at < _GRADE_REF_TTL:
            return _grade_ref

        def one(base: str) -> dict[str, Any] | None:
            try:
                klines = get_binance_klines(f"{base}USDT", limit=GRADE_HISTORY)
                return grade_inputs([_safe_float(row[4]) for row in klines if len(row) >= 5])
            except Exception:
                return None

        with ThreadPoolExecutor(max_workers=len(GRADE_UNIVERSE)) as pool:
            rows = [r for r in pool.map(one, GRADE_UNIVERSE) if r]
        vols = [r["vol30"] for r in rows]
        moms = [r["mom90"] for r in rows if r["mom90"] is not None]
        if len(vols) >= 10 and len(moms) >= 10:
            _grade_ref = {"vol30": vols, "mom90": moms, "asof": _now_iso()}
            _grade_ref_at = time.time()
        return _grade_ref


def grade_sort_key(analysis: dict[str, Any]) -> tuple[float, float]:
    """Best karat first; coins without one (too young) after, by the old score."""
    trend = (analysis.get("grade") or {}).get("trend_score")
    return (trend if trend is not None else -1.0, float(analysis.get("score") or 0))


def grade_closes(closes: list[float], ref: dict[str, Any] | None) -> dict[str, Any] | None:
    inputs = grade_inputs(closes)
    if not inputs or not ref:
        return None
    return grade_from_inputs(inputs, ref)


def get_trending() -> list[dict[str, Any]]:
    try:
        data = _get_json(f"{COINGECKO_API}/search/trending", timeout=10)
        coins = []
        for row in data.get("coins", [])[:7]:
            item = row.get("item", {})
            coins.append(
                {
                    "id": item.get("id"),
                    "name": item.get("name"),
                    "symbol": item.get("symbol"),
                    "market_cap_rank": item.get("market_cap_rank"),
                    "thumb": item.get("thumb"),
                }
            )
        return coins
    except Exception:
        return []


def _news_terms(watchlist: list[dict[str, Any]] | None) -> list[tuple[str, list[str]]]:
    """Build (symbol, [search terms]) for each watchlist coin.

    The full name always counts; the ticker only when it is >=3 chars, so noisy
    two-letter symbols (e.g. "OG") don't match half the headlines by accident.
    """
    terms: list[tuple[str, list[str]]] = []
    for row in watchlist or []:
        symbol = str(row.get("symbol") or "").upper()
        name = str(row.get("name") or "").strip()
        words: list[str] = []
        if name:
            words.append(name.lower())
        if len(symbol) >= 3:
            words.append(symbol.lower())
        if words:
            terms.append((symbol or name, words))
    return terms


def _match_coins(title: str, terms: list[tuple[str, list[str]]]) -> list[str]:
    """Watchlist symbols whose name or ticker appears as a whole word in title."""
    low = title.lower()
    hits: list[str] = []
    for symbol, words in terms:
        if any(re.search(rf"\b{re.escape(word)}\b", low) for word in words):
            hits.append(symbol)
    return hits


def _dedupe_news(articles: list[dict[str, Any]], limit: int) -> list[dict[str, Any]]:
    """Top `limit` articles, dropping repeats of the same URL across feeds."""
    seen: set[str] = set()
    out: list[dict[str, Any]] = []
    for article in articles:
        url = article.get("url")
        if url in seen:
            continue
        seen.add(url)
        out.append(article)
        if len(out) >= limit:
            break
    return out


def get_news(limit: int = 8, watchlist: list[dict[str, Any]] | None = None) -> list[dict[str, Any]]:
    """Latest crypto headlines, most recent first.

    When a watchlist is supplied, narrow to articles that actually mention those
    coins (tagging each with the matched symbols). If nothing matches — common for
    a niche watchlist — fall back to general market news so the panel is never
    empty.
    """
    articles: list[dict[str, Any]] = []
    for feed_url in NEWS_FEEDS:
        try:
            response = requests.get(feed_url, timeout=10)
            response.raise_for_status()
            root = ElementTree.fromstring(response.content)
            channel = root.find("channel")
            if channel is None:
                continue
            source = channel.findtext("title") or "Crypto news"
            # Scan deeper than `limit`: narrowing to a watchlist prunes most of it.
            for item in channel.findall("item")[:25]:
                title = item.findtext("title")
                link = item.findtext("link")
                published = item.findtext("pubDate")
                published_dt = parse_news_date(published)
                if title and link:
                    articles.append(
                        {
                            "source": source,
                            "title": title.strip(),
                            "url": link.strip(),
                            "published_at": published,
                            "published_ts": published_dt.timestamp() if published_dt else 0,
                        }
                    )
        except Exception:
            continue
    articles.sort(key=lambda article: article.get("published_ts", 0), reverse=True)

    terms = _news_terms(watchlist)
    if terms:
        matched: list[dict[str, Any]] = []
        for article in articles:
            coins = _match_coins(article["title"], terms)
            if coins:
                matched.append({**article, "coins": coins})
        if matched:
            return _dedupe_news(matched, limit)

    return _dedupe_news(articles, limit)


def parse_news_date(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        parsed = parsedate_to_datetime(value)
        if parsed.tzinfo is None:
            return parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc)
    except (TypeError, ValueError, IndexError, OverflowError):
        return None


def moving_average(values: list[float], window: int) -> float | None:
    if len(values) < window:
        return None
    return sum(values[-window:]) / window


def percent_change(current: float, previous: float | None) -> float | None:
    if previous in (None, 0):
        return None
    return ((current - previous) / previous) * 100


STRONG_MIN = 67  # score >= this → STRONG setup
WEAK_MAX = 38  # score <= this → WEAK setup; NEUTRAL in between
RISK_OFF_CAP = STRONG_MIN - 1  # ceiling while BTC is below its 200-day average


def rating_for(score: float) -> str:
    if score >= STRONG_MIN:
        return "STRONG"
    if score <= WEAK_MAX:
        return "WEAK"
    return "NEUTRAL"


def analyze_asset(
    market: dict[str, Any],
    chart: dict[str, Any] | None,
    sentiment: dict[str, Any],
    holding: Holding | None = None,
    regime: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Score one asset. The score depends only on market data — never on the
    user's holdings — so every user sees the same rating for the same coin
    (impersonal analysis, not personalised advice)."""
    prices = [_safe_float(row[1]) for row in (chart or {}).get("prices", [])]
    volumes = [_safe_float(row[1]) for row in (chart or {}).get("volumes", [])]
    current_price = _safe_float(market.get("current_price"))
    if not current_price and prices:
        current_price = prices[-1] or current_price

    ma7 = moving_average(prices, 7)
    ma30 = moving_average(prices, 30)
    volume7 = moving_average(volumes, 7)
    previous_volume7 = sum(volumes[-14:-7]) / 7 if len(volumes) >= 14 else None

    change_24h = _safe_float(market.get("price_change_percentage_24h"))
    change_7d = _safe_float(market.get("price_change_percentage_7d_in_currency"))
    change_30d = _safe_float(market.get("price_change_percentage_30d_in_currency"))
    drawdown_from_high = percent_change(current_price, _safe_float(market.get("ath"))) or 0.0
    volume_change = percent_change(volume7 or 0, previous_volume7)
    sentiment_score = int(sentiment.get("score", 50))

    score = 50.0
    reasons: list[str] = []
    risks: list[str] = []
    breakdown: list[dict[str, Any]] = []

    def bump(delta: float, label: str, reason: str | None = None, risk: str | None = None) -> None:
        """Apply a scoring delta and record it in one place.

        Keeps ``score``, ``breakdown``, ``reasons`` and ``risks`` in lock-step so
        the emitted ``score_breakdown`` is always an exact account of the number —
        the same rubric the UI expands and the AI narrates.
        """
        nonlocal score
        score += delta
        breakdown.append({"label": label, "delta": delta})
        if reason:
            reasons.append(reason)
        if risk:
            risks.append(risk)

    if ma7 and current_price > ma7:
        bump(10, "Above 7-day average", reason="Price is above the 7-day average, showing short-term strength.")
    elif ma7:
        bump(-10, "Below 7-day average", reason="Price is below the 7-day average, so momentum is weak.")

    if ma30 and current_price > ma30:
        bump(10, "Above 30-day average", reason="Price is above the 30-day average, confirming broader trend support.")
    elif ma30:
        bump(-12, "Below 30-day average", reason="Price is below the 30-day average, which raises trend risk.")

    if change_7d > 8:
        bump(6, "Strong 7-day return", reason="The 7-day return is strong.")
    elif change_7d < -8:
        bump(-7, "Weak 7-day return", reason="The 7-day return is sharply negative.")

    if volume_change is not None and volume_change > 20:
        bump(5, "Rising volume", reason="Recent volume is rising, which can confirm the move.")
    elif volume_change is not None and volume_change < -20:
        bump(-3, "Fading volume", reason="Recent volume is fading, so conviction is lower.")

    if sentiment_score <= 25:
        bump(8, "Contrarian fear",
             reason="Market sentiment is fearful, which can create discounted entries.",
             risk="Fear can persist longer than expected during broad sell-offs.")
    elif sentiment_score >= 75:
        bump(-8, "Market greed",
             reason="Market sentiment is greedy, so chasing entries is riskier.",
             risk="Extreme greed can precede fast pullbacks.")

    if change_24h < -10:
        bump(-8, "Sharp 24h drop",
             risk="The asset dropped heavily in 24 hours, so volatility risk is elevated.")
    if change_30d > 40:
        bump(-4, "Extended 30-day move",
             risk="The 30-day move is extended, making a cooldown more likely.")
    if drawdown_from_high < -70:
        risks.append("The asset remains far below its all-time high, which may signal structural weakness.")

    # Top-end criteria: deliberately hard to earn so only a genuinely strong
    # setup can stack toward the 100 ceiling. The +3/+2 are gated on the
    # short-term uptrend (price above its 7-day MA) so a volume surge or a green
    # day on a *falling* asset reads as capitulation, not strength — not a bonus.
    if 10 < change_30d <= 40:
        bump(5, "Sustained 30-day uptrend",
             reason="The 30-day trend is steadily higher without being overextended.")
    if ma7 and ma30 and current_price > ma7 and current_price > ma30 and ma7 > ma30:
        bump(4, "Uptrend structure",
             reason="Price sits above a rising 7-over-30-day average stack — a clean uptrend structure.")
    if volume_change is not None and volume_change > 50 and ma7 and current_price > ma7:
        bump(3, "Volume conviction",
             reason="Volume is surging while price holds its short-term trend — strong conviction.")
    if ma7 and current_price > ma7 and 2 <= change_24h <= 10:
        bump(2, "Steady 24h follow-through",
             reason="Today's gain is steady rather than a spike — consistent with a durable trend.")

    score = max(0, min(100, score))
    cap = None
    if (regime or {}).get("state") == "risk_off" and score > RISK_OFF_CAP:
        score = RISK_OFF_CAP
        cap = {
            "value": RISK_OFF_CAP,
            "reason": "Risk-off market: BTC is below its 200-day average",
        }
    rating = rating_for(score)

    # Holdings only add factual context (value, P&L) — they never move the score.
    unrealized_pnl = None
    value = None
    position_note = None
    if holding:
        value = holding.amount * current_price
        if holding.average_buy_price:
            unrealized_pnl = percent_change(current_price, holding.average_buy_price)
            if unrealized_pnl is not None and unrealized_pnl > 35 and sentiment_score >= 65:
                position_note = "Position is up over 35% while market sentiment is greedy."
            elif unrealized_pnl is not None and unrealized_pnl < -20 and rating == "WEAK":
                position_note = "Position is down over 20% and the coin's setup is weak."

    risk_level = "High" if score <= 35 or change_24h < -10 else "Medium" if score < 65 else "Controlled"
    if not risks:
        risks = [
            "Crypto prices can move faster than the indicators update.",
            "News, regulation, and liquidity shocks can invalidate the signal.",
        ]

    return {
        "id": market.get("id"),
        "pair": market.get("pair"),
        "source": market.get("source", "CoinGecko"),
        "base_asset": market.get("base_asset"),
        "quote_asset": market.get("quote_asset"),
        "symbol": str(market.get("symbol", "")).upper(),
        "name": market.get("name"),
        "image": market.get("image"),
        "current_price": current_price,
        "market_cap_rank": market.get("market_cap_rank"),
        "market_cap": market.get("market_cap"),
        "total_volume": market.get("total_volume"),
        "sparkline": (market.get("sparkline_in_7d") or {}).get("price", []),
        "candles": market.get("candles") or [],
        "change_24h": change_24h,
        "change_7d": change_7d,
        "change_30d": change_30d,
        "ma7": ma7,
        "ma30": ma30,
        "volume_change_7d": volume_change,
        "score": round(score, 1),
        "score_breakdown": {
            "base": 50,
            "components": breakdown,
            "raw": round(50 + sum(c["delta"] for c in breakdown), 1),
            "final": round(score, 1),
            "cap": cap,
        },
        "rating": rating,
        "risk_level": risk_level,
        "reasons": reasons[:4],
        "risks": risks[:3],
        "holding": {
            "amount": holding.amount,
            "average_buy_price": holding.average_buy_price,
            "value": value,
            "unrealized_pnl": unrealized_pnl,
            "note": position_note,
        }
        if holding
        else None,
    }


def score_binance_symbols(
    symbols: list[str],
    sentiment: dict[str, Any],
    regime: dict[str, Any] | None,
    quote_asset: str = "USDT",
    holding_map: dict[str, Holding] | None = None,
) -> tuple[list[dict[str, Any]], list[dict[str, str]]]:
    """Score Binance pairs concurrently; returns (analyses in input order, per-symbol errors).

    Binance's public data API allows thousands of request-weight per minute, so
    a small thread pool is safe and turns ~2 sequential round-trips per symbol
    into roughly one batch.
    """
    holding_map = holding_map or {}
    analyses = []
    errors = []
    if not symbols:
        return analyses, errors

    def score(symbol: str, ticker: dict[str, Any], klines: list[list[Any]],
              reference: dict[str, Any] | None) -> dict[str, Any]:
        market = binance_ticker_to_market(ticker, klines, quote_asset)
        chart = binance_klines_to_chart(klines)
        analysis = analyze_asset(market, chart, sentiment, holding_map.get(symbol), regime)
        closes = [_safe_float(row[4]) for row in klines if len(row) >= 5]
        analysis["grade"] = grade_closes(closes, reference)
        return analysis

    # Both requests per coin go out at once, while the grade reference loads.
    with ThreadPoolExecutor(max_workers=min(16, 2 * len(symbols))) as pool:
        jobs = [
            (symbol, pool.submit(get_binance_24hr, symbol),
             pool.submit(get_binance_klines, symbol, limit=GRADE_HISTORY))
            for symbol in symbols
        ]
        try:
            reference = get_grade_reference()
        except Exception:
            reference = None
        for symbol, ticker_job, klines_job in jobs:
            try:
                analyses.append(score(symbol, ticker_job.result(), klines_job.result(), reference))
            except Exception as exc:
                row = {"symbol": symbol, "error": str(exc)}
                # Binance answers 400 "Invalid symbol" for pairs it doesn't list
                if "HTTP 400" in row["error"]:
                    row["code"] = "unknown_symbol"
                errors.append(row)
    return analyses, errors


def build_binance_market_brief(
    assets: list[str],
    holdings: list[Holding] | None = None,
    quote_asset: str = "USDT",
) -> dict[str, Any]:
    holdings = holdings or []
    holding_map = {infer_binance_symbol(holding.coin_id, quote_asset): holding for holding in holdings}
    holding_symbols = [infer_binance_symbol(holding.coin_id, quote_asset) for holding in holdings]
    symbols = normalize_binance_symbols(assets + holding_symbols, quote_asset)
    # The market-wide inputs don't depend on each other: fetch them at once
    # instead of one after another (a cold brief took ~5 s, mostly waiting).
    # The grade reference and funding calls only warm their caches, so the
    # scoring and weather below reuse the results instead of fetching again.
    # Headlines only need each coin's ticker and name, which are known up front.
    watch_names = []
    for symbol in symbols:
        base, _ = split_binance_symbol(symbol, quote_asset)
        watch_names.append({"symbol": base, "name": BINANCE_BASE_NAMES.get(base, base)})
    with ThreadPoolExecutor(max_workers=6) as pool:
        sentiment_job = pool.submit(get_fear_greed)
        regime_job = pool.submit(get_market_regime)
        global_job = pool.submit(get_global_market)
        news_job = pool.submit(get_news, watchlist=watch_names)
        pool.submit(get_grade_reference)
        pool.submit(get_avg_funding)
        sentiment = sentiment_job.result()
        regime = regime_job.result()
        analyses, errors = score_binance_symbols(symbols, sentiment, regime, quote_asset, holding_map)
        global_market = global_job.result()
        news = news_job.result()

    # A list made only of coins Binance doesn't list is a user typo, not an outage:
    # return an empty brief with the errors so the app can say which coin to fix.
    if not analyses and errors and any(row.get("code") != "unknown_symbol" for row in errors):
        raise DataFetchError("; ".join(f"{row['symbol']}: {row['error']}" for row in errors))

    opportunities = sorted(analyses, key=grade_sort_key, reverse=True)
    portfolio = [row for row in analyses if row.get("holding")]
    return {
        "generated_at": _now_iso(),
        "market_source": "binance",
        "exchange_label": "Binance Spot",
        "quote_asset": quote_asset.upper(),
        "sentiment": sentiment,
        "regime": regime,
        "weather": get_market_weather(sentiment),
        "global": global_market,
        # CoinGecko "trending searches" are mostly hyped micro-caps: a FOMO feed
        # that doesn't fit a calm app, and one less call on every brief.
        "trending": [],
        "assets": analyses,
        "opportunities": opportunities,
        "portfolio": portfolio,
        "news": news,
        "errors": errors,
        "disclaimer": (
            "Ratings use Binance Spot market data plus public sentiment/news. "
            "They are rule-based scores, identical for every user — not financial advice."
        ),
    }


def build_market_brief(
    asset_ids: list[str],
    holdings: list[Holding] | None = None,
    market_source: str = "coingecko",
    quote_asset: str = "USDT",
) -> dict[str, Any]:
    if market_source.lower() == "binance":
        return build_binance_market_brief(asset_ids, holdings, quote_asset)

    holdings = holdings or []
    holding_map = {holding.coin_id: holding for holding in holdings}
    combined_assets = normalize_asset_ids(asset_ids + [holding.coin_id for holding in holdings])
    sentiment = get_fear_greed()
    regime = get_market_regime()
    # Fetch before the per-asset chart loop drains the CoinGecko rate budget.
    global_market = get_global_market()
    markets = get_market_prices(combined_assets)
    analyses = []

    for market in markets:
        coin_id = market.get("id")
        chart = None
        try:
            chart = get_market_chart(coin_id)
            time.sleep(0.12)
        except Exception:
            chart = None
        analyses.append(analyze_asset(market, chart, sentiment, holding_map.get(coin_id), regime))

    opportunities = sorted(analyses, key=lambda row: row["score"], reverse=True)
    portfolio = [row for row in analyses if row.get("holding")]
    return {
        "generated_at": _now_iso(),
        "market_source": "coingecko",
        "exchange_label": "CoinGecko",
        "quote_asset": "USD",
        "sentiment": sentiment,
        "regime": regime,
        "global": global_market,
        # CoinGecko "trending searches" are mostly hyped micro-caps: a FOMO feed
        # that doesn't fit a calm app, and one less call on every brief.
        "trending": [],
        "assets": analyses,
        "opportunities": opportunities,
        "portfolio": portfolio,
        "news": get_news(watchlist=opportunities),
        "disclaimer": (
            "Ratings are rule-based scores, identical for every user — not financial advice. "
            "Do your own research and size your own risk."
        ),
    }
