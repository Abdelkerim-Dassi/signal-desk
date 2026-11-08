"""Telegram bot (@getqirat_bot): webhook handler plus the scheduled jobs.

Telegram pushes every message to ``/api/telegram/webhook``; ``handle_update``
answers it synchronously (scoring a few coins takes ~1-2 s). Per-chat settings
(language, watchlist, daily/alerts switches) live in Upstash Redis, with an
in-memory fallback for local runs.

Two jobs run on a schedule:
  * ``send_daily`` — the morning digest for chats with the daily switch on.
  * ``check_alerts`` — re-scores every watched coin and tells watching chats
    when a rating changes. A new rating must hold for two consecutive checks
    before it alerts, so a coin hovering on a threshold doesn't spam anyone.

Everything the bot says describes a coin's setup; like the web app, it never
tells anyone to buy or sell.
"""

from __future__ import annotations

import hashlib
import html
import json
import os
import re
import threading
import time
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

import requests

from advisor_engine import (
    get_fear_greed, get_market_regime, get_market_weather, grade_sort_key, score_binance_symbols,
)

from . import cards, track_record, upstash
from .labels import te
from .cache import TTLCache

APP_URL = os.environ.get("APP_URL", "https://qirat.tn")
CHANNEL_URL = "https://t.me/getqirat"
# The public channel the daily card and Friday report card are posted to.
CHANNEL = os.getenv("TELEGRAM_CHANNEL", "@getqirat")
DEFAULT_WATCH = ["BTC", "ETH", "SOL"]
POPULAR = ["BTC", "ETH", "SOL", "BNB", "XRP", "DOGE", "ADA", "AVAX", "LINK", "TON", "SUI", "DOT"]
MAX_WATCH = 12
MAX_ALERT_SYMBOLS = 80  # per check, so a large user base can't blow the time budget
ALERT_CONFIRMATIONS = 2  # consecutive checks a new rating must hold before alerting
BACKTEST_FILE = Path(__file__).resolve().parent / "data" / "backtest.json"

_TICKER = re.compile(r"^[A-Za-z0-9]{2,10}$")


def _token() -> str | None:
    return os.getenv("TELEGRAM_BOT_TOKEN")


def enabled() -> bool:
    return bool(_token())


def webhook_secret() -> str:
    """Secret Telegram echoes in X-Telegram-Bot-Api-Secret-Token; derived from the token."""
    return hashlib.sha256(("qirat-webhook:" + (_token() or "")).encode()).hexdigest()[:48]


def api(method: str, **params: Any) -> dict[str, Any]:
    try:
        resp = requests.post(
            f"https://api.telegram.org/bot{_token()}/{method}", json=params, timeout=10
        )
        return resp.json()
    except Exception as exc:  # network trouble shouldn't crash a webhook or a job
        return {"ok": False, "description": str(exc)}


# ── text ────────────────────────────────────────────────────────────────────

