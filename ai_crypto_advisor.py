from __future__ import annotations

from datetime import datetime

from advisor_engine import build_market_brief, normalize_asset_ids
from notifications import format_market_alert


def compile_ai_briefing(assets: str | list[str] | None = None) -> str:
    """
    Build a market briefing prompt from the same engine used by the web app.

    This keeps the original command-line workflow available while the project
    grows into a portfolio-aware dashboard.
    """
    asset_ids = normalize_asset_ids(assets)
    brief = build_market_brief(asset_ids)
    lines = [
        "=== SYSTEM PROMPT ===",
        (
            "You are a crypto market decision-support analyst. Analyze the provided "
            "market data and explain BUY, SELL, HOLD, or AVOID signals. Be risk-aware, "
            "avoid guarantees, and prioritize capital preservation."
        ),
        "",
        f"=== MARKET BRIEFING ({datetime.now().strftime('%Y-%m-%d')}) ===",
        f"Fear & Greed: {brief['sentiment'].get('score')}/100 - {brief['sentiment'].get('status')}",
        "",
        "=== RANKED SIGNALS ===",
    ]

    for item in brief["opportunities"][:8]:
        lines.extend(
            [
                f"{item['symbol']} / {item['name']}",
                f"Action: {item['action']} | Score: {item['score']}/100 | Risk: {item['risk_level']}",
                f"Price: ${item['current_price']:,.4f} | 24h: {item['change_24h']:.2f}% | 7d: {item['change_7d']:.2f}%",
                "Reasons: " + "; ".join(item["reasons"][:3]),
                "Risks: " + "; ".join(item["risks"][:2]),
                "",
            ]
        )

    lines.extend(
        [
            "=== ALERT SUMMARY ===",
            format_market_alert(brief),
            "",
            "=== REQUIRED OUTPUT FORMAT ===",
            "1. MARKET CYCLE ANALYSIS",
            "2. BEST CURRENT OPPORTUNITIES",
            "3. WHAT TO BUY / SELL / HOLD",
            "4. RISK FACTORS",
            "",
            brief["disclaimer"],
        ]
    )
    prompt = "\n".join(lines)

    with open("ai_prompt.txt", "w", encoding="utf-8") as prompt_file:
        prompt_file.write(prompt)
    return prompt


if __name__ == "__main__":
    print(compile_ai_briefing(["bitcoin", "ethereum", "solana", "chainlink", "render-token", "arbitrum"]))
    print("\nSaved to ai_prompt.txt")
