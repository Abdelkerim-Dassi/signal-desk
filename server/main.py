"""FastAPI application for the AI Crypto Advisor.

This wraps the existing, unchanged ``advisor_engine`` and ``notifications``
modules. The engine uses blocking ``requests`` calls, so every engine
invocation runs in a thread (``asyncio.to_thread``) to avoid blocking the event
loop. Heuristic briefs are cached briefly to shield upstream APIs from rate
limits when multiple clients poll at once.

Run locally:
    uvicorn server.main:app --reload

The static front-end is served from ``frontend/dist`` once it's built. When the
build is absent (e.g. a Vercel serverless function, where the CDN serves the
front-end), only the ``/api/*`` routes are mounted.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
from pathlib import Path

from dotenv import load_dotenv

# Load a local .env (gitignored) before anything reads env vars. In production
# the platform injects real env vars and there is no .env, so this is a no-op.
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response, StreamingResponse
from fastapi.staticfiles import StaticFiles

from advisor_engine import build_market_brief, normalize_asset_ids, parse_holdings
from notifications import format_market_alert, notification_status, send_notifications

from . import ai, track_record
from .cache import TTLCache, brief_cache
from .ratelimit import check_ai_allowance
from .schemas import AnalyzeRequest, BriefingRequest, ChatRequest, NotifyRequest

ROOT = Path(__file__).resolve().parent.parent
STATIC_DIR = ROOT / "frontend" / "dist"
BACKTEST_FILE = Path(__file__).resolve().parent / "data" / "backtest.json"

# The track record only changes once a day; a short memo keeps the panel from
# re-reading every snapshot out of Redis on each page load.
track_cache = TTLCache(default_ttl=600.0)
log = logging.getLogger("signaldesk")

app = FastAPI(title="AI Crypto Advisor", version="0.2")

# CORS is a no-op in production (front-end is served same-origin) but lets the
# Vite dev server talk to a separately-run API if the proxy isn't used.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def _ai_enabled() -> bool:
    return ai.ai_enabled()


def _client_ip(request: Request) -> str:
    """Client IP for rate limiting; honors the proxy header Render sets."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _ai_rate_limited(request: Request) -> JSONResponse | None:
    allowed, reason, retry = check_ai_allowance(_client_ip(request))
    if allowed:
        return None
    return JSONResponse(
        {"ok": False, "error": f"{reason} — try again in ~{retry}s."},
        status_code=429,
        headers={"Retry-After": str(retry)},
    )


def _brief_key(assets: list[str], holdings_raw: object, market_source: str, quote_asset: str) -> str:
    """Stable cache key. Holdings change the brief, so they're part of the key."""
    payload = {
        "assets": assets,
        "holdings": holdings_raw,
        "market_source": market_source,
        "quote_asset": quote_asset,
    }
    return json.dumps(payload, sort_keys=True, default=str)


async def _build_brief(
    assets: list[str],
    holdings_raw: object,
    market_source: str,
    quote_asset: str,
) -> dict:
    """Build (or fetch cached) a market brief off the event loop."""
    key = _brief_key(assets, holdings_raw, market_source, quote_asset)
    cached = brief_cache.get(key)
    if cached is not None:
        return cached

    holdings = parse_holdings(holdings_raw)
    brief = await asyncio.to_thread(
        build_market_brief,
        assets,
        holdings,
        market_source,
        quote_asset,
    )
    brief_cache.set(key, brief)
    return brief


@app.get("/api/status")
async def status() -> dict:
    return {"notifications": notification_status(), "ai_enabled": _ai_enabled()}


@app.post("/api/analyze")
async def analyze(req: AnalyzeRequest) -> JSONResponse:
    market_source = str(req.market_source or "coingecko").lower()
    quote_asset = str(req.quote_asset or "USDT").upper()
    assets = normalize_asset_ids(req.assets)
    try:
        brief = await _build_brief(assets, req.holdings, market_source, quote_asset)
        return JSONResponse({"ok": True, "brief": brief})
    except Exception as exc:  # upstream/data errors → 502, surfaced to the UI
        return JSONResponse({"ok": False, "error": str(exc)}, status_code=502)


@app.get("/api/brief")
async def brief(
    assets: str | None = None,
    market_source: str = "coingecko",
    quote_asset: str = "USDT",
) -> JSONResponse:
    normalized = normalize_asset_ids(assets)
    try:
        result = await _build_brief(normalized, None, market_source.lower(), quote_asset.upper())
        return JSONResponse({"ok": True, "brief": result})
    except Exception as exc:
        return JSONResponse({"ok": False, "error": str(exc)}, status_code=502)