T: dict[str, dict[str, str]] = {
    "en": {
        "welcome": "<b>Welcome to Qirat</b> 💎\nEvery coin has a karat. I grade crypto coins like gold: 24K = calm and climbing, 10K = wild or sliding, and I tell you how risky each one is.\n\nTry it: send <code>BTC</code> or tap a button.",
        "help": "<b>How Qirat works</b>\n• /score BTC ETH: each coin's karat (24K best, 10K weakest) and its risk\n• /watch: your coin list, daily briefing and alerts\n• /market: today's market weather\n• /scamcheck: paste a message, link or platform name to see its red flags\n• /learn: today's 2-minute lesson\n• /language: change language\n\nKarats compare coins with each other. The weather tells you how the whole market feels: in a storm even 24K coins usually fall.",
        "w_calm": "☀️ Market: calm",
        "w_choppy": "🌤 Market: choppy",
        "w_stormy": "⛈ Market: stormy",
        "w_calm_body": "Bitcoin is {pct} above its 50-day average and the crowd isn't overheated.",
        "w_dip_body": "Bitcoin slipped {pct} below its 50-day average but holds its 200-day line. Expect bigger swings.",
        "w_hot_body": "Bitcoin is above its 50-day average but the crowd is overheated. Pullbacks get more likely.",
        "w_stormy_body": "Bitcoin is below its 50-day and 200-day averages. In storms most coins fall, even 24K ones.",
        "risk_low": "🟢 Low risk for crypto",
        "risk_medium": "🟠 Medium risk",
        "risk_high": "🔴 High risk",
        "young": "Too new for a karat (needs 3 months)",
        "trend_line": "90-day trend {v} · stronger than {n}% of the top coins",
        "calm_line": "Typical day ±{v}% · calmer than {n}% of the top coins",
        "rough_line": "A rough month (1 in 20): about {v}% · on 100 TND ≈ {m} TND",
        "karat_scale": "24K = calm and climbing · 10K = wild or sliding",
        "karat_alert": "{coin}: {old} → {new}",
        "alert_title": "🔔 <b>Karat change</b>",
        "disclaimer": "A rating describes the coin's chart, not what you should do with your money.",
        "why": "Why this score",
        "base": "Starting point",
        "cap": "Risk-off cap",
        "risk_on": "🟢 Market: risk-on",
        "risk_off": "🔴 Market: risk-off (scores capped at 66)",
        "regime_on_body": "Bitcoin is {pct} above its 200-day average, so Strong ratings are on.",
        "regime_off_body": "Bitcoin is {pct} below its 200-day average, so every score is capped at 66.",
        "mood": "Market mood",
        "mcap": "Total market",
        "not_found": "I couldn't find {list} on Binance. Try the ticker, e.g. SOL.",
        "usage_score": "Send a coin ticker, e.g. <code>/score BTC</code> or just <code>BTC</code>.",
        "watch_title": "<b>Your coins</b>",
        "watch_empty": "Your list is empty. Add one: <code>/watch add BTC</code>",
        "watch_hint": "Add: <code>/watch add SOL</code> · Remove: <code>/watch remove SOL</code>",
        "watch_full": "Your list is full ({n} coins). Remove one first.",
        "added": "Added {coin} to your list.",
        "removed": "Removed {coin} from your list.",
        "already": "{coin} is already on your list.",
        "not_on_list": "{coin} isn't on your list.",
        "daily": "Daily briefing",
        "alerts": "Rating alerts",
        "on": "on",
        "off": "off",
        "admins_only": "Only group admins can change the settings.",
        "lang_pick": "Choose your language:",
        "lang_set": "Language set to English.",
        "open_app": "Open the app",
        "add_btn": "Add {coin} to my list",
        "my_list": "My coins",
        "score_btc": "Score BTC",
        "channel": "Channel",
        "daily_title": "<b>Qirat daily</b> · {date}",
        "daily_footer": "Full AI briefing and every point explained in the app.",
        "alert_line": "{coin}: {old} → {new} (score {score})",
        "record_backtest": "<b>Backtest 2021–26</b> (simulated): coins rated Strong returned {strong} on average over the next 30 days, vs {all} for all coins. Only {hit}% of them went up.",
        "record_live": "<b>Live log</b>: {n} coins rated every day since {date}, saved once and never edited.",
        "record_live_results": "Last {h}-day results: Strong {strong} avg ({calls} calls), all coins {all}.",
        "record_first": "First 7-day results arrive on {date}.",
        "group_hello": "Hi! I'm Qirat. Anyone can send /score BTC here. Admins: /watch sets this group's coins and the daily card.",
    },
    "fr": {
        "welcome": "<b>Bienvenue sur Qirat</b> 💎\nChaque crypto a son carat. Je note les cryptos comme l'or : 24K = calme et en hausse, 10K = agitée ou en baisse, et je vous dis à quel point chacune est risquée.\n\nEssayez : envoyez <code>BTC</code> ou touchez un bouton.",
        "help": "<b>Comment marche Qirat</b>\n• /score BTC ETH : le carat de chaque crypto (24K le meilleur, 10K le plus faible) et son risque\n• /watch : votre liste, le briefing quotidien et les alertes\n• /market : la météo du marché\n• /scamcheck : collez un message, un lien ou un nom de plateforme pour voir les signaux d'alerte\n• /learn : la leçon du jour en 2 minutes\n• /language : changer de langue\n\nLes carats comparent les cryptos entre elles. La météo dit comment va tout le marché : dans l'orage, même les 24K baissent souvent.",
        "w_calm": "☀️ Marché : calme",
        "w_choppy": "🌤 Marché : agité",
        "w_stormy": "⛈ Marché : orageux",
        "w_calm_body": "Le bitcoin est {pct} au-dessus de sa moyenne 50 jours et la foule n'est pas en surchauffe.",
        "w_dip_body": "Le bitcoin est passé {pct} sous sa moyenne 50 jours mais tient sa moyenne 200 jours. Attendez-vous à des remous.",
        "w_hot_body": "Le bitcoin est au-dessus de sa moyenne 50 jours mais la foule surchauffe. Les replis deviennent plus probables.",
        "w_stormy_body": "Le bitcoin est sous ses moyennes 50 et 200 jours. Dans l'orage, la plupart des cryptos baissent, même les 24K.",
        "risk_low": "🟢 Risque faible pour une crypto",
        "risk_medium": "🟠 Risque moyen",
        "risk_high": "🔴 Risque élevé",
        "young": "Trop récente pour un carat (3 mois requis)",
        "trend_line": "Tendance 90 j {v} · plus forte que {n} % des grandes cryptos",
        "calm_line": "Journée normale ±{v} % · plus calme que {n} % des grandes cryptos",
        "rough_line": "Un mauvais mois (1 sur 20) : environ {v} % · sur 100 TND ≈ {m} TND",
        "karat_scale": "24K = calme et en hausse · 10K = agitée ou en baisse",
        "karat_alert": "{coin} : {old} → {new}",
        "alert_title": "🔔 <b>Changement de carat</b>",
        "disclaimer": "Une note décrit le graphique de la crypto, pas ce que vous devez faire de votre argent.",
        "why": "Pourquoi ce score",
        "base": "Point de départ",
        "cap": "Plafond marché défavorable",
        "risk_on": "🟢 Marché : favorable",
        "risk_off": "🔴 Marché : défavorable (scores plafonnés à 66)",
        "regime_on_body": "Le bitcoin est {pct} au-dessus de sa moyenne 200 jours : les notes Fortes sont activées.",
        "regime_off_body": "Le bitcoin est {pct} sous sa moyenne 200 jours : tous les scores sont plafonnés à 66.",
        "mood": "Humeur du marché",
        "mcap": "Marché total",
        "not_found": "Je n'ai pas trouvé {list} sur Binance. Essayez le ticker, ex. SOL.",
        "usage_score": "Envoyez un ticker, ex. <code>/score BTC</code> ou simplement <code>BTC</code>.",
        "watch_title": "<b>Vos cryptos</b>",
        "watch_empty": "Votre liste est vide. Ajoutez : <code>/watch add BTC</code>",
        "watch_hint": "Ajouter : <code>/watch add SOL</code> · Retirer : <code>/watch remove SOL</code>",
        "watch_full": "Votre liste est pleine ({n} cryptos). Retirez-en une d'abord.",
        "added": "{coin} ajouté à votre liste.",
        "removed": "{coin} retiré de votre liste.",
        "already": "{coin} est déjà dans votre liste.",
        "not_on_list": "{coin} n'est pas dans votre liste.",
        "daily": "Briefing quotidien",
        "alerts": "Alertes de note",
        "on": "activé",
        "off": "désactivé",
        "admins_only": "Seuls les admins du groupe peuvent changer les réglages.",
        "lang_pick": "Choisissez votre langue :",
        "lang_set": "Langue : français.",
        "open_app": "Ouvrir l'app",
        "add_btn": "Ajouter {coin} à ma liste",
        "my_list": "Mes cryptos",
        "score_btc": "Noter BTC",
        "channel": "Canal",
        "daily_title": "<b>Qirat du jour</b> · {date}",
        "daily_footer": "Briefing IA complet et chaque point expliqué dans l'app.",
        "alert_line": "{coin} : {old} → {new} (score {score})",
        "record_backtest": "<b>Backtest 2021–26</b> (simulé) : les cryptos notées Fortes ont rapporté {strong} en moyenne sur 30 jours, contre {all} pour l'ensemble. Seules {hit} % ont monté.",
        "record_live": "<b>Journal en direct</b> : {n} cryptos notées chaque jour depuis le {date}, enregistrées une fois, jamais modifiées.",
        "record_live_results": "Derniers résultats à {h} jours : Fortes {strong} en moyenne ({calls} notes), toutes {all}.",
        "record_first": "Premiers résultats à 7 jours le {date}.",
        "group_hello": "Bonjour ! Je suis Qirat. Tout le monde peut envoyer /score BTC ici. Admins : /watch règle les cryptos du groupe et la carte quotidienne.",
    },
    "ar": {
        "welcome": "<b>مرحباً بك في قيراط</b> 💎\nلكل عملة قيراطها. أقيّم العملات المشفرة مثل الذهب: عيار 24 = هادئة وصاعدة، عيار 10 = متقلبة أو هابطة، وأخبرك بمدى خطورة كل عملة.\n\nجرّب: أرسل <code>BTC</code> أو اضغط زراً.",
        "help": "<b>كيف يعمل قيراط</b>\n• /score BTC ETH: عيار كل عملة (24 الأفضل، 10 الأضعف) ومخاطرتها\n• /watch: قائمتك والموجز اليومي والتنبيهات\n• /market: طقس السوق اليوم\n• /scamcheck: الصق رسالة أو رابطاً أو اسم منصة لترى علامات التحذير\n• /learn: درس اليوم في دقيقتين\n• /language: تغيير اللغة\n\nالعيار يقارن العملات ببعضها. والطقس يخبرك بحال السوق كله: في العاصفة تنخفض حتى عملات عيار 24 غالباً.",
        "w_calm": "☀️ السوق: هادئ",
        "w_choppy": "🌤 السوق: متقلّب",
        "w_stormy": "⛈ السوق: عاصف",
        "w_calm_body": "البيتكوين أعلى من متوسطه لـ50 يوماً بنسبة {pct}، والسوق ليس في حالة اندفاع.",
        "w_dip_body": "نزل البيتكوين {pct} تحت متوسطه لـ50 يوماً لكنه فوق خط الـ200 يوم. توقّع تقلبات أكبر.",
        "w_hot_body": "البيتكوين فوق متوسطه لـ50 يوماً لكن السوق في حالة اندفاع. احتمال التراجع أكبر.",
        "w_stormy_body": "البيتكوين تحت متوسطيه لـ50 و200 يوم. في العاصفة تنخفض معظم العملات، حتى عيار 24.",
        "risk_low": "🟢 مخاطرة منخفضة (للكريبتو)",
        "risk_medium": "🟠 مخاطرة متوسطة",
        "risk_high": "🔴 مخاطرة عالية",
        "young": "أحدث من أن تُعطى عياراً (تحتاج 3 أشهر)",
        "trend_line": "اتجاه 90 يوماً {v} · أقوى من {n}٪ من العملات الكبرى",
        "calm_line": "يوم عادي ±{v}٪ · أهدأ من {n}٪ من العملات الكبرى",
        "rough_line": "شهر سيئ (1 من 20): نحو {v}٪ · على 100 دينار ≈ {m} دينار",
        "karat_scale": "عيار 24 = هادئة وصاعدة · عيار 10 = متقلبة أو هابطة",
        "karat_alert": "{coin}: {old} ← {new}",
        "alert_title": "🔔 <b>تغيّر العيار</b>",
        "disclaimer": "التقييم يصف الرسم البياني للعملة، وليس ما يجب أن تفعله بأموالك.",
        "why": "لماذا هذه الدرجة",
        "base": "نقطة البداية",
        "cap": "حدّ السوق الحذر",
        "risk_on": "🟢 السوق: وضع إيجابي",
        "risk_off": "🔴 السوق: وضع حذر (الدرجات محدودة عند 66)",
        "regime_on_body": "البيتكوين أعلى من متوسطه لـ200 يوم بنسبة {pct}، لذلك التقييمات القوية مفعّلة.",
        "regime_off_body": "البيتكوين أدنى من متوسطه لـ200 يوم بنسبة {pct}، لذلك كل الدرجات محدودة عند 66.",
        "mood": "مزاج السوق",
        "mcap": "السوق الكلي",
        "not_found": "لم أجد {list} على Binance. جرّب الرمز، مثلاً SOL.",
        "usage_score": "أرسل رمز العملة، مثلاً <code>/score BTC</code> أو <code>BTC</code> فقط.",
        "watch_title": "<b>عملاتك</b>",
        "watch_empty": "قائمتك فارغة. أضف عملة: <code>/watch add BTC</code>",
        "watch_hint": "إضافة: <code>/watch add SOL</code> · إزالة: <code>/watch remove SOL</code>",
        "watch_full": "قائمتك ممتلئة ({n} عملة). أزل واحدة أولاً.",
        "added": "تمت إضافة {coin} إلى قائمتك.",
        "removed": "تمت إزالة {coin} من قائمتك.",
        "already": "{coin} موجودة في قائمتك.",
        "not_on_list": "{coin} ليست في قائمتك.",
        "daily": "الموجز اليومي",
        "alerts": "تنبيهات التقييم",
        "on": "مفعّل",
        "off": "متوقف",
        "admins_only": "فقط مشرفو المجموعة يمكنهم تغيير الإعدادات.",
        "lang_pick": "اختر لغتك:",
        "lang_set": "تم ضبط اللغة على العربية.",
        "open_app": "افتح التطبيق",
        "add_btn": "أضف {coin} إلى قائمتي",
        "my_list": "عملاتي",
        "score_btc": "قيّم BTC",
        "channel": "القناة",
        "daily_title": "<b>قيراط اليوم</b> · {date}",
        "daily_footer": "الموجز الكامل بالذكاء الاصطناعي وشرح كل نقطة في التطبيق.",
        "alert_line": "{coin}: {old} ← {new} (الدرجة {score})",
        "record_backtest": "<b>اختبار تاريخي 2021–26</b> (محاكاة): حققت العملات المصنّفة قوية عائداً متوسطه {strong} خلال 30 يوماً، مقابل {all} لكل العملات. {hit}٪ منها فقط ارتفعت.",
        "record_live": "<b>السجل المباشر</b>: {n} عملة تُقيَّم يومياً منذ {date}، تُحفظ مرة واحدة دون تعديل.",
        "record_live_results": "آخر نتائج لـ{h} أيام: القوية {strong} في المتوسط ({calls} تقييم)، كل العملات {all}.",
        "record_first": "تصل أول نتائج لـ7 أيام في {date}.",
        "group_hello": "مرحباً! أنا قيراط. يمكن لأي شخص إرسال /score BTC هنا. المشرفون: /watch يضبط عملات المجموعة والبطاقة اليومية.",
    },
}

