import type { CSSProperties } from 'react'
import { actionKey } from '../lib/format'

/**
 * The desk's signature instrument: a segmented 0–100 meter with hairline
 * ticks at the scoring engine's real thresholds — ≤38 sell/avoid, ≥67 buy.
 * The fill wears the action's status color over a dim track of the same hue.
 */
export default function ScoreMeter({
  score,
  action,
  className = '',
}: {
  score?: number
  action?: string
  className?: string
}) {
  const value = Math.max(0, Math.min(100, Number(score ?? 0)))
  const key = actionKey(action)
  return (
    <div
      className={`meter ${className}`}
      style={{ '--meter-color': `var(--color-${key})` } as CSSProperties}
      role="img"
      aria-label={`Score ${value} of 100 — ${key}. Buy from 67, avoid at 38 or below.`}
    >
      <div className="meter-fill" style={{ width: `${value}%` }} />
      <div className="meter-segments" />
      <span className="meter-tick" style={{ left: '38%' }} aria-hidden />
      <span className="meter-tick" style={{ left: '67%' }} aria-hidden />
    </div>
  )
}
