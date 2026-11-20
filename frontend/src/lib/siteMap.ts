// The map of Qirat the chat (AskBubble) is sent with every question, so it can
// say exactly where things are instead of guessing. On 20 Nov 2026 it sent a
// visitor to a "sidebar" Qirat does not have, looking for the Time machine.
//
// The sentences are English (for the AI); every word the screen shows comes
// from the app's own strings in the page's language, in «», so the answer can
// quote the very button the visitor sees. Link ids are the screens' addresses
// (#replay): the chat writes them as [words](#replay), and lib/format.ts turns
// only these into links.
//
// When a screen gains or loses a button, a tab or a way in, change it here too.
// Keep it short: it rides with every question (the server takes 8000 characters),
// and the lesson list goes last so a cut would only shorten that.

import type { Lang, UIKey } from './i18n'
import { P } from './i18n-practice'
import { R } from './i18n-replay'
import { INVITE } from './invite'
import { LEARN_UI, LESSONS, LEVELS, isReady } from './lessons'

type T = (key: UIKey, vars?: Record<string, string | number>) => string

export const SITE_MAP_MAX = 8000

/** Screen words without the marker brackets and line breaks, in «». */
const q = (s: string) => `«${s.replace(/\[\[|\]\]/g, '').replace(/\s*\n\s*/g, ' ').trim()}»`

export function siteMap(lang: Lang, t: T): string {
  const tp = (key: keyof typeof P, n?: number) => q(P[key][lang].replace('{amount}', String(n)))
  const tr = (key: keyof typeof R, n?: number) => q(R[key][lang].replace('{n}', String(n)))
  const tt = (key: UIKey, vars?: Record<string, string | number>) => q(t(key, vars))
  const lessons = LEVELS.map(({ level, name }) => {
    const list = LESSONS.filter((l) => l.level === level)
      .map((l) => `${q(l.title[lang])} #learn-${l.slug}${isReady(l) ? '' : ' (coming soon)'}`)
      .join('; ')
    return `${q(name[lang])}: ${list}`
  }).join('\n')

  return [
    `TABS. Phone: the bar at the bottom: ${tt('nav.home')} ${tt('nav.learn')} ${tt('nav.practice')} ${tt('nav.today')} ${tt('nav.portfolio')}. ` +
      'Computer: the same tabs at the top, without Home (the Qirat logo at the top left opens Home). No sidebar, no other menu.',
    `TOP RIGHT: language buttons (AR, FR, EN); moon or sun (light or dark look); «?» opens the guide ${tt('top.help')}.`,
    `THIS CHAT: the gold button ${tt('ask.fab')} at the bottom corner of every screen.`,

    `HOME #home. Top to bottom: ${tt('home.h1')} with ${tt('home.try', { n: 1000 })} (opens Practice) and ${tt('home.lesson1')}; ` +
      `${tt('home.stories')}: 4 story videos, each ending with ${tt('story.try')}; ${tt('home.learnH', { n: LESSONS.length })} with ${tt('home.startLesson')}; ` +
      `${tt('home.practiceH')} with ${tt('home.openWallet')}; last, at the very bottom: ${tt('home.replayH')} with ${tt('home.replayGo')} (the Time machine).`,

    `TIME MACHINE #replay. No tab of its own. Ways in: the last part of Home, ${tt('home.replayH')}, button ${tt('home.replayGo')}; ` +
      `or the Practice tab after the first practice trade, card ${tt('home.replayH')}. Its title inside: ${tr('title')}. ` +
      `Two trips, ${tr('trip', 1)} #replay-m1 and ${tr('trip', 2)} #replay-m2: 30 real days from the past, 4 hidden coins (A to D), 1000 pretend dollars. ` +
      `Tap ${tr('start')}, tap a coin to buy or sell it, then ${tr('next')} or ${tr('skip')}; at the end ${tr('seeResult')}: ` +
      `the result next to simply holding Bitcoin, the real coins and dates, and ${tr('share')}.`,

    `PRACTICE #practice, tab ${tt('nav.practice')}: the practice wallet, 1000 pretend USDT at live prices. Before any trade: ${tp('firstBuy', 100)}. ` +
      `Then ${tp('trade')}: pick one of 18 coins, ${tp('buy')} or ${tp('sell')}, the amount, then ${tp('confirmBuy')} or ${tp('confirmSell')}. ` +
      'Market orders at the live price only: no limit or stop-loss orders, no leverage, no short selling. ' +
      `After the first trade, top to bottom on a phone: ${tp('balance')} (compared with just holding BTC); ` +
      `${tp('keepButton')} (a private link that opens the same wallet and lesson progress in another browser; no account, no name); ` +
      `the Time machine card; ${tp('trade')}; ${tp('coach')}; ${tp('history')}; ` +
      `at the very bottom ${tp('reset')} (start again with 100, 500 or 1000) and ${tp('rulesOpen')}. No deposits, withdrawals or transfers.`,

    `LEARN #learn, tab ${tt('nav.learn')}: ${LESSONS.length} lessons of about 2 minutes in 3 levels; each ends with a 3-question quiz (2 right to pass). ` +
      'At the top, the learner\'s own karat (10K to 24K): it rises with each lesson read and quiz passed. ' +
      `The last row is ${q(LEARN_UI.glossary[lang])} #learn-glossary: the meaning of 64 words, with a box ${q(LEARN_UI.search[lang])}. The lessons are listed at the end.`,

    `TODAY #today, tab ${tt('nav.today')}: the market weather (${tt('weather.calm.title')}, ${tt('weather.choppy.title')} or ${tt('weather.stormy.title')}, ` +
      `with ${tt('weather.whyAsk')}) and ${tt('hero.mood')}; then ${tt('coins.title')}: each coin's karat (24K best, 10K weakest) and risk ` +
      `(BTC, ETH and SOL to start; ${tt('coins.edit')} to search a coin and ${tt('coins.add')} it, or remove one); ` +
      `tap a coin for its 30-day candle chart, why it has its karat and ${tt('risk.title')}; then ${tt('moves.title')}: news headlines.`,

    `PORTFOLIO #portfolio, tab ${tt('nav.portfolio')}: the coins the user owns elsewhere, with their value and profit or loss. ` +
      'Saved only on this device; tracking only, nothing is bought. ' +
      `To track a coin you own: (1) if it is not in Today's ${tt('coins.title')} yet, Today tab, ${tt('coins.edit')}, search it, ${tt('coins.add')}; ` +
      `(2) Portfolio tab, ${tt('pf.add')}, pick the coin, type the amount and the average buy price. ` +
      `The coin menu there lists only the coins in ${tt('coins.title')}. At the bottom, ${tt('pf.quote')} USDT or USDC.`,

    `TELEGRAM BOT: the card ${q(INVITE.title[lang])} with ${q(INVITE.open[lang])}, after a practice trade, after a passed quiz, and at the bottom of Today and Portfolio. ` +
      'In the bot: coin grades, a lesson of the day, a morning digest, and alerts when a watched coin\'s karat changes. Alerts exist only in the bot.',

    `BOTTOM OF EVERY SCREEN: Qirat's accounts (TikTok, Instagram, YouTube), ${tt('foot.notAdvice')}, ${tt('foot.sources')}, ` +
      `and ${tt('foot.feedback')} (a short form, no name).`,

    'NOT ON QIRAT: accounts or login, real money, deposits, withdrawals, buying real crypto, signals or tips, alerts on the site ' +
      '(only in the Telegram bot), a search over the whole site, a settings page, a sidebar, the Scam check (removed).',

    `LESSONS, with their links:\n${lessons}`,
  ].join('\n')
}
