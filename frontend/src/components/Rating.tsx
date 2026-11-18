import { useState } from 'react'
import { ratingKey } from '../lib/format'
import { useI18n } from '../lib/i18n'

const glyph = { strong: '▲', neutral: '●', weak: '▼' } as const
const tone = {
  strong: 'text-strong',
  neutral: 'text-neutral',
  weak: 'text-weak',
} as const

/** The coin's setup rating — a description of its chart, never an instruction. */
export function RatingPill({ rating, size = 'md' }: { rating?: string; size?: 'sm' | 'md' }) {
  const { te } = useI18n()
  const key = ratingKey(rating)
  return (
    <span className={`inline-flex items-center gap-1 font-semibold ${tone[key]} ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
      <span aria-hidden className="text-[0.6em]">
        {glyph[key]}
      </span>
      {te(String(rating ?? 'NEUTRAL').toUpperCase())}
    </span>
  )
}

/** 0–100 score as a ring that fills like a gauge, coloured by the rating. */
export function ScoreRing({ score, rating, size = 56 }: { score?: number; rating?: string; size?: number }) {
  const value = Math.max(0, Math.min(100, Number(score ?? 0)))
  const stroke = 5
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const key = ratingKey(rating)
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-subtle)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`var(--color-${key})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <span className="num absolute inset-0 grid place-items-center text-lg font-semibold">
        {score != null ? Math.round(value) : '--'}
      </span>
    </div>
  )
}

// The grade is a hallmark: the karat punched into a small plate of gold, like
// the "24K" on the mascot's top face. The metal is the scale too: 24K is the
// richest gold, each step down is paler, 10K is nearly silver.
const PLATE: Record<number, { face: string; under: string; ink: string }> = {
  24: { face: 'linear-gradient(165deg,#FFF1B0,#FFCE54 46%,#F5A524)', under: '#C98A12', ink: '#7A4600' },
  22: { face: 'linear-gradient(165deg,#FFF4C4,#FFD970 46%,#F3B94A)', under: '#CB9A2E', ink: '#7A4C04' },
  18: { face: 'linear-gradient(165deg,#FFF8DC,#F6DE9C 46%,#E8C673)', under: '#C2A050', ink: '#74510E' },
  14: { face: 'linear-gradient(165deg,#FCF6E6,#ECDDB8 46%,#DAC596)', under: '#B39E6F', ink: '#695320' },
  10: { face: 'linear-gradient(165deg,#F7F4EC,#E3DCCD 46%,#CFC5B0)', under: '#A59B85', ink: '#5E5646' },
}

/** The karat as a hallmark stamped into gold. A coin too new for a karat gets a blank, unstamped plate. */
export function KaratBadge({ karat, size = 'md' }: { karat?: number | null; size?: 'sm' | 'md' }) {
  const { t } = useI18n()
  const big = size === 'md'
  const box = big
    ? 'h-10 min-w-[3.5rem] rounded-md px-3 pt-[3px] text-[1.3rem]'
    : 'h-6 min-w-9 rounded-[5px] px-2 pt-[2px] text-[0.86rem]'
  if (!karat) {
    return (
      <span
        className={`inline-grid shrink-0 place-items-center border-2 border-dashed border-text/25 font-poster leading-none text-muted ${box}`}
      >
        {t('karat.none')}
      </span>
    )
  }
  const plate = PLATE[karat] ?? PLATE[14]
  return (
    <span
      className={`num inline-grid shrink-0 place-items-center font-poster leading-none ${box}`}
      style={{
        background: plate.face,
        color: plate.ink,
        // a lit top edge and a thin foot: a plate of metal, not a button to press
        boxShadow: `inset 0 1px 0 rgba(255,255,255,.85), 0 1.5px 0 ${plate.under}`,
        // the punch leaves a frame around the mark
        outline: `${big ? 1.5 : 1}px solid ${plate.under}`,
        outlineOffset: big ? -5 : -3,
        // punched in: the letters catch light on their lower edge
        textShadow: '0 1px 0 rgba(255,255,255,.6)',
      }}
    >
      {t('karat.label', { k: karat })}
    </span>
  )
}

const RISK_DOT = {
  low: 'bg-strong',
  medium: 'bg-warn',
  high: 'bg-weak',
} as const

/** The risk level: a dot of its colour and the words. The colour is an accent, never a fill. */
export function RiskChip({ risk }: { risk?: 'low' | 'medium' | 'high' | null }) {
  const { t } = useI18n()
  if (!risk) return null
  return (
    <span className="inline-flex items-baseline gap-1.5 text-xs font-semibold">
      <span className={`size-2 shrink-0 rounded-full ${RISK_DOT[risk]}`} aria-hidden />
      {t(`risk.${risk}`)}
    </span>
  )
}

/** Coin logo from a public icon set, falling back to a lettered badge. */
export function CoinIcon({ symbol, image }: { symbol?: string; image?: string }) {
  const sym = (symbol || '?').toLowerCase()
  const [failed, setFailed] = useState(false)
  const src = image || `https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/${sym}.svg`
  if (failed) {
    return (
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold-soft text-xs font-semibold text-gold">
        {sym.slice(0, 4).toUpperCase()}
      </span>
    )
  }
  return <img src={src} alt="" className="size-10 shrink-0 rounded-full" onError={() => setFailed(true)} />
}
