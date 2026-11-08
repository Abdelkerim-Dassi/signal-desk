"""Scam check: red flags for a pasted message, a link, a token/wallet address or a
platform name.

Three layers, cheapest first:
  1. Deterministic red-flag rules on the pasted text (EN/FR/Arabic/Darija).
     They are modelled on what the CMF (Tunisia), the AMMC (Morocco) and the
     press describe: fixed or guaranteed returns, "send USDT to this wallet",
     unlock/withdrawal fees, recruiting friends, urgency, fake regulator
     approval, VIP signal groups, the AMMC fake-platform pattern, and so on.
  2. Lookups: a curated list of CMF/AMMC warnings (``data/warnings.json``),
     lookalike domains of big exchanges, the ScamSniffer and MetaMask phishing
     lists (downloaded and cached server-side; ScamSniffer is GPL so it is
     never shipped to the browser), GoPlus (phishing site, token security,
     malicious address) and the domain's registration date over RDAP.
  3. One short LLM pass (``explain``) that explains the flags in plain words.

The result never says something is safe. No flags means "we found no known
warning signs", which is not proof of anything.
"""

from __future__ import annotations

import asyncio
import hashlib
import ipaddress
import json
import logging
import re
import threading
import time
import unicodedata
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable
from urllib.parse import urlsplit

import requests

from .cache import TTLCache

log = logging.getLogger("qirat.scamcheck")

WARNINGS_FILE = Path(__file__).resolve().parent / "data" / "warnings.json"
LANGS = ("en", "fr", "ar")
MAX_TEXT = 4000
MAX_LINKS = 3
MAX_ADDRESSES = 2
HTTP_TIMEOUT = 8

SCAMSNIFFER_URL = "https://raw.githubusercontent.com/scamsniffer/scam-database/main/blacklist/domains.json"
METAMASK_URL = "https://raw.githubusercontent.com/MetaMask/eth-phishing-detect/main/src/config.json"
GOPLUS = "https://api.gopluslabs.io/api/v1"
RDAP_URL = "https://rdap.org/domain/{}"

SEVERITY_ORDER = {"high": 0, "medium": 1, "low": 2, "info": 3}

# ── text normalisation ───────────────────────────────────────────────────────


def _fold(s: str) -> str:
    """Drop accents and Arabic diacritics/hamza seats so patterns match loosely.

    NFKD splits "é" into "e" + accent and "أ" into "ا" + hamza; dropping the
    combining marks keeps the base letter. Case is left alone (patterns use
    re.I) so regex escapes like \\S survive when patterns are folded too.
    """
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if unicodedata.category(ch) != "Mn")
    return s.replace("ى", "ي").replace("ة", "ه").replace("ـ", "").replace("’", "'")


def _norm(s: str) -> str:
    return re.sub(r"\s+", " ", _fold(s).lower()).strip()


def _rx(*patterns: str) -> list[re.Pattern[str]]:
    return [re.compile(_fold(p), re.I) for p in patterns]


def _search(rxs: list[re.Pattern[str]], text: str) -> re.Match[str] | None:
    for rx in rxs:
        m = rx.search(text)
        if m:
            return m
    return None


# ── message rules ────────────────────────────────────────────────────────────

NUM = r"\d+(?:[.,]\d+)?"
PCT = r"(?:%|٪|percent|pour ?cent|بالمائه|بالميه|في المائه)"
DAY = r"(?:day|daily|jour|journalier|quotidien\w*|يوم|يومي|يوميا|نهار)"
WEEK = r"(?:week|weekly|semaine|hebdo\w*|اسبوع|اسبوعيا|جمعه)"
MONTH = r"(?:month|monthly|mois|mensuel\w*|شهر|شهريا)"
PERIOD = rf"(?:ال)?(?:{DAY}|{WEEK}|{MONTH})"
PER = r"(?:per|a|an|/|par|every|each|chaque|tous les|في|كل|ف)"
CRYPTO = r"(?:usdt|usdc|btc|eth|bnb|trx|sol|crypto\w*|bitcoin|tether|token|coins?|عمله|عملات|كريبتو|بيتكوين)"
SEND = r"(?:send|transfer|deposit|pay|envoye[rz]?|envoie|envoyer|transfere[rz]?|depose[rz]?|verse[rz]?|ابعث|ابعثلي|بعث|ارسل|حول|خلص|اودع|ادفع|ab3ath|ba3ath)"
NEGATION = re.compile(_fold(r"(?:never|don'?t|do not|not|no one|nobody|jamais|ne |n'|aucun|personne ne|لا |ما |ليس|ليست|غير |عمرك|ابدا|متعطيش|ما تعطيش|موش)"), re.I)
WARNING_WORDS = _rx(
    r"\b(?:warns?|warning|alert|caution|beware|fake|false|fraud\w*|scam\w*|impersonat\w*)\b",
    r"\b(?:mise en garde|met en garde|alerte|faux|fausse|frauduleu\w*|arnaque\w*|escroquer\w*|usurp\w*)\b",
    r"(?:يحذر|تحذير|تحذر|مزور|مزيف|احتيال|نصب|تحيل)",
)
PITCH = _rx(
    r"\b(?:invest\w*|profits?|returns?|deposit|gains?|earn\w*|rendement|placement|gagne\w*|benefices?)\b",
    r"(?:ربح|ارباح|استثمر|اودع|ايداع|فلوس)",
)

