import { useEffect, useMemo, useState } from 'react'
import type { Brief } from '../lib/api'
import { useI18n } from '../lib/i18n'
import { resetProgress, useLearnProgress } from '../lib/learnProgress'
import type { KaratState } from '../lib/learnProgress'
import { useLearnText } from '../lib/learnText'
import { lessonHref, lessonNo, useNextLesson } from '../lib/lessonPath'
import { GLOSSARY, LESSONS, LEVELS, isReady, lessonsForTerm } from '../lib/lessons'
import type { LearnKey, Lesson } from '../lib/lessons'
import type { View } from '../lib/views'
import Caption from './brand/Caption'
import { KaratHallmark } from './LearnBadge'
import LessonStory from './LearnLesson'
import { LessonChain, NextLesson } from './LessonChain'

// Routes: #learn (hub), #learn-<slug> (a lesson), #learn-glossary.
type Route = { page: 'hub' } | { page: 'glossary' } | { page: 'lesson'; lesson: Lesson }

function routeFromHash(): Route {
  const id = decodeURIComponent(window.location.hash.replace('#', ''))
  if (id === 'learn-glossary') return { page: 'glossary' }
  if (id.startsWith('learn-')) {
    const lesson = LESSONS.find((l) => l.slug === id.slice('learn-'.length))
    if (lesson) return { page: 'lesson', lesson }
  }
  return { page: 'hub' }
}

