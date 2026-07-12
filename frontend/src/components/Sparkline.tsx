import { useId } from 'react'
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'

export default function Sparkline({ points, up }: { points?: number[]; up: boolean }) {
  const gradientId = useId()
  const values = (points ?? []).slice(-40).map(Number).filter(Number.isFinite)
  if (values.length < 2) return null
  const data = values.map((v, i) => ({ i, v }))
  const color = up ? 'var(--color-buy)' : 'var(--color-sell)'
  const last = data.length - 1
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.14} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
            // end-dot with a surface ring marks the current price
            dot={(props: { cx?: number; cy?: number; index?: number }) =>
              props.index === last && props.cx != null && props.cy != null ? (
                <circle
                  key="end"
                  cx={props.cx}
                  cy={props.cy}
                  r={3}
                  fill={color}
                  stroke="var(--color-panel)"
                  strokeWidth={2}
                />
              ) : (
                <g key={`d${props.index}`} />
              )
            }
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
