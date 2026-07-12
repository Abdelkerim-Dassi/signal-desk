import { useEffect, useRef, useState } from 'react'
import type { Brief, ChatMessage } from '../lib/api'
import { streamChat } from '../lib/api'
import DeskHead from './DeskHead'

export default function ChatPanel({
  brief,
  aiEnabled,
}: {
  brief: Brief | undefined
  aiEnabled: boolean
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  if (!aiEnabled) return null

  const send = async () => {
    const question = input.trim()
    if (!question || streaming) return
    setInput('')
    const history = messages
    setMessages((m) => [...m, { role: 'user', content: question }, { role: 'assistant', content: '' }])
    setStreaming(true)
    try {
      await streamChat(question, brief ?? null, history, (chunk) => {
        setMessages((m) => {
          const next = [...m]
          const last = next[next.length - 1]
          next[next.length - 1] = { ...last, content: last.content + chunk }
          return next
        })
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Chat failed.'
      setMessages((m) => {
        const next = [...m]
        const last = next[next.length - 1]
        next[next.length - 1] = {
          ...last,
          content: last.content || `⚠ ${msg}`,
        }
        return next
      })
    } finally {
      setStreaming(false)
    }
  }

  return (
    <section className="glass rise flex flex-col p-4" style={{ animationDelay: '220ms' }}>
      <DeskHead title="Ask the desk" meta="grounded in live data" />

      <div
        ref={scrollRef}
        className="mt-3 max-h-72 min-h-24 space-y-2.5 overflow-y-auto pr-1 text-[13px]"
      >
        {messages.length === 0 && (
          <p className="text-xs leading-relaxed text-mute">
            Ask about the current signals — e.g. <em>"why is INJ a hold right now?"</em> Answers are
            grounded strictly in the live data above. Not financial advice.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === 'user'
                ? 'ml-6 rounded-lg rounded-br-sm border border-line-2 bg-teal/10 px-3 py-2'
                : 'mr-2 rounded-lg rounded-bl-sm border border-line bg-panel-2/70 px-3 py-2 whitespace-pre-wrap'
            }
          >
            {m.content}
            {m.role === 'assistant' && i === messages.length - 1 && streaming && (
              <span className="caret text-teal">▋</span>
            )}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
        className="mt-3 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={streaming ? 'streaming…' : 'ask about the market…'}
          disabled={streaming}
          className="num w-full min-w-0 rounded-md border border-line bg-panel-2/80 px-3 py-2 text-xs outline-none transition focus:border-line-2 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="cursor-pointer rounded-md border border-line-2 bg-teal/10 px-3 font-display text-xs font-semibold text-teal transition hover:bg-teal/20 disabled:opacity-40"
        >
          ➤
        </button>
      </form>
    </section>
  )
}
