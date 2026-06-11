# Build Status — AI Crypto Advisor

_Living progress doc for the 1-week rebuild. Original plan: `.claude/plans/take-a-look-at-magical-hellman.md`._

**Last updated:** 2026-06-11
**Goal:** Public, attractive, simple hybrid app — heuristic engine scores; Claude writes the briefing + chat. React/Vite UI. Deploy at the **end** of the build.

---

## Current state — code complete, verified locally

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
2. **Deploy:** push to GitHub → Render → New → Blueprint → connect repo → set the AI key env var(s). (Docker build runs on Render; to test the image locally first, install Docker Desktop and run `docker build -t advisor . && docker run -p 8000:8000 advisor`.)

## Key decisions
- **Deploy host:** Render (free) via Docker. Binance is geo-blocked (451) on many cloud IPs — public deploy should default to CoinGecko; Fly.io if hosted Binance access is required.
- **AI cost control:** Claude never called on the 2-min poll; narrative cache (~5 min, keyed on signals); client throttle on the briefing button; per-IP rate limit.
- **UI:** "SignalDesk" — Chakra Petch + IBM Plex Mono, dark glass panels, teal accent.