@app.post("/api/ai/briefing")
async def ai_briefing(req: BriefingRequest, request: Request) -> JSONResponse:
    if not _ai_enabled():
        return JSONResponse(
            {"ok": False, "error": "AI is not configured (ANTHROPIC_API_KEY unset)."},
            status_code=503,
        )
    limited = _ai_rate_limited(request)
    if limited is not None:
        return limited
    try:
        result = await ai.generate_briefing(req.brief)
        return JSONResponse(result)
    except Exception as exc:
        return JSONResponse({"ok": False, "error": str(exc)}, status_code=502)


@app.post("/api/ai/chat")
async def ai_chat(req: ChatRequest, request: Request) -> Response:
    if not _ai_enabled():
        return JSONResponse(
            {"ok": False, "error": "AI is not configured (ANTHROPIC_API_KEY unset)."},
            status_code=503,
        )
    limited = _ai_rate_limited(request)
    if limited is not None:
        return limited
    question = req.question.strip()
    if not question:
        return JSONResponse({"ok": False, "error": "Empty question."}, status_code=400)

    history = [{"role": m.role, "content": m.content} for m in req.history]

    async def event_stream():
        # SSE frames: data: {"text": ...} per chunk, then data: {"done": true}.
        # Errors mid-stream can't change the status code anymore, so they're
        # delivered as a {"error": ...} event the client renders inline.
        try:
            async for chunk in ai.stream_chat(question, req.brief, history):
                yield f"data: {json.dumps({'text': chunk})}\n\n"
            yield 'data: {"done": true}\n\n'
        except Exception as exc:
            yield f"data: {json.dumps({'error': str(exc)})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # ask reverse proxies not to buffer SSE
        },
    )


def _load_backtest() -> dict | None:
    try:
        return json.loads(BACKTEST_FILE.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None


@app.get("/api/track-record")
async def get_track_record() -> JSONResponse:
    cached = track_cache.get("track")
    if cached is not None:
        return JSONResponse(cached)
    # The daily cron is the primary logger; this is the fallback so a missed
    # cron run (or local dev) still records the day on first visit.
    try:
        snapshot = await asyncio.to_thread(track_record.ensure_today)
    except Exception as exc:
        log.exception("track-record snapshot failed")
        snapshot = {"logged": False, "reason": "error", "error": str(exc)}
    if not snapshot.get("logged") and snapshot.get("reason") != "exists":
        log.warning("track-record snapshot not logged: %s", snapshot)
    try:
        live = await asyncio.to_thread(track_record.summary)
    except Exception as exc:
        log.exception("track-record summary failed")
        live = {"error": str(exc)}
    payload = {"ok": True, "live": live, "backtest": _load_backtest(), "snapshot": snapshot}
    # A failed snapshot retries after a minute instead of waiting out the memo.
    healthy = snapshot.get("logged") or snapshot.get("reason") == "exists"
    track_cache.set("track", payload, ttl=None if healthy else 60)
    return JSONResponse(payload)


@app.get("/api/cron/snapshot")
async def cron_snapshot(request: Request) -> JSONResponse:
    """Daily snapshot trigger (Vercel Cron). Vercel sends CRON_SECRET as a bearer token."""
    secret = os.getenv("CRON_SECRET")
    if secret and request.headers.get("authorization") != f"Bearer {secret}":
        return JSONResponse({"ok": False, "error": "unauthorized"}, status_code=401)
    try:
        snapshot = await asyncio.to_thread(track_record.ensure_today)
    except Exception as exc:
        log.exception("cron snapshot failed")
        return JSONResponse({"ok": False, "error": str(exc)}, status_code=502)
    track_cache.set("track", None, ttl=0)
    return JSONResponse({"ok": True, "snapshot": snapshot})


@app.post("/api/notify")
async def notify(req: NotifyRequest) -> JSONResponse:
    channels = req.channels if isinstance(req.channels, list) else None
    message = req.message
    if not isinstance(message, str) or not message.strip():
        message = format_market_alert(req.brief or {})
    results = await asyncio.to_thread(send_notifications, message, channels)
    ok = any(r.get("ok") for r in results)
    return JSONResponse({"ok": ok, "results": results})


# Static front-end last, so /api/* routes take precedence. html=True serves
# index.html at "/" and falls back to it for client-side routes. Guarded so the
# app imports cleanly where the static build isn't co-located (e.g. a Vercel
# serverless function, where the CDN serves the front-end and this only handles
# /api/*); StaticFiles raises at construction if the directory is missing.
if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")
