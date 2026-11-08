import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Brief, Opportunity } from '../lib/api'
import { changeColor, compactCurrency, percent } from '../lib/format'
import { useI18n } from '../lib/i18n'
import { GLOSSARY, LEARN_UI, LESSONS, isReady, lessonsForTerm, todaysLesson } from '../lib/lessons'
import type { LearnKey, Lesson, LiveLink, Text } from '../lib/lessons'
import { markRead, recordQuiz, resetProgress, useLearnProgress } from '../lib/learnProgress'
import type { View } from '../lib/views'
import { UserKaratIngot } from './LearnBadge'
import { GemMark } from './Logo'
import { CoinIcon, KaratBadge, RiskChip } from './Rating'

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

function openRoute(hash: string) {
  window.location.hash = hash
  window.scrollTo({ top: 0 })
}

function useLearnText() {
  const { lang } = useI18n()
  // keep «الـ» / «بـ» on the same line as the Latin word after them
  const glue = (s: string) => (lang === 'ar' ? s.replace(/\u0640 /g, '\u0640\u00a0') : s)
  const tx = (x: Text) => glue(x[lang])
  const lt = (key: LearnKey, vars?: Record<string, string | number>) => {
    let s: string = LEARN_UI[key][lang]
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
    return glue(s)
  }
  return { lang, tx, lt }
}

const lessonIndex = (l: Lesson) => LESSONS.findIndex((x) => x.slug === l.slug)
const lessonNumber = (l: Lesson) => lessonIndex(l) + 1

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

  if (route.page === 'lesson') return <LessonPage key={route.lesson.slug} lesson={route.lesson} brief={brief} onView={onView} />
  if (route.page === 'glossary') return <GlossaryPage />
  return <Hub />
}

// ---------------------------------------------------------------------------
// Hub
// ---------------------------------------------------------------------------

