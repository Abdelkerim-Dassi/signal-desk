from __future__ import annotations

import math
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Any
from xml.etree import ElementTree

import os

import requests


COINGECKO_API = "https://api.coingecko.com/api/v3"
# api.binance.com returns HTTP 451 from US IPs (where Vercel functions run by
# default); data-api.binance.vision is Binance's public market-data mirror
# serving the same /api/v3 endpoints without the geo-block.
BINANCE_API = os.environ.get("BINANCE_API_BASE", "https://data-api.binance.vision")
FEAR_GREED_API = "https://api.alternative.me/fng/"
NEWS_FEEDS = (
    "https://www.coindesk.com/arc/outboundfeeds/rss/",
    "https://cointelegraph.com/rss",
    "https://decrypt.co/feed",
)


DEFAULT_ASSETS = ["bitcoin", "ethereum"]
DEFAULT_BINANCE_SYMBOLS = ["BTCUSDT", "ETHUSDT"]
BINANCE_QUOTE_ASSETS = ("USDT", "USDC", "FDUSD", "BTC", "ETH", "BNB", "EUR", "TRY")
COINGECKO_TO_BINANCE = {
    "bitcoin": "BTCUSDT",
    "ethereum": "ETHUSDT",
    "solana": "SOLUSDT",
    "chainlink": "LINKUSDT",
    "injective-protocol": "INJUSDT",
    "og-fan-token": "OGUSDT",
    "arbitrum": "ARBUSDT",
    "render-token": "RENDERUSDT",
}
BINANCE_BASE_NAMES = {
    "BTC": "Bitcoin",
    "ETH": "Ethereum",
    "SOL": "Solana",
    "LINK": "Chainlink",
    "INJ": "Injective",
    "OG": "OG Fan Token",
    "ARB": "Arbitrum",
    "RENDER": "Render",
}


class DataFetchError(RuntimeError):
    pass


@dataclass(frozen=True)
class Holding:
    coin_id: str
    amount: float
    average_buy_price: float | None = None


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _safe_float(value: Any, default: float = 0.0) -> float:
    try:
        if value is None:
            return default
        parsed = float(value)
        if math.isnan(parsed) or math.isinf(parsed):
            return default
        return parsed
    except (TypeError, ValueError):
        return default


def _get_json(url: str, params: dict[str, Any] | None = None, timeout: int = 15) -> Any:
    # CoinGecko's free tier rate-limits bursts (429); one brief fires several calls.
    for attempt in range(3):
        response = requests.get(url, params=params, timeout=timeout)
        if response.status_code == 429 or response.status_code >= 500:
            if attempt < 2:
                time.sleep(1.5 * (attempt + 1))
                continue
        if response.status_code >= 400:
            raise DataFetchError(f"{url} returned HTTP {response.status_code}")
        return response.json()
    raise DataFetchError(f"{url} returned HTTP {response.status_code}")


def normalize_asset_ids(raw_assets: str | list[str] | None) -> list[str]:
    if raw_assets is None:
        return DEFAULT_ASSETS.copy()
    if isinstance(raw_assets, str):
        assets = raw_assets.split(",")
    else:
        assets = raw_assets
    normalized = []
    for asset in assets:
        coin_id = str(asset).strip().lower()
        if coin_id and coin_id not in normalized:
            normalized.append(coin_id)
    return normalized or DEFAULT_ASSETS.copy()


def normalize_binance_symbols(raw_assets: str | list[str] | None, quote_asset: str = "USDT") -> list[str]:
    if raw_assets is None:
        return DEFAULT_BINANCE_SYMBOLS.copy()
    if isinstance(raw_assets, str):
        assets = raw_assets.split(",")
    else:
        assets = raw_assets

    symbols: list[str] = []
    for asset in assets:
        symbol = infer_binance_symbol(str(asset), quote_asset)
        if symbol and symbol not in symbols:
            symbols.append(symbol)
    return symbols or DEFAULT_BINANCE_SYMBOLS.copy()


