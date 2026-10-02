import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getTrackRecord } from '../lib/api'
import type { Backtest, LiveTrackRecord, LoggedCall, ReturnStats } from '../lib/api'
import { changeColor, percent, ratingKey } from '../lib/format'
import DeskHead from './DeskHead'
import { RatingPill } from './OpportunityList'

const BUCKETS = ['STRONG', 'NEUTRAL', 'WEAK', 'ALL'] as const
type Horizon = '7d' | '30d'

function shortDate(iso?: string | null): string {
  if (!iso) return '--'
  const d = new Date(`${iso}T00:00:00Z`)
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

function Toggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex rounded-md border border-line p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`cursor-pointer rounded px-2.5 py-1 font-display text-[11px] font-semibold tracking-widest uppercase transition ${
            value === o.value ? 'bg-teal/15 text-teal' : 'text-mute hover:text-fg'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/**
 * One rating bucket: a diverging bar for the average forward return (zero in
 * the middle), then median / % up / sample size — the median and hit rate
 * keep the average honest when a few big winners pull it up.
 */
function ReturnRow({ bucket, stats, maxAbs }: { bucket: string; stats?: ReturnStats; maxAbs: number }) {
  const mean = stats?.mean ?? 0
  const width = stats?.n ? Math.min(50, (Math.abs(mean) / maxAbs) * 50) : 0
  const color = bucket === 'ALL' ? 'var(--color-mute)' : `var(--color-${ratingKey(bucket)})`
  return (
    <div className="grid grid-cols-[5.5rem_1fr_3.5rem] items-center gap-3 sm:grid-cols-[5.5rem_1fr_3.5rem_3.5rem_3rem_3.5rem]">
      <div>
        {bucket === 'ALL' ? (
          <span className="tick-label !text-fg">all coins</span>
        ) : (
          <RatingPill rating={bucket} />
        )}
      </div>
      <div className="relative h-3 rounded-sm bg-panel-2" aria-hidden>
        <span className="absolute inset-y-0 left-1/2 w-px bg-line-2" />
        <span
          className="absolute inset-y-0.5 rounded-sm opacity-80"
          style={{
            background: color,
            width: `${width}%`,
            left: mean >= 0 ? '50%' : `${50 - width}%`,
          }}
        />
      </div>
      <span className={`num text-right text-xs font-semibold ${stats?.n ? changeColor(mean) : 'text-mute'}`}>
        {stats?.n ? percent(mean) : '--'}
      </span>
      <span className={`num hidden text-right text-xs sm:block ${changeColor(stats?.median)}`}>
        {stats?.n ? percent(stats.median) : '--'}
      </span>
      <span className="num hidden text-right text-xs text-fg sm:block">
        {stats?.n ? `${stats.hit_rate}%` : '--'}
      </span>
      <span className="num hidden text-right text-[11px] text-mute sm:block">
        {stats?.n ? stats.n.toLocaleString() : '0'}
      </span>
    </div>
  )
}

function ReturnTable({
  get,
}: {
  get: (bucket: (typeof BUCKETS)[number]) => ReturnStats | undefined
}) {
  const maxAbs = Math.max(1, ...BUCKETS.map((b) => Math.abs(get(b)?.mean ?? 0)))
  return (
    <div className="space-y-2">
      <div className="tick-label grid grid-cols-[5.5rem_1fr_3.5rem] gap-3 !text-[9px] sm:grid-cols-[5.5rem_1fr_3.5rem_3.5rem_3rem_3.5rem]">
        <span>rating</span>
        <span className="text-center">avg forward return</span>
        <span className="text-right">avg</span>
        <span className="hidden text-right sm:block">median</span>
        <span className="hidden text-right sm:block">% up</span>
        <span className="hidden text-right sm:block">calls</span>
      </div>
      {BUCKETS.map((b) => (
        <ReturnRow key={b} bucket={b} stats={get(b)} maxAbs={maxAbs} />
      ))}
    </div>
  )
}

function BacktestView({ data }: { data: Backtest }) {
  const [horizon, setHorizon] = useState<Horizon>('30d')
  const strong = data.ratings.STRONG[horizon]
  const all = data.ratings.ALL[horizon]
  const days = horizon === '30d' ? '30 days' : '7 days'
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-xl text-[13px] leading-relaxed text-mute">
          Over {data.coin_days.toLocaleString()} coin-days ({data.coins.length} coins,{' '}
          {data.period.start.slice(0, 4)}–{data.period.end.slice(0, 4)}), coins rated{' '}
          <strong className="text-strong">Strong</strong> returned{' '}
          <strong className="text-fg">{percent(strong.mean)}</strong> on average over the next {days},
          vs <strong className="text-fg">{percent(all.mean)}</strong> for all coins. Only{' '}
          <strong className="text-fg">{strong.hit_rate}%</strong> of them were up, though: the edge
          comes from bigger winners, not more frequent ones.
        </p>
        <Toggle
          options={[
            { value: '7d', label: '7 days' },
            { value: '30d', label: '30 days' },
          ]}
          value={horizon}
          onChange={setHorizon}
        />
      </div>

      <ReturnTable get={(b) => data.ratings[b][horizon]} />

      <div>
        <p className="tick-label mb-2">by year · avg {days} return</p>
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {Object.entries(data.by_year).map(([year, v]) => {
            const s = v.STRONG[horizon]
            const a = v.ALL[horizon]
            return (
              <div key={year} className="rounded-md border border-line bg-panel-2/60 px-2 py-1.5">
                <p className="num text-[11px] font-semibold text-fg">{year}</p>
                <p className={`num text-xs font-semibold ${s.n ? changeColor(s.mean) : 'text-mute'}`}>
                  {s.n ? percent(s.mean) : 'no calls'}
                </p>
                <p className="num text-[10px] text-mute">
                  {s.n ? `${s.n.toLocaleString()} calls · ` : ''}all {percent(a.mean)}
                </p>
              </div>
            )
          })}
        </div>
        <p className="mt-1.5 text-[11px] text-mute">
          Top line: Strong setups. "No calls" means BTC spent the year below its 200-day average,
          so the risk-off cap kept every coin out of Strong.
        </p>
      </div>

      <ul className="space-y-0.5 border-t border-line pt-3 text-[11px] leading-relaxed text-mute">
        {data.caveats.map((c) => (
          <li key={c}>· {c}</li>
        ))}
      </ul>
    </div>
  )
}

function CallChips({ rows, showReturn }: { rows: LoggedCall[]; showReturn?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {rows.map((r) => (
        <span
          key={r.symbol}
          className="num inline-flex items-center gap-1.5 rounded border border-line bg-panel-2/60 px-2 py-0.5 text-[11px]"
          title={`${r.symbol}: ${r.rating.toLowerCase()} setup, score ${r.score}`}
        >
          <span
            className="size-1.5 rounded-full"
            style={{ background: `var(--color-${ratingKey(r.rating)})` }}
            aria-hidden
          />
          <span className="font-semibold text-fg">{r.symbol}</span>
          {showReturn ? (
            <span className={changeColor(r.return)}>{percent(r.return)}</span>
          ) : (
            <span className="text-mute">{r.score}</span>
          )}
        </span>
      ))}
    </div>
  )
}

function LiveView({ data }: { data: LiveTrackRecord }) {
  const [horizon, setHorizon] = useState<Horizon>('7d')
  if (data.error) return <p className="text-sm text-weak">Track record unavailable: {data.error}</p>
  if (!data.started_on) return <p className="text-sm text-mute">No calls logged yet.</p>

  const resolved = (data.horizons['7d']?.ratings.ALL?.n ?? 0) > 0
  const order = { STRONG: 0, NEUTRAL: 1, WEAK: 2 } as Record<string, number>
  const today = [...(data.today?.rows ?? [])].sort(
    (a, b) => order[a.rating] - order[b.rating] || b.score - a.score,
  )

  return (
    <div className="space-y-4">
      <p className="text-[13px] leading-relaxed text-mute">
        Every day the same <strong className="text-fg">{data.universe.length} coins</strong> are rated
        and the call is logged once and never edited. Results are computed from the logged prices,{' '}
        <strong className="text-fg">losses included</strong>. Logging since{' '}
        <strong className="text-fg">{shortDate(data.started_on)}</strong> ·{' '}
        {data.days_logged} day{data.days_logged === 1 ? '' : 's'} logged.
      </p>

      {resolved ? (
        <>
          <div className="flex justify-end">
            <Toggle
              options={[
                { value: '7d', label: '7 days' },
                { value: '30d', label: '30 days' },
              ]}
              value={horizon}
              onChange={setHorizon}
            />
          </div>
          <ReturnTable get={(b) => data.horizons[horizon]?.ratings[b]} />
          {data.latest_resolved && (
            <div>
              <p className="tick-label mb-2">
                calls from {shortDate(data.latest_resolved.day)} · {data.latest_resolved.horizon} days later
              </p>
              <CallChips rows={data.latest_resolved.rows} showReturn />
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-dashed border-line-2 bg-teal/5 px-3 py-2.5 text-[13px] text-mute">
          First 7-day results land on{' '}
          <strong className="text-teal">{shortDate(data.first_results_on)}</strong>. Until then,
          the backtest tab shows how these rules did on 2021–26 data.
        </div>
      )}

      {today.length > 0 && (
        <div>
          <p className="tick-label mb-2">today's logged calls · score</p>
          <CallChips rows={today} />
        </div>
      )}
    </div>
  )
}

export default function TrackRecord() {
  const query = useQuery({
    queryKey: ['track-record'],
    queryFn: getTrackRecord,
    staleTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  })
  const [tab, setTab] = useState<'live' | 'backtest' | null>(null)
  const data = query.data
  const hasLiveResults = (data?.live.horizons?.['7d']?.ratings.ALL?.n ?? 0) > 0
  // Until live results exist, open on the backtest — it's the evidence there is.
  const active = tab ?? (hasLiveResults || !data?.backtest ? 'live' : 'backtest')

  return (
    <section className="glass rise p-4" style={{ animationDelay: '240ms' }}>
      <DeskHead title="Track record" meta="every call · losses included" />
      <div className="mt-3 mb-4">
        <Toggle
          options={[
            { value: 'live', label: 'Live log' },
            { value: 'backtest', label: 'Backtest 2021–26' },
          ]}
          value={active}
          onChange={setTab}
        />
      </div>
      {query.isLoading && (
        <p className="num text-sm text-mute">
          loading the record<span className="caret">▋</span>
        </p>
      )}
      {query.error && <p className="text-sm text-weak">{(query.error as Error).message}</p>}
      {data && active === 'live' && <LiveView data={data.live} />}
      {data && active === 'backtest' && data.backtest && <BacktestView data={data.backtest} />}
    </section>
  )
}
