import { useState } from 'react'
import type { Brief } from '../lib/api'
import { changeColor, compactCurrency, percent } from '../lib/format'
import { useI18n } from '../lib/i18n'
import Caption from './brand/Caption'
import type { Mood } from './brand/Mascot'
import { IconRefresh } from './Icons'
import MascotSays from './MascotSays'

// The market weather is this screen's one idea: the caption names it, the gold
// bar wears it on its face and says why. The numbers behind it are one quiet row.
const FACE: Record<string, Mood> = { calm: 'happy', choppy: 'thinking', stormy: 'worried' }

/** Fear & Greed as a hairline with one ink dot: where the crowd stands between fear and greed. */
function MoodScale({ score }: { score?: number }) {
  const v = Math.max(0, Math.min(100, Number(score ?? 50)))
  return (
    <div className="relative mt-2 h-[3px] max-w-24 rounded-full bg-text/15" aria-hidden>
      <span
        className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-text rtl:translate-x-1/2 ltr:-translate-x-1/2"
        style={{ insetInlineStart: `${v}%` }}
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
  const [why, setWhy] = useState(false)
  const w = brief?.weather
  const state = w?.state ?? 'unknown'
  const pct = w?.vs_ma50_pct != null ? `${Math.abs(w.vs_ma50_pct).toFixed(1)}%` : '--'
  const g = brief?.global ?? {}
  const s = brief?.sentiment ?? {}

  const title = state === 'unknown' ? t('hero.unknown.title') : t(`weather.${state}.title`)
  let body = ''
  if (state === 'calm') body = t('weather.calm.body', { pct })
  else if (state === 'stormy') body = t('weather.stormy.body')
  else if (state === 'choppy')
    body = w?.above_ma50
      ? t('weather.choppy.hot', { why: (w.hot ?? []).map((h) => t(`weather.hot.${h}`)).join(', ') })
      : t('weather.choppy.dip', { pct })

  let status: string
  if (isFetching) status = t('hero.refreshing')
  else if (error) status = t('hero.failed')
  else if (updatedAt)
    // Western digits whatever the phone's language; the isolates keep "12:36 AM" in one piece inside Arabic
    status = t('hero.updated', {
      time: `⁦${updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', numberingSystem: 'latn' })}⁩`,
    })
  else status = ''

  return (
    <section className="grid gap-y-5 md:grid-cols-2 md:items-center md:gap-x-12 md:pt-6">
      <Caption
        as="h1"
        text={title}
        className="pt-1 text-[clamp(2.75rem,13.5vw,4rem)] md:col-start-1 md:row-start-1 md:self-end md:text-[4.5rem] ltr:text-[clamp(2.4rem,11vw,3.4rem)] ltr:md:text-[4rem]"
      />

      <div className="md:col-start-2 md:row-span-2 md:row-start-1">
        <MascotSays mood={FACE[state] ?? 'thinking'} size={104}>
          {body}
        </MascotSays>
        {body && (
          <div className="mt-1 text-sm">
            <button type="button" onClick={() => setWhy((v) => !v)} aria-expanded={why} className="alt text-muted">
              {t('weather.whyAsk')}
            </button>
            {why && <p className="mt-2 max-w-md text-muted">{t('weather.why')}</p>}
          </div>
        )}
      </div>

      <div className="md:col-start-1 md:row-start-2 md:self-start">
        {/* names on one line, numbers on the next, so a name that wraps never pushes its number down */}
        <dl className="grid grid-cols-3 gap-x-4 text-[13px]">
          <div className="contents">
            <dt className="col-start-1 row-start-1 self-end text-muted">{t('hero.mood')}</dt>
            <dd className="num col-start-1 row-start-2 mt-0.5 text-[15px] font-semibold">
              {s.score ?? '--'}
              <span className="block text-[13px] font-medium">{te(s.status)}</span>
              <MoodScale score={s.score} />
            </dd>
          </div>
          <div className="contents">
            <dt className="col-start-2 row-start-1 self-end text-muted">{t('hero.mcap')}</dt>
            <dd className="num col-start-2 row-start-2 mt-0.5 text-[15px] font-semibold">
              <span dir="ltr">{compactCurrency(g.total_market_cap_usd)}</span>
              <span className="block text-[13px] font-medium whitespace-nowrap">
                <span className={changeColor(g.market_cap_change_24h)} dir="ltr">
                  {percent(g.market_cap_change_24h)}
                </span>{' '}
                <span className="font-normal text-muted">{t('hero.24h')}</span>
              </span>
            </dd>
          </div>
          <div className="contents">
            <dt className="col-start-3 row-start-1 self-end text-muted">{t('hero.btcDom')}</dt>
            <dd className="num col-start-3 row-start-2 mt-0.5 text-[15px] font-semibold">
              <span dir="ltr">{percent(g.btc_dominance).replace('+', '')}</span>
            </dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          title={t('hero.refresh')}
          className="link mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-md text-[13px] text-muted transition hover:text-text disabled:cursor-default"
        >
          <IconRefresh className={isFetching ? 'spin' : ''} />
          <span className={error ? 'text-down' : ''}>{status}</span>
        </button>
      </div>
    </section>
  )
}
