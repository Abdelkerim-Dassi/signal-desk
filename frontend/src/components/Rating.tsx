import { useState } from 'react'
import { ratingKey } from '../lib/format'
import { useI18n } from '../lib/i18n'

const glyph = { strong: '▲', neutral: '●', weak: '▼' } as const
const tone = {
  strong: 'text-strong bg-strong/10',
  neutral: 'text-neutral bg-neutral/10',
  weak: 'text-weak bg-weak/10',
} as const

/** The coin's setup rating — a description of its chart, never an instruction. */
export function RatingPill({ rating, size = 'md' }: { rating?: string; size?: 'sm' | 'md' }) {
  const { te } = useI18n()
  const key = ratingKey(rating)
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${tone[key]} ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs'
      }`}
    >
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
