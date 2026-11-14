// Learn section: a step-by-step course in three levels (basics, intermediate,
// advanced), in English, French and light Arabic.
//
// Where things live:
//   lessons/basics.ts, lessons/intermediate.ts, lessons/advanced.ts  lesson text and quizzes, in course order
//   lessons/glossary.ts                                              every glossary word
//   this file                                                        types, the Learn screen's UI strings, the course order
//
// ARABIC: the `ar` strings are light Arabic, simple enough for readers from
// Morocco to the Gulf (owner's decision, 14 Nov 2026), not Tunisian Darija.
// Western digits (12, 500, 0.1%). Brand names and tickers stay in Latin script;
// trading words are given in Arabic with the Latin term in brackets the first
// time a lesson uses them. `npm run learn:darija` exports every Arabic string
// to docs/learn/darija-review.md for review before release.
//
// Content rules: education only. Never tell anyone to buy, sell or hold, never
// promise returns, no signals, no "how to buy" steps. Every fact must be
// checkable: sources are in docs/strategy/lessons-curriculum-2026-11.md.
// Never write a lesson number inside lesson text (the order can change).

import { BASICS } from './lessons/basics.ts'
import { INTERMEDIATE } from './lessons/intermediate.ts'
import { ADVANCED } from './lessons/advanced.ts'

export { GLOSSARY } from './lessons/glossary.ts'

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

/** 1 = basics, 2 = intermediate, 3 = advanced. */
export type LessonLevel = 1 | 2 | 3

