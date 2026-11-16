// Coming back, counted without knowing who.
//
// The roadmap's checkpoints ask how many people are active in two different
// weeks, how many are active in a month, how many passed a first lesson and
// how many finished a level. This browser remembers the last week and month
// it was active in, and reports a change as one anonymous count (server/stats.py):
//   active:new    the first time this browser does something real
//   active:week2  it does so again in a second, different week
//   active:later  and in each new week after that
//   active:month  once per browser per calendar month
// "Something real" is a practice trade, a lesson passed or a Time machine
// scenario played to the end. Nothing leaves the browser but those counts.

import { passMilestones } from './learnProgress'
import { track } from './source'

const KEY = 'qirat.active'

interface Active {
  /** the last ISO week this browser was active in, like 2026-W47 */
  last: string
  /** how many different weeks so far */
  weeks: number
  /** the last calendar month counted, like 2026-11 */
  month: string
}

/** ISO week of a local date: weeks start on Monday, and belong to the year of their Thursday. */
export function isoWeek(d: Date): string {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7))
  const week = Math.ceil(((t.getTime() - Date.UTC(t.getUTCFullYear(), 0, 1)) / 86_400_000 + 1) / 7)
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

function load(): Active | null {
  try {
    const r = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Partial<Active> | null
    if (r && typeof r.last === 'string' && typeof r.weeks === 'number' && typeof r.month === 'string') {
      return { last: r.last, weeks: r.weeks, month: r.month }
    }
  } catch {
    // unreadable: treated as never active
  }
  return null
}

function store(next: Active): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
    return true
  } catch {
    return false
  }
}

/** Call when the visitor does something real. Counts only what is new for this browser. */
export function markActive(now: Date = new Date()): void {
  const week = isoWeek(now)
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const was = load()
  if (was && was.last === week && was.month === month) return
  const next: Active = was
    ? { last: week, weeks: was.last === week ? was.weeks : was.weeks + 1, month }
    : { last: week, weeks: 1, month }
  // a browser that cannot remember would look new every time: count nothing
  if (!store(next)) return
  if (!was) track('active', 'new')
  else if (was.last !== week) track('active', next.weeks === 2 ? 'week2' : 'later')
  if (!was || was.month !== month) track('active', 'month')
}

/** A lesson's quiz was passed for the first time in this browser. */
export function countLessonPass(slug: string): void {
  track('lesson_pass')
  const { first, levelDone } = passMilestones(slug)
  if (first) track('lesson_first')
  if (levelDone) track('level_done', String(levelDone))
  markActive()
}
