import { useRef, useState } from 'react'
import type { Brief } from '../lib/api'
import { generateBriefing } from '../lib/api'
import { briefingHtml } from '../lib/format'

const THROTTLE_MS = 5 * 60 * 1000 // client-side guard; the server narrative cache is the real one

export default function AiBriefing({
  brief,
  aiEnabled,
}: {
  brief: Brief | undefined
  aiEnabled: boolean
}) {
  const [text, setText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastRunRef = useRef(0)

  if (!aiEnabled) return null

  const run = async () => {
    if (!brief || loading) return
    const since = Date.now() - lastRunRef.current
    if (text && since < THROTTLE_MS) {
      setError(`Throttled — try again in ${Math.ceil((THROTTLE_MS - since) / 1000)}s.`)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await generateBriefing(brief)
      setText(result.text)
      lastRunRef.current = Date.now()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Briefing failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="glass rise p-4" style={{ animationDelay: '180ms' }}>
      <div className="flex items-center gap-3">
        <h2 className="font-display text-sm font-semibold tracking-widest text-teal uppercase">
          AI briefing
        </h2>
        <span className="h-px min-w-4 flex-1 bg-line" aria-hidden />
        <button
          onClick={run}
          disabled={!brief || loading}
          className="cursor-pointer rounded-md border border-line-2 bg-teal/10 px-3 py-1 font-display text-[11px] font-semibold tracking-widest text-teal uppercase transition hover:bg-teal/20 disabled:opacity-40"
        >
          {loading ? 'writing…' : text ? 'regenerate' : 'generate'}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-hold">{error}</p>}

      {loading && !text && (
        <p className="num mt-3 text-xs text-mute">
          Reading the market data<span className="caret">▋</span>
        </p>
      )}

      {text ? (
        <div
          className="briefing-md mt-2 text-[13px] text-fg/90"
          dangerouslySetInnerHTML={{ __html: briefingHtml(text) }}
        />
      ) : (
        !loading && (
          <p className="mt-3 text-xs leading-relaxed text-mute">
            Generate an AI narrative of the current setups — what's moving, why, and the risks to
            watch. Costs one API call; near-identical snapshots are served from cache.
          </p>
        )
      )}
    </section>
  )
}
