import { useI18n } from '../lib/i18n'
import { useLearnProgress } from '../lib/learnProgress'
import { lessonHref, lessonNo, useNextLesson } from '../lib/lessonPath'
import { LESSONS, LEVELS, isReady } from '../lib/lessons'
import type { Lesson } from '../lib/lessons'

// The course as one chain: a link per lesson, a row per level. Used on the
// first screen and meant for the Learn screen too, so the 22 lessons read as
// one map instead of 22 stacked boxes.

export function LessonChain({ className = '' }: { className?: string }) {
  const { lang } = useI18n()
  const progress = useLearnProgress()
  const next = useNextLesson()
  const passed = (l: Lesson) => Boolean(progress.lessons[l.slug]?.passed)
  return (
    <div className={`grid gap-[18px] ${className}`}>
      {LEVELS.map((lv) => {
        const list = LESSONS.filter((l) => l.level === lv.level)
        if (!list.length) return null
        return (
          <div key={lv.level}>
            <p className="mb-2.5 text-[13.5px] font-semibold text-muted">{lv.name[lang]}</p>
            <ol className="flex flex-wrap items-center gap-y-2">
              {list.map((l, i) => {
                const now = l === next
                return (
                  <li key={l.slug} className="flex items-center">
                    {i > 0 && <span className={`h-[5px] w-[5px] ${passed(list[i - 1]) ? 'bg-candy' : 'bg-text/20'}`} aria-hidden />}
                    <a
                      href={lessonHref(l)}
                      title={l.title[lang]}
                      aria-label={`${lessonNo(l)}. ${l.title[lang]}`}
                      aria-current={now ? 'step' : undefined}
                      className={`link num grid place-items-center rounded-full border-[3px] font-semibold transition ${
                        now
                          ? 'nudge size-9 border-text bg-text text-[15px] text-bg'
                          : passed(l)
                            ? 'size-[29px] border-candy bg-marker text-xs text-on-marker'
                            : isReady(l)
                              ? 'size-[29px] border-text/20 text-xs text-muted hover:border-text/50'
                              : 'size-[29px] border-dashed border-text/20 text-xs text-muted'
                      }`}
                    >
                      {lessonNo(l)}
                    </a>
                  </li>
                )
              })}
            </ol>
          </div>
        )
      })}
    </div>
  )
}

/** Sami holds up the next lesson. */
export function NextLesson({ className = '' }: { className?: string }) {
  const { t, lang } = useI18n()
  const lesson = useNextLesson()
  return (
    <div className={`flex items-end gap-1 ${className}`}>
      <img
        src="/cast/sami-happy.webp"
        alt={lang === 'ar' ? 'سامي' : 'Sami'}
        width={86}
        height={160}
        loading="lazy"
        className="-mb-1.5 w-[86px] shrink-0"
      />
      <div className="min-w-0 flex-1 rounded-[22px] rounded-es-[4px] bg-card px-4 pt-3.5 pb-4 shadow-[0_14px_22px_-16px_rgba(60,40,5,.5)]">
        {lesson ? (
          <>
            <p className="text-[13px] font-semibold text-sami">{t('home.lessonN', { n: lessonNo(lesson) })}</p>
            <p className="mt-1 mb-3 text-[17px] leading-snug font-semibold">{lesson.title[lang]}</p>
            <a href={lessonHref(lesson)} className="go go-sm">
              {t('home.startLesson')}
            </a>
          </>
        ) : (
          <p className="text-[17px] leading-snug font-semibold">{t('home.allDone')}</p>
        )}
      </div>
    </div>
  )
}
