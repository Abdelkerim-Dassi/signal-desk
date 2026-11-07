"""Live track record: one immutable snapshot of the ratings per UTC day.

Every day the same fixed universe of coins is scored and the result — rating,
score, price — is written once and never edited. Forward returns are computed
later from the logged prices alone, so the record shows every call, losses
included, and can't be cherry-picked after the fact.

Storage: Upstash Redis when configured (serverless: the filesystem is
ephemeral), otherwise a local SQLite file (dev, or a persistent VPS).
Snapshots are written with set-if-absent, so concurrent writers can't
overwrite a day that's already logged.
"""

from __future__ import annotations

import json
import os
import sqlite3
import statistics
import threading
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from advisor_engine import get_fear_greed, get_market_regime, get_market_weather, score_binance_symbols

from . import shadow, upstash

# Same universe as scripts/backtest.py, so live results compare like-for-like.
TRACKED_BASES = [
    "BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "DOGE", "AVAX", "LINK",
    "DOT", "LTC", "INJ", "NEAR", "ATOM", "TRX", "UNI", "AAVE", "SUI",
]
HORIZONS = (7, 30)
RATINGS = ("STRONG", "NEUTRAL", "WEAK")

_DB_PATH = Path(
    os.getenv("TRACK_DB_PATH")
    or Path(__file__).resolve().parent.parent / "data" / "track_record.sqlite3"
)
_db_lock = threading.Lock()


def _today() -> str:
    return datetime.now(timezone.utc).date().isoformat()


# ── storage ──────────────────────────────────────────────────────────────────


def _sqlite() -> sqlite3.Connection:
    _DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(_DB_PATH)
    conn.execute("CREATE TABLE IF NOT EXISTS snapshots (day TEXT PRIMARY KEY, doc TEXT NOT NULL)")
    return conn


def _has_day(day: str) -> bool:
    if upstash.enabled():
        result = upstash.pipeline([["EXISTS", f"track:day:{day}"]])
        return bool(result and result[0])
    with _db_lock, _sqlite() as conn:
        return conn.execute("SELECT 1 FROM snapshots WHERE day = ?", (day,)).fetchone() is not None


def _put_day(day: str, doc: dict[str, Any]) -> bool:
    """Write a snapshot only if the day is absent. True when this call wrote it."""
    payload = json.dumps(doc, separators=(",", ":"))
    if upstash.enabled():
        result = upstash.pipeline(
            [["SET", f"track:day:{day}", payload, "NX"], ["SADD", "track:days", day]]
        )
        return bool(result and result[0] == "OK")
    with _db_lock, _sqlite() as conn:
        cur = conn.execute("INSERT OR IGNORE INTO snapshots (day, doc) VALUES (?, ?)", (day, payload))
        return cur.rowcount == 1


def _load_days() -> list[dict[str, Any]]:
    if upstash.enabled():
        members = upstash.pipeline([["SMEMBERS", "track:days"]])
        days = sorted(members[0]) if members and members[0] else []
        if not days:
            return []
        values = upstash.pipeline([["MGET", *[f"track:day:{d}" for d in days]]])
        raw = values[0] if values else []
        return [json.loads(v) for v in raw or [] if v]
    with _db_lock, _sqlite() as conn:
        rows = conn.execute("SELECT doc FROM snapshots ORDER BY day").fetchall()
    return [json.loads(r[0]) for r in rows]


# ── logging ──────────────────────────────────────────────────────────────────


def take_snapshot() -> dict[str, Any]:
    sentiment = get_fear_greed()
    regime = get_market_regime()
    analyses, errors = score_binance_symbols(
        [f"{b}USDT" for b in TRACKED_BASES], sentiment, regime
    )
    # Candidate scores ride along silently; a failure there must never cost
    # the day's snapshot.
    try:
        shadow_doc = shadow.compute(TRACKED_BASES)
    except Exception as exc:
        shadow_doc = {"coins": {}, "mood": {"state": "unknown"}, "error": str(exc)}
    coins = shadow_doc["coins"]
    return {
        "day": _today(),
        "taken_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "regime": regime.get("state"),
        "mood50": shadow_doc["mood"].get("state"),
        "weather": _weather_state(sentiment),
        "fear_greed": sentiment.get("score"),
        "rows": [
            {
                "symbol": a["symbol"],
                "rating": a["rating"],
                "score": a["score"],
                "price": a["current_price"],
                **{k: coins[a["symbol"]][k] for k in ("stability", "trend") if a["symbol"] in coins},
                **{k: (a.get("grade") or {}).get(k) for k in ("karat", "risk") if a.get("grade")},
            }
            for a in analyses
            if a.get("current_price")
        ],
        "errors": len(errors),
    }


