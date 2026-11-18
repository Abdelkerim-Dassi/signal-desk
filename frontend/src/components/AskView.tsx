import { useEffect, useRef, useState } from 'react'
import type { AnalyzeParams, Brief, ChatMessage } from '../lib/api'
import { generateBriefing, streamChat } from '../lib/api'
import { briefingHtml } from '../lib/format'
import { useI18n } from '../lib/i18n'
import Caption from './brand/Caption'
import { IconSend } from './Icons'
import MascotSays from './MascotSays'

const THROTTLE_MS = 5 * 60 * 1000 // client-side guard; the server narrative cache is the real one

const H1 = 'pt-1 text-[clamp(2.75rem,13.5vw,4rem)] md:text-[4.5rem] ltr:text-[clamp(2.4rem,11vw,3.4rem)] ltr:md:text-[4rem]'
// something Qirat wrote: a sheet of paper with one small corner, like the lesson card on the first screen
const SHEET = 'briefing-md rounded-[22px] rounded-es-[4px] bg-card px-4 py-3 text-[15px] shadow-[0_14px_22px_-16px_rgba(60,40,5,.5)]'

function Briefing({ brief, watchlist }: { brief: Brief | undefined; watchlist: AnalyzeParams }) {
  const { t, lang } = useI18n()
  const [text, setText] = useState<string | null>(null)
  const [textLang, setTextLang] = useState(lang)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastRunRef = useRef(0)

  const run = async () => {
    if (!brief || loading) return
    const since = Date.now() - lastRunRef.current
    // switching language is a different briefing, so it isn't throttled
    if (text && textLang === lang && since < THROTTLE_MS) {
      setError(t('ask.throttled', { s: Math.ceil((THROTTLE_MS - since) / 1000) }))
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await generateBriefing(watchlist, lang)
      setText(result.text)
      setTextLang(lang)
      lastRunRef.current = Date.now()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Briefing failed.')
    } finally {
      setLoading(false)
    }
  }

  const label = loading ? t('ask.writing') : text ? t('ask.regenerate') : t('ask.generate')
  return (
    <section className="pt-10 pb-2 md:pt-14" aria-labelledby="ask-brief">
      <Caption id="ask-brief" text={t('ask.briefTitle')} className="text-[2.1rem] md:text-5xl" />
      {/* it reads in the direction of the language it was written in */}
      {text && (
        <div
          className={`${SHEET} mt-5 max-w-2xl`}
          dir={textLang === 'ar' ? 'rtl' : 'ltr'}
          dangerouslySetInnerHTML={{ __html: briefingHtml(text) }}
        />
      )}
      {/* writing it is the action; once it is written, rewriting is the second choice */}
      {text ? (
        <button onClick={run} disabled={!brief || loading} className="alt mt-5 text-[15px] disabled:opacity-50">
          {label}
        </button>
      ) : (
        <button onClick={run} disabled={!brief || loading} className="go mt-5 w-full max-w-md disabled:cursor-default disabled:opacity-60">
          {label}
        </button>
      )}
      {error && <p className="mt-4 text-sm text-warn">{error}</p>}
    </section>
  )
}

function Chat({ brief, watchlist }: { brief: Brief | undefined; watchlist: AnalyzeParams }) {
  const { t, lang } = useI18n()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const coin = (brief?.opportunities?.[0]?.symbol || 'BTC').toUpperCase()
  const second = (brief?.opportunities?.[1]?.symbol || 'ETH').toUpperCase()
  const suggestions = [t('ask.s1', { coin }), t('ask.s2', { coin: second }), t('ask.s3')]

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
      )
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Chat failed.'
      setMessages((m) => {
        const next = [...m]
        const last = next[next.length - 1]
        next[next.length - 1] = { ...last, content: last.content || `⚠ ${msg}` }
        return next
      })
    } finally {
      setStreaming(false)
    }
  }

  return (
    <section className="md:grid md:grid-cols-2 md:gap-x-12 md:pt-6">
      <div>
        <Caption as="h1" text={t('ask.chatTitle')} className={H1} />
        <MascotSays className="mt-4 max-w-md">{t('ask.chatIntro')}</MascotSays>
      </div>

      <div className="md:pt-3">
        <div ref={scrollRef} className={`max-h-[55vh] space-y-3 overflow-y-auto ${messages.length ? 'mt-6 pb-5 md:mt-0' : ''}`}>
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
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            // nothing typed yet: the button points at the box
            if (!input.trim()) inputRef.current?.focus()
            send()
          }}
          className={`flex items-start gap-2.5 ${messages.length ? 'mt-1' : 'mt-6 md:mt-0'}`}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ask.placeholder')}
            disabled={streaming}
            maxLength={600}
            // empty, the box follows the page so its hint reads the right way round
            dir={input ? 'auto' : undefined}
            className="h-[50px] min-w-0 flex-1 rounded-[14px] border-2 border-text/15 bg-card px-4 text-[15px] outline-none transition placeholder:text-muted/80 focus:border-text/60 disabled:opacity-50"
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

        {messages.length === 0 && (
          <ul className="mt-4 text-[15px]">
            {suggestions.map((s) => (
              <li key={s}>
                <button type="button" onClick={() => send(s)} className="alt py-1.5 text-start text-balance">
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default function AskView({
  brief,
  watchlist,
  aiEnabled,
}: {
  brief: Brief | undefined
  /** The coins the answers are about; the server fetches their data itself. */
  watchlist: AnalyzeParams
  aiEnabled: boolean
}) {
  const { t } = useI18n()
  if (!aiEnabled)
    return (
      <section className="md:pt-6">
        <Caption as="h1" text={t('ask.chatTitle')} className={H1} />
        <MascotSays mood="worried" className="mt-4 max-w-md">
          {t('ask.off')}
        </MascotSays>
      </section>
    )
  return (
    <div>
      <Chat brief={brief} watchlist={watchlist} />
      <Briefing brief={brief} watchlist={watchlist} />
    </div>
  )
}
