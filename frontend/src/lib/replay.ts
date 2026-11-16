// Time machine, the browser's side: the game in progress, what was played
// before, the one call that scores a finished month, and the counters.
//
// The month is played here with no request (lib/replayEngine.ts). When it is
// over the moves go to the server once; it plays them again with the practice
// wallet's tested maths and answers with the result, the Bitcoin line and the
// reveal (server/replay.py). Storage can be blocked, so every access is
// guarded and a game still works for the visit without it.

import { R } from './i18n-replay'
import type { ReplayKey } from './i18n-replay'
import { useI18n } from './i18n'
import { REPLAYS as DATA } from './replayData'
import type { Move, ReplayScenario } from './replayEngine'
import { markActive } from './returning'
import { track } from './source'

export const REPLAYS = DATA as ReplayScenario[]

export function scenarioById(id: string | null | undefined): ReplayScenario | null {
  return REPLAYS.find((s) => s.id === id) ?? null
}

/** The scenario a link names: qirat.tn/#replay-m1. */
export function scenarioFromHash(): ReplayScenario | null {
  const found = /^#replay-([a-z0-9]+)$/i.exec(window.location.hash)
  return found ? scenarioById(found[1].toLowerCase()) : null
}

export function replayLink(id: string): string {
  return `${window.location.origin}/#replay-${id}`
}

// ── the game in progress ────────────────────────────────────────────────────

export interface Game {
  id: string
  /** the day on screen: 0 at the start, the scenario's `days` at the end */
  day: number
  moves: Move[]
}

const GAME_KEY = 'qirat.replay.game'
const SEEN_KEY = 'qirat.replay.seen'

function readJson<T>(key: string): T | null {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null') as T | null
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // not kept; the game goes on for this visit
  }
}

export function loadGame(): Game | null {
  const g = readJson<Partial<Game>>(GAME_KEY)
  const sc = scenarioById(g?.id)
  if (!g || !sc || !Number.isInteger(g.day) || !Array.isArray(g.moves)) return null
  const day = Math.max(0, Math.min(sc.days, g.day as number))
  return { id: sc.id, day, moves: g.moves.filter((m) => m && Number.isInteger(m.day) && m.day <= day) }
}

export function saveGame(game: Game | null): void {
  writeJson(GAME_KEY, game)
}

// ── what this browser has played ────────────────────────────────────────────

export interface Played {
  started?: boolean
  finished?: boolean
  /** the last finished game: its result and the same start held in Bitcoin */
  last?: { value: number; hold: number | null }
}

type Seen = Record<string, Played>

export function played(id: string): Played {
  return readJson<Seen>(SEEN_KEY)?.[id] ?? {}
}

function remember(id: string, change: Played): void {
  const seen = readJson<Seen>(SEEN_KEY) ?? {}
  writeJson(SEEN_KEY, { ...seen, [id]: { ...seen[id], ...change } })
}

/**
 * A scenario is started. Counted once per browser as a start (the people who
 * tried it); every later start is "played again".
 */
export function startGame(id: string): Game {
  track(played(id).started ? 'replay_again' : 'replay_start', id)
  remember(id, { started: true })
  const game: Game = { id, day: 0, moves: [] }
  saveGame(game)
  return game
}

/** The last day is on screen. Counted once per browser as a finish, whether or not the server answers. */
export function reachedEnd(id: string): void {
  if (!played(id).finished) track('replay_done', id)
  remember(id, { finished: true })
  markActive()
}

export function rememberResult(id: string, value: number, hold: number | null): void {
  remember(id, { last: { value, hold } })
}

// ── the result ──────────────────────────────────────────────────────────────

export interface ReplayNote {
  id: 'fomo' | 'panic' | 'concentration' | 'overtrading'
  day: number
  base?: string
  name?: string
  pct?: number
  count?: number
}

export interface ReplayResult {
  start: number
  value: number
  pct: number
  hold_value: number
  hold_pct: number
  trades: number
  costs: number
  skipped: number
  curve: { day: number; value: number; hold: number }[]
  notes: ReplayNote[]
}

export interface Reveal {
  event: string
  from: string
  to: string
  coins: { key: string; base: string; name: string; pct: number }[]
}

export interface Finished {
  result: ReplayResult
  reveal: Reveal
}

/** Score a finished month on the server. Throws when it cannot be reached. */
export async function finishGame(game: Game): Promise<Finished> {
  const res = await fetch('/api/replay/finish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: game.id, moves: game.moves }),
  })
  const data = (await res.json().catch(() => null)) as ({ ok?: boolean } & Partial<Finished>) | null
  if (!res.ok || !data?.ok || !data.result || !data.reveal) throw new Error('replay_unavailable')
  return { result: data.result, reveal: data.reveal }
}

// ── words and numbers ───────────────────────────────────────────────────────

export function useReplayT() {
  const { lang } = useI18n()
  const tr = (key: ReplayKey, vars?: Record<string, string | number>) => {
    let s: string = R[key][lang]
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
    return s
  }
  return { tr, lang }
}

/** Pretend dollars: 1,034.20 $ */
export function dollars(n: number | null | undefined, digits = 2): string {
  if (n == null || !Number.isFinite(n)) return '--'
  return `${n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })} $`
}
