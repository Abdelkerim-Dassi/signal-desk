# AI Crypto Advisor — SignalDesk

A hybrid crypto decision-support app: a fast, free **rule-based engine** scores each coin 0–100 and rates its setup STRONG / NEUTRAL / WEAK from live market data (gated by a BTC 200-day market regime), and **Claude** turns those numbers into a readable market briefing plus a grounded chat. React dashboard, FastAPI backend, one deployable service.

Decision support, not financial advice.

## Architecture

```
frontend/            React + Vite + TS + Tailwind + React Query + Recharts (dark terminal UI)
server/
  main.py            FastAPI — API routes + serves frontend/dist
  ai.py              Claude briefing (cached) + streaming chat (SSE), claude-opus-4-8
  cache.py           TTL caches: market briefs (~75s), AI narratives (~5min)
  ratelimit.py       per-IP rate limit on the AI endpoints
advisor_engine.py    rule-based scoring engine (Binance/CoinGecko, Fear & Greed, BTC regime, news)
server/track_record.py  daily immutable log of ratings for 18 coins + forward-return summary
scripts/backtest.py  replays the engine on 2021–present history → server/data/backtest.json
notifications.py     Discord webhook + Twilio WhatsApp alerts
```

The 2-minute dashboard poll only ever hits the free heuristic endpoint. Claude is called exclusively on explicit user action (generate briefing / chat), with a narrative cache so near-identical market snapshots never trigger repeat spend.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/status` | notification channels + `ai_enabled` |
| POST | `/api/analyze` | heuristic brief (cached, free, polled) |
| GET | `/api/brief` | query-param variant |
| POST | `/api/ai/briefing` | Claude narrative over a brief (rate-limited) |
| POST | `/api/ai/chat` | streaming SSE chat grounded in the brief (rate-limited) |
| POST | `/api/notify` | send Discord/WhatsApp alert |
| GET | `/api/track-record` | live log summary + backtest (logs today's snapshot if missing) |
| GET | `/api/cron/snapshot` | daily snapshot trigger (Vercel Cron, 00:05 UTC; `CRON_SECRET` bearer if set) |

## Ratings, regime and track record

- **Ratings** describe a coin's setup, not an instruction: score ≥67 STRONG, ≤38 WEAK, NEUTRAL between. The score depends only on market data — never on a user's holdings — so every user sees the same rating.
- **Market regime:** when BTC is below its 200-day average (risk-off), every score is capped at 66, so nothing rates STRONG. The backtest showed STRONG setups only beat the market in risk-on conditions.
- **Track record:** each UTC day the same 18 coins are scored and written once (set-if-absent) to Upstash Redis, or to `data/track_record.sqlite3` locally (`TRACK_DB_PATH` overrides). 7/30-day results are computed from the logged prices only.
- **Backtest:** `python scripts/backtest.py` regenerates `server/data/backtest.json` through the engine's own code path. Rerun it after changing any scoring rule.

## Run locally

```powershell
pip install -r requirements.txt
python -m uvicorn server.main:app --reload --port 8000
# open http://127.0.0.1:8000  (serves frontend/dist once it's built — see below)
```

Frontend development with hot reload (proxies `/api` to :8000):

```powershell
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # writes frontend/dist, which FastAPI serves at /
```

## Enable the AI features

Create a `.env` in the project root (gitignored, auto-loaded). Set **one** provider key:

```
GROQ_API_KEY=gsk_...        # free, recommended — console.groq.com/keys
# ANTHROPIC_API_KEY=sk-ant-...   # paid alternative, used first if set
```

Precedence is `ANTHROPIC_API_KEY` > `GROQ_API_KEY` > `OPENAI_API_KEY`. With Groq the base URL and model (`llama-3.3-70b-versatile`) default automatically. Without any key the app still works fully on the heuristic engine — the AI panels simply hide.

## AI usage limits

The default provider (Groq) is free, so the spend guards ship **disabled** (`0` = unlimited). They exist to defend a *paid* key (Anthropic/OpenAI) — set any layer to a positive number to re-enable it. All are env-tunable; defaults in `.env.example`:

| Control | Default | What it does |
|---|---|---|
| `AI_RATE_LIMIT` / `AI_RATE_WINDOW` | 0 (off) / 300s | per-IP burst cap on AI calls |
| `AI_DAILY_IP_LIMIT` | 0 (off) | each visitor's AI allowance per UTC day |
| `AI_DAILY_LIMIT` | 0 (off) | **global** hard ceiling on AI calls per UTC day |
| narrative cache | 5 min | near-identical briefs reuse the last narrative for free |
| `ANTHROPIC_MODEL` | `claude-opus-4-8` | (paid path only) swap to `claude-haiku-4-5` for ~5× cheaper briefings |

On a **persistent host (Render)** any enabled limit works out of the box. On **serverless (Vercel)** the counters and cache reset per instance, so set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (Upstash free tier; on Vercel install it from the Marketplace and the vars are injected) to back them with shared Redis state. Without Redis the guards still run, but only per-instance.

Note: Groq's free tier has its own per-minute rate limits — if a traffic burst trips them, set `AI_RATE_LIMIT` to a modest number (e.g. `20`) to smooth bursts without capping normal use.

## Optional alerts

```
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+216...
```

## Market sources

Defaults to **Binance Spot** with the `INJUSDT, OGUSDT` watchlist; also accepts CoinGecko IDs (`injective-protocol`, `og-fan-token`) and can switch to CoinGecko entirely. Public market data only — no trading, no account access.

> Note: Binance geo-blocks many cloud-provider IPs (HTTP 451). On a public deploy, prefer the CoinGecko source; Binance works fully when running locally.

CoinGecko's free tier rate-limits bursts: requests retry on 429/5xx with backoff, and the global market stats are memoized for 5 minutes (last-known-good is served if a refresh fails), so one brief rebuild stays within budget.

## Deploy (Render)

`render.yaml` + the multi-stage `Dockerfile` build the frontend and run uvicorn as one **persistent** service — the in-process brief/narrative caches and the AI rate limiter all work as designed. This is the recommended host.

1. Push the repo to GitHub.
2. Render → New → Blueprint → connect the repo.
3. Set `GROQ_API_KEY` (or `ANTHROPIC_API_KEY`) and optional Discord/Twilio vars in the service's Environment.

## Deploy (Vercel)

`vercel.json` builds the front-end to a static CDN deploy and runs the FastAPI app as a serverless function (`api/index.py`) handling `/api/*`.

1. Push the repo to GitHub.
2. `npm i -g vercel`, then `vercel` (links the project) and `vercel --prod` to deploy. (Or import the repo in the Vercel dashboard — the build settings come from `vercel.json`.)
3. Set env vars: `vercel env add GROQ_API_KEY production` (plus any `DISCORD_WEBHOOK_URL` / `TWILIO_*`), then redeploy. Remove any old `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` you no longer want billed: `vercel env rm OPENAI_API_KEY production`.

> ⚠️ **Serverless caveat.** Vercel functions are stateless, so the `brief_cache` and `narrative_cache` do **not** persist across invocations — meaning more CoinGecko calls (closer to rate limits) and more repeat generations. With the free Groq provider this only costs latency, not money. Back the caches/limits with a shared store (e.g. [Upstash Redis](https://upstash.com/)) for a smoother experience, or use the Render deploy above.

## CLI prompt mode

```powershell
python ai_crypto_advisor.py   # writes ai_prompt.txt for manual LLM pasting
```

## Testing

A full manual acceptance pass (~20 min) lives in [`docs/TESTING.md`](docs/TESTING.md) — covers live data, refresh controls, portfolio P&L, AI briefing/chat grounding, rate limiting, and graceful degradation.

## Signal logic

Price vs 7/30-day moving averages, 24h/7d/30d returns, volume confirmation, Fear & Greed extremes, and portfolio context (unrealized P&L when an average buy price is given). An MVP scoring model — backtest before trusting it with money.