GLYPH = {"STRONG": "▲", "NEUTRAL": "●", "WEAK": "▼"}
DOT = {"STRONG": "🟢", "NEUTRAL": "⚪", "WEAK": "🔴"}


def t(lang: str, key: str, **kw: Any) -> str:
    text = T.get(lang, T["en"]).get(key) or T["en"][key]
    return text.format(**kw) if kw else text


def esc(text: Any) -> str:
    return html.escape(str(text), quote=False)


def fmt_price(value: float | None) -> str:
    if value is None:
        return "--"
    v = float(value)
    if abs(v) >= 1000:
        return f"${v:,.0f}"
    if abs(v) >= 1:
        return f"${v:,.2f}"
    if abs(v) >= 0.01:
        return f"${v:.4f}"
    return "$" + f"{v:.10f}".rstrip("0")


def fmt_pct(value: float | None) -> str:
    return "--" if value is None else f"{value:+.2f}%"


def meter(score: float) -> str:
    filled = max(0, min(10, round(score / 10)))
    return "▰" * filled + "▱" * (10 - filled)


# ── storage ─────────────────────────────────────────────────────────────────

_memory: dict[str, str] = {}
_memory_lock = threading.Lock()


def _get(key: str) -> str | None:
    if upstash.enabled():
        return upstash.get_str(key)
    with _memory_lock:
        return _memory.get(key)


def _set(key: str, value: str) -> None:
    if upstash.enabled():
        upstash.pipeline([["SET", key, value]])
    else:
        with _memory_lock:
            _memory[key] = value


