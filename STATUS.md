# Build Status — AI Crypto Advisor

_Living progress doc for the 1-week rebuild. Original plan: `.claude/plans/take-a-look-at-magical-hellman.md`._

**Last updated:** 2026-06-12
**Goal:** Public, attractive, simple hybrid app — heuristic engine scores; Claude writes the briefing + chat. React/Vite UI. Deploy at the **end** of the build.

---

## Current state — code complete, verified locally

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
| POST | `/api/ai/briefing` | ✅ done + rate-limited — **live-tested** (OpenAI fallback; 2nd call cache-hit in 30ms) |
| POST | `/api/ai/chat` | ✅ done (streaming SSE) + rate-limited — **live-tested** (22 chunks streamed) |

## Day-by-day progress

- **Day 1 — FastAPI shell** ✅ DONE & VERIFIED (live CoinGecko data; cache 3.8s → 55ms).
- **Day 2 — Deploy artifacts** ✅ Dockerfile/render.yaml/.env.example done; deploy deferred to end.
- **Day 3 — Claude briefing + caching** ✅ code done (`server/ai.py`, narrative cache, prompt cache). ⏳ live test blocked on API key.
- **Day 4 — React dashboard** ✅ **DONE & VERIFIED.** `frontend/` — Vite + React + TS + Tailwind v4 + React Query + Recharts. Dark "SignalDesk" terminal UI: stats, fear/greed gauge, signal cards + sparklines, portfolio form/cards, trending, news, alerts. Screenshot-verified on live data, zero console errors.
- **Day 5 — AI panel + streaming chat** ✅ **DONE.** `/api/ai/chat` (SSE) + `AiBriefing` (throttled ≥5 min client-side) + `ChatPanel` (streaming, grounded). Panels hide cleanly when `ai_enabled` is false (verified).
- **Day 6 — Single-service prod build** ✅ multi-stage Dockerfile (node build → python runtime). FastAPI serving `frontend/dist` verified locally. ⏳ `docker build` not run — Docker isn't installed on this machine.
- **Day 7 — Harden** ✅ per-IP rate limiter on `/api/ai/*` (20 req / 5 min, X-Forwarded-For aware), error/empty/loading states in the UI, README rewritten.

---

## 👉 Remaining — needs you (resume here)

1. **AI is live** via `OPENAI_API_KEY` in `.env` (gpt-4o-mini fallback in `server/ai.py`). Add `ANTHROPIC_API_KEY` later to switch to Claude — Anthropic is preferred automatically when both are set. ⚠️ The OpenAI key was shared in chat — rotate it when convenient.
2. **Deploy:** two options wired up —
   - **Render (recommended):** push to GitHub → Render → New → Blueprint → connect repo → set the AI key env var(s). Persistent process, so the caches + rate limiter work as designed. (Docker build runs on Render; to test locally first, install Docker Desktop and run `docker build -t advisor . && docker run -p 8000:8000 advisor`.)
   - **Vercel:** `vercel.json` + `api/index.py` added. `npm i -g vercel`, `vercel`, `vercel --prod`, then add env vars. ⚠️ Serverless = caches/rate-limiter don't persist; the AI rate limit no longer caps spend on a public URL. Fine for a demo; use Upstash Redis for shared state under real traffic. See README "Deploy (Vercel)".

## Key decisions
- **Deploy host:** Render (free) via Docker. Binance is geo-blocked (451) on many cloud IPs — public deploy should default to CoinGecko; Fly.io if hosted Binance access is required.
- **AI cost control:** Claude never called on the 2-min poll; narrative cache (~5 min, keyed on signals); client throttle on the briefing button; per-IP rate limit.
- **UI:** "SignalDesk" — Chakra Petch + IBM Plex Mono, dark glass panels, teal accent.
