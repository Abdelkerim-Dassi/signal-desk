# Qirat product research and proposal: November 2026

_Prepared 2026-11-08 for Abdelkerim. Status: **proposal, nothing built yet.** Product code changes wait for your choice of phase._

Full research notes with every source URL are in [`research-2026-11/`](research-2026-11/):
[A: trackers and rating apps](research-2026-11/A-trackers-ratings.md) ·
[B: exchange AI, bots, copy trading](research-2026-11/B-exchange-ai-bots.md) ·
[C: evidence on AI trading](research-2026-11/C-llm-trading-evidence.md) ·
[D: Tunisian law, data and AI costs](research-2026-11/D-legal-costs.md) ·
[E: Tunisia and MENA beginner needs](research-2026-11/E-mena-needs.md).
This document cites the key sources inline; the notes hold the rest.

> **Not legal or financial advice.** The legal section is desk research from public sources; a Tunisian fintech lawyer must confirm it before Qirat charges money or adds anything beyond education.

---

## 0. The short version

**Your idea:** accounts where users enter what they hold (or hand Qirat $10), and a team of AI agents that watch the market, research coins, follow news and politics, and give buy/sell actions at 24 hours, 1 week and 1 month, aiming for about 90% good trades.

**What the research says:**

1. **No system anywhere gets close to 90% good trades.** Live tests of AI traders ([C §1–2](research-2026-11/C-llm-trading-evidence.md)):
   - In nof1's Alpha Arena (real money, Oct–Nov 2025), 4 of 6 top AI models lost 42–59% in 17 days, and all six won only 25–30% of their trades ([Protos](https://protos.com/llm-crypto-trading-contest-finds-llms-cant-trade-crypto), [Forklog](https://forklog.com/en/four-out-of-six-ai-models-suffer-losses-in-trading-tournament/)).
   - A Sept 2026 study of 500+ real-money AI agents found a 41% win rate and no edge ([arXiv 2609.05663](https://arxiv.org/abs/2609.05663)).
   - The strongest academic AI-news signal is right 55–58% of the time, decayed within 2.5 years and stops making money at retail fees ([Lopez-Lira & Tang](https://arxiv.org/html/2304.07619v6)).
   - The papers that show huge results tested on dates the AI had already seen in training, so the AI partly "remembered" the answers ([Profit Mirage](https://arxiv.org/html/2510.07920v1)).
2. **Where 90% figures appear, they hide something:** either the AI is remembering the past, the move happens too fast to trade, or the strategy wins small often and loses big rarely (grid and martingale bots, short-volatility funds that lost 80–96% in a day).
3. **"Trade my $10 for me" is the most dangerous idea legally and for the brand.**
   - In Tunisia it combines four regulated things: buying crypto for residents (foreign-exchange law), managing other people's money, holding funds, and anti-money-laundering duties ([D §0, §1](research-2026-11/D-legal-costs.md)).
   - On 28 Oct 2026 the CMF named an unlicensed firm for exactly "portfolio management presented as investment advice" on social media ([L'Économiste Maghrébin](https://www.leconomistemaghrebin.com/2026/10/28/cmf-attention-aux-arnaques-dinvestissement-sur-les-reseaux-sociaux/)).
   - "Give us money, our AI trades it" is also the exact script regulators describe as the top crypto scam ([CFTC](https://www.cftc.gov/LearnandProtect/AdvisoriesAndArticles/AITradingBots.html), [SEC case, Sept 2026](https://www.crowdfundinsider.com/2026/09/314375-sec-alleges-that-whatsapp-group-chats-and-fake-filings-were-used-in-15m-crypto-ai-scams/)).
4. **The big exchanges already sell "chat with AI, it trades for you"**: Binance Ai Pro ($9.99–29.99/mo), Bybit AI, Bitget GetAgent/GetClaw, Coinbase for Agents. None publishes how its users do, none speaks Darija, and all of them leave 100% of losses on the user ([B §1](research-2026-11/B-exchange-ai-bots.md)). Qirat cannot win that race and shouldn't try.

**What Qirat can win instead.** The open lane is the *calm, neutral, Darija-speaking guide that protects beginners*:

- **Scam check** in Darija: paste a WhatsApp pitch, a link, a token or a platform name and get red flags. No competitor among the 20+ we checked does this.
- **"My money" in dinars:** a risk check of your own coins, priced in TND.
- **Practice with $10:** a paper-money wallet with a coach that points out your FOMO habits.
- **A Darija coach** and a short daily "what happened and why".

Behind these sits an agent system that *explains and protects* while plain, testable rules *decide and measure*. Any trading strategy gets a private paper-trading trial with pass/fail gates before it is ever shown to anyone.

**The honest target**, if a strategy is ever shown: not "90% wins" but *better risk-adjusted results than simply holding Bitcoin*. That means smaller drawdowns, a similar or better Sharpe ratio, and probabilities that prove accurate (when it says 60%, it happens about 60% of the time).

---

## 1. What Qirat gives today

Reviewed 2026-11-08 by reading `advisor_engine.py`, `server/` and `frontend/src/`, and by using https://qirat.tn (Today, Ask, Portfolio, Track record).

| # | Feature | Where | How good (evidence) | Gaps for a beginner | Gaps for a pro trader |
|---|---|---|---|---|---|
| 1 | **Market weather** (calm / choppy / stormy) with a plain sentence | `advisor_engine.weather_from`, `TodayHero` | Good. Built on the one regime signal that held up in our own study: BTC above vs below its 50-day line, median next 30 days +3.0% vs −2.1%. Live today: "choppy, BTC 7.4% below its 50-day". | Says what the market *is*, not what a careful person *does* in that weather (a personal checklist such as "no new buys in a storm"). | No history of weather states, breadth or liquidity data. Funding rates are used only internally. |
| 2 | **Karat grade** 24K–10K per coin | `grade_from_inputs` | Honest but modest edge: rank IC +0.09 at 7 days, chosen after seeing the data. It is relative to 18 coins, so in a storm 24K coins still fall. | "22K" sounds like quality or safety, and is easy to read as "buy". | No screener across the whole market, no factor export, no API. |
| 3 | **Risk grade** (low / medium / high) and "rough month on 100 TND" | same, plus coin detail | The strongest part: past volatility predicts next-month volatility (IC 0.63, right in every month tested). The TND framing is excellent. | "Low risk" means *low for crypto*: BTC at "low risk" can still lose 30% in a month. | No drawdown history, correlations or position-size maths. |
| 4 | **Coin list and candle chart** | `CoinList`, `CandleChart` | Clean. The default list is only BTC/ETH/SOL. | Prices in USDT, not TND. | Too thin for analysis. |
| 5 | **What's moving**: headlines and CoinGecko trending searches | `MarketMoves`, `get_news`, `get_trending` | Headlines are English RSS. Today's "trending" showed micro-caps ranked #856 and #402. | English only. Trending micro-caps are a FOMO feed, the opposite of the calm brand. | Generic; available everywhere. |
| 6 | **Ask Qirat**: AI briefing and grounded chat, no-advice rule, EN/FR/Arabic | `server/ai.py`, `AskView` | Grounding and the no-advice rule are right. A live test ("Is the market risky today?") gave a correct but long, jargon-heavy answer ("reference universe", "systemic risk"), and its markdown table rendered as raw `\|` pipes. Runs on Groq `gpt-oss-120b`. | Too long and too technical. Arabic is formal MSA, not Darija. No memory of the user's level. | Sees only today's snapshot; no research tools. |
| 7 | **Portfolio** (holdings, value, P&L) | `PortfolioView`, browser storage | Works, and holdings never change grades (keeps it impersonal). | No accounts, so data is lost on a new phone. No TND. No *portfolio-level* view: concentration, combined rough month, "what if BTC −30%". | No exchange sync, lots or taxes. |
| 8 | **Track record tab** and bot `/record` | `TrackRecord`, `track_record.summary` | The engineering is strong (immutable daily snapshots). | **It conflicts with the 2026-11-07 "no public misses" decision**: the tab still says "Every call is logged, losses included" and shows the *old* ratings. | — |
| 9 | **Telegram bot**: `/score`, `/watch`, `/market`, daily brief, rating-change alerts (2 confirmations), groups, share cards | `server/telegram_bot.py`, `server/cards.py` | Solid, multilingual; the alert debounce is good practice. | Alerts are about grade flips, not about *your* risk. No WhatsApp, though Tunisia has about 5× more WhatsApp than Telegram users. | No price alerts (deliberately). |
| 10 | **Private measurement**: daily snapshots, shadow scorecard (rank IC, top vs bottom third), owner Telegram notes | `track_record.scorecard`, `shadow.py` | The best foundation in the codebase for honest paper trading: forward-only, immutable, judged against the market. | — | — |
| 11 | **Guide and feedback** | `GuideModal`, `FeedbackModal` | Good. | No lessons, glossary or quizzes. | — |

Also observed: the first load took about 6–8 seconds ("Reading the market…") before grades appeared.

**Bottom line:** Qirat's honest core is *risk and market weather*, not picking winners. What it lacks is everything that brings a beginner back daily: an account, "my money in TND", protection from scams, a safe place to practise, and a coach that speaks their language.

---

## 2. Competitors

### 2.1 Summary

| Group | Products checked | What they offer now | Price (cheapest paid) | Arabic / French / Darija | What users complain about | What's missing for a Tunisian beginner |
|---|---|---|---|---|---|---|
| Trackers | CoinStats, Delta, CoinGecko, CoinMarketCap, Kubera | Portfolio sync; AI chat added in 2025–26 (CoinStats AI Agent, Gecko AI, CMC AI); "why is it moving?" | CoinStats $13.99/mo, CoinGecko $10/mo, CMC $11.99/mo, Delta ~$7–14/mo, Kubera $250/yr | CMC app and CoinGecko web have Arabic; French common; **no Darija** | Wrong P&L or cost basis, paywalled limits, scam listings, auto-renew billing | Calm guidance, TND, scam protection, Darija ([A](research-2026-11/A-trackers-ratings.md)) |
| Ratings and research | Token Metrics, Messari, Santiment, LunarCrush, Glassnode, TradingView | AI grades (Token Metrics), on-chain and social data, charts, paper trading (TradingView) | $13–90/mo; Messari dropped retail plans (Jun 2026); Glassnode API from ~$584/mo | Mostly English; TradingView has Arabic and French | Token Metrics: 2.4★ Trustpilot, inconsistent grades, refund fights | A **risk-first** grade for beginners; none publishes a loss-inclusive record ([A](research-2026-11/A-trackers-ratings.md)) |
| Exchange AI | Binance Ai Pro, Bitget GetAgent/GetClaw, OKX Agent Trade Kit, Bybit AI, Coinbase for Agents, Kraken MCP | Chat-to-trade agents in an isolated sub-account | Free to $29.99/mo | Arabic apps (Binance, Bitget); AI language support undocumented | No outcome data; users carry 100% of losses | Neutrality (each pushes its own products and leverage), Darija ([B](research-2026-11/B-exchange-ai-bots.md)) |
| Bots and copy trading | 3Commas, Cryptohopper, Kryll, Pionex, eToro CopyTrader, exchange copy trading | Grid, DCA and signal bots; copying "lead traders" | 3Commas $15–20/mo, Cryptohopper $29/mo, Pionex free bots + 0.05% fees, eToro $200 minimum | Little | 3Commas API-key leak (2022, ~$15–20M stolen); followers do far worse than leaders | Any honest evidence that users profit ([B](research-2026-11/B-exchange-ai-bots.md)) |
| MENA / Arabic / French | Rain, BitOasis, CoinMENA, Thndr, Baraka, Cryptoast Academy, Finary, Binance Academy × Bitcoineen, halal screeners | Licensed Gulf exchanges, guided investing (Thndr Alpha: 439k users), French courses (€497/yr), halal screeners ($5–17/mo) | see left | **MSA or English. Darija is under 10% of Tunisian crypto ads** | Halal screeners English-first and paid | Neutral Darija education, scam check, Tunisian legal clarity ([E](research-2026-11/E-mena-needs.md)) |

### 2.2 Patterns that matter
- **Every app is bolting on AI.** All of it is English-first and aimed at research or trading power. None is a calm coach in Darija ([A, patterns 1–2](research-2026-11/A-trackers-ratings.md)).
- **"Why is it moving?" is now standard** (Delta, CMC, CoinGecko). Qirat's daily brief must win on tone and language, not on the feature.
- **Nobody grades "is this safe for a beginner?"** Aggregators list 17k+ tokens and get "scam listing" complaints; graders score hype or momentum.
- **Nobody offers a scam check.** CoinMarketCap's Trustpilot (1.3★) is full of victims of fake "CoinMarketCap" callers.
- **No competitor publishes a track record that includes losses.** Regulators punish accuracy and return claims, not neutral grading: the SEC sued "Cryptoaiml" in Sept 2026 over "98% accuracy" AI signals ([InvestmentNews](https://www.investmentnews.com/regulation-legal-compliance/fake-signals-frozen-accounts-sec-sues-crypto-ai-platform-over-125m/268436)).
- **Billing anger is everywhere** (auto-renew, trials). Reminder-first, one-tap cancel billing is a cheap trust signal for Pro.

---

## 3. Unmet needs of Tunisian and MENA beginners (ranked)

Context ([E §1–2](research-2026-11/E-mena-needs.md)):
- **Adoption is growing despite the restrictions.** Tunisia jumped from 80th to 52nd in Chainalysis' 2025 adoption index, with roughly 200,000 holders.
- **Enforcement is tightening at the same time:**
  - Customs officers were trained to trace and seize crypto (Oct 2026).
  - BCT Circular 2026-10 caps e-wallet balances.
  - Scams are rising: a 6,900-victim pyramid, "cheap crypto" meetups that turned into armed robberies (Manouba, Apr 2026), and CMF warnings in Sept–Oct 2026.

| # | Need | Who serves it today | Qirat angle |
|---|---|---|---|
| 1 | **"Is this a scam?"** for platforms, WhatsApp/Telegram pitches, links, tokens and P2P counterparties, in Darija | English address/domain databases only (GoPlus, ScamSniffer, Chainabuse) | Darija red-flag checker, free APIs and a curated list of CMF/AMMC warnings. **The strongest wedge.** |
| 2 | **Safe-buying and legal-status clarity** (P2P safety, wallet caps, what the law says) | Affiliate "how to buy" pages | A living, dated "crypto and the law in Tunisia" page. No brokering, no referrals. |
| 3 | **Neutral lessons in Darija** | Exchange academies (sales funnels), signal creators | Short Darija lessons and glossary tied to live grades |
| 4 | **AI Q&A in their own language** (33% of French crypto investors already ask AI first, [AMF](https://www.amf-france.org/fr/actualites-publications/communiques/communiques-de-lamf/edition-speciale-du-barometre-amf-encore-peu-utilisee-dans-les-pratiques-dinvestissement)) | Generic chatbots without local context or guardrails | Darija/FR coach grounded in Qirat data, never giving buy/sell instructions |
| 5 | **Halal notes per coin** | HalalScreener $9.99/mo (EN/AR), Sharlife (EN) | Free notes citing screeners' views, never issuing fatwas |
| 6 | **Practice before risking money** | Exchange demo accounts (inside the exchanges) | Spot-only practice that scores *behaviour* (FOMO buys, panic sells) |
| 7 | **My holdings in dinars** | Global trackers (TND support unverified) | Manual "my coins" priced in TND at the official BCT rate |
| 8 | Freelancer and diaspora USDT guidance | Informal Telegram groups | Explainers only; facilitating it is legally risky |
| 9 | Taxes | — | Low priority while holding is restricted |

---

## 4. The agentic trading-advisor idea, done rigorously

### 4.1 What the evidence says

| Evidence | Result | Why it matters |
|---|---|---|
| **TradingAgents** (2024), **FinMem** (2023), **FinCon** (NeurIPS 2024) | Big backtest returns (Sharpe up to 8.2) over 3–8 months on 3–8 stocks | Tested before or near the AI's training cutoff, with no costs. The authors of TradingAgents say their Sharpe "exceeds expected range". |
| **CryptoTrade** (EMNLP 2024) | **Lost to simply holding** BTC and SOL in the bull market (BTC 28% vs 40%, SOL 115% vs 177%) | Even a crypto-specific agent with news and on-chain data didn't beat holding |
| **Profit Mirage** (Oct 2025) | Published agents lose **51–62% of their Sharpe** after the training cutoff; frontier models "remember" past market direction about 90% of the time | Backtesting an LLM on past dates is not evidence |
| **DeepFund** (NeurIPS 2025), **StockBench** (Oct 2025), **LiveTradeBench** (Nov 2025) | Live tests: 8 of 9 models lost money; returns from −2.8% to +2.5% vs +0.4% for holding; an AI's general leaderboard rank had **no relation** to trading results | Smarter general AI ≠ better trader |
| **Alpha Arena S1** (real money, crypto, Oct–Nov 2025) | Qwen +22%, DeepSeek +5%; Claude, Gemini, Grok and GPT-5 lost 42–59%; win rates 25–30%; fees ate over 13% of one model's capital | 17 days with leverage: the ranking is indistinguishable from luck |
| **Production fleet study** (Sept 2026) | 500+ real-money agents: 41% win rate vs 50% for ordinary retail, no edge, 5× leverage regardless of risk | The most realistic test so far |
| **Lopez-Lira & Tang** (news headlines) | 55–58% next-day hit rate; Sharpe fell from 6.5 to 1.2 in 2.5 years; unprofitable at 0.2% round-trip cost | The best AI signal on record is small, fades and dies at retail fees |
| **Academic crypto factors** | Momentum over 1–4 weeks in larger coins and trend-following hold up (before costs); low volatility is mixed; social sentiment and on-chain signals are weak out of sample; ignoring dead coins inflates backtests by about 62% a year | Matches Qirat's own finding: a low-vol + 90-day trend tilt and the BTC 50-day regime carry a small signal; the old score carried none |
| **Why bots fail** | Testing 45+ variants on 5 years of data almost guarantees a fake Sharpe of 1 ([Bailey et al.](https://carmamaths.org/jon/backtest.pdf)); across 888 Quantopian algorithms, backtest Sharpe explained under 2.5% of live Sharpe | Overfitting, costs and regime change kill most strategies |
| **Retail outcomes** | Most crypto-app users lost money on bitcoin; the median user lost $431 of $900 ([BIS 2023](https://www.bis.org/publ/bisbull69.htm)); 74–89% of leveraged retail accounts lose ([ESMA](https://www.esma.europa.eu/node/84933)); copy trading increases risk-taking ([Management Science 2020](https://econpapers.repec.org/RePEc:inm:ormnsc:v:66:y:12:i:2020:p:5608-5622)) | The default outcome for beginners who trade actively is losing |

Full table with 14 papers, links and weaknesses: [C §1](research-2026-11/C-llm-trading-evidence.md).

### 4.2 Honest targets and the right metrics

**Win rate is the wrong number.** What matters is how much you win when right vs lose when wrong:
- With winners twice the size of losers, a 34% win rate already breaks even.
- Good trend-following systems win only about 35–45% of trades.
- Strategies with 85–90% win rates are usually selling disaster insurance. One short-volatility fund had 85%+ winning months for years, then lost 96% in a single day (Feb 2018).

**Realistic numbers for a long-only, spot, beginner product:**

| Metric | Realistic | Exceptional | Not credible |
|---|---|---|---|
| Direction hit rate, 1 day | 50–55% | 56–58% before costs | 90% |
| Ranking skill (rank IC, weekly) | 0.03–0.06 | ≥ 0.08 held for a year | — |
| Sharpe after costs | 0.5–1.0 | 1.0–1.5 | > 2 sustained |
| Versus holding BTC | Similar return with a **smaller drawdown** | Sharpe +0.3 to +0.5 above BTC | "Always beats BTC" |
| Calibration | "60%" calls come true 55–65% of the time | Brier score 0.23–0.24 on a 50/50 question (0.25 = no skill) | — |

**Metrics to track** (all privately, in line with "no public misses"):
- risk-adjusted return vs buy-and-hold BTC (Sharpe, Sortino)
- maximum drawdown
- hit rate *together with* payoff ratio
- rank IC
- calibration: Brier score and a reliability chart
- turnover and costs

### 4.3 Recommended design: "rules decide; agents explain and protect"

**Principles**
1. **Numbers never come from the LLM.** Grades, risk, weather and any paper-trading decision come from deterministic, versioned code that can be backtested. LLMs read, sort, check and explain. Their confidence numbers are not trusted until calibrated against logged outcomes.
2. **Every forecast is logged before its outcome is known**: immutable, with a horizon and a probability.
3. **Impersonal by default.** Everyone sees the same grade. Personal data (holdings, the user's own rules) only changes the *risk maths and explanations*, never produces "buy X".
4. **No custody, no execution, no leverage.** Practice money only.
5. **Cheap by construction.** Plain Python jobs on the existing Vercel crons and Upstash, Claude API calls with prompt caching and the Batch API. Agent frameworks aren't needed: a deterministic pipeline beats a multi-agent loop at this budget ([C §6](research-2026-11/C-llm-trading-evidence.md)).

```
                      ┌───────────────────────── data (free tiers) ─────────────────────────┐
                      │ Binance klines · CoinGecko/CMC · Fear&Greed · DefiLlama · RSS/GDELT  │
                      │ GoPlus · ScamSniffer list · CMF/AMMC warnings (curated)              │
                      └───────────────┬───────────────────────────┬──────────────────────────┘
                                      │                           │
         ┌──────── deterministic (no LLM) ───────┐     ┌──────── LLM helpers ────────────────┐
         │ Market watch: karat, risk, weather    │     │ News & macro: tag events, write the │
         │ Risk manager: portfolio maths in TND  │     │   shared daily brief (Batch API)    │
         │ Strategy lab: paper decisions         │     │ Coin research: one-page dossier     │
         │   (1-week / 1-month horizons)         │     │ Scam checker: red flags + APIs      │
         └───────────────┬───────────────────────┘     └───────────────┬─────────────────────┘
                         │      immutable logs (Upstash, set-if-absent) │
                         └──────────────┬───────────────────────────────┘
                                        ▼
                    Coach (Darija / FR / EN) · uses the tools above
                    Web app · Telegram bot · WhatsApp channel
                    never: "buy", "sell", "now", "you should"
```

| Agent | Kind | Model | Inputs (free sources first) | Output | Runs |
|---|---|---|---|---|---|
| **Market watch** | Code (exists: `advisor_engine`) | none | Binance public klines and funding, Fear & Greed, CoinGecko | Karat, risk, weather, unusual moves | hourly / daily cron |
| **News & macro** | LLM pipeline | Haiku 5.5 tags; Sonnet 5.5 writes the brief | RSS (Cointelegraph, Decrypt, CoinDesk), GDELT (multilingual), regulator feeds (CMF, BCT, AMMC, SEC) | Tagged events (hack, regulation, ETF flows, rates, war) and the shared "what happened today and why" brief | every 2–4 h; brief once a day via the Batch API |
| **Coin research** | LLM with tools | Sonnet 5.5 | CoinGecko, DefiLlama, unlock data, Qirat grade history | One-page coin dossier: what it is, age, liquidity, supply and unlocks, red flags | on demand, cached 24 h |
| **Scam checker** | Rules + APIs + LLM | Haiku 5.5 for text, Sonnet 5.5 for screenshots | GoPlus (free 150k units/mo), ScamSniffer and MetaMask phishing lists, domain age, curated CMF/AMMC list, pattern list (AMMC 6-step pattern, "guaranteed %", "unlock fee", "recruit 2 friends") | A list of red flags and what to verify, in Darija/FR/EN | on demand |
| **Risk manager** | Code | none | Self-reported holdings, volatility and correlation data | Concentration, combined "rough month in TND", "if BTC −30%", checks against the user's own rules; hard limits for practice wallets | on demand and daily |
| **Coach** | LLM chat with the tools above | Haiku 5.5 by default; Sonnet 5.5 for hard questions | Profile (language, level), glossary, lessons, today's data | Explanations, quizzes, reminders of the user's own rules; refuses buy/sell instructions | on demand |
| **Strategy lab** (private) | Deterministic strategies + a weekly LLM review | Opus 5.5, once a week | Snapshot log, paper ledger | Paper decisions at 1-week and 1-month horizons, logged; weekly owner report on Telegram | daily / weekly |

**No 24-hour horizon:** short-horizon signals are mostly noise after fees, and Qirat's own measured edge at 7 days is already small (IC ≈ 0.09). The evidence that exists is for 1 week to 1 month, and momentum turns into reversal beyond about a month.

**User profiles** (these need accounts):
- **Sign-in:** Telegram Login first (no passwords to store), email magic link later. Data in Upstash.
- **Fields:**
  - language
  - level (from a short quiz)
  - learning goal (understand the basics / understand risk / practise)
  - holdings (manual, optional)
  - **"my rules"**, written by the user (e.g. "never more than 10% in one coin", "no new buys in a storm")
- **Deliberately not collected:** income, age, wealth or investment horizon. Collecting them makes outputs look "suitable for you", which is the legal definition of advice ([D §3.8, rule 5](research-2026-11/D-legal-costs.md)).

**AI models and cost** ([D §7](research-2026-11/D-legal-costs.md); prices per million tokens):

| Model | Price (in / out) | Use |
|---|---|---|
| Claude Haiku 5.5 (`claude-haiku-5-5`) | $0.10 / $0.50 | Coach, tagging, scam text |
| Claude Sonnet 5.5 (`claude-sonnet-5-5`) | $2 / $10 | Shared brief, dossiers, screenshots |
| Claude Opus 5.5 (`claude-opus-5-5`) | $4 / $20 | Weekly lab review only |
| Groq gpt-oss-120b (in production today) | $0.15 / $0.60 | Fallback |

- **At ~1,000 users:** about $5–15/mo for AI with the coach on Haiku, plus $0–35 for data. In total about $20–60/mo, inside the $0–50 budget.
- **The shared brief costs about $3–6/mo even on Sonnet or Opus.** A personalised brief would cost about $360/mo on Sonnet, and it is legally riskier too.
- **Before choosing models, check the AI keys.** Project memory says the local Anthropic key was blocked until 2026-08-01, so confirm its status and the production key before switching.

### 4.4 Practice with $10

- **The wallet:** a virtual **10 USDT** (shown with its TND value) at live prices.
  - Realistic costs: 0.1% fee per trade plus spread and slippage.
  - Spot only: no leverage, no shorting.
  - Labelled "Simulation, not real money" everywhere.
- **Modes:**
  - *My picks* (manual)
  - *DCA* (buy a fixed amount every week)
  - *Follow a rule* (e.g. "hold the two highest-karat coins, move to cash in a storm")
  - Every mode is always compared with *just holding BTC*
- **Coaching on behaviour, not results:** e.g. "you bought after a +25% day: that's the FOMO pattern", "you sold during a −10% day: panic pattern", "you broke your own rule".
- **Private progress only.** No public leaderboard: leaderboards reward gambling and look like signal groups.
- **Stronger alternatives and add-ons:**
  - **Risk doctor:** the user's real coins, priced in TND, with concentration, a combined rough month and a "BTC −30%" scenario.
  - **DCA planner:** a historical "what if I had put 50 TND a week into BTC since 2021?" simulator, including fees.
  - **"Your agent vs you":** the user can watch the private strategy lab's paper wallet next to theirs, *only* once a strategy has passed the gates in 4.5.

### 4.5 Validation: backtest → private paper trading → gates

**Stage A: backtest** (about 2 weeks of work, offline)
- **Method:** walk-forward on Binance daily data 2021–2026, with 0.1% fees per side plus 0.1% slippage and weekly rebalancing.
- **Universe:** include delisted and dead coins, to avoid survivorship bias.
- **Report:** Sharpe, Sortino, max drawdown, turnover, and hit rate with payoff ratio.
- **Benchmarks:** (a) buy-and-hold BTC, (b) equal-weight top 18, (c) a simple BTC 50-day trend rule.
- **Overfitting control:** count every variant tried and apply the deflated-Sharpe correction.
- **LLM components are excluded from backtests** (they would be contaminated by training-data look-ahead) and enter only at Stage B.

**Stage B: private paper trading** (at least 6 months)
- **What gets logged:** `{time, strategy, coin, direction, horizon, probability, size}`, before the outcome is known.
- **Storage:** extend `server/track_record.py` with a `paper:` namespace, written set-if-absent like the daily snapshots: `paper:decision:{strategy}:{day}` and `paper:ledger:{strategy}`.
- **Scoring:** a resolver mirroring `scorecard()` scores the 7-day and 30-day outcomes.
- **Reporting:** results go only into the owner's weekly Telegram note.

**Stage C: go / no-go gates** (all must pass at the end of Stage B)

| Gate | Threshold |
|---|---|
| Enough data | ≥ 26 non-overlapping weekly windows (or ≥ 6 monthly) |
| Risk-adjusted return | Sharpe ≥ buy-and-hold BTC over the same window, after costs |
| Drawdown | Max drawdown ≤ 70% of BTC's over the same window |
| Ranking skill | Rank IC ≥ 0.05 with t ≥ 2 |
| Calibration | "60%" calls come true 55–65% of the time; Brier score better than always predicting the base rate |
| Stability | Positive in at least 2 of 3 sub-periods; not driven by a single coin |

**After the gates:**
- **A passing strategy** may appear *inside Practice mode* as an education rule ("a calm-trend rule tested here since May"). It stays impersonal and never touches real money.
- **A failing strategy** is retired quietly, and what it taught goes into the coach.
- **Real-money features stay out of scope** until a Tunisian lawyer confirms a licensed path. Even then, only through a licensed exchange partner, with the minimum safety pattern exchanges already use:
  - spot only, no leverage
  - an isolated sub-account the user funds by hand
  - API keys that can trade but not withdraw
  - a confirmation on every trade
  - a daily loss cap

---

## 5. Legal and practical constraints

**Not legal advice.** Confidence levels and sources are in [D](research-2026-11/D-legal-costs.md).

**Crypto in Tunisia**
- There is no crypto law. The BCT says crypto is not money (Feb 2023).
- In practice, buying, holding or receiving crypto without BCT authorisation is treated as a violation of the foreign-exchange law (loi 76-18). Arrests happened in 2021; the best-known case was later dismissed. Confidence: medium-high.
- The new Code des changes passed the finance committee in April 2026 but is **not law**, and a vote may slip to 2027. It would recognise crypto, but with declaration, BCT authorisation and prison terms for serious violations.
- Sources: [Managers](https://managers.tn/2023/02/25/les-crypto-actifs-ne-possedent-pas-le-statut-juridique-dune-monnaie-tranche-enfin-la-bct/), [African Manager](https://en.africanmanager.com/new-foreign-exchange-code-what-parliament-proposes-to-government/).

**Advice vs education**
- Tunisian investment law (94-117, 2005-96) is written around securities. Generic crypto commentary is *probably* outside the CMF's perimeter. This is a reading, not a CMF statement.
- The CMF is actively pursuing social-media "advice" that turns into managing money (ELINOJA, 28 Oct 2026).
- Abroad, the line is consistent ([D §3](research-2026-11/D-legal-costs.md)):
  - **EU (MiCA):** advice = personalised recommendations.
  - **US (Lowe v. SEC):** impersonal, bona fide, regularly published content is not advice.
  - **UAE:** finfluencers giving recommendations, including on crypto, must register.
- **Algeria and Egypt ban crypto *promotion*:** don't target them in marketing.

**Feature verdicts** ([D §0](research-2026-11/D-legal-costs.md))

| Feature | Verdict |
|---|---|
| Education, impersonal grades, shared brief, scam checks, Telegram bot | **Go** (with disclaimers) |
| Paper trading with virtual money | **Go** (clearly labelled) |
| Self-reported holdings and the user's own rules | **Go with guardrails** (no "sell your X") |
| Personalised buy/sell suggestions | **No** |
| "Trade my $10 for me" (custody, execution) | **Hard no** |
| Collecting Pro revenue in crypto, RedotPay or Telegram Stars (paid out in TON) | **High risk; hold** until a lawyer confirms. Safer: TND through local licensed rails, or foreign-card revenue into a Startup Act foreign-currency account. **This changes the 2026-10-02 payment decision; see section 8.** |

**Guardrails to build in** (selected from [D §5](research-2026-11/D-legal-costs.md)):
- **Wording:** no imperative trade verbs in AI output (buy, sell, enter, exit, "now", "you should"). Enforce with the system prompt *and* an output filter, and log refusals.
- **Disclaimers:** on every screen and message, in EN/FR/AR/Darija, including "not licensed by the CMF or BCT".
- **No paid promotion:** no affiliate links or paid listings.
- **Data and records:**
  - minimal personal data (data-protection law 2004-63, regulator INPDP; duties still to be verified)
  - no private keys
  - AI answers kept for 12 months as evidence they were impersonal

**Data costs** ([D §6](research-2026-11/D-legal-costs.md)): a launch stack of $0–35/mo:
- CoinGecko Demo, then Basic at $35 once revenue starts
- CoinMarketCap Basic (free, commercial use allowed)
- Binance `data-api` klines
- alternative.me Fear & Greed (attribution required)
- DefiLlama, GoPlus, GDELT and RSS, all free

Avoid the free tiers of Etherscan and NewsAPI in production: their terms forbid commercial use.

---

## 6. Ranked feature roadmap

Impact = value to Tunisian beginners and to growth. Effort: S ≈ under 1 week, M ≈ 1–3 weeks, L ≈ 3+ weeks of part-time work. Risk = legal and brand risk. Cost = monthly run cost at ~1,000 users.

| Rank | Feature | Impact | Effort | Risk | Cost/mo | Why |
|---|---|---|---|---|---|---|
| 1 | **Clean-up fixes** (hide the public Track record tab and bot `/record`; "Low risk *for crypto*"; remove trending micro-caps; shorter, plainer chat answers; render tables; faster first load) | Medium | S | Lowers risk | $0 | Aligns the app with decisions already made and the calm brand |
| 2 | **Scam check** (web + `/scamcheck`: paste a message, link, token, platform name or screenshot) | **High** | M | Low | $0–5 | Top pain, no competitor, shareable, matches the "scam of the week" content plan |
| 3 | **Accounts** (Telegram Login) + synced "My coins" | High (enabler) | M | Low–medium (personal data) | $0 | Required by everything personal |
| 4 | **Risk doctor in TND** (concentration, combined rough month, "BTC −30%", checks against *my rules*) | **High** | S–M | Low | $0 | Uses Qirat's most reliable signal (risk); factual, not advice |
| 5 | **Calm alerts** (weather changes, a coin of yours moving into high risk, a broken personal rule; at most 1 a day, quiet hours) | Medium | S | Low | $0 | Retention without FOMO |
| 6 | **Darija coach + glossary + micro-lessons** | **High** | M | Low–medium | $5–15 | Darija is the moat; grounded, no buy/sell |
| 7 | **Practice with $10** (paper wallet, behaviour coaching, vs holding BTC) | **High** | M–L | Low | $0–5 | Your idea, done safely; Thndr Alpha shows the demand (439k) |
| 8 | **Daily "what happened and why"** (shared; Darija/FR/EN; WhatsApp channel + Telegram) | Medium–high | M | Low | $1–5 | Daily habit; legally the safest AI format |
| 9 | **"Crypto and the law in Tunisia"** living page + safe-P2P guide | Medium | S | Medium (wording) | $0 | Trust and SEO; useful when the vote happens |
| 10 | **DCA planner** (TND, historical simulator with fees) | Medium | S | Low–medium | $0 | Teaches patience; must stay a simulator, not "you should DCA X" |
| 11 | **Coin dossier** (research agent) | Medium | M | Low | $2–10 | Good Pro candidate |
| 12 | **Halal notes per coin** (citing screeners, no fatwas) | Medium | M | Medium | $0 | Real demand; needs careful wording |
| 13 | **Strategy lab** (private paper agents and gates) | Unknown, long-term | M | Low (private) | $1–5 | The only honest way to learn whether any agent adds value |
| — | **Don't build:** auto-trading ("trade my $10"), personalised buy/sell, trade-signal alerts, public leaderboards, exchange affiliate links | — | — | Very high | — | Legal exposure, scam optics, and no evidence of an edge |

**Pro candidates (Jan 2027):**
- **Pro:** unlimited coach, advanced practice modes, coin dossiers, deeper halal notes.
- **Always free:** grades, weather, scam check, basic risk doctor.

---

## 7. Phased build plan

| Phase | Weeks (part-time) | Builds | Done when |
|---|---|---|---|
| **0. Clean-up** | ~1 | Roadmap item 1 | Track record hidden publicly (still logged privately); labels fixed; chat answers short; first load faster |
| **1. Protect** | 2–3 | Scam check v1 (web page and `/scamcheck`; text + link + token + platform; screenshot in v1.1); curated Tunisia/Morocco warning list; legal-status page | 20 real scam examples (from CMF, AMMC and news) all flagged; 20 legitimate examples (Binance, CMF site…) not flagged; answers in Darija/FR/EN |
| **2. My money** | ~3 | Telegram Login accounts, synced holdings, risk doctor in TND, "my rules", calm alerts | A user moves phones and keeps their data; risk doctor matches a hand-checked spreadsheet |
| **3. Learn and practise** | ~4 | Coach on Haiku 5.5 with tools, glossary and lessons, Practice with $10, behaviour feedback | Output filter blocks 100% of a 50-prompt "make it say buy" test set; paper fills match Binance prices ± spread |
| **4. Agents and evidence** | Starts alongside Phase 3; 6+ months of measuring | News agent + shared daily brief (WhatsApp/Telegram); strategy lab backtest (Stage A) and private paper log (Stage B); gate review around **May 2027** | Weekly owner report runs unattended; gate verdict written up |

**Before charging (Jan 2027):** a one-hour opinion from a Tunisian fintech lawyer on (a) TND subscriptions, (b) foreign-card revenue through a Startup Act FX account, (c) whether a crypto, RedotPay or Stars route is tolerable, and (d) data-protection (INPDP) duties for profiles hosted outside Tunisia.

---

## 8. Decisions needed from you

1. **Which phase to build first.** Recommendation: **Phase 0 + Phase 1 (Protect)**. Scam check is the strongest wedge, needs no accounts, and feeds marketing directly. Alternative: start with Phase 3 (Practice with $10) if you want your own idea first.
2. **Drop "trade my $10 for me" and personalised buy/sell calls.** Replace them with Practice mode and the private strategy lab.
3. **Payments.** The research flags crypto, RedotPay and Telegram Stars revenue as high risk for a Tunisian-resident operator. Book a lawyer before January.
4. **Hide the public Track record tab** to match "no public misses" (measurement continues privately).

---

## 9. Key sources

Selected; the notes in [`research-2026-11/`](research-2026-11/) have every URL.

- Lopez-Lira & Tang, *Can ChatGPT Forecast Stock Price Movements?* (v6, 2025): https://arxiv.org/html/2304.07619v6
- Profit Mirage / FinLake-Bench (2025): https://arxiv.org/html/2510.07920v1
- Look-Ahead-Bench (2026): https://arxiv.org/abs/2601.13770
- TradingAgents: https://arxiv.org/html/2412.20138v4 · FinMem: https://arxiv.org/html/2311.13743v2 · FinCon: https://arxiv.org/html/2407.06567v3 · CryptoTrade: https://aclanthology.org/2024.emnlp-main.63/
- DeepFund: https://arxiv.org/abs/2505.11065 · StockBench: https://arxiv.org/html/2510.02209v1 · LiveTradeBench: https://arxiv.org/html/2511.03628v1
- Production agent-fleet study (Sept 2026): https://arxiv.org/abs/2609.05663
- Alpha Arena Season 1 coverage: https://protos.com/llm-crypto-trading-contest-finds-llms-cant-trade-crypto · https://forklog.com/en/four-out-of-six-ai-models-suffer-losses-in-trading-tournament/
- Liu, Tsyvinski & Wu, *Common Risk Factors in Cryptocurrency* (JF 2022): https://www.nber.org/papers/w25882
- Bailey, Borwein, López de Prado & Zhu, backtest overfitting: https://carmamaths.org/jon/backtest.pdf · Deflated Sharpe: https://papers.ssrn.com/abstract=2460551
- BIS Bulletin 69 (2023): https://www.bis.org/publ/bisbull69.htm · ESMA CFD intervention: https://www.esma.europa.eu/node/84933 · ESMA copy-trading briefing: https://www.esma.europa.eu/sites/default/files/2023-03/ESMA35-42-1428_Supervisory_Briefing_on_Copy_Trading.pdf
- CFTC on AI trading bots: https://www.cftc.gov/LearnandProtect/AdvisoriesAndArticles/AITradingBots.html
- CMF warning, 28 Oct 2026: https://www.leconomistemaghrebin.com/2026/10/28/cmf-attention-aux-arnaques-dinvestissement-sur-les-reseaux-sociaux/ · CMF fraud guide: https://cmf.tn/sites/default/files/pdfs/documentation/guides/Guide%20fraude%20CMF.pdf
- Tunisian FX code status: https://en.africanmanager.com/new-foreign-exchange-code-what-parliament-proposes-to-government/
- MiCA definitions: https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-3-definitions · ESMA Q&A 2882: https://www.esma.europa.eu/publications-data/questions-answers/2882 · Lowe v. SEC: https://www.law.cornell.edu/supremecourt/text/472/181
- Chainalysis ranking for Tunisia: https://www.tuniscope.com/article/416261/business/economie/cryptomonnaies-231311
- GoPlus Security API pricing: https://gopluslabs.io/security-api · Claude pricing: https://claude.com/pricing
