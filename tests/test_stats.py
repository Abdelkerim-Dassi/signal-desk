"""Usage counters: daily totals, a fixed list of event names, private reads."""

import re
from datetime import date
from pathlib import Path

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
        ("visit", "y", "visit:y"),
        ("visit", "m", "visit:m"),
        ("visit", "s", "visit:s"),
        ("view", "learn", "view:learn"),
        ("view", "home", "view:home"),
        ("story", "same-trade", "story:same-trade"),
        ("social", "tiktok", "social:tiktok"),
        ("start", "shown", "start:shown"),
        ("start", "lesson", "start:lesson"),
        ("start", "practice", "start:practice"),
        ("lesson_pass", None, "lesson_pass"),
        ("lesson_pass", "anything", "lesson_pass"),
        ("practice_first", "tap", "practice_first:tap"),
        ("practice_first", "form", "practice_first:form"),
        ("bot_click", "quiz", "bot_click:quiz"),
        ("share", "practice", "share:practice"),
        ("share", "lesson", "share:lesson"),
        ("chat_open", "learn", "chat_open:learn"),
        ("chat_open", "practice", "chat_open:practice"),
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
        ("view", "scamcheck"),  # the Scam check screen was removed on 2026-11-20
        ("view", "ask"),  # Ask is the bubble now, counted as chat_open
        ("bot_click", "scam"),
        ("chat_open", None),
        ("chat_open", "admin"),
        ("start", "scam"),
        ("story", "other"),
        ("social", "x"),
        ("start", None),
        ("practice_first", None),
        ("practice_first", "twice"),
        ("share", None),
        ("share", "scam"),  # the Scam check's share button left with it on 2026-11-20
        ("share", "whatsapp"),
        ("practice_trade", None),  # counted on the server, when a trade is confirmed
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
        ("y-footer", "bot_start:y-footer"),
        ("m-practice", "bot_start:m-practice"),
        ("s-quiz", "bot_start:s-quiz"),
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
    stats.bump("chat_open:learn")
    stats.bump("ask")
    stats.bump("ask")
    stats.bump("bot_start:t-scam")
    stats.bump("start:shown")
    stats.bump("start:shown")
    stats.bump("start:lesson")
    stats.bump("practice_trade")
    stats.bump("practice_trade")
    stats.bump("practice_first:tap")
    report = stats.owner_report(7)
    assert "Visits: 2" in report and "TikTok 1" in report and "Instagram 1" in report
    assert "Start here shown: 2 · lesson 1 tapped: 1 · practice tapped: 0" in report
    assert "Scam" not in report
    assert "Ask Qirat opened: 1  (learn 1) · questions asked: 2" in report
    assert "Practice trades: 2" in report and "First practice trades: 1  (tap 1)" in report
    assert "Bot starts: 1" in report


def test_owner_report_shows_the_new_links_and_sends_to_a_friend():
    stats.bump("visit:m")
    stats.bump("visit:s")
    stats.bump("visit:s")
    stats.bump("share:practice")
    stats.bump("share:lesson")
    stats.bump("share:lesson")
    report = stats.owner_report(7)
    assert "Shared by a visitor 2" in report and "Instagram message 1" in report
    assert "Sent to a friend on WhatsApp: 3  (lesson 2, practice 1) · visits from those messages: 2" in report


def test_every_short_address_on_the_site_is_counted_by_the_server():
    """frontend/src/lib/source.ts maps qirat.tn/<letter> to a source; a letter the
    server does not know would be counted as nothing."""
    text = (Path(__file__).resolve().parent.parent / "frontend/src/lib/source.ts").read_text(encoding="utf-8")
    paths = re.search(r"const PATHS: Record<string, Source> = \{([^}]*)\}", text)
    assert paths, "PATHS not found in source.ts"
    letters = re.findall(r"'/(\w+)': '(\w+)'", paths.group(1))
    assert {path for path, _ in letters} >= {"t", "i", "f", "w", "y", "m", "s"}
    for path, source in letters:
        assert path == source and source in stats.SOURCES, path


@pytest.fixture
def client():
    from server.main import app

    return TestClient(app)


def test_event_endpoint_counts_known_events_only(client):
    assert client.post("/api/stats/event", json={"event": "visit", "value": "t"}).json() == {"ok": True}
    assert client.post("/api/stats/event", json={"event": "made_up"}).json() == {"ok": True}
    assert client.post("/api/stats/event", json={"event": "practice_first", "value": "tap"}).json() == {"ok": True}
    assert stats.read(1)["totals"] == {"practice_first:tap": 1, "visit:t": 1}


def test_stats_are_private_when_a_secret_is_set(client, monkeypatch):
    monkeypatch.setenv("JOBS_SECRET", "s3cret")
    monkeypatch.delenv("CRON_SECRET", raising=False)
    assert client.get("/api/stats").status_code == 401
    ok = client.get("/api/stats?days=3", headers={"Authorization": "Bearer s3cret"})
    assert ok.status_code == 200 and ok.json()["ok"] is True


def test_owner_read_key_opens_the_counters_and_nothing_else(client, monkeypatch):
    import hashlib

    from server import main

    monkeypatch.setenv("JOBS_SECRET", "s3cret")
    monkeypatch.delenv("CRON_SECRET", raising=False)
    monkeypatch.setattr(main, "STATS_READER_SHA256", hashlib.sha256(b"reader-key").hexdigest())
    assert client.get("/api/stats", headers={"X-Stats-Key": "wrong"}).status_code == 401
    assert client.get("/api/stats", headers={"X-Stats-Key": ""}).status_code == 401
    ok = client.get("/api/stats?days=3", headers={"X-Stats-Key": "reader-key"})
    assert ok.status_code == 200 and ok.json()["ok"] is True
    # the read key is not a job key: scheduled jobs still need their own secret
    assert client.get("/api/cron/snapshot", headers={"X-Stats-Key": "reader-key"}).status_code == 401


def test_bot_answers_a_pasted_message_with_its_help(monkeypatch):
    """Since the Scam check was removed (2026-11-20), text the bot does not
    understand gets the help message, never a verdict on the message."""
    sent = []
    monkeypatch.setattr(telegram_bot, "send", lambda chat_id, text, buttons=None: sent.append(text))
    monkeypatch.setattr(telegram_bot, "ensure_chat", lambda chat, user: {"lang": "en", "watch": []})
    pasted = "Join our VIP group today, guaranteed 3% a day! Send USDT to this wallet: http://x.io"
    telegram_bot.handle_message({"chat": {"id": 1, "type": "private"}, "text": pasted})
    assert sent == [telegram_bot.t("en", "help")]
    assert "scam" not in sent[0].lower()
