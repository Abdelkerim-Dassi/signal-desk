"""Claude-powered narrative layer.

The engine produces the numbers (karats, risk grades, market weather). Claude turns
that structured ``brief`` into a readable market briefing, and (Day 5) answers
follow-up questions grounded strictly in the same data.

Cost control:
  * The 2-minute dashboard poll never calls this module — only an explicit
    "refresh briefing" / chat action does.
  * ``narrative_cache`` (a ~5-min TTL keyed on the ranked karats/risk grades, not the
    timestamp) means a near-identical brief reuses the last narrative for free.
  * The stable system prompt carries a ``cache_control`` marker so the API caches
    it when it's large enough; the TTL cache above is the primary cost guard.

The API key is read from the environment by the SDK — never hard-coded.
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import os
from typing import Any, AsyncIterator

from . import upstash
from .cache import narrative_cache

# Override with ANTHROPIC_MODEL to trade quality for cost — e.g.
# claude-haiku-4-5 ($1/$5 per MTok) or claude-sonnet-4-6 ($3/$15) instead of
# the claude-opus-4-8 default ($5/$25). This brief-narration task is well
# within Haiku's reach.
MODEL = os.getenv("ANTHROPIC_MODEL", "claude-opus-4-8")

NARRATIVE_TTL = 300  # seconds; shared by the in-memory and Redis caches

MAX_CHAT_TURNS = 6  # cap history so a long chat can't inflate cost unboundedly

# The scoring rubric, described for the model so it can explain its own numbers.
# This mirrors advisor_engine.analyze_asset exactly; keep the two in sync. It is
# static text, so it stays byte-stable inside the cached system prompt.
SCORING_RUBRIC = (
    "HOW THE GRADES ARE COMPUTED (documented methodology: you MAY explain it "
    "fully and it is never 'inventing'):\n"
    "Qirat grades coins like gold. Every grade uses market data only, is identical "
    "for every user and never depends on what the user holds.\n"
    "KARAT (24K, 22K, 18K, 14K, 10K): how calm a coin has been (its 30-day "
    "volatility) plus how strong its 90-day trend is (skipping the last week), "
    "each ranked against a fixed reference set of 18 major coins and averaged "
    "into a 0-100 trend score: >=80 is 24K, >=60 22K, >=40 18K, >=20 14K, else 10K. "
    "24K = calm and climbing; 10K = wild or sliding. Coins under ~3 months old "
    "have no karat yet. In 2021-2026 tests, calm coins with a 90-day uptrend did "
    "better than the rest over the next week, but only modestly and not every "
    "week, so a karat is a tilt of the odds, never a promise.\n"
    "RISK (Low, Medium, High): the coin's 30-day volatility versus the same 18 "
    "coins, in thirds. This is the most reliable part: a coin's recent volatility "
    "predicted its next month's swings in every month tested. 'Typical day' is "
    "the daily volatility; 'a rough month (1 in 20)' is the loss a normal-model "
    "1-in-20 month would bring (real crypto tails can be worse).\n"
    "MARKET WEATHER (calm, choppy, stormy): calm when BTC is above its 50-day "
    "average and the crowd is not overheated (Fear & Greed below 80 and perpetual "
    "funding below 0.05% per 8h); choppy when overheated, or when BTC dipped "
    "under its 50-day average but holds its 200-day; stormy when BTC is below "
    "both. Since 2021 months that started above the 50-day line went clearly "
    "better. Karats compare coins with each other; the weather is about the whole "
    "market, so in a storm even 24K coins usually fall.\n"
    "Each coin carries a `grade` (karat, trend_score, calm_pct, momentum_pct, "
    "mom90_pct, risk, typical_day_pct, rough_month_pct). Use it to explain why a "
    "coin has its karat and what would change it (a steadier price, or a stronger "
    "90-day trend). If asked where this is documented, point the user to the "
    'in-app "How Qirat works" guide.'
)

# Ratings are impersonal analysis. Telling one user what to do with their own
# money is personalised investment advice (MiCA, FCA, SEC), so both prompts
# forbid it and redirect to what the data says instead.
NO_ADVICE_RULE = (
    "Never tell the user to buy, sell, hold, add to, trim or exit any coin, and "
    "never tailor a recommendation to their holdings, budget or circumstances. "
    "If asked 'should I buy/sell X?', explain what X's karat, risk and the market "
    "weather say and what would change them, then note that the decision "
    "and position sizing are theirs. You may describe their positions factually "
    "(value, P&L, the coin's karat and risk) but never advise on them."
)

SYSTEM_PROMPT = (
    "You are a crypto market analyst writing a concise, plain-language briefing. "
    "You are given structured market data produced by a rule-based scoring "
    "engine: coins ranked by karat (24K best to 10K) with a risk grade, the "
    "market weather, a Fear & Greed reading, global market stats, and the "
    "user's watchlist positions when provided.\n\n"
    "Write the briefing from the data provided plus the scoring methodology below. "
    "Never invent prices, figures, coins, or news that are not present — but you "
    "MAY explain how the grades work and why a coin has its karat. "
    "Be risk-aware and avoid guarantees. Explain the *why* behind the strongest "
    "and weakest karats in plain language a non-expert can follow.\n\n"
    + NO_ADVICE_RULE + "\n\n"
    "Structure the response in markdown with these sections, each short:\n"
    "1. **Market Weather** — the weather, sentiment and overall tone in 1-2 sentences.\n"
    "2. **Highest Karats** — the top 2-3 coins by karat and why, with their risk.\n"
    "3. **Your Watchlist Positions** — only if holdings are present; factual "
    "value/P&L and each coin's karat and risk, no advice; otherwise omit.\n"
    "4. **Risks to Watch** — the key risks from the data.\n\n"
    "End with one line: 'Rule-based grades, not financial advice.' "
    "Keep the whole briefing under ~350 words.\n\n" + SCORING_RUBRIC
)

CHAT_SYSTEM_PROMPT = (
    "You are a crypto market analyst assistant chatting with one user. You are "
    "given a structured market snapshot produced by a rule-based scoring engine "
    "(coins ranked by karat with risk grades, the market weather, Fear & Greed, "
    "global stats, the user's watchlist positions) and must answer questions "
    "grounded STRICTLY in that data.\n\n"
    "Rules:\n"
    "- Answer from the provided market data, the conversation, and the scoring "
    "methodology described below. Never invent prices, coins, figures, or news "
    "that are not present — but you MAY explain how the scoring engine works, how "
    "a specific score was composed (use its `score_breakdown`), and what a coin "
    "would need to score higher or reach 100.\n"
    "- If a question falls outside all of that, say so plainly and suggest what "
    "the user could check instead. If asked where scoring is documented, point "
    'them to the in-app "How Qirat works" guide.\n'
    "- Be concise (a short paragraph or a few bullets), risk-aware, and avoid "
    "guarantees or pressure to trade.\n"
    "- " + NO_ADVICE_RULE + "\n\n" + SCORING_RUBRIC
)


# Languages the UI ships in. The instruction rides in the user turn (not the
# system prompt) so the cached system prompt stays byte-identical across them.
LANGUAGES = {
    "en": "English",
    "fr": "French",
    "ar": "Modern Standard Arabic",
}


def _language(code: str | None) -> str:
    return code if code in LANGUAGES else "en"


def _language_instruction(code: str) -> str:
    if code == "en":
        return ""
    return (
        f"\n\nWrite your entire answer in {LANGUAGES[code]}, including the section "
        "headings (translate them). Keep coin tickers (BTC, ETH), numbers and the "
        "karat labels (24K, 22K, 18K, 14K, 10K) as they are."
    )


def _client():
    """Lazily construct the async client so importing this module never requires a key."""
    from anthropic import AsyncAnthropic

    return AsyncAnthropic()  # reads ANTHROPIC_API_KEY from env


# Groq is a free, OpenAI-compatible provider, so it rides the same OpenAI client
# path — it just has its own key and sensible Groq defaults for base URL/model.
GROQ_BASE_URL = "https://api.groq.com/openai/v1"
# llama-3.3-70b-versatile was retired on Groq's free/dev tiers on 2026-08-16;
# gpt-oss-120b is Groq's recommended replacement and the cheapest of them.
GROQ_MODEL = "openai/gpt-oss-120b"


def _openai_config() -> tuple[str | None, str | None, str]:
    """Resolve (api_key, base_url, model) for the OpenAI-compatible path.

    GROQ_API_KEY takes precedence and brings Groq's defaults so production needs
    no OpenAI key at all. Falls back to real OpenAI when only OPENAI_API_KEY is
    set. OPENAI_BASE_URL / OPENAI_MODEL still override either way.
    """
    if os.getenv("GROQ_API_KEY"):
        return (
            os.getenv("GROQ_API_KEY"),
            os.getenv("OPENAI_BASE_URL") or GROQ_BASE_URL,
            os.getenv("OPENAI_MODEL") or GROQ_MODEL,
        )
    return (
        os.getenv("OPENAI_API_KEY"),
        os.getenv("OPENAI_BASE_URL") or None,
        os.getenv("OPENAI_MODEL") or "gpt-4o-mini",
    )


def _openai_client():
    from openai import AsyncOpenAI

    api_key, base_url, _ = _openai_config()
    return AsyncOpenAI(api_key=api_key, base_url=base_url)


def _openai_model() -> str:
    return _openai_config()[2]


def _openai_extra() -> dict[str, Any]:
    """Model-specific request options for the OpenAI-compatible path.

    gpt-oss models reason before answering, and those tokens count against
    ``max_completion_tokens``; low effort keeps the budget for the answer itself.
    The reasoning arrives in a separate field, so ``content`` stays clean.
    """
    return {"reasoning_effort": "low"} if "gpt-oss" in _openai_model() else {}


def provider() -> str | None:
    """Anthropic is preferred; the OpenAI-compatible path (Groq or OpenAI) is the fallback."""
    if os.getenv("ANTHROPIC_API_KEY"):
        return "anthropic"
    if os.getenv("GROQ_API_KEY") or os.getenv("OPENAI_API_KEY"):
        return "openai"
    return None


def ai_enabled() -> bool:
    return provider() is not None


def _narrative_key(brief: dict[str, Any], language: str = "en") -> str:
    """Cache key that is stable across polls but changes when the picture changes.

    Uses the ranked (symbol, rating, rounded-score) tuples plus the sentiment
    bucket — deliberately NOT ``generated_at``, which changes every refresh.
    """
    ranked = [
        (o.get("symbol"), (o.get("grade") or {}).get("karat"), (o.get("grade") or {}).get("risk"))
        for o in brief.get("opportunities", [])
    ]
    sentiment = round(float((brief.get("sentiment") or {}).get("score") or 50) / 5)
    holdings = sorted(
        (o.get("symbol") for o in brief.get("portfolio", []) if o.get("symbol"))
    )
    regime = (brief.get("weather") or {}).get("state")
    raw = json.dumps([ranked, sentiment, holdings, regime, language], sort_keys=True, default=str)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def _brief_digest(brief: dict[str, Any]) -> str:
    """Render the brief into a compact textual prompt for Claude."""
    sentiment = brief.get("sentiment", {})
    glob = brief.get("global", {})
    lines = [
        f"Exchange/source: {brief.get('exchange_label', 'CoinGecko')} "
        f"(quote {brief.get('quote_asset', 'USD')})",
        f"Fear & Greed: {sentiment.get('score', 'n/a')}/100 — {sentiment.get('status', 'Neutral')}",
    ]
    w = brief.get("weather") or {}
    if w.get("state") in ("calm", "choppy", "stormy"):
        lines.append(
            f"Market weather: {w['state']} — BTC ${w.get('btc_price') or 0:,.0f} is "
            f"{w.get('vs_ma50_pct') or 0:+.1f}% vs its 50-day average"
            + (f" and {w['vs_ma200_pct']:+.1f}% vs its 200-day" if w.get("vs_ma200_pct") is not None else "")
            + (f"; overheated: {', '.join(w['hot'])}" if w.get("hot") else "")
            + (f"; avg perp funding {w['funding_pct']:.4f}%/8h" if w.get("funding_pct") is not None else "")
        )
    if glob.get("total_market_cap_usd"):
        lines.append(
            f"Global market cap: ${glob['total_market_cap_usd']:,.0f} "
            f"(24h {glob.get('market_cap_change_24h', 0):+.2f}%), "
            f"BTC dominance {glob.get('btc_dominance', 0):.1f}%"
        )

    lines.append("\nCoins ranked by karat:")
    for o in brief.get("opportunities", [])[:8]:
        price = o.get("current_price") or 0
        g = o.get("grade") or {}
        karat = f"{g['karat']}K" if g.get("karat") else "no karat yet (too new)"
        lines.append(
            f"- {str(o.get('symbol', '')).upper()} ({o.get('name', '')}): {karat} | risk {g.get('risk', 'n/a')} | "
            f"${price:,.6g} | 24h {o.get('change_24h', 0):+.2f}% | 7d {o.get('change_7d', 0):+.2f}%"
        )
        if g:
            trend = f"90-day trend {g['mom90_pct']:+.1f}% (stronger than {g['momentum_pct']}% of the 18 majors), " if g.get("mom90_pct") is not None else ""
            lines.append(
                f"    grade: {trend}typical day ±{g['typical_day_pct']:.1f}% (calmer than {g['calm_pct']}%), "
                f"rough month ≈ {g['rough_month_pct']:.0f}%, trend score {g.get('trend_score')}"
            )

    portfolio = brief.get("portfolio", [])
    if portfolio:
        lines.append("\nUser's watchlist positions (context only — do not advise on them):")
        for o in portfolio:
            h = o.get("holding") or {}
            pnl = h.get("unrealized_pnl")
            pnl_s = f"{pnl:+.2f}%" if isinstance(pnl, (int, float)) else "n/a"
            lines.append(
                f"- {str(o.get('symbol', '')).upper()}: value ${h.get('value') or 0:,.2f}, "
                f"unrealized P&L {pnl_s}, karat {(o.get('grade') or {}).get('karat')}K, risk {(o.get('grade') or {}).get('risk')}"
            )

    return "\n".join(lines)


async def _anthropic_briefing(prompt: str) -> tuple[str, dict[str, Any]]:
    client = _client()
    resp = await client.messages.create(
        model=MODEL,
        max_tokens=4000,
        thinking={"type": "adaptive"},
        system=[
            {
                "type": "text",
                "text": SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[{"role": "user", "content": prompt}],
    )
    text = "".join(b.text for b in resp.content if b.type == "text").strip()
    usage = {
        "input_tokens": resp.usage.input_tokens,
        "output_tokens": resp.usage.output_tokens,
        "cache_read_input_tokens": getattr(resp.usage, "cache_read_input_tokens", 0),
        "cache_creation_input_tokens": getattr(resp.usage, "cache_creation_input_tokens", 0),
    }
    return text, usage


async def _openai_briefing(prompt: str) -> tuple[str, dict[str, Any]]:
    client = _openai_client()
    resp = await client.chat.completions.create(
        model=_openai_model(),
        max_completion_tokens=2000,
        **_openai_extra(),
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
    )
    text = (resp.choices[0].message.content or "").strip()
    usage = {
        "input_tokens": resp.usage.prompt_tokens if resp.usage else 0,
        "output_tokens": resp.usage.completion_tokens if resp.usage else 0,
    }
    return text, usage


async def generate_briefing(brief: dict[str, Any], language: str = "en") -> dict[str, Any]:
    """Return {text, cached, usage?}. Uses the narrative cache to avoid repeat spend.

    The in-memory cache is checked first, then Redis when configured — on
    serverless each invocation may be a fresh process, so without the Redis
    tier every briefing click is a fresh paid call.
    """
    language = _language(language)
    key = _narrative_key(brief, language)
    cached = narrative_cache.get(key)
    if cached is None and upstash.enabled():
        cached = await asyncio.to_thread(upstash.get_str, f"ai:narrative:{key}")
        if cached is not None:
            narrative_cache.set(key, cached, ttl=NARRATIVE_TTL)
    if cached is not None:
        return {"ok": True, "text": cached, "cached": True}

    prompt = _brief_digest(brief) + "\n\nWrite the market briefing now." + _language_instruction(language)
    if provider() == "openai":
        text, usage = await _openai_briefing(prompt)
    else:
        text, usage = await _anthropic_briefing(prompt)
    narrative_cache.set(key, text, ttl=NARRATIVE_TTL)
    if upstash.enabled():
        await asyncio.to_thread(upstash.set_str, f"ai:narrative:{key}", text, NARRATIVE_TTL)
    return {"ok": True, "text": text, "cached": False, "usage": usage}


def _chat_messages(
    question: str,
    brief: dict[str, Any] | None,
    history: list[dict[str, str]],
    language: str = "en",
) -> list[dict[str, Any]]:
    """Build the message list: capped history, then the data-grounded question.

    The market snapshot rides inside the final user turn (not the system prompt)
    so the stable system prompt stays byte-identical and cacheable across calls.
    """
    messages: list[dict[str, Any]] = []
    for turn in history[-(MAX_CHAT_TURNS * 2):]:
        role = turn.get("role")
        content = (turn.get("content") or "").strip()
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": content})
    # The API requires the conversation to start with a user turn.
    while messages and messages[0]["role"] != "user":
        messages.pop(0)

    if brief:
        final = (
            "Current market snapshot:\n"
            f"{_brief_digest(brief)}\n\n"
            f"User question: {question}"
        )
    else:
        final = (
            "No market snapshot is available right now (the data feed may be "
            f"refreshing). Answer carefully without inventing data.\n\n"
            f"User question: {question}"
        )
    messages.append({"role": "user", "content": final + _language_instruction(_language(language))})
    return messages


async def stream_chat(
    question: str,
    brief: dict[str, Any] | None,
    history: list[dict[str, str]],
    language: str = "en",
) -> AsyncIterator[str]:
    """Yield the assistant's answer as text chunks, grounded in the brief."""
    messages = _chat_messages(question, brief, history, language)

    if provider() == "openai":
        client = _openai_client()
        stream = await client.chat.completions.create(
            model=_openai_model(),
            max_completion_tokens=1500,
            stream=True,
            **_openai_extra(),
            messages=[{"role": "system", "content": CHAT_SYSTEM_PROMPT}, *messages],
        )
        async for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
        return

    client = _client()
    async with client.messages.stream(
        model=MODEL,
        max_tokens=1500,
        thinking={"type": "adaptive"},
        system=[
            {
                "type": "text",
                "text": CHAT_SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=messages,
    ) as stream:
        async for text in stream.text_stream:
            yield text
