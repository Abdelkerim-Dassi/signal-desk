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

export type Rating = 'strong' | 'neutral' | 'weak'

export function ratingKey(rating?: string): Rating {
  const r = String(rating || 'neutral').toLowerCase()
  return (['strong', 'neutral', 'weak'].includes(r) ? r : 'neutral') as Rating
}

export const ratingStyles: Record<Rating, string> = {
  strong: 'text-strong border-strong/40 bg-strong/10',
  neutral: 'text-neutral border-neutral/40 bg-neutral/10',
  weak: 'text-weak border-weak/40 bg-weak/10',
}

export const ratingTextClass: Record<Rating, string> = {
  strong: 'text-strong',
  neutral: 'text-neutral',
  weak: 'text-weak',
}

/** Engine thresholds — mirror advisor_engine.STRONG_MIN / WEAK_MAX / RISK_OFF_CAP. */
export const STRONG_MIN = 67
export const WEAK_MAX = 38
export const RISK_OFF_CAP = 66

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