def infer_binance_symbol(asset: str, quote_asset: str = "USDT") -> str:
    quote = quote_asset.strip().upper() or "USDT"
    raw = asset.strip()
    if not raw:
        return ""
    lower = raw.lower()
    if lower in COINGECKO_TO_BINANCE:
        return COINGECKO_TO_BINANCE[lower]
    compact = raw.replace("/", "").replace("-", "").replace("_", "").upper()
    if any(compact.endswith(quote_candidate) for quote_candidate in BINANCE_QUOTE_ASSETS):
        return compact
    return f"{compact}{quote}"


def split_binance_symbol(symbol: str, fallback_quote: str = "USDT") -> tuple[str, str]:
    upper = symbol.upper()
    for quote in BINANCE_QUOTE_ASSETS:
        if upper.endswith(quote) and len(upper) > len(quote):
            return upper[: -len(quote)], quote
    quote = fallback_quote.strip().upper() or "USDT"
    return upper.removesuffix(quote), quote


def parse_holdings(raw_holdings: Any) -> list[Holding]:
    holdings: list[Holding] = []
    if not isinstance(raw_holdings, list):
        return holdings
    for item in raw_holdings:
        if not isinstance(item, dict):
            continue
        coin_id = str(item.get("coin_id", "")).strip().lower()
        amount = _safe_float(item.get("amount"))
        avg_buy = item.get("average_buy_price")
        parsed_avg = _safe_float(avg_buy, default=0.0) if avg_buy not in ("", None) else None
        if coin_id and amount > 0:
            holdings.append(Holding(coin_id=coin_id, amount=amount, average_buy_price=parsed_avg or None))
    return holdings


def get_market_prices(asset_ids: list[str], vs_currency: str = "usd") -> list[dict[str, Any]]:
    ids = ",".join(asset_ids)
    params = {
        "vs_currency": vs_currency,
        "ids": ids,
        "order": "market_cap_desc",
        "per_page": max(1, len(asset_ids)),
        "page": 1,
        "sparkline": "true",
        "price_change_percentage": "1h,24h,7d,30d",
    }
    data = _get_json(f"{COINGECKO_API}/coins/markets", params=params)
    if not isinstance(data, list):
        raise DataFetchError("CoinGecko markets response was not a list")
    return data


def get_market_chart(coin_id: str, days: int = 45, vs_currency: str = "usd") -> dict[str, Any]:
    params = {"vs_currency": vs_currency, "days": days, "interval": "daily"}
    data = _get_json(f"{COINGECKO_API}/coins/{coin_id}/market_chart", params=params)
    prices = data.get("prices", [])
    volumes = data.get("total_volumes", [])
    if not prices:
        raise DataFetchError(f"No chart prices returned for {coin_id}")
    return {"prices": prices, "volumes": volumes}


def get_binance_24hr(symbol: str) -> dict[str, Any]:
    params = {"symbol": symbol.upper()}
    data = _get_json(f"{BINANCE_API}/api/v3/ticker/24hr", params=params, timeout=10)
    if not isinstance(data, dict):
        raise DataFetchError(f"Binance ticker response was invalid for {symbol}")
    return data


def get_binance_klines(symbol: str, interval: str = "1d", limit: int = 45) -> list[list[Any]]:
    params = {"symbol": symbol.upper(), "interval": interval, "limit": limit}
    data = _get_json(f"{BINANCE_API}/api/v3/klines", params=params, timeout=10)
    if not isinstance(data, list):
        raise DataFetchError(f"Binance kline response was invalid for {symbol}")
    return data


def binance_klines_to_chart(klines: list[list[Any]]) -> dict[str, Any]:
    prices = []
    volumes = []
    for row in klines:
        if len(row) < 8:
            continue
        timestamp = int(_safe_float(row[0]))
        close_price = _safe_float(row[4])
        quote_volume = _safe_float(row[7])
        prices.append([timestamp, close_price])
        volumes.append([timestamp, quote_volume])
    return {"prices": prices, "volumes": volumes}


