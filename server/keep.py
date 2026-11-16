"""Keep my wallet: a saved copy of a practice wallet behind a private link.

The practice wallet and the lesson progress live in one browser's storage.
Most visitors arrive inside the TikTok, Instagram or Facebook in-app browser,
which shares nothing with Chrome or Safari, so a wallet traded today can be
gone tomorrow. A visitor who taps "keep my wallet" gets a link; opening it in
any browser brings the wallet back and keeps it up to date from then on.

No account and no personal data. The link holds a random id made here (192
bits), and the id is the only key: whoever has the link can open that practice
wallet, and nobody else can find it.

* The app puts the id in the address *fragment* (``qirat.tn/#keep-<id>``) and
  sends it here in a POST body, never in a path or a query, so it does not
  reach access logs, referrers or the page-view counter. Nothing in this
  module logs an id.
* The store key is a hash of the id, so reading the store's key list gives no
  working link. There is no listing call.
* What is stored is rebuilt field by field from the body: numbers, coins from
  the practice list and a few fixed words. No free text can be parked here.
* Entries expire ``KEEP_DAYS`` after their last save or read.

Storage is the Upstash store the counters use (``server/upstash.py``). Without
it (local development, tests) copies are kept in memory. On Vercel without a
store the calls answer 503 rather than pretend: memory there does not outlive
a request.
"""

from __future__ import annotations

import hashlib
import json
import math
import os
import re
import secrets
import threading
from typing import Any

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from advisor_engine import GRADE_UNIVERSE

from . import upstash
from .ratelimit import check_keep_allowance

KEEP_DAYS = 365
TTL_SECONDS = KEEP_DAYS * 86400
MAX_BODY_BYTES = 120_000  # a wallet with 200 trades and its full history is about 85 kB
MAX_OPEN_BYTES = 200  # {"id": "..."} and nothing else

# The app's own caps (frontend/src/lib/practice.ts), with a little room.
MAX_TRADES = 200
MAX_CURVE = 400
MAX_NOTES = 8
MAX_LESSONS = 200
MAX_START_USDT = 1_000_000
MAX_AMOUNT = 1e12

_ID = re.compile(r"^[A-Za-z0-9_-]{32}$")  # secrets.token_urlsafe(24)
_SLUG = re.compile(r"^[a-z0-9][a-z0-9-]{0,59}$")
_NOTE_IDS = {"fomo", "panic", "concentration", "storm", "overtrading"}
_KARATS = {10, 14, 18, 22, 24}
_FILL_NUMBERS = ("mid", "price", "qty", "gross", "fee", "spread_cost", "net")

_memory: dict[str, str] = {}
_lock = threading.Lock()

_NO_STORE = {"Cache-Control": "no-store"}


class StoreDown(Exception):
    """The store did not answer, or there is none where one is needed."""


# ── what may be stored ──────────────────────────────────────────────────────


class _Bad(ValueError):
    pass


def _number(value: Any, low: float = 0.0, high: float = MAX_AMOUNT) -> float:
    """A plain finite number in range, as int or float (never a bool or a string)."""
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise _Bad
    if not math.isfinite(value) or value < low or value > high:
        raise _Bad
    return value


def _coin(value: Any) -> str:
    if not isinstance(value, str) or value not in GRADE_UNIVERSE:
        raise _Bad
    return value


def _list(value: Any, most: int) -> list[Any]:
    if not isinstance(value, list) or len(value) > most:
        raise _Bad
    return value


def _note(raw: Any) -> dict[str, Any]:
    if not isinstance(raw, dict) or raw.get("id") not in _NOTE_IDS:
        raise _Bad
    note: dict[str, Any] = {"id": raw["id"]}
    if "base" in raw:
        note["base"] = _coin(raw["base"])
    if "pct" in raw:
        note["pct"] = _number(raw["pct"], -1e6, 1e6)
    if "count" in raw:
        note["count"] = int(_number(raw["count"], 0, 10_000))
    return note


def _trade(raw: Any) -> dict[str, Any]:
    if not isinstance(raw, dict) or raw.get("side") not in ("buy", "sell"):
        raise _Bad
    trade: dict[str, Any] = {"side": raw["side"], "base": _coin(raw.get("base"))}
    for name in _FILL_NUMBERS:
        trade[name] = _number(raw.get(name))
    trade["ts"] = _number(raw.get("ts"), 1, 1e14)
    trade["notes"] = [_note(n) for n in _list(raw.get("notes"), MAX_NOTES)]
    return trade


