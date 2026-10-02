import type { Brief, Opportunity } from '../lib/api'
import {
  changeColor,
  compactCurrency,
  percent,
  ratingKey,
  ratingStyles,
  STRONG_MIN,
  WEAK_MAX,
} from '../lib/format'
import ScoreBreakdown from './ScoreBreakdown'
import ScoreMeter from './ScoreMeter'
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

const ratingGlyph = { strong: '▲', neutral: '■', weak: '▼' } as const

/** The coin's setup rating — a description of its chart, never an instruction. */
export function RatingPill({ rating }: { rating?: string }) {
  const key = ratingKey(rating)
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-display text-[11px] font-semibold tracking-widest uppercase ${ratingStyles[key]}`}
      title={`${key} setup`}
    >
      <span aria-hidden className="text-[8px]">
        {ratingGlyph[key]}
      </span>
      {key}
    </span>
  )
}

/** Reasons contributed to the score (+); risks warn against it (!). */
function NoteChip({ text, kind }: { text: string; kind: 'reason' | 'risk' }) {
  return (
    <span className="rounded border border-line bg-panel-2/60 px-2 py-0.5 text-[11px] text-mute">
      <b
        className={`num mr-1 font-semibold ${kind === 'risk' ? 'text-hold' : 'text-teal-dim'}`}
        aria-hidden
      >
        {kind === 'risk' ? '!' : '+'}
      </b>
      {text}
    </span>
  )
}

function SetupCard({ item, delay }: { item: Opportunity; delay: number }) {
  // the sparkline draws the 7-day window, so its color follows the 7d change
  const up = Number(item.change_7d ?? item.change_24h ?? 0) >= 0
  const notes = [
    ...(item.reasons ?? []).slice(0, 2).map((text) => ({ text, kind: 'reason' as const })),
    ...(item.risks ?? []).slice(0, 1).map((text) => ({ text, kind: 'risk' as const })),
  ]
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

      <div className="flex flex-col items-end justify-center gap-1 sm:items-center">
        <RatingPill rating={item.rating} />
        {item.score_breakdown?.cap && (
          <span className="tick-label !text-[9px] !text-weak" title={item.score_breakdown.cap.reason}>
            capped · risk-off
          </span>
        )}
      </div>

      <div>
        <p className="tick-label">price</p>
        <p className="num font-semibold">{compactCurrency(item.current_price)}</p>
        <Sparkline points={item.sparkline} up={up} />
      </div>

      <div>
        <p className="tick-label">score / risk</p>
        <ScoreBreakdown
          score={item.score}
          riskLevel={item.risk_level}
          breakdown={item.score_breakdown}
        />
        <ScoreMeter score={item.score} rating={item.rating} className="mt-1.5" />
        <p className={`num mt-1.5 text-xs ${changeColor(item.change_24h)}`}>
          {percent(item.change_24h)} today · {percent(item.change_7d)} 7d
        </p>
      </div>

      {notes.length > 0 && (
        <div className="col-span-2 flex flex-wrap gap-1.5 sm:col-span-4">
          {notes.map((note) => (
            <NoteChip key={note.text} text={note.text} kind={note.kind} />
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
      <div className="mb-3 flex items-center gap-3">
        <h2 className="font-display text-sm font-semibold tracking-widest text-teal uppercase">
          Ranked setups
        </h2>
        <span className="h-px min-w-4 flex-1 bg-line" aria-hidden />
        {brief?.errors && brief.errors.length > 0 ? (
          <span className="shrink-0 text-xs text-hold">{brief.errors[0]}</span>
        ) : (
          <span className="tick-label shrink-0" title="The engine's rating thresholds">
            strong ≥{STRONG_MIN} · weak ≤{WEAK_MAX}
          </span>
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
          <SetupCard key={item.pair || item.symbol || i} item={item} delay={60 + i * 50} />
        ))}
      </div>
    </section>
  )
}
