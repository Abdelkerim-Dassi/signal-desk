const state = {
  brief: null,
  refreshTimer: null,
  countdownTimer: null,
  nextRefreshAt: null,
  lastUpdatedAt: null,
  lastError: null,
  isFetching: false,
};

const els = {
  form: document.getElementById("advisorForm"),
  marketSource: document.getElementById("marketSource"),
  quoteAsset: document.getElementById("quoteAsset"),
  assetInput: document.getElementById("assetInput"),
  holdingsList: document.getElementById("holdingsList"),
  addHoldingBtn: document.getElementById("addHoldingBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  liveToggle: document.getElementById("liveToggle"),
  refreshInterval: document.getElementById("refreshInterval"),
  freshness: document.getElementById("freshness"),
  sentimentMetric: document.getElementById("sentimentMetric"),
  sentimentLabel: document.getElementById("sentimentLabel"),
  marketCapMetric: document.getElementById("marketCapMetric"),
  marketCapChange: document.getElementById("marketCapChange"),
  btcDominanceMetric: document.getElementById("btcDominanceMetric"),
  ethDominanceMetric: document.getElementById("ethDominanceMetric"),
  assetCount: document.getElementById("assetCount"),
  opportunityList: document.getElementById("opportunityList"),
  portfolioList: document.getElementById("portfolioList"),
  trendingList: document.getElementById("trendingList"),
  newsList: document.getElementById("newsList"),
  discordStatus: document.getElementById("discordStatus"),
  whatsappStatus: document.getElementById("whatsappStatus"),
  discordChannel: document.getElementById("discordChannel"),
  whatsappChannel: document.getElementById("whatsappChannel"),
  sendAlertBtn: document.getElementById("sendAlertBtn"),
  toast: document.getElementById("toast"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function compactCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: Math.abs(Number(value)) >= 1000000 ? "compact" : "standard",
    maximumFractionDigits: Math.abs(Number(value)) >= 1000 ? 1 : 4,
  }).format(Number(value));
}

function percent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  const sign = Number(value) > 0 ? "+" : "";
  return `${sign}${Number(value).toFixed(2)}%`;
}

function actionClass(action) {
  return String(action || "hold").toLowerCase();
}

function logoHtml(item) {
  const image = item.image;
  const symbol = escapeHtml(item.symbol || item.base_asset || "?").slice(0, 4);
  if (image) {
    return `<img class="coin-logo" src="${escapeHtml(image)}" alt="">`;
  }
  return `<span class="coin-logo text-logo">${symbol}</span>`;
}

function marketLine(item) {
  if (item.pair) {
    return `${escapeHtml(item.pair)} · ${escapeHtml(item.source || "Market")}`;
  }
  return `${escapeHtml(item.symbol)} rank ${escapeHtml(item.market_cap_rank || "--")}`;
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("visible"), 3600);
}

function setLoading(isLoading) {
  document.body.classList.toggle("is-loading", isLoading);
}

function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (minutes <= 0) return `${remainder}s`;
  return `${minutes}m ${String(remainder).padStart(2, "0")}s`;
}

function updateFreshness() {
  if (state.isFetching) {
    els.freshness.textContent = "Refreshing live data...";
    return;
  }
  if (state.lastError) {
    if (els.liveToggle.checked && state.nextRefreshAt) {
      const remaining = Math.ceil((state.nextRefreshAt - Date.now()) / 1000);
      els.freshness.textContent = `Update failed · retry ${formatDuration(remaining)}`;
      return;
    }
    els.freshness.textContent = `Last update failed · ${state.lastError}`;
    return;
  }
  if (!state.lastUpdatedAt) {
    els.freshness.textContent = "Waiting for market data";
    return;
  }

  const updated = state.lastUpdatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (!els.liveToggle.checked) {
    els.freshness.textContent = `Updated ${updated} · live off`;
    return;
  }
  if (!state.nextRefreshAt) {
    els.freshness.textContent = `Updated ${updated} · live on`;
    return;
  }

  const remaining = Math.ceil((state.nextRefreshAt - Date.now()) / 1000);
  els.freshness.textContent = `Updated ${updated} · next ${formatDuration(remaining)}`;
}

function holdingRowTemplate(seed = {}) {
  const coinId = escapeHtml(seed.coin_id || "");
  const amount = escapeHtml(seed.amount || "");
  const avg = escapeHtml(seed.average_buy_price || "");
  return `
    <div class="holding-row">
      <input type="text" name="coin_id" placeholder="bitcoin" value="${coinId}" aria-label="Coin ID">
      <input type="number" name="amount" min="0" step="any" placeholder="Amount" value="${amount}" aria-label="Amount">
      <input type="number" name="average_buy_price" min="0" step="any" placeholder="Avg buy" value="${avg}" aria-label="Average buy price">
      <button class="remove-row" type="button" aria-label="Remove holding">x</button>
    </div>
  `;
}

function addHoldingRow(seed = {}) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = holdingRowTemplate(seed);
  const row = wrapper.firstElementChild;
  row.querySelector(".remove-row").addEventListener("click", () => row.remove());
  els.holdingsList.appendChild(row);
}

