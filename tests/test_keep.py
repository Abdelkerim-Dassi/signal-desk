"""Keep my wallet: a saved copy of a practice wallet behind a private link."""

import copy
import json

import pytest
from fastapi.testclient import TestClient

from server import keep, ratelimit, stats


def _ledger(trades: int = 1) -> dict:
    trade = {
        "side": "buy",
        "base": "BTC",
        "mid": 64497.05,
        "price": 64529.298525,
        "qty": 0.0015481339838414121,
        "gross": 100,
        "fee": 0.1,
        "spread_cost": 0.04992503748125229,
        "net": 99.9,
        "ts": 1794825326283.822,
        "notes": [{"id": "concentration", "base": "BTC", "pct": 62}],
    }
    return {
        "v": 1,
        "startedAt": 1794825000000,
        "startUsdt": 1000,
        "wallet": {"cash": 900, "positions": {"BTC": {"qty": 0.0015481339838414121, "cost": 100}}},
        "btcHoldQty": 0.0154,
        "trades": [dict(trade, ts=trade["ts"] + i) for i in range(trades)],
        "curve": [{"ts": 1794825327000, "value": 999.85, "hold": 998.5}, {"ts": 1794825400000, "value": 1001.2, "hold": None}],
    }


LEARN = {"lessons": {"what-is-crypto": {"read": True, "best": 3, "passed": True}, "fomo": {"read": True}}, "bestKarat": 14}


@pytest.fixture
def client(monkeypatch):
    """Every test gets an empty in-memory store and fresh limits, never a real Redis."""
    from server.main import app

    monkeypatch.setattr(keep.upstash, "enabled", lambda: False)
    monkeypatch.delenv("VERCEL", raising=False)
    monkeypatch.setattr(keep, "_memory", {})
    monkeypatch.setattr(ratelimit, "_keep_ip_limiter", ratelimit.RateLimiter(ratelimit.KEEP_RATE_LIMIT, 60))
    monkeypatch.setattr(ratelimit, "_keep_new_ip", ratelimit.DailyIPCounter(ratelimit.KEEP_CREATE_DAILY_IP))
    monkeypatch.setattr(ratelimit, "_keep_new_all", ratelimit.DailyCounter(ratelimit.KEEP_CREATE_DAILY))
    return TestClient(app)


def _save(client, **body):
    return client.post("/api/keep/save", json=body)


def _open(client, keep_id):
    return client.post("/api/keep/open", json={"id": keep_id})


# ── a good wallet ───────────────────────────────────────────────────────────


def test_a_saved_wallet_comes_back_as_it_was(client):
    r = _save(client, ledger=_ledger(), learn=LEARN)
    assert r.status_code == 200 and r.headers["cache-control"] == "no-store"
    made = r.json()
    assert made["ok"] is True and keep._ID.match(made["id"]) and made["rev"]

    back = _open(client, made["id"])
    assert back.status_code == 200 and back.headers["cache-control"] == "no-store"
    assert back.json() == {"ok": True, "rev": made["rev"], "ledger": _ledger(), "learn": LEARN}


def test_each_new_copy_gets_its_own_long_random_id(client):
    ids = {_save(client, ledger=_ledger()).json()["id"] for _ in range(5)}
    assert len(ids) == 5
    assert all(len(i) == 32 for i in ids)  # 24 random bytes: 192 bits


def test_an_update_replaces_the_copy_and_changes_its_rev(client):
    made = _save(client, ledger=_ledger()).json()
    later = _ledger(trades=3)
    later["wallet"]["cash"] = 700
    again = _save(client, id=made["id"], ledger=later)
    assert again.status_code == 200
    assert again.json()["id"] == made["id"] and again.json()["rev"] != made["rev"]
    back = _open(client, made["id"]).json()
    assert back["rev"] == again.json()["rev"]
    assert back["ledger"]["wallet"]["cash"] == 700 and len(back["ledger"]["trades"]) == 3
    assert back["learn"] is None  # the copy is replaced whole


def test_a_wallet_without_lessons_is_fine(client):
    made = _save(client, ledger=_ledger(trades=0)).json()
    assert _open(client, made["id"]).json()["learn"] is None


