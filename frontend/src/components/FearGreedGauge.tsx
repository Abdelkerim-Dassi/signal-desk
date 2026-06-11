import type { Sentiment } from '../lib/api'

/** Semi-circular gauge, needle sweeps from Extreme Fear (red) to Extreme Greed (green). */
export default function FearGreedGauge({ sentiment }: { sentiment: Sentiment | undefined }) {
  const score = Math.max(0, Math.min(100, Number(sentiment?.score ?? 50)))
  // map 0..100 to 180°..0° (left to right on a semicircle)
  const angle = Math.PI * (1 - score / 100)
  const cx = 100
  const cy = 92
  const r = 72
  const needleX = cx + r * 0.82 * Math.cos(angle)
  const needleY = cy - r * 0.82 * Math.sin(angle)

  const arc = (from: number, to: number) => {
    const a0 = Math.PI * (1 - from / 100)
    const a1 = Math.PI * (1 - to / 100)
    const x0 = cx + r * Math.cos(a0)
    const y0 = cy - r * Math.sin(a0)
    const x1 = cx + r * Math.cos(a1)
    const y1 = cy - r * Math.sin(a1)
    return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`
  }

  const bands: { from: number; to: number; color: string }[] = [
    { from: 0, to: 24, color: 'var(--color-sell)' },
    { from: 26, to: 44, color: 'var(--color-avoid)' },
    { from: 46, to: 54, color: 'var(--color-hold)' },
    { from: 56, to: 74, color: '#a3e635' },
    { from: 76, to: 100, color: 'var(--color-buy)' },
  ]

  return (
    <div className="glass rise p-4" style={{ animationDelay: '100ms' }}>
      <p className="tick-label">market sentiment</p>
      <svg viewBox="0 0 200 105" className="mt-1 w-full" role="img" aria-label="Fear and greed gauge">
        {bands.map((b) => (
          <path
            key={b.from}
            d={arc(b.from, b.to)}
            stroke={b.color}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
        ))}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="var(--color-fg)"
          strokeWidth="2"
          style={{ transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)' }}
        />
        <circle cx={cx} cy={cy} r="4.5" fill="var(--color-teal)" />
        <text x="14" y="103" className="fill-mute" fontSize="7" fontFamily="var(--font-mono)">
          FEAR
        </text>
        <text x="162" y="103" className="fill-mute" fontSize="7" fontFamily="var(--font-mono)">
          GREED
        </text>
      </svg>
      <div className="mt-1 flex items-baseline justify-center gap-2">
        <span className="num text-2xl font-semibold">{sentiment?.score ?? '--'}</span>
        <span className="font-display text-sm text-teal">{sentiment?.status ?? 'Neutral'}</span>
      </div>
    </div>
  )
}
