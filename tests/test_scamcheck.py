"""Scam check: scam examples must raise flags; legitimate ones must not raise
high-severity flags. External lookups are disabled (``network=False``) or
mocked, so the suite runs offline.

Scam examples are paraphrased from regulator and press descriptions: the CMF
(Tunisia) warnings of Sep–Oct 2026, the AMMC (Morocco) fake-platform alert of
Sep 2026, the SEC/FBI descriptions of Ponzi, "pig butchering", recovery and
giveaway scams, and the Tunisian press (activation packs, task scams, Manouba
"cheap crypto" meetups).
"""

from __future__ import annotations

import pytest

from server import scamcheck

SCAMS = [
    # AMMC 6-step fake platform (ad → WhatsApp group → mentor → platform → deposit → blocked withdrawal)
    "Saw your comment on our Facebook ad. Join our WhatsApp group, our mentor will guide you. Register on the platform, minimum deposit is $100 and you can watch your profits grow.",
    "Your withdrawal is blocked until you pay the 15% withdrawal tax. Send the fee and your funds will be released within 24 hours.",
    # CMF: unlicensed portfolio management on social networks
    "Notre équipe d'experts gère votre portefeuille pour vous, rendement garanti de 8% par mois. Écrivez-nous en privé sur Instagram.",
    # CMF: fake approval documents
    "Our company is licensed and approved by the CMF, see the certificate attached. Invest 500 TND today and earn 20% monthly.",
    "Plateforme agréée par l'AMMC, investissez dès 1000 dirhams et recevez vos gains chaque semaine.",
    # Fixed returns / Ponzi (SEC descriptions)
    "Earn 3% daily on your USDT with our AI trading bot. Zero risk, withdraw anytime.",
    "Double your Bitcoin in 7 days! Send 0.1 BTC and get 0.2 BTC back.",
    "ابعث 100 USDT على المحفظة هاذي وتربح 10% في اليوم، ربح مضمون 100%",
    "استثمر معانا وفلوسك تتضاعف fois dix في شهر، بلاش ريسك",
    # Send crypto to a wallet given in chat
    "Send 200 USDT (TRC20) to this address TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE to activate your account.",
    # Activation packs (BCLCC, Tunisia)
    "Achetez le pack d'activation VIP à 390 DT pour débloquer vos retraits et vos commissions.",
    # Pyramid / recruitment (6,900-victim network; Al Khaïr tontine)
    "Pay 1800 MAD and invite 2 friends, you receive 10000 MAD when they join.",
    "جيب 3 من صحابك وتاخذ عمولة على كل شخص يسجل، دخل يومي مضمون",
    # Task scams (La Presse, May 2026)
    "Part-time job: like videos on TikTok and earn 50 USDT per day. Complete daily tasks, recharge your account to unlock bigger commissions.",
    # VIP signals + urgency (Tunisian Telegram ads)
    "Rejoignez notre groupe VIP de signaux crypto, 95% de réussite sur nos trades. Places limitées, dernière chance!",
    # Recovery scam (CBEX aftermath, FBI warnings)
    "Lost money to CBEX? Our fund recovery experts can recover your stolen crypto. Pay the processing fee first.",
    # Seed phrase / impersonation
    "Binance Support: your account will be suspended. To verify, send your 12-word recovery phrase to this agent.",
    # Wallet drainer / fake airdrop
    "You are eligible for the $QIR airdrop! Connect your wallet on the claim page to receive 5000 free tokens.",
    # P2P / meetups (Manouba robberies, Binance P2P warnings)
    "USDT moins cher que le marché, paiement cash, on se rencontre à la Manouba ce soir.",
    "Release the USDT first, the payment from my brother's account is coming, I already marked it as paid.",
    # CMF named entity
    "ELINOJA PATRIMOINE vous propose une gestion de portefeuille personnalisée.",
    # High leverage forex/crypto ads
    "Tradez avec un effet de levier 1:500 et gagnez 200 dinars par jour depuis votre téléphone.",
    # Account management offers
    "Give me access and we will trade for you on your Binance account, you keep 70% of the profits.",
    # Lookalike link inside a message
    "Your Binance account needs verification: https://binance-verify-login.com/secure",
    # Darija pitch with a regulator claim
    "منصة مرخصة من هيئة السوق المالية، استثمر 500 دينار وتربح 50 دينار في الأسبوع",
]

