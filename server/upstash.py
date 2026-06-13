"""Optional Upstash Redis (REST) backend for cross-instance state.

On serverless deploys (Vercel) the in-process caches and rate limiter reset on
every invocation, so the AI spend guards don't actually hold. When
UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set (Upstash gives you
both; the Vercel Marketplace integration injects them automatically), the rate
limiter and narrative cache get shared state across instances.

Uses Upstash's REST API over ``requests`` — no new dependency, no persistent
connection (a plus on serverless). Every helper fails soft (returns None) so
the app keeps working when Redis is down or unconfigured; callers fall back to
their in-memory behavior.
"""

from __future__ import annotations

import os
from typing import Any

import requests

_TIMEOUT = 4


def enabled() -> bool:
    return bool(os.getenv("UPSTASH_REDIS_REST_URL") and os.getenv("UPSTASH_REDIS_REST_TOKEN"))


def pipeline(commands: list[list[Any]]) -> list[Any] | None:
    """Run Redis commands via the REST pipeline endpoint. None on any failure."""
    url = os.getenv("UPSTASH_REDIS_REST_URL")
    token = os.getenv("UPSTASH_REDIS_REST_TOKEN")
    if not url or not token:
        return None
    try:
        resp = requests.post(
            f"{url.rstrip('/')}/pipeline",
            json=commands,
            headers={"Authorization": f"Bearer {token}"},
            timeout=_TIMEOUT,
        )
        if resp.status_code != 200:
            return None
        return [item.get("result") for item in resp.json()]
    except Exception:
        return None


def get_str(key: str) -> str | None:
    result = pipeline([["GET", key]])
    return result[0] if result and isinstance(result[0], str) else None


def set_str(key: str, value: str, ttl_seconds: int) -> None:
    pipeline([["SET", key, value, "EX", str(ttl_seconds)]])
