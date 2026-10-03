import { useEffect, useState } from 'react'
import AskView from './components/AskView'
import CoinList from './components/CoinList'
import FeedbackModal, { FeedbackPrompt } from './components/FeedbackModal'
import GuideModal from './components/GuideModal'
import MarketMoves from './components/MarketMoves'
import { IconTelegram } from './components/Icons'
import { BottomNav, TopBar } from './components/Navigation'
import PortfolioView from './components/PortfolioView'
import TodayHero from './components/TodayHero'
import TrackRecord from './components/TrackRecord'
import { DEFAULT_CONFIG, useAppStatus, useBrief } from './hooks/useBrief'
import type { AdvisorConfig } from './hooks/useBrief'
import { feedbackVisible } from './lib/feedback'
import { useI18n } from './lib/i18n'
import { loadConfig, saveConfig } from './lib/prefs'
import { VIEWS } from './lib/views'
import type { View } from './lib/views'

const TELEGRAM_URL = 'https://t.me/getqirat'

function viewFromHash(): View {
  const id = window.location.hash.replace('#', '')
  return VIEWS.some((v) => v.id === id) ? (id as View) : 'today'
}

export default function App() {
  const { t } = useI18n()
  const [view, setView] = useState<View>(viewFromHash)
  const [config, setConfig] = useState<AdvisorConfig>(() => loadConfig(DEFAULT_CONFIG))
  // Draft config: typing in a form shouldn't refetch per keystroke. The
  // query key only changes when the debounced config settles.
  const [draft, setDraft] = useState<AdvisorConfig>(config)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setConfig(draft)
      saveConfig(draft)
    }, 700)
    return () => window.clearTimeout(timer)
  }, [draft])

  useEffect(() => {
    const onHash = () => setView(viewFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const go = (next: View) => {
    window.location.hash = next === 'today' ? '' : next
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const briefQuery = useBrief(config)
  const statusQuery = useAppStatus()
  const [toast, setToast] = useState<string | null>(null)
  const [showGuide, setShowGuide] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const brief = briefQuery.data
  const updatedAt = brief?.generated_at ? new Date(brief.generated_at) : null
  const error = briefQuery.error ? (briefQuery.error as Error).message : null

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <TopBar view={view} onView={go} onHelp={() => setShowGuide(true)} />

      <main className="mx-auto max-w-5xl space-y-6 px-4 pt-5">
        {view === 'today' && (
          <>
            <TodayHero
              brief={brief}
              isFetching={briefQuery.isFetching}
              error={error}
              updatedAt={updatedAt && !Number.isNaN(updatedAt.getTime()) ? updatedAt : null}
              onRefresh={() => briefQuery.refetch()}
            />
            <CoinList
              brief={brief}
              isLoading={briefQuery.isLoading}
              error={error}
              config={draft}
              onConfigChange={setDraft}
            />
            <MarketMoves brief={brief} />
          </>
        )}
        {view === 'record' && <TrackRecord />}
        {view === 'ask' && <AskView brief={brief} aiEnabled={Boolean(statusQuery.data?.ai_enabled)} />}
        {view === 'portfolio' && (
          <PortfolioView
            brief={brief}
            config={draft}
            onConfigChange={setDraft}
            status={statusQuery.data}
            onToast={setToast}
          />
        )}

        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="card flex items-center gap-4 p-4 transition hover:border-border-strong"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#229ED9] text-xl text-white">
            <IconTelegram />
          </span>
          <span className="min-w-0">
            <span className="block font-semibold">{t('foot.telegram')}</span>
            <span className="block text-sm text-muted">{t('foot.telegramHint')}</span>
          </span>
          <span className="ms-auto shrink-0 text-sm font-medium text-gold" dir="ltr">
            t.me/getqirat
          </span>
        </a>

        <footer className="space-y-2 pt-4 pb-2 text-center text-xs text-muted">
          <p>{t('foot.disclaimer')}</p>
          <p dir="ltr">
            {t('foot.data')}: Binance ·{' '}
            <a
              href="https://www.coingecko.com/en/api"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-gold"
            >
              Powered by CoinGecko
            </a>{' '}
            · Fear &amp; Greed:{' '}
            <a
              href="https://alternative.me/crypto/fear-and-greed-index/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-gold"
            >
              Alternative.me
            </a>
          </p>
          {feedbackVisible && (
            <div className="pt-3">
              <button
                onClick={() => setShowFeedback(true)}
                className="cursor-pointer rounded-full border border-border-strong px-5 py-2 text-sm font-medium text-gold transition hover:bg-gold-soft"
              >
                {t('foot.feedback')}
              </button>
              <p className="mt-2">{t('foot.feedbackHint')}</p>
            </div>
          )}
        </footer>
      </main>

      <BottomNav view={view} onView={go} />
      <GuideModal open={showGuide} onClose={() => setShowGuide(false)} />
      <FeedbackModal open={showFeedback} onClose={() => setShowFeedback(false)} />
      <FeedbackPrompt onOpen={() => setShowFeedback(true)} />

      {toast && (
        <div className="card rise fixed bottom-24 left-1/2 z-50 -translate-x-1/2 px-4 py-2 text-sm md:bottom-6">
          {toast}
        </div>
      )}
    </div>
  )
}
