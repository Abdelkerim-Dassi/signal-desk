// Level 2 · Intermediate: read a chart, place a practice trade. Lessons in course order; see ../lessons.ts for the rules.

import type { Lesson } from '../lessons.ts'

export const INTERMEDIATE: Lesson[] = [
  {
    slug: 'trading-vs-holding',
    level: 2,
    minutes: 3,
    title: {
      en: 'Trading and holding: two different games',
      fr: 'Trader ou garder : deux jeux différents',
      ar: 'التداول والاحتفاظ: لعبتان مختلفتان',
    },
    hook: {
      en: 'Same coin, same month, two very different experiences. Know which game you are playing.',
      fr: 'Même crypto, même mois, deux expériences très différentes. Sachez à quel jeu vous jouez.',
      ar: 'نفس العملة ونفس الشهر، وتجربتان مختلفتان تمامًا. اعرف أي لعبة تلعب.',
    },
    terms: ['trading', 'holding', 'day-trading', 'fee'],
    live: {
      kind: 'view',
      view: 'practice',
      label: {
        en: 'Compare your trades with just holding BTC',
        fr: 'Comparer vos opérations au simple fait de garder du BTC',
        ar: 'قارن عملياتك بمجرد الاحتفاظ بـ BTC',
      },
    },
    sections: [
      {
        h: { en: 'Holding: buy and wait', fr: 'Garder : acheter et attendre', ar: 'الاحتفاظ: تشتري وتنتظر' },
        p: {
          en: 'Holding means buying a coin and keeping it for months or years, without reacting to every move. You make few decisions and pay few fees. The hard part is living through long, deep drops: Bitcoin has fallen more than 70% from its top more than once, for example between late 2021 and late 2022.',
          fr: 'Garder (holding), c’est acheter une crypto et la conserver des mois ou des années, sans réagir à chaque mouvement. On prend peu de décisions et on paie peu de frais. Le plus dur, c’est de traverser des baisses longues et profondes : le Bitcoin a déjà perdu plus de 70 % depuis son sommet plus d’une fois, par exemple entre fin 2021 et fin 2022.',
          ar: 'الاحتفاظ (holding) يعني أن تشتري عملة وتبقيها عندك أشهرًا أو سنوات، دون أن تتفاعل مع كل حركة. تأخذ قرارات قليلة وتدفع رسومًا قليلة. الصعب هو تحمّل الهبوط الطويل والعميق: Bitcoin فقد أكثر من 70% من قمته أكثر من مرة، مثلًا بين نهاية 2021 ونهاية 2022.',
        },
      },
      {
        h: { en: 'Trading: buy and sell often', fr: 'Trader : acheter et vendre souvent', ar: 'التداول: تشتري وتبيع كثيرًا' },
        p: {
          en: 'Trading means buying and selling often to catch price moves, sometimes several times a day (day trading). Every trade pays a fee and the spread, and every trade is a new decision you can get wrong. Fear and excitement push people to act at the worst moments.',
          fr: 'Trader, c’est acheter et vendre souvent pour profiter des mouvements de prix, parfois plusieurs fois par jour (le day trading). Chaque opération paie des frais et l’écart (spread), et chaque opération est une nouvelle décision où l’on peut se tromper. La peur et l’excitation poussent à agir aux pires moments.',
          ar: 'التداول (trading) يعني أن تشتري وتبيع كثيرًا لتستفيد من حركات السعر، وأحيانًا عدة مرات في اليوم (day trading). كل عملية تدفع فيها رسومًا والفارق (spread)، وكل عملية قرار جديد قد تخطئ فيه. والخوف والحماس يدفعان الناس إلى التصرف في أسوأ اللحظات.',
        },
      },
      {
        h: { en: 'What the studies found', fr: 'Ce qu’ont trouvé les études', ar: 'ماذا وجدت الدراسات' },
        p: {
          en: 'Researchers have studied real day traders. In Taiwan, over 15 years of data, fewer than 1% of day traders earned money reliably after fees. In Brazil, among people who day-traded futures for 300 days or more, 97% lost money. These studies are about stock and futures markets, not crypto, but crypto day traders face the same fees and the same emotions.',
          fr: 'Des chercheurs ont étudié de vrais day traders. À Taïwan, sur 15 ans de données, moins de 1 % des day traders gagnaient de l’argent de façon régulière après les frais. Au Brésil, parmi les personnes qui ont fait du day trading sur des contrats à terme pendant 300 jours ou plus, 97 % ont perdu de l’argent. Ces études portent sur la bourse et les contrats à terme, pas sur la crypto, mais un day trader crypto fait face aux mêmes frais et aux mêmes émotions.',
          ar: 'درس باحثون متداولين يوميين حقيقيين. في تايوان، وعلى بيانات 15 سنة، أقل من 1% من المتداولين اليوميين ربحوا بشكل منتظم بعد خصم الرسوم. وفي البرازيل، من بين من تداولوا العقود الآجلة يوميًا لمدة 300 يوم أو أكثر، خسر 97% منهم. هذه الدراسات عن البورصة والعقود الآجلة وليست عن العملات الرقمية، لكن المتداول اليومي في العملات الرقمية يواجه نفس الرسوم ونفس المشاعر.',
        },
      },
      {
        h: { en: 'Neither one is safe', fr: 'Aucun des deux n’est sûr', ar: 'لا أحد منهما آمن' },
        p: {
          en: 'Holding can mean watching your money halve and waiting years. Trading can mean many small losses that add up. Qirat does not tell you which game to play. It helps you see the risks of each before real money is involved.',
          fr: 'Garder peut vouloir dire voir son argent divisé par deux et attendre des années. Trader peut vouloir dire beaucoup de petites pertes qui s’additionnent. Qirat ne vous dit pas à quel jeu jouer. Il vous aide à voir les risques de chacun avant que de l’argent réel soit en jeu.',
          ar: 'الاحتفاظ قد يعني أن ترى مالك ينقص إلى النصف وتنتظر سنوات. والتداول قد يعني خسائر صغيرة كثيرة تتراكم. قيراط لا يقول لك أي لعبة تلعب، بل يساعدك على رؤية مخاطر كل واحدة قبل أن يدخل المال الحقيقي في اللعبة.',
        },
      },
      {
        h: { en: 'Compare yourself, with pretend money', fr: 'Comparez-vous, avec de l’argent fictif', ar: 'قارن نفسك بمال تجريبي' },
        p: {
          en: 'In Qirat’s practice wallet, a line shows what your starting amount would be worth if you had just held BTC from day one. After a few weeks of practice trades, you can compare your wallet with that line. It is an honest mirror, and it costs nothing.',
          fr: 'Dans le portefeuille d’entraînement de Qirat, une ligne montre ce que vaudrait votre montant de départ si vous aviez simplement gardé du BTC depuis le premier jour. Après quelques semaines d’opérations fictives, vous pouvez comparer votre portefeuille à cette ligne. C’est un miroir honnête, et ça ne coûte rien.',
          ar: 'في محفظة التدريب في قيراط، يوجد سطر يبيّن كم كان سيساوي مبلغك الأول لو احتفظت بـ BTC من اليوم الأول فقط. بعد بضعة أسابيع من العمليات التجريبية، يمكنك أن تقارن محفظتك بذلك السطر. إنها مرآة صادقة، ولا تكلّفك شيئًا.',
        },
      },
    ],
    takeaway: {
      en: 'Holding and trading carry different risks. Know which game you are playing, and see it with pretend money first.',
      fr: 'Garder et trader comportent des risques différents. Sachez à quel jeu vous jouez, et voyez-le d’abord avec de l’argent fictif.',
      ar: 'الاحتفاظ والتداول لهما مخاطر مختلفة. اعرف أي لعبة تلعب، وجرّبها أولًا بمال تجريبي.',
    },
    quiz: [
      {
        q: {
          en: 'What is the main difference between holding and trading?',
          fr: 'Quelle est la principale différence entre garder et trader ?',
          ar: 'ما الفرق الأساسي بين الاحتفاظ والتداول؟',
        },
        options: [
          { en: 'Holding is always safer', fr: 'Garder est toujours plus sûr', ar: 'الاحتفاظ أكثر أمانًا دائمًا' },
          { en: 'Trading has no fees', fr: 'Le trading n’a pas de frais', ar: 'التداول بلا رسوم' },
          {
            en: 'Holding keeps a coin for a long time; trading buys and sells often',
            fr: 'Garder, c’est conserver longtemps ; trader, c’est acheter et vendre souvent',
            ar: 'الاحتفاظ يعني إبقاء العملة مدة طويلة، والتداول يعني الشراء والبيع كثيرًا',
          },
        ],
        answer: 2,
        why: {
          en: 'Holding means keeping for months or years; trading means many buys and sells. Neither one is safe.',
          fr: 'Garder, c’est conserver des mois ou des années ; trader, c’est multiplier les achats et les ventes. Aucun des deux n’est sûr.',
          ar: 'الاحتفاظ يعني الإبقاء أشهرًا أو سنوات، والتداول يعني عمليات شراء وبيع كثيرة. ولا أحد منهما آمن.',
        },
      },
      {
        q: {
          en: 'In the Taiwan study, what share of day traders earned money reliably after fees?',
          fr: 'Dans l’étude sur Taïwan, quelle part des day traders gagnait de l’argent de façon régulière après les frais ?',
          ar: 'في دراسة تايوان، ما نسبة المتداولين اليوميين الذين ربحوا بشكل منتظم بعد الرسوم؟',
        },
        options: [
          { en: 'Fewer than 1%', fr: 'Moins de 1 %', ar: 'أقل من 1%' },
          { en: 'About half', fr: 'Environ la moitié', ar: 'حوالي النصف' },
          { en: 'About 1 in 4', fr: 'Environ 1 sur 4', ar: 'حوالي 1 من كل 4' },
        ],
        answer: 0,
        why: {
          en: 'Fewer than 1% did. Fees and constant decisions work against people who trade every day.',
          fr: 'Moins de 1 %. Les frais et les décisions permanentes jouent contre ceux qui tradent tous les jours.',
          ar: 'أقل من 1%. الرسوم والقرارات المستمرة تعمل ضد من يتداول كل يوم.',
        },
      },
      {
        q: {
          en: 'What does the “if you had just held BTC” line in the practice wallet show?',
          fr: 'Que montre la ligne « si vous aviez juste gardé du BTC » du portefeuille d’entraînement ?',
          ar: 'ماذا يبيّن سطر «لو احتفظت بـ BTC فقط» في محفظة التدريب؟',
        },
        options: [
          { en: 'The best moment to buy BTC', fr: 'Le meilleur moment pour acheter du BTC', ar: 'أفضل وقت لشراء BTC' },
          {
            en: 'What your starting amount would be worth if you had only held BTC',
            fr: 'Ce que vaudrait votre montant de départ si vous aviez seulement gardé du BTC',
            ar: 'كم كان سيساوي مبلغك الأول لو احتفظت بـ BTC فقط',
          },
          { en: 'How much BTC Qirat recommends', fr: 'Combien de BTC Qirat recommande', ar: 'كمية BTC التي ينصح بها قيراط' },
        ],
        answer: 1,
        why: {
          en: 'It is a comparison, not a recommendation: your practice trades next to simply holding BTC.',
          fr: 'C’est une comparaison, pas une recommandation : vos opérations fictives à côté du simple fait de garder du BTC.',
          ar: 'إنها مقارنة وليست نصيحة: عملياتك التجريبية بجانب مجرد الاحتفاظ بـ BTC.',
        },
      },
    ],
  },

  {
    slug: 'candles',
    level: 2,
    minutes: 2,
    title: {
      en: 'Red and green candles: how to read a chart',
      fr: 'Bougies rouges et vertes : lire un graphique',
      ar: 'الشموع الحمراء والخضراء: كيف تقرأ الرسم البياني',
    },
    hook: {
      en: 'Every crypto chart is made of small candles. One candle is one day. Here is what each part tells you.',
      fr: 'Chaque graphique crypto est fait de petites bougies. Une bougie, c’est un jour. Voici ce que dit chaque partie.',
      ar: 'كل رسم بياني للعملات الرقمية مكوّن من شموع صغيرة. الشمعة الواحدة يوم كامل. إليك ما يخبرك به كل جزء منها.',
    },
    terms: ['candle', 'volatility'],
    live: { kind: 'coin', symbol: 'BTC' },
    sections: [
      {
        h: { en: 'One candle, one day', fr: 'Une bougie, un jour', ar: 'شمعة واحدة، يوم واحد' },
        p: {
          en: 'On Qirat’s 30-day chart, each candle is one day. It shows four prices: where the day opened, where it closed, the highest price of the day and the lowest.',
          fr: 'Sur le graphique 30 jours de Qirat, chaque bougie est un jour. Elle montre quatre prix : l’ouverture, la clôture, le plus haut et le plus bas de la journée.',
          ar: 'في رسم قيراط البياني لـ 30 يومًا، كل شمعة (candle) هي يوم واحد. تُظهر أربعة أسعار: سعر افتتاح اليوم، وسعر إغلاقه، وأعلى سعر في اليوم، وأدنى سعر.',
        },
      },
      {
        h: { en: 'Green or red', fr: 'Verte ou rouge', ar: 'خضراء أم حمراء' },
        p: {
          en: 'Green: the day closed higher than it opened. Red: it closed lower. The thick part of the candle (the body) goes from the open to the close.',
          fr: 'Verte : la journée a clôturé plus haut qu’elle n’a ouvert. Rouge : elle a clôturé plus bas. La partie épaisse (le corps) va de l’ouverture à la clôture.',
          ar: 'الخضراء: أُغلق اليوم أعلى من سعر الافتتاح. الحمراء: أُغلق أدنى منه. الجزء العريض من الشمعة (الجسم) يمتد من سعر الافتتاح إلى سعر الإغلاق.',
        },
      },
      {
        h: { en: 'The thin line', fr: 'Le trait fin', ar: 'الخط الرفيع' },
        p: {
          en: 'The thin line above and below the body shows the day’s high and low. A long line means the price travelled far during the day, even if it closed near where it opened.',
          fr: 'Le trait fin au-dessus et en dessous du corps montre le plus haut et le plus bas du jour. Un long trait veut dire que le prix a beaucoup voyagé dans la journée, même s’il a clôturé près de son ouverture.',
          ar: 'الخط الرفيع فوق الجسم وتحته يُظهر أعلى وأدنى سعر في اليوم. الخط الطويل يعني أن السعر تحرك كثيرًا خلال اليوم، حتى لو أُغلق قريبًا من سعر الافتتاح.',
        },
      },
      {
        h: { en: 'When does a day start?', fr: 'Quand commence une journée ?', ar: 'متى يبدأ اليوم؟' },
        p: {
          en: 'The prices come from Binance, whose daily candles run from midnight to midnight UTC (01:00 in Tunisia and Morocco most of the year, 03:00 in Saudi Arabia). The last candle on the right is today’s: it keeps changing until the day closes.',
          fr: 'Les prix viennent de Binance, dont les bougies journalières vont de minuit à minuit UTC (01 h en Tunisie et au Maroc la plupart de l’année, 03 h en Arabie saoudite). La dernière bougie à droite est celle d’aujourd’hui : elle change jusqu’à la clôture du jour.',
          ar: 'الأسعار تأتي من Binance، وشموعها اليومية تمتد من منتصف الليل إلى منتصف الليل بتوقيت UTC (الساعة 01:00 في تونس والمغرب أغلب أيام السنة، و03:00 في السعودية). الشمعة الأخيرة على اليمين هي شمعة اليوم: تبقى تتغير حتى يُغلق اليوم.',
        },
      },
      {
        h: { en: 'What candles do not tell you', fr: 'Ce que les bougies ne disent pas', ar: 'ما لا تخبرك به الشموع' },
        p: {
          en: 'Candles show what already happened. Three green days in a row do not mean the fourth will be green. Anyone who says a candle pattern tells you when to buy is selling something.',
          fr: 'Les bougies montrent ce qui s’est déjà passé. Trois jours verts de suite ne veulent pas dire que le quatrième sera vert. Celui qui dit qu’une figure de bougies indique quand acheter vous vend quelque chose.',
          ar: 'الشموع تُظهر ما حدث فعلًا. ثلاثة أيام خضراء متتالية لا تعني أن الرابع سيكون أخضر. ومن يقول لك إن شكلًا معينًا من الشموع يخبرك متى تشتري، فهو يبيعك شيئًا.',
        },
      },
    ],
    takeaway: {
      en: 'Read a candle as a summary of one day: green closed higher, red closed lower, the thin line is the day’s range. It describes the past, it does not predict.',
      fr: 'Lisez une bougie comme le résumé d’un jour : verte a clôturé plus haut, rouge plus bas, le trait fin est l’amplitude du jour. Elle décrit le passé, elle ne prédit rien.',
      ar: 'اقرأ الشمعة كملخص ليوم واحد: الخضراء أُغلقت أعلى، والحمراء أُغلقت أدنى، والخط الرفيع هو مدى حركة اليوم. إنها تصف الماضي، ولا تتنبأ بشيء.',
    },
    quiz: [
      {
        q: {
          en: 'On Qirat’s chart, what is one candle?',
          fr: 'Sur le graphique de Qirat, qu’est-ce qu’une bougie ?',
          ar: 'في رسم قيراط البياني، ماذا تمثل الشمعة الواحدة؟',
        },
        options: [
          { en: 'One hour', fr: 'Une heure', ar: 'ساعة واحدة' },
          { en: 'One day', fr: 'Un jour', ar: 'يومًا واحدًا' },
          { en: 'One trade', fr: 'Une transaction', ar: 'عملية شراء واحدة' },
        ],
        answer: 1,
        why: {
          en: 'Qirat’s chart shows 30 days with one candle per day.',
          fr: 'Le graphique de Qirat montre 30 jours, une bougie par jour.',
          ar: 'رسم قيراط البياني يعرض 30 يومًا، بشمعة لكل يوم.',
        },
      },
      {
        q: {
          en: 'A candle is red. What happened that day?',
          fr: 'Une bougie est rouge. Que s’est-il passé ce jour-là ?',
          ar: 'شمعة حمراء. ماذا حدث في ذلك اليوم؟',
        },
        options: [
          { en: 'It closed lower than it opened', fr: 'Il a clôturé plus bas qu’il n’a ouvert', ar: 'أُغلق أدنى من سعر الافتتاح' },
          { en: 'Someone lost all their money', fr: 'Quelqu’un a tout perdu', ar: 'شخص ما خسر كل أمواله' },
          { en: 'The market was closed', fr: 'Le marché était fermé', ar: 'كان السوق مغلقًا' },
        ],
        answer: 0,
        why: {
          en: 'Red only means the closing price was below the opening price. It says nothing about the size of the drop.',
          fr: 'Rouge veut seulement dire que la clôture était sous l’ouverture. Ça ne dit rien de la taille de la baisse.',
          ar: 'الأحمر يعني فقط أن سعر الإغلاق كان أدنى من سعر الافتتاح. لا يقول شيئًا عن حجم الهبوط.',
        },
      },
      {
        q: {
          en: 'After three green candles in a row, the next day…',
          fr: 'Après trois bougies vertes de suite, le jour suivant…',
          ar: 'بعد ثلاث شموع خضراء متتالية، اليوم التالي…',
        },
        options: [
          { en: 'will be green', fr: 'sera vert', ar: 'سيكون أخضر' },
          { en: 'will be red', fr: 'sera rouge', ar: 'سيكون أحمر' },
          { en: 'can be either: candles do not predict', fr: 'peut être l’un ou l’autre : les bougies ne prédisent pas', ar: 'قد يكون هذا أو ذاك: الشموع لا تتنبأ' },
        ],
        answer: 2,
        why: {
          en: 'Candles summarise the past. Nobody can tell you the next day’s colour.',
          fr: 'Les bougies résument le passé. Personne ne peut vous dire la couleur du lendemain.',
          ar: 'الشموع تلخّص الماضي. لا أحد يستطيع أن يخبرك بلون اليوم التالي.',
        },
      },
    ],
  },

  {
    slug: 'timeframes-volume',
    level: 2,
    minutes: 2,
    title: {
      en: 'Timeframes and volume: zoom in, zoom out',
      fr: 'Unités de temps et volume : zoomer, dézoomer',
      ar: 'الإطار الزمني والحجم: قرّب الصورة وبعّدها',
    },
    hook: {
      en: 'A coin can look wild or calm depending only on how far you zoom.',
      fr: 'Une crypto peut sembler agitée ou calme selon votre seul zoom.',
      ar: 'قد تبدو العملة هائجة أو هادئة فقط حسب المسافة التي تنظر منها.',
    },
    terms: ['timeframe', 'volume', 'candle'],
    live: {
      kind: 'view',
      view: 'today',
      label: {
        en: 'Open a coin’s 30-day chart',
        fr: 'Ouvrir le graphique 30 jours d’une crypto',
        ar: 'افتح الرسم البياني لـ 30 يومًا لأي عملة',
      },
    },
    sections: [
      {
        h: { en: 'A candle can be any length of time', fr: 'Une bougie peut durer n’importe quel temps', ar: 'الشمعة قد تمثّل أي مدة' },
        p: {
          en: 'A candle sums up one period: its open, close, high and low. That period is called the timeframe. It can be 1 minute, 1 hour, 1 day or 1 week. Qirat’s chart shows 30 daily candles, so one candle is one day.',
          fr: 'Une bougie résume une période : son ouverture, sa clôture, son plus haut et son plus bas. Cette période s’appelle l’unité de temps (timeframe). Elle peut durer 1 minute, 1 heure, 1 jour ou 1 semaine. Le graphique de Qirat montre 30 bougies journalières : une bougie, c’est un jour.',
          ar: 'الشمعة تلخّص فترة واحدة: سعر الافتتاح والإغلاق وأعلى سعر وأدنى سعر. هذه الفترة اسمها الإطار الزمني (timeframe)، وقد تكون دقيقة واحدة أو ساعة أو يومًا أو أسبوعًا. الرسم البياني في قيراط يعرض 30 شمعة يومية، أي أن كل شمعة يوم واحد.',
        },
      },
      {
        h: { en: 'Same coin, different picture', fr: 'Même crypto, autre image', ar: 'نفس العملة، وصورة مختلفة' },
        p: {
          en: 'On a 1-minute chart, every small wiggle looks like a big event, and the candles flip between green and red all the time. On a weekly chart, one candle covers seven days and the small noise disappears. The coin is the same; only your zoom changed.',
          fr: 'Sur un graphique en 1 minute, chaque petit mouvement ressemble à un gros événement, et les bougies passent sans cesse du vert au rouge. Sur un graphique hebdomadaire, une bougie couvre sept jours et le petit bruit disparaît. La crypto est la même ; seul votre zoom a changé.',
          ar: 'في رسم الدقيقة الواحدة، كل حركة صغيرة تبدو حدثًا كبيرًا، والشموع تتبدّل بين الأخضر والأحمر طوال الوقت. وفي الرسم الأسبوعي، الشمعة الواحدة تغطي سبعة أيام ويختفي الضجيج الصغير. العملة نفسها، فقط طريقة نظرك تغيّرت.',
        },
      },
      {
        h: { en: 'Why short timeframes are tiring', fr: 'Pourquoi les unités courtes fatiguent', ar: 'لماذا تُتعب الأطر الزمنية القصيرة' },
        p: {
          en: 'The shorter the timeframe, the more decisions it seems to ask for. Watching 1-minute candles pushes many people into frequent trades, and each trade pays a fee and the spread. Knowing which timeframe you are looking at keeps a scary-looking minute in proportion.',
          fr: 'Plus l’unité de temps est courte, plus elle semble demander de décisions. Regarder des bougies d’une minute pousse beaucoup de gens à multiplier les opérations, et chacune paie des frais et l’écart. Savoir quelle unité de temps vous regardez aide à garder une minute effrayante à sa juste place.',
          ar: 'كلما قصر الإطار الزمني، بدا أنه يطلب منك قرارات أكثر. متابعة شموع الدقيقة تدفع كثيرين إلى عمليات متكررة، وكل عملية تدفع رسومًا وفارقًا. ومعرفة الإطار الزمني الذي تنظر إليه تساعدك على رؤية الدقيقة المخيفة بحجمها الحقيقي.',
        },
      },
      {
        h: { en: 'Volume: how much was traded', fr: 'Le volume : combien a été échangé', ar: 'الحجم: كم تم تداوله' },
        p: {
          en: 'Volume is how much of a coin was traded during a period. Most exchange charts show it as bars under the candles. Qirat’s chart does not show volume yet.',
          fr: 'Le volume, c’est la quantité d’une crypto échangée pendant une période. La plupart des graphiques des plateformes l’affichent en barres sous les bougies. Le graphique de Qirat ne montre pas encore le volume.',
          ar: 'الحجم (volume) هو كمية العملة التي تم تداولها خلال فترة معيّنة. أغلب الرسوم البيانية في المنصّات تعرضه كأعمدة تحت الشموع. الرسم البياني في قيراط لا يعرض الحجم بعد.',
        },
      },
      {
        h: { en: 'Reading volume honestly', fr: 'Lire le volume honnêtement', ar: 'قراءة الحجم بصدق' },
        p: {
          en: 'A price move on high volume means many people bought and sold during it. A move on low volume means few took part, so a few orders may have been enough to push the price. Volume describes what already happened. It does not tell you what comes next.',
          fr: 'Un mouvement de prix avec un gros volume veut dire que beaucoup de gens ont acheté et vendu pendant ce mouvement. Avec un faible volume, peu de gens y ont participé, et quelques ordres ont pu suffire à pousser le prix. Le volume décrit ce qui s’est déjà passé. Il ne dit pas ce qui va suivre.',
          ar: 'حركة السعر مع حجم كبير تعني أن كثيرين اشتروا وباعوا خلالها. ومع حجم ضعيف، شارك فيها قليلون، وربما كانت بضعة أوامر كافية لدفع السعر. الحجم يصف ما حدث فعلًا، ولا يخبرك بما سيأتي.',
        },
      },
    ],
    takeaway: {
      en: 'Check the timeframe before you judge a chart. Volume tells you how many took part in a move, not where the price goes next.',
      fr: 'Vérifiez l’unité de temps avant de juger un graphique. Le volume dit combien de gens ont participé à un mouvement, pas où va le prix ensuite.',
      ar: 'انظر إلى الإطار الزمني قبل أن تحكم على الرسم. الحجم يخبرك كم شخصًا شارك في الحركة، لا إلى أين سيذهب السعر بعدها.',
    },
    quiz: [
      {
        q: {
          en: 'On Qirat’s chart, how much time does one candle cover?',
          fr: 'Sur le graphique de Qirat, quelle durée couvre une bougie ?',
          ar: 'في الرسم البياني لقيراط، ما المدة التي تغطيها الشمعة الواحدة؟',
        },
        options: [
          { en: 'One day', fr: 'Un jour', ar: 'يوم واحد' },
          { en: 'One minute', fr: 'Une minute', ar: 'دقيقة واحدة' },
          { en: 'One week', fr: 'Une semaine', ar: 'أسبوع واحد' },
        ],
        answer: 0,
        why: {
          en: 'Qirat shows 30 daily candles: one candle is one day.',
          fr: 'Qirat montre 30 bougies journalières : une bougie, c’est un jour.',
          ar: 'قيراط يعرض 30 شمعة يومية: كل شمعة يوم واحد.',
        },
      },
      {
        q: {
          en: 'A coin looks wild on a 1-minute chart and calm on a weekly chart. Why?',
          fr: 'Une crypto semble agitée en 1 minute et calme en hebdomadaire. Pourquoi ?',
          ar: 'عملة تبدو هائجة في رسم الدقيقة وهادئة في الرسم الأسبوعي. لماذا؟',
        },
        options: [
          { en: 'The coin changed over the weekend', fr: 'La crypto a changé pendant le week-end', ar: 'العملة تغيّرت في نهاية الأسبوع' },
          { en: 'The zoom changed, not the coin', fr: 'C’est le zoom qui a changé, pas la crypto', ar: 'طريقة النظر تغيّرت، وليس العملة' },
          { en: 'Weekly charts leave out the falls', fr: 'Les graphiques hebdomadaires enlèvent les baisses', ar: 'الرسوم الأسبوعية تحذف الهبوط' },
        ],
        answer: 1,
        why: {
          en: 'Short timeframes show every small move; long ones sum up many days in one candle.',
          fr: 'Les unités courtes montrent chaque petit mouvement ; les longues résument plusieurs jours en une bougie.',
          ar: 'الأطر القصيرة تُظهر كل حركة صغيرة، والطويلة تلخّص أيامًا كثيرة في شمعة واحدة.',
        },
      },
      {
        q: {
          en: 'A big price jump happened on very low volume. What does that tell you?',
          fr: 'Une grosse hausse s’est faite avec un très faible volume. Qu’est-ce que ça vous dit ?',
          ar: 'حدث ارتفاع كبير في السعر بحجم ضعيف جدًا. ماذا يخبرك ذلك؟',
        },
        options: [
          { en: 'The price will keep rising', fr: 'Le prix va continuer à monter', ar: 'السعر سيواصل الصعود' },
          { en: 'The platform made a mistake', fr: 'La plateforme s’est trompée', ar: 'المنصّة أخطأت' },
          { en: 'Few people took part in the move', fr: 'Peu de gens ont participé au mouvement', ar: 'عدد قليل من الناس شارك في الحركة' },
        ],
        answer: 2,
        why: {
          en: 'Low volume means few participants. It describes the past, not what comes next.',
          fr: 'Un faible volume veut dire peu de participants. Ça décrit le passé, pas la suite.',
          ar: 'الحجم الضعيف يعني مشاركين قليلين. وهو يصف ما مضى، لا ما سيأتي.',
        },
      },
    ],
  },

  {
    slug: 'fees-spread',
    level: 2,
    minutes: 3,
    title: {
      en: 'Fees and spread: what a trade really costs',
      fr: 'Frais et écart : ce que coûte vraiment une opération',
      ar: 'الرسوم والفارق: كم تكلّف العملية فعلًا',
    },
    hook: {
      en: 'You pay before the price even moves. Here is the bill on 100 dollars.',
      fr: 'Vous payez avant même que le prix bouge. Voici la facture sur 100 dollars.',
      ar: 'تدفع قبل أن يتحرك السعر أصلًا. هذه هي الفاتورة على 100 دولار.',
    },
    terms: ['fee', 'spread'],
    live: {
      kind: 'view',
      view: 'practice',
      label: {
        en: 'See the fee and spread on a practice trade',
        fr: 'Voir les frais et l’écart sur une opération fictive',
        ar: 'شاهد الرسوم والفارق في عملية تجريبية',
      },
    },
    sections: [
      {
        h: { en: 'Two costs on every trade', fr: 'Deux coûts sur chaque opération', ar: 'تكلفتان في كل عملية' },
        p: {
          en: 'Every trade has two costs. The fee is what the platform charges: 0.1% in Qirat’s practice wallet, the same as Binance’s basic spot fee. The spread is the gap between the buy price and the sell price: in the practice wallet, buys fill 0.05% above the market price and sells 0.05% below.',
          fr: 'Chaque opération a deux coûts. Les frais, c’est ce que prend la plateforme : 0,1 % dans le portefeuille d’entraînement de Qirat, comme les frais spot de base de Binance. L’écart (spread), c’est la différence entre le prix d’achat et le prix de vente : dans le portefeuille d’entraînement, on achète 0,05 % au-dessus du prix du marché et on vend 0,05 % en dessous.',
          ar: 'لكل عملية تكلفتان. الرسوم (fee) هي ما تأخذه المنصّة: 0.1% في محفظة التدريب في قيراط، وهي نفس الرسوم الأساسية للتداول الفوري في Binance. والفارق (spread) هو الفرق بين سعر الشراء وسعر البيع: في محفظة التدريب، يتم الشراء بسعر أعلى من سعر السوق بـ 0.05%، والبيع بسعر أقل منه بـ 0.05%.',
        },
      },
      {
        h: { en: 'The bill on 100 USDT', fr: 'La facture sur 100 USDT', ar: 'الفاتورة على 100 USDT' },
        p: {
          en: 'Say you buy for 100 USDT: about 0.10 goes to the fee and about 0.05 to the spread. If you sell everything a minute later and the price has not moved, you pay about the same again. You end with about 99.70 USDT. A buy-then-sell costs about 0.3%.',
          fr: 'Disons que vous achetez pour 100 USDT : environ 0,10 part en frais et environ 0,05 dans l’écart. Si vous revendez tout une minute plus tard sans que le prix ait bougé, vous payez à peu près autant. Il vous reste environ 99,70 USDT. Un achat suivi d’une vente coûte environ 0,3 %.',
          ar: 'لنفترض أنك اشتريت بـ 100 USDT: حوالي 0.10 تذهب للرسوم وحوالي 0.05 للفارق. وإذا بعت كل شيء بعد دقيقة ولم يتحرك السعر، تدفع تقريبًا نفس المبلغ مرة أخرى. يبقى لك حوالي 99.70 USDT. أي أن الشراء ثم البيع يكلّف حوالي 0.3%.',
        },
      },
      {
        h: { en: 'Small costs, many times', fr: 'Petits coûts, souvent répétés', ar: 'تكاليف صغيرة، مرات كثيرة' },
        p: {
          en: 'Ten buy-and-sell rounds in one day cost about 3 USDT on 100, even if the price never moves. At that pace every day for a month, 100 USDT shrinks to about 41 USDT from costs alone. Each cost is tiny; the habit is what makes it big.',
          fr: 'Dix allers-retours achat-vente dans la journée coûtent environ 3 USDT sur 100, même si le prix ne bouge jamais. À ce rythme chaque jour pendant un mois, 100 USDT tombent à environ 41 USDT, rien qu’avec les coûts. Chaque coût est minuscule ; c’est l’habitude qui le rend énorme.',
          ar: 'عشر جولات من الشراء والبيع في يوم واحد تكلّف حوالي 3 USDT على كل 100، حتى لو لم يتحرك السعر أبدًا. وبهذا الإيقاع كل يوم لمدة شهر، تنكمش 100 USDT إلى حوالي 41 USDT بسبب التكاليف وحدها. كل تكلفة صغيرة جدًا، لكن العادة هي التي تجعلها كبيرة.',
        },
      },
      {
        h: { en: 'Win back the costs first', fr: 'D’abord rattraper les coûts', ar: 'استرجع التكاليف أولًا' },
        p: {
          en: 'Because of that 0.3%, a coin has to rise about 0.3% after you buy just for you to get back to where you started. On a trade you repeat often, that is a small hill you climb every single time.',
          fr: 'À cause de ces 0,3 %, une crypto doit monter d’environ 0,3 % après votre achat juste pour que vous reveniez à votre point de départ. Sur une opération répétée souvent, c’est une petite côte à grimper à chaque fois.',
          ar: 'بسبب هذه الـ 0.3%، يجب أن يرتفع سعر العملة حوالي 0.3% بعد شرائك فقط لكي تعود إلى نقطة البداية. وفي عملية تكررها كثيرًا، هذه عقبة صغيرة تصعدها في كل مرة.',
        },
      },
      {
        h: { en: 'Real platforms can cost more', fr: 'Les vraies plateformes peuvent coûter plus', ar: 'المنصّات الحقيقية قد تكلّف أكثر' },
        p: {
          en: 'The practice wallet uses simple, low costs. Real platforms may add more: wider spreads on small coins, higher fees on some services, and withdrawal fees when you move coins out. Look at the full cost before comparing results.',
          fr: 'Le portefeuille d’entraînement utilise des coûts simples et bas. Les vraies plateformes peuvent en ajouter : des écarts plus larges sur les petites cryptos, des frais plus élevés sur certains services, et des frais de retrait quand vous sortez vos cryptos. Regardez le coût total avant de comparer des résultats.',
          ar: 'محفظة التدريب تستعمل تكاليف بسيطة ومنخفضة. أما المنصّات الحقيقية فقد تضيف أكثر: فارقًا أوسع في العملات الصغيرة، ورسومًا أعلى في بعض الخدمات، ورسوم سحب عند إخراج عملاتك منها. انظر إلى التكلفة الكاملة قبل أن تقارن النتائج.',
        },
      },
      {
        h: { en: 'What the coach watches', fr: 'Ce que surveille le coach', ar: 'ماذا يراقب المدرب' },
        p: {
          en: 'When you make 5 or more practice trades within 24 hours, Qirat’s habit coach leaves a note. It is not a ban, just a reminder that every trade pays the fee and the spread.',
          fr: 'Quand vous faites 5 opérations fictives ou plus en 24 heures, le coach des habitudes de Qirat laisse une remarque. Ce n’est pas une interdiction, juste un rappel : chaque opération paie les frais et l’écart.',
          ar: 'عندما تقوم بـ 5 عمليات تجريبية أو أكثر خلال 24 ساعة، يترك مدرب العادات في قيراط ملاحظة. ليست منعًا، بل تذكير بأن كل عملية تدفع الرسوم والفارق.',
        },
      },
    ],
    takeaway: {
      en: 'A buy-then-sell costs about 0.3% before the price moves at all. Many small trades turn tiny costs into a big loss.',
      fr: 'Un achat suivi d’une vente coûte environ 0,3 % avant même que le prix bouge. Beaucoup de petites opérations transforment des coûts minuscules en grosse perte.',
      ar: 'الشراء ثم البيع يكلّف حوالي 0.3% قبل أن يتحرك السعر أصلًا. والعمليات الصغيرة الكثيرة تحوّل التكاليف الصغيرة إلى خسارة كبيرة.',
    },
    quiz: [
      {
        q: {
          en: 'In Qirat’s practice wallet, about how much does a buy-then-sell cost if the price does not move?',
          fr: 'Dans le portefeuille d’entraînement de Qirat, combien coûte environ un achat suivi d’une vente si le prix ne bouge pas ?',
          ar: 'في محفظة التدريب في قيراط، كم يكلّف تقريبًا الشراء ثم البيع إذا لم يتحرك السعر؟',
        },
        options: [
          { en: 'Nothing', fr: 'Rien', ar: 'لا شيء' },
          { en: 'About 0.3%', fr: 'Environ 0,3 %', ar: 'حوالي 0.3%' },
          { en: 'About 3%', fr: 'Environ 3 %', ar: 'حوالي 3%' },
        ],
        answer: 1,
        why: {
          en: 'About 0.1% fee and 0.05% spread on each side: roughly 0.3% for the round trip.',
          fr: 'Environ 0,1 % de frais et 0,05 % d’écart de chaque côté : à peu près 0,3 % pour l’aller-retour.',
          ar: 'حوالي 0.1% رسوم و0.05% فارق في كل اتجاه: أي تقريبًا 0.3% للذهاب والعودة.',
        },
      },
      {
        q: { en: 'What is the spread?', fr: 'Qu’est-ce que l’écart (spread) ?', ar: 'ما هو الفارق (spread)؟' },
        options: [
          {
            en: 'The gap between the buy price and the sell price',
            fr: 'La différence entre le prix d’achat et le prix de vente',
            ar: 'الفرق بين سعر الشراء وسعر البيع',
          },
          { en: 'A tax paid once a year', fr: 'Un impôt payé une fois par an', ar: 'ضريبة تُدفع مرة في السنة' },
          { en: 'The interest a coin pays you', fr: 'Les intérêts qu’une crypto vous verse', ar: 'الفائدة التي تدفعها لك العملة' },
        ],
        answer: 0,
        why: {
          en: 'You buy a little above the market price and sell a little below. That gap is a cost.',
          fr: 'On achète un peu au-dessus du prix du marché et on vend un peu en dessous. Cette différence est un coût.',
          ar: 'تشتري بسعر أعلى قليلًا من سعر السوق وتبيع بسعر أقل قليلًا. هذا الفرق تكلفة.',
        },
      },
      {
        q: {
          en: 'Why can many small trades hurt even when the price stays flat?',
          fr: 'Pourquoi beaucoup de petites opérations peuvent-elles faire mal même si le prix ne bouge pas ?',
          ar: 'لماذا قد تضرّك العمليات الصغيرة الكثيرة حتى لو بقي السعر ثابتًا؟',
        },
        options: [
          { en: 'Prices always fall after a trade', fr: 'Les prix baissent toujours après une opération', ar: 'الأسعار تهبط دائمًا بعد كل عملية' },
          { en: 'The practice wallet charges a monthly fee', fr: 'Le portefeuille d’entraînement prend des frais mensuels', ar: 'محفظة التدريب تأخذ رسومًا شهرية' },
          { en: 'Each trade pays costs, and they add up', fr: 'Chaque opération paie des coûts, et ils s’additionnent', ar: 'كل عملية تدفع تكاليف، وهي تتراكم' },
        ],
        answer: 2,
        why: {
          en: 'Ten rounds a day cost about 3 USDT on 100. Over a month, costs alone can eat more than half.',
          fr: 'Dix allers-retours par jour coûtent environ 3 USDT sur 100. En un mois, les coûts seuls peuvent manger plus de la moitié.',
          ar: 'عشر جولات في اليوم تكلّف حوالي 3 USDT على كل 100. وخلال شهر، قد تأكل التكاليف وحدها أكثر من النصف.',
        },
      },
    ],
  },

  {
    slug: 'order-types',
    level: 2,
    minutes: 3,
    title: {
      en: 'Order types: market, limit, stop-loss',
      fr: 'Les types d’ordres : au marché, à cours limité, stop-loss',
      ar: 'أنواع الأوامر: أمر السوق، الأمر المحدد، ووقف الخسارة',
    },
    hook: {
      en: 'Buy now at any price, or only at your price? The order you choose decides.',
      fr: 'Acheter tout de suite à n’importe quel prix, ou seulement à votre prix ? C’est l’ordre choisi qui décide.',
      ar: 'تشتري الآن بأي سعر، أم فقط بالسعر الذي تريده؟ نوع الأمر هو الذي يحدد.',
    },
    terms: ['market-order', 'limit-order', 'stop-loss', 'take-profit', 'slippage'],
    live: {
      kind: 'view',
      view: 'practice',
      label: {
        en: 'Place a practice market order',
        fr: 'Passer un ordre fictif au marché',
        ar: 'نفّذ أمر سوق تجريبيًا',
      },
    },
    sections: [
      {
        h: { en: 'Market order: now, at the best price available', fr: 'Ordre au marché : maintenant, au meilleur prix disponible', ar: 'أمر السوق: الآن، بأفضل سعر متوفر' },
        p: {
          en: 'A market order buys or sells right away at the best price available at that moment. It is fast and almost always fills. The price you get can differ a little from the price you saw, especially on small coins or big orders. That difference is called slippage.',
          fr: 'Un ordre au marché achète ou vend tout de suite, au meilleur prix disponible à ce moment-là. Il est rapide et s’exécute presque toujours. Le prix obtenu peut être un peu différent de celui affiché, surtout sur les petites cryptos ou les gros ordres. Cette différence s’appelle le glissement (slippage).',
          ar: 'أمر السوق (market order) يشتري أو يبيع فورًا بأفضل سعر متوفر في تلك اللحظة. هو سريع ويُنفَّذ في أغلب الأحيان. لكن السعر الذي تحصل عليه قد يختلف قليلًا عن السعر الذي رأيته، خاصة في العملات الصغيرة أو الأوامر الكبيرة. هذا الفرق اسمه الانزلاق (slippage).',
        },
      },
      {
        h: { en: 'Limit order: only at my price or better', fr: 'Ordre limité : seulement à mon prix ou mieux', ar: 'الأمر المحدد: بسعري أو أفضل فقط' },
        p: {
          en: 'A limit order sets your price. A buy limit at 95 fills only at 95 or lower; a sell limit at 110 fills only at 110 or higher. You control the price, but if the market never reaches it, the order never fills.',
          fr: 'Un ordre à cours limité fixe votre prix. Un achat limité à 95 ne s’exécute qu’à 95 ou moins ; une vente limitée à 110 ne s’exécute qu’à 110 ou plus. Vous contrôlez le prix, mais si le marché ne l’atteint jamais, l’ordre ne s’exécute jamais.',
          ar: 'الأمر المحدد السعر (limit order) يحدد السعر الذي تريده. أمر شراء محدد عند 95 لا يُنفَّذ إلا عند 95 أو أقل، وأمر بيع محدد عند 110 لا يُنفَّذ إلا عند 110 أو أكثر. أنت تتحكم في السعر، لكن إن لم يصل السوق إليه أبدًا، فلن يُنفَّذ الأمر أبدًا.',
        },
      },
      {
        h: { en: 'Stop-loss: the exit you choose before you enter', fr: 'Stop-loss : la sortie choisie avant d’entrer', ar: 'وقف الخسارة: المخرج الذي تختاره قبل الدخول' },
        p: {
          en: 'A stop-loss is a price below your entry, chosen in advance, where a sell order is sent to limit a loss. Bought at 100 with a stop at 90? If the price falls to 90, the platform sends the sell order. In a very fast drop it can fill below 90, so a stop limits a loss but does not guarantee its size.',
          fr: 'Un stop-loss est un prix sous votre prix d’entrée, choisi à l’avance, où un ordre de vente part pour limiter une perte. Acheté à 100 avec un stop à 90 ? Si le prix tombe à 90, la plateforme envoie l’ordre de vente. Dans une chute très rapide, il peut s’exécuter sous 90 : un stop limite une perte, mais ne garantit pas sa taille.',
          ar: 'أمر وقف الخسارة (stop-loss) هو سعر أقل من سعر دخولك، تختاره مسبقًا، يُرسَل عنده أمر بيع للحدّ من الخسارة. اشتريت بـ 100 ووضعت الوقف عند 90؟ إذا نزل السعر إلى 90، ترسل المنصّة أمر البيع. وفي الهبوط السريع جدًا قد يُنفَّذ تحت 90، فوقف الخسارة يحدّ من الخسارة لكنه لا يضمن حجمها.',
        },
      },
      {
        h: { en: 'Take-profit: the exit on the way up', fr: 'Take-profit : la sortie à la hausse', ar: 'جني الأرباح: المخرج عند الصعود' },
        p: {
          en: 'A take-profit is the same idea above your entry: a price where a sell order is sent if the coin rises. Bought at 100 with a take-profit at 120? It sells if the price reaches 120. Exits set before entering are decided while you are calm, not in the heat of a move.',
          fr: 'Un take-profit, c’est la même idée au-dessus de votre prix d’entrée : un prix où un ordre de vente part si la crypto monte. Acheté à 100 avec un take-profit à 120 ? Il vend si le prix atteint 120. Des sorties fixées avant d’entrer sont décidées à froid, pas dans le feu du mouvement.',
          ar: 'أمر جني الأرباح (take-profit) هو نفس الفكرة لكن فوق سعر دخولك: سعر يُرسَل عنده أمر بيع إذا ارتفعت العملة. اشتريت بـ 100 ووضعت جني الأرباح عند 120؟ يتم البيع إذا وصل السعر إلى 120. والمخارج التي تُحدَّد قبل الدخول تُقرَّر بهدوء، لا في حرارة الحركة.',
        },
      },
      {
        h: { en: 'What Qirat’s practice wallet has', fr: 'Ce qu’a le portefeuille d’entraînement de Qirat', ar: 'ما الموجود في محفظة التدريب في قيراط' },
        p: {
          en: 'Qirat’s practice wallet only places market orders for now: your practice buy or sell fills at once at the live price, plus the spread. Limit and stop orders are not there yet. On a real platform, it pays to check which order type is selected before confirming.',
          fr: 'Pour l’instant, le portefeuille d’entraînement de Qirat ne passe que des ordres au marché : votre achat ou votre vente fictive s’exécute tout de suite au prix en direct, plus l’écart. Les ordres limités et les stops n’y sont pas encore. Sur une vraie plateforme, mieux vaut vérifier quel type d’ordre est choisi avant de confirmer.',
          ar: 'محفظة التدريب في قيراط لا تنفّذ حاليًا إلا أوامر السوق: عملية الشراء أو البيع التجريبية تُنفَّذ فورًا بالسعر الحي، مع إضافة الفارق. الأوامر المحددة وأوامر الوقف غير موجودة بعد. وفي أي منصّة حقيقية، من المفيد التحقق من نوع الأمر المختار قبل التأكيد.',
        },
      },
    ],
    takeaway: {
      en: 'Market = now, at whatever price. Limit = only at your price, maybe never. Stop-loss and take-profit = exits chosen before you enter.',
      fr: 'Au marché = maintenant, quel que soit le prix. Limité = seulement à votre prix, peut-être jamais. Stop-loss et take-profit = des sorties choisies avant d’entrer.',
      ar: 'أمر السوق = الآن وبأي سعر. الأمر المحدد = فقط بسعرك، وربما لا يُنفَّذ أبدًا. وقف الخسارة وجني الأرباح = مخارج تُختار قبل الدخول.',
    },
    quiz: [
      {
        q: {
          en: 'You place a buy limit order at 95. The price falls to 97, then rises again. What happened to your order?',
          fr: 'Vous placez un achat limité à 95. Le prix descend à 97, puis remonte. Qu’est-il arrivé à votre ordre ?',
          ar: 'وضعت أمر شراء محددًا عند 95. نزل السعر إلى 97 ثم ارتفع من جديد. ماذا حدث لأمرك؟',
        },
        options: [
          { en: 'It did not fill', fr: 'Il ne s’est pas exécuté', ar: 'لم يُنفَّذ' },
          { en: 'It filled at 97', fr: 'Il s’est exécuté à 97', ar: 'نُفِّذ عند 97' },
          { en: 'It filled at 95 anyway', fr: 'Il s’est quand même exécuté à 95', ar: 'نُفِّذ عند 95 رغم ذلك' },
        ],
        answer: 0,
        why: {
          en: 'A buy limit fills only at your price or lower. The price never reached 95.',
          fr: 'Un achat limité ne s’exécute qu’à votre prix ou moins. Le prix n’a jamais atteint 95.',
          ar: 'أمر الشراء المحدد لا يُنفَّذ إلا بسعرك أو أقل، والسعر لم يصل إلى 95 أبدًا.',
        },
      },
      {
        q: { en: 'What is a stop-loss?', fr: 'Qu’est-ce qu’un stop-loss ?', ar: 'ما هو وقف الخسارة (stop-loss)؟' },
        options: [
          { en: 'A guarantee that you cannot lose', fr: 'Une garantie de ne pas perdre', ar: 'ضمان بأنك لن تخسر' },
          { en: 'A fee you pay when prices fall', fr: 'Des frais payés quand les prix baissent', ar: 'رسوم تدفعها عندما تهبط الأسعار' },
          {
            en: 'A price chosen in advance where a sell order is sent to limit a loss',
            fr: 'Un prix choisi à l’avance où un ordre de vente part pour limiter une perte',
            ar: 'سعر تختاره مسبقًا يُرسَل عنده أمر بيع للحدّ من الخسارة',
          },
        ],
        answer: 2,
        why: {
          en: 'It is an exit chosen before entering. In a fast drop it can fill a bit lower than planned.',
          fr: 'C’est une sortie choisie avant d’entrer. Dans une chute rapide, elle peut s’exécuter un peu plus bas que prévu.',
          ar: 'إنه مخرج يُختار قبل الدخول. وفي الهبوط السريع قد يُنفَّذ بسعر أقل قليلًا مما خُطِّط له.',
        },
      },
      {
        q: {
          en: 'What kind of order does Qirat’s practice wallet place today?',
          fr: 'Quel type d’ordre le portefeuille d’entraînement de Qirat passe-t-il aujourd’hui ?',
          ar: 'ما نوع الأوامر الذي تنفّذه محفظة التدريب في قيراط اليوم؟',
        },
        options: [
          { en: 'Limit orders only', fr: 'Seulement des ordres limités', ar: 'أوامر محددة فقط' },
          { en: 'Market orders', fr: 'Des ordres au marché', ar: 'أوامر السوق' },
          { en: 'Stop-loss orders', fr: 'Des stop-loss', ar: 'أوامر وقف الخسارة' },
        ],
        answer: 1,
        why: {
          en: 'Practice trades fill at once at the live price, plus the spread. Limit and stop orders are not there yet.',
          fr: 'Les opérations fictives s’exécutent tout de suite au prix en direct, plus l’écart. Les ordres limités et les stops n’y sont pas encore.',
          ar: 'العمليات التجريبية تُنفَّذ فورًا بالسعر الحي مع الفارق. الأوامر المحددة وأوامر الوقف غير موجودة بعد.',
        },
      },
    ],
  },

  {
    slug: 'karat',
    level: 2,
    minutes: 3,
    title: { en: 'What a karat means', fr: 'Ce que veut dire un carat', ar: 'ماذا يعني القيراط؟' },
    hook: {
      en: 'The way a goldsmith weighs gold, Qirat weighs coins: from 24K down to 10K.',
      fr: 'Comme un bijoutier pèse l’or, Qirat pèse les cryptos : de 24K à 10K.',
      ar: 'كما يزن الصائغ الذهب، يزن قيراط العملات: من 24K إلى 10K.',
    },
    terms: ['karat', 'momentum', 'volatility', 'risk-grade'],
    live: { kind: 'karat' },
    sections: [
      {
        h: { en: 'From 24K to 10K', fr: 'De 24K à 10K', ar: 'من 24K إلى 10K' },
        p: {
          en: 'Gold is graded in karats: 24K is pure, lower karats are mixed. Qirat uses the same idea for coins. 24K means calm and climbing compared with other big coins; 10K means wild or sliding. In between come 22K, 18K and 14K.',
          fr: 'L’or se mesure en carats : 24K, c’est l’or pur, les carats plus bas sont mélangés. Qirat applique la même idée aux cryptos. 24K veut dire calme et en hausse par rapport aux autres grandes cryptos ; 10K veut dire agitée ou en baisse. Entre les deux, il y a 22K, 18K et 14K.',
          ar: 'يُقاس الذهب بالقيراط: 24K هو الذهب الخالص، والقيراط الأقل يعني ذهبًا مخلوطًا. قيراط يطبّق نفس الفكرة على العملات. 24K تعني عملة هادئة وصاعدة مقارنة بالعملات الكبيرة الأخرى، و10K تعني عملة هائجة أو هابطة. وبينهما 22K و18K و14K.',
        },
      },
      {
        h: { en: 'Two things go in', fr: 'Deux ingrédients', ar: 'عنصران فقط' },
        p: {
          en: 'First, calm: how little the coin moved over the last 30 days. Second, trend: how much it rose or fell over about 90 days, leaving out the last week. Each coin is ranked on both against 18 big coins that Qirat tracks, from Bitcoin to SUI.',
          fr: 'D’abord le calme : à quel point la crypto a peu bougé sur les 30 derniers jours. Ensuite la tendance : de combien elle a monté ou baissé sur environ 90 jours, sans compter la dernière semaine. Chaque crypto est classée sur ces deux points face à 18 grandes cryptos suivies par Qirat, du Bitcoin au SUI.',
          ar: 'أولًا الهدوء: إلى أي حد كانت حركة العملة قليلة خلال آخر 30 يومًا. ثانيًا الاتجاه: كم ارتفعت أو انخفضت خلال حوالي 90 يومًا، دون احتساب الأسبوع الأخير. وتُرتَّب كل عملة على هذين الأمرين مقارنة بـ 18 عملة كبيرة يتابعها قيراط، من Bitcoin إلى SUI.',
        },
      },
      {
        h: { en: 'How the score becomes a karat', fr: 'Comment le score devient un carat', ar: 'كيف تتحول النتيجة إلى قيراط' },
        p: {
          en: 'Say a coin is calmer than 80% of the big coins and its trend is stronger than 60% of them. Its score is the average: 70. A score of 80 or more gives 24K, 60 or more 22K, 40 or more 18K, 20 or more 14K, and below that 10K. So this coin is 22K.',
          fr: 'Disons qu’une crypto est plus calme que 80 % des grandes cryptos et que sa tendance est plus forte que 60 % d’entre elles. Son score est la moyenne : 70. Un score de 80 ou plus donne 24K, 60 ou plus 22K, 40 ou plus 18K, 20 ou plus 14K, et en dessous 10K. Cette crypto est donc 22K.',
          ar: 'لنفترض أن عملة أهدأ من 80% من العملات الكبيرة، واتجاهها أقوى من 60% منها. نتيجتها هي المتوسط: 70. النتيجة 80 أو أكثر تعطي 24K، و60 أو أكثر 22K، و40 أو أكثر 18K، و20 أو أكثر 14K، وما دون ذلك 10K. إذن هذه العملة 22K.',
        },
      },
      {
        h: { en: 'A karat compares, it does not protect', fr: 'Un carat compare, il ne protège pas', ar: 'القيراط يقارن ولا يحمي' },
        p: {
          en: 'Karats rank coins against each other, and they change as prices change. When the whole market falls, the ranking stays but prices drop together: in a stormy market even 24K coins usually fall. A coin with less than 3 months of history gets no karat yet.',
          fr: 'Les carats classent les cryptos entre elles, et ils changent quand les prix changent. Quand tout le marché baisse, le classement reste mais les prix tombent ensemble : dans un marché orageux, même les 24K baissent souvent. Une crypto qui a moins de 3 mois d’historique n’a pas encore de carat.',
          ar: 'القيراط يرتّب العملات مقارنة ببعضها، ويتغيّر عندما تتغيّر الأسعار. عندما يهبط السوق كله، يبقى الترتيب لكن الأسعار تنزل معًا: في سوق عاصف، حتى عملات 24K تهبط عادة. والعملة التي لديها أقل من 3 أشهر من البيانات لا تحصل على قيراط بعد.',
        },
      },
      {
        h: { en: 'What the test found', fr: 'Ce qu’a montré le test', ar: 'ماذا وجد الاختبار' },
        p: {
          en: 'In Qirat’s October 2026 test on past data, calm coins with a 90-day uptrend did a little better on average than the rest. That is a weak edge, not a promise: a weak edge is often wrong for any single coin. The risk grade, built from the same 30-day swings, has been the more reliable part.',
          fr: 'Dans le test de Qirat d’octobre 2026 sur des données passées, les cryptos calmes en tendance haussière sur 90 jours ont fait un peu mieux en moyenne que les autres. C’est un avantage faible, pas une promesse : un avantage faible se trompe souvent pour une crypto donnée. La note de risque, construite sur les mêmes variations de 30 jours, a été la partie la plus fiable.',
          ar: 'في اختبار قيراط في أكتوبر 2026 على بيانات سابقة، كانت العملات الهادئة ذات الاتجاه الصاعد على 90 يومًا أفضل قليلًا في المتوسط من غيرها. إنها أفضلية ضعيفة وليست وعدًا: والأفضلية الضعيفة تخطئ كثيرًا مع أي عملة بمفردها. أما درجة المخاطرة، المبنية على نفس تحركات الـ 30 يومًا، فكانت الجزء الأكثر موثوقية.',
        },
      },
      {
        h: { en: 'Never an instruction', fr: 'Jamais une consigne', ar: 'ليس أمرًا أبدًا' },
        p: {
          en: 'A karat is never an instruction to buy, sell or hold. Read it next to the coin’s risk grade and its rough month: even the calmest crypto can lose a lot in a bad month.',
          fr: 'Un carat n’est jamais une consigne d’acheter, de vendre ou de garder. Lisez-le avec la note de risque de la crypto et son mauvais mois : même la crypto la plus calme peut beaucoup perdre en un mauvais mois.',
          ar: 'القيراط ليس أبدًا أمرًا بالشراء أو البيع أو الاحتفاظ. اقرأه مع درجة المخاطرة للعملة ومع شهرها الصعب: حتى أهدأ عملة رقمية قد تخسر الكثير في شهر سيئ.',
        },
      },
    ],
    takeaway: {
      en: 'A karat ranks a coin’s calm and 90-day trend against 18 big coins. It compares; it does not predict, protect, or tell you what to do.',
      fr: 'Un carat classe le calme et la tendance sur 90 jours d’une crypto face à 18 grandes cryptos. Il compare ; il ne prédit pas, ne protège pas et ne vous dit pas quoi faire.',
      ar: 'القيراط يرتّب هدوء العملة واتجاهها على 90 يومًا مقارنة بـ 18 عملة كبيرة. هو يقارن فقط: لا يتنبأ، ولا يحمي، ولا يقول لك ماذا تفعل.',
    },
    quiz: [
      {
        q: {
          en: 'What two things make a coin’s karat?',
          fr: 'Quels sont les deux ingrédients du carat d’une crypto ?',
          ar: 'ما العنصران اللذان يصنعان قيراط العملة؟',
        },
        options: [
          { en: 'Its price and how famous it is', fr: 'Son prix et sa célébrité', ar: 'سعرها ومدى شهرتها' },
          { en: 'How many people bought it today', fr: 'Le nombre de gens qui l’ont achetée aujourd’hui', ar: 'عدد من اشتروها اليوم' },
          {
            en: 'Its calm over 30 days and its trend over about 90 days',
            fr: 'Son calme sur 30 jours et sa tendance sur environ 90 jours',
            ar: 'هدوؤها خلال 30 يومًا واتجاهها خلال حوالي 90 يومًا',
          },
        ],
        answer: 2,
        why: {
          en: 'Calm and trend, each ranked against 18 big coins, then averaged.',
          fr: 'Le calme et la tendance, chacun classé face à 18 grandes cryptos, puis on fait la moyenne.',
          ar: 'الهدوء والاتجاه، كل منهما يُرتَّب مقارنة بـ 18 عملة كبيرة، ثم يُؤخذ المتوسط.',
        },
      },
      {
        q: {
          en: 'The market is stormy. What usually happens to 24K coins?',
          fr: 'Le marché est orageux. Que se passe-t-il en général pour les cryptos 24K ?',
          ar: 'السوق عاصف. ماذا يحدث عادة لعملات 24K؟',
        },
        options: [
          { en: 'They are protected from falling', fr: 'Elles sont protégées contre la baisse', ar: 'هي محمية من الهبوط' },
          { en: 'They usually fall too', fr: 'Elles baissent souvent aussi', ar: 'تهبط هي أيضًا عادة' },
          { en: 'They always rise in storms', fr: 'Elles montent toujours pendant l’orage', ar: 'ترتفع دائمًا في العاصفة' },
        ],
        answer: 1,
        why: {
          en: 'Karats compare coins with each other. In a storm most coins fall together, 24K ones included.',
          fr: 'Les carats comparent les cryptos entre elles. Dans l’orage, la plupart baissent ensemble, 24K comprises.',
          ar: 'القيراط يقارن العملات ببعضها. وفي العاصفة تهبط أغلب العملات معًا، ومنها عملات 24K.',
        },
      },
      {
        q: {
          en: 'A coin is 24K today. What does that tell you to do?',
          fr: 'Une crypto est 24K aujourd’hui. Qu’est-ce que ça vous dit de faire ?',
          ar: 'عملة حصلت اليوم على 24K. ماذا يطلب منك ذلك أن تفعل؟',
        },
        options: [
          { en: 'Nothing: a karat is never an instruction', fr: 'Rien : un carat n’est jamais une consigne', ar: 'لا شيء: القيراط ليس أمرًا أبدًا' },
          { en: 'Buy it before it drops', fr: 'L’acheter avant qu’elle baisse', ar: 'أن تشتريها قبل أن تهبط' },
          { en: 'Sell your other coins', fr: 'Vendre vos autres cryptos', ar: 'أن تبيع عملاتك الأخرى' },
        ],
        answer: 0,
        why: {
          en: 'It describes calm and trend compared with other coins. What you do is your own decision.',
          fr: 'Il décrit le calme et la tendance par rapport aux autres cryptos. Ce que vous faites reste votre décision.',
          ar: 'هو يصف الهدوء والاتجاه مقارنة بالعملات الأخرى. أما ما تفعله فهو قرارك أنت.',
        },
      },
    ],
  },

  {
    slug: 'market-weather',
    level: 2,
    minutes: 3,
    title: {
      en: 'Market weather: moving averages and the crowd',
      fr: 'La météo du marché : moyennes mobiles et humeur de la foule',
      ar: 'طقس السوق: المتوسطات المتحركة ومزاج الناس',
    },
    hook: {
      en: 'Before looking at one coin, look at the sky over the whole market.',
      fr: 'Avant de regarder une crypto, regardez le ciel au-dessus de tout le marché.',
      ar: 'قبل أن تنظر إلى عملة واحدة، انظر إلى سماء السوق كله.',
    },
    terms: ['moving-average', 'fear-greed', 'funding-rate'],
    live: { kind: 'weather' },
    sections: [
      {
        h: { en: 'What a moving average is', fr: 'C’est quoi une moyenne mobile', ar: 'ما هو المتوسط المتحرك' },
        p: {
          en: 'A 50-day moving average is the average closing price of the last 50 days. Each new day adds one price and drops the oldest, so the line moves slowly behind the price. The 200-day average does the same over a much longer stretch.',
          fr: 'Une moyenne mobile sur 50 jours, c’est le prix de clôture moyen des 50 derniers jours. Chaque nouveau jour ajoute un prix et retire le plus ancien : la ligne avance lentement derrière le prix. La moyenne sur 200 jours fait la même chose sur une période bien plus longue.',
          ar: 'المتوسط المتحرك (moving average) لـ 50 يومًا هو متوسط أسعار الإغلاق في آخر 50 يومًا. كل يوم جديد يضيف سعرًا ويحذف أقدمها، فيتحرك الخط ببطء خلف السعر. والمتوسط لـ 200 يوم يفعل الشيء نفسه على فترة أطول بكثير.',
        },
      },
      {
        h: { en: 'Above or below the line', fr: 'Au-dessus ou en dessous de la ligne', ar: 'فوق الخط أو تحته' },
        p: {
          en: 'When the price is above its 50-day average, it is higher than its recent normal: the recent direction is up. Below it, the recent direction is down. The 200-day line helps tell a short dip apart from a longer downtrend.',
          fr: 'Quand le prix est au-dessus de sa moyenne sur 50 jours, il est plus haut que sa normale récente : la direction récente est à la hausse. En dessous, elle est à la baisse. La ligne des 200 jours aide à distinguer un petit creux d’une baisse plus longue.',
          ar: 'عندما يكون السعر فوق متوسطه لـ 50 يومًا، فهو أعلى من مستواه المعتاد مؤخرًا: الاتجاه الأخير صاعد. وعندما يكون تحته، فالاتجاه الأخير هابط. أما خط الـ 200 يوم فيساعد على التمييز بين نزول قصير واتجاه هابط أطول.',
        },
      },
      {
        h: { en: 'Qirat’s three skies', fr: 'Les trois ciels de Qirat', ar: 'سماوات قيراط الثلاث' },
        p: {
          en: 'Qirat looks at Bitcoin, because most coins tend to move with it. Calm: Bitcoin is above its 50-day average and the crowd is not overheated. Choppy: Bitcoin is above it but the crowd is overheated, or it slipped below the 50-day line while staying above the 200-day one. Stormy: Bitcoin is below both lines.',
          fr: 'Qirat regarde le Bitcoin, car la plupart des cryptos ont tendance à bouger avec lui. Calme : le Bitcoin est au-dessus de sa moyenne sur 50 jours et la foule n’est pas en surchauffe. Agité : il est au-dessus mais la foule surchauffe, ou il est passé sous la ligne des 50 jours tout en restant au-dessus de celle des 200 jours. Orageux : le Bitcoin est sous les deux lignes.',
          ar: 'ينظر قيراط إلى Bitcoin، لأن أغلب العملات تميل إلى التحرك معه. هادئ: Bitcoin فوق متوسطه لـ 50 يومًا والناس ليسوا في حالة اندفاع. متقلب: Bitcoin فوقه لكن الناس مندفعون جدًا، أو نزل تحت خط الـ 50 يومًا مع بقائه فوق خط الـ 200 يوم. عاصف: Bitcoin تحت الخطين معًا.',
        },
      },
      {
        h: { en: 'How the crowd’s mood counts', fr: 'Comment compte l’humeur de la foule', ar: 'كيف يُحسب مزاج الناس' },
        p: {
          en: 'Two gauges measure the crowd. The Fear & Greed index scores the mood around Bitcoin from 0 (extreme fear) to 100 (extreme greed). Funding is a small payment that traders betting on a rise with borrowed money on futures make to stay in; when it is high, many have bet on a rise. If Fear & Greed is 80 or more, or funding is high, a calm sky turns choppy. The crowd never makes the sky calm on its own.',
          fr: 'Deux jauges mesurent la foule. L’indice Fear & Greed note l’humeur autour du Bitcoin de 0 (peur extrême) à 100 (avidité extrême). Le funding est un petit paiement que versent les traders qui parient sur une hausse avec de l’argent emprunté sur les contrats à terme, pour rester en position ; quand il est élevé, beaucoup ont parié sur une hausse. Si le Fear & Greed est à 80 ou plus, ou si le funding est élevé, un ciel calme devient agité. La foule ne rend jamais le ciel calme à elle seule.',
          ar: 'مقياسان يقيسان مزاج الناس. مؤشر Fear & Greed يقيّم المزاج حول Bitcoin من 0 (خوف شديد) إلى 100 (طمع شديد). ورسوم التمويل (funding) دفعة صغيرة يدفعها من يراهنون على الصعود بأموال مقترضة في العقود الآجلة ليبقوا في مراكزهم، وعندما تكون مرتفعة فهذا يعني أن كثيرين راهنوا على الصعود. إذا كان Fear & Greed عند 80 أو أكثر، أو كان التمويل مرتفعًا، يتحول الطقس الهادئ إلى متقلب. لكن مزاج الناس وحده لا يجعل الطقس هادئًا أبدًا.',
        },
      },
      {
        h: { en: 'What the past shows, and what it doesn’t', fr: 'Ce que montre le passé, et ce qu’il ne montre pas', ar: 'ماذا يُظهر الماضي، وماذا لا يُظهر' },
        p: {
          en: 'Qirat checked Bitcoin from 2021 to 2026. For months that started with Bitcoin above its 50-day average, the middle result (the median) of the next 30 days was +3.0%; for months that started below it, −2.1%. That is a tilt in past data, not a promise: a median hides many months that went the other way.',
          fr: 'Qirat a étudié le Bitcoin de 2021 à 2026. Pour les mois commencés avec le Bitcoin au-dessus de sa moyenne sur 50 jours, le résultat du milieu (la médiane) des 30 jours suivants était de +3,0 % ; pour ceux commencés en dessous, −2,1 %. C’est une tendance dans des données passées, pas une promesse : une médiane cache beaucoup de mois qui sont allés dans l’autre sens.',
          ar: 'درس قيراط سعر Bitcoin من 2021 إلى 2026. في الأشهر التي بدأت وBitcoin فوق متوسطه لـ 50 يومًا، كانت النتيجة الوسطى (الوسيط) للـ 30 يومًا التالية +3.0%، وفي الأشهر التي بدأت وهو تحته كانت −2.1%. هذا ميل في بيانات سابقة وليس وعدًا: الوسيط يخفي أشهرًا كثيرة سارت في الاتجاه المعاكس.',
        },
      },
      {
        h: { en: 'Weather is not a forecast', fr: 'La météo n’est pas une prévision', ar: 'الطقس ليس توقعًا' },
        p: {
          en: 'The weather describes the whole market today. It does not tell you what one coin will do tomorrow, and it is not a signal to buy or sell. It tells you how rough the sea is before you practise.',
          fr: 'La météo décrit tout le marché aujourd’hui. Elle ne dit pas ce qu’une crypto fera demain, et ce n’est pas un signal d’achat ou de vente. Elle vous dit si la mer est agitée avant de vous entraîner.',
          ar: 'الطقس يصف السوق كله اليوم. لا يخبرك بما ستفعله عملة واحدة غدًا، وليس إشارة للشراء أو البيع. هو يخبرك بحالة البحر قبل أن تتدرّب.',
        },
      },
    ],
    takeaway: {
      en: 'Calm, choppy or stormy comes from Bitcoin against its 50-day and 200-day averages, plus the crowd’s mood. It describes today; it does not predict.',
      fr: 'Calme, agité ou orageux vient du Bitcoin face à ses moyennes sur 50 et 200 jours, plus l’humeur de la foule. Ça décrit aujourd’hui, ça ne prédit rien.',
      ar: 'هادئ أو متقلب أو عاصف: يأتي من موقع Bitcoin مقارنة بمتوسطيه لـ 50 و200 يوم، ومن مزاج الناس. هو يصف اليوم ولا يتنبأ.',
    },
    quiz: [
      {
        q: {
          en: 'What is a 50-day moving average?',
          fr: 'Qu’est-ce qu’une moyenne mobile sur 50 jours ?',
          ar: 'ما هو المتوسط المتحرك لـ 50 يومًا؟',
        },
        options: [
          { en: 'The highest price of the last 50 days', fr: 'Le prix le plus haut des 50 derniers jours', ar: 'أعلى سعر في آخر 50 يومًا' },
          {
            en: 'The average closing price of the last 50 days',
            fr: 'Le prix de clôture moyen des 50 derniers jours',
            ar: 'متوسط أسعار الإغلاق في آخر 50 يومًا',
          },
          { en: 'A forecast for the next 50 days', fr: 'Une prévision pour les 50 prochains jours', ar: 'توقع للأيام الـ 50 القادمة' },
        ],
        answer: 1,
        why: {
          en: 'It averages the last 50 daily closes, so it moves slowly behind the price.',
          fr: 'Elle fait la moyenne des 50 dernières clôtures journalières : elle avance lentement derrière le prix.',
          ar: 'هو متوسط آخر 50 سعر إغلاق يومي، لذلك يتحرك ببطء خلف السعر.',
        },
      },
      {
        q: {
          en: 'Bitcoin is below both its 50-day and 200-day averages. What is Qirat’s weather?',
          fr: 'Le Bitcoin est sous ses moyennes sur 50 et sur 200 jours. Quelle est la météo de Qirat ?',
          ar: 'Bitcoin تحت متوسطيه لـ 50 يومًا و200 يوم. ما هو طقس قيراط؟',
        },
        options: [
          { en: 'Calm', fr: 'Calme', ar: 'هادئ' },
          { en: 'Choppy', fr: 'Agité', ar: 'متقلب' },
          { en: 'Stormy', fr: 'Orageux', ar: 'عاصف' },
        ],
        answer: 2,
        why: {
          en: 'Below both lines is stormy. In storms most coins fall, even 24K ones.',
          fr: 'Sous les deux lignes, c’est orageux. Dans l’orage, la plupart des cryptos baissent, même les 24K.',
          ar: 'تحت الخطين معًا يعني عاصفًا. وفي العاصفة تهبط أغلب العملات، حتى عملات 24K.',
        },
      },
      {
        q: {
          en: 'Bitcoin is above its 50-day average, but Fear & Greed is at 85. What is the weather?',
          fr: 'Le Bitcoin est au-dessus de sa moyenne sur 50 jours, mais le Fear & Greed est à 85. Quelle est la météo ?',
          ar: 'Bitcoin فوق متوسطه لـ 50 يومًا، لكن مؤشر Fear & Greed عند 85. ما هو الطقس؟',
        },
        options: [
          { en: 'Choppy', fr: 'Agité', ar: 'متقلب' },
          { en: 'Calm', fr: 'Calme', ar: 'هادئ' },
          { en: 'Stormy', fr: 'Orageux', ar: 'عاصف' },
        ],
        answer: 0,
        why: {
          en: 'An overheated crowd turns a calm sky choppy. The crowd’s mood never makes it calm on its own.',
          fr: 'Une foule en surchauffe fait passer un ciel calme à agité. L’humeur de la foule ne le rend jamais calme à elle seule.',
          ar: 'اندفاع الناس الشديد يحوّل الطقس الهادئ إلى متقلب. ومزاج الناس وحده لا يجعله هادئًا أبدًا.',
        },
      },
    ],
  },

  {
    slug: 'fomo',
    level: 2,
    minutes: 2,
    title: {
      en: 'FOMO: why buying after a big jump hurts',
      fr: 'Le FOMO : pourquoi acheter après une grosse hausse fait mal',
      ar: 'الـ FOMO: لماذا يؤلم الشراء بعد قفزة كبيرة',
    },
    hook: {
      en: 'When everyone is talking about a coin, most of the move has often already happened.',
      fr: 'Quand tout le monde parle d’une crypto, la plus grosse partie du mouvement est souvent déjà passée.',
      ar: 'عندما يتحدث الجميع عن عملة ما، يكون أغلب الارتفاع قد حدث في كثير من الأحيان.',
    },
    terms: ['fomo', 'fear-greed', 'pullback'],
    live: { kind: 'weather' },
    sections: [
      {
        h: { en: 'What FOMO is', fr: 'C’est quoi le FOMO', ar: 'ما هو الـ FOMO' },
        p: {
          en: 'Fear Of Missing Out: the feeling you get when a coin is up 50% this week, your friends are all posting about it, and you feel you have to get in right now.',
          fr: 'Fear Of Missing Out, la peur de rater le coche : ce que vous ressentez quand une crypto a pris 50 % cette semaine, que vos amis en parlent tous et que vous sentez qu’il faut y aller tout de suite.',
          ar: 'Fear Of Missing Out، أي الخوف من تفويت الفرصة: هو الشعور الذي ينتابك عندما ترتفع عملة 50% هذا الأسبوع، ويتحدث عنها كل أصدقائك، وتشعر أن عليك الدخول فورًا.',
        },
      },
      {
        h: { en: 'Why it hurts', fr: 'Pourquoi ça fait mal', ar: 'لماذا يؤلم' },
        p: {
          en: 'Big jumps attract late buyers, and early buyers often sell to them. A fast rise usually comes with bigger swings than normal, in both directions, so a sharp drop soon after you buy is common. Then fear pushes you to sell low. Buying high and selling low is the opposite of what anyone wants.',
          fr: 'Les grosses hausses attirent les acheteurs tardifs, et les premiers leur revendent souvent. Une montée rapide s’accompagne en général de variations plus fortes que d’habitude, dans les deux sens : une chute brutale juste après votre achat est donc fréquente. Puis la peur pousse à vendre bas. Acheter haut et vendre bas, c’est l’inverse de ce que tout le monde veut.',
          ar: 'القفزات الكبيرة تجذب المشترين المتأخرين، والمشترون الأوائل كثيرًا ما يبيعون لهم. الصعود السريع يأتي عادةً مع تقلبات أكبر من المعتاد، في الاتجاهين، لذلك الهبوط الحاد بعد شرائك بقليل أمر شائع. ثم يدفعك الخوف إلى البيع بسعر منخفض. الشراء غاليًا والبيع رخيصًا هو عكس ما يريده أي شخص.',
        },
      },
      {
        h: { en: 'The crowd’s mood', fr: 'L’humeur de la foule', ar: 'مزاج الجمهور' },
        p: {
          en: 'The Fear & Greed index scores the Bitcoin crowd’s mood from 0 (extreme fear) to 100 (extreme greed). Extreme greed means many people have already bought; it does not tell you when the price will turn. In Qirat, extreme greed is one of the things that turns the market weather from “calm” to “choppy”.',
          fr: 'L’indice Fear & Greed note l’humeur de la foule du Bitcoin de 0 (peur extrême) à 100 (avidité extrême). Une avidité extrême veut dire que beaucoup de gens ont déjà acheté ; ça ne dit pas quand le prix va se retourner. Dans Qirat, l’avidité extrême fait partie de ce qui fait passer la météo du marché de « calme » à « agité ».',
          ar: 'مؤشر Fear & Greed يقيس مزاج جمهور Bitcoin من 0 (خوف شديد) إلى 100 (طمع شديد). الطمع الشديد يعني أن كثيرًا من الناس اشتروا بالفعل؛ لكنه لا يخبرك متى سينعكس السعر. في قيراط، الطمع الشديد من الأمور التي تحوّل طقس السوق من «هادئ» إلى «متقلب».',
        },
      },
      {
        h: { en: 'A calm routine', fr: 'Une routine calme', ar: 'روتين هادئ' },
        p: {
          en: 'Before any decision, wait 24 hours. Write down why you want it, and what you would do if it fell 30%. Look at its risk grade and its rough month (what you could lose in a bad month). If the only reason is “everyone is buying”, that is FOMO talking. In the practice wallet, the habit coach points it out when you buy a coin that rose more than 15% in 7 days.',
          fr: 'Avant toute décision, attendez 24 heures. Écrivez pourquoi vous la voulez, et ce que vous feriez si elle perdait 30 %. Regardez sa note de risque et son mauvais mois (ce que vous pourriez perdre pendant un mauvais mois). Si la seule raison est « tout le monde achète », c’est le FOMO qui parle. Dans le portefeuille d’entraînement, le coach des habitudes le signale quand vous achetez une crypto qui a pris plus de 15 % en 7 jours.',
          ar: 'قبل أي قرار، انتظر 24 ساعة. اكتب لماذا تريدها، وماذا ستفعل إذا هبطت 30%. انظر إلى درجة مخاطرتها وإلى شهرها الصعب (كم يمكن أن تخسر في شهر سيئ). إذا كان السبب الوحيد «الجميع يشتري»، فهذا هو الـ FOMO يتكلم. في محفظة التدريب، ينبّهك مدرب العادات عندما تشتري عملة ارتفعت أكثر من 15% في 7 أيام.',
        },
      },
      {
        h: { en: 'Missing out is fine', fr: 'Rater, ce n’est pas grave', ar: 'فاتتك؟ لا بأس' },
        p: {
          en: 'There will always be another coin and another week. A jump you missed costs you nothing. Chasing one can cost you a lot.',
          fr: 'Il y aura toujours une autre crypto et une autre semaine. Une hausse ratée ne vous coûte rien. En courir une peut coûter cher.',
          ar: 'ستكون هناك دائمًا عملة أخرى وأسبوع آخر. القفزة التي فاتتك لا تكلّفك شيئًا. أما مطاردتها فقد تكلّفك كثيرًا.',
        },
      },
    ],
    takeaway: {
      en: 'Big jump + loud crowd = slow down. A move you missed costs you nothing.',
      fr: 'Grosse hausse + foule bruyante = ralentir. Un mouvement raté ne coûte rien.',
      ar: 'قفزة كبيرة + جمهور صاخب = تمهّل. الحركة التي فاتتك لا تكلّفك شيئًا.',
    },
    quiz: [
      {
        q: { en: 'Which thought is FOMO talking?', fr: 'Quelle pensée est le FOMO qui parle ?', ar: 'أي فكرة هي صوت الـ FOMO؟' },
        options: [
          { en: '“Let me check its rough month first”', fr: '« Je regarde d’abord son mauvais mois »', ar: '«دعني أنظر إلى شهرها الصعب أولًا»' },
          { en: '“I’ll wait 24 hours”', fr: '« J’attends 24 heures »', ar: '«سأنتظر 24 ساعة»' },
          { en: '“I must get in now before it’s too late”', fr: '« Il faut y aller maintenant avant qu’il soit trop tard »', ar: '«يجب أن أدخل الآن قبل فوات الأوان»' },
        ],
        answer: 2,
        why: {
          en: 'Urgency with no reason except “it’s going up” is the signature of FOMO.',
          fr: 'L’urgence sans autre raison que « ça monte », c’est la signature du FOMO.',
          ar: 'الاستعجال بلا سبب سوى «إنها ترتفع» هو توقيع الـ FOMO.',
        },
      },
      {
        q: {
          en: 'What often comes with a very fast rise?',
          fr: 'Qu’est-ce qui accompagne souvent une montée très rapide ?',
          ar: 'ما الذي يرافق غالبًا الصعود السريع جدًا؟',
        },
        options: [
          { en: 'Bigger swings, including sharp drops', fr: 'Des variations plus fortes, y compris des chutes brutales', ar: 'تقلبات أكبر، منها هبوط حاد' },
          { en: 'Prices that keep rising for sure', fr: 'Des prix qui montent encore à coup sûr', ar: 'أسعار تواصل الصعود بالتأكيد' },
          { en: 'A frozen price', fr: 'Un prix gelé', ar: 'سعر متجمد' },
        ],
        answer: 0,
        why: {
          en: 'Fast rises pull in late buyers, early buyers often take their profit, and the price swings harder. It can fall back quickly.',
          fr: 'Les montées rapides attirent les retardataires, les premiers prennent souvent leurs gains, et le prix bouge plus fort. Il peut vite redescendre.',
          ar: 'الصعود السريع يجذب المتأخرين، والأوائل كثيرًا ما يأخذون أرباحهم، فيتقلب السعر أكثر. وقد يعود إلى الهبوط بسرعة.',
        },
      },
      {
        q: {
          en: 'What does missing a big jump cost you?',
          fr: 'Que vous coûte une grosse hausse ratée ?',
          ar: 'كم تكلّفك قفزة كبيرة فاتتك؟',
        },
        options: [
          { en: 'A fee', fr: 'Des frais', ar: 'رسومًا' },
          { en: 'Nothing', fr: 'Rien', ar: 'لا شيء' },
          { en: 'Your account', fr: 'Votre compte', ar: 'حسابك' },
        ],
        answer: 1,
        why: {
          en: 'You lose no money by missing a move. Chasing it is what can cost you.',
          fr: 'On ne perd pas d’argent en ratant un mouvement. C’est le fait de courir après qui peut coûter.',
          ar: 'لا تخسر أي مال عندما تفوتك حركة. ما قد يكلّفك هو مطاردتها.',
        },
      },
    ],
  },
]
