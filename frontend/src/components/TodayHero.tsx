import type { Brief } from '../lib/api'
import { changeColor, compactCurrency, percent } from '../lib/format'
import { useI18n } from '../lib/i18n'
import { IconRefresh } from './Icons'

function greetingKey(): 'greet.morning' | 'greet.afternoon' | 'greet.evening' {
  const h = new Date().getHours()
  return h < 12 ? 'greet.morning' : h < 18 ? 'greet.afternoon' : 'greet.evening'
}

/** Fear & Greed as a calm horizontal scale with a marker, not a dial. */
function MoodScale({ score }: { score?: number }) {
  const v = Math.max(0, Math.min(100, Number(score ?? 50)))
  return (
    <div className="relative mt-2 h-1.5 rounded-full bg-[linear-gradient(90deg,var(--color-weak),var(--color-neutral)_50%,var(--color-strong))] rtl:bg-[linear-gradient(270deg,var(--color-weak),var(--color-neutral)_50%,var(--color-strong))]">
      <span
        className="absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full border-2 border-card bg-text shadow rtl:translate-x-1/2 ltr:-translate-x-1/2"
        style={{ insetInlineStart: `${v}%` }}
        aria-hidden
      />
    </div>
  )
}

export default function TodayHero({
  brief,
  isFetching,
  error,
  updatedAt,
  onRefresh,
}: {
  brief: Brief | undefined
  isFetching: boolean
  error: string | null
  updatedAt: Date | null
  onRefresh: () => void
}) {
  const { t, te } = useI18n()
  const regime = brief?.regime
  const state = regime?.state ?? 'unknown'
  const pct = regime?.distance_pct != null ? `${Math.abs(regime.distance_pct).toFixed(1)}%` : '--'
  const g = brief?.global ?? {}
  const s = brief?.sentiment ?? {}

  const title =
    state === 'risk_on' ? t('hero.on.title') : state === 'risk_off' ? t('hero.off.title') : t('hero.unknown.title')
  const dot = state === 'risk_on' ? 'bg-strong live-dot' : state === 'risk_off' ? 'bg-weak' : 'bg-neutral'

  let status: string
  if (isFetching) status = t('hero.refreshing')
  else if (error) status = t('hero.failed')
  else if (updatedAt)
    status = t('hero.updated', { time: updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
  else status = ''

  return (
    <section className="card hero-wash rise overflow-hidden p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted">{t(greetingKey())} 👋</p>
        <button
          onClick={onRefresh}
          disabled={isFetching}
          className="flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-1 text-xs text-muted transition hover:bg-subtle hover:text-text disabled:cursor-default"
          title={t('hero.refresh')}
        >
          <IconRefresh className={isFetching ? 'spin' : ''} />
          <span className={error ? 'text-down' : ''}>{status}</span>
        </button>
      </div>

      <h1 className="mt-2 flex items-center gap-2.5 text-2xl font-semibold tracking-tight sm:text-3xl">
        <span className={`size-2.5 shrink-0 rounded-full ${dot}`} aria-hidden />
        {title}
      </h1>
      {state !== 'unknown' && (
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
          {t(state === 'risk_on' ? 'hero.on.body' : 'hero.off.body', { pct })}{' '}
          <span className="hidden opacity-80 sm:inline">{t('hero.why')}</span>
        </p>
      )}

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
        <div className="col-span-2 rounded-2xl bg-subtle/70 p-3.5 sm:col-span-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs text-muted">{t('hero.mood')}</p>
            <p className="num text-sm font-semibold">
              {s.score ?? '--'} <span className="font-normal text-muted">· {te(s.status) || '--'}</span>
            </p>
          </div>
          <MoodScale score={s.score} />
        </div>
        <div className="rounded-2xl bg-subtle/70 p-3.5">
          <p className="text-xs text-muted">{t('hero.mcap')}</p>
          <p className="num mt-0.5 text-base font-semibold">
            {compactCurrency(g.total_market_cap_usd)}{' '}
            <span className={`text-xs font-medium ${changeColor(g.market_cap_change_24h)}`} dir="ltr">
              {percent(g.market_cap_change_24h)} {t('hero.24h')}
            </span>
          </p>
        </div>
        <div className="rounded-2xl bg-subtle/70 p-3.5">
          <p className="text-xs text-muted">{t('hero.btcDom')}</p>
          <p className="num mt-0.5 text-base font-semibold" dir="ltr">
            {percent(g.btc_dominance).replace('+', '')}
          </p>
        </div>
      </div>
    </section>
  )
}
