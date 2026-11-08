// Strings for the Practice screen, kept apart from lib/i18n.ts so the shared
// table stays small. Coach notes describe what the user just did; none of
// them tells anyone to buy or sell.

import { useI18n } from './i18n'
import type { Lang } from './i18n'
import type { CoachNote, TradeErrorCode } from './practice'

type Entry = Record<Lang, string>

const P = {
  title: { en: 'Practice with $10', fr: 'S’entraîner avec 10 $', ar: 'تدرّب بـ 10 دولار' },
  intro: {
    en: 'A pretend wallet with 10 USDT at live prices. Try trades, see the fees, and learn your own habits before real money is ever involved.',
    fr: 'Un portefeuille fictif de 10 USDT aux prix réels. Essayez des achats et des ventes, voyez les frais et découvrez vos propres réflexes, sans argent réel.',
    ar: 'wallet تجريبي فيه 10 USDT بالسوامات الحقيقية. جرّب تشري وتبيع، شوف الـ frais، واعرف العادات متاعك قبل ما تحطّ فلوس حقيقية.',
  },
  sim: { en: 'Simulation, not real money', fr: 'Simulation, pas d’argent réel', ar: 'تجربة، موش فلوس حقيقية' },
  simShort: { en: 'Simulation', fr: 'Simulation', ar: 'تجربة' },
  balance: { en: 'Practice balance', fr: 'Solde d’entraînement', ar: 'رصيد التدريب' },
  pnl: { en: 'Since you started', fr: 'Depuis le début', ar: 'من وقت ما بديت' },
  startedOn: { en: 'Started {date} with 10 USDT', fr: 'Commencé le {date} avec 10 USDT', ar: 'بديت نهار {date} بـ 10 USDT' },
  hold: { en: 'If you had just held BTC with your $10', fr: 'Si vous aviez juste gardé du BTC avec vos 10 $', ar: 'كان خلّيت Bitcoin بالـ 10 دولار متاعك برك' },
  holdWaiting: { en: 'Waiting for the BTC price…', fr: 'En attente du prix du BTC…', ar: 'نستنّاو في سوم Bitcoin…' },
  chartYou: { en: 'Your wallet', fr: 'Votre portefeuille', ar: 'الـ wallet متاعك' },
  chartHold: { en: 'Just holding BTC', fr: 'Garder du BTC', ar: 'كان خلّيت Bitcoin' },
  chartStart: { en: 'Start: 10 USDT', fr: 'Départ : 10 USDT', ar: 'البداية: 10 USDT' },

  trade: { en: 'Practice trade', fr: 'Opération d’entraînement', ar: 'عملية تدريب' },
  coin: { en: 'Coin', fr: 'Crypto', ar: 'الـ coin' },
  buy: { en: 'Buy', fr: 'Acheter', ar: 'شري' },
  sell: { en: 'Sell', fr: 'Vendre', ar: 'بيع' },
  amount: { en: 'Amount to spend (USDT)', fr: 'Montant à dépenser (USDT)', ar: 'قدّاش تحب تصرف (USDT)' },
  max: { en: 'All', fr: 'Tout', ar: 'الكل' },
  sellShare: { en: 'How much of your {base}', fr: 'Quelle part de votre {base}', ar: 'قدّاش من {base} متاعك' },
  noneHeld: { en: 'You hold no {base} in practice yet.', fr: 'Vous n’avez pas encore de {base} en entraînement.', ar: 'ما عندكش {base} في التدريب توّا.' },
  cashLeft: { en: 'Practice cash', fr: 'Liquidités fictives', ar: 'الكاش التجريبي' },
  youGet: { en: 'You get', fr: 'Vous recevez', ar: 'باش تاخذ' },
  fee: { en: 'Fee (0.1%)', fr: 'Frais (0,1 %)', ar: 'الـ frais (0.1%)' },
  spread: { en: 'Spread (0.05%)', fr: 'Écart (0,05 %)', ar: 'الـ spread (0.05%)' },
  fillAt: { en: 'Price with spread', fr: 'Prix avec écart', ar: 'السوم مع الـ spread' },
  confirmBuy: { en: 'Practice buy', fr: 'Achat fictif', ar: 'شراية تجريبية' },
  confirmSell: { en: 'Practice sell', fr: 'Vente fictive', ar: 'بيعة تجريبية' },
  working: { en: 'Placing…', fr: 'En cours…', ar: 'نعدّيو…' },
  quoting: { en: 'Checking the live price…', fr: 'Vérification du prix…', ar: 'نثبّتو في السوم الحيّ…' },
  day7: { en: '7 days', fr: '7 jours', ar: '7 أيام' },
  day1: { en: '24h', fr: '24 h', ar: '24 ساعة' },
  weatherNow: { en: 'Market weather', fr: 'Météo du marché', ar: 'طقس السوق' },
  'weather.calm': { en: 'Calm', fr: 'Calme', ar: 'صاحي' },
  'weather.choppy': { en: 'Choppy', fr: 'Agité', ar: 'مغيّم' },
  'weather.stormy': { en: 'Stormy', fr: 'Orageux', ar: 'خايب' },
  'weather.unknown': { en: 'Unknown', fr: 'Inconnue', ar: 'موش معروف' },

  coach: { en: 'Habit coach', fr: 'Coach des habitudes', ar: 'كوتش العادات' },
  coachIntro: {
    en: 'After each trade, a few plain rules look at what you did, not at whether it made money.',
    fr: 'Après chaque opération, quelques règles simples regardent ce que vous avez fait, pas si vous avez gagné.',
    ar: 'بعد كل عملية، شويّة قواعد ساهلة يشوفو شنوّة عملت، موش إذا ربحت ولا خسرت.',
  },
  coachEmpty: { en: 'Make a practice trade to get your first notes.', fr: 'Faites une opération fictive pour recevoir vos premières remarques.', ar: 'اعمل عملية تجريبية باش تاخذ أوّل ملاحظات.' },
  coachNone: { en: 'No habit notes on your last trade.', fr: 'Aucune remarque sur votre dernière opération.', ar: 'حتى ملاحظة على آخر عملية.' },
  lastTrade: { en: 'Last trade: {side} {base}', fr: 'Dernière opération : {side} {base}', ar: 'آخر عملية: {side} {base}' },
  'note.fomo': {
    en: '{base} was up {pct}% over the past 7 days when you bought it. Buying after a big run-up is the classic FOMO pattern. Just worth noticing.',
    fr: '{base} avait pris {pct} % sur 7 jours quand vous l’avez acheté. Acheter après une forte hausse, c’est le schéma classique du FOMO. Bon à remarquer.',
    ar: '{base} كانت طالعة بـ {pct}% في 7 أيّام وقت اللي شريتها. الشراية بعد طلعة كبيرة هي الـ FOMO الكلاسيكي. ملاحظة برك.',
  },
  'note.panic': {
    en: 'You sold {base} after it fell {pct}% in 24 hours. Selling during a sharp drop is the common panic pattern. Notice how the fall felt when you decided.',
    fr: 'Vous avez vendu {base} après une baisse de {pct} % en 24 h. Vendre pendant une forte chute, c’est le schéma classique de la panique. Notez ce que vous avez ressenti en décidant.',
    ar: 'بعت {base} بعد ما طاحت {pct}% في 24 ساعة. البيع وقت طيحة قويّة هو البيع بالخوف المعروف. لاحظ شنوّة حسّيت وقت القرار.',
  },
  'note.concentration': {
    en: '{base} is now {pct}% of your practice wallet. With more than half in one coin, its every move becomes your wallet’s move.',
    fr: '{base} représente maintenant {pct} % de votre portefeuille fictif. Avec plus de la moitié sur une seule crypto, chacun de ses mouvements devient celui de votre portefeuille.',
    ar: '{base} ولّات {pct}% من الـ wallet التجريبي متاعك. كي يكون أكثر من النصّ في coin وحدة، كل حركة فيها تولّي حركة للـ wallet الكل.',
  },
  'note.storm': {
    en: 'You bought {base}, a high-risk coin, while the market weather is stormy. High-risk coins usually swing the hardest in storms.',
    fr: 'Vous avez acheté {base}, une crypto à risque élevé, par météo orageuse. Ce sont souvent elles qui bougent le plus fort dans la tempête.',
    ar: 'شريت {base}، coin الـ risk متاعها عالي، والطقس خايب. الـ coins اللي الـ risk متاعهم عالي عادةً يتحرّكو أكثر في الطقس الخايب.',
  },
  'note.overtrading': {
    en: '{count} trades in 24 hours. Each one pays the fee and the spread, and quick back-and-forth trading is a habit that adds up.',
    fr: '{count} opérations en 24 h. Chacune paie les frais et l’écart, et les allers-retours rapides sont une habitude qui coûte.',
    ar: '{count} عمليات في 24 ساعة. كل وحدة تخلّص الـ frais والـ spread، والشراية والبيع فيسع فيسع عادة تكلفتها تكبر.',
  },

  positions: { en: 'What you hold', fr: 'Ce que vous détenez', ar: 'اللي عندك' },
  cash: { en: 'Cash', fr: 'Liquidités', ar: 'كاش' },
  ofWallet: { en: '{v}% of wallet', fr: '{v} % du portefeuille', ar: '{v}% من الـ wallet' },
  noPositions: { en: 'All cash for now.', fr: 'Tout en liquidités pour l’instant.', ar: 'الكل كاش توّا.' },
  history: { en: 'Your practice trades', fr: 'Vos opérations fictives', ar: 'العمليات التجريبية متاعك' },
  bought: { en: 'Bought', fr: 'Achat', ar: 'شريت' },
  sold: { en: 'Sold', fr: 'Vente', ar: 'بعت' },

  reset: { en: 'Start over with 10 USDT', fr: 'Recommencer avec 10 USDT', ar: 'عاود من الأوّل بـ 10 USDT' },
  resetAsk: {
    en: 'This clears your practice wallet and trades on this device.',
    fr: 'Cela efface votre portefeuille fictif et vos opérations sur cet appareil.',
    ar: 'هذا يفسخ الـ wallet التجريبي والعمليات متاعك في الجهاز هذا.',
  },
  resetYes: { en: 'Yes, start over', fr: 'Oui, recommencer', ar: 'إيه، عاود من الأوّل' },
  cancel: { en: 'Cancel', fr: 'Annuler', ar: 'بطّل' },
  resetDone: { en: 'Fresh start: 10 USDT of practice money.', fr: 'Nouveau départ : 10 USDT fictifs.', ar: 'بداية جديدة: 10 USDT متاع تدريب.' },
  traded: { en: 'Practice trade done.', fr: 'Opération fictive effectuée.', ar: 'العملية التجريبية تعدّات.' },

  rules: {
    en: 'Rules: 0.1% fee and a 0.05% spread on every trade, 1 USDT minimum, spot only (no leverage, no shorting). Prices from Binance. Your wallet stays on this device. Nothing here is advice.',
    fr: 'Règles : 0,1 % de frais et 0,05 % d’écart par opération, 1 USDT minimum, au comptant seulement (ni effet de levier, ni vente à découvert). Prix Binance. Votre portefeuille reste sur cet appareil. Rien ici n’est un conseil.',
    ar: 'القواعد: frais 0.1% وspread 0.05% على كل عملية، أقل حاجة 1 USDT، spot برك (بلا leverage وبلا short). السوامات من Binance. الـ wallet متاعك يقعد في الجهاز هذا. حتى حاجة هنا موش نصيحة.',
  },
  tndNote: { en: 'TND rate: {rate} per USDT', fr: 'Taux TND : {rate} par USDT', ar: 'سوم الدينار: {rate} لكل USDT' },
  tndEstimate: { en: '(estimate)', fr: '(estimation)', ar: '(تقريبي)' },
  loading: { en: 'Loading live prices…', fr: 'Chargement des prix…', ar: 'نجيبو في السوامات…' },
  loadFailed: { en: 'Live prices are unavailable right now. Try again in a minute.', fr: 'Prix indisponibles pour le moment. Réessayez dans une minute.', ar: 'السوامات موش متوفّرة توّا. عاود بعد دقيقة.' },
  retry: { en: 'Try again', fr: 'Réessayer', ar: 'عاود' },

  'err.min_trade': { en: 'The smallest practice trade is 1 USDT.', fr: 'La plus petite opération est de 1 USDT.', ar: 'أصغر عملية تجريبية هي 1 USDT.' },
  'err.insufficient_cash': { en: 'Not enough practice cash for that.', fr: 'Pas assez de liquidités fictives.', ar: 'الكاش التجريبي ما يكفيش.' },
  'err.no_position': { en: 'You don’t hold this coin in practice.', fr: 'Vous ne détenez pas cette crypto.', ar: 'ما عندكش الـ coin هاذي في التدريب.' },
  'err.bad_amount': { en: 'Choose an amount.', fr: 'Choisissez un montant.', ar: 'اختار مبلغ.' },
  'err.unknown_coin': { en: 'This coin isn’t in the practice list.', fr: 'Cette crypto n’est pas dans la liste.', ar: 'الـ coin هاذي موش في ليستة التدريب.' },
  'err.price_unavailable': { en: 'No live price right now. Try again in a minute.', fr: 'Pas de prix en direct. Réessayez dans une minute.', ar: 'ما فمّاش سوم حيّ توّا. عاود بعد دقيقة.' },
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
