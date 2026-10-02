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

from advisor_engine import get_fear_greed, get_market_regime, score_binance_symbols

from . import upstash

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
    return {
        "day": _today(),
        "taken_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "regime": regime.get("state"),
        "fear_greed": sentiment.get("score"),
        "rows": [
            {
                "symbol": a["symbol"],
                "rating": a["rating"],
                "score": a["score"],
                "price": a["current_price"],
            }
            for a in analyses
            if a.get("current_price")
        ],
        "errors": len(errors),
    }


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
    }
