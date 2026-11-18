import { useQuery } from '@tanstack/react-query'
import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { usePracticeT } from '../lib/i18n-practice'
import { R } from '../lib/i18n-replay'
import type { ReplayKey } from '../lib/i18n-replay'
import { READY_LESSONS } from '../lib/lessons'
import { qty, signed } from '../lib/practice'
import {
  REPLAYS,
  dollars,
  finishGame,
  loadGame,
  played,
  reachedEnd,
  rememberResult,
  replayLink,
  saveGame,
  scenarioById,
  scenarioFromHash,
  startGame,
  useReplayT,
} from '../lib/replay'
import type { Finished, Game, ReplayNote } from '../lib/replay'
import { REPLAY_RULES, applyMove, changeOn, playMoves, priceOn, valueOn } from '../lib/replayEngine'
import type { Move, MoveError, ReplayFill, ReplayScenario, ReplayWallet } from '../lib/replayEngine'
import { arrive, track } from '../lib/source'
import type { View } from '../lib/views'
import Caption from './brand/Caption'
import Mascot from './brand/Mascot'
import type { Mood } from './brand/Mascot'

// The Time machine, as three scenes from the videos (reel.css):
//   choosing a trip   one caption, the bar keeping the secret, the two trips
//   playing           the day as the caption, the chart, four hidden coins, one button: next day
//   the result        the month as a ticket with its stamp, then the names and the dates
// A ticket is a record of something that happened (a finished month), a bubble
// is the gold bar speaking, a dashed outline is something still hidden, and
// everything else sits directly on the paper.
//
// Only what is shown lives here. What is stored, counted and replayed is in
// lib/replay.ts and lib/replayEngine.ts, and is called at the same moments as before.

// percentages here show one decimal: a move too small to show is not coloured as a gain or a loss
const tone = (n: number | null | undefined) => (n == null || Math.abs(n) < 0.05 ? 'text-muted' : n > 0 ? 'text-up' : 'text-down')

// One colour and one line style per letter: never green or red, which mean up and down here.
const COLOR: Record<string, string> = { A: 'var(--color-gold-bright)', B: '#2f7fb8', C: '#8b5fbf', D: 'var(--color-neutral)' }
const DASH: Record<string, string | undefined> = { C: '7 4', D: '2 4' }

/** A ticket is white paper in both themes, so what is printed on it takes the light theme's colours. */
const PAPER =
  '[--color-text:#15171c] [--color-muted:#5e6068] [--color-subtle:#f1eee7] [--color-up:#0e9f6e] [--color-down:#e0484e] [--color-neutral:#64748b] [--color-gold:#9a6b14] [--color-gold-bright:#c9962f]'

// Motion only answers an action: the day's number pops when a day advances,
// the bar's answer pops, the result drops in when the last day is played.
const POP = 'motion-safe:animate-[pop_0.3s_cubic-bezier(0.2,1.5,0.4,1)_both]'
const DROP = 'motion-safe:animate-[drop_0.45s_cubic-bezier(0.2,1.3,0.4,1)_both]'

const glide = (): ScrollBehavior =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

/** A day on which a coin moves this many percent is one the bar reacts to. */
const BIG_MOVE = 8

// ── the pieces every scene here is made of ──────────────────────────────────

/** The bar on its gold disc, so it never stands on a dark page. */
function Bar({ mood = 'happy', size = 72 }: { mood?: Mood; size?: number }) {
  const disc = Math.round(size * 1.24)
  return (
    <span className="grid shrink-0 place-items-center rounded-full bg-marker" style={{ width: disc, height: disc }} aria-hidden>
      <Mascot mood={mood} size={size} />
    </span>
  )
}

/** The bar says something: bubbles on the reading side, the bar where their tail points. */
function Says({ mood, size, className = '', children }: { mood?: Mood; size?: number; className?: string; children: ReactNode }) {
  return (
    <div className={`flex items-end gap-2 ${className}`}>
      <div className="min-w-0 flex-1 space-y-2.5">{children}</div>
      <Bar mood={mood} size={size} />
    </div>
  )
}

/** "Pretend, not real money": the same stamp as on the first screen. */
function Stamp({ className = '', style }: { className?: string; style?: CSSProperties }) {
  const { t } = useI18n()
  return (
    <p className={`stamp ltr:text-[1.3rem] ${className}`} style={style}>
      {t('home.stamp')}
      <small className="whitespace-pre-line">{t('home.stampSub')}</small>
    </p>
  )
}

/** A coin's line as the chart draws it: its colour and its dashes. */
function Swatch({ coinKey, width = 22 }: { coinKey: string; width?: number }) {
  return (
    <svg width={width} height="8" viewBox={`0 0 ${width} 8`} aria-hidden className="shrink-0">
      <line x1="2" x2={width - 2} y1="4" y2="4" stroke={COLOR[coinKey]} strokeWidth="4" strokeLinecap="round" strokeDasharray={DASH[coinKey]} />
    </svg>
  )
}

