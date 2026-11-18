import { useEffect } from 'react'
import { useI18n } from '../lib/i18n'
import type { UIKey } from '../lib/i18n'
import Caption from './brand/Caption'
import { IconX } from './Icons'

const STEPS = [1, 2, 3, 4, 5, 6] as const

export default function GuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-end bg-black/45 sm:place-items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('guide.title')}
    >
      {/* a sheet of the same paper as the page */}
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-bg px-5 pt-5 pb-6 shadow-2xl sm:rounded-[28px] sm:px-7 sm:pt-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <Caption text={t('guide.title')} className="text-[2.1rem]" />
            <p className="mt-1.5 text-sm text-muted">{t('guide.sub')}</p>
          </div>
          <button
            onClick={onClose}
            aria-label={t('guide.close')}
            className="link -me-1.5 grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl text-xl text-muted transition hover:text-text"
          >
            <IconX />
          </button>
        </div>

        <ol className="mt-6 space-y-5">
          {STEPS.map((n) => (
            <li key={n} className="flex gap-3.5">
              <span className="num poster mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border-[3px] border-candy bg-marker pt-[3px] text-lg text-on-marker">
                {n}
              </span>
              <div>
                <p className="leading-snug font-semibold">{t(`guide.${n}t` as UIKey)}</p>
                <p className="mt-1 text-sm text-muted">{t(`guide.${n}b` as UIKey)}</p>
              </div>
            </li>
          ))}
        </ol>

        <button onClick={onClose} className="go go-sm mt-7 w-full">
          {t('guide.close')}
        </button>
        <p className="mt-5 text-center text-[13px] text-muted">{t('foot.disclaimer')}</p>
      </div>
    </div>
  )
}
