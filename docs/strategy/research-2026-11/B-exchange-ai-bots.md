# B. Exchange AI assistants, trading bots, copy trading — and how users actually fare

Research date: 2026-11-08. Prepared for the Qirat "trade my $10 for me" multi-agent feature decision.
Every factual claim carries a source URL. Many sources in this space are press releases, sponsored posts or affiliate review sites; these are flagged **[PR]**, **[vendor]** or **[affiliate]**. Figures that conflict across sources are flagged **[conflicting]**.

---

## 0. TL;DR

1. **The big exchanges already ship "talk to an AI, it trades for you."** Binance Ai Pro (beta Mar 2026, $9.99/mo promo, $29.99 list), Bybit AI (Sep 2026, in-app, own sub-account), Bitget GetAgent + GetClaw (free basic tier; GetClaw executes in a dedicated AI account), Coinbase for Agents (Jun 2026), plus developer toolkits from OKX (Agent Trade Kit, May 2026), Bybit (AI Skills, Mar 2026) and Kraken (CLI + MCP, 2026). A small app cannot out-execute them; they own the order book, the custody and the KYC.
2. **They all converge on the same safety pattern:** an isolated AI sub-account the user funds manually, API keys with no withdrawal rights, testnet/paper mode first, explicit confirmation for live trades (Bybit), and terms that put 100% of losses on the user.
3. **Outcome evidence is bad for retail:** BIS found a majority of crypto-app users in nearly all economies lost money on bitcoin (2015–2022); 74–89% of EU retail CFD accounts lose money (ESMA); eToro's own warning is ~51%; copy-trading followers do much worse than the leaders they copy (one 100k-outcome study: 97% of leads profitable, ~43.6% of followers — weak, vendor-cited); a peer-reviewed experiment finds copy trading causes excessive risk-taking. In LLM trading contests (Alpha Arena S1), 4 of 6 frontier models lost money in ~2.5 weeks.
4. **Security failures are real and recurring:** 3Commas API-key leak (2022, ~$15–20M stolen, initially denied); AI-agent losses in 2025–26 via prompt injection (AiXBT ~55.5 ETH; Bankr 14 wallets ~$150K; OpenClaw "Lobstar Wilde" agent sent its entire bag due to a parsing error).
5. **"AI trading bot" is the #1 scam lure regulators name** (CFTC 2024 advisory, SEC/NASAA/FINRA alert, SEC 2026 cases, AMF France blacklists of "trader-ai" sites). For Qirat's audience — whose top pain is scams — a "give us $10, our AI trades it" pitch looks exactly like the scam pattern.
6. **Legal exposure in the Maghreb:** Tunisia has no licensing regime; BCT says crypto is not legal currency and holding/acquiring requires declaration/authorisation; Morocco's crypto bill 42.25 is still in review and would require AMMC approval for portfolio managers. Under EU logic (ESMA), auto-executing trades for a client is *portfolio management* — a licensed activity.

---

## Part 1 — Exchange AI assistants

