# AI Crypto Advisor — SignalDesk

A hybrid crypto decision-support app: a fast, free **heuristic engine** ranks BUY / SELL / HOLD / AVOID signals from live market data, and **Claude** turns those numbers into a readable market briefing plus a grounded chat. React dashboard, FastAPI backend, one deployable service.

Decision support, not financial advice.

## Architecture

```
frontend/            React + Vite + TS + Tailwind + React Query + Recharts (dark terminal UI)
server/
  main.py            FastAPI — API routes + serves frontend/dist (falls back to web/)
  ai.py              Claude briefing (cached) + streaming chat (SSE), claude-opus-4-8
  cache.py           TTL caches: market briefs (~75s), AI narratives (~5min)
  ratelimit.py       per-IP rate limit on the AI endpoints
advisor_engine.py    heuristic scoring engine (Binance/CoinGecko, Fear & Greed, news)
notifications.py     Discord webhook + Twilio WhatsApp alerts
web/                 legacy vanilla UI (fallback only)
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

## Run locally

```powershell
pip install -r requirements.txt
python -m uvicorn server.main:app --reload --port 8000
# open http://127.0.0.1:8000  (serves frontend/dist if built, else the legacy web/ UI)
```

Frontend development with hot reload (proxies `/api` to :8000):

```powershell
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # writes frontend/dist, which FastAPI serves at /
```

## Enable the AI features

Create a `.env` in the project root (gitignored, auto-loaded):

```
ANTHROPIC_API_KEY=sk-ant-...
```

Without a key the app still works fully on the heuristic engine — the AI panels simply hide.

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
3. Set `ANTHROPIC_API_KEY` (and optional Discord/Twilio vars) in the service's Environment.

## Deploy (Vercel)

`vercel.json` builds the front-end to a static CDN deploy and runs the FastAPI app as a serverless function (`api/index.py`) handling `/api/*`.

1. Push the repo to GitHub.
2. `npm i -g vercel`, then `vercel` (links the project) and `vercel --prod` to deploy. (Or import the repo in the Vercel dashboard — the build settings come from `vercel.json`.)
3. Set env vars: `vercel env add ANTHROPIC_API_KEY production` (repeat for `OPENAI_API_KEY` and any `DISCORD_WEBHOOK_URL` / `TWILIO_*`), then redeploy.

> ⚠️ **Serverless caveat.** Vercel functions are stateless, so the `brief_cache`, `narrative_cache`, and the per-IP `ai_limiter` do **not** persist across invocations. Consequences: more CoinGecko calls (closer to rate limits), more repeat **paid** Claude generations, and — most importantly — the AI rate limit no longer caps spend on a public URL. Fine for a low-traffic demo. For real traffic, back these with a shared store (e.g. [Upstash Redis](https://upstash.com/)) or use the Render deploy above, which keeps all three guarantees.

## CLI prompt mode

```powershell
python ai_crypto_advisor.py   # writes ai_prompt.txt for manual LLM pasting
```

## Testing

A full manual acceptance pass (~20 min) lives in [`docs/TESTING.md`](docs/TESTING.md) — covers live data, refresh controls, portfolio P&L, AI briefing/chat grounding, rate limiting, and graceful degradation.

## Signal logic

Price vs 7/30-day moving averages, 24h/7d/30d returns, volume confirmation, Fear & Greed extremes, and portfolio context (unrealized P&L when an average buy price is given). An MVP scoring model — backtest before trusting it with money.
