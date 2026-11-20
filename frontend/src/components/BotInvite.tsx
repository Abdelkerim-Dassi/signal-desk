import { useI18n } from '../lib/i18n'
import { INVITE } from '../lib/invite'
import { botUrl, track } from '../lib/source'
import type { Place } from '../lib/source'
import { IconTelegram } from './Icons'

/**
 * The one invitation on the site: start the Telegram bot. It sits where a
 * visitor has just got something (a passed quiz, a practice trade): one line
 * and one button, with the promise under them, because "join us on Telegram"
 * is also what the scams say.
 *
 * On a page it closes the screen under a dashed rule; `inset` drops the rule
 * for a spot inside another piece (the quiz result).
 */
export default function BotInvite({ place, inset = false }: { place: Place; inset?: boolean }) {
  const { lang } = useI18n()
  const s = (k: keyof typeof INVITE) => INVITE[k][lang]
  return (
    <div className={`text-start ${inset ? '' : 'border-t-2 border-dashed border-text/15 pt-6'}`}>
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
        <p className="text-[17px] leading-snug font-semibold">{s('title')}</p>
        <a
          href={botUrl(place)}
          target="_blank"
          rel="noreferrer"
          onClick={() => track('bot_click', place)}
          className="go go-sm mb-[5px] inline-flex shrink-0 items-center gap-2 px-5"
        >
          <IconTelegram className="mb-[3px] text-xl" aria-hidden />
          {s('open')}
        </a>
      </div>
      <p className="mt-2.5 text-[13px] text-muted">{s('trust')}</p>
    </div>
  )
}