### 1.1 Binance — Binance Ai Pro (and predecessor "Bibi")
- **What it is:** Beta launched 25 March 2026 (one-click activation from 07:00 UTC). Turns plain-language trading ideas into automated strategies; functions include spot and perpetual orders, leveraged borrowing via the sub-account, price analysis, on-chain queries and custom strategy execution. Once funded, the AI "can execute related strategies, trades, or asset monitoring functions." — https://www.zawya.com/en/press-release/companies-news/binance-beta-launches-binance-ai-pro-bringing-ai-agentic-trading-to-users-351690 **[PR]**
- **Safety design:** creates a dedicated virtual sub-account, linked to an API key with **no withdrawal or transfer permissions**; users move funds in manually. — same source.
- **Price:** $9.99/mo beta discount vs $29.99 regular, 5M credits/month via Binance Pay, auto-renew, 7-day free trial. — same source. A free "Standard" tier with 250,000 credits/month reportedly added 19 Oct 2026 **[unverified, single source]** — https://www.onebullex.com/news/articles/binance-ai-pro-free-tier-gives-250-000-credits-but-users-bear-all-losses
- **Advice or execution?** Executes. Binance's position: "Binance does not provide trading advice or strategies"; users remain responsible for strategy settings and trading decisions. — zawya source above.
- **Models:** reported as built on the open-source OpenClaw ecosystem and powered by OpenAI/Anthropic and other LLMs **[conflicting/secondary]** — https://www.unlock-bc.com/en/binance-rolls-out-ai-pro-beta-for-ai-powered-trading
- **Bibi:** described as Binance's earlier Q&A bot, predecessor of the Skills package and the native agent — https://www.binance.com/de/square/post/321940539069537 (Binance Square commentary). Note: a BSC meme token named "BIBI" trades on FourMeme and is not an official product — https://dexrabbit.bitquery.io/bsc/pair/0x0a08cf00a59da63dd076793370b04c73556a4444/0x
- **Languages:** not stated in the launch release (Binance's app itself supports Arabic and French, but AI Pro language support is unconfirmed).
- **Reception:** Only one outlet documents complaints, centred on "the loss allocation clause" and how fast free credits deplete; user screenshots of gains/losses are anecdotal, no track record published. — https://www.onebullex.com/news/articles/binance-ai-pro-free-tier-gives-250-000-credits-but-users-bear-all-losses

### 1.2 Bitget — GetAgent, GetClaw, Gracy AI
- **GetAgent:** invite-only July 2025 (25,000 waitlist), public launch 19 Aug 2025; bundles 50+ tools (market insight, social sentiment), lets users customise strategies and **place orders through natural language**. — https://www.benzinga.com/crypto/cryptocurrency/25/08/47264443/bitget-expands-access-to-ai-agent-assisted-trading-with-public-launch-of-getagent **[PR]**, https://crypto.news/bitget-releases-ai-trading-assistant-getagent-for-all-users/
- **Pricing:** launch tiers Basic (free, top-50 coins), Plus (VIP1–3 or 5 BGB/month), Ultra (heavy users) — https://www.aap.com.au/aapreleases/globenewswire1001123547/ **[PR]**. Dec 2025 upgrade raised quotas and gave "free access for all users" at Basic — https://news.bitcoin.com/bitget-releases-major-upgrades-to-getagent-with-smarter-responses-and-free-access-for-all-users/ **[PR]**
- **GetClaw (Mar 2026):** installation-free agent giving signals via app, Telegram, Discord, **WhatsApp**; later given a dedicated AI trading account where it can trade "within defined limits." — https://itbrief.co.nz/story/bitget-unveils-getclaw-a-download-free-ai-trading-bot, https://yellow.com/ru/news/bitget-запускает-отдельный-ai‑трейдинговый-счёт-для-агента-getclaw
- **Adoption (company-sourced):** GetAgent >450,000 registered users per Messari Pulse (Apr 2026) — https://itbrief.co.uk/story/bitget-says-460-000-users-adopted-its-ai-trading-tools ; whole AI suite >1M users and $1.2B AI-agent volume (May 2026) — https://www.bitget.com/blog/articles/bitget-ai-1-million-users **[vendor]**
- **Security self-disclosure:** joint Bitget × SlowMist report warns agents can be manipulated via prompt injection and malicious plugins, and that always-on agents operate "without direct user oversight." — https://www.bitget.com/blog/articles/slowmist-bitget-security-research
- **Languages:** Bitget added Arabic across app/web for 11 MENA markets in Nov 2023 (incl. copy trading) — https://www.prnewswire.com/ae/news-releases/bitget-introduces-arabic-support-for-crypto-trading-in-middle-east-and-north-african-countries-301996635.html. An Arabic press release for GetAgent exists — https://news.bitcoin.com/ar/tahawul-bitget-tadawul-alomlat-almashafra-ila-mohadatha-thakia-ma-getagent/ ; GetAgent's in-chat language list is not documented. **No Darija.**
- **Reception:** no independent performance data found; all adoption numbers are company-cited.

### 1.3 OKX — Agent Trade Kit (+ OnchainOS)
- Open-source MCP toolkit (npm `okx-trade-mcp`, `okx-trade-cli`, MIT licence) letting any AI assistant trade spot, perps, options and algo orders on OKX; keys stay local, signing is local HMAC; demo mode with simulated assets. Launched ~19 May 2026. — https://web3.okx.com/learn/agent-trade-kit, https://investortrust.id/market/103705/okx-perkuat-ekosistem-ai-trading-lewat-agent-tradekit-berbasis-mcp
- **Audience:** developers, not beginners. Free (exchange fees only). OKX's web pages are localised in Arabic (`/ar-ae/` mirror exists) — https://okx-api.aperture.finance/ar-ae/learn/agent-trade-kit (mirror).

### 1.4 Bybit — TradeGPT (2023), AI Skills (Mar 2026), Bybit AI (Sep 2026)
- **TradeGPT (Sep 2023):** free educational assistant combining ChatGPT with Bybit's ToolsGPT plugin and market data; "multiple languages"; suggests strategies and products, reportedly estimates success odds. — https://cointelegraph.com/news/bybit-launches-ai-trade-gpt-for-market-analysis, https://www.unlock-bc.com/107745/bybit-unveils-tradegpt-the-ai-powered-trading-tool-empowering-cryptocurrency-analysis-and-education/
- **AI Trading Skill (13 Mar 2026):** lets ChatGPT, Claude, OpenClaw etc. trade on Bybit via 253 API endpoints; **every live transaction requires explicit confirmation and new users start on testnet**. — https://decrypt.co/361006/bybit-launches-ai-skills-powering-ai-agents-for-crypto-trading-with-zero-setup-253-api-endpoints-and-growing **[PR]**, https://cfotech.com.au/story/bybit-unveils-ai-trading-skill-for-automated-crypto-trades
- **Bybit AI (9 Sep 2026):** in-app conversational layer that "interprets user intent and executes the requested action on the user's behalf" across spot, futures, options, copy trading, bots, earn, P2P, card; activating creates an isolated Bybit AI sub-account, no API key needed. Price and languages not stated. — https://yellow.com/press-releases/bybit-ai-is-live-one-intelligent-conversational-layer-to-redefine-financial-experience **[PR]**

### 1.5 Coinbase — AgentKit → Agentic Wallets → Coinbase for Agents / Advisor
- AgentKit (2024) gave developers wallets for agents; Agentic Wallets launched 11 Feb 2026; **Coinbase for Agents (11 Jun 2026)** lets AI assistants trade spot/derivatives from an isolated portfolio or main balance via MCP/CLI; alongside, **Coinbase Advisor**, an in-app agent that gives investment recommendations. — https://siliconangle.com/2026/06/11/coinbase-agents-lets-ai-assistants-trade-crypto-move-money/, https://theblock.co/post/404458/coinbase-agents-dedicated-accounts-ai-bots-trade-pay-users, https://coinpaprika.com/news/coinbase-agentic-wallets-ai-agents-february-2026-launch/
- Robinhood offered agent-trading accounts first (May 2026) — siliconangle source above.

### 1.6 Kraken — Kraken CLI + MCP server
- Open-source single-binary CLI with ~151–152 commands exposed as MCP tools (spot, futures, staking, WebSocket); built-in local **paper-trading engine**; Kraken recommends paper first, a dead-man's switch for live, and API-key-level position limits/pair allowlists. 2026 (exact date conflicting, Mar–Jun). — https://blog.kraken.com/news/industry-news/announcing-the-kraken-cli, https://docs.kraken.com/home/mcp, https://bitcoinist.com/kraken-launches-open-source-mcp-server-for-ai-trading-agents/

---

## Part 2 — Bots and copy trading

### 2.1 3Commas (DCA/grid/signal bots via API keys)
- **Pricing (official page, Nov 2026):** Starter $20/mo list ($15 annual), Pro $50 ($38 annual), Expert $140 ($105 annual); Starter is spot-only, 1 exchange, 5 DCA bots / 2 grid bots; demo account on all plans; no permanent free live plan. — https://3commas.io/pricing
- **2022 API-key leak:** In Oct–Dec 2022 attackers used users' API keys to make unauthorised trades (notably on FTX). 3Commas initially blamed phishing and called the leak claims fake; on **28 Dec 2022 the CEO admitted the leaked keys were genuine** after a dataset was published and CZ warned users. Losses estimated $14.9M (HAPI) to ~$20M (Halborn); FBI reportedly investigated. — https://forklog.com/en/news/api-key-leaks-and-exchange-inaction-a-hapi-analysis-of-the-3commas-incident, https://www.halborn.com/blog/post/explained-the-3commas-breach-december-2022, https://regional-front.cointelegraph.com/news/3commas-ceo-confirms-api-key-leak-following-warning-from-cz, https://www.financemagnates.com/cryptocurrency/fbi-is-reportedly-investigating-3commas-api-leak/, https://decrypt.co/117826/3commas-api-dispute-highlights-risks-of-algorithmic-trading
- **Reviews:** Trustpilot ~1,750 reviews; headline score varies by source (≈4.5 on Trustpilot regional pages vs 3.4 claimed by a third party alleging invited reviews) **[conflicting]**. Complaints: bots "not working properly", support silent "for days", a refund request "denied", a rebalancing buy ~€700 above market. — https://uk.trustpilot.com/review/3commas.io?page=4, https://thegodfunded.com/en/tools/3commas/ **[affiliate]**, https://tradingtools-directory.pages.dev/tools/3commas/ **[affiliate]**

### 2.2 Cryptohopper
- **Pricing (official):** Explorer $29/mo ($24.16 annual), Adventurer $69 ($57.50), Hero $129 ($107.50); 3-day Explorer trial; no permanent free plan (free "Pioneer" tier removed mid-2026). FAQ: "possible to start trading with $20, but we recommend considering the monthly subscription costs." — https://www.cryptohopper.com/pricing ; Pioneer removal — https://comparedge.com/tools/cryptohopper/pricing **[affiliate]**
- **Reviews:** Trustpilot ~3.7–3.8/5 from ~360 reviews, polarised (≈59% 5-star, 25% 1-star); complaints: bots stop executing, cost, weak marketplace templates; one reviewer: with small capital "you might struggle to break even." — https://gainium.io/review/cryptohopper **[competitor]**, https://tradingtools-directory.pages.dev/tools/cryptohopper/ **[affiliate]**
- **$10 relevance:** a $29/month subscription is ~290% of a $10 account per month.

### 2.3 Kryll
- No subscription; pay-as-you-go fees as a % of invested capital, paid in its KRL token; KRL holdings give discounts; strategy building/backtesting free. Example: ~$0.33/day fee on $1,000 traded without holding KRL. Friction: users must buy KRL to run bots. — https://blog.kryll.io/kryll-platform-pricing-you-only-pay-when-you-use-it, https://coinledger.io/blog/best-crypto-trading-bots, https://comparebestai.com/articles/kryllio-review **[affiliate]**

### 2.4 Pionex (exchange with built-in grid/DCA bots)
- **Fees (official help centre):** bots free, no subscription or management fees; spot 0.05% maker/taker; futures 0.02%/0.05%; exceptions — Futures Moon, Leveraged Grid and Margin Grid bots take **20% of profits** on close (none on losing orders). — https://intercom.help/pionex/en/articles/14993683-pionex-trading-fee-overview
- **Reviews:** Trustpilot ~2.3–2.6/5 by various counts, recurring complaints about withdrawals, KYC delays and account restrictions; a May 2026 reviewer asked for principal to be released after trading/withdrawals were restricted. — https://www.trustpilot.com/review/Pionex.com, https://coinbureau.com/review/pionex/, https://blockport.io/spot-trading/pionex-review/ **[affiliate]**
- Grid bots profit in ranges and lose in trends; no published distribution of user grid-bot P&L was found.

### 2.5 eToro CopyTrader
- **Mechanics:** $200 minimum to copy a trader, $1 min per copied position; "no additional charge for copying," spreads/fees apply. — https://etoro.com/au/copytrader/
- **Incentive:** Popular Investors are paid by eToro up to ~1.5% of assets under copy per year (paid monthly), with tiers requiring min copiers and ≥$50K AUC — i.e. leaders are paid on AUM, not on followers' profit. — https://etoro.com/popular-investor, https://www.finder.com/investments/etoro-copy-trading **[affiliate]**
- **Loss disclosure:** eToro's own Australian page: **51% of retail investor accounts lose money when trading CFDs with this provider**; press material carries a 50% figure; entity figures reported at 55% (EU) / 52% (UK) **[varies by entity/date]**. — https://www.etoro.com/au/customer-service/, https://www.etoro.com/news-and-analysis/press-releases/retail-investors-come-of-age-displaying-discipline-and-diversification/, https://investingintheweb.com/brokers/etoro-uk/ **[affiliate]**. Industry average across 49 brokers ~71% — https://brokerrank.net/research/retail-loss-rates **[third-party]**
- Australia's ASIC sued eToro over its CFD product, alleging the majority of consumers who bought it lost money — https://blockworks.com/news/australian-regulator-sues-etoro

### 2.6 Exchange copy trading (Binance / Bitget / Bybit)
- **Binance rules:** copied entry can differ due to slippage; copies shrink or fail on insufficient margin, IOC partial fills, depth caps (80% of margin or market depth), leverage mismatch; low-liquidity symbols capped at 5x; Binance "not liable for trading losses." — https://www.binance.com/en/support/faq/detail/30f1e3a2835345e0b8ffc87f261a8256
- **Bitget self-reported success:** H1 2023 report claimed 93% of futures copy users and 82% of spot copy users profitable; 44% of copy traders under 25. No methodology. — https://cointelegraph.com/news/gen-z-crypto-social-trading-bitget-report, https://www.bitget.cloud/blog/articles/bitget-report-44-percent-of-copy-traders-are-gen-z **[vendor]**
- **Independent(ish) counter-data:** a 90-day study of 100,000+ copy outcomes on Binance, Bybit and MEXC: **97% of lead traders profitable, only ~43.6% of followers; overall copier win rate 48.5%**; attributed to a 2025 YieldFund study. — https://info.arkm.com/research/crypto-copy-trading-what-is-it-and-how-to-do-it, https://www.kucoin.com/blog/is-crypto-copytrading-profitable-in-2026 **[secondary; primary not found]**
- **Structural conflict / manipulation risk:** lead may close first while follower orders move price, leaving followers worse fills (KuCoin risk guide) — https://www.kucoin.com/learn/trading/20260821article **[competitor]**; leaderboards show only survivors; providers can blow up followers, open a new account and return within weeks; Ontario Securities Commission experiment: people offered a copy option placed 18% more trades. — https://brokerlistings.com/research-hub/copy-trading-blow-ups (Oct 2026). Anecdote: Reddit user copied a top Binance trader with $20, +$7 day one, then lost — via https://smalldrift.pages.dev/articles/binance-copy-trading-2026-guide-fees-risks-profit/ **[low quality]**.
- **No confirmed, adjudicated manipulation case** by a Binance/Bitget lead trader was found for 2025–26; the risk is structural and documented as conflict of interest rather than proven fraud.

### 2.7 AI "trading agent" products 2025–2026 and how they performed
- **Alpha Arena (nof1.ai) Season 1, Oct 17/18–Nov 3 2025:** six frontier LLMs traded a combined ~$60K of real money in crypto (https://pub.towardsai.net/six-frontier-ai-models-traded-60-000-in-real-money-for-17-days-the-leaderboard-lied-to-everyone-9f73591a8d4b); **4 of 6 finished in the red**; Qwen 3 Max ≈ +22%, DeepSeek V3.1 ≈ +5%, GPT-5 ≈ −63%, Gemini 2.5 Pro ≈ −57% **[figures from aggregators]**; mid-season leaders (Grok, Claude Sonnet 4.5 >+25%) did not hold. — https://forklog.com/en/four-out-of-six-ai-models-suffer-losses-in-trading-tournament/, https://decrypt.co/345006/ai-crypto-trading-showdown-deepseek-grok-winning-gemini-implodes, https://iweaver.ai/blog/alpha-arena-ai-trading-season-1-results
- **Season 1.5 (US stocks, Nov 20–Dec 3 2025):** an undisclosed model (later revealed as Grok 4.20) won with ~+12%; most others lost **[conflicting detail]**. — https://forklog.com/en/ai-model-grok-4-2-triumphs-in-trading-tournament/, https://www.kucoin.com/news/flash/ai-trading-models-struggle-in-live-market-tests-majority-of-systems-report-losses
- **AI-agent tokens:** ai16z/elizaOS ATH $2.48 (Jan 2025) → rebranded ELIZAOS, which fell ~97% from its Nov 2025 high by Feb 2026; Virtuals (VIRTUAL) ATH $5.07 (Jan 2025) → ~$0.63 in Apr 2026 (−87%). — https://coinmarketcap.com/currencies/ElizaOS, https://coinmarketcap.com/currencies/ai16z/, https://crypto-ai-tracker.vercel.app/projects/virtuals-protocol **[tracker]**, https://www.theblock.co/post/334213/ai-agent-tokens-reel-from-a-steep-market-correction
- **Agent failures / exploits:**
  - AiXBT (Mar 2025): attacker inputs treated as instructions; ~55.5 ETH (~$106K) lost — https://cointelegraph.com/magazine/grok-bankr-wallet-free-nft-prompt-injection
  - Lobstar Wilde (Feb 2026, OpenClaw): agent asked for 4 SOL sent its entire 52.4M-token holding (~$250K) due to a quantity-parsing error; copycat exploits later drained other OpenClaw users; China Internet Finance Association flagged OpenClaw as high-risk. — https://www.kucoin.com/news/flash/openclaw-ai-agent-incident-causes-millions-in-user-losses **[promotional framing]**, https://www.kucoin.com/news/flash/ai-agent-lobstar-wilde-loses-440-000-in-solana-transfer-error
  - Bankr (May 2026): Morse-code prompt decoded by Grok, tagged Bankrbot, which executed transfers; 14 wallets, ~$150–170K; Bankr paused and promised full compensation. — https://yellow.com/news/bankr-halts-14-wallets-150k-ai-attack, https://blockchain.news/news/bankr-halts-transactions-14-wallets-150k-lost
  - SlowMist (Mar 2026): attackers "only need to trick the AI agent," not the user — https://www.kucoin.com/news/flash/researchers-urge-treating-ai-agents-as-untrusted-systems-for-crypto-security

---

## Comparison table

| Product | Type | Executes trades? | Price | Arabic / French | Safety design | Evidence of user outcomes |
|---|---|---|---|---|---|---|
| Binance Ai Pro | Exchange AI agent | Yes, in AI sub-account | $9.99/mo promo, $29.99 list; 7-day trial; reported free tier (Oct 2026) | Not stated | Sub-account, API key w/o withdrawal | None published; users bear all losses |
| Bitget GetAgent / GetClaw | Exchange AI assistant + agent | GetAgent: orders via chat; GetClaw: autonomous in dedicated account | Basic free; Plus 5 BGB/mo | Bitget app Arabic since 2023; GetAgent list undocumented | Isolation model; SlowMist audit-style report | Adoption only (450K+ / 1M+), no P&L |
| OKX Agent Trade Kit | Dev MCP toolkit | Yes (via your AI) | Free (fees only) | Docs localised | Local keys/signing, demo mode | None |
| Bybit AI / AI Skills / TradeGPT | In-app agent + dev skill + edu bot | Bybit AI: yes; Skills: yes with explicit confirm; TradeGPT: advice | TradeGPT free; others not stated | "Multiple languages" (TradeGPT) | Sub-account; testnet first; per-trade confirmation (Skills) | None |
| Coinbase for Agents / Advisor | Agent accounts + advisory agent | Yes / recommendations | Not stated | — | Isolated portfolio option | None |
| Kraken CLI/MCP | Dev toolkit | Yes | Free | — | Paper engine, dead-man switch, key limits | None |
| 3Commas | Bot SaaS (API keys) | Yes | $20/$50/$140 mo (annual $15/$38/$105) | — | API keys held by 3rd party → 2022 leak | ~$15–20M stolen 2022; mixed reviews |
| Cryptohopper | Bot SaaS | Yes | $29/$69/$129 mo | — | API keys | 3.7–3.8 Trustpilot, polarised |
| Kryll | Bot SaaS (pay-per-use) | Yes | % of capital, paid in KRL | Not verified | API keys | No outcome data |
| Pionex | Exchange w/ built-in bots | Yes | Free bots, 0.05% spot fee; 20% profit share on some | — | Custodial exchange | Trustpilot ~2.3–2.6, withdrawal complaints |
| eToro CopyTrader | Copy trading (regulated) | Yes (mirrors) | No copy fee; $200 min | Not verified | Regulated; risk warnings | 50–55% of CFD accounts lose |
| Binance/Bitget/Bybit copy | Copy trading | Yes (mirrors) | Profit share to leads | Arabic on Bitget/Binance | Exchange-internal | Leads 97% profitable vs followers ~43.6% (weak source); Bitget self-claims 93% |
| Alpha Arena LLMs | Benchmark | Yes (real $) | — | — | — | S1: 4/6 models lost; GPT-5 ≈ −63% |

---

## Part 3 — Evidence on outcomes and regulator warnings

### 3.1 Retail crypto outcomes
- **BIS Bulletin 69 (20 Feb 2023):** using major-platform data for Aug 2015–Dec 2022, a majority of crypto-app users in nearly all economies lost money on bitcoin; median investor lost ~$431 of ~$900 invested; in a $100/month simulation over four-fifths would have lost money; losses higher in emerging markets (Brazil, India, Pakistan, Thailand, Turkey); whales sold while small retail bought before crashes. — https://www.bis.org/publ/bisbull69.htm, https://decrypt.co/121763/bitcoin-after-2015-lost-money-bis-report, https://news.yahoo.com/retail-crypto-investors-emerging-economies-162932915.html
- **FCA consumer research Wave 6 (fieldwork Aug–Sep 2025):** UK crypto ownership fell to ~8% from 12%; small holdings shrinking, large ones growing. — https://www.fca.org.uk/publications/research-notes/cryptoassets-consumer-research-2025, https://www.theblock.co/post/382722/uk-crypto-ownership-falls-2025-fca

### 3.2 Leveraged retail trading (the product category copy trading mostly lives in)
- **ESMA 2018 product intervention:** national regulators' analysis found **74–89% of retail CFD accounts typically lose money**, average losses €1,600–€29,000 per client; providers must disclose their own loss percentage. — https://www.esma.europa.eu/node/84933, https://www.esma.europa.eu/sites/default/files/library/esma35-43-1135_notice_of_pi_decisions_on_cfds_and_binary_options.pdf

### 3.3 Copy trading
- **Apesteguia, Oechssler & Weidenholzer, "Copy Trading," Management Science 66(12), 2020:** in an experimental market, showing others' success significantly increases risk-taking, and more so with a direct copy option; authors conclude "copy trading leads to excessive risk taking." — https://bse.eu/research/publications/copy-trading, https://econpapers.repec.org/RePEc:inm:ormnsc:v:66:y:12:i:2020:p:5608-5622
- **IOSCO Final Report on Online Imitative Trading Practices (FR/06/2025, 19 May 2025):** copy/mirror/social trading mostly promotes risky assets (CFDs, forex, crypto); automation is a source of harm; overlap with finfluencers blurs advice vs information; sets good practices. — https://www.iosco.org/library/pubdocs/pdf/IOSCOPD793.pdf, https://www.regulationtomorrow.com/2025/05/iosco-reports-on-finfluencers-online-imitative-trading-practices-and-digital-engagement-practices/
- **ESMA Supervisory Briefing on Copy Trading (30 Mar 2023):** services that **automatically execute** third-party signals with discretion will regularly qualify as **portfolio management**; services needing client action may be investment advice. — https://www.esma.europa.eu/sites/default/files/2023-03/ESMA35-42-1428_Supervisory_Briefing_on_Copy_Trading.pdf

### 3.4 Regulator warnings on "AI trading bots"
- **CFTC (25 Jan 2024), "AI Won't Turn Trading Bots into Money Machines":** AI cannot predict the future; fraudsters exploit AI hype with crypto trading schemes promising unreasonably high returns. — https://www.cftc.gov/LearnandProtect/AdvisoriesAndArticles/AITradingBots.html
- **SEC / NASAA / FINRA investor alert:** fraudsters "may claim to deploy bots that use AI to find the best crypto asset-related investments"; beware guaranteed returns. — https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/artificial-intelligence-ai-and-investment-fraud-investor-alert
- **SEC enforcement 2026:** Sept 2026 charges vs two offshore entities (Cryptoaiml, TSAI) alleging $15.3M taken from 2,000+ retail investors via WhatsApp groups and fake "AI" crypto platforms with no real trading — https://www.crowdfundinsider.com/2026/09/314375-sec-alleges-that-whatsapp-group-chats-and-fake-filings-were-used-in-15m-crypto-ai-scams/ ; Nathan Fuller case, ~$12.3M "AI trading bot" scheme, $6.2M allegedly diverted — https://www.fastbull.com/brokersview/news/sec-targets-alleged-ai-crypto-trading-scheme-that-raised-123-million-323925 (allegations, not findings).
- **AMF France:** warned about fraudulent trading-robot offers (2023) — https://www.amf-france.org/en/news-publications/news-releases/amf-warns-public-about-fraudulent-investment-offers-through-trading-robots ; guide on using AI to invest: AI tools are "neither regulated nor designed to act in your interest" — https://www.amf-france.org/fr/espace-epargnants/actualites-mises-en-garde/utiliser-lintelligence-artificielle-pour-investir-quoi-faut-il-faire-attention ; crypto blacklist entries such as trader-ai.fr (Dec 2025) and alphaairobot.com — https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/listes-noires-et-mises-en-garde/crypto-actifs/trader-aifr
- **Morocco (BAM / AMMC / Office des Changes):** joint warnings on virtual-currency risks; since 2017 crypto transactions treated as FX violations; draft Bill 42.25 (Nov 2025) would recognise crypto-assets and require **AMMC approval for platforms and portfolio managers**; still under review as of July 2026. — https://www.oc.gov.ma/en/actualites/nouvelle-mise-en-garde-des-autorites-financieres-contre-lutilisation-des-monnaies, https://www.moroccoworldnews.com/2025/11/266685/morocco-moves-to-regulate-digital-assets-with-new-draft-law/, https://www.moroccoworldnews.com/2026/07/330814/bam-confirms-progress-on-crypto-law-to-curb-moroccos-growing-underground-market/
- **Tunisia (BCT / CMF):** BCT stated in Feb 2023 that crypto-assets do not have the legal status of a currency; holding by residents reportedly subject to declaration and acquisition to prior BCT authorisation; no licensing regime or CMF framework for crypto service providers found; no specific CMF warning on AI bots found. — https://managers.tn/2023/02/25/les-crypto-actifs-ne-possedent-pas-le-statut-juridique-dune-monnaie-tranche-enfin-la-bct/, https://www.tuniscope.com/article/416261/business/economie/cryptomonnaies-231311, https://www.lightspark.com/knowledge/is-crypto-legal-in-tunisia **[secondary]**. Not legal advice; confirm with Tunisian counsel.

---

## Lessons for Qirat

1. **Don't compete on execution.** Binance, Bybit, Bitget and Coinbase now offer chat-to-trade agents for free–$30/mo with custody, KYC and order books in-house. A Qirat "multi-agent trader" would be a thinner, riskier copy that still has to route through one of them via API keys (the 3Commas risk surface).
2. **The safety pattern is now industry standard — any execution feature must match it as a floor:** isolated sub-account funded manually; API keys with trade-only, no-withdraw permissions; IP allowlists; position/pair limits; paper/testnet first; per-trade explicit confirmation (Bybit Skills); kill switch (Kraken dead-man switch). Anything less is below what exchanges ship.
3. **$10 is below the economic floor for most bots.** Cryptohopper's cheapest plan ($29/mo) or Binance Ai Pro ($9.99/mo) equals or exceeds the whole stake; exchange minimum notional sizes and fees eat small accounts; eToro copy minimum is $200. Pionex-style fee-only grid bots are the only model that fits $10, and they lose in trends.
4. **Outcomes data argues against "trade it for me."** Majority-loss findings (BIS), 74–89% CFD loss rates (ESMA), ~51% on eToro, followers far behind leaders in copy trading, copy trading inducing excess risk (Management Science), and frontier LLMs losing in live contests (4/6 in Alpha Arena S1). This matches Qirat's own finding that its engine score has no edge (see memory: scoring-evidence). An AI wrapper does not create edge.
5. **Trust and scam optics are the biggest risk for this audience.** "Give us $10, our AI trades it" is the exact script regulators (CFTC, SEC, AMF) describe as the leading AI-crypto scam, often run through WhatsApp groups — the channel Qirat plans to use. Qirat's positioning as the calm, anti-scam guide would be undermined.
6. **Licensing.** Under ESMA logic, auto-executing trades for users = portfolio management; Morocco's draft law would require AMMC approval for portfolio managers; Tunisia has no regime and restricts crypto acquisition. A Tunisian startup operating an auto-trader for MENA retail likely sits in unlicensed-activity territory. Get counsel before building.
7. **Agent-specific attack surface.** Prompt injection (Bankr, AiXBT), parsing errors (Lobstar Wilde), malicious plugins (Bitget × SlowMist). A multi-agent system reading social/news feeds and holding trade permissions is the textbook vulnerable design.
8. **What Qirat can credibly own instead:**
   - **"Shadow agent" / paper portfolio:** let users give the AI a virtual $10 and watch it trade with full reasoning in Darija/FR/AR; publish nothing as a track record publicly (consistent with the no-public-misses rule), measure privately.
   - **Explain-before-you-click:** translate exchange AI outputs and bot settings into plain Darija; risk grade and "market weather" before any trade.
   - **Pre-flight checklist for exchange AI agents / copy traders:** check leverage, drawdown, survivorship, lead-trader incentives, API-key permissions — a scam-check for bots.
   - **If execution ever ships:** non-custodial, confirm-every-trade, spot-only, no leverage, hard daily loss cap, trade-only keys, via a licensed exchange partner, after legal sign-off.
9. **Differentiation that exchanges lack:** none of the exchange AIs is documented as supporting Darija, and none is neutral (each pushes its own products, leverage and copy trading). A neutral, calm, Darija-first explainer is defensible; an auto-trader is not.

---

### Source-quality notes
- Exchange product details rely mainly on press releases; user-outcome data from exchanges is self-reported and unaudited (e.g. Bitget's 93%).
- The "97% leaders vs 43.6% followers" copy-trading figure could not be traced to a primary paper.
- Alpha Arena per-model returns come from aggregators; small sample, ~2.5 weeks, volatile period.
- Tunisia legal status comes from local press and secondary compliance sites; verify with BCT/CMF texts.
