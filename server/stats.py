"""Private usage counters: daily totals only, nothing about any one visitor.

The 90-day scorecard needs numbers the page-view counter can't give: visits
by platform, scam checks run, lessons passed, practice trades, bot starts and
where they came from. Each event is one field in a Redis hash per day
(``stats:2026-11-10`` → ``{"visit:t": 12, "scamcheck:high": 3, ...}``). No IP,
no device id, no text is stored.

Reading is private: ``GET /api/stats`` needs the jobs secret, and the bot's
``/stats`` command answers only the owner.
"""

from __future__ import annotations

import re
import threading
from datetime import date, datetime, timedelta, timezone
from typing import Any

from . import upstash

KEEP_DAYS = 400  # long enough to compare this Ramadan with the next

# Short paths typed from a video or tapped in a bio: qirat.tn/t, /i, /f, /w.
SOURCES = {"t": "TikTok", "i": "Instagram", "f": "Facebook", "w": "WhatsApp", "direct": "Direct"}
VIEWS = {"today", "learn", "practice", "scamcheck", "ask", "portfolio", "record"}
PLACES = {"scam", "quiz", "practice", "footer"}

# What the browser may report, and the values each event accepts.
CLIENT_EVENTS: dict[str, set[str] | None] = {
    "visit": set(SOURCES),
    "view": VIEWS,
    "lesson_open": None,
    "lesson_pass": None,
    "bot_click": PLACES,
    "share": PLACES,
}

_memory: dict[str, dict[str, int]] = {}
_lock = threading.Lock()


def _today() -> str:
    return datetime.now(timezone.utc).date().isoformat()


def bump(field: str, day: str | None = None) -> None:
    """Add one to a counter. Never raises: counting must not break a request."""
    key = f"stats:{day or _today()}"
    try:
        if upstash.enabled():
            upstash.pipeline([["HINCRBY", key, field, "1"], ["EXPIRE", key, str(KEEP_DAYS * 86400)]])
            return
        with _lock:
            bucket = _memory.setdefault(key, {})
            bucket[field] = bucket.get(field, 0) + 1
    except Exception:
        pass


def client_field(event: str, value: str | None) -> str | None:
    """The counter name for an event reported by the browser, or None if it is
    not one we accept. A fixed list keeps strangers from inventing counters."""
    if event not in CLIENT_EVENTS:
        return None
    allowed = CLIENT_EVENTS[event]
    if allowed is None:
        return event
    return f"{event}:{value}" if value in allowed else None


_START = re.compile(r"^(t|i|f|w|web)-(scam|quiz|practice|footer)$")


def bot_start_field(payload: str | None) -> str:
    """Counter for a bot /start. The site's buttons send ``<source>-<place>``
    (for example ``t-scam``); anything else is "direct" (typed, or an old link)."""
    p = (payload or "").strip().lower()
    if not p:
        return "bot_start:direct"
    return f"bot_start:{p}" if _START.match(p) else "bot_start:other"


def _as_counts(raw: Any) -> dict[str, int]:
    """Upstash returns a hash as a flat [field, value, field, value] list."""
    if isinstance(raw, dict):
        items = list(raw.items())
    elif isinstance(raw, list):
        items = list(zip(raw[::2], raw[1::2]))
    else:
        return {}
    out: dict[str, int] = {}
    for k, v in items:
        try:
            out[str(k)] = int(v)
        except (TypeError, ValueError):
            continue
    return out


def read(days: int = 30, today: date | None = None) -> dict[str, Any]:
    """Counters for the last ``days`` days (oldest first) and their totals."""
    days = max(1, min(int(days), KEEP_DAYS))
    end = today or datetime.now(timezone.utc).date()
    labels = [(end - timedelta(days=n)).isoformat() for n in range(days - 1, -1, -1)]
    if upstash.enabled():
        res = upstash.pipeline([["HGETALL", f"stats:{d}"] for d in labels])
        if res is None:
            return {"ok": False, "error": "stats store unavailable"}
        per_day = {d: _as_counts(r) for d, r in zip(labels, res)}
    else:
        with _lock:
            per_day = {d: dict(_memory.get(f"stats:{d}", {})) for d in labels}
    totals: dict[str, int] = {}
    for counts in per_day.values():
        for k, v in counts.items():
            totals[k] = totals.get(k, 0) + v
    return {
        "ok": True,
        "from": labels[0],
        "to": labels[-1],
        "totals": dict(sorted(totals.items())),
        "days": {d: c for d, c in per_day.items() if c},
    }


def _sum(totals: dict[str, int], prefix: str) -> int:
    return sum(v for k, v in totals.items() if k == prefix or k.startswith(prefix + ":"))


def _by(totals: dict[str, int], prefix: str, names: dict[str, str] | None = None) -> str:
    parts = [
        f"{(names or {}).get(k.split(':', 1)[1], k.split(':', 1)[1])} {v}"
        for k, v in sorted(totals.items(), key=lambda kv: -kv[1])
        if k.startswith(prefix + ":")
    ]
    return ", ".join(parts) if parts else "none"


def owner_report(days: int = 7) -> str:
    """The weekly note for the owner's Telegram chat (plain text, English)."""
    data = read(days)
    if not data.get("ok"):
        return "Stats are unavailable right now."
    t = data["totals"]
    lines = [
        f"Qirat, last {days} days ({data['from']} → {data['to']})",
        "",
        f"Visits: {_sum(t, 'visit')}  ({_by(t, 'visit', SOURCES)})",
        f"Scam checks on the site: {_sum(t, 'scamcheck')}  ({_by(t, 'scamcheck')})",
        f"Scam checks in the bot: {_sum(t, 'scamcheck_bot')}",
        f"Results shared: {_sum(t, 'share')}",
        f"Lessons opened: {t.get('lesson_open', 0)} · passed: {t.get('lesson_pass', 0)}",
        f"Practice trades: {t.get('practice_trade', 0)}",
        f"Questions asked: {t.get('ask', 0)}",
        f"Bot button taps: {_sum(t, 'bot_click')}  ({_by(t, 'bot_click')})",
        f"Bot starts: {_sum(t, 'bot_start')}  ({_by(t, 'bot_start')})",
        f"New bot chats: {t.get('bot_new_chat', 0)}",
        f"Screens opened: {_by(t, 'view')}",
    ]
    return "\n".join(lines)
