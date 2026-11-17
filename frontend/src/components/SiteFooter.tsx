import { useState } from 'react'
import { feedbackVisible } from '../lib/feedback'
import { useI18n } from '../lib/i18n'
import Socials from './brand/Socials'

/** The foot of every screen: Qirat's accounts, one line of fine print, and the
 *  rest (how grades are made, where the numbers come from) behind one tap. */
export default function SiteFooter({ onFeedback }: { onFeedback: () => void }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  return (
    <footer className="mx-auto max-w-5xl space-y-5 px-5 pt-12 pb-4 text-sm text-muted md:px-6 md:pt-20">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
        <p className="font-medium text-text">{t('foot.follow')}</p>
        <Socials />
      </div>
      <div>
        <p>
          {t('foot.notAdvice')}{' '}
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="alt font-normal decoration-1">
            {t('foot.sources')}
          </button>
        </p>
        {open && (
          <div className="mt-2 space-y-1">
            <p>{t('foot.disclaimer')}</p>
            <p dir="ltr" className="rtl:text-end">
              {t('foot.data')}: Binance,{' '}
              <a href="https://www.coingecko.com/en/api" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-text">
                Powered by CoinGecko
              </a>
              , Fear &amp; Greed:{' '}
              <a
                href="https://alternative.me/crypto/fear-and-greed-index/"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-text"
              >
                Alternative.me
              </a>
            </p>
          </div>
        )}
      </div>
      {feedbackVisible && (
        <p>
          <button type="button" onClick={onFeedback} className="alt text-text">
            {t('foot.feedback')}
          </button>
          <span className="ms-2">{t('foot.feedbackHint')}</span>
        </p>
      )}
    </footer>
  )
}
