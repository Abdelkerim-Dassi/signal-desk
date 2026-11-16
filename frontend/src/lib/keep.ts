// Keep my wallet: a saved copy of the practice wallet and the lesson progress
// behind a private link (server/keep.py).
//
// Both live in this browser's storage only, and most visitors arrive inside
// the TikTok, Instagram or Facebook in-app browser, which shares nothing with
// Chrome or Safari. A visitor who keeps their wallet gets a link,
// qirat.tn/#keep-<id>; opening it in any browser brings the wallet back, and
// from then on that browser follows the saved copy too.
//
// No account and no personal data. The id is the only key, so it is treated
// as a secret: it sits in the address *fragment*, which is never sent to a
// server, it is taken out of the address as soon as it is read, and it goes
// to our server in a request body only.
//
// How two browsers stay in step. Every save gives the copy a new `rev`. A
// browser remembers the rev it last saw and a fingerprint of what it last
// sent or received:
//   * its own wallet or lessons change           → it saves (the copy is replaced whole)
//   * on opening, or coming back to the page     → it reads the copy; a rev it
//     has not seen means another browser saved since, and that copy replaces
//     what is here
// The last browser to save wins. That is right for one person moving between
// browsers; two browsers trading in the same minute would lose one trade.

import { useSyncExternalStore } from 'react'
import { saveLedger, storedLedger } from './practice'
import type { Ledger } from './practice'
import { isOwner, track } from './source'

const KEY = 'qirat.keep'
const LEARN_KEY = 'qirat.learn.v1' // written by lib/learnProgress.ts
const ID = /^[A-Za-z0-9_-]{32}$/
const LINK = /^#keep-(.*)$/i
const SAVE_AFTER_MS = 700
const READ_AT_MOST_EVERY_MS = 30_000

/** Fired on window once the saved copy has replaced what this browser held. */
export const RESTORED = 'qirat:restored'

interface Kept {
  id: string
  /** the saved copy's revision this browser last sent or received */
  rev: string
  /** fingerprint of what was sent or received with it */
  sum: string
}

interface LessonDone {
  read?: boolean
  best?: number
  passed?: boolean
}

interface Learn {
  lessons: Record<string, LessonDone>
  bestKarat: number
}

interface Copy {
  ledger: Ledger
  learn: Learn | null
}

interface Saved extends Copy {
  rev: string
}

export type LinkState =
  | { status: 'idle' }
  | { status: 'opening' }
  | { status: 'opened' }
  /** the link is wrong, or its copy has expired */
  | { status: 'gone' }
  | { status: 'failed' }
  /** this browser has its own wallet with trades: the visitor chooses */
  | { status: 'ask'; savedTrades: number; localTrades: number }

export interface KeepState {
  /** the id this browser's wallet is kept under, or null */
  id: string | null
  link: LinkState
}

class KeepError extends Error {
  code: string
  constructor(code: string) {
    super(code)
    this.code = code
  }
}

// ── this browser's record ───────────────────────────────────────────────────

function readKept(): Kept | null {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Partial<Kept> | null
    if (saved && typeof saved.id === 'string' && ID.test(saved.id) && typeof saved.rev === 'string') {
      return { id: saved.id, rev: saved.rev, sum: typeof saved.sum === 'string' ? saved.sum : '' }
    }
  } catch {
    // unreadable: not kept
  }
  return null
}

/** False when the browser would not hold the record (storage blocked or full). */
function writeKept(next: Kept | null): boolean {
  try {
    if (next) localStorage.setItem(KEY, JSON.stringify(next))
    else localStorage.removeItem(KEY)
    kept = next
    return true
  } catch {
    return false
  }
}

let kept: Kept | null = readKept()
let link: LinkState = { status: 'idle' }
let state: KeepState = { id: kept?.id ?? null, link }
const listeners = new Set<() => void>()

function emit(): void {
  state = { id: kept?.id ?? null, link }
  listeners.forEach((fn) => fn())
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Whether this browser's wallet is kept, and what a link being opened is doing. */
export function useKeep(): KeepState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  )
}

export function keepLink(id: string): string {
  return `${window.location.origin}/#keep-${id}`
}

// ── what is saved ───────────────────────────────────────────────────────────

/** Lesson progress in one fixed shape and order, so two equal records look equal. */
function tidyLearn(raw: unknown): Learn | null {
  const r = raw as Partial<Learn> | null
  if (!r || typeof r !== 'object' || !r.lessons || typeof r.lessons !== 'object') return null
  const lessons: Record<string, LessonDone> = {}
  for (const slug of Object.keys(r.lessons).sort()) {
    const p = r.lessons[slug]
    if (!/^[a-z0-9][a-z0-9-]{0,59}$/.test(slug) || !p || typeof p !== 'object') continue
    const done: LessonDone = {}
    if (typeof p.read === 'boolean') done.read = p.read
    if (typeof p.best === 'number' && Number.isFinite(p.best)) done.best = Math.max(0, Math.min(10, Math.round(p.best)))
    if (typeof p.passed === 'boolean') done.passed = p.passed
    lessons[slug] = done
  }
  const karat = [10, 14, 18, 22, 24].includes(r.bestKarat as number) ? (r.bestKarat as number) : 10
  return { lessons, bestKarat: karat }
}

