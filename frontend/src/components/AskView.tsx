import { useEffect, useRef, useState } from 'react'
import type { Brief, ChatMessage } from '../lib/api'
import { generateBriefing, streamChat } from '../lib/api'
import { briefingHtml } from '../lib/format'
import { useI18n } from '../lib/i18n'
import { IconSend, IconSparkle } from './Icons'

const THROTTLE_MS = 5 * 60 * 1000 // client-side guard; the server narrative cache is the real one

function Briefing({ brief }: { brief: Brief | undefined }) {
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
      const result = await generateBriefing(brief, lang)
      setText(result.text)
      setTextLang(lang)
      lastRunRef.current = Date.now()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Briefing failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card hero-wash rise p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-xl">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <IconSparkle className="text-gold" /> {t('ask.briefTitle')}
          </h2>
          {!text && <p className="mt-1 text-sm text-muted">{t('ask.briefIntro')}</p>}
        </div>
        <button
          onClick={run}
          disabled={!brief || loading}
          className="cursor-pointer rounded-full bg-text px-4 py-2 text-sm font-medium text-bg transition hover:opacity-90 disabled:opacity-40"
        >
          {loading ? t('ask.writing') : text ? t('ask.regenerate') : t('ask.generate')}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-warn">{error}</p>}
      {loading && !text && (
        <p className="mt-4 text-sm text-muted">
          {t('ask.writing')}
          <span className="caret">▋</span>
        </p>
      )}
      {text && (
        <div
          className="briefing-md mt-3 text-[15px]"
          dir="auto"
          dangerouslySetInnerHTML={{ __html: briefingHtml(text) }}
        />
      )}
    </section>
  )
}

function Chat({ brief }: { brief: Brief | undefined }) {
  const { t, lang } = useI18n()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

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
        brief ?? null,
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
    <section className="card rise flex flex-col p-5" style={{ animationDelay: '80ms' }}>
      <h2 className="text-lg font-semibold">{t('ask.chatTitle')}</h2>
      <p className="mt-1 text-sm text-muted">{t('ask.chatIntro')}</p>

      <div ref={scrollRef} className="mt-4 max-h-[55vh] space-y-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            dir="auto"
            className={
              m.role === 'user'
                ? 'ms-auto w-fit max-w-[85%] rounded-2xl rounded-ee-md bg-text px-4 py-2.5 text-[15px] text-bg'
                : 'briefing-md me-auto max-w-[92%] rounded-2xl rounded-es-md bg-subtle px-4 py-2.5 text-[15px]'
            }
          >
            {m.role === 'assistant' ? (
              <>
                <div dangerouslySetInnerHTML={{ __html: briefingHtml(m.content) }} />
                {i === messages.length - 1 && streaming && <span className="caret text-gold">▋</span>}
              </>
            ) : (
              m.content
            )}
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="mt-1 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="cursor-pointer rounded-full border border-border px-3.5 py-1.5 text-sm transition hover:border-border-strong hover:text-gold"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('ask.placeholder')}
          disabled={streaming}
          dir="auto"
          className="min-w-0 flex-1 rounded-full border border-border bg-subtle/60 px-4 py-2.5 text-[15px] outline-none transition focus:border-border-strong disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          aria-label={t('ask.send')}
          className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-gold text-lg text-white transition hover:opacity-90 disabled:opacity-40 rtl:-scale-x-100"
        >
          <IconSend />
        </button>
      </form>
    </section>
  )
}

export default function AskView({ brief, aiEnabled }: { brief: Brief | undefined; aiEnabled: boolean }) {
  const { t } = useI18n()
  if (!aiEnabled) return <div className="card p-6 text-center text-sm text-muted">{t('ask.off')}</div>
  return (
    <div className="space-y-4">
      <Briefing brief={brief} />
      <Chat brief={brief} />
    </div>
  )
}