function YourKaratCard() {
  const { lt } = useLearnText()
  const p = useLearnProgress()
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border-strong/60 bg-card/80 p-4">
      <UserKaratIngot karat={p.karat} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium tracking-wide text-muted">{lt('yourKarat')}</p>
        <p className="text-lg font-semibold">{lt(`level${p.karat}` as LearnKey)}</p>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-subtle"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={p.maxPoints}
          aria-valuenow={p.points}
        >
          <div
            className="h-full rounded-full bg-gold-bright transition-[width] duration-700"
            style={{ width: `${Math.round(p.levelProgress * 100)}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-muted">
          {p.nextKarat ? lt('toNext', { n: p.toNext ?? 0, k: p.nextKarat }) : lt('maxed')}
        </p>
        <p className="text-xs text-muted">{lt('lessonsDone', { d: p.passedCount, n: p.totalLessons })}</p>
      </div>
    </div>
  )
}

function StatusChip({ lesson }: { lesson: Lesson }) {
  const { lt } = useLearnText()
  const p = useLearnProgress().lessons[lesson.slug]
  if (!isReady(lesson))
    return <span className="rounded-full bg-subtle px-2 py-0.5 text-[11px] font-semibold text-muted">{lt('comingSoon')}</span>
  if (p?.passed)
    return <span className="rounded-full bg-strong/10 px-2 py-0.5 text-[11px] font-semibold text-strong">✓ {lt('passed')}</span>
  if (p?.read)
    return <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-semibold text-gold">{lt('read')}</span>
  return null
}

function LessonRow({ lesson }: { lesson: Lesson }) {
  const { tx, lt } = useLearnText()
  const ready = isReady(lesson)
  const passed = useLearnProgress().lessons[lesson.slug]?.passed
  return (
    <a
      href={`#learn-${lesson.slug}`}
      onClick={(e) => {
        e.preventDefault()
        openRoute(`learn-${lesson.slug}`)
      }}
      className={`card flex items-center gap-3.5 p-4 transition hover:border-border-strong ${ready ? '' : 'opacity-75'}`}
    >
      <span
        className={`num grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold ${
          passed ? 'bg-gold-bright text-white' : ready ? 'bg-gold-soft text-gold' : 'bg-subtle text-muted'
        }`}
      >
        {passed ? '✓' : lessonNumber(lesson)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-semibold">{tx(lesson.title)}</span>
          <StatusChip lesson={lesson} />
        </span>
        <span className="mt-0.5 block text-sm text-muted">{tx(lesson.hook)}</span>
      </span>
      {ready && <span className="hidden shrink-0 text-xs text-muted sm:block">{lt('minutes', { n: lesson.minutes })}</span>}
    </a>
  )
}

function Hub() {
  const { tx, lt } = useLearnText()
  const today = todaysLesson()
  const ready = LESSONS.filter(isReady)
  const soon = LESSONS.filter((l) => !isReady(l))
  return (
    <div className="space-y-6">
      <section className="card hero-wash rise overflow-hidden p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{lt('title')}</h1>
            <p className="mt-1 text-muted">{lt('subtitle')}</p>
          </div>
          <GemMark size={56} />
        </div>
        <div className="mt-5">
          <YourKaratCard />
          <p className="mt-2 text-xs text-muted">{lt('karatHint')}</p>
        </div>
      </section>

      <section>
        <p className="tick-label mb-2">{lt('today')}</p>
        <a
          href={`#learn-${today.slug}`}
          onClick={(e) => {
            e.preventDefault()
            openRoute(`learn-${today.slug}`)
          }}
          className="card rise flex items-center gap-4 border-border-strong p-5 transition hover:shadow-lg"
        >
          <span className="min-w-0 flex-1">
            <span className="text-xs font-medium text-gold">
              {lt('lessonN', { n: lessonNumber(today) })} · {lt('minutes', { n: today.minutes })}
            </span>
            <span className="mt-1 block text-lg font-semibold">{tx(today.title)}</span>
            <span className="mt-0.5 block text-sm text-muted">{tx(today.hook)}</span>
          </span>
          <span className="shrink-0 rounded-full bg-text px-4 py-2 text-sm font-semibold text-bg">{lt('start')}</span>
        </a>
      </section>

      <section className="space-y-2.5">
        <p className="tick-label">{lt('allLessons')}</p>
        {ready.map((l) => (
          <LessonRow key={l.slug} lesson={l} />
        ))}
      </section>

      <section className="space-y-2.5">
        <p className="tick-label">{lt('comingSoon')}</p>
        {soon.map((l) => (
          <LessonRow key={l.slug} lesson={l} />
        ))}
      </section>

      <a
        href="#learn-glossary"
        onClick={(e) => {
          e.preventDefault()
          openRoute('learn-glossary')
        }}
        className="card flex items-center gap-4 p-4 transition hover:border-border-strong"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold-soft text-lg font-bold text-gold">
          Aa
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">{lt('glossary')}</span>
          <span className="block text-sm text-muted">{lt('glossaryHint')}</span>
        </span>
        <span className="ms-auto shrink-0 text-gold rtl:rotate-180" aria-hidden>
          →
        </span>
      </a>

      <div className="space-y-1 text-center text-xs text-muted">
        <p>{lt('notAdvice')}</p>
        <p>
          {lt('savedHere')}{' '}
          <button
            type="button"
            className="cursor-pointer underline underline-offset-2 hover:text-gold"
            onClick={() => {
              if (window.confirm(lt('resetConfirm'))) resetProgress()
            }}
          >
            {lt('reset')}
          </button>
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Lesson page
// ---------------------------------------------------------------------------

function BackLink() {
  const { lt } = useLearnText()
  return (
    <a
      href="#learn"
      onClick={(e) => {
        e.preventDefault()
        openRoute('learn')
      }}
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-medium text-muted transition hover:bg-subtle hover:text-text"
    >
      <span className="inline-block rtl:rotate-180" aria-hidden>
        ←
      </span>
      {lt('back')}
    </a>
  )
}

function CopyLink({ slug }: { slug: string }) {
  const { lt } = useLearnText()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}#learn-${slug}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt(lt('copyLink'), url)
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition hover:border-border-strong hover:text-gold"
    >
      {copied ? `✓ ${lt('copied')}` : lt('copyLink')}
    </button>
  )
}

function LessonPage({ lesson, brief, onView }: { lesson: Lesson; brief: Brief | undefined; onView: (v: View) => void }) {
  const { tx, lt } = useLearnText()
  const ready = isReady(lesson)
  const endRef = useRef<HTMLDivElement>(null)

  // reaching the takeaway counts as having read the lesson
  useEffect(() => {
    const el = endRef.current
    if (!ready || !el) return
    if (typeof IntersectionObserver === 'undefined') {
      markRead(lesson.slug)
      return
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        markRead(lesson.slug)
        io.disconnect()
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [lesson.slug, ready])

  const idx = lessonIndex(lesson)
  const next = LESSONS.slice(idx + 1).find(isReady)

  return (
    <article className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between gap-2">
        <BackLink />
        <CopyLink slug={lesson.slug} />
      </div>

      <header className="rise">
        <p className="text-xs font-medium text-gold">
          {lt('lessonN', { n: idx + 1 })}
          {ready ? ` · ${lt('minutes', { n: lesson.minutes })}` : ` · ${lt('comingSoon')}`}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{tx(lesson.title)}</h1>
        <p className="mt-2 text-lg text-muted">{tx(lesson.hook)}</p>
      </header>

      {ready ? (
        <>
          <div className="card space-y-5 p-5 sm:p-6">
            {lesson.sections!.map((s, i) => (
              <section key={i}>
                <h2 className="font-semibold">{tx(s.h)}</h2>
                <p className="mt-1.5 leading-relaxed text-text/90">{tx(s.p)}</p>
              </section>
            ))}
            <div ref={endRef} className="rounded-2xl bg-gold-soft p-4">
              <p className="text-xs font-semibold tracking-wide text-gold">{lt('takeaway')}</p>
              <p className="mt-1 font-medium">{tx(lesson.takeaway!)}</p>
            </div>
          </div>
          {lesson.live && <LiveBlock live={lesson.live} brief={brief} onView={onView} />}
          <TermChips terms={lesson.terms} />
          <Quiz lesson={lesson} />
        </>
      ) : (
        <>
          <div className="card p-5 sm:p-6">
            <p className="text-sm font-semibold">{lt('inThisLesson')}</p>
            <ul className="mt-3 space-y-2">
              {lesson.outline?.map((o, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-bright" aria-hidden />
                  <span>{tx(o)}</span>
                </li>
              ))}
            </ul>
          </div>
          {lesson.live && <LiveBlock live={lesson.live} brief={brief} onView={onView} />}
          {lesson.terms.length > 0 && <TermChips terms={lesson.terms} />}
        </>
      )}

      {next && (
        <a
          href={`#learn-${next.slug}`}
          onClick={(e) => {
            e.preventDefault()
            openRoute(`learn-${next.slug}`)
          }}
          className="card flex items-center gap-3 p-4 transition hover:border-border-strong"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-muted">{lt('nextLesson')}</span>
            <span className="block font-semibold">{tx(next.title)}</span>
          </span>
          <span className="shrink-0 text-gold rtl:rotate-180" aria-hidden>
            →
          </span>
        </a>
      )}

      <p className="text-center text-xs text-muted">{lt('notAdvice')}</p>
    </article>
  )
}

function TermChips({ terms }: { terms: string[] }) {
  const { tx, lt } = useLearnText()
  return (
    <div>
      <p className="tick-label mb-2">{lt('terms')}</p>
      <div className="flex flex-wrap gap-2">
        {terms
          .filter((id) => GLOSSARY[id])
          .map((id) => (
            <a
              key={id}
              href="#learn-glossary"
              onClick={(e) => {
                e.preventDefault()
                openRoute('learn-glossary')
              }}
              title={tx(GLOSSARY[id].def)}
              className="rounded-full border border-border bg-card px-3 py-1 text-sm transition hover:border-border-strong hover:text-gold"
            >
              {tx(GLOSSARY[id].term)}
            </a>
          ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Quiz
// ---------------------------------------------------------------------------

function Quiz({ lesson }: { lesson: Lesson }) {
  const { tx, lt } = useLearnText()
  const questions = lesson.quiz!
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [result, setResult] = useState<{ score: number; passed: boolean; wasPassed: boolean } | null>(null)
  const wasPassed = Boolean(useLearnProgress().lessons[lesson.slug]?.passed)

  const q = questions[step]
  const answered = picked !== null
  const last = step === questions.length - 1

  const pick = (i: number) => {
    if (answered) return
    setPicked(i)
    if (i === q.answer) setScore((s) => s + 1)
  }
  const advance = () => {
    if (last) {
      const passed = recordQuiz(lesson.slug, score)
      setResult({ score, passed, wasPassed })
      return
    }
    setStep((s) => s + 1)
    setPicked(null)
  }
  const retry = () => {
    setStep(0)
    setPicked(null)
    setScore(0)
    setResult(null)
  }

  return (
    <section className="card p-5 sm:p-6" aria-live="polite">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-semibold">{lt('quiz')}</h2>
        {!result && <span className="text-xs text-muted">{lt('questionN', { n: step + 1, m: questions.length })}</span>}
      </div>

      {result ? (
        <div className="mt-4 text-center">
          <p className="num text-3xl font-semibold">{lt('score', { s: result.score, m: questions.length })}</p>
          <p className={`mt-2 ${result.passed ? 'text-strong' : 'text-muted'}`}>
            {result.passed ? (result.wasPassed ? lt('passAgainMsg') : lt('passMsg')) : lt('failMsg')}
          </p>
          <button
            type="button"
            onClick={retry}
            className="mt-4 cursor-pointer rounded-full border border-border-strong px-5 py-2 text-sm font-medium text-gold transition hover:bg-gold-soft"
          >
            {lt('retry')}
          </button>
        </div>
      ) : (
        <>
          {step === 0 && !answered && <p className="mt-1 text-xs text-muted">{lt('quizHint')}</p>}
          <p className="mt-3 font-medium">{tx(q.q)}</p>
          <div className="mt-3 space-y-2">
            {q.options.map((o, i) => {
              const isRight = i === q.answer
              const isPicked = i === picked
              let tone = 'border-border hover:border-border-strong hover:bg-subtle/60'
              if (answered && isRight) tone = 'border-strong bg-strong/10'
              else if (answered && isPicked) tone = 'border-weak bg-weak/10'
              else if (answered) tone = 'border-border opacity-60'
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(i)}
                  disabled={answered}
                  aria-pressed={isPicked}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-start transition ${tone} ${
                    answered ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <span
                    className={`grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold ${
                      answered && isRight
                        ? 'border-strong bg-strong text-white'
                        : answered && isPicked
                          ? 'border-weak bg-weak text-white'
                          : 'border-border-strong text-muted'
                    }`}
                    aria-hidden
                  >
                    {answered && isRight ? '✓' : answered && isPicked ? '✕' : String.fromCharCode(65 + i)}
                  </span>
                  <span>{tx(o)}</span>
                </button>
              )
            })}
          </div>
          {answered && (
            <div className="rise mt-4 rounded-2xl bg-subtle/70 p-4">
              <p className={`font-semibold ${picked === q.answer ? 'text-strong' : 'text-weak'}`}>
                {picked === q.answer ? lt('right') : lt('wrong')}
              </p>
              <p className="mt-1 text-sm">{tx(q.why)}</p>
              <button
                type="button"
                onClick={advance}
                className="mt-3 cursor-pointer rounded-full bg-text px-5 py-2 text-sm font-semibold text-bg transition hover:opacity-90"
              >
                {last ? lt('seeScore') : lt('next')}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Live links: tie the lesson to today's real data
// ---------------------------------------------------------------------------

function MiniRisk({ item, label }: { item: Opportunity; label?: string }) {
  const { lt } = useLearnText()
  const g = item.grade
  const symbol = (item.symbol || '').toUpperCase()
  return (
    <div className="rounded-2xl bg-subtle/70 p-3.5">
      {label && <p className="mb-2 text-[11px] font-medium text-muted">{label}</p>}
      <div className="flex items-center gap-3">
        <CoinIcon symbol={symbol} image={item.image} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="truncate font-semibold">{item.name || symbol}</p>
            <RiskChip risk={g?.risk} />
          </div>
          <p className="num text-sm text-muted" dir="ltr">
            <span className="text-text">{compactCurrency(item.current_price)}</span>{' '}
            <span className={changeColor(item.change_24h)}>{percent(item.change_24h)}</span>
          </p>
        </div>
        <KaratBadge karat={g?.karat} size="sm" />
      </div>
      {g && (
        <div className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between gap-3">
            <span>{lt('liveTypicalDay')}</span>
            <span className="num font-semibold" dir="ltr">
              ±{g.typical_day_pct.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span>{lt('liveRoughMonth')}</span>
            <span className="num font-semibold text-down" dir="ltr">
              {g.rough_month_pct.toFixed(0)}%
            </span>
          </div>
          <p className="border-t border-border pt-1.5 text-xs text-muted">
            {lt('liveOn100', { v: Math.max(0, Math.round(100 + g.rough_month_pct)) })}
          </p>
        </div>
      )}
    </div>
  )
}

function LiveBlock({ live, brief, onView }: { live: LiveLink; brief: Brief | undefined; onView: (v: View) => void }) {
  const { tx, lt } = useLearnText()
  const coins = useMemo(() => (brief?.opportunities ?? []).filter((o) => o.grade), [brief])
  const findCoin = (sym: string) => coins.find((o) => (o.symbol || '').toUpperCase() === sym) ?? coins[0]

  const button = (label: string, view: View) => (
    <button
      type="button"
      onClick={() => onView(view)}
      className="mt-3 cursor-pointer rounded-full border border-border-strong px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold-soft"
    >
      {label} <span className="inline-block rtl:rotate-180">→</span>
    </button>
  )

  let body: ReactNode
  if (live.kind === 'view') {
    body = button(tx(live.label), live.view)
  } else if (!brief) {
    body = <p className="mt-2 text-sm text-muted">{lt('liveLoading')}</p>
  } else if (live.kind === 'coin') {
    const item = findCoin(live.symbol)
    body = (
      <>
        {item && <div className="mt-3"><MiniRisk item={item} /></div>}
        {button(lt('openCoins'), 'today')}
      </>
    )
  } else if (live.kind === 'risk') {
    const btc = findCoin('BTC')
    const riskiest = [...coins]
      .filter((o) => o !== btc)
      .sort((a, b) => (b.grade?.typical_day_pct ?? 0) - (a.grade?.typical_day_pct ?? 0))[0]
    body = (
      <>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {btc && <MiniRisk item={btc} label="Bitcoin" />}
          {riskiest && <MiniRisk item={riskiest} label={lt('liveRiskiest')} />}
        </div>
        {button(lt('openCoins'), 'today')}
      </>
    )
  } else if (live.kind === 'weather') {
    const w = brief.weather
    const state = w?.state ?? 'unknown'
    const word =
      state === 'calm' ? lt('weatherCalm') : state === 'choppy' ? lt('weatherChoppy') : state === 'stormy' ? lt('weatherStormy') : '--'
    const dot = state === 'calm' ? 'bg-strong' : state === 'choppy' ? 'bg-warn' : state === 'stormy' ? 'bg-weak' : 'bg-neutral'
    const fg = w?.fear_greed ?? brief.sentiment?.score
    body = (
      <>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          <div className="rounded-2xl bg-subtle/70 p-3.5">
            <p className="text-[11px] font-medium text-muted">{lt('weatherToday')}</p>
            <p className="mt-1 flex items-center gap-2 text-lg font-semibold">
              <span className={`size-2.5 rounded-full ${dot}`} aria-hidden />
              {word}
            </p>
          </div>
          <div className="rounded-2xl bg-subtle/70 p-3.5">
            <p className="text-[11px] font-medium text-muted">{lt('liveMood')}</p>
            <p className="num mt-1 text-lg font-semibold" dir="ltr">
              {fg != null ? `${Math.round(Number(fg))} / 100` : '--'}
            </p>
          </div>
        </div>
        {button(lt('openCoins'), 'today')}
      </>
    )
  } else {
    // karat ladder
    const sorted = [...coins].sort((a, b) => (b.grade?.karat ?? 0) - (a.grade?.karat ?? 0)).slice(0, 8)
    body = (
      <>
        <p className="mt-1 text-xs text-muted">{lt('karatToday')}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {sorted.map((o) => (
            <span key={o.symbol} className="flex items-center gap-1.5 rounded-full bg-subtle/70 py-1 ps-1 pe-3 text-sm">
              <KaratBadge karat={o.grade?.karat} size="sm" />
              <span className="font-medium" dir="ltr">
                {(o.symbol || '').toUpperCase()}
              </span>
            </span>
          ))}
        </div>
        {button(lt('openCoins'), 'today')}
      </>
    )
  }

  return (
    <section className="card border-border-strong p-5">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <span className="live-dot size-2 rounded-full bg-strong" aria-hidden />
        {lt('tryLive')}
      </p>
      {body}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Glossary
// ---------------------------------------------------------------------------

function GlossaryPage() {
  const { lang, tx, lt } = useLearnText()
  const [query, setQuery] = useState('')
  const entries = useMemo(() => {
    const q = query.trim().toLowerCase()
    return Object.entries(GLOSSARY)
      .filter(([, e]) => !q || [e.term.en, e.term.fr, e.term.ar, tx(e.def)].some((s) => s.toLowerCase().includes(q)))
      .sort(([, a], [, b]) => tx(a.term).localeCompare(tx(b.term), lang))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, lang])

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <BackLink />
      <header className="rise">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{lt('glossary')}</h1>
        <p className="mt-1 text-muted">{lt('glossaryHint')}</p>
      </header>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={lt('search')}
        aria-label={lt('search')}
        className="w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm outline-none transition focus:border-border-strong"
      />
      <dl className="card divide-y divide-border">
        {entries.map(([id, e]) => {
          const from = lessonsForTerm(id)[0]
          return (
            <div key={id} className="p-4">
              <dt className="font-semibold">{tx(e.term)}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-text/90">{tx(e.def)}</dd>
              {from && (
                <dd className="mt-1.5">
                  <a
                    href={`#learn-${from.slug}`}
                    onClick={(ev) => {
                      ev.preventDefault()
                      openRoute(`learn-${from.slug}`)
                    }}
                    className="text-xs font-medium text-gold underline-offset-2 hover:underline"
                  >
                    {lt('fromLesson', { t: tx(from.title) })}
                  </a>
                </dd>
              )}
            </div>
          )
        })}
        {entries.length === 0 && <p className="p-4 text-sm text-muted">{lt('noMatch')}</p>}
      </dl>
    </div>
  )
}
