import { useEffect, useState } from 'react'
import { formatDuration } from '../lib/format'

interface HeaderProps {
  isFetching: boolean
  error: string | null
  updatedAt: Date | null
  live: boolean
  intervalMs: number
  onToggleLive: (live: boolean) => void
  onIntervalChange: (ms: number) => void
  onRefresh: () => void
  onOpenGuide: () => void
}

export default function Header({
  isFetching,
  error,
  updatedAt,
  live,
  intervalMs,
  onToggleLive,
  onIntervalChange,
  onRefresh,
  onOpenGuide,
}: HeaderProps) {
  // re-render every second so the countdown ticks
  const [, setTick] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), 1000)
    return () => window.clearInterval(t)
  }, [])

  let freshness: string
  if (isFetching) freshness = 'refreshing live data…'
  else if (error) freshness = `update failed · ${error}`
  else if (!updatedAt) freshness = 'waiting for market data'
  else {
    const at = updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (!live) freshness = `updated ${at} · live off`
    else {
      const remaining = (updatedAt.getTime() + intervalMs - Date.now()) / 1000
      freshness = `updated ${at} · next ${formatDuration(remaining)}`
    }
  }

  return (
    <header className="rise flex flex-wrap items-center gap-4 pb-2">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-lg border border-line-2 bg-panel font-display text-lg font-bold text-teal">
          ◬
        </div>
        <div>
          <h1 className="font-display text-xl font-semibold tracking-wide">
            SIGNAL<span className="text-teal">DESK</span>
          </h1>
          <p className="tick-label">ai crypto advisor · decision support</p>
        </div>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-3">
        <span className={`num text-xs ${error ? 'text-sell' : 'text-mute'}`}>{freshness}</span>

        <button
          onClick={onOpenGuide}
          aria-label="How to use SignalDesk"
          className="guide-cta flex cursor-pointer items-center gap-1.5 rounded-lg bg-teal px-3.5 py-1.5 font-display text-xs font-bold tracking-widest text-ink uppercase transition hover:brightness-110"
        >
          <span aria-hidden className="text-sm leading-none">✦</span>
          How to use
        </button>

        <label className="glass flex cursor-pointer items-center gap-2 px-3 py-1.5 text-xs">
          <span
            className={`size-2 rounded-full ${live ? 'live-dot bg-buy' : 'bg-mute'}`}
            aria-hidden
          />
          <span className="tick-label !text-fg">live</span>
          <input
            type="checkbox"
            checked={live}
            onChange={(e) => onToggleLive(e.target.checked)}
            className="sr-only"
          />
        </label>

        <select
          value={intervalMs}
          onChange={(e) => onIntervalChange(Number(e.target.value))}
          className="glass num cursor-pointer px-3 py-1.5 text-xs outline-none"
          aria-label="Refresh interval"
        >
          <option value={60_000}>1 min</option>
          <option value={120_000}>2 min</option>
          <option value={300_000}>5 min</option>
        </select>

        <button
          onClick={onRefresh}
          disabled={isFetching}
          className="glass cursor-pointer px-4 py-1.5 font-display text-xs font-semibold tracking-widest text-teal uppercase transition hover:border-line-2 disabled:opacity-50"
        >
          {isFetching ? 'syncing…' : 'refresh'}
        </button>
      </div>
    </header>
  )
}
