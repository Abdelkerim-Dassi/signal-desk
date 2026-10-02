import type { CSSProperties } from 'react'
import { ratingKey, STRONG_MIN, WEAK_MAX } from '../lib/format'

/**
 * The desk's signature instrument: a segmented 0–100 meter with hairline
 * ticks at the scoring engine's real thresholds — ≤38 weak, ≥67 strong.
 * The fill wears the rating's status color over a dim track of the same hue.
 */
export default function ScoreMeter({
  score,
  rating,
  className = '',
}: {
  score?: number
  rating?: string
  className?: string
}) {
  const value = Math.max(0, Math.min(100, Number(score ?? 0)))
  const key = ratingKey(rating)
  return (
    <div
      className={`meter ${className}`}
      style={{ '--meter-color': `var(--color-${key})` } as CSSProperties}
      role="img"
      aria-label={`Score ${value} of 100 — ${key} setup. Strong from ${STRONG_MIN}, weak at ${WEAK_MAX} or below.`}
    >
      <div className="meter-fill" style={{ width: `${value}%` }} />
      <div className="meter-segments" />
      <span className="meter-tick" style={{ left: `${WEAK_MAX}%` }} aria-hidden />
      <span className="meter-tick" style={{ left: `${STRONG_MIN}%` }} aria-hidden />
    </div>
  )
}
