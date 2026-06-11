"""Pydantic request models for the API.

These mirror the loose JSON contract the original stdlib server accepted, so the
existing front-end keeps working unchanged. The engine's own ``parse_holdings``
and ``normalize_asset_ids`` do the final coercion/validation, so we keep these
permissive (e.g. assets may arrive as a comma string or a list).
"""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class HoldingIn(BaseModel):
    coin_id: str = ""
    amount: float | str | None = None
    average_buy_price: float | str | None = None


class AnalyzeRequest(BaseModel):
    market_source: str = "coingecko"
    quote_asset: str = "USDT"
    # Accept either a comma-separated string or a list of tickers/ids.
    assets: str | list[str] | None = None
    holdings: list[dict[str, Any]] | None = None


class NotifyRequest(BaseModel):
    channels: list[str] | None = None
    message: str | None = None
    brief: dict[str, Any] | None = None


class BriefingRequest(BaseModel):
    """Ask Claude to write a narrative over an already-computed brief."""

    brief: dict[str, Any] = Field(..., description="A brief dict from /api/analyze")


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    question: str
    brief: dict[str, Any] | None = None
    history: list[ChatMessage] = Field(default_factory=list)
