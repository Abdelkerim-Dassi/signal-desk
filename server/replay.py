"""Time machine: play a real past month, day by day, with pretend money.

Simulation only, like the practice wallet: no real money, no leverage, no
shorting. A scenario is a fixed month of real daily prices (built once by
``scripts/build_replay.py`` into ``server/data/replay.json``), so it costs
nothing to run.

The game is blind. The browser holds the prices as an index that starts at 100
on day 0, under the letters A to D, with no name and no date
(``frontend/src/lib/replayData.ts``), and plays the month without calling the
server. When the month is over it sends the list of moves here once. This
module plays them again with the practice wallet's own tested maths
(``server/paper.py``: same fee, same spread, same habit notes) and answers
with the result, the same start simply held in Bitcoin, and the reveal: which
coins they were and when it happened.

The result never says a way of trading works. It is one month, shown next to
holding Bitcoin and next to doing nothing.
"""

from __future__ import annotations

import json
from datetime import date, timedelta
from functools import lru_cache
from pathlib import Path
from typing import Any, Literal

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from advisor_engine import BINANCE_BASE_NAMES, percent_change

from . import paper

DATA = Path(__file__).resolve().parent / "data" / "replay.json"
START_USDT = 1000.0
MAX_MOVES = 300  # far more than a month of taps; a longer list is refused
# full names for the reveal, where the engine's own list has none
NAMES = {**BINANCE_BASE_NAMES, "DOGE": "Dogecoin", "XRP": "XRP"}


@lru_cache(maxsize=1)
def scenarios() -> dict[str, dict[str, Any]]:
    """Every scenario by id, with each coin's prices as an index (100 on day 0)."""
    raw = json.loads(DATA.read_text(encoding="utf-8"))
    out: dict[str, dict[str, Any]] = {}
    for sc in raw["scenarios"]:
        pre, days = int(sc["pre"]), int(sc["days"])
        coins = []
        for c in sc["coins"]:
            closes = [float(x) for x in c["closes"]]
            if len(closes) != pre + days + 1 or pre < 7:
                raise ValueError(f"replay scenario {sc['id']}: {c['base']} has the wrong number of days")
            # rounded exactly as scripts/build_replay.py writes it for the browser
            coins.append({"key": c["key"], "base": c["base"], "index": [round(x / closes[pre] * 100, 4) for x in closes]})
        out[sc["id"]] = {"id": sc["id"], "event": sc["event"], "from": sc["from"], "pre": pre, "days": days, "coins": coins}
    return out


def blind(sc: dict[str, Any]) -> dict[str, Any]:
    """What the browser may know before the end: letters and index prices."""
    return {"id": sc["id"], "days": sc["days"], "pre": sc["pre"], "coins": [{"key": c["key"], "index": c["index"]} for c in sc["coins"]]}


def reveal(sc: dict[str, Any]) -> dict[str, Any]:
    """Which coins they were, when it was, and how each moved over the month."""
    first = date.fromisoformat(sc["from"])
    pre = sc["pre"]
    return {
        "event": sc["event"],
        "from": first.isoformat(),
        "to": (first + timedelta(days=sc["days"])).isoformat(),
        "coins": [
            {
                "key": c["key"],
                "base": c["base"],
                "name": NAMES.get(c["base"], c["base"]),
                "pct": round(c["index"][-1] / c["index"][pre] * 100 - 100, 1),
            }
            for c in sc["coins"]
        ],
    }


