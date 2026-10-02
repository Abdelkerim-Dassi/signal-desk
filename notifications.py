from __future__ import annotations

import base64
import os
from typing import Any

import requests


def _configured(name: str) -> bool:
    return bool(os.getenv(name))


def notification_status() -> dict[str, bool]:
    return {
        "discord": _configured("DISCORD_WEBHOOK_URL"),
        "whatsapp": all(
            _configured(name)
            for name in (
                "TWILIO_ACCOUNT_SID",
                "TWILIO_AUTH_TOKEN",
                "TWILIO_WHATSAPP_FROM",
                "TWILIO_WHATSAPP_TO",
            )
        ),
    }


def format_market_alert(brief: dict[str, Any], max_items: int = 4) -> str:
    sentiment = brief.get("sentiment", {})
    regime = brief.get("regime") or {}
    lines = [
        "Qirat market update",
        f"Fear & Greed: {sentiment.get('score', 'n/a')}/100 - {sentiment.get('status', 'Neutral')}",
        f"Market regime: {regime.get('label', 'Unknown')}",
        "",
        "Top setups:",
    ]
    for item in brief.get("opportunities", [])[:max_items]:
        lines.append(
            f"- {item.get('symbol', '').upper()} {item.get('rating')}: "
            f"score {item.get('score')}/100, risk {item.get('risk_level')}"
        )
    lines.append("")
    lines.append("Rule-based ratings, not financial advice.")
    return "\n".join(lines)


def send_discord(message: str) -> dict[str, Any]:
    webhook_url = os.getenv("DISCORD_WEBHOOK_URL")
    if not webhook_url:
        return {"ok": False, "channel": "discord", "error": "DISCORD_WEBHOOK_URL is not configured"}
    response = requests.post(webhook_url, json={"content": message}, timeout=15)
    return {
        "ok": response.status_code in (200, 204),
        "channel": "discord",
        "status_code": response.status_code,
        "error": None if response.status_code in (200, 204) else response.text[:250],
    }


def send_whatsapp(message: str) -> dict[str, Any]:
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_WHATSAPP_FROM")
    to_number = os.getenv("TWILIO_WHATSAPP_TO")
    if not all((account_sid, auth_token, from_number, to_number)):
        return {"ok": False, "channel": "whatsapp", "error": "Twilio WhatsApp environment variables are not configured"}

    auth = base64.b64encode(f"{account_sid}:{auth_token}".encode("utf-8")).decode("ascii")
    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
    data = {
        "From": from_number,
        "To": to_number,
        "Body": message,
    }
    response = requests.post(
        url,
        data=data,
        headers={"Authorization": f"Basic {auth}"},
        timeout=15,
    )
    return {
        "ok": 200 <= response.status_code < 300,
        "channel": "whatsapp",
        "status_code": response.status_code,
        "error": None if 200 <= response.status_code < 300 else response.text[:250],
    }


def send_notifications(message: str, channels: list[str] | None = None) -> list[dict[str, Any]]:
    requested = channels or ["discord", "whatsapp"]
    results = []
    if "discord" in requested:
        results.append(send_discord(message))
    if "whatsapp" in requested:
        results.append(send_whatsapp(message))
    return results