function readLearn(): Learn | null {
  try {
    return tidyLearn(JSON.parse(localStorage.getItem(LEARN_KEY) ?? 'null'))
  } catch {
    return null
  }
}

/** Joining a saved copy never takes a lesson away: the two records are added up. */
function mergeLearn(a: Learn | null, b: Learn | null): Learn | null {
  if (!a || !b) return a ?? b
  const lessons: Record<string, LessonDone> = {}
  for (const slug of [...new Set([...Object.keys(a.lessons), ...Object.keys(b.lessons)])]) {
    const x = a.lessons[slug] ?? {}
    const y = b.lessons[slug] ?? {}
    const done: LessonDone = {}
    if (x.read || y.read) done.read = true
    if (x.best != null || y.best != null) done.best = Math.max(x.best ?? 0, y.best ?? 0)
    if (x.passed || y.passed) done.passed = true
    lessons[slug] = done
  }
  return tidyLearn({ lessons, bestKarat: Math.max(a.bestKarat, b.bestKarat) })
}

/**
 * What this browser holds, or null when no wallet is stored here. Never a
 * made-up empty wallet: saving that would wipe the copy.
 */
function held(): Copy | null {
  const ledger = storedLedger()
  return ledger ? { ledger, learn: readLearn() } : null
}

function sumOf(copy: Copy): string {
  const text = JSON.stringify(copy)
  let h = 0x811c9dc5 // FNV-1a
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return `${text.length}.${(h >>> 0).toString(36)}`
}

async function post<T>(path: string, body: unknown, leaving = false): Promise<T> {
  const text = JSON.stringify(body)
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: text,
    // lets a save finish while the page is closing (browsers allow it for small bodies only)
    keepalive: leaving && text.length < 60_000,
  })
  const data = (await res.json().catch(() => null)) as ({ ok?: boolean; code?: string } & T) | null
  if (!res.ok || !data || data.ok === false) throw new KeepError(data?.code ?? 'unavailable')
  return data
}

/**
 * What a read sends. The server counts a kept wallet opened in a later week
 * as one that came back (keep:back); a browser marked as ours says so, to
 * stay out of that count like every other.
 */
const reading = (id: string) => (isOwner() ? { id, own: true } : { id })

// ── saving ──────────────────────────────────────────────────────────────────

/** Make the saved copy and its link. Throws when it could not be made. */
export async function keepWallet(): Promise<void> {
  const copy = held()
  if (!copy) throw new KeepError('no_storage')
  const made = await post<{ id: string; rev: string }>('/api/keep/save', copy)
  if (!writeKept({ id: made.id, rev: made.rev, sum: sumOf(copy) })) throw new KeepError('no_storage')
  track('keep', 'created')
  emit()
  keepChanged() // a trade confirmed while the request was away
}

let timer: number | undefined
let saving = false

/** Call after the wallet or the lessons changed in this browser. Does nothing unless the wallet is kept. */
export function keepChanged(): void {
  if (!kept) return
  const copy = held()
  if (!copy || sumOf(copy) === kept.sum) return
  window.clearTimeout(timer)
  timer = window.setTimeout(() => void save(), SAVE_AFTER_MS)
}

async function save(leaving = false): Promise<void> {
  timer = undefined
  const copy = held()
  if (!kept || !copy || saving) return
  saving = true
  const id = kept.id
  try {
    const { rev } = await post<{ rev: string }>('/api/keep/save', { id, ...copy }, leaving)
    if (kept?.id === id) writeKept({ id, rev, sum: sumOf(copy) })
    saving = false
    keepChanged() // whatever changed while this save was away
  } catch (err) {
    saving = false
    // The copy is gone (expired): this wallet is no longer kept, and the screen
    // offers to keep it again. Any other failure waits for the next change or visit.
    if ((err as KeepError).code === 'unknown' && kept?.id === id) {
      writeKept(null)
      emit()
    }
  }
}

// ── following the saved copy ────────────────────────────────────────────────

/**
 * Put the saved copy in place of what this browser holds. `joining` is the
 * first time, from a link: lessons done here are added to the saved ones.
 * False when the browser would not hold it.
 */
