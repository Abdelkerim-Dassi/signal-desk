import { useState } from 'react'
import type { ScoreBreakdown as ScoreBreakdownData } from '../lib/api'

/** One scoring factor: its label and the signed points it added or removed. */
function DeltaRow({ label, delta }: { label: string; delta: number }) {
  const positive = delta >= 0
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-mute">{label}</span>
      <span className={`num font-semibold ${positive ? 'text-teal-dim' : 'text-sell'}`}>
        {positive ? '+' : ''}
        {delta}
      </span>
    </div>
  )
}

/**
 * The score / risk value, click-to-expand into the exact rubric that produced it
 * (Base 50 + each component = final). Falls back to a plain number when the brief
 * predates the breakdown field (older cached responses), so nothing ever breaks.
 */
export default function ScoreBreakdown({
  score,
  riskLevel,
  breakdown,
}: {
  score?: number
  riskLevel?: string
  breakdown?: ScoreBreakdownData
}) {
  const [open, setOpen] = useState(false)

  const value = (
    <>
      {score ?? '--'} <span className="text-mute">/ {riskLevel ?? '--'}</span>
    </>
  )

  if (!breakdown || !breakdown.components?.length) {
    return <p className="num font-semibold">{value}</p>
  }

  const capped = breakdown.raw !== undefined && breakdown.raw !== breakdown.final

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title="See how this score was built"
        className="num flex items-center gap-1 font-semibold text-fg transition hover:text-teal"
      >
        {value}
        <span
          className={`text-[10px] text-mute transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="mt-2 space-y-1 rounded-lg border border-line bg-panel-2/60 p-2.5 text-[11px]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-mute">Base</span>
            <span className="num font-semibold text-mute">{breakdown.base}</span>
          </div>
          {breakdown.components.map((c, i) => (
            <DeltaRow key={`${c.label}-${i}`} label={c.label} delta={c.delta} />
          ))}
          <div className="mt-1 flex items-center justify-between gap-3 border-t border-line pt-1.5">
            <span className="font-semibold text-fg">
              Score
              {capped && <span className="ml-1 text-[10px] font-normal text-mute">(capped at 100)</span>}
            </span>
            <span className="num font-semibold text-teal">{breakdown.final}</span>
          </div>
        </div>
      )}
    </div>
  )
}