def _chat_ids() -> list[str]:
    if upstash.enabled():
        res = upstash.pipeline([["SMEMBERS", "tg:chats"]])
        return list(res[0]) if res and res[0] else []
    with _memory_lock:
        return json.loads(_memory.get("tg:chats", "[]"))


def _register(chat_id: int | str) -> None:
    if upstash.enabled():
        upstash.pipeline([["SADD", "tg:chats", str(chat_id)]])
    else:
        with _memory_lock:
            ids = set(json.loads(_memory.get("tg:chats", "[]")))
            ids.add(str(chat_id))
            _memory["tg:chats"] = json.dumps(sorted(ids))


def _unregister(chat_id: int | str) -> None:
    if upstash.enabled():
        upstash.pipeline([["SREM", "tg:chats", str(chat_id)]])
    else:
        with _memory_lock:
            ids = set(json.loads(_memory.get("tg:chats", "[]")))
            ids.discard(str(chat_id))
            _memory["tg:chats"] = json.dumps(sorted(ids))


def load_chat(chat_id: int | str) -> dict[str, Any] | None:
    raw = _get(f"tg:chat:{chat_id}")
    return json.loads(raw) if raw else None


def save_chat(chat_id: int | str, data: dict[str, Any]) -> None:
    _set(f"tg:chat:{chat_id}", json.dumps(data, separators=(",", ":")))
    _register(chat_id)


def _detect_lang(user: dict[str, Any] | None) -> str:
    code = ((user or {}).get("language_code") or "en")[:2]
    return code if code in ("fr", "ar") else "en"


def ensure_chat(chat: dict[str, Any], user: dict[str, Any] | None) -> dict[str, Any]:
    data = load_chat(chat["id"])
    if data is None:
        is_private = chat.get("type") == "private"
        data = {
            "lang": _detect_lang(user),
            "watch": list(DEFAULT_WATCH),
            "daily": True,
            "alerts": is_private,  # groups opt in, so the bot never surprises a group
            "type": chat.get("type", "private"),
            "joined": datetime.now(timezone.utc).date().isoformat(),
        }
        save_chat(chat["id"], data)
    return data


# ── scoring ─────────────────────────────────────────────────────────────────

_sentiment_cache = TTLCache(default_ttl=300.0)


def _sentiment() -> dict[str, Any]:
    return _sentiment_cache.get_or_set("fng", get_fear_greed)


def score(bases: list[str]) -> tuple[dict[str, dict[str, Any]], list[str], dict[str, Any]]:
    """Grade coins by base ticker. Returns ({BASE: analysis}, [not found], weather)."""
    bases = [b.upper() for b in bases]
    regime = get_market_regime()  # still feeds the old score, which is logged privately
    analyses, errors = score_binance_symbols([f"{b}USDT" for b in bases], _sentiment(), regime)
    found = {a["symbol"].upper(): a for a in analyses}
    missing = [b for b in bases if b not in found]
    return found, missing, get_market_weather(_sentiment())


def parse_tickers(text: str) -> list[str]:
    out: list[str] = []
    for raw in re.split(r"[\s,]+", text.strip()):
        tok = raw.strip().upper().removesuffix("USDT")
        if tok and _TICKER.match(tok) and tok not in out:
            out.append(tok)
    return out[:5]


# ── message builders ────────────────────────────────────────────────────────


def regime_line(lang: str, weather: dict[str, Any]) -> str:
    """One line for the market weather (kept under its old name for callers)."""
    state = (weather or {}).get("state")
    return t(lang, f"w_{state}") if state in ("calm", "choppy", "stormy") else ""


def weather_body(lang: str, w: dict[str, Any]) -> str:
    pct = f"{abs(w.get('vs_ma50_pct') or 0):.1f}%"
    state = w.get("state")
    if state == "calm":
        return t(lang, "w_calm_body", pct=pct)
    if state == "stormy":
        return t(lang, "w_stormy_body")
    if state == "choppy":
        return t(lang, "w_hot_body") if w.get("above_ma50") else t(lang, "w_dip_body", pct=pct)
    return ""


def karat_txt(a: dict[str, Any]) -> str:
    k = (a.get("grade") or {}).get("karat")
    return f"{k}K" if k else "New"


def risk_txt(lang: str, a: dict[str, Any]) -> str:
    r = (a.get("grade") or {}).get("risk")
    return t(lang, f"risk_{r}") if r else ""


def grade_lines(lang: str, a: dict[str, Any]) -> list[str]:
    g = a.get("grade") or {}
    if not g:
        return []
    out = []
    if g.get("mom90_pct") is not None:
        out.append(t(lang, "trend_line", v=fmt_pct(g["mom90_pct"]), n=g.get("momentum_pct", "--")))
    else:
        out.append(t(lang, "young"))
    out.append(t(lang, "calm_line", v=f"{g['typical_day_pct']:.1f}", n=g.get("calm_pct", "--")))
    out.append(t(lang, "rough_line", v=f"{g['rough_month_pct']:.0f}", m=abs(round(g["rough_month_pct"]))))
    return out


def score_card(lang: str, a: dict[str, Any], weather: dict[str, Any]) -> str:
    lines = [
        f"<b>{esc(a.get('name') or a['symbol'])} ({esc(a['symbol'])})</b> · {fmt_price(a.get('current_price'))} "
        f"({fmt_pct(a.get('change_24h'))} 24h)",
        f"<b>{karat_txt(a)}</b> · {risk_txt(lang, a)}",
        "",
        *grade_lines(lang, a),
        "",
        f"<i>{t(lang, 'karat_scale')}</i>",
    ]
    rl = regime_line(lang, weather)
    if rl:
        lines += ["", rl]
    lines += ["", f"<i>{t(lang, 'disclaimer')}</i>"]
    return "\n".join(lines)


def coin_line(lang: str, a: dict[str, Any]) -> str:
    return (
        f"<b>{esc(a['symbol'])}</b> {karat_txt(a)} · {risk_txt(lang, a)} · "
        f"{fmt_price(a.get('current_price'))} {fmt_pct(a.get('change_24h'))}"
    )


def market_text(lang: str) -> str:
    w = get_market_weather(_sentiment())
    s = _sentiment()
    lines = []
    rl = regime_line(lang, w)
    if rl:
        lines += [f"<b>{rl}</b>", weather_body(lang, w), ""]
    lines.append(f"{t(lang, 'mood')}: <b>{s.get('score', '--')}</b> · {esc(te(lang, s.get('status')))}")
    return "\n".join(lines)


