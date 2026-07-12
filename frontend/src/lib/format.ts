export function compactCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '--'
  const n = Number(value)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: Math.abs(n) >= 1_000_000 ? 'compact' : 'standard',
    maximumFractionDigits: Math.abs(n) >= 1000 ? 1 : 4,
  }).format(n)
}

export function percent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '--'
  const n = Number(value)
  return `${n > 0 ? '+' : ''}${n.toFixed(2)}%`
}

export function changeColor(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'text-mute'
  return Number(value) >= 0 ? 'text-buy' : 'text-sell'
}

export type Action = 'buy' | 'sell' | 'hold' | 'avoid'

export function actionKey(action?: string): Action {
  const a = String(action || 'hold').toLowerCase()
  return (['buy', 'sell', 'hold', 'avoid'].includes(a) ? a : 'hold') as Action
}

export const actionStyles: Record<Action, string> = {
  buy: 'text-buy border-buy/40 bg-buy/10',
  sell: 'text-sell border-sell/40 bg-sell/10',
  hold: 'text-hold border-hold/40 bg-hold/10',
  avoid: 'text-avoid border-avoid/40 bg-avoid/10',
}

/** Compact relative time for feed items, e.g. "3h ago". Null when unparseable. */
export function timeAgo(dateString?: string): string | null {
  if (!dateString) return null
  const t = new Date(dateString).getTime()
  if (Number.isNaN(t)) return null
  const seconds = Math.max(0, (Date.now() - t) / 1000)
  if (seconds < 90) return 'just now'
  const minutes = seconds / 60
  if (minutes < 60) return `${Math.round(minutes)}m ago`
  const hours = minutes / 60
  if (hours < 24) return `${Math.round(hours)}h ago`
  return `${Math.round(hours / 24)}d ago`
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return minutes <= 0 ? `${rest}s` : `${minutes}m ${String(rest).padStart(2, '0')}s`
}

/** Minimal, escape-first markdown renderer for the AI briefing (headings, bold, bullets). */
export function briefingHtml(markdown: string): string {
  const escaped = markdown
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
  const lines = escaped.split('\n')
  const out: string[] = []
  let inList = false
  const closeList = () => {
    if (inList) {
      out.push('</ul>')
      inList = false
    }
  }
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      closeList()
      continue
    }
    const inline = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    if (/^#{1,4}\s/.test(line)) {
      closeList()
      out.push(`<h3>${inline.replace(/^#{1,4}\s*/, '')}</h3>`)
    } else if (/^\d+\.\s*<strong>/.test(inline)) {
      // "1. **Market Pulse** — ..." section headers from the prompt format
      closeList()
      out.push(`<h3>${inline.replace(/^\d+\.\s*/, '').replace(/<\/?strong>/g, '')}</h3>`)
    } else if (/^[-*•]\s+/.test(line)) {
      if (!inList) {
        out.push('<ul>')
        inList = true
      }
      out.push(`<li>${inline.replace(/^[-*•]\s+/, '')}</li>`)
    } else {
      closeList()
      out.push(`<p>${inline}</p>`)
    }
  }
  closeList()
  return out.join('')
}