def _strongest(notes: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """One note per habit: the clearest time it showed, in a fixed order."""
    rank = {
        "fomo": lambda n: n["pct"],
        "panic": lambda n: -n["pct"],
        "concentration": lambda n: n["pct"],
        "overtrading": lambda n: n["count"],
    }
    out = []
    for kind, key in rank.items():
        mine = [n for n in notes if n["id"] == kind]
        if mine:
            out.append(max(mine, key=key))
    return out


def run(sc: dict[str, Any], moves: list[dict[str, Any]]) -> dict[str, Any]:
    """Play ``moves`` through the scenario and value the wallet on every day.

    A move is ``{"day", "side", "coin", "usdt" | "fraction"}``: a buy spends
    ``usdt`` of the cash, a sell sells ``fraction`` of what is held, both at
    that day's price. Moves must come in day order, on days 0 to the one
    before last. One the wallet cannot make is left out and counted in
    ``skipped`` (the app plays with the same rules, so there should be none).
    """
    pre, days = sc["pre"], sc["days"]
    index = {c["key"]: c["index"] for c in sc["coins"]}
    names = {c["key"]: c["base"] for c in sc["coins"]}
    btc = next(c["key"] for c in sc["coins"] if c["base"] == "BTC")

    wallet: dict[str, Any] = {"cash": START_USDT, "positions": {}}
    # the same start, all in Bitcoin on day 0 and never touched: fee and spread paid once
    hold_qty = paper.quote_buy(index[btc][pre], START_USDT)["qty"]

    curve: list[dict[str, Any]] = []
    notes: list[dict[str, Any]] = []
    earlier: list[float] = []
    costs = 0.0
    made = 0
    skipped = 0
    at = 0
    for day in range(days + 1):
        prices = {key: series[pre + day] for key, series in index.items()}
        while day < days and at < len(moves) and moves[at].get("day") == day:
            move = moves[at]
            at += 1
            key = move.get("coin")
            if key not in index:
                skipped += 1
                continue
            try:
                if move.get("side") == "buy":
                    fill, after = paper.apply_buy(wallet, key, prices[key], paper._num(move.get("usdt"), 0.0))
                else:
                    fill, after = paper.apply_sell(wallet, key, prices[key], paper._num(move.get("fraction"), 0.0))
            except paper.TradeError:
                skipped += 1
                continue
            series = index[key]
            moved = {
                "change_7d": percent_change(series[pre + day], series[pre + day - 7]),
                "change_24h": percent_change(series[pre + day], series[pre + day - 1]),
            }
            # one replay day is one day for the coach: five trades on the same day is "overtrading"
            now = day * paper.DAY_MS
            for note in paper.coach(move["side"], key, moved, None, after, prices, earlier, now):
                note = {**note, "day": day}
                if "base" in note:
                    note["base"] = names[key]
                    note["name"] = NAMES.get(names[key], names[key])
                notes.append(note)
            earlier.append(now)
            wallet = after
            costs += fill["fee"] + fill["spread_cost"]
            made += 1
        valued = paper.value_wallet(wallet, prices, START_USDT)
        curve.append({"day": day, "value": valued["value"], "hold": hold_qty * prices[btc]})
    skipped += len(moves) - at  # out of order, or after the last day

    last = curve[-1]
    return {
        "start": START_USDT,
        "value": last["value"],
        "pct": (last["value"] / START_USDT - 1) * 100,
        "hold_value": last["hold"],
        "hold_pct": (last["hold"] / START_USDT - 1) * 100,
        "trades": made,
        "costs": costs,
        "skipped": skipped,
        "curve": curve,
        "notes": _strongest(notes),
    }


# ── HTTP ────────────────────────────────────────────────────────────────────

router = APIRouter(prefix="/api/replay")


class Move(BaseModel):
    day: int = Field(ge=0, le=400)
    side: Literal["buy", "sell"]
    coin: str = Field(max_length=4)
    usdt: float | None = None  # buys: cash to spend, fee included
    fraction: float | None = None  # sells: share of the position, 0..1


class FinishRequest(BaseModel):
    id: str = Field(max_length=16)
    moves: list[Move] = Field(default_factory=list, max_length=MAX_MOVES)


@router.post("/finish")
async def replay_finish(req: FinishRequest) -> JSONResponse:
    """Work out a finished game and reveal what the month was. Stateless and
    uncounted: the app reports starts and finishes itself (server/stats.py)."""
    sc = scenarios().get(req.id)
    if sc is None:
        return JSONResponse({"ok": False, "code": "unknown_scenario", "error": "No such scenario."}, status_code=404)
    result = run(sc, [m.model_dump() for m in req.moves])
    return JSONResponse({"ok": True, "result": result, "reveal": reveal(sc)}, headers={"Cache-Control": "no-store"})