def test_only_ledger_fields_are_stored(client):
    """Anything that is not part of the ledger is dropped, so nothing else can be parked in the store."""
    body = _ledger()
    body["memo"] = "x" * 500
    body["wallet"]["owner"] = "someone@example.com"
    body["trades"][0]["comment"] = "free text"
    body["trades"][0]["notes"][0]["text"] = "free text"
    learn = copy.deepcopy(LEARN)
    learn["name"] = "someone"
    learn["lessons"]["fomo"]["note"] = "free text"
    made = _save(client, ledger=body, learn=learn).json()
    assert _open(client, made["id"]).json() == {"ok": True, "rev": made["rev"], "ledger": _ledger(), "learn": LEARN}
    assert "example.com" not in json.dumps(keep._memory) and "free text" not in json.dumps(keep._memory)


def test_the_store_key_is_not_the_id(client):
    made = _save(client, ledger=_ledger()).json()
    assert len(keep._memory) == 1
    assert made["id"] not in "".join(keep._memory)  # a leaked key list gives no working link
    assert made["id"] not in "".join(keep._memory.values())


# ── refusals ────────────────────────────────────────────────────────────────


def test_an_unknown_id_is_a_plain_404(client):
    unknown = keep.new_id()
    r = _open(client, unknown)
    assert r.status_code == 404 and r.json()["code"] == "unknown"
    # an update never creates a copy under an id the server did not make
    r = _save(client, id=unknown, ledger=_ledger())
    assert r.status_code == 404 and r.json()["code"] == "unknown"
    assert keep._memory == {}


@pytest.mark.parametrize("bad", ["", "short", "a" * 31, "a" * 33, "a" * 31 + "/", "../" * 10 + "ab", 12345, None, ["a" * 32]])
def test_a_malformed_id_is_refused(client, bad):
    assert _open(client, bad).status_code == 400
    if bad is not None:  # no id at all means "make a new copy"
        assert _save(client, id=bad, ledger=_ledger()).status_code == 400
    assert keep._memory == {}


def _broken(change):
    body = _ledger()
    change(body)
    return body


