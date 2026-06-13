"""Claude-powered narrative layer.

The heuristic engine produces the numbers (scores, actions, risks). Claude turns
that structured ``brief`` into a readable market briefing, and (Day 5) answers
follow-up questions grounded strictly in the same data.

Cost control:
  * The 2-minute dashboard poll never calls this module — only an explicit
    "refresh briefing" / chat action does.
  * ``narrative_cache`` (a ~5-min TTL keyed on the ranked actions/scores, not the
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

SYSTEM_PROMPT = (
    "You are a crypto market decision-support analyst writing a concise briefing "
    "for one user. You are given structured market data that was produced by a "
    "rule-based scoring engine: ranked BUY/SELL/HOLD/AVOID signals, a Fear & Greed "
    "reading, global market stats, and the user's own holdings when provided.\n\n"
    "Write the briefing using ONLY the data provided — never invent prices, "
    "figures, or coins that are not present. Be risk-aware, avoid guarantees, and "
    "prioritize capital preservation. Explain the *why* behind the top signals in "
    "plain language a non-expert can follow.\n\n"
    "Structure the response in markdown with these sections, each short:\n"
    "1. **Market Pulse** — sentiment + overall tone in 1-2 sentences.\n"
    "2. **Top Opportunities** — the strongest 2-3 signals and the reasoning.\n"
    "3. **Your Positions** — only if holdings are present; otherwise omit.\n"
    "4. **Risks to Watch** — the key risks from the data.\n\n"
    "End with one line: 'Not financial advice — decision support only.' "
    "Keep the whole briefing under ~350 words."
)

CHAT_SYSTEM_PROMPT = (
    "You are a crypto market decision-support assistant chatting with one user. "
    "You are given a structured market snapshot produced by a rule-based scoring "
    "engine (ranked signals, Fear & Greed, global stats, the user's holdings) and "
    "must answer questions grounded STRICTLY in that data.\n\n"
    "Rules:\n"
    "- Answer only from the provided market data and the conversation. Never "
    "invent prices, coins, or news that are not present.\n"
    "- If the data doesn't cover the question, say so plainly and suggest what "
    "the user could check instead.\n"
    "- Be concise (a short paragraph or a few bullets), risk-aware, and avoid "
    "guarantees or pressure to trade.\n"
    "- You are decision support, not financial advice — remind the user of this "
    "when they ask for direct buy/sell instructions."
)


def _client():
    """Lazily construct the async client so importing this module never requires a key."""
    from anthropic import AsyncAnthropic

    return AsyncAnthropic()  # reads ANTHROPIC_API_KEY from env


def _openai_client():
    from openai import AsyncOpenAI

    return AsyncOpenAI()  # reads OPENAI_API_KEY from env


def _openai_model() -> str:
    return os.getenv("OPENAI_MODEL", "gpt-4o-mini")


def provider() -> str | None:
    """Anthropic is preferred when both keys are present; OpenAI is the fallback."""
    if os.getenv("ANTHROPIC_API_KEY"):
        return "anthropic"
    if os.getenv("OPENAI_API_KEY"):
        return "openai"
    return None


def ai_enabled() -> bool:
    return provider() is not None


def _narrative_key(brief: dict[str, Any]) -> str:
    """Cache key that is stable across polls but changes when the picture changes.

    Uses the ranked (symbol, action, rounded-score) tuples plus the sentiment
    bucket — deliberately NOT ``generated_at``, which changes every refresh.
    """
    ranked = [
        (o.get("symbol"), o.get("action"), round(float(o.get("score") or 0)))
        for o in brief.get("opportunities", [])
    ]
    sentiment = round(float((brief.get("sentiment") or {}).get("score") or 50) / 5)
    holdings = sorted(
        (o.get("symbol") for o in brief.get("portfolio", []) if o.get("symbol"))
    )
    raw = json.dumps([ranked, sentiment, holdings], sort_keys=True, default=str)
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
    if glob.get("total_market_cap_usd"):
        lines.append(
            f"Global market cap: ${glob['total_market_cap_usd']:,.0f} "
            f"(24h {glob.get('market_cap_change_24h', 0):+.2f}%), "
            f"BTC dominance {glob.get('btc_dominance', 0):.1f}%"
        )

    lines.append("\nRanked signals:")
    for o in brief.get("opportunities", [])[:8]:
        price = o.get("current_price") or 0
        lines.append(
            f"- {str(o.get('symbol', '')).upper()} ({o.get('name', '')}): "
            f"{o.get('action')} | score {o.get('score')}/100 | risk {o.get('risk_level')} | "
            f"${price:,.4f} | 24h {o.get('change_24h', 0):+.2f}% | 7d {o.get('change_7d', 0):+.2f}%"
        )
        reasons = o.get("reasons") or []
        risks = o.get("risks") or []
        if reasons:
            lines.append(f"    reasons: {'; '.join(reasons[:3])}")
        if risks:
            lines.append(f"    risks: {'; '.join(risks[:2])}")

    portfolio = brief.get("portfolio", [])
    if portfolio:
        lines.append("\nUser holdings:")
        for o in portfolio:
            h = o.get("holding") or {}
            pnl = h.get("unrealized_pnl")
            pnl_s = f"{pnl:+.2f}%" if isinstance(pnl, (int, float)) else "n/a"
            lines.append(
                f"- {str(o.get('symbol', '')).upper()}: value ${h.get('value') or 0:,.2f}, "
                f"unrealized P&L {pnl_s}, signal {o.get('action')}"
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
        max_completion_tokens=1200,
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


async def generate_briefing(brief: dict[str, Any]) -> dict[str, Any]:
    """Return {text, cached, usage?}. Uses the narrative cache to avoid repeat spend.

    The in-memory cache is checked first, then Redis when configured — on
    serverless each invocation may be a fresh process, so without the Redis
    tier every briefing click is a fresh paid call.
    """
    key = _narrative_key(brief)
    cached = narrative_cache.get(key)
    if cached is None and upstash.enabled():
        cached = await asyncio.to_thread(upstash.get_str, f"ai:narrative:{key}")
        if cached is not None:
            narrative_cache.set(key, cached, ttl=NARRATIVE_TTL)
    if cached is not None:
        return {"ok": True, "text": cached, "cached": True}

    prompt = _brief_digest(brief) + "\n\nWrite the market briefing now."
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
    messages.append({"role": "user", "content": final})
    return messages


async def stream_chat(
    question: str,
    brief: dict[str, Any] | None,
    history: list[dict[str, str]],
) -> AsyncIterator[str]:
    """Yield the assistant's answer as text chunks, grounded in the brief."""
    messages = _chat_messages(question, brief, history)

    if provider() == "openai":
        client = _openai_client()
        stream = await client.chat.completions.create(
            model=_openai_model(),
            max_completion_tokens=1500,
            stream=True,
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