function adopt(id: string, saved: Saved, joining: boolean): boolean {
  saveLedger(saved.ledger)
  const ledger = storedLedger()
  if (!ledger) return false
  const theirs = tidyLearn(saved.learn)
  const learn = joining ? mergeLearn(readLearn(), theirs) : theirs
  try {
    // a copy saved without lessons leaves the lessons here alone
    if (learn) localStorage.setItem(LEARN_KEY, JSON.stringify(learn))
  } catch {
    // the wallet came through; lessons stay as they were
  }
  // the fingerprint is of what the server holds, so lessons added here go up next
  if (!writeKept({ id, rev: saved.rev, sum: sumOf({ ledger, learn: theirs }) })) return false
  window.dispatchEvent(new Event(RESTORED))
  emit()
  keepChanged()
  return true
}

let lastRead = 0

/** Read the saved copy of a kept wallet and take it if another browser saved since. */
async function follow(): Promise<void> {
  if (!kept || Date.now() - lastRead < READ_AT_MOST_EVERY_MS) return
  lastRead = Date.now()
  const id = kept.id
  try {
    const saved = await post<Saved>('/api/keep/open', reading(id))
    if (kept?.id !== id) return
    if (saved.rev !== kept.rev) adopt(id, saved, false)
    else keepChanged() // a save that did not get through last time
  } catch (err) {
    if ((err as KeepError).code === 'unknown' && kept?.id === id) {
      writeKept(null)
      emit()
    }
  }
}

// ── opening a link ──────────────────────────────────────────────────────────

let pending: string | null = null
let asking: { id: string; saved: Saved } | null = null

/**
 * Take a keep link out of the address, if it holds one. The id leaves the
 * address at once (before the page-view counter or a copied address can
 * carry it), and the visit goes to the practice screen. True when there was
 * a link; openTakenLink() then loads it.
 */
export function takeKeepLink(): boolean {
  const found = LINK.exec(window.location.hash)
  if (!found) return false
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#practice`)
  pending = found[1]
  return true
}

function join(id: string, saved: Saved): void {
  const done = adopt(id, saved, true)
  if (done) track('keep', 'opened')
  link = { status: done ? 'opened' : 'failed' }
  emit()
}

/** Load the link takeKeepLink() found. */
export async function openTakenLink(): Promise<void> {
  const id = pending
  if (id === null) return
  asking = null
  if (!ID.test(id)) {
    pending = null
    link = { status: 'gone' }
    emit()
    return
  }
  link = { status: 'opening' }
  emit()
  let saved: Saved
  try {
    saved = await post<Saved>('/api/keep/open', reading(id))
  } catch (err) {
    const gone = ['unknown', 'bad_id'].includes((err as KeepError).code)
    if (gone) pending = null // anything else can be tried again
    if (gone && kept?.id === id) writeKept(null) // this browser's own copy has expired
    link = { status: gone ? 'gone' : 'failed' }
    emit()
    return
  }
  pending = null
  if (kept?.id === id) {
    // this browser already follows that copy
    if (saved.rev !== kept.rev) adopt(id, saved, false)
    link = { status: 'opened' }
    emit()
    return
  }
  const mine = storedLedger()
  const theirs = saved.ledger
  const sameWallet =
    mine !== null &&
    mine.startedAt === theirs.startedAt &&
    mine.trades.length === theirs.trades.length &&
    mine.trades.at(-1)?.ts === theirs.trades.at(-1)?.ts
  if (!mine || mine.trades.length === 0 || sameWallet) {
    join(id, saved) // nothing here to lose
    return
  }
  asking = { id, saved }
  link = { status: 'ask', savedTrades: theirs.trades.length, localTrades: mine.trades.length }
  emit()
}

/** The visitor's answer to "which wallet do you keep?". */
export function chooseWallet(which: 'saved' | 'here'): void {
  const a = asking
  asking = null
  if (a && which === 'saved') {
    join(a.id, a.saved)
    return
  }
  link = { status: 'idle' }
  emit()
}

export function retryLink(): void {
  void openTakenLink()
}

export function dismissLink(): void {
  if (link.status === 'idle' || link.status === 'ask') return
  link = { status: 'idle' }
  emit()
}

// ── start-up ────────────────────────────────────────────────────────────────

let booted = false

/**
 * Called once the app is on screen: opens the link the address held, or
 * catches up with the saved copy, and keeps doing so whenever the visitor
 * comes back to the page. Returns the clean-up.
 */
export function startKeep(): () => void {
  const back = () => {
    if (document.visibilityState === 'visible') void follow()
  }
  const leave = () => {
    if (timer === undefined) return
    window.clearTimeout(timer)
    void save(true)
  }
  document.addEventListener('visibilitychange', back)
  window.addEventListener('pagehide', leave)
  if (!booted) {
    booted = true
    if (pending !== null) void openTakenLink()
    else void follow()
  }
  return () => {
    document.removeEventListener('visibilitychange', back)
    window.removeEventListener('pagehide', leave)
  }
}
