import type { Brief, HoldingInput } from '../lib/api'
import type { AdvisorConfig } from '../hooks/useBrief'
import { compactCurrency, percent, changeColor } from '../lib/format'
import DeskHead from './DeskHead'
import { RatingPill } from './OpportunityList'
import ScoreMeter from './ScoreMeter'

interface PortfolioPanelProps {
  brief: Brief | undefined
  config: AdvisorConfig
  onConfigChange: (next: AdvisorConfig) => void
}

// min-w-0 lets the inputs shrink inside the holdings grid — without it their
// intrinsic width (~170px each) forces the whole page wider than small screens
const inputClass =
  'num w-full min-w-0 rounded-md border border-line bg-panel-2/80 px-2.5 py-1.5 text-xs outline-none transition focus:border-line-2'

export default function PortfolioPanel({ brief, config, onConfigChange }: PortfolioPanelProps) {
  const rows = brief?.portfolio ?? []

  const setHolding = (index: number, patch: Partial<HoldingInput>) => {
    const holdings = config.holdings.map((h, i) => (i === index ? { ...h, ...patch } : h))
    onConfigChange({ ...config, holdings })
  }

  const switchSource = (source: string) => {
    let assetsRaw = config.assetsRaw
    if (source === 'binance' && assetsRaw.includes('bitcoin')) assetsRaw = 'BTCUSDT, ETHUSDT'
    if (source === 'coingecko' && assetsRaw.toUpperCase().includes('BTCUSDT'))
      assetsRaw = 'bitcoin, ethereum'
    onConfigChange({ ...config, marketSource: source, assetsRaw })
  }

  return (
    <section className="glass rise p-4" style={{ animationDelay: '140ms' }}>
      <DeskHead
        title="Watchlist & portfolio"
        meta={rows.length > 0 ? `${rows.length} position${rows.length === 1 ? '' : 's'}` : undefined}
      />

      <div className="mt-3 grid grid-cols-2 gap-2">
        <label className="block">
          <span className="tick-label">source</span>
          <select
            value={config.marketSource}
            onChange={(e) => switchSource(e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="binance">Binance Spot</option>
            <option value="coingecko">CoinGecko</option>
          </select>
        </label>
        <label className="block">
          <span className="tick-label">quote</span>
          <select
            value={config.quoteAsset}
            onChange={(e) => onConfigChange({ ...config, quoteAsset: e.target.value })}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="USDT">USDT</option>
            <option value="USDC">USDC</option>
            <option value="BTC">BTC</option>
          </select>
        </label>
      </div>

      <label className="mt-2 block">
        <span className="tick-label">assets (comma separated)</span>
        <input
          type="text"
          value={config.assetsRaw}
          onChange={(e) => onConfigChange({ ...config, assetsRaw: e.target.value })}
          placeholder="BTCUSDT, ETHUSDT"
          className={inputClass}
        />
      </label>

      <div className="mt-3 space-y-2">
        <span className="tick-label">holdings</span>
        {config.holdings.map((h, i) => (
          <div key={i} className="grid grid-cols-[1.2fr_1fr_1fr_auto] gap-1.5">
            <input
              type="text"
              value={h.coin_id}
              placeholder="coin"
              aria-label="Coin"
              onChange={(e) => setHolding(i, { coin_id: e.target.value })}
              className={inputClass}
            />
            <input
              type="number"
              value={h.amount}
              min={0}
              step="any"
              placeholder="amount"
              aria-label="Amount"
              onChange={(e) =>
                setHolding(i, { amount: e.target.value === '' ? '' : Number(e.target.value) })
              }
              className={inputClass}
            />
            <input
              type="number"
              value={h.average_buy_price}
              min={0}
              step="any"
              placeholder="avg buy"
              aria-label="Average buy price"
              onChange={(e) =>
                setHolding(i, {
                  average_buy_price: e.target.value === '' ? '' : Number(e.target.value),
                })
              }
              className={inputClass}
            />
            <button
              type="button"
              aria-label="Remove holding"
              onClick={() =>
                onConfigChange({
                  ...config,
                  holdings: config.holdings.filter((_, idx) => idx !== i),
                })
              }
              className="cursor-pointer rounded-md border border-line px-2 text-xs text-mute transition hover:border-sell/40 hover:text-sell"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onConfigChange({
              ...config,
              holdings: [...config.holdings, { coin_id: '', amount: '', average_buy_price: '' }],
            })
          }
          className="w-full cursor-pointer rounded-md border border-dashed border-line py-1.5 text-xs text-mute transition hover:border-line-2 hover:text-teal"
        >
          + add holding
        </button>
      </div>

      {rows.length > 0 && (
        <div className="mt-4 space-y-2">
          {rows.map((item, i) => {
            const holding = item.holding ?? {}
            return (
              <div
                key={item.pair || item.symbol || i}
                className="rounded-lg border border-line bg-panel-2/60 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm font-semibold">{item.name || item.symbol}</p>
                  <RatingPill rating={item.rating} />
                </div>
                <div className="num mt-2 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="tick-label">value</p>
                    <p className="font-semibold">{compactCurrency(holding.value)}</p>
                  </div>
                  <div>
                    <p className="tick-label">pnl</p>
                    <p className={`font-semibold ${changeColor(holding.unrealized_pnl)}`}>
                      {percent(holding.unrealized_pnl)}
                    </p>
                  </div>
                  <div>
                    <p className="tick-label">score</p>
                    <p className="font-semibold">{item.score ?? '--'}/100</p>
                  </div>
                </div>
                <ScoreMeter score={item.score} rating={item.rating} className="mt-2" />
                <p className="mt-2 text-[11px] leading-snug text-mute">
                  {holding.note || item.risks?.[0] || "The rating describes the coin's setup, not your position."}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