def record_text(lang: str) -> str:
    lines = []
    try:
        bt = json.loads(BACKTEST_FILE.read_text(encoding="utf-8"))
        st = bt["ratings"]["STRONG"]["30d"]
        al = bt["ratings"]["ALL"]["30d"]
        lines.append(t(lang, "record_backtest", strong=fmt_pct(st["mean"]), all=fmt_pct(al["mean"]), hit=st["hit_rate"]))
    except Exception:
        pass
    try:
        live = track_record.summary()
        if live.get("started_on"):
            lines += ["", t(lang, "record_live", n=len(live["universe"]), date=live["started_on"])]
            h7 = live["horizons"].get("7d", {}).get("ratings", {})
            if h7.get("ALL", {}).get("n"):
                lines.append(
                    t(lang, "record_live_results", h=7, strong=fmt_pct(h7["STRONG"].get("mean")),
                      calls=h7["STRONG"].get("n", 0), all=fmt_pct(h7["ALL"].get("mean")))
                )
            else:
                lines.append(t(lang, "record_first", date=live.get("first_results_on")))
    except Exception:
        pass
    return "\n".join(lines) or "--"


# ── sending ─────────────────────────────────────────────────────────────────


def send(chat_id: int | str, text: str, buttons: list[list[dict[str, Any]]] | None = None) -> dict[str, Any]:
    params: dict[str, Any] = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
        "link_preview_options": {"is_disabled": True},
    }
    if buttons:
        params["reply_markup"] = {"inline_keyboard": buttons}
    return api("sendMessage", **params)


def send_photo(
    chat_id: int | str,
    png: bytes,
    caption: str,
    buttons: list[list[dict[str, Any]]] | None = None,
) -> dict[str, Any]:
    data: dict[str, Any] = {"chat_id": str(chat_id), "caption": caption[:1024], "parse_mode": "HTML"}
    if buttons:
        data["reply_markup"] = json.dumps({"inline_keyboard": buttons})
    try:
        resp = requests.post(
            f"https://api.telegram.org/bot{_token()}/sendPhoto",
            data=data,
            files={"photo": ("qirat.png", png, "image/png")},
            timeout=20,
        )
        return resp.json()
    except Exception as exc:
        return {"ok": False, "description": str(exc)}


def score_caption(lang: str, a: dict[str, Any], weather: dict[str, Any]) -> str:
    """Caption under a coin card. The card itself is English/French, so Arabic
    readers also get the details here in Arabic."""
    lines = [
        f"<b>{esc(a.get('name') or a['symbol'])} ({esc(a['symbol'])})</b> · "
        f"<b>{karat_txt(a)}</b> · {risk_txt(lang, a)}",
    ]
    if lang == "ar":
        lines += ["", *grade_lines(lang, a)]
    rl = regime_line(lang, weather)
    if rl:
        lines += ["", rl]
    lines += ["", f"<i>{t(lang, 'disclaimer')}</i>"]
    return "\n".join(lines)


def app_button(lang: str, view: str = "") -> dict[str, Any]:
    return {"text": t(lang, "open_app"), "url": APP_URL + (f"/#{view}" if view else "")}


# ── /learn: today's lesson ──────────────────────────────────────────────────
# LEARN-DARIJA-START (listed in docs/learn/darija-review.md)
# Mirrors the written lessons in frontend/src/lib/lessons.ts, same order.
LEARN_LESSONS: list[tuple[str, dict[str, str]]] = [
    ("bitcoin", {"en": "What is crypto? Start with Bitcoin", "fr": "C’est quoi la crypto ? On commence par le Bitcoin", "ar": "شنوّة الـ crypto؟ نبداو بـ Bitcoin"}),
    ("usdt", {"en": "USDT, the “digital dollar”", "fr": "L’USDT, le « dollar numérique »", "ar": "USDT، «الدولار الرقمي»"}),
    ("price-swings", {"en": "Why crypto prices swing so much", "fr": "Pourquoi les prix crypto bougent autant", "ar": "علاش سوم الـ crypto يطلع ويهبط برشا؟"}),
    ("scams", {"en": "How scammers find you", "fr": "Comment les arnaqueurs vous trouvent", "ar": "كيفاش يلقاوك المتحيّلين"}),
    ("fomo", {"en": "FOMO: why buying after a big jump hurts", "fr": "Le FOMO : pourquoi acheter après une grosse hausse fait mal", "ar": "الـ FOMO: علاش الشراية بعد طلعة كبيرة توجع"}),
]
LEARN_T: dict[str, dict[str, str]] = {
    "en": {
        "learn_text": "📚 <b>Today’s lesson</b>\n{title}\n\nA 2-minute read and 3 quick questions. Your karat rises as you learn.\n\n<i>Education only. Not financial advice.</i>",
        "learn_btn": "Read the lesson",
        "learn_all": "All lessons",
    },
    "fr": {
        "learn_text": "📚 <b>La leçon du jour</b>\n{title}\n\n2 minutes de lecture et 3 petites questions. Votre carat monte à mesure que vous apprenez.\n\n<i>Éducation uniquement. Pas un conseil financier.</i>",
        "learn_btn": "Lire la leçon",
        "learn_all": "Toutes les leçons",
    },
    "ar": {
        "learn_text": "📚 <b>درس اليوم</b>\n{title}\n\nقراية دقيقتين و3 أسئلة صغار. القيراط متاعك يطلع كل ما تتعلّم.\n\n<i>تعليم برك. موش نصيحة مالية.</i>",
        "learn_btn": "اقرا الدرس",
        "learn_all": "الدروس الكل",
    },
}
# LEARN-DARIJA-END


def todays_lesson(today: date | None = None) -> tuple[str, dict[str, str]]:
    """Same rotation as todaysLesson() in the web app: days since 1970-01-01."""
    today = today or datetime.now(timezone.utc).date()
    return LEARN_LESSONS[(today - date(1970, 1, 1)).days % len(LEARN_LESSONS)]


def learn_message(lang: str) -> tuple[str, list[list[dict[str, Any]]]]:
    lang = lang if lang in LEARN_T else "en"
    slug, title = todays_lesson()
    strings = LEARN_T[lang]
    text = strings["learn_text"].format(title=esc(title[lang]))
    buttons = [[
        {"text": strings["learn_btn"], "url": f"{APP_URL}/#learn-{slug}"},
        {"text": strings["learn_all"], "url": f"{APP_URL}/#learn"},
    ]]
    return text, buttons


def watch_buttons(lang: str, data: dict[str, Any]) -> list[list[dict[str, Any]]]:
    on, off = "✅", "⬜"
    rows = [[
        {"text": f"{on if data.get('daily') else off} {t(lang, 'daily')}", "callback_data": "toggle:daily"},
        {"text": f"{on if data.get('alerts') else off} {t(lang, 'alerts')}", "callback_data": "toggle:alerts"},
    ]]
    suggestions = [p for p in POPULAR if p not in data["watch"]][:4]
    if suggestions:
        rows.append([{"text": f"+ {p}", "callback_data": f"add:{p}"} for p in suggestions])
    rows.append([app_button(lang)])
    return rows