LEGIT = [
    "binance.com",
    "https://www.binance.com/en/markets",
    "cmf.tn",
    "https://www.cmf.tn/mises-en-garde",
    "ammc.ma",
    "coinmarketcap.com",
    "https://www.coingecko.com/en/coins/bitcoin",
    "metamask.io",
    "qirat.tn",
    "Bitcoin rose 5% this week as ETF inflows grew, Reuters reports.",
    "Le bitcoin a reculé de 3 % ce mardi, selon CoinGecko.",
    "البيتكوين ينخفض بنسبة 4% خلال الأسبوع الماضي",
    "CMF warns investors about fake approval certificates used by scammers.",
    "Le CMF met en garde contre les fausses plateformes d'investissement sur les réseaux sociaux.",
    "Never share your seed phrase with anyone, not even support.",
    "How to send USDT to your own wallet on Binance safely",
    "Tunisia's parliament is debating a new foreign-exchange code that mentions digital currencies.",
    "Ethereum developers schedule the next network upgrade for March.",
    "What is a stablecoin and how does USDT keep its price at one dollar?",
    "Binance",
    "Coinbase",
    "Bitcoin",
    "Weekly market recap: BTC dominance at 58%, Fear & Greed at 41.",
    "Kraken lists a new token after a community vote.",
]


# The 2026-11-09 audit pasted these and got "no warning signs". They are the
# shapes Tunisians actually receive: fake jobs with an activation fee, Darija
# typed in Latin letters, soft pitches with no "guaranteed", and the messages
# behind the «Scam ولا لا؟» video series. Each maps to the flag it must raise.
LOCAL_SCAMS = [
    ("Gagnez 80 a 300 TND par jour en likant des videos. Payez les frais d'activation de 45 TND par D17 puis contactez notre manager sur WhatsApp.", "advance_fee"),
    ("Gagnez 80 à 300 TND par jour en likant des vidéos. Payez les frais d’activation de 45 TND par D17.", "task_scam"),
    ("Offre d'emploi à domicile : payez 30 DT de frais d'inscription pour commencer à travailler dès demain.", "advance_fee"),
    ("sahbi a3tini 500 dinar nrajja3houlek 1000 fi jom3a, rib7 madhmoun 100%", "fixed_returns"),
    ("sahbi a3tini 500 dinar nrajja3houlek 1000 fi jom3a, rib7 madhmoun 100%", "guaranteed_returns"),
    ("5alles 50 dinar bech tebda te5dem m3ana, terba7 40 dinar fil nhar", "advance_fee"),
    ("ad5el lel groupe vip, blayes ma7douda, ezreb", "vip_signals"),
    ("Investis 200 DT aujourd'hui et retire 600 DT dans 3 jours. Ecris moi sur WhatsApp", "fixed_returns"),
    ("Invest $200 today and withdraw $600 in 3 days, message me on WhatsApp", "fixed_returns"),
    ("حط 200 دينار اليوم وخوذ 600 دينار بعد 3 أيام", "fixed_returns"),
    ("I made $4,000 last week with this trader. DM her, she helped me.", "testimonial_bait"),
    ("خدمة من الدار، 30 دينار في النهار، خلّص 20 دينار باش تبدا", "advance_fee"),
    ("خدمة من الدار، 30 دينار في النهار", "income_promise"),
    ("تسرقولك فلوسك؟ نرجّعوهملك، خلّص 10% مسبّق", "advance_fee"),
    ("تسرقولك فلوسك؟ نرجّعوهملك، خلّص 10% مسبّق", "recovery_scam"),
    ("مبروك، ربحت iPhone! خلّص 9 دينارات livraison", "advance_fee"),
    ("الكولي متاعك واقف، خلّص 3.5 دينار", "advance_fee"),
    ("Votre colis est en attente, payez 3,5 DT de frais pour le recevoir", "advance_fee"),
    ("عندك تعويض من Binance، ادخل للينك هذا", "impersonation"),
    ("نخدمولك فلوسك، ربح 20% في الشهر مضمون", "guaranteed_returns"),
    ("ادخل بالـ lien متاعي وجيب 3 صحابك، تربح 200 دينار", "recruit"),
    ("حوّل 50 دولار لـ 5000 في جمعة بـ leverage 1:200", "high_leverage"),
]