def _weather_state(sentiment: dict[str, Any]) -> str | None:
    try:
        return get_market_weather(sentiment).get("state")
    except Exception:
        return None


def ensure_today() -> dict[str, Any]:
    """Log today's snapshot if it isn't logged yet; report what happened."""
    day = _today()
    if _has_day(day):
        return {"day": day, "logged": False, "reason": "exists"}
    doc = take_snapshot()
    if not doc["rows"]:
        return {"day": day, "logged": False, "reason": "no_rows", "errors": doc["errors"]}
    if not _put_day(day, doc):
        return {"day": day, "logged": False, "reason": "write_failed", "store": _store_name()}
    return {"day": day, "logged": True, "rows": len(doc["rows"]), "store": _store_name()}


def _store_name() -> str:
    return "redis" if upstash.enabled() else "sqlite"


# ── summary ──────────────────────────────────────────────────────────────────


def _stats(returns: list[float]) -> dict[str, Any]:
    if not returns:
        return {"n": 0}
    return {
        "n": len(returns),
        "mean": round(statistics.mean(returns), 2),
        "median": round(statistics.median(returns), 2),
        "hit_rate": round(100 * sum(r > 0 for r in returns) / len(returns), 1),
    }


def summary() -> dict[str, Any]:
    docs = _load_days()
    by_day = {d["day"]: d for d in docs}
    today = datetime.now(timezone.utc).date()

    horizons: dict[str, Any] = {}
    latest_resolved: dict[str, Any] | None = None
    for h in HORIZONS:
        buckets: dict[str, list[float]] = {r: [] for r in ("ALL", *RATINGS)}
        pending = 0
        for doc in docs:
            later = by_day.get((date.fromisoformat(doc["day"]) + timedelta(days=h)).isoformat())
            if later is None:
                pending += len(doc["rows"])
                continue
            later_prices = {r["symbol"]: r["price"] for r in later["rows"]}
            resolved_rows = []
            for row in doc["rows"]:
                end = later_prices.get(row["symbol"])
                if not end or not row["price"]:
                    continue
                ret = (end / row["price"] - 1) * 100
                buckets["ALL"].append(ret)
                buckets[row["rating"]].append(ret)
                resolved_rows.append({**row, "return": round(ret, 2)})
            if h == HORIZONS[0] and resolved_rows:
                latest_resolved = {"day": doc["day"], "horizon": h, "rows": resolved_rows}
        horizons[f"{h}d"] = {
            "ratings": {k: _stats(v) for k, v in buckets.items()},
            "pending_calls": pending,
        }

    first = docs[0]["day"] if docs else None
    return {
        "started_on": first,
        "days_logged": len(docs),
        "first_results_on": (
            (date.fromisoformat(first) + timedelta(days=HORIZONS[0])).isoformat() if first else None
        ),
        "universe": TRACKED_BASES,
        "horizons": horizons,
        "today": by_day.get(today.isoformat()),
        "latest_resolved": latest_resolved,
        "scorecard": scorecard(docs),
    }


# ── scorecard: is any score actually better than the coin average? ──────────
#
# A coin-picking score is only useful if its high scores beat the *other
# tracked coins*, so everything here is measured on excess returns (a coin's
# return minus the average of all tracked coins that day), which removes the
# market's own up or down move. Rank IC is the Spearman correlation between a
# score and those excess returns: 0 is noise, ~0.05+ held up is useful.

MIN_PERIODS = 12  # independent windows before any verdict
SIGNALS = ("score", "trend")  # live score vs the shadow candidate


def _ranks(values: list[float]) -> list[float]:
    order = sorted(range(len(values)), key=lambda i: values[i])
    ranks = [0.0] * len(values)
    i = 0
    while i < len(order):
        j = i
        while j + 1 < len(order) and values[order[j + 1]] == values[order[i]]:
            j += 1
        for k in range(i, j + 1):
            ranks[order[k]] = (i + j) / 2
        i = j + 1
    return ranks


def rank_ic(xs: list[float], ys: list[float]) -> float | None:
    if len(xs) < 5:
        return None
    rx, ry = _ranks(xs), _ranks(ys)
    try:
        return statistics.correlation(rx, ry)
    except statistics.StatisticsError:  # a constant column
        return None


def _third_spread(pairs: list[tuple[float, float]]) -> float | None:
    """Mean excess return of the top third by score minus the bottom third."""
    if len(pairs) < 6:
        return None
    ordered = sorted(pairs, key=lambda p: p[0])
    k = len(ordered) // 3
    return statistics.mean(y for _, y in ordered[-k:]) - statistics.mean(y for _, y in ordered[:k])


