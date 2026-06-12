"""Vercel serverless entry point.

Vercel's @vercel/python runtime auto-detects the module-level ``app`` ASGI
object and serves it. We just re-export the existing FastAPI app, after putting
the repo root on the import path so ``server`` / ``advisor_engine`` resolve from
inside the ``api/`` function directory.

Routing (see vercel.json): the CDN serves the built front-end from
frontend/dist; only ``/api/*`` is rewritten here. The in-process caches and the
AI rate limiter do NOT persist across serverless invocations — see README
("Deploy → Vercel") for the implications and the Redis mitigation.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from server.main import app  # noqa: E402  (path set up above first)

# Exposed for Vercel's ASGI detection.
__all__ = ["app"]
