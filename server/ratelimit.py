"""Tiny in-memory per-key sliding-window rate limiter.

Protects the paid AI endpoints from abuse once the app is public — the
ANTHROPIC_API_KEY is the asset being defended. Process-local like the caches:
fine for a single free-tier instance, swap for Redis if this ever scales out.
"""

from __future__ import annotations

import threading
import time
from collections import deque


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


# Generous for one human clicking around, restrictive for a scraper:
# 20 AI calls per 5 minutes per client IP.
ai_limiter = RateLimiter(max_requests=20, window_seconds=300)
