import { useEffect, useState } from 'react'
import AskView from './components/AskView'
import BotInvite from './components/BotInvite'
import CoinList from './components/CoinList'
import FeedbackModal from './components/FeedbackModal'
import GuideModal from './components/GuideModal'
import HomeView from './components/HomeView'
import LearnView from './components/LearnView'
import MarketMoves from './components/MarketMoves'
import { BottomNav, TopBar } from './components/Navigation'
import PortfolioView from './components/PortfolioView'
import PracticeView from './components/PracticeView'
import ScamCheckView from './components/ScamCheckView'
import SiteFooter from './components/SiteFooter'
import TimeMachineView from './components/TimeMachineView'
import TodayHero from './components/TodayHero'
import TrackRecord from './components/TrackRecord'
import { DEFAULT_CONFIG, toAnalyzeParams, useAppStatus, useBrief } from './hooks/useBrief'
import type { AdvisorConfig } from './hooks/useBrief'
import { useI18n } from './lib/i18n'
import { openTakenLink, startKeep, takeKeepLink } from './lib/keep'
import { loadConfig, saveConfig } from './lib/prefs'
import { routeId } from './lib/route'
import { arrive, ownerSwitch, ownerSwitchAtLoad, track } from './lib/source'
import { VIEWS } from './lib/views'
import type { View } from './lib/views'

function viewFromHash(): View {
  // the hash, or what a course or lesson address stands for (lib/route.ts)
  const id = routeId()
  // lessons have their own links: #learn-<slug>, shown as qirat.tn/learn/<slug>
  if (id.startsWith('learn-')) return 'learn'
  // the Time machine, and a link to one of its scenarios: #replay, #replay-<id>
  if (id === 'replay' || id.startsWith('replay-')) return 'replay'
  return VIEWS.some((v) => v.id === id) ? (id as View) : 'home'
}

export default function App() {
  const { t } = useI18n()
  // qirat.tn with nothing after it is the first screen (HomeView), for a first
  // visit and a hundredth alike; a link that names a screen opens that screen.
  const [view, setView] = useState<View>(() => {
    arrive()
    return viewFromHash()
  })
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

  // qirat.tn/#own-on and #own-off (lib/source.ts) are confirmed on screen
  const [toast, setToast] = useState<string | null>(() => {
    const own = ownerSwitchAtLoad()
    return own ? t(`own.${own}`) : null
  })
  useEffect(() => {
    const onHash = () => {
      // #own-on / #own-off typed into the address of a page that is already open
      const own = ownerSwitch()
      if (own) setToast(t(`own.${own}`))
      // a "keep my wallet" link opened in a page that is already open
      if (takeKeepLink()) void openTakenLink()
      setView(viewFromHash())
    }
    window.addEventListener('hashchange', onHash)
    // Back and Forward between a lesson's address and another screen change the
    // path, not only the hash
    window.addEventListener('popstate', onHash)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('popstate', onHash)
    }
  }, [t])
  // a kept wallet follows its saved copy; a link the address held is opened (lib/keep.ts)
  useEffect(() => startKeep(), [])
  const go = (next: View) => {
    // from a lesson's address, the first screen is the root, not "/learn/<slug>#"
    if (next === 'home' && window.location.pathname !== '/') window.history.pushState(null, '', `/${window.location.search}`)
    else window.location.hash = next === 'home' ? '' : next
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => track('view', view), [view])

  // The first screen, Scam check and Practice don't use the market brief, so a
  // visitor who lands there doesn't wait for it (or pay for it on mobile data).
  // It loads the first time a screen that shows it is opened, and stays on.
  const showsBrief = view !== 'home' && view !== 'scamcheck' && view !== 'practice' && view !== 'replay'
  const [briefOn, setBriefOn] = useState(showsBrief)
  if (showsBrief && !briefOn) setBriefOn(true)
  const briefQuery = useBrief(config, briefOn)
  const statusQuery = useAppStatus()
  const [showGuide, setShowGuide] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3600)
    return () => window.clearTimeout(timer)
  }, [toast])

  // the Time machine is part of Practice: that tab stays lit
  const tab: View = view === 'replay' ? 'practice' : view
  const brief = briefQuery.data
  const updatedAt = brief?.generated_at ? new Date(brief.generated_at) : null
  const error = briefQuery.error ? (briefQuery.error as Error).message : null

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <TopBar view={tab} onView={go} onHelp={() => setShowGuide(true)} />

      {/* the first screen runs edge to edge; every other screen sits in one column */}
      <main className={view === 'home' ? '' : 'mx-auto max-w-5xl space-y-6 px-4 pt-5 md:px-6'}>
        {view === 'home' && <HomeView onView={go} />}
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
        {view === 'practice' && <PracticeView onToast={setToast} />}
        {view === 'replay' && <TimeMachineView onView={go} />}
        {view === 'learn' && <LearnView brief={brief} onView={go} />}
        {view === 'scamcheck' && <ScamCheckView />}
        {view === 'ask' && (
          <AskView brief={brief} watchlist={toAnalyzeParams(config)} aiEnabled={Boolean(statusQuery.data?.ai_enabled)} />
        )}
        {view === 'portfolio' && (
          <PortfolioView
            brief={brief}
            config={draft}
            onConfigChange={setDraft}
          />
        )}

        {/* On Scam check this sits right under the result, so it carries that tag.
            Learn and Practice show their own after a passed quiz or a trade. */}
        {view !== 'home' && view !== 'learn' && view !== 'practice' && view !== 'replay' && (
          <BotInvite place={view === 'scamcheck' ? 'scam' : 'footer'} />
        )}
      </main>

      <SiteFooter onFeedback={() => setShowFeedback(true)} />

      <BottomNav view={tab} onView={go} />
      <GuideModal open={showGuide} onClose={() => setShowGuide(false)} />
      <FeedbackModal open={showFeedback} onClose={() => setShowFeedback(false)} />

      {toast && (
        <div className="card rise fixed bottom-24 left-1/2 z-50 -translate-x-1/2 px-4 py-2 text-sm md:bottom-6">
          {toast}
        </div>
      )}
    </div>
  )
}