def _path_vol(by_day: dict[str, dict[str, Any]], start: date, h: int, symbol: str) -> float | None:
    """Std of daily returns over the window, from the logged daily prices."""
    prices = []
    for i in range(h + 1):
        doc = by_day.get((start + timedelta(days=i)).isoformat())
        price = next((r["price"] for r in doc["rows"] if r["symbol"] == symbol), None) if doc else None
        if not price:
            return None
        prices.append(price)
    rets = [b / a - 1 for a, b in zip(prices, prices[1:])]
    return statistics.stdev(rets) if len(rets) > 1 else None


def evaluate_day(doc: dict[str, Any], later: dict[str, Any], by_day: dict[str, dict[str, Any]],
                 h: int) -> dict[str, Any] | None:
    """How one logged day's scores did `h` days later."""
    end = {r["symbol"]: r["price"] for r in later["rows"]}
    rows = [r for r in doc["rows"] if r.get("price") and end.get(r["symbol"])]
    if len(rows) < 6:
        return None
    rets = {r["symbol"]: (end[r["symbol"]] / r["price"] - 1) * 100 for r in rows}
    avg = statistics.mean(rets.values())
    excess = {s: v - avg for s, v in rets.items()}
    out: dict[str, Any] = {"day": doc["day"], "market": round(avg, 2),
                           "regime": doc.get("regime"), "mood50": doc.get("mood50")}
    for sig in SIGNALS:
        pairs = [(r[sig], excess[r["symbol"]]) for r in rows if r.get(sig) is not None]
        if len(pairs) < 6:
            continue
        ic = rank_ic([p[0] for p in pairs], [p[1] for p in pairs])
        spread = _third_spread(pairs)
        out[sig] = {"ic": None if ic is None else round(ic, 3),
                    "spread": None if spread is None else round(spread, 2)}
    strong = [excess[r["symbol"]] for r in rows if r["rating"] == "STRONG"]
    if strong:
        out["strong_excess"] = round(statistics.mean(strong), 2)
    # Stability: did the calmest-rated coins really move less? Uses the daily
    # logged path when complete, else the size of the move.
    start = date.fromisoformat(doc["day"])
    stab = []
    for r in rows:
        if r.get("stability") is None:
            continue
        bump = _path_vol(by_day, start, h, r["symbol"])
        stab.append((r["stability"], -(bump if bump is not None else abs(rets[r["symbol"]]) / 100)))
    if len(stab) >= 6:
        ic = rank_ic([p[0] for p in stab], [p[1] for p in stab])
        out["stability_ic"] = None if ic is None else round(ic, 3)
    return out


def _agg(values: list[float]) -> dict[str, Any]:
    if not values:
        return {"n": 0}
    return {"n": len(values), "mean": round(statistics.mean(values), 3),
            "positive_pct": round(100 * sum(v > 0 for v in values) / len(values), 1)}


def scorecard(docs: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    """Live score vs the shadow candidates, per horizon, with a verdict that
    stays "too early" until there are MIN_PERIODS independent windows."""
    docs = _load_days() if docs is None else docs
    by_day = {d["day"]: d for d in docs}
    out: dict[str, Any] = {}
    for h in HORIZONS:
        days = []
        for doc in docs:
            later = by_day.get((date.fromisoformat(doc["day"]) + timedelta(days=h)).isoformat())
            if later and (ev := evaluate_day(doc, later, by_day, h)):
                days.append(ev)
        periods = len(days) // h  # daily windows overlap; this many don't
        block: dict[str, Any] = {"days": len(days), "independent_periods": periods}
        for sig in SIGNALS:
            got = [d[sig] for d in days if sig in d]
            block[sig] = {
                "ic": _agg([g["ic"] for g in got if g["ic"] is not None]),
                "top_minus_bottom": _agg([g["spread"] for g in got if g["spread"] is not None]),
            }
        block["strong_vs_market"] = _agg([d["strong_excess"] for d in days if "strong_excess" in d])
        block["stability_ic"] = _agg([d["stability_ic"] for d in days if d.get("stability_ic") is not None])
        for key, states in (("mood50", ("calm", "cautious")), ("regime", ("risk_on", "risk_off"))):
            block[f"market_by_{key}"] = {s: _agg([d["market"] for d in days if d.get(key) == s]) for s in states}
        trend_n = block["trend"]["ic"]["n"]
        block["verdict"] = (
            "too_early" if trend_n // h < MIN_PERIODS
            else "trend_wins" if (block["trend"]["ic"]["mean"] or 0) > max(0.03, block["score"]["ic"].get("mean") or 0)
            else "no_switch"
        )
        block["latest"] = days[-1] if days else None
        out[f"{h}d"] = block
    return out
