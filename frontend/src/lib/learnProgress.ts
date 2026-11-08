// "Your karat": the learner starts at 10K and rises toward 24K by reading
// lessons and passing their quizzes. Progress lives in browser storage for now
// (accounts come later). Storage can be blocked, so every access is guarded and
// progress still works in memory for the visit.

import { useSyncExternalStore } from 'react'
import { READY_LESSONS } from './lessons'

const KEY = 'qirat.learn.v1'

export type UserKarat = 10 | 14 | 18 | 22 | 24

export interface LessonProgress {
  read?: boolean
  /** best quiz score so far (0–3) */
  best?: number
  passed?: boolean
}

interface Stored {
  lessons: Record<string, LessonProgress>
  /** never drop a learner's karat when new lessons are added */
  bestKarat: UserKarat
}

export const PASS_MARK = 2
const POINTS_READ = 1
const POINTS_PASS = 2

const LEVELS: { karat: UserKarat; at: number }[] = [
  { karat: 10, at: 0 },
  { karat: 14, at: 0.2 },
  { karat: 18, at: 0.45 },
  { karat: 22, at: 0.7 },
  { karat: 24, at: 1 },
]

const EMPTY: Stored = { lessons: {}, bestKarat: 10 }

function load(): Stored {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const saved = JSON.parse(raw) as Partial<Stored>
    const lessons = saved.lessons && typeof saved.lessons === 'object' ? saved.lessons : {}
    const bestKarat = LEVELS.some((l) => l.karat === saved.bestKarat) ? (saved.bestKarat as UserKarat) : 10
    return { lessons, bestKarat }
  } catch {
    return EMPTY
  }
}

let state: Stored = load()
const listeners = new Set<() => void>()

function commit(next: Stored) {
  const karat = computeKarat(next).karat
  state = { ...next, bestKarat: Math.max(karat, next.bestKarat) as UserKarat }
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // not persisted; progress still counts for this visit
  }
  listeners.forEach((fn) => fn())
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  // another tab finished a lesson
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = load()
      fn()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(fn)
    window.removeEventListener('storage', onStorage)
  }
}

export function markRead(slug: string) {
  if (state.lessons[slug]?.read) return
  commit({ ...state, lessons: { ...state.lessons, [slug]: { ...state.lessons[slug], read: true } } })
}

/** Record a quiz result. Returns true when this attempt passed. */
export function recordQuiz(slug: string, score: number): boolean {
  const prev = state.lessons[slug] ?? {}
  const passed = score >= PASS_MARK
  commit({
    ...state,
    lessons: {
      ...state.lessons,
      [slug]: { ...prev, read: true, best: Math.max(prev.best ?? 0, score), passed: Boolean(prev.passed || passed) },
    },
  })
  return passed
}

export function resetProgress() {
  commit({ lessons: {}, bestKarat: 10 })
}

export interface KaratState {
  karat: UserKarat
  points: number
  maxPoints: number
  passedCount: number
  totalLessons: number
  /** points still needed for the next karat, or null at 24K */
  toNext: number | null
  nextKarat: UserKarat | null
  /** 0–1 progress inside the current level */
  levelProgress: number
  lessons: Record<string, LessonProgress>
}

function computeKarat(s: Stored): KaratState {
  const maxPoints = READY_LESSONS.length * (POINTS_READ + POINTS_PASS)
  let points = 0
  let passedCount = 0
  for (const l of READY_LESSONS) {
    const p = s.lessons[l.slug]
    if (p?.read) points += POINTS_READ
    if (p?.passed) {
      points += POINTS_PASS
      passedCount += 1
    }
  }
  const need = (at: number) => Math.ceil(at * maxPoints - 1e-9)
  let idx = 0
  LEVELS.forEach((l, i) => {
    if (points >= need(l.at)) idx = i
  })
  // the stored best karat is a floor
  const bestIdx = LEVELS.findIndex((l) => l.karat === s.bestKarat)
  idx = Math.max(idx, bestIdx)
  const next = LEVELS[idx + 1]
  const from = need(LEVELS[idx].at)
  const to = next ? need(next.at) : maxPoints
  return {
    karat: LEVELS[idx].karat,
    points,
    maxPoints,
    passedCount,
    totalLessons: READY_LESSONS.length,
    toNext: next ? Math.max(0, to - points) : null,
    nextKarat: next?.karat ?? null,
    levelProgress: next ? Math.min(1, Math.max(0, (points - from) / Math.max(1, to - from))) : 1,
    lessons: s.lessons,
  }
}

let cachedFor: Stored | null = null
let cached: KaratState = computeKarat(state)

function snapshot(): KaratState {
  if (cachedFor !== state) {
    cachedFor = state
    cached = computeKarat(state)
  }
  return cached
}

/** Live learner progress; every component using it updates together. */
export function useLearnProgress(): KaratState {
  return useSyncExternalStore(subscribe, snapshot, snapshot)
}
