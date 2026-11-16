"""Time machine: a real past month replayed with pretend money."""

import json
import re
import shutil
import subprocess
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from server import paper, replay, stats

ROOT = Path(__file__).resolve().parent.parent
LIB = ROOT / "frontend" / "src" / "lib"


@pytest.fixture
def client():
    from server.main import app

    return TestClient(app)


def _m1():
    return replay.scenarios()["m1"]


# a month of ordinary play: buys, part sells, a sell-all, a buy with everything left
MOVES = [
    {"day": 0, "side": "buy", "coin": "A", "usdt": 250.0},
    {"day": 0, "side": "buy", "coin": "D", "usdt": 375.0},
    {"day": 4, "side": "buy", "coin": "B", "usdt": 187.5},
    {"day": 9, "side": "sell", "coin": "B", "fraction": 0.5},
    {"day": 14, "side": "sell", "coin": "D", "fraction": 1},
    {"day": 14, "side": "buy", "coin": "C", "usdt": 100.0},
    {"day": 22, "side": "sell", "coin": "A", "fraction": 0.25},
    {"day": 29, "side": "sell", "coin": "C", "fraction": 1},
]


# ── the scenarios ───────────────────────────────────────────────────────────


def test_there_are_two_scenarios_of_thirty_days_with_bitcoin_in_each():
    all_ = replay.scenarios()
    assert set(all_) == {"m1", "m2"} == stats.REPLAYS
    for sc in all_.values():
        assert sc["days"] == 30 and sc["pre"] == 7
        assert [c["key"] for c in sc["coins"]] == ["A", "B", "C", "D"]
        assert sum(c["base"] == "BTC" for c in sc["coins"]) == 1
        for c in sc["coins"]:
            assert len(c["index"]) == 38 and c["index"][7] == 100.0 and min(c["index"]) > 0
            assert c["base"] in paper.GRADE_UNIVERSE


def test_what_the_browser_holds_is_blind_and_matches_the_server():
    """replayData.ts is generated from the same closes: same letters and prices, no name, no date."""
    text = (LIB / "replayData.ts").read_text(encoding="utf-8")
    in_app = json.loads(text[text.index("export const REPLAYS = ") + len("export const REPLAYS = ") :])
    assert in_app == [replay.blind(sc) for sc in replay.scenarios().values()]
    for sc in replay.scenarios().values():
        for word in [sc["event"], sc["from"], sc["from"][:4]] + [c["base"] for c in sc["coins"]]:
            assert word not in text.split("export const REPLAYS")[1]


def test_the_app_plays_by_the_practice_wallets_rules():
    text = (LIB / "replayEngine.ts").read_text(encoding="utf-8")
    found = re.search(r"startUsdt: ([\d.]+), feeRate: ([\d.]+), spread: ([\d.]+), minTradeUsdt: ([\d.]+)", text)
    assert found and [float(x) for x in found.groups()] == [replay.START_USDT, paper.FEE_RATE, paper.SPREAD, paper.MIN_TRADE_USDT]


# ── playing a month ─────────────────────────────────────────────────────────


def test_doing_nothing_keeps_the_start_and_bitcoin_is_held_from_day_0():
    sc = _m1()
    out = replay.run(sc, [])
    assert out["value"] == 1000.0 and out["pct"] == 0 and out["trades"] == 0 and out["costs"] == 0 and out["notes"] == []
    assert [p["day"] for p in out["curve"]] == list(range(31))
    btc = next(c["index"] for c in sc["coins"] if c["base"] == "BTC")
    qty = paper.quote_buy(100.0, 1000.0)["qty"]
    assert out["curve"][0]["hold"] == pytest.approx(qty * 100.0) and out["curve"][0]["hold"] < 1000.0  # fee and spread, once
    assert out["hold_value"] == pytest.approx(qty * btc[-1])
    assert out["hold_pct"] == pytest.approx(out["hold_value"] / 10 - 100)