def binance_ticker_to_market(
    ticker: dict[str, Any],
    klines: list[list[Any]],
    quote_asset: str = "USDT",
) -> dict[str, Any]:
    symbol = str(ticker.get("symbol", "")).upper()
    base, quote = split_binance_symbol(symbol, quote_asset)
    closes = [_safe_float(row[4]) for row in klines if len(row) >= 5]
    current_price = _safe_float(ticker.get("lastPrice"))
    previous_7d = closes[-8] if len(closes) >= 8 else None
    previous_30d = closes[-31] if len(closes) >= 31 else None
    return {
        "id": symbol.lower(),
        "pair": symbol,
        "base_asset": base,
        "quote_asset": quote,
        "source": "Binance Spot",
        "symbol": base,
        "name": BINANCE_BASE_NAMES.get(base, base),
        "image": None,
        "current_price": current_price,
        "market_cap_rank": None,
        "market_cap": None,
        "total_volume": _safe_float(ticker.get("quoteVolume")),
        "sparkline_in_7d": {"price": closes[-7:]},
        "price_change_percentage_24h": _safe_float(ticker.get("priceChangePercent")),
        "price_change_percentage_7d_in_currency": percent_change(current_price, previous_7d) or 0.0,
        "price_change_percentage_30d_in_currency": percent_change(current_price, previous_30d) or 0.0,
        "ath": None,
    }


def get_fear_greed() -> dict[str, Any]:
    try:
        data = _get_json(FEAR_GREED_API, timeout=10)
        first = data.get("data", [{}])[0]
        score = int(first.get("value", 50))
        return {
            "score": score,
            "status": first.get("value_classification", "Neutral"),
            "updated_at": first.get("timestamp"),
        }
    except Exception:
        return {"score": 50, "status": "Neutral", "updated_at": None}


# Global stats barely move minute-to-minute, and a brief rebuild already spends
# most of the CoinGecko free-tier per-minute budget on markets/charts — so serve
# a 5-min memo instead of competing for the last request slot every rebuild.
_GLOBAL_MARKET_TTL = 300.0
_last_global_market: dict[str, Any] | None = None
_last_global_market_at = 0.0


def get_global_market() -> dict[str, Any]:
    global _last_global_market, _last_global_market_at
    if _last_global_market is not None and time.time() - _last_global_market_at < _GLOBAL_MARKET_TTL:
        return _last_global_market
    try:
        data = _get_json(f"{COINGECKO_API}/global", timeout=10).get("data", {})
        total_market_cap = data.get("total_market_cap", {}).get("usd")
        total_volume = data.get("total_volume", {}).get("usd")
        market_cap_change = data.get("market_cap_change_percentage_24h_usd")
        btc_dominance = data.get("market_cap_percentage", {}).get("btc")
        eth_dominance = data.get("market_cap_percentage", {}).get("eth")
        _last_global_market = {
            "total_market_cap_usd": total_market_cap,
            "total_volume_usd": total_volume,
            "market_cap_change_24h": market_cap_change,
            "btc_dominance": btc_dominance,
            "eth_dominance": eth_dominance,
        }
        _last_global_market_at = time.time()
        return _last_global_market
    except Exception:
        if _last_global_market is not None:
            return _last_global_market
        return {
            "total_market_cap_usd": None,
            "total_volume_usd": None,
            "market_cap_change_24h": None,
            "btc_dominance": None,
            "eth_dominance": None,
        }


def get_trending() -> list[dict[str, Any]]:
    try:
        data = _get_json(f"{COINGECKO_API}/search/trending", timeout=10)
        coins = []
        for row in data.get("coins", [])[:7]:
            item = row.get("item", {})
            coins.append(
                {
                    "id": item.get("id"),
                    "name": item.get("name"),
                    "symbol": item.get("symbol"),
                    "market_cap_rank": item.get("market_cap_rank"),
                    "thumb": item.get("thumb"),
                }
            )
        return coins
    except Exception:
        return []


