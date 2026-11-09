"""Usage counters: daily totals, a fixed list of event names, private reads."""

from datetime import date

import pytest
from fastapi.testclient import TestClient

from server import stats, telegram_bot


@pytest.fixture(autouse=True)
def memory_store(monkeypatch):
    """Run every test against the in-memory store, never a real Redis."""
    monkeypatch.setattr(stats.upstash, "enabled", lambda: False)
    monkeypatch.setattr(stats, "_memory", {})


def test_bump_and_read_totals():
    stats.bump("visit:t", day="2026-11-09")
    stats.bump("visit:t", day="2026-11-10")
    stats.bump("scamcheck:high", day="2026-11-10")
    data = stats.read(days=2, today=date(2026, 11, 10))
    assert data["ok"] and data["from"] == "2026-11-09" and data["to"] == "2026-11-10"
    assert data["totals"] == {"scamcheck:high": 1, "visit:t": 2}
    assert data["days"]["2026-11-10"] == {"visit:t": 1, "scamcheck:high": 1}


def test_read_ignores_days_outside_the_window():
    stats.bump("ask", day="2026-10-01")
    assert stats.read(days=7, today=date(2026, 11, 10))["totals"] == {}


@pytest.mark.parametrize(
    "event,value,field",
    [
        ("visit", "t", "visit:t"),
        ("visit", "direct", "visit:direct"),
        ("view", "scamcheck", "view:scamcheck"),
        ("lesson_pass", None, "lesson_pass"),
        ("lesson_pass", "anything", "lesson_pass"),
        ("bot_click", "scam", "bot_click:scam"),
        ("share", "scam", "share:scam"),
    ],
)
def test_client_events_that_count(event, value, field):
    assert stats.client_field(event, value) == field


@pytest.mark.parametrize(
    "event,value",
    [
        ("visit", "x"),
        ("visit", None),
        ("view", "admin"),
        ("scamcheck", "high"),  # counted on the server, not reported by the browser
        ("bot_start", "t-scam"),
        ("made_up", None),
    ],
)
def test_client_events_that_are_refused(event, value):
    assert stats.client_field(event, value) is None


@pytest.mark.parametrize(
    "payload,field",
    [
        ("t-scam", "bot_start:t-scam"),
        ("web-footer", "bot_start:web-footer"),
        ("I-QUIZ", "bot_start:i-quiz"),
        ("", "bot_start:direct"),
        (None, "bot_start:direct"),
        ("free-money", "bot_start:other"),
        ("t-scam-extra", "bot_start:other"),
    ],
)
def test_bot_start_source(payload, field):
    assert stats.bot_start_field(payload) == field


def test_upstash_flat_hash_is_parsed():
    assert stats._as_counts(["visit:t", "3", "ask", "1", "bad", "x"]) == {"visit:t": 3, "ask": 1}


def test_owner_report_reads_like_a_note():
    stats.bump("visit:t")
    stats.bump("visit:i")
    stats.bump("scamcheck:high")
    stats.bump("bot_start:t-scam")
    report = stats.owner_report(7)
    assert "Visits: 2" in report and "TikTok 1" in report and "Instagram 1" in report
    assert "Scam checks on the site: 1" in report
    assert "Bot starts: 1" in report


@pytest.fixture
def client():
    from server.main import app

    return TestClient(app)


def test_event_endpoint_counts_known_events_only(client):
    assert client.post("/api/stats/event", json={"event": "visit", "value": "t"}).json() == {"ok": True}
    assert client.post("/api/stats/event", json={"event": "made_up"}).json() == {"ok": True}
    assert stats.read(1)["totals"] == {"visit:t": 1}


def test_stats_are_private_when_a_secret_is_set(client, monkeypatch):
    monkeypatch.setenv("JOBS_SECRET", "s3cret")
    monkeypatch.delenv("CRON_SECRET", raising=False)
    assert client.get("/api/stats").status_code == 401
    ok = client.get("/api/stats?days=3", headers={"Authorization": "Bearer s3cret"})
    assert ok.status_code == 200 and ok.json()["ok"] is True


@pytest.mark.parametrize(
    "text,expected",
    [
        ("hello", False),
        ("what is this", False),
        ("Join our VIP group, guaranteed 3% a day!", True),
        ("binance-support.com http://x.io", True),
        ("ربح مضمون 3% كل نهار ابعث USDT", True),
    ],
)
def test_bot_treats_pasted_messages_as_scam_checks(text, expected):
    assert telegram_bot.looks_like_a_message(text) is expected