# Ordinary messages the audit saw flagged as "strong warning signs".
ORDINARY = [
    "Can you send the package to my address tomorrow?",
    "How do I transfer USDT from Binance to my own wallet?",
    "Comment envoyer des USDT vers mon propre wallet ?",
    "سلام خويا، غدوة نتقابلو في القهوة مع 5 متاع العشية؟",
    "Merci.je reviens dans 5 minutes",
    "Les frais d'inscription à la fac sont de 50 DT cette année.",
    "J'ai payé les frais de livraison du colis hier.",
    "Il faut payer la facture STEG avant vendredi, 85 dinars.",
    "sa7bi chnowa 7welek, net9ablou ghodwa fil 9ahwa?",
]


@pytest.mark.parametrize("text,flag", LOCAL_SCAMS)
def test_local_scams_raise_the_right_flag(text: str, flag: str) -> None:
    res = scamcheck.check(text=text, network=False)
    ids = [f["id"] for f in res["flags"]]
    assert flag in ids, f"{flag} missing for {text!r} → {ids}"
    assert res["level"] in ("high", "medium")


@pytest.mark.parametrize("text", ORDINARY)
def test_ordinary_messages_are_not_alarms(text: str) -> None:
    res = scamcheck.check(text=text, network=False)
    assert res["level"] in ("none", "unsure"), f"{text!r} → {res['level']} {[f['id'] for f in res['flags']]}"


def test_a_plain_money_request_is_unsure_not_clean() -> None:
    res = scamcheck.check(text="Il faut payer la facture STEG avant vendredi, 85 dinars.", language="fr", network=False)
    assert res["level"] == "unsure"
    assert res["verdict"] == "Nous n'avons pas pu juger celui-ci"
    assert [f["id"] for f in res["flags"]] == ["money_request"]
    # and a message that asks for nothing still reads as "nothing found"
    calm = scamcheck.check(text="سلام خويا، غدوة نتقابلو في القهوة مع 5 متاع العشية؟", network=False)
    assert calm["level"] == "none" and calm["flags"][0]["id"] == "no_known_flags"


def test_advice_not_to_pay_is_not_a_money_request() -> None:
    res = scamcheck.check(text="Never send money to someone you only know from Telegram.", network=False)
    assert res["level"] == "none"


def test_latin_letter_darija_is_called_out() -> None:
    res = scamcheck.check(text="sa7bi chnowa 7welek, net9ablou ghodwa fil 9ahwa?", network=False)
    assert "arabizi_partial" in [f["id"] for f in res["flags"]]


@pytest.mark.parametrize("address", ["bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"])
def test_bitcoin_address_is_unsure_not_a_platform_name(address: str) -> None:
    res = scamcheck.check(text=address, network=False)
    assert res["kinds"] == ["address"]
    assert res["level"] == "unsure"
    assert "address_unsupported" in [f["id"] for f in res["flags"]]


@pytest.mark.parametrize("text", ["Merci.je reviens", "facebook.Il faut payer", "Ok.on se voit demain"])
def test_missing_space_is_not_a_link(text: str) -> None:
    assert scamcheck.find_links(text) == []


def test_short_word_endings_still_work_as_links() -> None:
    assert scamcheck.find_links("t.me/qiratvip") == ["t.me"]
    assert scamcheck.find_links("wa.me") == ["wa.me"]
    assert scamcheck.find_links("ouvre https://promo.me maintenant") == ["promo.me"]


@pytest.mark.parametrize("text", SCAMS)
def test_scams_raise_flags(text: str) -> None:
    res = scamcheck.check(text=text, network=False)
    assert res["ok"]
    serious = [f for f in res["flags"] if f["severity"] in ("high", "medium")]
    assert serious, f"no warning flag for: {text!r} → {res['flags']}"
    assert res["level"] in ("high", "medium")


@pytest.mark.parametrize("text", LEGIT)
def test_legit_no_high_flags(text: str) -> None:
    res = scamcheck.check(text=text, network=False)
    assert res["ok"]
    high = [f["id"] for f in res["flags"] if f["severity"] == "high"]
    assert not high, f"high flag on legit input {text!r}: {high}"


def test_counts() -> None:
    assert len(SCAMS) >= 20 and len(LEGIT) >= 20


def test_most_scams_are_high() -> None:
    high = sum(scamcheck.check(text=t, network=False)["level"] == "high" for t in SCAMS)
    assert high >= len(SCAMS) - 2