def get_news(limit: int = 8) -> list[dict[str, Any]]:
    articles: list[dict[str, Any]] = []
    for feed_url in NEWS_FEEDS:
        try:
            response = requests.get(feed_url, timeout=10)
            response.raise_for_status()
            root = ElementTree.fromstring(response.content)
            channel = root.find("channel")
            if channel is None:
                continue
            source = channel.findtext("title") or "Crypto news"
            for item in channel.findall("item")[:limit]:
                title = item.findtext("title")
                link = item.findtext("link")
                published = item.findtext("pubDate")
                published_dt = parse_news_date(published)
                if title and link:
                    articles.append(
                        {
                            "source": source,
                            "title": title.strip(),
                            "url": link.strip(),
                            "published_at": published,
                            "published_ts": published_dt.timestamp() if published_dt else 0,
                        }
                    )
        except Exception:
            continue
    articles.sort(key=lambda article: article.get("published_ts", 0), reverse=True)
    return articles[:limit]


def parse_news_date(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        parsed = parsedate_to_datetime(value)
        if parsed.tzinfo is None:
            return parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc)
    except (TypeError, ValueError, IndexError, OverflowError):
        return None


def moving_average(values: list[float], window: int) -> float | None:
    if len(values) < window:
        return None
    return sum(values[-window:]) / window


def percent_change(current: float, previous: float | None) -> float | None:
    if previous in (None, 0):
        return None
    return ((current - previous) / previous) * 100


