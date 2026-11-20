import { useI18n } from '../lib/i18n'
import { FRIEND, friendUrl } from '../lib/invite'
import { track } from '../lib/source'
import { IconWhatsApp } from './Icons'

/** Where the line was offered: also the value of its counter (share:practice, share:lesson). */
export type ShareFrom = 'practice' | 'lesson'

/**
 * "Send it to a friend on WhatsApp": one quiet line at two happy moments, a
 * browser's first practice trade and a lesson passed. It never takes the place
 * of what comes next. The tap opens WhatsApp on a new message (one sentence in
 * the visitor's language and qirat.tn/s), and is counted as share:<from>; a
 * friend who opens the link is counted as visit:s. Nothing about either person.
 */
export default function SendToFriend({ from, className = '' }: { from: ShareFrom; className?: string }) {
  const { lang } = useI18n()
  return (
    <a
      href={friendUrl(lang)}
      target="_blank"
      rel="noreferrer"
      onClick={() => track('share', from)}
      className={`alt inline-flex items-center gap-2 py-3 text-[15px] ${className}`}
    >
      <IconWhatsApp className="shrink-0 text-[1.35em]" />
      {FRIEND.label[lang]}
    </a>
  )
}
