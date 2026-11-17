import { useLearnProgress } from './learnProgress'
import { LESSONS, isReady } from './lessons'
import type { Lesson } from './lessons'

/** A lesson's number in the course, from 1. */
export const lessonNo = (l: Lesson) => LESSONS.indexOf(l) + 1

/** The address of a lesson (Learn reads it from the hash). */
export const lessonHref = (l: Lesson) => `#learn-${l.slug}`

/** The first lesson that is written and not passed yet; null when all are passed. */
export function useNextLesson(): Lesson | null {
  const progress = useLearnProgress()
  return LESSONS.filter(isReady).find((l) => !progress.lessons[l.slug]?.passed) ?? null
}
