// Words shared by the bot invitation and the trust line. The Arabic trust
// line reuses the guide's own sentence (guide.5b) so the promise reads the
// same everywhere. FRIEND is "send it to a friend on WhatsApp" (SendToFriend).

import type { Lang } from './i18n'

export const INVITE = {
  title: {
    en: 'Keep Qirat on Telegram',
    fr: 'Gardez Qirat sur Telegram',
    ar: 'احتفظ بقيراط في Telegram',
  },
  open: { en: 'Open the bot', fr: 'Ouvrir le bot', ar: 'افتح البوت' },
  trust: {
    en: 'Free. Qirat never messages you first, never asks you to send money and has no VIP group.',
    fr: 'Gratuit. Qirat ne vous écrit jamais en premier, ne vous demande jamais d’envoyer de l’argent et n’a pas de groupe VIP.',
    ar: 'مجاني. قيراط لا يراسلك أولًا أبدًا، ولا يطلب منك أن ترسل مالًا، وليست لديه مجموعة VIP.',
  },
} satisfies Record<string, Record<Lang, string>>

// What a visitor sends a friend: one line in the visitor's language, said as
// the visitor (a friend is "tu" in French), and the /s link it is counted by.
export const FRIEND_LINK = 'https://qirat.tn/s'

export const FRIEND = {
  label: {
    en: 'Send it to a friend on WhatsApp',
    fr: 'Envoyer à un ami sur WhatsApp',
    ar: 'أرسله لصديق على WhatsApp',
  },
  text: {
    en: `I’m learning crypto trading on Qirat with 1000 pretend dollars, free. Try it: ${FRIEND_LINK}`,
    fr: `J’apprends le trading crypto sur Qirat avec 1000 dollars fictifs, gratuitement. Essaie : ${FRIEND_LINK}`,
    ar: `أتعلّم التداول في قيراط بـ 1000 دولار تجريبية، مجانًا. جرّبه: ${FRIEND_LINK}`,
  },
} satisfies Record<string, Record<Lang, string>>

/** The WhatsApp link that opens a new message holding the line above. */
export const friendUrl = (lang: Lang): string => `https://wa.me/?text=${encodeURIComponent(FRIEND.text[lang])}`
