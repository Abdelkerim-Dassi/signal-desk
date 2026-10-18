"""Daily marketing posts with one-tap approval in Telegram.

The week's posts live in ``marketing/queue.json`` (in the repo). Each morning
the bot sends the owner every post dated today, with the media and the text for
each platform, and two buttons. ✅ publishes the Telegram version to the
channel (and to the Facebook Page when FB_PAGE_ID/FB_PAGE_TOKEN are set) and
marks the post approved; the X and TikTok versions are then picked up from
``/api/marketing/queue`` by the browser posting run. ⏭ skips it.

The queue is read from GitHub, so adding posts is a git push, no redeploy.
Media is either a repo path (served from raw.githubusercontent.com) or
``live:today`` / ``live:report`` — the share card built from today's data.
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import requests

from . import telegram_bot as bot
from .cache import TTLCache

REPO_RAW = os.getenv(
    "MARKETING_RAW_BASE", "https://raw.githubusercontent.com/Abdelkerim-Dassi/signal-desk/main"
)
QUEUE_PATH = "marketing/queue.json"
LOCAL_QUEUE = Path(__file__).resolve().parent.parent / QUEUE_PATH
LIVE_CARDS = {"live:today": "/api/card/today.png", "live:report": "/api/card/report.png"}
VIDEO_EXT = (".mp4", ".mov")

_queue_cache = TTLCache()


def load_queue() -> list[dict[str, Any]]:
    """The post queue, from GitHub (cached 10 min); the local file when offline."""
    cached = _queue_cache.get("queue")
    if cached is not None:
        return cached
    items: list[dict[str, Any]] = []
    try:
        resp = requests.get(f"{REPO_RAW}/{QUEUE_PATH}", timeout=8)
        resp.raise_for_status()
        items = resp.json().get("items", [])
    except Exception:
        if LOCAL_QUEUE.exists():
            items = json.loads(LOCAL_QUEUE.read_text(encoding="utf-8")).get("items", [])
    _queue_cache.set("queue", items, ttl=600)
    return items


def media_url(item: dict[str, Any]) -> str | None:
    media = item.get("media")
    if not media:
        return None
    if media in LIVE_CARDS:
        return f"{bot.APP_URL}{LIVE_CARDS[media]}?lang={item.get('lang', 'en')}"
    return f"{REPO_RAW}/{media}"


def is_video(item: dict[str, Any]) -> bool:
    return str(item.get("media", "")).lower().endswith(VIDEO_EXT)


# ── state (Upstash) ─────────────────────────────────────────────────────────


def owner() -> str | None:
    return bot._get("mk:owner")


def claim_owner(chat_id: int | str) -> bool:
    """The first private chat to send /claim becomes the owner; later claims fail."""
    current = owner()
    if current:
        return current == str(chat_id)
    bot._set("mk:owner", str(chat_id))
    return True


def status(item_id: str) -> dict[str, Any] | None:
    raw = bot._get(f"mk:status:{item_id}")
    return json.loads(raw) if raw else None


def set_status(item_id: str, value: str, **extra: Any) -> None:
    data = {"status": value, "at": datetime.now(timezone.utc).isoformat(timespec="seconds"), **extra}
    bot._set(f"mk:status:{item_id}", json.dumps(data))


def queue_with_status(day: str | None = None) -> list[dict[str, Any]]:
    """Queue items (optionally for one day) with their approval status attached."""
    return [
        {**item, "media_url": media_url(item), "state": status(item["id"])}
        for item in load_queue()
        if day is None or item.get("date") == day
    ]


# ── sending ─────────────────────────────────────────────────────────────────


def _send_media(chat_id: int | str, item: dict[str, Any], caption: str,
                buttons: list[list[dict[str, Any]]] | None = None) -> dict[str, Any]:
    url = media_url(item)
    if not url:
        return bot.send(chat_id, caption, buttons)
    params: dict[str, Any] = {"chat_id": chat_id, "caption": caption[:1024], "parse_mode": "HTML"}
    if buttons:
        params["reply_markup"] = {"inline_keyboard": buttons}
    if is_video(item):
        return bot.api("sendVideo", video=url, supports_streaming=True, **params)
    return bot.api("sendPhoto", photo=url, **params)


def preview_text(item: dict[str, Any]) -> str:
    parts = [f"<b>📝 {bot.esc(item.get('title', item['id']))}</b> · {item.get('date', '')}"]
    for key, label in (("telegram", "Telegram + Facebook"), ("x", "X"), ("x_reply", "X first reply"),
                       ("tiktok", "TikTok caption")):
        if item.get(key):
            parts += ["", f"<b>{label}</b>", f"<code>{bot.esc(item[key])}</code>"]
    return "\n".join(parts)


def approval_buttons(item_id: str) -> list[list[dict[str, Any]]]:
    return [[{"text": "✅ Approve & post", "callback_data": f"mk:ok:{item_id}"},
             {"text": "⏭ Skip", "callback_data": f"mk:skip:{item_id}"}]]


def send_drafts(day: str | None = None, force: bool = False) -> dict[str, Any]:
    """Send the owner today's posts for approval (once per day unless forced)."""
    day = day or datetime.now(timezone.utc).date().isoformat()
    chat = owner()
    if not chat:
        return {"sent": 0, "reason": "no owner yet: send /claim to the bot"}
    items = [i for i in load_queue() if i.get("date") == day and not status(i["id"])]
    if not items:
        return {"sent": 0, "reason": "nothing queued"}
    if not force and not bot._claim("drafts", day):
        return {"sent": 0, "reason": "already sent"}
    sent = 0
    for item in items:
        text, buttons = preview_text(item), approval_buttons(item["id"])
        res = _send_media(chat, item, text, buttons) if len(text) <= 1024 else {"ok": False}
        if not res.get("ok"):  # too long for a caption, or media refused: media, then text
            if media_url(item):
                _send_media(chat, item, "")
            res = bot.send(chat, text, buttons)
        sent += bool(res.get("ok"))
    return {"sent": sent, "items": len(items)}


