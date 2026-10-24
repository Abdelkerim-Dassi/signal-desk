"""Shadow scores: candidate replacements for the live score, logged silently.

A 2021-2026 factor study on the tracked coins (returns relative to the
tracked-coin average, non-overlapping windows) found:

  * the live score has no cross-sectional edge (rank IC ~0.00 at 7 days);
  * a coin's past 30-day volatility rank predicts its next 30-day volatility
    (rank IC 0.63, right in every month) and drawdown depth (0.54);
  * calm coins with a 90-day uptrend (skipping the last week) did better than
    the rest: rank IC +0.09 at 7 days, +0.11 on 2024-2026 alone;
  * BTC vs its 50-day average separates good and bad months far better than
    the 200-day line the live regime uses.

These scores are written next to the live rating in each daily snapshot and
are NOT shown to users. They replace the live score only if the live record
backs them (see ``track_record.scorecard``).
"""

from __future__ import annotations

import math
import statistics
from concurrent.futures import ThreadPoolExecutor
from typing import Any

from advisor_engine import get_binance_klines

VOL_DAYS = 30
MOM_DAYS = 90
MOM_SKIP = 7
MOOD_MA_DAYS = 50
HISTORY = MOM_DAYS + 2


def _pct_ranks(values: dict[str, float]) -> dict[str, float]:
    """Percentile rank in [0, 1] (ties share the average rank)."""
    ordered = sorted(values.items(), key=lambda kv: kv[1])
    n = len(ordered)
    ranks: dict[str, float] = {}
    i = 0
    while i < n:
        j = i
        while j + 1 < n and ordered[j + 1][1] == ordered[i][1]:
            j += 1
        avg = (i + j) / 2
        for k in range(i, j + 1):
            ranks[ordered[k][0]] = avg / (n - 1) if n > 1 else 0.5
        i = j + 1
    return ranks


def coin_inputs(closes: list[float]) -> dict[str, float] | None:
    """30-day volatility and 90-day momentum excluding the last week."""
    if len(closes) < MOM_DAYS + 1 or any(c <= 0 for c in closes[-(MOM_DAYS + 1):]):
        return None
    window = closes[-(VOL_DAYS + 1):]
    rets = [math.log(b / a) for a, b in zip(window, window[1:])]
    return {
        "vol30": statistics.stdev(rets),
        "mom90": closes[-1 - MOM_SKIP] / closes[-1 - MOM_DAYS] - 1,
    }


def scores_from_closes(closes_by_symbol: dict[str, list[float]]) -> dict[str, dict[str, float]]:
    """Per symbol: ``stability`` (0-100, 100 = calmest of the tracked coins) and
    ``trend`` (0-100, the calm + 90-day-trend composite). Both are ranks within
    the tracked coins, so they only say how a coin compares with the others."""
    inputs = {s: x for s, c in closes_by_symbol.items() if (x := coin_inputs(c))}
    if len(inputs) < 3:
        return {}
    calm = _pct_ranks({s: -x["vol30"] for s, x in inputs.items()})
    mom = _pct_ranks({s: x["mom90"] for s, x in inputs.items()})
    return {
        s: {
            "stability": round(100 * calm[s], 1),
            "trend": round(100 * (calm[s] + mom[s]) / 2, 1),
            "vol30": round(100 * inputs[s]["vol30"], 2),
            "mom90": round(100 * inputs[s]["mom90"], 2),
        }
        for s in inputs
    }


def mood_from_closes(btc_closes: list[float]) -> dict[str, Any]:
    """Market mood from BTC vs its 50-day average."""
    if len(btc_closes) < MOOD_MA_DAYS:
        return {"state": "unknown"}
    price = btc_closes[-1]
    ma = sum(btc_closes[-MOOD_MA_DAYS:]) / MOOD_MA_DAYS
    return {
        "state": "calm" if price > ma else "cautious",
        "btc_ma50": round(ma, 2),
        "distance_pct": round((price / ma - 1) * 100, 2),
    }


def compute(bases: list[str]) -> dict[str, Any]:
    """Fetch daily closes for the tracked coins and compute the shadow scores."""
    def closes(base: str) -> list[float]:
        return [float(k[4]) for k in get_binance_klines(f"{base}USDT", limit=HISTORY)]

    with ThreadPoolExecutor(max_workers=min(8, len(bases))) as pool:
        fetched = dict(zip(bases, pool.map(lambda b: _safe(closes, b), bases)))
    series = {b: c for b, c in fetched.items() if c}
    return {
        "coins": scores_from_closes(series),
        "mood": mood_from_closes(series.get("BTC", [])),
    }


def _safe(fn, arg):
    try:
        return fn(arg)
    except Exception:
        return None