/** How far a month has been played. Time runs left to right in every language. */
function Progress({ day, days, className = '' }: { day: number; days: number; className?: string }) {
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-text/10 ${className}`} dir="ltr" aria-hidden>
      <div className="h-full rounded-full bg-candy transition-[width] duration-200 motion-reduce:transition-none" style={{ width: `${(day / days) * 100}%` }} />
    </div>
  )
}

/** The rules and the fine print, behind one tap. Other quiet links of a screen sit beside it. */
function Foot({ children }: { children?: ReactNode }) {
  const { tr } = useReplayT()
  const [open, setOpen] = useState(false)
  return (
    <div className="text-[15px]">
      <div className="flex flex-wrap gap-x-8 text-muted">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="alt py-3 font-medium">
          {tr('howTitle')}
        </button>
        {children}
      </div>
      {open && (
        <div className="mt-1 max-w-2xl space-y-2 text-[13.5px] leading-relaxed text-muted">
          <ul className="list-disc space-y-1.5 ps-5">
            <li>{tr('how1')}</li>
            <li>{tr('how2')}</li>
            <li>{tr('how3')}</li>
          </ul>
          <p>{tr('notAdvice')}</p>
        </div>
      )}
    </div>
  )
}

let arrivalCounted = false

export default function TimeMachineView({ onView }: { onView: (v: View) => void }) {
  const [game, setGame] = useState<Game | null>(loadGame)
  const [open, setOpen] = useState(false)
  const [linked] = useState(scenarioFromHash)

  // a first visit that opens on a shared link: the only trace a share leaves
  useEffect(() => {
    if (arrivalCounted || !linked || !arrive().firstVisit) return
    arrivalCounted = true
    track('replay_arrive', linked.id)
  }, [linked])

  const update = (next: Game) => {
    setGame(next)
    saveGame(next)
  }
  const begin = (id: string, fresh: boolean) => {
    if (fresh || game?.id !== id) update(startGame(id))
    setOpen(true)
    window.scrollTo({ top: 0 })
  }

  const sc = open ? scenarioById(game?.id) : null
  if (!sc || !game) return <Pick game={game} linked={linked} onBegin={begin} onView={onView} />
  if (game.day >= sc.days) {
    return <End sc={sc} game={game} onBegin={begin} onLeave={() => setOpen(false)} />
  }
  return (
    <Play
      sc={sc}
      game={game}
      onChange={(next) => {
        if (next.day >= sc.days && game.day < sc.days) {
          reachedEnd(sc.id)
          window.scrollTo({ top: 0 })
        }
        update(next)
      }}
      onLeave={() => setOpen(false)}
    />
  )
}

// ── choosing a trip ─────────────────────────────────────────────────────────

function Pick({
  game,
  linked,
  onBegin,
  onView,
}: {
  game: Game | null
  linked: ReplayScenario | null
  onBegin: (id: string, fresh: boolean) => void
  onView: (v: View) => void
}) {
  const { tr } = useReplayT()
  // the trip a link names comes first; otherwise the one in progress, then the first never finished
  const lead = linked?.id ?? game?.id ?? REPLAYS.find((s) => !played(s.id).finished)?.id ?? REPLAYS[0].id
  return (
    // the gutters are part of the scene: a tilted ticket may reach into them
    <section className="-mx-4 space-y-9 overflow-x-clip px-4 pb-2 md:-mx-6 md:px-6">
      <div className="md:grid md:grid-cols-2 md:items-end md:gap-10">
        <div>
          <p className="text-[15px] font-semibold text-muted">{tr('title')}</p>
          <Caption
            as="h1"
            text={tr('pickCap')}
            className="mt-1 text-[clamp(2.3rem,10.8vw,2.9rem)] md:text-[3.5rem] ltr:text-[clamp(2.1rem,9.6vw,2.6rem)] ltr:md:text-[3.2rem]"
          />
        </div>
        <Says mood="wink" size={84} className="mt-5 md:mt-0">
          <p className="bubble text-[17px] text-balance">{tr('secret')}</p>
        </Says>
      </div>

      <div className="grid items-start gap-9 md:grid-cols-2 md:gap-10">
        {REPLAYS.map((s, i) => (
          <Trip key={s.id} sc={s} n={i + 1} game={game} lead={s.id === lead} onBegin={onBegin} />
        ))}
      </div>

      <Foot>
        <button type="button" onClick={() => onView('practice')} className="alt py-3 font-medium">
          {tr('back')}
        </button>
      </Foot>
    </section>
  )
}

/**
 * One trip. A month never played is a dashed outline, like everything still
 * hidden here; a month played to the end is a ticket with its last result.
 */
function Trip({
  sc,
  n,
  game,
  lead,
  onBegin,
}: {
  sc: ReplayScenario
  n: number
  game: Game | null
  lead: boolean
  onBegin: (id: string, fresh: boolean) => void
}) {
  const { tr } = useReplayT()
  const mine = played(sc.id)
  const inProgress = game?.id === sc.id && game.day < sc.days && (game.day > 0 || game.moves.length > 0)
  const go = `go w-full ${lead ? '' : 'go-sm'}`
  const actions = inProgress ? (
    <>
      <p className="num font-medium text-muted">{tr('day', { d: game.day, n: sc.days })}</p>
      <Progress day={game.day} days={sc.days} className="mt-2.5 mb-5" />
      <button type="button" onClick={() => onBegin(sc.id, false)} className={go}>
        {tr('resumeGo')}
      </button>
      <button type="button" onClick={() => onBegin(sc.id, true)} className="alt mt-3.5 py-3">
        {tr('again')}
      </button>
    </>
  ) : (
    <button type="button" onClick={() => onBegin(sc.id, true)} className={go}>
      {mine.finished ? tr('again') : tr('start')}
    </button>
  )

  if (mine.last) {
    return (
      <div>
        <div className={`ticket-wrap mx-2 max-w-sm ${n % 2 ? '[transform:rotate(-1.3deg)]' : '[transform:rotate(1.1deg)]'}`}>
          <div className={`ticket ${PAPER} text-[15px] font-medium`}>
            <Caption text={tr('trip', { n: `[[${n}]]` })} className="text-[1.75rem]" />
            <dl className="ticket-rule mt-3.5 grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 pt-3.5">
              <dt>{tr('chartYou')}</dt>
              <dd dir="ltr" className="num justify-self-end font-semibold">
                {dollars(mine.last.value, 0)}
              </dd>
              <dt>{tr('chartHold')}</dt>
              <dd dir="ltr" className="num justify-self-end">
                {dollars(mine.last.hold, 0)}
              </dd>
            </dl>
          </div>
        </div>
        <div className="mt-7 max-w-sm">{actions}</div>
      </div>
    )
  }

  return (
    <div className={`max-w-sm rounded-[20px] border-2 border-dashed border-text/35 px-4 pt-4 ${inProgress ? 'pb-2' : 'pb-6'}`}>
      <div className="flex items-start justify-between gap-3">
        <Caption text={tr('trip', { n: `[[${n}]]` })} className="text-[2rem]" />
        {/* the four coins, each in its line's colour, none with a name yet */}
        <span className="flex gap-1.5 pt-1" dir="ltr" aria-hidden>
          {sc.coins.map((c) => (
            <span
              key={c.key}
              className="poster grid size-8 place-items-center rounded-full border-2 border-dashed pt-0.5 text-lg leading-none"
              style={{ borderColor: COLOR[c.key] }}
            >
              ?
            </span>
          ))}
        </span>
      </div>
      {inProgress ? <div className="mt-2">{actions}</div> : <p className="mt-2 mb-5 font-medium text-muted">{tr('tripSub')}</p>}
      {!inProgress && actions}
    </div>
  )
}

// ── playing ─────────────────────────────────────────────────────────────────

function Play({ sc, game, onChange, onLeave }: { sc: ReplayScenario; game: Game; onChange: (g: Game) => void; onLeave: () => void }) {
  const { tr } = useReplayT()
  const { tp, error } = usePracticeT()
  const { wallet } = useMemo(() => playMoves(sc, game.moves), [sc, game.moves])
  const [picked, setPicked] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<ReplayFill | null>(null)
  const [refused, setRefused] = useState<MoveError | null>(null)

  const day = game.day
  const value = valueOn(sc, wallet, day)
  const pct = (value / REPLAY_RULES.startUsdt - 1) * 100
  const left = sc.days - day
  const [worth, unit] = dollars(value).split(' ')

  const trade = (move: Move) => {
    const done = applyMove(sc, wallet, move)
    if ('error' in done) {
      setRefused(done.error)
      setReceipt(null)
      return
    }
    setRefused(null)
    setReceipt(done.fill)
    onChange({ ...game, moves: [...game.moves, move] })
  }
  const advance = (n: number) => {
    setReceipt(null)
    setRefused(null)
    onChange({ ...game, day: Math.min(sc.days, day + n) })
  }

  // each coin's move since yesterday, as its tag shows it; the bar reacts to the largest when it is a big one
  const today = sc.coins.map((c) => ({ key: c.key, pct: changeOn(sc, c.key, day, day - 1) }))
  const most = today.reduce((a, b) => (Math.abs(b.pct) > Math.abs(a.pct) ? b : a))
  const loud = Math.abs(most.pct) >= BIG_MOVE ? most : null
  let mood: Mood = loud ? (loud.pct < 0 ? 'worried' : 'excited') : 'happy'
  let says: string | null = null
  if (refused) {
    says = error(refused)
    mood = 'worried'
  } else if (receipt) {
    says = tr(receipt.side === 'buy' ? 'bought' : 'sold', {
      qty: qty(receipt.qty),
      k: receipt.coin,
      price: receipt.price.toFixed(2),
      cost: dollars(receipt.fee + receipt.spread_cost),
    })
  } else if (!picked && game.moves.length === 0 && (day === 0 || !loud)) {
    // until a first trade: how to make one (on the first day it comes before any news)
    says = tr('pickCoin')
  } else if (loud) {
    says = tr(loud.pct < 0 ? 'fell' : 'rose', { k: loud.key, pct: Math.abs(loud.pct).toFixed(1) })
  }

  // a picked coin's buttons come into view above the "next day" strip
  const panel = useRef<HTMLDivElement>(null)
  const holdsPicked = Boolean(picked && wallet.positions[picked])
  useEffect(() => {
    if (picked) panel.current?.scrollIntoView({ behavior: glide(), block: 'nearest' })
  }, [picked, holdsPicked])

  // the caption is the day, with its number on the marker: "Day 12 of 30"
  const [before, after] = tr('day', { d: '\u0000', n: sc.days }).split('\u0000')
  const open = picked ? sc.coins.find((c) => c.key === picked) : undefined

  return (
    // 10rem: the top bar, the page's top padding and the tab bar. With it the
    // "next day" strip sits in the same place on every day, coin picked or not.
    <section className="max-md:flex max-md:min-h-[calc(100vh-10rem)] max-md:flex-col lg:grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-14 supports-[height:100svh]:max-md:min-h-[calc(100svh-10rem)]">
      <div className="space-y-3.5 lg:row-span-2">
        <div className="-mt-2 flex items-center gap-4">
          <Progress day={day} days={sc.days} className="flex-1" />
          <button type="button" onClick={onLeave} className="alt py-2.5 text-[15px] font-medium text-muted">
            {tr('leave')}
          </button>
        </div>

        {/* the scene: the day as the caption, and the bar, which speaks when there is something to say */}
        <div className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <h1 className="poster text-[2.6rem] lg:text-[3.4rem] ltr:text-[2.4rem] ltr:lg:text-[3.2rem]">
              {before}
              <mark className="mk">
                <span key={day} className={`inline-block ${POP}`}>
                  {day}
                </span>
              </mark>
              {after}
            </h1>
            {/* room for two lines is kept, so a trade's answer never moves the buttons under the thumb */}
            <div className="mt-2 flex min-h-[4.25rem] items-end" aria-live="polite">
              {says && (
                <p key={says} className={`bubble w-full text-[15px] ${POP}`}>
                  {says}
                </p>
              )}
            </div>
          </div>
          <Bar mood={mood} size={56} />
        </div>

        {/* the wallet: what it is worth today, and how much of it is still cash */}
        <dl className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 text-[13.5px] text-muted">
          <dt className="font-semibold">{tr('wallet')}</dt>
          <div className="flex gap-1.5">
            <dt className="font-semibold">{tr('cash')}</dt>
            <dd className="num font-semibold text-text">
              <bdi dir="ltr">{dollars(wallet.cash)}</bdi>
            </dd>
          </div>
          <dd className="col-span-2 mt-1 flex flex-wrap items-baseline gap-x-3">
            <bdi dir="ltr" className="poster text-[2.5rem] leading-none text-text">
              {worth}
              {unit && <span className="ms-1.5 text-[1.2rem]">{unit}</span>}
            </bdi>
            <span>
              <bdi dir="ltr" className={`num font-semibold ${tone(pct)}`}>
                {signed(pct, 1, '%')}
              </bdi>{' '}
              {tr('sinceStart')}
            </span>
          </dd>
        </dl>

        <IndexChart sc={sc} day={day} picked={picked} />
      </div>

      <div className="mt-3.5 space-y-4 max-md:pb-5 lg:mt-12">
        {/* the four hidden coins: a dashed tag each, the one being traded drawn in full */}
        <div className="grid grid-cols-4 gap-2">
          {sc.coins.map((c, i) => (
            <CoinTag
              key={c.key}
              sc={sc}
              coinKey={c.key}
              day={day}
              today={today[i].pct}
              held={Boolean(wallet.positions[c.key])}
              open={picked === c.key}
              onPick={() => {
                setPicked(picked === c.key ? null : c.key)
                setRefused(null)
              }}
            />
          ))}
        </div>

        {open && (
          // 11.5rem: the "next day" strip and the phone's tab bar under it
          <div ref={panel} className="scroll-mb-[11.5rem] md:scroll-mb-6">
            <TradePanel sc={sc} coinKey={open.key} day={day} wallet={wallet} buy={tp('buy')} sell={tp('sell')} onTrade={trade} />
          </div>
        )}
      </div>

      {/* stays in reach above the phone's tab bar: the month is thirty taps long.
          The strip's paper runs on behind the tab bar, so nothing shows between the two. */}
      <div className="sticky bottom-[4.75rem] z-30 -mx-4 mt-5 flex items-center gap-5 max-md:mt-auto bg-bg px-4 pt-3 pb-3.5 shadow-[0_-10px_14px_-10px_rgba(21,23,28,.18)] after:absolute after:inset-x-0 after:top-full after:h-8 after:bg-bg md:static md:mx-0 md:mt-8 md:bg-transparent md:p-0 md:shadow-none md:after:hidden lg:col-start-2">
        {left > 5 && (
          <button type="button" onClick={() => advance(5)} className="alt num shrink-0 py-3 text-[15px]">
            {tr('skip')}
          </button>
        )}
        <button type="button" onClick={() => advance(1)} className="go grow">
          {left === 1 ? tr('seeResult') : tr('next')}
        </button>
      </div>
    </section>
  )
}

function CoinTag({
  sc,
  coinKey,
  day,
  today,
  held,
  open,
  onPick,
}: {
  sc: ReplayScenario
  coinKey: string
  day: number
  today: number
  held: boolean
  open: boolean
  onPick: () => void
}) {
  const { tr } = useReplayT()
  const price = priceOn(sc, coinKey, day)
  return (
    <button
      type="button"
      onClick={onPick}
      aria-expanded={open}
      aria-label={`${tr('coin', { k: coinKey })}: ${price.toFixed(2)}, ${signed(today, 1, '%')} ${tr('today')}`}
      className={`link min-w-0 cursor-pointer rounded-[12px] border-2 px-1 pt-2 pb-2.5 text-center transition ${
        open ? 'border-text' : 'border-dashed border-text/35 hover:border-text/60'
      }`}
    >
      <span className="flex items-center justify-center gap-1.5" dir="ltr">
        <Swatch coinKey={coinKey} width={18} />
        <span className="poster text-[24px] leading-none">{open ? <mark className="mk">{coinKey}</mark> : coinKey}</span>
        {/* a dot on the coins this wallet holds */}
        {held && <span className="size-1.5 rounded-full bg-current" />}
      </span>
      <span className="num mt-1.5 block text-[15px] leading-tight font-semibold" dir="ltr">
        {price.toFixed(2)}
      </span>
      <span className={`num block text-[13px] leading-tight font-semibold ${tone(today)}`} dir="ltr">
        {signed(today, 1, '%')}
      </span>
    </button>
  )
}

/** Buying and selling the coin that is picked: a share of the cash, half or all of what is held. One tap each. */
function TradePanel({
  sc,
  coinKey,
  day,
  wallet,
  buy,
  sell,
  onTrade,
}: {
  sc: ReplayScenario
  coinKey: string
  day: number
  wallet: ReplayWallet
  buy: string
  sell: string
  onTrade: (m: Move) => void
}) {
  const { tr } = useReplayT()
  const price = priceOn(sc, coinKey, day)
  const held = wallet.positions[coinKey]
  const heldValue = held ? held.qty * price : 0
  const canBuy = wallet.cash >= REPLAY_RULES.minTradeUsdt
  return (
    <div className="space-y-2.5" role="group" aria-label={tr('coin', { k: coinKey })}>
      <div className="flex items-center gap-3">
        <p className="poster w-14 shrink-0 text-[22px]">{buy}</p>
        {canBuy ? (
          <div className="grid flex-1 grid-cols-3 gap-2">
            {[0.25, 0.5, 1].map((f) => (
              <TradeButton key={f} onClick={() => onTrade({ day, side: 'buy', coin: coinKey, usdt: f === 1 ? wallet.cash : wallet.cash * f })}>
                <span className="num block text-[17px] font-semibold" dir="ltr">
                  {f * 100}%
                </span>
                <span className="num block text-[12.5px] text-muted" dir="ltr">
                  {dollars(wallet.cash * f, 0)}
                </span>
              </TradeButton>
            ))}
          </div>
        ) : (
          <p className="flex min-h-[3.25rem] flex-1 items-center text-sm text-muted">{tr('noCash')}</p>
        )}
      </div>
      {held && (
        <div className="flex items-center gap-3">
          <p className="poster w-14 shrink-0 text-[22px]">{sell}</p>
          <div className="grid flex-1 grid-cols-2 gap-2">
            {([0.5, 1] as const).map((f) => (
              <TradeButton key={f} onClick={() => onTrade({ day, side: 'sell', coin: coinKey, fraction: f })}>
                <span className="block text-[17px] font-semibold">{f === 1 ? tr('all') : tr('half')}</span>
                <span className="num block text-[12.5px] text-muted" dir="ltr">
                  {dollars(heldValue * f, 0)}
                </span>
              </TradeButton>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TradeButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="link min-h-[3.25rem] cursor-pointer rounded-[14px] border-2 border-text px-1 py-1 text-center leading-tight transition active:translate-y-0.5 active:bg-marker active:text-on-marker active:*:text-on-marker"
    >
      {children}
    </button>
  )
}

/**
 * Every coin's price from 7 days before the start up to today, with the
 * playhead on today; the rest of the month is blank paper and a question mark.
 */
function IndexChart({ sc, day, picked }: { sc: ReplayScenario; day: number; picked: string | null }) {
  const W = 300
  const H = 140
  const pad = 6
  const room = 22 // kept at the far edge for the letters at the lines' ends
  const total = sc.pre + sc.days
  const seen = sc.coins.flatMap((c) => c.index.slice(0, sc.pre + day + 1))
  let lo = Math.min(...seen, 100)
  let hi = Math.max(...seen, 100)
  const air = Math.max((hi - lo) * 0.08, 2)
  lo -= air
  hi += air
  const x = (i: number) => pad + (i / total) * (W - pad - room)
  const y = (v: number) => H - pad - ((v - lo) / (hi - lo)) * (H - 2 * pad)
  const now = (x(sc.pre + day) / W) * 100
  const hidden = 100 - (room / W) * 100 - now

  // a letter at the end of each line, pushed apart where two lines end together
  const ends = sc.coins.map((c) => ({ key: c.key, at: (y(c.index[sc.pre + day]) / H) * 100 })).sort((a, b) => a.at - b.at)
  for (let i = 1; i < ends.length; i++) ends[i].at = Math.max(ends[i].at, ends[i - 1].at + 12)
  const over = Math.max(0, ends[ends.length - 1].at - 95)
  for (const e of ends) e.at -= over

  return (
    <div className="relative h-28 w-full lg:h-64 [@media(max-height:700px)]:h-24" dir="ltr" aria-hidden>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <line x1={pad} x2={W - room} y1={y(100)} y2={y(100)} stroke="var(--color-text)" strokeOpacity={0.3} strokeWidth={1.5} strokeDasharray="1 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <line x1={x(sc.pre)} x2={x(sc.pre)} y1={0} y2={H} stroke="var(--color-text)" strokeOpacity={0.14} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        {sc.coins.map((c) => (
          <polyline
            key={c.key}
            points={c.index
              .slice(0, sc.pre + day + 1)
              .map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`)
              .join(' ')}
            fill="none"
            stroke={COLOR[c.key]}
            strokeWidth={picked === c.key ? 4 : 2.6}
            strokeOpacity={picked && picked !== c.key ? 0.38 : 1}
            strokeDasharray={DASH[c.key]}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {hidden > 16 && (
        <span className="poster absolute inset-y-0 grid place-items-center text-[3.25rem] text-text/15" style={{ left: `calc(${now}% + 20px)`, width: `calc(${hidden}% - 20px)` }}>
          ?
        </span>
      )}
      <span
        className="absolute inset-y-0 w-1 -translate-x-1/2 rounded-full bg-candy transition-[left] duration-200 motion-reduce:transition-none"
        style={{ left: `${now}%` }}
      />
      {ends.map((e) => (
        <span
          key={e.key}
          className="poster absolute -translate-y-1/2 text-[15px] leading-none transition-[left] duration-200 motion-reduce:transition-none"
          style={{ left: `calc(${now}% + 7px)`, top: `${e.at}%`, color: COLOR[e.key], opacity: picked && picked !== e.key ? 0.4 : 1 }}
        >
          {e.key}
        </span>
      ))}
    </div>
  )
}

