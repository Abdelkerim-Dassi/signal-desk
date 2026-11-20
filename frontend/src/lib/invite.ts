// Words shared by the bot invitation and the trust line. The Arabic trust
// line reuses the guide's own sentence (guide.5b) so the promise reads the
// same everywhere.

import type { Lang } from './i18n'

export const INVITE = {
  title: {
    en: 'Keep Qirat on Telegram',
    fr: 'Gardez Qirat sur Telegram',
    ar: 'احتفظ بقيراط في Telegram',
  },
  body: {
    en: 'Send the bot any message and it checks it for scam signs, or a coin to see its karat.',
    fr: 'Envoyez n’importe quel message au bot : il y cherche les signes d’arnaque. Ou une crypto, pour voir son carat.',
    ar: 'أرسل إلى البوت أي رسالة ليفحصها بحثًا عن علامات الاحتيال، أو اسم عملة ليعرض لك قيراطها.',
  },
  open: { en: 'Open the bot', fr: 'Ouvrir le bot', ar: 'افتح البوت' },
  trust: {
    en: 'Free. Qirat never messages you first, never asks you to send money and has no VIP group.',
    fr: 'Gratuit. Qirat ne vous écrit jamais en premier, ne vous demande jamais d’envoyer de l’argent et n’a pas de groupe VIP.',
    ar: 'مجاني. قيراط لا يراسلك أولًا أبدًا، ولا يطلب منك أن ترسل مالًا، وليست لديه مجموعة VIP.',
  },
} satisfies Record<string, Record<Lang, string>>
