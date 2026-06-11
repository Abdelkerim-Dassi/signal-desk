# Manual Test Plan — SignalDesk (AI Crypto Advisor)

Full acceptance pass, ~20 minutes. Work top to bottom; each step says what to do and what you should see. **Pass criteria:** every "Expect" holds and the browser console stays free of red errors throughout.

> Known flake: CoinGecko rate-limits (HTTP 429) under aggressive refreshing. It shows as a temporary "update failed" in the header and recovers on its own — upstream, not a bug.

## 0. Setup

```powershell
cd "C:\Users\Abdelkerim Dassi\OneDrive\Desktop\ai crypto advisor"
python -m uvicorn server.main:app --port 8000
```

Open **http://127.0.0.1:8000**.

## 1. First load & live data

| # | Do | Expect |
|---|---|---|
| 1.1 | Open the page | Dark "SIGNALDESK" dashboard fades in with staggered panels. No white flash, no broken layout |
| 1.2 | Look at the 4 stat cards | Real numbers: Fear/Greed score, global market cap (~trillions), BTC dominance %, watchlist count = 2 |
| 1.3 | Look at the gauge | Needle position matches the Fear/Greed score (low score = needle left/red) |
| 1.4 | Ranked signals | INJ and OG cards with price, sparkline, BUY/SELL/HOLD/AVOID pill, score/risk, reason chips |
| 1.5 | Header freshness text | "updated HH:MM · next 1m 59s" counting down each second |
| 1.6 | Press F12 → Console | **Zero red errors** (pass/fail gate) |

## 2. Live refresh & controls

| # | Do | Expect |
|---|---|---|
| 2.1 | Click **refresh** | Button says "syncing…", freshness says "refreshing live data…", then data updates |
| 2.2 | Change interval to **1 min** | Countdown restarts from ~1m; wait it out → data refreshes by itself |
| 2.3 | Toggle **live** off | Green dot stops pulsing, freshness says "live off", no auto-refresh happens |
| 2.4 | Toggle live back on | Countdown resumes |

## 3. Sources & watchlist

| # | Do | Expect |
|---|---|---|
| 3.1 | In Watchlist panel, switch source to **CoinGecko** | Assets auto-swap to `injective-protocol, og-fan-token`, data reloads (logos may appear) |
| 3.2 | Type `bitcoin, ethereum, solana` in assets, wait ~1s | BTC/ETH/SOL signal cards appear (the form debounces 0.7s after you stop typing — no refetch per keystroke) |
| 3.3 | Switch back to **Binance Spot** | Assets auto-swap back to `INJUSDT, OGUSDT` |
| 3.4 | Type garbage like `xxxnotacoinxxx` | App doesn't crash — empty/partial results or a yellow error note, dashboard stays usable |

## 4. Portfolio

| # | Do | Expect |
|---|---|---|
| 4.1 | In holdings, set INJUSDT amount = `100`, avg buy = `50` | A portfolio card appears: value, **PnL** (red/negative if INJ < $50), score, signal pill, and a note |
| 4.2 | Set avg buy to something below current price | PnL turns green/positive |
| 4.3 | Click **×** on a holding row | Row disappears, its portfolio card goes away |
| 4.4 | Click **+ add holding**, leave it empty | No crash, empty rows are ignored |

## 5. AI briefing (costs ~1 cent per fresh run)

| # | Do | Expect |
|---|---|---|
| 5.1 | Click **generate** in AI briefing | "Reading the market data▋" then a formatted briefing: Market Pulse, Top Opportunities, Risks, ending with "Not financial advice" |
| 5.2 | Sanity-check the content | Mentions only coins on your watchlist and matches the actual Fear/Greed value — **no invented coins or prices** |
| 5.3 | Click **regenerate** immediately | Yellow "Throttled — try again in Ns" message (5-min client throttle). Does **not** spend money |
| 5.4 | With holdings set (from §4), wait out the throttle and regenerate | Briefing now includes a "Your Positions" section |

## 6. Chat ("Ask the desk")

| # | Do | Expect |
|---|---|---|
| 6.1 | Ask: *"is the market fearful or greedy right now?"* | Answer **streams in word by word** with a blinking ▋, cites the actual Fear/Greed score |
| 6.2 | Follow up: *"and what does that mean for my watchlist?"* | Remembers context, answers about your actual coins |
| 6.3 | Ask: *"what's the price of Dogecoin?"* (not on watchlist) | Says the data doesn't cover that — **doesn't invent a price** |
| 6.4 | Ask: *"should I put my life savings into OG?"* | Risk-aware pushback + decision-support disclaimer, not "yes" |

## 7. Rate limit (abuse protection)

In PowerShell, with the server running:

```powershell
1..25 | ForEach-Object { try { (Invoke-WebRequest -UseBasicParsing -Method POST -ContentType 'application/json' -Body '{"question":"hi","brief":null}' http://127.0.0.1:8000/api/ai/chat).StatusCode } catch { $_.Exception.Response.StatusCode.value__ } }
```

**Expect:** a run of `200`s, then `429`s from call #21 onward (20 calls / 5 min / IP). Wait 5 minutes → works again.

## 8. Graceful degradation

| # | Do | Expect |
|---|---|---|
| 8.1 | Stop the server (Ctrl+C), rename `.env` to `.env.bak`, restart, reload page | Dashboard fully works; **AI briefing and chat panels are gone** (not broken — gone) |
| 8.2 | `POST /api/ai/briefing` in that state | `503` with "AI is not configured" |
| 8.3 | Rename `.env` back, restart | AI panels reappear |
| 8.4 | Disconnect Wi-Fi, click refresh | Red "update failed · …" in header, old data stays on screen, no crash; reconnect → recovers on next refresh |

## 9. Alerts (only if Discord/Twilio vars are set)

| # | Do | Expect |
|---|---|---|
| 9.1 | Alerts panel without config | Both channels say "not set"; sending shows "No alert channel is configured yet." |
| 9.2 | With `DISCORD_WEBHOOK_URL` in `.env` + restart | Discord says "ready"; check it + send → toast "Alert sent to 1 channel(s)" and the message lands in your Discord |

## 10. Mobile & polish

| # | Do | Expect |
|---|---|---|
| 10.1 | F12 → device toolbar → iPhone width | Single column, nothing overflows horizontally, signal cards collapse to 2-column grid |
| 10.2 | Click a headline | Article opens in a new tab |
| 10.3 | Zoom to 80% on desktop | Two-column layout: signals left, gauge/AI/portfolio right |

---

If a step fails, note the step number and what you saw instead.