function collectAssets() {
  return els.assetInput.value
    .split(",")
    .map((asset) => asset.trim().toLowerCase())
    .filter(Boolean);
}

function collectHoldings() {
  return [...els.holdingsList.querySelectorAll(".holding-row")]
    .map((row) => {
      const coinId = row.querySelector('[name="coin_id"]').value.trim().toLowerCase();
      const amount = row.querySelector('[name="amount"]').value;
      const averageBuyPrice = row.querySelector('[name="average_buy_price"]').value;
      return {
        coin_id: coinId,
        amount: Number(amount),
        average_buy_price: averageBuyPrice === "" ? null : Number(averageBuyPrice),
      };
    })
    .filter((holding) => holding.coin_id && holding.amount > 0);
}

function sparkline(points = []) {
  const values = points.slice(-40).map(Number).filter((value) => Number.isFinite(value));
  if (values.length < 2) return "";
  const width = 160;
  const height = 38;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const coords = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return `<svg class="sparkline" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${coords}"></polyline></svg>`;
}

function renderMetrics(brief) {
  const sentiment = brief.sentiment || {};
  const global = brief.global || {};
  const generatedAt = brief.generated_at ? new Date(brief.generated_at) : new Date();
  state.lastUpdatedAt = Number.isNaN(generatedAt.getTime()) ? new Date() : generatedAt;
  state.lastError = null;
  els.sentimentMetric.textContent = sentiment.score ? `${sentiment.score}/100` : "--";
  els.sentimentLabel.textContent = sentiment.status || "Neutral";
  els.marketCapMetric.textContent = compactCurrency(global.total_market_cap_usd);
  els.marketCapChange.textContent = `24h ${percent(global.market_cap_change_24h)}`;
  els.btcDominanceMetric.textContent = percent(global.btc_dominance);
  els.ethDominanceMetric.textContent = `ETH ${percent(global.eth_dominance)}`;
  els.assetCount.textContent = `${brief.assets?.length || 0} assets`;
  updateFreshness();
}

function reasonsHtml(item) {
  const reasons = [...(item.reasons || []).slice(0, 2), ...(item.risks || []).slice(0, 1)];
  if (!reasons.length) return "";
  return `<div class="reason-list">${reasons.map((reason) => `<span>${escapeHtml(reason)}</span>`).join("")}</div>`;
}

function renderOpportunities(brief) {
  const rows = brief.opportunities || [];
  if (!rows.length) {
    els.opportunityList.innerHTML = `<div class="empty-state">No market data returned yet.</div>`;
    return;
  }
  els.opportunityList.innerHTML = rows
    .map(
      (item) => `
        <article class="asset-row">
          <div class="asset-title">
            ${logoHtml(item)}
            <div class="asset-name">
              <strong>${escapeHtml(item.name)}</strong>
              <span>${marketLine(item)}</span>
            </div>
          </div>
          <div class="asset-stat">
            <span>Signal</span>
            <strong><span class="signal-pill ${actionClass(item.action)}">${escapeHtml(item.action)}</span></strong>
          </div>
          <div class="asset-stat">
            <span>Price</span>
            <strong>${compactCurrency(item.current_price)}</strong>
            ${sparkline(item.sparkline)}
          </div>
          <div class="asset-stat">
            <span>Score / Risk</span>
            <strong>${escapeHtml(item.score)} / ${escapeHtml(item.risk_level)}</strong>
            <span>${percent(item.change_24h)} today</span>
          </div>
          ${reasonsHtml(item)}
        </article>
      `
    )
    .join("");
}

function renderPortfolio(brief) {
  const rows = brief.portfolio || [];
  if (!rows.length) {
    els.portfolioList.innerHTML = `<div class="empty-state">Add your holdings to get actions based on the positions you already own.</div>`;
    return;
  }
  els.portfolioList.innerHTML = rows
    .map((item) => {
      const holding = item.holding || {};
      const note = holding.note || (item.risks || [])[0] || "Review position size before taking action.";
      return `
        <article class="portfolio-card">
          <div class="portfolio-card-top">
            <div class="portfolio-title">
              ${logoHtml(item)}
              <div>
                <strong>${escapeHtml(item.name)}</strong>
                <span>${marketLine(item)}</span>
              </div>
            </div>
            <span class="signal-pill ${actionClass(item.action)}">${escapeHtml(item.action)}</span>
          </div>
          <div class="portfolio-stats">
            <div class="portfolio-stat">
              <span>Value</span>
              <strong>${compactCurrency(holding.value)}</strong>
            </div>
            <div class="portfolio-stat">
              <span>PnL</span>
              <strong>${percent(holding.unrealized_pnl)}</strong>
            </div>
            <div class="portfolio-stat">
              <span>Score</span>
              <strong>${escapeHtml(item.score)}/100</strong>
            </div>
          </div>
          <div class="risk-line">${escapeHtml(note)}</div>
        </article>
      `;
    })
    .join("");
}

