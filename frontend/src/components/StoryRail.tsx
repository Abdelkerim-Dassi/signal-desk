import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { track } from '../lib/source'
import { CAST_NAME, STORIES, clock } from '../lib/stories'
import type { Story } from '../lib/stories'
import Socials from './brand/Socials'

/** The story videos as a row of tiles. A tile plays its video on the site
 *  (or opens the platform, if its switch in lib/stories.ts says 'out'). */
export default function StoryRail({ onTry }: { onTry: () => void }) {
  const { lang } = useI18n()
  const [open, setOpen] = useState<Story | null>(null)

  return (
    <>
      <ul className="flex snap-x snap-mandatory scroll-px-5 gap-3.5 overflow-x-auto px-5 pt-4 pb-6 [scrollbar-width:none] md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        {STORIES.map((s, i) => {
          const tile = (
            <>
              <span
                className={`relative block h-[236px] overflow-hidden rounded-[18px] border-[5px] border-white shadow-[0_14px_22px_-14px_rgba(60,40,5,.55)] md:h-[330px] ${
                  i % 2 ? 'rotate-[1.6deg]' : '-rotate-2'
                }`}
              >
                <img src={`/stories/${s.id}.jpg`} alt="" loading="lazy" className="size-full object-cover object-[50%_30%]" />
                <span
                  className="absolute end-2.5 bottom-2.5 flex items-center gap-1.5 rounded-full bg-[#15171c] py-1.5 ps-2.5 pe-3 text-xs font-semibold text-white"
                  dir="ltr"
                >
                  <svg viewBox="0 0 10 12" width="10" height="12" aria-hidden>
                    <path d="M0 0l10 6-10 6z" fill="currentColor" />
                  </svg>
                  {clock(s.seconds)}
                </span>
              </span>
              <b className="mt-3 block text-[15px] leading-snug font-semibold">{s.title[lang]}</b>
              <span className="mt-1.5 flex flex-wrap gap-1.5">
                {s.cast.map((c) => (
                  <span key={c} className={`who who-${c}`}>
                    {CAST_NAME[c][lang]}
                  </span>
                ))}
              </span>
            </>
          )
          return (
            <li key={s.id} className="w-[152px] shrink-0 snap-start md:w-auto">
              {s.play === 'out' && s.out ? (
                <a href={s.out} target="_blank" rel="noreferrer" onClick={() => track('story', s.id)} className="story block rounded-2xl text-start">
                  {tile}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    track('story', s.id)
                    setOpen(s)
                  }}
                  className="story block w-full cursor-pointer rounded-2xl text-start"
                >
                  {tile}
                </button>
              )}
            </li>
          )
        })}
      </ul>
      {open && (
        <Player
          story={open}
          onClose={() => setOpen(null)}
          onTry={() => {
            setOpen(null)
            onTry()
          }}
        />
      )}
    </>
  )
}

function Player({ story, onClose, onTry }: { story: Story; onClose: () => void; onTry: () => void }) {
  const { t, lang } = useI18n()
  const video = useRef<HTMLVideoElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const [ended, setEnded] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeBtn.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/85" role="dialog" aria-modal="true" aria-label={story.title[lang]}>
      <button type="button" className="absolute inset-0 cursor-default" aria-hidden tabIndex={-1} onClick={onClose} />
      <div className="relative aspect-[9/16] h-[min(100dvh,calc(100vw*16/9))] overflow-hidden bg-[#f7f3ea] sm:h-[min(92dvh,calc(100vw*16/9))] sm:rounded-3xl">
        <video
          ref={video}
          src={`/stories/${story.id}.mp4`}
          poster={`/stories/${story.id}.jpg`}
          autoPlay
          playsInline
          controls
          onEnded={() => setEnded(true)}
          onPlay={() => setEnded(false)}
          className="size-full object-contain"
        />
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          aria-label={t('story.close')}
          className="link absolute end-3 top-3 grid size-11 cursor-pointer place-items-center rounded-full bg-[#15171c] text-xl text-white"
        >
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {/* the video's last word is "try it yourself": the button is right there */}
        {ended && (
          <div className="absolute inset-x-0 bottom-0 space-y-4 bg-[#f7f3ea] px-5 pt-5 pb-6 text-[#15171c] shadow-[0_-18px_30px_-10px_rgba(60,40,5,.35)]">
            <button type="button" onClick={onTry} className="go w-full">
              {t('story.try')}
            </button>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                className="alt text-sm"
                onClick={() => {
                  setEnded(false)
                  void video.current?.play()
                }}
              >
                {t('story.again')}
              </button>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#5e6068]">{t('story.more')}</span>
                <Socials only={['tiktok', 'instagram']} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