def post_facebook(item: dict[str, Any]) -> dict[str, Any] | None:
    page, token = os.getenv("FB_PAGE_ID"), os.getenv("FB_PAGE_TOKEN")
    if not (page and token and item.get("telegram")):
        return None
    base = f"https://graph.facebook.com/v21.0/{page}"
    url, text = media_url(item), item["telegram"]
    try:
        if url and is_video(item):
            resp = requests.post(f"{base}/videos", data={"file_url": url, "description": text,
                                                         "access_token": token}, timeout=30)
        elif url:
            resp = requests.post(f"{base}/photos", data={"url": url, "caption": text,
                                                         "access_token": token}, timeout=30)
        else:
            resp = requests.post(f"{base}/feed", data={"message": text, "access_token": token}, timeout=20)
        return {"ok": resp.ok, "detail": resp.json()}
    except Exception as exc:
        return {"ok": False, "detail": str(exc)}


def publish(item: dict[str, Any]) -> list[str]:
    """Post an approved item to the Telegram channel (and Facebook); returns what happened."""
    done: list[str] = []
    if item.get("telegram"):
        res = _send_media(bot.CHANNEL, item, bot.esc(item["telegram"]),
                          [[bot.app_button(item.get("lang", "en"))]])
        done.append("Telegram channel ✅" if res.get("ok") else f"Telegram channel ❌ {res.get('description', '')}")
    fb = post_facebook(item)
    if fb is not None:
        done.append("Facebook Page ✅" if fb["ok"] else f"Facebook Page ❌ {str(fb['detail'])[:120]}")
    if item.get("x") or item.get("tiktok"):
        done.append("X / TikTok: queued for the browser run")
    return done


def handle_callback(cb: dict[str, Any]) -> bool:
    """Approve/skip buttons. Returns True when the callback was a marketing one."""
    action = cb.get("data") or ""
    if not action.startswith("mk:"):
        return False
    _, verb, item_id = action.split(":", 2)
    user_id = str((cb.get("from") or {}).get("id", ""))
    msg = cb.get("message") or {}
    chat_id = (msg.get("chat") or {}).get("id")
    if user_id != owner():
        bot.api("answerCallbackQuery", callback_query_id=cb["id"], text="Only the owner can approve posts.")
        return True
    item = next((i for i in load_queue() if i["id"] == item_id), None)
    if item is None:
        bot.api("answerCallbackQuery", callback_query_id=cb["id"], text="That post is no longer in the queue.")
        return True
    if status(item_id):
        bot.api("answerCallbackQuery", callback_query_id=cb["id"], text=f"Already {status(item_id)['status']}.")
        return True
    bot.api("answerCallbackQuery", callback_query_id=cb["id"])
    if verb == "ok":
        set_status(item_id, "approved")
        lines = publish(item)
        note = "✅ <b>Approved</b>\n" + "\n".join(f"• {bot.esc(x)}" for x in lines)
    else:
        set_status(item_id, "skipped")
        note = "⏭ Skipped."
    # drop the buttons so a second tap can't double-post, then report
    bot.api("editMessageReplyMarkup", chat_id=chat_id, message_id=msg.get("message_id"),
            reply_markup={"inline_keyboard": []})
    bot.send(chat_id, note)
    return True


def handle_command(chat_id: int, is_private: bool, cmd: str, args: str) -> bool:
    """/claim and /queue. Returns True when the command was handled here."""
    if cmd == "claim" and is_private:
        ok = claim_owner(chat_id)
        bot.send(chat_id, "✅ You'll get the daily posts to approve here every morning."
                 if ok else "This bot already has an owner.")
        return True
    if cmd == "queue" and str(chat_id) == owner():
        day = args.strip() or datetime.now(timezone.utc).date().isoformat()
        res = send_drafts(day, force=True)
        if not res.get("sent"):
            bot.send(chat_id, f"Nothing to approve for {bot.esc(day)} ({bot.esc(res.get('reason', 'all done'))}).")
        return True
    return False