def test_never_says_safe() -> None:
    for text in LEGIT + SCAMS:
        for lang in ("en", "fr", "ar"):
            res = scamcheck.check(text=text, language=lang, network=False)
            blob = " ".join([res["verdict"], *(f["title"] + " " + f["detail"] for f in res["flags"])]).lower()
            assert "this is safe" not in blob and "is safe" not in blob
            assert res["disclaimer"]


@pytest.mark.parametrize(
    "host,brand",
    [
        ("blnance.com", "binance"),
        ("binance-support.com", "binance"),
        ("secure-binance.app", "binance"),
        ("binance.com.verify-login.xyz", "binance"),
        ("metamask-wallet.io", "metamask"),
        ("coinbasse.com", "coinbase"),
        ("bybit-p2p.net", "bybit"),
        ("okx-tn.com", "okx"),
        ("ledger-wallet.com", "ledger"),
        ("cmf-tunisie.com", "cmf"),
    ],
)
def test_lookalikes(host: str, brand: str) -> None:
    assert scamcheck.lookalike_brand(host) == brand


@pytest.mark.parametrize("host", ["binance.com", "accounts.binance.com", "cmf.tn", "investigate.com", "coingecko.com", "bct.gov.tn", "ledgerinsights.com"])
def test_not_lookalikes(host: str) -> None:
    assert scamcheck.lookalike_brand(host) is None


# Real sites the audit saw flagged as imitations of an exchange or wallet.
@pytest.mark.parametrize("host", ["finance.com", "hedger.io", "coinmarketcal.com", "blockchain.info", "ledger.fr", "kraken.pro", "coinbene.com"])
def test_real_sites_are_not_lookalikes(host: str) -> None:
    assert scamcheck.lookalike_brand(host) is None


@pytest.mark.parametrize("host,brand", [("ledger.xyz", "ledger"), ("b1nance.com", "binance"), ("binnance.com", "binance"), ("kraken-login.pro", "kraken")])
def test_imitations_still_caught_after_tightening(host: str, brand: str) -> None:
    assert scamcheck.lookalike_brand(host) == brand


def test_link_detection_in_text() -> None:
    assert scamcheck.find_links("go to www.Binance-Bonus.top/claim now, or e.g. 3.5% returns") == ["www.binance-bonus.top"]
    assert scamcheck.find_links("rate 3.5 and U.S. markets") == []


def test_warning_entity_has_source() -> None:
    res = scamcheck.check(platform="Elinoja Patrimoine", network=False)
    flag = next(f for f in res["flags"] if f["id"] == "warned_entity")
    assert flag["severity"] == "high"
    assert flag["source"]["url"].startswith("https://")
    assert any(s["status"] == "match" for s in res["sources"] if s["id"] == "warnings")


def test_exact_match_entities_need_exact_name() -> None:
    assert scamcheck.match_warnings("Al Khair")
    assert not scamcheck.match_warnings("Dar al khair charity collects food for Ramadan")


def test_every_warning_has_a_source_url() -> None:
    data = scamcheck.load_warnings()
    for item in data["entities"] + data["alerts"]:
        assert item["source_url"].startswith("https://"), item
    for e in data["entities"]:
        assert set(e["summary"]) == {"en", "fr", "ar"}


def test_all_languages_have_text() -> None:
    for fid, (title, detail) in scamcheck.FLAG_TEXT.items():
        assert set(title) == set(detail) == {"en", "fr", "ar"}, fid
    for cid, text in scamcheck.CHECK_TEXT.items():
        assert set(text) == {"en", "fr", "ar"}, cid


# ── mocked network lookups ───────────────────────────────────────────────────


def test_token_honeypot(monkeypatch: pytest.MonkeyPatch) -> None:
    addr = "0x" + "ab" * 20

    def fake_token(address: str, chain: str):
        if chain == "56":
            return {"is_honeypot": "1", "sell_tax": "0.35", "buy_tax": "0", "is_open_source": "1", "is_mintable": "1"}
        return None

    monkeypatch.setattr(scamcheck, "goplus_token", fake_token)
    res = scamcheck.check(text=addr)
    ids = {f["id"]: f["severity"] for f in res["flags"]}
    assert ids["token_honeypot"] == "high"
    assert ids["token_sell_tax"] == "high"
    assert ids["token_mintable"] == "medium"
    assert "token" in res["kinds"]
    assert res["level"] == "high"