@pytest.mark.parametrize(
    "ledger",
    [
        None,
        "a wallet",
        [],
        {},
        _broken(lambda b: b.update(v=2)),
        _broken(lambda b: b.pop("wallet")),
        _broken(lambda b: b["wallet"].update(cash=-5)),
        _broken(lambda b: b["wallet"].update(cash="900")),
        _broken(lambda b: b["wallet"].update(cash=True)),
        _broken(lambda b: b["wallet"].update(positions=[])),
        _broken(lambda b: b["wallet"]["positions"].update(SCAMCOIN={"qty": 1, "cost": 1})),
        _broken(lambda b: b["wallet"]["positions"]["BTC"].update(qty=-1)),
        _broken(lambda b: b.update(startUsdt=0)),
        _broken(lambda b: b.update(startUsdt=10**9)),
        _broken(lambda b: b.update(startedAt="yesterday")),
        _broken(lambda b: b.update(btcHoldQty="lots")),
        _broken(lambda b: b.update(trades="none")),
        _broken(lambda b: b.update(trades=[{"side": "buy"}])),
        _broken(lambda b: b["trades"][0].update(side="short")),
        _broken(lambda b: b["trades"][0].update(base="SCAMCOIN")),
        _broken(lambda b: b["trades"][0].update(notes=[{"id": "buy now"}])),
        _broken(lambda b: b["trades"][0].pop("notes")),
        _broken(lambda b: b.update(trades=b["trades"] * (keep.MAX_TRADES + 1))),
        _broken(lambda b: b.update(curve=[{"ts": 1, "value": "high"}])),
        _broken(lambda b: b.update(curve=b["curve"] * (keep.MAX_CURVE // 2 + 1))),
    ],
)
def test_a_body_that_is_not_a_practice_wallet_is_refused(client, ledger):
    r = _save(client, ledger=ledger)
    assert r.status_code == 400 and r.json()["code"] == "bad_wallet"
    assert keep._memory == {}


@pytest.mark.parametrize("number", ["NaN", "Infinity", "-Infinity", "1e999"])
def test_numbers_that_are_not_finite_are_refused(client, number):
    raw = json.dumps({"ledger": _ledger()}).replace('"cash": 900', f'"cash": {number}')
    r = client.post("/api/keep/save", content=raw, headers={"Content-Type": "application/json"})
    assert r.status_code == 400
    assert keep._memory == {}


@pytest.mark.parametrize(
    "learn",
    [
        "done",
        {"lessons": {}},
        {"lessons": [], "bestKarat": 10},
        {"lessons": {}, "bestKarat": 99},
        {"lessons": {"Not A Slug!": {"read": True}}, "bestKarat": 10},
        {"lessons": {"fomo": {"read": "yes"}}, "bestKarat": 10},
        {"lessons": {"fomo": {"best": 99}}, "bestKarat": 10},
        {"lessons": {f"lesson-{i}": {} for i in range(keep.MAX_LESSONS + 1)}, "bestKarat": 10},
    ],
)
def test_lesson_progress_that_is_malformed_is_refused(client, learn):
    assert _save(client, ledger=_ledger(), learn=learn).status_code == 400
    assert keep._memory == {}


@pytest.mark.parametrize("raw", [b"", b"not json", b"[1, 2]", b'"text"', b"{"])
def test_a_body_that_is_not_a_json_object_is_refused(client, raw):
    for path in ("/api/keep/save", "/api/keep/open"):
        r = client.post(path, content=raw, headers={"Content-Type": "application/json"})
        assert r.status_code == 400 and r.json()["code"] == "bad_body"


def test_an_oversized_body_is_refused_before_it_is_read_as_a_wallet(client):
    body = {"ledger": _ledger(), "padding": "x" * keep.MAX_BODY_BYTES}
    r = client.post("/api/keep/save", json=body)
    assert r.status_code == 413 and r.json()["code"] == "too_big"
    r = client.post("/api/keep/open", json={"id": keep.new_id(), "padding": "x" * keep.MAX_OPEN_BYTES})
    assert r.status_code == 413
    assert keep._memory == {}


def test_the_largest_wallet_the_app_can_hold_fits(client):
    full = _ledger(trades=keep.MAX_TRADES)
    full["curve"] = [{"ts": 1794825327000 + i, "value": 999.85 + i, "hold": 998.5} for i in range(keep.MAX_CURVE)]
    assert len(json.dumps({"id": keep.new_id(), "ledger": full, "learn": LEARN})) < keep.MAX_BODY_BYTES
    made = _save(client, ledger=full, learn=LEARN)
    assert made.status_code == 200
    assert len(_open(client, made.json()["id"]).json()["ledger"]["trades"]) == keep.MAX_TRADES


# ── throttling ──────────────────────────────────────────────────────────────


def test_calls_from_one_address_are_throttled(client, monkeypatch):
    monkeypatch.setattr(ratelimit, "KEEP_RATE_LIMIT", 3)
    monkeypatch.setattr(ratelimit, "_keep_ip_limiter", ratelimit.RateLimiter(3, 60))
    made = _save(client, ledger=_ledger()).json()
    assert _save(client, id=made["id"], ledger=_ledger()).status_code == 200
    assert _open(client, made["id"]).status_code == 200
    r = _save(client, id=made["id"], ledger=_ledger())
    assert r.status_code == 429 and r.json()["code"] == "slow_down" and int(r.headers["retry-after"]) > 0
    assert _open(client, made["id"]).status_code == 429


def test_new_copies_are_capped_per_day_but_updates_are_not(client, monkeypatch):
    monkeypatch.setattr(ratelimit, "KEEP_CREATE_DAILY_IP", 2)
    monkeypatch.setattr(ratelimit, "_keep_new_ip", ratelimit.DailyIPCounter(2))
    first = _save(client, ledger=_ledger()).json()
    assert _save(client, ledger=_ledger()).status_code == 200
    assert _save(client, ledger=_ledger()).status_code == 429
    assert len(keep._memory) == 2
    assert _save(client, id=first["id"], ledger=_ledger(trades=2)).status_code == 200


def test_the_whole_app_has_a_daily_cap_on_new_copies(client, monkeypatch):
    monkeypatch.setattr(ratelimit, "KEEP_CREATE_DAILY", 1)
    monkeypatch.setattr(ratelimit, "_keep_new_all", ratelimit.DailyCounter(1))
    assert _save(client, ledger=_ledger()).status_code == 200
    other_phone = {"X-Forwarded-For": "203.0.113.9"}
    assert client.post("/api/keep/save", json={"ledger": _ledger()}, headers=other_phone).status_code == 429


# ── the store ───────────────────────────────────────────────────────────────


class FakeRedis:
    """Just enough of Upstash's pipeline to check what is asked of it."""

    def __init__(self):
        self.data: dict[str, str] = {}
        self.calls: list[list] = []
        self.down = False

    def pipeline(self, commands):
        if self.down:
            return None
        out = []
        for cmd in commands:
            self.calls.append(cmd)
            name, key = cmd[0], cmd[1]
            if name == "SET":
                exists = key in self.data
                if ("NX" in cmd and exists) or ("XX" in cmd and not exists):
                    out.append(None)
                else:
                    self.data[key] = cmd[2]
                    out.append("OK")
            elif name == "GET":
                out.append(self.data.get(key))
            elif name == "INCR":
                self.data[key] = str(int(self.data.get(key, "0")) + 1)
                out.append(int(self.data[key]))
            else:  # EXPIRE
                out.append(1 if key in self.data else 0)
        return out


@pytest.fixture
def redis(client, monkeypatch):
    fake = FakeRedis()
    monkeypatch.setattr(keep.upstash, "enabled", lambda: True)
    monkeypatch.setattr(keep.upstash, "pipeline", fake.pipeline)
    return fake


def test_with_redis_a_copy_is_written_with_an_expiry_that_reads_and_saves_restart(client, redis):
    year = str(keep.KEEP_DAYS * 86400)
    made = _save(client, ledger=_ledger(), learn=LEARN).json()
    key = keep._key(made["id"])
    sets = [c for c in redis.calls if c[0] == "SET"]
    assert sets == [["SET", key, redis.data[key], "EX", year, "NX"]]  # new: never over an existing copy

    assert _open(client, made["id"]).json()["ledger"] == _ledger()
    assert ["GET", key] in redis.calls and ["EXPIRE", key, year] in redis.calls

    assert _save(client, id=made["id"], ledger=_ledger(trades=2)).status_code == 200
    assert [c for c in redis.calls if c[0] == "SET"][-1][3:] == ["EX", year, "XX"]  # update: only where a copy is
    assert keep._memory == {}

    # nothing but the hashed key and the rate counters ever names the wallet
    assert not any(made["id"] in str(c[1]) for c in redis.calls)


def test_with_redis_an_expired_copy_is_gone_for_reads_and_updates(client, redis):
    made = _save(client, ledger=_ledger()).json()
    del redis.data[keep._key(made["id"])]  # what the expiry does
    assert _open(client, made["id"]).status_code == 404
    assert _save(client, id=made["id"], ledger=_ledger()).status_code == 404
    assert keep._key(made["id"]) not in redis.data


def test_when_the_store_does_not_answer_nothing_is_promised(client, redis):
    made = _save(client, ledger=_ledger()).json()
    redis.down = True
    for r in (_save(client, ledger=_ledger()), _save(client, id=made["id"], ledger=_ledger()), _open(client, made["id"])):
        assert r.status_code == 503 and r.json()["code"] == "unavailable"


def test_on_vercel_without_a_store_nothing_is_promised(client, monkeypatch):
    monkeypatch.setenv("VERCEL", "1")
    r = _save(client, ledger=_ledger())
    assert r.status_code == 503 and r.json()["code"] == "unavailable"
    assert _open(client, keep.new_id()).status_code == 503
    assert keep._memory == {}


# ── counters ────────────────────────────────────────────────────────────────


def test_the_two_keep_counters_are_accepted_and_reported(monkeypatch):
    monkeypatch.setattr(stats.upstash, "enabled", lambda: False)
    monkeypatch.setattr(stats, "_memory", {})
    assert stats.client_field("keep", "created") == "keep:created"
    assert stats.client_field("keep", "opened") == "keep:opened"
    assert stats.client_field("keep", None) is None and stats.client_field("keep", "stolen") is None
    stats.bump("keep:created")
    stats.bump("keep:created")
    stats.bump("keep:opened")
    assert "Wallets kept with a link: 2 · opened from a link: 1" in stats.owner_report(7)
