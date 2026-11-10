// Where a visitor came from, and a few anonymous counters.
//
// Each platform gets its own short address, typed from a video or tapped in a
// bio: qirat.tn/t (TikTok), /i (Instagram), /f (Facebook), /w (WhatsApp).
// The server keeps daily totals only (server/stats.py): no cookie, no device
// id, nothing about any one person.

export type Source = 't' | 'i' | 'f' | 'w'
export type Place = 'scam' | 'quiz' | 'practice' | 'footer'

const PATHS: Record<string, Source> = { '/t': 't', '/i': 'i', '/f': 'f', '/w': 'w' }
const SRC_KEY = 'qirat.src'
const SEEN_KEY = 'qirat.seen'
const VISIT_KEY = 'qirat.visit'
const BOT = 'https://t.me/getqirat_bot'

function read(store: 'local' | 'session', key: string): string | null {
  try {
    return (store === 'local' ? localStorage : sessionStorage).getItem(key)
  } catch {
    return null
  }
}

function write(store: 'local' | 'session', key: string, value: string): void {
  try {
    ;(store === 'local' ? localStorage : sessionStorage).setItem(key, value)
  } catch {
    // storage blocked: this visit still works, it just isn't remembered
  }
}

/** Count one event. Fire-and-forget: a lost count never touches the page. */
export function track(event: string, value?: string): void {
  try {
    const body = JSON.stringify({ event, value })
    if (navigator.sendBeacon?.('/api/stats/event', new Blob([body], { type: 'application/json' }))) return
    void fetch('/api/stats/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // counting is best-effort
  }
}

export interface Arrival {
  /** The short address used for this visit, if any. */
  source: Source | null
  /** True the first time this browser opens Qirat. */
  firstVisit: boolean
}

let arrival: Arrival | null = null

/** Read how this visit started. Safe to call more than once; it works once. */
export function arrive(): Arrival {
  if (arrival) return arrival
  const path = window.location.pathname.replace(/\/+$/, '').toLowerCase()
  const source = PATHS[path] ?? null
  const firstVisit = read('local', SEEN_KEY) === null
  write('local', SEEN_KEY, '1')
  if (source) write('local', SRC_KEY, source)

  // one visit per browser session, or again if they come back through a tagged address
  const counted = read('session', VISIT_KEY)
  const label = source ?? 'direct'
  if (counted === null || (source && counted !== source)) {
    track('visit', label)
    write('session', VISIT_KEY, label)
  }

  // The videos teach trading from zero, so a new or tagged visitor lands on
  // Learn, where a first visit also gets the "start here" strip (LearnView).
  // Put it in the address too. A link that names a screen (#scamcheck,
  // #practice, a lesson) is left alone.
  const { search, hash } = window.location
  const wantsStart = (source !== null || firstVisit) && hash.length <= 1
  if (wantsStart) window.history.replaceState(null, '', `${window.location.pathname}${search}#learn`)

  if (source) {
    // Tidy the address so a copied link doesn't pass "came from TikTok" on to
    // the next person. Wait a moment: the page-view counter reads the path first.
    window.setTimeout(() => {
      window.history.replaceState(null, '', `/${window.location.search}${window.location.hash}`)
    }, 3000)
  }

  arrival = { source, firstVisit }
  return arrival
}

/** The last tagged address this browser used, or "web" for none. */
export function lastSource(): Source | 'web' {
  const saved = read('local', SRC_KEY)
  return saved === 't' || saved === 'i' || saved === 'f' || saved === 'w' ? saved : 'web'
}

/** A link that starts the bot and tells it where the tap came from. */
export function botUrl(place: Place): string {
  return `${BOT}?start=${lastSource()}-${place}`
}

/** A phone set to Tunisian time, whatever language its menus are in. */
export function inTunisia(): boolean {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone === 'Africa/Tunis'
  } catch {
    return false
  }
}
