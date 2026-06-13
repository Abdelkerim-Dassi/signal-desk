"""Rate limiting for the paid AI endpoints — the API key is the asset defended.

Two layers, both enforced by ``check_ai_allowance``:
  * a per-IP sliding/fixed window (stops one client hammering the endpoints)
  * a global daily cap (``AI_DAILY_LIMIT``, default 100 calls/day) — the hard
    ceiling on spend no matter how many IPs are involved.

When Upstash Redis is configured (see ``server/upstash.py``) both counters live
in Redis and hold across serverless instances; otherwise they're in-memory —
full strength on a single persistent process (Render), best-effort per-instance
on serverless (Vercel).
"""

from __future__ import annotations

import os
import threading
import time
from collections import deque

from . import upstash


class RateLimiter:
    def __init__(self, max_requests: int, window_seconds: float) -> None:
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._hits: dict[str, deque[float]] = {}
        self._lock = threading.Lock()

    def allow(self, key: str) -> bool:
        """Record a hit for ``key`` and return False when over the limit."""
        now = time.monotonic()
        cutoff = now - self.window_seconds
        with self._lock:
            hits = self._hits.setdefault(key, deque())
            while hits and hits[0] < cutoff:
                hits.popleft()
            if len(hits) >= self.max_requests:
                return False
            hits.append(now)
            # opportunistic cleanup so dead IPs don't accumulate forever
            if len(self._hits) > 10_000:
                for k in [k for k, v in self._hits.items() if not v or v[-1] < cutoff]:
                    self._hits.pop(k, None)
            return True

    def retry_after(self, key: str) -> int:
        """Seconds until the oldest hit ages out (best-effort hint)."""
        with self._lock:
            hits = self._hits.get(key)
            if not hits:
                return 0
            return max(0, int(hits[0] + self.window_seconds - time.monotonic()) + 1)


class DailyCounter:
    """Global (not per-IP) daily call counter; resets at UTC midnight."""

    def __init__(self, limit: int) -> None:
        self.limit = limit
        self._day: str | None = None
        self._count = 0
        self._lock = threading.Lock()

    def allow(self) -> bool:
        day = time.strftime("%Y-%m-%d", time.gmtime())
        with self._lock:
            if day != self._day:
                self._day = day
                self._count = 0
            if self._count >= self.limit:
                return False
            self._count += 1
            return True


class DailyIPCounter:
    """Per-IP daily call counter; resets at UTC midnight."""

    def __init__(self, limit: int) -> None:
        self.limit = limit
        self._day: str | None = None
        self._counts: dict[str, int] = {}
        self._lock = threading.Lock()

    def allow(self, ip: str) -> bool:
        day = time.strftime("%Y-%m-%d", time.gmtime())
        with self._lock:
            if day != self._day:
                self._day = day
                self._counts.clear()
            count = self._counts.get(ip, 0)
            if count >= self.limit:
                return False
            self._counts[ip] = count + 1
            return True


# Three env-tunable layers on paid AI calls: a short per-IP window (burst
# control), a per-IP daily allowance (each visitor gets a taste, not a tab),
# and a global daily ceiling (the hard spend cap).
AI_RATE_LIMIT = int(os.getenv("AI_RATE_LIMIT", "20"))
AI_RATE_WINDOW = int(os.getenv("AI_RATE_WINDOW", "300"))
AI_DAILY_IP_LIMIT = int(os.getenv("AI_DAILY_IP_LIMIT", "1"))
AI_DAILY_LIMIT = int(os.getenv("AI_DAILY_LIMIT", "100"))

ai_limiter = RateLimiter(max_requests=AI_RATE_LIMIT, window_seconds=AI_RATE_WINDOW)
_daily_ip_counter = DailyIPCounter(AI_DAILY_IP_LIMIT)
_daily_counter = DailyCounter(AI_DAILY_LIMIT)

_SECONDS_PER_DAY = 86_400


def _seconds_until_utc_midnight() -> int:
    return _SECONDS_PER_DAY - int(time.time() % _SECONDS_PER_DAY)


def check_ai_allowance(ip: str) -> tuple[bool, str, int]:
    """Gate one paid AI call. Returns (allowed, reason, retry_after_seconds).

    Per-IP check runs first so an abuser tripping their own limit doesn't drain
    the shared daily budget. Redis (fixed window) when configured; in-memory
    otherwise. Redis errors fall through to the in-memory path rather than
    blocking or silently allowing unlimited spend.
    """
    if upstash.enabled():
        day = time.strftime("%Y-%m-%d", time.gmtime())
        window = int(time.time() // AI_RATE_WINDOW)
        ip_key = f"ai:ip:{ip}:{window}"
        ip_day_key = f"ai:ipday:{ip}:{day}"
        res = upstash.pipeline(
            [
                ["INCR", ip_key],
                ["EXPIRE", ip_key, str(AI_RATE_WINDOW)],
                ["INCR", ip_day_key],
                ["EXPIRE", ip_day_key, str(2 * _SECONDS_PER_DAY), "NX"],
            ]
        )
        if res is not None:
            if int(res[0]) > AI_RATE_LIMIT:
                retry = AI_RATE_WINDOW - int(time.time() % AI_RATE_WINDOW) + 1
                return False, "Rate limit reached", retry
            if int(res[2]) > AI_DAILY_IP_LIMIT:
                return False, "Daily AI allowance used up", _seconds_until_utc_midnight()
            day_key = f"ai:day:{day}"
            day_res = upstash.pipeline([["INCR", day_key], ["EXPIRE", day_key, str(2 * _SECONDS_PER_DAY), "NX"]])
            if day_res is not None and int(day_res[0]) > AI_DAILY_LIMIT:
                return False, "Daily AI budget reached", _seconds_until_utc_midnight()
            return True, "", 0

    if not ai_limiter.allow(ip):
        return False, "Rate limit reached", ai_limiter.retry_after(ip)
    if not _daily_ip_counter.allow(ip):
        return False, "Daily AI allowance used up", _seconds_until_utc_midnight()
    if not _daily_counter.allow():
        return False, "Daily AI budget reached", _seconds_until_utc_midnight()
    return True, "", 0
