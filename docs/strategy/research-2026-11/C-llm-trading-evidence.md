# C. Can LLM agents trade? What the evidence says (as of 2026-11-08)

Purpose: evidence for a product-strategy doc. The founder hopes a multi-agent LLM system (market watch, news/politics, coin research) can issue buy/sell actions over 24h, 1 week and 1 month with roughly 90% good trades. This file collects the published evidence on whether that is realistic.

Conventions:
- Every claim has a source URL. **[UNVERIFIED]** marks figures I saw only in secondary sources, or could not confirm in the primary paper.
- "CR" = cumulative return, "SR" = Sharpe ratio, "B&H" = buy-and-hold.
- My own reasoning (not from a source) is labelled **(analysis)**.
- Research limit: the web-search budget ran out before section 6 (agent tooling) was fully searched. That section uses official docs fetched directly and is shorter than the others.

---

## 0. Bottom line (one paragraph)

No published system, academic or live, comes close to a 90% win rate on directional crypto trades. The LLM trading papers with the best headline numbers (FinMem, FinCon, CryptoTrade) were tested on short windows (2 to 8 months), on a handful of tickers, mostly without trading costs, and in some cases on dates the model had already seen in training. Once tests move past the models' training cutoff or go live, the edge largely disappears:
- **StockBench**: about +0.3% to +2.5% over 4 months, against +0.4% for buy-and-hold.
- **DeepFund**: 8 of 9 models lost money over 24 days.
- **Alpha Arena Season 1**: 4 of 6 models lost 42% to 59% in 17 days, with win rates of about 25% to 30%.
- **A 2026 study of a production fleet**: 41% round-trip win rate, against 50% for a retail benchmark.

What does hold up in crypto is modest and statistical:
- time-series momentum and trend
- short-horizon cross-sectional momentum and reversal, mostly gross of costs and concentrated in coins you cannot easily short
- low idiosyncratic volatility
- predictable risk and volatility

Realistic targets are a hit rate of about 50% to 58% on daily direction, a Sharpe of 0.5 to 1.5 after costs for a good systematic strategy, and calibrated probabilities measured with a Brier score. A target of "90% good trades" should be dropped.

---

## 1. LLM and multi-agent trading frameworks

### 1.1 Summary table

