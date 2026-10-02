import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getTrackRecord } from '../lib/api'
import type { Backtest, LiveTrackRecord, LoggedCall, ReturnStats } from '../lib/api'
import { changeColor, percent, ratingKey } from '../lib/format'
import { useI18n } from '../lib/i18n'
import { RatingPill } from './Rating'

const BUCKETS = ['STRONG', 'NEUTRAL', 'WEAK', 'ALL'] as const
type Horizon = '7d' | '30d'

function useShortDate() {
  const { lang } = useI18n()
  return (iso?: string | null) => {
    if (!iso) return '--'
    const locale = lang === 'ar' ? 'ar' : lang === 'fr' ? 'fr-FR' : 'en-US'
    return new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex rounded-full bg-subtle p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
            value === o.value ? 'bg-card text-text shadow-sm' : 'text-muted hover:text-text'
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
 * the middle), then median / % up / calls. The median and hit rate keep the
 * average honest when a few big winners pull it up.
 */
function ReturnRow({ bucket, stats, maxAbs }: { bucket: string; stats?: ReturnStats; maxAbs: number }) {
  const { t } = useI18n()
  const mean = stats?.mean ?? 0
  const width = stats?.n ? Math.min(50, (Math.abs(mean) / maxAbs) * 50) : 0
  const color = bucket === 'ALL' ? 'var(--color-muted)' : `var(--color-${ratingKey(bucket)})`
  return (
    <div className="grid grid-cols-[5.5rem_1fr_4rem] items-center gap-3 sm:grid-cols-[5.5rem_1fr_4rem_4rem_3.5rem_4rem]">
      <div>
        {bucket === 'ALL' ? (
          <span className="text-sm font-medium text-muted">{t('record.allCoins')}</span>
        ) : (
          <RatingPill rating={bucket} size="sm" />
        )}
      </div>
      <div className="relative h-2.5 rounded-full bg-subtle" aria-hidden dir="ltr">
        <span className="absolute inset-y-0 left-1/2 w-px bg-border" />
        <span
          className="absolute inset-y-0 rounded-full"
          style={{ background: color, width: `${width}%`, left: mean >= 0 ? '50%' : `${50 - width}%` }}
        />
      </div>
      <span
        className={`num text-end text-sm font-semibold ${stats?.n ? changeColor(mean) : 'text-muted'}`}
        dir="ltr"
      >
        {stats?.n ? percent(mean) : '--'}
      </span>
      <span className={`num hidden text-end text-sm sm:block ${changeColor(stats?.median)}`} dir="ltr">
        {stats?.n ? percent(stats.median) : '--'}
      </span>
      <span className="num hidden text-end text-sm sm:block">{stats?.n ? `${stats.hit_rate}%` : '--'}</span>
      <span className="num hidden text-end text-xs text-muted sm:block">
        {stats?.n ? stats.n.toLocaleString() : '0'}
      </span>
    </div>
  )
}

function ReturnTable({ get }: { get: (bucket: (typeof BUCKETS)[number]) => ReturnStats | undefined }) {
  const { t } = useI18n()
  const maxAbs = Math.max(1, ...BUCKETS.map((b) => Math.abs(get(b)?.mean ?? 0)))
  return (
    <div className="space-y-2.5">
      <div className="tick-label grid grid-cols-[5.5rem_1fr_4rem] gap-3 sm:grid-cols-[5.5rem_1fr_4rem_4rem_3.5rem_4rem]">
        <span>{t('record.rating')}</span>
        <span />
        <span className="text-end">{t('record.avg')}</span>
        <span className="hidden text-end sm:block">{t('record.median')}</span>
        <span className="hidden text-end sm:block">{t('record.up')}</span>
        <span className="hidden text-end sm:block">{t('record.calls')}</span>
      </div>
      {BUCKETS.map((b) => (
        <ReturnRow key={b} bucket={b} stats={get(b)} maxAbs={maxAbs} />
      ))}
    </div>
  )
}

function HorizonToggle({ value, onChange }: { value: Horizon; onChange: (h: Horizon) => void }) {
  const { t } = useI18n()
  return (
    <Segmented
      options={[
        { value: '7d', label: t('record.7d') },
        { value: '30d', label: t('record.30d') },
      ]}
      value={value}
      onChange={onChange}
    />
  )
}

function BacktestView({ data }: { data: Backtest }) {
  const { t } = useI18n()
  const [horizon, setHorizon] = useState<Horizon>('30d')
  const strong = data.ratings.STRONG[horizon]
  const all = data.ratings.ALL[horizon]
  const days = t(horizon === '30d' ? 'record.30d' : 'record.7d')
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-[15px] leading-relaxed">
            {t('record.headline', {
              strong: percent(strong.mean),
              all: percent(all.mean),
              hit: strong.hit_rate ?? '--',
              days,
            })}
          </p>
          <p className="mt-1 text-xs text-muted">
            {t('record.scope', {
              days: data.coin_days.toLocaleString(),
              coins: data.coins.length,
              from: data.period.start.slice(0, 4),
              to: data.period.end.slice(0, 4),
            })}
          </p>
        </div>
        <HorizonToggle value={horizon} onChange={setHorizon} />
      </div>

      <ReturnTable get={(b) => data.ratings[b][horizon]} />

      <div>
        <p className="mb-2 text-sm font-semibold">{t('record.byYear')}</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {Object.entries(data.by_year).map(([year, v]) => {
            const s = v.STRONG[horizon]
            const a = v.ALL[horizon]
            return (
              <div key={year} className="rounded-2xl bg-subtle/70 p-2.5">
                <p className="num text-xs text-muted">{year}</p>
                <p
                  className={`num text-sm font-semibold ${s.n ? changeColor(s.mean) : 'text-muted'}`}
                  dir="ltr"
                >
                  {s.n ? percent(s.mean) : t('record.noCalls')}
                </p>
                <p className="num text-[11px] text-muted">
                  {s.n ? `${s.n.toLocaleString()} · ` : ''}
                  {t('record.allShort', { v: percent(a.mean) })}
                </p>
              </div>
            )
          })}
        </div>
        <p className="mt-2 text-xs text-muted">{t('record.noCallsNote')}</p>
      </div>

      <details className="rounded-2xl bg-subtle/70 p-3 text-sm">
        <summary className="cursor-pointer font-medium">{t('record.caveats')}</summary>
        <ul className="mt-2 space-y-1 text-muted" dir="ltr">
          {data.caveats.map((c) => (
            <li key={c}>· {c}</li>
          ))}
        </ul>
      </details>
    </div>
  )
}