def test_trusted_token_downgrades(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        scamcheck, "goplus_token",
        lambda a, c: {"is_mintable": "1", "is_blacklisted": "1", "owner_change_balance": "1", "trust_list": "1", "is_open_source": "1"} if c == "1" else None,
    )
    res = scamcheck.check(address="0xdac17f958d2ee523a2206206994597c13d831ec7")
    assert all(f["severity"] != "high" for f in res["flags"])
    assert any(f["id"] == "token_trusted" for f in res["flags"])


def test_reported_wallet(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(scamcheck, "goplus_token", lambda a, c: None)
    monkeypatch.setattr(scamcheck, "goplus_address", lambda a, c: {"phishing_activities": "1", "sanctioned": "0"})
    res = scamcheck.check(text="send 50 usdt to TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE")
    ids = [f["id"] for f in res["flags"]]
    assert "address_reported" in ids and "send_to_wallet" in ids


def test_phishing_list_and_new_domain(monkeypatch: pytest.MonkeyPatch) -> None:
    lists = scamcheck.PHISHING_LISTS
    monkeypatch.setattr(lists, "ensure", lambda: None)
    monkeypatch.setattr(lists, "scamsniffer", {"evil-swap.xyz"})
    monkeypatch.setattr(lists, "metamask", set())
    monkeypatch.setattr(lists, "metamask_allow", set())
    monkeypatch.setattr(scamcheck, "goplus_phishing", lambda h: False)
    monkeypatch.setattr(scamcheck, "domain_age_days", lambda r: 12)
    res = scamcheck.check(url="https://app.evil-swap.xyz/connect")
    ids = {f["id"]: f["severity"] for f in res["flags"]}
    assert ids["phishing_list"] == "high"
    assert ids["new_domain"] == "high"
    status = {s["id"]: s["status"] for s in res["sources"]}
    assert status["scamsniffer"] == "match" and status["metamask"] == "checked"


def test_official_domain_skips_lookups(monkeypatch: pytest.MonkeyPatch) -> None:
    def boom(*a, **k):
        raise AssertionError("should not look up an official domain")

    monkeypatch.setattr(scamcheck, "goplus_phishing", boom)
    monkeypatch.setattr(scamcheck, "domain_age_days", boom)
    res = scamcheck.check(url="binance.com")
    assert res["level"] == "none"
    assert res["flags"][0]["id"] == "official_domain"


def test_lookups_down_still_answer(monkeypatch: pytest.MonkeyPatch) -> None:
    def down(*a, **k):
        raise ConnectionError("offline")

    monkeypatch.setattr(scamcheck.PHISHING_LISTS, "ensure", lambda: None)
    monkeypatch.setattr(scamcheck.PHISHING_LISTS, "scamsniffer", None)
    monkeypatch.setattr(scamcheck.PHISHING_LISTS, "metamask", None)
    monkeypatch.setattr(scamcheck, "_http_json", down)
    monkeypatch.setattr(scamcheck, "_lookup_cache", scamcheck.TTLCache())
    res = scamcheck.check(url="some-new-site.com")
    assert res["ok"]
    status = {s["id"]: s["status"] for s in res["sources"]}
    assert status["scamsniffer"] == "unavailable" and status["goplus_site"] == "unavailable"


def test_safe_claim_filter() -> None:
    assert scamcheck._looks_like_safe_claim("This platform is safe to use.")
    assert scamcheck._looks_like_safe_claim("Cette plateforme est fiable.")
    assert not scamcheck._looks_like_safe_claim("Le nom est sur la liste du CMF.")
    assert not scamcheck._looks_like_safe_claim("It is not safe to send money to strangers.")


# ── API ─────────────────────────────────────────────────────────────────────


def test_endpoint(monkeypatch: pytest.MonkeyPatch) -> None:
    from fastapi.testclient import TestClient

    from server import main

    real_check = scamcheck.check
    monkeypatch.setattr(scamcheck, "check", lambda **kw: real_check(**{**kw, "network": False}))
    monkeypatch.setattr(main.ai, "ai_enabled", lambda: False)
    client = TestClient(main.app)
    r = client.post("/api/scamcheck", json={"text": "guaranteed 5% daily, send USDT to this wallet", "language": "fr"})
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] and body["level"] == "high" and body["language"] == "fr"
    assert body["explanation"] is None

    r = client.post("/api/scamcheck", json={"text": "   "})
    assert r.status_code == 400