export interface Lesson {
  slug: string
  level: LessonLevel
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
// The course, in order
// ---------------------------------------------------------------------------

export const LESSONS: Lesson[] = [...BASICS, ...INTERMEDIATE, ...ADVANCED]

export const LEVELS: { level: LessonLevel; name: Text; about: Text }[] = [
  {
    level: 1,
    name: { en: 'Basics', fr: 'Les bases', ar: 'الأساسيات' },
    about: {
      en: 'Understand what you are touching: what crypto is, why prices swing, wallets, scams and the law.',
      fr: 'Comprendre ce que vous touchez : ce qu’est la crypto, pourquoi les prix bougent, les wallets, les arnaques et la loi.',
      ar: 'افهم ما الذي تتعامل معه: ما هي العملات الرقمية، لماذا تتحرك الأسعار، المحافظ، الاحتيال والقانون.',
    },
  },
  {
    level: 2,
    name: { en: 'Intermediate', fr: 'Intermédiaire', ar: 'المستوى المتوسط' },
    about: {
      en: 'Read a chart and place a practice trade: candles, fees, order types, karats and the market weather.',
      fr: 'Lire un graphique et passer un ordre d’entraînement : bougies, frais, types d’ordres, carats et météo du marché.',
      ar: 'اقرأ الرسم البياني ونفّذ صفقة تدريبية: الشموع، الرسوم، أنواع الأوامر، القيراط وطقس السوق.',
    },
  },
  {
    level: 3,
    name: { en: 'Advanced', fr: 'Avancé', ar: 'المستوى المتقدم' },
    about: {
      en: 'Protect your money and follow a plan: position size, leverage, indicators, spreading out, your journal.',
      fr: 'Protéger votre argent et suivre un plan : taille de position, levier, indicateurs, diversification, votre journal.',
      ar: 'احمِ مالك واتبع خطة: حجم الصفقة، الرافعة المالية، المؤشرات، توزيع المخاطر، ودفتر صفقاتك.',
    },
  },
]

// ---------------------------------------------------------------------------
// Learn screen UI strings
// ---------------------------------------------------------------------------

export const LEARN_UI = {
  title: { en: 'Learn', fr: 'Apprendre', ar: 'تعلّم' },
  subtitle: {
    en: 'Crypto and trading from zero, step by step: basics, then intermediate, then advanced. No hype, no tips.',
    fr: 'La crypto et le trading à partir de zéro, pas à pas : les bases, puis l’intermédiaire, puis l’avancé. Sans hype, sans conseils.',
    ar: 'العملات الرقمية والتداول من الصفر، خطوة بخطوة: الأساسيات، ثم المتوسط، ثم المتقدم. بلا تهويل وبلا توصيات.',
  },
  // The "start here" strip a first visit sees on top of the hub.
  startTitle: { en: 'Start here', fr: 'Commencez ici', ar: 'ابدأ من هنا' },
  startBody: {
    en: 'Qirat teaches you trading from zero: short lessons in three levels, a practice wallet with 100, 500 or 1000 pretend dollars at real prices, and an honest risk grade for every coin.',
    fr: 'Qirat vous apprend le trading à partir de zéro : de courtes leçons en trois niveaux, un portefeuille d’entraînement de 100, 500 ou 1000 dollars fictifs aux prix réels, et une note de risque honnête pour chaque crypto.',
    ar: 'قيراط يعلّمك التداول من الصفر: دروس قصيرة على ثلاثة مستويات، ومحفظة تدريب فيها 100 أو 500 أو 1000 دولار افتراضي بالأسعار الحقيقية، ودرجة مخاطرة صادقة لكل عملة.',
  },
  startLesson: { en: 'Start lesson 1', fr: 'Commencer la leçon 1', ar: 'ابدأ الدرس 1' },
  startPractice: { en: 'Practice with pretend money', fr: 'S’entraîner avec de l’argent fictif', ar: 'تدرّب بمال افتراضي' },
  startNote: {
    en: 'Free during the beta. Qirat never tells you to buy or sell.',
    fr: 'Gratuit pendant la bêta. Qirat ne vous dit jamais d’acheter ou de vendre.',
    ar: 'مجاني خلال الفترة التجريبية. قيراط لا يقول لك أبدًا اشترِ أو بِع.',
  },
  yourKarat: { en: 'Your karat', fr: 'Votre carat', ar: 'قيراطك' },
  karatHint: {
    en: 'You start at 10K. Read lessons and pass their quizzes to rise toward 24K.',
    fr: 'Vous commencez à 10K. Lisez les leçons et réussissez les quiz pour monter vers 24K.',
    ar: 'تبدأ من 10K. اقرأ الدروس ونجح في اختباراتها لترتفع نحو 24K.',
  },
  toNext: {
    en: '{n} more steps to {k}K',
    fr: 'Encore {n} étapes avant {k}K',
    ar: 'الخطوات المتبقية حتى {k}K: {n}',
  },
  maxed: {
    en: 'Pure gold. New lessons are on the way.',
    fr: 'Or pur. De nouvelles leçons arrivent.',
    ar: 'ذهب خالص. دروس جديدة في الطريق.',
  },
  lessonsDone: { en: '{d} of {n} lessons passed', fr: '{d} leçons réussies sur {n}', ar: 'الدروس الناجحة: {d} من {n}' },
  level10: { en: 'Just starting', fr: 'Tout début', ar: 'في البداية' },
  level14: { en: 'Starting to shine', fr: 'Ça commence à briller', ar: 'بدأت تلمع' },
  level18: { en: 'Solid gold', fr: 'De l’or solide', ar: 'ذهب متين' },
  level22: { en: 'Almost pure', fr: 'Presque pur', ar: 'قريب من الخالص' },
  level24: { en: 'Pure gold', fr: 'Or pur', ar: 'ذهب خالص' },
  today: { en: 'Today’s lesson', fr: 'La leçon du jour', ar: 'درس اليوم' },
  allLessons: { en: 'All lessons', fr: 'Toutes les leçons', ar: 'كل الدروس' },
  levelN: { en: 'Level {n}', fr: 'Niveau {n}', ar: 'المستوى {n}' },
  levelProgress: { en: '{d} of {n} passed', fr: '{d} sur {n} réussies', ar: '{d} من {n} ناجحة' },
  minutes: { en: '{n} min read', fr: '{n} min de lecture', ar: 'مدة القراءة: {n} د' },
  start: { en: 'Start', fr: 'Commencer', ar: 'ابدأ' },
  read: { en: 'Read', fr: 'Lu', ar: 'مقروء' },
  passed: { en: 'Passed', fr: 'Réussi', ar: 'ناجح' },
  comingSoon: { en: 'Coming soon', fr: 'Bientôt', ar: 'قريبًا' },
  inThisLesson: { en: 'What it will cover', fr: 'Au programme', ar: 'ماذا سيتناول' },
  back: { en: 'All lessons', fr: 'Toutes les leçons', ar: 'كل الدروس' },
  lessonN: { en: 'Lesson {n}', fr: 'Leçon {n}', ar: 'الدرس {n}' },
  takeaway: { en: 'The short version', fr: 'En bref', ar: 'الخلاصة' },
  tryLive: { en: 'See it live in Qirat', fr: 'À voir en direct dans Qirat', ar: 'شاهدها مباشرة في قيراط' },
  openCoins: { en: 'Open all coins', fr: 'Voir toutes les cryptos', ar: 'افتح كل العملات' },
  liveLoading: { en: 'Loading today’s data…', fr: 'Chargement des données du jour…', ar: 'جارٍ تحميل بيانات اليوم…' },
  liveTypicalDay: { en: 'A typical day', fr: 'Une journée normale', ar: 'يوم عادي' },
  liveRoughMonth: { en: 'A rough month', fr: 'Un mauvais mois', ar: 'شهر صعب' },
  liveOn100: {
    en: '100 TND could become about {v} TND',
    fr: '100 TND pourraient devenir environ {v} TND',
    ar: '100 دينار قد تصبح حوالي {v} دينار',
  },
  liveRiskiest: { en: 'Riskiest in your list', fr: 'La plus risquée de votre liste', ar: 'الأعلى مخاطرة في قائمتك' },
  liveMood: { en: 'Crowd mood (Fear & Greed)', fr: 'Humeur de la foule (Fear & Greed)', ar: 'مزاج السوق (Fear & Greed)' },
  weatherCalm: { en: 'Calm', fr: 'Calme', ar: 'هادئ' },
  weatherChoppy: { en: 'Choppy', fr: 'Agité', ar: 'متقلب' },
  weatherStormy: { en: 'Stormy', fr: 'Orageux', ar: 'عاصف' },
  weatherToday: { en: 'Market weather today', fr: 'La météo du marché aujourd’hui', ar: 'طقس السوق اليوم' },
  karatToday: { en: 'Today’s coins by karat', fr: 'Les cryptos du jour par carat', ar: 'عملات اليوم حسب القيراط' },
  quiz: { en: 'Quick quiz', fr: 'Petit quiz', ar: 'اختبار قصير' },
  quizHint: {
    en: 'Get 2 of 3 right to pass and raise your karat.',
    fr: 'Trouvez 2 réponses sur 3 pour réussir et faire monter votre carat.',
    ar: 'أجب إجابة صحيحة عن 2 من 3 لتنجح ويرتفع قيراطك.',
  },
  questionN: { en: 'Question {n} of {m}', fr: 'Question {n} sur {m}', ar: 'السؤال {n} من {m}' },
  right: { en: 'Right!', fr: 'Exact !', ar: 'صحيح!' },
  wrong: { en: 'Not quite.', fr: 'Pas tout à fait.', ar: 'ليس تمامًا.' },
  next: { en: 'Next question', fr: 'Question suivante', ar: 'السؤال التالي' },
  seeScore: { en: 'See my score', fr: 'Voir mon score', ar: 'أرني النتيجة' },
  score: { en: '{s} of {m} right', fr: '{s} bonnes réponses sur {m}', ar: '{s} صحيحة من {m}' },
  passMsg: {
    en: 'Passed. Your karat went up.',
    fr: 'Réussi. Votre carat monte.',
    ar: 'نجحت. ارتفع قيراطك.',
  },
  passAgainMsg: { en: 'Passed again. Nice.', fr: 'Encore réussi. Bravo.', ar: 'نجحت مرة أخرى. أحسنت.' },
  failMsg: {
    en: 'Almost. Reread the lesson and try again: it only takes a minute.',
    fr: 'Presque. Relisez la leçon et réessayez : ça prend une minute.',
    ar: 'قريب. أعد قراءة الدرس وحاول مرة أخرى: الأمر يأخذ دقيقة فقط.',
  },
  retry: { en: 'Try again', fr: 'Réessayer', ar: 'حاول مجددًا' },
  nextLesson: { en: 'Next lesson', fr: 'Leçon suivante', ar: 'الدرس التالي' },
  terms: { en: 'Words in this lesson', fr: 'Les mots de cette leçon', ar: 'كلمات هذا الدرس' },
  glossary: { en: 'Glossary', fr: 'Glossaire', ar: 'القاموس' },
  glossaryHint: {
    en: 'Every crypto and trading word from the lessons, in plain language.',
    fr: 'Tous les mots crypto et trading des leçons, en langage simple.',
    ar: 'كل كلمات العملات الرقمية والتداول من الدروس، بلغة بسيطة.',
  },
  search: { en: 'Search a word', fr: 'Chercher un mot', ar: 'ابحث عن كلمة' },
  noMatch: { en: 'No word matches that.', fr: 'Aucun mot ne correspond.', ar: 'لا توجد كلمة مطابقة.' },
  fromLesson: { en: 'From: {t}', fr: 'Leçon : {t}', ar: 'من درس: {t}' },
  copyLink: { en: 'Copy link', fr: 'Copier le lien', ar: 'انسخ الرابط' },
  copied: { en: 'Link copied', fr: 'Lien copié', ar: 'تم نسخ الرابط' },
  notAdvice: {
    en: 'Education only. Not financial advice. Qirat never tells you to buy or sell.',
    fr: 'Éducation uniquement. Pas un conseil financier. Qirat ne vous dit jamais d’acheter ou de vendre.',
    ar: 'للتعليم فقط. ليست نصيحة مالية. قيراط لا يقول لك أبدًا اشترِ أو بِع.',
  },
  reset: { en: 'Reset my progress', fr: 'Remettre ma progression à zéro', ar: 'أعد تقدّمي إلى الصفر' },
  resetConfirm: {
    en: 'Start again from 10K?',
    fr: 'Recommencer à 10K ?',
    ar: 'هل تريد البدء من جديد من 10K؟',
  },
  savedHere: {
    en: 'Progress is saved on this device only, for now.',
    fr: 'La progression est enregistrée sur cet appareil seulement, pour l’instant.',
    ar: 'تقدّمك محفوظ على هذا الجهاز فقط، حاليًا.',
  },
} satisfies Record<string, Text>

export type LearnKey = keyof typeof LEARN_UI

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
