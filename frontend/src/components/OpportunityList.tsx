import type { Brief, Opportunity } from '../lib/api'
import { actionKey, actionStyles, changeColor, compactCurrency, percent } from '../lib/format'
import Sparkline from './Sparkline'

function CoinBadge({ item }: { item: Opportunity }) {
  const symbol = (item.symbol || '?').slice(0, 4).toUpperCase()
  return item.image ? (
    <img src={item.image} alt="" className="size-8 rounded-full" />
  ) : (
    <span className="num grid size-8 place-items-center rounded-full border border-line-2 bg-panel-2 text-[10px] text-teal">
      {symbol}
    </span>
  )
}

function marketLine(item: Opportunity): string {
  if (item.pair) return `${item.pair} · ${item.source || 'Market'}`
  return `${(item.symbol || '').toUpperCase()} · rank ${item.market_cap_rank ?? '--'}`
}

export function SignalPill({ action }: { action?: string }) {
  const key = actionKey(action)
  return (
    <span
      className={`rounded-md border px-2 py-0.5 font-display text-[11px] font-semibold tracking-widest uppercase ${actionStyles[key]}`}
    >
      {key}
    </span>
  )
}

function SignalCard({ item, delay }: { item: Opportunity; delay: number }) {
  const up = Number(item.change_24h ?? 0) >= 0
  const notes = [...(item.reasons ?? []).slice(0, 2), ...(item.risks ?? []).slice(0, 1)]
  return (
    <article
      className="glass rise grid grid-cols-2 gap-x-4 gap-y-2 p-4 transition hover:border-line-2 sm:grid-cols-[1.4fr_auto_1fr_1fr]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3">
        <CoinBadge item={item} />
        <div className="min-w-0">
          <p className="truncate font-display font-semibold">{item.name || item.symbol}</p>
          <p className="num truncate text-xs text-mute">{marketLine(item)}</p>
        </div>
      </div>

      <div className="flex items-center justify-end sm:justify-center">
        <SignalPill action={item.action} />
      </div>

      <div>
        <p className="tick-label">price</p>
        <p className="num font-semibold">{compactCurrency(item.current_price)}</p>
        <Sparkline points={item.sparkline} up={up} />
      </div>

      <div>
        <p className="tick-label">score / risk</p>
        <p className="num font-semibold">
          {item.score ?? '--'} <span className="text-mute">/ {item.risk_level ?? '--'}</span>
        </p>
        <p className={`num text-xs ${changeColor(item.change_24h)}`}>
          {percent(item.change_24h)} today · {percent(item.change_7d)} 7d
        </p>
      </div>

      {notes.length > 0 && (
        <div className="col-span-2 flex flex-wrap gap-1.5 sm:col-span-4">
          {notes.map((note) => (
            <span
              key={note}
              className="rounded border border-line bg-panel-2/60 px-2 py-0.5 text-[11px] text-mute"
            >
              {note}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

export default function OpportunityList({
  brief,
  isLoading,
  error,
}: {
  brief: Brief | undefined
  isLoading: boolean
  error: string | null
}) {
  const rows = brief?.opportunities ?? []
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-display text-sm font-semibold tracking-widest text-teal uppercase">
          Ranked signals
        </h2>
        {brief?.errors && brief.errors.length > 0 && (
          <span className="text-xs text-hold">{brief.errors[0]}</span>
        )}
      </div>
      <div className="space-y-3">
        {isLoading && rows.length === 0 && (
          <div className="glass num p-6 text-center text-sm text-mute">
            fetching live market data<span className="caret">▋</span>
          </div>
        )}
        {!isLoading && error && rows.length === 0 && (
          <div className="glass p-6 text-center text-sm text-sell">{error}</div>
        )}
        {!isLoading && !error && rows.length === 0 && (
          <div className="glass p-6 text-center text-sm text-mute">No market data returned yet.</div>
        )}
        {rows.map((item, i) => (
          <SignalCard key={item.pair || item.symbol || i} item={item} delay={60 + i * 50} />
        ))}
      </div>
    </section>
  )
}
