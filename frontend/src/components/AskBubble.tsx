import { useEffect, useRef, useState } from 'react'
import type { AnalyzeParams, Brief, ChatMessage, PageContext } from '../lib/api'
import { streamChat } from '../lib/api'
import { briefingHtml } from '../lib/format'
import { useI18n } from '../lib/i18n'
import type { Lang, UIKey } from '../lib/i18n'
import { LESSONS } from '../lib/lessons'
import { routeId } from '../lib/route'
import { track } from '../lib/source'
import type { View } from '../lib/views'
import Mascot from './brand/Mascot'
import { IconSend, IconX } from './Icons'

/**
 * Ask Qirat: the gold bar at the bottom of every screen. Tap it and a chat opens
 * over the page (a sheet on a phone, a panel beside the page on a computer), so
 * a question never takes you away from the lesson or the trade you are on.
 * The conversation stays while you move between screens, until the page reloads.
 *
 * The AI is told which screen you are on, and on a lesson it gets that lesson's
 * text, so "explain this in simpler words" works. qirat.tn/#ask opens it.
 */

// something Qirat wrote: a sheet of paper with one small corner, like the lesson card on the first screen
const SHEET = 'briefing-md rounded-[20px] rounded-es-[4px] bg-card px-4 py-3 text-[15px] shadow-[0_10px_18px_-14px_rgba(60,40,5,.5)]'

// What each screen is, in a few words, for the AI (it answers in the page's language).
const SCREENS: Record<View, string> = {
  home: 'the first screen: short story videos, and buttons to start the first lesson or the practice wallet',
  learn: 'the list of lessons (a free course for beginners, each lesson ends with a 3-question quiz)',
  practice:
    'the practice wallet: pretend dollars, real live prices; the user buys and sells coins for practice, with no real money',
  replay: 'the Time machine: a past month of the market replayed day by day with pretend money',
  today: "Today: each coin's karat and risk, and the market weather",
  portfolio: 'Portfolio: the coins and amounts the user typed in, kept only in this browser',
  record: 'the track record of past grades',
}

function pageContext(view: View, id: string, lang: Lang): PageContext {
  if (id.startsWith('learn-')) {
    const lesson = LESSONS.find((l) => l.slug === id.slice('learn-'.length))
    if (lesson) {
      const parts = [
        lesson.hook[lang],
        ...(lesson.sections ?? []).map((s) => `${s.h[lang]}\n${s.p[lang]}`),
        lesson.takeaway?.[lang] ?? '',
      ]
      return {
        page: `the lesson "${lesson.title.en}"`,
        page_text: parts.filter(Boolean).join('\n\n').slice(0, 6000),
      }
    }
  }
  return { page: SCREENS[view] }
}

/** The questions offered before the first one: one for this screen, then two for anywhere. */
function suggestionKeys(view: View, id: string): UIKey[] {
  const here: UIKey =
    id.startsWith('learn-') ? 'ask.sLesson'
    : view === 'practice' ? 'ask.sPractice'
    : view === 'replay' ? 'ask.sReplay'
    : view === 'today' || view === 'portfolio' ? 'ask.sCoin'
    : 'ask.sStart'
  return [here, 'ask.sBitcoin', 'ask.sRisk']
}

/** How much of the bottom of the screen a phone's keyboard covers, so the sheet sits above it. */
function useKeyboardInset(active: boolean): number {
  const [inset, setInset] = useState(0)
  useEffect(() => {
    const vv = window.visualViewport
    if (!active || !vv || !window.matchMedia('(max-width: 767.98px)').matches) return
    const update = () => setInset(Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop)))
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [active])
  return active ? inset : 0
}

const ASK = 'ask'
/** qirat.tn/#ask (also the old address of the Ask screen) opens the chat; the address then drops it. */
function dropAskFromAddress(): void {
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
}

