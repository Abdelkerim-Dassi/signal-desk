import { createContext, useContext } from 'react'
import { learnPath } from './route'
import { arrive, inTunisia } from './source'

export type Lang = 'en' | 'fr' | 'ar'
export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'ar', label: 'العربية', short: 'ع' },
]

type Entry = Record<Lang, string>

// UI strings. {name} placeholders are filled by t(key, vars).
const UI = {
  'app.tagline': { en: 'Every coin has a karat', fr: 'Chaque crypto a son carat', ar: 'لكل عملة قيراطها' },
  'nav.today': { en: 'Today', fr: "Aujourd'hui", ar: 'اليوم' },
  'nav.record': { en: 'Past results', fr: 'Historique', ar: 'السجل' },
  'nav.portfolio': { en: 'Portfolio', fr: 'Portefeuille', ar: 'محفظتي' },
  'nav.practice': { en: 'Practice', fr: 'Pratique', ar: 'تدريب' },
  'nav.learn': { en: 'Learn', fr: 'Apprendre', ar: 'تعلّم' },
  'nav.more': { en: 'More', fr: 'Plus', ar: 'المزيد' },
  'nav.home': { en: 'Home', fr: 'Accueil', ar: 'الرئيسية' },
  'top.help': { en: 'How Qirat works', fr: 'Comment marche Qirat', ar: 'كيف يعمل قيراط' },
  'top.theme': { en: 'Switch light / dark', fr: 'Thème clair / sombre', ar: 'فاتح / غامق' },
  'top.language': { en: 'Language', fr: 'Langue', ar: 'اللغة' },

  'hero.on.title': { en: 'The market is in good shape', fr: 'Le marché va bien', ar: 'السوق في حالة جيدة' },
  'hero.off.title': { en: 'Time to be careful', fr: 'Prudence sur le marché', ar: 'السوق يدعو إلى الحذر' },
  'hero.unknown.title': { en: 'Reading the market…', fr: 'Lecture du marché…', ar: 'جارٍ قراءة السوق…' },
  'hero.on.body': {
    en: 'Bitcoin is {pct} above its average price over 200 days, so Strong ratings are on.',
    fr: 'Le bitcoin est {pct} au-dessus de son prix moyen sur 200 jours : les notes « Forte » sont possibles.',
    ar: 'Bitcoin فوق متوسطه لـ 200 يوم بنسبة {pct}، لذلك التقييمات القوية مفعّلة.',
  },
  'hero.off.body': {
    en: 'Bitcoin is {pct} below its average price over 200 days, so no score goes above 66 and no coin is rated Strong.',
    fr: 'Le bitcoin est {pct} sous son prix moyen sur 200 jours : aucun score ne dépasse 66, aucune note « Forte ».',
    ar: 'Bitcoin تحت متوسطه لـ 200 يوم بنسبة {pct}، لذلك كل الدرجات محدودة عند 66 ولا يصل أي تقييم إلى «قوي».',
  },
  'hero.why': {
    en: 'In our test on 2021–26 prices, Strong coins only beat the market while Bitcoin stayed above this line.',
    fr: 'Dans notre test sur les prix de 2021–26, les notes Fortes ne battaient le marché que si le bitcoin restait au-dessus de cette ligne.',
    ar: 'في اختبارنا على بيانات 2021–26، لم تتفوّق التقييمات القوية على السوق إلا حين بقي Bitcoin فوق هذا الخط.',
  },
  'hero.mood': { en: 'Market mood', fr: 'Humeur du marché', ar: 'مزاج السوق' },
  'hero.mcap': { en: 'Total market', fr: 'Marché total', ar: 'السوق كله' },
  'hero.btcDom': { en: 'Bitcoin’s share', fr: 'Part du bitcoin', ar: 'حصّة Bitcoin' },
  'hero.updated': { en: 'Updated {time}', fr: 'Mis à jour à {time}', ar: 'آخر تحديث {time}' },
  'hero.refreshing': { en: 'Refreshing…', fr: 'Mise à jour…', ar: 'جارٍ التحديث…' },
  'hero.failed': { en: 'Update failed, retrying soon', fr: 'La mise à jour a échoué, nouvel essai bientôt', ar: 'فشل التحديث، سنعيد المحاولة قريبًا' },
  'hero.refresh': { en: 'Refresh', fr: 'Mettre à jour', ar: 'حدّث' },
  'hero.24h': { en: '24h', fr: '24 h', ar: '24 ساعة' },

  // Captions: the word inside [[double brackets]] sits on the gold marker.
  'weather.calm.title': { en: 'The market is [[calm]]', fr: 'Le marché est [[calme]]', ar: 'السوق [[هادئ]]' },
  'weather.choppy.title': { en: 'The market is [[choppy]]', fr: 'Le marché est [[agité]]', ar: 'السوق [[متقلّب]]' },
  'weather.stormy.title': { en: 'The market is [[stormy]]', fr: 'Le marché est [[orageux]]', ar: 'السوق [[عاصف]]' },
  'weather.calm.body': {
    en: 'Bitcoin is {pct} above its average price over 50 days, and buyers are not too excited.',
    fr: 'Le bitcoin est {pct} au-dessus de son prix moyen sur 50 jours, et les acheteurs ne s’emballent pas.',
    ar: 'Bitcoin فوق متوسطه لـ 50 يومًا بنسبة {pct}، والمتداولون ليسوا في حماس مفرط.',
  },
  'weather.choppy.dip': {
    en: 'Bitcoin fell {pct} below its 50-day average but is still above its 200-day average. Expect bigger moves than usual.',
    fr: 'Le bitcoin est passé {pct} sous sa moyenne sur 50 jours, mais reste au-dessus de celle sur 200 jours. Attendez-vous à de plus gros mouvements.',
    ar: 'نزل Bitcoin تحت متوسطه لـ 50 يومًا بنسبة {pct}، لكنه ما زال فوق خط الـ 200 يوم. توقّع تقلبات أكبر من المعتاد.',
  },
  'weather.choppy.hot': {
    en: 'Bitcoin is above its 50-day average, but buyers are too excited ({why}). A drop gets more likely.',
    fr: 'Le bitcoin est au-dessus de sa moyenne sur 50 jours, mais les acheteurs s’emballent ({why}). Une baisse devient plus probable.',
    ar: 'Bitcoin فوق متوسطه لـ 50 يومًا، لكن المتداولين في حماس مفرط ({why}). التراجعات تصبح أكثر احتمالًا.',
  },
  'weather.stormy.body': {
    en: 'Bitcoin is below both its 50-day and 200-day averages. In storms most coins fall, even 24K ones.',
    fr: 'Le bitcoin est sous ses moyennes sur 50 et sur 200 jours. Dans l’orage, la plupart des cryptos baissent, même les 24K.',
    ar: 'Bitcoin تحت متوسطه لـ 50 يومًا ولـ 200 يوم. في العاصفة تهبط أغلب العملات، حتى عملات 24K.',
  },
  'weather.hot.greed': { en: 'extreme greed', fr: 'avidité extrême', ar: 'طمع شديد' },
  'weather.hot.funding': { en: 'many buying with borrowed money', fr: 'beaucoup achètent avec de l’argent emprunté', ar: 'كثيرون يشترون بالرافعة المالية' },
  'weather.why': {
    en: 'Since 2021, months that began with Bitcoin above its 50-day average went clearly better than the others.',
    fr: 'Depuis 2021, les mois qui commencent avec le bitcoin au-dessus de sa moyenne sur 50 jours se passent nettement mieux.',
    ar: 'منذ 2021، كانت الأشهر التي بدأت وBitcoin فوق متوسطه لـ 50 يومًا أفضل بوضوح من غيرها.',
  },
  // the tap that opens weather.why
  'weather.whyAsk': { en: 'Why?', fr: 'Pourquoi ?', ar: 'لماذا؟' },

  'karat.label': { en: '{k}K', fr: '{k}K', ar: '{k} قيراط' },
  'karat.none': { en: 'New', fr: 'Nouveau', ar: 'جديدة' },
  'karat.title': { en: 'Why {k}K', fr: 'Pourquoi {k}K', ar: 'لماذا {k} قيراط' },
  'karat.trend': { en: '90-day trend', fr: 'Tendance 90 jours', ar: 'الاتجاه خلال 90 يومًا' },
  'karat.trendSub': {
    en: 'Stronger than {n}% of the top coins',
    fr: 'Plus forte que {n} % des grandes cryptos',
    ar: 'أقوى من {n}% من العملات الكبرى',
  },
  'karat.calm': { en: 'Calm', fr: 'Calme', ar: 'الهدوء' },
  'karat.calmSub': {
    en: 'Calmer than {n}% of the top coins',
    fr: 'Plus calme que {n} % des grandes cryptos',
    ar: 'أهدأ من {n}% من العملات الكبرى',
  },
  'karat.perDay': { en: '±{v}% a day', fr: '±{v} % par jour', ar: '±{v}% في اليوم' },
  // The scale, shown as a 24K plate and a 10K plate with these words beside them.
  'karat.top': { en: 'calm and rising', fr: 'calme et en hausse', ar: 'هادئة وصاعدة' },
  'karat.bottom': { en: 'wild or falling', fr: 'agitée ou en baisse', ar: 'متقلّبة أو هابطة' },
  'karat.compare': {
    en: 'Karats compare coins with each other: in a stormy market even 24K coins usually fall.',
    fr: 'Les carats comparent les cryptos entre elles : dans un marché orageux, même les 24K baissent souvent.',
    ar: 'القيراط يقارن العملات ببعضها: في سوق عاصف تهبط عادةً حتى عملات 24K.',
  },
  'karat.young': {
    en: 'Too new for a karat: it needs 3 months of history.',
    fr: 'Trop récente pour un carat : il faut 3 mois de prix.',
    ar: 'جديدة جدًا لتأخذ قيراطًا: تحتاج إلى 3 أشهر من البيانات.',
  },
  // "Low" is relative to other coins: even the calmest crypto swings far more
  // than savings or gold, so the label says so.
  'risk.low': { en: 'Low risk for crypto', fr: 'Risque faible pour une crypto', ar: 'مخاطرة منخفضة بين العملات الرقمية' },
  'risk.medium': { en: 'Medium risk', fr: 'Risque moyen', ar: 'مخاطرة متوسطة' },
  'risk.high': { en: 'High risk', fr: 'Risque élevé', ar: 'مخاطرة عالية' },
  'risk.title': { en: 'If it goes wrong', fr: 'Si ça tourne mal', ar: 'إذا ساءت الأمور' },
  'risk.learn': {
    en: 'What is a rough month? 2-minute lesson',
    fr: 'C’est quoi un mauvais mois ? Leçon de 2 min',
    ar: 'ما هو الشهر الصعب؟ درس في دقيقتين',
  },
  'risk.day': { en: 'A typical day', fr: 'Une journée normale', ar: 'يوم عادي' },
  'risk.month': { en: 'A rough month (1 in 20)', fr: 'Un mauvais mois (1 sur 20)', ar: 'شهر صعب (مرة كل 20 شهرًا)' },
  'risk.money': {
    en: 'On $100, a rough month could cost about ${v}.',
    fr: 'Sur 100 $, un mauvais mois pourrait coûter environ {v} $.',
    ar: 'على 100 دولار، قد يكلّفك شهر صعب حوالي {v} دولار.',
  },
  'risk.note': {
    en: 'These are past moves, not a forecast. Risk is the most reliable part of the grade. "Low" means low next to other coins: crypto still moves much more than savings or gold.',
    fr: 'Ce sont des mouvements passés, pas une prévision. Le risque est la partie la plus fiable de la note. « Faible » veut dire faible par rapport aux autres cryptos : une crypto bouge toujours beaucoup plus qu’une épargne ou que l’or.',
    ar: 'هذه حركات سابقة، وليست توقعًا. المخاطرة هي الجزء الأكثر موثوقية في التقييم. «منخفضة» تعني مقارنةً بالعملات الأخرى: العملات الرقمية تتحرك دائمًا أكثر بكثير من الادخار أو الذهب.',
  },

  'coins.title': { en: 'Your coins', fr: 'Vos cryptos', ar: 'عملاتك' },
  'coins.edit': { en: 'Edit list', fr: 'Modifier', ar: 'عدّل القائمة' },
  'coins.done': { en: 'Done', fr: 'Terminé', ar: 'تم' },
  'coins.add': { en: 'Add', fr: 'Ajouter', ar: 'أضف' },
  'coins.addPlaceholder': { en: 'Add a coin, e.g. SOL', fr: 'Ajouter une crypto, ex. SOL', ar: 'أضف عملة، مثلًا SOL' },
  'coins.popular': { en: 'Popular', fr: 'Populaires', ar: 'الأشهر' },
  'coins.remove': { en: 'Remove {coin}', fr: 'Retirer {coin}', ar: 'احذف {coin}' },
  'coins.loading': { en: 'Grading your coins…', fr: 'Évaluation de vos cryptos…', ar: 'جارٍ تقييم عملاتك…' },
  'coins.empty': { en: 'Add a coin to see its score.', fr: 'Ajoutez une crypto pour voir son score.', ar: 'أضف عملة لترى درجتها.' },
  'coins.notFound': {
    en: 'Not found on Binance: {list}. Remove it from your list.',
    fr: 'Introuvable sur Binance : {list}. Retirez-la de votre liste.',
    ar: 'غير موجودة على Binance: {list}. احذفها من قائمتك.',
  },
  'coins.unknown': {
    en: 'We couldn’t find “{coin}” on Binance. Check the short name, e.g. SOL.',
    fr: 'Impossible de trouver « {coin} » sur Binance. Vérifiez le nom court, ex. SOL.',
    ar: 'لم نجد «{coin}» على Binance. تحقّق من الرمز، مثلًا SOL.',
  },
  'coins.checking': { en: 'Checking…', fr: 'Vérification…', ar: 'جارٍ التحقق…' },
  'coins.search': { en: 'Search a coin: BTC, Solana…', fr: 'Chercher une crypto : BTC, Solana…', ar: 'ابحث عن عملة: BTC، Solana…' },
  'coins.noMatch': {
    en: 'No coin matching “{q}” on Binance.',
    fr: 'Aucune crypto « {q} » sur Binance.',
    ar: 'لا توجد عملة تطابق «{q}» على Binance.',
  },
  'coins.added': { en: 'Added', fr: 'Ajoutée', ar: 'أُضيفت' },

  'coin.today': { en: 'today', fr: "aujourd'hui", ar: 'اليوم' },
  'coin.7d': { en: '7 days', fr: '7 jours', ar: '7 أيام' },
  'chart.title': { en: '30 days, one candle per day', fr: '30 jours, une bougie par jour', ar: '30 يومًا، شمعة لكل يوم' },
  'chart.legend': {
    en: 'Green: the price ended the day higher than it started. Red: lower. Thin line: the day’s highest and lowest price. Tap a candle to see that day.',
    fr: 'Vert : le prix a fini la journée plus haut qu’au début. Rouge : plus bas. Trait fin : le prix le plus haut et le plus bas du jour. Touchez une bougie pour voir ce jour.',
    ar: 'الأخضر: أغلق اليوم أعلى مما افتتح. الأحمر: أغلق أدنى. الخط الرفيع: أعلى وأدنى سعر في اليوم. انقر على شمعة لترى ذلك اليوم.',
  },
  'chart.open': { en: 'Open', fr: 'Ouverture', ar: 'افتتاح' },
  'chart.high': { en: 'High', fr: 'Haut', ar: 'أعلى' },
  'chart.low': { en: 'Low', fr: 'Bas', ar: 'أدنى' },
  'chart.close': { en: 'Close', fr: 'Clôture', ar: 'إغلاق' },
  'coin.why': { en: 'Why this score', fr: 'Pourquoi ce score', ar: 'لماذا هذه الدرجة' },
  'coin.base': { en: 'Starting point', fr: 'Point de départ', ar: 'نقطة البداية' },
  'coin.score': { en: 'Score', fr: 'Score', ar: 'الدرجة' },
  'coin.cap': { en: 'Limit (careful market)', fr: 'Limite (marché fragile)', ar: 'الحد الأقصى وقت الحذر' },
  'coin.beforeCap': { en: 'before the limit: {n}', fr: 'avant la limite : {n}', ar: 'قبل الحد: {n}' },
  'coin.helps': { en: 'What helps', fr: 'Ce qui aide', ar: 'ما يساعدها' },
  'coin.watch': { en: 'Watch out', fr: 'Attention', ar: 'انتبه إلى' },
  'coin.risk': { en: 'Risk', fr: 'Risque', ar: 'المخاطرة' },
  'coin.capped': { en: 'Limited · careful market', fr: 'Limité · marché fragile', ar: 'محدودة · وقت الحذر' },
  'coin.notAdvice': {
    en: "A rating describes the coin's chart, not what you should do with your money.",
    fr: 'Une note décrit le graphique de la crypto, pas ce que vous devez faire de votre argent.',
    ar: 'التقييم يصف الرسم البياني للعملة، لا ما يجب أن تفعله بمالك.',
  },
  'coin.details': { en: 'Show details', fr: 'Voir le détail', ar: 'اعرض التفاصيل' },

  'moves.title': { en: "What's moving", fr: 'Ce qui bouge', ar: 'ما الذي يتحرك' },
  'moves.more': { en: 'More headlines', fr: 'Plus de titres', ar: 'أخبار أخرى' },
  'moves.trending': { en: 'Trending searches', fr: 'Recherches tendance', ar: 'الأكثر بحثاً' },

  'record.title': { en: 'Past results', fr: 'Historique', ar: 'السجل' },
  'record.sub': {
    en: 'Every rating is saved, losses included.',
    fr: 'Chaque note est enregistrée, pertes comprises.',
    ar: 'كل تقييم مسجّل، بما في ذلك الخسائر.',
  },
  'record.live': { en: 'Live log', fr: 'Journal en direct', ar: 'السجل المباشر' },
  'record.backtest': { en: 'Test on 2021–26 prices', fr: 'Test sur les prix 2021–26', ar: 'اختبار 2021–26' },
  'record.7d': { en: '7 days', fr: '7 jours', ar: '7 أيام' },
  'record.30d': { en: '30 days', fr: '30 jours', ar: '30 يوماً' },
  'record.rating': { en: 'Rating', fr: 'Note', ar: 'التقييم' },
  'record.avg': { en: 'Average gain', fr: 'Gain moyen', ar: 'متوسط العائد' },
  'record.median': { en: 'Middle value', fr: 'Valeur du milieu', ar: 'الوسيط' },
  'record.up': { en: '% up', fr: '% en hausse', ar: '% صاعدة' },
  'record.calls': { en: 'Ratings', fr: 'Notes', ar: 'تقييمات' },
  'record.allCoins': { en: 'All coins', fr: 'Toutes', ar: 'كل العملات' },
  'record.headline': {
    en: 'Coins rated Strong gained {strong} on average in the next {days}, against {all} for all coins. But only {hit}% of them went up: they won bigger, not more often.',
    fr: 'Les cryptos notées Fortes ont gagné {strong} en moyenne dans les {days} suivants, contre {all} pour toutes les cryptos. Mais seules {hit} % ont monté : elles ont gagné plus gros, pas plus souvent.',
    ar: 'حققت العملات المصنّفة قوية عائداً متوسطه {strong} خلال {days} التالية، مقابل {all} لكل العملات. لكن {hit}٪ منها فقط ارتفعت: الأفضلية تأتي من مكاسب أكبر وليس أكثر تكراراً.',
  },
  'record.scope': {
    en: '{days} coin-days · {coins} coins · {from}–{to}',
    fr: '{days} jours-crypto · {coins} cryptos · {from}–{to}',
    ar: '{days} يوم-عملة · {coins} عملة · {from}–{to}',
  },
  'record.byYear': { en: 'Strong ratings by year', fr: 'Notes Fortes par année', ar: 'التقييمات القوية حسب السنة' },
  'record.noCalls': { en: 'none', fr: 'aucune', ar: 'لا يوجد' },
  'record.allShort': { en: 'all {v}', fr: 'toutes {v}', ar: 'الكل {v}' },
  'record.noCallsNote': {
    en: '"None" means Bitcoin stayed below its 200-day average all year, so the careful-market limit kept every coin out of Strong.',
    fr: '« Aucune » veut dire que le bitcoin est resté sous sa moyenne sur 200 jours toute l’année : la limite a empêché toute note Forte.',
    ar: '«لا يوجد» يعني أن البيتكوين بقي طوال العام تحت متوسطه لـ200 يوم، فمنع الحدّ أي تقييم قوي.',
  },
  'record.caveats': { en: 'Read before trusting this', fr: 'À lire avant de s’y fier', ar: 'اقرأ قبل أن تثق بهذا' },
  'record.liveIntro': {
    en: 'Every day we rate the same {n} coins and save the result once. We never edit it. Gains are worked out from the saved prices, losses included. Saving since {date} · {days} day(s) so far.',
    fr: 'Chaque jour, nous notons les mêmes {n} cryptos et enregistrons le résultat une seule fois, sans jamais le modifier. Les gains sont calculés avec les prix enregistrés, pertes comprises. Depuis le {date} · {days} jour(s).',
    ar: 'كل يوم تُقيَّم نفس الـ{n} عملة ويُحفظ الناتج مرة واحدة دون أي تعديل. تُحسب العوائد من الأسعار المحفوظة، بما في ذلك الخسائر. منذ {date} · {days} يوم حتى الآن.',
  },
  'record.firstResults': {
    en: 'The first 7-day results come on {date}. Until then, the test on past prices shows how these same rules did in 2021–26.',
    fr: 'Premiers résultats à 7 jours le {date}. D’ici là, le test sur les prix passés montre ce qu’ont donné ces règles en 2021–26.',
    ar: 'تصل أول نتائج لـ7 أيام في {date}. حتى ذلك الحين، يعرض الاختبار التاريخي أداء هذه القواعد نفسها في 2021–26.',
  },
  'record.todayCalls': { en: "Today's ratings", fr: 'Notes du jour', ar: 'تقييمات اليوم' },
  'record.resolved': { en: 'Ratings from {date}, {n} days later', fr: 'Notes du {date}, {n} jours après', ar: 'تقييمات {date} بعد {n} أيام' },
  'record.loading': { en: 'Loading the record…', fr: 'Chargement…', ar: 'جارٍ التحميل…' },
  'record.none': { en: 'Nothing logged yet.', fr: 'Rien d’enregistré pour l’instant.', ar: 'لا شيء مسجّل بعد.' },

  // the bubble on every screen (AskBubble.tsx)
  'ask.fab': { en: 'Ask me', fr: 'Une question ?', ar: 'اسألني' },
  'ask.title': { en: 'Ask Qirat', fr: 'Demandez à Qirat', ar: 'اسأل قيراط' },
  'ask.intro': {
    en: 'Ask me anything about crypto, trading or this page. I explain in simple words. I never tell you what to buy or sell.',
    fr: 'Posez-moi une question sur la crypto, le trading ou cette page. J’explique avec des mots simples. Je ne vous dis jamais quoi acheter ou vendre.',
    ar: 'اسألني أي سؤال عن العملات الرقمية أو التداول أو هذه الصفحة. أشرح لك بكلمات بسيطة. ولا أقول لك أبدًا ماذا تشتري أو تبيع.',
  },
  'ask.placeholder': { en: 'Type your question…', fr: 'Votre question…', ar: 'اكتب سؤالك…' },
  'ask.send': { en: 'Send', fr: 'Envoyer', ar: 'أرسل' },
  'ask.close': { en: 'Close', fr: 'Fermer', ar: 'إغلاق' },
  'ask.reset': { en: 'Start over', fr: 'Recommencer', ar: 'ابدأ من جديد' },
  'ask.error': {
    en: 'I could not answer just now. Please try again in a minute.',
    fr: 'Je n’ai pas pu répondre. Réessayez dans une minute.',
    ar: 'لم أستطع الإجابة الآن. حاول مرة أخرى بعد دقيقة.',
  },
  // suggested questions: one for the page you are on, then two for any page
  'ask.sLesson': { en: 'Explain this lesson in simpler words', fr: 'Expliquer cette leçon plus simplement', ar: 'اشرح هذا الدرس بكلمات أبسط' },
  'ask.sPractice': { en: 'How do I make my first practice trade?', fr: 'Comment faire mon premier achat pour m’entraîner ?', ar: 'كيف أقوم بأول صفقة تجريبية؟' },
  'ask.sReplay': { en: 'What is the Time machine for?', fr: 'À quoi sert la Machine à remonter le temps ?', ar: 'ما فائدة آلة الزمن؟' },
  'ask.sCoin': { en: 'Why does {coin} have this karat?', fr: 'Pourquoi {coin} a-t-il ce carat ?', ar: 'لماذا حصلت {coin} على هذا القيراط؟' },
  'ask.sStart': { en: 'Where should a beginner start?', fr: 'Par où commencer quand on débute ?', ar: 'من أين يبدأ المبتدئ؟' },
  'ask.sBitcoin': { en: 'What is Bitcoin, simply?', fr: 'C’est quoi le bitcoin, en simple ?', ar: 'ما هو Bitcoin ببساطة؟' },
  'ask.sRisk': { en: 'Is the market risky today?', fr: 'Le marché est-il risqué aujourd’hui ?', ar: 'هل السوق خطير اليوم؟' },

  'pf.title': { en: 'What you [[own]]', fr: 'Ce que vous [[avez]]', ar: 'العملات التي [[تملكها]]' },
  'pf.intro': {
    en: 'Saved only on this device.',
    fr: 'Enregistré uniquement sur cet appareil.',
    ar: 'محفوظ على هذا الجهاز فقط.',
  },
  'pf.coin': { en: 'Coin', fr: 'Crypto', ar: 'العملة' },
  'pf.amount': { en: 'Amount', fr: 'Quantité', ar: 'الكمية' },
  'pf.avg': { en: 'Average buy price', fr: 'Prix d’achat moyen', ar: 'متوسط سعر الشراء' },
  'pf.value': { en: 'Value', fr: 'Valeur', ar: 'القيمة' },
  'pf.pnl': { en: 'Profit / loss', fr: 'Gain / perte', ar: 'الربح / الخسارة' },
  'pf.total': { en: 'Total value', fr: 'Valeur totale', ar: 'القيمة الإجمالية' },
  'pf.add': { en: 'Add a coin you own', fr: 'Ajouter une crypto', ar: 'أضف عملة تملكها' },
  'pf.remove': { en: 'Remove', fr: 'Retirer', ar: 'احذف' },
  'pf.empty': {
    en: 'Add what you own to see its value and profit.',
    fr: 'Ajoutez ce que vous possédez pour voir sa valeur et vos gains.',
    ar: 'أضف ما تملكه لترى قيمته وربحك.',
  },
  'pf.source': { en: 'Market data', fr: 'Données de marché', ar: 'بيانات السوق' },
  'pf.quote': { en: 'Priced in', fr: 'Prix en', ar: 'السعر بـ' },
  'pf.alerts': { en: 'Send to my channels', fr: 'Envoyer sur mes canaux', ar: 'أرسل إلى قنواتي' },
  'pf.alertsIntro': {
    en: 'Send what you see now to a Discord or WhatsApp channel you set up.',
    fr: 'Envoyez ce que vous voyez maintenant vers un canal Discord ou WhatsApp déjà réglé.',
    ar: 'أرسل الصورة الحالية إلى قناة Discord أو WhatsApp مُعدّة مسبقًا.',
  },
  'pf.ready': { en: 'ready', fr: 'prêt', ar: 'جاهز' },
  'pf.notSet': { en: 'not set up', fr: 'non configuré', ar: 'غير مُعدّ' },
  'pf.send': { en: 'Send update', fr: 'Envoyer', ar: 'أرسل التحديث' },
  'pf.sending': { en: 'Sending…', fr: 'Envoi…', ar: 'جارٍ الإرسال…' },
  'pf.pickChannel': { en: 'Pick at least one channel.', fr: 'Choisissez au moins un canal.', ar: 'اختر قناة واحدة على الأقل.' },
  'pf.sent': { en: 'Sent to {n} channel(s).', fr: 'Envoyé à {n} canal(aux).', ar: 'أُرسل إلى {n} قناة.' },
  'pf.noChannel': { en: 'No channel is configured yet.', fr: 'Aucun canal n’est configuré.', ar: 'لا توجد قناة مُعدّة بعد.' },

  'foot.disclaimer': {
    en: 'Free during the test period. Grades follow fixed rules, the same for everyone. Not financial advice.',
    fr: 'Gratuit pendant la période de test. Les notes suivent des règles fixes, les mêmes pour tous. Pas un conseil financier.',
    ar: 'مجاني خلال الفترة التجريبية. تقييمات بقواعد ثابتة، واحدة للجميع. ليست نصيحة مالية.',
  },
  // shown once after qirat.tn/#own-on or #own-off (lib/source.ts)
  'own.on': { en: 'This browser is no longer counted.', fr: 'Ce navigateur n’est plus compté.', ar: 'لم يعد هذا المتصفح يُحتسب.' },
  'own.off': { en: 'This browser is counted again.', fr: 'Ce navigateur est de nouveau compté.', ar: 'عاد هذا المتصفح يُحتسب.' },
  'own.failed': {
    en: 'Storage is blocked here, so this browser is still counted.',
    fr: 'Le stockage est bloqué ici : ce navigateur reste compté.',
    ar: 'التخزين محظور هنا، لذلك ما زال هذا المتصفح يُحتسب.',
  },
  'foot.data': { en: 'Market data', fr: 'Données', ar: 'البيانات' },
  'foot.channel': { en: 'Telegram channel', fr: 'Canal Telegram', ar: 'القناة على Telegram' },
  'foot.follow': { en: 'New stories every week on', fr: 'De nouvelles histoires chaque semaine sur', ar: 'قصص جديدة كل أسبوع على' },
  'foot.notAdvice': { en: 'Not financial advice.', fr: 'Pas un conseil financier.', ar: 'ليست نصيحة مالية.' },
  'foot.sources': { en: 'Where do the numbers come from?', fr: 'D’où viennent les chiffres ?', ar: 'من أين تأتي الأرقام؟' },

  // The first screen (HomeView). A caption's [[double brackets]] sit on the gold
  // marker; \n is a line break. Arabic here is light Arabic (simple Modern
  // Standard Arabic for every Arab country, no dialect), since 2026-11-20.
  'home.h1': {
    en: 'Try it before you put in [[real money]]',
    fr: 'Essayez avant de mettre [[votre argent]]',
    ar: 'جرّب قبل أن\nتضع [[أموالك]]',
  },
  'home.barLabel': { en: 'Qirat, the gold bar', fr: 'Qirat, le lingot d’or', ar: 'قيراط، سبيكة الذهب' },
  'home.bubble': {
    en: 'Here, {n} dollars. Pretend ones, relax.',
    fr: 'Tenez, {n} dollars. Fictifs, pas de stress.',
    ar: 'تفضّل، {n} دولار. تجريبية، لا تقلق.',
  },
  'home.bubbleBack': { en: 'You are back! Where were we?', fr: 'Vous revoilà ! On en était où ?', ar: 'عدت! أين وصلنا؟' },
  'home.bill': { en: 'pretend', fr: 'fictifs', ar: 'تجريبية' },
  'home.try': { en: 'Try it with {n} pretend dollars', fr: 'Essayer avec {n} dollars fictifs', ar: 'جرّب بـ {n} دولار تجريبية' },
  'home.lesson1': { en: 'Or start with lesson 1', fr: 'Ou commencer par la leçon 1', ar: 'أو ابدأ بالدرس 1' },
  'home.free': {
    en: 'Free. Qirat never tells you to buy or sell.',
    fr: 'Gratuit. Qirat ne vous dit jamais d’acheter ni de vendre.',
    ar: 'مجاني. قيراط لا يقول لك أبدًا اشترِ أو بِع.',
  },
  'home.continue': { en: 'Continue with lesson {n}', fr: 'Continuer avec la leçon {n}', ar: 'أكمل مع الدرس {n}' },
  'home.openWallet': { en: 'Open my wallet', fr: 'Ouvrir mon portefeuille', ar: 'افتح محفظتي' },
  'home.stories': { en: 'Stories in 30 seconds', fr: 'Des histoires en 30 secondes', ar: 'قصص في 30 ثانية' },
  'home.learnH': { en: '{n} lessons.\n[[2 minutes]] each.', fr: '{n} leçons.\n[[2 minutes]] chacune.', ar: '{n} درسًا.\n[[دقيقتان]] لكل درس.' },
  'home.lessonN': { en: 'Lesson {n}', fr: 'Leçon {n}', ar: 'الدرس {n}' },
  'home.startLesson': { en: 'Start the lesson', fr: 'Commencer la leçon', ar: 'ابدأ الدرس' },
  'home.allDone': {
    en: 'Every lesson passed. You are 24K.',
    fr: 'Toutes les leçons réussies. Vous êtes 24K.',
    ar: 'نجحت في كل الدروس. أنت 24K.',
  },
  'home.practiceH': {
    en: 'Buy. Sell. Get it wrong.\nAll for free.',
    fr: 'Achetez. Vendez. Trompez-vous.\nTout est gratuit.',
    ar: 'اشترِ. بِع. أخطئ.\nكل ذلك مجانًا.',
  },
  'home.ticket': { en: 'Practice wallet', fr: 'Portefeuille d’entraînement', ar: 'محفظة التدريب' },
  'home.cash': { en: 'Cash', fr: 'Cash', ar: 'النقد' },
  'home.trades': { en: 'Trades made', fr: 'Trades passés', ar: 'الصفقات المنفّذة' },
  'home.startedWith': { en: 'Start', fr: 'Départ', ar: 'البداية' },
  'home.stamp': { en: 'Pretend', fr: 'Fictif', ar: 'تجريبي' },
  'home.stampSub': { en: 'not real\nmoney', fr: 'pas de vrai\nargent', ar: 'ليس مالًا\nحقيقيًا' },
  'home.replayH': { en: '30 days in [[4 minutes]].', fr: '30 jours en [[4 minutes]].', ar: '30 يومًا في [[4 دقائق]].' },
  'home.replayGo': { en: 'Start the trip', fr: 'Commencer le voyage', ar: 'ابدأ الرحلة' },
  'story.try': { en: 'Try it yourself', fr: 'Essayez vous-même', ar: 'جرّب بنفسك' },
  'story.again': { en: 'Watch again', fr: 'Revoir', ar: 'شاهدها مجددًا' },
  'story.more': { en: 'More on', fr: 'La suite sur', ar: 'المزيد على' },
  'story.close': { en: 'Close the video', fr: 'Fermer la vidéo', ar: 'أغلق الفيديو' },
  // The feedback form (FeedbackModal), in the visitor's language. Each question
  // fills a fixed field of the Google Form, so its meaning must stay close to
  // that field (see the note at the top of FeedbackModal.tsx). The Arabic lines
  // were rewritten in light Arabic on 2026-11-20.
  'fb.title': { en: 'Give [[feedback]]', fr: 'Votre [[avis]]', ar: 'شاركنا [[رأيك]]' },
  'fb.sub': {
    en: '30 seconds. Anonymous, no sign-in, nothing stored about you.',
    fr: '30 secondes. Anonyme, sans compte, rien n’est gardé sur vous.',
    ar: '30 ثانية، وبدون اسم. لا نحفظ أي شيء عنك.',
  },
  'fb.required': { en: 'Required', fr: 'Obligatoire', ar: 'إجباري' },
  'fb.optional': { en: 'Optional', fr: 'Facultatif', ar: 'اختياري' },
  'fb.q1': { en: 'How long have you been in crypto?', fr: 'Depuis quand êtes-vous dans la crypto ?', ar: 'منذ متى وأنت في عالم العملات الرقمية؟' },
  'fb.exp1': { en: 'Under 1 year', fr: 'Moins d’un an', ar: 'أقل من سنة' },
  'fb.exp2': { en: '1 to 3 years', fr: '1 à 3 ans', ar: 'من 1 إلى 3 سنوات' },
  'fb.exp3': { en: 'Over 3 years', fr: 'Plus de 3 ans', ar: 'أكثر من 3 سنوات' },
  'fb.q2': { en: 'Is Qirat clear?', fr: 'Qirat est-il clair ?', ar: 'هل قيراط واضح؟' },
  'fb.q2hint': {
    en: '1 = I understood nothing, 5 = everything is clear',
    fr: '1 = je n’ai rien compris, 5 = tout est clair',
    ar: '1 = لم أفهم شيئًا، 5 = كل شيء واضح',
  },
  'fb.q3': {
    en: 'Would you use Qirat before putting in real money?',
    fr: 'Utiliseriez-vous Qirat avant de mettre de l’argent réel ?',
    ar: 'هل ستستعمل قيراط قبل أن تضع مالًا حقيقيًا؟',
  },
  'fb.yes': { en: 'Yes', fr: 'Oui', ar: 'نعم' },
  'fb.sometimes': { en: 'Sometimes', fr: 'Parfois', ar: 'أحيانًا' },
  'fb.no': { en: 'No', fr: 'Non', ar: 'لا' },
  'fb.q4': { en: 'What is missing?', fr: 'Que manque-t-il ?', ar: 'ما الذي ينقص؟' },
  'fb.q4hint': { en: 'Required. The one that matters most.', fr: 'Obligatoire. La plus importante.', ar: 'إجباري. هذا هو السؤال الأهم.' },
  'fb.q4ph': {
    en: 'What would bring you back every day? More lessons, more coins, alerts…',
    fr: 'Qu’est-ce qui vous ferait revenir chaque jour ? Plus de leçons, plus de cryptos, des alertes…',
    ar: 'ما الذي يجعلك تعود كل يوم؟ دروس أكثر، عملات أكثر، تنبيهات…',
  },
  'fb.q5': { en: 'Anything confusing or broken?', fr: 'Quelque chose de confus ou de cassé ?', ar: 'هل هناك شيء غير واضح أو لا يعمل؟' },
  'fb.q5ph': { en: 'Say it as it is.', fr: 'Dites-le comme c’est.', ar: 'قلها كما هي.' },
  'fb.send': { en: 'Send', fr: 'Envoyer', ar: 'أرسل' },
  'fb.sending': { en: 'Sending…', fr: 'Envoi…', ar: 'جارٍ الإرسال…' },
  'fb.sent': {
    en: 'Sent. It changes what gets built next.',
    fr: 'Envoyé. Cela change ce qui sera construit ensuite.',
    ar: 'وصل. رأيك يحدّد ما سنبنيه بعد ذلك.',
  },
  'fb.back': { en: 'Back to Qirat', fr: 'Retour à Qirat', ar: 'عُد إلى قيراط' },
  'fb.error': {
    en: 'It could not be sent. Check your connection and try again.',
    fr: 'L’envoi a échoué. Vérifiez votre connexion et réessayez.',
    ar: 'تعذّر الإرسال. تحقّق من اتصالك وحاول مرة أخرى.',
  },
  'fb.openForm': { en: 'Or open the form directly', fr: 'Ou ouvrir le formulaire directement', ar: 'أو افتح الاستمارة مباشرة' },
  'fb.note': {
    en: 'Goes to a Google Form. No account, no email.',
    fr: 'Envoyé vers un Google Form. Ni compte, ni e-mail.',
    ar: 'يُرسل إلى Google Form. بدون حساب وبدون بريد إلكتروني.',
  },
  'fb.close': { en: 'Close', fr: 'Fermer', ar: 'إغلاق' },
  'foot.feedback': { en: 'Give feedback', fr: 'Donner mon avis', ar: 'شاركنا رأيك' },
  'foot.feedbackHint': {
    en: 'Trying Qirat? 30 seconds, no name. Your answer decides what we build next.',
    fr: 'Vous essayez Qirat ? 30 secondes, sans nom. Votre avis décide de la suite.',
    ar: 'تجرّب قيراط؟ 30 ثانية وبدون اسم. رأيك يحدّد ما سنبنيه بعد ذلك.',
  },

  'guide.title': { en: 'How Qirat works', fr: 'Comment marche Qirat', ar: 'كيف يعمل قيراط' },
  'guide.sub': {
    en: 'A karat grades gold. Qirat grades coins.',
    fr: 'Le carat note l’or. Qirat note les cryptos.',
    ar: 'القيراط يزن الذهب. وقيراط يزن العملات.',
  },
  'guide.1t': { en: 'Add your coins', fr: 'Ajoutez vos cryptos', ar: 'أضف عملاتك' },
  'guide.1b': {
    en: 'Tap "Edit list" under Your coins and add the coins you follow. Each one gets a karat, like gold.',
    fr: 'Touchez « Modifier » sous Vos cryptos et ajoutez celles que vous suivez. Chacune reçoit un carat, comme l’or.',
    ar: 'انقر على «عدّل القائمة» تحت «عملاتك» وأضف العملات التي تتابعها. كل واحدة تأخذ قيراطًا، مثل الذهب.',
  },
  'guide.2t': { en: 'Read the karat', fr: 'Lisez le carat', ar: 'اقرأ القيراط' },
  'guide.2b': {
    en: '24K = calm and rising, 10K = wild or falling. The karat compares each coin with 18 big coins on two things: how calm it has been, and how strong its trend has been over 90 days. It never tells you to buy or sell.',
    fr: '24K = calme et en hausse, 10K = agitée ou en baisse. Le carat compare chaque crypto à 18 grandes cryptos sur deux points : son calme, et la force de sa tendance sur 90 jours. Ce n’est jamais un ordre d’acheter ou de vendre.',
    ar: '24K = هادئة وصاعدة، 10K = متقلّبة أو هابطة. القيراط يقارن كل عملة بـ 18 عملة كبرى في أمرين: مدى هدوئها، وقوة اتجاهها خلال 90 يومًا. وهو ليس أبدًا أمرًا بالشراء أو البيع.',
  },
  'guide.3t': { en: 'Know the risk', fr: 'Connaissez le risque', ar: 'اعرف المخاطرة' },
  'guide.3b': {
    en: 'Tap any coin to see its risk: how much it moves on a typical day and what a rough month could cost on $100. Risk is the most reliable part of the grade.',
    fr: 'Touchez une crypto pour voir son risque : combien elle bouge un jour normal et ce qu’un mauvais mois pourrait coûter sur 100 $. Le risque est la partie la plus fiable de la note.',
    ar: 'انقر على أي عملة لترى مخاطرتها: كم تتحرك في يوم عادي، وكم قد يكلّفك شهر صعب على 100 دولار. المخاطرة هي الجزء الأكثر موثوقية في التقييم.',
  },
  'guide.4t': { en: 'Check the weather', fr: 'Regardez la météo', ar: 'انظر إلى الطقس' },
  'guide.4b': {
    en: 'Calm, choppy or stormy: the whole market’s mood, led by Bitcoin and its 50-day average. Karats compare coins with each other; in a storm even 24K coins usually fall.',
    fr: 'Calme, agité ou orageux : l’humeur de tout le marché, menée par le bitcoin et sa moyenne 50 jours. Les carats comparent les cryptos entre elles ; dans l’orage, même les 24K baissent souvent.',
    ar: 'هادئ أو متقلّب أو عاصف: مزاج السوق كله، يقوده Bitcoin ومتوسطه لـ 50 يومًا. القيراط يقارن العملات ببعضها؛ وفي العاصفة تهبط عادةً حتى عملات 24K.',
  },
  'guide.5t': { en: 'We never ask for money', fr: 'Nous ne demandons jamais d’argent', ar: 'لا نطلب منك المال أبدًا' },
  'guide.5b': {
    en: 'Qirat never messages you first, never asks you to send money and has no VIP group. Anyone who does is not us. No ads, no links that pay us.',
    fr: 'Qirat ne vous écrit jamais en premier, ne vous demande jamais d’envoyer de l’argent et n’a pas de groupe VIP. Si quelqu’un le fait, ce n’est pas nous. Ni pub, ni liens qui nous rapportent.',
    ar: 'قيراط لا يراسلك أولًا أبدًا، ولا يطلب منك أن ترسل مالًا، وليست لديه مجموعة VIP. من يفعل ذلك ليس نحن. لا إعلانات ولا روابط تسويق بالعمولة (affiliate).',
  },
  'guide.6t': { en: 'Ask questions', fr: 'Posez vos questions', ar: 'اسأل' },
  'guide.6b': {
    en: 'Tap the gold bar at the bottom of any page and ask your question. It answers in simple words, in your language, and never tells you what to buy or sell.',
    fr: 'Touchez le lingot doré en bas de chaque page et posez votre question. Il répond avec des mots simples, dans votre langue, et ne vous dit jamais quoi acheter ou vendre.',
    ar: 'انقر على سبيكة الذهب أسفل أي صفحة واكتب سؤالك. تجيبك بكلمات بسيطة وبلغتك، ولا تقول لك أبدًا ماذا تشتري أو تبيع.',
  },
  'guide.close': { en: 'Got it', fr: 'Compris', ar: 'فهمت' },
} satisfies Record<string, Entry>

