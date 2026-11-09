// Words shared by the bot invitation and the trust line. The Arabic trust
// line reuses the guide's own sentence (guide.5b) so the promise reads the
// same everywhere.

import type { Lang } from './i18n'

export const INVITE = {
  title: {
    en: 'Keep Qirat on Telegram',
    fr: 'Gardez Qirat sur Telegram',
    ar: 'خلّي قيراط عندك في Telegram',
  },
  body: {
    en: 'Send the bot any message and it checks it for scam signs, or a coin to see its karat.',
    fr: 'Envoyez au bot un message et il cherche les signaux d’arnaque, ou une crypto pour voir son carat.',
    ar: 'ابعث للبوت أي ميساج يفركسهولك، ولا اسم coin يقلّك قدّاش من قيراط.',
  },
  open: { en: 'Open the bot', fr: 'Ouvrir le bot', ar: 'حلّ البوت' },
  trust: {
    en: 'Free. Qirat never messages you first, never asks you to send money and has no VIP group.',
    fr: 'Gratuit. Qirat ne vous écrit jamais en premier, ne vous demande jamais d’envoyer de l’argent et n’a pas de groupe VIP.',
    ar: 'بلاش. قيراط عمرو ما يبعثلك هو الأوّل، عمرو ما يطلب منك تبعث فلوس، وما عندوش قروب VIP.',
  },
} satisfies Record<string, Record<Lang, string>>
