// Level 1 · Basics: understand what you are touching. Lessons in course order; see ../lessons.ts for the rules.

import type { Lesson } from '../lessons.ts'

export const BASICS: Lesson[] = [
  {
    slug: 'bitcoin',
    level: 1,
    minutes: 2,
    title: {
      en: 'What is crypto? Start with Bitcoin',
      fr: 'C’est quoi la crypto ? On commence par le Bitcoin',
      ar: 'ما هي العملات الرقمية؟ لنبدأ بـ Bitcoin',
    },
    hook: {
      en: 'Money that lives on the internet, with no bank in the middle.',
      fr: 'De l’argent qui vit sur internet, sans banque au milieu.',
      ar: 'مال يعيش على الإنترنت، بدون بنك في الوسط.',
    },
    terms: ['crypto', 'blockchain', 'bitcoin', 'satoshi'],
    live: { kind: 'coin', symbol: 'BTC' },
    sections: [
      {
        h: { en: 'Money with no bank in the middle', fr: 'De l’argent sans banque au milieu', ar: 'مال بدون بنك في الوسط' },
        p: {
          en: 'When you send money through a bank, the bank keeps the record of who owns what. Crypto replaces the bank with a shared notebook, copied on thousands of computers around the world. That notebook is called a blockchain. Nobody can secretly erase a line, because everyone has a copy.',
          fr: 'Quand vous envoyez de l’argent par la banque, c’est elle qui tient le registre de qui possède quoi. La crypto remplace la banque par un cahier partagé, copié sur des milliers d’ordinateurs dans le monde. Ce cahier s’appelle une blockchain. Personne ne peut effacer une ligne en douce, car tout le monde en a une copie.',
          ar: 'عندما ترسل المال عبر البنك، يحتفظ البنك بسجل من يملك ماذا. العملات الرقمية (crypto) تستبدل البنك بدفتر مشترك، منسوخ على آلاف الحواسيب حول العالم. هذا الدفتر اسمه blockchain. لا أحد يستطيع أن يمحو سطرًا في الخفاء، لأن الجميع يملك نسخة منه.',
        },
      },
      {
        h: { en: 'Bitcoin, the first one', fr: 'Le Bitcoin, le premier', ar: 'Bitcoin، العملة الأولى' },
        p: {
          en: 'Bitcoin was described in a paper signed “Satoshi Nakamoto” in October 2008 and started running in January 2009. There will never be more than 21 million bitcoins: that limit is written in its code. One bitcoin splits into 100 million tiny parts called satoshis, so you can own a small piece, like 0.001 BTC.',
          fr: 'Le Bitcoin a été décrit dans un texte signé « Satoshi Nakamoto » en octobre 2008 et a démarré en janvier 2009. Il n’y aura jamais plus de 21 millions de bitcoins : cette limite est écrite dans son code. Un bitcoin se divise en 100 millions de petites parts appelées satoshis : on peut donc en posséder un petit morceau, comme 0,001 BTC.',
          ar: 'وُصف Bitcoin في ورقة موقّعة باسم «Satoshi Nakamoto» في أكتوبر 2008، وبدأ العمل في يناير 2009. لن يكون هناك أبدًا أكثر من 21 مليون bitcoin: هذا الحد مكتوب في برمجته. والـ bitcoin الواحد ينقسم إلى 100 مليون جزء صغير اسمها satoshi، لذلك يمكنك أن تملك جزءًا صغيرًا، مثل 0.001 BTC.',
        },
      },
      {
        h: { en: 'Why does it have a price?', fr: 'Pourquoi a-t-il un prix ?', ar: 'لماذا له سعر؟' },
        p: {
          en: 'There is no factory and no profit behind Bitcoin. Its price is simply what people agree to pay for it today. When more people want it, the price goes up. When they leave, it falls. That is why it can move a lot in a single day.',
          fr: 'Il n’y a ni usine ni bénéfices derrière le Bitcoin. Son prix, c’est simplement ce que les gens acceptent de payer aujourd’hui. Quand plus de monde en veut, le prix monte. Quand les gens partent, il baisse. C’est pour ça qu’il peut beaucoup bouger en une seule journée.',
          ar: 'لا يوجد مصنع ولا أرباح وراء Bitcoin. سعره ببساطة هو ما يقبل الناس دفعه مقابله اليوم. عندما يزيد عدد من يريدونه، يرتفع السعر. وعندما يغادرون، ينخفض. لهذا يمكن أن يتحرك كثيرًا في يوم واحد.',
        },
      },
      {
        h: { en: 'Thousands of other coins', fr: 'Des milliers d’autres cryptos', ar: 'آلاف العملات الأخرى' },
        p: {
          en: 'Today the CoinGecko website lists more than 22,000 cryptocurrencies. A few are big and well known. Most are small, and many die: CoinGecko counted that more than half of the tokens listed since 2021 are no longer traded. New does not mean better.',
          fr: 'Aujourd’hui, le site CoinGecko recense plus de 22 000 cryptomonnaies. Quelques-unes sont grandes et connues. La plupart sont petites, et beaucoup meurent : CoinGecko a compté que plus de la moitié des jetons listés depuis 2021 ne s’échangent plus. Nouveau ne veut pas dire meilleur.',
          ar: 'اليوم يعرض موقع CoinGecko أكثر من 22,000 عملة رقمية. القليل منها كبير ومعروف. أغلبها صغير، وكثير منها يموت: حسب CoinGecko، أكثر من نصف الرموز التي أُدرجت منذ 2021 لم يعد أحد يتداولها. الجديد لا يعني الأفضل.',
        },
      },
      {
        h: { en: 'What it is not', fr: 'Ce que ce n’est pas', ar: 'ما ليست عليه' },
        p: {
          en: 'Crypto is not a savings account. No bank and no state guarantees its value. If the price drops, nobody pays you back.',
          fr: 'La crypto n’est pas un livret d’épargne. Aucune banque et aucun État ne garantit sa valeur. Si le prix chute, personne ne vous rembourse.',
          ar: 'العملات الرقمية ليست حساب توفير. لا يضمن قيمتها أي بنك ولا أي دولة. إذا انخفض السعر، لن يعوّضك أحد.',
        },
      },
    ],
    takeaway: {
      en: 'Crypto is a shared record of who owns what. Its price is only what people will pay for it today.',
      fr: 'La crypto, c’est un registre partagé de qui possède quoi. Son prix, c’est seulement ce que les gens paient aujourd’hui.',
      ar: 'العملات الرقمية سجل مشترك لمن يملك ماذا. وسعرها هو فقط ما يقبل الناس دفعه اليوم.',
    },
    quiz: [
      {
        q: { en: 'What is a blockchain?', fr: 'C’est quoi une blockchain ?', ar: 'ما هو الـ blockchain؟' },
        options: [
          {
            en: 'A shared record copied on many computers',
            fr: 'Un registre partagé copié sur beaucoup d’ordinateurs',
            ar: 'سجل مشترك منسوخ على حواسيب كثيرة',
          },
          { en: 'A dollar account at a bank', fr: 'Un compte en dollars à la banque', ar: 'حساب بالدولار في بنك' },
          { en: 'An app made by the Bitcoin company', fr: 'Une appli de la société Bitcoin', ar: 'تطبيق تابع لشركة Bitcoin' },
        ],
        answer: 0,
        why: {
          en: 'It is a shared notebook. No single company or bank owns it, and there is no “Bitcoin company”.',
          fr: 'C’est un cahier partagé. Aucune entreprise ni banque ne le possède seule, et il n’existe pas de « société Bitcoin ».',
          ar: 'هو دفتر مشترك. لا تملكه شركة واحدة ولا بنك واحد، ولا توجد «شركة Bitcoin».',
        },
      },
      {
        q: {
          en: 'How many bitcoins can ever exist?',
          fr: 'Combien de bitcoins peuvent exister au maximum ?',
          ar: 'كم bitcoin يمكن أن يوجد في المجموع؟',
        },
        options: [
          { en: 'No limit', fr: 'Aucune limite', ar: 'بلا حد' },
          { en: '1 million', fr: '1 million', ar: 'مليون واحد' },
          { en: '21 million', fr: '21 millions', ar: '21 مليون' },
        ],
        answer: 2,
        why: {
          en: 'The 21 million limit is written in Bitcoin’s code.',
          fr: 'La limite de 21 millions est écrite dans le code du Bitcoin.',
          ar: 'حد الـ 21 مليون مكتوب في برمجة Bitcoin.',
        },
      },
      {
        q: {
          en: 'Do you have to buy a whole bitcoin?',
          fr: 'Faut-il acheter un bitcoin entier ?',
          ar: 'هل يجب أن تملك bitcoin كاملًا؟',
        },
        options: [
          { en: 'Yes, one at a time', fr: 'Oui, un entier à chaque fois', ar: 'نعم، واحدًا كاملًا في كل مرة' },
          { en: 'No, you can own a small piece', fr: 'Non, on peut en avoir un petit morceau', ar: 'لا، يمكنك أن تملك جزءًا صغيرًا' },
          { en: 'Only after one year', fr: 'Seulement après un an', ar: 'فقط بعد سنة' },
        ],
        answer: 1,
        why: {
          en: 'A bitcoin splits into tiny parts. The smallest one is called a satoshi: 0.00000001 BTC.',
          fr: 'Un bitcoin se divise en toutes petites parts. La plus petite s’appelle un satoshi : 0,00000001 BTC.',
          ar: 'الـ bitcoin ينقسم إلى أجزاء صغيرة جدًا. أصغرها اسمه satoshi: ‎0.00000001 BTC.',
        },
      },
    ],
  },

  {
    slug: 'usdt',
    level: 1,
    minutes: 3,
    title: {
      en: 'USDT, the “digital dollar”',
      fr: 'L’USDT, le « dollar numérique »',
      ar: 'USDT، «الدولار الرقمي»',
    },
    hook: {
      en: 'A crypto built to stay at 1 dollar. Useful, but not risk-free.',
      fr: 'Une crypto faite pour rester à 1 dollar. Utile, mais pas sans risque.',
      ar: 'عملة رقمية مصممة لتبقى عند 1 دولار. مفيدة، لكنها ليست بلا مخاطر.',
    },
    terms: ['stablecoin', 'usdt', 'depeg'],
    live: {
      kind: 'view',
      view: 'practice',
      label: {
        en: 'The practice wallet counts in pretend USDT',
        fr: 'Le portefeuille d’entraînement compte en USDT fictifs',
        ar: 'محفظة التدريب تحسب بـ USDT افتراضي',
      },
    },
    sections: [
      {
        h: { en: 'What it is', fr: 'Ce que c’est', ar: 'ما هي' },
        p: {
          en: 'USDT, also called Tether, is a stablecoin: a crypto designed to always be worth about 1 US dollar. The company Tether says it holds reserves for every USDT, mostly US Treasury bills (short-term loans to the US government), plus cash, gold and some bitcoin.',
          fr: 'L’USDT, aussi appelé Tether, est un stablecoin : une crypto conçue pour valoir toujours environ 1 dollar américain. La société Tether affirme garder des réserves pour chaque USDT, surtout des bons du Trésor américain (des prêts à court terme à l’État américain), plus du cash, de l’or et un peu de bitcoin.',
          ar: 'USDT، وتُسمّى أيضًا Tether، هي عملة مستقرة (stablecoin): عملة رقمية مصممة لتساوي دائمًا حوالي 1 دولار أمريكي. تقول شركة Tether إنها تحتفظ باحتياطي مقابل كل USDT، أغلبه سندات خزينة أمريكية (قروض قصيرة الأجل للحكومة الأمريكية)، إضافة إلى نقد وذهب وبعض الـ bitcoin.',
        },
      },
      {
        h: { en: 'Why people use it', fr: 'Pourquoi on l’utilise', ar: 'لماذا يستعملها الناس' },
        p: {
          en: 'Because its price barely moves, people use USDT to park money between other cryptos, and many freelancers get paid in it from abroad. Most crypto prices, including in Qirat, are shown in USDT.',
          fr: 'Comme son prix bouge à peine, on utilise l’USDT pour garer de l’argent entre deux cryptos, et beaucoup de freelances se font payer en USDT depuis l’étranger. La plupart des prix crypto, y compris dans Qirat, sont affichés en USDT.',
          ar: 'لأن سعرها لا يكاد يتحرك، يستعمل الناس USDT لإبقاء أموالهم بين عملة وأخرى، وكثير من المستقلين (freelancers) يتقاضون أجورهم بها من الخارج. ومعظم أسعار العملات الرقمية، بما فيها في قيراط، تُعرض بالـ USDT.',
        },
      },
      {
        h: { en: 'Checked, but not fully audited', fr: 'Vérifié, mais pas audité en entier', ar: 'مُراجَع، لكن بدون تدقيق كامل' },
        p: {
          en: 'Every quarter, an accounting firm checks Tether’s reserves on one date: this is an attestation, not a full audit. In 2021, two US authorities, the CFTC and New York’s attorney general, found that USDT had not always been fully backed in the past, and Tether paid fines to settle both cases.',
          fr: 'Chaque trimestre, un cabinet comptable vérifie les réserves de Tether à une date donnée : c’est une attestation, pas un audit complet. En 2021, deux autorités américaines, la CFTC et la procureure générale de New York, ont constaté que l’USDT n’avait pas toujours été entièrement couvert par le passé, et Tether a payé des amendes pour clore les deux affaires.',
          ar: 'كل ثلاثة أشهر، يراجع مكتب محاسبة احتياطي Tether في تاريخ واحد: هذه شهادة (attestation)، وليست تدقيقًا كاملًا. في 2021، وجدت جهتان أمريكيتان، هما CFTC والمدعية العامة لولاية New York، أن USDT لم تكن مغطاة بالكامل دائمًا في الماضي، ودفعت Tether غرامات لإغلاق القضيتين.',
        },
      },
      {
        h: { en: 'Stable is not the same as safe', fr: 'Stable ne veut pas dire sûr', ar: 'مستقرة لا تعني مضمونة' },
        p: {
          en: 'Other stablecoins have broken. In May 2022, TerraUSD (UST) was supposed to stay at $1 and fell below 10 cents in about a week. USDT itself has slipped below $1 for short periods: to about $0.87–0.95 in October 2018 and about $0.92–0.95 in May 2022, depending on the platform.',
          fr: 'D’autres stablecoins ont cassé. En mai 2022, TerraUSD (UST) devait rester à 1 $ et est tombé sous les 10 centimes en une semaine environ. L’USDT lui-même est déjà passé sous 1 $ pendant de courtes périodes : vers 0,87–0,95 $ en octobre 2018 et 0,92–0,95 $ en mai 2022, selon les plateformes.',
          ar: 'عملات مستقرة أخرى انهارت. في مايو 2022، كان من المفروض أن تبقى TerraUSD (UST) عند 1 دولار، فسقطت تحت 10 سنتات في حوالي أسبوع. وUSDT نفسها نزلت تحت 1 دولار لفترات قصيرة: إلى حوالي 0.87–0.95 دولار في أكتوبر 2018، وحوالي 0.92–0.95 دولار في مايو 2022، حسب المنصة.',
        },
      },
      {
        h: { en: 'It does not grow', fr: 'Il ne grossit pas', ar: 'لا تكبر' },
        p: {
          en: 'USDT is built to stay flat. If someone promises you “20% a month on your USDT”, that extra money has to come from somewhere. It is a classic sign of a scam (see the lesson «How scammers find you»).',
          fr: 'L’USDT est fait pour rester plat. Si quelqu’un vous promet « 20 % par mois sur vos USDT », cet argent en plus doit bien venir de quelque part. C’est un signe classique d’arnaque (voir la leçon « Comment les arnaqueurs vous trouvent »).',
          ar: 'USDT مصممة لتبقى ثابتة. إذا وعدك أحد بـ«20% في الشهر على USDT الخاصة بك»، فهذا المال الإضافي يجب أن يأتي من مكان ما. هذه علامة كلاسيكية على الاحتيال (انظر درس «كيف يصل إليك المحتالون»).',
        },
      },
      {
        h: { en: 'The local-money side', fr: 'Côté monnaie locale', ar: 'من جهة العملة المحلية' },
        p: {
          en: 'When people get USDT for dinars, dirhams or pounds from another person, the rate they are charged can be far above the official exchange rate. You can lose money on the exchange itself, even while USDT stays at $1.',
          fr: 'Quand on obtient de l’USDT contre des dinars, des dirhams ou des livres auprès d’une personne, le taux demandé peut être bien au-dessus du taux de change officiel. On peut perdre de l’argent sur le change lui-même, même si l’USDT reste à 1 $.',
          ar: 'عندما يحصل الناس على USDT مقابل الدينار أو الدرهم أو الجنيه من شخص آخر، قد يكون السعر المطلوب أعلى بكثير من سعر الصرف الرسمي. يمكنك أن تخسر مالًا في عملية الصرف نفسها، حتى لو بقيت USDT عند 1 دولار.',
        },
      },
    ],
    takeaway: {
      en: 'USDT tries to stay at $1. It does not earn money on its own, and it relies on one company’s promise.',
      fr: 'L’USDT essaie de rester à 1 $. Il ne rapporte rien tout seul, et il repose sur la promesse d’une seule entreprise.',
      ar: 'USDT تحاول أن تبقى عند 1 دولار. لا تربح وحدها، وتعتمد على وعد شركة واحدة.',
    },
    quiz: [
      {
        q: {
          en: 'What is USDT designed to be worth?',
          fr: 'Combien l’USDT est-il censé valoir ?',
          ar: 'كم يُفترض أن تساوي USDT؟',
        },
        options: [
          { en: 'The same as Bitcoin', fr: 'Autant que le Bitcoin', ar: 'مثل Bitcoin' },
          { en: '1 Tunisian dinar', fr: '1 dinar tunisien', ar: '1 دينار تونسي' },
          { en: 'About 1 US dollar', fr: 'Environ 1 dollar américain', ar: 'حوالي 1 دولار أمريكي' },
        ],
        answer: 2,
        why: {
          en: 'USDT is a stablecoin that tracks the US dollar.',
          fr: 'L’USDT est un stablecoin qui suit le dollar américain.',
          ar: 'USDT عملة مستقرة تتبع الدولار الأمريكي.',
        },
      },
      {
        q: {
          en: 'Someone offers you 20% a month on your USDT. What does that tell you?',
          fr: 'Quelqu’un vous propose 20 % par mois sur vos USDT. Qu’est-ce que ça vous dit ?',
          ar: 'شخص يعرض عليك 20% في الشهر على USDT الخاصة بك. ماذا يعني هذا؟',
        },
        options: [
          { en: 'It is a normal stablecoin rate', fr: 'C’est un taux normal pour un stablecoin', ar: 'هذا معدل عادي للعملات المستقرة' },
          { en: 'It is a big warning sign', fr: 'C’est un gros signal d’alarme', ar: 'علامة تحذير كبيرة' },
          { en: 'It is a good deal to take fast', fr: 'C’est une bonne affaire à saisir vite', ar: 'فرصة جيدة يجب اغتنامها بسرعة' },
        ],
        answer: 1,
        why: {
          en: 'USDT is built not to grow. High fixed returns are how scams pull people in.',
          fr: 'L’USDT est fait pour ne pas grossir. Les gros rendements fixes, c’est l’appât des arnaques.',
          ar: 'USDT مصممة لكي لا تكبر. الأرباح الكبيرة والثابتة هي الطُّعم الذي يستعمله المحتالون.',
        },
      },
      {
        q: {
          en: 'Can a stablecoin lose its $1 value?',
          fr: 'Un stablecoin peut-il perdre sa valeur de 1 $ ?',
          ar: 'هل يمكن أن تفقد عملة مستقرة قيمة الـ 1 دولار؟',
        },
        options: [
          { en: 'Yes, it has happened', fr: 'Oui, c’est déjà arrivé', ar: 'نعم، حدث هذا من قبل' },
          { en: 'Never, it is guaranteed', fr: 'Jamais, c’est garanti', ar: 'أبدًا، هذا مضمون' },
          { en: 'Only on weekends', fr: 'Seulement le week-end', ar: 'فقط في عطلة نهاية الأسبوع' },
        ],
        answer: 0,
        why: {
          en: 'TerraUSD collapsed in 2022. A stablecoin is only as stable as the promise behind it.',
          fr: 'TerraUSD s’est effondré en 2022. Un stablecoin n’est stable que si la promesse derrière tient.',
          ar: 'انهارت TerraUSD في 2022. العملة المستقرة مستقرة بقدر ما يكون الوعد الذي وراءها ثابتًا.',
        },
      },
    ],
  },

  {
    slug: 'market-price',
    level: 1,
    minutes: 3,
    title: { en: 'Who sets the price?', fr: 'Qui fixe le prix ?', ar: 'من يحدّد السعر؟' },
    hook: {
      en: 'Nobody writes a price tag on Bitcoin. The price is the last deal between a buyer and a seller.',
      fr: 'Personne n’écrit d’étiquette de prix sur le Bitcoin. Le prix, c’est la dernière affaire conclue entre un acheteur et un vendeur.',
      ar: 'لا أحد يكتب سعراً على Bitcoin. السعر هو آخر صفقة تمّت بين مشترٍ وبائع.',
    },
    terms: ['order-book', 'bid-ask', 'spread', 'market-cap'],
    live: {
      kind: 'view',
      view: 'practice',
      label: {
        en: 'See the price with spread in the practice wallet',
        fr: 'Voir le prix avec écart dans le portefeuille d’entraînement',
        ar: 'شاهد السعر مع الفارق في محفظة التدريب',
      },
    },
    sections: [
      {
        h: { en: 'The price is the last trade', fr: 'Le prix, c’est la dernière transaction', ar: 'السعر هو آخر صفقة' },
        p: {
          en: 'No company and no bank sets the price of a coin. On a platform, buyers post what they are ready to pay and sellers post what they are ready to accept. When a buyer and a seller agree, a trade happens, and that trade becomes the price you see. A second later, the next trade can change it.',
          fr: 'Aucune entreprise et aucune banque ne fixe le prix d’une crypto. Sur une plateforme, les acheteurs affichent ce qu’ils sont prêts à payer et les vendeurs ce qu’ils sont prêts à accepter. Quand un acheteur et un vendeur sont d’accord, une transaction a lieu, et elle devient le prix que vous voyez. Une seconde plus tard, la transaction suivante peut le changer.',
          ar: 'لا توجد شركة ولا بنك يحدّد سعر العملة. على المنصة، يعرض المشترون المبلغ الذي يقبلون دفعه، ويعرض البائعون المبلغ الذي يقبلون البيع به. عندما يتفق مشترٍ وبائع تتمّ صفقة، وتصبح هذه الصفقة هي السعر الذي تراه. بعد ثانية، قد تغيّره الصفقة التالية.',
        },
      },
      {
        h: { en: 'The order book', fr: 'Le carnet d’ordres', ar: 'دفتر الأوامر' },
        p: {
          en: 'Behind the price there is a list called the order book. On one side, people waiting to buy a little lower than now. On the other side, people waiting to sell a little higher. When buyers are in a hurry and take the sellers’ offers, the price climbs. When sellers are in a hurry, it drops.',
          fr: 'Derrière le prix, il y a une liste appelée le carnet d’ordres. D’un côté, des gens qui attendent pour acheter un peu plus bas que maintenant. De l’autre, des gens qui attendent pour vendre un peu plus haut. Quand les acheteurs sont pressés et prennent les offres des vendeurs, le prix monte. Quand ce sont les vendeurs qui sont pressés, il baisse.',
          ar: 'خلف السعر توجد قائمة اسمها دفتر الأوامر (order book). في جهة، أشخاص ينتظرون الشراء بسعر أقل قليلاً من الآن. وفي الجهة الأخرى، أشخاص ينتظرون البيع بسعر أعلى قليلاً. عندما يستعجل المشترون ويأخذون عروض البائعين يرتفع السعر، وعندما يستعجل البائعون ينخفض.',
        },
      },
      {
        h: { en: 'Two prices, not one', fr: 'Deux prix, pas un seul', ar: 'سعران وليس سعراً واحداً' },
        p: {
          en: 'At any moment there is a best buy price (the bid: the most anyone will pay) and a best sell price (the ask: the least anyone will accept). The ask is always a little above the bid. The gap between them is the spread. Buying straight away costs a little more than the middle, and selling gets a little less: each trade pays part of the spread.',
          fr: 'À chaque instant, il existe un meilleur prix d’achat (le bid : le plus que quelqu’un paiera) et un meilleur prix de vente (l’ask : le moins que quelqu’un acceptera). L’ask est toujours un peu au-dessus du bid. L’écart entre les deux s’appelle le spread. Acheter immédiatement coûte un peu plus que le milieu, et vendre rapporte un peu moins : chaque opération en paie une partie.',
          ar: 'في كل لحظة يوجد أفضل سعر شراء (bid): أعلى مبلغ يدفعه أحد، وأفضل سعر بيع (ask): أقل مبلغ يقبله أحد. سعر البيع دائماً أعلى قليلاً من سعر الشراء. الفرق بينهما اسمه الفارق (spread). الشراء الفوري يكلّف أكثر قليلاً من السعر الأوسط، والبيع الفوري يعطيك أقل قليلاً: كل عملية تدفع جزءاً من الفارق.',
        },
      },
      {
        h: { en: 'The spread in the practice wallet', fr: 'L’écart dans le portefeuille d’entraînement', ar: 'الفارق في محفظة التدريب' },
        p: {
          en: 'Qirat’s practice wallet copies this: a buy fills 0.05% above the market price and a sell fills 0.05% below it. On a $100 practice buy, that is about 5 cents. Small, but it is there on every trade, on top of the 0.1% fee.',
          fr: 'Le portefeuille d’entraînement de Qirat reproduit cela : un achat passe 0,05 % au-dessus du prix du marché et une vente 0,05 % en dessous. Sur un achat fictif de 100 $, cela fait environ 5 centimes. C’est peu, mais c’est là à chaque opération, en plus des frais de 0,1 %.',
          ar: 'محفظة التدريب في قيراط تحاكي ذلك: الشراء يتمّ بسعر أعلى من سعر السوق بـ 0.05%، والبيع بسعر أقل منه بـ 0.05%. في شراء تجريبي بـ 100 دولار، هذا حوالي 5 سنتات. مبلغ صغير، لكنه موجود في كل عملية، فوق رسوم 0.1%.',
        },
      },
      {
        h: { en: 'A low price is not “cheap”', fr: 'Un prix bas n’est pas « bon marché »', ar: 'السعر المنخفض لا يعني أنها رخيصة' },
        p: {
          en: 'A coin at $0.001 can look cheaper than a coin at $50. It is not. What counts is the market cap: the price times the number of coins in circulation. A $0.001 coin with 500 billion coins is worth $500 million in total, more than a $50 coin with 2 million coins ($100 million). A low price only means there are many coins.',
          fr: 'Une crypto à 0,001 $ peut sembler moins chère qu’une crypto à 50 $. Ce n’est pas le cas. Ce qui compte, c’est la capitalisation (market cap) : le prix multiplié par le nombre de pièces en circulation. Une crypto à 0,001 $ avec 500 milliards de pièces vaut 500 millions de dollars au total, plus qu’une crypto à 50 $ avec 2 millions de pièces (100 millions de dollars). Un prix bas veut seulement dire qu’il y a beaucoup de pièces.',
          ar: 'عملة سعرها 0.001 دولار قد تبدو أرخص من عملة سعرها 50 دولاراً. هذا غير صحيح. المهم هو القيمة السوقية (market cap): السعر مضروباً في عدد العملات المتداولة. عملة بسعر 0.001 دولار وعددها 500 مليار قيمتها 500 مليون دولار، أي أكثر من عملة بسعر 50 دولاراً وعددها 2 مليون (100 مليون دولار). السعر المنخفض يعني فقط أن عدد العملات كبير.',
        },
      },
    ],
    takeaway: {
      en: 'The price is the last deal between a buyer and a seller. Every trade pays the gap between the buy and sell price, and a low price per coin does not make a coin cheap.',
      fr: 'Le prix, c’est la dernière affaire entre un acheteur et un vendeur. Chaque opération paie l’écart entre prix d’achat et prix de vente, et un prix unitaire bas ne rend pas une crypto bon marché.',
      ar: 'السعر هو آخر صفقة بين مشترٍ وبائع. كل عملية تدفع الفارق بين سعر الشراء وسعر البيع، والسعر المنخفض للعملة لا يجعلها رخيصة.',
    },
    quiz: [
      {
        q: {
          en: 'Where does the price you see on screen come from?',
          fr: 'D’où vient le prix que vous voyez à l’écran ?',
          ar: 'من أين يأتي السعر الذي تراه على الشاشة؟',
        },
        options: [
          { en: 'The platform sets it every morning', fr: 'La plateforme le fixe chaque matin', ar: 'المنصة تحدّده كل صباح' },
          {
            en: 'The last trade between a buyer and a seller',
            fr: 'La dernière transaction entre un acheteur et un vendeur',
            ar: 'آخر صفقة بين مشترٍ وبائع',
          },
          { en: 'A fixed value written in the coin’s code', fr: 'Une valeur fixe écrite dans le code de la crypto', ar: 'قيمة ثابتة مكتوبة في كود العملة' },
        ],
        answer: 1,
        why: {
          en: 'The price is whatever the last buyer and seller agreed on. The next trade can move it.',
          fr: 'Le prix, c’est ce que le dernier acheteur et le dernier vendeur ont accepté. La transaction suivante peut le faire bouger.',
          ar: 'السعر هو ما اتفق عليه آخر مشترٍ وآخر بائع. والصفقة التالية قد تحرّكه.',
        },
      },
      {
        q: {
          en: 'The best buy price is $100.00 and the best sell price is $100.10. What is the $0.10 gap?',
          fr: 'Le meilleur prix d’achat est 100,00 $ et le meilleur prix de vente 100,10 $. Que sont ces 0,10 $ d’écart ?',
          ar: 'أفضل سعر شراء 100.00 دولار وأفضل سعر بيع 100.10 دولار. ما هو فرق الـ 0.10 دولار؟',
        },
        options: [
          { en: 'A government tax', fr: 'Une taxe de l’État', ar: 'ضريبة حكومية' },
          { en: 'A fee the app adds the next day', fr: 'Des frais ajoutés par l’appli le lendemain', ar: 'رسوم يضيفها التطبيق في اليوم التالي' },
          { en: 'The spread', fr: 'Le spread (l’écart)', ar: 'الفارق (spread)' },
        ],
        answer: 2,
        why: {
          en: 'The gap between the bid and the ask is the spread. Each buy or sell made straight away pays part of it.',
          fr: 'L’écart entre le bid et l’ask, c’est le spread. Chaque achat ou vente immédiat en paie une partie.',
          ar: 'الفرق بين سعر الشراء وسعر البيع هو الفارق (spread). كل شراء أو بيع فوري يدفع جزءاً منه.',
        },
      },
      {
        q: {
          en: 'Coin A costs $0.001 and coin B costs $50. What can you say?',
          fr: 'La crypto A coûte 0,001 $ et la crypto B 50 $. Que peut-on dire ?',
          ar: 'العملة A سعرها 0.001 دولار والعملة B سعرها 50 دولاراً. ماذا يمكن أن تقول؟',
        },
        options: [
          {
            en: 'Nothing yet: you need their market caps',
            fr: 'Rien encore : il faut leur capitalisation',
            ar: 'لا شيء بعد: يجب معرفة القيمة السوقية لكل منهما',
          },
          {
            en: 'Coin A is cheaper, so it has more room to grow',
            fr: 'La A est moins chère, donc elle a plus de marge pour monter',
            ar: 'العملة A أرخص، إذن لديها مجال أكبر للارتفاع',
          },
          {
            en: 'Coin B is safer because its price is higher',
            fr: 'La B est plus sûre car son prix est plus élevé',
            ar: 'العملة B أكثر أماناً لأن سعرها أعلى',
          },
        ],
        answer: 0,
        why: {
          en: 'The price per coin depends on how many coins exist. Coins are compared by market cap: price × coins in circulation.',
          fr: 'Le prix unitaire dépend du nombre de pièces. On compare les cryptos par leur capitalisation : prix × pièces en circulation.',
          ar: 'سعر العملة الواحدة يتعلّق بعدد العملات الموجودة. المقارنة تكون بالقيمة السوقية: السعر × عدد العملات المتداولة.',
        },
      },
    ],
  },

  {
    slug: 'price-swings',
    level: 1,
    minutes: 3,
    title: {
      en: 'Why crypto prices swing so much',
      fr: 'Pourquoi les prix crypto bougent autant',
      ar: 'لماذا تتحرك أسعار العملات الرقمية كثيرًا؟',
    },
    hook: {
      en: 'A normal day for some coins would be a crisis day for a stock. Here is how to read it.',
      fr: 'Une journée normale pour certaines cryptos serait une journée de crise pour une action. Voici comment la lire.',
      ar: 'يوم عادي لبعض العملات الرقمية قد يكون يوم أزمة لسهم في البورصة. إليك كيف تقرأه.',
    },
    terms: ['volatility', 'risk-grade', 'rough-month', 'liquidity'],
    live: { kind: 'risk' },
    sections: [
      {
        h: { en: 'Small market, big crowd', fr: 'Petit marché, grande foule', ar: 'سوق صغير وجمهور كبير' },
        p: {
          en: 'Compared with gold or big company shares, most cryptos are small markets with little liquidity: few buyers and sellers are waiting at each price. So when many people buy or sell at the same time, the price jumps or drops fast. A news story, a rumour, one big holder selling, or a single post can move it.',
          fr: 'Comparées à l’or ou aux actions des grandes entreprises, la plupart des cryptos sont de petits marchés avec peu de liquidité : peu d’acheteurs et de vendeurs attendent à chaque prix. Alors quand beaucoup de gens achètent ou vendent en même temps, le prix bondit ou chute vite. Une info, une rumeur, un gros détenteur qui vend ou un seul post peuvent le faire bouger.',
          ar: 'مقارنة بالذهب أو بأسهم الشركات الكبرى، أغلب العملات الرقمية أسواق صغيرة بسيولة قليلة (liquidity): عدد قليل من المشترين والبائعين ينتظرون عند كل سعر. لذلك عندما يشتري أو يبيع كثير من الناس في الوقت نفسه، يقفز السعر أو يهبط بسرعة. خبر، أو إشاعة، أو بيع من شخص يملك كمية كبيرة، أو منشور واحد، قد يكفي لتحريكه.',
        },
      },
      {
        h: { en: 'Open 24/7', fr: 'Ouvert 24 h/24, 7 j/7', ar: 'مفتوح 24 ساعة طوال الأسبوع' },
        p: {
          en: 'Crypto never closes. Prices move at night and on weekends, so you can wake up to a big move.',
          fr: 'La crypto ne ferme jamais. Les prix bougent la nuit et le week-end : on peut se réveiller avec un gros mouvement.',
          ar: 'سوق العملات الرقمية لا يُغلق أبدًا. الأسعار تتحرك في الليل وفي عطلة نهاية الأسبوع، وقد تستيقظ على حركة كبيرة.',
        },
      },
      {
        h: { en: 'Volatility and the risk grade', fr: 'La volatilité et la note de risque', ar: 'التقلب ودرجة المخاطرة' },
        p: {
          en: 'Volatility means how much a price usually moves. Qirat shows it as “a typical day”: ±2% means most days the price moves less than 2% up or down, and some days more. Qirat then ranks the 18 big coins it tracks by their moves over the last 30 days: the calmest third is “low risk for crypto”, the middle third “medium”, the wildest third “high”.',
          fr: 'La volatilité, c’est l’ampleur habituelle des mouvements d’un prix. Qirat l’affiche comme « une journée normale » : ±2 % veut dire que la plupart des jours, le prix bouge de moins de 2 %, à la hausse ou à la baisse, et certains jours davantage. Qirat classe ensuite les 18 grandes cryptos qu’il suit selon leurs mouvements des 30 derniers jours : le tiers le plus calme est « risque faible pour une crypto », le tiers du milieu « moyen », le tiers le plus agité « élevé ».',
          ar: 'التقلب (volatility) يعني كم يتحرك السعر عادةً. قيراط يعرضه كـ«يوم عادي»: ±2% تعني أن السعر في أغلب الأيام يتحرك أقل من 2% صعودًا أو نزولًا، وفي بعض الأيام أكثر. ثم يرتب قيراط العملات الكبيرة الـ 18 التي يتابعها حسب حركتها في آخر 30 يومًا: الثلث الأهدأ «مخاطرة منخفضة بالنسبة للعملات الرقمية»، والثلث الأوسط «متوسطة»، والثلث الأكثر تقلبًا «عالية».',
        },
      },
      {
        h: { en: 'What is the “rough month”?', fr: 'C’est quoi le « mauvais mois » ?', ar: 'ما هو «الشهر الصعب»؟' },
        p: {
          en: 'Imagine you kept a coin for 20 months. Most months are ordinary: up a bit, down a bit. But about one month out of those 20 goes really badly. The “rough month” is how much you could lose in that one bad month. Qirat works it out from how much the coin has been moving lately, so a wild coin gets a deeper rough month than a calm one.',
          fr: 'Imaginez que vous gardez une crypto pendant 20 mois. La plupart des mois sont ordinaires : un peu de hausse, un peu de baisse. Mais environ un mois sur ces 20 se passe vraiment mal. Le « mauvais mois », c’est ce que vous pourriez perdre pendant ce mois-là. Qirat le calcule à partir de ce que la crypto a bougé récemment : une crypto agitée a un mauvais mois plus profond qu’une crypto calme.',
          ar: 'تخيّل أنك احتفظت بعملة لمدة 20 شهرًا. أغلب الأشهر عادية: صعود قليل ونزول قليل. لكن تقريبًا شهر واحد من بين الـ 20 يكون سيئًا جدًا. «الشهر الصعب» هو كم يمكن أن تخسر في ذلك الشهر السيئ. يحسبه قيراط من حركة العملة في الفترة الأخيرة، لذلك العملة المتقلبة يكون شهرها الصعب أعمق من العملة الهادئة.',
        },
      },
      {
        h: { en: 'An example with 100', fr: 'Un exemple avec 100', ar: 'مثال بـ 100' },
        p: {
          en: 'Say a coin’s rough month is −30% and you put 100 in it, in any currency. In a bad month like that, you could be left with about 70. For a high-risk coin the rough month can be −50% or worse: 100 becomes 50. Two things to remember: it is not the worst that can happen, because crypto can fall even more, and it comes from the past, so it is not a forecast. Its job is to let you picture the drop before you put money in.',
          fr: 'Disons que le mauvais mois d’une crypto est à −30 % et que vous y mettez 100, dans n’importe quelle monnaie. Dans un mauvais mois comme ça, il pourrait vous rester environ 70. Pour une crypto à risque élevé, le mauvais mois peut être à −50 % ou pire : 100 deviennent 50. Deux choses à retenir : ce n’est pas le pire possible, une crypto peut tomber encore plus bas, et ça vient du passé, ce n’est donc pas une prévision. Ça sert à imaginer la baisse avant de mettre de l’argent.',
          ar: 'لنفترض أن الشهر الصعب لعملة ما هو −30%، ووضعت فيها 100، بأي عملة كانت. في شهر سيئ كهذا، قد يبقى لك حوالي 70. وفي عملة مخاطرتها عالية، قد يكون الشهر الصعب −50% أو أسوأ: الـ 100 تصبح 50. تذكّر أمرين: هذا ليس أسوأ ما يمكن أن يحدث، فالعملات الرقمية قد تهبط أكثر، وهو محسوب من الماضي، أي أنه ليس توقعًا. فائدته أن تتخيل الهبوط قبل أن تضع مالك.',
        },
      },
      {
        h: { en: 'Why it matters', fr: 'Pourquoi c’est important', ar: 'لماذا هذا مهم' },
        p: {
          en: 'If a −30% month would make you panic, a high-risk coin will be hard to live with. Knowing the swing in advance helps you stay calm when it comes.',
          fr: 'Si un mois à −30 % vous ferait paniquer, une crypto à risque élevé sera difficile à vivre. Connaître les variations à l’avance aide à rester calme quand elles arrivent.',
          ar: 'إذا كان شهر بـ −30% سيجعلك تصاب بالذعر، فالعملة ذات المخاطرة العالية ستكون صعبة عليك. معرفة حجم التقلب مسبقًا تساعدك على البقاء هادئًا عندما يأتي.',
        },
      },
    ],
    takeaway: {
      en: 'Look at the risk before the price. Ask yourself: could I live with the rough month on my amount?',
      fr: 'Regardez le risque avant le prix. Demandez-vous : est-ce que je supporterais le mauvais mois sur mon montant ?',
      ar: 'انظر إلى المخاطرة قبل السعر. واسأل نفسك: هل أستطيع تحمّل الشهر الصعب على المبلغ الذي أضعه؟',
    },
    quiz: [
      {
        q: {
          en: 'A coin shows “±6% on a typical day”. What does that mean?',
          fr: 'Une crypto affiche « ±6 % une journée normale ». Ça veut dire quoi ?',
          ar: 'عملة مكتوب عليها «±6% في يوم عادي». ماذا يعني ذلك؟',
        },
        options: [
          { en: 'It gains 6% every day', fr: 'Elle gagne 6 % chaque jour', ar: 'تربح 6% كل يوم' },
          { en: 'It is 6% cheaper today', fr: 'Elle est 6 % moins chère aujourd’hui', ar: 'أرخص بـ 6% اليوم' },
          {
            en: 'It often moves up or down by around 6% in a day',
            fr: 'Elle bouge souvent d’environ 6 % par jour, à la hausse ou à la baisse',
            ar: 'تتحرك غالبًا حوالي 6% في اليوم، صعودًا أو نزولًا',
          },
        ],
        answer: 2,
        why: {
          en: 'A typical day is the usual size of the move, in either direction. It is not a gain.',
          fr: 'La journée normale, c’est l’ampleur habituelle du mouvement, dans un sens ou dans l’autre. Ce n’est pas un gain.',
          ar: 'اليوم العادي هو الحجم المعتاد للحركة، في أي اتجاه. ليس ربحًا.',
        },
      },
      {
        q: {
          en: 'The rough month is −40%. On 100 dollars, a month like that could leave you with about…',
          fr: 'Le mauvais mois est à −40 %. Sur 100 dollars, un mois comme ça pourrait vous laisser environ…',
          ar: 'الشهر الصعب هو −40%. على 100 دولار، شهر كهذا قد يترك لك حوالي…',
        },
        options: [
          { en: '60 dollars', fr: '60 dollars', ar: '60 دولارًا' },
          { en: '140 dollars', fr: '140 dollars', ar: '140 دولارًا' },
          { en: '96 dollars', fr: '96 dollars', ar: '96 دولارًا' },
        ],
        answer: 0,
        why: {
          en: '100 minus 40% is 60. That is the kind of month to picture before you put money in.',
          fr: '100 moins 40 %, ça fait 60. C’est le genre de mois à imaginer avant de mettre de l’argent.',
          ar: '100 ناقص 40% تساوي 60. هذا نوع الشهر الذي يجب أن تتخيله قبل أن تضع مالك.',
        },
      },
      {
        q: {
          en: 'Why can crypto prices move in the middle of the night?',
          fr: 'Pourquoi les prix crypto peuvent-ils bouger en pleine nuit ?',
          ar: 'لماذا يمكن أن تتحرك أسعار العملات الرقمية في منتصف الليل؟',
        },
        options: [
          { en: 'Banks change the prices at night', fr: 'Les banques changent les prix la nuit', ar: 'البنوك تغيّر الأسعار في الليل' },
          { en: 'Crypto trades 24/7', fr: 'La crypto s’échange 24 h/24, 7 j/7', ar: 'العملات الرقمية تُتداول 24/7' },
          { en: 'It does not, only in the daytime', fr: 'Ils ne bougent pas, seulement le jour', ar: 'لا تتحرك، فقط في النهار' },
        ],
        answer: 1,
        why: {
          en: 'Crypto markets never close, so people trade at any hour, in every time zone.',
          fr: 'Les marchés crypto ne ferment jamais : on échange à toute heure, dans tous les fuseaux horaires.',
          ar: 'أسواق العملات الرقمية لا تُغلق أبدًا، والناس يتداولون في أي ساعة ومن كل المناطق الزمنية.',
        },
      },
    ],
  },

  {
    slug: 'only-what-you-can-lose',
    level: 1,
    minutes: 2,
    title: {
      en: 'Only put in what you can lose',
      fr: 'Ne mettez que ce que vous pouvez perdre',
      ar: 'لا تضع إلا ما تستطيع خسارته',
    },
    hook: {
      en: 'Crypto can fall by half. Do the maths before any real money goes in.',
      fr: 'Une crypto peut perdre la moitié de sa valeur. Faites le calcul avant que le moindre argent réel n’y entre.',
      ar: 'العملات الرقمية قد تفقد نصف قيمتها. احسب قبل أن تضع أي مال حقيقي.',
    },
    terms: ['emergency-fund', 'drawdown', 'rough-month'],
    live: { kind: 'risk' },
    sections: [
      {
        h: { en: 'What comes first', fr: 'Ce qui passe avant', ar: 'ما يأتي أولاً' },
        p: {
          en: 'Rent, food, bills and money for emergencies come before any crypto. An emergency fund is money set aside for a sudden cost, like a repair or a doctor; many guides suggest a few months of expenses. Only what is left after all of that can be called money you can lose.',
          fr: 'Le loyer, la nourriture, les factures et l’argent des urgences passent avant toute crypto. Une épargne de secours, c’est de l’argent mis de côté pour une dépense soudaine, comme une réparation ou un médecin ; beaucoup de guides conseillent quelques mois de dépenses. Seul ce qui reste après tout cela peut s’appeler de l’argent que vous pouvez perdre.',
          ar: 'الإيجار والأكل والفواتير ومال الطوارئ تأتي قبل أي عملة رقمية. صندوق الطوارئ هو مال تضعه جانباً لمصروف مفاجئ، مثل إصلاح أو طبيب، وكثير من الأدلّة تنصح بما يكفي لبضعة أشهر من المصاريف. فقط ما يبقى بعد كل هذا يمكن أن تسمّيه مالاً تستطيع خسارته.',
        },
      },
      {
        h: { en: 'Crypto can fall by half', fr: 'Une crypto peut perdre la moitié', ar: 'العملة قد تفقد نصف قيمتها' },
        p: {
          en: 'Even Bitcoin has lost more than half its value several times in its history. Qirat shows each coin’s rough month: what a bad month, the kind that comes about once in 20 months, could cost. It is not the worst case: real drops can go deeper.',
          fr: 'Même le Bitcoin a perdu plus de la moitié de sa valeur plusieurs fois dans son histoire. Qirat montre le mauvais mois de chaque crypto : ce que pourrait coûter un mauvais mois, du genre qui arrive environ une fois tous les 20 mois. Ce n’est pas le pire cas : les vraies chutes peuvent aller plus bas.',
          ar: 'حتى Bitcoin فقد أكثر من نصف قيمته عدّة مرات في تاريخه. قيراط يعرض «الشهر الصعب» لكل عملة: كم قد يكلّفك شهر سيّئ، من النوع الذي يأتي تقريباً مرة كل 20 شهراً. وهذا ليس أسوأ احتمال: الهبوط الحقيقي قد يكون أعمق.',
        },
      },
      {
        h: { en: 'A loss is harder to win back', fr: 'Une perte est plus dure à rattraper', ar: 'الخسارة أصعب في التعويض' },
        p: {
          en: 'If $100 falls 50%, you have $50 left. To get back to $100, those $50 must double: that is +100%. A 20% drop, from $100 to $80, needs +25% to come back. The deeper the fall, the steeper the climb.',
          fr: 'Si 100 $ perdent 50 %, il vous reste 50 $. Pour revenir à 100 $, ces 50 $ doivent doubler : c’est +100 %. Une baisse de 20 %, de 100 $ à 80 $, demande +25 % pour revenir. Plus la chute est profonde, plus la remontée est raide.',
          ar: 'إذا خسرت 100 دولار نسبة 50%، يبقى لك 50 دولاراً. لتعود إلى 100 دولار يجب أن تتضاعف هذه الـ 50: أي ربح 100%. وهبوط 20%، من 100 إلى 80 دولاراً، يحتاج ربح 25% للعودة. كلما كان الهبوط أعمق، كان الصعود أصعب.',
        },
      },
      {
        h: { en: 'Never with borrowed money', fr: 'Jamais avec de l’argent emprunté', ar: 'لا تستعمل مالاً مقترضاً أبداً' },
        p: {
          en: 'Never borrow, take a loan or sell the family gold to put money into crypto. A loan must be paid back even if the coin falls. Then you lose more than the money you had.',
          fr: 'N’empruntez jamais, ne prenez pas de crédit et ne vendez pas l’or de la famille pour mettre de l’argent dans la crypto. Un prêt doit être remboursé même si la crypto chute. Vous perdez alors plus que l’argent que vous aviez.',
          ar: 'لا تقترض أبداً، ولا تأخذ قرضاً، ولا تبع ذهب العائلة لتضع المال في العملات الرقمية. القرض يجب أن يُسدَّد حتى لو هبطت العملة، وعندها تخسر أكثر من المال الذي كان معك.',
        },
      },
      {
        h: { en: 'One question before any amount', fr: 'Une question avant tout montant', ar: 'سؤال واحد قبل أي مبلغ' },
        p: {
          en: 'Ask yourself: if this amount were cut in half tomorrow, would my life change? Would I miss rent, a bill or sleep? If yes, the amount is too big. Qirat’s practice wallet lets you feel what a loss is like with pretend money first.',
          fr: 'Demandez-vous : si ce montant était divisé par deux demain, ma vie changerait-elle ? Est-ce que je raterais un loyer, une facture, ou le sommeil ? Si oui, le montant est trop gros. Le portefeuille d’entraînement de Qirat vous permet de sentir une perte d’abord avec de l’argent fictif.',
          ar: 'اسأل نفسك: لو نزل هذا المبلغ إلى النصف غداً، هل تتغيّر حياتي؟ هل أعجز عن دفع الإيجار أو فاتورة، أو أفقد النوم؟ إذا كان الجواب نعم، فالمبلغ كبير جداً. محفظة التدريب في قيراط تسمح لك أن تشعر بالخسارة أولاً بمال غير حقيقي.',
        },
      },
    ],
    takeaway: {
      en: 'Bills and emergency money first. Only money you could lose without your life changing, never borrowed. A 50% fall needs a 100% gain to come back.',
      fr: 'Les factures et l’épargne de secours d’abord. Seulement de l’argent que vous pourriez perdre sans que votre vie change, jamais emprunté. Une chute de 50 % demande une hausse de 100 % pour revenir.',
      ar: 'الفواتير ومال الطوارئ أولاً. فقط مال تستطيع خسارته دون أن تتغيّر حياتك، ولا يكون مقترضاً أبداً. هبوط 50% يحتاج ربح 100% للعودة.',
    },
    quiz: [
      {
        q: {
          en: 'Your practice wallet fell from $100 to $50. What gain does it need to get back to $100?',
          fr: 'Votre portefeuille d’entraînement est passé de 100 $ à 50 $. Quelle hausse faut-il pour revenir à 100 $ ?',
          ar: 'محفظة التدريب نزلت من 100 دولار إلى 50 دولاراً. كم ربحاً تحتاج لتعود إلى 100 دولار؟',
        },
        options: [
          { en: '+100%', fr: '+100 %', ar: '+100%' },
          { en: '+50%', fr: '+50 %', ar: '+50%' },
          { en: '+25%', fr: '+25 %', ar: '+25%' },
        ],
        answer: 0,
        why: {
          en: '$50 must double to reach $100: that is +100%. A loss always needs a bigger gain to win it back.',
          fr: '50 $ doivent doubler pour atteindre 100 $ : c’est +100 %. Une perte demande toujours une hausse plus grande pour être rattrapée.',
          ar: 'الـ 50 دولاراً يجب أن تتضاعف لتصل إلى 100: أي +100%. الخسارة تحتاج دائماً ربحاً أكبر منها لتعويضها.',
        },
      },
      {
        q: {
          en: 'Which money is closest to “money you can lose”?',
          fr: 'Quel argent se rapproche le plus de « l’argent que vous pouvez perdre » ?',
          ar: 'أيّ مال هو الأقرب إلى «مال تستطيع خسارته»؟',
        },
        options: [
          {
            en: 'A loan you plan to repay from future gains',
            fr: 'Un prêt que vous comptez rembourser avec de futurs gains',
            ar: 'قرض تنوي تسديده من أرباح قادمة',
          },
          {
            en: 'What is left after rent, bills and emergency savings',
            fr: 'Ce qui reste après le loyer, les factures et l’épargne de secours',
            ar: 'ما يبقى بعد الإيجار والفواتير ومال الطوارئ',
          },
          {
            en: 'Next month’s rent, as long as you put it back in time',
            fr: 'Le loyer du mois prochain, si vous le remettez à temps',
            ar: 'إيجار الشهر القادم، بشرط أن تعيده في الوقت',
          },
        ],
        answer: 1,
        why: {
          en: 'Only money left over after your needs can be lost without hurting your life. Loans and rent money are not that money.',
          fr: 'Seul l’argent qui reste après vos besoins peut être perdu sans abîmer votre vie. Un prêt ou l’argent du loyer, ce n’est pas cet argent-là.',
          ar: 'فقط المال الذي يبقى بعد حاجاتك يمكن أن تخسره دون أن تتضرّر حياتك. القرض ومال الإيجار ليسا من هذا المال.',
        },
      },
      {
        q: {
          en: 'A friend says: “Sell your gold, crypto will pay it back fast.” What is the problem?',
          fr: 'Un ami dit : « Vends ton or, la crypto te le rendra vite. » Quel est le problème ?',
          ar: 'صديق يقول لك: «بِع ذهبك، العملات الرقمية سترجعه لك بسرعة». ما المشكلة؟',
        },
        options: [
          { en: 'Gold never changes price', fr: 'L’or ne change jamais de prix', ar: 'الذهب لا يتغيّر سعره أبداً' },
          { en: 'None, if the coin is well known', fr: 'Aucun, si la crypto est connue', ar: 'لا مشكلة، إذا كانت العملة معروفة' },
          {
            en: 'Crypto can fall, and nothing guarantees a gain',
            fr: 'La crypto peut chuter, et rien ne garantit un gain',
            ar: 'العملات الرقمية قد تهبط، ولا شيء يضمن الربح',
          },
        ],
        answer: 2,
        why: {
          en: 'Nobody can promise a crypto gain, even on a well-known coin. Money you can’t afford to lose should never go in.',
          fr: 'Personne ne peut promettre un gain en crypto, même sur une crypto connue. L’argent que vous ne pouvez pas perdre ne doit jamais y aller.',
          ar: 'لا أحد يستطيع أن يضمن ربحاً في العملات الرقمية، حتى في عملة معروفة. المال الذي لا تستطيع خسارته لا يجب أن يدخل أبداً.',
        },
      },
    ],
  },

  {
    slug: 'wallets',
    level: 1,
    minutes: 3,
    title: {
      en: 'Wallets and secret keys',
      fr: 'Les wallets et les clés secrètes',
      ar: 'المحافظ والمفاتيح السرّية',
    },
    hook: {
      en: 'Whoever has your secret words has your coins.',
      fr: 'Celui qui a vos mots secrets a vos cryptos.',
      ar: 'من يملك كلماتك السرّية يملك عملاتك.',
    },
    terms: ['wallet', 'private-key', 'seed-phrase', 'exchange', 'self-custody'],
    sections: [
      {
        h: { en: 'A wallet holds keys, not coins', fr: 'Un wallet garde des clés, pas des pièces', ar: 'المحفظة تحفظ المفاتيح وليس العملات' },
        p: {
          en: 'Your coins are not stored inside an app. They are recorded on the blockchain. A wallet keeps the secret key (private key) that allows you to move them. Whoever controls the key controls the coins.',
          fr: 'Vos cryptos ne sont pas rangées dans une appli. Elles sont inscrites sur la blockchain. Un wallet garde la clé secrète (clé privée) qui permet de les déplacer. Qui contrôle la clé contrôle les cryptos.',
          ar: 'عملاتك ليست مخزّنة داخل تطبيق، بل مسجّلة على الـ blockchain. المحفظة (wallet) تحفظ المفتاح السرّي (private key) الذي يسمح بتحريكها. من يتحكّم في المفتاح يتحكّم في العملات.',
        },
      },
      {
        h: { en: 'Two kinds of wallet', fr: 'Deux sortes de wallet', ar: 'نوعان من المحافظ' },
        p: {
          en: 'On a platform (an exchange), the company keeps the keys for you, a bit like a bank keeps your money. With your own wallet (self-custody), you keep the keys yourself. The first is simpler, but you depend on the company. The second gives you full control, and full responsibility.',
          fr: 'Sur une plateforme (un exchange), l’entreprise garde les clés pour vous, un peu comme une banque garde votre argent. Avec votre propre wallet (auto-conservation), vous gardez les clés vous-même. Le premier est plus simple, mais vous dépendez de l’entreprise. Le second vous donne le contrôle total, et toute la responsabilité.',
          ar: 'على منصّة (exchange)، الشركة تحفظ المفاتيح بدلاً منك، قليلاً كما يحفظ البنك مالك. وفي محفظتك الخاصة (self-custody)، تحفظ المفاتيح بنفسك. الأولى أسهل لكنك تعتمد على الشركة. والثانية تعطيك التحكّم الكامل، والمسؤولية الكاملة.',
        },
      },
      {
        h: { en: 'The seed phrase', fr: 'La phrase de récupération', ar: 'كلمات الاسترجاع' },
        p: {
          en: 'When you create your own wallet, it shows you a list of words, usually 12 or 24. This seed phrase can rebuild the wallet on any phone. Anyone who sees those words can take everything in it, from anywhere in the world.',
          fr: 'Quand vous créez votre propre wallet, il vous montre une liste de mots, en général 12 ou 24. Cette phrase de récupération peut reconstruire le wallet sur n’importe quel téléphone. Toute personne qui voit ces mots peut tout prendre, depuis n’importe où dans le monde.',
          ar: 'عندما تنشئ محفظتك الخاصة، تعرض عليك قائمة كلمات، عادةً 12 أو 24 كلمة. هذه الكلمات (seed phrase) تستطيع إعادة بناء المحفظة على أي هاتف. وأي شخص يرى هذه الكلمات يستطيع أخذ كل ما فيها، من أي مكان في العالم.',
        },
      },
      {
        h: { en: 'Nobody honest asks for it', fr: 'Personne d’honnête ne la demande', ar: 'لا أحد صادق يطلبها' },
        p: {
          en: 'No real platform, support agent or “advisor” will ever ask for your seed phrase. Anyone who asks is trying to steal. Write the words on paper and keep them offline: no screenshot, no photo, no cloud notes, no message to yourself.',
          fr: 'Aucune vraie plateforme, aucun agent du support, aucun « conseiller » ne vous demandera jamais votre phrase de récupération. Celui qui la demande essaie de voler. Écrivez les mots sur papier et gardez-les hors ligne : pas de capture d’écran, pas de photo, pas de notes dans le cloud, pas de message à vous-même.',
          ar: 'لا توجد منصّة حقيقية ولا موظف دعم ولا «مستشار» يطلب منك كلمات الاسترجاع أبداً. من يطلبها يحاول السرقة. اكتب الكلمات على ورقة واحفظها بعيداً عن الإنترنت: لا لقطة شاشة، ولا صورة، ولا ملاحظات في الـ cloud، ولا رسالة لنفسك.',
        },
      },
      {
        h: { en: 'What can go wrong on each side', fr: 'Ce qui peut mal tourner de chaque côté', ar: 'ما قد يحدث في كل جهة' },
        p: {
          en: 'In November 2022 the exchange FTX collapsed. Its customers could not get their money for years, and most were repaid only at the dollar value of November 2022, far below what the same coins were worth later. With your own wallet, the risk is you: lose the words and the phone, and nobody can reset it.',
          fr: 'En novembre 2022, la plateforme FTX s’est effondrée. Ses clients n’ont pas pu récupérer leur argent pendant des années, et la plupart n’ont été remboursés qu’à la valeur en dollars de novembre 2022, bien en dessous de ce que valaient ces mêmes cryptos plus tard. Avec votre propre wallet, le risque, c’est vous : perdez les mots et le téléphone, et personne ne peut le réinitialiser.',
          ar: 'في نوفمبر 2022 انهارت منصّة FTX. عملاؤها لم يستطيعوا استرجاع أموالهم لسنوات، وأغلبهم استُرجع لهم المال فقط بقيمته بالدولار في نوفمبر 2022، وهي أقل بكثير ممّا صارت تساويه نفس العملات بعد ذلك. أما في محفظتك الخاصة فالخطر هو أنت: إذا ضاعت الكلمات والهاتف، لا أحد يستطيع استرجاعها.',
        },
      },
    ],
    takeaway: {
      en: 'A wallet holds keys. Whoever has your seed phrase has your coins: never share it, keep it on paper. A platform holds the keys for you, and that comes with its own risk.',
      fr: 'Un wallet garde des clés. Qui a votre phrase de récupération a vos cryptos : ne la partagez jamais, gardez-la sur papier. Une plateforme garde les clés pour vous, avec son propre risque.',
      ar: 'المحفظة تحفظ المفاتيح. من يملك كلمات الاسترجاع يملك عملاتك: لا تشاركها أبداً واحفظها على ورقة. والمنصّة تحفظ المفاتيح بدلاً منك، ولهذا خطره أيضاً.',
    },
    quiz: [
      {
        q: {
          en: 'Someone from “support” asks for your 12 words to fix your account. What is going on?',
          fr: 'Quelqu’un du « support » demande vos 12 mots pour réparer votre compte. Que se passe-t-il ?',
          ar: 'شخص من «الدعم» يطلب كلماتك الـ 12 ليصلح حسابك. ماذا يحدث؟',
        },
        options: [
          { en: 'A normal security check', fr: 'Un contrôle de sécurité normal', ar: 'فحص أمني عادي' },
          { en: 'Someone is trying to steal your wallet', fr: 'Quelqu’un essaie de voler votre wallet', ar: 'شخص يحاول سرقة محفظتك' },
          { en: 'A new rule of the blockchain', fr: 'Une nouvelle règle de la blockchain', ar: 'قاعدة جديدة في الـ blockchain' },
        ],
        answer: 1,
        why: {
          en: 'No honest service ever needs your seed phrase. Whoever has it can empty the wallet.',
          fr: 'Aucun service honnête n’a besoin de votre phrase de récupération. Qui l’a peut vider le wallet.',
          ar: 'لا توجد خدمة صادقة تحتاج كلمات الاسترجاع. من يملكها يستطيع إفراغ المحفظة.',
        },
      },
      {
        q: {
          en: 'Where is it safest to keep your seed phrase?',
          fr: 'Où est-il le plus sûr de garder votre phrase de récupération ?',
          ar: 'أين المكان الأكثر أماناً لحفظ كلمات الاسترجاع؟',
        },
        options: [
          { en: 'On paper, kept offline', fr: 'Sur papier, hors ligne', ar: 'على ورقة، بعيداً عن الإنترنت' },
          { en: 'In a screenshot on your phone', fr: 'Dans une capture d’écran sur votre téléphone', ar: 'في لقطة شاشة على هاتفك' },
          { en: 'In a message sent to yourself', fr: 'Dans un message envoyé à vous-même', ar: 'في رسالة ترسلها لنفسك' },
        ],
        answer: 0,
        why: {
          en: 'Photos, screenshots and messages can be hacked or synced to the cloud. Paper kept offline can’t be reached from the internet.',
          fr: 'Photos, captures et messages peuvent être piratés ou synchronisés dans le cloud. Le papier hors ligne est inaccessible depuis internet.',
          ar: 'الصور ولقطات الشاشة والرسائل قد تُخترق أو تُرفع إلى الـ cloud. الورقة البعيدة عن الإنترنت لا يمكن الوصول إليها من الإنترنت.',
        },
      },
      {
        q: {
          en: 'What did the collapse of FTX in 2022 show?',
          fr: 'Qu’a montré l’effondrement de FTX en 2022 ?',
          ar: 'ماذا أظهر انهيار FTX في 2022؟',
        },
        options: [
          { en: 'Support can reset a lost seed phrase', fr: 'Le support peut réinitialiser une phrase perdue', ar: 'الدعم يستطيع استرجاع كلمات ضائعة' },
          {
            en: 'Coins on a platform are always protected',
            fr: 'Les cryptos sur une plateforme sont toujours protégées',
            ar: 'العملات على المنصّة محميّة دائماً',
          },
          {
            en: 'Money kept on a platform depends on that company',
            fr: 'L’argent gardé sur une plateforme dépend de cette entreprise',
            ar: 'المال الموجود على منصّة يتعلّق بتلك الشركة',
          },
        ],
        answer: 2,
        why: {
          en: 'When the company failed, customers could not reach their money for years. On a platform, the company holds the keys.',
          fr: 'Quand l’entreprise a fait faillite, les clients n’ont pas pu accéder à leur argent pendant des années. Sur une plateforme, c’est l’entreprise qui tient les clés.',
          ar: 'عندما أفلست الشركة، لم يستطع العملاء الوصول إلى أموالهم لسنوات. على المنصّة، الشركة هي التي تملك المفاتيح.',
        },
      },
    ],
  },

  {
    slug: 'scams',
    level: 1,
    minutes: 2,
    title: {
      en: 'How scammers find you',
      fr: 'Comment les arnaqueurs vous trouvent',
      ar: 'كيف يصل إليك المحتالون',
    },
    hook: {
      en: 'They don’t wait for you. They message first, promise big, and rush you.',
      fr: 'Ils n’attendent pas que vous veniez. Ils écrivent en premier, promettent gros et vous pressent.',
      ar: 'لا ينتظرونك. يراسلونك أولًا، ويعدونك بالكثير، ويستعجلونك.',
    },
    terms: ['signals', 'ponzi', 'fake-platform', 'phishing'],
    live: {
      kind: 'view',
      view: 'scamcheck',
      label: {
        en: 'Got a strange message? Check it for red flags',
        fr: 'Un message bizarre ? Vérifiez les signaux d’alerte',
        ar: 'وصلتك رسالة غريبة؟ افحص علامات الخطر فيها',
      },
    },
    sections: [
      {
        h: { en: 'The VIP group', fr: 'Le groupe VIP', ar: 'مجموعة الـ VIP' },
        p: {
          en: 'You get a message, or you find yourself added to a WhatsApp or Telegram group full of “members” posting screenshots of profits. Many are fake or paid accounts. The “coach” offers VIP signals for a fee, or asks you to send money so he can “manage” it for you.',
          fr: 'Vous recevez un message, ou vous vous retrouvez ajouté à un groupe WhatsApp ou Telegram plein de « membres » qui postent des captures de gains. Beaucoup sont des comptes faux ou payés. Le « coach » propose des signaux VIP payants, ou vous demande d’envoyer de l’argent pour le « gérer » à votre place.',
          ar: 'تصلك رسالة، أو تجد نفسك مضافًا إلى مجموعة WhatsApp أو Telegram مليئة بـ«أعضاء» ينشرون صورًا لأرباحهم. كثير منها حسابات مزيفة أو مدفوعة. «المدرب» يعرض عليك توصيات (signals) VIP مقابل المال، أو يطلب منك أن ترسل له مالًا لكي «يديره» لك.',
        },
      },
      {
        h: { en: '“Guaranteed profit”', fr: '« Profit garanti »', ar: '«ربح مضمون»' },
        p: {
          en: '“5% a day.” “Double your money in a week.” “Zero risk.” Nobody can guarantee crypto profits: a promise like that is the scam itself. Often the first members are paid with the money of those who joined later (a Ponzi scheme), until the whole thing collapses.',
          fr: '« 5 % par jour. » « Doublez votre argent en une semaine. » « Zéro risque. » Personne ne peut garantir des gains en crypto : une telle promesse, c’est l’arnaque elle-même. Souvent, les premiers membres sont payés avec l’argent des suivants (une chaîne de Ponzi), jusqu’à ce que tout s’écroule.',
          ar: '«5% يوميًا». «ضاعف مالك في أسبوع». «بدون أي مخاطرة». لا أحد يستطيع أن يضمن أرباحًا في العملات الرقمية: وعد كهذا هو الاحتيال نفسه. غالبًا يُدفع للأعضاء الأوائل من أموال من انضموا بعدهم (مخطط Ponzi)، إلى أن ينهار كل شيء.',
        },
      },
      {
        h: { en: 'Fake platforms', fr: 'Les fausses plateformes', ar: 'المنصات المزيفة' },
        p: {
          en: 'A slick website or app shows your balance growing. When you try to withdraw, they ask for a “tax” or an “unlock fee” first. Then another one. The money was never there. Some fake login pages also copy a real platform to steal your password. Before anything, search the name with the word “scam”, and look for warnings from your country’s financial regulator.',
          fr: 'Un site ou une appli soignée montre votre solde qui grimpe. Quand vous voulez retirer, on vous demande d’abord une « taxe » ou des « frais de déblocage ». Puis d’autres. L’argent n’a jamais existé. Certaines fausses pages de connexion copient aussi une vraie plateforme pour voler votre mot de passe. Avant tout, cherchez le nom avec le mot « arnaque », et regardez les mises en garde du régulateur financier de votre pays.',
          ar: 'موقع أو تطبيق أنيق يُريك رصيدك يكبر. عندما تحاول السحب، يطلبون منك أولًا «ضريبة» أو «رسوم فتح الحساب». ثم رسومًا أخرى. المال لم يكن موجودًا أصلًا. وبعض صفحات الدخول المزيفة تقلّد منصة حقيقية لتسرق كلمة المرور. قبل أي شيء، ابحث عن الاسم مع كلمة «احتيال»، وابحث عن تحذيرات الجهة الرقابية المالية في بلدك.',
        },
      },
      {
        h: { en: 'Cash meetups', fr: 'Les rendez-vous avec du cash', ar: 'لقاءات النقد' },
        p: {
          en: '“Cheap USDT, meet me in person and bring cash.” There have been reports of such meetups turning into robberies. A price far below the market is the bait.',
          fr: '« USDT pas cher, on se voit en vrai, apporte du cash. » Des rendez-vous de ce genre ont, selon plusieurs témoignages, tourné au vol. Un prix très en dessous du marché, c’est l’appât.',
          ar: '«USDT رخيصة، لنلتقِ وجهًا لوجه وأحضر النقد». وردت تقارير عن لقاءات كهذه انتهت بسرقة. السعر الأرخص بكثير من السوق هو الطُّعم.',
        },
      },
      {
        h: { en: 'The 3 red flags', fr: 'Les 3 signaux d’alarme', ar: 'العلامات الحمراء الثلاث' },
        p: {
          en: '1) They contacted you first. 2) They promise sure or fast profit. 3) They rush you (“today only”, “last places”). One flag is enough to stop. Qirat never messages you first and never asks you for money.',
          fr: '1) Ils vous ont contacté en premier. 2) Ils promettent un gain sûr ou rapide. 3) Ils vous pressent (« aujourd’hui seulement », « dernières places »). Un seul signal suffit pour s’arrêter. Qirat ne vous écrit jamais en premier et ne vous demande jamais d’argent.',
          ar: '1) هم من تواصل معك أولًا. 2) يعدونك بربح مضمون أو سريع. 3) يستعجلونك («اليوم فقط»، «آخر الأماكن»). علامة واحدة تكفي لتتوقف. قيراط لا يراسلك أولًا أبدًا ولا يطلب منك المال أبدًا.',
        },
      },
    ],
    takeaway: {
      en: 'A message from a stranger + a promise + a rush = stop. Real investing comes with no guarantees.',
      fr: 'Un message d’inconnu + une promesse + de la pression = stop. Un vrai investissement n’a jamais de garantie.',
      ar: 'رسالة من غريب + وعد + استعجال = توقّف. الاستثمار الحقيقي لا يأتي بضمانات.',
    },
    quiz: [
      {
        q: {
          en: 'A stranger adds you to a Telegram group with daily profit screenshots. What is the safest reaction?',
          fr: 'Un inconnu vous ajoute à un groupe Telegram avec des captures de gains chaque jour. Quelle est la réaction la plus sûre ?',
          ar: 'شخص لا تعرفه أضافك إلى مجموعة Telegram فيها صور أرباح كل يوم. ما هو التصرف الأكثر أمانًا؟',
        },
        options: [
          { en: 'Treat it as a red flag and leave', fr: 'Y voir un signal d’alarme et partir', ar: 'اعتبارها علامة حمراء والخروج' },
          { en: 'Send a small amount to test it', fr: 'Envoyer un petit montant pour tester', ar: 'إرسال مبلغ صغير للتجربة' },
          { en: 'Join the VIP before places run out', fr: 'Rejoindre le VIP avant qu’il n’y ait plus de place', ar: 'الانضمام إلى الـ VIP قبل نفاد الأماكن' },
        ],
        answer: 0,
        why: {
          en: 'Screenshots are easy to fake, and a “small test” deposit is how many people get hooked.',
          fr: 'Les captures se truquent facilement, et le « petit dépôt pour tester » est souvent le début du piège.',
          ar: 'الصور سهلة التزييف، و«المبلغ الصغير للتجربة» هو الطريقة التي يقع بها كثيرون في الفخ.',
        },
      },
      {
        q: {
          en: 'A platform says you must pay a fee before you can withdraw your profits. What is most likely going on?',
          fr: 'Une plateforme dit qu’il faut payer des frais avant de retirer vos gains. Que se passe-t-il probablement ?',
          ar: 'منصة تقول إن عليك دفع رسوم قبل أن تسحب أرباحك. ما الأرجح؟',
        },
        options: [
          { en: 'A normal bank tax', fr: 'Une taxe bancaire normale', ar: 'ضريبة بنكية عادية' },
          { en: 'A Bitcoin rule', fr: 'Une règle du Bitcoin', ar: 'قاعدة من قواعد Bitcoin' },
          { en: 'A scam that will keep asking for more', fr: 'Une arnaque qui demandera toujours plus', ar: 'احتيال سيستمر في طلب المزيد' },
        ],
        answer: 2,
        why: {
          en: 'Fake platforms invent fees to squeeze out more money. The “profits” on screen were never real.',
          fr: 'Les fausses plateformes inventent des frais pour soutirer encore plus. Les « gains » affichés n’ont jamais existé.',
          ar: 'المنصات المزيفة تخترع رسومًا لتأخذ منك المزيد. «الأرباح» التي على الشاشة لم تكن حقيقية أبدًا.',
        },
      },
      {
        q: {
          en: 'Which of these is a red flag?',
          fr: 'Lequel de ces messages est un signal d’alarme ?',
          ar: 'أيّ من هذه الرسائل علامة حمراء؟',
        },
        options: [
          { en: '“Prices can go down”', fr: '« Les prix peuvent baisser »', ar: '«الأسعار قد تنخفض»' },
          { en: '“Guaranteed 5% a day”', fr: '« 5 % garantis par jour »', ar: '«5% مضمونة يوميًا»' },
          { en: '“Only put in what you can lose”', fr: '« Ne mettez que ce que vous pouvez perdre »', ar: '«لا تضع إلا ما يمكنك خسارته»' },
        ],
        answer: 1,
        why: {
          en: 'Nobody can guarantee a crypto return. The other two are honest warnings.',
          fr: 'Personne ne peut garantir un rendement crypto. Les deux autres sont des avertissements honnêtes.',
          ar: 'لا أحد يستطيع أن يضمن عائدًا في العملات الرقمية. الرسالتان الأخريان تحذيران صادقان.',
        },
      },
    ],
  },

  {
    slug: 'p2p',
    level: 1,
    minutes: 2,
    title: {
      en: 'P2P: where the danger hides',
      fr: 'Le P2P : là où se cache le danger',
      ar: 'التعامل المباشر (P2P): أين يختبئ الخطر',
    },
    hook: {
      en: 'This is not a how-to. It is the list of what goes wrong when the other side is a stranger.',
      fr: 'Ce n’est pas un mode d’emploi. C’est la liste de ce qui tourne mal quand l’autre côté est un inconnu.',
      ar: 'هذا ليس شرحاً لطريقة الشراء. إنه قائمة بما يحدث عندما يكون الطرف الآخر شخصاً لا تعرفه.',
    },
    terms: ['p2p', 'escrow', 'usdt'],
    sections: [
      {
        h: { en: 'What P2P is', fr: 'Ce qu’est le P2P', ar: 'ما هو الـ P2P' },
        p: {
          en: 'P2P (peer to peer) means buying or selling crypto directly with another person, often through a platform that holds the crypto in escrow until both sides confirm the payment. The other person is a stranger, and that is where the risks start.',
          fr: 'Le P2P (de pair à pair) consiste à acheter ou vendre de la crypto directement avec une autre personne, souvent via une plateforme qui bloque la crypto sous séquestre (escrow) jusqu’à ce que les deux côtés confirment le paiement. L’autre personne est un inconnu, et c’est là que les risques commencent.',
          ar: 'الـ P2P (من شخص إلى شخص) يعني أن تشتري أو تبيع عملة رقمية مباشرة مع شخص آخر، غالباً عبر منصّة تحجز العملة (escrow) حتى يؤكّد الطرفان الدفع. الطرف الآخر شخص لا تعرفه، ومن هنا تبدأ المخاطر.',
        },
      },
      {
        h: { en: 'Cash meetups', fr: 'Les rendez-vous avec du cash', ar: 'اللقاءات بالنقد' },
        p: {
          en: 'Some offers say: “Cheap USDT, meet me in person and bring cash.” There have been reports of such meetups ending in robbery. A price far below the market is the bait.',
          fr: 'Certaines offres disent : « USDT pas cher, on se voit en personne, apporte du cash. » Des rendez-vous de ce genre ont, selon plusieurs témoignages, fini en vol. Un prix très en dessous du marché, c’est l’appât.',
          ar: 'بعض العروض تقول: «USDT رخيص، نلتقي وجهاً لوجه وأحضر النقود». وقد وردت روايات عن لقاءات كهذه انتهت بسرقة. السعر الأقل بكثير من السوق هو الطُعم.',
        },
      },
      {
        h: { en: 'Payments that come back', fr: 'Les paiements qui reviennent', ar: 'مدفوعات تُسترجع' },
        p: {
          en: 'A bank transfer can be reversed, or turn out to come from a stolen account. If your crypto has already left, you lose both. Some scammers send a fake payment screenshot and push you to release the crypto fast.',
          fr: 'Un virement peut être annulé, ou venir d’un compte volé. Si votre crypto est déjà partie, vous perdez les deux. Certains escrocs envoient une fausse capture de paiement et vous pressent de libérer la crypto vite.',
          ar: 'التحويل البنكي قد يُلغى، أو يتّضح أنه جاء من حساب مسروق. إذا كانت عملتك قد خرجت، تخسر الاثنين. وبعض المحتالين يرسلون لقطة شاشة مزيّفة للدفع ويستعجلونك لتسليم العملة.',
        },
      },
      {
        h: { en: 'The rate and your bank', fr: 'Le taux et votre banque', ar: 'سعر الصرف وبنكك' },
        p: {
          en: 'The rate a stranger asks can be far from the official exchange rate, so you can lose money on the rate itself. Money from strangers landing on your bank account can also bring questions from your bank about where it came from.',
          fr: 'Le taux demandé par un inconnu peut être très loin du taux de change officiel : vous pouvez perdre de l’argent sur le taux lui-même. De l’argent d’inconnus qui arrive sur votre compte peut aussi amener votre banque à vous demander d’où il vient.',
          ar: 'السعر الذي يطلبه شخص غريب قد يكون بعيداً جداً عن سعر الصرف الرسمي، فتخسر مالاً في سعر الصرف نفسه. كما أن وصول أموال من غرباء إلى حسابك البنكي قد يجعل البنك يسألك عن مصدرها.',
        },
      },
      {
        h: { en: 'Leaving the platform', fr: 'Quitter la plateforme', ar: 'الخروج من المنصّة' },
        p: {
          en: 'A common trick is: “Let’s finish on WhatsApp, it’s faster.” Outside the platform there is no escrow and nobody to complain to. A so-called “escrow agent” who asks you to send first is the same trick.',
          fr: 'Un piège courant : « On termine sur WhatsApp, c’est plus rapide. » Hors de la plateforme, il n’y a plus de séquestre et personne à qui se plaindre. Un soi-disant « agent de séquestre » qui vous demande d’envoyer en premier, c’est le même piège.',
          ar: 'حيلة شائعة: «لنُكمل على WhatsApp، أسرع». خارج المنصّة لا يوجد حجز (escrow) ولا جهة تشتكي إليها. و«وسيط الضمان» الذي يطلب منك أن ترسل أولاً هو نفس الحيلة.',
        },
      },
    ],
    takeaway: {
      en: 'In P2P the other side is a stranger. Cash meetups, reversed payments, odd rates and moving off the platform are where people lose money.',
      fr: 'En P2P, l’autre côté est un inconnu. Les rendez-vous en cash, les paiements annulés, les taux bizarres et le fait de quitter la plateforme, c’est là qu’on perd de l’argent.',
      ar: 'في الـ P2P الطرف الآخر شخص غريب. اللقاءات بالنقد، والمدفوعات التي تُلغى، والأسعار الغريبة، والخروج من المنصّة: هنا يخسر الناس أموالهم.',
    },
    quiz: [
      {
        q: {
          en: 'A seller offers USDT far below the market price, cash only, in person. What is that price most likely to be?',
          fr: 'Un vendeur propose de l’USDT très en dessous du prix du marché, cash uniquement, en personne. Que représente probablement ce prix ?',
          ar: 'بائع يعرض USDT بسعر أقل بكثير من السوق، نقداً فقط ووجهاً لوجه. ماذا يكون هذا السعر غالباً؟',
        },
        options: [
          { en: 'A lucky deal', fr: 'Une bonne affaire', ar: 'صفقة محظوظة' },
          { en: 'The official rate', fr: 'Le taux officiel', ar: 'السعر الرسمي' },
          { en: 'The bait', fr: 'L’appât', ar: 'الطُعم' },
        ],
        answer: 2,
        why: {
          en: 'Nobody sells far below the market without a reason. A cheap price plus cash in person is the classic setup for a robbery or a scam.',
          fr: 'Personne ne vend très en dessous du marché sans raison. Prix bas + cash en personne, c’est le scénario classique d’un vol ou d’une arnaque.',
          ar: 'لا أحد يبيع بأقل بكثير من السوق دون سبب. سعر رخيص مع نقد ولقاء شخصي هو السيناريو المعروف للسرقة أو الاحتيال.',
        },
      },
      {
        q: {
          en: 'The other side says: “Let’s finish the deal on WhatsApp, it’s faster.” What changes?',
          fr: 'L’autre côté dit : « On finit l’affaire sur WhatsApp, c’est plus rapide. » Qu’est-ce qui change ?',
          ar: 'الطرف الآخر يقول: «لنُكمل الصفقة على WhatsApp، أسرع». ما الذي يتغيّر؟',
        },
        options: [
          { en: 'Nothing, it is the same deal', fr: 'Rien, c’est la même affaire', ar: 'لا شيء، إنها نفس الصفقة' },
          {
            en: 'The platform’s escrow no longer protects the deal',
            fr: 'Le séquestre de la plateforme ne protège plus l’affaire',
            ar: 'حجز المنصّة (escrow) لم يعد يحمي الصفقة',
          },
          { en: 'The deal gets a lower fee', fr: 'L’affaire coûte moins de frais', ar: 'الصفقة تصبح برسوم أقل' },
        ],
        answer: 1,
        why: {
          en: 'Off the platform, nobody holds the crypto and nobody can settle a dispute. That is exactly why scammers ask for it.',
          fr: 'Hors de la plateforme, personne ne bloque la crypto et personne ne peut trancher un litige. C’est justement pour ça que les escrocs le demandent.',
          ar: 'خارج المنصّة لا أحد يحجز العملة ولا أحد يحلّ الخلاف. ولهذا بالضبط يطلبه المحتالون.',
        },
      },
      {
        q: {
          en: 'Why can money from strangers on your bank account be a problem?',
          fr: 'Pourquoi de l’argent d’inconnus sur votre compte bancaire peut-il poser problème ?',
          ar: 'لماذا قد يكون وصول مال من غرباء إلى حسابك البنكي مشكلة؟',
        },
        options: [
          {
            en: 'The bank can ask where it came from, and a transfer can be reversed',
            fr: 'La banque peut demander d’où il vient, et un virement peut être annulé',
            ar: 'البنك قد يسألك عن مصدره، والتحويل قد يُلغى',
          },
          { en: 'It always carries a hidden fee', fr: 'Il y a toujours des frais cachés', ar: 'فيه دائماً رسوم مخفيّة' },
          { en: 'Banks block every transfer from a person', fr: 'Les banques bloquent tout virement d’un particulier', ar: 'البنوك تمنع كل تحويل من شخص' },
        ],
        answer: 0,
        why: {
          en: 'You don’t know where a stranger’s money comes from. If it is reversed or stolen, the problem lands on your account.',
          fr: 'Vous ne savez pas d’où vient l’argent d’un inconnu. S’il est annulé ou volé, le problème tombe sur votre compte.',
          ar: 'أنت لا تعرف مصدر مال شخص غريب. إذا أُلغي التحويل أو كان المال مسروقاً، تقع المشكلة على حسابك.',
        },
      },
    ],
  },

  {
    slug: 'law-tunisia',
    level: 1,
    minutes: 3,
    title: {
      en: 'Crypto and the law in Tunisia',
      fr: 'La crypto et la loi en Tunisie',
      ar: 'العملات الرقمية والقانون في تونس',
    },
    hook: {
      en: 'Facts with dates, as of November 2026. This is not legal advice.',
      fr: 'Des faits datés, à jour en novembre 2026. Ce n’est pas un conseil juridique.',
      ar: 'وقائع بتواريخها، إلى غاية نوفمبر 2026. هذا ليس استشارة قانونية.',
    },
    terms: ['bct', 'legal-tender', 'exchange-code'],
    sections: [
      {
        h: { en: 'The only legal currency', fr: 'La seule monnaie légale', ar: 'العملة القانونية الوحيدة' },
        p: {
          en: 'In Tunisia the dinar is the only legal currency (legal tender). As of November 2026, no law authorises crypto.',
          fr: 'En Tunisie, le dinar est la seule monnaie légale (cours légal). En novembre 2026, aucune loi n’autorise la crypto.',
          ar: 'في تونس، الدينار هو العملة القانونية الوحيدة (legal tender). وإلى غاية نوفمبر 2026، لا يوجد قانون يسمح بالعملات الرقمية.',
        },
      },
      {
        h: { en: 'The 1976 exchange law', fr: 'La loi des changes de 1976', ar: 'قانون الصرف لسنة 1976' },
        p: {
          en: 'Foreign-currency matters are governed by law no. 76-18 of 21 January 1976, the foreign-exchange code. It controls holding and moving money and assets in foreign currency, under the central bank (BCT). Crypto cases have been brought under this law.',
          fr: 'Les questions de devises relèvent de la loi n° 76-18 du 21 janvier 1976, le code des changes. Elle encadre la détention et le transfert d’argent et d’avoirs en devises, sous le contrôle de la banque centrale (BCT). Des affaires de crypto ont été poursuivies sur la base de cette loi.',
          ar: 'مسائل العملات الأجنبية يحكمها القانون عدد 76-18 المؤرّخ في 21 جانفي 1976، أي مجلّة الصرف. هذا القانون ينظّم امتلاك وتحويل الأموال والأصول بالعملة الأجنبية، تحت رقابة البنك المركزي (BCT). وقد رُفعت قضايا تتعلّق بالعملات الرقمية على أساس هذا القانون.',
        },
      },
      {
        h: { en: 'A case from 2021', fr: 'Une affaire de 2021', ar: 'قضية من سنة 2021' },
        p: {
          en: 'In May 2021 an engineering student was arrested and charged under the exchange law in a bitcoin case. He was released at the end of May 2021, and the court dismissed the case in December 2021. In June 2021 the finance minister said that owning bitcoin should be decriminalised.',
          fr: 'En mai 2021, un étudiant ingénieur a été arrêté et poursuivi au titre de la loi des changes dans une affaire de bitcoin. Il a été libéré fin mai 2021, et la justice a prononcé un non-lieu en décembre 2021. En juin 2021, le ministre des Finances a déclaré que la détention de bitcoin devrait être dépénalisée.',
          ar: 'في ماي 2021، أُوقف طالب هندسة ووُجّهت إليه تهم بموجب قانون الصرف في قضية تتعلّق بالـ bitcoin. أُطلق سراحه في آخر ماي 2021، وحفظت المحكمة القضية (عدم سماع الدعوى) في ديسمبر 2021. وفي جوان 2021 قال وزير المالية إن امتلاك الـ bitcoin يجب ألّا يبقى جريمة.',
        },
      },
      {
        h: { en: 'The new exchange code', fr: 'Le nouveau code des changes', ar: 'مجلّة الصرف الجديدة' },
        p: {
          en: 'In February 2023 a draft of a new exchange code stated that crypto-assets are not a currency. On 14 March 2024 a government draft was adopted in a ministerial council; it aimed to allow crypto transactions with BCT authorisation. In October 2025 members of parliament filed their own bill, which was examined in committee in 2026.',
          fr: 'En février 2023, un projet de nouveau code des changes indiquait que les crypto-actifs ne sont pas une monnaie. Le 14 mars 2024, un projet du gouvernement a été adopté en conseil ministériel ; il visait à autoriser les transactions en crypto avec l’autorisation de la BCT. En octobre 2025, des députés ont déposé leur propre proposition de loi, examinée en commission en 2026.',
          ar: 'في فيفري 2023، نصّ مشروع لمجلّة صرف جديدة على أن الأصول الرقمية ليست عملة. وفي 14 مارس 2024 صادق مجلس وزاري على مشروع حكومي، كان هدفه السماح بمعاملات العملات الرقمية بترخيص من البنك المركزي. وفي أكتوبر 2025 قدّم نوّاب في البرلمان مقترح قانون خاصاً بهم، ونوقش في اللجنة خلال 2026.',
        },
      },
      {
        h: { en: 'Where it stands', fr: 'Où on en est', ar: 'أين وصل الأمر' },
        p: {
          en: 'As of November 2026 the new code is not law, so the 1976 law still applies. Rules can change: check the date of anything you read on this topic. For your own situation, ask a lawyer. This page is not legal advice.',
          fr: 'En novembre 2026, le nouveau code n’est pas une loi : la loi de 1976 s’applique donc toujours. Les règles peuvent changer : vérifiez la date de tout ce que vous lisez sur le sujet. Pour votre propre situation, demandez à un avocat. Cette page n’est pas un conseil juridique.',
          ar: 'إلى غاية نوفمبر 2026، المجلّة الجديدة ليست قانوناً بعد، لذلك ما زال قانون 1976 هو المطبّق. القواعد قد تتغيّر: تحقّق من تاريخ كل ما تقرؤه في هذا الموضوع. ولوضعك الخاص، اسأل محامياً. هذه الصفحة ليست استشارة قانونية.',
        },
      },
    ],
    takeaway: {
      en: 'As of November 2026: the dinar is the only legal currency, the 1976 exchange law still applies, and the new exchange code has not been adopted.',
      fr: 'En novembre 2026 : le dinar est la seule monnaie légale, la loi des changes de 1976 s’applique toujours, et le nouveau code des changes n’est pas adopté.',
      ar: 'إلى غاية نوفمبر 2026: الدينار هو العملة القانونية الوحيدة، وقانون الصرف لسنة 1976 ما زال مطبّقاً، ومجلّة الصرف الجديدة لم يُصادَق عليها.',
    },
    quiz: [
      {
        q: {
          en: 'As of November 2026, which law still covers foreign-exchange matters in Tunisia?',
          fr: 'En novembre 2026, quelle loi régit encore les changes en Tunisie ?',
          ar: 'إلى غاية نوفمبر 2026، أيّ قانون ما زال ينظّم الصرف في تونس؟',
        },
        options: [
          { en: 'The new exchange code of 2024', fr: 'Le nouveau code des changes de 2024', ar: 'مجلّة الصرف الجديدة لسنة 2024' },
          { en: 'Law 76-18 of 1976', fr: 'La loi 76-18 de 1976', ar: 'القانون 76-18 لسنة 1976' },
          { en: 'A crypto law passed in 2023', fr: 'Une loi crypto votée en 2023', ar: 'قانون للعملات الرقمية صدر في 2023' },
        ],
        answer: 1,
        why: {
          en: 'The 2024 text was a draft and no crypto law was passed in 2023. Law 76-18 still applies.',
          fr: 'Le texte de 2024 était un projet, et aucune loi crypto n’a été votée en 2023. La loi 76-18 s’applique toujours.',
          ar: 'نصّ 2024 كان مشروعاً فقط، ولم يصدر أي قانون للعملات الرقمية في 2023. القانون 76-18 ما زال مطبّقاً.',
        },
      },
      {
        q: {
          en: 'What happened in the 2021 student bitcoin case?',
          fr: 'Que s’est-il passé dans l’affaire de l’étudiant et du bitcoin en 2021 ?',
          ar: 'ماذا حدث في قضية الطالب والـ bitcoin سنة 2021؟',
        },
        options: [
          { en: 'He was given a crypto licence', fr: 'Il a obtenu une licence crypto', ar: 'حصل على رخصة للعملات الرقمية' },
          { en: 'He was sentenced to ten years', fr: 'Il a été condamné à dix ans', ar: 'حُكم عليه بعشر سنوات' },
          {
            en: 'He was arrested, then the case was dismissed in December 2021',
            fr: 'Il a été arrêté, puis l’affaire s’est conclue par un non-lieu en décembre 2021',
            ar: 'أُوقف، ثم حُفظت القضية في ديسمبر 2021',
          },
        ],
        answer: 2,
        why: {
          en: 'He was charged under the exchange law, released at the end of May 2021, and the case was dismissed in December 2021.',
          fr: 'Il a été poursuivi au titre de la loi des changes, libéré fin mai 2021, et l’affaire a été classée par un non-lieu en décembre 2021.',
          ar: 'وُجّهت إليه تهم بموجب قانون الصرف، وأُطلق سراحه في آخر ماي 2021، ثم حُفظت القضية في ديسمبر 2021.',
        },
      },
      {
        q: {
          en: 'Where does the new exchange code stand in November 2026?',
          fr: 'Où en est le nouveau code des changes en novembre 2026 ?',
          ar: 'أين وصلت مجلّة الصرف الجديدة في نوفمبر 2026؟',
        },
        options: [
          { en: 'Drafts exist, but it is not law yet', fr: 'Des projets existent, mais ce n’est pas encore une loi', ar: 'توجد مشاريع، لكنها ليست قانوناً بعد' },
          { en: 'It became law in 2023', fr: 'Il est devenu loi en 2023', ar: 'أصبحت قانوناً في 2023' },
          { en: 'It replaced the 1976 law in 2024', fr: 'Il a remplacé la loi de 1976 en 2024', ar: 'عوّضت قانون 1976 في 2024' },
        ],
        answer: 0,
        why: {
          en: 'There have been drafts since 2023 and a bill in parliament since October 2025, but nothing adopted as of November 2026.',
          fr: 'Il y a des projets depuis 2023 et une proposition au Parlement depuis octobre 2025, mais rien d’adopté en novembre 2026.',
          ar: 'توجد مشاريع منذ 2023 ومقترح قانون في البرلمان منذ أكتوبر 2025، لكن لا شيء صودق عليه إلى غاية نوفمبر 2026.',
        },
      },
    ],
  },
]
