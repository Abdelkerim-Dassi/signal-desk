import { createContext, useContext } from 'react'

export type Lang = 'en' | 'fr' | 'ar'
export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'ar', label: 'العربية', short: 'ع' },
]

type Entry = Record<Lang, string>

// UI strings. {name} placeholders are filled by t(key, vars).
const UI = {
  'app.tagline': { en: 'Every coin has a karat', fr: 'Chaque crypto a son carat', ar: 'كل coin عندها قيراطها' },
  'nav.today': { en: 'Today', fr: "Aujourd'hui", ar: 'اليوم' },
  'nav.record': { en: 'Track record', fr: 'Historique', ar: 'السجل' },
  'nav.ask': { en: 'Ask', fr: 'Demander', ar: 'اسأل' },
  'nav.portfolio': { en: 'Portfolio', fr: 'Portefeuille', ar: 'محفظتي' },
  'nav.practice': { en: 'Practice', fr: 'Entraînement', ar: 'تدريب' },
  'nav.learn': { en: 'Learn', fr: 'Apprendre', ar: 'تعلّم' },
  'nav.scamcheck': { en: 'Scam check', fr: 'Arnaque ?', ar: 'فحص الاحتيال' },
  'nav.more': { en: 'More', fr: 'Plus', ar: 'أكثر' },
  'top.help': { en: 'How Qirat works', fr: 'Comment marche Qirat', ar: 'كيفاش يخدم قيراط' },
  'top.theme': { en: 'Switch light / dark', fr: 'Thème clair / sombre', ar: 'فاتح / غامق' },
  'top.language': { en: 'Language', fr: 'Langue', ar: 'اللغة' },

  'greet.morning': { en: 'Good morning', fr: 'Bonjour', ar: 'صباح الخير' },
  'greet.afternoon': { en: 'Good afternoon', fr: 'Bon après-midi', ar: 'مساء الخير' },
  'greet.evening': { en: 'Good evening', fr: 'Bonsoir', ar: 'مساء الخير' },
  'hero.on.title': { en: 'The market is risk-on', fr: 'Le marché est favorable', ar: 'السوق في حالة باهية' },
  'hero.off.title': { en: 'The market is risk-off', fr: 'Le marché est défavorable', ar: 'السوق يحب الحذر' },
  'hero.unknown.title': { en: 'Reading the market…', fr: 'Lecture du marché…', ar: 'نقراو في السوق…' },
  'hero.on.body': {
    en: 'Bitcoin is {pct} above its 200-day average, so Strong ratings are switched on.',
    fr: 'Le bitcoin est {pct} au-dessus de sa moyenne sur 200 jours : les notes Fortes sont activées.',
    ar: 'Bitcoin فوق المعدّل متاعو متاع 200 يوم بـ {pct}، هذاكا علاش التقييمات القويّة محلولة.',
  },
  'hero.off.body': {
    en: 'Bitcoin is {pct} below its 200-day average, so every score is capped at 66 and nothing rates Strong.',
    fr: 'Le bitcoin est {pct} sous sa moyenne sur 200 jours : tous les scores sont plafonnés à 66, aucune note Forte.',
    ar: 'Bitcoin تحت المعدّل متاعو متاع 200 يوم بـ {pct}، هذاكا علاش كل الدرجات مسقّفة على 66 وحتى تقييم ما يوصل لقوي.',
  },
  'hero.why': {
    en: 'In our 2021–26 backtest, Strong setups only beat the market while Bitcoin held this line.',
    fr: 'Dans notre backtest 2021–26, les notes Fortes ne battaient le marché que lorsque le bitcoin restait au-dessus de ce seuil.',
    ar: 'في الاختبار متاعنا على 2021–26، التقييمات القويّة ما غلبتش السوق كان وقت Bitcoin قعد فوق الخط هذا.',
  },
  'hero.mood': { en: 'Market mood', fr: 'Humeur du marché', ar: 'مزاج السوق' },
  'hero.mcap': { en: 'Total market', fr: 'Marché total', ar: 'السوق الكل' },
  'hero.btcDom': { en: 'BTC dominance', fr: 'Dominance BTC', ar: 'حصّة Bitcoin' },
  'hero.updated': { en: 'Updated {time}', fr: 'Mis à jour à {time}', ar: 'آخر تحديث {time}' },
  'hero.refreshing': { en: 'Refreshing…', fr: 'Actualisation…', ar: 'نحدّثو…' },
  'hero.failed': { en: 'Update failed, retrying soon', fr: 'Échec de la mise à jour, nouvel essai bientôt', ar: 'التحديث ما نجحش، نعاودو بعد شويّة' },
  'hero.refresh': { en: 'Refresh', fr: 'Actualiser', ar: 'حدّث' },
  'hero.24h': { en: '24h', fr: '24 h', ar: '24 ساعة' },

  'weather.calm.title': { en: 'The market is calm', fr: 'Le marché est calme', ar: 'السوق صاحي' },
  'weather.choppy.title': { en: 'The market is choppy', fr: 'Le marché est agité', ar: 'السوق مغيّم' },
  'weather.stormy.title': { en: 'The market is stormy', fr: 'Le marché est orageux', ar: 'السوق خايب' },
  'weather.calm.body': {
    en: 'Bitcoin is {pct} above its 50-day average and the crowd is not overheated.',
    fr: 'Le bitcoin est {pct} au-dessus de sa moyenne sur 50 jours et la foule n’est pas en surchauffe.',
    ar: 'Bitcoin فوق المعدّل متاعو متاع 50 يوم بـ {pct}، والناس موش مندفعين برشا.',
  },
  'weather.choppy.dip': {
    en: 'Bitcoin slipped {pct} below its 50-day average but still holds its 200-day line. Expect bigger swings than usual.',
    fr: 'Le bitcoin est passé {pct} sous sa moyenne sur 50 jours mais tient sa moyenne sur 200 jours. Attendez-vous à plus de remous.',
    ar: 'Bitcoin هبط {pct} تحت المعدّل متاعو متاع 50 يوم، أما مازال فوق خط الـ 200 يوم. استنّى حركات أكبر من العادة.',
  },
  'weather.choppy.hot': {
    en: 'Bitcoin is above its 50-day average, but the crowd is overheated ({why}). Pullbacks get more likely.',
    fr: 'Le bitcoin est au-dessus de sa moyenne sur 50 jours, mais la foule surchauffe ({why}). Les replis deviennent plus probables.',
    ar: 'Bitcoin فوق المعدّل متاعو متاع 50 يوم، أما الناس سخنو برشا ({why}). الرجوع لتالي يولّي أقرب.',
  },
  'weather.stormy.body': {
    en: 'Bitcoin is below both its 50-day and 200-day averages. In storms most coins fall, even 24K ones.',
    fr: 'Le bitcoin est sous ses moyennes sur 50 et 200 jours. Dans l’orage, la plupart des cryptos baissent, même les 24K.',
    ar: 'Bitcoin تحت المعدّل متاع 50 يوم ومتاع 200 يوم. في الطقس الخايب أغلب الـ coins يهبطو، حتى الـ 24K.',
  },
  'weather.hot.greed': { en: 'extreme greed', fr: 'avidité extrême', ar: 'طمع كبير' },
  'weather.hot.funding': { en: 'leveraged longs paying up', fr: 'acheteurs à levier très payeurs', ar: 'برشا ناس شاريين بالـ leverage' },
  'weather.why': {
    en: 'Since 2021, months that started with Bitcoin above its 50-day average went clearly better than the rest.',
    fr: 'Depuis 2021, les mois commencés avec le bitcoin au-dessus de sa moyenne sur 50 jours ont nettement mieux tourné.',
    ar: 'من 2021، الشهور اللي بداو وBitcoin فوق المعدّل متاع 50 يوم كانو أحسن بالواضح من البقيّة.',
  },

  'karat.label': { en: '{k}K', fr: '{k}K', ar: '{k} قيراط' },
  'karat.none': { en: 'New', fr: 'Nouveau', ar: 'جديدة' },
  'karat.title': { en: 'Why {k}K', fr: 'Pourquoi {k}K', ar: 'علاش {k} قيراط' },
  'karat.trend': { en: '90-day trend', fr: 'Tendance 90 jours', ar: 'الاتجاه في 90 يوم' },
  'karat.trendSub': {
    en: 'Stronger than {n}% of the top coins',
    fr: 'Plus forte que {n} % des grandes cryptos',
    ar: 'أقوى من {n}% من الـ coins الكبار',
  },
  'karat.calm': { en: 'Calm', fr: 'Calme', ar: 'الهدوء' },
  'karat.calmSub': {
    en: 'Calmer than {n}% of the top coins',
    fr: 'Plus calme que {n} % des grandes cryptos',
    ar: 'أهدى من {n}% من الـ coins الكبار',
  },
  'karat.perDay': { en: '±{v}% a day', fr: '±{v} % par jour', ar: '±{v}% في النهار' },
  'karat.scale': {
    en: '24K = calm and climbing · 10K = wild or sliding. Karats compare coins with each other: in a stormy market even 24K coins usually fall.',
    fr: '24K = calme et en hausse · 10K = agitée ou en baisse. Les carats comparent les cryptos entre elles : dans un marché orageux, même les 24K baissent souvent.',
    ar: '24K = باهية وطالعة · 10K = متقلّبة ولا هابطة. القيراط يقارن الـ coins بين بعضهم: في سوق خايب حتى الـ 24K عادةً يهبطو.',
  },
  'karat.young': {
    en: 'Too new for a karat: it needs 3 months of history.',
    fr: 'Trop récente pour un carat : il faut 3 mois d’historique.',
    ar: 'جديدة برشا باش تاخذ قيراط: لازمها 3 شهور من المعطيات.',
  },
  // "Low" is relative to other coins: even the calmest crypto swings far more
  // than savings or gold, so the label says so.
  'risk.low': { en: 'Low risk for crypto', fr: 'Risque faible pour une crypto', ar: 'risk منخفض للـ crypto' },
  'risk.medium': { en: 'Medium risk', fr: 'Risque moyen', ar: 'risk متوسط' },
  'risk.high': { en: 'High risk', fr: 'Risque élevé', ar: 'risk عالي' },
  'risk.title': { en: 'If it goes wrong', fr: 'Si ça tourne mal', ar: 'كان صارت خايبة' },
  'risk.learn': {
    en: 'What is a rough month? 2-minute lesson',
    fr: 'C’est quoi un mauvais mois ? Leçon de 2 min',
    ar: 'شنوّة الشهر الصعيب؟ درس في دقيقتين',
  },
  'risk.day': { en: 'A typical day', fr: 'Une journée normale', ar: 'نهار عادي' },
  'risk.month': { en: 'A rough month (1 in 20)', fr: 'Un mauvais mois (1 sur 20)', ar: 'شهر صعيب (مرّة كل 20 شهر)' },
  'risk.money': {
    en: 'On 100 TND, a rough month could cost about {v} TND.',
    fr: 'Sur 100 TND, un mauvais mois pourrait coûter environ {v} TND.',
    ar: 'على 100 دينار، شهر صعيب ينجّم يكلّفك قريب {v} دينار.',
  },
  'risk.note': {
    en: 'Past swings, not a forecast. Risk is the part of the grade that has been most reliable. "Low" means low compared with other coins: crypto still swings far more than savings or gold.',
    fr: 'Ce sont les variations passées, pas une prévision. Le risque est la partie la plus fiable de la note. « Faible » veut dire faible par rapport aux autres cryptos : une crypto bouge toujours bien plus qu’une épargne ou que l’or.',
    ar: 'هذي حركات اللي فات، موش توقّع. الـ risk هو أكثر جزء صحيح في التقييم. «منخفض» معناها مقارنة بالـ coins الأخرين: الـ crypto ديما تتحرّك أكثر بكثير من التوفير ولا الذهب.',
  },

  'coins.title': { en: 'Your coins', fr: 'Vos cryptos', ar: 'الـ coins متاعك' },
  'coins.legend': { en: '24K = calm and climbing · 10K = wild or sliding', fr: '24K = calme et en hausse · 10K = agitée ou en baisse', ar: '24K = باهية وطالعة · 10K = متقلّبة ولا هابطة' },
  'coins.edit': { en: 'Edit list', fr: 'Modifier', ar: 'بدّل الليستة' },
  'coins.done': { en: 'Done', fr: 'Terminé', ar: 'كمّلت' },
  'coins.add': { en: 'Add', fr: 'Ajouter', ar: 'زيد' },
  'coins.addPlaceholder': { en: 'Add a coin, e.g. SOL', fr: 'Ajouter une crypto, ex. SOL', ar: 'زيد coin، مثلاً SOL' },
  'coins.popular': { en: 'Popular', fr: 'Populaires', ar: 'المعروفين' },
  'coins.remove': { en: 'Remove {coin}', fr: 'Retirer {coin}', ar: 'نحّي {coin}' },
  'coins.loading': { en: 'Grading your coins…', fr: 'Évaluation de vos cryptos…', ar: 'نقيّمو في الـ coins متاعك…' },
  'coins.empty': { en: 'Add a coin to see its score.', fr: 'Ajoutez une crypto pour voir son score.', ar: 'زيد coin باش تشوف الدرجة متاعها.' },
  'coins.notFound': {
    en: 'Not found on Binance: {list}. Remove it from your list.',
    fr: 'Introuvable sur Binance : {list}. Retirez-la de votre liste.',
    ar: 'موش موجودة في Binance: {list}. نحّيها من الليستة متاعك.',
  },
  'coins.unknown': {
    en: 'We couldn’t find “{coin}” on Binance. Check the ticker, e.g. SOL.',
    fr: 'Impossible de trouver « {coin} » sur Binance. Vérifiez le symbole, ex. SOL.',
    ar: 'ما لقيناش «{coin}» في Binance. ثبّت في الرمز، مثلاً SOL.',
  },
  'coins.checking': { en: 'Checking…', fr: 'Vérification…', ar: 'نثبّتو…' },
  'coins.search': { en: 'Search a coin: BTC, Solana…', fr: 'Chercher une crypto : BTC, Solana…', ar: 'لوّج على coin: BTC، Solana…' },
  'coins.noMatch': {
    en: 'No coin matching “{q}” on Binance.',
    fr: 'Aucune crypto « {q} » sur Binance.',
    ar: 'ما فمّاش coin تشبه «{q}» في Binance.',
  },
  'coins.added': { en: 'Added', fr: 'Ajoutée', ar: 'تزادت' },

  'coin.today': { en: 'today', fr: "aujourd'hui", ar: 'اليوم' },
  'coin.7d': { en: '7 days', fr: '7 jours', ar: '7 أيام' },
  'chart.title': { en: '30 days · one candle per day', fr: '30 jours · une bougie par jour', ar: '30 يوم · شمعة لكل نهار' },
  'chart.legend': {
    en: 'Green: the day closed higher than it opened. Red: it closed lower. Thin line: the day’s high and low. Tap a candle to see that day.',
    fr: 'Vert : la journée a clôturé plus haut qu’à l’ouverture. Rouge : plus bas. Trait fin : le plus haut et le plus bas du jour. Touchez une bougie pour voir ce jour.',
    ar: 'الأخضر: النهار سكّر أعلى من ما حلّ. الأحمر: سكّر أوطى. الخيط الرقيق: أعلى وأوطى سوم في النهار. انقر على شمعة باش تشوف النهار هذاكا.',
  },
  'chart.open': { en: 'Open', fr: 'Ouv.', ar: 'حلّ' },
  'chart.high': { en: 'High', fr: 'Haut', ar: 'أعلى' },
  'chart.low': { en: 'Low', fr: 'Bas', ar: 'أوطى' },
  'chart.close': { en: 'Close', fr: 'Clôt.', ar: 'سكّر' },
  'coin.why': { en: 'Why this score', fr: 'Pourquoi ce score', ar: 'علاش الدرجة هاذي' },
  'coin.base': { en: 'Starting point', fr: 'Point de départ', ar: 'منين بدينا' },
  'coin.score': { en: 'Score', fr: 'Score', ar: 'الدرجة' },
  'coin.cap': { en: 'Risk-off cap', fr: 'Plafond marché défavorable', ar: 'سقف وقت الحذر' },
  'coin.beforeCap': { en: 'before the cap: {n}', fr: 'avant plafond : {n}', ar: 'قبل السقف: {n}' },
  'coin.helps': { en: 'What helps', fr: 'Ce qui aide', ar: 'شنوّة يعاونها' },
  'coin.watch': { en: 'Watch out', fr: 'Points de vigilance', ar: 'ردّ بالك من' },
  'coin.risk': { en: 'Risk', fr: 'Risque', ar: 'الـ risk' },
  'coin.capped': { en: 'Capped · risk-off', fr: 'Plafonné · défavorable', ar: 'مسقّف · وقت حذر' },
  'coin.notAdvice': {
    en: "A rating describes the coin's chart, not what you should do with your money.",
    fr: 'Une note décrit le graphique de la crypto, pas ce que vous devez faire de votre argent.',
    ar: 'التقييم يوصف الـ chart متاع الـ coin، موش شنوّة لازمك تعمل بفلوسك.',
  },
  'coin.details': { en: 'Show details', fr: 'Voir le détail', ar: 'ورّي التفاصيل' },

  'moves.title': { en: "What's moving", fr: 'Ce qui bouge', ar: 'شنوّة يتحرّك' },
  'moves.news': { en: 'Headlines', fr: 'À la une', ar: 'الأخبار' },
  'moves.trending': { en: 'Trending searches', fr: 'Recherches tendance', ar: 'الأكثر بحثاً' },

  'record.title': { en: 'Track record', fr: 'Historique', ar: 'السجل' },
  'record.sub': {
    en: 'Every call is logged, losses included.',
    fr: 'Chaque note est enregistrée, pertes comprises.',
    ar: 'كل تقييم مسجّل، بما في ذلك الخسائر.',
  },
  'record.live': { en: 'Live log', fr: 'Journal en direct', ar: 'السجل المباشر' },
  'record.backtest': { en: 'Backtest 2021–26', fr: 'Backtest 2021–26', ar: 'اختبار 2021–26' },
  'record.7d': { en: '7 days', fr: '7 jours', ar: '7 أيام' },
  'record.30d': { en: '30 days', fr: '30 jours', ar: '30 يوماً' },
  'record.rating': { en: 'Rating', fr: 'Note', ar: 'التقييم' },
  'record.avg': { en: 'Avg return', fr: 'Rendement moyen', ar: 'متوسط العائد' },
  'record.median': { en: 'Median', fr: 'Médiane', ar: 'الوسيط' },
  'record.up': { en: '% up', fr: '% en hausse', ar: '% صاعدة' },
  'record.calls': { en: 'Calls', fr: 'Notes', ar: 'تقييمات' },
  'record.allCoins': { en: 'All coins', fr: 'Toutes', ar: 'كل العملات' },
  'record.headline': {
    en: 'Coins rated Strong returned {strong} on average over the next {days}, vs {all} for all coins. Only {hit}% of them went up, though: the edge comes from bigger winners, not more frequent ones.',
    fr: 'Les cryptos notées Fortes ont rapporté {strong} en moyenne sur les {days} suivants, contre {all} pour l’ensemble. Seules {hit} % ont monté : l’avantage vient de gains plus gros, pas plus fréquents.',
    ar: 'حققت العملات المصنّفة قوية عائداً متوسطه {strong} خلال {days} التالية، مقابل {all} لكل العملات. لكن {hit}٪ منها فقط ارتفعت: الأفضلية تأتي من مكاسب أكبر وليس أكثر تكراراً.',
  },
  'record.scope': {
    en: '{days} coin-days · {coins} coins · {from}–{to}',
    fr: '{days} jours-crypto · {coins} cryptos · {from}–{to}',
    ar: '{days} يوم-عملة · {coins} عملة · {from}–{to}',
  },
  'record.byYear': { en: 'Strong setups by year', fr: 'Notes Fortes par année', ar: 'التقييمات القوية حسب السنة' },
  'record.noCalls': { en: 'no calls', fr: 'aucune', ar: 'لا يوجد' },
  'record.allShort': { en: 'all {v}', fr: 'toutes {v}', ar: 'الكل {v}' },
  'record.noCallsNote': {
    en: '"No calls" means Bitcoin spent the year below its 200-day average, so the risk-off cap kept every coin out of Strong.',
    fr: '« Aucune » signifie que le bitcoin est resté sous sa moyenne 200 jours toute l’année : le plafond a empêché toute note Forte.',
    ar: '«لا يوجد» يعني أن البيتكوين بقي طوال العام تحت متوسطه لـ200 يوم، فمنع الحدّ أي تقييم قوي.',
  },
  'record.caveats': { en: 'Read before trusting this', fr: 'À lire avant de s’y fier', ar: 'اقرأ قبل أن تثق بهذا' },
  'record.liveIntro': {
    en: 'Every day the same {n} coins are rated and the result is saved once, never edited. Returns are computed from the saved prices, losses included. Logging since {date} · {days} day(s) so far.',
    fr: 'Chaque jour, les mêmes {n} cryptos sont notées et le résultat est enregistré une seule fois, sans modification. Les rendements sont calculés à partir des prix enregistrés, pertes comprises. Depuis le {date} · {days} jour(s).',
    ar: 'كل يوم تُقيَّم نفس الـ{n} عملة ويُحفظ الناتج مرة واحدة دون أي تعديل. تُحسب العوائد من الأسعار المحفوظة، بما في ذلك الخسائر. منذ {date} · {days} يوم حتى الآن.',
  },
  'record.firstResults': {
    en: 'First 7-day results arrive on {date}. Until then, the backtest shows how these exact rules did on 2021–26 data.',
    fr: 'Premiers résultats à 7 jours le {date}. D’ici là, le backtest montre ce qu’ont donné ces règles sur 2021–26.',
    ar: 'تصل أول نتائج لـ7 أيام في {date}. حتى ذلك الحين، يعرض الاختبار التاريخي أداء هذه القواعد نفسها في 2021–26.',
  },
  'record.todayCalls': { en: "Today's ratings", fr: 'Notes du jour', ar: 'تقييمات اليوم' },
  'record.resolved': { en: 'Ratings from {date}, {n} days later', fr: 'Notes du {date}, {n} jours après', ar: 'تقييمات {date} بعد {n} أيام' },
  'record.loading': { en: 'Loading the record…', fr: 'Chargement…', ar: 'جارٍ التحميل…' },
  'record.none': { en: 'Nothing logged yet.', fr: 'Rien d’enregistré pour l’instant.', ar: 'لا شيء مسجّل بعد.' },

  'ask.briefTitle': { en: "Today's briefing", fr: 'Le briefing du jour', ar: 'ملخّص اليوم' },
  'ask.briefIntro': {
    en: "A plain-language read of today's market for your coins, written by AI from the live numbers.",
    fr: 'Une lecture simple du marché du jour pour vos cryptos, rédigée par l’IA à partir des chiffres en direct.',
    ar: 'قراية ساهلة لسوق اليوم على الـ coins متاعك، يكتبها الذكاء الاصطناعي من الأرقام الحيّة.',
  },
  'ask.generate': { en: 'Write my briefing', fr: 'Rédiger mon briefing', ar: 'اكتبلي الملخّص' },
  'ask.regenerate': { en: 'Rewrite', fr: 'Réécrire', ar: 'عاود اكتب' },
  'ask.writing': { en: 'Writing…', fr: 'Rédaction…', ar: 'نكتبو…' },
  'ask.throttled': { en: 'Please wait {s}s before rewriting.', fr: 'Patientez {s} s avant de réécrire.', ar: 'استنّى {s} ثانية قبل ما تعاود تكتب.' },
  'ask.chatTitle': { en: 'Ask Qirat', fr: 'Demandez à Qirat', ar: 'اسأل قيراط' },
  'ask.chatIntro': {
    en: 'Ask about any coin on your list. Answers use only the live data and never give personal advice.',
    fr: 'Posez une question sur vos cryptos. Les réponses s’appuient uniquement sur les données en direct, jamais sur des conseils personnels.',
    ar: 'اسأل على أي coin في الليستة متاعك. الإجابات تعتمد كان على المعطيات الحيّة وعمرها ما تعطي نصيحة شخصية.',
  },
  'ask.placeholder': { en: 'Ask about your coins…', fr: 'Une question sur vos cryptos…', ar: 'اسأل على الـ coins متاعك…' },
  'ask.send': { en: 'Send', fr: 'Envoyer', ar: 'ابعث' },
  'ask.s1': { en: 'Why is {coin} rated like this?', fr: 'Pourquoi {coin} a-t-il cette note ?', ar: 'علاش {coin} خذات التقييم هذا؟' },
  'ask.s2': { en: 'What would push {coin} higher?', fr: 'Qu’est-ce qui ferait monter le score de {coin} ?', ar: 'شنوّة ينجّم يطلّع درجة {coin}؟' },
  'ask.s3': { en: 'Is the market risky today?', fr: 'Le marché est-il risqué aujourd’hui ?', ar: 'السوق فيه risk اليوم؟' },
  'ask.off': { en: 'The AI is offline right now.', fr: 'L’IA est indisponible pour le moment.', ar: 'الذكاء الاصطناعي موش خدّام توّا.' },

  'pf.title': { en: 'Your holdings', fr: 'Vos avoirs', ar: 'الـ coins اللي عندك' },
  'pf.intro': {
    en: "Track value and profit. Your holdings never change a coin's score. Saved only on this device.",
    fr: 'Suivez valeur et gains. Vos avoirs ne changent jamais le score d’une crypto. Enregistré uniquement sur cet appareil.',
    ar: 'تبّع القيمة والربح. اللي عندك عمرو ما يبدّل درجة حتى coin. محفوظ كان في الجهاز هذا.',
  },
  'pf.coin': { en: 'Coin', fr: 'Crypto', ar: 'الـ coin' },
  'pf.amount': { en: 'Amount', fr: 'Quantité', ar: 'الكمية' },
  'pf.avg': { en: 'Avg buy price', fr: 'Prix d’achat moyen', ar: 'معدّل سوم الشراية' },
  'pf.value': { en: 'Value', fr: 'Valeur', ar: 'القيمة' },
  'pf.pnl': { en: 'Profit / loss', fr: 'Gain / perte', ar: 'الربح / الخسارة' },
  'pf.total': { en: 'Total value', fr: 'Valeur totale', ar: 'القيمة الكلّ' },
  'pf.add': { en: 'Add a holding', fr: 'Ajouter un avoir', ar: 'زيد coin عندك' },
  'pf.remove': { en: 'Remove', fr: 'Retirer', ar: 'نحّي' },
  'pf.empty': {
    en: 'No holdings yet. Add what you own to see its value and profit.',
    fr: 'Aucun avoir. Ajoutez ce que vous possédez pour voir sa valeur et vos gains.',
    ar: 'ما عندك حتى شي توّا. زيد اللي عندك باش تشوف قيمتو والربح متاعك.',
  },
  'pf.settings': { en: 'Data settings', fr: 'Paramètres des données', ar: 'إعدادات المعطيات' },
  'pf.source': { en: 'Market data', fr: 'Données de marché', ar: 'معطيات السوق' },
  'pf.quote': { en: 'Priced in', fr: 'Prix en', ar: 'السوم بـ' },
  'pf.alerts': { en: 'Send to my channels', fr: 'Envoyer sur mes canaux', ar: 'ابعث للقنوات متاعي' },
  'pf.alertsIntro': {
    en: 'Push the current snapshot to a configured Discord or WhatsApp channel.',
    fr: 'Envoyez l’instantané actuel vers un canal Discord ou WhatsApp configuré.',
    ar: 'ابعث الصورة الحالية لقناة Discord ولا WhatsApp محضّرة.',
  },
  'pf.ready': { en: 'ready', fr: 'prêt', ar: 'حاضر' },
  'pf.notSet': { en: 'not set up', fr: 'non configuré', ar: 'موش محضّر' },
  'pf.send': { en: 'Send update', fr: 'Envoyer', ar: 'ابعث التحديث' },
  'pf.sending': { en: 'Sending…', fr: 'Envoi…', ar: 'نبعثو…' },
  'pf.pickChannel': { en: 'Pick at least one channel.', fr: 'Choisissez au moins un canal.', ar: 'اختار قناة وحدة على الأقل.' },
  'pf.sent': { en: 'Sent to {n} channel(s).', fr: 'Envoyé à {n} canal(aux).', ar: 'تبعث لـ {n} قناة.' },
  'pf.noChannel': { en: 'No channel is configured yet.', fr: 'Aucun canal n’est configuré.', ar: 'حتى قناة موش محضّرة توّا.' },

  'foot.disclaimer': {
    en: 'Free during the beta. Rule-based grades, identical for everyone. Not financial advice.',
    fr: 'Gratuit pendant la bêta. Notes fondées sur des règles, identiques pour tous. Pas un conseil financier.',
    ar: 'بلاش في فترة التجربة. تقييمات بقواعد ثابتة، كيف كيف للناس الكل. موش نصيحة مالية.',
  },
  'foot.data': { en: 'Market data', fr: 'Données', ar: 'المعطيات' },
  'foot.telegram': { en: 'Join us on Telegram', fr: 'Rejoignez-nous sur Telegram', ar: 'انضمّ لينا في Telegram' },
  'foot.telegramHint': {
    en: 'Today’s karats every morning, the market weather, and a place to ask questions.',
    fr: 'Les carats du jour chaque matin, la météo du marché, et un endroit pour poser vos questions.',
    ar: 'القيراطات متاع اليوم كل صباح، طقس السوق، وبلاصة تسأل فيها.',
  },
  'foot.feedback': { en: 'Give feedback', fr: 'Donner mon avis', ar: 'قلّنا رأيك' },
  'foot.feedbackHint': {
    en: 'Testing Qirat? 30 seconds, anonymous. It shapes what gets built next.',
    fr: 'Vous testez Qirat ? 30 secondes, anonyme. Cela oriente la suite.',
    ar: 'تجرّب في قيراط؟ 30 ثانية وبلا اسم. رأيك يقرّر شنوّة نبنيو من بعد.',
  },

  'guide.title': { en: 'How Qirat works', fr: 'Comment marche Qirat', ar: 'كيفاش يخدم قيراط' },
  'guide.sub': {
    en: 'A karat grades gold. Qirat grades coins.',
    fr: 'Le carat note l’or. Qirat note les cryptos.',
    ar: 'القيراط يوزن الذهب. وقيراط يوزن الـ coins.',
  },
  'guide.1t': { en: 'Add your coins', fr: 'Ajoutez vos cryptos', ar: 'زيد الـ coins متاعك' },
  'guide.1b': {
    en: 'Tap "Edit list" under Your coins and add the coins you follow. Each one gets a karat, like gold.',
    fr: 'Touchez « Modifier » sous Vos cryptos et ajoutez celles que vous suivez. Chacune reçoit un carat, comme l’or.',
    ar: 'انقر على «بدّل الليستة» تحت الـ coins متاعك وزيد الـ coins اللي تتبّع فيهم. كل وحدة تاخذ قيراط، كيما الذهب.',
  },
  'guide.2t': { en: 'Read the karat', fr: 'Lisez le carat', ar: 'اقرا القيراط' },
  'guide.2b': {
    en: '24K = calm and climbing, 10K = wild or sliding. The karat compares each coin with 18 major coins on two things: how calm it has been and how strong its 90-day trend is. It is never an instruction to buy or sell.',
    fr: '24K = calme et en hausse, 10K = agitée ou en baisse. Le carat compare chaque crypto à 18 grandes cryptos sur deux points : son calme et la force de sa tendance sur 90 jours. Ce n’est jamais une consigne d’achat ou de vente.',
    ar: '24K = باهية وطالعة، 10K = متقلّبة ولا هابطة. القيراط يقارن كل coin مع 18 coin كبار في حاجتين: قدّاش كانت هادية وقدّاش الاتجاه متاعها في 90 يوم قوي. وعمرو ما هو أمر باش تشري ولا تبيع.',
  },
  'guide.3t': { en: 'Know the risk', fr: 'Connaissez le risque', ar: 'اعرف الـ risk' },
  'guide.3b': {
    en: 'Tap any coin to see its risk: how much it moves on a typical day and what a rough month could cost on 100 TND. Risk is the most reliable part of the grade.',
    fr: 'Touchez une crypto pour voir son risque : combien elle bouge un jour normal et ce qu’un mauvais mois pourrait coûter sur 100 TND. Le risque est la partie la plus fiable de la note.',
    ar: 'انقر على أي coin باش تشوف الـ risk متاعها: قدّاش تتحرّك في نهار عادي وقدّاش ينجّم يكلّفك شهر صعيب على 100 دينار. الـ risk هو أكثر جزء صحيح في التقييم.',
  },
  'guide.4t': { en: 'Check the weather', fr: 'Regardez la météo', ar: 'شوف الطقس' },
  'guide.4b': {
    en: 'Calm, choppy or stormy: the whole market’s mood, led by Bitcoin and its 50-day average. Karats compare coins with each other; in a storm even 24K coins usually fall.',
    fr: 'Calme, agité ou orageux : l’humeur de tout le marché, menée par le bitcoin et sa moyenne 50 jours. Les carats comparent les cryptos entre elles ; dans l’orage, même les 24K baissent souvent.',
    ar: 'صاحي، مغيّم ولا خايب: مزاج السوق الكل، يقودو Bitcoin والمعدّل متاعو متاع 50 يوم. القيراط يقارن الـ coins بين بعضهم؛ وفي الطقس الخايب حتى الـ 24K عادةً يهبطو.',
  },
  'guide.5t': { en: 'We never ask for money', fr: 'Nous ne demandons jamais d’argent', ar: 'عمرنا ما نطلبو منك فلوس' },
  'guide.5b': {
    en: 'Qirat never messages you first, never asks you to send money and has no VIP group. Anyone who does is not us. No ads, no affiliate links.',
    fr: 'Qirat ne vous écrit jamais en premier, ne vous demande jamais d’envoyer de l’argent et n’a pas de groupe VIP. Si quelqu’un le fait, ce n’est pas nous. Ni pub, ni liens affiliés.',
    ar: 'قيراط عمرو ما يبعثلك هو الأوّل، عمرو ما يطلب منك تبعث فلوس، وما عندوش قروب VIP. اللي يعمل هكّا موش احنا. لا إشهار ولا روابط affiliate.',
  },
  'guide.6t': { en: 'Ask questions', fr: 'Posez vos questions', ar: 'اسأل' },
  'guide.6b': {
    en: 'The Ask tab writes a plain-language briefing and answers questions in your language, using only the live data.',
    fr: 'L’onglet Demander rédige un briefing simple et répond dans votre langue, uniquement à partir des données en direct.',
    ar: 'تبويب «اسأل» يكتب ملخّص بالكلام الساهل ويجاوب على أسئلتك بلغتك، كان من المعطيات الحيّة.',
  },
  'guide.close': { en: 'Got it', fr: 'Compris', ar: 'فهمت' },
} satisfies Record<string, Entry>

