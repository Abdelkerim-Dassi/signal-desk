# Build Status — AI Crypto Advisor

_Living progress doc for the 1-week rebuild. Original plan: `.claude/plans/take-a-look-at-magical-hellman.md`._

**Last updated:** 2026-06-19
**Goal:** Public, attractive, simple hybrid app — heuristic engine scores; an LLM writes the briefing + chat. React/Vite UI. Deployed on Vercel.

---

## Current state — deployed to production on Vercel

**2026-06-12 health check:** full pass re-verified — server boots clean, `/api/status`, `/api/analyze` (live data), dashboard + bundles, and `/api/ai/briefing` all working. Fixed a bug where the `global` market stats came back null: one brief rebuild fires ~9 CoinGecko calls and the free tier rate-limited the `/global` call. `_get_json` now retries on 429/5xx, and `get_global_market` is fetched before the chart loop and memoized for 5 min (serves last-known-good on failure). Also removed stray `cls`/`git` files from the repo root.

Run locally:
```powershell
python -m uvicorn server.main:app --reload --port 8000
# open http://127.0.0.1:8000  (serves the new React dashboard from frontend/dist)
```

### Endpoints
| Method | Path | Status |
|---|---|---|
| GET | `/api/status` | ✅ done — notifications + `ai_enabled` |
| POST | `/api/analyze` | ✅ done — heuristic brief, cached, live-tested |
| GET | `/api/brief` | ✅ done — query-param variant |
| POST | `/api/notify` | ✅ done — Discord/Twilio, degrades gracefully |
| POST | `/api/ai/briefing` | ✅ done — **live-tested on Vercel prod** (Groq `llama-3.3-70b-versatile`) |
| POST | `/api/ai/chat` | ✅ done (streaming SSE) — **live-tested** (22 chunks streamed) |

## Day-by-day progress

- **Day 1 — FastAPI shell** ✅ DONE & VERIFIED (live CoinGecko data; cache 3.8s → 55ms).
- **Day 2 — Deploy artifacts** ✅ Dockerfile/render.yaml/.env.example done; deploy deferred to end.
- **Day 3 — Claude briefing + caching** ✅ code done (`server/ai.py`, narrative cache, prompt cache). ⏳ live test blocked on API key.
- **Day 4 — React dashboard** ✅ **DONE & VERIFIED.** `frontend/` — Vite + React + TS + Tailwind v4 + React Query + Recharts. Dark "SignalDesk" terminal UI: stats, fear/greed gauge, signal cards + sparklines, portfolio form/cards, trending, news, alerts. Screenshot-verified on live data, zero console errors.
- **Day 5 — AI panel + streaming chat** ✅ **DONE.** `/api/ai/chat` (SSE) + `AiBriefing` (throttled ≥5 min client-side) + `ChatPanel` (streaming, grounded). Panels hide cleanly when `ai_enabled` is false (verified).
- **Day 6 — Single-service prod build** ✅ multi-stage Dockerfile (node build → python runtime). FastAPI serving `frontend/dist` verified locally. ⏳ `docker build` not run — Docker isn't installed on this machine.
- **Day 7 — Harden** ✅ per-IP rate limiter on `/api/ai/*` (20 req / 5 min, X-Forwarded-For aware), error/empty/loading states in the UI, README rewritten.

---

## Deployed ✅ — live on Vercel

- **Live:** https://signal-desk-psi.vercel.app (Vercel project `signal-desk`).
- **AI provider:** **Groq** (free, `llama-3.3-70b-versatile`) via the OpenAI-compatible path. `GROQ_API_KEY` is set in Vercel production; the paid `OPENAI_API_KEY` was removed. Precedence is `ANTHROPIC_API_KEY` > `GROQ_API_KEY` > `OPENAI_API_KEY`, so adding an Anthropic key later switches to Claude automatically.
- **Usage limits:** free provider ⇒ daily/global spend caps default to 0 (off). `AI_RATE_LIMIT=20` is set in Vercel as a per-IP burst guard so a traffic spike can't trip Groq's own free-tier per-minute limits.
- **State:** Upstash Redis (KV_* / REDIS_URL) is connected, so the rate limit + narrative cache hold across serverless instances.

⚠️ **Rotate the Groq key** — it was shared in chat. Regenerate at console.groq.com/keys, then `vercel env rm GROQ_API_KEY production -y && vercel env add GROQ_API_KEY production && vercel --prod`. Also disable the old OpenAI key in the OpenAI dashboard.

> Alternate host (Render) is still wired via `render.yaml` + Docker if a persistent process is ever preferred.

## Key decisions
- **Deploy host:** Vercel (serverless) with Upstash Redis for shared state. Render/Docker remains available as a persistent-process alternative.
- **AI provider:** Groq free tier — no per-call cost, so the spend guards are off by default; a burst rate limit is the only active throttle.
- **AI cost control:** the LLM is never called on the 2-min poll; narrative cache (~5 min, keyed on signals); client throttle on the briefing button; per-IP burst rate limit.
- **Market source:** Binance is geo-blocked (451) on many cloud IPs — public deploy defaults to CoinGecko.
- **UI:** "SignalDesk" — Chakra Petch + IBM Plex Mono, dark glass panels, teal accent.