function CallChips({ rows, showReturn }: { rows: LoggedCall[]; showReturn?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5" dir="ltr">
      {rows.map((r) => (
        <span
          key={r.symbol}
          className="num inline-flex items-center gap-1.5 rounded-full bg-subtle px-2.5 py-1 text-xs"
          title={`${r.symbol} ${r.rating} ${r.score}`}
        >
          <span
            className="size-1.5 rounded-full"
            style={{ background: `var(--color-${ratingKey(r.rating)})` }}
            aria-hidden
          />
          <span className="font-semibold">{r.symbol}</span>
          {showReturn ? (
            <span className={changeColor(r.return)}>{percent(r.return)}</span>
          ) : (
            <span className="text-muted">{r.score}</span>
          )}
        </span>
      ))}
    </div>
  )
}

function LiveView({ data }: { data: LiveTrackRecord }) {
  const { t } = useI18n()
  const shortDate = useShortDate()
  const [horizon, setHorizon] = useState<Horizon>('7d')
  if (data.error) return <p className="text-sm text-down">{data.error}</p>
  if (!data.started_on) return <p className="text-sm text-muted">{t('record.none')}</p>

  const resolved = (data.horizons['7d']?.ratings.ALL?.n ?? 0) > 0
  const order: Record<string, number> = { STRONG: 0, NEUTRAL: 1, WEAK: 2 }
  const today = [...(data.today?.rows ?? [])].sort(
    (a, b) => order[a.rating] - order[b.rating] || b.score - a.score,
  )

  return (
    <div className="space-y-5">
      <p className="text-[15px] leading-relaxed">
        {t('record.liveIntro', {
          n: data.universe.length,
          date: shortDate(data.started_on),
          days: data.days_logged,
        })}
      </p>

      {resolved ? (
        <>
          <HorizonToggle value={horizon} onChange={setHorizon} />
          <ReturnTable get={(b) => data.horizons[horizon]?.ratings[b]} />
          {data.latest_resolved && (
            <div>
              <p className="mb-2 text-sm font-semibold">
                {t('record.resolved', {
                  date: shortDate(data.latest_resolved.day),
                  n: data.latest_resolved.horizon,
                })}
              </p>
              <CallChips rows={data.latest_resolved.rows} showReturn />
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border-strong bg-gold-soft/60 p-4 text-sm">
          {t('record.firstResults', { date: shortDate(data.first_results_on) })}
        </div>
      )}

      {today.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold">{t('record.todayCalls')}</p>
          <CallChips rows={today} />
        </div>
      )}
    </div>
  )
}

export default function TrackRecord() {
  const { t } = useI18n()
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
    <section className="space-y-4">
      <div className="px-1">
        <h2 className="text-2xl font-semibold tracking-tight">{t('record.title')}</h2>
        <p className="text-sm text-muted">{t('record.sub')}</p>
      </div>
      <div className="card rise p-5">
        <div className="mb-5">
          <Segmented
            options={[
              { value: 'live', label: t('record.live') },
              { value: 'backtest', label: t('record.backtest') },
            ]}
            value={active}
            onChange={setTab}
          />
        </div>
        {query.isLoading && (
          <p className="text-sm text-muted">
            {t('record.loading')}
            <span className="caret">▋</span>
          </p>
        )}
        {query.error && <p className="text-sm text-down">{(query.error as Error).message}</p>}
        {data && active === 'live' && <LiveView data={data.live} />}
        {data && active === 'backtest' && data.backtest && <BacktestView data={data.backtest} />}
      </div>
    </section>
  )
}