def test_a_buy_held_to_the_end_follows_the_coin_less_the_fee_and_spread():
    sc = _m1()
    out = replay.run(sc, [{"day": 0, "side": "buy", "coin": "D", "usdt": 1000.0}])
    d = next(c["index"] for c in sc["coins"] if c["key"] == "D")
    fill = paper.quote_buy(100.0, 1000.0)
    assert out["value"] == pytest.approx(fill["qty"] * d[-1])
    assert out["trades"] == 1 and out["costs"] == pytest.approx(fill["fee"] + fill["spread_cost"])
    assert out["curve"][0]["value"] == pytest.approx(1000.0 - out["costs"])


def test_moves_are_priced_on_their_own_day():
    sc = _m1()
    a = next(c["index"] for c in sc["coins"] if c["key"] == "A")
    out = replay.run(sc, [{"day": 3, "side": "buy", "coin": "A", "usdt": 500.0}, {"day": 12, "side": "sell", "coin": "A", "fraction": 1}])
    bought = paper.quote_buy(a[7 + 3], 500.0)
    sold = paper.quote_sell(a[7 + 12], bought["qty"])
    assert out["value"] == pytest.approx(500.0 + sold["net"])
    assert out["curve"][2]["value"] == 1000.0 and out["curve"][30]["value"] == out["value"]


def test_a_move_the_wallet_cannot_make_is_left_out_and_counted():
    sc = _m1()
    bad = [
        {"day": 0, "side": "buy", "coin": "A", "usdt": 5000.0},  # more than the cash
        {"day": 1, "side": "sell", "coin": "B", "fraction": 1},  # nothing held
        {"day": 2, "side": "buy", "coin": "Z", "usdt": 10.0},  # no such coin
        {"day": 2, "side": "buy", "coin": "A", "usdt": float("nan")},
        {"day": 30, "side": "buy", "coin": "A", "usdt": 10.0},  # the month is over
        {"day": 1, "side": "buy", "coin": "A", "usdt": 10.0},  # out of order
    ]
    out = replay.run(sc, bad)
    assert out["value"] == 1000.0 and out["trades"] == 0 and out["skipped"] == len(bad)


def test_habit_notes_keep_the_clearest_time_of_each_and_name_the_real_coin():
    sc = _m1()
    doge = next(c for c in sc["coins"] if c["base"] == "DOGE")
    # the day the coin had risen most over seven days, and a calmer day before it
    rises = {d: doge["index"][7 + d] / doge["index"][d] * 100 - 100 for d in range(30)}
    top = max(rises, key=rises.get)
    assert rises[top] > paper.FOMO_7D_PCT
    earlier = next(d for d in range(top) if paper.FOMO_7D_PCT < rises[d] < rises[top])
    out = replay.run(
        sc,
        [{"day": earlier, "side": "buy", "coin": doge["key"], "usdt": 100.0}, {"day": top, "side": "buy", "coin": doge["key"], "usdt": 100.0}],
    )
    fomo = [n for n in out["notes"] if n["id"] == "fomo"]
    assert fomo == [{"id": "fomo", "base": "DOGE", "name": "Dogecoin", "pct": round(rises[top], 1), "day": top}]


def test_five_trades_on_one_day_is_noted_once_with_its_day():
    out = replay.run(_m1(), [{"day": 6, "side": "buy", "coin": "A", "usdt": 10.0}] * 6)
    assert [n for n in out["notes"] if n["id"] == "overtrading"] == [{"id": "overtrading", "count": 6, "day": 6}]


def test_the_reveal_names_the_coins_and_the_dates():
    r = replay.reveal(_m1())
    assert r["event"] == "ftx" and r["from"] == "2022-10-25" and r["to"] == "2022-11-24"
    assert [(c["key"], c["base"], c["name"]) for c in r["coins"]] == [
        ("A", "ETH", "Ethereum"),
        ("B", "DOGE", "Dogecoin"),
        ("C", "BTC", "Bitcoin"),
        ("D", "SOL", "Solana"),
    ]
    sol = r["coins"][3]["pct"]
    assert -60 < sol < -45  # the coin that lost about half
    assert replay.reveal(replay.scenarios()["m2"])["from"] == "2024-11-04"


# ── HTTP ────────────────────────────────────────────────────────────────────


def test_finish_answers_with_the_result_and_the_reveal(client):
    r = client.post("/api/replay/finish", json={"id": "m1", "moves": MOVES})
    assert r.status_code == 200 and r.headers["cache-control"] == "no-store"
    body = r.json()
    assert body["ok"] is True and body["reveal"] == replay.reveal(_m1())
    assert body["result"] == json.loads(json.dumps(replay.run(_m1(), MOVES)))
    assert body["result"]["trades"] == len(MOVES) and body["result"]["skipped"] == 0