def watch_text(lang: str, data: dict[str, Any]) -> str:
    if not data["watch"]:
        return t(lang, "watch_empty")
    found, missing, regime = score(data["watch"])
    rows = sorted(found.values(), key=grade_sort_key, reverse=True)
    lines = [t(lang, "watch_title"), ""] + [coin_line(lang, a) for a in rows]
    if missing:
        lines += ["", t(lang, "not_found", list=", ".join(missing))]
    rl = regime_line(lang, regime)
    if rl:
        lines += ["", rl]
    lines += ["", t(lang, "watch_hint")]
    return "\n".join(lines)


# ── update handling ─────────────────────────────────────────────────────────


def _is_admin(chat: dict[str, Any], user: dict[str, Any] | None) -> bool:
    if chat.get("type") == "private":
        return True
    if not user:
        return False
    res = api("getChatMember", chat_id=chat["id"], user_id=user["id"])
    return res.get("ok") and res["result"].get("status") in ("creator", "administrator")


def _language_buttons() -> list[list[dict[str, Any]]]:
    return [[
        {"text": "English", "callback_data": "lang:en"},
        {"text": "Français", "callback_data": "lang:fr"},
        {"text": "العربية", "callback_data": "lang:ar"},
    ]]


def handle_score(chat_id: int, lang: str, data: dict[str, Any], tickers: list[str]) -> None:
    if not tickers:
        send(chat_id, t(lang, "usage_score"))
        return
    found, missing, regime = score(tickers)
    for base in tickers:
        a = found.get(base)
        if not a:
            continue
        buttons = [[app_button(lang)]]
        if base not in data["watch"] and len(data["watch"]) < MAX_WATCH:
            buttons.insert(0, [{"text": t(lang, "add_btn", coin=base), "callback_data": f"add:{base}"}])
        try:
            png = cards.coin_card(a, regime, lang)
        except Exception:
            png = None
        if png and send_photo(chat_id, png, score_caption(lang, a, regime), buttons).get("ok"):
            continue
        send(chat_id, score_card(lang, a, regime), buttons)  # text fallback
    if missing:
        send(chat_id, t(lang, "not_found", list=", ".join(missing)))


def add_coin(lang: str, data: dict[str, Any], coin: str) -> str:
    coin = coin.upper()
    if coin in data["watch"]:
        return t(lang, "already", coin=coin)
    if len(data["watch"]) >= MAX_WATCH:
        return t(lang, "watch_full", n=MAX_WATCH)
    found, missing, _ = score([coin])
    if missing:
        return t(lang, "not_found", list=coin)
    data["watch"].append(coin)
    return t(lang, "added", coin=coin)


def handle_scamcheck(chat_id: int, lang: str, text: str) -> None:
    """Red flags for a message, link, token or platform name (never "safe")."""
    from . import scamcheck

    if not text.strip():
        send(chat_id, scamcheck.TG_TEXT["usage"][lang], [[app_button(lang, "scamcheck")]])
        return
    api("sendChatAction", chat_id=chat_id, action="typing")
    try:
        result = scamcheck.run_sync(text, language=lang)
    except Exception:  # a failing lookup must not leave the user without an answer
        result = scamcheck.check(text=text, language=lang, network=False)
    send(chat_id, scamcheck.telegram_text(result), [[app_button(lang, "scamcheck")]])


def handle_message(msg: dict[str, Any]) -> None:
    chat = msg["chat"]
    user = msg.get("from")
    text = (msg.get("text") or "").strip()
    chat_id = chat["id"]
    data = ensure_chat(chat, user)
    lang = data["lang"]
    is_private = chat.get("type") == "private"

    # bot added to a group: say hello once
    if msg.get("new_chat_members") and any(m.get("is_bot") and m.get("username", "").lower().endswith("qirat_bot") for m in msg["new_chat_members"]):
        send(chat_id, t(lang, "group_hello"))
        return
    if not text:
        return

    if text.startswith("/"):
        head, _, rest = text.partition(" ")
        cmd = head[1:].split("@", 1)[0].lower()
        args = rest.strip()
    elif is_private:
        tickers = parse_tickers(text)
        if tickers and len(text) <= 60:
            handle_score(chat_id, lang, data, tickers)
        else:
            send(chat_id, t(lang, "help"), [[app_button(lang)]])
        return
    else:
        return  # groups: only respond to commands

    from . import marketing  # imported here: marketing imports this module

    if marketing.handle_command(chat_id, is_private, cmd, args):
        return
    if cmd == "start":
        send(chat_id, t(lang, "welcome"), [
            [{"text": t(lang, "score_btc"), "callback_data": "score:BTC"},
             {"text": t(lang, "my_list"), "callback_data": "watch"}],
            *_language_buttons(),
            [app_button(lang), {"text": t(lang, "channel"), "url": CHANNEL_URL}],
        ])
    elif cmd == "help":
        send(chat_id, t(lang, "help"), [[app_button(lang), {"text": t(lang, "channel"), "url": CHANNEL_URL}]])
    elif cmd == "score":
        handle_score(chat_id, lang, data, parse_tickers(args))
    elif cmd in ("scamcheck", "scam", "check"):
        reply = msg.get("reply_to_message") or {}
        handle_scamcheck(chat_id, lang, args or reply.get("text") or reply.get("caption") or "")
    elif cmd == "market":
        send(chat_id, market_text(lang), [[app_button(lang)]])
    elif cmd == "record":
        # Results are private for now (see public_track_record); only the owner sees them.
        if public_track_record() or marketing.owner() == str(chat_id):
            send(chat_id, record_text(lang), [[app_button(lang, "record")]])
        elif is_private:
            send(chat_id, t(lang, "help"), [[app_button(lang)]])
    elif cmd == "learn":
        send(chat_id, *learn_message(lang))
    elif cmd == "language":
        send(chat_id, t(lang, "lang_pick"), _language_buttons())
    elif cmd in ("watch", "list"):
        sub, _, coin = args.partition(" ")
        sub = sub.lower()
        if sub in ("add", "remove", "rm", "del") and coin.strip():
            if not _is_admin(chat, user):
                send(chat_id, t(lang, "admins_only"))
                return
        if sub == "add" and coin.strip():
            reply = add_coin(lang, data, parse_tickers(coin)[0] if parse_tickers(coin) else coin)
            save_chat(chat_id, data)
            send(chat_id, reply)
        elif sub in ("remove", "rm", "del") and coin.strip():
            c = coin.strip().upper()
            if c in data["watch"]:
                data["watch"].remove(c)
                save_chat(chat_id, data)
                send(chat_id, t(lang, "removed", coin=c))
            else:
                send(chat_id, t(lang, "not_on_list", coin=c))
        else:
            send(chat_id, watch_text(lang, data), watch_buttons(lang, data))
    elif cmd in ("daily", "alerts"):
        if not _is_admin(chat, user):
            send(chat_id, t(lang, "admins_only"))
            return
        value = args.lower() not in ("off", "0", "no", "stop")
        data[cmd] = value
        save_chat(chat_id, data)
        send(chat_id, f"{t(lang, cmd)}: {t(lang, 'on' if value else 'off')}")
    elif is_private:
        send(chat_id, t(lang, "help"))