def _point(raw: Any) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise _Bad
    hold = raw.get("hold")
    return {
        "ts": _number(raw.get("ts"), 1, 1e14),
        "value": _number(raw.get("value")),
        "hold": None if hold is None else _number(hold),
    }


def clean_ledger(raw: Any) -> dict[str, Any] | None:
    """The practice ledger of ``frontend/src/lib/practice.ts``, rebuilt from
    ``raw`` with nothing else in it. None when ``raw`` is not such a ledger."""
    try:
        if not isinstance(raw, dict) or raw.get("v") != 1:
            raise _Bad
        wallet = raw.get("wallet")
        if not isinstance(wallet, dict) or not isinstance(wallet.get("positions"), dict):
            raise _Bad
        positions: dict[str, dict[str, float]] = {}
        for base, pos in wallet["positions"].items():
            if not isinstance(pos, dict):
                raise _Bad
            positions[_coin(base)] = {"qty": _number(pos.get("qty")), "cost": _number(pos.get("cost"))}
        hold = raw.get("btcHoldQty")
        return {
            "v": 1,
            "startedAt": _number(raw.get("startedAt"), 1, 1e14),
            "startUsdt": _number(raw.get("startUsdt"), 1e-9, MAX_START_USDT),
            "wallet": {"cash": _number(wallet.get("cash")), "positions": positions},
            "btcHoldQty": None if hold is None else _number(hold),
            "trades": [_trade(t) for t in _list(raw.get("trades"), MAX_TRADES)],
            "curve": [_point(p) for p in _list(raw.get("curve"), MAX_CURVE)],
        }
    except _Bad:
        return None


def clean_learn(raw: Any) -> dict[str, Any] | None:
    """Lesson progress of ``frontend/src/lib/learnProgress.ts``, rebuilt the
    same way. None when ``raw`` is not such a record."""
    try:
        if not isinstance(raw, dict) or not isinstance(raw.get("lessons"), dict):
            raise _Bad
        if raw.get("bestKarat") not in _KARATS or isinstance(raw.get("bestKarat"), bool):
            raise _Bad
        if len(raw["lessons"]) > MAX_LESSONS:
            raise _Bad
        lessons: dict[str, dict[str, Any]] = {}
        for slug, p in raw["lessons"].items():
            if not _SLUG.match(slug) or not isinstance(p, dict):
                raise _Bad
            done: dict[str, Any] = {}
            for flag in ("read", "passed"):
                if flag in p:
                    if not isinstance(p[flag], bool):
                        raise _Bad
                    done[flag] = p[flag]
            if "best" in p:
                done["best"] = int(_number(p["best"], 0, 10))
            lessons[slug] = done
        return {"lessons": lessons, "bestKarat": int(raw["bestKarat"])}
    except _Bad:
        return None


# ── the store ───────────────────────────────────────────────────────────────


def new_id() -> str:
    return secrets.token_urlsafe(24)


def _key(keep_id: str) -> str:
    return "keep:" + hashlib.sha256(keep_id.encode()).hexdigest()


def _durable() -> bool:
    """False where memory would lose the copy at once (Vercel without a store)."""
    return upstash.enabled() or not os.getenv("VERCEL")


def _put(key: str, value: str, *, new: bool) -> bool:
    """Write a copy and restart its expiry. A new copy never replaces one that
    is there; an update only writes where one is (False when it is gone)."""
    if upstash.enabled():
        res = upstash.pipeline([["SET", key, value, "EX", str(TTL_SECONDS), "NX" if new else "XX"]])
        if res is None:
            raise StoreDown
        return res[0] == "OK"
    if not _durable():
        raise StoreDown
    with _lock:
        if (key in _memory) == new:
            return False
        _memory[key] = value
        return True


def _get(key: str) -> str | None:
    """Read a copy and restart its expiry."""
    if upstash.enabled():
        res = upstash.pipeline([["GET", key], ["EXPIRE", key, str(TTL_SECONDS)]])
        if res is None:
            raise StoreDown
        return res[0] if isinstance(res[0], str) else None
    if not _durable():
        raise StoreDown
    with _lock:
        return _memory.get(key)