function renderTrending(brief) {
  const rows = brief.trending || [];
  if (!rows.length) {
    els.trendingList.innerHTML = `<div class="empty-state">Trending feed is unavailable.</div>`;
    return;
  }
  els.trendingList.innerHTML = rows
    .map(
      (item) => `
        <div class="trend-item">
          <img src="${escapeHtml(item.thumb)}" alt="">
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(item.symbol)} rank ${escapeHtml(item.market_cap_rank || "--")}</span>
          </div>
        </div>
      `
    )
    .join("");
}

function renderNews(brief) {
  const rows = brief.news || [];
  if (!rows.length) {
    els.newsList.innerHTML = `<div class="empty-state">News feeds are unavailable.</div>`;
    return;
  }
  els.newsList.innerHTML = rows
    .map(
      (item) => `
        <a class="news-item" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(item.published_at || "")}</span>
          </div>
          <span class="news-source">${escapeHtml(item.source)}</span>
        </a>
      `
    )
    .join("");
}

function renderBrief(brief) {
  state.brief = brief;
  renderMetrics(brief);
  renderOpportunities(brief);
  renderPortfolio(brief);
  renderTrending(brief);
  renderNews(brief);
}

function clearAutoRefresh() {
  if (state.refreshTimer) {
    window.clearTimeout(state.refreshTimer);
    state.refreshTimer = null;
  }
  state.nextRefreshAt = null;
}

function scheduleAutoRefresh() {
  clearAutoRefresh();
  if (!els.liveToggle.checked) {
    updateFreshness();
    return;
  }

  const interval = Number(els.refreshInterval.value) || 120000;
  state.nextRefreshAt = Date.now() + interval;
  state.refreshTimer = window.setTimeout(() => analyze({ silent: true }), interval);
  updateFreshness();
}

async function analyze(options = {}) {
  if (state.isFetching) return;
  const silent = Boolean(options.silent);
  state.isFetching = true;
  updateFreshness();
  if (!silent) {
    setLoading(true);
    els.opportunityList.innerHTML = `<div class="loading-state">Fetching live market data...</div>`;
  }
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        market_source: els.marketSource.value,
        quote_asset: els.quoteAsset.value,
        assets: collectAssets(),
        holdings: collectHoldings(),
      }),
    });
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error || "Market analysis failed");
    renderBrief(payload.brief);
    if (!silent) {
      showToast("Market analysis refreshed.");
    }
  } catch (error) {
    state.lastError = error.message;
    updateFreshness();
    if (!silent) {
      showToast(error.message);
      els.opportunityList.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
    }
  } finally {
    state.isFetching = false;
    setLoading(false);
    scheduleAutoRefresh();
  }
}

async function loadStatus() {
  try {
    const response = await fetch("/api/status");
    const payload = await response.json();
    const notifications = payload.notifications || {};
    els.discordStatus.textContent = notifications.discord ? "Ready" : "Not set";
    els.discordStatus.classList.toggle("ready", Boolean(notifications.discord));
    els.whatsappStatus.textContent = notifications.whatsapp ? "Ready" : "Not set";
    els.whatsappStatus.classList.toggle("ready", Boolean(notifications.whatsapp));
  } catch {
    els.discordStatus.textContent = "Unknown";
    els.whatsappStatus.textContent = "Unknown";
  }
}

async function sendAlert() {
  if (!state.brief) {
    showToast("Run an analysis first.");
    return;
  }
  const channels = [];
  if (els.discordChannel.checked) channels.push("discord");
  if (els.whatsappChannel.checked) channels.push("whatsapp");
  if (!channels.length) {
    showToast("Select at least one alert channel.");
    return;
  }
  try {
    const response = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channels, brief: state.brief }),
    });
    const payload = await response.json();
    const sent = (payload.results || []).filter((result) => result.ok).length;
    showToast(sent ? `Alert sent to ${sent} channel(s).` : "No alert channel is configured yet.");
  } catch (error) {
    showToast(error.message);
  }
}

els.addHoldingBtn.addEventListener("click", () => addHoldingRow());
els.refreshBtn.addEventListener("click", analyze);
els.liveToggle.addEventListener("change", scheduleAutoRefresh);
els.refreshInterval.addEventListener("change", scheduleAutoRefresh);
els.marketSource.addEventListener("change", () => {
  if (els.marketSource.value === "binance" && els.assetInput.value.includes("bitcoin")) {
    els.assetInput.value = "INJUSDT, OGUSDT";
  }
  if (els.marketSource.value === "coingecko" && els.assetInput.value.toUpperCase().includes("INJUSDT")) {
    els.assetInput.value = "injective-protocol, og-fan-token";
  }
  analyze();
});
els.quoteAsset.addEventListener("change", analyze);
els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  analyze();
});
els.sendAlertBtn.addEventListener("click", sendAlert);

addHoldingRow({ coin_id: "INJUSDT" });
addHoldingRow({ coin_id: "OGUSDT" });
loadStatus();
state.countdownTimer = window.setInterval(updateFreshness, 1000);
analyze();
