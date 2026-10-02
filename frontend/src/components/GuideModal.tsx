import { useEffect } from 'react'
import { useI18n } from '../lib/i18n'
import type { UIKey } from '../lib/i18n'
import { IconX } from './Icons'
import { GemMark } from './Logo'

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
      className="fixed inset-0 z-[60] grid place-items-end bg-black/40 backdrop-blur-sm sm:place-items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('guide.title')}
    >
      <div
        className="rise max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-card p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <GemMark size={36} />
            <div>
              <h2 className="text-xl font-semibold">{t('guide.title')}</h2>
              <p className="text-sm text-muted">{t('guide.sub')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('guide.close')}
            className="grid size-9 cursor-pointer place-items-center rounded-full text-muted transition hover:bg-subtle hover:text-text"
          >
            <IconX />
          </button>
        </div>

        <ol className="mt-6 space-y-4">
          {STEPS.map((n) => (
            <li key={n} className="flex gap-3.5">
              <span className="num grid size-8 shrink-0 place-items-center rounded-full bg-gold-soft text-sm font-semibold text-gold">
                {n}
              </span>
              <div>
                <p className="font-semibold">{t(`guide.${n}t` as UIKey)}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted">{t(`guide.${n}b` as UIKey)}</p>
              </div>
            </li>
          ))}
        </ol>

        <button
          onClick={onClose}
          className="mt-6 w-full cursor-pointer rounded-full bg-text py-3 text-sm font-semibold text-bg transition hover:opacity-90"
        >
          {t('guide.close')}
        </button>
        <p className="mt-3 text-center text-xs text-muted">{t('foot.disclaimer')}</p>
      </div>
    </div>
  )
}
