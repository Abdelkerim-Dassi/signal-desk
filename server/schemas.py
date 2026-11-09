"""Pydantic request models for the API.

These mirror the loose JSON contract the original stdlib server accepted, so the
existing front-end keeps working unchanged. The engine's own ``parse_holdings``
and ``normalize_asset_ids`` do the final coercion/validation, so we keep these
permissive (e.g. assets may arrive as a comma string or a list).
"""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class Watchlist(BaseModel):
    """Which coins a request is about. Binance Spot is the only market source;
    ``market_source`` is still accepted from older copies of the app and ignored.
    The server caps the list (see ``MAX_ASSETS`` in main.py)."""

    quote_asset: str = Field(default="USDT", max_length=10)
    # Accept either a comma-separated string or a list of tickers.
    assets: str | list[str] | None = Field(default=None, max_length=2000)
    holdings: list[dict[str, Any]] | None = Field(default=None, max_length=50)


class AnalyzeRequest(Watchlist):
    pass


class BriefingRequest(Watchlist):
    """Ask the AI for a narrative over the user's watchlist. The market data is
    built on the server: nothing the browser sends reaches the prompt as data."""

    language: str = Field(default="en", max_length=5)  # en | fr | ar


class ChatMessage(BaseModel):
    role: str = Field(max_length=10)  # "user" | "assistant"
    content: str = Field(max_length=4000)


class ChatRequest(Watchlist):
    question: str = Field(max_length=600)
    # The app sends the last few turns; the model sees at most 12 of them.
    history: list[ChatMessage] = Field(default_factory=list, max_length=24)
    language: str = Field(default="en", max_length=5)


class ScamCheckRequest(BaseModel):
    """Anything a user wants checked; every field is optional. ``text`` may be a
    pasted message, a link, a contract/wallet address or a platform name: the
    server detects which."""

    text: str | None = Field(default=None, max_length=8000)
    url: str | None = Field(default=None, max_length=2000)
    address: str | None = Field(default=None, max_length=120)
    chain: str | None = Field(default=None, max_length=20)
    platform: str | None = Field(default=None, max_length=200)
    language: str = "en"
    explain: bool = True


class StatsEvent(BaseModel):
    """One anonymous usage event from the app, e.g. ``{"event": "visit", "value": "t"}``.
    Only the names listed in ``server/stats.py`` are counted."""

    event: str = Field(max_length=24)
    value: str | None = Field(default=None, max_length=24)