# rule id -> (severity, compiled patterns). Order is the display order inside a severity.
RULES: dict[str, tuple[str, list[re.Pattern[str]]]] = {
    "guaranteed_returns": ("high", _rx(
        r"\bguarantee[ds]?\b.{0,30}\b(?:profit|return|income|gain|earning|payout)s?",
        rf"\bguarantee[ds]?\b.{{0,15}}{NUM}\s*{PCT}",
        r"\b(?:profit|return|income|gain|earning|payout)s?\b.{0,20}\bguarantee[ds]?\b",
        r"\b(?:risk[- ]?free|no risk|zero risk|without (?:any )?risk|100 ?% (?:safe|secure[d]?|sure))\b",
        r"\b(?:gain|benefice|profit|rendement|revenu|retour|interet)s?\s+(?:\w+\s+)?garanti",
        r"\bgaranti(?:e|es|s)?\s+(?:a\s+)?100",
        r"\bsans (?:aucun )?risque\b|\bzero risque\b|\b100 ?% (?:sur|securise|garanti)",
        r"(?:ربح|ارباح|فايده|فائده|مدخول|دخل|فلوس|مرابيح)\s*\S*\s*مضمون",
        r"مضمون\S*\s*(?:100|ميه بالميه|مية بالمية)",
        r"(?:بدون (?:اي )?مخاطر|بلاش (?:ريسك|risk|مخاطر)|ما فماش (?:ريسك|risk)|بدون ريسك)",
        rf"{NUM}\s*%\s*(?:accurate|accuracy|win ?rate|success rate|de reussite|de precision|نجاح|دقه)\b.{{0,40}}(?:signal|trade|trading|bot|توصي|صفق)",
        rf"(?:signal|trade|trading|bot|توصي|صفق).{{0,40}}{NUM}\s*%\s*(?:accurate|accuracy|win ?rate|success rate|de reussite|de precision|نجاح|دقه)",
    )),
    "fixed_returns": ("high", _rx(
        rf"{NUM}\s*{PCT}\s*(?:of\s+)?(?:(?:profit|return|gain|interest|benefice|rendement|ربح|ارباح|فائده|فايده)s?\s*)?{PER}?\s*(?:the\s+|le\s+|la\s+)?{PERIOD}\b",
        rf"(?:{DAY}|{WEEK}|{MONTH})\s*{NUM}\s*{PCT}",
        rf"(?:returns?|profits?|rendements?|gains?|ارباح|ربح)\s*(?:of|de|:|ب)?\s*{NUM}\s*{PCT}\s*{PER}?\s*{PERIOD}",
        r"\bdouble (?:your|ur) (?:money|investment|capital|crypto|btc|usdt|bitcoin|eth|ethereum|coins|deposit)\b",
        r"\bdoubler? (?:votre|ton|vos|tes) (?:argent|capital|mise|investissement|crypto)\b",
        rf"\bx ?\d{{1,3}}\b.{{0,25}}(?:\d+\s*(?:days?|jours?|يوم|ايام|weeks?|semaines?))",
        rf"\b\d{{1,3}} ?x\b.{{0,15}}(?:your|vos|ton|votre|in|en)\b.{{0,25}}(?:\d+\s*(?:days?|jours?|يوم|ايام|weeks?|semaines?))",
        r"(?:ضاعف|تضاعف|نضاعف|يضاعف)\S*\s*(?:فلوسك|اموالك|راس مالك|راسمالك|استثمارك)",
        r"(?:فلوسك|اموالك|راس مالك)\s*\S*\s*(?:تتضاعف|fois)",
        r"\bfois (?:deux|dix|\d+)\b.{0,30}(?:jours?|ايام|يوم|نهار|شهر|semaines?)",
        r"(?:تربح|تخرج|ترجعلك|ترجع)\s*\S*\s*(?:fois|مرات|اضعاف)",
    )),
    "send_to_wallet": ("high", []),  # combined rule, see _send_to_wallet
    "unlock_fee": ("high", _rx(
        r"\b(?:unlock|withdrawal|withdraw|release|activation|verification|clearance|liquidity|upgrade|unfreez\w*)\s*(?:fee|fees|tax|taxes|charge|deposit|payment)\b",
        r"\b(?:pay|deposit|send|top[- ]?up)\b.{0,40}\b(?:to|before (?:you )?(?:can )?|in order to|first to|so you can)\s*(?:withdraw|unlock|release|receive your|get your|cash out)",
        r"\btax\b.{0,20}\b(?:before|to)\b.{0,10}\bwithdraw",
        r"\bfrais\s+(?:de\s+)?(?:retrait|deblocage|activation|liberation|deverrouillage|verification|deblocage)",
        r"\b(?:payer|verser|deposer|regler|envoyer)\b.{0,40}\b(?:pour|avant de|afin de)\s+(?:retirer|debloquer|recuperer|liberer)",
        r"\btaxe\s+(?:de|sur le|sur les)\s+(?:retrait|gains)",
        r"\bpacks?\s+(?:d'?activation|vip|premium)\b|\bactivation packs?\b",
        r"رسوم\s*(?:ال)?(?:سحب|فك|تفعيل|تحرير|ضريبه)",
        r"(?:ادفع|خلص|اودع|حول|ابعث)\S*\b.{0,40}(?:باش|لكي|حتى|قبل ما|قبل)\s*(?:تسحب|تنجم تسحب|تفك|نسحب|تستلم|تخرج فلوسك)",
        r"ضريبه\s*.{0,15}سحب|باقه\s*(?:ال)?تفعيل",
    )),
    "recruit": ("high", _rx(
        r"\b(?:invite|recruit|refer|bring|add)\s+(?:\w+\s+){0,3}(?:friends|people|members|persons|relatives)\b",
        r"\b(?:ramene[rz]?|parraine[rz]?|invite[rz]?|recrute[rz]?)\s+(?:\w+\s+){0,3}(?:amis|personnes|membres|proches|filleuls)\b",
        r"\b(?:referral|parrainage|filleul)\w*\b.{0,50}\b(?:commission|bonus|earn|gagne\w*|reward|recompense)",
        r"\b(?:downline|upline|multi[- ]?level|mlm|matrix plan|level [123] commission|commission de niveau)\b",
        r"(?:جيب|جيبلي|جيبو|ادع|ادعو|ادعي|استدعي|زيد)\s*(?:\S+\s*){0,2}(?:صحابك|اصحابك|اصدقاءك|اصدقائك|اصدقاء|اشخاص|عباد|ناس|افراد|اعضاء|عايلتك)",
        r"(?:عموله|نسبه|ربح|تربح)\s*(?:على|عن|من)\s*(?:كل\s*)?(?:شخص|عضو|واحد|فرد|عبد)",
    )),
    "managed_money": ("high", _rx(
        r"\b(?:we|our (?:team|experts?|traders?|bot|robot|ai)|i|my team)\s+(?:will\s+|can\s+)?(?:trade|invest|manage|grow)\s+(?:\w+\s+){0,2}(?:for you|on your behalf|your (?:money|funds|capital|account|portfolio|crypto))",
        r"\b(?:trades?|invests?|manages?)\s+(?:\w+\s+)?(?:for you|on your behalf)\b",
        r"\baccount management\b|\bmanage your (?:binance |trading )?account\b",
        r"\b(?:on|nous|je)\s+(?:gere|gerons|investit|investissons|trade|tradons|fait fructifier|faisons fructifier)\s+(?:\w+\s+){0,2}(?:pour (?:vous|toi)|votre (?:argent|capital|compte|portefeuille)|ton (?:argent|capital|compte))",
        r"\bgestion (?:de|du) (?:votre |ton )?(?:portefeuille|compte|capital)\b",
        r"(?:نتداول|نستثمر|ندير|نتصرف|نخدم|نخدمو|نخدملك)\s*(?:\S+\s*){0,2}(?:عنك|لك|في فلوسك|بفلوسك|في حسابك|محفظتك|فلوسك)",
        r"اداره\s*(?:محفظتك|حسابك|اموالك|المحافظ)",
    )),
    "secret_phrase": ("high", []),  # needs a negation check, see _secret_phrase
    "wallet_drainer": ("high", _rx(
        r"\b(?:connect|link|sync|validate|verify|import)\s+(?:your\s+)?wallet\b.{0,60}\b(?:claim|airdrop|reward|giveaway|free|eligible|bonus)",
        r"\b(?:claim|airdrop|reward|giveaway|eligible)\b.{0,60}\b(?:connect|link|sync|validate|verify|import)\s+(?:your\s+)?wallet\b",
        r"\bconnecte[rz]? (?:votre|ton) (?:wallet|portefeuille)\b.{0,60}\b(?:reclame|airdrop|recompense|gratuit|bonus)",
        r"(?:اربط|وصل|اربط)\s*محفظتك.{0,50}(?:مجاني|هديه|مكافاه|airdrop|ايردروب)",
        r"\bsend\s+\S+\s+(?:\S+\s+)?(?:and|&)?\s*(?:get|receive|we(?:'ll| will)? send)\s+(?:\S+\s+){0,2}(?:back|double|2x)\b",
        r"\benvoye[rz]?\s+\S+\s+.{0,20}\b(?:recevez|recois)\b.{0,20}\b(?:double|2x|le double)",
    )),
    "recovery_scam": ("high", _rx(
        r"\b(?:recover|retrieve|get back)\s+(?:all\s+)?(?:your|ur)\s+(?:\w+\s+)?(?:funds|money|crypto|bitcoin|assets|usdt|investment)\b",
        r"\b(?:fund|crypto|asset)s? recovery (?:service|expert|agent|team)\b",
        r"\brecuper\w*\s+(?:vos|ton|tes|votre)\s+(?:\w+\s+)?(?:fonds|argent|crypto\w*|investissement)",
        r"(?:استرجاع|استرداد)\s*(?:اموالك|فلوسك|عملاتك)|(?:نرجعلك|نرجعولك|نرجعو)\s*فلوسك",
    )),
    "p2p_meetup": ("high", _rx(
        r"\b(?:meet|meetup|in person|face to face|hand to hand|rencontr\w*|en personne|main a main|rendez-vous)\b.{0,60}\b(?:cash|crypto\w*|usdt|btc|bitcoin|especes|liquide)\b",
        r"\b(?:cash|crypto\w*|usdt|btc|bitcoin|especes|liquide)\b.{0,60}\b(?:meet|meetup|in person|face to face|hand to hand|rencontr\w*|en personne|main a main|rendez-vous)\b",
        rf"\b{CRYPTO}\b.{{0,30}}\b(?:cheap|below market|under market|discount|moins cher|pas cher|prix bas|en dessous du prix|sous le prix)\b",
        r"\b(?:cheap|discount|moins cher|pas cher)\s+(?:usdt|btc|crypto\w*|bitcoin)",
        r"(?:نتلاقاو|نتقابلو|نتقابل|نلتقي|نتلاقى|يد بيد|وجها لوجه).{0,50}(?:كاش|فلوس|كريبتو|usdt|بيتكوين|btc)",
        r"(?:usdt|btc|كريبتو|بيتكوين).{0,30}(?:رخيص|ارخص|بسوم اقل|تحت السوم|سوم مزيان)",
        r"\brelease (?:the )?(?:crypto|coins|usdt|btc) first\b|\bmark(?:ed)? (?:it )?as paid\b|\bpayment from (?:my )?(?:friend|brother|another account|third party)",
        r"\bliber\w* (?:d'abord|en premier)\b|\bvirement d'un tiers\b",
    )),
    "fake_regulator": ("high", []),  # combined rule, see _fake_regulator
    "fake_platform_pattern": ("high", []),  # combined rule, see _fake_platform
    "task_scam": ("high", _rx(
        r"\b(?:tasks?|missions?|taches?|orders? to (?:grab|complete))\b.{0,60}\b(?:recharge|top[- ]?up|deposit|depot|usdt|commission|earn|paid|gagne\w*|remuner\w*)\b",
        r"\b(?:like|rate|review|follow)\s+(?:\w+\s+)?(?:videos|posts|products|hotels|apps)\b.{0,50}\b(?:earn|paid|commission|\$|usdt)",
        r"\b(?:liker|noter|evaluer)\s+(?:des\s+)?(?:videos|produits|hotels|applications)\b.{0,50}\b(?:gagne\w*|remuner\w*|commission|usdt)",
        r"(?:مهام|مهمه|تاسك|تاسكات)\s*.{0,40}(?:ربح|عموله|تربح|خلاص|شحن|usdt)",
    )),
    "impersonation": ("medium", _rx(
        r"\b(?:your|votre|ton) (?:account|compte|wallet|portefeuille)\b.{0,20}\b(?:will be|has been|a ete|sera|is|est)\s+(?:\w+\s+)?(?:suspended|blocked|locked|frozen|closed|restricted|suspendu|bloque|gele|ferme|restreint)\b",
        r"\b(?:binance|metamask|trust ?wallet|coinbase|okx|bybit|kucoin|bitget)\s+(?:support|team|admin|agent|service client|customer service|security)\b.{0,60}\b(?:dm|contact|whatsapp|telegram|verify|click|send|account)",
        r"حسابك\s*(?:سيتم|تم|باش يتسكر|باش يتبلوكا|مجمد|موقوف|سيغلق)",
    )),
    "vip_signals": ("medium", _rx(
        r"\bvip\b.{0,25}\b(?:group|channel|signals?|groupe|canal|club|room)\b",
        r"\b(?:group|groupe|canal|channel|club)\s+vip\b",
        r"\b(?:signals? (?:group|channel)|pump (?:group|signal)\w*|groupe de signaux|canal de signaux|insider (?:group|tips|info))\b",
        r"(?:قروب|مجموعه|قناه|جروب)\s*(?:ال)?vip|vip\s*(?:قروب|مجموعه|قناه|جروب)",
        r"(?:توصيات|اشارات|سينيالات)\s*(?:\S+\s*){0,2}(?:مضمون|يوميه|vip|مجانيه|ربح|ذهبيه)",
    )),
    "income_promise": ("medium", _rx(
        rf"\b(?:earn|make|gagne[rz]?|win)\s+(?:up to |jusqu'a |about |environ )?\$?\s?{NUM}\s*(?:k\b)?\s*(?:\$|usd|usdt|dt|tnd|dinars?|dh|mad|euros?|€|dollars?)?\s*{PER}?\s*{PERIOD}\b",
        rf"(?:تربح|اربح|تخرج|ربح|مدخول|دخل)\s*(?:حتى\s*)?{NUM}\s*(?:دينار|دولار|درهم|د|dt|\$|usdt)?\s*(?:{PER}\s*)?{PERIOD}",
        r"\b(?:passive income|revenu passif|work from home and earn|travail a domicile)\b|دخل (?:سلبي|يومي|قار)",
    )),
    "urgency": ("medium", _rx(
        r"\b(?:only today|today only|last chance|limited (?:spots|places|seats|time|offer)|hurry|act now|don'?t miss|before it'?s too late|ends (?:tonight|today)|only \d+ (?:spots|places|seats) left|within \d+ ?(?:hours|hrs|h|minutes|mins))\b",
        r"\b(?:derniere chance|places limitees|offre limitee|aujourd'hui seulement|seulement aujourd'hui|depeche[sz]?-?(?:vous|toi)|faites vite|fais vite|ne ratez pas|avant qu'il ne soit trop tard|dans les \d+ ?h(?:eures)?)\b",
        r"(?:عرض محدود|اخر فرصه|فرصه اخيره|بسرعه|اسرع|ما تفوتش|متفوتش|لا تفوت|اماكن محدوده|بلايص محدوده|اليوم فقط|غير اليوم|قبل ما يفوت|الوقت محدود|الفرصه ما تتعاودش)",
    )),
    "high_leverage": ("medium", _rx(
        r"\b(?:leverage|levier|effet de levier)\b.{0,15}\b1\s*:\s*(?:100|200|300|400|500|1000|2000)\b",
        r"\b1\s*:\s*(?:200|300|400|500|1000|2000)\b.{0,15}\b(?:leverage|levier)\b",
        r"رافعه\s*.{0,10}(?:100|200|500|1000)",
    )),
}

_SEND_RX = _rx(rf"\b{SEND}\b")
_CRYPTO_RX = _rx(rf"\b{CRYPTO}\b")
_THEIR_WALLET_RX = _rx(
    r"\b(?:this|my|our|the following|the|that)\s+(?:\w+\s+)?(?:wallet|address|trc-?20 address|erc-?20 address)\b",
    r"\b(?:wallet|address)\s*(?:below|:|here)",
    r"\b(?:cette|mon|notre|l'|la|ce)\s*(?:adresse|wallet|portefeuille)\b",
    r"\b(?:adresse|wallet|portefeuille)\s*(?:ci-dessous|suivante|:)",
    r"(?:هذه|هاذي|هذا|هاذا)\s*(?:ال)?(?:محفظه|عنوان)|(?:محفظتي|عنواني|المحفظه هاذي|العنوان هذا|محفظه متاعي)|(?:محفظه|عنوان)\s*:",
)
_YOUR_WALLET_RX = _rx(r"\b(?:your own|your|ton propre|votre propre|ton|votre|vos)\s+(?:\w+\s+)?(?:wallet|address|adresse|portefeuille)", r"محفظتك")
_SECRET_RX = _rx(
    r"\b(?:seed|recovery|secret|mnemonic|backup)\s*(?:phrase|words|key)\b",
    r"\b(?:12|24)[- ]?(?:words|mots|word phrase)\b",
    r"\bprivate key\b|\bcle privee\b|\bphrase (?:secrete|de recuperation)\b|\bmots? de (?:recuperation|passe)\b|\bpassword\b",
    r"المفتاح الخاص|العبارات السريه|كلمات الاسترجاع|عباره الاسترداد|(?:12|24)\s*كلمه|كلمه السر|المودباس",
)
_ASK_SECRET_RX = _rx(
    r"\b(?:send|share|give|enter|type|provide|confirm|verify|validate|import|paste)\b",
    r"\b(?:envoye[rz]?|partage[rz]?|donne[rz]?|entre[rz]?|saisi[rs]?|saisisse[rz]|tape[rz]?|confirme[rz]?|colle[rz]?)\b",
    r"(?:ابعث|ابعثلي|ارسل|اعطيني|عطيني|ادخل|اكتب|شارك|اكتبلي)",
)
_REGULATOR_RX = _rx(
    r"\b(?:cmf|ammc|sec|bct|fca|amf|cysec|finra|banque centrale|central bank|conseil du marche financier)\b",
    r"(?:هيئه السوق الماليه|البنك المركزي|الهيئه المغربيه لسوق الرساميل)",
)
_APPROVAL_RX = _rx(
    r"\b(?:approved|licen[cs]ed|authori[sz]ed|regulated|registered|certified|certificate|agree[e]?s?|agrement|autorise[e]?s?|reglemente[e]?s?|certifie[e]?s?|licence|license)\b",
    r"(?:مرخص|مرخصه|معتمد|معتمده|ترخيص|مصادق|شهاده)",
)
_FAKE_PLATFORM_STEPS: dict[str, list[re.Pattern[str]]] = {
    "ad": _rx(r"\b(?:facebook|instagram|tiktok|youtube|ad|ads|advert\w*|pub|publicite|annonce|sponsori[sz]\w*)\b", r"(?:اعلان|فيسبوك|فايسبوك|انستغرام|تيك ?توك)"),
    "chat": _rx(r"\b(?:whatsapp|telegram|wa\.me|t\.me)\b", r"(?:واتساب|واتس|تيليغرام|تلغرام|تيليجرام|تليغرام)"),
    "mentor": _rx(r"\b(?:mentor|coach|teacher|professor|prof|expert|analyst|assistant|advisor|adviser|conseiller|analyste|formateur|account manager|gestionnaire)\b", r"(?:استاذ|مدرب|خبير|مساعد|مستشار|محلل|الكوتش)"),
    "signup": _rx(r"\b(?:register|sign up|signup|create (?:an )?account|download (?:the|our) app|inscri\w*|cree[rz]? (?:un )?compte|telecharge[rz]? (?:l'|notre )?app\w*|platform|plateforme)\b", r"(?:سجل|منصه|تطبيق|حمل ال)"),
    "deposit": _rx(r"\b(?:deposit|first investment|minimum|invest (?:just|only)|start with|depot|commence[rz]? avec|investi[rs]? (?:seulement|juste))\b", r"(?:ايداع|اودع|ابدا ب|استثمر ب|حط)"),
    "blocked": _rx(r"\b(?:withdraw\w*|retrait|retirer)\b.{0,40}\b(?:fee|fees|frais|tax|taxe|blocked|bloque|frozen|gele|refused|refuse)\b", r"(?:سحب|تسحب).{0,30}(?:رسوم|ضريبه|مجمد|محظور|موقوف|مبلوكي)"),
}


def _first_match_snippet(m: re.Match[str] | None, text: str) -> str | None:
    if not m:
        return None
    start, end = max(0, m.start() - 10), min(len(text), m.end() + 10)
    return text[start:end].strip()


