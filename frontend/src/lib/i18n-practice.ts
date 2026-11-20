// Strings for the Practice screen, kept apart from lib/i18n.ts so the shared
// table stays small. Coach notes describe what the user just did; none of
// them tells anyone to buy or sell.

import { useI18n } from './i18n'
import type { Lang } from './i18n'
import type { CoachNote, TradeErrorCode } from './practice'

type Entry = Record<Lang, string>

export const P = {
  // also printed as plain text on the Learn screen, so it carries no marker
  title: { en: 'Practice with ${start}', fr: 'S’entraîner avec {start} $', ar: 'تدرّب بـ {start} دولار' },
  // the same words as this screen's caption; [[double brackets]] sit on the gold marker
  titleCap: { en: 'Practice with [[${start}]]', fr: 'S’entraîner avec [[{start} $]]', ar: 'تدرّب بـ [[{start} دولار]]' },
  balance: { en: 'Practice balance', fr: 'Solde d’entraînement', ar: 'رصيد التدريب' },
  pnl: { en: 'Since you started', fr: 'Depuis le début', ar: 'منذ أن بدأت' },
  startedOn: { en: 'Started {date} with {start} USDT', fr: 'Commencé le {date} avec {start} USDT', ar: 'بدأت يوم {date} بـ {start} USDT' },
  holdWaiting: { en: 'Waiting for the BTC price…', fr: 'En attente du prix du BTC…', ar: 'في انتظار سعر Bitcoin…' },
  chartHold: { en: 'Just holding BTC', fr: 'Garder du BTC', ar: 'لو احتفظت بـ Bitcoin' },

  // one tap for a wallet that has not traded yet: the bar says firstTitle, the button is
  // firstBuy (it says the money is pretend), firstNote is the first line behind "the rules";
  // \u00a0 keeps «بـ» / «الـ» on the same line as the word after it
  firstTitle: { en: 'Make your first trade', fr: 'Votre premier achat', ar: 'نفّذ صفقتك الأولى' },
  firstBuy: {
    en: 'Buy Bitcoin with {amount} pretend dollars',
    fr: 'Acheter du Bitcoin avec {amount} dollars fictifs',
    ar: 'اشترِ Bitcoin بـ\u00a0{amount} دولار تجريبية',
  },
  firstNote: {
    en: 'Pretend money, live price. You pay the fee and the spread (a small price gap), as on a real exchange.',
    fr: 'Argent fictif, prix réel. Vous payez les frais et l’écart (une petite différence de prix), comme sur une vraie plateforme.',
    ar: 'مال تجريبي، بالسعر الحي. وتُخصم الرسوم والفارق (spread) كما في منصة حقيقية.',
  },
  // the caption over the first trade's receipt: the words of `traded`, with the marker
  tradedCap: { en: 'Practice trade [[done]].', fr: 'Opération fictive [[effectuée]].', ar: '[[تمّت]] الصفقة التجريبية.' },
  // what the bar says under that receipt, when the coach has no note on the trade
  firstSay: {
    en: 'You own a little Bitcoin now. Its price moves, and your wallet moves with it.',
    fr: 'Vous avez maintenant un peu de Bitcoin. Son prix bouge, et votre portefeuille bouge avec lui.',
    ar: 'أصبحت تملك القليل من Bitcoin. سعره يتحرك، ومحفظتك تتحرك معه.',
  },

  // keep my wallet: a private link to a saved copy of the wallet and the lessons (lib/keep.ts)
  keepButton: { en: 'Keep my wallet and lessons', fr: 'Garder mon portefeuille et mes leçons', ar: 'احفظ محفظتك ودروسك' },
  keepWhy: {
    en: 'You get a private link. No name, no email.',
    fr: 'Vous recevez un lien privé. Ni nom, ni e-mail.',
    ar: 'تحصل على رابط خاص بك. بلا اسم ولا بريد إلكتروني.',
  },
  keepFailed: {
    en: 'Could not save it just now. Try again in a minute.',
    fr: 'Impossible de l’enregistrer pour le moment. Réessayez dans une minute.',
    ar: 'تعذّر الحفظ الآن. حاول مرة أخرى بعد دقيقة.',
  },
  keptTitle: { en: 'Your wallet and lessons are kept', fr: 'Votre portefeuille et vos leçons sont gardés', ar: 'محفظتك ودروسك محفوظة' },
  keepShow: { en: 'My link', fr: 'Mon lien', ar: 'رابطي' },
  keptLine: {
    en: 'Open this link in any browser or phone to find your wallet. Anyone who has the link can open this practice wallet. No name, no email. It updates by itself after each trade.',
    fr: 'Ouvrez ce lien dans n’importe quel navigateur ou téléphone pour retrouver votre portefeuille. Toute personne qui a le lien peut ouvrir ce portefeuille fictif. Ni nom, ni e-mail. Il se met à jour tout seul après chaque opération.',
    ar: 'افتح هذا الرابط في أي متصفح أو هاتف لتجد محفظتك. أي شخص لديه الرابط يستطيع فتح محفظة التدريب هذه. بلا اسم ولا بريد إلكتروني. وتتحدّث المحفظة تلقائيًا بعد كل صفقة.',
  },
  keepCopy: { en: 'Copy the link', fr: 'Copier le lien', ar: 'انسخ الرابط' },
  keepCopied: { en: '✓ Copied', fr: '✓ Copié', ar: '✓ تم النسخ' },
  keepShare: { en: 'Send the link', fr: 'Envoyer le lien', ar: 'أرسل الرابط' },
  linkOpening: { en: 'Opening your saved wallet…', fr: 'Ouverture de votre portefeuille gardé…', ar: 'جارٍ فتح محفظتك المحفوظة…' },
  linkOpened: {
    en: 'Your saved wallet is open in this browser, and it stays up to date from now on.',
    fr: 'Votre portefeuille gardé est ouvert dans ce navigateur, et il reste à jour à partir de maintenant.',
    ar: 'محفظتك المحفوظة مفتوحة في هذا المتصفح، وستبقى محدّثة من الآن فصاعدًا.',
  },
  linkGone: {
    en: 'This link no longer opens a saved wallet: it is wrong, or it has expired. The wallet in this browser has not changed.',
    fr: 'Ce lien n’ouvre plus de portefeuille gardé : il est faux, ou il a expiré. Le portefeuille de ce navigateur n’a pas changé.',
    ar: 'هذا الرابط لم يعد يفتح محفظة محفوظة: إما أنه خاطئ أو انتهت صلاحيته. المحفظة في هذا المتصفح لم تتغير.',
  },
  linkFailed: {
    en: 'Could not open the saved wallet just now.',
    fr: 'Impossible d’ouvrir le portefeuille gardé pour le moment.',
    ar: 'تعذّر فتح المحفظة المحفوظة الآن.',
  },
  askTitle: { en: 'Which wallet do you keep?', fr: 'Quel portefeuille gardez-vous ?', ar: 'أي محفظة تحتفظ بها؟' },
  askBody: {
    en: 'This browser already has a practice wallet with trades, and the link opens another one. Only one can stay here; the other is removed from this browser.',
    fr: 'Ce navigateur a déjà un portefeuille fictif avec des opérations, et le lien en ouvre un autre. Un seul peut rester ici ; l’autre est retiré de ce navigateur.',
    ar: 'في هذا المتصفح محفظة تدريب فيها صفقات، والرابط يفتح محفظة أخرى. يمكن أن تبقى واحدة فقط هنا، وتُحذف الأخرى من هذا المتصفح.',
  },
  // each answer is two lines: which wallet, then how many trades it holds
  askSaved: { en: 'The one from the link', fr: 'Celui du lien', ar: 'محفظة الرابط' },
  askLocal: { en: 'The one in this browser', fr: 'Celui de ce navigateur', ar: 'محفظة هذا المتصفح' },
  askTrades: { en: 'trades: {n}', fr: 'opérations : {n}', ar: 'الصفقات: {n}' },

  trade: { en: 'Practice [[trade]]', fr: 'Opération [[d’entraînement]]', ar: 'صفقة [[تدريبية]]' },
  coin: { en: 'Coin', fr: 'Crypto', ar: 'العملة' },
  buy: { en: 'Buy', fr: 'Acheter', ar: 'اشترِ' },
  sell: { en: 'Sell', fr: 'Vendre', ar: 'بِع' },
  amount: { en: 'Amount to spend (USDT)', fr: 'Montant à dépenser (USDT)', ar: 'المبلغ الذي ستدفعه (USDT)' },
  max: { en: 'All', fr: 'Tout', ar: 'كل الرصيد' },
  sellShare: { en: 'How much of your {base}', fr: 'Quelle part de votre {base}', ar: 'أي نسبة من {base} لديك' },
  noneHeld: { en: 'You hold no {base} in practice yet.', fr: 'Vous n’avez pas encore de {base} en entraînement.', ar: 'لا تملك {base} في التدريب بعد.' },
  cashLeft: { en: 'Practice cash', fr: 'Argent liquide fictif', ar: 'النقد التجريبي' },
  youGet: { en: 'You get', fr: 'Vous recevez', ar: 'ستحصل على' },
  fee: { en: 'Fee (0.1%)', fr: 'Frais (0,1 %)', ar: 'الرسوم (0.1%)' },
  spread: { en: 'Spread (0.05%)', fr: 'Écart (0,05 %)', ar: 'الفارق (0.05%)' },
  fillAt: { en: 'Price with spread', fr: 'Prix avec écart', ar: 'السعر مع الفارق' },
  confirmBuy: { en: 'Practice buy', fr: 'Achat fictif', ar: 'شراء تجريبي' },
  confirmSell: { en: 'Practice sell', fr: 'Vente fictive', ar: 'بيع تجريبي' },
  working: { en: 'Placing…', fr: 'En cours…', ar: 'جارٍ التنفيذ…' },
  quoting: { en: 'Checking the live price…', fr: 'Vérification du prix…', ar: 'جارٍ التحقق من السعر الحي…' },
  day7: { en: '7 days', fr: '7 jours', ar: '7 أيام' },
  day1: { en: '24h', fr: '24 h', ar: '24 ساعة' },
  weatherNow: { en: 'Market weather', fr: 'Météo du marché', ar: 'طقس السوق' },
  'weather.calm': { en: 'Calm', fr: 'Calme', ar: 'هادئ' },
  'weather.choppy': { en: 'Choppy', fr: 'Agité', ar: 'متقلب' },
  'weather.stormy': { en: 'Stormy', fr: 'Orageux', ar: 'عاصف' },
  'weather.unknown': { en: 'Unknown', fr: 'Inconnue', ar: 'غير معروف' },

  // the coach is the bar speaking after a trade; coachIntro is read behind "the rules"
  coach: { en: 'Habit coach', fr: 'Coach des habitudes', ar: 'مدرب العادات' },
  coachIntro: {
    en: 'After each trade, a few plain rules look at what you did, not at whether it made money.',
    fr: 'Après chaque opération, quelques règles simples regardent ce que vous avez fait, pas si vous avez gagné.',
    ar: 'بعد كل صفقة، تنظر بعض القواعد البسيطة إلى ما فعلته، لا إلى ما إذا ربحت أو خسرت.',
  },
  coachNone: { en: 'No habit notes on your last trade.', fr: 'Aucune remarque sur votre dernière opération.', ar: 'لا ملاحظات عن العادات في صفقتك الأخيرة.' },
  lastTrade: { en: 'Last trade: {side} {base}', fr: 'Dernière opération : {side} {base}', ar: 'آخر صفقة: {side} {base}' },
  'note.fomo': {
    en: '{base} was up {pct}% in the last 7 days when you bought it. Buying after a big rise is the classic FOMO pattern (fear of missing out). Just worth noticing.',
    fr: '{base} avait pris {pct} % en 7 jours quand vous l’avez acheté. Acheter après une forte hausse, c’est le réflexe classique du FOMO (la peur de rater une occasion). Bon à remarquer.',
    ar: 'كانت {base} قد ارتفعت {pct}% خلال 7 أيام عندما اشتريتها. الشراء بعد صعود كبير هو نمط FOMO المعروف. مجرد ملاحظة.',
  },
  'note.panic': {
    en: 'You sold {base} after it fell {pct}% in 24 hours. Selling during a sharp drop is the common panic pattern. Notice how the fall felt when you decided.',
    fr: 'Vous avez vendu {base} après une baisse de {pct} % en 24 h. Vendre pendant une forte chute, c’est le réflexe classique de la panique. Notez ce que vous avez ressenti en décidant.',
    ar: 'بعت {base} بعد أن انخفضت {pct}% خلال 24 ساعة. البيع أثناء هبوط حاد هو نمط البيع بدافع الذعر المعروف. لاحظ ما شعرت به عندما قررت.',
  },
  'note.concentration': {
    en: '{base} is now {pct}% of your practice wallet. With more than half in one coin, each move of that coin moves your whole wallet.',
    fr: '{base} représente maintenant {pct} % de votre portefeuille fictif. Avec plus de la moitié sur une seule crypto, quand elle bouge, tout votre portefeuille bouge.',
    ar: 'أصبحت {base} تمثل {pct}% من محفظة التدريب. عندما يكون أكثر من النصف في عملة واحدة، تصبح كل حركة لها حركة لمحفظتك كلها.',
  },
  'note.storm': {
    en: 'You bought {base}, a high-risk coin, while the market weather is stormy. High-risk coins usually move the most in storms.',
    fr: 'Vous avez acheté {base}, une crypto à risque élevé, alors que la météo du marché est orageuse. Ce sont souvent elles qui bougent le plus fort dans la tempête.',
    ar: 'اشتريت {base}، وهي عملة ذات مخاطرة عالية، وطقس السوق عاصف. العملات ذات المخاطرة العالية تتحرك عادةً أكثر من غيرها في العواصف.',
  },
  'note.overtrading': {
    en: '{count} trades in 24 hours. You pay the fee and the spread on each one. Buying and selling fast, again and again, is a habit, and the cost adds up.',
    fr: '{count} opérations en 24 h. Vous payez les frais et l’écart à chaque fois. Acheter et vendre vite, encore et encore, est une habitude qui coûte.',
    ar: '{count} صفقات خلال 24 ساعة. كل صفقة تدفع الرسوم والفارق، وكثرة الشراء والبيع السريع عادةٌ تتراكم تكلفتها.',
  },

  cash: { en: 'Cash', fr: 'Argent liquide', ar: 'النقد' },
  ofWallet: { en: '{v}% of wallet', fr: '{v} % du portefeuille', ar: '{v}% من المحفظة' },
  history: { en: 'Your practice trades', fr: 'Vos opérations fictives', ar: 'صفقاتك التجريبية' },
  bought: { en: 'Bought', fr: 'Achat', ar: 'شراء' },
  sold: { en: 'Sold', fr: 'Vente', ar: 'بيع' },

  // the amounts to start over with are the three notes shown after the tap
  reset: { en: 'Start over', fr: 'Recommencer', ar: 'ابدأ من جديد' },
  resetAsk: {
    en: 'This clears your practice wallet and trades on this device. Choose your new starting amount:',
    fr: 'Cela efface votre portefeuille fictif et vos opérations sur cet appareil. Choisissez votre nouveau montant de départ :',
    ar: 'سيمسح هذا محفظة التدريب وصفقاتك على هذا الجهاز. اختر مبلغ البداية الجديد:',
  },
  resetYes: { en: 'Yes, start over', fr: 'Oui, recommencer', ar: 'نعم، ابدأ من جديد' },
  cancel: { en: 'Cancel', fr: 'Annuler', ar: 'إلغاء' },
  resetDone: { en: 'Fresh start: {start} USDT of practice money.', fr: 'Nouveau départ : {start} USDT fictifs.', ar: 'بداية جديدة: {start} USDT من المال التجريبي.' },
  traded: { en: 'Practice trade done.', fr: 'Opération fictive effectuée.', ar: 'تمّت الصفقة التجريبية.' },

  // the tap that opens the rules and how the coach works
  // the first word of the rules below
  rulesOpen: { en: 'The rules', fr: 'Les règles', ar: 'القواعد' },
  rules: {
    en: 'Rules: a 0.1% fee and a 0.05% spread on every trade. 1 USDT minimum. Simple buying and selling only: no borrowed money, no betting on a fall. Prices come from Binance. Your wallet stays on this device. Nothing here is advice.',
    fr: 'Règles : 0,1 % de frais et 0,05 % d’écart à chaque opération. 1 USDT minimum. Achat et vente simples seulement : pas d’argent emprunté, pas de pari sur la baisse. Les prix viennent de Binance. Votre portefeuille reste sur cet appareil. Rien ici n’est un conseil.',
    ar: 'القواعد: رسوم 0.1% وفارق 0.05% على كل صفقة، والحد الأدنى 1 USDT، وتداول فوري فقط (بلا رافعة مالية وبلا بيع على المكشوف). الأسعار من Binance. محفظتك تبقى على هذا الجهاز. لا شيء هنا نصيحة.',
  },
  loading: { en: 'Loading live prices…', fr: 'Chargement des prix…', ar: 'جارٍ تحميل الأسعار الحية…' },
  loadFailed: { en: 'Live prices are unavailable right now. Try again in a minute.', fr: 'Prix indisponibles pour le moment. Réessayez dans une minute.', ar: 'الأسعار الحية غير متوفرة الآن. حاول مرة أخرى بعد دقيقة.' },
  retry: { en: 'Try again', fr: 'Réessayer', ar: 'حاول مرة أخرى' },

  'err.min_trade': { en: 'The smallest practice trade is 1 USDT.', fr: 'La plus petite opération est de 1 USDT.', ar: 'أصغر صفقة تجريبية هي 1 USDT.' },
  'err.insufficient_cash': { en: 'Not enough practice cash for that.', fr: 'Pas assez d’argent fictif.', ar: 'النقد التجريبي لا يكفي لذلك.' },
  'err.no_position': { en: 'You don’t hold this coin in practice.', fr: 'Vous n’avez pas cette crypto.', ar: 'لا تملك هذه العملة في التدريب.' },
  'err.bad_amount': { en: 'Choose an amount.', fr: 'Choisissez un montant.', ar: 'اختر مبلغًا.' },
  'err.unknown_coin': { en: 'This coin isn’t in the practice list.', fr: 'Cette crypto n’est pas dans la liste.', ar: 'هذه العملة ليست في قائمة التدريب.' },
  'err.price_unavailable': { en: 'No live price right now. Try again in a minute.', fr: 'Pas de prix en direct. Réessayez dans une minute.', ar: 'لا يوجد سعر حي الآن. حاول مرة أخرى بعد دقيقة.' },
} satisfies Record<string, Entry>

export type PracticeKey = keyof typeof P

export function usePracticeT() {
  const { lang } = useI18n()
  const tp = (key: PracticeKey, vars?: Record<string, string | number>) => {
    let s: string = P[key][lang]
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
    return s
  }
  const note = (n: CoachNote) => {
    switch (n.id) {
      case 'overtrading':
        return tp('note.overtrading', { count: n.count })
      case 'storm':
        return tp('note.storm', { base: n.base })
      default:
        return tp(`note.${n.id}`, { base: n.base, pct: Math.abs(n.pct) })
    }
  }
  const error = (code: TradeErrorCode | string) =>
    `err.${code}` in P ? tp(`err.${code}` as PracticeKey) : tp('err.price_unavailable')
  return { tp, note, error, lang }
}
