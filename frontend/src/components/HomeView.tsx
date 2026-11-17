import { useEffect } from 'react'
import { useI18n } from '../lib/i18n'
import { useLearnProgress } from '../lib/learnProgress'
import { lessonHref, lessonNo, useNextLesson } from '../lib/lessonPath'
import { LESSONS, isReady } from '../lib/lessons'
import type { Lesson } from '../lib/lessons'
import { loadLedger, qty, usdt } from '../lib/practice'
import { track } from '../lib/source'
import type { View } from '../lib/views'
import Caption from './brand/Caption'
import Mascot from './brand/Mascot'
import { LessonChain, NextLesson } from './LessonChain'
import StoryRail from './StoryRail'

// The first screen. It is a scene from the videos: one caption, the gold bar,
// one button. Below it, what a visitor can do here, each as a picture and one
// action: watch a story, follow the lessons, open the wallet, replay a month.

let startCounted = false // one "shown" per page load

export default function HomeView({ onView }: { onView: (v: View) => void }) {
  const { t, lang } = useI18n()
  const progress = useLearnProgress()
  const ledger = loadLedger()
  const traded = ledger.trades.length > 0
  // "started" as the old start strip defined it: read a lesson or made a trade
  const started = traded || Object.values(progress.lessons).some((p) => p.read || p.passed)
  const next = useNextLesson()
  const first = LESSONS.find(isReady) ?? LESSONS[0]

  useEffect(() => {
    if (started || startCounted) return
    startCounted = true
    track('start', 'shown')
  }, [started])

  const toPractice = () => {
    if (!started) track('start', 'practice')
    onView('practice')
  }

  return (
    <div className="overflow-x-clip">
      {/* ---------------------------------------------------------------- hero */}
      <section className="arrive mx-auto max-w-5xl md:grid md:grid-cols-2 md:items-center md:gap-6 md:px-6 md:pt-8">
        <div>
          <Caption
            as="h1"
            text={t('home.h1')}
            className="px-5 pt-6 text-[clamp(2.75rem,13.5vw,4rem)] md:px-0 md:text-[4.75rem] ltr:text-[clamp(2.5rem,11.5vw,3.4rem)] ltr:md:text-[4rem]"
          />
          <div className="hidden md:block">
            <HeroActions started={started} next={next} first={first} onPractice={toPractice} />
          </div>
        </div>

        <div className="relative mx-auto mt-1.5 h-[262px] w-full max-w-[430px] md:mt-0 md:h-[300px]">
          <span className="sun absolute -end-[52px] -top-2 size-[270px] rounded-full bg-marker md:-end-4 md:size-[310px]" aria-hidden />
          <span className="hop absolute end-[26px] top-[78px] md:end-[70px] md:top-[92px]">
            <Mascot size={206} blink label={t('home.barLabel')} />
          </span>
          <p className="bubble absolute start-5 top-[22px] max-w-[176px] text-base md:start-2 md:max-w-[210px] md:text-[17px]">
            {started ? t('home.bubbleBack') : t('home.bubble', { n: ledger.startUsdt })}
          </p>
          <p
            className="bill absolute start-[22px] top-[128px] rotate-[5deg] rounded-md bg-white px-3.5 pt-2 pb-1.5 text-center text-[#15171c] shadow-[0_10px_18px_-10px_rgba(90,60,10,.45)] md:start-6 md:top-[150px]"
            aria-hidden
          >
            <span className="poster block text-3xl" dir="ltr">
              {ledger.startUsdt} $
            </span>
            <span className="block text-xs font-semibold text-[#5e6068]">{t('home.bill')}</span>
          </p>
        </div>

        <div className="md:hidden">
          <HeroActions started={started} next={next} first={first} onPractice={toPractice} />
        </div>
      </section>

      {/* ------------------------------------------------------------- stories */}
      <section className="mx-auto max-w-5xl pt-11 md:px-6 md:pt-20" aria-labelledby="home-stories">
        <Caption id="home-stories" text={t('home.stories')} className="px-5 text-[2.1rem] md:px-0 md:text-5xl" />
        <StoryRail onTry={toPractice} />
      </section>

      {/* ------------------------------------------------------------- lessons */}
      <section className="mx-auto max-w-5xl px-5 pt-8 md:grid md:grid-cols-2 md:items-end md:gap-12 md:px-6 md:pt-16" aria-labelledby="home-learn">
        <div>
          <Caption id="home-learn" text={t('home.learnH', { n: LESSONS.length })} className="text-[2.75rem] md:text-6xl" />
          <LessonChain className="mt-6" />
        </div>
        <NextLesson className="mt-7 md:mt-0" />
      </section>

      {/* ------------------------------------------------- the practice wallet */}
      <section className="band relative mt-14 px-5 pt-14 pb-16 md:mt-24 md:pt-20 md:pb-24" aria-labelledby="home-practice">
        <div className="mx-auto max-w-5xl md:grid md:grid-cols-2 md:items-center md:gap-12 md:px-1">
          <div>
            <Caption id="home-practice" text={t('home.practiceH')} className="text-[2.75rem] md:text-6xl" />
            <button type="button" onClick={toPractice} className="go go-ink mt-9 hidden w-full max-w-sm md:block">
              {t('home.openWallet')}
            </button>
          </div>
          <div className="relative mt-8 md:mt-0">
            <img
              src="/cast/youssef-excited.webp"
              alt={lang === 'ar' ? 'يوسف' : 'Youssef'}
              width={112}
              height={197}
              loading="lazy"
              className="absolute -top-[72px] end-auto start-[58%] w-28 -rotate-6 md:start-[62%]"
            />
            <div className="ticket-wrap mx-3 max-w-sm md:mx-auto">
              <div className="ticket text-[15px] font-medium">
                <p className="poster pb-3.5 text-[22px]">{t('home.ticket')}</p>
                <dl className="ticket-rule grid grid-cols-[1fr_auto] gap-y-3 py-4">
                  {Object.entries(ledger.wallet.positions)
                    .slice(0, 3)
                    .map(([base, p]) => (
                      <div key={base} className="contents">
                        <dt>
                          <bdi>{base}</bdi>
                        </dt>
                        <dd dir="ltr" className="num font-semibold">
                          {qty(p.qty)}
                        </dd>
                      </div>
                    ))}
                  <dt>{t('home.cash')}</dt>
                  <dd dir="ltr" className="num font-semibold">
                    {usdt(ledger.wallet.cash)}
                  </dd>
                  <dt className="text-[13.5px] font-normal text-[#5e6068]">{t('home.trades')}</dt>
                  <dd dir="ltr" className="num text-[13.5px] font-normal text-[#5e6068]">
                    {ledger.trades.length}
                  </dd>
                </dl>
                <p className="ticket-rule poster flex items-baseline justify-between pt-3.5 text-[28px]">
                  <span>{t('home.startedWith')}</span>
                  <span dir="ltr">{usdt(ledger.startUsdt, 0)}</span>
                </p>
              </div>
              <p className="stamp absolute -end-5 -bottom-[84px]">
                {t('home.stamp')}
                <small className="whitespace-pre-line">{t('home.stampSub')}</small>
              </p>
            </div>
          </div>
          <button type="button" onClick={toPractice} className="go go-ink mt-24 w-full md:hidden">
            {t('home.openWallet')}
          </button>
        </div>
      </section>

      {/* -------------------------------------------------------- time machine */}
      <section className="mx-auto max-w-5xl px-5 pt-11 md:grid md:grid-cols-2 md:items-center md:gap-12 md:px-6 md:pt-20" aria-labelledby="home-replay">
        <div>
          <Caption id="home-replay" text={t('home.replayH')} className="text-[2.75rem] md:text-6xl" />
          <button type="button" onClick={() => onView('replay')} className="go mt-9 hidden w-full max-w-sm md:block">
            {t('home.replayGo')}
          </button>
        </div>
        <div>
          <svg viewBox="0 0 346 150" className="mt-5 block h-auto w-full overflow-visible text-text md:mt-0" aria-hidden>
            <polyline
              points="4,96 16,88 28,92 40,70 52,76 64,58 76,64 88,40 100,52 112,46 124,74 136,82"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="136,82 148,96 160,90 172,104 184,84 196,72 208,80 220,60 232,66 244,44 256,50 268,34 280,46 292,28 304,36 316,20 328,30 342,16"
              fill="none"
              stroke="currentColor"
              strokeOpacity=".18"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 9"
            />
            <line x1="136" y1="8" x2="136" y2="124" stroke="var(--color-candy)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="136" cy="82" r="9" fill="var(--color-marker)" stroke="currentColor" strokeWidth="4" />
            <rect x="2" y="136" width="134" height="8" rx="4" fill="currentColor" />
            <rect x="140" y="136" width="204" height="8" rx="4" fill="currentColor" fillOpacity=".14" />
          </svg>
          <ul className="mt-3.5 flex flex-wrap gap-2" aria-hidden>
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="rounded-[10px] border-2 border-dashed border-text/35 px-3 py-1.5 text-[13.5px] font-semibold" dir="ltr">
                coin ?
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => onView('replay')} className="go mt-6 w-full md:hidden">
            {t('home.replayGo')}
          </button>
        </div>
      </section>
    </div>
  )
}