export type UIKey = keyof typeof UI

// Strings produced by the scoring engine (breakdown labels, reasons, risks).
// Keyed by the engine's English text; unknown strings fall back to English.
const ENGINE: Record<string, Omit<Entry, 'en'>> = {
  'Above 7-day average': { fr: 'Au-dessus de la moyenne 7 j', ar: 'فوق المعدّل متاع 7 أيّام' },
  'Below 7-day average': { fr: 'Sous la moyenne 7 j', ar: 'تحت المعدّل متاع 7 أيّام' },
  'Above 30-day average': { fr: 'Au-dessus de la moyenne 30 j', ar: 'فوق المعدّل متاع 30 يوم' },
  'Below 30-day average': { fr: 'Sous la moyenne 30 j', ar: 'تحت المعدّل متاع 30 يوم' },
  'Strong 7-day return': { fr: 'Forte hausse sur 7 j', ar: 'مردود قوي في 7 أيّام' },
  'Weak 7-day return': { fr: 'Forte baisse sur 7 j', ar: 'طيحة قويّة في 7 أيّام' },
  'Rising volume': { fr: 'Volume en hausse', ar: 'حجم تداول يزيد' },
  'Fading volume': { fr: 'Volume en baisse', ar: 'حجم تداول ينقص' },
  'Contrarian fear': { fr: 'Peur du marché (contrarien)', ar: 'خوف في السوق (إشارة بالعكس)' },
  'Market greed': { fr: 'Avidité du marché', ar: 'طمع في السوق' },
  'Sharp 24h drop': { fr: 'Chute brutale sur 24 h', ar: 'هبطة قويّة في 24 ساعة' },
  'Extended 30-day move': { fr: 'Hausse étirée sur 30 j', ar: 'طلعة زايدة في 30 يوم' },
  'Sustained 30-day uptrend': { fr: 'Hausse durable sur 30 j', ar: 'طلعة ثابتة في 30 يوم' },
  'Uptrend structure': { fr: 'Structure haussière', ar: 'شكل اتجاه طالع' },
  'Volume conviction': { fr: 'Volume convaincant', ar: 'حجم تداول يأكّد' },
  'Steady 24h follow-through': { fr: 'Hausse régulière sur 24 h', ar: 'طلعة ثابتة في 24 ساعة' },

  'Price is above the 7-day average, showing short-term strength.': {
    fr: 'Le prix est au-dessus de sa moyenne 7 jours : force à court terme.',
    ar: 'السوم فوق المعدّل متاع 7 أيّام: قوّة على المدى القصير.',
  },
  'Price is below the 7-day average, so momentum is weak.': {
    fr: 'Le prix est sous sa moyenne 7 jours : l’élan est faible.',
    ar: 'السوم تحت المعدّل متاع 7 أيّام، يعني الدفعة ضعيفة.',
  },
  'Price is above the 30-day average, confirming broader trend support.': {
    fr: 'Le prix est au-dessus de sa moyenne 30 jours : la tendance de fond le soutient.',
    ar: 'السوم فوق المعدّل متاع 30 يوم، وهذا يأكّد الاتجاه الكبير.',
  },
  'Price is below the 30-day average, which raises trend risk.': {
    fr: 'Le prix est sous sa moyenne 30 jours : le risque de tendance augmente.',
    ar: 'السوم تحت المعدّل متاع 30 يوم، وهذا يكبّر الـ risk متاع الاتجاه.',
  },
  'The 7-day return is strong.': { fr: 'La hausse sur 7 jours est forte.', ar: 'المردود في 7 أيّام قوي.' },
  'The 7-day return is sharply negative.': {
    fr: 'La baisse sur 7 jours est marquée.',
    ar: 'المردود في 7 أيّام طايح برشا.',
  },
  'Recent volume is rising, which can confirm the move.': {
    fr: 'Le volume récent augmente, ce qui peut confirmer le mouvement.',
    ar: 'حجم التداول الأخير يطلع، وهذا ينجّم يأكّد الحركة.',
  },
  'Recent volume is fading, so conviction is lower.': {
    fr: 'Le volume récent baisse : la conviction est plus faible.',
    ar: 'حجم التداول الأخير ينقص، يعني الثقة أضعف.',
  },
  'Market sentiment is fearful, which can create discounted entries.': {
    fr: 'Le marché a peur, ce qui peut créer des prix décotés.',
    ar: 'مزاج السوق خايف، وهذا ينجّم يعمل سوامات رخيصة.',
  },
  'Market sentiment is greedy, so chasing entries is riskier.': {
    fr: 'Le marché est avide : courir après les prix est plus risqué.',
    ar: 'مزاج السوق طمّاع، يعني الجري ورا السوم فيه risk أكثر.',
  },
  'The 30-day trend is steadily higher without being overextended.': {
    fr: 'La tendance sur 30 jours monte régulièrement sans excès.',
    ar: 'الاتجاه في 30 يوم طالع بثبات من غير مبالغة.',
  },
  'Price sits above a rising 7-over-30-day average stack — a clean uptrend structure.': {
    fr: 'Le prix est au-dessus de moyennes 7 et 30 jours croissantes : une structure haussière nette.',
    ar: 'السوم فوق المعدّلات متاع 7 و30 يوم وهوما طالعين: شكل اتجاه طالع واضح.',
  },
  'Volume is surging while price holds its short-term trend — strong conviction.': {
    fr: 'Le volume s’envole pendant que le prix tient sa tendance : forte conviction.',
    ar: 'حجم التداول يطير والسوم شادّ الاتجاه القصير متاعو: ثقة قويّة.',
  },
  "Today's gain is steady rather than a spike — consistent with a durable trend.": {
    fr: 'La hausse du jour est régulière plutôt qu’un pic : cohérent avec une tendance durable.',
    ar: 'طلعة اليوم ثابتة موش قفزة مفاجئة: تمشي مع اتجاه يدوم.',
  },
  'Fear can persist longer than expected during broad sell-offs.': {
    fr: 'La peur peut durer plus longtemps que prévu lors des ventes massives.',
    ar: 'الخوف ينجّم يطوّل أكثر من المتوقّع وقت البيع الكبير.',
  },
  'Extreme greed can precede fast pullbacks.': {
    fr: 'L’avidité extrême précède souvent des replis rapides.',
    ar: 'الطمع الكبير ينجّم يجي قبل طيحات سريعة.',
  },
  'The asset dropped heavily in 24 hours, so volatility risk is elevated.': {
    fr: 'Forte chute sur 24 heures : le risque de volatilité est élevé.',
    ar: 'الـ coin طاحت بقوّة في 24 ساعة، يعني الـ risk متاع التقلّب عالي.',
  },
  'The 30-day move is extended, making a cooldown more likely.': {
    fr: 'La hausse sur 30 jours est étirée : un repli devient plus probable.',
    ar: 'الطلعة في 30 يوم زايدة، يعني الهدوء ولّى أقرب.',
  },
  'The asset remains far below its all-time high, which may signal structural weakness.': {
    fr: 'L’actif reste loin de son plus haut historique, signe possible de faiblesse structurelle.',
    ar: 'الـ coin مازالت بعيدة برشا على أعلى سوم وصلتلو، وهذا ينجّم يعني ضعف في العمق.',
  },
  'Crypto prices can move faster than the indicators update.': {
    fr: 'Les prix crypto peuvent bouger plus vite que les indicateurs.',
    ar: 'سوامات الـ crypto تنجّم تتحرّك أسرع من المؤشرات.',
  },
  'News, regulation, and liquidity shocks can invalidate the signal.': {
    fr: 'Actualités, régulation et chocs de liquidité peuvent invalider la note.',
    ar: 'الأخبار، القوانين وصدمات الـ liquidity ينجّمو يبطّلو التقييم.',
  },
  'Position is up over 35% while market sentiment is greedy.': {
    fr: 'La position gagne plus de 35 % alors que le marché est avide.',
    ar: 'الـ position رابحة أكثر من 35% والسوق طمّاع.',
  },
  "Position is down over 20% and the coin's setup is weak.": {
    fr: 'La position perd plus de 20 % et la crypto est notée Faible.',
    ar: 'الـ position خاسرة أكثر من 20% وتقييم الـ coin ضعيف.',
  },
  'Risk-off market: BTC is below its 200-day average': {
    fr: 'Marché défavorable : le BTC est sous sa moyenne 200 jours',
    ar: 'سوق حذر: Bitcoin تحت المعدّل متاعو متاع 200 يوم',
  },

  // ratings, risk levels and Fear & Greed classifications
  STRONG: { fr: 'Forte', ar: 'قوي' },
  NEUTRAL: { fr: 'Neutre', ar: 'محايد' },
  WEAK: { fr: 'Faible', ar: 'ضعيف' },
  High: { fr: 'Élevé', ar: 'عالية' },
  Medium: { fr: 'Moyen', ar: 'متوسطة' },
  Controlled: { fr: 'Maîtrisé', ar: 'تحت السيطرة' },
  'Extreme Fear': { fr: 'Peur extrême', ar: 'خوف كبير' },
  Fear: { fr: 'Peur', ar: 'خوف' },
  Neutral: { fr: 'Neutre', ar: 'محايد' },
  Greed: { fr: 'Avidité', ar: 'طمع' },
  'Extreme Greed': { fr: 'Avidité extrême', ar: 'طمع كبير' },
}

const ENGLISH_RATING: Record<string, string> = { STRONG: 'Strong', NEUTRAL: 'Neutral', WEAK: 'Weak' }

const STORAGE_KEY = 'qirat.lang'

export function initialLang(): Lang {
  // A link like qirat.tn/?lang=ar (used in our Darija social bios) wins over
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
  const nav = (navigator.language || 'en').slice(0, 2)
  return nav === 'fr' || nav === 'ar' ? nav : 'en'
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
    if (lang === 'en') return ENGLISH_RATING[text] ?? text
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
