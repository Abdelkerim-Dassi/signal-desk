"""Practice wallet maths and habit-coach rules (server/paper.py). No network."""

import pytest

from server import paper
from server.paper import (
    FEE_RATE,
    SPREAD,
    TradeError,
    apply_buy,
    apply_sell,
    clean_wallet,
    coach,
    fill_price,
    quote_buy,
    quote_sell,
    value_wallet,
)

NOW = 1_800_000_000_000.0  # ms
HOUR = 3600 * 1000


TEN = 10.0  # the maths below is written for a 10 USDT wallet; the app's default start is paper.START_USDT


def fresh():
    return {"cash": TEN, "positions": {}}


# ── fees and spread ─────────────────────────────────────────────────────────


def test_rules_are_the_advertised_ones():
    assert paper.START_USDT == 1000.0
    assert FEE_RATE == 0.001
    assert SPREAD == 0.0005
    assert paper.MIN_TRADE_USDT == 1.0


def test_fill_price_spread_each_side():
    assert fill_price(100.0, "buy") == pytest.approx(100.05)
    assert fill_price(100.0, "sell") == pytest.approx(99.95)


def test_quote_buy_charges_fee_then_spread():
    q = quote_buy(100.0, 10.0)
    assert q["fee"] == pytest.approx(0.01)
    assert q["net"] == pytest.approx(9.99)
    assert q["price"] == pytest.approx(100.05)
    assert q["qty"] == pytest.approx(9.99 / 100.05)
    assert q["spread_cost"] == pytest.approx(q["qty"] * 0.05)
    # what you get, valued at the market price, is the spend minus both costs
    assert q["qty"] * 100.0 == pytest.approx(10.0 - q["fee"] - q["spread_cost"])


def test_quote_sell_charges_spread_then_fee():
    q = quote_sell(100.0, 0.1)
    assert q["price"] == pytest.approx(99.95)
    assert q["gross"] == pytest.approx(9.995)
    assert q["fee"] == pytest.approx(0.009995)
    assert q["net"] == pytest.approx(9.995 - 0.009995)
    assert q["spread_cost"] == pytest.approx(0.005)


def test_round_trip_at_flat_price_costs_about_0_3_percent():
    _, w = apply_buy(fresh(), "BTC", 50_000.0, 10.0)
    _, w = apply_sell(w, "BTC", 50_000.0, 1.0)
    assert w["positions"] == {}
    expected = 10 * (1 - FEE_RATE) / (1 + SPREAD) * (1 - SPREAD) * (1 - FEE_RATE)
    assert w["cash"] == pytest.approx(expected)
    assert 10 - w["cash"] == pytest.approx(0.03, abs=0.001)


# ── trade validation ────────────────────────────────────────────────────────


def test_buy_moves_cash_into_a_position_at_cost():
    fill, w = apply_buy(fresh(), "ETH", 2000.0, 4.0)
    assert w["cash"] == pytest.approx(6.0)
    assert w["positions"]["ETH"]["qty"] == pytest.approx(fill["qty"])
    assert w["positions"]["ETH"]["cost"] == pytest.approx(4.0)


def test_buy_below_minimum_is_refused():
    with pytest.raises(TradeError) as e:
        apply_buy(fresh(), "BTC", 50_000.0, 0.99)
    assert e.value.code == "min_trade"


def test_buy_more_than_cash_is_refused_no_leverage():
    with pytest.raises(TradeError) as e:
        apply_buy(fresh(), "BTC", 50_000.0, 10.5)
    assert e.value.code == "insufficient_cash"


def test_buy_whole_balance_leaves_zero_cash():
    _, w = apply_buy(fresh(), "BTC", 50_000.0, 10.0)
    assert w["cash"] == 0.0


def test_sell_without_position_is_refused_no_shorting():
    with pytest.raises(TradeError) as e:
        apply_sell(fresh(), "SOL", 150.0, 0.5)
    assert e.value.code == "no_position"


def test_partial_sell_reduces_qty_and_cost_proportionally():
    _, w = apply_buy(fresh(), "SOL", 150.0, 8.0)
    qty = w["positions"]["SOL"]["qty"]
    fill, w2 = apply_sell(w, "SOL", 150.0, 0.25)
    assert fill["qty"] == pytest.approx(qty * 0.25)
    assert w2["positions"]["SOL"]["qty"] == pytest.approx(qty * 0.75)
    assert w2["positions"]["SOL"]["cost"] == pytest.approx(6.0)
    assert w2["cash"] == pytest.approx(2.0 + fill["net"])


def test_partial_sell_below_minimum_is_refused_but_selling_all_is_not():
    _, w = apply_buy(fresh(), "SOL", 150.0, 1.5)
    with pytest.raises(TradeError) as e:
        apply_sell(w, "SOL", 150.0, 0.5)  # ~0.75 USDT
    assert e.value.code == "min_trade"
    _, w2 = apply_sell(w, "SOL", 150.0, 1.0)  # everything is fine
    assert "SOL" not in w2["positions"]


