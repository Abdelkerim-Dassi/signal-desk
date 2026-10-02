import type { Sentiment } from '../lib/api'
import DeskHead from './DeskHead'

/**
 * Semi-circular gauge for the Fear & Greed index. The scale is diverging —
 * fear (red) → neutral gray at 50 → greed (green) — with desaturated steps
 * between, so the midpoint reads as "nothing". The needle angle and the
 * numeric readout carry the value; color only reinforces it.
 */
const BANDS: { from: number; to: number; color: string }[] = [
  { from: 0, to: 20, color: 'var(--color-sell)' },
  { from: 20, to: 40, color: '#c68884' },
  { from: 40, to: 60, color: '#8c98a8' },
  { from: 60, to: 80, color: '#66b795' },
  { from: 80, to: 100, color: 'var(--color-buy)' },
]

const TICKS = [0, 25, 50, 75, 100]

export default function FearGreedGauge({ sentiment }: { sentiment: Sentiment | undefined }) {
  const score = Math.max(0, Math.min(100, Number(sentiment?.score ?? 50)))
  // map 0..100 to 180°..0° (left to right on a semicircle)
  const angleFor = (v: number) => Math.PI * (1 - v / 100)
  const angle = angleFor(score)
  const cx = 100
  const cy = 92
  const r = 72
  const needleX = cx + r * 0.8 * Math.cos(angle)
  const needleY = cy - r * 0.8 * Math.sin(angle)
  // short counterweight tail opposite the needle
  const tailX = cx - 10 * Math.cos(angle)
  const tailY = cy + 10 * Math.sin(angle)

  const arc = (from: number, to: number) => {
    const a0 = angleFor(from)
    const a1 = angleFor(to)
    const x0 = cx + r * Math.cos(a0)
    const y0 = cy - r * Math.sin(a0)
    const x1 = cx + r * Math.cos(a1)
    const y1 = cy - r * Math.sin(a1)
    return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`
  }

  const tick = (v: number) => {
    const a = angleFor(v)
    const x0 = cx + (r + 6) * Math.cos(a)
    const y0 = cy - (r + 6) * Math.sin(a)
    const x1 = cx + (r + 10) * Math.cos(a)
    const y1 = cy - (r + 10) * Math.sin(a)
    return { x0, y0, x1, y1 }
  }

  return (
    <div className="glass rise p-4" style={{ animationDelay: '100ms' }}>
      <DeskHead title="Market sentiment" meta="fear & greed index" />
      <svg
        viewBox="0 0 200 108"
        className="mt-2 w-full"
        role="img"
        aria-label={`Fear and greed gauge: ${score} of 100, ${sentiment?.status ?? 'Neutral'}`}
      >
        {/* band arcs, separated by small gaps in the surface */}
        {BANDS.map((b) => (
          <path
            key={b.from}
            d={arc(b.from + (b.from === 0 ? 0 : 1.2), b.to - (b.to === 100 ? 0 : 1.2))}
            stroke={b.color}
            strokeWidth="7"
            strokeLinecap="butt"
            fill="none"
            opacity="0.9"
          />
        ))}
        {/* graduated ticks at 0 / 25 / 50 / 75 / 100 */}
        {TICKS.map((v) => {
          const t = tick(v)
          return (
            <line
              key={v}
              x1={t.x0}
              y1={t.y0}
              x2={t.x1}
              y2={t.y1}
              stroke="var(--color-mute)"
              strokeWidth="1"
              opacity="0.6"
            />
          )
        })}
        <text
          x={cx}
          y="8"
          textAnchor="middle"
          className="fill-mute"
          fontSize="6.5"
          fontFamily="var(--font-mono)"
        >
          50
        </text>
        {/* needle with counterweight */}
        <line
          x1={tailX}
          y1={tailY}
          x2={needleX}
          y2={needleY}
          stroke="var(--color-fg)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)' }}
        />
        <circle cx={cx} cy={cy} r="5" fill="var(--color-panel-2)" stroke="var(--color-teal)" strokeWidth="1.5" />
        <text x="14" y="105" className="fill-mute" fontSize="7" fontFamily="var(--font-mono)">
          FEAR
        </text>
        <text x="160" y="105" className="fill-mute" fontSize="7" fontFamily="var(--font-mono)">
          GREED
        </text>
      </svg>
      <div className="mt-1 flex items-baseline justify-center gap-2">
        <span className="num text-2xl font-semibold">{sentiment?.score ?? '--'}</span>
        <span className="font-display text-sm text-teal">{sentiment?.status ?? 'Neutral'}</span>
      </div>
      <p className="mt-1 text-center text-[10px] text-mute">
        Source:{' '}
        <a
          href="https://alternative.me/crypto/fear-and-greed-index/"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-line-2 underline-offset-2 hover:text-teal"
        >
          Alternative.me
        </a>
      </p>
    </div>
  )
}