export default function LearnView({ brief, onView }: { brief: Brief | undefined; onView: (v: View) => void }) {
  const [route, setRoute] = useState<Route>(routeFromHash)
  useEffect(() => {
    const onHash = () => {
      setRoute(routeFromHash())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (route.page === 'lesson') return <LessonStory key={route.lesson.slug} lesson={route.lesson} brief={brief} onView={onView} />
  if (route.page === 'glossary') return <GlossaryPage />
  return <Hub />
}

/** Points down when closed, up when open. */
const Fold = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={`size-5 shrink-0 text-muted transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M5 9l7 7 7-7" />
  </svg>
)

// ---------------------------------------------------------------------------
// Hub: the course as one map
// ---------------------------------------------------------------------------

/** How the karat works, the reset and the fine print: one tap on the hallmark away. */
function KaratRules({ p }: { p: KaratState }) {
  const { lt } = useLearnText()
  return (
    <div id="karat-rules" className="mt-5 space-y-2.5 border-s-4 border-marker ps-3.5 text-[15px]">
      <p>{lt('karatHint')}</p>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-text/15"
        role="progressbar"
        aria-label={lt('yourKarat')}
        aria-valuemin={0}
        aria-valuemax={p.maxPoints}
        aria-valuenow={p.points}
      >
        <div className="h-full rounded-full bg-candy" style={{ width: `${Math.round(p.levelProgress * 100)}%` }} />
      </div>
      <p className="text-muted">
        {p.nextKarat ? lt('toNext', { n: p.toNext ?? 0, k: p.nextKarat }) : lt('maxed')}
        <br />
        {lt('lessonsDone', { d: p.passedCount, n: p.totalLessons })}
      </p>
      <p className="text-[13.5px] text-muted">
        {lt('savedHere')}{' '}
        <button
          type="button"
          className="cursor-pointer underline underline-offset-4 hover:text-text"
          onClick={() => {
            if (window.confirm(lt('resetConfirm'))) resetProgress()
          }}
        >
          {lt('reset')}
        </button>
      </p>
      <p className="text-[13.5px] text-muted">{lt('notAdvice')}</p>
    </div>
  )
}

function LessonRow({ lesson, now }: { lesson: Lesson; now: boolean }) {
  const { tx, lt } = useLearnText()
  const p = useLearnProgress().lessons[lesson.slug]
  const ready = isReady(lesson)
  return (
    <li className="break-inside-avoid">
      <a href={lessonHref(lesson)} aria-current={now ? 'step' : undefined} className="link flex min-h-12 items-center gap-3 rounded-xl py-1.5">
        <span
          className={`num grid size-8 shrink-0 place-items-center rounded-full border-[3px] text-[13px] font-semibold ${
            now
              ? 'border-text bg-text text-bg'
              : p?.passed
                ? 'border-candy bg-marker text-on-marker'
                : ready
                  ? 'border-text/20 text-muted'
                  : 'border-dashed border-text/20 text-muted'
          }`}
        >
          {lessonNo(lesson)}
        </span>
        <span className={`min-w-0 flex-1 text-[15.5px] leading-snug font-semibold ${ready ? '' : 'text-muted'}`}>{tx(lesson.title)}</span>
        {!ready ? (
          <span className="shrink-0 text-[13px] text-muted">{lt('comingSoon')}</span>
        ) : p?.passed ? (
          <span className="shrink-0 text-[13px] font-semibold text-up">✓ {lt('passed')}</span>
        ) : (
          p?.read && <span className="shrink-0 text-[13px] text-muted">{lt('read')}</span>
        )}
      </a>
    </li>
  )
}

function Hub() {
  const { t } = useI18n()
  const { tx, lt } = useLearnText()
  const progress = useLearnProgress()
  const next = useNextLesson()
  // the level the visitor is in: the one their next lesson belongs to
  const here = next?.level ?? LEVELS[LEVELS.length - 1].level
  const [open, setOpen] = useState<number | null>(here)
  const [rules, setRules] = useState(false)

  return (
    <div className="px-1">
      <div className="md:grid md:grid-cols-2 md:items-end md:gap-12">
        <div>
          <header className="flex items-start justify-between gap-2">
            <Caption
              as="h1"
              text={t('home.learnH', { n: LESSONS.length })}
              className="text-[2.5rem] md:text-[3.25rem] ltr:text-[2.1rem] ltr:md:text-[3.25rem]"
            />
            <button
              type="button"
              onClick={() => setRules((o) => !o)}
              aria-expanded={rules}
              aria-controls="karat-rules"
              className="link group grid shrink-0 cursor-pointer justify-items-center gap-1 rounded-2xl"
            >
              <span className="sr-only">{lt('yourKarat')}</span>
              <KaratHallmark karat={progress.karat} size={76} className="-rotate-6 transition-transform group-active:translate-y-1" />
              <span className="alt text-[13px] decoration-1">{lt(`level${progress.karat}` as LearnKey)}</span>
            </button>
          </header>
          {rules && <KaratRules p={progress} />}
          <LessonChain className="mt-7" />
        </div>
        <NextLesson className="mt-8 md:mt-0" />
      </div>

      <div className="mt-10 border-t-[3px] border-text md:mt-14">
        {LEVELS.map((lv) => {
          const list = LESSONS.filter((l) => l.level === lv.level)
          if (!list.length) return null
          const ready = list.filter(isReady)
          const done = ready.filter((l) => progress.lessons[l.slug]?.passed).length
          const isOpen = open === lv.level
          return (
            <section key={lv.level} className="border-b border-text/15">
              <h2>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : lv.level)}
                  aria-expanded={isOpen}
                  aria-controls={`level-${lv.level}`}
                  className="link flex min-h-[3.75rem] w-full cursor-pointer items-center gap-3 rounded-xl py-2 text-start"
                >
                  <span className="poster flex-1 text-[1.65rem]">{lv.level === here ? <mark className="mk">{tx(lv.name)}</mark> : tx(lv.name)}</span>
                  {ready.length > 0 && <span className="text-[13.5px] text-muted">{lt('levelProgress', { d: done, n: ready.length })}</span>}
                  <Fold open={isOpen} />
                </button>
              </h2>
              {isOpen && (
                <ol id={`level-${lv.level}`} className="pb-4 md:columns-2 md:gap-x-12">
                  {list.map((l) => (
                    <LessonRow key={l.slug} lesson={l} now={l === next} />
                  ))}
                </ol>
              )}
            </section>
          )
        })}
        <a href="#learn-glossary" className="link flex min-h-[3.75rem] items-center gap-3 rounded-xl py-2">
          <span className="poster flex-1 text-[1.65rem]">{lt('glossary')}</span>
          <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-muted rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Glossary: an index of words; a tap (or a search) opens the meaning
// ---------------------------------------------------------------------------

function GlossaryPage() {
  const { lang, tx, lt } = useLearnText()
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState<string | null>(null)
  const entries = useMemo(() => {
    const q = query.trim().toLowerCase()
    return Object.entries(GLOSSARY)
      .filter(([, e]) => !q || [e.term.en, e.term.fr, e.term.ar, tx(e.def)].some((s) => s.toLowerCase().includes(q)))
      .sort(([, a], [, b]) => tx(a.term).localeCompare(tx(b.term), lang))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, lang])
  // a search shows the meaning of everything it finds
  const searching = query.trim() !== ''

  return (
    <div className="mx-auto max-w-2xl px-1">
      <a href="#learn" className="alt py-2 text-[13.5px] font-medium text-muted decoration-1">
        {lt('back')}
      </a>
      <h1 className="poster mt-3 text-[2.75rem] md:text-6xl">
        <mark className="mk">{lt('glossary')}</mark>
      </h1>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={lt('search')}
        aria-label={lt('search')}
        className="mt-6 h-[3.25rem] w-full rounded-2xl border-[3px] border-text/15 bg-transparent px-4 text-base font-medium outline-none transition placeholder:font-normal placeholder:text-muted focus:border-text"
      />
      <dl className="mt-5 border-t-[3px] border-text">
        {entries.map(([id, e]) => {
          const from = lessonsForTerm(id)[0]
          const isOpen = searching || shown === id
          return (
            <div key={id} className="border-b border-text/15">
              <dt>
                <button
                  type="button"
                  onClick={() => setShown(shown === id ? null : id)}
                  aria-expanded={isOpen}
                  className="link flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-xl py-2 text-start font-semibold"
                >
                  <span className="flex-1">{tx(e.term)}</span>
                  {!searching && <Fold open={isOpen} />}
                </button>
              </dt>
              {isOpen && (
                <dd className="pb-4">
                  <p className="leading-relaxed">{tx(e.def)}</p>
                  {from && (
                    <a href={lessonHref(from)} className="alt mt-1.5 py-1.5 text-[13.5px] font-medium decoration-1">
                      {lt('fromLesson', { t: tx(from.title) })}
                    </a>
                  )}
                </dd>
              )}
            </div>
          )
        })}
      </dl>
      {entries.length === 0 && <p className="pt-4 text-muted">{lt('noMatch')}</p>}
    </div>
  )
}