# ── HTTP ────────────────────────────────────────────────────────────────────

router = APIRouter(prefix="/api/keep")


def _error(status: int, code: str, message: str, headers: dict[str, str] | None = None) -> JSONResponse:
    return JSONResponse({"ok": False, "code": code, "error": message}, status_code=status, headers={**_NO_STORE, **(headers or {})})


def _client_ip(request: Request) -> str:
    """Same rule as ``server.main._client_ip``: the proxy header first."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


async def _body(request: Request, most: int) -> dict[str, Any] | JSONResponse:
    """The JSON object in the request, or the refusal to send back."""
    declared = request.headers.get("content-length", "")
    if declared.isdigit() and int(declared) > most:
        return _error(413, "too_big", "That is too large to save.")
    raw = await request.body()
    if len(raw) > most:
        return _error(413, "too_big", "That is too large to save.")
    try:
        data = json.loads(raw)
    except ValueError:
        return _error(400, "bad_body", "The request is not valid JSON.")
    if not isinstance(data, dict):
        return _error(400, "bad_body", "The request is not a JSON object.")
    return data


def _throttled(retry: int) -> JSONResponse:
    return _error(429, "slow_down", f"Too many requests. Try again in about {retry}s.", {"Retry-After": str(retry)})


_DOWN = (503, "unavailable", "Saved wallets are unavailable right now.")


@router.post("/save")
async def keep_save(request: Request) -> JSONResponse:
    """Save a practice wallet (and lesson progress). Without ``id`` this makes
    a new copy and answers with its id; with one it replaces that copy."""
    body = await _body(request, MAX_BODY_BYTES)
    if isinstance(body, JSONResponse):
        return body
    keep_id = body.get("id")
    if keep_id is not None and not (isinstance(keep_id, str) and _ID.match(keep_id)):
        return _error(400, "bad_id", "That is not a saved-wallet id.")
    ledger = clean_ledger(body.get("ledger"))
    if ledger is None:
        return _error(400, "bad_wallet", "That is not a practice wallet.")
    learn = None
    if body.get("learn") is not None:
        learn = clean_learn(body["learn"])
        if learn is None:
            return _error(400, "bad_wallet", "That is not lesson progress.")

    allowed, retry = check_keep_allowance(_client_ip(request), "create" if keep_id is None else "save")
    if not allowed:
        return _throttled(retry)

    # `rev` changes with every save; a browser compares it with the last one
    # it saw to know that another browser has saved since.
    rev = secrets.token_hex(8)
    value = json.dumps({"v": 1, "rev": rev, "ledger": ledger, "learn": learn}, separators=(",", ":"))
    try:
        if keep_id is None:
            keep_id = new_id()
            if not _put(_key(keep_id), value, new=True):
                return _error(*_DOWN)  # a clash of two random ids: not in this universe
        elif not _put(_key(keep_id), value, new=False):
            return _error(404, "unknown", "No saved wallet under this link. It may have expired.")
    except StoreDown:
        return _error(*_DOWN)
    return JSONResponse({"ok": True, "id": keep_id, "rev": rev}, headers=_NO_STORE)


@router.post("/open")
async def keep_open(request: Request) -> JSONResponse:
    """Read the copy saved under ``id``. The id comes in the body, not in the
    address, so it is not written to any access log."""
    body = await _body(request, MAX_OPEN_BYTES)
    if isinstance(body, JSONResponse):
        return body
    keep_id = body.get("id")
    if not (isinstance(keep_id, str) and _ID.match(keep_id)):
        return _error(400, "bad_id", "That is not a saved-wallet id.")
    allowed, retry = check_keep_allowance(_client_ip(request), "open")
    if not allowed:
        return _throttled(retry)
    try:
        raw = _get(_key(keep_id))
    except StoreDown:
        return _error(*_DOWN)
    if raw is None:
        return _error(404, "unknown", "No saved wallet under this link. It may have expired.")
    try:
        saved = json.loads(raw)
        answer = {"ok": True, "rev": saved["rev"], "ledger": saved["ledger"], "learn": saved.get("learn")}
    except (ValueError, KeyError, TypeError):
        return _error(404, "unknown", "No saved wallet under this link. It may have expired.")
    return JSONResponse(answer, headers=_NO_STORE)
