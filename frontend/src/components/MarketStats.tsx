import type { Brief } from '../lib/api'
import { changeColor, compactCurrency, percent } from '../lib/format'

function Stat({
  label,
  value,
  sub,
  subClass = 'text-mute',
  delay,
}: {
  label: string
  value: string
  sub?: string
  subClass?: string
  delay: number
}) {
  return (
    <div className="glass rise px-4 py-3" style={{ animationDelay: `${delay}ms` }}>
      <p className="tick-label">{label}</p>
      <p className="num mt-1 text-xl font-semibold">{value}</p>
      {sub && <p className={`num mt-0.5 text-xs ${subClass}`}>{sub}</p>}
    </div>
  )
}

export default function MarketStats({ brief }: { brief: Brief | undefined }) {
  const g = brief?.global ?? {}
  const s = brief?.sentiment ?? {}
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Stat
        label="fear / greed"
        value={s.score != null ? `${s.score}/100` : '--'}
        sub={s.status ?? 'Neutral'}
        subClass="text-teal-dim"
        delay={40}
      />
      <Stat
        label="global mkt cap"
        value={compactCurrency(g.total_market_cap_usd)}
        sub={`24h ${percent(g.market_cap_change_24h)}`}
        subClass={changeColor(g.market_cap_change_24h)}
        delay={80}
      />
      <Stat
        label="btc dominance"
        value={percent(g.btc_dominance).replace('+', '')}
        sub={`ETH ${percent(g.eth_dominance).replace('+', '')}`}
        delay={120}
      />
      <Stat
        label="watchlist"
        value={`${brief?.assets?.length ?? 0}`}
        sub={`${brief?.exchange_label ?? '--'} · ${brief?.quote_asset ?? ''}`}
        delay={160}
      />
    </section>
  )
}
