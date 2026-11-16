// Strings for the Time machine (a past month replayed with pretend money).
// Kept apart from lib/i18n.ts, like the Practice strings. No imports here, so
// the list of Arabic lines can be printed for a read-through outside the app.
//
// Nothing in these lines says what to buy or sell, and none claims that a way
// of trading works: the end screen compares one month with holding Bitcoin and
// with doing nothing, and says so.

type Lang = 'en' | 'fr' | 'ar'
type Entry = Record<Lang, string>

export const R = {
  title: { en: 'Time machine', fr: 'Machine à remonter le temps', ar: 'آلة الزمن' },
  sim: { en: 'Simulation', fr: 'Simulation', ar: 'تجربة' },
  intro: {
    en: 'Play 30 real days from the past in about 4 minutes, with 1000 pretend dollars. The coins’ names and the dates stay hidden until the end.',
    fr: 'Rejouez 30 vrais jours du passé en 4 minutes environ, avec 1000 dollars fictifs. Les noms des cryptos et les dates restent cachés jusqu’à la fin.',
    ar: 'العب 30 نهار حقيقيّين من الماضي في 4 دقايق تقريب، بـ 1000 دولار تجريبية. أسامي الـ coins والتواريخ مخبّيين حتى للآخر.',
  },

  // the card on the Practice screen that leads here
  cardTitle: { en: 'Time machine', fr: 'Machine à remonter le temps', ar: 'آلة الزمن' },
  cardLine: {
    en: 'At live prices, little moves in a day. Here you play a real month of the past in 4 minutes, with 1000 pretend dollars.',
    fr: 'Aux prix en direct, peu de choses bougent en un jour. Ici vous jouez un vrai mois du passé en 4 minutes, avec 1000 dollars fictifs.',
    ar: 'بالسوم الحيّ، في نهار ما يتبدّل كان شويّة. هنا تلعب شهر حقيقي من الماضي في 4 دقايق، بـ 1000 دولار تجريبية.',
  },
  cardButton: { en: 'Try the Time machine', fr: 'Essayer la machine à remonter le temps', ar: 'جرّب آلة الزمن' },

  // choosing a trip
  trip: { en: 'Trip {n}', fr: 'Voyage {n}', ar: 'الرحلة {n}' },
  tripSub: { en: '30 days · 4 hidden coins', fr: '30 jours · 4 cryptos cachées', ar: '30 نهار · 4 coins مخبّيين' },
  start: { en: 'Start', fr: 'Commencer', ar: 'ابدا' },
  resume: { en: 'Continue (day {d} of {n})', fr: 'Continuer (jour {d} sur {n})', ar: 'كمّل (نهار {d} من {n})' },
  again: { en: 'Play again', fr: 'Rejouer', ar: 'عاود العب' },
  lastResult: {
    en: 'Your last result: {you}. Holding Bitcoin: {hold}.',
    fr: 'Votre dernier résultat : {you}. En gardant du Bitcoin : {hold}.',
    ar: 'آخر نتيجة ليك: {you}. كان خلّيت Bitcoin: {hold}.',
  },
  howTitle: { en: 'How it works', fr: 'Comment ça marche', ar: 'كيفاش تخدم' },
  how1: {
    en: 'Each tap on “Next day” moves one real day forward.',
    fr: 'Chaque appui sur « Jour suivant » avance d’un vrai jour.',
    ar: 'كل ضغطة على «النهار الجاي» تقدّم نهار حقيقي.',
  },
  how2: {
    en: 'You buy and sell at that day’s price, with the same fee and spread as the practice wallet.',
    fr: 'Vous achetez et vendez au prix de ce jour-là, avec les mêmes frais et le même écart que le portefeuille fictif.',
    ar: 'تشري وتبيع بسوم النهار هذاكا، بنفس الـ frais والـ spread متاع الـ wallet التجريبي.',
  },
  how3: {
    en: 'Every price starts from 100, so nobody can recognise the coins.',
    fr: 'Tous les prix partent de 100, pour que personne ne reconnaisse les cryptos.',
    ar: 'السوامات الكل يبداو من 100، باش حتى حد ما يعرف الـ coins.',
  },
  notAdvice: {
    en: 'Pretend money, real prices from the past. The past says nothing about what comes next. Nothing here is advice.',
    fr: 'Argent fictif, vrais prix du passé. Le passé ne dit rien de la suite. Rien ici n’est un conseil.',
    ar: 'فلوس تجريبية، وسوامات حقيقية من الماضي. الماضي ما يقول شي على اللي جاي. حتى حاجة هنا موش نصيحة.',
  },
  back: { en: 'Back to the practice wallet', fr: 'Retour au portefeuille fictif', ar: 'ارجع للـ wallet التجريبي' },

  // playing
  day: { en: 'Day {d} of {n}', fr: 'Jour {d} sur {n}', ar: 'نهار {d} من {n}' },
  leave: { en: 'Leave', fr: 'Quitter', ar: 'اخرج' },
  wallet: { en: 'Your wallet', fr: 'Votre portefeuille', ar: 'الـ wallet متاعك' },
  cash: { en: 'Cash', fr: 'Liquidités', ar: 'كاش' },
  sinceStart: { en: 'since the start', fr: 'depuis le départ', ar: 'من البداية' },
  coin: { en: 'Coin {k}', fr: 'Crypto {k}', ar: 'Coin {k}' },
  today: { en: 'today', fr: 'aujourd’hui', ar: 'اليوم' },
  youHold: { en: 'You hold {v}', fr: 'Vous avez {v}', ar: 'عندك {v}' },
  chartNote: {
    en: 'The lines stop at today. The rest of the month is still hidden.',
    fr: 'Les courbes s’arrêtent à aujourd’hui. La suite du mois est encore cachée.',
    ar: 'الخطوط يوقفو في اليوم. باقي الشهر مازال مخبّي.',
  },
  pickCoin: {
    en: 'Tap a coin to buy or sell it. Or go to the next day.',
    fr: 'Touchez une crypto pour l’acheter ou la vendre. Ou passez au jour suivant.',
    ar: 'اضغط على coin باش تشريها ولا تبيعها. ولا تعدّى للنهار الجاي.',
  },
  buyWith: { en: 'Buy with part of your cash', fr: 'Acheter avec une part de vos liquidités', ar: 'اشري بجزء من الكاش متاعك' },
  sellPart: { en: 'Sell what you hold', fr: 'Vendre ce que vous avez', ar: 'بيع اللي عندك' },
  half: { en: 'Half', fr: 'La moitié', ar: 'النصّ' },
  all: { en: 'All', fr: 'Tout', ar: 'الكل' },
  noCash: { en: 'No cash left to buy with.', fr: 'Plus de liquidités pour acheter.', ar: 'ما عادش عندك كاش باش تشري.' },
  bought: {
    en: 'Bought {qty} of Coin {k} at {price}. Fee and spread: {cost}.',
    fr: 'Acheté {qty} de Crypto {k} à {price}. Frais et écart : {cost}.',
    ar: 'شريت {qty} من Coin {k} بسوم {price}. الـ frais والـ spread: {cost}.',
  },
  sold: {
    en: 'Sold {qty} of Coin {k} at {price}. Fee and spread: {cost}.',
    fr: 'Vendu {qty} de Crypto {k} à {price}. Frais et écart : {cost}.',
    ar: 'بعت {qty} من Coin {k} بسوم {price}. الـ frais والـ spread: {cost}.',
  },
  next: { en: 'Next day', fr: 'Jour suivant', ar: 'النهار الجاي' },
  skip: { en: '+5 days', fr: '+5 jours', ar: 'قدّم 5 أيّام' },
  seeResult: { en: 'See my result', fr: 'Voir mon résultat', ar: 'شوف النتيجة متاعي' },

  // the end
  endTitle: { en: 'Your 30 days are over', fr: 'Vos 30 jours sont finis', ar: '30 نهار متاعك وفاو' },
  youEnded: { en: 'You ended with', fr: 'Vous finissez avec', ar: 'كمّلت بـ' },
  holdBtc: { en: 'Simply holding Bitcoin', fr: 'En gardant simplement du Bitcoin', ar: 'كان خلّيت Bitcoin برك' },
  stayCash: { en: 'Doing nothing (all cash)', fr: 'Sans rien faire (tout en liquidités)', ar: 'كان ما عملت شي (الكل كاش)' },
  below: {
    en: 'You ended {v} below simply holding Bitcoin.',
    fr: 'Vous finissez {v} en dessous de « garder du Bitcoin ».',
    ar: 'كمّلت بـ {v} أقل من اللي خلّى Bitcoin برك.',
  },
  above: {
    en: 'You ended {v} above simply holding Bitcoin.',
    fr: 'Vous finissez {v} au-dessus de « garder du Bitcoin ».',
    ar: 'كمّلت بـ {v} أكثر من اللي خلّى Bitcoin برك.',
  },
  oneMonth: {
    en: 'This is one month. In another month the same choices can give the opposite result.',
    fr: 'C’est un seul mois. Un autre mois, les mêmes choix peuvent donner le résultat inverse.',
    ar: 'هذا شهر واحد. في شهر آخر، نفس الاختيارات تنجّم تعطي العكس.',
  },
  counting: { en: 'Counting your result…', fr: 'Calcul de votre résultat…', ar: 'نحسبو في النتيجة متاعك…' },
  revealFailed: {
    en: 'Could not load the names and the Bitcoin line. Check your connection.',
    fr: 'Impossible de charger les noms et la ligne Bitcoin. Vérifiez votre connexion.',
    ar: 'ما نجّمناش نجيبو الأسامي وخطّ الـ Bitcoin. شوف الكونكسيون متاعك.',
  },
  retry: { en: 'Try again', fr: 'Réessayer', ar: 'عاود' },
  chartYou: { en: 'You', fr: 'Vous', ar: 'إنت' },
  chartHold: { en: 'Holding Bitcoin', fr: 'Garder du Bitcoin', ar: 'كان خلّيت Bitcoin' },
  chartStart: { en: 'Start: 1000', fr: 'Départ : 1000', ar: 'البداية: 1000' },

  revealTitle: { en: 'What it was', fr: 'Ce que c’était', ar: 'شنوّة كان' },
  revealMoves: {
    en: 'What each coin was, and how its price moved in the 30 days:',
    fr: 'Ce qu’était chaque crypto, et l’évolution de son prix sur les 30 jours :',
    ar: 'كل coin شنوّة كانت، وقدّاش تبدّل السوم متاعها في 30 نهار:',
  },
  revealDates: { en: 'From {from} to {to}', fr: 'Du {from} au {to}', ar: 'من {from} لـ {to}' },
  'event.ftx': {
    en: 'FTX, one of the largest crypto exchanges in the world, collapsed in a few days in November 2022. Its customers could no longer withdraw their money, and prices fell across the market. About ten days earlier, Dogecoin had doubled in a few days when Elon Musk bought Twitter.',
    fr: 'FTX, l’une des plus grandes plateformes crypto au monde, s’est effondrée en quelques jours en novembre 2022. Ses clients ne pouvaient plus retirer leur argent, et les prix ont chuté sur tout le marché. Une dizaine de jours plus tôt, le Dogecoin avait doublé en quelques jours quand Elon Musk a racheté Twitter.',
    ar: 'FTX، وحدة من أكبر منصّات الـ crypto في العالم، طاحت في أيّامات في نوفمبر 2022. الحرفاء متاعها ما عادش نجّمو يسحبو فلوسهم، والسوامات طاحت في السوق الكل. عشرة أيّام قبل تقريب، الـ Dogecoin تضاعف في أيّامات وقت اللي Elon Musk شرى Twitter.',
  },
  'event.rally24': {
    en: 'After the United States election of 5 November 2024, almost the whole crypto market rose for a month, and Bitcoin came close to 100,000 dollars for the first time.',
    fr: 'Après l’élection américaine du 5 novembre 2024, presque tout le marché crypto a monté pendant un mois, et le Bitcoin s’est approché des 100 000 dollars pour la première fois.',
    ar: 'بعد الانتخابات الأمريكية نهار 5 نوفمبر 2024، سوق الـ crypto تقريب الكل طلع شهر كامل، والـ Bitcoin قرّب لـ 100000 دولار لأوّل مرّة.',
  },
  coinWas: {
    en: 'Coin {k} was {name}: {pct}',
    fr: 'Crypto {k}, c’était {name} : {pct}',
    ar: 'Coin {k} كانت {name}: {pct}',
  },

  didTitle: { en: 'What you did', fr: 'Ce que vous avez fait', ar: 'شنوّة عملت' },
  tradesLine: {
    en: 'You made {n} trades. Fees and spread took {cost}.',
    fr: 'Vous avez fait {n} opérations. Les frais et l’écart ont pris {cost}.',
    ar: 'عملت {n} عمليات. الـ frais والـ spread خذاو {cost}.',
  },
  oneTrade: {
    en: 'You made 1 trade. Fee and spread took {cost}.',
    fr: 'Vous avez fait 1 opération. Les frais et l’écart ont pris {cost}.',
    ar: 'عملت عملية وحدة. الـ frais والـ spread خذاو {cost}.',
  },
  noTrades: {
    en: 'You made no trade: your 1000 dollars stayed in cash.',
    fr: 'Vous n’avez fait aucune opération : vos 1000 dollars sont restés en liquidités.',
    ar: 'ما عملت حتى عملية: الـ 1000 دولار متاعك قعدو كاش.',
  },
  'note.fomo': {
    en: 'Day {day}: you bought {name} after it had risen {pct}% in 7 days. Buying after a big run-up is the classic FOMO pattern.',
    fr: 'Jour {day} : vous avez acheté {name} après une hausse de {pct} % en 7 jours. Acheter après une forte hausse, c’est le schéma classique du FOMO.',
    ar: 'نهار {day}: شريت {name} بعد ما طلعت {pct}% في 7 أيّام. الشراية بعد طلعة كبيرة هي الـ FOMO الكلاسيكي.',
  },
  'note.panic': {
    en: 'Day {day}: you sold {name} on the day it fell {pct}%. Selling during a sharp drop is the common panic pattern.',
    fr: 'Jour {day} : vous avez vendu {name} le jour où elle a perdu {pct} %. Vendre pendant une forte chute, c’est le schéma classique de la panique.',
    ar: 'نهار {day}: بعت {name} في النهار اللي طاحت فيه {pct}%. البيع وقت طيحة قويّة هو البيع بالخوف المعروف.',
  },
  'note.concentration': {
    en: 'Day {day}: {name} became {pct}% of your wallet. With more than half in one coin, its every move becomes your wallet’s move.',
    fr: 'Jour {day} : {name} est passée à {pct} % de votre portefeuille. Avec plus de la moitié sur une seule crypto, chacun de ses mouvements devient celui de votre portefeuille.',
    ar: 'نهار {day}: {name} ولّات {pct}% من الـ wallet متاعك. كي يكون أكثر من النصّ في coin وحدة، كل حركة فيها تولّي حركة للـ wallet الكل.',
  },
  'note.overtrading': {
    en: 'Day {day}: {count} trades in one day. Each one pays the fee and the spread.',
    fr: 'Jour {day} : {count} opérations en un jour. Chacune paie les frais et l’écart.',
    ar: 'نهار {day}: {count} عمليات في نهار واحد. كل وحدة تخلّص الـ frais والـ spread.',
  },
  noNotes: { en: 'No habit notes on this trip.', fr: 'Aucune remarque sur ce voyage.', ar: 'حتى ملاحظة على الرحلة هاذي.' },
  lesson: { en: 'The lesson about this', fr: 'La leçon sur ce sujet', ar: 'الدرس على الموضوع هذا' },

  share: { en: 'Send my result', fr: 'Envoyer mon résultat', ar: 'ابعث النتيجة متاعي' },
  shareText: {
    en: 'I ended with {you} dollars out of 1000 in Qirat’s Time machine. Simply holding Bitcoin gave {hold}. Can you beat me?',
    fr: 'J’ai fini avec {you} dollars sur 1000 dans la machine à remonter le temps de Qirat. Garder du Bitcoin donnait {hold}. Tu fais mieux ?',
    ar: 'كمّلت بـ {you} دولار من 1000 في آلة الزمن متاع Qirat. اللي خلّى Bitcoin برك كمّل بـ {hold}. تنجّم تغلبني؟',
  },
  copied: { en: '✓ Copied', fr: '✓ Copié', ar: '✓ تنسخ' },
  otherTrip: { en: 'Play the other trip', fr: 'Jouer l’autre voyage', ar: 'العب الرحلة الأخرى' },
} satisfies Record<string, Entry>

export type ReplayKey = keyof typeof R
