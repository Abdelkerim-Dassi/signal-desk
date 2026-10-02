import type { Regime } from '../lib/api'
import { compactCurrency, percent, RISK_OFF_CAP } from '../lib/format'

/**
 * The market-wide switch above the ranked setups: is BTC above its 200-day
 * average? In risk-off markets the engine caps every score below the STRONG
 * threshold — the backtest showed strong setups only paid off in risk-on tapes.
 */
export default function RegimeBanner({ regime }: { regime: Regime | undefined }) {
  if (!regime || regime.state === 'unknown') return null
  const on = regime.state === 'risk_on'
  const tone = on ? 'text-strong' : 'text-weak'
  return (
    <section
      className={`glass rise flex flex-wrap items-center gap-x-4 gap-y-1.5 border-l-2 px-4 py-3 ${on ? 'border-l-strong' : 'border-l-weak'}`}
      style={{ animationDelay: '170ms' }}
      title="In the 2021–26 backtest, strong setups only beat the market while BTC held above its 200-day average."
    >
      <div className="flex items-center gap-2">
        <span className="tick-label">market regime</span>
        <span className={`flex items-center gap-1.5 font-display text-sm font-semibold tracking-widest uppercase ${tone}`}>
          <span className={`size-2 rounded-full ${on ? 'live-dot bg-strong' : 'bg-weak'}`} aria-hidden />
          {regime.label}
        </span>
      </div>
      <p className="num text-xs text-mute">
        BTC {compactCurrency(regime.btc_price)} is{' '}
        <span className={tone}>{percent(regime.distance_pct)}</span> vs its 200-day avg{' '}
        {compactCurrency(regime.btc_ma200)}
      </p>
      <p className="text-xs text-mute sm:ml-auto">
        {on
          ? 'Strong ratings enabled'
          : `Strong ratings paused — scores capped at ${RISK_OFF_CAP} until BTC reclaims its 200-day average`}
      </p>
    </section>
  )
}
