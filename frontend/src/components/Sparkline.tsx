import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'

export default function Sparkline({ points, up }: { points?: number[]; up: boolean }) {
  const values = (points ?? []).slice(-40).map(Number).filter(Number.isFinite)
  if (values.length < 2) return null
  const data = values.map((v, i) => ({ i, v }))
  const color = up ? 'var(--color-buy)' : 'var(--color-sell)'
  const id = up ? 'spark-up' : 'spark-down'
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${id})`}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
