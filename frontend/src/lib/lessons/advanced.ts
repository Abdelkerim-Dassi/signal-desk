// Level 3 · Advanced: protect your money, follow a plan. Lessons in course order; see ../lessons.ts for the rules.

import type { Lesson } from '../lessons.ts'

export const ADVANCED: Lesson[] = [
  {
    slug: 'position-size',
    level: 3,
    minutes: 3,
    title: {
      en: 'Position size: never all-in',
      fr: 'La taille de position : jamais tout sur un seul coup',
      ar: 'حجم الصفقة: لا تضع كل شيء في صفقة واحدة',
    },
    hook: {
      en: 'Before asking which coin, ask how much. That number decides how hard a mistake can hit you.',
      fr: 'Avant de vous demander quelle crypto, demandez-vous combien. Ce chiffre décide à quel point une erreur peut vous toucher.',
      ar: 'قبل أن تسأل «أي عملة؟» اسأل «كم؟». هذا الرقم هو الذي يحدد حجم الضرر إذا أخطأت.',
    },
    terms: ['position-size', 'concentration'],
    live: {
      kind: 'view',
      view: 'practice',
      label: {
        en: 'See how your practice wallet is split',
        fr: 'Voir comment votre portefeuille d’entraînement est réparti',
        ar: 'شاهد كيف تتوزع محفظة التدريب',
      },
    },
    sections: [
      {
        h: {
          en: 'One trade is only a part',
          fr: 'Une opération, ce n’est qu’une partie',
          ar: 'الصفقة جزء من المحفظة فقط',
        },
        p: {
          en: 'A position is what you hold in one coin. Its size is how much of your wallet it takes: $50 out of a $500 practice wallet is 10%. Going all-in means putting the whole wallet on one trade. Then a single bad move hits all of your money at once.',
          fr: 'Une position, c’est ce que vous détenez sur une crypto. Sa taille, c’est la part de votre portefeuille qu’elle prend : 50 $ sur un portefeuille d’entraînement de 500 $, c’est 10 %. Faire « all-in », c’est mettre tout le portefeuille sur une seule opération. Alors un seul mauvais mouvement touche tout votre argent d’un coup.',
          ar: 'الصفقة (position) هي ما تملكه من عملة واحدة، وحجم الصفقة (position size) هو الجزء الذي تأخذه من محفظتك: 50 دولارًا من محفظة تدريب فيها 500 دولار تساوي 10%. أما «all-in» فمعناه أن تضع المحفظة كلها في صفقة واحدة. عندها تكفي حركة سيئة واحدة لتصيب كل أموالك دفعة واحدة.',
        },
      },
      {
        h: { en: 'Losses in a row', fr: 'Des pertes à la suite', ar: 'خسائر متتالية' },
        p: {
          en: 'Even careful traders lose several trades in a row. Say each loss takes 10% of what is left: after 5 losses, $1,000 becomes about $590. If each loss takes 1%, the same 5 losses leave about $951. Small positions let you get through a bad run and keep learning.',
          fr: 'Même un trader prudent perd plusieurs opérations de suite. Si chaque perte prend 10 % de ce qui reste, après 5 pertes, 1 000 $ deviennent environ 590 $. Si chaque perte prend 1 %, les mêmes 5 pertes laissent environ 951 $. Des petites positions permettent de traverser une mauvaise série et de continuer à apprendre.',
          ar: 'حتى المتداول الحذر يخسر عدة صفقات متتالية. لنفترض أن كل خسارة تأخذ 10% مما تبقى: بعد 5 خسائر تصبح 1000 دولار حوالي 590 دولارًا. وإذا كانت كل خسارة 1% فقط، يبقى بعد الخسائر الخمس حوالي 951 دولارًا. الصفقات الصغيرة تسمح لك بتجاوز الفترات السيئة ومواصلة التعلم.',
        },
      },
      {
        h: { en: 'The 1% idea', fr: 'L’idée du 1 %', ar: 'قاعدة 1%' },
        p: {
          en: 'Many trading courses use a simple rule of thumb: decide in advance how much one trade may cost you if it goes wrong, often 1% of the wallet. On a $1,000 wallet, that is $10. The point is not profit: it is keeping each loss small and known in advance.',
          fr: 'Beaucoup de cours de trading utilisent une règle simple : décider à l’avance combien une opération peut vous coûter si elle tourne mal, souvent 1 % du portefeuille. Sur 1 000 $, cela fait 10 $. Le but n’est pas le gain : c’est que chaque perte reste petite et connue à l’avance.',
          ar: 'كثير من دروس التداول تستعمل قاعدة بسيطة: حدد مسبقًا كم يمكن أن تكلفك صفقة واحدة إذا ساءت، وغالبًا ما تكون 1% من المحفظة. في محفظة فيها 1000 دولار، هذا يعني 10 دولارات. الهدف ليس الربح، بل أن تبقى كل خسارة صغيرة ومعروفة مسبقًا.',
        },
      },
      {
        h: {
          en: 'From the risk to the size',
          fr: 'De la perte acceptée à la taille',
          ar: 'من الخسارة المقبولة إلى حجم الصفقة',
        },
        p: {
          en: 'Size = the amount you accept to lose ÷ the distance to your exit. If you plan to get out 5% below your entry, $10 ÷ 5% = a $200 position. If the price falls to your exit, you lose about $10, plus fees. A very fast drop can go past your exit, so the real loss can be a bit bigger.',
          fr: 'Taille = la perte que vous acceptez ÷ la distance jusqu’à votre sortie. Si vous prévoyez de sortir 5 % sous votre prix d’entrée, 10 $ ÷ 5 % = une position de 200 $. Si le prix tombe jusqu’à votre sortie, vous perdez environ 10 $, plus les frais. Une chute très rapide peut dépasser votre sortie : la perte réelle peut alors être un peu plus grande.',
          ar: 'الحجم = المبلغ الذي تقبل أن تخسره ÷ المسافة حتى نقطة خروجك. إذا قررت أن تخرج عند سعر أقل من سعر دخولك بـ 5%، فإن 10 دولارات ÷ 5% = صفقة بحجم 200 دولار. وإذا نزل السعر إلى نقطة خروجك تخسر حوالي 10 دولارات، مع الرسوم. لكن الهبوط السريع جدًا قد يتجاوز نقطة خروجك، فتكون الخسارة الحقيقية أكبر قليلًا.',
        },
      },
      {
        h: { en: 'What the coach watches', fr: 'Ce que surveille le coach', ar: 'ماذا يراقب المدرب؟' },
        p: {
          en: 'In Qirat’s practice wallet, the habit coach speaks up when one coin passes half of your wallet: its every move becomes your wallet’s move. It does not say the coin is bad. It shows you how much rides on a single coin.',
          fr: 'Dans le portefeuille d’entraînement de Qirat, le coach des habitudes réagit quand une crypto dépasse la moitié de votre portefeuille : chacun de ses mouvements devient celui de votre portefeuille. Il ne dit pas que cette crypto est mauvaise. Il vous montre combien repose sur une seule crypto.',
          ar: 'في محفظة التدريب في قيراط، ينبهك مدرب العادات عندما تتجاوز عملة واحدة نصف محفظتك: كل حركة لها تصبح حركة لمحفظتك كلها. هو لا يقول إن العملة سيئة، بل يريك كم من أموالك يعتمد على عملة واحدة.',
        },
      },
    ],
    takeaway: {
      en: 'Choose how much before you choose what. Small positions turn a bad run into a lesson instead of a disaster.',
      fr: 'Choisissez combien avant de choisir quoi. Des petites positions font d’une mauvaise série une leçon plutôt qu’une catastrophe.',
      ar: 'اختر «كم» قبل أن تختار «ماذا». الصفقات الصغيرة تجعل سلسلة الخسائر درسًا لا كارثة.',
    },
    quiz: [
      {
        q: {
          en: 'You put your whole $500 practice wallet into one coin. What is that called?',
          fr: 'Vous mettez tout votre portefeuille d’entraînement de 500 $ sur une seule crypto. Comment ça s’appelle ?',
          ar: 'وضعت كل محفظة التدريب، أي 500 دولار، في عملة واحدة. ماذا يسمى هذا؟',
        },
        options: [
          { en: 'Going all-in', fr: 'Faire « all-in »', ar: '«all-in»: كل شيء في صفقة واحدة' },
          { en: 'Diversifying', fr: 'Diversifier', ar: 'التنويع' },
          { en: 'Dollar-cost averaging', fr: 'Investir par paliers (DCA)', ar: 'الشراء الدوري (DCA)' },
        ],
        answer: 0,
        why: {
          en: 'All-in means the whole wallet rides on one trade, so one bad move hits everything.',
          fr: '« All-in » veut dire que tout le portefeuille dépend d’une seule opération : un seul mauvais mouvement touche tout.',
          ar: '«all-in» يعني أن المحفظة كلها معلقة بصفقة واحدة، فحركة سيئة واحدة تصيب كل شيء.',
        },
      },
      {
        q: {
          en: 'Your wallet is $1,000. You accept to lose 1% on a trade, and your exit is 5% below your entry. Which position size fits?',
          fr: 'Votre portefeuille fait 1 000 $. Vous acceptez de perdre 1 % sur une opération, et votre sortie est 5 % sous votre entrée. Quelle taille de position convient ?',
          ar: 'محفظتك فيها 1000 دولار. تقبل أن تخسر 1% في صفقة، ونقطة خروجك أقل من سعر دخولك بـ 5%. ما حجم الصفقة المناسب؟',
        },
        options: [
          { en: '$50', fr: '50 $', ar: '50 دولارًا' },
          { en: '$200', fr: '200 $', ar: '200 دولار' },
          { en: '$500', fr: '500 $', ar: '500 دولار' },
        ],
        answer: 1,
        why: {
          en: '1% of $1,000 is $10, and $10 ÷ 5% = $200. If the price falls to your exit, you lose about $10, plus fees.',
          fr: '1 % de 1 000 $, c’est 10 $, et 10 $ ÷ 5 % = 200 $. Si le prix tombe jusqu’à votre sortie, vous perdez environ 10 $, plus les frais.',
          ar: '1% من 1000 دولار هو 10 دولارات، و10 ÷ 5% = 200 دولار. إذا نزل السعر إلى نقطة خروجك تخسر حوالي 10 دولارات، مع الرسوم.',
        },
      },
      {
        q: {
          en: 'Why do small positions help?',
          fr: 'Pourquoi les petites positions aident-elles ?',
          ar: 'لماذا تفيد الصفقات الصغيرة؟',
        },
        options: [
          { en: 'They make every trade a winner', fr: 'Elles rendent chaque opération gagnante', ar: 'تجعل كل صفقة رابحة' },
          { en: 'They cancel the fees', fr: 'Elles annulent les frais', ar: 'تلغي الرسوم' },
          { en: 'A run of losses hurts much less', fr: 'Une série de pertes fait beaucoup moins mal', ar: 'سلسلة الخسائر تؤلم أقل بكثير' },
        ],
        answer: 2,
        why: {
          en: 'Five losses of 1% leave about $951 of $1,000. Five losses of 10% leave about $590. Small positions don’t make you win; they keep you in the game.',
          fr: 'Cinq pertes de 1 % laissent environ 951 $ sur 1 000 $. Cinq pertes de 10 % en laissent environ 590 $. Les petites positions ne font pas gagner : elles vous gardent dans la partie.',
          ar: 'خمس خسائر بـ 1% تترك حوالي 951 دولارًا من 1000. وخمس خسائر بـ 10% تترك حوالي 590 دولارًا. الصفقات الصغيرة لا تجعلك تربح، لكنها تبقيك في اللعبة.',
        },
      },
    ],
  },

  {
    slug: 'leverage',
    level: 3,
    minutes: 3,
    title: {
      en: 'Leverage and futures: how x10 wipes you out',
      fr: 'Le levier et les futures : comment un x10 vous efface',
      ar: 'الرافعة المالية والعقود الآجلة: كيف تمسح x10 رصيدك',
    },
    hook: {
      en: 'Borrowed money makes every move bigger, the bad ones too. Qirat’s practice wallet has none, on purpose.',
      fr: 'L’argent emprunté grossit chaque mouvement, les mauvais aussi. Le portefeuille d’entraînement de Qirat n’en a pas, exprès.',
      ar: 'المال المقترض يكبّر كل حركة، والسيئة منها أيضًا. لهذا لا توجد رافعة في محفظة التدريب في قيراط، عن قصد.',
    },
    terms: ['leverage', 'margin', 'liquidation', 'futures'],
    sections: [
      {
        h: { en: 'Trading with borrowed money', fr: 'Trader avec de l’argent emprunté', ar: 'التداول بمال مقترض' },
        p: {
          en: 'Leverage means the platform lends you money so you can trade more than you have. At x10, your $100 controls a $1,000 position. Your $100 is the margin: the part that is really yours, and the first to go.',
          fr: 'Le levier, c’est quand la plateforme vous prête de l’argent pour trader plus que ce que vous avez. À x10, vos 100 $ contrôlent une position de 1 000 $. Ces 100 $ sont la marge : la part qui est vraiment à vous, et la première à partir.',
          ar: 'الرافعة المالية (leverage) تعني أن المنصة تقرضك مالًا لتتداول بمبلغ أكبر مما تملك. مع x10، تتحكم 100 دولار منك في صفقة بقيمة 1000 دولار. وهذه المئة دولار هي الهامش (margin): الجزء الذي هو مالك فعلًا، وهو أول ما يضيع.',
        },
      },
      {
        h: { en: 'Gains and losses, both x10', fr: 'Gains et pertes, tous les deux x10', ar: 'الربح والخسارة، كلاهما x10' },
        p: {
          en: 'If the price rises 10%, the $1,000 position gains $100: your margin doubles. If it falls 10%, it loses $100: your margin is gone. The coin moved only 10%, but for you it is +100% or −100%.',
          fr: 'Si le prix monte de 10 %, la position de 1 000 $ gagne 100 $ : votre marge double. S’il baisse de 10 %, elle perd 100 $ : votre marge a disparu. La crypto n’a bougé que de 10 %, mais pour vous c’est +100 % ou −100 %.',
          ar: 'إذا ارتفع السعر 10%، تربح الصفقة البالغة 1000 دولار مبلغ 100 دولار: يتضاعف هامشك. وإذا انخفض 10%، تخسر 100 دولار: يختفي هامشك كله. العملة تحركت 10% فقط، لكن بالنسبة لك هي +100% أو −100%.',
        },
      },
      {
        h: { en: 'Liquidation', fr: 'La liquidation', ar: 'التصفية' },
        p: {
          en: 'When losses eat the margin, the platform closes your position by itself so its loan stays safe. This is liquidation. At x10 it usually comes a little before a 10% drop, around 9 to 9.6%, because of fees and the minimum margin the platform keeps. At x20, about 5% is enough, and crypto can move 5% in a few hours.',
          fr: 'Quand les pertes mangent la marge, la plateforme ferme votre position toute seule pour protéger son prêt. C’est la liquidation. À x10, elle arrive en général un peu avant une baisse de 10 %, vers 9 à 9,6 %, à cause des frais et de la marge minimale exigée. À x20, environ 5 % suffisent, et une crypto peut bouger de 5 % en quelques heures.',
          ar: 'عندما تأكل الخسائر الهامش، تغلق المنصة صفقتك من تلقاء نفسها لتحمي قرضها. هذه هي التصفية (liquidation). مع x10 تحدث عادة قبل هبوط 10% بقليل، حوالي 9 إلى 9.6%، بسبب الرسوم والحد الأدنى من الهامش الذي تشترطه المنصة. ومع x20 يكفي هبوط بحوالي 5%، والعملات الرقمية قد تتحرك 5% في بضع ساعات.',
        },
      },
      {
        h: { en: 'Futures in one sentence', fr: 'Les futures en une phrase', ar: 'العقود الآجلة باختصار' },
        p: {
          en: 'Leverage is mostly used through futures: contracts that bet on a coin’s price without owning the coin. The most common kind in crypto, perpetual futures, has no end date, and the two sides pay each other a small funding fee every few hours. The longer you stay, the more it adds up.',
          fr: 'Le levier passe surtout par les futures : des contrats qui parient sur le prix d’une crypto sans la posséder. Le type le plus courant en crypto, les futures perpétuels, n’a pas de date de fin, et les deux camps se versent de petits frais de financement (funding) toutes les quelques heures. Plus vous restez, plus ça s’additionne.',
          ar: 'تُستعمل الرافعة غالبًا عبر العقود الآجلة (futures): عقود تراهن على سعر العملة دون أن تملكها. والنوع الأكثر انتشارًا في العملات الرقمية هو العقود الدائمة (perpetual futures)، وليس لها تاريخ انتهاء، ويدفع فيها الطرفان لبعضهما رسومًا صغيرة تسمى funding كل بضع ساعات. وكلما بقيت مدة أطول، زادت هذه الرسوم.',
        },
      },
      {
        h: { en: 'What regulators saw', fr: 'Ce qu’ont vu les régulateurs', ar: 'ماذا وجدت الهيئات الرقابية؟' },
        p: {
          en: 'In 2018, Europe’s market regulator, ESMA, found that 74 to 89% of ordinary investors’ accounts typically lose money on leveraged products called CFDs. It then limited leverage on crypto CFDs for ordinary investors to x2. Qirat’s practice wallet has no leverage at all: what you see is the coin’s own move.',
          fr: 'En 2018, le régulateur européen des marchés, l’ESMA, a constaté que 74 à 89 % des comptes de particuliers perdent généralement de l’argent sur des produits à levier appelés CFD. Il a ensuite limité le levier sur les CFD crypto à x2 pour les particuliers. Le portefeuille d’entraînement de Qirat n’a aucun levier : ce que vous voyez, c’est le mouvement de la crypto elle-même.',
          ar: 'في 2018، وجدت هيئة الأسواق الأوروبية (ESMA) أن ما بين 74% و89% من حسابات المستثمرين الأفراد تخسر عادة في منتجات بالرافعة تسمى CFD. ثم حددت الرافعة على عقود CFD للعملات الرقمية بـ x2 فقط للأفراد. أما محفظة التدريب في قيراط فلا رافعة فيها أبدًا: ما تراه هو حركة العملة نفسها.',
        },
      },
    ],
    takeaway: {
      en: 'Leverage multiplies the move, not your skill. At x10, a 10% move against you can erase your whole stake.',
      fr: 'Le levier multiplie le mouvement, pas votre talent. À x10, un mouvement de 10 % contre vous peut effacer toute votre mise.',
      ar: 'الرافعة تضاعف الحركة، لا مهارتك. مع x10، حركة بـ 10% ضدك قد تمسح كل ما وضعته.',
    },
    quiz: [
      {
        q: {
          en: 'With x10 leverage, your $100 margin controls a position of…',
          fr: 'Avec un levier x10, votre marge de 100 $ contrôle une position de…',
          ar: 'مع رافعة x10، يتحكم هامشك البالغ 100 دولار في صفقة قيمتها…',
        },
        options: [
          { en: '$110', fr: '110 $', ar: '110 دولارات' },
          { en: '$1,000', fr: '1 000 $', ar: '1000 دولار' },
          { en: '$100', fr: '100 $', ar: '100 دولار' },
        ],
        answer: 1,
        why: {
          en: '$100 × 10 = $1,000. Every 1% move of the coin becomes a 10% move of your margin.',
          fr: '100 $ × 10 = 1 000 $. Chaque mouvement de 1 % de la crypto devient un mouvement de 10 % de votre marge.',
          ar: '100 × 10 = 1000 دولار. كل حركة بـ 1% في العملة تصبح حركة بـ 10% في هامشك.',
        },
      },
      {
        q: {
          en: 'At x10, the coin falls about 10%. What usually happens?',
          fr: 'À x10, la crypto baisse d’environ 10 %. Que se passe-t-il en général ?',
          ar: 'مع x10، هبطت العملة حوالي 10%. ماذا يحدث عادة؟',
        },
        options: [
          {
            en: 'The position is liquidated and the margin is gone',
            fr: 'La position est liquidée et la marge a disparu',
            ar: 'تتم تصفية الصفقة ويضيع الهامش',
          },
          { en: 'You lose $10', fr: 'Vous perdez 10 $', ar: 'تخسر 10 دولارات' },
          {
            en: 'The platform waits for the price to come back',
            fr: 'La plateforme attend que le prix remonte',
            ar: 'تنتظر المنصة حتى يعود السعر',
          },
        ],
        answer: 0,
        why: {
          en: 'A 10% drop on $1,000 is $100, your whole margin. The platform closes the position, usually even a little before 10%.',
          fr: 'Une baisse de 10 % sur 1 000 $, c’est 100 $, toute votre marge. La plateforme ferme la position, souvent même un peu avant 10 %.',
          ar: 'هبوط 10% على 1000 دولار يساوي 100 دولار، أي هامشك كله. تغلق المنصة الصفقة، وغالبًا قبل 10% بقليل.',
        },
      },
      {
        q: {
          en: 'What did Europe’s market regulator find in 2018 about leveraged CFDs?',
          fr: 'Qu’a constaté le régulateur européen en 2018 sur les CFD à levier ?',
          ar: 'ماذا وجدت هيئة الأسواق الأوروبية في 2018 عن عقود CFD بالرافعة؟',
        },
        options: [
          { en: 'Most ordinary accounts made money', fr: 'La plupart des comptes de particuliers gagnaient', ar: 'أغلب حسابات الأفراد ربحت' },
          { en: 'Only crypto CFDs lost money', fr: 'Seuls les CFD crypto perdaient', ar: 'عقود العملات الرقمية فقط هي التي خسرت' },
          {
            en: '74 to 89% of ordinary accounts typically lost money',
            fr: '74 à 89 % des comptes de particuliers perdaient en général',
            ar: 'ما بين 74% و89% من حسابات الأفراد تخسر عادة',
          },
        ],
        answer: 2,
        why: {
          en: 'ESMA’s 2018 decision cites 74 to 89% of retail accounts losing money, and it capped crypto CFD leverage for them at x2.',
          fr: 'La décision de l’ESMA de 2018 cite 74 à 89 % de comptes de particuliers perdants, et elle a limité leur levier sur les CFD crypto à x2.',
          ar: 'قرار ESMA في 2018 يذكر أن ما بين 74% و89% من حسابات الأفراد تخسر، وحدد لهم الرافعة على عقود العملات الرقمية بـ x2.',
        },
      },
    ],
  },

  {
    slug: 'indicators',
    level: 3,
    minutes: 3,
    title: {
      en: 'Trend, support, resistance and RSI',
      fr: 'Tendance, support, résistance et RSI',
      ar: 'الاتجاه والدعم والمقاومة ومؤشر RSI',
    },
    hook: {
      en: 'Chart tools describe what already happened. They help you read a chart; they don’t show the future.',
      fr: 'Les outils graphiques décrivent ce qui s’est déjà passé. Ils aident à lire un graphique, ils ne montrent pas l’avenir.',
      ar: 'أدوات الرسم البياني تصف ما حدث بالفعل. تساعدك على قراءة الرسم، لكنها لا تكشف المستقبل.',
    },
    terms: ['trend', 'support-resistance', 'rsi'],
    live: { kind: 'coin', symbol: 'BTC' },
    sections: [
      {
        h: { en: 'Trend: a staircase', fr: 'La tendance : un escalier', ar: 'الاتجاه: سلّم' },
        p: {
          en: 'An uptrend looks like a staircase going up: each high is above the last one, and each low is above the last low. A downtrend is the opposite: lower highs and lower lows. A trend is easy to see afterwards, and it can end without warning.',
          fr: 'Une tendance haussière ressemble à un escalier qui monte : chaque sommet dépasse le précédent, et chaque creux aussi. Une tendance baissière, c’est l’inverse : des sommets et des creux de plus en plus bas. Une tendance se voit facilement après coup, et elle peut s’arrêter sans prévenir.',
          ar: 'الاتجاه الصاعد (uptrend) يشبه سلّمًا يصعد: كل قمة أعلى من التي قبلها، وكل قاع أعلى من القاع السابق. والاتجاه الهابط عكسه: قمم أدنى وقيعان أدنى. الاتجاه سهل الرؤية بعد حدوثه، وقد ينتهي دون إنذار.',
        },
      },
      {
        h: { en: 'Support and resistance', fr: 'Support et résistance', ar: 'الدعم والمقاومة' },
        p: {
          en: 'Support is a price zone where buyers stepped in before and a fall stopped. Resistance is a zone where sellers stepped in and a rise stopped. They are zones where people reacted in the past, not walls: the price often goes right through them.',
          fr: 'Un support est une zone de prix où des acheteurs sont arrivés et où une baisse s’est arrêtée. Une résistance est une zone où des vendeurs sont arrivés et où une hausse s’est arrêtée. Ce sont des zones où les gens ont réagi dans le passé, pas des murs : le prix les traverse souvent.',
          ar: 'الدعم (support) منطقة سعرية دخل فيها مشترون من قبل فتوقف الهبوط. والمقاومة (resistance) منطقة دخل فيها بائعون فتوقف الصعود. هي مناطق تفاعل فيها الناس في الماضي، وليست جدرانًا: كثيرًا ما يخترقها السعر.',
        },
      },
      {
        h: { en: 'RSI: how far and how fast', fr: 'Le RSI : de combien et à quelle vitesse', ar: 'مؤشر RSI: كم تحرك السعر وبأي سرعة' },
        p: {
          en: 'The RSI (Relative Strength Index) is a score from 0 to 100, usually over the last 14 candles. Above 70 is called “overbought”: the price rose a lot, fast. Below 30 is called “oversold”. These are labels, not forecasts: a coin can stay above 70 for weeks.',
          fr: 'Le RSI (indice de force relative) est un score de 0 à 100, calculé en général sur les 14 dernières bougies. Au-dessus de 70, on dit « suracheté » : le prix a beaucoup monté, vite. Sous 30, on dit « survendu ». Ce sont des étiquettes, pas des prévisions : une crypto peut rester au-dessus de 70 pendant des semaines.',
          ar: 'مؤشر القوة النسبية (RSI) رقم من 0 إلى 100، يُحسب عادة على آخر 14 شمعة. فوق 70 يسمونه «تشبع شرائي» (overbought): أي أن السعر ارتفع كثيرًا وبسرعة. وتحت 30 يسمونه «تشبع بيعي» (oversold). هذه مجرد تسميات وليست توقعات: قد تبقى العملة فوق 70 لأسابيع.',
        },
      },
      {
        h: { en: 'Same chart, two stories', fr: 'Un graphique, deux histoires', ar: 'رسم واحد وقصتان' },
        p: {
          en: 'Show one chart to two people. One sees support and expects a bounce. The other sees a broken trend and expects more falls. Both are reading the same past, and the chart can’t tell which of them will be right.',
          fr: 'Montrez le même graphique à deux personnes. L’une voit un support et s’attend à un rebond. L’autre voit une tendance cassée et s’attend à d’autres baisses. Les deux lisent le même passé, et le graphique ne peut pas dire laquelle aura raison.',
          ar: 'اعرض الرسم نفسه على شخصين. الأول يرى دعمًا وينتظر ارتدادًا، والثاني يرى اتجاهًا مكسورًا وينتظر مزيدًا من الهبوط. كلاهما يقرأ الماضي نفسه، والرسم لا يستطيع أن يقول من منهما سيكون على حق.',
        },
      },
      {
        h: { en: 'What Qirat’s own test found', fr: 'Ce qu’a trouvé le test de Qirat', ar: 'ماذا وجد اختبار قيراط؟' },
        p: {
          en: 'In October 2026, Qirat tested its old 0–100 score, built from moving averages, recent moves, volume and the crowd’s mood, on 2021–2026 prices of big coins. It had no reliable edge over the next 7 days. What did hold up is how much a coin swings. That is why Qirat shows risk first.',
          fr: 'En octobre 2026, Qirat a testé son ancien score de 0 à 100, construit à partir de moyennes mobiles, des mouvements récents, du volume et de l’humeur de la foule, sur les prix 2021–2026 des grandes cryptos. Il n’avait aucun avantage fiable sur les 7 jours suivants. Ce qui a tenu, c’est l’ampleur des variations d’une crypto. C’est pour ça que Qirat montre le risque en premier.',
          ar: 'في أكتوبر 2026، اختبر قيراط مؤشره القديم من 0 إلى 100، المبني على المتوسطات المتحركة والحركة الأخيرة وحجم التداول ومزاج السوق، على أسعار العملات الكبيرة بين 2021 و2026. لم تكن له أي أفضلية موثوقة خلال 7 أيام بعدها. أما ما صمد فهو مقدار تقلب العملة، ولهذا يعرض قيراط المخاطرة أولًا.',
        },
      },
    ],
    takeaway: {
      en: 'Trend, support, resistance and RSI summarise the past. They describe a chart; they are never an order to buy or sell.',
      fr: 'Tendance, support, résistance et RSI résument le passé. Ils décrivent un graphique, ils ne sont jamais un ordre d’acheter ou de vendre.',
      ar: 'الاتجاه والدعم والمقاومة وRSI تلخص الماضي. هي تصف الرسم، وليست أبدًا أمرًا بالشراء أو البيع.',
    },
    quiz: [
      {
        q: {
          en: 'Which one is an uptrend?',
          fr: 'Laquelle est une tendance haussière ?',
          ar: 'أيّها اتجاه صاعد؟',
        },
        options: [
          { en: 'Higher highs and higher lows', fr: 'Des sommets et des creux de plus en plus hauts', ar: 'قمم أعلى وقيعان أعلى' },
          { en: 'Lower highs and lower lows', fr: 'Des sommets et des creux de plus en plus bas', ar: 'قمم أدنى وقيعان أدنى' },
          { en: 'A price that barely moves for a month', fr: 'Un prix qui bouge à peine pendant un mois', ar: 'سعر لا يكاد يتحرك طوال شهر' },
        ],
        answer: 0,
        why: {
          en: 'An uptrend is a staircase going up: each high and each low sits above the one before.',
          fr: 'Une tendance haussière est un escalier qui monte : chaque sommet et chaque creux dépassent le précédent.',
          ar: 'الاتجاه الصاعد سلّم يصعد: كل قمة وكل قاع أعلى من سابقه.',
        },
      },
      {
        q: {
          en: 'A coin’s RSI is 78. What does that tell you?',
          fr: 'Le RSI d’une crypto est à 78. Qu’est-ce que ça vous dit ?',
          ar: 'مؤشر RSI لعملة ما هو 78. ماذا يخبرك هذا؟',
        },
        options: [
          { en: 'It will fall tomorrow', fr: 'Elle va baisser demain', ar: 'ستهبط غدًا' },
          { en: 'It has the lowest risk in the list', fr: 'C’est la moins risquée de la liste', ar: 'هي الأقل مخاطرة في القائمة' },
          { en: 'It rose a lot, fast, recently', fr: 'Elle a beaucoup monté, vite, récemment', ar: 'ارتفعت كثيرًا وبسرعة مؤخرًا' },
        ],
        answer: 2,
        why: {
          en: 'RSI measures how far and how fast the price moved. “Overbought” is a label, not a forecast: a coin can stay above 70 for weeks.',
          fr: 'Le RSI mesure de combien et à quelle vitesse le prix a bougé. « Suracheté » est une étiquette, pas une prévision : une crypto peut rester au-dessus de 70 pendant des semaines.',
          ar: 'RSI يقيس كم تحرك السعر وبأي سرعة. «التشبع الشرائي» تسمية وليس توقعًا: قد تبقى العملة فوق 70 لأسابيع.',
        },
      },
      {
        q: {
          en: 'The price reaches a support zone. What happens next?',
          fr: 'Le prix arrive sur une zone de support. Que se passe-t-il ensuite ?',
          ar: 'وصل السعر إلى منطقة دعم. ماذا يحدث بعد ذلك؟',
        },
        options: [
          { en: 'It always bounces back up', fr: 'Il rebondit toujours', ar: 'يرتد دائمًا إلى الأعلى' },
          {
            en: 'Nobody knows: support is where people reacted before, not a wall',
            fr: 'Personne ne sait : un support est une zone où les gens ont réagi avant, pas un mur',
            ar: 'لا أحد يعرف: الدعم منطقة تفاعل فيها الناس من قبل، وليس جدارًا',
          },
          { en: 'It always breaks through', fr: 'Il la traverse toujours', ar: 'يخترقها دائمًا' },
        ],
        answer: 1,
        why: {
          en: 'Support describes past reactions. The price can bounce or go straight through, and the chart can’t tell you which.',
          fr: 'Un support décrit des réactions passées. Le prix peut rebondir ou passer à travers, et le graphique ne peut pas vous dire lequel.',
          ar: 'الدعم يصف تفاعلات الماضي. قد يرتد السعر وقد يخترقه، والرسم لا يستطيع أن يخبرك أيهما سيحدث.',
        },
      },
    ],
  },

  {
    slug: 'diversify-dca',
    level: 3,
    minutes: 3,
    title: {
      en: 'Spreading out and DCA',
      fr: 'Répartir et investir par paliers (DCA)',
      ar: 'توزيع الأموال والشراء الدوري (DCA)',
    },
    hook: {
      en: 'Two ways people try to soften crypto’s swings, and what each one can’t do.',
      fr: 'Deux façons d’adoucir les variations de la crypto, et ce que chacune ne peut pas faire.',
      ar: 'طريقتان يحاول بهما الناس تخفيف تقلبات العملات الرقمية، وما لا تستطيع كل منهما فعله.',
    },
    terms: ['diversification', 'correlation', 'dca'],
    live: { kind: 'weather' },
    sections: [
      {
        h: { en: 'One coin or a few', fr: 'Une crypto ou plusieurs', ar: 'عملة واحدة أم عدة عملات' },
        p: {
          en: 'With everything in one coin, your wallet follows that coin’s every move. Spreading money over several coins is called diversification. If one coin has a disaster of its own, like a hack or a project that fails, only part of the wallet is hit.',
          fr: 'Avec tout sur une seule crypto, votre portefeuille suit chacun de ses mouvements. Répartir l’argent sur plusieurs cryptos s’appelle la diversification. Si une crypto connaît son propre désastre, comme un piratage ou un projet qui échoue, seule une partie du portefeuille est touchée.',
          ar: 'إذا وضعت كل شيء في عملة واحدة، تتبع محفظتك كل حركة لها. وتوزيع المال على عدة عملات يسمى التنويع (diversification). فإذا أصابت عملة ما كارثة خاصة بها، مثل اختراق أو فشل مشروعها، يتضرر جزء من المحفظة فقط.',
        },
      },
      {
        h: { en: 'Crypto coins fall together', fr: 'Les cryptos baissent ensemble', ar: 'العملات الرقمية تهبط معًا' },
        p: {
          en: 'Most coins tend to move with Bitcoin. When the market weather turns stormy, most coins fall, even 24K ones. So 5 coins are less spread out than they look: they often drop on the same days. How much prices move together is called correlation.',
          fr: 'La plupart des cryptos ont tendance à bouger avec le Bitcoin. Quand la météo du marché devient orageuse, la plupart baissent, même les 24K. Donc 5 cryptos sont moins réparties qu’il n’y paraît : elles baissent souvent les mêmes jours. Le fait que des prix bougent ensemble s’appelle la corrélation.',
          ar: 'معظم العملات تميل إلى التحرك مع Bitcoin. وعندما يصبح طقس السوق عاصفًا، تهبط أغلب العملات، حتى التي عيارها 24K. لذلك فإن 5 عملات أقل تنوعًا مما تبدو: كثيرًا ما تهبط في الأيام نفسها. ومقدار تحرك الأسعار معًا يسمى الارتباط (correlation).',
        },
      },
      {
        h: { en: 'Baskets', fr: 'Les paniers', ar: 'السلال' },
        p: {
          en: 'A basket, or index, holds several coins in set shares, often by their size, so it follows a group of coins instead of one. It spreads the risk of a single coin failing. It still goes down when most coins go down.',
          fr: 'Un panier, ou indice, contient plusieurs cryptos dans des proportions fixées, souvent selon leur taille : il suit un groupe de cryptos au lieu d’une seule. Il répartit le risque qu’une crypto échoue. Mais il baisse quand même quand la plupart des cryptos baissent.',
          ar: 'السلة أو المؤشر (index) تضم عدة عملات بنسب محددة، غالبًا حسب حجمها، فتتبع مجموعة من العملات بدل عملة واحدة. هي توزع خطر فشل عملة بعينها، لكنها تهبط هي أيضًا عندما تهبط أغلب العملات.',
        },
      },
      {
        h: {
          en: 'DCA: the same amount on a schedule',
          fr: 'Le DCA : le même montant, à date fixe',
          ar: 'الشراء الدوري: المبلغ نفسه في موعد ثابت',
        },
        p: {
          en: 'DCA (dollar-cost averaging) means buying for the same amount at regular times, for example $25 every month, whatever the price. A low price buys more coins, a high price fewer. Over 4 months at $10, $5, $8 and $10, $100 buys about 13.1 coins: an average of about $7.62 a coin, before fees.',
          fr: 'Le DCA (investissement programmé) consiste à acheter pour le même montant à intervalles réguliers, par exemple 25 $ chaque mois, quel que soit le prix. Un prix bas achète plus de pièces, un prix haut moins. Sur 4 mois à 10 $, 5 $, 8 $ et 10 $, 100 $ achètent environ 13,1 pièces : environ 7,62 $ la pièce en moyenne, avant frais.',
          ar: 'الشراء الدوري (DCA) يعني أن تشتري بالمبلغ نفسه في أوقات منتظمة، مثلًا 25 دولارًا كل شهر، مهما كان السعر. السعر المنخفض يشتري وحدات أكثر، والمرتفع وحدات أقل. على 4 أشهر بأسعار 10 و5 و8 و10 دولارات، تشتري 100 دولار حوالي 13.1 وحدة: أي حوالي 7.62 دولار للوحدة في المتوسط، قبل الرسوم.',
        },
      },
      {
        h: { en: 'What DCA does not do', fr: 'Ce que le DCA ne fait pas', ar: 'ما لا يفعله الشراء الدوري' },
        p: {
          en: 'DCA smooths the price you pay; it does not stop losses. If the price keeps falling month after month, every buy ends up worth less than you paid. Each buy also pays a fee. It removes the guessing about timing, nothing more.',
          fr: 'Le DCA lisse le prix payé, il n’empêche pas les pertes. Si le prix baisse mois après mois, chaque achat finit par valoir moins que ce que vous avez payé. Chaque achat paie aussi des frais. Il enlève le pari sur le bon moment, rien de plus.',
          ar: 'الشراء الدوري يوازن السعر الذي تدفعه، لكنه لا يمنع الخسارة. إذا استمر السعر في الهبوط شهرًا بعد شهر، تصبح قيمة كل عملية شراء أقل مما دفعت. وكل عملية شراء تدفع رسومًا أيضًا. هو يزيل التخمين في التوقيت، لا أكثر.',
        },
      },
    ],
    takeaway: {
      en: 'Spreading out and DCA soften some risks, not all. Crypto coins often fall together, and DCA can’t stop a price that keeps falling.',
      fr: 'Répartir et le DCA adoucissent certains risques, pas tous. Les cryptos baissent souvent ensemble, et le DCA ne peut pas arrêter un prix qui continue de baisser.',
      ar: 'التنويع والشراء الدوري يخففان بعض المخاطر، لا كلها. العملات الرقمية كثيرًا ما تهبط معًا، والشراء الدوري لا يوقف سعرًا يواصل الهبوط.',
    },
    quiz: [
      {
        q: {
          en: 'You hold 5 different coins and the market weather turns stormy. What usually happens?',
          fr: 'Vous détenez 5 cryptos différentes et la météo du marché devient orageuse. Que se passe-t-il en général ?',
          ar: 'تملك 5 عملات مختلفة وأصبح طقس السوق عاصفًا. ماذا يحدث عادة؟',
        },
        options: [
          {
            en: 'They balance each other, so the wallet stays flat',
            fr: 'Elles s’équilibrent, donc le portefeuille reste stable',
            ar: 'توازن بعضها بعضًا فتبقى المحفظة ثابتة',
          },
          { en: 'Only the smallest coin falls', fr: 'Seule la plus petite baisse', ar: 'تهبط أصغر عملة فقط' },
          { en: 'Most of them fall together', fr: 'La plupart baissent ensemble', ar: 'يهبط أغلبها معًا' },
        ],
        answer: 2,
        why: {
          en: 'Most coins move with Bitcoin. In storms most coins fall, even 24K ones, so 5 coins are less spread out than they look.',
          fr: 'La plupart des cryptos bougent avec le Bitcoin. Dans l’orage, la plupart baissent, même les 24K : 5 cryptos sont moins réparties qu’il n’y paraît.',
          ar: 'معظم العملات تتحرك مع Bitcoin. في الطقس العاصف تهبط أغلبها، حتى التي عيارها 24K، لذلك فإن 5 عملات أقل تنوعًا مما تبدو.',
        },
      },
      {
        q: {
          en: '$25 a month buys a coin at $10, then at $5. How many coins in total?',
          fr: '25 $ par mois achètent une crypto à 10 $, puis à 5 $. Combien de pièces au total ?',
          ar: '25 دولارًا كل شهر تشتري عملة بسعر 10 دولارات، ثم بسعر 5 دولارات. كم وحدة في المجموع؟',
        },
        options: [
          { en: '5 coins', fr: '5 pièces', ar: '5 وحدات' },
          { en: '7.5 coins', fr: '7,5 pièces', ar: '7.5 وحدة' },
          { en: '2.5 coins', fr: '2,5 pièces', ar: '2.5 وحدة' },
        ],
        answer: 1,
        why: {
          en: '$25 ÷ $10 = 2.5 coins, then $25 ÷ $5 = 5 coins: 7.5 in total. A lower price buys more.',
          fr: '25 $ ÷ 10 $ = 2,5 pièces, puis 25 $ ÷ 5 $ = 5 pièces : 7,5 au total. Un prix plus bas achète plus.',
          ar: '25 ÷ 10 = 2.5 وحدة، ثم 25 ÷ 5 = 5 وحدات: المجموع 7.5. السعر الأقل يشتري أكثر.',
        },
      },
      {
        q: {
          en: 'What can DCA NOT do?',
          fr: 'Que ne peut PAS faire le DCA ?',
          ar: 'ما الذي لا يستطيع الشراء الدوري فعله؟',
        },
        options: [
          {
            en: 'Protect you if the price keeps falling',
            fr: 'Vous protéger si le prix continue de baisser',
            ar: 'حمايتك إذا استمر السعر في الهبوط',
          },
          {
            en: 'Buy more coins when the price is low',
            fr: 'Acheter plus de pièces quand le prix est bas',
            ar: 'شراء وحدات أكثر عندما يكون السعر منخفضًا',
          },
          { en: 'Spread your buys over time', fr: 'Étaler vos achats dans le temps', ar: 'توزيع مشترياتك على مدة زمنية' },
        ],
        answer: 0,
        why: {
          en: 'DCA smooths the price you pay. If the price keeps falling, every buy is still worth less than you paid.',
          fr: 'Le DCA lisse le prix payé. Si le prix continue de baisser, chaque achat vaut quand même moins que ce que vous avez payé.',
          ar: 'الشراء الدوري يوازن السعر الذي تدفعه. وإذا استمر السعر في الهبوط، تبقى قيمة كل عملية شراء أقل مما دفعت.',
        },
      },
    ],
  },

  {
    slug: 'trading-plan',
    level: 3,
    minutes: 3,
    title: {
      en: 'Your plan and your journal',
      fr: 'Votre plan et votre journal',
      ar: 'خطتك ودفتر صفقاتك',
    },
    hook: {
      en: 'Decide before the trade, write it down after. Paper remembers what feelings forget.',
      fr: 'Décidez avant l’opération, notez après. Le papier se souvient de ce que les émotions oublient.',
      ar: 'قرر قبل الصفقة، ودوّن بعدها. الورق يتذكر ما تنساه المشاعر.',
    },
    terms: ['trading-plan', 'journal', 'revenge-trading'],
    live: {
      kind: 'view',
      view: 'practice',
      label: {
        en: 'Try a plan in the practice wallet',
        fr: 'Tester un plan dans le portefeuille d’entraînement',
        ar: 'جرّب خطة في محفظة التدريب',
      },
    },
    sections: [
      {
        h: { en: 'The plan, before you click', fr: 'Le plan, avant de cliquer', ar: 'الخطة قبل أن تضغط' },
        p: {
          en: 'A trading plan fits on a small card written before the trade: why this trade, where you get in, where you get out if it goes well, where you get out if it goes wrong (the stop), and how much (the size). If you can’t fill in the card, the trade isn’t ready.',
          fr: 'Un plan de trading tient sur une petite fiche écrite avant l’opération : pourquoi cette opération, où vous entrez, où vous sortez si ça se passe bien, où vous sortez si ça tourne mal (le stop), et combien (la taille). Si vous ne pouvez pas remplir la fiche, l’opération n’est pas prête.',
          ar: 'خطة التداول (trading plan) تكفيها بطاقة صغيرة تكتبها قبل الصفقة: لماذا هذه الصفقة، أين تدخل، أين تخرج إن سارت جيدًا، أين تخرج إن ساءت (نقطة الإيقاف أو stop)، وكم المبلغ (الحجم). إذا لم تستطع ملء البطاقة، فالصفقة ليست جاهزة.',
        },
      },
      {
        h: { en: 'Why write it first', fr: 'Pourquoi l’écrire avant', ar: 'لماذا تكتبها أولًا؟' },
        p: {
          en: 'Once money is moving, fear and excitement start making the choices. A plan written while calm lets you compare what you decided with what you did. A common gap: moving the stop further away “just this once”.',
          fr: 'Une fois l’argent en jeu, la peur et l’excitation se mettent à décider. Un plan écrit à froid permet de comparer ce que vous aviez décidé avec ce que vous avez fait. Un écart fréquent : éloigner le stop « juste pour cette fois ».',
          ar: 'عندما يبدأ المال في الحركة، يبدأ الخوف والحماس في اتخاذ القرارات. الخطة المكتوبة وأنت هادئ تسمح لك بمقارنة ما قررته بما فعلته. ومن الفروق الشائعة: إبعاد نقطة الإيقاف «هذه المرة فقط».',
        },
      },
      {
        h: { en: 'The journal', fr: 'Le journal', ar: 'دفتر الصفقات' },
        p: {
          en: 'After each trade, write one line: date, coin, why you got in, what happened, and how you felt. After 20 trades, read them again. Patterns show up: the time of day you trade worst, the feeling that comes before your worst trades.',
          fr: 'Après chaque opération, écrivez une ligne : la date, la crypto, pourquoi vous êtes entré, ce qui s’est passé et ce que vous avez ressenti. Après 20 opérations, relisez-les. Des habitudes apparaissent : le moment de la journée où vous tradez le plus mal, l’émotion qui précède vos pires opérations.',
          ar: 'بعد كل صفقة، اكتب سطرًا واحدًا في دفتر الصفقات (journal): التاريخ، العملة، لماذا دخلت، ماذا حدث، وبماذا شعرت. وبعد 20 صفقة، أعد قراءتها. ستظهر أنماط: الوقت من اليوم الذي تتداول فيه بشكل أسوأ، والشعور الذي يسبق أسوأ صفقاتك.',
        },
      },
      {
        h: { en: 'Revenge trading', fr: 'Le trading de revanche', ar: 'التداول الانتقامي' },
        p: {
          en: 'After a loss, the urge to win it back straight away is strong. That rushed trade, often bigger than usual, is called revenge trading, and it often turns one loss into two. The plan card is the brake: no card, no trade.',
          fr: 'Après une perte, l’envie de la récupérer tout de suite est forte. Cette opération précipitée, souvent plus grosse que d’habitude, s’appelle le trading de revanche (revenge trading), et elle transforme souvent une perte en deux. La fiche du plan sert de frein : pas de fiche, pas d’opération.',
          ar: 'بعد الخسارة تكون الرغبة في استرجاعها فورًا قوية. تلك الصفقة المتسرعة، وغالبًا ما تكون أكبر من المعتاد، تسمى التداول الانتقامي (revenge trading)، وكثيرًا ما تحوّل خسارة واحدة إلى خسارتين. بطاقة الخطة هي الفرامل: لا بطاقة، لا صفقة.',
        },
      },
      {
        h: {
          en: 'Test it where it costs nothing',
          fr: 'La tester là où ça ne coûte rien',
          ar: 'جرّبها حيث لا تكلفك شيئًا',
        },
        p: {
          en: 'Qirat’s practice wallet is a place to try a plan for a few weeks with pretend money. The habit coach works as a mirror: it notes a buy after a big 7-day jump, a sale during a sharp 24-hour fall, more than half the wallet in one coin, or 5 trades in a day. The goal is to learn how you behave, not to get rich.',
          fr: 'Le portefeuille d’entraînement de Qirat permet d’essayer un plan pendant quelques semaines avec de l’argent fictif. Le coach des habitudes sert de miroir : il note un achat après une grosse hausse sur 7 jours, une vente pendant une chute brutale sur 24 heures, plus de la moitié du portefeuille sur une crypto, ou 5 opérations en une journée. Le but est d’apprendre comment vous réagissez, pas de devenir riche.',
          ar: 'محفظة التدريب في قيراط مكان لتجربة خطتك لبضعة أسابيع بأموال وهمية. ومدرب العادات يعمل كمرآة: ينبهك إلى شراء بعد قفزة كبيرة خلال 7 أيام، أو بيع أثناء هبوط حاد خلال 24 ساعة، أو أكثر من نصف المحفظة في عملة واحدة، أو 5 صفقات في يوم واحد. الهدف أن تتعلم كيف تتصرف، لا أن تصبح غنيًا.',
        },
      },
    ],
    takeaway: {
      en: 'Plan before, journal after. Together they teach you more about your own habits than any chart.',
      fr: 'Le plan avant, le journal après. Ensemble, ils vous en apprennent plus sur vos habitudes que n’importe quel graphique.',
      ar: 'الخطة قبل الصفقة، والدفتر بعدها. معًا يعلمانك عن عاداتك أكثر من أي رسم بياني.',
    },
    quiz: [
      {
        q: {
          en: 'What goes on a plan card written before a trade?',
          fr: 'Que met-on sur une fiche de plan écrite avant une opération ?',
          ar: 'ماذا تكتب في بطاقة الخطة قبل الصفقة؟',
        },
        options: [
          { en: 'A tip from a group chat', fr: 'Un tuyau lu dans un groupe', ar: 'نصيحة من مجموعة دردشة' },
          {
            en: 'Why, entry, exits, stop and size',
            fr: 'Pourquoi, l’entrée, les sorties, le stop et la taille',
            ar: 'السبب، الدخول، الخروج، نقطة الإيقاف والحجم',
          },
          { en: 'Only the coin’s name', fr: 'Seulement le nom de la crypto', ar: 'اسم العملة فقط' },
        ],
        answer: 1,
        why: {
          en: 'The card holds the whole decision, written while calm: why, where in, where out both ways, and how much.',
          fr: 'La fiche contient toute la décision, écrite à froid : pourquoi, où entrer, où sortir dans les deux cas, et combien.',
          ar: 'البطاقة تحمل القرار كاملًا، مكتوبًا وأنت هادئ: لماذا، أين تدخل، أين تخرج في الحالتين، وكم المبلغ.',
        },
      },
      {
        q: {
          en: 'You just lost on a trade and want to win it back right now with a bigger one. What is this?',
          fr: 'Vous venez de perdre sur une opération et voulez vous refaire tout de suite avec une plus grosse. Comment ça s’appelle ?',
          ar: 'خسرت للتو في صفقة وتريد استرجاع الخسارة فورًا بصفقة أكبر. ماذا يسمى هذا؟',
        },
        options: [
          { en: 'Diversification', fr: 'La diversification', ar: 'التنويع' },
          { en: 'Position sizing', fr: 'Le calcul de la taille de position', ar: 'حساب حجم الصفقة' },
          { en: 'Revenge trading', fr: 'Le trading de revanche', ar: 'التداول الانتقامي' },
        ],
        answer: 2,
        why: {
          en: 'A rushed, bigger trade to erase a loss is revenge trading. It often turns one loss into two.',
          fr: 'Une opération précipitée et plus grosse pour effacer une perte, c’est le trading de revanche. Il transforme souvent une perte en deux.',
          ar: 'الصفقة المتسرعة والأكبر لمسح خسارة هي التداول الانتقامي، وكثيرًا ما تحوّل خسارة واحدة إلى خسارتين.',
        },
      },
      {
        q: {
          en: 'What is the point of testing a plan for a few weeks in the practice wallet?',
          fr: 'À quoi sert de tester un plan quelques semaines dans le portefeuille d’entraînement ?',
          ar: 'ما فائدة تجربة خطة لبضعة أسابيع في محفظة التدريب؟',
        },
        options: [
          {
            en: 'To learn how you behave, with no real money at stake',
            fr: 'Apprendre comment vous réagissez, sans argent réel en jeu',
            ar: 'أن تتعلم كيف تتصرف دون أن تخاطر بمال حقيقي',
          },
          { en: 'To find a coin that always wins', fr: 'Trouver une crypto qui gagne toujours', ar: 'أن تجد عملة تربح دائمًا' },
          { en: 'To earn a reward from Qirat', fr: 'Gagner une récompense de Qirat', ar: 'أن تحصل على مكافأة من قيراط' },
        ],
        answer: 0,
        why: {
          en: 'The practice wallet uses pretend money. Your plan, your journal and the coach’s notes show your habits; there are no prizes and no coin that always wins.',
          fr: 'Le portefeuille d’entraînement utilise de l’argent fictif. Votre plan, votre journal et les remarques du coach montrent vos habitudes : il n’y a ni prix à gagner ni crypto qui gagne toujours.',
          ar: 'محفظة التدريب تستعمل أموالًا وهمية. خطتك ودفترك وملاحظات المدرب تكشف عاداتك، ولا توجد جوائز ولا عملة تربح دائمًا.',
        },
      },
    ],
  },
]