def test_finish_refuses_an_unknown_scenario_and_an_endless_list(client):
    assert client.post("/api/replay/finish", json={"id": "m9", "moves": []}).status_code == 404
    too_many = [{"day": 0, "side": "buy", "coin": "A", "usdt": 1.0}] * (replay.MAX_MOVES + 1)
    assert client.post("/api/replay/finish", json={"id": "m1", "moves": too_many}).status_code == 422
    assert client.post("/api/replay/finish", json={"id": "m1", "moves": [{"day": 0, "side": "short", "coin": "A"}]}).status_code == 422


def test_finishing_a_game_counts_nothing_on_the_server(client, monkeypatch):
    monkeypatch.setattr(stats.upstash, "enabled", lambda: False)
    monkeypatch.setattr(stats, "_memory", {})
    client.post("/api/replay/finish", json={"id": "m1", "moves": MOVES})
    assert stats.read(1)["totals"] == {}  # the app reports it, so a browser marked as ours stays out


def test_the_time_machine_counters_are_accepted_and_reported(monkeypatch):
    monkeypatch.setattr(stats.upstash, "enabled", lambda: False)
    monkeypatch.setattr(stats, "_memory", {})
    for event in ("replay_start", "replay_done", "replay_again", "replay_share", "replay_arrive"):
        assert stats.client_field(event, "m1") == f"{event}:m1"
        assert stats.client_field(event, "m3") is None and stats.client_field(event, None) is None
    assert stats.client_field("view", "replay") == "view:replay"
    for field in ("replay_start:m1", "replay_start:m1", "replay_start:m2", "replay_done:m1", "replay_again:m1", "replay_share:m1"):
        stats.bump(field)
    report = stats.owner_report(7)
    assert "Time machine: started by 3  (m1 2, m2 1) · finished by 1  (m1 1)" in report
    assert "Time machine: played again 1 · results shared 1 · first visits on a shared link 0" in report


# ── the copy of the maths in the app ────────────────────────────────────────

NODE = shutil.which("node")


@pytest.mark.skipif(NODE is None, reason="node is not installed")
def test_the_app_and_the_server_get_the_same_month(tmp_path):
    """frontend/src/lib/replayEngine.ts is a copy of server/paper.py's rules.
    Play the same moves through both and compare the wallet on every day."""
    script = tmp_path / "play.mjs"
    script.write_text(
        f"""
import {{ REPLAYS }} from {json.dumps((LIB / "replayData.ts").as_uri())}
import {{ applyMove, freshWallet, valueOn }} from {json.dumps((LIB / "replayEngine.ts").as_uri())}
const moves = {json.dumps(MOVES)}
const out = {{}}
for (const sc of REPLAYS) {{
  let wallet = freshWallet()
  let costs = 0
  const values = []
  for (let day = 0; day <= sc.days; day++) {{
    for (const move of moves.filter((m) => m.day === day)) {{
      const done = applyMove(sc, wallet, move)
      if ('error' in done) throw new Error(done.error)
      wallet = done.wallet
      costs += done.fill.fee + done.fill.spread_cost
    }}
    values.push(valueOn(sc, wallet, day))
  }}
  out[sc.id] = {{ values, costs }}
}}
console.log(JSON.stringify(out))
""",
        encoding="utf-8",
    )
    done = subprocess.run([NODE, "--no-warnings", str(script)], capture_output=True, text=True, timeout=60)
    if done.returncode != 0 and "ERR_UNKNOWN_FILE_EXTENSION" in done.stderr:
        pytest.skip("this node cannot load TypeScript files")
    assert done.returncode == 0, done.stderr
    in_app = json.loads(done.stdout)
    for sc_id, sc in replay.scenarios().items():
        ours = replay.run(sc, MOVES)
        assert ours["skipped"] == 0
        assert in_app[sc_id]["values"] == pytest.approx([p["value"] for p in ours["curve"]], rel=1e-12)
        assert in_app[sc_id]["costs"] == pytest.approx(ours["costs"], rel=1e-12)
