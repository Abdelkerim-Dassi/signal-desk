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
  'app.tagline': { en: 'Every coin has a karat', fr: 'Chaque crypto a son carat', ar: 'لكل عملة قيراطها' },
  'nav.today': { en: 'Today', fr: "Aujourd'hui", ar: 'اليوم' },
  'nav.record': { en: 'Track record', fr: 'Historique', ar: 'السجل' },
  'nav.ask': { en: 'Ask', fr: 'Demander', ar: 'اسأل' },
  'nav.portfolio': { en: 'Portfolio', fr: 'Portefeuille', ar: 'المحفظة' },
  'top.help': { en: 'How Qirat works', fr: 'Comment marche Qirat', ar: 'كيف يعمل قيراط' },
  'top.theme': { en: 'Switch light / dark', fr: 'Thème clair / sombre', ar: 'الوضع الفاتح / الداكن' },
  'top.language': { en: 'Language', fr: 'Langue', ar: 'اللغة' },

  'greet.morning': { en: 'Good morning', fr: 'Bonjour', ar: 'صباح الخير' },
  'greet.afternoon': { en: 'Good afternoon', fr: 'Bon après-midi', ar: 'مساء الخير' },
  'greet.evening': { en: 'Good evening', fr: 'Bonsoir', ar: 'مساء الخير' },
  'hero.on.title': { en: 'The market is risk-on', fr: 'Le marché est favorable', ar: 'السوق في وضع إيجابي' },
  'hero.off.title': { en: 'The market is risk-off', fr: 'Le marché est défavorable', ar: 'السوق في وضع حذر' },
  'hero.unknown.title': { en: 'Reading the market…', fr: 'Lecture du marché…', ar: 'جارٍ قراءة السوق…' },
  'hero.on.body': {
    en: 'Bitcoin is {pct} above its 200-day average, so Strong ratings are switched on.',
    fr: 'Le bitcoin est {pct} au-dessus de sa moyenne sur 200 jours : les notes Fortes sont activées.',
    ar: 'البيتكوين أعلى من متوسطه لـ200 يوم بنسبة {pct}، لذلك التقييمات القوية مفعّلة.',
  },
  'hero.off.body': {
    en: 'Bitcoin is {pct} below its 200-day average, so every score is capped at 66 and nothing rates Strong.',
    fr: 'Le bitcoin est {pct} sous sa moyenne sur 200 jours : tous les scores sont plafonnés à 66, aucune note Forte.',
    ar: 'البيتكوين أدنى من متوسطه لـ200 يوم بنسبة {pct}، لذلك كل الدرجات محدودة عند 66 ولا يوجد تقييم قوي.',
  },
  'hero.why': {
    en: 'In our 2021–26 backtest, Strong setups only beat the market while Bitcoin held this line.',
    fr: 'Dans notre backtest 2021–26, les notes Fortes ne battaient le marché que lorsque le bitcoin restait au-dessus de ce seuil.',
    ar: 'في اختبارنا التاريخي 2021–26، لم تتفوق التقييمات القوية على السوق إلا عندما بقي البيتكوين فوق هذا الخط.',
  },
  'hero.mood': { en: 'Market mood', fr: 'Humeur du marché', ar: 'مزاج السوق' },
  'hero.mcap': { en: 'Total market', fr: 'Marché total', ar: 'السوق الكلي' },
  'hero.btcDom': { en: 'BTC dominance', fr: 'Dominance BTC', ar: 'هيمنة البيتكوين' },
  'hero.updated': { en: 'Updated {time}', fr: 'Mis à jour à {time}', ar: 'آخر تحديث {time}' },
  'hero.refreshing': { en: 'Refreshing…', fr: 'Actualisation…', ar: 'جارٍ التحديث…' },
  'hero.failed': { en: 'Update failed, retrying soon', fr: 'Échec de la mise à jour, nouvel essai bientôt', ar: 'تعذّر التحديث، ستتم إعادة المحاولة' },
  'hero.refresh': { en: 'Refresh', fr: 'Actualiser', ar: 'تحديث' },
  'hero.24h': { en: '24h', fr: '24 h', ar: '24 س' },

  'coins.title': { en: 'Your coins', fr: 'Vos cryptos', ar: 'عملاتك' },
  'coins.legend': { en: 'Strong ≥67 · Weak ≤38', fr: 'Forte ≥67 · Faible ≤38', ar: 'قوي ≥67 · ضعيف ≤38' },
  'coins.edit': { en: 'Edit list', fr: 'Modifier', ar: 'تعديل' },
  'coins.done': { en: 'Done', fr: 'Terminé', ar: 'تم' },
  'coins.add': { en: 'Add', fr: 'Ajouter', ar: 'أضف' },
  'coins.addPlaceholder': { en: 'Add a coin, e.g. SOL', fr: 'Ajouter une crypto, ex. SOL', ar: 'أضف عملة، مثلاً SOL' },
  'coins.popular': { en: 'Popular', fr: 'Populaires', ar: 'الأكثر شيوعاً' },
  'coins.remove': { en: 'Remove {coin}', fr: 'Retirer {coin}', ar: 'إزالة {coin}' },
  'coins.loading': { en: 'Grading your coins…', fr: 'Évaluation de vos cryptos…', ar: 'جارٍ تقييم عملاتك…' },
  'coins.empty': { en: 'Add a coin to see its score.', fr: 'Ajoutez une crypto pour voir son score.', ar: 'أضف عملة لترى درجتها.' },
  'coins.notFound': { en: "Couldn't load: {list}", fr: 'Introuvable : {list}', ar: 'تعذّر التحميل: {list}' },

  'coin.today': { en: 'today', fr: "aujourd'hui", ar: 'اليوم' },
  'coin.7d': { en: '7 days', fr: '7 jours', ar: '7 أيام' },
  'coin.why': { en: 'Why this score', fr: 'Pourquoi ce score', ar: 'لماذا هذه الدرجة' },
  'coin.base': { en: 'Starting point', fr: 'Point de départ', ar: 'نقطة البداية' },
  'coin.score': { en: 'Score', fr: 'Score', ar: 'الدرجة' },
  'coin.cap': { en: 'Risk-off cap', fr: 'Plafond marché défavorable', ar: 'حدّ السوق الحذر' },
  'coin.beforeCap': { en: 'before the cap: {n}', fr: 'avant plafond : {n}', ar: 'قبل الحدّ: {n}' },
  'coin.helps': { en: 'What helps', fr: 'Ce qui aide', ar: 'ما يدعمها' },
  'coin.watch': { en: 'Watch out', fr: 'Points de vigilance', ar: 'انتبه إلى' },
  'coin.risk': { en: 'Risk', fr: 'Risque', ar: 'المخاطرة' },
  'coin.capped': { en: 'Capped · risk-off', fr: 'Plafonné · défavorable', ar: 'محدود · وضع حذر' },
  'coin.notAdvice': {
    en: "A rating describes the coin's chart, not what you should do with your money.",
    fr: 'Une note décrit le graphique de la crypto, pas ce que vous devez faire de votre argent.',
    ar: 'التقييم يصف الرسم البياني للعملة، وليس ما يجب أن تفعله بأموالك.',
  },
  'coin.details': { en: 'Show details', fr: 'Voir le détail', ar: 'عرض التفاصيل' },

  'moves.title': { en: "What's moving", fr: 'Ce qui bouge', ar: 'ما الذي يتحرك' },
  'moves.news': { en: 'Headlines', fr: 'À la une', ar: 'العناوين' },
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

  'ask.briefTitle': { en: "Today's briefing", fr: 'Le briefing du jour', ar: 'موجز اليوم' },
  'ask.briefIntro': {
    en: "A plain-language read of today's market for your coins, written by AI from the live numbers.",
    fr: 'Une lecture simple du marché du jour pour vos cryptos, rédigée par l’IA à partir des chiffres en direct.',
    ar: 'قراءة مبسّطة لسوق اليوم لعملاتك، يكتبها الذكاء الاصطناعي من الأرقام المباشرة.',
  },
  'ask.generate': { en: 'Write my briefing', fr: 'Rédiger mon briefing', ar: 'اكتب الموجز' },
  'ask.regenerate': { en: 'Rewrite', fr: 'Réécrire', ar: 'أعد الكتابة' },
  'ask.writing': { en: 'Writing…', fr: 'Rédaction…', ar: 'جارٍ الكتابة…' },
  'ask.throttled': { en: 'Please wait {s}s before rewriting.', fr: 'Patientez {s} s avant de réécrire.', ar: 'انتظر {s} ثانية قبل إعادة الكتابة.' },
  'ask.chatTitle': { en: 'Ask Qirat', fr: 'Demandez à Qirat', ar: 'اسأل قيراط' },
  'ask.chatIntro': {
    en: 'Ask about any coin on your list. Answers use only the live data and never give personal advice.',
    fr: 'Posez une question sur vos cryptos. Les réponses s’appuient uniquement sur les données en direct, jamais sur des conseils personnels.',
    ar: 'اسأل عن أي عملة في قائمتك. الإجابات تعتمد على البيانات المباشرة فقط ولا تقدم نصائح شخصية.',
  },
  'ask.placeholder': { en: 'Ask about your coins…', fr: 'Une question sur vos cryptos…', ar: 'اسأل عن عملاتك…' },
  'ask.send': { en: 'Send', fr: 'Envoyer', ar: 'إرسال' },
  'ask.s1': { en: 'Why is {coin} rated like this?', fr: 'Pourquoi {coin} a-t-il cette note ?', ar: 'لماذا حصلت {coin} على هذا التقييم؟' },
  'ask.s2': { en: 'What would push {coin} higher?', fr: 'Qu’est-ce qui ferait monter le score de {coin} ?', ar: 'ما الذي قد يرفع درجة {coin}؟' },
  'ask.s3': { en: 'Is the market risky today?', fr: 'Le marché est-il risqué aujourd’hui ?', ar: 'هل السوق خطِر اليوم؟' },
  'ask.off': { en: 'The AI is offline right now.', fr: 'L’IA est indisponible pour le moment.', ar: 'الذكاء الاصطناعي غير متاح حالياً.' },

  'pf.title': { en: 'Your holdings', fr: 'Vos avoirs', ar: 'ممتلكاتك' },
  'pf.intro': {
    en: "Track value and profit. Your holdings never change a coin's score. Saved only on this device.",
    fr: 'Suivez valeur et gains. Vos avoirs ne changent jamais le score d’une crypto. Enregistré uniquement sur cet appareil.',
    ar: 'تابع القيمة والربح. ممتلكاتك لا تغيّر درجة أي عملة أبداً. تُحفظ على هذا الجهاز فقط.',
  },
  'pf.coin': { en: 'Coin', fr: 'Crypto', ar: 'العملة' },
  'pf.amount': { en: 'Amount', fr: 'Quantité', ar: 'الكمية' },
  'pf.avg': { en: 'Avg buy price', fr: 'Prix d’achat moyen', ar: 'متوسط سعر الشراء' },
  'pf.value': { en: 'Value', fr: 'Valeur', ar: 'القيمة' },
  'pf.pnl': { en: 'Profit / loss', fr: 'Gain / perte', ar: 'الربح / الخسارة' },
  'pf.total': { en: 'Total value', fr: 'Valeur totale', ar: 'القيمة الإجمالية' },
  'pf.add': { en: 'Add a holding', fr: 'Ajouter un avoir', ar: 'أضف أصلاً' },
  'pf.remove': { en: 'Remove', fr: 'Retirer', ar: 'إزالة' },
  'pf.empty': {
    en: 'No holdings yet. Add what you own to see its value and profit.',
    fr: 'Aucun avoir. Ajoutez ce que vous possédez pour voir sa valeur et vos gains.',
    ar: 'لا توجد ممتلكات بعد. أضف ما تملكه لترى قيمته وربحك.',
  },
  'pf.settings': { en: 'Data settings', fr: 'Paramètres des données', ar: 'إعدادات البيانات' },
  'pf.source': { en: 'Market data', fr: 'Données de marché', ar: 'بيانات السوق' },
  'pf.quote': { en: 'Priced in', fr: 'Prix en', ar: 'التسعير بـ' },
  'pf.alerts': { en: 'Send to my channels', fr: 'Envoyer sur mes canaux', ar: 'أرسل إلى قنواتي' },
  'pf.alertsIntro': {
    en: 'Push the current snapshot to a configured Discord or WhatsApp channel.',
    fr: 'Envoyez l’instantané actuel vers un canal Discord ou WhatsApp configuré.',
    ar: 'أرسل اللقطة الحالية إلى قناة Discord أو WhatsApp مُعدّة.',
  },
  'pf.ready': { en: 'ready', fr: 'prêt', ar: 'جاهز' },
  'pf.notSet': { en: 'not set up', fr: 'non configuré', ar: 'غير مُعدّ' },
  'pf.send': { en: 'Send update', fr: 'Envoyer', ar: 'أرسل التحديث' },
  'pf.sending': { en: 'Sending…', fr: 'Envoi…', ar: 'جارٍ الإرسال…' },
  'pf.pickChannel': { en: 'Pick at least one channel.', fr: 'Choisissez au moins un canal.', ar: 'اختر قناة واحدة على الأقل.' },
  'pf.sent': { en: 'Sent to {n} channel(s).', fr: 'Envoyé à {n} canal(aux).', ar: 'أُرسل إلى {n} قناة.' },
  'pf.noChannel': { en: 'No channel is configured yet.', fr: 'Aucun canal n’est configuré.', ar: 'لا توجد قناة مُعدّة بعد.' },

  'foot.disclaimer': {
    en: 'Rule-based ratings, identical for everyone. Not financial advice.',
    fr: 'Notes fondées sur des règles, identiques pour tous. Pas un conseil financier.',
    ar: 'تقييمات قائمة على قواعد ثابتة ومتطابقة للجميع. ليست نصيحة مالية.',
  },
  'foot.data': { en: 'Market data', fr: 'Données', ar: 'البيانات' },
  'foot.telegram': { en: 'Join us on Telegram', fr: 'Rejoignez-nous sur Telegram', ar: 'انضم إلينا على تيليجرام' },
  'foot.telegramHint': {
    en: 'Daily karats, the Friday report card, and a place to argue with the score.',
    fr: 'Les carats du jour, le bilan du vendredi, et un endroit pour contester le score.',
    ar: 'قراريط يومية، وتقرير الجمعة، ومكان لمناقشة الدرجة.',
  },
  'foot.feedback': { en: 'Give feedback', fr: 'Donner mon avis', ar: 'شارك رأيك' },
  'foot.feedbackHint': {
    en: 'Testing Qirat? 30 seconds, anonymous. It shapes what gets built next.',
    fr: 'Vous testez Qirat ? 30 secondes, anonyme. Cela oriente la suite.',
    ar: 'تجرّب قيراط؟ 30 ثانية وبدون اسم. رأيك يحدد ما سنبنيه بعد ذلك.',
  },

  'guide.title': { en: 'How Qirat works', fr: 'Comment marche Qirat', ar: 'كيف يعمل قيراط' },
  'guide.sub': {
    en: 'A karat grades gold. Qirat grades coins.',
    fr: 'Le carat note l’or. Qirat note les cryptos.',
    ar: 'القيراط يقيس جودة الذهب، وقيراط يقيس جودة العملات.',
  },
  'guide.1t': { en: 'Add your coins', fr: 'Ajoutez vos cryptos', ar: 'أضف عملاتك' },
  'guide.1b': {
    en: 'Tap "Edit list" under Your coins and add the coins you follow. Each one gets a score from 0 to 100.',
    fr: 'Touchez « Modifier » sous Vos cryptos et ajoutez celles que vous suivez. Chacune reçoit un score de 0 à 100.',
    ar: 'اضغط «تعديل» تحت عملاتك وأضف العملات التي تتابعها. تحصل كل عملة على درجة من 0 إلى 100.',
  },
  'guide.2t': { en: 'Read the rating', fr: 'Lisez la note', ar: 'اقرأ التقييم' },
  'guide.2b': {
    en: 'Strong (67+), Neutral, or Weak (38 or less). A rating describes the chart: trend, momentum, volume and market mood. It is never an instruction to buy or sell.',
    fr: 'Forte (67+), Neutre ou Faible (38 ou moins). Une note décrit le graphique : tendance, élan, volume et humeur du marché. Ce n’est jamais une consigne d’achat ou de vente.',
    ar: 'قوي (67 فأكثر) أو محايد أو ضعيف (38 أو أقل). التقييم يصف الرسم البياني: الاتجاه والزخم وحجم التداول ومزاج السوق. وليس أبداً أمراً بالشراء أو البيع.',
  },
  'guide.3t': { en: 'See the math', fr: 'Voyez le calcul', ar: 'شاهد الحساب' },
  'guide.3b': {
    en: 'Tap any coin to open "Why this score": every point added or removed, from a starting point of 50. No black box.',
    fr: 'Touchez une crypto pour ouvrir « Pourquoi ce score » : chaque point ajouté ou retiré, à partir de 50. Aucune boîte noire.',
    ar: 'اضغط على أي عملة لفتح «لماذا هذه الدرجة»: كل نقطة أُضيفت أو طُرحت انطلاقاً من 50. لا شيء مخفي.',
  },
  'guide.4t': { en: 'Check the market switch', fr: 'Regardez l’interrupteur du marché', ar: 'راقب مفتاح السوق' },
  'guide.4b': {
    en: 'When Bitcoin is below its 200-day average the market is risk-off: scores are capped at 66, so nothing rates Strong.',
    fr: 'Quand le bitcoin est sous sa moyenne 200 jours, le marché est défavorable : les scores sont plafonnés à 66, aucune note Forte.',
    ar: 'عندما يكون البيتكوين تحت متوسطه لـ200 يوم يكون السوق في وضع حذر: الدرجات محدودة عند 66 فلا يوجد تقييم قوي.',
  },
  'guide.5t': { en: 'Judge us by the record', fr: 'Jugez-nous sur l’historique', ar: 'احكم علينا من السجل' },
  'guide.5b': {
    en: 'The Track record tab shows how each rating did afterwards: a backtest, plus a live log saved daily and never edited.',
    fr: 'L’onglet Historique montre ce qu’a donné chaque note : un backtest et un journal en direct, enregistré chaque jour sans modification.',
    ar: 'تبويب السجل يعرض أداء كل تقييم لاحقاً: اختبار تاريخي، وسجل مباشر يُحفظ يومياً دون أي تعديل.',
  },
  'guide.6t': { en: 'Ask questions', fr: 'Posez vos questions', ar: 'اطرح أسئلتك' },
  'guide.6b': {
    en: 'The Ask tab writes a plain-language briefing and answers questions in your language, using only the live data.',
    fr: 'L’onglet Demander rédige un briefing simple et répond dans votre langue, uniquement à partir des données en direct.',
    ar: 'تبويب اسأل يكتب موجزاً مبسطاً ويجيب عن أسئلتك بلغتك، اعتماداً على البيانات المباشرة فقط.',
  },
  'guide.close': { en: 'Got it', fr: 'Compris', ar: 'فهمت' },
} satisfies Record<string, Entry>