def _negated_before(text: str, pos: int) -> bool:
    return bool(NEGATION.search(text[max(0, pos - 30):pos]))


def _send_to_wallet(t: str, has_address: bool) -> re.Match[str] | None:
    send = _search(_SEND_RX, t)
    if not send:
        return None
    theirs = _search(_THEIR_WALLET_RX, t)
    if theirs and _search(_YOUR_WALLET_RX, t) and not has_address:
        return None  # "send USDT to your own wallet": a how-to, not a pitch
    if (theirs or has_address) and (_search(_CRYPTO_RX, t) or theirs):
        return theirs or send
    return None


def _secret_phrase(t: str) -> re.Match[str] | None:
    for rx in _SECRET_RX:
        for m in rx.finditer(t):
            if _negated_before(t, m.start()):
                continue
            window = t[max(0, m.start() - 60): m.end() + 40]
            if _search(_ASK_SECRET_RX, window):
                return m
    return None


def _fake_regulator(t: str, other_flags: set[str]) -> tuple[str, re.Match[str]] | None:
    if _search(WARNING_WORDS, t):
        return None  # a warning *about* fake approvals, e.g. a news headline
    for rx in _REGULATOR_RX:
        for m in rx.finditer(t):
            window = t[max(0, m.start() - 50): m.end() + 50]
            if _search(_APPROVAL_RX, window):
                pitch = bool(_search(PITCH, t)) or bool(other_flags)
                return ("high" if pitch else "medium"), m
    return None


def _fake_platform(t: str) -> list[str]:
    steps = [k for k, rxs in _FAKE_PLATFORM_STEPS.items() if _search(rxs, t)]
    if len(steps) >= 3 and ("deposit" in steps or "blocked" in steps):
        return steps
    return []


# ── link / domain checks ─────────────────────────────────────────────────────

URL_RX = re.compile(
    r"(?:https?://|www\.)[^\s<>\"'()]+|(?<![@\w.-])(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:xn--[a-z0-9-]+|[a-z]{2,24})(?::\d+)?(?:/[^\s<>\"'()]*)?",
    re.I,
)
COMMON_TLDS = {
    "com", "net", "org", "io", "app", "info", "biz", "xyz", "top", "vip", "club", "online", "site", "live",
    "shop", "store", "pro", "finance", "exchange", "trade", "money", "cash", "capital", "fund", "market",
    "network", "cloud", "tech", "dev", "link", "click", "buzz", "icu", "cc", "co", "me", "tv", "ai", "gg",
    "ltd", "group", "global", "world", "website", "space", "fun", "today", "investments", "bond", "cyou",
    "sbs", "lat", "asia", "mobi", "name", "gov", "edu", "int", "eu", "us", "uk", "news", "academy", "wiki",
    "ws", "gold", "bet", "win", "plus", "zone", "one", "best", "loan", "work", "rest", "life", "digital",
}
MULTI_SUFFIXES = {
    "com.tn", "gov.tn", "org.tn", "net.tn", "ens.tn", "nat.tn", "co.ma", "gov.ma", "net.ma", "org.ma",
    "co.uk", "org.uk", "gov.uk", "ac.uk", "com.au", "co.za", "com.br", "co.in", "com.tr", "com.eg",
    "com.sa", "com.dz", "co.jp", "com.cn", "com.ng", "co.ke", "com.my", "com.sg", "com.ph",
}
SHORTENERS = {"bit.ly", "tinyurl.com", "cutt.ly", "t.co", "goo.gl", "is.gd", "ow.ly", "rb.gy", "shorturl.at", "s.id", "tiny.cc", "rebrand.ly", "bitly.com", "v.gd"}
CHAT_INVITES = {"t.me", "telegram.me", "wa.me", "chat.whatsapp.com", "whatsapp.com", "discord.gg"}
RISKY_TLDS = {"xyz", "top", "vip", "club", "icu", "buzz", "cc", "online", "site", "shop", "cyou", "sbs", "lat", "click", "rest", "bond", "win", "bet", "loan", "work", "fun"}

