// Strings for the Practice screen, kept apart from lib/i18n.ts so the shared
// table stays small. Coach notes describe what the user just did; none of
// them tells anyone to buy or sell.

import { useI18n } from './i18n'
import type { Lang } from './i18n'
import type { CoachNote, TradeErrorCode } from './practice'

type Entry = Record<Lang, string>

const P = {
  title: { en: 'Practice with $10', fr: 'S’entraîner avec 10 $', ar: 'تدرّب بـ10 دولارات' },
  intro: {
    en: 'A pretend wallet with 10 USDT at live prices. Try trades, see the fees, and learn your own habits before real money is ever involved.',
    fr: 'Un portefeuille fictif de 10 USDT aux prix réels. Essayez des achats et des ventes, voyez les frais et découvrez vos propres réflexes, sans argent réel.',
    ar: 'محفظة تجريبية فيها 10 USDT بالأسعار الحقيقية. جرّب الشراء والبيع، شاهد الرسوم، وتعرّف على عاداتك قبل أي مال حقيقي.',
  },
  sim: { en: 'Simulation, not real money', fr: 'Simulation, pas d’argent réel', ar: 'محاكاة، ليست أموالاً حقيقية' },
  simShort: { en: 'Simulation', fr: 'Simulation', ar: 'محاكاة' },
  balance: { en: 'Practice balance', fr: 'Solde d’entraînement', ar: 'رصيد التدريب' },
  pnl: { en: 'Since you started', fr: 'Depuis le début', ar: 'منذ البداية' },
  startedOn: { en: 'Started {date} with 10 USDT', fr: 'Commencé le {date} avec 10 USDT', ar: 'بدأت في {date} بـ10 USDT' },
  hold: { en: 'If you had just held BTC with your $10', fr: 'Si vous aviez juste gardé du BTC avec vos 10 $', ar: 'لو احتفظت بالبيتكوين بـ10 دولاراتك فقط' },
  holdWaiting: { en: 'Waiting for the BTC price…', fr: 'En attente du prix du BTC…', ar: 'في انتظار سعر البيتكوين…' },
  chartYou: { en: 'Your wallet', fr: 'Votre portefeuille', ar: 'محفظتك' },
  chartHold: { en: 'Just holding BTC', fr: 'Garder du BTC', ar: 'الاحتفاظ بالبيتكوين' },
  chartStart: { en: 'Start: 10 USDT', fr: 'Départ : 10 USDT', ar: 'البداية: 10 USDT' },

  trade: { en: 'Practice trade', fr: 'Opération d’entraînement', ar: 'عملية تدريبية' },
  coin: { en: 'Coin', fr: 'Crypto', ar: 'العملة' },
  buy: { en: 'Buy', fr: 'Acheter', ar: 'شراء' },
  sell: { en: 'Sell', fr: 'Vendre', ar: 'بيع' },
  amount: { en: 'Amount to spend (USDT)', fr: 'Montant à dépenser (USDT)', ar: 'المبلغ (USDT)' },
  max: { en: 'All', fr: 'Tout', ar: 'الكل' },
  sellShare: { en: 'How much of your {base}', fr: 'Quelle part de votre {base}', ar: 'كم من {base} لديك' },
  noneHeld: { en: 'You hold no {base} in practice yet.', fr: 'Vous n’avez pas encore de {base} en entraînement.', ar: 'لا تملك {base} في التدريب بعد.' },
  cashLeft: { en: 'Practice cash', fr: 'Liquidités fictives', ar: 'النقد التجريبي' },
  youGet: { en: 'You get', fr: 'Vous recevez', ar: 'تحصل على' },
  fee: { en: 'Fee (0.1%)', fr: 'Frais (0,1 %)', ar: 'الرسوم (0.1٪)' },
  spread: { en: 'Spread (0.05%)', fr: 'Écart (0,05 %)', ar: 'الفارق (0.05٪)' },
  fillAt: { en: 'Price with spread', fr: 'Prix avec écart', ar: 'السعر مع الفارق' },
  confirmBuy: { en: 'Practice buy', fr: 'Achat fictif', ar: 'شراء تجريبي' },
  confirmSell: { en: 'Practice sell', fr: 'Vente fictive', ar: 'بيع تجريبي' },
  working: { en: 'Placing…', fr: 'En cours…', ar: 'جارٍ التنفيذ…' },
  quoting: { en: 'Checking the live price…', fr: 'Vérification du prix…', ar: 'جارٍ التحقق من السعر…' },
  day7: { en: '7 days', fr: '7 jours', ar: '7 أيام' },
  day1: { en: '24h', fr: '24 h', ar: '24 س' },
  weatherNow: { en: 'Market weather', fr: 'Météo du marché', ar: 'طقس السوق' },
  'weather.calm': { en: 'Calm', fr: 'Calme', ar: 'هادئ' },
  'weather.choppy': { en: 'Choppy', fr: 'Agité', ar: 'متقلّب' },
  'weather.stormy': { en: 'Stormy', fr: 'Orageux', ar: 'عاصف' },
  'weather.unknown': { en: 'Unknown', fr: 'Inconnue', ar: 'غير معروف' },

  coach: { en: 'Habit coach', fr: 'Coach des habitudes', ar: 'مدرّب العادات' },
  coachIntro: {
    en: 'After each trade, a few plain rules look at what you did, not at whether it made money.',
    fr: 'Après chaque opération, quelques règles simples regardent ce que vous avez fait, pas si vous avez gagné.',
    ar: 'بعد كل عملية، تنظر بعض القواعد البسيطة إلى ما فعلته، لا إلى الربح أو الخسارة.',
  },
  coachEmpty: { en: 'Make a practice trade to get your first notes.', fr: 'Faites une opération fictive pour recevoir vos premières remarques.', ar: 'قم بعملية تجريبية لتحصل على أول ملاحظاتك.' },
  coachNone: { en: 'No habit notes on your last trade.', fr: 'Aucune remarque sur votre dernière opération.', ar: 'لا ملاحظات على عمليتك الأخيرة.' },
  lastTrade: { en: 'Last trade: {side} {base}', fr: 'Dernière opération : {side} {base}', ar: 'آخر عملية: {side} {base}' },
  'note.fomo': {
    en: '{base} was up {pct}% over the past 7 days when you bought it. Buying after a big run-up is the classic FOMO pattern. Just worth noticing.',
    fr: '{base} avait pris {pct} % sur 7 jours quand vous l’avez acheté. Acheter après une forte hausse, c’est le schéma classique du FOMO. Bon à remarquer.',
    ar: 'كانت {base} مرتفعة بـ{pct}٪ خلال 7 أيام عندما اشتريتها. الشراء بعد صعود كبير هو نمط FOMO المعروف (الخوف من تفويت الفرصة). مجرد ملاحظة.',
  },
  'note.panic': {
    en: 'You sold {base} after it fell {pct}% in 24 hours. Selling during a sharp drop is the common panic pattern. Notice how the fall felt when you decided.',
    fr: 'Vous avez vendu {base} après une baisse de {pct} % en 24 h. Vendre pendant une forte chute, c’est le schéma classique de la panique. Notez ce que vous avez ressenti en décidant.',
    ar: 'بعت {base} بعد أن انخفضت {pct}٪ خلال 24 ساعة. البيع أثناء هبوط حاد هو نمط الذعر المعروف. لاحظ ما شعرت به لحظة القرار.',
  },
  'note.concentration': {
    en: '{base} is now {pct}% of your practice wallet. With more than half in one coin, its every move becomes your wallet’s move.',
    fr: '{base} représente maintenant {pct} % de votre portefeuille fictif. Avec plus de la moitié sur une seule crypto, chacun de ses mouvements devient celui de votre portefeuille.',
    ar: '{base} أصبحت {pct}٪ من محفظتك التجريبية. عندما يكون أكثر من النصف في عملة واحدة، تصبح كل حركة لها حركةً لمحفظتك كلها.',
  },
  'note.storm': {
    en: 'You bought {base}, a high-risk coin, while the market weather is stormy. High-risk coins usually swing the hardest in storms.',
    fr: 'Vous avez acheté {base}, une crypto à risque élevé, par météo orageuse. Ce sont souvent elles qui bougent le plus fort dans la tempête.',
    ar: 'اشتريت {base}، وهي عملة عالية المخاطرة، والسوق عاصف. العملات عالية المخاطرة تتقلّب عادةً أكثر من غيرها في العواصف.',
  },
  'note.overtrading': {
    en: '{count} trades in 24 hours. Each one pays the fee and the spread, and quick back-and-forth trading is a habit that adds up.',
    fr: '{count} opérations en 24 h. Chacune paie les frais et l’écart, et les allers-retours rapides sont une habitude qui coûte.',
    ar: '{count} عمليات خلال 24 ساعة. كل عملية تدفع الرسوم والفارق، والتداول السريع ذهاباً وإياباً عادة تتراكم كلفتها.',
  },

  positions: { en: 'What you hold', fr: 'Ce que vous détenez', ar: 'ما تملكه' },
  cash: { en: 'Cash', fr: 'Liquidités', ar: 'النقد' },
  ofWallet: { en: '{v}% of wallet', fr: '{v} % du portefeuille', ar: '{v}٪ من المحفظة' },
  noPositions: { en: 'All cash for now.', fr: 'Tout en liquidités pour l’instant.', ar: 'كل الرصيد نقد حالياً.' },
  history: { en: 'Your practice trades', fr: 'Vos opérations fictives', ar: 'عملياتك التجريبية' },
  bought: { en: 'Bought', fr: 'Achat', ar: 'شراء' },
  sold: { en: 'Sold', fr: 'Vente', ar: 'بيع' },

  reset: { en: 'Start over with 10 USDT', fr: 'Recommencer avec 10 USDT', ar: 'ابدأ من جديد بـ10 USDT' },
  resetAsk: {
    en: 'This clears your practice wallet and trades on this device.',
    fr: 'Cela efface votre portefeuille fictif et vos opérations sur cet appareil.',
    ar: 'سيمسح هذا محفظتك التجريبية وعملياتك على هذا الجهاز.',
  },
  resetYes: { en: 'Yes, start over', fr: 'Oui, recommencer', ar: 'نعم، ابدأ من جديد' },
  cancel: { en: 'Cancel', fr: 'Annuler', ar: 'إلغاء' },
  resetDone: { en: 'Fresh start: 10 USDT of practice money.', fr: 'Nouveau départ : 10 USDT fictifs.', ar: 'بداية جديدة: 10 USDT تجريبية.' },
  traded: { en: 'Practice trade done.', fr: 'Opération fictive effectuée.', ar: 'تمت العملية التجريبية.' },

  rules: {
    en: 'Rules: 0.1% fee and a 0.05% spread on every trade, 1 USDT minimum, spot only (no leverage, no shorting). Prices from Binance. Your wallet stays on this device. Nothing here is advice.',
    fr: 'Règles : 0,1 % de frais et 0,05 % d’écart par opération, 1 USDT minimum, au comptant seulement (ni effet de levier, ni vente à découvert). Prix Binance. Votre portefeuille reste sur cet appareil. Rien ici n’est un conseil.',
    ar: 'القواعد: رسوم 0.1٪ وفارق 0.05٪ على كل عملية، الحد الأدنى 1 USDT، تداول فوري فقط (بلا رافعة ولا بيع على المكشوف). الأسعار من Binance. محفظتك تبقى على هذا الجهاز. لا شيء هنا نصيحة.',
  },
  tndNote: { en: 'TND rate: {rate} per USDT', fr: 'Taux TND : {rate} par USDT', ar: 'سعر الدينار: {rate} لكل USDT' },
  tndEstimate: { en: '(estimate)', fr: '(estimation)', ar: '(تقديري)' },
  loading: { en: 'Loading live prices…', fr: 'Chargement des prix…', ar: 'جارٍ تحميل الأسعار…' },
  loadFailed: { en: 'Live prices are unavailable right now. Try again in a minute.', fr: 'Prix indisponibles pour le moment. Réessayez dans une minute.', ar: 'الأسعار غير متاحة الآن. حاول بعد دقيقة.' },
  retry: { en: 'Try again', fr: 'Réessayer', ar: 'أعد المحاولة' },

  'err.min_trade': { en: 'The smallest practice trade is 1 USDT.', fr: 'La plus petite opération est de 1 USDT.', ar: 'أصغر عملية تجريبية هي 1 USDT.' },
  'err.insufficient_cash': { en: 'Not enough practice cash for that.', fr: 'Pas assez de liquidités fictives.', ar: 'النقد التجريبي لا يكفي.' },
  'err.no_position': { en: 'You don’t hold this coin in practice.', fr: 'Vous ne détenez pas cette crypto.', ar: 'لا تملك هذه العملة في التدريب.' },
  'err.bad_amount': { en: 'Choose an amount.', fr: 'Choisissez un montant.', ar: 'اختر مبلغاً.' },
  'err.unknown_coin': { en: 'This coin isn’t in the practice list.', fr: 'Cette crypto n’est pas dans la liste.', ar: 'هذه العملة ليست في قائمة التدريب.' },
  'err.price_unavailable': { en: 'No live price right now. Try again in a minute.', fr: 'Pas de prix en direct. Réessayez dans une minute.', ar: 'لا يوجد سعر مباشر الآن. حاول بعد دقيقة.' },
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
