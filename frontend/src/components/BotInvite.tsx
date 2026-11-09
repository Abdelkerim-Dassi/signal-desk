import { useI18n } from '../lib/i18n'
import { INVITE } from '../lib/invite'
import { botUrl, track } from '../lib/source'
import type { Place } from '../lib/source'
import { IconTelegram } from './Icons'

/**
 * The one invitation on the site: start the Telegram bot. It sits where a
 * visitor has just got something (a scam result, a passed quiz, a practice
 * trade), with the promise next to the button, because "join us on Telegram"
 * is also what the scams say.
 */
export default function BotInvite({ place, inset = false }: { place: Place; inset?: boolean }) {
  const { lang } = useI18n()
  const s = (k: keyof typeof INVITE) => INVITE[k][lang]
  return (
    <div
      className={`flex flex-col gap-3 p-4 text-start sm:flex-row sm:items-center ${
        inset ? 'rounded-2xl border border-border bg-subtle/60' : 'card'
      }`}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#229ED9] text-xl text-white" aria-hidden>
        <IconTelegram />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{s('title')}</p>
        <p className="text-sm text-muted">{s('body')}</p>
        <p className="mt-1 text-xs text-muted">{s('trust')}</p>
      </div>
      <a
        href={botUrl(place)}
        target="_blank"
        rel="noreferrer"
        onClick={() => track('bot_click', place)}
        className="shrink-0 rounded-full bg-[#166d99] px-5 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90"
      >
        {s('open')}
      </a>
    </div>
  )
}
