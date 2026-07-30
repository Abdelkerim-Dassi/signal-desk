import { useEffect, useState } from 'react'
import Header from './components/Header'
import MarketStats from './components/MarketStats'
import FearGreedGauge from './components/FearGreedGauge'
import OpportunityList from './components/OpportunityList'
import PortfolioPanel from './components/PortfolioPanel'
import AiBriefing from './components/AiBriefing'
import ChatPanel from './components/ChatPanel'
import GuideModal from './components/GuideModal'
import FeedbackModal, { FeedbackPrompt } from './components/FeedbackModal'
import { AlertPanel, News, Trending } from './components/SidePanels'
import { DEFAULT_CONFIG, useAppStatus, useBrief } from './hooks/useBrief'
import type { AdvisorConfig } from './hooks/useBrief'
import { feedbackVisible } from './lib/feedback'

export default function App() {
  const [config, setConfig] = useState<AdvisorConfig>(DEFAULT_CONFIG)
  // Draft config: typing in the form shouldn't refetch per keystroke. The
  // query key only changes when the debounced config settles.
  const [draft, setDraft] = useState<AdvisorConfig>(DEFAULT_CONFIG)
  useEffect(() => {
    const t = window.setTimeout(() => setConfig(draft), 700)
    return () => window.clearTimeout(t)
  }, [draft])

  const briefQuery = useBrief(config)
  const statusQuery = useAppStatus()
  const [toast, setToast] = useState<string | null>(null)
  const [showGuide, setShowGuide] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 3600)
    return () => window.clearTimeout(t)
  }, [toast])

  const brief = briefQuery.data
  const updatedAt = brief?.generated_at ? new Date(brief.generated_at) : null
  const aiEnabled = Boolean(statusQuery.data?.ai_enabled)

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
      <Header
        isFetching={briefQuery.isFetching}
        error={briefQuery.error ? (briefQuery.error as Error).message : null}
        updatedAt={updatedAt && !Number.isNaN(updatedAt.getTime()) ? updatedAt : null}
        live={draft.live}
        intervalMs={draft.intervalMs}
        onToggleLive={(live) => setDraft({ ...draft, live })}
        onIntervalChange={(intervalMs) => setDraft({ ...draft, intervalMs })}
        onRefresh={() => briefQuery.refetch()}
        onOpenGuide={() => setShowGuide(true)}
      />

      <main className="mt-4 grid gap-4 lg:grid-cols-[1.9fr_1fr]">
        <div className="space-y-4">
          <MarketStats brief={brief} />
          <OpportunityList
            brief={brief}
            isLoading={briefQuery.isLoading}
            error={briefQuery.error ? (briefQuery.error as Error).message : null}
          />
          <News brief={brief} />
        </div>

        <aside className="space-y-4">
          <FearGreedGauge sentiment={brief?.sentiment} />
          <AiBriefing brief={brief} aiEnabled={aiEnabled} />
          <ChatPanel brief={brief} aiEnabled={aiEnabled} />
          <PortfolioPanel brief={brief} config={draft} onConfigChange={setDraft} />
          <Trending brief={brief} />
          <AlertPanel brief={brief} status={statusQuery.data} onToast={setToast} />
        </aside>
      </main>

      <footer className="num space-y-2 py-6 text-center text-[11px] text-mute">
        <p>Heuristic signals + AI narrative · decision support only — not financial advice.</p>
        {feedbackVisible && (
          <p className="pt-1">
            <button
              onClick={() => setShowFeedback(true)}
              className="glass cursor-pointer px-5 py-2 font-display text-xs font-bold tracking-widest text-teal uppercase transition hover:border-line-2 hover:brightness-125"
            >
              ✎ Give feedback
            </button>
            <span className="mt-2 block">Testing this? 30 seconds, anonymous — it shapes what gets built next.</span>
          </p>
        )}
      </footer>

      <GuideModal open={showGuide} onClose={() => setShowGuide(false)} />
      <FeedbackModal open={showFeedback} onClose={() => setShowFeedback(false)} />
      <FeedbackPrompt onOpen={() => setShowFeedback(true)} />

      {toast && (
        <div className="glass rise fixed bottom-5 left-1/2 z-50 -translate-x-1/2 px-4 py-2 text-sm">
          {toast}
        </div>
      )}
    </div>
  )
}
