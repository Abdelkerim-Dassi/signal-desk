// Addresses.
//
// Most screens live behind a hash (qirat.tn/#practice). The course and its
// lessons have real addresses, so a search engine can list each lesson and a
// shared link names what it opens:
//   qirat.tn/learn            the course        /fr/learn        /en/learn
//   qirat.tn/learn/<slug>     one lesson        /fr/learn/<slug> /en/learn/<slug>
// Arabic has no prefix. Each of these is also a real HTML page, written at
// build time by scripts/prerender.mjs, and vercel.json sends the address to it.
//
// Inside the app everything still moves by hash: a link to #learn-<slug>
// opens the lesson, and tidyAddress() then puts the address in its real form.
// So the old hash links (in posts, in the Telegram bot) keep working.

import type { Lang } from './i18n'
import { LESSONS } from './lessons'

const LEARN = /^\/(?:(fr|en)\/)?learn(?:\/([a-z0-9-]+))?\/?$/

const isLesson = (slug: string) => LESSONS.some((l) => l.slug === slug)

/** Lessons that changed address: old hash links (#learn-<old>) open the new one.
 *  The real addresses are redirected in vercel.json. */
const RENAMED: Record<string, string> = {
  // Tunisia-only law lesson, replaced by the Arab-world one on 2026-11-20
  'learn-law-tunisia': 'learn-crypto-law-arab-world',
}
const currentId = (id: string) => RENAMED[id] ?? id

/** What a course or lesson address names; null for any other address. */
export function learnPath(): { lang: Lang; slug: string | null } | null {
  const m = LEARN.exec(window.location.pathname)
  if (!m) return null
  const slug = m[2] ?? null
  if (slug && !isLesson(slug)) return null
  return { lang: (m[1] as Lang | undefined) ?? 'ar', slug }
}

/** The address of the course, or of one lesson, in a language. */
export const pathFor = (lang: Lang, slug?: string | null) => `${lang === 'ar' ? '' : `/${lang}`}/learn${slug ? `/${slug}` : ''}`

/** What the app should show: the hash if the address has one, else what its path stands for
 *  ("learn", "learn-<slug>"), else "" for the first screen. */
export function routeId(): string {
  const id = currentId(decodeURIComponent(window.location.hash.replace('#', '')))
  if (id) return id
  const p = learnPath()
  return p ? (p.slug ? `learn-${p.slug}` : 'learn') : ''
}

/** Put the address in its real form for what is on screen. Never moves the page:
 *  it rewrites the address in place. */
export function tidyAddress(lang: Lang): void {
  const { pathname, search, hash } = window.location
  const id = currentId(decodeURIComponent(hash.replace('#', '')))
  let want: string | null = null
  if (id === 'learn') want = pathFor(lang) + search
  else if (id.startsWith('learn-') && isLesson(id.slice('learn-'.length))) want = pathFor(lang, id.slice('learn-'.length)) + search
  // any other screen opened from a lesson's address goes back to the root
  else if (id && pathname !== '/') want = `/${search}${hash}`
  else if (!id) {
    // the language was switched while on a course or lesson address
    const p = learnPath()
    if (p && p.lang !== lang) want = pathFor(lang, p.slug) + search
  }
  if (want && want !== pathname + search + hash) window.history.replaceState(null, '', want)
}