def analyze_asset(
    market: dict[str, Any],
    chart: dict[str, Any] | None,
    sentiment: dict[str, Any],
    holding: Holding | None = None,
) -> dict[str, Any]:
    prices = [_safe_float(row[1]) for row in (chart or {}).get("prices", [])]
    volumes = [_safe_float(row[1]) for row in (chart or {}).get("volumes", [])]
    current_price = _safe_float(market.get("current_price"))
    if not current_price and prices:
        current_price = prices[-1] or current_price

    ma7 = moving_average(prices, 7)
    ma30 = moving_average(prices, 30)
    volume7 = moving_average(volumes, 7)
    previous_volume7 = sum(volumes[-14:-7]) / 7 if len(volumes) >= 14 else None

    change_24h = _safe_float(market.get("price_change_percentage_24h"))
    change_7d = _safe_float(market.get("price_change_percentage_7d_in_currency"))
    change_30d = _safe_float(market.get("price_change_percentage_30d_in_currency"))
    drawdown_from_high = percent_change(current_price, _safe_float(market.get("ath"))) or 0.0
    volume_change = percent_change(volume7 or 0, previous_volume7)
    sentiment_score = int(sentiment.get("score", 50))

    score = 50.0
    reasons: list[str] = []
    risks: list[str] = []
    breakdown: list[dict[str, Any]] = []

    def bump(delta: float, label: str, reason: str | None = None, risk: str | None = None) -> None:
        """Apply a scoring delta and record it in one place.

        Keeps ``score``, ``breakdown``, ``reasons`` and ``risks`` in lock-step so
        the emitted ``score_breakdown`` is always an exact account of the number —
        the same rubric the UI expands and the AI narrates.
        """
        nonlocal score
        score += delta
        breakdown.append({"label": label, "delta": delta})
        if reason:
            reasons.append(reason)
        if risk:
            risks.append(risk)

    if ma7 and current_price > ma7:
        bump(10, "Above 7-day average", reason="Price is above the 7-day average, showing short-term strength.")
    elif ma7:
        bump(-10, "Below 7-day average", reason="Price is below the 7-day average, so momentum is weak.")

    if ma30 and current_price > ma30:
        bump(10, "Above 30-day average", reason="Price is above the 30-day average, confirming broader trend support.")
    elif ma30:
        bump(-12, "Below 30-day average", reason="Price is below the 30-day average, which raises trend risk.")

    if change_7d > 8:
        bump(6, "Strong 7-day return", reason="The 7-day return is strong.")
    elif change_7d < -8:
        bump(-7, "Weak 7-day return", reason="The 7-day return is sharply negative.")

    if volume_change is not None and volume_change > 20:
        bump(5, "Rising volume", reason="Recent volume is rising, which can confirm the move.")
    elif volume_change is not None and volume_change < -20:
        bump(-3, "Fading volume", reason="Recent volume is fading, so conviction is lower.")

    if sentiment_score <= 25:
        bump(8, "Contrarian fear",
             reason="Market sentiment is fearful, which can create discounted entries.",
             risk="Fear can persist longer than expected during broad sell-offs.")
    elif sentiment_score >= 75:
        bump(-8, "Market greed",
             reason="Market sentiment is greedy, so chasing entries is riskier.",
             risk="Extreme greed can precede fast pullbacks.")

    if change_24h < -10:
        bump(-8, "Sharp 24h drop",
             risk="The asset dropped heavily in 24 hours, so volatility risk is elevated.")
    if change_30d > 40:
        bump(-4, "Extended 30-day move",
             risk="The 30-day move is extended, making a cooldown more likely.")
    if drawdown_from_high < -70:
        risks.append("The asset remains far below its all-time high, which may signal structural weakness.")

    # Top-end criteria: deliberately hard to earn so only a genuinely strong
    # setup can stack toward the 100 ceiling. The +3/+2 are gated on the
    # short-term uptrend (price above its 7-day MA) so a volume surge or a green
    # day on a *falling* asset reads as capitulation, not strength — not a bonus.
    if 10 < change_30d <= 40:
        bump(5, "Sustained 30-day uptrend",
             reason="The 30-day trend is steadily higher without being overextended.")
    if ma7 and ma30 and current_price > ma7 and current_price > ma30 and ma7 > ma30:
        bump(4, "Uptrend structure",
             reason="Price sits above a rising 7-over-30-day average stack — a clean uptrend structure.")
    if volume_change is not None and volume_change > 50 and ma7 and current_price > ma7:
        bump(3, "Volume conviction",
             reason="Volume is surging while price holds its short-term trend — strong conviction.")
    if ma7 and current_price > ma7 and 2 <= change_24h <= 10:
        bump(2, "Steady 24h follow-through",
             reason="Today's gain is steady rather than a spike — consistent with a durable trend.")

    unrealized_pnl = None
    value = None
    exposure_note = None
    if holding:
        value = holding.amount * current_price
        if holding.average_buy_price:
            unrealized_pnl = percent_change(current_price, holding.average_buy_price)
            if unrealized_pnl is not None and unrealized_pnl > 35 and sentiment_score >= 65:
                bump(-5, "Profit-trim (hot sentiment)")
                exposure_note = "Profit is meaningful while sentiment is hot; consider trimming risk."
            elif unrealized_pnl is not None and unrealized_pnl < -20 and score < 45:
                exposure_note = "Position is underwater and trend is weak; avoid adding without confirmation."

    score = max(0, min(100, score))
    if score >= 67:
        action = "BUY"
        stance = "Opportunity"
    elif score <= 38:
        action = "SELL" if holding else "AVOID"
        stance = "Defensive"
    else:
        action = "HOLD"
        stance = "Watch"

    if holding and exposure_note and action == "BUY":
        action = "HOLD"

    risk_level = "High" if score <= 35 or change_24h < -10 else "Medium" if score < 65 else "Controlled"
    if not risks:
        risks = [
            "Crypto prices can move faster than the indicators update.",
            "News, regulation, and liquidity shocks can invalidate the signal.",
        ]

    return {
        "id": market.get("id"),
        "pair": market.get("pair"),
        "source": market.get("source", "CoinGecko"),
        "base_asset": market.get("base_asset"),
        "quote_asset": market.get("quote_asset"),
        "symbol": str(market.get("symbol", "")).upper(),
        "name": market.get("name"),
        "image": market.get("image"),
        "current_price": current_price,
        "market_cap_rank": market.get("market_cap_rank"),
        "market_cap": market.get("market_cap"),
        "total_volume": market.get("total_volume"),
        "sparkline": (market.get("sparkline_in_7d") or {}).get("price", []),
        "change_24h": change_24h,
        "change_7d": change_7d,
        "change_30d": change_30d,
        "ma7": ma7,
        "ma30": ma30,
        "volume_change_7d": volume_change,
        "score": round(score, 1),
        "score_breakdown": {
            "base": 50,
            "components": breakdown,
            "raw": round(50 + sum(c["delta"] for c in breakdown), 1),
            "final": round(score, 1),
        },
        "action": action,
        "stance": stance,
        "risk_level": risk_level,
        "reasons": reasons[:4],
        "risks": risks[:3],
        "holding": {
            "amount": holding.amount,
            "average_buy_price": holding.average_buy_price,
            "value": value,
            "unrealized_pnl": unrealized_pnl,
            "note": exposure_note,
        }
        if holding
        else None,
    }


