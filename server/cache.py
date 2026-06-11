"""Tiny thread-safe in-process TTL cache.

Used to shield the upstream market APIs (CoinGecko/Binance) from rate limits
when several clients poll at once, and later to memoize Claude narratives so
near-identical briefs don't trigger a fresh (paid) generation.

This is deliberately dependency-free and process-local. It is NOT shared across
workers/replicas; for a single free-tier service that is exactly what we want.
"""

from __future__ import annotations

import threading
import time
from typing import Any, Callable


class TTLCache:
    def __init__(self, default_ttl: float = 75.0) -> None:
        self._default_ttl = default_ttl
        self._store: dict[str, tuple[float, Any]] = {}
        self._lock = threading.Lock()

    def get(self, key: str) -> Any | None:
        now = time.monotonic()
        with self._lock:
            entry = self._store.get(key)
            if entry is None:
                return None
            expires_at, value = entry
            if now >= expires_at:
                self._store.pop(key, None)
                return None
            return value

    def set(self, key: str, value: Any, ttl: float | None = None) -> None:
        expires_at = time.monotonic() + (self._default_ttl if ttl is None else ttl)
        with self._lock:
            self._store[key] = (expires_at, value)

    def get_or_set(self, key: str, producer: Callable[[], Any], ttl: float | None = None) -> Any:
        """Return the cached value, or compute it with ``producer`` and cache it.

        The producer runs outside the lock so a slow upstream call doesn't block
        unrelated cache reads. A brief race where two callers both compute on a
        cold key is acceptable here (it just costs one extra upstream call).
        """
        cached = self.get(key)
        if cached is not None:
            return cached
        value = producer()
        self.set(key, value, ttl)
        return value


# Shared instances. Briefs change with the market every minute or two; AI
# narratives are stable for longer and far more expensive to regenerate.
brief_cache = TTLCache(default_ttl=75.0)
narrative_cache = TTLCache(default_ttl=300.0)