def test_endpoint_rate_limited(monkeypatch: pytest.MonkeyPatch) -> None:
    from fastapi.testclient import TestClient

    from server import main

    real_check = scamcheck.check
    monkeypatch.setattr(scamcheck, "check", lambda **kw: real_check(**{**kw, "network": False}))
    monkeypatch.setattr(main.ai, "ai_enabled", lambda: True)
    monkeypatch.setattr(main, "check_ai_allowance", lambda ip: (False, "Rate limit reached", 30))
    client = TestClient(main.app)
    # the plain-words explanation is an AI call, so it is held back…
    r = client.post("/api/scamcheck", json={"text": "hello", "explain": True})
    assert r.status_code == 429
    assert r.headers["Retry-After"] == "30"
    # …but the check itself is rules and lookups, and still answers
    r = client.post("/api/scamcheck", json={"text": "hello", "explain": False})
    assert r.status_code == 200 and r.json()["level"] == "none"


def test_endpoint_has_its_own_limit(monkeypatch: pytest.MonkeyPatch) -> None:
    from fastapi.testclient import TestClient

    from server import main

    monkeypatch.setattr(main, "check_scam_allowance", lambda ip: (False, 12))
    r = TestClient(main.app).post("/api/scamcheck", json={"text": "hello", "explain": False})
    assert r.status_code == 429 and r.headers["Retry-After"] == "12"


def test_scam_allowance_counts_per_address_and_for_everyone(monkeypatch: pytest.MonkeyPatch) -> None:
    from server import ratelimit

    monkeypatch.setattr(ratelimit.upstash, "enabled", lambda: False)
    monkeypatch.setattr(ratelimit, "SCAMCHECK_RATE_LIMIT", 2)
    monkeypatch.setattr(ratelimit, "SCAMCHECK_GLOBAL_LIMIT", 3)
    monkeypatch.setattr(ratelimit, "_scam_ip_limiter", ratelimit.RateLimiter(2, 60))
    monkeypatch.setattr(ratelimit, "_scam_all_limiter", ratelimit.RateLimiter(3, 60))
    assert ratelimit.check_scam_allowance("1.1.1.1")[0]
    assert ratelimit.check_scam_allowance("1.1.1.1")[0]
    assert not ratelimit.check_scam_allowance("1.1.1.1")[0]  # third from one address
    assert ratelimit.check_scam_allowance("2.2.2.2")[0]  # another address still passes
    assert not ratelimit.check_scam_allowance("3.3.3.3")[0]  # the whole-app ceiling


# ── Telegram ────────────────────────────────────────────────────────────────


def test_telegram_command(monkeypatch: pytest.MonkeyPatch) -> None:
    from server import telegram_bot

    sent: list[tuple] = []
    monkeypatch.setattr(telegram_bot, "send", lambda chat_id, text, buttons=None: sent.append((chat_id, text, buttons)))
    monkeypatch.setattr(telegram_bot, "api", lambda method, **p: {"ok": True})
    monkeypatch.setattr(scamcheck, "run_sync", lambda text, language="en": scamcheck.check(text=text, language=language, network=False))
    msg = {"chat": {"id": 7, "type": "private"}, "from": {"id": 1, "language_code": "fr"}, "text": "/scamcheck Gains garantis de 5% par jour, envoyez vos USDT à cette adresse"}
    telegram_bot.handle_message(msg)
    chat_id, text, buttons = sent[-1]
    assert chat_id == 7
    assert "🔴" in text and "Signaux" in text
    assert buttons[0][0]["url"].endswith("#scamcheck")

    # no argument: usage; reply to a forwarded message: checks that message
    telegram_bot.handle_message({**msg, "text": "/scamcheck"})
    assert "/scamcheck" in sent[-1][1]
    telegram_bot.handle_message({**msg, "text": "/scamcheck", "reply_to_message": {"text": "join our VIP signals group, 10% daily guaranteed"}})
    assert "🔴" in sent[-1][1]


def test_trim_to_sentence() -> None:
    assert scamcheck._trim_to_sentence("One. Two is cut mid-") == "One."
    assert scamcheck._trim_to_sentence("Complete answer.") == "Complete answer."
    assert scamcheck._trim_to_sentence("no full sentence") == ""
