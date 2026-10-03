"""Translations of scoring-engine strings shared by the Telegram bot and the
share-card images. Mirrors the ENGINE map in frontend/src/lib/i18n.ts (labels
only; long reason sentences stay in the app)."""

from __future__ import annotations

ENGINE: dict[str, dict[str, str]] = {
    "Above 7-day average": {"fr": "Au-dessus de la moyenne 7 j", "ar": "فوق متوسط 7 أيام"},
    "Below 7-day average": {"fr": "Sous la moyenne 7 j", "ar": "تحت متوسط 7 أيام"},
    "Above 30-day average": {"fr": "Au-dessus de la moyenne 30 j", "ar": "فوق متوسط 30 يوماً"},
    "Below 30-day average": {"fr": "Sous la moyenne 30 j", "ar": "تحت متوسط 30 يوماً"},
    "Strong 7-day return": {"fr": "Forte hausse sur 7 j", "ar": "عائد قوي خلال 7 أيام"},
    "Weak 7-day return": {"fr": "Forte baisse sur 7 j", "ar": "تراجع حاد خلال 7 أيام"},
    "Rising volume": {"fr": "Volume en hausse", "ar": "حجم تداول متزايد"},
    "Fading volume": {"fr": "Volume en baisse", "ar": "حجم تداول متراجع"},
    "Contrarian fear": {"fr": "Peur du marché (contrarien)", "ar": "خوف السوق (إشارة معاكسة)"},
    "Market greed": {"fr": "Avidité du marché", "ar": "طمع السوق"},
    "Sharp 24h drop": {"fr": "Chute brutale sur 24 h", "ar": "هبوط حاد خلال 24 ساعة"},
    "Extended 30-day move": {"fr": "Hausse étirée sur 30 j", "ar": "صعود مبالغ فيه خلال 30 يوماً"},
    "Sustained 30-day uptrend": {"fr": "Hausse durable sur 30 j", "ar": "اتجاه صاعد مستمر خلال 30 يوماً"},
    "Uptrend structure": {"fr": "Structure haussière", "ar": "بنية اتجاه صاعد"},
    "Volume conviction": {"fr": "Volume convaincant", "ar": "حجم تداول مؤكِّد"},
    "Steady 24h follow-through": {"fr": "Hausse régulière sur 24 h", "ar": "صعود ثابت خلال 24 ساعة"},
    "STRONG": {"en": "Strong", "fr": "Forte", "ar": "قوي"},
    "NEUTRAL": {"en": "Neutral", "fr": "Neutre", "ar": "محايد"},
    "WEAK": {"en": "Weak", "fr": "Faible", "ar": "ضعيف"},
    "Extreme Fear": {"fr": "Peur extrême", "ar": "خوف شديد"},
    "Fear": {"fr": "Peur", "ar": "خوف"},
    "Neutral": {"fr": "Neutre", "ar": "محايد"},
    "Greed": {"fr": "Avidité", "ar": "طمع"},
    "Extreme Greed": {"fr": "Avidité extrême", "ar": "طمع شديد"},
}


def te(lang: str, text: str | None) -> str:
    """Translate an engine string; unknown strings fall back to English."""
    if not text:
        return ""
    entry = ENGINE.get(text, {})
    return entry.get(lang) or entry.get("en") or text
