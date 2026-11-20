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
          fr: 'Quand vous envoyez de l’argent par la banque, c’est elle qui tient le registre de qui possède quoi. La crypto remplace la banque par un cahier partagé, copié sur des milliers d’ordinateurs dans le monde. Ce cahier s’appelle une blockchain. Personne ne peut effacer une ligne en secret, car tout le monde en a une copie.',
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
          en: 'Today the CoinGecko website lists more than 22,000 cryptocurrencies. A few are big and well known. Most are small, and many die: CoinGecko counted that more than half of the coins added to its list since 2021 are no longer bought or sold. New does not mean better.',
          fr: 'Aujourd’hui, le site CoinGecko affiche plus de 22 000 cryptomonnaies. Quelques-unes sont grandes et connues. La plupart sont petites, et beaucoup meurent : CoinGecko a compté que plus de la moitié des cryptos ajoutées à sa liste depuis 2021 ne s’échangent plus. Nouveau ne veut pas dire meilleur.',
          ar: 'اليوم يعرض موقع CoinGecko أكثر من 22,000 عملة رقمية. القليل منها كبير ومعروف. أغلبها صغير، وكثير منها يموت: حسب CoinGecko، أكثر من نصف الرموز التي أُدرجت منذ 2021 لم يعد أحد يتداولها. الجديد لا يعني الأفضل.',
        },
      },
      {
        h: { en: 'What it is not', fr: 'Ce que ce n’est pas', ar: 'ما ليست عليه' },
        p: {
          en: 'Crypto is not a savings account. No bank and no state guarantees its value. If the price drops, nobody pays you back.',
          fr: 'La crypto n’est pas un compte d’épargne. Aucune banque et aucun État ne garantit sa valeur. Si le prix chute, personne ne vous rembourse.',
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
          en: 'USDT, also called Tether, is a stablecoin: a crypto made to always be worth about 1 US dollar. The company Tether says it keeps things of value behind every USDT: mostly US Treasury bills (short-term loans to the US government), plus cash, gold and some bitcoin.',
          fr: 'L’USDT, aussi appelé Tether, est un stablecoin : une crypto faite pour valoir toujours environ 1 dollar américain. La société Tether dit garder des biens de valeur derrière chaque USDT : surtout des bons du Trésor américain (des prêts à court terme à l’État américain), plus du cash, de l’or et un peu de bitcoin.',
          ar: 'USDT، وتُسمّى أيضًا Tether، هي عملة مستقرة (stablecoin): عملة رقمية مصممة لتساوي دائمًا حوالي 1 دولار أمريكي. تقول شركة Tether إنها تحتفظ باحتياطي مقابل كل USDT، أغلبه سندات خزينة أمريكية (قروض قصيرة الأجل للحكومة الأمريكية)، إضافة إلى نقد وذهب وبعض الـ bitcoin.',
        },
      },
      {
        h: { en: 'Why people use it', fr: 'Pourquoi on l’utilise', ar: 'لماذا يستعملها الناس' },
        p: {
          en: 'Its price barely moves, so people keep money in USDT between two other cryptos. Many freelancers also get paid in it from abroad. Most crypto prices, including in Qirat, are shown in USDT.',
          fr: 'Comme son prix bouge à peine, on garde de l’argent en USDT entre deux cryptos. Beaucoup de freelances se font aussi payer en USDT depuis l’étranger. La plupart des prix crypto, y compris dans Qirat, sont affichés en USDT.',
          ar: 'لأن سعرها لا يكاد يتحرك، يستعمل الناس USDT لإبقاء أموالهم بين عملة وأخرى، وكثير من المستقلين (freelancers) يتقاضون أجورهم بها من الخارج. ومعظم أسعار العملات الرقمية، بما فيها في قيراط، تُعرض بالـ USDT.',
        },
      },
      {
        h: { en: 'Checked, but not fully audited', fr: 'Vérifié, mais pas audité en entier', ar: 'مُراجَع، لكن بدون تدقيق كامل' },
        p: {
          en: 'Every three months, an accounting firm checks what Tether holds, on one single day. This is a simple check (an attestation), not a full audit of all the accounts. In 2021, two US authorities looked into it: the CFTC and New York’s attorney general. They found that in the past, Tether had not always held enough to cover every USDT. Tether paid fines to close both cases.',
          fr: 'Tous les trois mois, une société de comptabilité vérifie ce que Tether possède, à une seule date. C’est une simple vérification (une attestation), pas un audit complet de tous les comptes. En 2021, deux autorités américaines ont enquêté : la CFTC et la procureure générale de New York. Elles ont constaté que, par le passé, Tether n’avait pas toujours eu de quoi couvrir chaque USDT. Tether a payé des amendes pour régler les deux affaires.',
          ar: 'كل ثلاثة أشهر، يراجع مكتب محاسبة احتياطي Tether في تاريخ واحد: هذه شهادة (attestation)، وليست تدقيقًا كاملًا. في 2021، وجدت جهتان أمريكيتان، هما CFTC والمدعية العامة لولاية New York، أن USDT لم تكن مغطاة بالكامل دائمًا في الماضي، ودفعت Tether غرامات لإغلاق القضيتين.',
        },
      },
      {
        h: { en: 'Stable is not the same as safe', fr: 'Stable ne veut pas dire sûr', ar: 'مستقرة لا تعني مضمونة' },
        p: {
          en: 'Other stablecoins have broken. In May 2022, TerraUSD (UST) was supposed to stay at $1 and fell below 10 cents in about a week. USDT itself has dropped below $1 for short periods: to about $0.87–0.95 in October 2018 and about $0.92–0.95 in May 2022, depending on the platform.',
          fr: 'D’autres stablecoins ont cassé. En mai 2022, TerraUSD (UST) devait rester à 1 $ et est tombé sous les 10 centimes en une semaine environ. L’USDT lui-même est déjà passé sous 1 $ pendant de courtes périodes : vers 0,87–0,95 $ en octobre 2018 et 0,92–0,95 $ en mai 2022, selon les plateformes.',
          ar: 'عملات مستقرة أخرى انهارت. في مايو 2022، كان من المفروض أن تبقى TerraUSD (UST) عند 1 دولار، فسقطت تحت 10 سنتات في حوالي أسبوع. وUSDT نفسها نزلت تحت 1 دولار لفترات قصيرة: إلى حوالي 0.87–0.95 دولار في أكتوبر 2018، وحوالي 0.92–0.95 دولار في مايو 2022، حسب المنصة.',
        },
      },
      {
        h: { en: 'It does not grow', fr: 'Il ne grossit pas', ar: 'لا تكبر' },
        p: {
          en: 'USDT is made to stay at $1. If someone promises you “20% a month on your USDT”, that extra money has to come from somewhere. It is a common sign of a scam (see the lesson «How scammers find you»).',
          fr: 'L’USDT est fait pour rester à 1 $. Si quelqu’un vous promet « 20 % par mois sur vos USDT », cet argent en plus doit bien venir de quelque part. C’est un signe classique d’arnaque (voir la leçon « Comment les arnaqueurs vous trouvent »).',
          ar: 'USDT مصممة لتبقى ثابتة. إذا وعدك أحد بـ«20% في الشهر على USDT الخاصة بك»، فهذا المال الإضافي يجب أن يأتي من مكان ما. هذه علامة كلاسيكية على الاحتيال (انظر درس «كيف يصل إليك المحتالون»).',
        },
      },
      {
        h: { en: 'Buying it with local money', fr: 'L’acheter en monnaie locale', ar: 'من جهة العملة المحلية' },
        p: {
          en: 'When you buy USDT from a person with dinars, dirhams or pounds, they can ask a rate far above the official exchange rate. So you can lose money on the exchange itself, even while USDT stays at $1.',
          fr: 'Vous achetez de l’USDT à une personne, avec des dinars, des dirhams ou des livres ? Le taux demandé peut être bien au-dessus du taux de change officiel. Vous pouvez donc perdre de l’argent sur le change lui-même, même si l’USDT reste à 1 $.',
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
          { en: '1 euro', fr: '1 euro', ar: '1 يورو' },
          { en: 'About 1 US dollar', fr: 'Environ 1 dollar américain', ar: 'حوالي 1 دولار أمريكي' },
        ],
        answer: 2,
        why: {
          en: 'USDT is a stablecoin: it follows the US dollar.',
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
          en: 'USDT is made not to grow. Big, fixed gains are how scams pull people in.',
          fr: 'L’USDT est fait pour ne pas grossir. Les gros gains fixes, c’est comme ça que les arnaques attirent les gens.',
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
          en: 'TerraUSD collapsed in 2022. A stablecoin stays stable only while the promise behind it holds.',
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
          en: 'At any moment there are two prices. The best buy price (the bid) is the most anyone will pay. The best sell price (the ask) is the least anyone will accept. The ask is always a little above the bid. The gap between them is the spread. Buying straight away costs a little more than the middle price, and selling straight away gets a little less: each trade pays part of the spread.',
          fr: 'À chaque instant, il y a deux prix. Le meilleur prix d’achat (le bid) est le plus que quelqu’un veut bien payer. Le meilleur prix de vente (l’ask) est le moins que quelqu’un veut bien accepter. L’ask est toujours un peu au-dessus du bid. L’écart entre les deux s’appelle le spread. Acheter tout de suite coûte un peu plus que le prix du milieu, et vendre tout de suite rapporte un peu moins : chaque opération en paie une partie.',
          ar: 'في كل لحظة يوجد أفضل سعر شراء (bid): أعلى مبلغ يدفعه أحد، وأفضل سعر بيع (ask): أقل مبلغ يقبله أحد. سعر البيع دائماً أعلى قليلاً من سعر الشراء. الفرق بينهما اسمه الفارق (spread). الشراء الفوري يكلّف أكثر قليلاً من السعر الأوسط، والبيع الفوري يعطيك أقل قليلاً: كل عملية تدفع جزءاً من الفارق.',
        },
      },
      {
        h: { en: 'The spread in the practice wallet', fr: 'L’écart dans le portefeuille d’entraînement', ar: 'الفارق في محفظة التدريب' },
        p: {
          en: 'Qirat’s practice wallet copies this: a buy goes through 0.05% above the market price, and a sell 0.05% below it. On a $100 practice buy, that is about 5 cents. Small, but it is there on every trade, on top of the 0.1% fee.',
          fr: 'Le portefeuille d’entraînement de Qirat copie cela : un achat se fait 0,05 % au-dessus du prix du marché, et une vente 0,05 % en dessous. Sur un achat fictif de 100 $, cela fait environ 5 centimes. C’est peu, mais c’est là à chaque opération, en plus des frais de 0,1 %.',
          ar: 'محفظة التدريب في قيراط تحاكي ذلك: الشراء يتمّ بسعر أعلى من سعر السوق بـ 0.05%، والبيع بسعر أقل منه بـ 0.05%. في شراء تجريبي بـ 100 دولار، هذا حوالي 5 سنتات. مبلغ صغير، لكنه موجود في كل عملية، فوق رسوم 0.1%.',
        },
      },
      {
        h: { en: 'A low price is not “cheap”', fr: 'Un prix bas n’est pas « bon marché »', ar: 'السعر المنخفض لا يعني أنها رخيصة' },
        p: {
          en: 'A coin at $0.001 can look cheaper than a coin at $50. It is not. What counts is the market cap: the price times the number of coins in circulation. A $0.001 coin with 500 billion coins is worth $500 million in total, more than a $50 coin with 2 million coins ($100 million). A low price only means there are many coins.',
          fr: 'Une crypto à 0,001 $ peut sembler moins chère qu’une crypto à 50 $. Ce n’est pas le cas. Ce qui compte, c’est la capitalisation (market cap) : le prix multiplié par le nombre de pièces en circulation. Une crypto à 0,001 $ avec 500 milliards de pièces vaut 500 millions de dollars au total. C’est plus qu’une crypto à 50 $ avec 2 millions de pièces (100 millions de dollars). Un prix bas veut seulement dire qu’il y a beaucoup de pièces.',
          ar: 'عملة سعرها 0.001 دولار قد تبدو أرخص من عملة سعرها 50 دولاراً. هذا غير صحيح. المهم هو القيمة السوقية (market cap): السعر مضروباً في عدد العملات المتداولة. عملة بسعر 0.001 دولار وعددها 500 مليار قيمتها 500 مليون دولار، أي أكثر من عملة بسعر 50 دولاراً وعددها 2 مليون (100 مليون دولار). السعر المنخفض يعني فقط أن عدد العملات كبير.',
        },
      },
    ],
    takeaway: {
      en: 'The price is the last deal between a buyer and a seller. Every trade pays the gap between the buy and sell price. And a low price per coin does not make a coin cheap.',
      fr: 'Le prix, c’est la dernière affaire entre un acheteur et un vendeur. Chaque opération paie l’écart entre prix d’achat et prix de vente. Et un prix bas par pièce ne rend pas une crypto bon marché.',
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
          fr: 'Le prix d’une pièce dépend du nombre de pièces. On compare les cryptos par leur capitalisation : prix × pièces en circulation.',
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
          fr: 'Comparées à l’or ou aux actions des grandes entreprises, la plupart des cryptos sont de petits marchés avec peu de liquidité : peu d’acheteurs et de vendeurs attendent à chaque prix. Alors quand beaucoup de gens achètent ou vendent en même temps, le prix bondit ou chute vite. Une info, une rumeur, une personne qui en a beaucoup et qui vend, ou un seul post peuvent le faire bouger.',
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
          en: 'Volatility means how much a price usually moves. Qirat shows it as “a typical day”: ±2% means most days the price moves less than 2% up or down, and some days more. Then Qirat sorts the 18 big coins it follows by how much they moved in the last 30 days. The calmest third is “low risk for crypto”, the middle third “medium”, the wildest third “high”.',
          fr: 'La volatilité, c’est combien un prix bouge d’habitude. Qirat l’affiche comme « une journée normale » : ±2 % veut dire que la plupart des jours, le prix bouge de moins de 2 %, à la hausse ou à la baisse, et certains jours plus. Ensuite, Qirat classe les 18 grandes cryptos qu’il suit selon leurs mouvements des 30 derniers jours. Le tiers le plus calme est « risque faible pour une crypto », le tiers du milieu « moyen », le tiers le plus agité « élevé ».',
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
          en: 'Say a coin’s rough month is −30% and you put 100 in it, in any currency. In a bad month like that, you could be left with about 70. For a high-risk coin the rough month can be −50% or worse: 100 becomes 50. Remember two things. It is not the worst that can happen: crypto can fall even more. And it comes from the past, so it is not a forecast. It is there to help you imagine the drop before you put money in.',
          fr: 'Disons que le mauvais mois d’une crypto est à −30 % et que vous y mettez 100, dans n’importe quelle monnaie. Dans un mauvais mois comme ça, il pourrait vous rester environ 70. Pour une crypto à risque élevé, le mauvais mois peut être à −50 % ou pire : 100 deviennent 50. Retenez deux choses. Ce n’est pas le pire possible : une crypto peut tomber encore plus bas. Et ça vient du passé, donc ce n’est pas une prévision. Ça sert à imaginer la baisse avant de mettre de l’argent.',
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
          fr: 'La journée normale, c’est la taille habituelle du mouvement, dans un sens ou dans l’autre. Ce n’est pas un gain.',
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
      fr: 'Une crypto peut perdre la moitié de sa valeur. Faites le calcul avant d’y mettre de l’argent réel.',
      ar: 'العملات الرقمية قد تفقد نصف قيمتها. احسب قبل أن تضع أي مال حقيقي.',
    },
    terms: ['emergency-fund', 'drawdown', 'rough-month'],
    live: { kind: 'risk' },
    sections: [
      {
        h: { en: 'What comes first', fr: 'Ce qui passe avant', ar: 'ما يأتي أولاً' },
        p: {
          en: 'Rent, food, bills and money for emergencies come before any crypto. An emergency fund is money set aside for a sudden cost, like a repair or a doctor. Many guides say to keep a few months of spending. Only what is left after all of that can be called money you can lose.',
          fr: 'Le loyer, la nourriture, les factures et l’argent des urgences passent avant toute crypto. Une épargne de secours, c’est de l’argent mis de côté pour une dépense soudaine, comme une réparation ou un médecin. Beaucoup de guides conseillent de garder quelques mois de dépenses. Seul ce qui reste après tout cela peut s’appeler de l’argent que vous pouvez perdre.',
          ar: 'الإيجار والأكل والفواتير ومال الطوارئ تأتي قبل أي عملة رقمية. صندوق الطوارئ هو مال تضعه جانباً لمصروف مفاجئ، مثل إصلاح أو طبيب، وكثير من الأدلّة تنصح بما يكفي لبضعة أشهر من المصاريف. فقط ما يبقى بعد كل هذا يمكن أن تسمّيه مالاً تستطيع خسارته.',
        },
      },
      {
        h: { en: 'Crypto can fall by half', fr: 'Une crypto peut perdre la moitié', ar: 'العملة قد تفقد نصف قيمتها' },
        p: {
          en: 'Even Bitcoin has lost more than half its value several times in its history. Qirat shows each coin’s rough month: what one bad month could cost you. That is the kind of month that comes about once in 20 months. It is not the worst case: real drops can go deeper.',
          fr: 'Même le Bitcoin a perdu plus de la moitié de sa valeur plusieurs fois dans son histoire. Qirat montre le mauvais mois de chaque crypto : ce qu’un mauvais mois pourrait vous coûter. C’est le genre de mois qui arrive environ une fois tous les 20 mois. Ce n’est pas le pire cas : les vraies chutes peuvent aller plus bas.',
          ar: 'حتى Bitcoin فقد أكثر من نصف قيمته عدّة مرات في تاريخه. قيراط يعرض «الشهر الصعب» لكل عملة: كم قد يكلّفك شهر سيّئ، من النوع الذي يأتي تقريباً مرة كل 20 شهراً. وهذا ليس أسوأ احتمال: الهبوط الحقيقي قد يكون أعمق.',
        },
      },
      {
        h: { en: 'A loss is harder to win back', fr: 'Une perte est plus dure à rattraper', ar: 'الخسارة أصعب في التعويض' },
        p: {
          en: 'If $100 falls 50%, you have $50 left. To get back to $100, those $50 must double: that is +100%. A 20% drop, from $100 to $80, needs +25% to come back. The bigger the fall, the harder the way back up.',
          fr: 'Si 100 $ perdent 50 %, il vous reste 50 $. Pour revenir à 100 $, ces 50 $ doivent doubler : c’est +100 %. Une baisse de 20 %, de 100 $ à 80 $, demande +25 % pour revenir. Plus la chute est grande, plus la remontée est dure.',
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
          en: 'In November 2022 the exchange FTX collapsed. Its customers could not get their money for years. Most were paid back only at the dollar value of November 2022. That was far below what the same coins were worth later. With your own wallet, the risk is you: lose the words and the phone, and nobody can get it back for you.',
          fr: 'En novembre 2022, la plateforme FTX s’est effondrée. Ses clients n’ont pas pu récupérer leur argent pendant des années. La plupart n’ont été remboursés qu’à la valeur en dollars de novembre 2022. C’était bien en dessous de ce que valaient ces mêmes cryptos plus tard. Avec votre propre wallet, le risque, c’est vous : perdez les mots et le téléphone, et personne ne peut le récupérer pour vous.',
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
          en: 'Photos, screenshots and messages can be hacked or copied to the cloud. Paper kept offline can’t be reached from the internet.',
          fr: 'Photos, captures et messages peuvent être piratés ou copiés dans le cloud. Personne ne peut atteindre un papier hors ligne depuis internet.',
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
    sections: [
      {
        h: { en: 'The VIP group', fr: 'Le groupe VIP', ar: 'مجموعة الـ VIP' },
        p: {
          en: 'You get a message, or you find yourself added to a WhatsApp or Telegram group full of “members” posting screenshots of profits. Many are fake or paid accounts. The “coach” sells VIP signals (tips on what to buy or sell). Or he asks you to send money so he can “manage” it for you.',
          fr: 'Vous recevez un message, ou vous vous retrouvez ajouté à un groupe WhatsApp ou Telegram plein de « membres » qui postent des captures de gains. Beaucoup sont des comptes faux ou payés. Le « coach » vend des signaux VIP (des conseils sur quoi acheter ou vendre). Ou il vous demande d’envoyer de l’argent pour le « gérer » à votre place.',
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
          en: 'A nice-looking website or app shows your balance growing. When you try to take your money out, they first ask for a “tax” or an “unlock fee”. Then another one. The money was never there. Some fake login pages also copy a real platform to steal your password. Before anything, search the name with the word “scam”. Also look for warnings from the official body that controls finance in your country.',
          fr: 'Un beau site ou une belle appli montre votre solde qui monte. Quand vous voulez retirer votre argent, on vous demande d’abord une « taxe » ou des « frais de déblocage ». Puis d’autres. L’argent n’a jamais existé. Certaines fausses pages de connexion copient aussi une vraie plateforme pour voler votre mot de passe. Avant tout, cherchez le nom avec le mot « arnaque ». Regardez aussi les avertissements de l’autorité qui contrôle la finance dans votre pays.',
          ar: 'موقع أو تطبيق أنيق يُريك رصيدك يكبر. عندما تحاول السحب، يطلبون منك أولًا «ضريبة» أو «رسوم فتح الحساب». ثم رسومًا أخرى. المال لم يكن موجودًا أصلًا. وبعض صفحات الدخول المزيفة تقلّد منصة حقيقية لتسرق كلمة المرور. قبل أي شيء، ابحث عن الاسم مع كلمة «احتيال»، وابحث عن تحذيرات الجهة الرقابية المالية في بلدك.',
        },
      },
      {
        h: { en: 'Cash meetups', fr: 'Les rendez-vous avec du cash', ar: 'لقاءات النقد' },
        p: {
          en: '“Cheap USDT, meet me in person and bring cash.” There have been reports of such meetups turning into robberies. A price far below the market is the bait.',
          fr: '« USDT pas cher, on se voit en vrai, apporte du cash. » Plusieurs personnes racontent que ce genre de rendez-vous a fini en vol. Un prix très en dessous du marché, c’est l’appât.',
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
          en: 'Screenshots are easy to fake, and a “small test” deposit is how many people get trapped.',
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
          en: 'Fake platforms invent fees to take more of your money. The “profits” on screen were never real.',
          fr: 'Les fausses plateformes inventent des frais pour vous prendre encore plus d’argent. Les « gains » affichés n’ont jamais existé.',
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
          en: 'Nobody can guarantee a crypto gain. The other two are honest warnings.',
          fr: 'Personne ne peut garantir un gain en crypto. Les deux autres sont des avertissements honnêtes.',
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
          en: 'P2P (peer to peer, or person to person) means buying or selling crypto directly with another person. It often goes through a platform that holds the crypto until both sides confirm the payment: this is called escrow. The other person is a stranger, and that is where the risks start.',
          fr: 'Le P2P (de pair à pair, c’est-à-dire de personne à personne), c’est acheter ou vendre de la crypto directement avec une autre personne. Souvent, cela passe par une plateforme qui bloque la crypto jusqu’à ce que les deux côtés confirment le paiement : c’est le séquestre (escrow). L’autre personne est un inconnu, et c’est là que les risques commencent.',
          ar: 'الـ P2P (من شخص إلى شخص) يعني أن تشتري أو تبيع عملة رقمية مباشرة مع شخص آخر، غالباً عبر منصّة تحجز العملة (escrow) حتى يؤكّد الطرفان الدفع. الطرف الآخر شخص لا تعرفه، ومن هنا تبدأ المخاطر.',
        },
      },
      {
        h: { en: 'Cash meetups', fr: 'Les rendez-vous avec du cash', ar: 'اللقاءات بالنقد' },
        p: {
          en: 'Some offers say: “Cheap USDT, meet me in person and bring cash.” There have been reports of such meetups ending in robbery. A price far below the market is the bait.',
          fr: 'Certaines offres disent : « USDT pas cher, on se voit en personne, apporte du cash. » Plusieurs personnes racontent que ce genre de rendez-vous a fini en vol. Un prix très en dessous du marché, c’est l’appât.',
          ar: 'بعض العروض تقول: «USDT رخيص، نلتقي وجهاً لوجه وأحضر النقود». وقد وردت روايات عن لقاءات كهذه انتهت بسرقة. السعر الأقل بكثير من السوق هو الطُعم.',
        },
      },
      {
        h: { en: 'Payments that come back', fr: 'Les paiements qui reviennent', ar: 'مدفوعات تُسترجع' },
        p: {
          en: 'A bank transfer can be undone, or turn out to come from a stolen account. If your crypto has already left, you lose both. Some scammers send a fake payment screenshot and push you to send the crypto fast.',
          fr: 'Un virement peut être annulé, ou venir d’un compte volé. Si votre crypto est déjà partie, vous perdez les deux. Certains escrocs envoient une fausse capture de paiement et vous pressent d’envoyer la crypto vite.',
          ar: 'التحويل البنكي قد يُلغى، أو يتّضح أنه جاء من حساب مسروق. إذا كانت عملتك قد خرجت، تخسر الاثنين. وبعض المحتالين يرسلون لقطة شاشة مزيّفة للدفع ويستعجلونك لتسليم العملة.',
        },
      },
      {
        h: { en: 'The rate and your bank', fr: 'Le taux et votre banque', ar: 'سعر الصرف وبنكك' },
        p: {
          en: 'The rate a stranger asks can be far from the official exchange rate, so you can lose money on the rate itself. Also, when money from strangers lands on your bank account, your bank can ask you where it came from.',
          fr: 'Le taux demandé par un inconnu peut être très loin du taux de change officiel : vous pouvez perdre de l’argent sur le taux lui-même. Et quand de l’argent d’inconnus arrive sur votre compte, votre banque peut vous demander d’où il vient.',
          ar: 'السعر الذي يطلبه شخص غريب قد يكون بعيداً جداً عن سعر الصرف الرسمي، فتخسر مالاً في سعر الصرف نفسه. كما أن وصول أموال من غرباء إلى حسابك البنكي قد يجعل البنك يسألك عن مصدرها.',
        },
      },
      {
        h: { en: 'Leaving the platform', fr: 'Quitter la plateforme', ar: 'الخروج من المنصّة' },
        p: {
          en: 'A common trick is: “Let’s finish on WhatsApp, it’s faster.” Outside the platform there is no escrow and nobody to complain to. A fake “escrow agent” who asks you to send first is the same trick.',
          fr: 'Un piège courant : « On termine sur WhatsApp, c’est plus rapide. » Hors de la plateforme, il n’y a plus de séquestre et personne à qui se plaindre. Un soi-disant « agent de séquestre » qui vous demande d’envoyer en premier, c’est le même piège.',
          ar: 'حيلة شائعة: «لنُكمل على WhatsApp، أسرع». خارج المنصّة لا يوجد حجز (escrow) ولا جهة تشتكي إليها. و«وسيط الضمان» الذي يطلب منك أن ترسل أولاً هو نفس الحيلة.',
        },
      },
    ],
    takeaway: {
      en: 'In P2P the other side is a stranger. Cash meetups, undone payments, strange rates and leaving the platform: that is where people lose money.',
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
          en: 'Nobody sells far below the market without a reason. A cheap price plus cash in person is how many robberies and scams start.',
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
          en: 'Off the platform, nobody holds the crypto and nobody can decide who is right if you disagree. That is exactly why scammers ask for it.',
          fr: 'Hors de la plateforme, personne ne bloque la crypto et personne ne peut décider qui a raison en cas de désaccord. C’est justement pour ça que les escrocs le demandent.',
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
            en: 'The bank can ask where it came from, and a transfer can be undone',
            fr: 'La banque peut demander d’où il vient, et un virement peut être annulé',
            ar: 'البنك قد يسألك عن مصدره، والتحويل قد يُلغى',
          },
          { en: 'It always carries a hidden fee', fr: 'Il y a toujours des frais cachés', ar: 'فيه دائماً رسوم مخفيّة' },
          { en: 'Banks block every transfer from a person', fr: 'Les banques bloquent tout virement d’un particulier', ar: 'البنوك تمنع كل تحويل من شخص' },
        ],
        answer: 0,
        why: {
          en: 'You don’t know where a stranger’s money comes from. If the transfer is undone or the money is stolen, the problem lands on your account.',
          fr: 'Vous ne savez pas d’où vient l’argent d’un inconnu. S’il est annulé ou volé, le problème tombe sur votre compte.',
          ar: 'أنت لا تعرف مصدر مال شخص غريب. إذا أُلغي التحويل أو كان المال مسروقاً، تقع المشكلة على حسابك.',
        },
      },
    ],
  },

  {
    // Replaced the Tunisia-only lesson (law-tunisia) on 2026-11-20. Facts checked
    // against dated sources that day; only confirmed points are used, and no
    // platform is named so that nothing reads as a recommendation.
    slug: 'crypto-law-arab-world',
    level: 1,
    minutes: 4,
    title: {
      en: 'Crypto and the law in Arab countries',
      fr: 'La crypto et la loi dans les pays arabes',
      ar: 'العملات الرقمية والقانون في الدول العربية',
    },
    hook: {
      en: 'Each country has its own rules, and they change. Facts with dates, checked in November 2026. This is not legal advice.',
      fr: 'Chaque pays a ses propres règles, et elles changent. Des faits datés, vérifiés en novembre 2026. Ce n’est pas un conseil juridique.',
      ar: 'لكل بلد قواعده، وهي تتغيّر. وقائع بتواريخها، تمّ التحقق منها في نوفمبر 2026. هذا ليس استشارة قانونية.',
    },
    terms: ['legal-tender', 'regulator'],
    sections: [
      {
        h: { en: 'Where you live decides', fr: 'C’est votre pays qui décide', ar: 'بلدك هو الذي يحدّد' },
        p: {
          en: 'The same Bitcoin purchase can be a crime in one Arab country and legal in another. What counts is the law of the country where you live, not where the app comes from. Arab countries fall into three groups: banned, allowed through licensed firms, and unclear.',
          fr: 'Le même achat de Bitcoin peut être un délit dans un pays arabe et légal dans un autre. Ce qui compte, c’est la loi du pays où vous vivez, pas l’origine de l’application. Les pays arabes se rangent en trois groupes : interdit, autorisé via des sociétés agréées, et flou.',
          ar: 'شراء Bitcoin نفسه قد يكون جريمة في بلد عربي وقانونيًا في بلد آخر. المهم هو قانون البلد الذي تعيش فيه، لا البلد الذي جاء منه التطبيق. وتنقسم الدول العربية إلى ثلاث مجموعات: منع، أو سماح عبر شركات مرخّصة، أو وضع غير واضح.',
        },
      },
      {
        h: { en: 'Banned: Algeria and Egypt', fr: 'Interdit : Algérie et Égypte', ar: 'ممنوعة: الجزائر ومصر' },
        p: {
          en: 'Algeria: a law of July 2025 bans buying, selling, holding and promoting crypto. The penalty is 2 months to 1 year in prison, a fine, or both. Egypt: the 2020 central bank law (Law 194, Article 206) bans trading and promoting crypto without a licence from the central bank, and it has given none.',
          fr: 'Algérie : une loi de juillet 2025 interdit d’acheter, de vendre, de garder et de promouvoir la crypto. La peine va de 2 mois à 1 an de prison, une amende, ou les deux. Égypte : la loi de 2020 sur la banque centrale (loi 194, article 206) interdit de trader et de promouvoir la crypto sans licence de la banque centrale, qui n’en a donné aucune.',
          ar: 'الجزائر: قانون صدر في يوليو 2025 يمنع شراء العملات الرقمية وبيعها وحيازتها والترويج لها. العقوبة سجن من شهرين إلى سنة، أو غرامة، أو الاثنان معًا. مصر: قانون البنك المركزي لسنة 2020 (القانون 194، المادة 206) يمنع تداول العملات الرقمية والترويج لها دون ترخيص من البنك المركزي، ولم يمنح البنك أي ترخيص.',
        },
      },
      {
        h: { en: 'Also closed', fr: 'Fermé aussi', ar: 'مغلقة أيضًا' },
        p: {
          en: 'Kuwait banned crypto as a way to pay or invest in July 2023, and gives no licences. In 2025 it cut the power to homes caught mining (using computers to make new coins). Qatar does not allow crypto services. In Libya, the central bank banned crypto deals in 2018, and in 2025 nine people got 3 years in prison for mining in a factory.',
          fr: 'Le Koweït a interdit la crypto comme moyen de payer ou d’investir en juillet 2023, et ne donne aucune licence. En 2025, il a coupé l’électricité de maisons qui minaient (faisaient tourner des ordinateurs pour créer de nouvelles cryptos). Le Qatar n’autorise pas les services crypto. En Libye, la banque centrale a interdit les opérations en crypto en 2018, et en 2025 neuf personnes ont pris 3 ans de prison pour avoir miné dans une usine.',
          ar: 'منعت الكويت في يوليو 2023 استعمال العملات الرقمية للدفع أو الاستثمار، ولا تمنح أي ترخيص. وفي 2025 قطعت الكهرباء عن منازل كانت تقوم بالتعدين (تشغيل حواسيب لإنتاج عملات جديدة). قطر لا تسمح بخدمات العملات الرقمية. وفي ليبيا منع البنك المركزي معاملات العملات الرقمية في 2018، وفي 2025 حُكم على تسعة أشخاص بالسجن 3 سنوات بسبب التعدين في مصنع.',
        },
      },
      {
        h: { en: 'Allowed through licensed firms', fr: 'Autorisé via des sociétés agréées', ar: 'مسموحة عبر شركات مرخّصة' },
        p: {
          en: 'In the UAE, a crypto firm needs a licence: from VARA in Dubai, from the FSRA in Abu Dhabi’s ADGM, or from the federal markets authority. Firms without one may not advertise there. Bahrain’s central bank has licensed crypto firms since 2019. Jordan ended its ban with a law in force since September 2025, but we found no licensed firm there yet in November 2026.',
          fr: 'Aux Émirats, une société crypto doit avoir une licence : de la VARA à Dubaï, de la FSRA dans l’ADGM d’Abou Dhabi, ou de l’autorité fédérale des marchés. Sans licence, elle ne peut pas y faire de publicité. La banque centrale de Bahreïn agrée des sociétés crypto depuis 2019. La Jordanie a mis fin à son interdiction avec une loi en vigueur depuis septembre 2025, mais nous n’y avons trouvé aucune société agréée en novembre 2026.',
          ar: 'في الإمارات، تحتاج شركة العملات الرقمية إلى ترخيص: من VARA في دبي، أو من FSRA في سوق أبوظبي العالمي (ADGM)، أو من الهيئة الاتحادية للأسواق. والشركة غير المرخّصة لا يحق لها الإعلان هناك. والبنك المركزي في البحرين يرخّص لشركات العملات الرقمية منذ 2019. أما الأردن فأنهى المنع بقانون نافذ منذ سبتمبر 2025، لكننا لم نجد فيه أي شركة مرخّصة حتى نوفمبر 2026.',
        },
      },
      {
        h: { en: 'Morocco and Tunisia: drafts, not laws', fr: 'Maroc et Tunisie : des projets, pas des lois', ar: 'المغرب وتونس: مشاريع وليست قوانين' },
        p: {
          en: 'Morocco’s authorities have said since 2017 that crypto deals are not allowed. A draft crypto law (no. 42-25) is planned for 2027 but not passed. Since May 2026, the exchange office has opened cases against residents who held crypto abroad. In Tunisia, the 1976 exchange law still applies. A new exchange code that would cover crypto was still in a parliament committee in mid-November 2026.',
          fr: 'Au Maroc, les autorités disent depuis 2017 que les opérations en crypto ne sont pas autorisées. Un projet de loi crypto (n° 42-25) est prévu pour 2027 mais n’est pas voté. Depuis mai 2026, l’Office des changes a ouvert des dossiers contre des résidents qui avaient de la crypto à l’étranger. En Tunisie, la loi des changes de 1976 s’applique toujours. Un nouveau code des changes qui couvrirait la crypto était encore en commission au Parlement mi-novembre 2026.',
          ar: 'في المغرب، تقول السلطات منذ 2017 إن معاملات العملات الرقمية غير مسموح بها. وهناك مشروع قانون للعملات الرقمية (رقم 42-25) مبرمج لسنة 2027 لكنه لم يُعتمد بعد. ومنذ مايو 2026 فتح مكتب الصرف ملفات ضد مقيمين امتلكوا عملات رقمية في الخارج. وفي تونس، ما زال قانون الصرف لسنة 1976 مطبّقًا، ومشروع قانون صرف جديد يشمل العملات الرقمية كان ما زال في لجنة بالبرلمان في منتصف نوفمبر 2026.',
        },
      },
      {
        h: { en: 'No clear law', fr: 'Pas de loi claire', ar: 'لا يوجد قانون واضح' },
        p: {
          en: 'Saudi Arabia has no crypto law and no licensed local platform for the public, and its authorities warn that crypto is not authorised. Iraq’s central bank bans using bank cards and e-wallets for crypto (2022). In Lebanon, payment firms may not deal in crypto without the central bank’s approval (2026). No law does not mean allowed.',
          fr: 'L’Arabie saoudite n’a ni loi crypto ni plateforme locale agréée pour le public, et ses autorités avertissent que la crypto n’est pas autorisée. En Irak, la banque centrale interdit d’utiliser les cartes bancaires et les portefeuilles électroniques pour la crypto (2022). Au Liban, les sociétés de paiement ne peuvent pas toucher à la crypto sans l’accord de la banque centrale (2026). Pas de loi ne veut pas dire autorisé.',
          ar: 'في السعودية لا يوجد قانون للعملات الرقمية ولا منصة محلية مرخّصة للعموم، وتحذّر السلطات من أنها غير مرخّصة. وفي العراق يمنع البنك المركزي استعمال البطاقات البنكية والمحافظ الإلكترونية للعملات الرقمية (2022). وفي لبنان لا يحق لشركات الدفع التعامل بالعملات الرقمية دون موافقة البنك المركزي (2026). غياب القانون لا يعني أنها مسموحة.',
        },
      },
      {
        h: { en: 'What this means for you', fr: 'Ce que cela veut dire pour vous', ar: 'ماذا يعني هذا بالنسبة لك' },
        p: {
          en: 'A licence covers only the country that gave it: an app licensed in Dubai is not licensed in Tunisia or Egypt. Without a local licence, nobody protects you if the platform fails or cheats you. Promoting crypto can be a crime too. Check your own central bank or regulator’s website, look at the date, and ask a lawyer about your case.',
          fr: 'Une licence ne vaut que dans le pays qui l’a donnée : une application agréée à Dubaï ne l’est pas en Tunisie ou en Égypte. Sans licence locale, personne ne vous protège si la plateforme fait faillite ou vous trompe. Promouvoir la crypto peut aussi être un délit. Vérifiez le site de la banque centrale ou du régulateur de votre pays, regardez la date, et demandez à un avocat pour votre cas.',
          ar: 'الترخيص صالح فقط في البلد الذي منحه: تطبيق مرخّص في دبي ليس مرخّصًا في تونس أو مصر. ومن دون ترخيص محلي، لا أحد يحميك إذا أفلست المنصة أو خدعتك. والترويج للعملات الرقمية قد يكون جريمة أيضًا. تحقّق من موقع البنك المركزي أو الهيئة الرقابية في بلدك، وانظر إلى التاريخ، واسأل محاميًا عن حالتك.',
        },
      },
    ],
    takeaway: {
      en: 'In November 2026: Algeria and Egypt ban crypto, the UAE and Bahrain license firms, and Morocco and Tunisia have no crypto law yet. Your own country’s law counts, and a licence elsewhere does not cover you.',
      fr: 'En novembre 2026 : l’Algérie et l’Égypte interdisent la crypto, les Émirats et Bahreïn agréent des sociétés, et le Maroc et la Tunisie n’ont pas encore de loi crypto. C’est la loi de votre pays qui compte, et une licence ailleurs ne vous couvre pas.',
      ar: 'في نوفمبر 2026: الجزائر ومصر تمنعان العملات الرقمية، والإمارات والبحرين ترخّصان للشركات، والمغرب وتونس ليس لديهما قانون للعملات الرقمية بعد. قانون بلدك هو المهم، والترخيص في بلد آخر لا يحميك.',
    },
    quiz: [
      {
        q: {
          en: 'What decides if crypto is legal for you?',
          fr: 'Qu’est-ce qui décide si la crypto est légale pour vous ?',
          ar: 'ما الذي يحدّد إن كانت العملات الرقمية قانونية بالنسبة لك؟',
        },
        options: [
          { en: 'The country the app comes from', fr: 'Le pays d’où vient l’application', ar: 'البلد الذي جاء منه التطبيق' },
          { en: 'The law of the country where you live', fr: 'La loi du pays où vous vivez', ar: 'قانون البلد الذي تعيش فيه' },
          { en: 'How many people use it', fr: 'Le nombre de personnes qui l’utilisent', ar: 'عدد الأشخاص الذين يستعملونها' },
        ],
        answer: 1,
        why: {
          en: 'The same purchase can be a crime in Algeria and legal through a licensed firm in the UAE. Your own country’s law is what counts.',
          fr: 'Le même achat peut être un délit en Algérie et légal via une société agréée aux Émirats. C’est la loi de votre pays qui compte.',
          ar: 'الشراء نفسه قد يكون جريمة في الجزائر وقانونيًا عبر شركة مرخّصة في الإمارات. قانون بلدك هو المهم.',
        },
      },
      {
        q: {
          en: 'Where does a 2025 law ban holding and promoting crypto, with prison terms?',
          fr: 'Où une loi de 2025 interdit-elle de garder et de promouvoir la crypto, avec de la prison ?',
          ar: 'أين يمنع قانون صدر في 2025 حيازة العملات الرقمية والترويج لها، مع عقوبة السجن؟',
        },
        options: [
          { en: 'Bahrain', fr: 'Bahreïn', ar: 'البحرين' },
          { en: 'Algeria', fr: 'Algérie', ar: 'الجزائر' },
          { en: 'The UAE', fr: 'Les Émirats', ar: 'الإمارات' },
        ],
        answer: 1,
        why: {
          en: 'Algeria’s July 2025 law bans buying, selling, holding and promoting crypto. Bahrain and the UAE license crypto firms.',
          fr: 'La loi algérienne de juillet 2025 interdit d’acheter, de vendre, de garder et de promouvoir la crypto. Bahreïn et les Émirats agréent des sociétés crypto.',
          ar: 'قانون الجزائر الصادر في يوليو 2025 يمنع شراء العملات الرقمية وبيعها وحيازتها والترويج لها. أما البحرين والإمارات فترخّصان لشركات العملات الرقمية.',
        },
      },
      {
        q: {
          en: 'An app has a licence in Dubai. Is it licensed in your country too?',
          fr: 'Une application a une licence à Dubaï. Est-elle agréée dans votre pays aussi ?',
          ar: 'تطبيق لديه ترخيص في دبي. هل هو مرخّص في بلدك أيضًا؟',
        },
        options: [
          { en: 'Yes, in every Arab country', fr: 'Oui, dans tous les pays arabes', ar: 'نعم، في كل الدول العربية' },
          { en: 'Only if it is in Arabic', fr: 'Seulement si elle est en arabe', ar: 'فقط إذا كان باللغة العربية' },
          { en: 'No. A licence covers only the country that gave it', fr: 'Non. Une licence ne vaut que dans le pays qui l’a donnée', ar: 'لا. الترخيص صالح فقط في البلد الذي منحه' },
        ],
        answer: 2,
        why: {
          en: 'Each country gives its own licences. Check your own regulator’s list before you trust a platform.',
          fr: 'Chaque pays donne ses propres licences. Vérifiez la liste de votre régulateur avant de faire confiance à une plateforme.',
          ar: 'كل بلد يمنح تراخيصه بنفسه. تحقّق من قائمة الهيئة الرقابية في بلدك قبل أن تثق بأي منصة.',
        },
      },
    ],
  },
]