export type UIKey = keyof typeof UI

// Strings produced by the scoring engine (breakdown labels, reasons, risks).
// Keyed by the engine's English text; unknown strings fall back to English.
// The key must stay the engine's exact text (the server and the saved record
// use it), so a plainer English for display goes in the optional `en`.
const ENGINE: Record<string, Omit<Entry, 'en'> & { en?: string }> = {
  'Above 7-day average': { fr: 'Au-dessus de la moyenne 7 j', ar: 'فوق متوسط 7 أيام' },
  'Below 7-day average': { fr: 'Sous la moyenne 7 j', ar: 'تحت متوسط 7 أيام' },
  'Above 30-day average': { fr: 'Au-dessus de la moyenne 30 j', ar: 'فوق متوسط 30 يومًا' },
  'Below 30-day average': { fr: 'Sous la moyenne 30 j', ar: 'تحت متوسط 30 يومًا' },
  'Strong 7-day return': { en: 'Big rise over 7 days', fr: 'Forte hausse sur 7 j', ar: 'عائد قوي خلال 7 أيام' },
  'Weak 7-day return': { en: 'Big drop over 7 days', fr: 'Forte baisse sur 7 j', ar: 'هبوط قوي خلال 7 أيام' },
  'Rising volume': { en: 'Trading is picking up', fr: 'Les échanges augmentent', ar: 'حجم تداول متزايد' },
  'Fading volume': { en: 'Trading is slowing down', fr: 'Les échanges ralentissent', ar: 'حجم تداول متراجع' },
  'Contrarian fear': { en: 'The market is afraid', fr: 'Le marché a peur', ar: 'خوف في السوق (إشارة معاكسة)' },
  'Market greed': { en: 'The market is greedy', fr: 'Le marché s’emballe', ar: 'طمع في السوق' },
  'Sharp 24h drop': { en: 'Big drop in 24h', fr: 'Forte chute en 24 h', ar: 'هبوط حاد خلال 24 ساعة' },
  'Extended 30-day move': { en: 'Rose too far in 30 days', fr: 'Trop forte hausse sur 30 j', ar: 'صعود مبالغ فيه خلال 30 يومًا' },
  'Sustained 30-day uptrend': { en: 'Steady rise over 30 days', fr: 'Hausse régulière sur 30 j', ar: 'صعود ثابت خلال 30 يومًا' },
  'Uptrend structure': { en: 'Clear upward trend', fr: 'Tendance nette à la hausse', ar: 'شكل اتجاه صاعد' },
  'Volume conviction': { en: 'Trading backs the move', fr: 'Les échanges confirment', ar: 'حجم تداول يؤكّد الحركة' },
  'Steady 24h follow-through': { en: 'Steady rise in 24h', fr: 'Hausse régulière sur 24 h', ar: 'صعود ثابت خلال 24 ساعة' },

  'Price is above the 7-day average, showing short-term strength.': {
    en: 'The price is above its 7-day average: it is strong right now.',
    fr: 'Le prix est au-dessus de sa moyenne sur 7 jours : il est fort en ce moment.',
    ar: 'السعر فوق متوسط 7 أيام: قوة على المدى القصير.',
  },
  'Price is below the 7-day average, so momentum is weak.': {
    en: 'The price is below its 7-day average: it is weak right now.',
    fr: 'Le prix est sous sa moyenne sur 7 jours : il est faible en ce moment.',
    ar: 'السعر تحت متوسط 7 أيام، أي أن الزخم ضعيف.',
  },
  'Price is above the 30-day average, confirming broader trend support.': {
    en: 'The price is above its 30-day average, which supports the longer trend.',
    fr: 'Le prix est au-dessus de sa moyenne sur 30 jours : la tendance plus longue va dans le bon sens.',
    ar: 'السعر فوق متوسط 30 يومًا، وهذا يؤكّد الاتجاه العام.',
  },
  'Price is below the 30-day average, which raises trend risk.': {
    en: 'The price is below its 30-day average, so the longer trend is at risk.',
    fr: 'Le prix est sous sa moyenne sur 30 jours : la tendance plus longue est fragile.',
    ar: 'السعر تحت متوسط 30 يومًا، وهذا يرفع مخاطرة الاتجاه.',
  },
  'The 7-day return is strong.': { en: 'It rose a lot over 7 days.', fr: 'La hausse sur 7 jours est forte.', ar: 'العائد خلال 7 أيام قوي.' },
  'The 7-day return is sharply negative.': {
    en: 'It fell a lot over 7 days.',
    fr: 'La baisse sur 7 jours est forte.',
    ar: 'العائد خلال 7 أيام سلبي بشدة.',
  },
  'Recent volume is rising, which can confirm the move.': {
    en: 'More people are trading it lately, which can back up the move.',
    fr: 'Les échanges augmentent ces derniers jours, ce qui peut confirmer le mouvement.',
    ar: 'حجم التداول الأخير يرتفع، وهذا قد يؤكّد الحركة.',
  },
  'Recent volume is fading, so conviction is lower.': {
    en: 'Fewer people are trading it lately, so the move is less sure.',
    fr: 'Les échanges baissent ces derniers jours : le mouvement est moins sûr.',
    ar: 'حجم التداول الأخير يتراجع، أي أن الثقة أضعف.',
  },
  'Market sentiment is fearful, which can create discounted entries.': {
    en: 'The market is afraid, which can push prices lower than usual.',
    fr: 'Le marché a peur, ce qui peut faire baisser les prix plus que d’habitude.',
    ar: 'مزاج السوق خائف، وهذا قد يتيح أسعارًا منخفضة.',
  },
  'Market sentiment is greedy, so chasing entries is riskier.': {
    en: 'The market is greedy, so buying after a big rise is riskier.',
    fr: 'Le marché s’emballe : acheter après une forte hausse est plus risqué.',
    ar: 'مزاج السوق طمّاع، لذا فاللحاق بالسعر أكثر خطورة.',
  },
  'The 30-day trend is steadily higher without being overextended.': {
    en: 'It has risen steadily over 30 days, without going too far.',
    fr: 'La tendance sur 30 jours monte régulièrement sans excès.',
    ar: 'الاتجاه خلال 30 يومًا صاعد بثبات دون مبالغة.',
  },
  'Price sits above a rising 7-over-30-day average stack — a clean uptrend structure.': {
    en: 'The price is above its 7-day and 30-day averages, and both are rising: a clear upward trend.',
    fr: 'Le prix est au-dessus de ses moyennes sur 7 et 30 jours, qui montent toutes les deux : une hausse nette.',
    ar: 'السعر فوق متوسطَي 7 و30 يومًا وهما يرتفعان: شكل اتجاه صاعد واضح.',
  },
  'Volume is surging while price holds its short-term trend — strong conviction.': {
    en: 'Trading is jumping while the price keeps its short-term direction: strong interest.',
    fr: 'Les échanges bondissent et le prix garde sa direction : un fort intérêt.',
    ar: 'حجم التداول يقفز والسعر يحافظ على اتجاهه القصير: ثقة قوية.',
  },
  "Today's gain is steady rather than a spike — consistent with a durable trend.": {
    en: 'Today’s rise is steady, not a sudden jump: that fits a trend that lasts.',
    fr: 'La hausse du jour est régulière, pas un bond soudain : cela va avec une tendance qui dure.',
    ar: 'صعود اليوم ثابت وليس قفزة مفاجئة: يتماشى مع اتجاه دائم.',
  },
  'Fear can persist longer than expected during broad sell-offs.': {
    en: 'When many people sell, fear can last longer than expected.',
    fr: 'Quand beaucoup de gens vendent, la peur peut durer plus longtemps que prévu.',
    ar: 'قد يستمر الخوف أطول من المتوقع خلال موجات البيع الكبيرة.',
  },
  'Extreme greed can precede fast pullbacks.': {
    en: 'Too much greed can come before quick drops.',
    fr: 'Trop d’euphorie peut annoncer des baisses rapides.',
    ar: 'الطمع الشديد قد يسبق تراجعات سريعة.',
  },
  'The asset dropped heavily in 24 hours, so volatility risk is elevated.': {
    en: 'The coin fell hard in 24 hours, so it may keep swinging a lot.',
    fr: 'La crypto a beaucoup baissé en 24 heures : elle risque de continuer à bouger fort.',
    ar: 'هبطت العملة بقوة خلال 24 ساعة، لذا فمخاطرة التقلب مرتفعة.',
  },
  'The 30-day move is extended, making a cooldown more likely.': {
    en: 'It rose too far in 30 days, so a pause or a drop is more likely.',
    fr: 'Elle a trop monté en 30 jours : une pause ou une baisse devient plus probable.',
    ar: 'الصعود خلال 30 يومًا مبالغ فيه، لذا صار الهدوء أكثر احتمالًا.',
  },
  'The asset remains far below its all-time high, which may signal structural weakness.': {
    en: 'The coin is still far below its highest price ever, which may be a sign of deeper weakness.',
    fr: 'La crypto reste loin de son prix le plus haut, ce qui peut montrer une faiblesse profonde.',
    ar: 'ما زالت العملة بعيدة جدًا عن أعلى سعر وصلت إليه، وهذا قد يدل على ضعف عميق.',
  },
  'Crypto prices can move faster than the indicators update.': {
    en: 'Crypto prices can move faster than these numbers update.',
    fr: 'Les prix des cryptos peuvent bouger plus vite que ces chiffres.',
    ar: 'أسعار العملات الرقمية قد تتحرك أسرع من تحديث المؤشرات.',
  },
  'News, regulation, and liquidity shocks can invalidate the signal.': {
    en: 'News, new laws, or a sudden lack of buyers can make this rating wrong.',
    fr: 'Une nouvelle, une loi ou un manque soudain d’acheteurs peut rendre cette note fausse.',
    ar: 'الأخبار والقوانين وصدمات السيولة قد تُبطل التقييم.',
  },
  'Position is up over 35% while market sentiment is greedy.': {
    en: 'You are up more than 35% while the market is greedy.',
    fr: 'Vous gagnez plus de 35 % alors que le marché s’emballe.',
    ar: 'الصفقة رابحة بأكثر من 35% والسوق في حالة طمع.',
  },
  "Position is down over 20% and the coin's setup is weak.": {
    en: 'You are down more than 20% and the coin is rated Weak.',
    fr: 'Vous perdez plus de 20 % et la crypto est notée Faible.',
    ar: 'الصفقة خاسرة بأكثر من 20% وتقييم العملة ضعيف.',
  },
  'Risk-off market: BTC is below its 200-day average': {
    en: 'Careful market: Bitcoin is below its 200-day average',
    fr: 'Marché fragile : le bitcoin est sous sa moyenne sur 200 jours',
    ar: 'سوق حذر: Bitcoin تحت متوسطه لـ 200 يوم',
  },

  // ratings, risk levels and Fear & Greed classifications
  STRONG: { fr: 'Forte', ar: 'قوي' },
  NEUTRAL: { fr: 'Neutre', ar: 'محايد' },
  WEAK: { fr: 'Faible', ar: 'ضعيف' },
  High: { fr: 'Élevé', ar: 'عالية' },
  Medium: { fr: 'Moyen', ar: 'متوسطة' },
  Controlled: { en: 'Under control', fr: 'Sous contrôle', ar: 'تحت السيطرة' },
  'Extreme Fear': { fr: 'Peur extrême', ar: 'خوف شديد' },
  Fear: { fr: 'Peur', ar: 'خوف' },
  Neutral: { fr: 'Neutre', ar: 'محايد' },
  Greed: { fr: 'Avidité', ar: 'طمع' },
  'Extreme Greed': { fr: 'Avidité extrême', ar: 'طمع شديد' },
}

