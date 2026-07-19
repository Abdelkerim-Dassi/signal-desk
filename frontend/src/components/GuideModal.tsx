import { useEffect } from 'react'

interface Step {
  n: string
  title: string
  body: React.ReactNode
}

const steps: Step[] = [
  {
    n: '01',
    title: 'Pick your data source',
    body: (
      <>
        Open <strong>Watchlist &amp; portfolio</strong> (right column). Choose a{' '}
        <strong>source</strong> — <em>Binance Spot</em> (use pair tickers like{' '}
        <code>BTCUSDT</code>) or <em>CoinGecko</em> (use ids like{' '}
        <code>bitcoin</code>). Set the <strong>quote</strong> currency (USDT, USDC or
        BTC).
      </>
    ),
  },
  {
    n: '02',
    title: 'Build your watchlist',
    body: (
      <>
        In <strong>assets (comma separated)</strong>, list the coins you want scored, e.g.{' '}
        <code>BTCUSDT, ETHUSDT</code>. The desk fetches live prices and computes a heuristic{' '}
        <strong>signal</strong> (buy / hold / sell / avoid) and a 0–100 score for each.
      </>
    ),
  },
  {
    n: '03',
    title: 'How the score works',
    body: (
      <>
        Every coin starts at a base of <strong>50</strong>. The desk adds or subtracts points for
        trend (price vs its <strong>7 &amp; 30-day averages</strong>), <strong>momentum</strong>{' '}
        (the 7-day return), <strong>volume</strong>, and market <strong>Fear &amp; Greed</strong> —
        then clamps to <code>0–100</code>. <strong>Buy ≥67 · avoid ≤38</strong>; hold in between. A{' '}
        <strong>100</strong> is rare by design — it takes a near-perfect confluence of every factor
        at once. <strong>Click any score</strong> in the ranked list to see its exact build-up, or
        ask the desk <em>&quot;what would move BTC to 100?&quot;</em>
      </>
    ),
  },
  {
    n: '04',
    title: 'Add your holdings (optional)',
    body: (
      <>
        Under <strong>holdings</strong>, enter the <em>coin</em>, <em>amount</em> you own and your{' '}
        <em>avg buy</em> price. The <strong>Watchlist &amp; portfolio</strong> cards then show
        position value, unrealized PnL and a per-position note. Use <strong>+ add holding</strong>{' '}
        to add rows or <strong>×</strong> to remove.
      </>
    ),
  },
  {
    n: '05',
    title: 'Read the market context',
    body: (
      <>
        The left column shows <strong>Market stats</strong>, the ranked{' '}
        <strong>opportunity list</strong> and <strong>headlines</strong>. The right column adds the{' '}
        <strong>Fear &amp; Greed</strong> gauge and <strong>Trending</strong> coins — the backdrop
        for every signal.
      </>
    ),
  },
  {
    n: '06',
    title: 'Generate an AI briefing',
    body: (
      <>
        In <strong>AI briefing</strong>, press <strong>generate</strong>. The AI writes a plain
        narrative of what&apos;s moving, why, and the risks to watch — grounded in the live data
        above. It costs one API call; near-identical snapshots are cached, and the button is
        throttled to ~5 min.
      </>
    ),
  },
  {
    n: '07',
    title: 'Ask the desk',
    body: (
      <>
        Use <strong>Ask the desk</strong> to chat about the current signals, e.g.{' '}
        <em>&quot;why is BTC a hold right now?&quot;</em> or{' '}
        <em>&quot;what would move it to 100?&quot;</em> Answers stream live and stay grounded in
        the live data and the scoring rubric.
      </>
    ),
  },
  {
    n: '08',
    title: 'Stay live & set alerts',
    body: (
      <>
        Toggle <strong>live</strong> in the header to auto-refresh (1 / 2 / 5 min), or hit{' '}
        <strong>refresh</strong> any time. In <strong>Alerts</strong>, pick a configured channel
        (Discord / WhatsApp) and <strong>send market alert</strong> to push the current snapshot.
      </>
    ),
  },
]

export default function GuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-ink/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="How to use SignalDesk"
    >
      <div
        className="glass rise max-h-[88vh] w-full max-w-2xl overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-wide">
              How to use SIGNAL<span className="text-teal">DESK</span>
            </h2>
            <p className="tick-label mt-1">a quick walkthrough — start to finish</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close guide"
            className="cursor-pointer rounded-md border border-line px-2.5 py-1 text-sm text-mute transition hover:border-line-2 hover:text-fg"
          >
            ×
          </button>
        </div>

        <ol className="mt-5 space-y-4">
          {steps.map((s) => (
            <li key={s.n} className="flex gap-3.5">
              <span className="num mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-line-2 bg-teal/10 text-xs font-semibold text-teal">
                {s.n}
              </span>
              <div>
                <p className="font-display text-sm font-semibold tracking-wide text-fg">
                  {s.title}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-mute [&_code]:rounded [&_code]:bg-panel-2 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12px] [&_code]:text-teal [&_strong]:text-fg">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-6 border-t border-line pt-4 text-[11px] leading-relaxed text-mute">
          Heuristic signals + AI narrative · decision support only — not financial advice. Always
          size positions and manage risk yourself.
        </p>
      </div>
    </div>
  )
}