export default function AskBubble({
  view,
  brief,
  watchlist,
  aiEnabled,
}: {
  view: View
  brief: Brief | undefined
  /** The coins the answers are about; the server fetches their data itself. */
  watchlist: AnalyzeParams
  aiEnabled: boolean
}) {
  const { t, lang } = useI18n()
  const [id, setId] = useState(routeId)
  const [open, setOpen] = useState(() => routeId() === ASK)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const keyboard = useKeyboardInset(open)

  const openChat = (from: View) => {
    setOpen(true)
    track('chat_open', from)
  }

  // the screen's id (a lesson's, too), kept up to date as the visitor moves
  useEffect(() => {
    if (routeId() === ASK) {
      track('chat_open', 'home')
      dropAskFromAddress()
    }
    const update = () => {
      if (routeId() === ASK) {
        setOpen(true)
        track('chat_open', 'home')
        dropAskFromAddress()
      }
      setId(routeId())
    }
    window.addEventListener('hashchange', update)
    window.addEventListener('popstate', update)
    return () => {
      window.removeEventListener('hashchange', update)
      window.removeEventListener('popstate', update)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    // on a computer the box is ready to type in; on a phone the keyboard would hide the suggestions
    if (window.matchMedia('(min-width: 768px)').matches) inputRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  if (!aiEnabled) return null

  const coin = (brief?.opportunities?.[0]?.symbol || 'BTC').toUpperCase()
  const suggestions = suggestionKeys(view, id).map((k) => t(k, { coin }))

  const send = async (raw?: string) => {
    const question = (raw ?? input).trim()
    if (!question || streaming) return
    setInput('')
    const history = messages
    setMessages((m) => [...m, { role: 'user', content: question }, { role: 'assistant', content: '' }])
    setStreaming(true)
    try {
      await streamChat(
        question,
        watchlist,
        history,
        (chunk) => {
          setMessages((m) => {
            const next = [...m]
            const last = next[next.length - 1]
            next[next.length - 1] = { ...last, content: last.content + chunk }
            return next
          })
        },
        lang,
        pageContext(view, id, lang),
      )
    } catch {
      // the server's reason is in English (busy, too many questions): say it in the page's language
      setMessages((m) => {
        const next = [...m]
        const last = next[next.length - 1]
        next[next.length - 1] = { ...last, content: last.content || t('ask.error') }
        return next
      })
    } finally {
      setStreaming(false)
    }
  }

  if (!open)
    return (
      <button
        type="button"
        onClick={() => openChat(view)}
        className="ask-fab fixed end-4 z-40 flex h-14 cursor-pointer items-center gap-2 rounded-full bg-marker ps-2 pe-4 text-[15px] font-bold text-on-marker shadow-[0_10px_22px_-10px_rgba(60,40,5,.65)] transition hover:brightness-105 active:translate-y-px md:end-6"
      >
        <Mascot mood="happy" size={46} blink className="translate-y-1" />
        {t('ask.fab')}
      </button>
    )

  return (
    <>
      {/* on a phone the sheet covers the page, so a tap above it closes it */}
      <button
        type="button"
        className="fixed inset-0 z-50 cursor-default bg-black/35 md:hidden"
        aria-label={t('ask.close')}
        onClick={() => setOpen(false)}
      />
      <section
        role="dialog"
        aria-label={t('ask.title')}
        className="fixed inset-x-0 bottom-0 z-50 flex h-[82dvh] flex-col rounded-t-[26px] bg-bg shadow-[0_-12px_30px_-12px_rgba(21,23,28,.35)] md:inset-x-auto md:end-6 md:bottom-6 md:h-[min(620px,calc(100dvh-6rem))] md:w-[400px] md:rounded-[26px] md:border-2 md:border-text/10 md:shadow-[0_24px_50px_-20px_rgba(60,40,5,.55)]"
        style={keyboard ? { bottom: keyboard, height: `min(82dvh, ${window.visualViewport!.height - 12}px)` } : undefined}
      >
        <header className="flex items-center gap-3 border-b-2 border-dashed border-text/10 px-4 py-3">
          {/* the bar always stands on its sun: never on a dark page */}
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-marker" aria-hidden>
            <Mascot mood="happy" size={32} className="translate-y-0.5" />
          </span>
          <h2 className="min-w-0 flex-1 truncate text-[17px] font-bold">{t('ask.title')}</h2>
          {messages.length > 0 && !streaming && (
            <button type="button" onClick={() => setMessages([])} className="alt shrink-0 text-[14px]">
              {t('ask.reset')}
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t('ask.close')}
            className="link grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl text-xl text-muted transition hover:bg-subtle hover:text-text"
          >
            <IconX />
          </button>
        </header>

        <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
          <div className="flex justify-start">
            <p className={`${SHEET} max-w-[92%]`}>{t('ask.intro')}</p>
          </div>
          {/* The question sits on the marker at the far side, the answer is a sheet on the near side.
              An answer comes in the page's language, so it reads in the page's direction even when
              it opens with a ticker; a question reads in whatever was typed. */}
          {messages.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="flex justify-end">
                <p className="max-w-[85%] rounded-[18px] rounded-ee-[4px] bg-marker px-4 py-2.5 text-[15px] font-medium text-on-marker">
                  <span dir="auto" className="block">
                    {m.content}
                  </span>
                </p>
              </div>
            ) : (
              <div key={i} className="flex justify-start">
                <div className={`${SHEET} max-w-[92%]`}>
                  <div dangerouslySetInnerHTML={{ __html: briefingHtml(m.content) }} />
                  {i === messages.length - 1 && streaming && <span className="caret">▋</span>}
                </div>
              </div>
            ),
          )}
          {messages.length === 0 && (
            <ul className="space-y-2 pt-1">
              {suggestions.map((s) => (
                <li key={s} className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => send(s)}
                    className="cursor-pointer rounded-[18px] rounded-ee-[4px] border-2 border-marker px-4 py-2 text-start text-[15px] font-medium text-balance transition hover:bg-marker/30"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            // nothing typed yet: the button points at the box
            if (!input.trim()) inputRef.current?.focus()
            send()
          }}
          className="flex items-start gap-2.5 px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ask.placeholder')}
            disabled={streaming}
            maxLength={600}
            enterKeyHint="send"
            // empty, the box follows the page so its hint reads the right way round
            dir={input ? 'auto' : undefined}
            className="h-[50px] min-w-0 flex-1 rounded-[14px] border-2 border-text/15 bg-card px-4 text-[16px] outline-none transition placeholder:text-muted/80 focus:border-text/60 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={streaming}
            aria-label={t('ask.send')}
            className="go go-sm grid size-[50px] shrink-0 place-items-center p-0 text-xl disabled:cursor-default disabled:opacity-60"
          >
            <IconSend className="rtl:-scale-x-100" />
          </button>
        </form>
      </section>
    </>
  )
}