const ENGLISH_RATING: Record<string, string> = { STRONG: 'Strong', NEUTRAL: 'Neutral', WEAK: 'Weak' }

const STORAGE_KEY = 'qirat.lang'

export function initialLang(): Lang {
  // A course or lesson address says its language (qirat.tn/fr/learn/...): the
  // page a search engine listed must open in the language it was listed in.
  const fromPath = learnPath()
  if (fromPath) return fromPath.lang
  // A link like qirat.tn/?lang=ar (used in our Arabic social bios) wins over
  // the phone's language, and is remembered for the next visit.
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang')
    if (fromUrl === 'en' || fromUrl === 'fr' || fromUrl === 'ar') {
      saveLang(fromUrl)
      return fromUrl
    }
  } catch {
    // no URL access: fall through
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'fr' || saved === 'ar') return saved
  } catch {
    // storage blocked: fall through to the browser language
  }
  // No choice made yet. A visit through a platform address (qirat.tn/t, /i,
  // /f, /w, /y, /m) comes from an Arabic post, so it opens in Arabic. So does
  // /s, a friend's message: most are sent from the site in Arabic.
  if (arrive().source) return 'ar'
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase()
  if (nav === 'fr' || nav === 'ar') return nav
  // Many phones in Tunisia are set to English; the audience still reads Arabic.
  return inTunisia() ? 'ar' : 'en'
}

export function saveLang(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // not persisted; the choice still applies for this visit
  }
}

export interface I18n {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: UIKey, vars?: Record<string, string | number>) => string
  /** Translate a string produced by the scoring engine (falls back to English). */
  te: (text?: string | null) => string
}

export function makeI18n(lang: Lang, setLang: (lang: Lang) => void): I18n {
  const t = (key: UIKey, vars?: Record<string, string | number>) => {
    let s: string = UI[key][lang]
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
    return s
  }
  const te = (text?: string | null) => {
    if (!text) return ''
    if (lang === 'en') return ENGLISH_RATING[text] ?? ENGINE[text]?.en ?? text
    return ENGINE[text]?.[lang] ?? ENGLISH_RATING[text] ?? text
  }
  return { lang, setLang, t, te }
}

export const I18nContext = createContext<I18n | null>(null)

export function useI18n(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
