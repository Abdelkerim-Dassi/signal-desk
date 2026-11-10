// Learn section content: lessons, quizzes, glossary and the Learn screen's
// own UI strings, in English, French and Tunisian Darija.
//
// DARIJA REVIEW: every Darija (`ar`) string of the Learn section lives in this
// file (plus `nav.learn` in i18n.ts). Darija is written in Arabic script, with
// coin and crypto terms in Latin script. `npm run learn:darija` exports them to
// docs/learn/darija-review.md for Abdelkerim to read before release.
//
// Content rules: education only. Never tell anyone to buy, sell or hold, never
// promise returns, no performance claims.

export type Text = { en: string; fr: string; ar: string }

/** A live part of the app a lesson points to. */
export type LiveLink =
  | { kind: 'coin'; symbol: string } // a mini card for one coin from today's brief
  | { kind: 'risk' } // Bitcoin next to the riskiest coin in the user's list
  | { kind: 'weather' } // today's market weather and crowd mood
  | { kind: 'karat' } // the karat ladder with today's coins on it
  | { kind: 'view'; view: 'today' | 'ask' | 'portfolio' | 'practice' | 'scamcheck'; label: Text }

export interface QuizQuestion {
  q: Text
  options: Text[]
  answer: number
  why: Text
}

export interface Lesson {
  slug: string
  title: Text
  hook: Text
  minutes: number
  terms: string[]
  live?: LiveLink
  /** Full lessons have sections, a takeaway and a 3-question quiz. */
  sections?: { h: Text; p: Text }[]
  takeaway?: Text
  quiz?: QuizQuestion[]
  /** Lessons not written yet show their outline as "coming soon". */
  outline?: Text[]
}

export const isReady = (l: Lesson) => Boolean(l.sections?.length && l.quiz?.length)

// ---------------------------------------------------------------------------
// Learn screen UI strings
// ---------------------------------------------------------------------------

export const LEARN_UI = {
  title: { en: 'Learn', fr: 'Apprendre', ar: 'تعلّم' },
  subtitle: {
    en: 'Two-minute lessons on crypto, scams and risk. No hype, no tips.',
    fr: 'Des leçons de deux minutes sur la crypto, les arnaques et le risque. Sans hype, sans conseils.',
    ar: 'دروس في دقيقتين على الـ crypto، التحيّل والـ risk. بلا تهويل وبلا نصايح.',
  },
  // The "start here" strip a first visit sees on top of the hub. The Darija
  // reuses wording already on the site: the Learn subtitle, the Practice intro
  // and title, the footer's "free in the beta" and the "never buy or sell" line.
  startTitle: { en: 'Start here', fr: 'Commencez ici', ar: 'ابدا من هنا' },
  startBody: {
    en: 'Qirat teaches you trading from zero: two-minute lessons, a practice wallet with 10 pretend dollars at real prices, and an honest risk grade for every coin.',
    fr: 'Qirat vous apprend le trading à partir de zéro : des leçons de deux minutes, un portefeuille d’entraînement de 10 dollars fictifs aux prix réels, et une note de risque honnête pour chaque crypto.',
    ar: 'قيراط يعلّمك الـ trading من الصفر: دروس في دقيقتين، wallet تجريبي فيه 10 دولار بالسوامات الحقيقية، والـ risk متاع كل coin.',
  },
  startLesson: { en: 'Start lesson 1', fr: 'Commencer la leçon 1', ar: 'ابدا الدرس 1' },
  startPractice: { en: 'Practice with $10', fr: 'S’entraîner avec 10 $', ar: 'تدرّب بـ 10 دولار' },
  startNote: {
    en: 'Free during the beta. Qirat never tells you to buy or sell.',
    fr: 'Gratuit pendant la bêta. Qirat ne vous dit jamais d’acheter ou de vendre.',
    ar: 'بلاش في فترة التجربة. قيراط عمرو ما يقلّك اشري ولا بيع.',
  },
  yourKarat: { en: 'Your karat', fr: 'Votre carat', ar: 'القيراط متاعك' },
  karatHint: {
    en: 'You start at 10K. Read lessons and pass their quizzes to rise toward 24K.',
    fr: 'Vous commencez à 10K. Lisez les leçons et réussissez les quiz pour monter vers 24K.',
    ar: 'تبدا من 10K. اقرا الدروس ونجح في الكويز متاعهم باش تطلع لـ 24K.',
  },
  toNext: {
    en: '{n} more steps to {k}K',
    fr: 'Encore {n} étapes avant {k}K',
    ar: 'مازالو {n} خطوات للـ {k}K',
  },
  maxed: {
    en: 'Pure gold. New lessons are on the way.',
    fr: 'Or pur. De nouvelles leçons arrivent.',
    ar: 'ذهب صافي. دروس جدد في الطريق.',
  },
  lessonsDone: { en: '{d} of {n} lessons passed', fr: '{d} leçons réussies sur {n}', ar: '{d} دروس ناجحة من {n}' },
  level10: { en: 'Just starting', fr: 'Tout début', ar: 'توّا بديت' },
  level14: { en: 'Starting to shine', fr: 'Ça commence à briller', ar: 'بديت تلمع' },
  level18: { en: 'Solid gold', fr: 'De l’or solide', ar: 'ذهب صحيح' },
  level22: { en: 'Almost pure', fr: 'Presque pur', ar: 'قريب للصافي' },
  level24: { en: 'Pure gold', fr: 'Or pur', ar: 'ذهب صافي' },
  today: { en: 'Today’s lesson', fr: 'La leçon du jour', ar: 'درس اليوم' },
  allLessons: { en: 'All lessons', fr: 'Toutes les leçons', ar: 'الدروس الكل' },
  minutes: { en: '{n} min read', fr: '{n} min de lecture', ar: 'قراية {n} دقايق' },
  start: { en: 'Start', fr: 'Commencer', ar: 'ابدا' },
  read: { en: 'Read', fr: 'Lu', ar: 'قريتو' },
  passed: { en: 'Passed', fr: 'Réussi', ar: 'نجحت' },
  comingSoon: { en: 'Coming soon', fr: 'Bientôt', ar: 'قريب' },
  inThisLesson: { en: 'What it will cover', fr: 'Au programme', ar: 'شنوّة باش يحكي' },
  back: { en: 'All lessons', fr: 'Toutes les leçons', ar: 'الدروس الكل' },
  lessonN: { en: 'Lesson {n}', fr: 'Leçon {n}', ar: 'الدرس {n}' },
  takeaway: { en: 'The short version', fr: 'En bref', ar: 'الزبدة' },
  tryLive: { en: 'See it live in Qirat', fr: 'À voir en direct dans Qirat', ar: 'شوفها على الحقيقة في قيراط' },
  openCoins: { en: 'Open all coins', fr: 'Voir toutes les cryptos', ar: 'شوف الـ coins الكل' },
  liveLoading: { en: 'Loading today’s data…', fr: 'Chargement des données du jour…', ar: 'نجيبو في معطيات اليوم…' },
  liveTypicalDay: { en: 'A typical day', fr: 'Une journée normale', ar: 'نهار عادي' },
  liveRoughMonth: { en: 'A rough month', fr: 'Un mauvais mois', ar: 'شهر صعيب' },
  liveOn100: {
    en: '100 TND could become about {v} TND',
    fr: '100 TND pourraient devenir environ {v} TND',
    ar: '100 دينار تنجّم تولّي قريب {v} دينار',
  },
  liveRiskiest: { en: 'Riskiest in your list', fr: 'La plus risquée de votre liste', ar: 'الأكثر risk في الليستة متاعك' },
  liveMood: { en: 'Crowd mood (Fear & Greed)', fr: 'Humeur de la foule (Fear & Greed)', ar: 'مزاج الناس (Fear & Greed)' },
  weatherCalm: { en: 'Calm', fr: 'Calme', ar: 'صاحي' },
  weatherChoppy: { en: 'Choppy', fr: 'Agité', ar: 'مغيّم' },
  weatherStormy: { en: 'Stormy', fr: 'Orageux', ar: 'خايب' },
  weatherToday: { en: 'Market weather today', fr: 'La météo du marché aujourd’hui', ar: 'طقس السوق اليوم' },
  karatToday: { en: 'Today’s coins by karat', fr: 'Les cryptos du jour par carat', ar: 'الـ coins متاع اليوم بالقيراط' },
  quiz: { en: 'Quick quiz', fr: 'Petit quiz', ar: 'كويز صغير' },
  quizHint: {
    en: 'Get 2 of 3 right to pass and raise your karat.',
    fr: 'Trouvez 2 réponses sur 3 pour réussir et faire monter votre carat.',
    ar: 'جاوب صحيح على 2 من 3 باش تنجح ويطلع القيراط متاعك.',
  },
  questionN: { en: 'Question {n} of {m}', fr: 'Question {n} sur {m}', ar: 'السؤال {n} من {m}' },
  right: { en: 'Right!', fr: 'Exact !', ar: 'صحيح!' },
  wrong: { en: 'Not quite.', fr: 'Pas tout à fait.', ar: 'موش هي.' },
  next: { en: 'Next question', fr: 'Question suivante', ar: 'السؤال اللي بعدو' },
  seeScore: { en: 'See my score', fr: 'Voir mon score', ar: 'ورّيني النتيجة' },
  score: { en: '{s} of {m} right', fr: '{s} bonnes réponses sur {m}', ar: '{s} صحاح من {m}' },
  passMsg: {
    en: 'Passed. Your karat went up.',
    fr: 'Réussi. Votre carat monte.',
    ar: 'نجحت. القيراط متاعك طلع.',
  },
  passAgainMsg: { en: 'Passed again. Nice.', fr: 'Encore réussi. Bravo.', ar: 'نجحت مرّة أخرى. برافو.' },
  failMsg: {
    en: 'Almost. Reread the lesson and try again: it only takes a minute.',
    fr: 'Presque. Relisez la leçon et réessayez : ça prend une minute.',
    ar: 'قريب. عاود اقرا الدرس وجرّب مرّة أخرى: دقيقة برك.',
  },
  retry: { en: 'Try again', fr: 'Réessayer', ar: 'عاود' },
  nextLesson: { en: 'Next lesson', fr: 'Leçon suivante', ar: 'الدرس اللي بعدو' },
  terms: { en: 'Words in this lesson', fr: 'Les mots de cette leçon', ar: 'الكلمات متاع الدرس' },
  glossary: { en: 'Glossary', fr: 'Glossaire', ar: 'القاموس' },
  glossaryHint: {
    en: 'Every crypto word from the lessons, in plain language.',
    fr: 'Tous les mots crypto des leçons, en langage simple.',
    ar: 'كلمات الـ crypto الكل اللي في الدروس، بالكلام الساهل.',
  },
  search: { en: 'Search a word', fr: 'Chercher un mot', ar: 'لوّج على كلمة' },
  noMatch: { en: 'No word matches that.', fr: 'Aucun mot ne correspond.', ar: 'ما لقينا حتى كلمة.' },
  fromLesson: { en: 'From: {t}', fr: 'Leçon : {t}', ar: 'من درس: {t}' },
  copyLink: { en: 'Copy link', fr: 'Copier le lien', ar: 'انسخ اللينك' },
  copied: { en: 'Link copied', fr: 'Lien copié', ar: 'اللينك تنسخ' },
  notAdvice: {
    en: 'Education only. Not financial advice. Qirat never tells you to buy or sell.',
    fr: 'Éducation uniquement. Pas un conseil financier. Qirat ne vous dit jamais d’acheter ou de vendre.',
    ar: 'تعليم برك. موش نصيحة مالية. قيراط عمرو ما يقلّك اشري ولا بيع.',
  },
  reset: { en: 'Reset my progress', fr: 'Remettre ma progression à zéro', ar: 'رجّع التقدّم متاعي للصفر' },
  resetConfirm: {
    en: 'Start again from 10K?',
    fr: 'Recommencer à 10K ?',
    ar: 'تحب تعاود من 10K؟',
  },
  savedHere: {
    en: 'Progress is saved on this device only, for now.',
    fr: 'La progression est enregistrée sur cet appareil seulement, pour l’instant.',
    ar: 'التقدّم متاعك محفوظ في الجهاز هذا برك، للتوّا.',
  },
} satisfies Record<string, Text>