// ── the end ─────────────────────────────────────────────────────────────────

const NOTE_LESSON: Record<ReplayNote['id'], string> = {
  fomo: 'fomo',
  panic: 'price-swings',
  concentration: 'position-size',
  overtrading: 'fees-spread',
}

const NOTE_MOOD: Record<ReplayNote['id'], Mood> = {
  fomo: 'thinking',
  panic: 'worried',
  concentration: 'thinking',
  overtrading: 'wink',
}

function End({
  sc,
  game,
  onBegin,
  onLeave,
}: {
  sc: ReplayScenario
  game: Game
  onBegin: (id: string, fresh: boolean) => void
  onLeave: () => void
}) {
  const { tr, lang } = useReplayT()
  const [copied, setCopied] = useState(false)
  const [story, setStory] = useState(false)
  const mine = useMemo(() => {
    const { wallet, costs } = playMoves(sc, game.moves)
    return { value: valueOn(sc, wallet, sc.days), costs }
  }, [sc, game.moves])

  const scored = useQuery<Finished>({
    queryKey: ['replay-finish', game.id, game.moves],
    queryFn: () => finishGame(game),
    staleTime: Infinity,
    retry: 1,
    refetchOnWindowFocus: false,
  })
  const result = scored.data?.result
  const reveal = scored.data?.reveal
  useEffect(() => {
    if (result) rememberResult(sc.id, result.value, result.hold_value)
  }, [sc.id, result])

  // the server's number once it is here; until then, and if it never comes, the app's own (the same sum)
  const value = result?.value ?? mine.value
  const pct = (value / REPLAY_RULES.startUsdt - 1) * 100
  const diff = result ? value - result.hold_value : null
  const other = REPLAYS.find((s) => s.id !== sc.id)
  const locale = lang === 'ar' ? 'ar-TN' : lang
  const date = (iso: string) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  const [worth, unit] = dollars(value).split(' ')

  const share = async () => {
    if (!result) return
    track('replay_share', sc.id)
    const text = `${tr('shareText', { you: Math.round(result.value), hold: Math.round(result.hold_value) })} ${replayLink(sc.id)}`
    if (typeof navigator.share === 'function') {
      await navigator.share({ text }).catch(() => {})
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt(tr('share'), text) // some in-app browsers block the clipboard
    }
  }

  const notes = result?.notes ?? []
  const hasStory = reveal != null && `event.${reveal.event}` in R

  return (
    // the gutters are part of the scene: the tilted ticket and its stamp may reach into them
    <section className="-mx-4 overflow-x-clip px-4 pb-2 md:-mx-6 md:px-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-14">
      <div>
        <Caption
          as="h1"
          text={tr('endTitle')}
          className="text-[clamp(2.3rem,10.8vw,2.9rem)] lg:text-[3.5rem] ltr:text-[clamp(2.1rem,9.6vw,2.6rem)] ltr:lg:text-[3.2rem]"
        />

        {/* the month as a record: what it ended at, next to the same start simply held in Bitcoin */}
        <div className={`ticket-wrap mx-1.5 mt-12 max-w-md [transform:rotate(-1.1deg)] lg:mx-0 ${DROP}`}>
          <div className={`ticket ${PAPER} text-[15px] font-medium`}>
            <p className="flex items-center gap-2">
              <span className="h-[3px] w-4 shrink-0 rounded bg-gold-bright" aria-hidden />
              {tr('youEnded')}
            </p>
            <p className="mt-2 flex flex-wrap items-baseline gap-x-3">
              <bdi dir="ltr" className="poster text-[46px] leading-none">
                {worth}
                {unit && <span className="ms-1.5 text-[20px]">{unit}</span>}
              </bdi>
              <bdi dir="ltr" className={`num text-base font-semibold ${tone(pct)}`}>
                {signed(pct, 1, '%')}
              </bdi>
            </p>

            {/* the chart's two lines are named by the rows they belong to */}
            <dl className="ticket-rule mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 pt-4">
              <dt className="flex items-center gap-2">
                <span className="w-4 shrink-0 border-t-2 border-dashed border-neutral" aria-hidden />
                {tr('holdBtc')}
              </dt>
              {result ? (
                <dd dir="ltr" className="num font-semibold">
                  {dollars(result.hold_value)}
                  <span className={`ms-2 text-[13px] ${tone(result.hold_pct)}`}>{signed(result.hold_pct, 1, '%')}</span>
                </dd>
              ) : (
                <dd className="text-[13px] font-normal text-muted">{scored.isError ? '--' : tr('counting')}</dd>
              )}
            </dl>
            {result && <ResultChart result={result} />}

            {diff != null && Math.abs(diff) >= 0.5 && (
              <p className="ticket-rule poster mt-4 pt-3.5 text-[22px]">{tr(diff < 0 ? 'below' : 'above', { v: dollars(Math.abs(diff), 0) })}</p>
            )}
            {result && result.trades > 0 && (
              <p className="mt-2.5 text-[13px] font-normal text-muted">
                {tr(result.trades === 1 ? 'oneTrade' : 'tradesLine', { n: result.trades, cost: dollars(result.costs) })}
              </p>
            )}
          </div>
          <Stamp className="absolute -end-3 -top-9 scale-90 bg-white" />
        </div>

        {scored.isError && (
          <div className="mt-8 max-w-md" role="status">
            <Says mood="worried">
              <p className="bubble">{tr('revealFailed')}</p>
            </Says>
            <button type="button" onClick={() => void scored.refetch()} className="go go-sm mt-5 px-7">
              {tr('retry')}
            </button>
          </div>
        )}
      </div>

      <div className="mt-11 space-y-9 lg:mt-3">
        {/* the reveal: when it was, and which coin was behind each letter */}
        {reveal && (
          <div>
            <Caption text={tr('revealTitle')} className="text-[2.1rem] lg:text-[2.5rem]" />
            <Caption
              as="p"
              text={tr('revealDates', { from: `[[${date(reveal.from)}]]`, to: `[[${date(reveal.to)}]]` })}
              className="mt-2.5 text-[1.5rem] leading-[1.5]! ltr:text-[1.35rem]"
            />
            <ul className="mt-5 max-w-md space-y-3">
              {reveal.coins.map((c, i) => (
                <li key={c.key} className={`flex items-center gap-3 ${POP}`} style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                  <span
                    className="flex h-11 w-[4.25rem] shrink-0 items-center justify-center gap-1.5 rounded-[10px] border-2 border-dashed border-text/35"
                    dir="ltr"
                    role="img"
                    aria-label={tr('coin', { k: c.key })}
                  >
                    <Swatch coinKey={c.key} width={18} />
                    <span className="poster text-[22px] leading-none">{c.key}</span>
                  </span>
                  <span className="poster min-w-0 flex-1 text-[26px] leading-tight">
                    <bdi>{c.name}</bdi>
                  </span>
                  <bdi dir="ltr" className={`num text-[17px] font-semibold ${tone(c.pct)}`}>
                    {signed(c.pct, 1, '%')}
                  </bdi>
                </li>
              ))}
            </ul>
            {hasStory && (
              <>
                <button type="button" onClick={() => setStory((s) => !s)} aria-expanded={story} className="alt mt-4 py-3">
                  {tr('eventOpen')}
                </button>
                {story && <p className="mt-1 max-w-xl leading-relaxed">{tr(`event.${reveal.event}` as ReplayKey)}</p>}
              </>
            )}
          </div>
        )}

        {/* the bar's last word: the habits it noticed, then what one month can and cannot say */}
        <Says mood={notes[0] ? NOTE_MOOD[notes[0].id] : 'thinking'} className="max-w-md">
          {notes.map((n) => (
            <div key={`${n.id}:${n.day}`}>
              <p className="bubble after:hidden">
                {tr(`note.${n.id}`, { day: n.day, name: n.name ?? '', pct: Math.abs(n.pct ?? 0), count: n.count ?? 0 })}
              </p>
              {READY_LESSONS.some((l) => l.slug === NOTE_LESSON[n.id]) && (
                <a href={`#learn-${NOTE_LESSON[n.id]}`} className="alt mt-1 py-3 text-sm">
                  {tr('lesson')}
                </a>
              )}
            </div>
          ))}
          <p className="bubble">{tr('oneMonth')}</p>
        </Says>

        <div className="max-w-md">
          <button type="button" disabled={!result} onClick={() => void share()} className="go w-full disabled:pointer-events-none disabled:opacity-40">
            {copied ? tr('copied') : tr('share')}
          </button>
          <div className="mt-5 flex flex-wrap gap-x-8">
            {other && (
              <button type="button" onClick={() => onBegin(other.id, true)} className="alt py-3">
                {tr('otherTrip')}
              </button>
            )}
            <button type="button" onClick={() => onBegin(sc.id, true)} className="alt py-3">
              {tr('again')}
            </button>
          </div>
        </div>

        <Foot>
          <button type="button" onClick={onLeave} className="alt py-3 font-medium">
            {tr('title')}
          </button>
        </Foot>
      </div>
    </section>
  )
}

