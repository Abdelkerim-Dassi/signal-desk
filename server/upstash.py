"""Optional Upstash Redis (REST) backend for cross-instance state.

On serverless deploys (Vercel) the in-process caches and rate limiter reset on
every invocation, so the AI spend guards don't actually hold. When an Upstash
Redis REST endpoint + token are configured, the rate limiter and narrative
cache get shared state across instances.

Two naming schemes are accepted, so this works no matter how Upstash was added:
  * UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN — Upstash console default
  * KV_REST_API_URL / KV_REST_API_TOKEN — what Vercel's Upstash Marketplace
    integration injects (legacy @vercel/kv prefix; same REST endpoint + token)

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


def _credentials() -> tuple[str, str] | None:
    url = os.getenv("UPSTASH_REDIS_REST_URL") or os.getenv("KV_REST_API_URL")
    token = os.getenv("UPSTASH_REDIS_REST_TOKEN") or os.getenv("KV_REST_API_TOKEN")
    return (url, token) if url and token else None


def enabled() -> bool:
    return _credentials() is not None


def pipeline(commands: list[list[Any]]) -> list[Any] | None:
    """Run Redis commands via the REST pipeline endpoint. None on any failure."""
    creds = _credentials()
    if creds is None:
        return None
    url, token = creds
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