def build_binance_market_brief(
    assets: list[str],
    holdings: list[Holding] | None = None,
    quote_asset: str = "USDT",
) -> dict[str, Any]:
    holdings = holdings or []
    holding_map = {infer_binance_symbol(holding.coin_id, quote_asset): holding for holding in holdings}
    holding_symbols = [infer_binance_symbol(holding.coin_id, quote_asset) for holding in holdings]
    symbols = normalize_binance_symbols(assets + holding_symbols, quote_asset)
    sentiment = get_fear_greed()
    analyses = []
    errors = []

    for symbol in symbols:
        try:
            ticker = get_binance_24hr(symbol)
            klines = get_binance_klines(symbol)
            market = binance_ticker_to_market(ticker, klines, quote_asset)
            chart = binance_klines_to_chart(klines)
            row = analyze_asset(market, chart, sentiment, holding_map.get(symbol))
            analyses.append(row)
            time.sleep(0.08)
        except Exception as exc:
            errors.append({"symbol": symbol, "error": str(exc)})

    if not analyses and errors:
        raise DataFetchError("; ".join(f"{row['symbol']}: {row['error']}" for row in errors))

    opportunities = sorted(analyses, key=lambda row: row["score"], reverse=True)
    portfolio = [row for row in analyses if row.get("holding")]
    return {
        "generated_at": _now_iso(),
        "market_source": "binance",
        "exchange_label": "Binance Spot",
        "quote_asset": quote_asset.upper(),
        "sentiment": sentiment,
        "global": get_global_market(),
        "trending": get_trending(),
        "assets": analyses,
        "opportunities": opportunities,
        "portfolio": portfolio,
        "news": get_news(),
        "errors": errors,
        "disclaimer": (
            "Signals use Binance Spot market data plus public sentiment/news. "
            "They are decision-support heuristics, not financial advice."
        ),
    }


def build_market_brief(
    asset_ids: list[str],
    holdings: list[Holding] | None = None,
    market_source: str = "coingecko",
    quote_asset: str = "USDT",
) -> dict[str, Any]:
    if market_source.lower() == "binance":
        return build_binance_market_brief(asset_ids, holdings, quote_asset)

    holdings = holdings or []
    holding_map = {holding.coin_id: holding for holding in holdings}
    combined_assets = normalize_asset_ids(asset_ids + [holding.coin_id for holding in holdings])
    sentiment = get_fear_greed()
    # Fetch before the per-asset chart loop drains the CoinGecko rate budget.
    global_market = get_global_market()
    markets = get_market_prices(combined_assets)
    analyses = []

    for market in markets:
        coin_id = market.get("id")
        chart = None
        try:
            chart = get_market_chart(coin_id)
            time.sleep(0.12)
        except Exception:
            chart = None
        analyses.append(analyze_asset(market, chart, sentiment, holding_map.get(coin_id)))

    opportunities = sorted(analyses, key=lambda row: row["score"], reverse=True)
    portfolio = [row for row in analyses if row.get("holding")]
    return {
        "generated_at": _now_iso(),
        "market_source": "coingecko",
        "exchange_label": "CoinGecko",
        "quote_asset": "USD",
        "sentiment": sentiment,
        "global": global_market,
        "trending": get_trending(),
        "assets": analyses,
        "opportunities": opportunities,
        "portfolio": portfolio,
        "news": get_news(),
        "disclaimer": (
            "Signals are decision-support heuristics, not financial advice. "
            "Use position sizing, stop losses, and your own research."
        ),
    }