| # | Paper / system | Setup | Test window | Reported result | Main weaknesses | Link |
|---|---|---|---|---|---|---|
| 1 | **TradingAgents** (Xiao et al., Tauric Research, 2024) | Simulates a trading firm: fundamental, sentiment, news and technical analysts; bull and bear researchers; trader; risk team. Uses gpt-4o-mini / gpt-4o for quick tasks and o1-preview for deep reasoning. | 2024-01-01 to 2024-03-29 (~3 months); AAPL, GOOGL, AMZN | AAPL CR 26.62%, SR 8.21, MDD 0.91%, vs B&H -5.23% / SR -1.29. GOOGL 24.36% vs 7.78%. AMZN 23.21% vs 17.1%. | 3 months, 3 large-cap tickers. The authors themselves say the Sharpe "exceeds expected range". No transaction costs are mentioned. The test window is only just past gpt-4o's Oct-2023 cutoff. A Hugging Face commenter called the results "too optimistic to be true" (informal). Profit Mirage measured a 50% to 56% decay after cutoff (row 12). | https://arxiv.org/html/2412.20138v4 ; HF discussion https://huggingface.co/papers/2412.20138 ; gpt-4o cutoff https://developers.openai.com/api/docs/models/gpt-4o |
| 2 | **FinMem** (Yu et al., 2023; IEEE TBD) | Single agent with layered memory and a "character" profile; GPT-4-Turbo backbone | Train 2021-08-17 to 2022-10-05; **test 2022-10-06 to 2023-04-10 (~6 months)**; TSLA, NFLX, AMZN, MSFT, COIN | TSLA CR 61.78% (SR 2.68) vs B&H -18.63%. COIN 34.98% vs -30.01%. Average of 5 runs. Authors report Wilcoxon significance. | **The whole test window is before GPT-4-Turbo's Dec-2023 knowledge cutoff**, so the model may have "seen" the outcomes. 5 tickers. No transaction costs mentioned. The best of three risk settings is reported (selection on the test set). Profit Mirage: 71.85% return decay after cutoff. | https://arxiv.org/html/2311.13743v2 ; cutoff https://developers.openai.com/api/docs/models/gpt-4-turbo |
| 3 | **FinCon** (Yu et al., NeurIPS 2024) | Manager-analyst hierarchy with "conceptual verbal reinforcement" (prompt-level belief updates); GPT-4-Turbo | Train 2022-01-03 to 2022-10-04; **test 2022-10-05 to 2023-06-10 (~8 months)**; 8 assets including COIN | Beats B&H on all 8 assets. TSLA CR 82.87% (SR 1.97) vs 6.43%. COIN 57.05% vs -21.76%. NIO 17.46% vs -77.21%. | **The test window again falls before GPT-4-Turbo's cutoff.** No costs mentioned. Profit Mirage: 62.23% Sharpe decay after cutoff, the worst of the agents it tested. | https://arxiv.org/html/2407.06567v3 ; https://proceedings.neurips.cc/paper/2024/hash/f7ae4fe91d96f50abc2211f09b6a7e49-Abstract-Conference.html |
| 4 | **FinAgent** (Zhang et al., KDD 2024) | Multimodal (numbers, text, chart images) with dual-level reflection; 6 datasets including crypto; 12 baselines | Not verified | Headline "92.27% return, 84.39% relative improvement" on one dataset | **[UNVERIFIED]**: I did not confirm per-dataset or crypto numbers, or the test dates. Same family of short backtests on GPT-4-era models. | https://arxiv.org/abs/2402.18485 |
| 5 | **CryptoTrade** (Li et al., EMNLP 2024) | Reflective agent using on-chain data (CoinMarketCap and transaction statistics) and off-chain news (GNews); GPT-4 / GPT-4o; daily decisions; proportional fee charged | Bear 2023-04-12 to 06-16, sideways ~Jun to Aug 2023, bull 2023-10-01 to 12-01 (~2 months each); BTC, ETH, SOL | BTC bull: 28.47% (GPT-4o) vs **B&H 39.66%**. BTC bear: -13.71% vs B&H -15.61%. SOL bull: 115.18% vs **B&H 176.72%**. ETH bull: 25.47% vs B&H 22.59%. | **Does not consistently beat buy-and-hold.** The authors say it is "comparable" to MACD and B&H and that LLM agents sometimes underperform traditional signals. Each regime window is about 60 days. Most test dates fall before GPT-4o's Oct-2023 cutoff. | https://arxiv.org/html/2407.09546v1 ; https://aclanthology.org/2024.emnlp-main.63/ |
| 6 | **FinRobot** (AI4Finance, 2024) | Open-source agent platform (2405.14767) plus a Chain-of-Thought equity-research agent (2411.08804) | n/a | Produces research reports and valuations. **No trading-performance claim.** | Useful as an architecture reference only. | https://github.com/AI4Finance-Foundation/FinRobot ; https://arxiv.org/abs/2411.08804 |
| 7 | **InvestorBench** (Li et al., ACL 2025) | Benchmark for stocks, crypto and ETFs with 13 LLM backbones | Not verified | **[UNVERIFIED]**: I did not retrieve the rankings or numbers. | Backtest-based, so the leakage critique applies. | https://arxiv.org/abs/2412.18174 |
| 8 | **DeepFund** ("Time Travel is Cheating", HKUST-GZ, NeurIPS 2025 D&B) | Live arena on data published after each model's cutoff; 9 LLMs (GPT-4.1, Claude 3.7 Sonnet, DeepSeek-V3, Gemini 2.5 Flash, Grok 3 mini, ...) | **2025-03-17 to 2025-04-17 (24 trading days)**, live | **Only Grok 3 mini made money (+1.1%).** All others had net losses, including DeepSeek-V3 and Claude 3.7. | Very short window during a tariff shock. Still, it is the cleanest no-leakage test of its generation. | https://arxiv.org/abs/2505.11065 ; https://www.alphaxiv.org/overview/2505.11065 |
| 9 | **StockBench** (Tsinghua/BUPT, Oct 2025) | 20 DJIA stocks, $100k, daily buy/sell/hold, news and fundamentals; GPT-5, o3, Claude-4-Sonnet, Qwen3, Kimi-K2, GLM-4.5, DeepSeek, GPT-OSS | **2025-03-03 to 2025-06-30 (82 trading days)**, after model cutoffs | Final returns from **-2.8% to +2.5%**, vs equal-weight B&H **+0.4%**. GPT-5 got +0.3%. All agents had smaller drawdowns (-11% to -15%) than B&H (-15.2%). In the Jan to Apr 2025 downturn window, **no** agent beat B&H. | No costs, slippage or liquidity modelled. The abstract and body disagree on whether "most" agents beat B&H. Margins are a few percentage points in one window. | https://arxiv.org/html/2510.02209v1 |
| 10 | **LiveTradeBench** (UIUC, Nov 2025) | Live portfolios; 21 LLMs; 15 US stocks/ETFs plus cash, and 10 Polymarket contracts | **2025-08-18 to 2025-10-24 (~50 trading days)**, live | Stocks: best GPT-4.1 CR 6.25% (SR 2.64), worst Gemini-2.5-Pro 1.95%. Polymarket: best Claude-Sonnet-3.7 +20.5%, worst Qwen3-235B-Thinking **-57.6%**. Many models lost >40% on Polymarket. **LMArena rank vs stock return: Spearman 0.054** (no relation). | No costs, spreads or slippage. 50 days. No index benchmark reported. **(analysis)** The stock results were in a rising market. I did not verify the S&P 500 return over the window. | https://arxiv.org/html/2511.03628v1 |
| 11 | **Agent Market Arena / "When Agents Trade"** (Oct 2025) and **AI-Trader** (Dec 2025) | Live multi-market benchmarks (crypto plus stocks; AI-Trader adds A-shares) | Live, ongoing | AMA: agent framework design matters more than the model backbone. AI-Trader: "general intelligence does not reliably translate into trading skill"; most agents had poor returns and weak risk control. | **[UNVERIFIED]**: I did not read return figures in the full text. | https://arxiv.org/abs/2510.11695 ; https://arxiv.org/abs/2512.10971 |
| 12 | **Profit Mirage / FinLake-Bench** (Li et al., Oct 2025) | Re-tests published agents in a backtest window (Q2 to Q3 2021) and a post-cutoff window (Q3 to Q4 2024) with similar market returns (+13.79% vs +13.35%) | Two 6-month windows | **Sharpe decays 51% to 62%** (FinCon worst at 62.23%, TradingAgents 55.68%). **Total-return decay 50% to 72%** (FinMem 71.85%). GPT-4o, Claude 3.7 and Grok-3 answer historical market-direction questions with **~90% accuracy** (trend 90.23%), which is evidence of memorization. | Authors propose their own fix (FactFin), so there is some incentive to make baselines look bad. | https://arxiv.org/html/2510.07920v1 |
| 13 | **Production fleet study** (Barton et al., Sep 2026) | Six months of real-money agent fleets: 3,505 vaults trading Base memecoins (Feb to Mar 2026), and 500+ agents on Hyperliquid perpetuals (Jun to Aug 2026); 7.5M model calls, 14,596 fills | Live, real money | **Neither fleet shows a directional edge.** The Hyperliquid fleet is unprofitable, with a **41% round-trip win rate vs 50%** for a matched retail benchmark. Frontier models' decision quality was **statistically indistinguishable** across 416 replayed scenarios. Sizing ignores volatility (median 5x leverage in every volatility bucket). 49% of trades that were up 300+ bps within 24h still closed at a loss. | Authors mention past retractions of their own results. It is a v1 preprint. | https://arxiv.org/abs/2609.05663 |
| 14 | **Constrained LLM factor discovery** (Apr 2026) | LLM proposes crypto factor hypotheses; a deterministic engine enforces fixed splits, costs and gates. Train 2020 to 2022, validate 2023, out-of-sample 2024+ | OOS 2024 to 2025 | Equal-weight long-short combination: **44.5% annualized, SR 1.55, MDD -23.6%** at a 5 bp one-way cost | Long-short in small caps. Value-weighted results are "poor" and capacity is limited. **In Table 2, every quintile including the top one has a negative annualized return**, so a long-only spot investor would have lost money. Factors were ranked on OOS Sharpe. | https://arxiv.org/html/2604.26747 |