def test_clean_wallet_drops_junk_and_untracked_coins():
    w = clean_wallet({"cash": "abc", "positions": {"btc": {"qty": 0.1, "cost": 5}, "PEPE": {"qty": 9, "cost": 1}, "ETH": {"qty": -1}}})
    assert w["cash"] == paper.START_USDT
    assert list(w["positions"]) == ["BTC"]


# ── P&L ─────────────────────────────────────────────────────────────────────


def test_value_wallet_pnl_and_shares():
    w = {"cash": 4.0, "positions": {"BTC": {"qty": 0.0001, "cost": 5.0}, "ETH": {"qty": 0.0005, "cost": 1.0}}}
    v = value_wallet(w, {"BTC": 60_000.0, "ETH": 2_000.0}, TEN)
    assert v["value"] == pytest.approx(4 + 6 + 1)
    assert v["pnl"] == pytest.approx(1.0)
    assert v["pnl_pct"] == pytest.approx(10.0)
    btc = v["positions"][0]
    assert btc["base"] == "BTC"
    assert btc["pnl"] == pytest.approx(1.0)
    assert btc["pnl_pct"] == pytest.approx(20.0)
    assert btc["share"] == pytest.approx(6 / 11)


def test_value_wallet_loss():
    w = {"cash": 0.0, "positions": {"SOL": {"qty": 0.05, "cost": 10.0}}}
    v = value_wallet(w, {"SOL": 150.0}, TEN)
    assert v["value"] == pytest.approx(7.5)
    assert v["pnl"] == pytest.approx(-2.5)
    assert v["pnl_pct"] == pytest.approx(-25.0)


def test_btc_hold_line():
    hold_qty = quote_buy(50_000.0, 10.0)["qty"]
    v = value_wallet(fresh(), {"BTC": 55_000.0}, TEN, btc_hold_qty=hold_qty)
    assert v["btc_hold_value"] == pytest.approx(hold_qty * 55_000.0)
    assert v["btc_hold_pnl_pct"] == pytest.approx((hold_qty * 55_000.0 / 10 - 1) * 100)
    # untouched cash: no gain, no loss
    assert v["pnl"] == 0.0


def test_btc_hold_line_absent_without_benchmark():
    v = value_wallet(fresh(), {"BTC": 55_000.0}, TEN)
    assert v["btc_hold_value"] is None


# ── habit coach ─────────────────────────────────────────────────────────────

CALM = {"change_7d": 2.0, "change_24h": 0.5, "risk": "low"}
PRICES = {"BTC": 50_000.0, "ETH": 2_000.0, "DOGE": 0.2}


def ids(notes):
    return [n["id"] for n in notes]


def run(side, base, coin, weather="calm", wallet=None, recent=()):
    wallet = wallet or {"cash": 8.0, "positions": {base: {"qty": 2.0 / PRICES[base], "cost": 2.0}}}
    return coach(side, base, coin, weather, wallet, PRICES, list(recent), NOW)


def test_calm_small_trade_gets_no_notes():
    assert run("buy", "BTC", CALM) == []


def test_fomo_after_big_week():
    notes = run("buy", "ETH", {**CALM, "change_7d": 22.4})
    assert notes[0] == {"id": "fomo", "base": "ETH", "pct": 22.4}


def test_no_fomo_at_threshold_or_on_sells():
    assert "fomo" not in ids(run("buy", "ETH", {**CALM, "change_7d": 15.0}))
    assert "fomo" not in ids(run("sell", "ETH", {**CALM, "change_7d": 30.0}))


def test_panic_sell_after_drop():
    notes = run("sell", "DOGE", {**CALM, "change_24h": -12.3})
    assert notes == [{"id": "panic", "base": "DOGE", "pct": -12.3}]


def test_no_panic_on_small_drop_or_on_buys():
    assert "panic" not in ids(run("sell", "DOGE", {**CALM, "change_24h": -9.9}))
    assert "panic" not in ids(run("buy", "DOGE", {**CALM, "change_24h": -20.0}))


def test_concentration_over_half():
    wallet = {"cash": 4.0, "positions": {"BTC": {"qty": 6.0 / 50_000, "cost": 6.0}}}
    notes = run("buy", "BTC", CALM, wallet=wallet)
    assert notes == [{"id": "concentration", "base": "BTC", "pct": 60}]


def test_no_concentration_at_half_or_after_sell():
    half = {"cash": 5.0, "positions": {"BTC": {"qty": 5.0 / 50_000, "cost": 5.0}}}
    assert "concentration" not in ids(run("buy", "BTC", CALM, wallet=half))
    heavy = {"cash": 1.0, "positions": {"BTC": {"qty": 9.0 / 50_000, "cost": 9.0}}}
    assert "concentration" not in ids(run("sell", "BTC", CALM, wallet=heavy))