def handle_callback(cb: dict[str, Any]) -> None:
    msg = cb.get("message") or {}
    chat = msg.get("chat")
    user = cb.get("from")
    action = cb.get("data") or ""
    from . import marketing

    if marketing.handle_callback(cb):  # answers its own callback
        return
    api("answerCallbackQuery", callback_query_id=cb["id"])
    if not chat:
        return
    chat_id = chat["id"]
    data = ensure_chat(chat, user)
    lang = data["lang"]

    if action.startswith("lang:"):
        if not _is_admin(chat, user):
            send(chat_id, t(lang, "admins_only"))
            return
        data["lang"] = action.split(":", 1)[1] if action.split(":", 1)[1] in ("en", "fr", "ar") else "en"
        save_chat(chat_id, data)
        send(chat_id, t(data["lang"], "lang_set"))
        send(chat_id, t(data["lang"], "help"))
    elif action.startswith("score:"):
        handle_score(chat_id, lang, data, [action.split(":", 1)[1]])
    elif action == "watch":
        send(chat_id, watch_text(lang, data), watch_buttons(lang, data))
    elif action.startswith("add:"):
        if not _is_admin(chat, user):
            send(chat_id, t(lang, "admins_only"))
            return
        reply = add_coin(lang, data, action.split(":", 1)[1])
        save_chat(chat_id, data)
        send(chat_id, reply)
    elif action.startswith("toggle:"):
        key = action.split(":", 1)[1]
        if key not in ("daily", "alerts"):
            return
        if not _is_admin(chat, user):
            send(chat_id, t(lang, "admins_only"))
            return
        data[key] = not data.get(key)
        save_chat(chat_id, data)
        # refresh the buttons in place so the switch flips where it was tapped
        api("editMessageReplyMarkup", chat_id=chat_id, message_id=msg.get("message_id"),
            reply_markup={"inline_keyboard": watch_buttons(lang, data)})


def handle_update(update: dict[str, Any]) -> None:
    if "message" in update:
        handle_message(update["message"])
    elif "callback_query" in update:
        handle_callback(update["callback_query"])
    elif "my_chat_member" in update:
        member = update["my_chat_member"]
        status = (member.get("new_chat_member") or {}).get("status")
        if status in ("kicked", "left"):
            _unregister(member["chat"]["id"])


# ── scheduled jobs ──────────────────────────────────────────────────────────


def _deliver(chat_id: str, text: str, buttons: list[list[dict[str, Any]]] | None = None) -> bool:
    res = send(chat_id, text, buttons)
    if not res.get("ok") and res.get("error_code") == 403:
        _unregister(chat_id)  # blocked or removed: stop messaging this chat
    time.sleep(0.05)  # stay far below Telegram's ~30 messages/second limit
    return bool(res.get("ok"))


def send_daily() -> dict[str, Any]:
    chats = []
    symbols: set[str] = set()
    for cid in _chat_ids():
        data = load_chat(cid)
        if data and data.get("daily") and data.get("watch"):
            chats.append((cid, data))
            symbols.update(data["watch"])
    if not chats:
        return {"sent": 0, "chats": 0}
    found, _, regime = score(sorted(symbols)[:MAX_ALERT_SYMBOLS])
    today = datetime.now(timezone.utc).date().isoformat()
    sent = 0
    for cid, data in chats:
        lang = data.get("lang", "en")
        rows = sorted((found[c] for c in data["watch"] if c in found), key=grade_sort_key, reverse=True)
        if not rows:
            continue
        lines = [t(lang, "daily_title", date=today), ""]
        rl = regime_line(lang, regime)
        if rl:
            lines += [rl, ""]
        lines += [coin_line(lang, a) for a in rows]
        lines += ["", t(lang, "daily_footer"), f"<i>{t(lang, 'disclaimer')}</i>"]
        sent += _deliver(cid, "\n".join(lines), [[app_button(lang)]])
    return {"sent": sent, "chats": len(chats)}


def check_alerts() -> dict[str, Any]:
    watchers: dict[str, list[tuple[str, str]]] = {}
    for cid in _chat_ids():
        data = load_chat(cid)
        if data and data.get("alerts"):
            for coin in data.get("watch", []):
                watchers.setdefault(coin, []).append((cid, data.get("lang", "en")))
    if not watchers:
        return {"symbols": 0, "alerts": 0}

    found, _, _ = score(sorted(watchers)[:MAX_ALERT_SYMBOLS])
    alerts = 0
    for coin, a in found.items():
        key = f"tg:karat:{coin}"
        raw = _get(key)
        state = json.loads(raw) if raw else None
        current = karat_txt(a)
        if state is None:
            _set(key, json.dumps({"rating": current}))  # first sighting: baseline, no alert
            continue
        if current == state["rating"]:
            if state.get("pending"):
                _set(key, json.dumps({"rating": current}))
            continue
        count = state.get("count", 0) + 1 if state.get("pending") == current else 1
        if count < ALERT_CONFIRMATIONS:
            _set(key, json.dumps({"rating": state["rating"], "pending": current, "count": count}))
            continue
        old = state["rating"]
        _set(key, json.dumps({"rating": current}))
        for cid, lang in watchers.get(coin, []):
            text = "\n".join([
                t(lang, "alert_title"),
                t(lang, "karat_alert", coin=f"<b>{esc(coin)}</b>", old=esc(old), new=f"<b>{esc(current)}</b>"),
                risk_txt(lang, a),
                f"{fmt_price(a.get('current_price'))} {fmt_pct(a.get('change_24h'))}",
                "",
                f"<i>{t(lang, 'disclaimer')}</i>",
            ])
            alerts += _deliver(cid, text, [[{"text": "🔍", "callback_data": f"score:{coin}"}, app_button(lang)]])
    return {"symbols": len(found), "alerts": alerts}


def _claim(kind: str, day: str) -> bool:
    """True once per (kind, day): a retried or doubled cron run can't double-post."""
    key = f"tg:posted:{kind}:{day}"
    if upstash.enabled():
        res = upstash.pipeline([["SET", key, "1", "NX", "EX", str(3 * 86400)]])
        return bool(res and res[0] == "OK")
    with _memory_lock:
        if key in _memory:
            return False
        _memory[key] = "1"
        return True