export type LearnKey = keyof typeof LEARN_UI

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

export const LESSONS: Lesson[] = [
  {
    slug: 'bitcoin',
    minutes: 2,
    title: {
      en: 'What is crypto? Start with Bitcoin',
      fr: 'C’est quoi la crypto ? On commence par le Bitcoin',
      ar: 'شنوّة الـ crypto؟ نبداو بـ Bitcoin',
    },
    hook: {
      en: 'Money that lives on the internet, with no bank in the middle.',
      fr: 'De l’argent qui vit sur internet, sans banque au milieu.',
      ar: 'فلوس تعيش في الإنترنت، من غير بانكة في الوسط.',
    },
    terms: ['crypto', 'blockchain', 'bitcoin', 'satoshi'],
    live: { kind: 'coin', symbol: 'BTC' },
    sections: [
      {
        h: { en: 'Money with no bank in the middle', fr: 'De l’argent sans banque au milieu', ar: 'فلوس من غير بانكة في الوسط' },
        p: {
          en: 'When you send money through a bank, the bank keeps the record of who owns what. Crypto replaces the bank with a shared notebook, copied on thousands of computers around the world. That notebook is called a blockchain. Nobody can secretly erase a line, because everyone has a copy.',
          fr: 'Quand vous envoyez de l’argent par la banque, c’est elle qui tient le registre de qui possède quoi. La crypto remplace la banque par un cahier partagé, copié sur des milliers d’ordinateurs dans le monde. Ce cahier s’appelle une blockchain. Personne ne peut effacer une ligne en douce, car tout le monde en a une copie.',
          ar: 'كي تبعث فلوس بالبانكة، البانكة هي اللي تكتب شكون عندو قدّاش. الـ crypto تبدّل البانكة بكرّاس مشترك، منسوخ على آلاف الـ PC في العالم الكل. الكرّاس هذا اسمو blockchain. حتى حدّ ما ينجّم يفسخ سطر بالخفية، خاطر الناس الكل عندها نسخة.',
        },
      },
      {
        h: { en: 'Bitcoin, the first one', fr: 'Le Bitcoin, le premier', ar: 'Bitcoin، الأوّل' },
        p: {
          en: 'Bitcoin started in 2009. There will never be more than 21 million bitcoins: that limit is written in its code. You don’t have to buy a whole one. You can own a small piece, like 0.001 BTC.',
          fr: 'Le Bitcoin est né en 2009. Il n’y aura jamais plus de 21 millions de bitcoins : cette limite est écrite dans son code. Pas besoin d’en acheter un entier. On peut en posséder un petit morceau, comme 0,001 BTC.',
          ar: 'Bitcoin بدا في 2009. عمرو ما باش يكون فمّا أكثر من 21 مليون bitcoin: الحدّ هذا مكتوب في الـ code متاعو. وموش لازم تشري وحدة كاملة. تنجّم تملك طرف صغير، كيما 0.001 BTC.',
        },
      },
      {
        h: { en: 'Why does it have a price?', fr: 'Pourquoi a-t-il un prix ?', ar: 'علاش عندو سوم؟' },
        p: {
          en: 'There is no factory and no profit behind Bitcoin. Its price is simply what people agree to pay for it today. When more people want it, the price goes up. When they leave, it falls. That is why it can move a lot in a single day.',
          fr: 'Il n’y a ni usine ni bénéfices derrière le Bitcoin. Son prix, c’est simplement ce que les gens acceptent de payer aujourd’hui. Quand plus de monde en veut, le prix monte. Quand les gens partent, il baisse. C’est pour ça qu’il peut beaucoup bouger en une seule journée.',
          ar: 'Bitcoin ما وراه حتى معمل وحتى أرباح. السوم متاعو هو بالضبط قدّاش الناس قابلين يخلّصو فيه اليوم. كي يكثرو اللي يحبّوه، السوم يطلع. وكي يخرجو، يهبط. هذاكا علاش ينجّم يتحرّك برشا في نهار واحد.',
        },
      },
      {
        h: { en: 'Thousands of other coins', fr: 'Des milliers d’autres cryptos', ar: 'آلاف الـ coins الأخرين' },
        p: {
          en: 'Today there are thousands of other cryptos. A few are big and well known. Most are small, and many disappear. New does not mean better.',
          fr: 'Aujourd’hui, il existe des milliers d’autres cryptos. Quelques-unes sont grandes et connues. La plupart sont petites, et beaucoup disparaissent. Nouveau ne veut pas dire meilleur.',
          ar: 'اليوم فمّا آلاف الـ coins الأخرين. شويّة منهم كبار ومعروفين. الأغلبية صغار، وبرشا منهم يندثرو. جديد ما يعنيش خير.',
        },
      },
      {
        h: { en: 'What it is not', fr: 'Ce que ce n’est pas', ar: 'ردّ بالك' },
        p: {
          en: 'Crypto is not a savings account. No bank and no state guarantees its value. If the price drops, nobody pays you back.',
          fr: 'La crypto n’est pas un livret d’épargne. Aucune banque et aucun État ne garantit sa valeur. Si le prix chute, personne ne vous rembourse.',
          ar: 'الـ crypto موش دفتر توفير. حتى بانكة وحتى دولة ما تضمن قيمتها. كان السوم طاح، حتى حدّ ما يرجّعلك فلوسك.',
        },
      },
    ],
    takeaway: {
      en: 'Crypto is a shared record of who owns what. Its price is only what people will pay for it today.',
      fr: 'La crypto, c’est un registre partagé de qui possède quoi. Son prix, c’est seulement ce que les gens paient aujourd’hui.',
      ar: 'الـ crypto هي كرّاس مشترك يكتب شكون يملك شنوّة. والسوم متاعها هو كان اللي الناس قابلين يخلّصوه اليوم.',
    },
    quiz: [
      {
        q: { en: 'What is a blockchain?', fr: 'C’est quoi une blockchain ?', ar: 'شنوّة هو الـ blockchain؟' },
        options: [
          { en: 'A dollar account at a bank', fr: 'Un compte en dollars à la banque', ar: 'كونط بالدولار في البانكة' },
          {
            en: 'A shared record copied on many computers',
            fr: 'Un registre partagé copié sur beaucoup d’ordinateurs',
            ar: 'كرّاس مشترك منسوخ على برشا PC',
          },
          { en: 'An app made by the Bitcoin company', fr: 'Une appli de la société Bitcoin', ar: 'تطبيقة متاع شركة Bitcoin' },
        ],
        answer: 1,
        why: {
          en: 'It is a shared notebook. No single company or bank owns it, and there is no "Bitcoin company".',
          fr: 'C’est un cahier partagé. Aucune entreprise ni banque ne le possède seule, et il n’existe pas de « société Bitcoin ».',
          ar: 'هو كرّاس مشترك. حتى شركة وحتى بانكة ما تملكو وحدها، وما فمّاش «شركة Bitcoin».',
        },
      },
      {
        q: {
          en: 'How many bitcoins can ever exist?',
          fr: 'Combien de bitcoins peuvent exister au maximum ?',
          ar: 'قدّاش من bitcoin ينجّم يكون في الكل؟',
        },
        options: [
          { en: '21 million', fr: '21 millions', ar: '21 مليون' },
          { en: 'No limit', fr: 'Aucune limite', ar: 'بلا حدّ' },
          { en: '1 million', fr: '1 million', ar: 'مليون واحد' },
        ],
        answer: 0,
        why: {
          en: 'The 21 million limit is written in Bitcoin’s code.',
          fr: 'La limite de 21 millions est écrite dans le code du Bitcoin.',
          ar: 'الحدّ متاع 21 مليون مكتوب في الـ code متاع Bitcoin.',
        },
      },
      {
        q: {
          en: 'Do you have to buy a whole bitcoin?',
          fr: 'Faut-il acheter un bitcoin entier ?',
          ar: 'لازم تشري bitcoin كامل؟',
        },
        options: [
          { en: 'Yes, one at a time', fr: 'Oui, un entier à chaque fois', ar: 'إيه، وحدة كاملة' },
          { en: 'Only after one year', fr: 'Seulement après un an', ar: 'كان بعد عام' },
          { en: 'No, you can own a small piece', fr: 'Non, on peut en avoir un petit morceau', ar: 'لا، تنجّم تملك طرف صغير' },
        ],
        answer: 2,
        why: {
          en: 'A bitcoin splits into tiny parts. The smallest one is called a satoshi.',
          fr: 'Un bitcoin se divise en toutes petites parts. La plus petite s’appelle un satoshi.',
          ar: 'الـ bitcoin يتقسم لأطراف صغار برشا. أصغر طرف اسمو satoshi.',
        },
      },
    ],
  },

  {
    slug: 'usdt',
    minutes: 2,
    title: {
      en: 'USDT, the “digital dollar”',
      fr: 'L’USDT, le « dollar numérique »',
      ar: 'USDT، «الدولار الرقمي»',
    },
    hook: {
      en: 'A crypto built to stay at 1 dollar. Useful, but not risk-free.',
      fr: 'Une crypto faite pour rester à 1 dollar. Utile, mais pas sans risque.',
      ar: 'crypto مصنوعة باش تقعد ديما قريب 1 دولار. تنفع، أما موش بلاش risk.',
    },
    terms: ['stablecoin', 'usdt', 'depeg', 'p2p'],
    live: {
      kind: 'view',
      view: 'portfolio',
      label: {
        en: 'See your coins priced in dinars',
        fr: 'Voir vos cryptos en dinars',
        ar: 'شوف الـ coins متاعك بالدينار',
      },
    },
    sections: [
      {
        h: { en: 'What it is', fr: 'Ce que c’est', ar: 'شنوّة هي' },
        p: {
          en: 'USDT, also called Tether, is a stablecoin: a crypto designed to always be worth about 1 US dollar. The company Tether says it keeps dollars and other assets in reserve to back every USDT.',
          fr: 'L’USDT, aussi appelé Tether, est un stablecoin : une crypto conçue pour valoir toujours environ 1 dollar américain. La société Tether affirme garder des dollars et d’autres actifs en réserve pour couvrir chaque USDT.',
          ar: 'USDT، يسمّيوها زادة Tether، هي stablecoin: crypto مصمّمة باش ديما تسوى قريب 1 دولار أمريكي. شركة Tether تقول إنها تخبّي دولارات وأصول أخرى في الاحتياط مقابل كل USDT.',
        },
      },
      {
        h: { en: 'Why people use it', fr: 'Pourquoi on l’utilise', ar: 'علاش الناس يستعملوها' },
        p: {
          en: 'Because its price barely moves, people use USDT to park money between other cryptos, or to get paid from abroad. In Tunisia you hear about it a lot from freelancers and in P2P deals.',
          fr: 'Comme son prix bouge à peine, on utilise l’USDT pour garer de l’argent entre deux cryptos, ou pour être payé depuis l’étranger. En Tunisie, on en entend beaucoup parler chez les freelances et dans les échanges P2P.',
          ar: 'خاطر السوم متاعها تقريب ما يتحرّكش، الناس يستعملو USDT باش يحطّو فيها فلوسهم بين crypto وأخرى، ولا باش يقبضو خلاصهم من برّا. في تونس تسمع بيها برشا عند الـ freelancers وفي صفقات الـ P2P.',
        },
      },
      {
        h: { en: 'Stable is not the same as safe', fr: 'Stable ne veut pas dire sûr', ar: 'ثابت موش معناها مضمون' },
        p: {
          en: 'USDT depends on one company keeping its promise. Other stablecoins have broken: in 2022, TerraUSD (UST) was supposed to stay at $1 and crashed to almost zero within days. USDT itself has dipped slightly below $1 for short periods in the past.',
          fr: 'L’USDT dépend d’une seule entreprise qui doit tenir sa promesse. D’autres stablecoins ont cassé : en 2022, TerraUSD (UST) devait rester à 1 $ et s’est effondré presque à zéro en quelques jours. L’USDT lui-même est déjà passé un peu sous 1 $ pendant de courtes périodes.',
          ar: 'USDT مربوطة بشركة وحدة لازمها توفي بوعدها. stablecoins أخرين طاحو: في 2022، TerraUSD (UST) كان المفروض يقعد على 1$ وطاح لقريب الصفر في أيّامات. وUSDT بيدها هبطت شويّة تحت 1$ لمدّة قصيرة في اللي فات.',
        },
      },
      {
        h: { en: 'It does not grow', fr: 'Il ne grossit pas', ar: 'ما تكبرش' },
        p: {
          en: 'USDT is built to stay flat. If someone promises you “20% a month on your USDT”, that extra money has to come from somewhere. It is a classic sign of a scam (see the scam lesson).',
          fr: 'L’USDT est fait pour rester plat. Si quelqu’un vous promet « 20 % par mois sur vos USDT », cet argent en plus doit bien venir de quelque part. C’est un signe classique d’arnaque (voir la leçon sur les arnaques).',
          ar: 'USDT مصنوعة باش تقعد كيما هي. كان واحد وعدك بـ«20% في الشهر على الـ USDT متاعك»، الفلوس الزايدة لازم تجي من بلاصة. هذي علامة كلاسيكية متاع تحيّل (شوف درس التحيّل).',
        },
      },
      {
        h: { en: 'The dinar side', fr: 'Côté dinar', ar: 'من جيهة الدينار' },
        p: {
          en: 'When you buy USDT with dinars from a person, the rate they charge can be far above the official rate. You can lose money on the exchange itself, even while USDT stays at $1.',
          fr: 'Quand on achète de l’USDT en dinars auprès d’une personne, le taux demandé peut être bien au-dessus du taux officiel. On peut perdre de l’argent sur le change lui-même, même si l’USDT reste à 1 $.',
          ar: 'كي تشري USDT بالدينار من عند شخص، السوم اللي يحسبهولك ينجّم يكون فوق السوم الرسمي برشا. تنجّم تخسر فلوس في الصرف بيدو، حتى كان USDT قاعدة على 1$.',
        },
      },
    ],
    takeaway: {
      en: 'USDT tries to stay at $1. It does not earn money on its own, and it relies on one company’s promise.',
      fr: 'L’USDT essaie de rester à 1 $. Il ne rapporte rien tout seul, et il repose sur la promesse d’une seule entreprise.',
      ar: 'USDT تحاول تقعد على 1$. ما تربحش وحدها، ومربوطة بوعد شركة وحدة.',
    },
    quiz: [
      {
        q: {
          en: 'What is USDT designed to be worth?',
          fr: 'Combien l’USDT est-il censé valoir ?',
          ar: 'قدّاش المفروض تسوى USDT؟',
        },
        options: [
          { en: 'The same as Bitcoin', fr: 'Autant que le Bitcoin', ar: 'كيف Bitcoin' },
          { en: 'About 1 US dollar', fr: 'Environ 1 dollar américain', ar: 'قريب 1 دولار أمريكي' },
          { en: '1 Tunisian dinar', fr: '1 dinar tunisien', ar: '1 دينار تونسي' },
        ],
        answer: 1,
        why: {
          en: 'USDT is a stablecoin that tracks the US dollar.',
          fr: 'L’USDT est un stablecoin qui suit le dollar américain.',
          ar: 'USDT هي stablecoin تتبّع الدولار الأمريكي.',
        },
      },
      {
        q: {
          en: 'Someone offers you 20% a month on your USDT. What does that tell you?',
          fr: 'Quelqu’un vous propose 20 % par mois sur vos USDT. Qu’est-ce que ça vous dit ?',
          ar: 'واحد عرض عليك 20% في الشهر على الـ USDT متاعك. شنوّة هذا يقلّك؟',
        },
        options: [
          { en: 'It is a big warning sign', fr: 'C’est un gros signal d’alarme', ar: 'علامة خطر كبيرة' },
          { en: 'It is a normal stablecoin rate', fr: 'C’est un taux normal pour un stablecoin', ar: 'هذا العادي في الـ stablecoins' },
          { en: 'It is a good deal to take fast', fr: 'C’est une bonne affaire à saisir vite', ar: 'فرصة لازم تلحقها فيسع' },
        ],
        answer: 0,
        why: {
          en: 'USDT is built not to grow. High fixed returns are how scams pull people in.',
          fr: 'L’USDT est fait pour ne pas grossir. Les gros rendements fixes, c’est l’appât des arnaques.',
          ar: 'USDT مصنوعة باش ما تكبرش. الأرباح الكبار والثابتة هي الطُعم متاع التحيّل.',
        },
      },
      {
        q: {
          en: 'Can a stablecoin lose its $1 value?',
          fr: 'Un stablecoin peut-il perdre sa valeur de 1 $ ?',
          ar: 'stablecoin تنجّم تخسر قيمة الـ 1$ متاعها؟',
        },
        options: [
          { en: 'Never, it is guaranteed', fr: 'Jamais, c’est garanti', ar: 'أبداً، مضمونة' },
          { en: 'Only on weekends', fr: 'Seulement le week-end', ar: 'كان في الويكاند' },
          { en: 'Yes, it has happened', fr: 'Oui, c’est déjà arrivé', ar: 'إيه، صارت قبل' },
        ],
        answer: 2,
        why: {
          en: 'TerraUSD collapsed in 2022. A stablecoin is only as stable as the promise behind it.',
          fr: 'TerraUSD s’est effondré en 2022. Un stablecoin n’est stable que si la promesse derrière tient.',
          ar: 'TerraUSD طاح في 2022. الـ stablecoin ثابتة قدّ ما الوعد اللي وراها ثابت.',
        },
      },
    ],
  },

  {
    slug: 'price-swings',
    minutes: 2,
    title: {
      en: 'Why crypto prices swing so much',
      fr: 'Pourquoi les prix crypto bougent autant',
      ar: 'علاش سوم الـ crypto يطلع ويهبط برشا؟',
    },
    hook: {
      en: 'A normal day for some coins would be a crisis day for a stock. Here is how to read it.',
      fr: 'Une journée normale pour certaines cryptos serait une journée de crise pour une action. Voici comment la lire.',
      ar: 'نهار عادي لبعض الـ coins هو نهار أزمة لسهم في البورصة. هاو كيفاش تقراه.',
    },
    terms: ['volatility', 'risk-grade', 'rough-month', 'liquidity'],
    live: { kind: 'risk' },
    sections: [
      {
        h: { en: 'Small market, big crowd', fr: 'Petit marché, grande foule', ar: 'سوق صغير، وناس برشا' },
        p: {
          en: 'Compared with gold or big company shares, most cryptos are small markets. When many people buy or sell at the same time, the price jumps or drops fast. A news story, a rumour, one big holder selling, or a single post can move it.',
          fr: 'Comparées à l’or ou aux actions des grandes entreprises, la plupart des cryptos sont de petits marchés. Quand beaucoup de gens achètent ou vendent en même temps, le prix bondit ou chute vite. Une info, une rumeur, un gros détenteur qui vend ou un seul post peuvent le faire bouger.',
          ar: 'مقارنة بالذهب ولا بأسهم الشركات الكبار، أغلب الـ crypto أسواق صغيرة. كي برشا ناس يشريو ولا يبيعو في نفس الوقت، السوم يطير ولا يطيح فيسع. خبر، إشاعة، واحد عندو برشا يبيع، ولا post واحد، ينجّم يحرّكو.',
        },
      },
      {
        h: { en: 'Open 24/7', fr: 'Ouvert 24 h/24, 7 j/7', ar: 'محلول 24 ساعة على 24' },
        p: {
          en: 'Crypto never closes. Prices move at night and on weekends, so you can wake up to a big move.',
          fr: 'La crypto ne ferme jamais. Les prix bougent la nuit et le week-end : on peut se réveiller avec un gros mouvement.',
          ar: 'الـ crypto عمرها ما تسكّر. السوم يتحرّك في الليل وفي الويكاند، وتنجّم تفيق الصباح تلقى حركة كبيرة.',
        },
      },
      {
        h: { en: 'Volatility in plain words', fr: 'La volatilité, en clair', ar: 'الـ volatility بالكلام الساهل' },
        p: {
          en: 'Volatility means how much a price usually moves. Qirat shows it as “a typical day”: ±2% means that on a normal day the price goes up or down about 2%. A small coin can move ±8% on a normal day.',
          fr: 'La volatilité, c’est l’ampleur habituelle des mouvements d’un prix. Qirat l’affiche comme « une journée normale » : ±2 % veut dire qu’un jour normal, le prix monte ou baisse d’environ 2 %. Une petite crypto peut bouger de ±8 % un jour normal.',
          ar: 'الـ volatility معناها قدّاش السوم يتحرّك عادةً. قيراط يورّيها «نهار عادي»: ±2% معناها في نهار عادي السوم يطلع ولا يهبط قريب 2%. coin صغيرة تنجّم تتحرّك ±8% في نهار عادي.',
        },
      },
      {
        h: { en: 'What is the “rough month”?', fr: 'C’est quoi le « mauvais mois » ?', ar: 'شنوّة «الشهر الصعيب»؟' },
        p: {
          en: 'Imagine you kept a coin for 20 months. Most months are ordinary: up a bit, down a bit. But about one month out of those 20 goes really badly. The “rough month” is how much you could lose in that one bad month. Qirat works it out from how much the coin has been moving lately, so a wild coin gets a deeper rough month than a calm one.',
          fr: 'Imaginez que vous gardez une crypto pendant 20 mois. La plupart des mois sont ordinaires : un peu de hausse, un peu de baisse. Mais environ un mois sur ces 20 se passe vraiment mal. Le « mauvais mois », c’est ce que vous pourriez perdre pendant ce mois-là. Qirat le calcule à partir de ce que la crypto a bougé récemment : une crypto agitée a un mauvais mois plus profond qu’une crypto calme.',
          ar: 'تخيّل إنك خلّيت coin عندك 20 شهر. أغلب الشهور عاديين: شويّة طلوع، شويّة هبوط. أما تقريب شهر واحد من العشرين يجي خايب برشا. «الشهر الصعيب» هو قدّاش تنجّم تخسر في الشهر الخايب هذاكا. قيراط يحسبو من قدّاش الـ coin تتحرّك في الوقت الأخير، يعني coin تتقلّب برشا يكون الشهر الصعيب متاعها أعمق من coin هادية.',
        },
      },
      {
        h: { en: 'An example in dinars', fr: 'Un exemple en dinars', ar: 'مثال بالدينار' },
        p: {
          en: 'Say a coin’s rough month is −30% and you put 100 TND in it. In a bad month like that, you could be left with about 70 TND. For a high-risk coin the rough month can be −50% or worse: 100 TND becomes 50. Two things to remember: it is not the worst that can happen, because crypto can fall even more, and it comes from the past, so it is not a forecast. Its job is to let you picture the drop before you put money in.',
          fr: 'Disons que le mauvais mois d’une crypto est à −30 % et que vous y mettez 100 TND. Dans un mauvais mois comme ça, il pourrait vous rester environ 70 TND. Pour une crypto à risque élevé, le mauvais mois peut être à −50 % ou pire : 100 TND deviennent 50. Deux choses à retenir : ce n’est pas le pire possible, une crypto peut tomber encore plus bas, et ça vient du passé, ce n’est donc pas une prévision. Ça sert à imaginer la baisse avant de mettre de l’argent.',
          ar: 'نقولو الشهر الصعيب متاع coin هو −30%، وحطّيت فيها 100 دينار. في شهر خايب كيما هكّا، تنجّم تلقى روحك بقريب 70 دينار. في coin الـ risk متاعها عالي، الشهر الصعيب ينجّم يكون −50% ولا أكثر: الـ 100 دينار تولّي 50. ردّ بالك من حاجتين: هذا موش أخيب حاجة تنجّم تصير، الـ crypto تنجّم تطيح أكثر، وهو محسوب من اللي فات، يعني موش توقّع. الفايدة منو إنك تتخيّل الطيحة قبل ما تحطّ فلوسك.',
        },
      },
      {
        h: { en: 'Why it matters', fr: 'Pourquoi c’est important', ar: 'علاش هذا مهم' },
        p: {
          en: 'If a −30% month would make you panic, a high-risk coin will be hard to live with. Knowing the swing in advance helps you stay calm when it comes.',
          fr: 'Si un mois à −30 % vous ferait paniquer, une crypto à risque élevé sera difficile à vivre. Connaître les variations à l’avance aide à rester calme quand elles arrivent.',
          ar: 'كان شهر بـ −30% يخوّفك، الـ coin اللي الـ risk متاعها عالي باش تكون صعيبة عليك. كي تعرف الحركة من قبل، تقعد مرتاح كي تجي.',
        },
      },
    ],
    takeaway: {
      en: 'Look at the risk before the price. Ask yourself: could I live with the rough month on my amount?',
      fr: 'Regardez le risque avant le prix. Demandez-vous : est-ce que je supporterais le mauvais mois sur mon montant ?',
      ar: 'شوف الـ risk قبل السوم. واسأل روحك: نجّم نعيش مع الشهر الصعيب على المبلغ متاعي؟',
    },
    quiz: [
      {
        q: {
          en: 'A coin shows “±6% on a typical day”. What does that mean?',
          fr: 'Une crypto affiche « ±6 % une journée normale ». Ça veut dire quoi ?',
          ar: 'coin مكتوب عليها «±6% في نهار عادي». شنوّة معناها؟',
        },
        options: [
          { en: 'It gains 6% every day', fr: 'Elle gagne 6 % chaque jour', ar: 'تربح 6% كل نهار' },
          {
            en: 'It moves up or down about 6% on a normal day',
            fr: 'Elle monte ou baisse d’environ 6 % un jour normal',
            ar: 'تطلع ولا تهبط قريب 6% في نهار عادي',
          },
          { en: 'It is 6% cheaper today', fr: 'Elle est 6 % moins chère aujourd’hui', ar: 'أرخص بـ 6% اليوم' },
        ],
        answer: 1,
        why: {
          en: 'A typical day is the usual size of the move, in either direction. It is not a gain.',
          fr: 'La journée normale, c’est l’ampleur habituelle du mouvement, dans un sens ou dans l’autre. Ce n’est pas un gain.',
          ar: 'النهار العادي هو قدّاش تتحرّك عادةً، لفوق ولا للوطا. موش ربح.',
        },
      },
      {
        q: {
          en: 'The rough month is −40%. On 100 TND, a month like that could leave you with about…',
          fr: 'Le mauvais mois est à −40 %. Sur 100 TND, un mois comme ça pourrait vous laisser environ…',
          ar: 'الشهر الصعيب −40%. على 100 دينار، شهر كيما هكّا ينجّم يخلّيلك قريب…',
        },
        options: [
          { en: '60 TND', fr: '60 TND', ar: '60 دينار' },
          { en: '140 TND', fr: '140 TND', ar: '140 دينار' },
          { en: '96 TND', fr: '96 TND', ar: '96 دينار' },
        ],
        answer: 0,
        why: {
          en: '100 TND minus 40% is 60 TND. That is the kind of month to picture before you put money in.',
          fr: '100 TND moins 40 %, ça fait 60 TND. C’est le genre de mois à imaginer avant de mettre de l’argent.',
          ar: '100 دينار ناقص 40% تعمل 60 دينار. هذا نوع الشهر اللي لازم تتخيّلو قبل ما تحطّ فلوس.',
        },
      },
      {
        q: {
          en: 'Why can crypto prices move in the middle of the night?',
          fr: 'Pourquoi les prix crypto peuvent-ils bouger en pleine nuit ?',
          ar: 'علاش سوم الـ crypto ينجّم يتحرّك في نصّ الليل؟',
        },
        options: [
          { en: 'Banks change the prices at night', fr: 'Les banques changent les prix la nuit', ar: 'البانكات يبدّلو السوم في الليل' },
          { en: 'It does not, only in the daytime', fr: 'Ils ne bougent pas, seulement le jour', ar: 'ما يتحرّكش، كان في النهار' },
          { en: 'Crypto trades 24/7', fr: 'La crypto s’échange 24 h/24, 7 j/7', ar: 'الـ crypto تتباع وتتشرى 24/7' },
        ],
        answer: 2,
        why: {
          en: 'Crypto markets never close, so people trade at any hour, in every time zone.',
          fr: 'Les marchés crypto ne ferment jamais : on échange à toute heure, dans tous les fuseaux horaires.',
          ar: 'أسواق الـ crypto عمرها ما تسكّر، الناس تتعامل في أي ساعة ومن كل بلاصة في العالم.',
        },
      },
    ],
  },

  {
    slug: 'scams',
    minutes: 2,
    title: {
      en: 'How scammers find you',
      fr: 'Comment les arnaqueurs vous trouvent',
      ar: 'كيفاش يلقاوك المتحيّلين',
    },
    hook: {
      en: 'They don’t wait for you. They message first, promise big, and rush you.',
      fr: 'Ils n’attendent pas que vous veniez. Ils écrivent en premier, promettent gros et vous pressent.',
      ar: 'ما يستنّاوكش. يبعثولك هوما الأوّلين، يوعدوك بالبرشا، ويزربوك.',
    },
    terms: ['signals', 'ponzi', 'fake-platform', 'phishing', 'p2p'],
    live: {
      kind: 'view',
      view: 'scamcheck',
      label: {
        en: 'Got a strange message? Check it for red flags',
        fr: 'Un message bizarre ? Vérifiez les signaux d’alerte',
        ar: 'جاك ميساج غريب؟ فركسو في فحص الاحتيال',
      },
    },
    sections: [
      {
        h: { en: 'The VIP group', fr: 'Le groupe VIP', ar: 'القروب الـ VIP' },
        p: {
          en: 'You get a message, or you find yourself added to a WhatsApp or Telegram group full of “members” posting screenshots of profits. Many are fake or paid accounts. The “coach” offers VIP signals for a fee, or asks you to send money so he can “manage” it for you.',
          fr: 'Vous recevez un message, ou vous vous retrouvez ajouté à un groupe WhatsApp ou Telegram plein de « membres » qui postent des captures de gains. Beaucoup sont des comptes faux ou payés. Le « coach » propose des signaux VIP payants, ou vous demande d’envoyer de l’argent pour le « gérer » à votre place.',
          ar: 'جاك ميساج، ولا لقيت روحك مزيود في قروب WhatsApp ولا Telegram مليان «أعضاء» يحطّو screenshots متاع أرباح. برشا منهم حسابات فالصو ولا مخلّصين. «الكوتش» يعرض عليك signals VIP بالفلوس، ولا يطلب منك تبعثلو فلوس باش «يخدّمهملك».',
        },
      },
      {
        h: { en: '“Guaranteed profit”', fr: '« Profit garanti »', ar: '«ربح مضمون»' },
        p: {
          en: '“5% a day.” “Double your money in a week.” “Zero risk.” Nobody can guarantee crypto profits: a promise like that is the scam itself. Often the first members are paid with the money of those who joined later (a Ponzi scheme), until the whole thing collapses.',
          fr: '« 5 % par jour. » « Doublez votre argent en une semaine. » « Zéro risque. » Personne ne peut garantir des gains en crypto : une telle promesse, c’est l’arnaque elle-même. Souvent, les premiers membres sont payés avec l’argent des suivants (une chaîne de Ponzi), jusqu’à ce que tout s’écroule.',
          ar: '«ربح 5% كل نهار»، «ضاعف فلوسك في جمعة»، «ما فمّا حتى risk». حتى حدّ ما ينجّم يضمن أرباح في الـ crypto: وعد كيما هذا هو التحيّل بيدو. برشا مرّات الأوائل يتخلّصو بفلوس اللي جاو بعدهم (Ponzi)، حتى تطيح القصّة الكل.',
        },
      },
      {
        h: { en: 'Fake platforms', fr: 'Les fausses plateformes', ar: 'منصّات فالصو' },
        p: {
          en: 'A slick website or app shows your balance growing. When you try to withdraw, they ask for a “tax” or an “unlock fee” first. Then another one. The money was never there. Some fake login pages also copy a real exchange to steal your password. Before anything, check the name against the CMF’s warnings and search for “name + arnaque”.',
          fr: 'Un site ou une appli soignée montre votre solde qui grimpe. Quand vous voulez retirer, on vous demande d’abord une « taxe » ou des « frais de déblocage ». Puis d’autres. L’argent n’a jamais existé. Certaines fausses pages de connexion copient aussi une vraie plateforme pour voler votre mot de passe. Avant tout, vérifiez le nom dans les mises en garde du CMF et cherchez « nom + arnaque ».',
          ar: 'موقع ولا تطبيقة شابّة تورّيك الرصيد متاعك يكبر. كي تحب تسحب، يطلبو منك «أداء» ولا «frais de déblocage» قبل. ومن بعد واحد آخر. الفلوس عمرها ما كانت موجودة. وفمّا زادة صفحات login فالصو تقلّد منصّة معروفة باش تسرق الـ password متاعك. قبل كل شي، فركس الإسم في تحذيرات الـ CMF ولوّج على «الإسم + arnaque».',
        },
      },
      {
        h: { en: 'P2P meetups', fr: 'Les rendez-vous P2P', ar: 'لقاءات الـ P2P' },
        p: {
          en: '“Cheap USDT, meet me in person and bring cash.” In Tunisia, some of these meetups turned into robberies. A price far below the market is the bait.',
          fr: '« USDT pas cher, on se voit en vrai, apporte du cash. » En Tunisie, certains de ces rendez-vous ont tourné au braquage. Un prix très en dessous du marché, c’est l’appât.',
          ar: '«USDT رخيص، نتلاقاو وجهاً لوجه وجيب الكاش.» في تونس، شويّة من اللقاءات هاذي ولّات براكاج. سوم أرخص برشا من السوق هو الطُعم.',
        },
      },
      {
        h: { en: 'The 3 red flags', fr: 'Les 3 signaux d’alarme', ar: 'الثلاثة علامات الحمراء' },
        p: {
          en: '1) They contacted you first. 2) They promise sure or fast profit. 3) They rush you (“today only”, “last places”). One flag is enough to stop. Qirat never messages you first and never asks you for money.',
          fr: '1) Ils vous ont contacté en premier. 2) Ils promettent un gain sûr ou rapide. 3) Ils vous pressent (« aujourd’hui seulement », « dernières places »). Un seul signal suffit pour s’arrêter. Qirat ne vous écrit jamais en premier et ne vous demande jamais d’argent.',
          ar: '1) هوما اللي بعثولك الأوّلين. 2) يوعدوك بربح مضمون ولا سريع. 3) يزربوك («كان اليوم»). علامة وحدة تكفي باش توقف. قيراط عمرو ما يبعثلك هو الأوّل وعمرو ما يطلب منك فلوس.',
        },
      },
    ],
    takeaway: {
      en: 'A message from a stranger + a promise + a rush = stop. Real investing comes with no guarantees.',
      fr: 'Un message d’inconnu + une promesse + de la pression = stop. Un vrai investissement n’a jamais de garantie.',
      ar: 'ميساج من غريب + وعد + زربة = وقّف. الاستثمار الحقيقي ما فيهش ضمانات.',
    },
    quiz: [
      {
        q: {
          en: 'A stranger adds you to a Telegram group with daily profit screenshots. What is the safest reaction?',
          fr: 'Un inconnu vous ajoute à un groupe Telegram avec des captures de gains chaque jour. Quelle est la réaction la plus sûre ?',
          ar: 'واحد ما تعرفوش زادك لقروب Telegram فيه screenshots أرباح كل نهار. شنوّة أسلم حاجة تعملها؟',
        },
        options: [
          { en: 'Send a small amount to test it', fr: 'Envoyer un petit montant pour tester', ar: 'تبعث مبلغ صغير تجرّب' },
          { en: 'Treat it as a red flag and leave', fr: 'Y voir un signal d’alarme et partir', ar: 'تعتبرها علامة حمراء وتخرج' },
          { en: 'Join the VIP before places run out', fr: 'Rejoindre le VIP avant qu’il n’y ait plus de place', ar: 'تدخل الـ VIP قبل ما تفوتك' },
        ],
        answer: 1,
        why: {
          en: 'Screenshots are easy to fake, and a “small test” deposit is how many people get hooked.',
          fr: 'Les captures se truquent facilement, et le « petit dépôt pour tester » est souvent le début du piège.',
          ar: 'الـ screenshots ساهلين باش يتفبركو، و«المبلغ الصغير للتجربة» هو كيفاش برشا ناس يطيحو في الفخ.',
        },
      },
      {
        q: {
          en: 'A platform says you must pay a fee before you can withdraw your profits. What is most likely going on?',
          fr: 'Une plateforme dit qu’il faut payer des frais avant de retirer vos gains. Que se passe-t-il probablement ?',
          ar: 'منصّة تقلّك لازم تخلّص frais قبل ما تسحب أرباحك. شنوّة الأرجح؟',
        },
        options: [
          { en: 'A normal bank tax', fr: 'Une taxe bancaire normale', ar: 'أداء بنكي عادي' },
          { en: 'A Bitcoin rule', fr: 'Une règle du Bitcoin', ar: 'قانون متاع Bitcoin' },
          { en: 'A scam that will keep asking for more', fr: 'Une arnaque qui demandera toujours plus', ar: 'تحيّل باش يقعد يطلب أكثر' },
        ],
        answer: 2,
        why: {
          en: 'Fake platforms invent fees to squeeze out more money. The “profits” on screen were never real.',
          fr: 'Les fausses plateformes inventent des frais pour soutirer encore plus. Les « gains » affichés n’ont jamais existé.',
          ar: 'المنصّات الفالصو يخترعو frais باش ياخذو أكثر. «الأرباح» اللي على الشاشة عمرها ما كانت حقيقية.',
        },
      },
      {
        q: {
          en: 'Which of these is a red flag?',
          fr: 'Lequel de ces messages est un signal d’alarme ?',
          ar: 'شكون فيهم علامة حمراء؟',
        },
        options: [
          { en: '“Guaranteed 5% a day”', fr: '« 5 % garantis par jour »', ar: '«5% مضمونة كل نهار»' },
          { en: '“Prices can go down”', fr: '« Les prix peuvent baisser »', ar: '«السوم ينجّم يهبط»' },
          { en: '“Only put in what you can lose”', fr: '« Ne mettez que ce que vous pouvez perdre »', ar: '«ما تحطّ كان اللي تنجّم تخسرو»' },
        ],
        answer: 0,
        why: {
          en: 'Nobody can guarantee a crypto return. The other two are honest warnings.',
          fr: 'Personne ne peut garantir un rendement crypto. Les deux autres sont des avertissements honnêtes.',
          ar: 'حتى حدّ ما ينجّم يضمن ربح في الـ crypto. الزوز الأخرين تحذيرات صادقة.',
        },
      },
    ],
  },

  {
    slug: 'fomo',
    minutes: 2,
    title: {
      en: 'FOMO: why buying after a big jump hurts',
      fr: 'Le FOMO : pourquoi acheter après une grosse hausse fait mal',
      ar: 'الـ FOMO: علاش الشراية بعد طلعة كبيرة توجع',
    },
    hook: {
      en: 'When everyone is talking about a coin, most of the move has often already happened.',
      fr: 'Quand tout le monde parle d’une crypto, la plus grosse partie du mouvement est souvent déjà passée.',
      ar: 'كي الناس الكل تحكي على coin، برشا مرّات أغلب الطلعة تكون فاتت.',
    },
    terms: ['fomo', 'fear-greed', 'pullback'],
    live: { kind: 'weather' },
    sections: [
      {
        h: { en: 'What FOMO is', fr: 'C’est quoi le FOMO', ar: 'شنوّة الـ FOMO' },
        p: {
          en: 'Fear Of Missing Out: the feeling you get when a coin is up 50% this week, your friends are all posting about it, and you feel you have to get in right now.',
          fr: 'Fear Of Missing Out, la peur de rater le coche : ce que vous ressentez quand une crypto a pris 50 % cette semaine, que vos amis en parlent tous et que vous sentez qu’il faut y aller tout de suite.',
          ar: 'Fear Of Missing Out: الخوف لا يفوتك القطار. كي coin طلعت 50% هالجمعة، صحابك الكل يحكيو عليها، وتحسّ لازمك تدخل توّا.',
        },
      },
      {
        h: { en: 'Why it hurts', fr: 'Pourquoi ça fait mal', ar: 'علاش يوجع' },
        p: {
          en: 'Big jumps attract late buyers, and early buyers often sell to them. After a fast rise, sharp drops are common: the price can fall back soon after you buy, and then fear pushes you to sell low. Buying high and selling low is the opposite of what anyone wants.',
          fr: 'Les grosses hausses attirent les acheteurs tardifs, et les premiers leur revendent souvent. Après une montée rapide, les chutes brutales sont fréquentes : le prix peut redescendre juste après votre achat, puis la peur pousse à vendre bas. Acheter haut et vendre bas, c’est l’inverse de ce que tout le monde veut.',
          ar: 'الطلعات الكبار يجيبو الناس اللي يدخلو متأخرين، واللي دخلو بكري برشا مرّات يبيعولهم. بعد طلعة سريعة، الطيحات القوية تولّي عادية: السوم ينجّم يرجع لتالي شويّة بعد ما تشري، ومن بعد الخوف يخلّيك تبيع رخيص. تشري غالي وتبيع رخيص: العكس متاع اللي يحب عليه أي واحد.',
        },
      },
      {
        h: { en: 'The crowd’s mood', fr: 'L’humeur de la foule', ar: 'مزاج الناس' },
        p: {
          en: 'Qirat’s market weather and the Fear & Greed index measure the crowd’s mood. When greed is extreme, pullbacks have tended to come more often. That is when the weather can turn “choppy” even while prices are still rising.',
          fr: 'La météo du marché de Qirat et l’indice Fear & Greed mesurent l’humeur de la foule. Quand l’avidité est extrême, les replis ont eu tendance à arriver plus souvent. C’est là que la météo peut passer à « agité » même si les prix montent encore.',
          ar: 'الطقس متاع السوق في قيراط ومؤشّر Fear & Greed يقيسو مزاج الناس. كي الطمع يوصل للآخر، الرجوع لتالي عادةً يجي أكثر. وقتها الطقس ينجّم يولّي «مغيّم» حتى كان السوم مازال طالع.',
        },
      },
      {
        h: { en: 'A calm routine', fr: 'Une routine calme', ar: 'روتين يهدّي' },
        p: {
          en: 'Before any decision, wait 24 hours. Write down why you want it, and what you would do if it fell 30%. Look at its risk grade and its rough month (what you could lose in a bad month; see lesson 3). If the only reason is “everyone is buying”, that is FOMO talking.',
          fr: 'Avant toute décision, attendez 24 heures. Écrivez pourquoi vous la voulez, et ce que vous feriez si elle perdait 30 %. Regardez sa note de risque et son mauvais mois (ce que vous pourriez perdre pendant un mauvais mois ; voir la leçon 3). Si la seule raison est « tout le monde achète », c’est le FOMO qui parle.',
          ar: 'قبل أي قرار، استنّى 24 ساعة. اكتب علاش تحبّها، وشنوّة باش تعمل كان طاحت 30%. شوف الـ risk متاعها والشهر الصعيب متاعها (قدّاش تنجّم تخسر في شهر خايب، شوف الدرس 3). كان السبب الوحيد «الناس الكل تشري»، هذاكا الـ FOMO اللي يحكي.',
        },
      },
      {
        h: { en: 'Missing out is fine', fr: 'Rater, ce n’est pas grave', ar: 'فاتتك؟ عادي' },
        p: {
          en: 'There will always be another coin and another week. A jump you missed costs you nothing. Chasing one can cost you a lot.',
          fr: 'Il y aura toujours une autre crypto et une autre semaine. Une hausse ratée ne vous coûte rien. En courir une peut coûter cher.',
          ar: 'ديما باش يكون فمّا coin أخرى وجمعة أخرى. طلعة فاتتك ما تكلّفك شي. أما كي تجري وراها، تنجّم تكلّفك برشا.',
        },
      },
    ],
    takeaway: {
      en: 'Big jump + loud crowd = slow down. A move you missed costs you nothing.',
      fr: 'Grosse hausse + foule bruyante = ralentir. Un mouvement raté ne coûte rien.',
      ar: 'طلعة كبيرة + ناس تعيّط = خفّف. حركة فاتتك ما تكلّفك حتى شي.',
    },
    quiz: [
      {
        q: { en: 'Which thought is FOMO talking?', fr: 'Quelle pensée est le FOMO qui parle ?', ar: 'أما فكرة هي الـ FOMO اللي يحكي؟' },
        options: [
          { en: '“Let me check its rough month first”', fr: '« Je regarde d’abord son mauvais mois »', ar: '«خلّيني نشوف الشهر الصعيب متاعها قبل»' },
          { en: '“I’ll wait 24 hours”', fr: '« J’attends 24 heures »', ar: '«باش نستنّى 24 ساعة»' },
          { en: '“I must get in now before it’s too late”', fr: '« Il faut y aller maintenant avant qu’il soit trop tard »', ar: '«لازم ندخل توّا قبل ما يفوت الوقت»' },
        ],
        answer: 2,
        why: {
          en: 'Urgency with no reason except “it’s going up” is the signature of FOMO.',
          fr: 'L’urgence sans autre raison que « ça monte », c’est la signature du FOMO.',
          ar: 'الزربة بلا سبب كان «راهي طالعة» هي الإمضاء متاع الـ FOMO.',
        },
      },
      {
        q: {
          en: 'What often happens after a very fast rise?',
          fr: 'Que se passe-t-il souvent après une montée très rapide ?',
          ar: 'شنوّة يصير برشا مرّات بعد طلعة سريعة برشا؟',
        },
        options: [
          { en: 'Sharp drops become more common', fr: 'Les chutes brutales deviennent plus fréquentes', ar: 'الطيحات القوية تولّي أكثر' },
          { en: 'Prices always keep rising', fr: 'Les prix continuent toujours de monter', ar: 'السوم ديما يكمّل يطلع' },
          { en: 'The price gets frozen', fr: 'Le prix est gelé', ar: 'السوم يتجمّد' },
        ],
        answer: 0,
        why: {
          en: 'Fast rises pull in late buyers, and early buyers often take their profit. The price can fall back quickly.',
          fr: 'Les montées rapides attirent les retardataires, et les premiers prennent souvent leurs gains. Le prix peut vite redescendre.',
          ar: 'الطلعات السريعة يجيبو المتأخرين، واللي دخلو بكري برشا مرّات ياخذو أرباحهم. السوم ينجّم يرجع لتالي فيسع.',
        },
      },
      {
        q: {
          en: 'What does missing a big jump cost you?',
          fr: 'Que vous coûte une grosse hausse ratée ?',
          ar: 'طلعة كبيرة فاتتك، قدّاش تكلّفك؟',
        },
        options: [
          { en: 'A fee', fr: 'Des frais', ar: 'frais' },
          { en: 'Nothing', fr: 'Rien', ar: 'حتى شي' },
          { en: 'Your account', fr: 'Votre compte', ar: 'الكونط متاعك' },
        ],
        answer: 1,
        why: {
          en: 'You lose no money by missing a move. Chasing it is what can cost you.',
          fr: 'On ne perd pas d’argent en ratant un mouvement. C’est le fait de courir après qui peut coûter.',
          ar: 'ما تخسر حتى فلوس كي تفوتك حركة. اللي ينجّم يكلّفك هو كي تجري وراها.',
        },
      },
    ],
  },

  // ---- outlines: written next ----
  {
    slug: 'karat',
    minutes: 2,
    title: { en: 'What a karat means', fr: 'Ce que veut dire un carat', ar: 'شنوّة معناها قيراط؟' },
    hook: {
      en: 'The way a goldsmith weighs gold, Qirat weighs coins.',
      fr: 'Comme un bijoutier pèse l’or, Qirat pèse les cryptos.',
      ar: 'كيما الصايغي يوزن الذهب، قيراط يوزن الـ coins.',
    },
    terms: ['karat'],
    live: { kind: 'karat' },
    outline: [
      {
        en: '24K = calm and climbing · 10K = wild or sliding',
        fr: '24K = calme et en hausse · 10K = agitée ou en baisse',
        ar: '24K = باهية وطالعة · 10K = متقلّبة ولا هابطة',
      },
      {
        en: 'It compares each coin with 18 big coins: calm, and the 90-day trend',
        fr: 'Il compare chaque crypto à 18 grandes cryptos : le calme et la tendance sur 90 jours',
        ar: 'يقارن كل coin مع 18 coin كبار: الهدوء والاتجاه متاع 90 يوم',
      },
      {
        en: 'In a stormy market, even 24K coins usually fall',
        fr: 'Dans un marché orageux, même les 24K baissent souvent',
        ar: 'في سوق خايب، حتى الـ 24K عادةً يهبطو',
      },
      {
        en: 'A karat is never an instruction to buy or sell',
        fr: 'Un carat n’est jamais une consigne d’achat ou de vente',
        ar: 'القيراط عمرو ما هو أمر باش تشري ولا تبيع',
      },
    ],
  },
  {
    slug: 'only-what-you-can-lose',
    minutes: 2,
    title: {
      en: 'Only put in what you can lose',
      fr: 'Ne mettez que ce que vous pouvez perdre',
      ar: 'ما تحطّ كان اللي تنجّم تخسرو',
    },
    hook: {
      en: 'Dinar examples, before you put in a single millime.',
      fr: 'Des exemples en dinars, avant de mettre le moindre millime.',
      ar: 'أمثلة بالدينار، قبل ما تحطّ حتى مليم.',
    },
    terms: [],
    outline: [
      {
        en: 'Rent, food and an emergency fund come first',
        fr: 'Le loyer, la nourriture et une épargne de secours passent avant',
        ar: 'الكراء، الماكلة وفلوس الطوارئ قبل كل شي',
      },
      {
        en: 'On a 1,200 TND salary: 50 TND you could forget is not 1,000 TND borrowed',
        fr: 'Sur un salaire de 1 200 TND : 50 TND qu’on peut oublier, ce n’est pas 1 000 TND empruntés',
        ar: 'على شهرية 1,200 دينار: 50 دينار تنجّم تنساها موش كيما 1,000 دينار متسلّفة',
      },
      {
        en: 'Never borrow, and never sell the family gold, to put money into crypto',
        fr: 'Ne jamais emprunter, ni vendre l’or de la famille, pour mettre de l’argent dans la crypto',
        ar: 'عمرك ما تتسلّف، ولا تبيع ذهب الدار، باش تحطّ فلوس في الـ crypto',
      },
      {
        en: 'Ask yourself: if this amount halved, would my life change?',
        fr: 'Demandez-vous : si ce montant était divisé par deux, ma vie changerait-elle ?',
        ar: 'اسأل روحك: كان المبلغ هذا طاح للنصّ، حياتي تتبدّل؟',
      },
    ],
  },
  {
    slug: 'wallets',
    minutes: 2,
    title: {
      en: 'Wallets and secret keys',
      fr: 'Les wallets et les clés secrètes',
      ar: 'الـ wallets والمفاتيح السرّية',
    },
    hook: {
      en: 'Whoever has the 12 words has the money.',
      fr: 'Celui qui a les 12 mots a l’argent.',
      ar: 'اللي عندو الـ 12 كلمة، عندو الفلوس.',
    },
    terms: ['wallet', 'seed-phrase', 'exchange'],
    outline: [
      {
        en: 'A wallet on a platform vs a wallet you hold yourself',
        fr: 'Un wallet sur une plateforme ou un wallet que vous gardez vous-même',
        ar: 'wallet في منصّة ولا wallet عندك انت',
      },
      {
        en: 'The seed phrase: 12 or 24 words that restore your wallet',
        fr: 'La phrase de récupération : 12 ou 24 mots qui restaurent votre wallet',
        ar: 'الـ seed phrase: 12 ولا 24 كلمة يرجّعولك الـ wallet',
      },
      {
        en: 'No honest person ever asks for it, not even “support”',
        fr: 'Aucune personne honnête ne la demande, même pas « le support »',
        ar: 'حتى حدّ نظيف ما يطلبها منك، حتى «الـ support»',
      },
      {
        en: 'Write it on paper, never in a screenshot',
        fr: 'L’écrire sur papier, jamais en capture d’écran',
        ar: 'اكتبها على ورقة، عمرك ما تعمللها screenshot',
      },
    ],
  },
  {
    slug: 'p2p',
    minutes: 2,
    title: {
      en: 'Buying from strangers (P2P)',
      fr: 'Acheter à des inconnus (P2P)',
      ar: 'الشراء من عند ناس ما تعرفهمش (P2P)',
    },
    hook: {
      en: 'How P2P works and where the danger hides.',
      fr: 'Comment marche le P2P et où se cache le danger.',
      ar: 'كيفاش يخدم الـ P2P ووين يتخبّى الخطر.',
    },
    terms: ['p2p', 'escrow'],
    outline: [
      {
        en: 'What P2P is, and how platform escrow works',
        fr: 'Ce qu’est le P2P, et comment marche le séquestre (escrow) des plateformes',
        ar: 'شنوّة الـ P2P، وكيفاش يخدم الـ escrow في المنصّات',
      },
      {
        en: 'Why in-person cash meetups are dangerous',
        fr: 'Pourquoi les rendez-vous en personne avec du cash sont dangereux',
        ar: 'علاش اللقاءات وجهاً لوجه بالكاش خطيرة',
      },
      {
        en: 'Compare the rate with the official rate',
        fr: 'Comparer le taux avec le taux officiel',
        ar: 'قارن السوم مع السوم الرسمي',
      },
      {
        en: 'Money from a third party can cause trouble with your bank',
        fr: 'De l’argent venant d’un tiers peut causer des problèmes avec votre banque',
        ar: 'فلوس جاية من طرف ثالث تنجّم تعملّك مشاكل مع البانكة',
      },
    ],
  },
  {
    slug: 'law-tunisia',
    minutes: 2,
    title: {
      en: 'Crypto and the law in Tunisia',
      fr: 'La crypto et la loi en Tunisie',
      ar: 'الـ crypto والقانون في تونس',
    },
    hook: {
      en: 'Facts only, with dates. No advice.',
      fr: 'Des faits, avec des dates. Aucun conseil.',
      ar: 'وقائع برك، بالتواريخ. بلا نصايح.',
    },
    terms: ['bct'],
    outline: [
      {
        en: 'The central bank (BCT) said in 2023 that crypto is not money',
        fr: 'La banque centrale (BCT) a dit en 2023 que la crypto n’est pas une monnaie',
        ar: 'البنك المركزي (BCT) قال في 2023 إنّو الـ crypto موش عملة',
      },
      {
        en: 'The foreign-exchange law (76-18) and how it has been applied',
        fr: 'La loi sur les changes (76-18) et comment elle a été appliquée',
        ar: 'قانون الصرف (76-18) وكيفاش تطبّق',
      },
      {
        en: 'The new exchange code: where it stands (Nov 2026: not law yet)',
        fr: 'Le nouveau code des changes : où il en est (nov. 2026 : pas encore une loi)',
        ar: 'مجلّة الصرف الجديدة: وين وصلت (نوفمبر 2026: مازالت موش قانون)',
      },
      {
        en: 'This page is not legal advice',
        fr: 'Cette page n’est pas un conseil juridique',
        ar: 'الصفحة هاذي موش نصيحة قانونية',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Glossary
// ---------------------------------------------------------------------------

export const GLOSSARY: Record<string, { term: Text; def: Text }> = {
  crypto: {
    term: { en: 'Crypto', fr: 'Crypto', ar: 'crypto' },
    def: {
      en: 'Digital money or assets recorded on a blockchain, with no bank or state behind them.',
      fr: 'De l’argent ou des actifs numériques inscrits sur une blockchain, sans banque ni État derrière.',
      ar: 'فلوس ولا أصول رقمية مكتوبة على blockchain، ما وراها حتى بانكة وحتى دولة.',
    },
  },
  blockchain: {
    term: { en: 'Blockchain', fr: 'Blockchain', ar: 'blockchain' },
    def: {
      en: 'A shared record copied on thousands of computers. Nobody can secretly change past lines.',
      fr: 'Un registre partagé copié sur des milliers d’ordinateurs. Personne ne peut modifier les lignes passées en douce.',
      ar: 'كرّاس مشترك منسوخ على آلاف الـ PC. حتى حدّ ما ينجّم يبدّل السطور القدام بالخفية.',
    },
  },
  bitcoin: {
    term: { en: 'Bitcoin (BTC)', fr: 'Bitcoin (BTC)', ar: 'Bitcoin (BTC)' },
    def: {
      en: 'The first crypto, started in 2009. There will never be more than 21 million.',
      fr: 'La première crypto, née en 2009. Il n’y en aura jamais plus de 21 millions.',
      ar: 'أوّل crypto، بدات في 2009. عمرها ما باش تفوت 21 مليون.',
    },
  },
  satoshi: {
    term: { en: 'Satoshi', fr: 'Satoshi', ar: 'satoshi' },
    def: {
      en: 'The smallest piece of a bitcoin: 0.00000001 BTC.',
      fr: 'Le plus petit morceau d’un bitcoin : 0,00000001 BTC.',
      ar: 'أصغر طرف من الـ bitcoin: ‎0.00000001 BTC.',
    },
  },
  stablecoin: {
    term: { en: 'Stablecoin', fr: 'Stablecoin', ar: 'stablecoin' },
    def: {
      en: 'A crypto designed to stay at a fixed price, usually 1 US dollar.',
      fr: 'Une crypto conçue pour garder un prix fixe, en général 1 dollar américain.',
      ar: 'crypto مصمّمة باش تقعد على سوم ثابت، عادةً 1 دولار أمريكي.',
    },
  },
  usdt: {
    term: { en: 'USDT (Tether)', fr: 'USDT (Tether)', ar: 'USDT (Tether)' },
    def: {
      en: 'The biggest stablecoin, issued by the company Tether. It aims to stay at $1.',
      fr: 'Le plus gros stablecoin, émis par la société Tether. Il vise à rester à 1 $.',
      ar: 'أكبر stablecoin، تطلّعها شركة Tether. تحاول تقعد على 1$.',
    },
  },
  depeg: {
    term: { en: 'Depeg', fr: 'Décrochage (depeg)', ar: 'depeg' },
    def: {
      en: 'When a stablecoin falls away from its $1 target.',
      fr: 'Quand un stablecoin s’éloigne de son objectif de 1 $.',
      ar: 'كي الـ stablecoin تطيح وتبعد على الـ 1$ متاعها.',
    },
  },
  p2p: {
    term: { en: 'P2P', fr: 'P2P', ar: 'P2P' },
    def: {
      en: 'Buying or selling directly with another person instead of through an exchange.',
      fr: 'Acheter ou vendre directement à une autre personne, sans passer par une plateforme.',
      ar: 'تشري ولا تبيع مباشرة مع شخص آخر، موش عن طريق منصّة.',
    },
  },
  volatility: {
    term: { en: 'Volatility', fr: 'Volatilité', ar: 'volatility' },
    def: {
      en: 'How much a price usually moves. Qirat shows it as “a typical day”.',
      fr: 'L’ampleur habituelle des mouvements d’un prix. Qirat l’affiche comme « une journée normale ».',
      ar: 'قدّاش السوم يتحرّك عادةً. قيراط يورّيها «نهار عادي».',
    },
  },
  'risk-grade': {
    term: { en: 'Risk grade', fr: 'Note de risque', ar: 'درجة الـ risk' },
    def: {
      en: 'Qirat’s low, medium or high, based on how much the coin swung over the past 30 days.',
      fr: 'Le faible, moyen ou élevé de Qirat, selon les variations de la crypto sur les 30 derniers jours.',
      ar: 'منخفض، متوسط ولا عالي في قيراط، حسب قدّاش الـ coin تحرّكت في الـ 30 يوم اللي فاتو.',
    },
  },
  'rough-month': {
    term: { en: 'Rough month', fr: 'Mauvais mois', ar: 'الشهر الصعيب' },
    def: {
      en: 'How much you could lose in a bad month, the kind that comes about once in 20 months. Qirat shows it on 100 TND. It is not the worst case.',
      fr: 'Ce que vous pourriez perdre pendant un mauvais mois, le genre qui arrive environ une fois tous les 20 mois. Qirat le montre sur 100 TND. Ce n’est pas le pire cas.',
      ar: 'قدّاش تنجّم تخسر في شهر خايب، من النوع اللي يجي تقريب مرّة كل 20 شهر. قيراط يورّيه على 100 دينار. موش هو أخيب حاجة تنجّم تصير.',
    },
  },
  liquidity: {
    term: { en: 'Liquidity', fr: 'Liquidité', ar: 'liquidity' },
    def: {
      en: 'How easily a coin can be bought or sold without moving its price. Small coins have little.',
      fr: 'La facilité à acheter ou vendre une crypto sans faire bouger son prix. Les petites en ont peu.',
      ar: 'قدّاش ساهل تشري ولا تبيع coin من غير ما يتحرّك السوم متاعها. الـ coins الصغار عندهم شويّة.',
    },
  },
  signals: {
    term: { en: 'Signals', fr: 'Signaux', ar: 'signals' },
    def: {
      en: 'Paid “buy now / sell now” tips sold in groups. Often the first step of a scam.',
      fr: 'Des conseils payants « achète maintenant / vends maintenant » vendus dans des groupes. Souvent le début d’une arnaque.',
      ar: 'نصايح بالفلوس «اشري توّا / بيع توّا» يبيعوها في القروبات. برشا مرّات أوّل خطوة في تحيّل.',
    },
  },
  ponzi: {
    term: { en: 'Ponzi scheme', fr: 'Chaîne de Ponzi', ar: 'Ponzi' },
    def: {
      en: 'A scheme that pays early members with newer members’ money, until it collapses.',
      fr: 'Un système qui paie les premiers membres avec l’argent des nouveaux, jusqu’à l’effondrement.',
      ar: 'نظام يخلّص الأوائل بفلوس اللي جاو بعدهم، حتى يطيح.',
    },
  },
  'fake-platform': {
    term: { en: 'Fake platform', fr: 'Fausse plateforme', ar: 'منصّة فالصو' },
    def: {
      en: 'A site or app that shows a fake growing balance, then blocks withdrawals or asks for “fees”.',
      fr: 'Un site ou une appli qui affiche un faux solde qui grimpe, puis bloque les retraits ou réclame des « frais ».',
      ar: 'موقع ولا تطبيقة تورّيك رصيد فالصو يكبر، ومن بعد تسكّر السحب ولا تطلب «frais».',
    },
  },
  phishing: {
    term: { en: 'Phishing', fr: 'Hameçonnage (phishing)', ar: 'phishing' },
    def: {
      en: 'A fake page or message that copies a real service to steal your password or keys.',
      fr: 'Une fausse page ou un faux message qui imite un vrai service pour voler votre mot de passe ou vos clés.',
      ar: 'صفحة ولا ميساج فالصو يقلّد خدمة حقيقية باش يسرق الـ password ولا المفاتيح متاعك.',
    },
  },
  fomo: {
    term: { en: 'FOMO', fr: 'FOMO', ar: 'FOMO' },
    def: {
      en: 'Fear Of Missing Out: the urge to jump in because a price is rising and everyone is talking about it.',
      fr: 'Fear Of Missing Out : l’envie de se lancer parce qu’un prix monte et que tout le monde en parle.',
      ar: 'Fear Of Missing Out: الرغبة باش تدخل خاطر السوم طالع والناس الكل تحكي عليه.',
    },
  },
  'fear-greed': {
    term: { en: 'Fear & Greed index', fr: 'Indice Fear & Greed', ar: 'مؤشّر Fear & Greed' },
    def: {
      en: 'A daily score from 0 (extreme fear) to 100 (extreme greed) of the crypto crowd’s mood.',
      fr: 'Un score quotidien de 0 (peur extrême) à 100 (avidité extrême) qui mesure l’humeur des marchés crypto.',
      ar: 'نتيجة كل نهار من 0 (خوف كبير) لـ 100 (طمع كبير) تقيس مزاج ناس الـ crypto.',
    },
  },
  pullback: {
    term: { en: 'Pullback', fr: 'Repli', ar: 'رجوع لتالي' },
    def: {
      en: 'A drop in price after a rise.',
      fr: 'Une baisse du prix après une hausse.',
      ar: 'هبطة في السوم بعد طلعة.',
    },
  },
  karat: {
    term: { en: 'Karat (24K–10K)', fr: 'Carat (24K–10K)', ar: 'قيراط (24K–10K)' },
    def: {
      en: 'Qirat’s grade for a coin: 24K = calm and climbing, 10K = wild or sliding, compared with big coins.',
      fr: 'La note Qirat d’une crypto : 24K = calme et en hausse, 10K = agitée ou en baisse, comparée aux grandes cryptos.',
      ar: 'الدرجة متاع قيراط للـ coin: 24K = باهية وطالعة، 10K = متقلّبة ولا هابطة، مقارنة بالـ coins الكبار.',
    },
  },
  wallet: {
    term: { en: 'Wallet', fr: 'Wallet (portefeuille)', ar: 'wallet' },
    def: {
      en: 'Where your crypto is kept. It can be on a platform, or one you control yourself.',
      fr: 'L’endroit où votre crypto est gardée. Sur une plateforme, ou un portefeuille que vous contrôlez vous-même.',
      ar: 'البلاصة اللي تتخبّى فيها الـ crypto متاعك. تنجّم تكون في منصّة، ولا wallet تتحكّم فيه انت.',
    },
  },
  'seed-phrase': {
    term: { en: 'Seed phrase', fr: 'Phrase de récupération', ar: 'seed phrase' },
    def: {
      en: '12 or 24 words that open your wallet. Whoever has them has your crypto. Never share them.',
      fr: '12 ou 24 mots qui ouvrent votre wallet. Qui les a, a votre crypto. Ne les partagez jamais.',
      ar: '12 ولا 24 كلمة يحلّو الـ wallet متاعك. اللي عندو الكلمات، عندو الـ crypto متاعك. عمرك ما تعطيهم لحدّ.',
    },
  },
  exchange: {
    term: { en: 'Exchange', fr: 'Plateforme d’échange', ar: 'منصّة (exchange)' },
    def: {
      en: 'A company where people buy and sell crypto. Qirat does not recommend any.',
      fr: 'Une entreprise où l’on achète et vend de la crypto. Qirat n’en recommande aucune.',
      ar: 'شركة وين الناس تشري وتبيع الـ crypto. قيراط ما ينصح بحتى وحدة.',
    },
  },
  escrow: {
    term: { en: 'Escrow', fr: 'Séquestre (escrow)', ar: 'escrow' },
    def: {
      en: 'A platform holds the crypto during a P2P deal until both sides confirm.',
      fr: 'La plateforme bloque la crypto pendant un échange P2P jusqu’à ce que les deux côtés confirment.',
      ar: 'المنصّة تشدّ الـ crypto في صفقة P2P حتى الزوز يأكّدو.',
    },
  },
  bct: {
    term: { en: 'BCT', fr: 'BCT', ar: 'BCT' },
    def: {
      en: 'Banque Centrale de Tunisie, the central bank. It said in 2023 that crypto is not money.',
      fr: 'La Banque Centrale de Tunisie. Elle a déclaré en 2023 que la crypto n’est pas une monnaie.',
      ar: 'البنك المركزي التونسي. قال في 2023 إنّو الـ crypto موش عملة.',
    },
  },
}

/** Lessons that use a glossary term, for "From: lesson" links. */
export function lessonsForTerm(id: string): Lesson[] {
  return LESSONS.filter((l) => l.terms.includes(id))
}

export const READY_LESSONS = LESSONS.filter(isReady)

/** The lesson of the day rotates through the written lessons. Mirrored in server/telegram_bot.py. */
export function todaysLesson(date = new Date()): Lesson {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000)
  return READY_LESSONS[day % READY_LESSONS.length]
}