Not covered: **TradingGPT** and a crypto benchmark called "CryptoBench". I did not locate primary sources before the search budget ran out, so nothing is claimed about them.

### 1.2 The look-ahead / "time travel" critique

1. **Models memorize prices and outcomes.** Profit Mirage found frontier LLMs answer about 90% of historical market-direction questions correctly for 2022 to 2023 dates (https://arxiv.org/html/2510.07920v1). Look-Ahead-Bench also cites earlier work showing GPT-4o can recall S&P 500 closes inside its training window, with errors rising sharply after the cutoff (https://arxiv.org/abs/2601.13770).
2. **Alpha decays after the cutoff.** Look-Ahead-Bench (Benhenda, Jan 2026) ran the same stock-picking agent on AAPL, MSFT, GOOGL, NVDA and TSLA over two windows. 2021-04 to 09 was in-sample; 2024-07 to 12 was out-of-sample. Six-month alpha versus B&H:

   | Model | In-sample | Out-of-sample |
   |---|---|---|
   | Llama-3.1-8B | +13.81 pp | -3.42 pp |
   | Llama-3.1-70B | +19.27 pp | +4.02 pp |
   | DeepSeek 3.2 | +20.73 pp | -1.04 pp |

   Point-in-time models went from +6.02 to +7.32 pp (Pitinf-Large). Caveats: a single author, and the Pitinf models are a commercial product; the paper discloses no affiliation (https://arxiv.org/html/2601.13770). The write-up at https://hedgefundalpha.com/education/your-llms-alpha-might-be-mere-memorization/ comes from vBase, which sells point-in-time infrastructure.
3. **Masking names doesn't fully fix it.** Glasserman & Lin (2023) anonymized company names in headlines for GPT-3.5 sentiment. They found a "distraction effect": general knowledge about a company hurts sentiment judgments. They also found most of the in-sample gap came from knowledge of the future, and the difference lost significance out-of-sample (https://arxiv.org/abs/2309.17322).
4. **Fixes exist but are partial.**
   - "Chronologically consistent" models (ChronoBERT / ChronoGPT, He, Lv, Manela & Wu 2025) are trained only on data available up to each year. They find look-ahead bias **modest** for next-day news-sentiment strategies, and stress that the bias is model- and task-specific (https://arxiv.org/abs/2502.21206). This is a useful counterweight: leakage is not always the whole story.
   - FinCAD (May 2026) suppresses memorized knowledge at inference time and cuts in-sample backtest returns by up to 67% on memorized dates (https://arxiv.org/abs/2605.24564).
5. **Implication (analysis).** Any backtest the app runs with a frontier LLM on dates before that model's cutoff is not evidence. Only forward (paper or live) tests count, or tests on dates after the cutoff.

### 1.3 The best-documented LLM signal and how it decayed

Lopez-Lira & Tang, "Can ChatGPT Forecast Stock Price Movements?" (v6, Oct 2025): GPT-4 (cutoff Sep 2021) scored 159,137 US firm headlines from Oct 2021 to May 2024 (https://arxiv.org/html/2304.07619v6).
- **Hit rates.** The 90%+ hit rate is only on the *initial, non-tradable* price reaction (93.3% overnight). On the tradable next-day drift, hit rates are **55% to 58%**, averaging about 34 bps per day long-short.
- **Sharpe decay.** The strategy's Sharpe fell from **6.54 (2021Q4) to 3.68 (2022), 2.33 (2023) and 1.22 (Jan to May 2024)**. The authors suggest this is because LLM adoption reduced the mispricing.
- **Costs.** About +700% cumulative gross, about +300% at 5 bps round-trip, about +100% at 10 bps, and **unprofitable at 20 bps**.
- **Implication (analysis).** Even the strongest academic LLM-news signal has about 55% to 58% daily accuracy, decays within about 2.5 years, and dies at realistic retail costs. Retail crypto spot fees are often 10 to 60 bps per side, before spread.

---

## 2. nof1.ai Alpha Arena (live LLM trading)

### Season 1 (crypto): about 2025-10-18 to 2025-11-03
- **Rules.** Six LLMs each got **$10,000 of real money** to trade **perpetual futures on Hyperliquid**: BTC, ETH, SOL, BNB, DOGE, XRP. Leverage was allowed. Agents ran autonomously with an inference cycle every 2 to 3 minutes. Inputs were mainly quantitative (prices, volumes, indicators). Each output was a structured action with leverage, a 0 to 1 confidence score, an exit plan, a stop and an invalidation condition (https://www.besthub.dev/articles/can-llms-trade-crypto-profitably-inside-the-alpha-arena-competition-ace3b75ceaa5 , secondary).
- **Final results** (nof1 figures via TradeRank's archived snapshot, https://www.traderank.ai/alpha-arena-leaderboard ; matches Forklog https://forklog.com/en/four-out-of-six-ai-models-suffer-losses-in-trading-tournament/):

| Rank | Model | Final equity | Return |
|---|---|---|---|
| 1 | Qwen3 Max | $12,231 | +22.3% |
| 2 | DeepSeek V3.1 | $10,489 | +4.9% |
| 3 | Claude Sonnet 4.5 | $5,799 | -42.0% |
| 4 | Gemini 2.5 Pro | $5,445 | -45.6% |
| 5 | Grok 4 | $4,208 | -57.9% |
| 6 | GPT-5 | $4,126 | -58.7% |

  **[Discrepancy]**: other outlets report GPT-5 at -62.66% / $3,733 and Gemini at -56.7%. Cointelegraph reported Qwen at only +7.5%, and Protos reported GPT-5 at -63% (https://cointelegraph.com/news/chinese-ai-models-beat-chatgpt-crypto-trading ; https://protos.com/llm-crypto-trading-contest-finds-llms-cant-trade-crypto). The likely cause is snapshots taken at different times. The sign and ranking are consistent across sources.
- **Win rates were only about 25% to 30% for all six models** (https://protos.com/llm-crypto-trading-contest-finds-llms-cant-trade-crypto). Even the winner made money from a few large leveraged winners, not from a high hit rate. At the end, Qwen held a **20x leveraged BTC long** (Cointelegraph).
- **Overtrading and fees.** Gemini made about 238 trades and paid about $1,331 in fees, over 13% of its capital. Claude made 38 trades. Qwen paid $1,654 in fees. nof1 said PnL "was dominated by trading costs in early runs as agents over-traded" (Protos). Datawallet reports Gemini's average leverage at about 14.3x (https://www.datawallet.com/crypto/alpha-arena-nof1-ai-explained , secondary **[UNVERIFIED]**).
- **What analysts concluded.**
  - nof1 founder Jay Azhang said LLMs "don't really handle numerical time series data very well," and that the models showed consistent "personalities" or biases (Protos; Forklog).
  - Self-reported confidence did not correlate with performance (besthub, secondary).
  - Peak-to-final swings were large: Qwen and DeepSeek had roughly doubled by Oct 27, then gave much of it back (Protos).
  - **(analysis)** One run of 17 days, six agents, a few dozen to a few hundred trades each, and leveraged perpetuals: the ranking is statistically indistinguishable from luck. nof1 itself promised more "statistical rigor" next time.

### Season 1.5 (US equities): 2025-11-19 to 2025-12-03
- Eight models, four parallel modes (baseline with news and memory, "Monk" capital preservation, situational awareness of rivals, max leverage), 32 entries in total, trading TSLA, NVDA, MSFT, AMZN, GOOGL, PLTR and NDX (https://www.traderank.ai/alpha-arena-leaderboard).
- A "Mystery Model", later revealed as **Grok 4.20**, won with **+12.11% aggregate** across its four entries. GPT-5.1 was second and Gemini 3 third. As of Dec 8, Grok 4.20 was reportedly the only profitable model (https://forklog.com/en/news/ai-model-grok-4-2-triumphs-in-trading-tournament). Per-model figures reportedly do not reconcile with the announced aggregate (TradeRank).

### 2026
- **No Season 2 has been published.** As of 2026-08-06, nof1.ai still showed Season 1.5 with "models no longer running". nof1 reportedly raised $15M in May 2026 and has discussed a consumer product (https://www.traderank.ai/alpha-arena-leaderboard ; secondary, **[UNVERIFIED]** for funding). alphaarena.ai returned HTTP 429 when I tried to check directly.

---

## 3. Academic evidence on crypto predictability

| Signal | Evidence | Strength / persistence / costs | Source |
|---|---|---|---|
| **Cross-sectional momentum (1 to 4 weeks)** | Liu, Tsyvinski & Wu (JF 2022): 1,707 coins, 2014 to 2018. 9 of 25 characteristics give significant long-short returns. Momentum earns about 2.5% to 4.1% **per week** gross (3-week is best at 4.1%). A three-factor model (market, size, momentum) prices them. Momentum works in **above-median-size coins** (4.2% per week) but not small ones (0.6%, insignificant). | **Gross of costs**, weekly rebalancing, early illiquid market. Shorting many coins is infeasible. Data snooping across 25 factors. Momentum loadings are "transient". | https://www.nber.org/papers/w25882 ; https://cxoadvisory.com/size-effect/cryptocurrency-factor-model ; https://econpapers.repec.org/RePEc:bla:jfinan:v:77:y:2022:i:2:p:1133-1177 |
| **Time-series momentum / attention** | Liu & Tsyvinski (RFS 2021): strong daily and weekly time-series momentum in BTC, XRP and ETH (weaker for ETH). Investor attention (Google searches) predicts 1 to several-week returns. Crypto returns barely co-move with stocks, FX or commodities. | A one-standard-deviation rise in "Bitcoin" searches is linked to about +2.5% next-week return **[UNVERIFIED, secondary]**. | https://nber.org/papers/w24877 ; https://ideas.repec.org/a/oup/rfinst/v34y2021i6p2689-2727..html |
| **Momentum under realistic frictions** | Han, Kang & Ryu (working paper): once transaction costs and intraperiod liquidation (leverage and price swings) are modelled, many momentum portfolios are liquidated or become insignificant. **Time-series momentum is strong; cross-sectional momentum is weak.** Time-series momentum profits are concentrated in bull markets. | Most directly relevant to a retail app | https://acfr.aut.ac.nz/__data/assets/pdf_file/0009/918729/Time_Series_and_Cross_Sectional_Momentum_in_the_Cryptocurrency_Market_with_IA.pdf (403 on fetch; snippet only) |
| **Momentum horizon** | Dobrynskaya (2023): 2,000 largest coins, 2014 to 2020. Momentum up to 2 to 4 weeks, **reversal beyond 1 month**. | Matters for 1-month calls | https://www.cerge-ei.cz/pdf/wp/Wp730.pdf (via search snippet) |
| **Trend factor (CTREND)** | Fieberg et al. (JFQA 2024): a trend factor built from many technical signals subsumes momentum. The authors say it is "resilient to transaction costs" despite turnover, and significant up to 4-week holding periods. | One of the more robust peer-reviewed results | https://doi.org/10.1017/S0022109024000747 (numbers not extracted) |
| **Persistence of anomalies** | Fieberg et al. (Quant Finance 2023): 34 anomalies, more than 3,900 coins, 2014 to 2022. Past winners consistently beat losers across subperiods. Zhu: across 47 anomalies, out-of-sample behaviour changes, with the **size effect disappearing**. | No direct crypto post-publication-decay study found. In equities, McLean & Pontiff find about 58% lower returns out-of-sample and post-publication. | https://ideas.repec.org/a/taf/quantf/v23y2023i12p1853-1869.html ; https://www.cxoadvisory.com/big-ideas/effects-of-market-adaptation |
| **Short-term reversal** | Reversal is the dominant cross-sectional characteristic in 1,200+ coins (Günther, Fieberg & Poddig). The Riksbank WP 413 finds reversal profits are **compensation for liquidity provision, concentrated in low-activity pairs**. | Hard for retail to harvest: it is effectively market-making in illiquid coins | https://www.riksbank.se/globalassets/media/rapporter/working-papers/2022/no.-413-trading-volume-and-liquidity-provision-in-cryptocurreny-markets.pdf |
| **Low volatility / idiosyncratic risk** | Leong et al. (J. Empirical Finance 2023): more than 4,000 coins, 2015 to 2022. Coins with the **lowest idiosyncratic risk returned about +80.6% a year, versus -9.36% for the highest**. Exploiting it as a long-short needs leverage, with potential 84% losses. | **Mixed**: Zhang & Li (2020) find idiosyncratic volatility *positively* priced. Bitwise (2025) finds no low-beta anomaly. | https://phys.org/news/2023-11-crypto-high-doesnt-equal-reward.html ; https://ideas.repec.org/a/eee/riibaf/v54y2020ics0275531920301926.html ; https://bitwiseinvestments.eu/blog/crypto-research/does-the-low-beta-anomaly-apply-to-crypto |
| **Social sentiment** | Kraaijeveld & De Smedt (2020): Twitter sentiment Granger-causes returns for BTC, BCH and LTC. **1% to 14% of tweets came from bots.** Later replications are mixed; Ciganovic (2023) finds **no** causality from sentiment to returns, only from returns to sentiment. | Weak, unstable, contaminated by bots | https://core.ac.uk/download/391332344.pdf ; https://iris.uniroma1.it/retrieve/1d32ef71-fae2-444c-a49b-40d528a423d4/Ciganovic_Forecasting_2023.pdf |
| **On-chain (exchange flows, MVRV)** | Hoang & Baur: 2016 to 2021, 20 exchanges. Rising exchange reserves are linked to lower current and future BTC returns (significant at all horizons, apparently **in-sample**). Stock-to-flow and Metcalfe models fit in-sample but **fail out-of-sample**. **No rigorous out-of-sample MVRV study was found**; MVRV thresholds come from blogs. | Weak or unproven out-of-sample | https://quantpedia.com/bitcoin-returns-and-volatility-predicted-by-bitcoin-exchange-reserves/ ; https://ouci.dntb.gov.ua/works/4Og3Lgq4 |
| **Practitioner long-short factor** | Artemis (2022 to 2026, weekly long-short on fundamentals): gross SR 1.83 and +60% a year, but **raw returns fell from about +124% a year (2022 to 2023) to about +28% (2024 to 2025)**. Breakeven cost is about 138 bps per trade. Gross of fees and borrow costs. | Shows decay in real time | https://research.artemis.ai/p/crypto-factor-model-analysis-launching |
| **Trend rules on BTC** | "A Decade of Evidence of Trend Following in Crypto" (arXiv 2020): big headline returns, but parameters fitted on one year give **no predictable attractive Sharpe** the following year. | Parameter instability | https://arxiv.org/abs/2009.12155 |
| **Survivorship** | Stöckl (2022): 3,904 coins, 2014 to 2021. Survivorship bias is **0.93% a year value-weighted but 62.19% a year equal-weighted**. The size premium is overstated by about 50% in survivor-only samples. More than half of listed tokens have failed (CoinGecko via secondary). | Critical for any "top coins" backtest | https://diffform.netlify.app/publication/2022_liebi_survivorship ; https://alexandria.unisg.ch/handle/20.500.14171/108037 |

**Takeaway (analysis).** The robust findings are statistical tilts measured across many coins and weeks: trend and time-series momentum, short-horizon momentum in larger coins, and a preference for low-idiosyncratic-risk coins. They are not per-trade certainties, and many need shorting or leverage. This matches the app's own internal finding (from project memory) that a low-vol plus 90-day momentum composite and a BTC 50-day regime filter carry signal while the overall engine score did not.

---

## 4. Why most bots and signals fail

1. **Backtest overfitting.**
   - Bailey, Borwein, López de Prado & Zhu (2014): testing **more than 45 strategy variants on 5 years of data almost guarantees finding one with an in-sample Sharpe of 1 whose expected out-of-sample Sharpe is 0.** A backtest that does not report how many variants were tried cannot be assessed (https://carmamaths.org/jon/backtest.pdf ; https://www.cxoadvisory.com/big-ideas/insidiousness-of-overfitting-investment-strategies-via-iterative-backtests).
   - The **Probability of Backtest Overfitting** (PBO, using CSCV) estimates how likely the selected strategy is to underperform the median out-of-sample (https://papers.ssrn.com/abstract=2326253).
   - The **Deflated Sharpe Ratio** corrects a Sharpe for the number of trials and for non-normal returns (skew and kurtosis) (https://papers.ssrn.com/abstract=2460551).
   - The same problem applies to prompt iteration: each prompt or agent variant you try on the same history counts as a trial (analysis).
2. **Backtests barely predict live results.** Wiecki et al. (Quantopian, 2016) studied 888 algorithms with at least 6 months out-of-sample. **Backtest Sharpe explained less than 2.5% of out-of-sample Sharpe (R² < 0.025).** More backtesting correlated with a larger IS/OOS gap (https://quantpedia.com/quantopians-academic-paper-about-in-vs-out-of-sample-performance-of-trading-alg/).
3. **Costs and slippage.** The LLM news signal becomes unprofitable at 20 bps round-trip (Lopez-Lira & Tang, above). Alpha Arena PnL was "dominated by trading costs", with Gemini paying more than 13% of capital in fees. LiveTradeBench and StockBench model **no costs at all**.
4. **Regime change.**
   - StockBench agents beat B&H in the May to Aug 2025 upturn but **none** did in the Jan to Apr downturn.
   - CryptoTrade rankings flip between bull, bear and sideways windows.
   - Time-series momentum profits are concentrated in bull markets (Han, Kang & Ryu).
5. **Crowding and decay.**
   - Lopez-Lira & Tang's Sharpe fell from 6.5 to 1.2 in about 2.5 years.
   - Artemis's factor returns roughly quartered between 2022-23 and 2024-25.
   - In equities, published anomalies lose about 58% of returns out-of-sample and post-publication (McLean & Pontiff, via https://www.cxoadvisory.com/big-ideas/effects-of-market-adaptation).
6. **Survivorship and selection.**
   - Equal-weighted crypto backtests can be inflated by about 62% a year (Stöckl).
   - Signal-group "results" are selected screenshots. No peer-reviewed study of Telegram signal-channel performance was found. Searches returned only vendor posts claiming "84% to 95% win rates", which are unverifiable (example: https://flexe.io/blog/telegram-channel-crypto-signals-proven-results-2025/). **This is itself evidence of the marketing norm the app would compete against.**
7. **Leverage and sizing.** The 2026 fleet study found median 5x leverage regardless of volatility, with one setting accounting for 62% of liquidations (https://arxiv.org/abs/2609.05663).
8. **Base rates for active retail traders.** Chague, De-Losso & Giovannetti: of 19,646 Brazilian mini-index futures day traders (2013 to 2015), 1,551 persisted more than 300 days and **97% of those lost money**. Only about 0.4% to 0.5% earned more than a bank teller's wage. No evidence of learning (https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3423101 ; https://quantpedia.com/retail-day-trading-is-an-uphill-battle/).

---

## 5. Honest targets: hit rate, payoff, Sharpe, calibration

### 5.1 Win rate is the wrong headline metric

- **Expectancy = p × average win - (1 - p) × average loss.** Breakeven hit rate = 1 / (1 + payoff ratio). With a 2:1 payoff, you break even at 33% wins.
- **Trend followers win fewer than half their trades.**
  - Practitioner sources put trend-following win rates at about **35% to 45%**, with average win/loss ratios of about 1.1 to 1.6+ (https://www.turtletrader.com/magnitude/ ; secondary; **[UNVERIFIED as an industry statistic]**: no peer-reviewed CTA win-rate dataset was found).
  - Time-series momentum across futures has a gross Sharpe of about 1.17 historically (Moskowitz, Ooi & Pedersen, via https://quantpedia.com/time-series-momentum-works-everywhere/).
  - AQR reports trend following was profitable over about 110 years of simulated history (https://www.aqr.com/Insights/Research/Journal-Article/A-Century-of-Evidence-on-Trend-Following-Investing).
- **Live LLM agents.** Alpha Arena win rates were about 25% to 30%. The 2026 production fleet had 41%, against a 50% retail benchmark.
- **Daily direction.** The strongest documented LLM news signal hits **55% to 58%** on next-day drift (Lopez-Lira & Tang).

### 5.2 Why "90% win rate" usually means hidden tail risk

High-hit-rate strategies are typically **negatively skewed**: many small gains and rare large losses. This is what short options, mean reversion, grid bots and martingale sizing produce.
- **XIV** (short-volatility ETN) had **85%+ positive months** for years, then **lost 96% in one session on 2018-02-05**.
- **LJM** (an option-selling fund) lost about **80%** in the same episode (https://curvedtrading.com/articles/en/trading/expected-value-trading-high-win-rate-losing-money/ ; secondary).
- An options backtest with an **82.6% win rate over 717 trades still lost money** (https://jwplatta.github.io/posts/distribution-and-regime-effects-in-a-1dte-options-strategy).
- **(analysis)** Grid bots and martingale (doubling down after losses) mechanically produce high win rates by averaging down. They fail catastrophically in a one-way trend, which is the norm in crypto crashes. No peer-reviewed grid-bot study was found.

### 5.3 Realistic Sharpe ranges (net of costs)

- Crypto factor long-shorts report **gross** Sharpes of about 1.5 to 1.8:
  - Artemis: 1.83 gross (https://research.artemis.ai/p/crypto-factor-model-analysis-launching).
  - The constrained-LLM factor paper: 1.55 out-of-sample at a 5 bp cost (https://arxiv.org/html/2604.26747).
  - Both are concentrated in small caps, need shorting, and decay. Net of real retail fees, spreads and borrow costs, expect much less (analysis).
- **(analysis)** For a **long-only, spot, beginner** product, a realistic aim is better risk-adjusted returns than holding BTC: lower drawdowns and Sharpe improved by roughly 0.2 to 0.5, mainly from regime and volatility filters, not from high-accuracy calls. StockBench agents' main measurable benefit was **smaller drawdowns** than B&H, not higher returns.

### 5.4 Score probabilities, not "good trades"

- **Brier score** = mean of (forecast probability - outcome)². It ranges from 0 (perfect) to 1. It decomposes into calibration (reliability) and resolution, and is the standard metric for binary probabilistic forecasts (Brier, 1950, *Monthly Weather Review* 78(1); journal page returned 403, so the citation is from memory **[UNVERIFIED]**).
- Good Judgment Project superforecasters were top-2% performers and notably free of overconfidence (https://goodjudgment.com/wp-content/uploads/2021/10/Superforecasters-A-Decade-of-Stochastic-Dominance.pdf ; https://aiimpacts.org/?p=1260).
- **(analysis)** For a "BTC up in 7 days?" question with a base rate near 50%, always saying 50% scores 0.25. A product that reliably scores **0.23 to 0.24** is genuinely skilful. Publish reliability diagrams privately, consistent with the "no public misses" decision in memory.
- Note: Alpha Arena found model-reported confidence **did not track** outcomes (besthub, secondary). LLM confidence numbers must be calibrated empirically (for example with isotonic or Platt scaling on logged forecasts), not taken at face value.

---

## 6. Agent tooling (2026): what fits a small team on $0 to $50/month

Note: the search budget was exhausted, so this section relies on official docs fetched directly. Pricing pages were not checked.

| Framework | What it is | Fit for this app | Source |
|---|---|---|---|
| **Claude Agent SDK** (Python/TS) | Claude Code's agent loop as a library: built-in tools, hooks, subagents, MCP, sessions, permissions. Uses API-key auth; products may not use claude.ai login or rate limits. Covered by Anthropic Commercial Terms. | Powerful, but built around file and shell tools and Claude models. Overkill for a scheduled "summarize market + news → JSON" job. Note: the user-level Anthropic key is quota-blocked until 2026-08-01 per project memory. | https://code.claude.com/docs/en/agent-sdk/overview |
| **LangGraph** | MIT-licensed graph or state-machine agent framework (Python; separate LangGraph.js) with durable execution, persistence and human-in-the-loop | Good if you need explicit multi-step pipelines with checkpoints. The library is free; LangSmith observability is a paid tier (pricing not verified). | https://github.com/langchain-ai/langgraph |
| **OpenAI Agents SDK** | Small set of primitives (agents, handoffs/agents-as-tools, guardrails); Python-first; works with non-OpenAI models via LiteLLM / Any-LLM adapters | Lightweight. Guardrails are useful for "no buy/sell advice" output filters. | https://openai.github.io/openai-agents-python/ |
| **Vercel AI SDK** (TS) | `ToolLoopAgent` for your own model+tools loop; `HarnessAgent` to run a preconfigured harness; provider-agnostic | Natural fit if the app is already on Next.js/Vercel/Workers in TypeScript | https://ai-sdk.dev/docs/agents/overview |

**Recommendation (analysis).**
- On a $0 to $50/month budget, the cost driver is **tokens and data APIs, not the framework**.
- A "multi-agent" design is usually unnecessary. A **deterministic pipeline works better**:
  - scheduled jobs compute quant features (trend, volatility, regime, liquidity, on-chain flags)
  - one cheap LLM call per coin per day turns the features and headlines into a plain-language explanation and scam/risk flags, as structured JSON
  - forecasts are logged with timestamps for Brier scoring
- Any of the SDKs above, or plain function calls, can do this. Prefer the one matching the existing stack (TypeScript on Cloudflare/Vercel → AI SDK). Use cheap open-weight models via existing providers (prod Groq on gpt-oss-120b per memory).
- Reserve heavier agent loops for on-demand "research this coin" requests.
- **(analysis)** The evidence above (LiveTradeBench, StockBench, Agent Market Arena, the fleet study) consistently finds that **model choice and LLM leaderboard rank barely predict trading results**. Paying for frontier models buys explanation quality, not alpha.

---

## 7. What a realistic edge looks like (conclusion)

1. **Directional accuracy.**
   - 24h: about 50% to 55% is realistic, and anything above 55% to 58% sustained after costs would be exceptional. The best published LLM news signal reaches 55% to 58% before costs and decayed to a Sharpe of about 1.2 within 2.5 years.
   - 1 week to 1 month: the documented edges (momentum or trend, low-idiosyncratic-risk tilt, BTC regime) are portfolio-level tilts, not per-call certainties. Momentum also flips to reversal beyond about 1 month.
2. **"90% good trades" is not supported by any source.** Where 90% numbers appear, they are one of three things:
   - memorization (LLMs recalling past price direction about 90% of the time)
   - non-tradable reactions (93% on the instant price jump)
   - negatively skewed strategies that hide blow-up risk (XIV, grid, martingale)
   - Live LLM traders won 25% to 41% of trades.
3. **What can be delivered honestly:**
   - (a) **risk and regime information**, since volatility and drawdown risk are far more predictable than direction
   - (b) **probabilistic outlooks** ("historically, setups like this were up after 1 week about 55% of the time; typical range ±X%"), scored with a Brier score and reliability curves
   - (c) **scam, liquidity and survivorship screens**
   - (d) **plain-language explanation** of news, which is where LLMs genuinely help
4. **Evaluation rules for whatever is built:**
   - forward-test only, or test only on dates after the model's cutoff
   - log every forecast with a timestamp
   - include fees and spread (assume ≥20 to 60 bps round-trip for retail spot)
   - count every prompt or parameter variant as a trial (deflated Sharpe / PBO)
   - use survivorship-free coin universes
   - compare against BTC buy-and-hold and a simple trend rule, not against zero
5. **Regulatory and positioning note (analysis).** Labelling outputs "buy/sell" while delivering, at best, ~55% accuracy invites both user losses and regulatory exposure. Calibrated "outlook + risk" framing fits both the evidence and the neutral-ratings decision in memory.

---

## Appendix: items not verified / gaps
- TradingGPT and "CryptoBench": not located before the search budget ran out.
- FinAgent per-dataset crypto numbers, InvestorBench rankings, AMA and AI-Trader return figures, and CTREND numerical results were not extracted.
- Alpha Arena Season 1: numbers vary by source and snapshot. The TradeRank/Forklog table is used here; a direct nof1 check was blocked (HTTP 429).
- Trend-following 35% to 45% win rate is a practitioner rule of thumb, not a peer-reviewed industry statistic.
- Brier (1950) citation from memory; journal page blocked.
- No academic study of Telegram/WhatsApp crypto signal-channel returns was found.
- S&P 500 return over LiveTradeBench's window was not checked.
- Agent framework pricing (LangSmith, Vercel) was not checked.