def post_channel_today() -> dict[str, Any]:
    """Post today's karats for the tracked coins to the channel."""
    track_record.ensure_today()
    live = track_record.summary()
    today = live.get("today")
    if not today or not today.get("rows"):
        return {"posted": False, "reason": "no snapshot"}
    if not _claim("today", today["day"]):
        return {"posted": False, "reason": "already posted"}
    rows = [dict(r) for r in today["rows"]]
    weather = get_market_weather(_sentiment())
    if any("karat" not in r for r in rows):  # a day logged before karats existed
        found, _, _ = score([r["symbol"] for r in rows])
        for r in rows:
            g = (found.get(r["symbol"]) or {}).get("grade") or {}
            r.setdefault("karat", g.get("karat"))
            r.setdefault("risk", g.get("risk"))
    rows.sort(key=lambda r: (r.get("karat") or 0, r.get("trend") or 0), reverse=True)
    top = " · ".join(f"{r['symbol']} {r['karat']}K" for r in rows if (r.get("karat") or 0) >= 22)[:180]
    risky = " · ".join(r["symbol"] for r in rows if r.get("risk") == "high")[:180]
    lang = "en"
    lines = [f"<b>Today's karats</b> · {today['day']}"]
    rl = regime_line(lang, weather)
    if rl:
        lines += [rl, weather_body(lang, weather)]
    lines.append("")
    if top:
        lines.append(f"🥇 Highest karats: {top}")
    if risky:
        lines.append(f"🔴 High risk: {risky}")
    lines += [
        "",
        "Grade any coin: @getqirat_bot",
        f"<i>{t(lang, 'disclaimer')}</i>",
    ]
    png = cards.today_card(rows, weather, today["day"], lang)
    res = send_photo(CHANNEL, png, "\n".join(lines), [[app_button(lang)]])
    return {"posted": bool(res.get("ok")), "error": res.get("description")}


def public_track_record() -> bool:
    """Whether /record answers everyone. Off by default, like the web Track
    record tab: results are measured privately and only the owner sees them."""
    return os.getenv("PUBLIC_TRACK_RECORD", "0").strip().lower() in ("1", "true", "yes", "on")


def public_report_card() -> bool:
    """Whether the Friday report card goes to the public channel. Off by default:
    results are measured privately for now and only the owner sees them."""
    return os.getenv("PUBLIC_REPORT_CARD", "0").strip().lower() in ("1", "true", "yes", "on")


def post_channel_report(force: bool = False) -> dict[str, Any]:
    """The Friday report card (ratings from 7 days ago and how they did). Sent to
    the owner's private chat unless PUBLIC_REPORT_CARD is on."""
    from . import marketing

    target = CHANNEL if public_report_card() else marketing.owner()
    if not target:
        return {"posted": False, "reason": "no owner chat for the private report"}
    live = track_record.summary()
    resolved = live.get("latest_resolved")
    if not resolved:
        return {"posted": False, "reason": "no results yet"}
    if not force and datetime.now(timezone.utc).weekday() != 4:
        return {"posted": False, "reason": "not Friday"}
    if not _claim("report", resolved["day"]):
        return {"posted": False, "reason": "already posted"}
    stats = (live.get("horizons", {}).get(f"{resolved['horizon']}d") or {}).get("ratings", {})
    strong, every = stats.get("STRONG") or {}, stats.get("ALL") or {}
    card = (live.get("scorecard") or {}).get(f"{resolved['horizon']}d") or {}
    lang = "en"
    private = target != CHANNEL
    caption = "\n".join([
        ("🔒 <i>Private, not posted to the channel</i>\n" if private else "")
        + f"<b>Report card</b> · ratings from {resolved['day']}, {resolved['horizon']} days later",
        f"Strong avg {fmt_pct(strong.get('mean'))} · all coins {fmt_pct(every.get('mean'))} · "
        f"{strong.get('hit_rate', '--')}% of Strong went up",
        record_line(card),
        "Worst result first. Nothing deleted, nothing edited.",
        "",
        f"<i>{t(lang, 'disclaimer')}</i>",
    ])
    png = cards.report_card(resolved, stats, lang, card)
    res = send_photo(target, png, caption, [[app_button(lang, "record")]])
    _send_owner_scorecard(live.get("scorecard") or {})
    return {"posted": bool(res.get("ok")), "private": private, "error": res.get("description")}


def record_line(card: dict[str, Any]) -> str:
    """The honest running tally: how often Strong beat the coin average, and
    whether that's enough data to mean anything yet."""
    sv = card.get("strong_vs_market") or {}
    if not sv.get("n"):
        return ""
    periods = card.get("independent_periods", 0)
    verdict = ("too early to judge" if periods < track_record.MIN_PERIODS
               else "enough data to judge")
    return (f"Strong beat the coin average on {sv['positive_pct']:.0f}% of logged days "
            f"(avg {fmt_pct(sv['mean'])} vs average) · {periods} of "
            f"{track_record.MIN_PERIODS} weeks logged, {verdict}.")


def _send_owner_scorecard(scorecard: dict[str, Any]) -> None:
    """Private Friday note: live score vs the silent candidates. Never public."""
    from . import marketing

    chat = marketing.owner()
    card = scorecard.get("7d") or {}
    if not chat or not card.get("days"):
        return

    def ic(sig: str) -> str:
        a = (card.get(sig) or {}).get("ic") or {}
        return f"{a['mean']:+.3f} (positive {a['positive_pct']:.0f}%, n={a['n']})" if a.get("n") else "--"

    def spread(sig: str) -> str:
        a = (card.get(sig) or {}).get("top_minus_bottom") or {}
        return f"{a['mean']:+.2f}%" if a.get("n") else "--"

    stab = card.get("stability_ic") or {}
    mood = card.get("market_by_mood50") or {}
    reg = card.get("market_by_regime") or {}

    def mkt(block: dict[str, Any], s: str) -> str:
        a = block.get(s) or {}
        return f"{a['mean']:+.2f}% (n={a['n']})" if a.get("n") else "--"

    send(chat, "\n".join([
        "🔬 <b>Shadow scorecard</b> (private, 7-day, vs coin average)",
        f"Live score  IC {ic('score')} · top-bottom third {spread('score')}",
        f"Trend (new) IC {ic('trend')} · top-bottom third {spread('trend')}",
        f"Stability: calm coins moved less, IC "
        + (f"{stab['mean']:+.3f} (n={stab['n']})" if stab.get("n") else "--"),
        f"Market next 7d · mood calm {mkt(mood, 'calm')} / cautious {mkt(mood, 'cautious')}",
        f"Old regime · risk-on {mkt(reg, 'risk_on')} / risk-off {mkt(reg, 'risk_off')}",
        f"Verdict: <b>{card.get('verdict')}</b> · {card.get('independent_periods', 0)} of "
        f"{track_record.MIN_PERIODS} weeks",
    ]))


def run_daily() -> dict[str, Any]:
    """The morning job: channel posts first, then the owner's posts to approve,
    then each subscriber's digest."""
    from . import marketing

    out: dict[str, Any] = {}
    for name, job in (("channel_today", post_channel_today), ("channel_report", post_channel_report),
                      ("marketing_queue", marketing.run_queue)):
        try:
            out[name] = job()
        except Exception as exc:
            out[name] = {"posted": False, "error": str(exc)}
    out["digest"] = send_daily()
    return out


def stats() -> dict[str, Any]:
    return {"chats": len(_chat_ids())}