/** The wallet day by day next to the same start held in Bitcoin, with the start (1000) as a dotted baseline. */
function ResultChart({ result }: { result: Finished['result'] }) {
  const pts = result.curve
  const W = 300
  const H = 90
  const pad = 6
  const values = pts.flatMap((p) => [p.value, p.hold]).concat(result.start)
  let lo = Math.min(...values)
  let hi = Math.max(...values)
  const minSpan = result.start * 0.02
  if (hi - lo < minSpan) {
    const mid = (hi + lo) / 2
    lo = mid - minSpan / 2
    hi = mid + minSpan / 2
  }
  const x = (i: number) => pad + (i / Math.max(1, pts.length - 1)) * (W - 2 * pad)
  const y = (v: number) => H - pad - ((v - lo) / (hi - lo)) * (H - 2 * pad)
  const line = (key: 'value' | 'hold') => pts.map((p, i) => `${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ')
  const base = (y(result.start) / H) * 100
  return (
    // time runs left to right in every language
    <div className="relative mt-3 h-24" dir="ltr" aria-hidden>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <line x1={pad} x2={W - pad} y1={y(result.start)} y2={y(result.start)} stroke="var(--color-muted)" strokeOpacity={0.5} strokeDasharray="1 5" strokeWidth={1.5} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <polyline points={line('hold')} fill="none" stroke="var(--color-neutral)" strokeWidth={1.8} strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
        <polyline points={line('value')} fill="none" stroke="var(--color-gold-bright)" strokeWidth={2.8} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* the dotted line is the start: the 1000 dollars left untouched */}
      <span className={`num absolute end-1 text-[11.5px] font-semibold text-muted ${base > 22 ? '-translate-y-[115%]' : 'translate-y-[15%]'}`} style={{ top: `${base}%` }}>
        {dollars(result.start, 0)}
      </span>
    </div>
  )
}
