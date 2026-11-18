import type { ElementType } from 'react'
import { useI18n } from '../../lib/i18n'
import { glue } from '../../lib/typo'

/** A headline in the videos' caption style. Words inside [[double brackets]]
 *  sit on the gold marker. Each word is its own span so the first screen can
 *  land them one by one (.arrive in reel.css); elsewhere they simply show. */
export default function Caption({
  text,
  as: Tag = 'h2',
  className = '',
  id,
}: {
  text: string
  as?: ElementType
  className?: string
  id?: string
}) {
  const { lang } = useI18n()
  let i = 0
  const parts = glue(text, lang).split(/(\[\[.*?\]\]|\n)/).filter(Boolean)
  return (
    <Tag id={id} className={`poster ${className}`}>
      {parts.map((part, k) => {
        if (part === '\n') return <br key={k} />
        const marked = part.startsWith('[[')
        const words = (marked ? part.slice(2, -2) : part).split(/( +)/)
        const spans = words.map((w, j) =>
          w.trim() ? (
            <span key={j} className="w" style={{ ['--i' as string]: i++ }}>
              {w}
            </span>
          ) : (
            w
          ),
        )
        return marked ? (
          <mark key={k} className="mk">
            {spans}
          </mark>
        ) : (
          <span key={k}>{spans}</span>
        )
      })}
    </Tag>
  )
}