# brand -> official registrable domains. Brands under 5 letters only match a
# whole hyphen/dot-separated token so "gate" doesn't fire on "investigate".
BRANDS: dict[str, set[str]] = {
    "binance": {"binance.com", "binance.us", "binance.vision", "binance.info", "binance.me", "bnbchain.org", "binance.org"},
    "coinbase": {"coinbase.com"},
    "kraken": {"kraken.com"},
    "okx": {"okx.com"},
    "bybit": {"bybit.com"},
    "kucoin": {"kucoin.com"},
    "bitget": {"bitget.com"},
    "mexc": {"mexc.com"},
    "bitfinex": {"bitfinex.com"},
    "bitstamp": {"bitstamp.net"},
    "metamask": {"metamask.io"},
    "trustwallet": {"trustwallet.com"},
    "ledger": {"ledger.com"},
    "trezor": {"trezor.io"},
    "phantom": {"phantom.app", "phantom.com"},
    "uniswap": {"uniswap.org"},
    "pancakeswap": {"pancakeswap.finance"},
    "opensea": {"opensea.io"},
    "coingecko": {"coingecko.com"},
    "coinmarketcap": {"coinmarketcap.com"},
    "etherscan": {"etherscan.io"},
    "bscscan": {"bscscan.com"},
    "tronscan": {"tronscan.org"},
    "tronlink": {"tronlink.org"},
    "blockchain": {"blockchain.com"},
    "cmf": {"cmf.tn"},
    "ammc": {"ammc.ma"},
    "qirat": {"qirat.tn"},
}
# Other domains people ask about often that are fine to recognise as "known".
KNOWN_SITES = {
    "crypto.com": "Crypto.com", "gate.io": "Gate", "gate.com": "Gate", "htx.com": "HTX", "bct.gov.tn": "BCT",
    "sec.gov": "SEC", "amf-france.org": "AMF", "gemini.com": "Gemini", "exodus.com": "Exodus",
}
# Brand names that are also ordinary words only match as a whole token.
GENERIC_BRANDS = {"ledger", "phantom", "blockchain", "kraken", "trezor"}
HOMOGLYPHS = str.maketrans({"0": "o", "1": "l", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b", "@": "a", "$": "s", "!": "i", "|": "l"})


def _levenshtein(a: str, b: str) -> int:
    if abs(len(a) - len(b)) > 2:
        return 3
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
        prev = cur
    return prev[-1]


def parse_host(raw: str) -> str | None:
    s = raw.strip().strip(".,;:!?)»\"'").lower()
    if not s:
        return None
    if "://" not in s:
        s = "http://" + s
    try:
        host = urlsplit(s).hostname or ""
    except ValueError:
        return None
    host = host.strip(".")
    if not host or "." not in host:
        return None
    return host


def registrable(host: str) -> str:
    labels = host.split(".")
    if len(labels) >= 3 and ".".join(labels[-2:]) in MULTI_SUFFIXES:
        return ".".join(labels[-3:])
    return ".".join(labels[-2:])


def _is_ip(host: str) -> bool:
    try:
        ipaddress.ip_address(host)
        return True
    except ValueError:
        return False


def find_links(text: str) -> list[str]:
    hosts: list[str] = []
    for m in URL_RX.finditer(text):
        token = m.group(0)
        host = parse_host(token)
        if not host:
            continue
        tld = host.rsplit(".", 1)[-1]
        explicit = token.lower().startswith(("http", "www."))
        if not explicit and not (tld in COMMON_TLDS or len(tld) == 2 or tld.startswith("xn--")):
            continue
        if not explicit and re.fullmatch(r"[\d.]+", host):
            continue
        if host not in hosts:
            hosts.append(host)
    return hosts[:MAX_LINKS]


def official_brand(reg: str) -> str | None:
    for brand, domains in BRANDS.items():
        if reg in domains:
            return brand
    return None


def lookalike_brand(host: str) -> str | None:
    """The brand a non-official host imitates, if any."""
    reg = registrable(host)
    if official_brand(reg) or reg in KNOWN_SITES:
        return None
    # every label except the public suffix, e.g. binance.com.verify-login.xyz → binance, com, verify-login
    suffix_len = 2 if reg.count(".") == 2 else 1
    labels = host.split(".")[:-suffix_len]
    tokens = [tok for label in labels for tok in re.split(r"[-_]+", label) if tok]
    joined = "".join(labels)
    for brand in BRANDS:
        if brand in ("qirat",):
            continue
        if len(brand) >= 5 and brand not in GENERIC_BRANDS:
            if brand in joined.replace("-", ""):
                return brand
        elif brand in tokens:
            return brand
    main = reg.split(".")[0]
    candidates = {main, main.translate(HOMOGLYPHS), main.replace("rn", "m").replace("vv", "w").translate(HOMOGLYPHS)}
    candidates |= {c.replace("-", "") for c in candidates}
    for brand in BRANDS:
        if len(brand) < 5 or brand in ("blockchain",):
            continue
        limit = 1 if len(brand) < 8 else 2
        for c in candidates:
            if c == brand or (abs(len(c) - len(brand)) <= limit and _levenshtein(c, brand) <= limit):
                return brand
    return None


# ── phishing lists (ScamSniffer + MetaMask), cached server-side ──────────────


class _PhishingLists:
    TTL = 12 * 3600
    RETRY = 600

    def __init__(self) -> None:
        self.scamsniffer: set[str] | None = None
        self.metamask: set[str] | None = None
        self.metamask_allow: set[str] = set()
        self.loaded_at = 0.0
        self.failed_at = 0.0
        self._lock = threading.Lock()

    def _fetch(self) -> None:
        ss = mm = None
        allow: set[str] = set()
        try:
            r = requests.get(SCAMSNIFFER_URL, timeout=15)
            r.raise_for_status()
            ss = {d.strip().lower() for d in r.json() if isinstance(d, str)}
        except Exception as exc:  # noqa: BLE001 - a list being down must not break the check
            log.warning("scamsniffer list unavailable: %s", exc)
        try:
            r = requests.get(METAMASK_URL, timeout=15)
            r.raise_for_status()
            cfg = r.json()
            mm = {d.strip().lower() for d in cfg.get("blacklist", []) if isinstance(d, str)}
            allow = {d.strip().lower() for d in cfg.get("whitelist", []) if isinstance(d, str)}
        except Exception as exc:  # noqa: BLE001
            log.warning("metamask list unavailable: %s", exc)
        if ss is not None:
            self.scamsniffer = ss
        if mm is not None:
            self.metamask, self.metamask_allow = mm, allow
        if ss is None and mm is None:
            self.failed_at = time.time()
        else:
            self.loaded_at = time.time()

    def ensure(self) -> None:
        now = time.time()
        fresh = self.loaded_at and now - self.loaded_at < self.TTL
        if fresh or (self.failed_at and now - self.failed_at < self.RETRY):
            return
        with self._lock:
            if self.loaded_at and time.time() - self.loaded_at < self.TTL:
                return
            self._fetch()

    def lookup(self, host: str) -> dict[str, bool | None]:
        parts = host.split(".")
        candidates = {".".join(parts[i:]) for i in range(len(parts) - 1)}
        allowed = bool(candidates & self.metamask_allow)
        return {
            "scamsniffer": None if self.scamsniffer is None else bool(candidates & self.scamsniffer),
            "metamask": None if self.metamask is None else (bool(candidates & self.metamask) and not allowed),
        }


PHISHING_LISTS = _PhishingLists()
_lookup_cache = TTLCache(default_ttl=3600.0)


def _http_json(url: str, params: dict[str, Any] | None = None, timeout: float = HTTP_TIMEOUT) -> Any:
    r = requests.get(url, params=params, timeout=timeout, headers={"Accept": "application/json", "User-Agent": "QiratScamCheck/1.0"})
    if r.status_code == 404:
        return None
    r.raise_for_status()
    return r.json()


def goplus_phishing(host: str) -> bool | None:
    key = f"gp:site:{host}"
    cached = _lookup_cache.get(key)
    if cached is not None:
        return cached
    try:
        data = _http_json(f"{GOPLUS}/phishing_site", {"url": host})
        val = bool(int((data or {}).get("result", {}).get("phishing_site", 0)))
    except Exception as exc:  # noqa: BLE001
        log.info("goplus phishing_site failed: %s", exc)
        return None
    _lookup_cache.set(key, val)
    return val


def domain_age_days(reg: str) -> int | None:
    key = f"rdap:{reg}"
    cached = _lookup_cache.get(key)
    if cached is not None:
        return cached if cached >= 0 else None
    try:
        data = _http_json(RDAP_URL.format(reg), timeout=6)
    except Exception as exc:  # noqa: BLE001
        log.info("rdap failed for %s: %s", reg, exc)
        return None
    age = -1
    for ev in (data or {}).get("events", []):
        if ev.get("eventAction") == "registration" and ev.get("eventDate"):
            try:
                created = datetime.fromisoformat(ev["eventDate"].replace("Z", "+00:00"))
                age = max(0, (datetime.now(timezone.utc) - created).days)
            except ValueError:
                pass
    _lookup_cache.set(key, age, ttl=24 * 3600)
    return age if age >= 0 else None


# ── token / address checks (GoPlus) ──────────────────────────────────────────

EVM_RX = re.compile(r"\b0x[a-fA-F0-9]{40}\b")
TRON_RX = re.compile(r"\bT[1-9A-HJ-NP-Za-km-z]{33}\b")
SOL_RX = re.compile(r"^[1-9A-HJ-NP-Za-km-z]{32,44}$")
CHAINS = {
    "eth": "1", "ethereum": "1", "erc20": "1", "1": "1",
    "bsc": "56", "bnb": "56", "bep20": "56", "56": "56",
    "base": "8453", "8453": "8453",
    "polygon": "137", "matic": "137", "137": "137",
    "arbitrum": "42161", "arb": "42161", "42161": "42161",
    "optimism": "10", "op": "10", "10": "10",
    "avalanche": "43114", "avax": "43114", "43114": "43114",
    "tron": "tron", "trc20": "tron", "trx": "tron",
    "solana": "solana", "sol": "solana",
}
DEFAULT_EVM_CHAINS = ["1", "56", "8453", "137", "42161"]
CHAIN_NAMES = {"1": "Ethereum", "56": "BNB Chain", "8453": "Base", "137": "Polygon", "42161": "Arbitrum", "10": "Optimism", "43114": "Avalanche", "tron": "TRON", "solana": "Solana"}


def find_addresses(text: str) -> list[tuple[str, str | None]]:
    """(address, implied chain) pairs found in the text."""
    found: list[tuple[str, str | None]] = []
    for m in EVM_RX.finditer(text):
        found.append((m.group(0), None))
    for m in TRON_RX.finditer(text):
        found.append((m.group(0), "tron"))
    stripped = text.strip()
    if not found and SOL_RX.match(stripped) and re.search(r"\d", stripped) and re.search(r"[a-z]", stripped) and re.search(r"[A-Z]", stripped):
        found.append((stripped, "solana"))
    seen: set[str] = set()
    out = []
    for addr, chain in found:
        if addr.lower() not in seen:
            seen.add(addr.lower())
            out.append((addr, chain))
    return out[:MAX_ADDRESSES]


def _flag_val(d: dict[str, Any], key: str) -> bool:
    v = d.get(key)
    if isinstance(v, dict):
        v = v.get("status", v.get("value"))
    try:
        return str(v) not in ("", "None") and int(float(str(v))) == 1
    except ValueError:
        return False


def _tax(d: dict[str, Any], key: str) -> float | None:
    try:
        return float(d.get(key)) if d.get(key) not in (None, "") else None
    except (TypeError, ValueError):
        return None


def goplus_token(address: str, chain: str) -> dict[str, Any] | None:
    key = f"gp:tok:{chain}:{address.lower()}"
    cached = _lookup_cache.get(key)
    if cached is not None:
        return cached or None
    if chain == "solana":
        url = f"{GOPLUS}/solana/token_security"
    else:
        url = f"{GOPLUS}/token_security/{chain}"
    data = _http_json(url, {"contract_addresses": address})
    result = (data or {}).get("result") or {}
    info = result.get(address) or result.get(address.lower()) or (next(iter(result.values())) if result else None)
    _lookup_cache.set(key, info or {})
    return info or None


def goplus_address(address: str, chain: str | None) -> dict[str, Any] | None:
    key = f"gp:addr:{chain}:{address.lower()}"
    cached = _lookup_cache.get(key)
    if cached is not None:
        return cached or None
    params = {"chain_id": chain} if chain and chain not in ("solana",) else None
    data = _http_json(f"{GOPLUS}/address_security/{address}", params)
    result = (data or {}).get("result") or {}
    _lookup_cache.set(key, result)
    return result or None


TOKEN_RULES: list[tuple[str, str, str]] = [
    # (goplus field, flag id, severity)
    ("is_honeypot", "token_honeypot", "high"),
    ("cannot_sell_all", "token_cannot_sell", "high"),
    ("owner_change_balance", "token_owner_balance", "high"),
    ("hidden_owner", "token_hidden_owner", "high"),
    ("can_take_back_ownership", "token_take_back", "high"),
    ("selfdestruct", "token_selfdestruct", "high"),
    ("is_airdrop_scam", "token_airdrop_scam", "high"),
    ("is_mintable", "token_mintable", "medium"),
    ("is_blacklisted", "token_blacklist", "medium"),
    ("transfer_pausable", "token_pausable", "medium"),
    ("slippage_modifiable", "token_tax_changeable", "medium"),
    ("is_proxy", "token_proxy", "low"),
    # Solana-specific authorities
    ("mintable", "token_mintable", "medium"),
    ("freezable", "token_pausable", "medium"),
    ("balance_mutable_authority", "token_owner_balance", "high"),
]

OWNER_POWERS = {
    "token_owner_balance", "token_hidden_owner", "token_take_back", "token_selfdestruct",
    "token_mintable", "token_blacklist", "token_pausable", "token_tax_changeable", "token_proxy",
}

ADDRESS_RULES = [
    "phishing_activities", "stealing_attack", "cybercrime", "money_laundering", "financial_crime",
    "blackmail_activities", "sanctioned", "honeypot_related_address", "fake_kyc", "darkweb_transactions",
    "fake_token", "blacklist_doubt",
]


# ── warnings list ────────────────────────────────────────────────────────────

_warnings_cache: dict[str, Any] | None = None


def load_warnings() -> dict[str, Any]:
    global _warnings_cache
    if _warnings_cache is None:
        _warnings_cache = json.loads(WARNINGS_FILE.read_text(encoding="utf-8"))
    return _warnings_cache


def _alert(alert_id: str) -> dict[str, str] | None:
    for a in load_warnings().get("alerts", []):
        if a["id"] == alert_id:
            return {"name": a["title"], "url": a["source_url"], "date": a.get("date", "")}
    return None


def _squash(s: str) -> str:
    return re.sub(r"[^0-9a-z؀-ۿ]+", "", _norm(s))


def match_warnings(text: str) -> list[dict[str, Any]]:
    whole = _squash(text)
    spaced = " " + re.sub(r"[^0-9a-z؀-ۿ]+", " ", _norm(text)) + " "
    hits = []
    for e in load_warnings().get("entities", []):
        for alias in e.get("aliases", []) + [e["name"]]:
            sq = _squash(alias)
            if not sq:
                continue
            if e.get("match") == "exact":
                ok = whole == sq
            else:
                words = " " + re.sub(r"[^0-9a-z؀-ۿ]+", " ", _norm(alias)).strip() + " "
                ok = whole == sq or words in spaced or (len(sq) >= 8 and sq in whole)
            if ok:
                hits.append(e)
                break
    return hits


# ── localized strings ────────────────────────────────────────────────────────

L = dict[str, str]

FLAG_TEXT: dict[str, tuple[L, L]] = {
    "guaranteed_returns": (
        {"en": "Promises guaranteed or risk-free profit", "fr": "Promet un gain garanti ou sans risque", "ar": "يوعد بربح مضمون ولا بلا risk"},
        {"en": "Nobody can guarantee crypto profits. A promise of 'no risk' is the most common sign of an investment scam.", "fr": "Personne ne peut garantir des gains en crypto. Promettre « zéro risque » est le signe le plus courant d'une arnaque à l'investissement.", "ar": "حتى حدّ ما ينجّم يضمن ربح في الـ crypto. الوعد بـ«بلا risk» هو أشهر علامة متاع تحيّل في الاستثمار."},
    ),
    "fixed_returns": (
        {"en": "Promises a fixed % per day, week or month", "fr": "Promet un % fixe par jour, semaine ou mois", "ar": "يوعد بنسبة ثابتة في النهار، الجمعة ولا الشهر"},
        {"en": "Real markets go up and down. Fixed returns like '3% a day' or 'x10 in a month' are how Ponzi schemes pay old members with new members' money.", "fr": "Les vrais marchés montent et baissent. Un rendement fixe comme « 3 % par jour » ou « x10 en un mois », c'est ainsi que les pyramides paient les anciens avec l'argent des nouveaux.", "ar": "الأسواق الحقيقية تطلع وتهبط. أرباح ثابتة كيما «3% كل نهار» ولا «x10 في شهر» هي الطريقة متاع الـ Ponzi باش يخلّصو القدام بفلوس الجدد."},
    ),
    "send_to_wallet": (
        {"en": "Asks you to send crypto to their wallet", "fr": "Vous demande d'envoyer de la crypto à leur adresse", "ar": "يطلب منك تبعث crypto للـ wallet متاعهم"},
        {"en": "Crypto sent to a stranger's wallet cannot be reversed or recovered. Real platforms never ask you to pay a person's address.", "fr": "Une crypto envoyée à l'adresse d'un inconnu ne peut être ni annulée ni récupérée. Une vraie plateforme ne demande jamais de payer l'adresse d'une personne.", "ar": "الـ crypto اللي تبعثها لـ wallet متاع واحد ما تعرفوش ما ترجعش وما تتسترجعش. المنصّات الحقيقية عمرها ما تطلب تخلّص لعنوان متاع شخص."},
    ),
    "unlock_fee": (
        {"en": "Asks for a fee before you can withdraw", "fr": "Demande des frais avant de pouvoir retirer", "ar": "يطلب frais قبل ما تنجّم تسحب"},
        {"en": "'Pay a tax / unlock fee / activation pack to withdraw' is the last step of fake platforms. After you pay, they ask again. Real fees come out of your balance.", "fr": "« Payez une taxe / des frais de déblocage / un pack d'activation pour retirer » est la dernière étape des fausses plateformes. Après paiement, ils redemandent. Les vrais frais sont prélevés sur le solde.", "ar": "«خلّص ضريبة ولا frais de déblocage ولا pack d’activation باش تسحب» هي آخر خطوة في المنصّات الفالصو. كي تخلّص يطلبو مرّة أخرى. الـ frais الحقيقية تتنحّى من الرصيد متاعك."},
    ),
    "recruit": (
        {"en": "Pays you to recruit friends", "fr": "Vous paie pour recruter des proches", "ar": "يخلّصك باش تجيب صحابك"},
        {"en": "When earnings come from bringing in new people, it is a pyramid. It collapses, and your friends lose money too.", "fr": "Quand les gains viennent du recrutement, c'est une pyramide. Elle s'effondre, et vos proches perdent aussi.", "ar": "كي الربح يجي من جلب ناس جدد، هذا هرم. يطيح، وصحابك يخسرو زادة."},
    ),
    "managed_money": (
        {"en": "Offers to trade or manage your money for you", "fr": "Propose de trader ou gérer votre argent à votre place", "ar": "يعرض باش يتاجر ولا يتصرّف في فلوسك في بلاصتك"},
        {"en": "In Tunisia, managing money for others is reserved to licensed brokers, management companies and banks. The CMF warned about exactly this kind of offer on social media.", "fr": "En Tunisie, gérer l'argent d'autrui est réservé aux intermédiaires, sociétés de gestion et banques agréés. Le CMF a mis en garde contre ce type d'offre sur les réseaux sociaux.", "ar": "في تونس، التصرّف في فلوس الناس محصور في الوسطاء، شركات التصرّف والبانكات المرخّصين. والـ CMF حذّرت من العروض هاذي في السوشيال ميديا."},
    ),
    "secret_phrase": (
        {"en": "Asks for your secret phrase, private key or password", "fr": "Demande votre phrase secrète, clé privée ou mot de passe", "ar": "يطلب الكلمات السرّية، الـ private key ولا الـ password متاعك"},
        {"en": "Whoever has your 12/24 words or private key owns your wallet. No exchange, support agent or app ever needs them.", "fr": "Celui qui a vos 12/24 mots ou votre clé privée possède votre portefeuille. Aucune plateforme, aucun support n'en a besoin.", "ar": "اللي عندو الـ 12 ولا 24 كلمة ولا الـ private key متاعك، يملك الـ wallet متاعك. حتى منصّة وحتى support ما يستحقّهم."},
    ),
    "wallet_drainer": (
        {"en": "'Connect your wallet to claim' or 'send and get double'", "fr": "« Connectez votre wallet pour réclamer » ou « envoyez et recevez le double »", "ar": "«اربط الـ wallet متاعك باش تاخذ الهدية» ولا «ابعث وخوذ الضعف»"},
        {"en": "Fake airdrops and giveaways get you to sign a transaction that empties your wallet, or to send coins that never come back.", "fr": "Les faux airdrops et giveaways vous font signer une transaction qui vide votre wallet, ou envoyer des cryptos qui ne reviennent jamais.", "ar": "الـ airdrops والهدايا الفالصو يخلّيوك تمضي على عملية تفرّغ الـ wallet متاعك، ولا تبعث crypto ما ترجعش."},
    ),
    "recovery_scam": (
        {"en": "Offers to recover lost money", "fr": "Propose de récupérer de l'argent perdu", "ar": "يعرض باش يرجّعلك فلوس ضاعت"},
        {"en": "Victims of a scam are often targeted again by 'recovery experts' who ask for a fee first. Only the police and courts can do this.", "fr": "Les victimes d'arnaque sont souvent ciblées à nouveau par des « experts en récupération » qui demandent des frais d'abord. Seules la police et la justice peuvent agir.", "ar": "اللي تحيّلو عليهم برشا مرّات يتعاودو يتستهدفو من «خبراء استرجاع» يطلبو frais قبل. كان البوليس والقضاء ينجّمو يعملو هكّا."},
    ),
    "p2p_meetup": (
        {"en": "Cheap crypto, cash meetups or P2P payment tricks", "fr": "Crypto pas chère, rencontre en espèces ou astuces de paiement P2P", "ar": "crypto رخيص، لقاء بالكاش ولا حيل خلاص P2P"},
        {"en": "In 2026 'cheap crypto' meetups in Manouba turned into armed robberies. In P2P, fake 'paid' marks and third-party payments get bank accounts frozen.", "fr": "En 2026, des rendez-vous « crypto pas chère » à la Manouba ont fini en vols à main armée. En P2P, les faux « payé » et paiements par des tiers font geler des comptes.", "ar": "في 2026، لقاءات «crypto رخيص» في منوبة ولّات براكاجات بالسلاح. وفي الـ P2P، «خلّصتك» الفالصو والخلاص من كونط واحد آخر يخلّيو الكونطات تتجمّد."},
    ),
    "fake_regulator": (
        {"en": "Claims approval from a regulator (CMF, AMMC, SEC…)", "fr": "Se dit agréé par un régulateur (CMF, AMMC, SEC…)", "ar": "يقول إنّو مرخّص من هيئة (CMF، AMMC، SEC…)"},
        {"en": "The CMF and the AMMC both warned in 2026 that scammers copy their logos and send fake approval certificates. Check the regulator's own website, never a document they send you.", "fr": "Le CMF et l'AMMC ont averti en 2026 que des escrocs copient leurs logos et envoient de faux certificats. Vérifiez sur le site du régulateur, jamais sur un document envoyé.", "ar": "الـ CMF في تونس والـ AMMC في المغرب حذّرو في 2026 من متحيّلين ينسخو الـ logo متاعهم ويبعثو شهائد فالصو. فركس في السيت متاع الهيئة بيدها، موش في وثيقة يبعثوهالك."},
    ),
    "fake_platform_pattern": (
        {"en": "Matches the fake-platform pattern regulators describe", "fr": "Correspond au schéma des fausses plateformes décrit par les régulateurs", "ar": "يشبه للطريقة متاع المنصّات الفالصو اللي توصفها الهيئات"},
        {"en": "Ad on social media → WhatsApp/Telegram group → a 'mentor' → sign up on a platform → small deposit and fake profits → withdrawal blocked until you pay a fee. That is the AMMC's 6-step pattern.", "fr": "Pub sur les réseaux → groupe WhatsApp/Telegram → un « mentor » → inscription sur une plateforme → petit dépôt et faux gains → retrait bloqué contre des frais. C'est le schéma en 6 étapes de l'AMMC.", "ar": "إشهار في السوشيال ميديا ← قروب WhatsApp/Telegram ← «كوتش» ← تسجيل في منصّة ← إيداع صغير وأرباح فالصو ← السحب مسكّر حتى تخلّص frais. هذي هي الستّة خطوات اللي وصفتها الـ AMMC."},
    ),
    "task_scam": (
        {"en": "Pays for simple 'tasks' (likes, ratings, orders)", "fr": "Paie des « tâches » simples (likes, avis, commandes)", "ar": "يخلّص على «مهام» ساهلة (likes، تقييمات، commandes)"},
        {"en": "Task scams pay a little first, then ask you to 'recharge' or deposit USDT to unlock bigger tasks. The deposits are lost.", "fr": "Les arnaques aux tâches paient un peu d'abord, puis demandent de « recharger » ou de déposer des USDT pour débloquer plus. Les dépôts sont perdus.", "ar": "تحيّل المهام يخلّص شويّة في الأوّل، ومن بعد يطلب «recharge» ولا إيداع USDT باش يحلّ مهام أكبر. والإيداعات تضيع."},
    ),
    "impersonation": (
        {"en": "Pretends to be an exchange's support or warns your account will be blocked", "fr": "Se fait passer pour le support d'une plateforme ou menace de bloquer votre compte", "ar": "يعمل روحو support متاع منصّة ولا يهدّد بتسكير الكونط متاعك"},
        {"en": "Real support never contacts you first on WhatsApp or Telegram. Open the official app yourself to check.", "fr": "Le vrai support ne vous contacte jamais en premier sur WhatsApp ou Telegram. Ouvrez vous-même l'application officielle pour vérifier.", "ar": "الـ support الحقيقي عمرو ما يكلّمك هو الأوّل في WhatsApp ولا Telegram. حلّ التطبيقة الرسمية بيدك باش تثبّت."},
    ),
    "vip_signals": (
        {"en": "Pushes a VIP or signals group", "fr": "Pousse vers un groupe VIP ou de signaux", "ar": "يدزّك لقروب VIP ولا signals"},
        {"en": "Paid 'VIP signal' groups sell screenshots, not results. Many are the first step towards a fake platform or a pump-and-dump.", "fr": "Les groupes « VIP » de signaux vendent des captures d'écran, pas des résultats. Beaucoup sont la première étape vers une fausse plateforme ou un pump-and-dump.", "ar": "قروبات «VIP signals» بالفلوس يبيعو screenshots موش نتائج. وبرشا منهم أوّل خطوة لمنصّة فالصو ولا لعب في السوم."},
    ),
    "income_promise": (
        {"en": "Promises a set income (per day or month)", "fr": "Promet un revenu fixe (par jour ou par mois)", "ar": "يوعد بدخل ثابت (في النهار ولا الشهر)"},
        {"en": "A fixed income from crypto or 'from your phone' is not how markets work. Ask where the money really comes from.", "fr": "Un revenu fixe grâce à la crypto ou « depuis votre téléphone », ce n'est pas comme ça que marchent les marchés. Demandez d'où vient vraiment l'argent.", "ar": "دخل ثابت من الـ crypto ولا «من تلفونك» موش هكّا تخدم الأسواق. اسأل منين تجي الفلوس بالحقّ."},
    ),
    "urgency": (
        {"en": "Pressures you to act fast", "fr": "Vous pousse à agir vite", "ar": "يزربك باش تقرّر فيسع"},
        {"en": "'Last chance', 'only today', 'limited places': pressure stops you from checking. A real opportunity is still there tomorrow.", "fr": "« Dernière chance », « aujourd'hui seulement », « places limitées » : la pression empêche de vérifier. Une vraie opportunité sera encore là demain.", "ar": "«آخر فرصة»، «كان اليوم»، «بلايص محدودة»: الزربة تمنعك باش تثبّت. الفرصة الحقيقية تقعد موجودة غدوة."},
    ),
    "high_leverage": (
        {"en": "Very high leverage (1:100 or more)", "fr": "Effet de levier très élevé (1:100 ou plus)", "ar": "leverage عالي برشا (1:100 ولا أكثر)"},
        {"en": "With 1:200 leverage a 0.5% move against you wipes out your deposit. Unlicensed forex/crypto brokers advertise this to beginners.", "fr": "Avec un levier de 1:200, un mouvement de 0,5 % contre vous efface votre dépôt. Les courtiers non agréés le vantent aux débutants.", "ar": "بـ leverage 1:200، حركة 0.5% ضدّك تكفي باش تمسح الإيداع متاعك. الوسطاء الموش مرخّصين يبيعوها للمبتدئين."},
    ),
    "warned_entity": (
        {"en": "Named in a public warning: {name}", "fr": "Cité dans une mise en garde publique : {name}", "ar": "مذكور في تحذير رسمي: {name}"},
        {"en": "{summary}", "fr": "{summary}", "ar": "{summary}"},
    ),
    "phishing_list": (
        {"en": "Listed as a phishing site ({lists})", "fr": "Listé comme site de phishing ({lists})", "ar": "مكتوب كموقع phishing ({lists})"},
        {"en": "{host} is on a public list of crypto phishing sites. Sites like this copy a real wallet or exchange to steal logins and drain wallets.", "fr": "{host} figure sur une liste publique de sites de phishing crypto. Ces sites copient un vrai wallet ou une vraie plateforme pour voler identifiants et fonds.", "ar": "{host} موجود في ليستة عامة متاع مواقع phishing في الـ crypto. المواقع هاذي تقلّد wallet ولا منصّة حقيقية باش تسرق الدخول وتفرّغ الـ wallets."},
    ),
    "lookalike": (
        {"en": "Looks like {brand} but is not its official site", "fr": "Ressemble à {brand} mais n'est pas son site officiel", "ar": "يشبه لـ {brand} أما موش السيت الرسمي متاعو"},
        {"en": "{host} imitates {brand}. The official site is {official}. Fake exchange sites look identical and steal your login or deposit.", "fr": "{host} imite {brand}. Le site officiel est {official}. Les fausses plateformes sont identiques et volent identifiants ou dépôts.", "ar": "{host} يقلّد {brand}. السيت الرسمي هو {official}. المواقع الفالصو تبان كيف كيف وتسرق الدخول ولا الإيداع."},
    ),
    "new_domain": (
        {"en": "Website registered only {days} days ago", "fr": "Site enregistré il y a seulement {days} jours", "ar": "السيت تسجّل من {days} يوم برك"},
        {"en": "{host} is very new. Fake platforms change domains every few weeks after victims complain.", "fr": "{host} est très récent. Les fausses plateformes changent de domaine toutes les quelques semaines après les plaintes.", "ar": "{host} جديد برشا. المنصّات الفالصو يبدّلو الـ domain كل كم جمعة بعد شكاوي الضحايا."},
    ),
    "punycode": (
        {"en": "Uses look-alike letters in the address", "fr": "Utilise des lettres trompeuses dans l'adresse", "ar": "يستعمل حروف تشبه بعضها في العنوان"},
        {"en": "{host} contains special characters that can imitate normal letters (for example a Cyrillic 'а').", "fr": "{host} contient des caractères spéciaux qui imitent des lettres normales (par exemple un « а » cyrillique).", "ar": "{host} فيه رموز خاصة تقلّد الحروف العادية."},
    ),
    "ip_link": (
        {"en": "Link is a raw IP address", "fr": "Le lien est une adresse IP brute", "ar": "اللينك هو عنوان IP مباشر"},
        {"en": "Real services use a domain name. A bare IP address hides who runs the site.", "fr": "Les vrais services utilisent un nom de domaine. Une IP brute cache qui gère le site.", "ar": "الخدمات الحقيقية تستعمل اسم domain. عنوان IP عريان يخبّي شكون يدير السيت."},
    ),
    "shortener": (
        {"en": "Shortened link hides the real destination", "fr": "Lien raccourci qui cache la vraie destination", "ar": "لينك مقصّر يخبّي وين يهزّك بالحقّ"},
        {"en": "You can't see where {host} leads before you open it.", "fr": "Impossible de voir où mène {host} avant de l'ouvrir.", "ar": "ما تنجّمش تشوف وين يهزّك {host} قبل ما تحلّو."},
    ),
    "chat_invite": (
        {"en": "Invite to a private chat group", "fr": "Invitation vers un groupe de discussion privé", "ar": "عرضة لقروب chat خاص"},
        {"en": "Moving you to a private WhatsApp/Telegram group is step 2 of most investment scams: no one outside can see or warn you.", "fr": "Vous faire passer dans un groupe WhatsApp/Telegram privé est l'étape 2 de la plupart des arnaques : personne d'extérieur ne peut vous prévenir.", "ar": "كي يهزّوك لقروب WhatsApp/Telegram خاص، هذي الخطوة الثانية في أغلب التحيّل: حتى حدّ من برّا ما ينجّم ينبّهك."},
    ),
    "risky_tld": (
        {"en": "Cheap domain ending often used by throwaway sites", "fr": "Extension de domaine bon marché souvent utilisée par des sites jetables", "ar": "آخر domain رخيص تستعملو برشا المواقع اللي تتلوح"},
        {"en": "Many legit sites use it too, but fake platforms like endings such as .{tld} because they cost almost nothing.", "fr": "Beaucoup de sites légitimes l'utilisent aussi, mais les fausses plateformes aiment les extensions comme .{tld} car elles ne coûtent presque rien.", "ar": "مواقع نظيفة زادة تستعملو، أما المنصّات الفالصو يحبّو النهايات كيما ‎.{tld} خاطر تقريب بلاش."},
    ),
    "official_domain": (
        {"en": "This is the official domain of {brand}", "fr": "C'est le domaine officiel de {brand}", "ar": "هذا هو الـ domain الرسمي متاع {brand}"},
        {"en": "The spelling of {host} matches {brand}'s official site. That says nothing about who sent you the link or what they ask you to do there.", "fr": "L'orthographe de {host} correspond au site officiel de {brand}. Cela ne dit rien de la personne qui a envoyé le lien ni de ce qu'elle vous demande.", "ar": "الكتيبة متاع {host} تطابق السيت الرسمي متاع {brand}. هذا ما يقول حتى شي على شكون بعثلك اللينك ولا على شنوّة يطلب منك غادي."},
    ),
    "token_honeypot": (
        {"en": "Honeypot: holders may not be able to sell", "fr": "Honeypot : les détenteurs ne peuvent peut-être pas vendre", "ar": "Honeypot: اللي شراوها ممكن ما ينجّموش يبيعو"},
        {"en": "GoPlus flags this token's contract as a honeypot. The price can only go up because almost nobody is allowed to sell.", "fr": "GoPlus signale ce contrat comme un honeypot. Le prix ne fait que monter car presque personne ne peut vendre.", "ar": "GoPlus يصنّف الـ contract متاع الـ token هذا كـ honeypot. السوم يطلع برك خاطر تقريب حتى حدّ ما مسموحلو يبيع."},
    ),
    "token_cannot_sell": (
        {"en": "Holders cannot sell all their tokens", "fr": "Impossible de vendre tous ses tokens", "ar": "اللي عندهم ما ينجّموش يبيعو الـ tokens الكل"},
        {"en": "The contract blocks selling the full balance.", "fr": "Le contrat empêche de vendre la totalité du solde.", "ar": "الـ contract يمنع بيع الرصيد الكل."},
    ),
    "token_owner_balance": (
        {"en": "The owner can change people's balances", "fr": "Le propriétaire peut modifier les soldes", "ar": "المالك ينجّم يبدّل أرصدة الناس"},
        {"en": "Whoever controls the contract can take tokens out of any holder's wallet.", "fr": "Celui qui contrôle le contrat peut retirer des tokens de n'importe quel wallet.", "ar": "اللي يتحكّم في الـ contract ينجّم يهزّ tokens من أي wallet."},
    ),
    "token_hidden_owner": (
        {"en": "Hidden owner", "fr": "Propriétaire caché", "ar": "مالك مخبّي"},
        {"en": "The contract keeps owner powers even though it looks renounced.", "fr": "Le contrat garde des pouvoirs de propriétaire alors qu'il semble y avoir renoncé.", "ar": "الـ contract يحتفظ بصلاحيات المالك حتى كان يبان إنّو تخلّى عليها."},
    ),
    "token_take_back": (
        {"en": "Ownership can be taken back", "fr": "La propriété peut être reprise", "ar": "الملكية تنجّم ترجع"},
        {"en": "A 'renounced' owner can regain control of the contract later.", "fr": "Un propriétaire « renoncé » peut reprendre le contrôle plus tard.", "ar": "مالك «تخلّى» ينجّم يرجّع التحكّم في الـ contract من بعد."},
    ),
    "token_selfdestruct": (
        {"en": "The contract can self-destruct", "fr": "Le contrat peut s'autodétruire", "ar": "الـ contract ينجّم يفسخ روحو"},
        {"en": "The code can delete the contract, and the tokens with it.", "fr": "Le code peut supprimer le contrat, et les tokens avec.", "ar": "الـ code ينجّم يفسخ الـ contract والـ tokens معاه."},
    ),
    "token_airdrop_scam": (
        {"en": "Known airdrop scam token", "fr": "Token d'arnaque à l'airdrop connu", "ar": "token تحيّل airdrop معروف"},
        {"en": "This token was sent to wallets for free to lure people to a phishing site.", "fr": "Ce token a été envoyé gratuitement pour attirer vers un site de phishing.", "ar": "الـ token هذا تبعث بلاش للـ wallets باش يجرّ الناس لسيت phishing."},
    ),
    "token_fake": (
        {"en": "Copy of a well-known token", "fr": "Copie d'un token connu", "ar": "نسخة من token معروف"},
        {"en": "GoPlus says this contract imitates a real token. Compare the address with the project's official site.", "fr": "GoPlus indique que ce contrat imite un vrai token. Comparez l'adresse avec le site officiel du projet.", "ar": "GoPlus يقول إنّو الـ contract هذا يقلّد token حقيقي. قارن العنوان مع السيت الرسمي متاع المشروع."},
    ),
    "token_sell_tax": (
        {"en": "High sell tax: {tax}%", "fr": "Taxe de vente élevée : {tax} %", "ar": "ضريبة بيع عالية: {tax}%"},
        {"en": "Every sale loses {tax}% to the contract.", "fr": "Chaque vente perd {tax} % au profit du contrat.", "ar": "كل بيعة تخسر {tax}% للـ contract."},
    ),
    "token_buy_tax": (
        {"en": "High buy tax: {tax}%", "fr": "Taxe d'achat élevée : {tax} %", "ar": "ضريبة شراء عالية: {tax}%"},
        {"en": "Every purchase loses {tax}% to the contract.", "fr": "Chaque achat perd {tax} % au profit du contrat.", "ar": "كل شراية تخسر {tax}% للـ contract."},
    ),
    "token_closed_source": (
        {"en": "Contract code is not public", "fr": "Le code du contrat n'est pas public", "ar": "الـ code متاع الـ contract موش منشور"},
        {"en": "Nobody can read what the contract really does.", "fr": "Personne ne peut lire ce que fait vraiment le contrat.", "ar": "حتى حدّ ما ينجّم يقرا شنوّة يعمل الـ contract بالحقّ."},
    ),
    "token_mintable": (
        {"en": "New tokens can be created", "fr": "De nouveaux tokens peuvent être créés", "ar": "ينجّمو يطلّعو tokens جدد"},
        {"en": "The owner can print more tokens. Big stablecoins work like this too; for a small token it can dilute holders to zero.", "fr": "Le propriétaire peut créer plus de tokens. Les grands stablecoins aussi ; pour un petit token, cela peut diluer les détenteurs à zéro.", "ar": "المالك ينجّم يطبع tokens زايدين. الـ stablecoins الكبار يخدمو هكّا زادة؛ أما في token صغير، اللي عندهم ينجّمو يخسرو القيمة الكل."},
    ),
    "token_blacklist": (
        {"en": "The owner can block wallets", "fr": "Le propriétaire peut bloquer des wallets", "ar": "المالك ينجّم يبلوكي wallets"},
        {"en": "Specific holders can be stopped from moving their tokens.", "fr": "Des détenteurs peuvent être empêchés de déplacer leurs tokens.", "ar": "ينجّمو يمنعو ناس معيّنين باش يحرّكو الـ tokens متاعهم."},
    ),
    "token_pausable": (
        {"en": "Transfers can be paused or frozen", "fr": "Les transferts peuvent être suspendus ou gelés", "ar": "التحويلات تنجّم تتوقّف ولا تتجمّد"},
        {"en": "The owner can freeze all transfers at any time.", "fr": "Le propriétaire peut geler tous les transferts à tout moment.", "ar": "المالك ينجّم يجمّد التحويلات الكل في أي وقت."},
    ),
    "token_tax_changeable": (
        {"en": "Taxes can be changed by the owner", "fr": "Les taxes peuvent être modifiées par le propriétaire", "ar": "المالك ينجّم يبدّل الضرائب"},
        {"en": "A low tax today can become 100% tomorrow.", "fr": "Une taxe basse aujourd'hui peut passer à 100 % demain.", "ar": "ضريبة صغيرة اليوم تنجّم تولّي 100% غدوة."},
    ),
    "token_proxy": (
        {"en": "Upgradeable contract", "fr": "Contrat modifiable", "ar": "contract ينجّم يتبدّل"},
        {"en": "The code can be replaced later. Common in big projects; it means you trust the owner.", "fr": "Le code peut être remplacé plus tard. Courant dans les gros projets ; cela suppose de faire confiance au propriétaire.", "ar": "الـ code ينجّم يتبدّل من بعد. عادي في المشاريع الكبار؛ ومعناها إنك واثق في المالك."},
    ),
    "token_trusted": (
        {"en": "On GoPlus's list of well-known tokens", "fr": "Sur la liste GoPlus des tokens connus", "ar": "في ليستة GoPlus متاع الـ tokens المعروفين"},
        {"en": "This contract is a widely used token. That only confirms the address, not that any offer around it is real.", "fr": "Ce contrat est un token très utilisé. Cela confirme l'adresse, pas qu'une offre autour soit réelle.", "ar": "الـ contract هذا token مستعمل برشا. هذا يأكّد العنوان برك، موش صحّة أي عرض عليه."},
    ),
    "address_reported": (
        {"en": "This wallet is reported for: {reasons}", "fr": "Ce wallet est signalé pour : {reasons}", "ar": "الـ wallet هذا مبلّغ عليه على خاطر: {reasons}"},
        {"en": "GoPlus security data links this address to malicious activity. Do not send anything to it.", "fr": "Les données GoPlus relient cette adresse à des activités malveillantes. N'y envoyez rien.", "ar": "معطيات GoPlus تربط العنوان هذا بنشاط خبيث. ما تبعثلو حتى شي."},
    ),
    "no_known_flags": (
        {"en": "Nothing on the lists we checked", "fr": "Rien sur les listes vérifiées", "ar": "حتى شي في الليستات اللي فركسناها"},
        {"en": "That only means nobody has reported it yet. New scams appear every day.", "fr": "Cela veut seulement dire que personne ne l'a encore signalé. De nouvelles arnaques apparaissent chaque jour.", "ar": "هذا معناها برك إنّو حتى حدّ ما بلّغ عليه توّا. تحيّل جديد يطلع كل نهار."},
    ),
}

CHECK_TEXT: dict[str, L] = {
    "regulator_lookup": {"en": "Look the company up yourself on cmf.tn (Tunisia, 'Mises en garde') or ammc.ma (Morocco). No regulator licenses anyone to sell crypto or manage your money through WhatsApp or Telegram.", "fr": "Cherchez vous-même la société sur cmf.tn (Tunisie, « Mises en garde ») ou ammc.ma (Maroc). Aucun régulateur n'autorise à vendre de la crypto ou gérer votre argent via WhatsApp ou Telegram.", "ar": "لوّج بيدك على الشركة في cmf.tn (تونس، «Mises en garde») ولا ammc.ma (المغرب). حتى هيئة ما ترخّص لحدّ باش يبيع crypto ولا يتصرّف في فلوسك في WhatsApp ولا Telegram."},
    "small_withdrawal": {"en": "Before you put in more, ask to withdraw a small amount, with no fee and no new deposit. If they refuse or ask for a fee, stop.", "fr": "Avant de mettre plus, demandez à retirer une petite somme, sans frais ni nouveau dépôt. S'ils refusent ou demandent des frais, arrêtez.", "ar": "قبل ما تحطّ أكثر، اطلب تسحب مبلغ صغير بلا frais وبلا إيداع جديد. كان رفضو ولا طلبو frais، وقّف."},
    "search_name": {"en": "Search the name plus 'arnaque' or 'scam', and ask in a group you already trust.", "fr": "Cherchez le nom avec « arnaque » ou « scam », et demandez dans un groupe de confiance.", "ar": "لوّج على الاسم مع «arnaque» ولا «scam»، واسأل في قروب تثق فيه من قبل."},
    "talk_first": {"en": "Talk to someone you trust before you pay anything. Scammers push you to decide alone and fast.", "fr": "Parlez-en à quelqu'un de confiance avant de payer quoi que ce soit. Les escrocs poussent à décider seul et vite.", "ar": "احكي مع واحد تثق فيه قبل ما تخلّص أي حاجة. المتحيّلين يدزّوك باش تقرّر وحدك وفيسع."},
    "type_it_yourself": {"en": "Don't open the link from the message. Type the official address yourself or use the official app.", "fr": "N'ouvrez pas le lien du message. Tapez vous-même l'adresse officielle ou utilisez l'application officielle.", "ar": "ما تحلّش اللينك اللي في الميساج. اكتب العنوان الرسمي بيدك ولا استعمل التطبيقة الرسمية."},
    "spelling": {"en": "Compare the address letter by letter with the official one (binance.com, not binance-app.com or blnance.com).", "fr": "Comparez l'adresse lettre par lettre avec l'officielle (binance.com, pas binance-app.com ni blnance.com).", "ar": "قارن العنوان حرف بحرف مع الرسمي (binance.com موش binance-app.com ولا blnance.com)."},
    "never_secret": {"en": "Never type your 12/24 secret words or connect your wallet on a site someone sent you.", "fr": "Ne tapez jamais vos 12/24 mots secrets et ne connectez pas votre wallet sur un site envoyé par quelqu'un.", "ar": "عمرك ما تكتب الـ 12 ولا 24 كلمة السرّية متاعك ولا تربط الـ wallet متاعك في سيت بعثهولك واحد."},
    "token_official": {"en": "Get the contract address from the project's official site, not from a group. Copies with the same name are common.", "fr": "Prenez l'adresse du contrat sur le site officiel du projet, pas dans un groupe. Les copies au même nom sont fréquentes.", "ar": "خوذ عنوان الـ contract من السيت الرسمي متاع المشروع، موش من قروب. النسخ بنفس الاسم برشا."},
    "token_liquidity": {"en": "Check that other people have been able to sell it, and who holds most of the supply.", "fr": "Vérifiez que d'autres ont pu le vendre, et qui détient la majorité de l'offre.", "ar": "ثبّت إنّو ناس أخرين نجّمو يبيعوه، وشكون عندو أكبر كمية."},
    "address_never": {"en": "Never send money to a wallet someone gives you in a chat to 'unlock', 'activate' or 'invest'.", "fr": "N'envoyez jamais d'argent à une adresse donnée dans un chat pour « débloquer », « activer » ou « investir ».", "ar": "عمرك ما تبعث فلوس لـ wallet عطاهولك واحد في chat باش «يحلّ» ولا «يفعّل» ولا «يستثمر»."},
    "clean_not_safe": {"en": "A clean result only means nobody has reported it yet.", "fr": "Un résultat vierge veut seulement dire que personne ne l'a encore signalé.", "ar": "نتيجة نظيفة معناها برك إنّو حتى حدّ ما بلّغ عليه توّا."},
    "licence_number": {"en": "Ask for their licence number and check it on the regulator's own website, not on a certificate they send.", "fr": "Demandez leur numéro d'agrément et vérifiez-le sur le site du régulateur, pas sur un certificat qu'ils envoient.", "ar": "اطلب نومرو الترخيص وفركسو في السيت متاع الهيئة بيدها، موش من شهادة يبعثوهالك."},
    "fees_from_balance": {"en": "Real platforms take fees out of your balance. They never ask you to send more money to get your money out.", "fr": "Les vraies plateformes prélèvent les frais sur le solde. Elles ne demandent jamais d'envoyer plus pour récupérer votre argent.", "ar": "المنصّات الحقيقية تنحّي الـ frais من الرصيد متاعك، وعمرها ما تطلب تبعث فلوس زايدة باش تسحب فلوسك."},
    "p2p_safety": {"en": "Never meet strangers to swap cash for crypto. In P2P, only release after the money is really in your account, from the buyer's own name.", "fr": "Ne rencontrez jamais d'inconnus pour échanger espèces contre crypto. En P2P, ne libérez qu'une fois l'argent vraiment reçu, au nom de l'acheteur.", "ar": "عمرك ما تتلاقى مع ناس ما تعرفهمش باش تبدّل كاش بـ crypto. وفي الـ P2P ما تطلقش الـ crypto كان كي الفلوس توصل بالحقّ لكونطك، باسم الشاري بيدو."},
    "report": {"en": "If you already paid: stop paying, keep screenshots, and report it to the police (in Tunisia, the cybercrime brigade).", "fr": "Si vous avez déjà payé : arrêtez de payer, gardez les captures et portez plainte (en Tunisie, la brigade de lutte contre la cybercriminalité).", "ar": "كان خلّصت قبل: وقّف الخلاص، خبّي الـ screenshots، واشكي للبوليس (في تونس، فرقة مكافحة الجرائم الإلكترونية)."},
}

UI_TEXT: dict[str, L] = {
    "verdict_high": {"en": "Strong warning signs", "fr": "Signaux d'alerte forts", "ar": "علامات خطر قويّة"},
    "verdict_medium": {"en": "Some warning signs", "fr": "Quelques signaux d'alerte", "ar": "شويّة علامات خطر"},
    "verdict_low": {"en": "Minor warning signs", "fr": "Signaux d'alerte mineurs", "ar": "علامات خطر خفاف"},
    "verdict_none": {"en": "No known warning signs found", "fr": "Aucun signal d'alerte connu trouvé", "ar": "ما لقينا حتى علامة خطر معروفة"},
    "disclaimer": {"en": "No check can prove something is safe. We list warning signs and what to verify; the decision is yours.", "fr": "Aucune vérification ne peut prouver qu'une chose est sûre. Nous listons les signaux d'alerte et quoi vérifier ; la décision vous appartient.", "ar": "حتى فحص ما ينجّم يثبت إنّو حاجة مضمونة. نورّيوك علامات الخطر وشنوّة لازمك تثبّت؛ والقرار متاعك."},
}

SOURCE_INFO: dict[str, tuple[str, str]] = {
    "rules": ("Qirat red-flag rules (CMF, AMMC and press warnings)", "https://cmf.tn/sites/default/files/pdfs/documentation/guides/Guide%20fraude%20CMF.pdf"),
    "warnings": ("Qirat list of CMF/AMMC warnings", ""),
    "scamsniffer": ("ScamSniffer phishing domains", "https://github.com/scamsniffer/scam-database"),
    "metamask": ("MetaMask phishing list", "https://github.com/MetaMask/eth-phishing-detect"),
    "goplus_site": ("GoPlus phishing-site check", "https://gopluslabs.io/security-api"),
    "goplus_token": ("GoPlus token security", "https://gopluslabs.io/security-api"),
    "goplus_address": ("GoPlus malicious-address check", "https://gopluslabs.io/security-api"),
    "rdap": ("Domain registration date (RDAP)", "https://rdap.org/"),
    "lookalike": ("Qirat lookalike check (major exchanges and wallets)", ""),
}

RULE_SOURCES = {
    "fake_regulator": "cmf-fake-approvals",
    "fake_platform_pattern": "ammc-fake-platforms",
    "unlock_fee": "bclcc-activation-packs",
    "managed_money": "cmf-social-media",
    "task_scam": "tasks-recharge",
    "p2p_meetup": "manouba-meetups",
    "vip_signals": "ammc-unauthorised-advice",
    "guaranteed_returns": "cmf-fraud-guide",
    "fixed_returns": "cmf-fraud-guide",
}


def _lang(code: str | None) -> str:
    return code if code in LANGS else "en"


def _fmt(template: str, **kw: Any) -> str:
    try:
        return template.format(**kw)
    except (KeyError, IndexError):
        return template


# ── the check ────────────────────────────────────────────────────────────────


class _Result:
    def __init__(self, lang: str) -> None:
        self.lang = lang
        self.flags: list[dict[str, Any]] = []
        self.checks: list[str] = []
        self.sources: dict[str, str] = {}  # source id -> status ("checked" | "unavailable" | "match")
        self.kinds: list[str] = []

    def flag(self, fid: str, severity: str, evidence: str | None = None, source: dict[str, str] | None = None, **kw: Any) -> None:
        if any(f["id"] == fid and f.get("_key") == kw.get("_key") for f in self.flags):
            return
        title, detail = FLAG_TEXT[fid]
        self.flags.append({
            "id": fid,
            "severity": severity,
            "title": _fmt(title[self.lang], **kw),
            "detail": _fmt(detail[self.lang], **kw),
            "evidence": evidence,
            "source": source,
            "_key": kw.get("_key"),
        })

    def check(self, cid: str) -> None:
        if cid not in self.checks:
            self.checks.append(cid)

    def source(self, sid: str, status: str) -> None:
        prev = self.sources.get(sid)
        if prev == "match":
            return
        if prev == "checked" and status == "unavailable":
            return
        self.sources[sid] = status

    def kind(self, k: str) -> None:
        if k not in self.kinds:
            self.kinds.append(k)


def _message_rules(text: str, res: _Result, has_address: bool) -> None:
    t = _norm(text)
    hits: set[str] = set()
    for fid, (sev, rxs) in RULES.items():
        m = None
        if fid == "send_to_wallet":
            m = _send_to_wallet(t, has_address)
        elif fid == "secret_phrase":
            m = _secret_phrase(t)
        elif rxs:
            m = _search(rxs, t)
        if m:
            hits.add(fid)
            src = _alert(RULE_SOURCES[fid]) if fid in RULE_SOURCES else None
            res.flag(fid, sev, _first_match_snippet(m, t), src)
    reg = _fake_regulator(t, hits)
    if reg:
        sev, m = reg
        res.flag("fake_regulator", sev, _first_match_snippet(m, t), _alert("cmf-fake-approvals"))
        hits.add("fake_regulator")
    steps = _fake_platform(t)
    if steps:
        res.flag("fake_platform_pattern", "high", " → ".join(steps), _alert("ammc-fake-platforms"))
        hits.add("fake_platform_pattern")
    # what to verify, driven by what fired
    if hits & {"unlock_fee", "fake_platform_pattern", "task_scam"}:
        res.check("small_withdrawal")
        res.check("fees_from_balance")
    if hits & {"fake_regulator", "managed_money", "fake_platform_pattern"}:
        res.check("licence_number")
    if hits & {"secret_phrase", "wallet_drainer"}:
        res.check("never_secret")
    if hits & {"p2p_meetup"}:
        res.check("p2p_safety")
    if hits & {"send_to_wallet"}:
        res.check("address_never")


def _check_link(host: str, res: _Result, network: bool) -> None:
    reg = registrable(host)
    brand = official_brand(reg)
    res.source("lookalike", "checked")
    if host in CHAT_INVITES or reg in CHAT_INVITES:
        res.flag("chat_invite", "low", host, _key=host)
    elif reg in SHORTENERS or host in SHORTENERS:
        res.flag("shortener", "low", host, host=host, _key=host)
    elif _is_ip(host):
        res.flag("ip_link", "medium", host, _key=host)
    if brand:
        name = brand.capitalize() if brand not in ("cmf", "ammc") else brand.upper()
        res.flag("official_domain", "info", host, brand=name, host=host, _key=host)
    else:
        imitated = lookalike_brand(host)
        if imitated:
            official = sorted(BRANDS[imitated])[0] if imitated != "binance" else "binance.com"
            name = imitated.capitalize() if imitated not in ("cmf", "ammc", "okx", "mexc") else imitated.upper()
            res.flag("lookalike", "high", host, None, brand=name, host=host, official=official, _key=host)
        if any(label.startswith("xn--") for label in host.split(".")):
            res.flag("punycode", "medium", host, host=host, _key=host)
        tld = host.rsplit(".", 1)[-1]
        if tld in RISKY_TLDS and reg not in KNOWN_SITES:
            res.flag("risky_tld", "low", host, tld=tld, _key=host)
    if not network:
        return
    skip_lookups = bool(brand) or reg in KNOWN_SITES or host in CHAT_INVITES or reg in CHAT_INVITES
    jobs: dict[str, Callable[[], Any]] = {}
    if not skip_lookups:
        jobs["lists"] = lambda: (PHISHING_LISTS.ensure(), PHISHING_LISTS.lookup(host))[1]
        jobs["goplus"] = lambda: goplus_phishing(host)
        if not _is_ip(host):
            jobs["rdap"] = lambda: domain_age_days(reg)
    if not jobs:
        return
    with ThreadPoolExecutor(max_workers=len(jobs)) as pool:
        futures = {k: pool.submit(fn) for k, fn in jobs.items()}
        out = {}
        for k, fut in futures.items():
            try:
                out[k] = fut.result(timeout=20)
            except Exception as exc:  # noqa: BLE001
                log.info("lookup %s failed: %s", k, exc)
                out[k] = None
    listed: list[str] = []
    lists = out.get("lists") or {}
    for sid, label in (("scamsniffer", "ScamSniffer"), ("metamask", "MetaMask")):
        val = lists.get(sid) if lists else None
        if val is None:
            res.source(sid, "unavailable")
        else:
            res.source(sid, "match" if val else "checked")
            if val:
                listed.append(label)
    gp = out.get("goplus")
    if gp is None:
        res.source("goplus_site", "unavailable")
    else:
        res.source("goplus_site", "match" if gp else "checked")
        if gp:
            listed.append("GoPlus")
    if listed:
        res.flag("phishing_list", "high", host, None, lists=", ".join(listed), host=host, _key=host)
    if "rdap" in jobs:
        age = out.get("rdap")
        if age is None:
            res.source("rdap", "unavailable")
        else:
            res.source("rdap", "match" if age < 180 else "checked")
            if age < 30:
                res.flag("new_domain", "high", host, days=age, host=host, _key=host)
            elif age < 180:
                res.flag("new_domain", "medium", host, days=age, host=host, _key=host)


def _check_address(address: str, chain_hint: str | None, res: _Result, network: bool) -> None:
    res.check("token_official")
    res.check("address_never")
    res.check("clean_not_safe")
    if not network:
        return
    chains = [chain_hint] if chain_hint else DEFAULT_EVM_CHAINS
    token: dict[str, Any] | None = None
    found_chain = None
    errored = False

    def try_chain(c: str) -> tuple[str, dict[str, Any] | None]:
        return c, goplus_token(address, c)

    with ThreadPoolExecutor(max_workers=min(5, len(chains))) as pool:
        for fut in [pool.submit(try_chain, c) for c in chains]:
            try:
                c, info = fut.result(timeout=20)
            except Exception as exc:  # noqa: BLE001
                log.info("goplus token failed: %s", exc)
                errored = True
                continue
            if info and token is None:
                token, found_chain = info, c
    if token:
        res.kind("token")
        res.source("goplus_token", "checked")
        res.check("token_liquidity")
        trusted = _flag_val(token, "trust_list")
        for field, fid, sev in TOKEN_RULES:
            if _flag_val(token, field):
                # Big centralised tokens (USDT, USDC…) really do keep owner powers;
                # on GoPlus's trust list those read one level softer. Traps such
                # as a honeypot or a fake copy never get softened.
                if trusted and fid in OWNER_POWERS:
                    sev = {"high": "medium", "medium": "low"}.get(sev, sev)
                res.flag(fid, sev, f"{CHAIN_NAMES.get(found_chain or '', found_chain)}: {field}")
                res.source("goplus_token", "match")
        fake = token.get("fake_token")
        if isinstance(fake, dict) and str(fake.get("value")) == "1":
            res.flag("token_fake", "high", None)
            res.source("goplus_token", "match")
        if "is_open_source" in token and str(token.get("is_open_source")) == "0":
            res.flag("token_closed_source", "high", None)
            res.source("goplus_token", "match")
        for key, fid in (("sell_tax", "token_sell_tax"), ("buy_tax", "token_buy_tax")):
            tax = _tax(token, key)
            if tax is not None and tax > 0.05:
                pct = round(tax * 100, 1)
                res.flag(fid, "high" if tax >= 0.1 else "medium", None, tax=pct)
                res.source("goplus_token", "match")
        if trusted:
            res.flag("token_trusted", "info", None)
        return
    if errored and not token:
        res.source("goplus_token", "unavailable")
    # not a token: look the wallet up
    res.kind("address")
    try:
        info = goplus_address(address, chain_hint if chain_hint else ("1" if address.startswith("0x") else None))
    except Exception as exc:  # noqa: BLE001
        log.info("goplus address failed: %s", exc)
        res.source("goplus_address", "unavailable")
        return
    reasons = [k.replace("_", " ") for k in ADDRESS_RULES if info and _flag_val(info, k)]
    res.source("goplus_address", "match" if reasons else "checked")
    if reasons:
        res.flag("address_reported", "high", address[:10] + "…", reasons=", ".join(reasons))


def check(
    text: str | None = None,
    url: str | None = None,
    address: str | None = None,
    chain: str | None = None,
    platform: str | None = None,
    language: str = "en",
    network: bool = True,
) -> dict[str, Any]:
    """Run every applicable check. ``network=False`` skips external lookups (tests)."""
    lang = _lang(language)
    res = _Result(lang)
    text = (text or "")[:MAX_TEXT]
    blob = "\n".join(x for x in (text, url or "", platform or "") if x).strip()

    links = []
    if url:
        h = parse_host(url)
        if h:
            links.append(h)
    for h in find_links(text):
        if h not in links:
            links.append(h)
    links = links[:MAX_LINKS]

    addrs: list[tuple[str, str | None]] = []
    chain_id = CHAINS.get((chain or "").strip().lower()) if chain else None
    if address:
        addrs += find_addresses(address.strip()) or []
    for a in find_addresses(text):
        if all(a[0].lower() != b[0].lower() for b in addrs):
            addrs.append(a)
    addrs = [(a, chain_id or c) for a, c in addrs][:MAX_ADDRESSES]

    # message rules run on everything that isn't only a link/address
    stripped = text.strip()
    only_link = bool(links) and len(stripped.split()) <= 1 and not addrs
    only_addr = bool(addrs) and stripped in {a for a, _ in addrs}
    if stripped and not only_link and not only_addr:
        res.kind("message")
        res.source("rules", "checked")
        _message_rules(text, res, has_address=bool(addrs))

    # platform / company names against the curated warnings
    res.source("warnings", "checked")
    name_query = platform or (stripped if stripped and len(stripped) <= 60 and not only_link and not only_addr else "")
    if name_query and len(name_query.split()) <= 6:
        res.kind("platform")
    for e in match_warnings(blob):
        res.source("warnings", "match")
        res.flag(
            "warned_entity", "high", e["name"],
            {"name": f"{e['regulator']} · {e['date']}", "url": e["source_url"]},
            name=e["name"], summary=e["summary"].get(lang) or e["summary"]["en"], _key=e["id"],
        )

    for host in links:
        res.kind("link")
        _check_link(host, res, network)
    for addr, c in addrs:
        _check_address(addr, c, res, network)

    if links:
        res.check("type_it_yourself")
        res.check("spelling")
        res.check("never_secret")
    if "message" in res.kinds or "platform" in res.kinds:
        res.check("regulator_lookup")
        res.check("search_name")
        res.check("talk_first")
    serious = [f for f in res.flags if f["severity"] in ("high", "medium")]
    if serious:
        res.check("report")

    if not res.kinds and not stripped:
        return {"ok": False, "error": "empty"}

    res.flags.sort(key=lambda f: SEVERITY_ORDER[f["severity"]])
    worst = res.flags[0]["severity"] if res.flags else None
    level = worst if worst in ("high", "medium", "low") else "none"
    if level == "none":
        res.flag("no_known_flags", "info", None)
    for f in res.flags:
        f.pop("_key", None)

    sources = []
    for sid, status in res.sources.items():
        name, link = SOURCE_INFO[sid]
        sources.append({"id": sid, "name": name, "url": link, "status": status})
    seen_urls = {s["url"] for s in sources}
    for f in res.flags:
        src = f.get("source")
        if src and src.get("url") and src["url"] not in seen_urls:
            sources.append({"id": "ref", "name": src["name"], "url": src["url"], "status": "reference"})
            seen_urls.add(src["url"])

    return {
        "ok": True,
        "language": lang,
        "kinds": res.kinds,
        "level": level,
        "verdict": UI_TEXT[f"verdict_{level}"][lang],
        "flags": res.flags,
        "checks": [CHECK_TEXT[c][lang] for c in res.checks],
        "sources": sources,
        "disclaimer": UI_TEXT["disclaimer"][lang],
        "links": links,
        "addresses": [a for a, _ in addrs],
    }


# ── LLM explanation ──────────────────────────────────────────────────────────

EXPLAIN_SYSTEM = (
    "You are Qirat's scam-check helper for crypto beginners in Tunisia and North Africa. "
    "You get something a user wants to check (a message, link, token or platform name) and the red "
    "flags a rule-based checker found. In at most 90 words, explain in plain, calm words how this kind "
    "of scam usually works and why these specific flags matter, then the one thing to verify first.\n"
    "Rules:\n"
    "- Never say or imply that anything is safe, legit, trustworthy, fine or verified.\n"
    "- Don't claim it is certainly a scam either; say what the signs usually mean.\n"
    "- Never tell the user to buy, sell, hold or invest in anything.\n"
    "- Don't invent facts about the company, the people or the website.\n"
    "- Never repeat wallet addresses, phone numbers or links.\n"
    "- No headings. Two short paragraphs at most."
)
EXPLAIN_LANG = {
    "en": "Write in simple English.",
    "fr": "Écris en français simple.",
    "ar": "Write in simple, warm Tunisian Darija (the everyday Tunisian dialect in Arabic script, not Modern Standard Arabic). Keep words like USDT, crypto, VIP, wallet in Latin letters and use Western digits (0-9).",
}
_SAFE_CLAIM = re.compile(
    r"\b(?:is|looks|seems|appears|are)\s+(?:completely\s+|totally\s+|probably\s+)?(?:safe|legit\w*|trustworthy|genuine)\b"
    r"|\b(?:est|semble|parait)\s+(?:\w+\s+)?(?:fiable|legitime|sans danger|sur\b(?! (?:la|le|les|un|une|des|ce|cette|son|sa|ses|votre|ton)\b))"
    r"|(?:^|\s)(?:امن|امنه|موثوق|موثوقه|شرعي|سليم)(?=\s|$|[.,،])",
    re.I,
)
_explain_cache = TTLCache(default_ttl=3600.0)


def _explain_prompt(text: str, result: dict[str, Any]) -> str:
    flags = [f for f in result.get("flags", []) if f["severity"] in ("high", "medium")]
    lines = [f"- [{f['severity']}] {f['title']}" for f in flags[:8]]
    snippet = re.sub(r"\s+", " ", text)[:1200]
    return (
        f"What the user pasted:\n\"\"\"\n{snippet}\n\"\"\"\n\n"
        f"Red flags found by the rules:\n" + "\n".join(lines) + "\n\n"
        + EXPLAIN_LANG[result.get("language", "en")]
    )


def _trim_to_sentence(answer: str) -> str:
    """Drop a tail cut off by the token limit, keeping whole sentences."""
    answer = answer.strip()
    if not answer or answer[-1] in ".!?…。؟)»\"'":
        return answer
    cut = max(answer.rfind(p) for p in (". ", "! ", "? ", "؟ ", ".\n", "!\n", "?\n", "؟\n"))
    return answer[: cut + 1].strip() if cut > 0 else ""


def _looks_like_safe_claim(answer: str) -> bool:
    folded = _norm(answer)
    for m in _SAFE_CLAIM.finditer(folded):
        if not _negated_before(folded, m.start() + 1):
            return True
    return False


async def explain(text: str, result: dict[str, Any], timeout: float = 25.0) -> str | None:
    """One short plain-language explanation of the flags, or None."""
    from . import ai

    if not result.get("ok") or not ai.ai_enabled():
        return None
    if not any(f["severity"] in ("high", "medium") for f in result.get("flags", [])):
        return None
    prompt = _explain_prompt(text, result)
    key = hashlib.sha256(prompt.encode("utf-8")).hexdigest()
    cached = _explain_cache.get(key)
    if cached is not None:
        return cached or None

    async def call() -> str:
        if ai.provider() == "openai":
            client = ai._openai_client()
            resp = await client.chat.completions.create(
                model=ai._openai_model(),
                max_completion_tokens=1600,
                **ai._openai_extra(),
                messages=[{"role": "system", "content": EXPLAIN_SYSTEM}, {"role": "user", "content": prompt}],
            )
            return (resp.choices[0].message.content or "").strip()
        client = ai._client()
        resp = await client.messages.create(
            model=ai.MODEL,
            max_tokens=600,
            system=EXPLAIN_SYSTEM,
            messages=[{"role": "user", "content": prompt}],
        )
        return "".join(b.text for b in resp.content if b.type == "text").strip()

    try:
        answer = await asyncio.wait_for(call(), timeout=timeout)
    except Exception as exc:  # noqa: BLE001 - the deterministic result still stands
        log.warning("scamcheck explanation failed: %s", exc)
        return None
    answer = _trim_to_sentence(answer)
    if not answer or _looks_like_safe_claim(answer):
        _explain_cache.set(key, "")
        return None
    _explain_cache.set(key, answer)
    return answer


def run_sync(text: str, language: str = "en", with_explanation: bool = True) -> dict[str, Any]:
    """Check + explanation from synchronous code (the Telegram bot)."""
    result = check(text=text, language=language)
    if with_explanation and result.get("ok"):
        try:
            result["explanation"] = asyncio.run(explain(text, result))
        except RuntimeError:
            result["explanation"] = None
    return result


# ── Telegram formatting ──────────────────────────────────────────────────────

TG_TEXT: dict[str, L] = {
    "usage": {
        "en": "<b>Scam check</b> 🛡\nSend <code>/scamcheck</code> followed by the message, link, platform name or token address you want checked. You can also reply <code>/scamcheck</code> to a forwarded message.\n\nExample: <code>/scamcheck binance-support.com</code>",
        "fr": "<b>Vérif arnaque</b> 🛡\nEnvoyez <code>/scamcheck</code> suivi du message, du lien, du nom de la plateforme ou de l'adresse du token à vérifier. Vous pouvez aussi répondre <code>/scamcheck</code> à un message transféré.\n\nExemple : <code>/scamcheck binance-support.com</code>",
        "ar": "<b>فحص الاحتيال</b> 🛡\nابعث <code>/scamcheck</code> ومن بعدها الرسالة أو الرابط أو اسم المنصة أو عنوان العملة اللي تحب تفحصها. تنجم زادة تردّ بـ<code>/scamcheck</code> على رسالة محوّلة.\n\nمثال: <code>/scamcheck binance-support.com</code>",
    },
    "flags": {"en": "Red flags", "fr": "Signaux d'alerte", "ar": "علامات الخطر"},
    "checks": {"en": "Before you trust it", "fr": "Avant de faire confiance", "ar": "قبل ما تثق"},
    "sources": {"en": "Checked with", "fr": "Vérifié avec", "ar": "فركسنا في"},
    "more": {"en": "+{n} more in the app", "fr": "+{n} de plus dans l'app", "ar": "+{n} أخرين في التطبيق"},
}
TG_ICON = {"high": "🔴", "medium": "🟠", "low": "🟡", "info": "ℹ️", "none": "⚪️"}
MAX_TG_FLAGS = 6


def telegram_text(result: dict[str, Any]) -> str:
    import html

    lang = result.get("language", "en")
    esc = html.escape
    out = [f"{TG_ICON.get(result['level'], '⚪️')} <b>{esc(result['verdict'])}</b>"]
    if result.get("explanation"):
        out.append(esc(result["explanation"][:900]))
    flags = result.get("flags", [])
    if flags:
        out.append(f"\n<b>{TG_TEXT['flags'][lang]}</b>")
        for f in flags[:MAX_TG_FLAGS]:
            line = f"{TG_ICON[f['severity']]} {esc(f['title'])}"
            if f["severity"] in ("high", "medium") or len(flags) <= 2:
                line += f"\n   <i>{esc(f['detail'])}</i>"
            out.append(line)
        if len(flags) > MAX_TG_FLAGS:
            out.append(TG_TEXT["more"][lang].format(n=len(flags) - MAX_TG_FLAGS))
    checks = result.get("checks", [])[:4]
    if checks:
        out.append(f"\n<b>{TG_TEXT['checks'][lang]}</b>")
        out += [f"• {esc(c)}" for c in checks]
    names = [s["name"] for s in result.get("sources", []) if s.get("status") in ("checked", "match")]
    if names:
        out.append(f"\n<i>{TG_TEXT['sources'][lang]}: {esc(', '.join(names[:6]))}</i>")
    out.append(f"<i>{esc(result['disclaimer'])}</i>")
    return "\n".join(out)[:4000]
