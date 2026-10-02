"""Backtest the live scoring engine on daily history and write the summary the
Track Record panel shows.

It replays the engine's own code path — ``binance_ticker_to_market`` →
``analyze_asset`` with the historical Fear & Greed reading and the BTC
200-day regime — so the published numbers can't drift from the live rubric.

    python scripts/backtest.py            # writes server/data/backtest.json

Caveats (also embedded in the output): coins are today's survivors, the 7/30-day
windows overlap, and fees/slippage are ignored. It measures how each rating's
coins moved afterwards — not a tradable strategy.
"""

from __future__ import annotations

import calendar
import json
import statistics
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import requests  # noqa: E402

from advisor_engine import (  # noqa: E402
    BINANCE_API,
    REGIME_MA_DAYS,
    analyze_asset,
    binance_klines_to_chart,
    binance_ticker_to_market,
    regime_from_closes,
)

from server.track_record import TRACKED_BASES as SYMBOLS  # noqa: E402

START = (2021, 1, 1)
LOOKBACK = 45  # the live engine scores from 45 daily klines
HORIZONS = (7, 30)
OUT = ROOT / "server" / "data" / "backtest.json"
DAY_MS = 86_400_000


def fetch_klines(symbol: str, start_ms: int) -> list[list]:
    rows: list[list] = []
    while True:
        resp = requests.get(
            f"{BINANCE_API}/api/v3/klines",
            params={"symbol": symbol, "interval": "1d", "limit": 1000, "startTime": start_ms},
            timeout=30,
        )
        resp.raise_for_status()
        batch = resp.json()
        rows += batch
        if len(batch) < 1000:
            break
        start_ms = batch[-1][0] + DAY_MS
    return rows[:-1]  # drop today's unfinished candle


def fetch_fear_greed() -> dict[int, int]:
    resp = requests.get("https://api.alternative.me/fng/", params={"limit": 0}, timeout=30)
    resp.raise_for_status()
    return {int(d["timestamp"]) // 86400: int(d["value"]) for d in resp.json()["data"]}


def stats(returns: list[float]) -> dict:
    if not returns:
        return {"n": 0}
    return {
        "n": len(returns),
        "mean": round(statistics.mean(returns), 2),
        "median": round(statistics.median(returns), 2),
        "hit_rate": round(100 * sum(r > 0 for r in returns) / len(returns), 1),
    }


def main() -> None:
    start_ms = calendar.timegm((*START, 0, 0, 0)) * 1000
    fng = fetch_fear_greed()

    # BTC regime needs 200 days of history before the first scored day.
    btc = fetch_klines("BTCUSDT", start_ms - (REGIME_MA_DAYS + 5) * DAY_MS)
    btc_closes = [float(k[4]) for k in btc]
    btc_days = [k[0] // DAY_MS for k in btc]
    regime_by_day = {
        day: regime_from_closes(btc_closes[: i + 1]) for i, day in enumerate(btc_days)
    }

    rows = []  # (day, symbol, rating, capped, {horizon: forward return %})
    for base in SYMBOLS:
        symbol = f"{base}USDT"
        klines = fetch_klines(symbol, start_ms)
        closes = [float(k[4]) for k in klines]
        print(f"{symbol}: {len(klines)} days", file=sys.stderr)
        for i in range(LOOKBACK, len(klines) - max(HORIZONS)):
            day = klines[i][0] // DAY_MS
            if day not in fng:
                continue
            window = klines[i - LOOKBACK + 1 : i + 1]
            ticker = {
                "symbol": symbol,
                "lastPrice": closes[i],
                "priceChangePercent": (closes[i] / closes[i - 1] - 1) * 100,
                "quoteVolume": klines[i][7],
            }
            market = binance_ticker_to_market(ticker, window)
            result = analyze_asset(
                market,
                binance_klines_to_chart(window),
                {"score": fng[day]},
                regime=regime_by_day.get(day),
            )
            forward = {h: (closes[i + h] / closes[i] - 1) * 100 for h in HORIZONS}
            capped = bool(result["score_breakdown"]["cap"])
            rows.append((day, base, result["rating"], capped, forward))

    def group(filter_fn) -> dict:
        subset = [r for r in rows if filter_fn(r)]
        return {f"{h}d": stats([r[4][h] for r in subset]) for h in HORIZONS}

    years = sorted({datetime.fromtimestamp(r[0] * 86400, timezone.utc).year for r in rows})

    def year_of(r) -> int:
        return datetime.fromtimestamp(r[0] * 86400, timezone.utc).year

    summary = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "period": {
            "start": datetime.fromtimestamp(rows[0][0] * 86400, timezone.utc).date().isoformat(),
            "end": datetime.fromtimestamp(max(r[0] for r in rows) * 86400, timezone.utc).date().isoformat(),
        },
        "coins": SYMBOLS,
        "coin_days": len(rows),
        "ratings": {
            "ALL": group(lambda r: True),
            "STRONG": group(lambda r: r[2] == "STRONG"),
            "NEUTRAL": group(lambda r: r[2] == "NEUTRAL"),
            "WEAK": group(lambda r: r[2] == "WEAK"),
        },
        "risk_off_capped": group(lambda r: r[3]),
        "by_year": {
            str(y): {
                "ALL": group(lambda r, y=y: year_of(r) == y),
                "STRONG": group(lambda r, y=y: year_of(r) == y and r[2] == "STRONG"),
            }
            for y in years
        },
        "caveats": [
            "Hypothetical: the rules were applied to past data, not live calls.",
            "Coins are ones that still trade today (survivorship bias).",
            "7- and 30-day windows overlap, so results are not independent.",
            "Fees, slippage and taxes are ignored.",
        ],
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary["ratings"], indent=2))
    print(f"wrote {OUT}", file=sys.stderr)


if __name__ == "__main__":
    main()