export type UIKey = keyof typeof UI

// Strings produced by the scoring engine (breakdown labels, reasons, risks).
// Keyed by the engine's English text; unknown strings fall back to English.
const ENGINE: Record<string, Omit<Entry, 'en'>> = {
  'Above 7-day average': { fr: 'Au-dessus de la moyenne 7 j', ar: 'فوق متوسط 7 أيام' },
  'Below 7-day average': { fr: 'Sous la moyenne 7 j', ar: 'تحت متوسط 7 أيام' },
  'Above 30-day average': { fr: 'Au-dessus de la moyenne 30 j', ar: 'فوق متوسط 30 يوماً' },
  'Below 30-day average': { fr: 'Sous la moyenne 30 j', ar: 'تحت متوسط 30 يوماً' },
  'Strong 7-day return': { fr: 'Forte hausse sur 7 j', ar: 'عائد قوي خلال 7 أيام' },
  'Weak 7-day return': { fr: 'Forte baisse sur 7 j', ar: 'تراجع حاد خلال 7 أيام' },
  'Rising volume': { fr: 'Volume en hausse', ar: 'حجم تداول متزايد' },
  'Fading volume': { fr: 'Volume en baisse', ar: 'حجم تداول متراجع' },
  'Contrarian fear': { fr: 'Peur du marché (contrarien)', ar: 'خوف السوق (إشارة معاكسة)' },
  'Market greed': { fr: 'Avidité du marché', ar: 'طمع السوق' },
  'Sharp 24h drop': { fr: 'Chute brutale sur 24 h', ar: 'هبوط حاد خلال 24 ساعة' },
  'Extended 30-day move': { fr: 'Hausse étirée sur 30 j', ar: 'صعود مبالغ فيه خلال 30 يوماً' },
  'Sustained 30-day uptrend': { fr: 'Hausse durable sur 30 j', ar: 'اتجاه صاعد مستمر خلال 30 يوماً' },
  'Uptrend structure': { fr: 'Structure haussière', ar: 'بنية اتجاه صاعد' },
  'Volume conviction': { fr: 'Volume convaincant', ar: 'حجم تداول مؤكِّد' },
  'Steady 24h follow-through': { fr: 'Hausse régulière sur 24 h', ar: 'صعود ثابت خلال 24 ساعة' },

  'Price is above the 7-day average, showing short-term strength.': {
    fr: 'Le prix est au-dessus de sa moyenne 7 jours : force à court terme.',
    ar: 'السعر فوق متوسط 7 أيام، ما يُظهر قوة على المدى القصير.',
  },
  'Price is below the 7-day average, so momentum is weak.': {
    fr: 'Le prix est sous sa moyenne 7 jours : l’élan est faible.',
    ar: 'السعر تحت متوسط 7 أيام، لذا الزخم ضعيف.',
  },
  'Price is above the 30-day average, confirming broader trend support.': {
    fr: 'Le prix est au-dessus de sa moyenne 30 jours : la tendance de fond le soutient.',
    ar: 'السعر فوق متوسط 30 يوماً، ما يؤكد دعم الاتجاه الأوسع.',
  },
  'Price is below the 30-day average, which raises trend risk.': {
    fr: 'Le prix est sous sa moyenne 30 jours : le risque de tendance augmente.',
    ar: 'السعر تحت متوسط 30 يوماً، ما يرفع مخاطر الاتجاه.',
  },
  'The 7-day return is strong.': { fr: 'La hausse sur 7 jours est forte.', ar: 'العائد خلال 7 أيام قوي.' },
  'The 7-day return is sharply negative.': {
    fr: 'La baisse sur 7 jours est marquée.',
    ar: 'العائد خلال 7 أيام سلبي بشكل حاد.',
  },
  'Recent volume is rising, which can confirm the move.': {
    fr: 'Le volume récent augmente, ce qui peut confirmer le mouvement.',
    ar: 'حجم التداول الأخير يرتفع، ما قد يؤكد الحركة.',
  },
  'Recent volume is fading, so conviction is lower.': {
    fr: 'Le volume récent baisse : la conviction est plus faible.',
    ar: 'حجم التداول الأخير يتراجع، لذا القناعة أضعف.',
  },
  'Market sentiment is fearful, which can create discounted entries.': {
    fr: 'Le marché a peur, ce qui peut créer des prix décotés.',
    ar: 'مزاج السوق خائف، ما قد يخلق أسعاراً منخفضة.',
  },
  'Market sentiment is greedy, so chasing entries is riskier.': {
    fr: 'Le marché est avide : courir après les prix est plus risqué.',
    ar: 'مزاج السوق طمّاع، لذا ملاحقة الأسعار أكثر خطورة.',
  },
  'The 30-day trend is steadily higher without being overextended.': {
    fr: 'La tendance sur 30 jours monte régulièrement sans excès.',
    ar: 'الاتجاه خلال 30 يوماً يرتفع بثبات دون مبالغة.',
  },
  'Price sits above a rising 7-over-30-day average stack — a clean uptrend structure.': {
    fr: 'Le prix est au-dessus de moyennes 7 et 30 jours croissantes : une structure haussière nette.',
    ar: 'السعر فوق متوسطَي 7 و30 يوماً الصاعدين: بنية اتجاه صاعد واضحة.',
  },
  'Volume is surging while price holds its short-term trend — strong conviction.': {
    fr: 'Le volume s’envole pendant que le prix tient sa tendance : forte conviction.',
    ar: 'حجم التداول يقفز بينما يحافظ السعر على اتجاهه القصير: قناعة قوية.',
  },
  "Today's gain is steady rather than a spike — consistent with a durable trend.": {
    fr: 'La hausse du jour est régulière plutôt qu’un pic : cohérent avec une tendance durable.',
    ar: 'ارتفاع اليوم ثابت وليس قفزة مفاجئة: يتسق مع اتجاه مستدام.',
  },
  'Fear can persist longer than expected during broad sell-offs.': {
    fr: 'La peur peut durer plus longtemps que prévu lors des ventes massives.',
    ar: 'قد يستمر الخوف أطول من المتوقع خلال موجات البيع الواسعة.',
  },
  'Extreme greed can precede fast pullbacks.': {
    fr: 'L’avidité extrême précède souvent des replis rapides.',
    ar: 'الطمع الشديد قد يسبق تراجعات سريعة.',
  },
  'The asset dropped heavily in 24 hours, so volatility risk is elevated.': {
    fr: 'Forte chute sur 24 heures : le risque de volatilité est élevé.',
    ar: 'هبط الأصل بقوة خلال 24 ساعة، لذا مخاطر التقلب مرتفعة.',
  },
  'The 30-day move is extended, making a cooldown more likely.': {
    fr: 'La hausse sur 30 jours est étirée : un repli devient plus probable.',
    ar: 'الصعود خلال 30 يوماً مبالغ فيه، ما يجعل التهدئة أكثر احتمالاً.',
  },
  'The asset remains far below its all-time high, which may signal structural weakness.': {
    fr: 'L’actif reste loin de son plus haut historique, signe possible de faiblesse structurelle.',
    ar: 'لا يزال الأصل بعيداً عن أعلى مستوى تاريخي له، ما قد يشير إلى ضعف هيكلي.',
  },
  'Crypto prices can move faster than the indicators update.': {
    fr: 'Les prix crypto peuvent bouger plus vite que les indicateurs.',
    ar: 'قد تتحرك أسعار العملات المشفرة أسرع من تحديث المؤشرات.',
  },
  'News, regulation, and liquidity shocks can invalidate the signal.': {
    fr: 'Actualités, régulation et chocs de liquidité peuvent invalider la note.',
    ar: 'الأخبار والتنظيم وصدمات السيولة قد تُبطل التقييم.',
  },
  'Position is up over 35% while market sentiment is greedy.': {
    fr: 'La position gagne plus de 35 % alors que le marché est avide.',
    ar: 'المركز رابح بأكثر من 35٪ بينما مزاج السوق طمّاع.',
  },
  "Position is down over 20% and the coin's setup is weak.": {
    fr: 'La position perd plus de 20 % et la crypto est notée Faible.',
    ar: 'المركز خاسر بأكثر من 20٪ وتقييم العملة ضعيف.',
  },
  'Risk-off market: BTC is below its 200-day average': {
    fr: 'Marché défavorable : le BTC est sous sa moyenne 200 jours',
    ar: 'سوق حذر: البيتكوين تحت متوسطه لـ200 يوم',
  },

  // ratings, risk levels and Fear & Greed classifications
  STRONG: { fr: 'Forte', ar: 'قوي' },
  NEUTRAL: { fr: 'Neutre', ar: 'محايد' },
  WEAK: { fr: 'Faible', ar: 'ضعيف' },
  High: { fr: 'Élevé', ar: 'مرتفعة' },
  Medium: { fr: 'Moyen', ar: 'متوسطة' },
  Controlled: { fr: 'Maîtrisé', ar: 'منضبطة' },
  'Extreme Fear': { fr: 'Peur extrême', ar: 'خوف شديد' },
  Fear: { fr: 'Peur', ar: 'خوف' },
  Neutral: { fr: 'Neutre', ar: 'محايد' },
  Greed: { fr: 'Avidité', ar: 'طمع' },
  'Extreme Greed': { fr: 'Avidité extrême', ar: 'طمع شديد' },
}

const ENGLISH_RATING: Record<string, string> = { STRONG: 'Strong', NEUTRAL: 'Neutral', WEAK: 'Weak' }

const STORAGE_KEY = 'qirat.lang'

export function initialLang(): Lang {
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
