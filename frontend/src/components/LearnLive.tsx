import { useMemo } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { Brief, Opportunity } from '../lib/api'
import { compactCurrency, percent } from '../lib/format'
import { useI18n } from '../lib/i18n'
import { useLearnText } from '../lib/learnText'
import type { LiveLink } from '../lib/lessons'
import type { View } from '../lib/views'
import { CoinIcon, KaratBadge } from './Rating'

// A lesson's live example: today's real numbers for what it just taught, as a
// ticket (a record of today), with one way out to the screen it comes from.

// A ticket is white paper on a light and a dark page alike, so everything on
// it keeps the light page's ink.
const ON_PAPER = {
  '--color-text': '#15171c',
  '--color-muted': '#5e6068',
  '--color-subtle': '#f1eee7',
  '--color-border': 'rgba(21, 23, 28, 0.08)',
} as CSSProperties

// the rating hues, dark enough for small text on white
const INK = { up: 'text-[#0b7a55]', down: 'text-[#c2363c]', warn: 'text-[#a14a06]', none: 'text-[#5e6068]' }
const RISK_INK = { low: INK.up, medium: INK.warn, high: INK.down }

function Row({ label, children, tone = '' }: { label: string; children: ReactNode; tone?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt>{label}</dt>
      <dd dir="ltr" className={`num font-semibold ${tone}`}>
        {children}
      </dd>
    </div>
  )
}

/** One coin today: its price, its risk, a normal day and a rough month. */
function CoinStub({ item, label }: { item: Opportunity; label?: string }) {
  const { t } = useI18n()
  const { lt } = useLearnText()
  const g = item.grade
  const symbol = (item.symbol || '').toUpperCase()
  const change = item.change_24h
  return (
    <div>
      {label && <p className="mb-1.5 text-[13.5px] text-muted">{label}</p>}
      <div className="flex items-center gap-3">
        <CoinIcon symbol={symbol} image={item.image} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">
            <bdi>{item.name || symbol}</bdi>
          </p>
          <p className="num text-[13.5px]" dir="ltr">
            {compactCurrency(item.current_price)}{' '}
            <span className={change == null ? INK.none : change >= 0 ? INK.up : INK.down}>{percent(change)}</span>
          </p>
        </div>
        <KaratBadge karat={g?.karat} size="sm" />
      </div>
      {g && (
        <>
          {g.risk && <p className={`mt-2.5 text-[13.5px] font-semibold ${RISK_INK[g.risk]}`}>{t(`risk.${g.risk}`)}</p>}
          <dl className="mt-1 grid gap-y-1">
            <Row label={lt('liveTypicalDay')}>±{g.typical_day_pct.toFixed(1)}%</Row>
            <Row label={lt('liveRoughMonth')} tone={INK.down}>
              {g.rough_month_pct.toFixed(0)}%
            </Row>
          </dl>
          <p className="mt-1 text-[13.5px] text-muted">{lt('liveOn100', { v: Math.max(0, Math.round(100 + g.rough_month_pct)) })}</p>
        </>
      )}
    </div>
  )
}

export default function LiveTicket({ live, brief, onView }: { live: LiveLink; brief: Brief | undefined; onView: (v: View) => void }) {
  const { tx, lt } = useLearnText()
  const coins = useMemo(() => (brief?.opportunities ?? []).filter((o) => o.grade), [brief])
  const findCoin = (sym: string) => coins.find((o) => (o.symbol || '').toUpperCase() === sym) ?? coins[0]

  let body: ReactNode = null
  let exit: { label: string; view: View } = { label: lt('openCoins'), view: 'today' }
  if (live.kind === 'view') {
    exit = { label: tx(live.label), view: live.view }
  } else if (!brief) {
    body = <p className="text-muted">{lt('liveLoading')}</p>
  } else if (live.kind === 'coin') {
    const item = findCoin(live.symbol)
    body = item ? <CoinStub item={item} /> : null
  } else if (live.kind === 'risk') {
    const btc = findCoin('BTC')
    const riskiest = [...coins]
      .filter((o) => o !== btc)
      .sort((a, b) => (b.grade?.typical_day_pct ?? 0) - (a.grade?.typical_day_pct ?? 0))[0]
    body = (
      <>
        {btc && <CoinStub item={btc} />}
        {btc && riskiest && <div className="ticket-rule my-3.5" />}
        {riskiest && <CoinStub item={riskiest} label={lt('liveRiskiest')} />}
      </>
    )
  } else if (live.kind === 'weather') {
    const w = brief.weather
    const state = w?.state ?? 'unknown'
    const word =
      state === 'calm' ? lt('weatherCalm') : state === 'choppy' ? lt('weatherChoppy') : state === 'stormy' ? lt('weatherStormy') : '--'
    const tone = state === 'calm' ? INK.up : state === 'choppy' ? INK.warn : state === 'stormy' ? INK.down : ''
    const fg = w?.fear_greed ?? brief.sentiment?.score
    body = (
      <dl className="grid gap-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <dt>{lt('weatherToday')}</dt>
          <dd className={`poster text-[22px] ${tone}`}>{word}</dd>
        </div>
        <Row label={lt('liveMood')}>{fg != null ? `${Math.round(Number(fg))} / 100` : '--'}</Row>
      </dl>
    )
  } else {
    // karat ladder
    const sorted = [...coins].sort((a, b) => (b.grade?.karat ?? 0) - (a.grade?.karat ?? 0)).slice(0, 8)
    body = (
      <>
        <p className="text-[13.5px] text-muted">{lt('karatToday')}</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2.5">
          {sorted.map((o) => (
            <li key={o.symbol} className="flex items-center gap-1.5">
              <KaratBadge karat={o.grade?.karat} size="sm" />
              <span className="font-semibold" dir="ltr">
                {(o.symbol || '').toUpperCase()}
              </span>
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <div className="ticket-wrap mx-auto w-[calc(100%-1.25rem)] max-w-sm" style={ON_PAPER}>
      <div className="ticket text-[15px] font-medium">
        <h2 className="poster pb-3.5 text-[22px]">{lt('tryLive')}</h2>
        {body && <div className="ticket-rule py-3.5">{body}</div>}
        <p className="ticket-rule pt-3.5">
          <button type="button" onClick={() => onView(exit.view)} className="alt min-h-11 text-start">
            {exit.label}
          </button>
        </p>
      </div>
    </div>
  )
}
