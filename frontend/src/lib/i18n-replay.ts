// Strings for the Time machine (a past month replayed with pretend money).
// Kept apart from lib/i18n.ts, like the Practice strings. No imports here, so
// the list of Arabic lines can be printed for a read-through outside the app.
//
// Nothing in these lines says what to buy or sell, and none claims that a way
// of trading works: the end screen compares one month with holding Bitcoin and
// with doing nothing, and says so.
//
// [[double brackets]] put words on the gold marker (components/brand/Caption).
// The Arabic is light Arabic (simple Modern Standard Arabic for readers in every
// Arab country, since 20 Nov 2026), not Tunisian Darija. Lines marked CHECK-AR
// need a native read. Lines no screen shows any more are kept where they were.

type Lang = 'en' | 'fr' | 'ar'
type Entry = Record<Lang, string>

export const R = {
  title: { en: 'Time machine', fr: 'Machine à remonter le temps', ar: 'آلة الزمن' },
  sim: { en: 'Simulation', fr: 'Simulation', ar: 'تجربة' },
  intro: {
    en: 'Play 30 real days from the past in about 4 minutes, with 1000 pretend dollars. The coins’ names and the dates stay hidden until the end.',
    fr: 'Rejouez 30 vrais jours du passé en 4 minutes environ, avec 1000 dollars fictifs. Les noms des cryptos et les dates restent cachés jusqu’à la fin.',
    ar: 'العب 30 يومًا حقيقيًا من الماضي في حوالي 4 دقائق، بـ 1000 دولار تجريبية. أسماء العملات والتواريخ تبقى مخفية حتى النهاية.',
  },

  // the card on the Practice screen that leads here
  cardTitle: { en: 'Time machine', fr: 'Machine à remonter le temps', ar: 'آلة الزمن' },
  cardLine: {
    en: 'With live prices, not much moves in one day. Here you play a real month of the past in 4 minutes, with 1000 pretend dollars.',
    fr: 'Aux prix en direct, peu de choses bougent en un jour. Ici vous jouez un vrai mois du passé en 4 minutes, avec 1000 dollars fictifs.',
    ar: 'بالأسعار الحية، لا يتغير الكثير في يوم واحد. هنا تلعب شهرًا حقيقيًا من الماضي في 4 دقائق، بـ 1000 دولار تجريبية.',
  },
  cardButton: { en: 'Try the Time machine', fr: 'Essayer la machine à remonter le temps', ar: 'جرّب آلة الزمن' },

  // choosing a trip
  // its words come from the card's line above
  pickCap: {
    en: 'A real month from the past.\n[[1000 pretend dollars]].',
    fr: 'Un vrai mois du passé.\n[[1000 dollars fictifs]].',
    ar: 'شهر حقيقي من الماضي.\n[[1000 دولار]] تجريبية.',
  },
  // the second sentence of `intro`, said by the gold bar
  secret: {
    en: 'The coins’ names and the dates stay hidden until the end.',
    fr: 'Les noms des cryptos et les dates restent cachés jusqu’à la fin.',
    ar: 'أسماء العملات والتواريخ تبقى مخفية حتى النهاية.',
  },
  trip: { en: 'Trip {n}', fr: 'Voyage {n}', ar: 'الرحلة {n}' },
  tripSub: { en: '30 days, 4 hidden coins', fr: '30 jours, 4 cryptos cachées', ar: '30 يومًا، 4 عملات مخفية' },
  start: { en: 'Start', fr: 'Commencer', ar: 'ابدأ' },
  // `resume` without the day, which is written above the button
  resumeGo: { en: 'Continue', fr: 'Continuer', ar: 'تابع' },
  resume: { en: 'Continue (day {d} of {n})', fr: 'Continuer (jour {d} sur {n})', ar: 'تابع (اليوم {d} من {n})' },
  again: { en: 'Play again', fr: 'Rejouer', ar: 'العب مرة أخرى' },
  lastResult: {
    en: 'Your last result: {you}. Holding Bitcoin: {hold}.',
    fr: 'Votre dernier résultat : {you}. En gardant du Bitcoin : {hold}.',
    ar: 'نتيجتك الأخيرة: {you}. لو احتفظت بـ Bitcoin: {hold}.',
  },
  howTitle: { en: 'How it works', fr: 'Comment ça marche', ar: 'كيف تعمل' },
  how1: {
    en: 'Each tap on “Next day” moves one real day forward.',
    fr: 'Chaque appui sur « Jour suivant » avance d’un vrai jour.',
    ar: 'كل ضغطة على «اليوم التالي» تنقلك يومًا حقيقيًا إلى الأمام.',
  },
  how2: {
    en: 'You buy and sell at that day’s price, with the same fee and spread as the practice wallet.',
    fr: 'Vous achetez et vendez au prix de ce jour-là, avec les mêmes frais et le même écart que le portefeuille fictif.',
    ar: 'تشتري وتبيع بسعر ذلك اليوم، بنفس الرسوم والفارق (spread) كما في محفظة التدريب.',
  },
  how3: {
    en: 'Every price starts from 100, so nobody can tell which coins they are.',
    fr: 'Tous les prix partent de 100, pour que personne ne reconnaisse les cryptos.',
    ar: 'كل الأسعار تبدأ من 100، حتى لا يتعرّف أحد على العملات.',
  },
  notAdvice: {
    en: 'Pretend money, real prices from the past. The past says nothing about what comes next. Nothing here is advice.',
    fr: 'Argent fictif, vrais prix du passé. Le passé ne dit rien de la suite. Rien ici n’est un conseil.',
    ar: 'مال تجريبي وأسعار حقيقية من الماضي. الماضي لا يخبرك بشيء عمّا سيأتي. لا شيء هنا نصيحة.',
  },
  back: { en: 'Back to the practice wallet', fr: 'Retour au portefeuille fictif', ar: 'العودة إلى محفظة التدريب' },

  // playing
  day: { en: 'Day {d} of {n}', fr: 'Jour {d} sur {n}', ar: 'اليوم {d} من {n}' },
  leave: { en: 'Leave', fr: 'Quitter', ar: 'اخرج' },
  wallet: { en: 'Your wallet', fr: 'Votre portefeuille', ar: 'محفظتك' },
  cash: { en: 'Cash', fr: 'Argent liquide', ar: 'النقد' },
  sinceStart: { en: 'since the start', fr: 'depuis le départ', ar: 'من البداية' },
  coin: { en: 'Coin {k}', fr: 'Crypto {k}', ar: 'العملة {k}' },
  today: { en: 'today', fr: 'aujourd’hui', ar: 'اليوم' },
  youHold: { en: 'You hold {v}', fr: 'Vous avez {v}', ar: 'لديك {v}' },
  chartNote: {
    en: 'The lines stop at today. The rest of the month is still hidden.',
    fr: 'Les courbes s’arrêtent à aujourd’hui. La suite du mois est encore cachée.',
    ar: 'تتوقف الخطوط عند اليوم. بقية الشهر ما زالت مخفية.',
  },
  pickCoin: {
    en: 'Tap a coin to buy or sell it.',
    fr: 'Touchez une crypto pour l’acheter ou la vendre.',
    ar: 'اضغط على عملة لتشتريها أو تبيعها.',
  },
  // what the gold bar says on a day when one coin moved a lot: the fact, nothing more
  rose: { en: 'Coin {k} rose {pct}% today.', fr: 'Crypto {k} a pris {pct} % aujourd’hui.', ar: 'ارتفعت العملة {k} بنسبة {pct}% اليوم.' },
  fell: { en: 'Coin {k} fell {pct}% today.', fr: 'Crypto {k} a perdu {pct} % aujourd’hui.', ar: 'انخفضت العملة {k} بنسبة {pct}% اليوم.' },
  buyWith: { en: 'Buy with part of your cash', fr: 'Acheter avec une part de votre argent', ar: 'اشترِ بجزء من نقدك' },
  sellPart: { en: 'Sell what you hold', fr: 'Vendre ce que vous avez', ar: 'بِع ما لديك' },
  half: { en: 'Half', fr: 'La moitié', ar: 'النصف' },
  all: { en: 'All', fr: 'Tout', ar: 'كل ما لديك' },
  noCash: { en: 'No cash left to buy with.', fr: 'Plus d’argent pour acheter.', ar: 'لم يبقَ لديك نقد للشراء.' },
  bought: {
    en: 'Bought {qty} of Coin {k} at {price}. Fee and spread: {cost}.',
    fr: 'Acheté {qty} de Crypto {k} à {price}. Frais et écart : {cost}.',
    ar: 'اشتريت {qty} من العملة {k} بسعر {price}. الرسوم والفارق: {cost}.',
  },
  sold: {
    en: 'Sold {qty} of Coin {k} at {price}. Fee and spread: {cost}.',
    fr: 'Vendu {qty} de Crypto {k} à {price}. Frais et écart : {cost}.',
    ar: 'بعت {qty} من العملة {k} بسعر {price}. الرسوم والفارق: {cost}.',
  },
  next: { en: 'Next day', fr: 'Jour suivant', ar: 'اليوم التالي' },
  skip: { en: '+5 days', fr: '+5 jours', ar: 'تقدّم 5 أيام' },
  seeResult: { en: 'See my result', fr: 'Voir mon résultat', ar: 'شاهد نتيجتي' },

  // the end
  // the brackets put "30 days" on the gold marker
  endTitle: { en: 'Your [[30 days]] are over', fr: 'Vos [[30 jours]] sont finis', ar: 'انتهت [[أيامك الـ 30]]' },
  youEnded: { en: 'You ended with', fr: 'Vous finissez avec', ar: 'أنهيت الشهر بـ' },
  holdBtc: { en: 'Simply holding Bitcoin', fr: 'En gardant simplement du Bitcoin', ar: 'لو احتفظت بـ Bitcoin فقط' },
  stayCash: { en: 'Doing nothing (all cash)', fr: 'Sans rien faire (tout en argent liquide)', ar: 'لو لم تفعل شيئًا (كل المال نقدًا)' },
  below: {
    en: 'You ended {v} below simply holding Bitcoin.',
    fr: 'Vous finissez {v} en dessous de « garder du Bitcoin ».',
    ar: 'أنهيت الشهر أقل بـ {v} من مجرد الاحتفاظ بـ Bitcoin.',
  },
  above: {
    en: 'You ended {v} above simply holding Bitcoin.',
    fr: 'Vous finissez {v} au-dessus de « garder du Bitcoin ».',
    ar: 'أنهيت الشهر أعلى بـ {v} من مجرد الاحتفاظ بـ Bitcoin.',
  },
  oneMonth: {
    en: 'This is one month. In another month the same choices can give the opposite result.',
    fr: 'C’est un seul mois. Un autre mois, les mêmes choix peuvent donner le résultat inverse.',
    ar: 'هذا شهر واحد. في شهر آخر، قد تعطي الاختيارات نفسها النتيجة المعاكسة.',
  },
  counting: { en: 'Counting your result…', fr: 'Calcul de votre résultat…', ar: 'جارٍ حساب نتيجتك…' },
  revealFailed: {
    en: 'Could not load the names and the Bitcoin line. Check your connection.',
    fr: 'Impossible de charger les noms et la ligne Bitcoin. Vérifiez votre connexion.',
    ar: 'تعذّر تحميل الأسماء وخط Bitcoin. تحقّق من اتصالك.',
  },
  retry: { en: 'Try again', fr: 'Réessayer', ar: 'حاول مرة أخرى' },
  chartYou: { en: 'You', fr: 'Vous', ar: 'أنت' },
  chartHold: { en: 'Holding Bitcoin', fr: 'Garder du Bitcoin', ar: 'لو احتفظت بـ Bitcoin' },
  chartStart: { en: 'Start: 1000', fr: 'Départ : 1000', ar: 'البداية: 1000' },

  revealTitle: { en: 'What it was', fr: 'Ce que c’était', ar: 'ماذا كانت العملات' },
  revealMoves: {
    en: 'What each coin was, and how its price moved in the 30 days:',
    fr: 'Ce qu’était chaque crypto, et comment son prix a bougé sur les 30 jours :',
    ar: 'ماذا كانت كل عملة، وكيف تحرّك سعرها خلال 30 يومًا:',
  },
  revealDates: { en: 'From {from} to {to}', fr: 'Du {from} au {to}', ar: 'من {from} إلى {to}' },
  // the tap that opens the story of that month
  eventOpen: { en: 'What happened that month', fr: 'Ce qui s’est passé ce mois-là', ar: 'ماذا حدث في ذلك الشهر' },
  'event.ftx': {
    en: 'FTX, one of the biggest crypto exchanges in the world, collapsed in a few days in November 2022. Its customers could no longer take out their money, and prices fell across the market. About ten days earlier, Dogecoin had doubled in a few days when Elon Musk bought Twitter.',
    fr: 'FTX, l’une des plus grandes plateformes crypto au monde, s’est effondrée en quelques jours en novembre 2022. Ses clients ne pouvaient plus retirer leur argent, et les prix ont chuté sur tout le marché. Une dizaine de jours plus tôt, le Dogecoin avait doublé en quelques jours quand Elon Musk a racheté Twitter.',
    ar: 'FTX، إحدى أكبر منصات العملات الرقمية في العالم، انهارت في أيام قليلة في نوفمبر 2022. لم يعد عملاؤها قادرين على سحب أموالهم، وانخفضت الأسعار في السوق كله. وقبل ذلك بنحو عشرة أيام، تضاعف سعر Dogecoin في أيام قليلة عندما اشترى Elon Musk شركة Twitter.',
  },
  'event.rally24': {
    en: 'After the United States election of 5 November 2024, almost the whole crypto market rose for a month, and Bitcoin came close to 100,000 dollars for the first time.',
    fr: 'Après l’élection américaine du 5 novembre 2024, presque tout le marché crypto a monté pendant un mois, et le Bitcoin s’est approché des 100 000 dollars pour la première fois.',
    ar: 'بعد الانتخابات الأمريكية في 5 نوفمبر 2024، ارتفع سوق العملات الرقمية كله تقريبًا لمدة شهر، واقترب Bitcoin من 100000 دولار لأول مرة.',
  },
  coinWas: {
    en: 'Coin {k} was {name}: {pct}',
    fr: 'Crypto {k}, c’était {name} : {pct}',
    ar: 'العملة {k} كانت {name}: {pct}',
  },

  didTitle: { en: 'What you did', fr: 'Ce que vous avez fait', ar: 'ماذا فعلت' },
  tradesLine: {
    en: 'You made {n} trades. Fees and spread took {cost}.',
    fr: 'Vous avez fait {n} opérations. Les frais et l’écart ont pris {cost}.',
    ar: 'عدد صفقاتك: {n}. وأخذت الرسوم والفارق {cost}.',
  },
  oneTrade: {
    en: 'You made 1 trade. Fee and spread took {cost}.',
    fr: 'Vous avez fait 1 opération. Les frais et l’écart ont pris {cost}.',
    ar: 'قمت بصفقة واحدة. وأخذت الرسوم والفارق {cost}.',
  },
  noTrades: {
    en: 'You made no trade: your 1000 dollars stayed in cash.',
    fr: 'Vous n’avez fait aucune opération : vos 1000 dollars sont restés en argent liquide.',
    ar: 'لم تقم بأي صفقة: بقيت دولاراتك الـ 1000 نقدًا.',
  },
  'note.fomo': {
    en: 'Day {day}: you bought {name} after it had risen {pct}% in 7 days. Buying after a big rise is the classic FOMO pattern (fear of missing out).',
    fr: 'Jour {day} : vous avez acheté {name} après une hausse de {pct} % en 7 jours. Acheter après une forte hausse, c’est le réflexe classique du FOMO (la peur de rater une occasion).',
    ar: 'اليوم {day}: اشتريت {name} بعد أن ارتفعت {pct}% خلال 7 أيام. الشراء بعد صعود كبير هو نمط FOMO المعروف.',
  },
  'note.panic': {
    en: 'Day {day}: you sold {name} on the day it fell {pct}%. Selling during a sharp drop is the common panic pattern.',
    fr: 'Jour {day} : vous avez vendu {name} le jour où elle a perdu {pct} %. Vendre pendant une forte chute, c’est le réflexe classique de la panique.',
    ar: 'اليوم {day}: بعت {name} في اليوم الذي انخفضت فيه {pct}%. البيع أثناء هبوط حاد هو نمط البيع بدافع الذعر المعروف.',
  },
  'note.concentration': {
    en: 'Day {day}: {name} became {pct}% of your wallet. With more than half in one coin, each move of that coin moves your whole wallet.',
    fr: 'Jour {day} : {name} est passée à {pct} % de votre portefeuille. Avec plus de la moitié sur une seule crypto, quand elle bouge, tout votre portefeuille bouge.',
    ar: 'اليوم {day}: أصبحت {name} تمثل {pct}% من محفظتك. عندما يكون أكثر من النصف في عملة واحدة، تصبح كل حركة لها حركة لمحفظتك كلها.',
  },
  'note.overtrading': {
    en: 'Day {day}: {count} trades in one day. You pay the fee and the spread on each one.',
    fr: 'Jour {day} : {count} opérations en un jour. Vous payez les frais et l’écart à chaque fois.',
    ar: 'اليوم {day}: {count} صفقات في يوم واحد. كل صفقة تدفع الرسوم والفارق.',
  },
  noNotes: { en: 'No habit notes on this trip.', fr: 'Aucune remarque sur ce voyage.', ar: 'لا ملاحظات عن العادات في هذه الرحلة.' },
  lesson: { en: 'The lesson about this', fr: 'La leçon sur ce sujet', ar: 'الدرس حول هذا الموضوع' },

  share: { en: 'Send my result', fr: 'Envoyer mon résultat', ar: 'أرسل نتيجتي' },
  shareText: {
    en: 'I ended with {you} dollars out of 1000 in Qirat’s Time machine. Simply holding Bitcoin gave {hold}. Can you beat me?',
    fr: 'J’ai fini avec {you} dollars sur 1000 dans la machine à remonter le temps de Qirat. Garder du Bitcoin donnait {hold}. Tu fais mieux ?',
    ar: 'أنهيت الشهر بـ {you} دولار من أصل 1000 في آلة الزمن في قيراط. الاحتفاظ بـ Bitcoin فقط أعطى {hold}. هل تستطيع أن تتفوق عليّ؟',
  },
  copied: { en: '✓ Copied', fr: '✓ Copié', ar: '✓ تم النسخ' },
  otherTrip: { en: 'Play the other trip', fr: 'Jouer l’autre voyage', ar: 'العب الرحلة الأخرى' },
} satisfies Record<string, Entry>

export type ReplayKey = keyof typeof R
