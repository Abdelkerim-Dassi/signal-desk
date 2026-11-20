import { useEffect, useRef, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import type { Brief } from '../lib/api'
import { usePracticeT } from '../lib/i18n-practice'
import { markRead, recordQuiz, useLearnProgress } from '../lib/learnProgress'
import { useLearnText } from '../lib/learnText'
import { pathFor } from '../lib/route'
import { lessonHref, lessonNo } from '../lib/lessonPath'
import { GLOSSARY, LESSONS, isReady } from '../lib/lessons'
import type { Lesson } from '../lib/lessons'
import { loadLedger } from '../lib/practice'
import { countLessonPass } from '../lib/returning'
import { track } from '../lib/source'
import type { View } from '../lib/views'
import BotInvite from './BotInvite'
import Mascot from './brand/Mascot'
import type { Mood } from './brand/Mascot'
import LiveTicket from './LearnLive'

// A lesson, read like one of the videos: one screen at a time. The cover, a
// screen per section, the takeaway in the gold bar's own words, today's live
// example as a ticket, then the quiz, one question per screen.
//
// What is counted, and when (unchanged from the one-page lesson):
//   track('lesson_open')   once, when a lesson opens
//   markRead               when the takeaway comes on screen
//   recordQuiz             on the tap that asks for the score, after the last answer
//   countLessonPass        right after it, the first time this lesson is passed
//   BotInvite place="quiz" shown on the screen of a passed quiz

type Reading = 'cover' | 'takeaway' | 'live' | number // a number is a section

/** The gold bar on its sun, as in the videos: it never stands on a dark page. */
function Bar({ mood = 'happy', size, className = '' }: { mood?: Mood; size: number; className?: string }) {
  const disc = Math.round(size * 1.24)
  return (
    <span className={`relative grid shrink-0 place-items-center ${className}`} style={{ width: disc, height: disc }}>
      <span className="absolute inset-0 rounded-full bg-marker" aria-hidden />
      <Mascot mood={mood} size={size} className="mt-[5%]" />
    </span>
  )
}

const Tick = ({ ok }: { ok: boolean }) => (
  <svg viewBox="0 0 24 24" className={`size-6 shrink-0 ${ok ? 'text-up' : 'text-down'}`} fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {ok ? <path d="M4.5 12.5l5 5L19.5 7" /> : <path d="M6 6l12 12M18 6L6 18" />}
  </svg>
)

function CopyLink({ slug }: { slug: string }) {
  const { lt, lang } = useLearnText()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    const url = `${window.location.origin}${pathFor(lang, slug)}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt(lt('copyLink'), url)
    }
  }
  return (
    <button type="button" onClick={copy} className="alt py-2 font-medium text-muted decoration-1">
      {copied ? lt('copied') : lt('copyLink')}
    </button>
  )
}

/** The lesson's words, behind one tap: each opens its meaning in place. */
function Terms({ terms }: { terms: string[] }) {
  const { tx, lt } = useLearnText()
  const known = terms.filter((id) => GLOSSARY[id])
  const [open, setOpen] = useState(false)
  const [word, setWord] = useState<string | null>(null)
  if (!known.length) return null
  return (
    <div className="mt-4">
      <p className="text-center">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="alt py-2 text-[15px]">
          {lt('terms')}
        </button>
      </p>
      {open && (
        <div className="mt-2">
          <ul className="flex flex-wrap gap-2">
            {known.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setWord(word === id ? null : id)}
                  aria-pressed={word === id}
                  className={`link min-h-11 cursor-pointer rounded-xl border-2 px-3.5 text-[15px] font-semibold transition ${
                    word === id ? 'border-text bg-text text-bg' : 'border-text/20 hover:border-text/50'
                  }`}
                >
                  {tx(GLOSSARY[id].term)}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 min-h-6 leading-relaxed" aria-live="polite">
            {word && tx(GLOSSARY[word].def)}
          </p>
          <a href="#learn-glossary" className="alt mt-1 py-2 text-[13.5px] font-medium decoration-1">
            {lt('glossary')}
          </a>
        </div>
      )}
    </div>
  )
}

/** The short version, said by the gold bar. Seeing it counts as having read the lesson. */
function Takeaway({ lesson }: { lesson: Lesson }) {
  const { tx, lt } = useLearnText()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
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
  }, [lesson.slug])
  return (
    <>
      <h2 className="poster text-[2.1rem] md:text-[2.6rem]">
        <mark className="mk">{lt('takeaway')}</mark>
      </h2>
      <div ref={ref} className="mt-7 flex items-end gap-2">
        <p className="bubble min-w-0 flex-1 text-[17px]">{tx(lesson.takeaway!)}</p>
        <Bar mood="wink" size={96} />
      </div>
    </>
  )
}

/** Under every screen that is read: back, and the one button that moves on.
 *  On a phone it stays in view above the bottom bar when a screen is taller than the phone. */
function BackNext({ back, next, onBack, onNext }: { back: string; next: string; onBack: () => void; onNext: () => void }) {
  return (
    <div data-dock className="sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-10 -mx-5 mt-auto flex items-center gap-5 bg-linear-to-t from-bg from-75% to-transparent px-5 pt-8 pb-3 md:static md:mx-0 md:bg-none md:px-0 md:pb-0">
      <button type="button" onClick={onBack} className="alt min-h-11 shrink-0 px-1">
        {back}
      </button>
      <button type="button" data-step-next onClick={onNext} className="go flex-1">
        {next}
      </button>
    </div>
  )
}

// The quiz itself: the same steps and the same counts as before the redesign.
function useQuiz(lesson: Lesson) {
  const questions = lesson.quiz ?? []
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
      if (passed && !wasPassed) countLessonPass(lesson.slug)
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
  return { questions, step, picked, result, q, answered, last, wasPassed, pick, advance, retry }
}

export default function LessonStory({ lesson, brief, onView }: { lesson: Lesson; brief: Brief | undefined; onView: (v: View) => void }) {
  const { tx, lt } = useLearnText()
  const { tp } = usePracticeT()
  const ready = isReady(lesson)

  useEffect(() => track('lesson_open'), [lesson.slug])

  const sections = lesson.sections ?? []
  // the screens that are read, in order; the quiz comes after the last one
  const reading: Reading[] = ready ? ['cover', ...sections.map((_, i) => i), 'takeaway', ...(lesson.live ? (['live'] as const) : [])] : ['cover']
  const [at, setAt] = useState(0)
  const quiz = useQuiz(lesson)
  const inQuiz = at >= reading.length
  const screen = inQuiz ? 'quiz' : reading[at]

  const no = lessonNo(lesson)
  const next = LESSONS.slice(LESSONS.indexOf(lesson) + 1).find(isReady)

  // one segment per screen after the cover
  const segments = reading.length - 1 + quiz.questions.length
  const filled = !inQuiz ? at : quiz.result ? segments : reading.length + quiz.step

  // A new screen starts at its top, and a screen reader is told about it.
  const stage = useRef<HTMLDivElement>(null)
  const mounted = useRef(false)
  const where = `${at}/${quiz.step}/${quiz.result ? 1 : 0}`
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    window.scrollTo({ top: 0 })
    stage.current?.focus({ preventScroll: true })
  }, [where])

  // The button that moves on stays in one place, so a double tap would skip a
  // screen (or the result of the quiz): a tap right after a new screen is ignored.
  const shownAt = useRef(0)
  const tooSoon = (ms = 300) => performance.now() - shownAt.current < ms
  const turn = (fn: () => void, ms?: number) => {
    if (tooSoon(ms)) return
    shownAt.current = performance.now()
    fn()
  }
  const go = (n: number) => turn(() => setAt(n))

  // once an answer is picked, the way on must be in view (small phones)
  const onward = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!quiz.answered) return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    onward.current?.scrollIntoView({ block: 'nearest', behavior: calm ? 'auto' : 'smooth' })
  }, [quiz.answered, quiz.step])

  const backNext = (
    <BackNext back={lt('prevStep')} next={at === reading.length - 1 ? lt('quiz') : lt('nextStep')} onBack={() => go(at - 1)} onNext={() => go(at + 1)} />
  )

  let body: ReactNode
  if (screen === 'cover') {
    body = (
      <>
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="poster text-[1.45rem]">
            <mark className="mk">{lt('lessonN', { n: no })}</mark>
          </span>
          <span className="text-[13.5px] text-muted">{ready ? lt('minutes', { n: lesson.minutes }) : lt('comingSoon')}</span>
          {quiz.wasPassed && <span className="text-[13.5px] font-semibold text-up">✓ {lt('passed')}</span>}
        </p>
        <h1 className="poster mt-3 text-[2.5rem] md:text-[3.25rem]">{tx(lesson.title)}</h1>
        <div className="mt-7 flex items-end gap-2">
          <p className="bubble min-w-0 flex-1 text-[17px]">{tx(lesson.hook)}</p>
          <Bar size={104} />
        </div>
        {ready ? (
          <div className="mt-auto pt-8">
            <button type="button" data-step-next onClick={() => go(1)} className="go w-full">
              {lt('start')}
            </button>
            <Terms terms={lesson.terms} />
            {/* The whole text, one tap away, for whoever would rather scroll than tap through.
                It also keeps the lesson's words on its own page, where a search engine reads them. */}
            <details className="mt-6 text-start">
              <summary className="alt cursor-pointer text-[15px]">{lt('wholeLesson')}</summary>
              <div className="mt-5 space-y-6">
                {sections.map((s, i) => (
                  <section key={i}>
                    <h2 className="poster text-[1.45rem]">{tx(s.h)}</h2>
                    <p className="mt-2 leading-relaxed whitespace-pre-line">{tx(s.p)}</p>
                  </section>
                ))}
                {lesson.takeaway && (
                  <section>
                    <h2 className="poster text-[1.45rem]">{lt('takeaway')}</h2>
                    <p className="mt-2 leading-relaxed font-semibold">{tx(lesson.takeaway)}</p>
                  </section>
                )}
              </div>
            </details>
          </div>
        ) : (
          <div className="mt-9">
            <h2 className="poster text-[1.6rem]">{lt('inThisLesson')}</h2>
            <ul className="mt-3 space-y-2">
              {lesson.outline?.map((o, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-[0.7em] size-2 shrink-0 rounded-full bg-candy" aria-hidden />
                  <span>{tx(o)}</span>
                </li>
              ))}
            </ul>
            {lesson.live && (
              <div className="mt-9">
                <LiveTicket live={lesson.live} brief={brief} onView={onView} />
              </div>
            )}
            <Terms terms={lesson.terms} />
            {next && (
              <p className="mt-6 text-center">
                <a href={lessonHref(next)} className="alt py-2">
                  {lt('nextLesson')}
                </a>
              </p>
            )}
          </div>
        )}
        <p className="mt-6 text-center text-[13px] text-muted">{lt('notAdvice')}</p>
      </>
    )
  } else if (typeof screen === 'number') {
    const s = sections[screen]
    body = (
      <>
        <p className="poster text-[1.7rem]" aria-hidden>
          <mark className="mk">&nbsp;{screen + 1}&nbsp;</mark>
        </p>
        <h2 className="poster mt-3 text-[2.1rem] md:text-[2.6rem]">{tx(s.h)}</h2>
        <p className="mt-4 text-[1.0625rem] leading-[1.9] ltr:leading-[1.75]">{tx(s.p)}</p>
        {backNext}
      </>
    )
  } else if (screen === 'takeaway') {
    body = (
      <>
        <Takeaway lesson={lesson} />
        {backNext}
      </>
    )
  } else if (screen === 'live') {
    body = (
      <>
        <div className="pt-3">
          <LiveTicket live={lesson.live!} brief={brief} onView={onView} />
        </div>
        {backNext}
      </>
    )
  } else if (!quiz.result) {
    const { q, step, picked, answered, last, questions } = quiz
    const ok = picked === q.answer
    body = (
      <>
        <p className="text-[13.5px] font-semibold text-muted">{lt('questionN', { n: step + 1, m: questions.length })}</p>
        <h2 className="poster mt-2 text-[1.85rem] md:text-[2.2rem]">{tx(q.q)}</h2>
        {step === 0 && !answered && <p className="mt-2 text-[13.5px] text-muted">{lt('quizHint')}</p>}
        <div className="mt-5 grid gap-3">
          {q.options.map((o, i) => {
            const isRight = i === q.answer
            const isPicked = i === picked
            let tone =
              'cursor-pointer border-text/15 shadow-[0_4px_0_color-mix(in_srgb,var(--color-text)_11%,transparent)] hover:border-text/40 active:translate-y-[3px] active:shadow-none'
            if (answered && isRight) tone = 'border-up'
            else if (answered && isPicked) tone = 'border-down'
            else if (answered) tone = 'border-text/10 opacity-55'
            return (
              <button
                key={i}
                type="button"
                data-quiz-option
                onClick={() => !tooSoon() && quiz.pick(i)}
                disabled={answered}
                aria-pressed={isPicked}
                className={`link flex min-h-[3.75rem] w-full items-center gap-3 rounded-[18px] border-[3px] px-4 py-3 text-start text-[1.0625rem] leading-snug font-medium transition ${tone}`}
              >
                <span className="flex-1">{tx(o)}</span>
                {answered && (isRight || isPicked) && <Tick ok={isRight} />}
              </button>
            )
          })}
        </div>
        <div aria-live="polite">
          {answered && (
            <div className="mt-5 motion-safe:animate-[pop_.3s_cubic-bezier(.2,1.5,.4,1)_both]">
              <p className={`poster text-[1.6rem] ${ok ? 'text-up' : 'text-down'}`}>{ok ? lt('right') : lt('wrong')}</p>
              <p className="mt-1 leading-relaxed">{tx(q.why)}</p>
            </div>
          )}
        </div>
        <div className="mt-auto pt-7">
          {answered ? (
            <button ref={onward} type="button" data-quiz-next onClick={() => turn(quiz.advance)} className="go w-full scroll-mb-28">
              {last ? lt('seeScore') : lt('next')}
            </button>
          ) : (
            step === 0 && (
              <button type="button" onClick={() => go(at - 1)} className="alt min-h-11 px-1">
                {lt('prevStep')}
              </button>
            )
          )}
        </div>
      </>
    )
  } else {
    const { result, questions } = quiz
    const score = lt('score', { s: result.score, m: questions.length })
    const wallet = tp('title', { start: loadLedger().startUsdt })
    // a tap that lands here from the last "see my score" must not leave at once
    const held = (e: MouseEvent) => {
      if (tooSoon(450)) e.preventDefault()
    }
    body = result.passed ? (
      <>
        <div className="relative mx-auto h-[236px] w-full max-w-[350px]">
          <span className="absolute end-1 top-[34px] size-[184px] rounded-full bg-marker" aria-hidden />
          <span className="absolute end-[27px] top-[84px] motion-safe:animate-[hop_.6s_cubic-bezier(.2,1.4,.4,1)_both]">
            <Mascot mood="excited" size={138} />
          </span>
          <p className="bubble absolute start-0 top-0 max-w-[178px] text-[17px]">{result.wasPassed ? lt('passAgainMsg') : lt('passMsg')}</p>
          <p className="stamp absolute start-2 bottom-0 motion-safe:animate-[pop_.36s_.3s_cubic-bezier(.2,1.5,.4,1)_both]">
            {lt('passed')}
            <small>{score}</small>
          </p>
        </div>
        <div className="mt-auto pt-8">
          {next ? (
            <>
              <p className="mb-3 text-center text-[15px] leading-snug">
                <span className="block text-[13px] font-semibold text-muted">{lt('lessonN', { n: lessonNo(next) })}</span>
                <span className="font-semibold">{tx(next.title)}</span>
              </p>
              <a href={lessonHref(next)} onClick={held} data-next-lesson className="go">
                {lt('nextLesson')}
              </a>
              {/* learn, then try it: a passed quiz also leads to the practice wallet */}
              <p className="mt-4 text-center">
                <button type="button" onClick={() => turn(() => onView('practice'), 450)} className="alt min-h-11">
                  {wallet}
                </button>
              </p>
            </>
          ) : (
            <button type="button" onClick={() => turn(() => onView('practice'), 450)} className="go w-full">
              {wallet}
            </button>
          )}
          <p className="mt-1 text-center">
            <button type="button" onClick={() => turn(quiz.retry, 450)} className="cursor-pointer py-2 text-[13.5px] text-muted underline underline-offset-4">
              {lt('retry')}
            </button>
          </p>
          <div className="mt-5">
            <BotInvite place="quiz" inset />
          </div>
        </div>
      </>
    ) : (
      <>
        <div className="relative mx-auto h-[226px] w-full max-w-[350px]">
          <span className="absolute end-1 top-[42px] size-[184px] rounded-full bg-marker" aria-hidden />
          <span className="absolute end-[27px] top-[92px]">
            <Mascot mood={result.score === 0 ? 'worried' : 'thinking'} size={138} />
          </span>
          <p className="bubble absolute start-0 top-0 max-w-[214px] text-base">{lt('failMsg')}</p>
        </div>
        <p className="poster mt-5 text-center text-[1.7rem]">{score}</p>
        <div className="mt-auto pt-8">
          <button type="button" onClick={() => turn(quiz.retry, 450)} className="go w-full">
            {lt('retry')}
          </button>
          <p className="mt-4 text-center">
            <button
              type="button"
              onClick={() =>
                turn(() => {
                  quiz.retry()
                  setAt(1)
                }, 450)
              }
              className="alt min-h-11"
            >
              {lt('reread')}
            </button>
          </p>
        </div>
      </>
    )
  }

  return (
    <article className="mx-auto flex min-h-[calc(100svh-11.25rem)] max-w-xl flex-col px-1 md:min-h-[min(calc(100svh-9rem),35rem)]">
      {screen !== 'cover' && <h1 className="sr-only">{tx(lesson.title)}</h1>}
      {ready && (
        <div
          className="flex gap-1"
          role="progressbar"
          aria-label={tx(lesson.title)}
          aria-valuemin={0}
          aria-valuemax={segments}
          aria-valuenow={filled}
        >
          {Array.from({ length: segments }, (_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i < filled ? 'bg-text' : 'bg-text/15'}`} />
          ))}
        </div>
      )}
      <div className="mt-1.5 flex min-h-11 items-center justify-between gap-3 text-[13.5px]">
        <a href="#learn" className="alt py-2 font-medium text-muted decoration-1">
          {lt('back')}
        </a>
        {screen === 'cover' ? <CopyLink slug={lesson.slug} /> : <span className="font-semibold text-muted">{lt('lessonN', { n: no })}</span>}
      </div>
      <div ref={stage} tabIndex={-1} className="flex flex-1 flex-col pt-4 outline-none">
        {body}
      </div>
    </article>
  )
}