def test_high_risk_buy_in_storm():
    notes = run("buy", "DOGE", {**CALM, "risk": "high"}, weather="stormy")
    assert notes == [{"id": "storm", "base": "DOGE"}]


def test_no_storm_note_when_choppy_or_low_risk():
    assert "storm" not in ids(run("buy", "DOGE", {**CALM, "risk": "high"}, weather="choppy"))
    assert "storm" not in ids(run("buy", "DOGE", {**CALM, "risk": "medium"}, weather="stormy"))


def test_overtrading_counts_last_24h_including_this_trade():
    four = [NOW - i * HOUR for i in range(1, 5)]
    notes = run("buy", "BTC", CALM, recent=four)
    assert notes == [{"id": "overtrading", "count": 5}]


def test_no_overtrading_with_old_trades():
    three_recent = [NOW - HOUR, NOW - 2 * HOUR, NOW - 3 * HOUR]
    old = [NOW - 25 * HOUR, NOW - 30 * HOUR]
    assert "overtrading" not in ids(run("sell", "BTC", CALM, recent=three_recent + old))


def test_several_notes_at_once():
    wallet = {"cash": 2.0, "positions": {"DOGE": {"qty": 8.0 / 0.2, "cost": 8.0}}}
    coin = {"change_7d": 40.0, "change_24h": 5.0, "risk": "high"}
    notes = run("buy", "DOGE", coin, weather="stormy", wallet=wallet, recent=[NOW - i * HOUR for i in range(1, 6)])
    assert ids(notes) == ["fomo", "concentration", "storm", "overtrading"]



def test_a_missing_wallet_starts_with_the_default_amount():
    w = clean_wallet(None)
    assert w == {"cash": paper.START_USDT, "positions": {}}
    v = value_wallet(w, {"BTC": 50_000.0})
    assert v["pnl"] == pytest.approx(0.0)


def test_a_chosen_start_amount_is_the_baseline():
    w = {"cash": 500.0, "positions": {}}
    _, w = apply_buy(w, "BTC", 50_000.0, 500.0)
    v = value_wallet(w, {"BTC": 50_000.0}, 500.0)
    assert v["pnl_pct"] == pytest.approx(-0.15, abs=0.01)  # one buy costs fee + spread


# ── the two routes the screen calls (no network: the market is faked) ───────


def _fake_market():
    return {
        "coins": [
            {"base": "BTC", "name": "Bitcoin", "price": 50_000.0, "change_24h": 0.0, "change_7d": 1.0, "karat": 24, "risk": "low"},
        ],
        "weather": "calm",
        "tnd_rate": 3.0,
        "tnd_live": True,
        "rules": {},
    }


@pytest.fixture
def client(monkeypatch):
    from fastapi.testclient import TestClient

    from server import main, stats

    monkeypatch.setattr(stats.upstash, "enabled", lambda: False)
    monkeypatch.setattr(stats, "_memory", {})
    monkeypatch.setattr(paper, "market", _fake_market)
    return TestClient(main.app)


def _trades_counted():
    from server import stats

    return stats.read(1)["totals"].get("practice_trade", 0)


def test_only_confirmed_trades_are_counted(client):
    order = {"side": "buy", "base": "BTC", "usdt": 100, "wallet": {"cash": 1000, "positions": {}}}
    # the form asks for a preview on every coin or amount change
    for _ in range(3):
        r = client.post("/api/paper/quote", json={**order, "preview": True})
        assert r.status_code == 200 and r.json()["wallet_after"]["cash"] == pytest.approx(900)
    assert _trades_counted() == 0
    r = client.post("/api/paper/quote", json=order)
    assert r.status_code == 200
    assert _trades_counted() == 1


def test_a_refused_trade_is_not_counted(client):
    r = client.post("/api/paper/quote", json={"side": "buy", "base": "BTC", "usdt": 5000, "wallet": {"cash": 1000, "positions": {}}})
    assert r.status_code == 400 and r.json()["code"] == "insufficient_cash"
    assert _trades_counted() == 0


def test_state_reads_a_senseless_start_amount_as_the_default(client):
    for bad in (0, -50, 1e12):
        r = client.post("/api/paper/state", json={"wallet": {"cash": 1000, "positions": {}}, "start_usdt": bad})
        assert r.status_code == 200
        assert r.json()["valuation"]["pnl"] == pytest.approx(0.0)


def test_state_fails_cleanly_when_prices_are_down(client, monkeypatch):
    def down():
        raise RuntimeError("binance unreachable")

    monkeypatch.setattr(paper, "market", down)
    r = client.post("/api/paper/state", json={})
    assert r.status_code == 502 and r.json()["code"] == "price_unavailable"