function HeroActions({
  started,
  next,
  first,
  onPractice,
}: {
  started: boolean
  next: Lesson | null
  first: Lesson
  onPractice: () => void
}) {
  const { t } = useI18n()
  const { startUsdt } = loadLedger()
  return (
    <div className="relative z-10 px-5 pt-2 text-center md:max-w-md md:px-0 md:pt-9 md:text-start">
      {started ? (
        <>
          {next ? (
            <a href={lessonHref(next)} className="go">
              {t('home.continue', { n: lessonNo(next) })}
            </a>
          ) : (
            <button type="button" onClick={onPractice} className="go w-full">
              {t('home.openWallet')}
            </button>
          )}
          {next && (
            <button type="button" onClick={onPractice} className="alt mt-5">
              {t('home.openWallet')}
            </button>
          )}
        </>
      ) : (
        <>
          {/* The videos end on the practice wallet, so it is the main button; lesson 1 is the second. */}
          <button type="button" onClick={onPractice} className="go w-full">
            {t('home.try', { n: startUsdt })}
          </button>
          <a href={lessonHref(first)} onClick={() => track('start', 'lesson')} className="alt mt-5">
            {t('home.lesson1')}
          </a>
        </>
      )}
      <p className="mt-3.5 text-[13.5px] text-muted">{t('home.free')}</p>
    </div>
  )
}
