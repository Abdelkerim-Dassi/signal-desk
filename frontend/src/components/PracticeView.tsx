import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import type { CSSProperties, ReactNode, SVGProps } from 'react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { usePracticeT } from '../lib/i18n-practice'
import { RESTORED, chooseWallet, dismissLink, keepChanged, keepLink, keepWallet, retryLink, useKeep } from '../lib/keep'
import type { LinkState } from '../lib/keep'
import { LEARN_UI, LESSONS, READY_LESSONS } from '../lib/lessons'
import type {
  CoachNote,
  Ledger,
  PracticeCoin,
  PracticeError,
  PracticeState,
  QuoteResult,
  Trade,
} from '../lib/practice'
import {
  START_CHOICES,
  freshLedger,
  getPracticeState,
  isFirstTradeEver,
  isOrderError,
  loadLedger,
  price,
  qty,
  quoteTrade,
  saveLedger,
  signed,
  tnd,
  usdt,
  withCurvePoint,
  withTrade,
} from '../lib/practice'
import { markActive } from '../lib/returning'
import { track } from '../lib/source'
import BotInvite from './BotInvite'
import Caption from './brand/Caption'
import Mascot from './brand/Mascot'
import type { Mood } from './brand/Mascot'
import { CoinIcon, KaratBadge, RiskChip } from './Rating'

// The practice wallet, as a scene from the videos (reel.css):
//   a wallet that has not traded   one caption, the bar saying one line, one button
//   right after that first trade   its receipt as a ticket, one sentence, what to do next
//   after that                     the wallet as a ticket, then trade, then the coach
// A ticket is a record of something that happened, a bubble is the bar
// speaking, the stamp says the money is pretend (once per screen, on the first
// thing shown), and everything else sits directly on the paper.

/** Tab icon: a coin on a practice target. */
export const IconPractice = (p: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...p}
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
  </svg>
)

const tone = (n: number | null | undefined) => (n == null || Math.abs(n) < 0.005 ? 'text-muted' : n > 0 ? 'text-up' : 'text-down')

/** A ticket is white paper in both themes, so what is printed on it takes the light theme's colours. */
const PAPER =
  '[--color-text:#15171c] [--color-muted:#5e6068] [--color-subtle:#f1eee7] [--color-up:#0e9f6e] [--color-down:#e0484e] [--color-strong:#0e9f6e] [--color-weak:#e0484e] [--color-neutral:#64748b] [--color-warn:#b45309] [--color-gold:#9a6b14] [--color-gold-bright:#c9962f] [--color-gold-soft:#f6ecd6]'

// Motion only answers an action: a ticket drops in when a trade lands, and the bar's answer pops.
const DROP = 'motion-safe:animate-[drop_0.45s_cubic-bezier(0.2,1.3,0.4,1)_both]'
const POP = 'motion-safe:animate-[pop_0.3s_cubic-bezier(0.2,1.5,0.4,1)_both]'
const POP_LATE = 'motion-safe:animate-[pop_0.3s_0.4s_cubic-bezier(0.2,1.5,0.4,1)_both]'

/** The stamp on a ticket's corner. It reaches past the paper's edge, so it keeps a white back (dark theme). */
const ON_TICKET = 'absolute -end-3 -top-9 scale-90 bg-white'

const glide = (): ScrollBehavior =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

/** A choice among a few (a coin, an amount, buy or sell): pressed is ink on the marker. */
const pick = (on: boolean) =>
  `link cursor-pointer border-2 font-semibold transition ${
    on ? 'border-text bg-marker text-on-marker' : 'border-text/15 hover:border-text/40'
  }`

export default function PracticeView({ onToast }: { onToast: (msg: string) => void }) {
  const { tp } = usePracticeT()
  const [ledger, setLedger] = useState<Ledger>(loadLedger)
  const [lastNotes, setLastNotes] = useState<{ trade: Trade } | null>(() => {
    const last = loadLedger().trades.at(-1)
    return last ? { trade: last } : null
  })
  // the one-tap first trade shows its own receipt where the button was
  const [firstDone, setFirstDone] = useState<Trade | null>(null)
  // the trade confirmed during this visit: the coach answers it once (how the screen moves, nothing else)
  const [landed, setLanded] = useState<number | null>(null)
  // every change is stored here, and a kept wallet's saved copy follows (lib/keep.ts)
  const keep = useKeep()
  useEffect(() => {
    saveLedger(ledger)
    keepChanged()
  }, [ledger])
  // the saved copy replaced the stored wallet: a link was opened, or another browser traded
  useEffect(() => {
    const restored = () => {
      const next = loadLedger()
      const last = next.trades.at(-1)
      setLedger(next)
      setLastNotes(last ? { trade: last } : null)
      setFirstDone(null)
      setLanded(null)
    }
    window.addEventListener(RESTORED, restored)
    return () => window.removeEventListener(RESTORED, restored)
  }, [])

  // After each valuation: fix the BTC benchmark on the first live price, and
  // add a point to the wallet-vs-BTC line (forced right after a trade). Skipped
  // if the wallet changed while the request was in flight.
  const absorb = (sent: Ledger, s: PracticeState) =>
    setLedger((l) => {
      if (JSON.stringify(l.wallet) !== JSON.stringify(sent.wallet) || l.startedAt !== sent.startedAt) return l
      if (l.btcHoldQty == null) {
        // the refetch that carries the benchmark adds the first point
        return s.benchmark_btc_qty ? { ...l, btcHoldQty: s.benchmark_btc_qty } : l
      }
      const lastTrade = l.trades.at(-1)?.ts ?? 0
      const lastPoint = l.curve.at(-1)?.ts ?? 0
      const v = s.valuation
      return withCurvePoint(l, { ts: Date.now(), value: v.value, hold: v.btc_hold_value }, lastTrade > lastPoint)
    })

  const stateQuery = useQuery({
    queryKey: ['practice', ledger.wallet, ledger.startedAt, ledger.btcHoldQty],
    queryFn: async () => {
      const s = await getPracticeState(ledger)
      absorb(ledger, s)
      return s
    },
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: 1,
  })
  const state = stateQuery.data

  const reset = (start: number) => {
    setLedger(freshLedger(start))
    setLastNotes(null)
    setFirstDone(null)
    setLanded(null)
    dismissLink()
    onToast(tp('resetDone', { start }))
  }

  const onTraded = (result: QuoteResult, oneTap = false) => {
    const next = withTrade(ledger, result)
    const trade = next.trades.at(-1)!
    if (isFirstTradeEver(ledger)) track('practice_first', oneTap ? 'tap' : 'form')
    markActive()
    setLedger(next)
    setLastNotes({ trade })
    setFirstDone(oneTap ? trade : null)
    setLanded(trade.ts)
    dismissLink()
    if (!oneTap) onToast(tp('traded'))
  }

  const traded = ledger.trades.length > 0
  const fresh = firstDone !== null
  const last = lastNotes?.trade ?? null
  // once there is something to lose, or a link already exists; not while a link asks which wallet stays
  const showKeep = (traded || Boolean(keep.id)) && keep.link.status !== 'ask'

  return (
    // the gutters are part of the scene: a tilted ticket and its stamp may reach into them
    <section className="-mx-4 space-y-12 overflow-x-clip px-4 pb-2 md:-mx-6 md:px-6">
      <LinkNotice link={keep.link} />

      {!traded && (
        <FirstScene
          ledger={ledger}
          ready={Boolean(state)}
          loading={!state && stateQuery.isLoading}
          failed={!state && stateQuery.isError}
          onRetry={() => stateQuery.refetch()}
          onTraded={(r) => onTraded(r, true)}
        />
      )}
      {firstDone && <Receipt trade={firstDone} cash={ledger.wallet.cash} />}

      {traded && !state && stateQuery.isLoading && (
        <p className="text-muted" role="status">
          {tp('loading')}
        </p>
      )}
      {/* also shown over prices already on screen, so stale numbers never pass for live ones;
          a wallet that has not traded and has no prices at all says it in its own scene */}
      {stateQuery.isError && (traded || state) && <LoadFailed onRetry={() => stateQuery.refetch()} />}

      {(state || traded || showKeep) && (
        // Phones: one column, in the order below. Right after the first trade
        // its receipt comes first, then what to do next (keep, the Time
        // machine), then the wallet. Desktop: the wallet on one side, trading
        // and the coach on the other.
        <div className={`flex flex-col gap-y-12 ${traded ? 'lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-14' : ''}`}>
          <div className={traded ? 'contents lg:block lg:space-y-12' : 'contents'}>
            {state && traded && (
              <div className={fresh ? 'order-3' : 'order-1'}>
                <WalletTicket ledger={ledger} state={state} top={!fresh} />
              </div>
            )}
            {showKeep && (
              <div className={!traded ? 'order-5' : fresh ? 'order-1' : 'order-2'}>
                <Keep id={keep.id} />
              </div>
            )}
            {/* what to do after a first trade: at live prices little moves in a day */}
            {traded && (
              <div className={fresh ? 'order-2' : 'order-3'}>
                <TimeMachineEntry />
              </div>
            )}
            {state && traded && (
              <div className="order-7">
                <History trades={ledger.trades} />
              </div>
            )}
          </div>
          <div className={traded ? 'contents lg:block lg:space-y-12' : 'contents'}>
            {state && (
              <div className="order-4">
                <TradeForm ledger={ledger} state={state} wide={!traded} onTraded={onTraded} />
              </div>
            )}
            {/* right after the one-tap trade the bar speaks under the receipt instead */}
            {state && last && !fresh && (
              <div className="order-5">
                <Coach key={last.ts} last={last} answer={landed === last.ts} />
              </div>
            )}
            {state && traded && (
              <div className="order-6">
                <BotInvite place="practice" />
              </div>
            )}
          </div>
        </div>
      )}

      <Foot state={state} onReset={reset} />
    </section>
  )
}

// ── the pieces every scene here is made of ──────────────────────────────────

/** The bar on its gold disc, so it never stands on a dark page. */
function Bar({ mood = 'happy', size = 76 }: { mood?: Mood; size?: number }) {
  const disc = Math.round(size * 1.24)
  return (
    <span className="grid shrink-0 place-items-center rounded-full bg-marker" style={{ width: disc, height: disc }} aria-hidden>
      <Mascot mood={mood} size={size} />
    </span>
  )
}

/** The bar says something: bubbles on the reading side, the bar where their tail points. */
function Says({
  mood,
  size,
  className = '',
  children,
}: {
  mood?: Mood
  size?: number
  className?: string
  children: ReactNode
}) {
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

/** One printed line of a ticket: what it is, and the figure at the far edge. */
function Line({ label, strong = false, children }: { label: ReactNode; strong?: boolean; children: ReactNode }) {
  return (
    <>
      <dt>{label}</dt>
      <dd dir="ltr" className={`num justify-self-end ${strong ? 'font-semibold' : ''}`}>
        {children}
      </dd>
    </>
  )
}

function useWhen() {
  const { lang } = usePracticeT()
  return (ts: number) =>
    new Date(ts).toLocaleString(lang === 'ar' ? 'ar-TN' : lang, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
}

// ── a wallet that has not traded yet ────────────────────────────────────────

/** Quick buy amounts sized to the wallet: 5%, 10% and 25% of the start (1, 2, 5 for an old 10 USDT wallet). */
function buyChips(start: number): number[] {
  if (start >= 1000) return [50, 100, 250]
  if (start >= 500) return [25, 50, 100]
  if (start >= 100) return [5, 10, 25]
  return [1, 2, 5]
}
const SELL_CHIPS = [0.25, 0.5, 1]

/**
 * A wallet that has never traded gets one scene: the caption, the bar saying
 * one line, and its first trade in one tap. It is the purchase the form below
 * opens on: Bitcoin, for the middle amount, 100 USDT in a 1000 USDT wallet.
 * Same request, so the same live price, fee, spread, coach notes and counting.
 * The button waits for the live prices, as it always has; if they do not come,
 * the scene says so where the button would be.
 */
function FirstScene({
  ledger,
  ready,
  loading,
  failed,
  onRetry,
  onTraded,
}: {
  ledger: Ledger
  ready: boolean
  loading: boolean
  failed: boolean
  onRetry: () => void
  onTraded: (r: QuoteResult) => void
}) {
  const { tp, error } = usePracticeT()
  const { t } = useI18n()
  const amount = buyChips(ledger.startUsdt)[1]
  const place = useMutation({
    mutationFn: () => quoteTrade(ledger, { side: 'buy', base: 'BTC', usdt: amount }),
    onSuccess: onTraded,
  })
  const err = place.error as PracticeError | null

  // On a phone the scene is the whole first screen: the caption on top, the
  // button at the thumb, and the bar on its stage takes the height left
  // between them (k is that height against the 236px it was drawn for).
  const stage = useRef<HTMLDivElement>(null)
  const [k, setK] = useState(1)
  useLayoutEffect(() => {
    const el = stage.current
    if (!el || typeof ResizeObserver !== 'function') return
    // reports once as soon as it starts watching, then on every change of size
    const watch = new ResizeObserver(() => setK(Math.max(0.85, Math.min(1.22, el.clientHeight / 236))))
    watch.observe(el)
    return () => watch.disconnect()
  }, [])

  const action = (
    <>
      {ready && (
        <button
          type="button"
          disabled={place.isPending}
          onClick={() => place.mutate()}
          className="go w-full disabled:pointer-events-none disabled:opacity-50"
        >
          {place.isPending ? tp('working') : tp('firstBuy', { amount })}
        </button>
      )}
      {loading && (
        <p className="go pointer-events-none opacity-40" role="status">
          {tp('loading')}
        </p>
      )}
      {failed && (
        <>
          <p className="mb-4 font-medium">{tp('loadFailed')}</p>
          <button type="button" onClick={onRetry} className="go w-full">
            {tp('retry')}
          </button>
        </>
      )}
      {err && <p className="mt-5 text-sm font-medium text-down">{error(err.code)}</p>}
    </>
  )
  return (
    // 11.75rem: the top bar, the page's top padding and the phone's bottom menu
    <div className="flex min-h-[calc(100vh-11.75rem)] flex-col justify-between supports-[height:100svh]:min-h-[calc(100svh-11.75rem)] md:grid md:min-h-0 md:grid-cols-2 md:items-center md:gap-8 supports-[height:100svh]:md:min-h-0">
      <div>
        <Caption
          as="h1"
          text={tp('titleCap', { start: ledger.startUsdt })}
          className="pt-1 text-[clamp(2.75rem,8.3vh,4.4rem)] md:text-[4.5rem] ltr:text-[clamp(2.4rem,7vh,3.7rem)] ltr:md:text-[4rem]"
        />
        <div className="relative z-10 mt-9 hidden max-w-md md:block">{action}</div>
      </div>

      <div ref={stage} className="relative mx-auto my-3 max-h-[288px] min-h-[200px] w-full max-w-[400px] flex-1 md:my-0 md:h-[288px] md:flex-none">
        <span
          className="absolute -end-[46px] top-0 rounded-full bg-marker md:end-0"
          style={{ width: 236 * k, height: 236 * k }}
          aria-hidden
        />
        <span className="absolute end-[10px] md:end-[44px]" style={{ top: 80 * k }}>
          <Mascot mood={failed ? 'worried' : 'happy'} size={Math.round(186 * k)} blink label={t('home.barLabel')} />
        </span>
        {!failed && <p className="bubble absolute start-0 top-3 max-w-[224px] text-[17px] text-balance">{tp('firstTitle')}</p>}
        <Stamp className="absolute start-1 border-sami text-sami outline-sami md:-start-3" style={{ top: 118 * k }} />
      </div>

      <div className="relative z-10 md:hidden">{action}</div>
    </div>
  )
}

// ── right after the first trade ─────────────────────────────────────────────

const NOTE_MOOD: Record<CoachNote['id'], Mood> = {
  fomo: 'thinking',
  panic: 'worried',
  concentration: 'thinking',
  storm: 'worried',
  overtrading: 'wink',
}

/** The lesson that explains a habit note, when one is written: practice leads back to learning. */
const NOTE_LESSON: Partial<Record<CoachNote['id'], string>> = {
  fomo: 'fomo',
  panic: 'price-swings',
  storm: 'market-weather',
  concentration: 'position-size',
  overtrading: 'fees-spread',
}

function NoteLesson({ id }: { id: CoachNote['id'] }) {
  const { lang } = usePracticeT()
  const index = READY_LESSONS.findIndex((l) => l.slug === NOTE_LESSON[id])
  if (index < 0) return null
  const lesson = READY_LESSONS[index]
  const n = LESSONS.findIndex((l) => l.slug === lesson.slug) + 1
  return (
    <a href={`#learn-${lesson.slug}`} className="alt mt-1 py-3 text-sm">
      {LEARN_UI.lessonN[lang].replace('{n}', String(n))}: {lesson.title[lang]}
    </a>
  )
}

/** The coach's notes on a trade, each one said by the bar, with the lesson that explains it. */
function Notes({ notes }: { notes: CoachNote[] }) {
  const { note } = usePracticeT()
  return (
    <>
      {notes.map((n, i) => (
        <div key={i}>
          {/* only the last bubble keeps its tail */}
          <p className={`bubble ${i < notes.length - 1 ? 'after:hidden' : ''}`}>{note(n)}</p>
          <NoteLesson id={n.id} />
        </div>
      ))}
    </>
  )
}

/**
 * What the one-tap trade gave, shown where its button was: the receipt (what
 * was bought, at what price, what it cost, what is left) and one sentence from
 * the bar, or the coach's notes when it has some.
 */
function Receipt({ trade, cash }: { trade: Trade; cash: number }) {
  const { tp } = usePracticeT()
  const when = useWhen()
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // braces on purpose: newer browsers return a promise from scrollIntoView, and an effect must return nothing
    box.current?.scrollIntoView({ behavior: glide(), block: 'start' })
  }, [])
  const mood = trade.notes[0] ? NOTE_MOOD[trade.notes[0].id] : 'excited'
  return (
    // mb-8 (not the section's usual 12): on a phone, what to do next follows closely, it belongs to this scene
    <div ref={box} className="mb-8 scroll-mt-20 md:mb-12 md:grid md:grid-cols-2 md:items-center md:gap-x-10" aria-live="polite">
      <Caption
        as="h1"
        text={tp('tradedCap')}
        className="pt-1 text-[clamp(2.4rem,11.5vw,3.1rem)] md:col-start-1 md:row-start-1 md:self-end md:text-[4rem] ltr:text-[clamp(2.3rem,10.5vw,2.9rem)] ltr:md:text-[3.6rem]"
      />
      <div className={`ticket-wrap mx-2 mt-10 max-w-sm md:col-start-2 md:row-span-2 md:row-start-1 md:mx-auto md:mt-8 md:w-full ${DROP}`}>
        <div className={`ticket ${PAPER} text-[15px] font-medium`}>
          <p className="flex items-center gap-2.5 pb-4">
            <span className="*:size-9">
              <CoinIcon symbol={trade.base} />
            </span>
            <span className="flex flex-col items-start">
              <bdi dir="ltr" className="poster text-[24px] leading-none">
                {trade.base}
              </bdi>
              <span className="num mt-1 text-[13px] font-normal text-muted">{when(trade.ts)}</span>
            </span>
          </p>
          <dl className="ticket-rule grid grid-cols-[1fr_auto] gap-x-3 gap-y-2.5 py-4">
            <Line label={tp('bought')} strong>
              {qty(trade.qty)} {trade.base}
            </Line>
            <Line label={tp('fillAt')}>{price(trade.price)}</Line>
            <Line label={tp('fee')}>{usdt(trade.fee, 4)}</Line>
            <Line label={tp('spread')}>{usdt(trade.spread_cost, 4)}</Line>
          </dl>
          <p className="ticket-rule poster flex flex-wrap items-baseline justify-between gap-x-3 pt-3.5 text-[22px]">
            <span>{tp('cashLeft')}</span>
            <bdi dir="ltr">{usdt(cash)}</bdi>
          </p>
        </div>
        <Stamp className={ON_TICKET} />
      </div>
      <Says mood={mood} className={`mt-6 md:col-start-1 md:row-start-2 md:mt-7 md:self-start ${POP_LATE}`}>
        {trade.notes.length > 0 ? <Notes notes={trade.notes} /> : <p className="bubble">{tp('firstSay')}</p>}
      </Says>
    </div>
  )
}

// ── the wallet ──────────────────────────────────────────────────────────────

/** The wallet as one ticket: what it is worth, how that compares, and what is in it. */
function WalletTicket({ ledger, state, top }: { ledger: Ledger; state: PracticeState; top: boolean }) {
  const { tp, lang } = usePracticeT()
  const v = state.valuation
  const [worth, unit] = usdt(v.value).split(' ')
  const started = new Date(ledger.startedAt).toLocaleDateString(lang === 'ar' ? 'ar-TN' : lang, {
    day: 'numeric',
    month: 'short',
  })
  const charted = ledger.curve.length >= 2
  const coin = (b: string) => state.coins.find((c) => c.base === b)
  const Title = top ? 'h1' : 'h2'
  return (
    // the stamp hangs over the top edge, so the ticket leaves it room
    <div className={`ticket-wrap mx-1.5 max-w-md [transform:rotate(-1.1deg)] lg:mx-0 ${top ? 'mt-7' : ''}`}>
      <div className={`ticket ${PAPER} text-[15px] font-medium`}>
        <Title className="poster text-[22px]">{tp('balance')}</Title>
        <p className="poster mt-2 text-[46px] leading-none">
          <bdi dir="ltr">
            {worth}
            {unit && <span className="ms-1.5 text-[20px]">{unit}</span>}
          </bdi>
        </p>
        <p className="num mt-1.5 text-sm font-normal text-muted">
          <bdi dir="ltr">{tnd(v.value, state.tnd_rate)}</bdi>
        </p>

        {/* the two lines of the chart are named by the rows they belong to */}
        <dl className="ticket-rule mt-4 grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-2.5 pt-4">
          <dt className="flex items-center gap-2">
            {charted && <span className="h-[3px] w-4 shrink-0 rounded bg-gold-bright" aria-hidden />}
            {tp('pnl')}
          </dt>
          <dd dir="ltr" className={`num justify-self-end font-semibold ${tone(v.pnl)}`}>
            {signed(v.pnl)} <span className="font-normal">({signed(v.pnl_pct, 2, '%')})</span>
          </dd>
          <dt className="flex items-center gap-2">
            {charted && <span className="w-4 shrink-0 border-t-2 border-dashed border-neutral" aria-hidden />}
            {tp('chartHold')}
          </dt>
          {v.btc_hold_value != null ? (
            <dd dir="ltr" className="num justify-self-end">
              {usdt(v.btc_hold_value, 2).replace(' USDT', '')}{' '}
              <span className={tone(v.btc_hold_pnl_pct)}>({signed(v.btc_hold_pnl_pct, 2, '%')})</span>
            </dd>
          ) : (
            <dd className="justify-self-end text-[13px] font-normal text-muted">{tp('holdWaiting')}</dd>
          )}
        </dl>
        <CurveChart ledger={ledger} />

        <ul className="ticket-rule mt-4 space-y-3 pt-4">
          <li className="flex items-center gap-2.5">
            <span className="poster grid size-8 shrink-0 place-items-center rounded-full bg-subtle text-lg" aria-hidden>
              $
            </span>
            <span className="flex-1">{tp('cash')}</span>
            <bdi dir="ltr" className="num font-semibold">
              {usdt(v.cash)}
            </bdi>
          </li>
          {v.positions.map((p) => (
            <li key={p.base} className="flex items-center gap-2.5">
              <span className="*:size-8">
                <CoinIcon symbol={p.base} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-1.5">
                  <bdi dir="ltr" className="font-semibold">
                    {p.base}
                  </bdi>
                  <KaratBadge karat={coin(p.base)?.karat} size="sm" />
                </span>
                {p.share != null && (
                  <span className="mt-0.5 block text-[13px] font-normal text-muted">
                    {tp('ofWallet', { v: Math.round(p.share * 100) })}
                  </span>
                )}
              </span>
              <span className="flex flex-col items-end">
                <bdi dir="ltr" className="num font-semibold">
                  {usdt(p.value)}
                </bdi>
                <bdi dir="ltr" className={`num mt-0.5 text-[13px] font-normal ${tone(p.pnl)}`}>
                  {signed(p.pnl, 3)} ({signed(p.pnl_pct, 1, '%')})
                </bdi>
              </span>
            </li>
          ))}
        </ul>

        <p className="ticket-rule mt-4 pt-3 text-[13px] font-normal text-muted">
          {tp('startedOn', { date: started, start: ledger.startUsdt })}
        </p>
      </div>
      {top && <Stamp className={ON_TICKET} />}
    </div>
  )
}

/** Wallet value vs "just held BTC" over time, with the starting amount as a baseline. */
function CurveChart({ ledger }: { ledger: Ledger }) {
  const pts = ledger.curve
  if (pts.length < 2) return null
  const W = 300
  const H = 80
  const pad = 6
  const values = pts.flatMap((p) => (p.hold != null ? [p.value, p.hold] : [p.value])).concat(ledger.startUsdt)
  let lo = Math.min(...values)
  let hi = Math.max(...values)
  // at least ±1% of the start in view, so cents of fees don't look like a crash
  const minSpan = ledger.startUsdt * 0.02
  if (hi - lo < minSpan) {
    const mid = (hi + lo) / 2
    lo = mid - minSpan / 2
    hi = mid + minSpan / 2
  }
  const t0 = pts[0].ts
  const t1 = pts[pts.length - 1].ts
  const x = (ts: number) => pad + ((ts - t0) / Math.max(1, t1 - t0)) * (W - 2 * pad)
  const y = (v: number) => H - pad - ((v - lo) / (hi - lo)) * (H - 2 * pad)
  const line = (key: 'value' | 'hold') =>
    pts
      .filter((p) => p[key] != null)
      .map((p) => `${x(p.ts).toFixed(1)},${y(p[key] as number).toFixed(1)}`)
      .join(' ')
  return (
    // time runs left to right in every language
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="mt-3 h-20 w-full" aria-hidden>
      <line
        x1={pad}
        x2={W - pad}
        y1={y(ledger.startUsdt)}
        y2={y(ledger.startUsdt)}
        stroke="var(--color-muted)"
        strokeOpacity={0.35}
        strokeDasharray="2 4"
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={line('hold')}
        fill="none"
        stroke="var(--color-neutral)"
        strokeWidth={1.5}
        strokeDasharray="5 4"
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={line('value')}
        fill="none"
        stroke="var(--color-gold-bright)"
        strokeWidth={2.4}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function History({ trades }: { trades: Trade[] }) {
  const { tp } = usePracticeT()
  const when = useWhen()
  const [open, setOpen] = useState(false)
  if (trades.length === 0) return null
  return (
    <div>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="alt py-3">
        {tp('history')}
      </button>
      {open && (
        <ul className="mt-1 max-w-md divide-y divide-text/10">
          {trades
            .slice(-10)
            .reverse()
            .map((tr) => (
              <li key={tr.ts} className="flex items-baseline gap-3 py-2.5 text-[15px]">
                <span className="w-11 shrink-0 font-semibold">{tr.side === 'buy' ? tp('bought') : tp('sold')}</span>
                <span className="flex min-w-0 flex-1 flex-col items-start">
                  <bdi dir="ltr" className="num">
                    {qty(tr.qty)} {tr.base}
                  </bdi>
                  <span className="text-[12.5px] text-muted">{when(tr.ts)}</span>
                </span>
                <span className="flex flex-col items-end">
                  <bdi dir="ltr" className="num font-semibold">
                    {usdt(tr.side === 'buy' ? tr.gross : tr.net)}
                  </bdi>
                  <bdi dir="ltr" className="num text-[12.5px] text-muted">
                    {price(tr.price)}
                  </bdi>
                </span>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}

// ── what to do next ─────────────────────────────────────────────────────────

/**
 * Keep my wallet (lib/keep.ts). The wallet lives in this browser only, and a
 * video's in-app browser is not the one the visitor uses tomorrow. One button
 * makes a private link to a saved copy; after that it is one line that opens
 * the link again.
 */
function Keep({ id }: { id: string | null }) {
  const { tp } = usePracticeT()
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!id) {
    const keep = async () => {
      setBusy(true)
      setFailed(false)
      try {
        await keepWallet()
        setOpen(true)
      } catch {
        setFailed(true)
      } finally {
        setBusy(false)
      }
    }
    return (
      <div className="max-w-md">
        <button type="button" disabled={busy} onClick={keep} className="go go-sm w-full disabled:pointer-events-none disabled:opacity-50">
          {busy ? tp('working') : tp('keepButton')}
        </button>
        {failed && <p className="mt-4 text-sm font-medium text-down">{tp('keepFailed')}</p>}
        <p className="mt-4 text-[13.5px] text-muted">{tp('keepWhy')}</p>
      </div>
    )
  }

  if (!open) {
    return (
      <p className="flex max-w-md flex-wrap items-center justify-between gap-x-5">
        <span className="font-medium">✓ {tp('keptTitle')}</span>
        <button type="button" onClick={() => setOpen(true)} aria-expanded={false} className="alt py-3">
          {tp('keepShow')}
        </button>
      </p>
    )
  }

  const url = keepLink(id)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt(tp('keepCopy'), url) // some in-app browsers block the clipboard
    }
  }
  return (
    <div className="max-w-md">
      <p className="font-medium">✓ {tp('keptTitle')}</p>
      {/* shown whole, so it can still be selected by hand where copying is blocked */}
      <p dir="ltr" className="num mt-3 rounded-xl border-2 border-dashed border-text/25 px-3 py-2.5 text-xs break-all select-all">
        {url}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button type="button" onClick={copy} className="go go-sm px-7">
          {copied ? tp('keepCopied') : tp('keepCopy')}
        </button>
        {typeof navigator.share === 'function' && (
          <button type="button" onClick={() => void navigator.share({ title: 'Qirat', url }).catch(() => {})} className="alt py-3">
            {tp('keepShare')}
          </button>
        )}
      </div>
      <p className="mt-5 text-[13.5px] leading-relaxed text-muted">{tp('keptLine')}</p>
    </div>
  )
}

/**
 * The way into the Time machine: at live prices little moves in a day, there a
 * real past month plays in four minutes. The caption and the button's words
 * are the first screen's. (TimeMachineView has a card of its own for this
 * place; this screen draws the entry itself, in the reel look.)
 */
function TimeMachineEntry() {
  const { t } = useI18n()
  return (
    <a href="#replay" className="story flex max-w-md items-center gap-4 rounded-2xl">
      <span className="min-w-0 flex-1">
        <Caption as="span" text={t('home.replayH')} className="block text-[2rem]" />
        <span className="alt mt-3">{t('home.replayGo')}</span>
      </span>
      <svg viewBox="0 0 150 96" className="w-[128px] shrink-0 overflow-visible text-text" aria-hidden>
        <polyline
          points="2,62 8,56 14,59 20,44 26,48 32,36 38,40 44,24 50,32 56,28 62,47 68,52"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="68,52 74,62 80,58 86,67 92,54 98,46 104,51 110,38 116,42 122,28 128,32 134,21 140,29 148,10"
          fill="none"
          stroke="currentColor"
          strokeOpacity=".2"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 7"
        />
        <line x1="68" y1="6" x2="68" y2="76" stroke="var(--color-candy)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="68" cy="52" r="6.5" fill="var(--color-marker)" stroke="currentColor" strokeWidth="3" />
        <rect x="1" y="86" width="67" height="6" rx="3" fill="currentColor" />
        <rect x="71" y="86" width="78" height="6" rx="3" fill="currentColor" fillOpacity=".14" />
      </svg>
    </a>
  )
}

// ── a trade ─────────────────────────────────────────────────────────────────

function CoinChip({
  coin,
  selected,
  held,
  onPick,
}: {
  coin: PracticeCoin
  selected: boolean
  held: boolean
  onPick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={selected}
      aria-label={`${coin.base} ${coin.name}`}
      className={`${pick(selected)} flex h-12 shrink-0 items-center gap-2 rounded-full ps-1.5 pe-4 text-[15px]`}
    >
      <span className="*:size-8">
        <CoinIcon symbol={coin.base} />
      </span>
      <span dir="ltr">{coin.base}</span>
      {/* a dot on the coins this wallet holds */}
      {held && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
    </button>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`${pick(active)} num h-11 min-w-16 rounded-full px-4 text-[15px]`}
      dir="ltr"
    >
      {children}
    </button>
  )
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-1.5">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

function TradeForm({
  ledger,
  state,
  wide,
  onTraded,
}: {
  ledger: Ledger
  state: PracticeState
  /** on a desktop, the form has the whole width (a wallet that has not traded yet) */
  wide: boolean
  onTraded: (r: QuoteResult) => void
}) {
  const { tp, error } = usePracticeT()
  const [base, setBase] = useState('BTC')
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const chips = buyChips(ledger.startUsdt)
  const [amount, setAmount] = useState(() => String(chips[1]))
  const [fraction, setFraction] = useState(1)
  const coin = state.coins.find((c) => c.base === base) ?? state.coins[0]
  const held = ledger.wallet.positions[coin?.base ?? '']
  const cash = ledger.wallet.cash

  // the debounced order, so typing doesn't fire a quote per keystroke
  const order = useMemo(
    () =>
      side === 'buy'
        ? ({ side, base: coin?.base ?? 'BTC', usdt: Number(amount) } as const)
        : ({ side, base: coin?.base ?? 'BTC', fraction } as const),
    [side, coin?.base, amount, fraction],
  )
  const [debounced, setDebounced] = useState(order)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(order), 350)
    return () => window.clearTimeout(id)
  }, [order])

  const valid = side === 'buy' ? Number(amount) > 0 : Boolean(held)
  const preview = useQuery({
    queryKey: ['practice-quote', debounced, ledger.wallet],
    queryFn: () => quoteTrade(ledger, debounced, true),
    enabled: valid && debounced === order,
    staleTime: 10_000,
    retry: false,
  })
  const place = useMutation({
    mutationFn: () => quoteTrade(ledger, order),
    onSuccess: (r) => {
      onTraded(r)
      // refill the form with an amount the remaining cash still covers
      const left = Math.floor(r.wallet_after.cash * 100) / 100
      setAmount(left >= 1 ? String(Math.min(chips[1], left)) : '')
    },
  })
  useEffect(() => place.reset(), [order]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!coin) return null
  const err = (place.error ?? (valid ? preview.error : null)) as PracticeError | null
  const fill = preview.data?.fill

  return (
    <div>
      <Caption text={tp('trade')} className="text-[2.1rem] md:text-[2.5rem]" />
      <div className={wide ? 'lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-14' : ''}>
        <div>
          {/* phones: one row to swipe through; desktop: all of them */}
          <div
            className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none] md:-mx-6 md:px-6 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label={tp('coin')}
          >
            {state.coins.map((c) => (
              <CoinChip
                key={c.base}
                coin={c}
                selected={c.base === coin.base}
                held={Boolean(ledger.wallet.positions[c.base])}
                onPick={() => setBase(c.base)}
              />
            ))}
          </div>

          <div className="mt-4 flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="poster text-[28px]">{coin.name}</p>
              <p className="num mt-0.5 text-[19px] font-semibold">
                <bdi dir="ltr">{price(coin.price)}</bdi>
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 pt-1">
              <KaratBadge karat={coin.karat} size="sm" />
              <RiskChip risk={coin.risk} />
            </div>
          </div>
          <dl className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[13.5px] text-muted">
            <Fact label={tp('day1')}>
              <bdi dir="ltr" className={`num font-semibold ${tone(coin.change_24h)}`}>
                {signed(coin.change_24h, 1, '%')}
              </bdi>
            </Fact>
            <Fact label={tp('day7')}>
              <bdi dir="ltr" className={`num font-semibold ${tone(coin.change_7d)}`}>
                {signed(coin.change_7d, 1, '%')}
              </bdi>
            </Fact>
            <Fact label={tp('weatherNow')}>
              <span className="font-semibold text-text">{tp(`weather.${state.weather}`)}</span>
            </Fact>
          </dl>
        </div>

        <div className={wide ? 'mt-6 lg:mt-3' : 'mt-6'}>
          <div className="grid grid-cols-2 gap-2.5" role="group">
            {(['buy', 'sell'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                aria-pressed={side === s}
                className={`link h-12 cursor-pointer rounded-[14px] border-2 text-[17px] font-semibold transition ${
                  side === s ? 'border-text bg-text text-bg' : 'border-text/15 text-muted hover:border-text/40'
                }`}
              >
                {tp(s)}
              </button>
            ))}
          </div>

          {side === 'buy' ? (
            <div className="mt-5">
              <label className="block">
                <span className="text-[13.5px] font-semibold text-muted">{tp('amount')}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={1}
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="poster num mt-1 block w-full min-w-0 [appearance:textfield] border-b-[3px] border-text/25 bg-transparent pb-1 text-[46px] leading-none outline-none transition focus:border-candy rtl:text-end [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  dir="ltr"
                />
              </label>
              <p className="num mt-1.5 min-h-5 text-[13.5px] leading-5 text-muted">
                {Number(amount) > 0 && <bdi dir="ltr">{tnd(Number(amount), state.tnd_rate)}</bdi>}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {chips.map((n) => (
                  <Chip key={n} active={Number(amount) === n} onClick={() => setAmount(String(n))}>
                    {n}
                  </Chip>
                ))}
                <Chip active={Math.abs(Number(amount) - cash) < 1e-6} onClick={() => setAmount(String(Math.floor(cash * 100) / 100))}>
                  {tp('max')}
                </Chip>
              </div>
              <p className="mt-3 text-[13.5px] text-muted">
                {tp('cashLeft')}:{' '}
                <bdi dir="ltr" className="num font-semibold text-text">
                  {usdt(cash)}
                </bdi>
              </p>
            </div>
          ) : held ? (
            <div className="mt-5">
              <p className="text-[13.5px] font-semibold text-muted">{tp('sellShare', { base: coin.base })}</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {SELL_CHIPS.map((f) => (
                  <Chip key={f} active={fraction === f} onClick={() => setFraction(f)}>
                    {f * 100}%
                  </Chip>
                ))}
              </div>
              <p className="num mt-3 text-[13.5px] text-muted">
                <bdi dir="ltr">
                  {qty(held.qty)} {coin.base} ≈ {usdt(held.qty * coin.price)}
                </bdi>
              </p>
            </div>
          ) : (
            <p className="mt-5 text-muted">{tp('noneHeld', { base: coin.base })}</p>
          )}

          {/* what the trade would give, as the ticket it will become */}
          {valid && !preview.error && (
            <div className="ticket-wrap mx-1 mt-7 [transform:rotate(0.8deg)]">
              <div className={`ticket ${PAPER} grid min-h-[11.25rem] content-center text-[15px] font-medium`}>
                {fill ? (
                  <dl className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2.5">
                    <Line label={tp('youGet')} strong>
                      {side === 'buy' ? `${qty(fill.qty)} ${fill.base}` : usdt(fill.net, 4)}
                    </Line>
                    <Line label={tp('fillAt')}>{price(fill.price)}</Line>
                    <Line label={tp('fee')}>{usdt(fill.fee, 4)}</Line>
                    <Line label={tp('spread')}>{usdt(fill.spread_cost, 4)}</Line>
                  </dl>
                ) : (
                  <p className="text-center font-normal text-muted">{tp('quoting')}</p>
                )}
              </div>
            </div>
          )}

          {err && <p className="mt-5 text-sm font-medium text-down">{error(err.code)}</p>}

          <button
            type="button"
            // an order the wallet can't make stays blocked; a failed price lookup
            // does not, so pressing the button is also the way to try again
            disabled={!valid || place.isPending || isOrderError(preview.error)}
            onClick={() => place.mutate()}
            className="go mt-8 w-full disabled:pointer-events-none disabled:opacity-40"
          >
            {place.isPending ? tp('working') : side === 'buy' ? tp('confirmBuy') : tp('confirmSell')}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── the coach ───────────────────────────────────────────────────────────────

/**
 * The habit coach is the bar: after a trade it says what it noticed, with a
 * face to match, or that it has nothing to say. It answers the trade that just
 * landed (it comes into view and pops); on a later visit it is simply there.
 */
function Coach({ last, answer }: { last: Trade; answer: boolean }) {
  const { tp } = usePracticeT()
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (answer) box.current?.scrollIntoView({ behavior: glide(), block: 'nearest' })
  }, [answer])
  const mood = last.notes[0] ? NOTE_MOOD[last.notes[0].id] : 'happy'
  return (
    <div ref={box} className="max-w-md scroll-mt-20 scroll-mb-28" aria-live="polite">
      <p className="mb-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13.5px] text-muted">
        <span className="who bg-marker text-on-marker">{tp('coach')}</span>
        {tp('lastTrade', { side: last.side === 'buy' ? tp('bought') : tp('sold'), base: last.base })}
      </p>
      <Says mood={mood} className={answer ? POP : ''}>
        {last.notes.length === 0 ? <p className="bubble">{tp('coachNone')}</p> : <Notes notes={last.notes} />}
      </Says>
    </div>
  )
}

// ── a keep link being opened, prices that did not come ──────────────────────

/** What a keep link being opened is doing, and the one question it can ask. */
function LinkNotice({ link }: { link: LinkState }) {
  const { tp } = usePracticeT()
  const { t } = useI18n()
  if (link.status === 'idle') return null
  if (link.status === 'opening') {
    return (
      <p className="text-muted" role="status">
        {tp('linkOpening')}
      </p>
    )
  }
  if (link.status === 'ask') {
    // neither answer is the "main" one: each of them removes a wallet from this browser
    const answers = [
      { which: 'saved', label: tp('askSaved'), n: link.savedTrades },
      { which: 'here', label: tp('askLocal'), n: link.localTrades },
    ] as const
    return (
      <div role="group" aria-label={tp('askTitle')}>
        <Caption text={tp('askTitle')} className="text-[2.1rem] md:text-[2.5rem]" />
        <p className="mt-3 max-w-xl leading-relaxed text-muted">{tp('askBody')}</p>
        <div className="mt-5 grid max-w-xl gap-3 sm:grid-cols-2">
          {answers.map((a) => (
            <button
              key={a.which}
              type="button"
              onClick={() => chooseWallet(a.which)}
              className="link cursor-pointer rounded-[14px] border-2 border-text px-4 py-3 text-start transition hover:bg-text/5"
            >
              <span className="block font-semibold">{a.label}</span>
              <span className="block text-sm text-muted">{tp('askTrades', { n: a.n })}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }
  const opened = link.status === 'opened'
  return (
    <div className="max-w-md" role="status">
      <Says mood={opened ? 'happy' : 'worried'}>
        <p className="bubble">{opened ? tp('linkOpened') : link.status === 'gone' ? tp('linkGone') : tp('linkFailed')}</p>
      </Says>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        {link.status === 'failed' && (
          <button type="button" onClick={retryLink} className="go go-sm px-7">
            {tp('retry')}
          </button>
        )}
        <button type="button" onClick={dismissLink} className="alt py-3">
          {t('guide.close')}
        </button>
      </div>
    </div>
  )
}

function LoadFailed({ onRetry }: { onRetry: () => void }) {
  const { tp } = usePracticeT()
  return (
    <div className="max-w-md">
      <Says mood="worried">
        <p className="bubble">{tp('loadFailed')}</p>
      </Says>
      <button type="button" onClick={onRetry} className="go go-sm mt-5 px-7">
        {tp('retry')}
      </button>
    </div>
  )
}

// ── starting over, and the rules ────────────────────────────────────────────

const TILT = ['-rotate-2', 'rotate-1', '-rotate-1']

/**
 * The foot of the screen, each behind one tap: starting over (the three
 * amounts are three notes of pretend money), and the rules with the dinar
 * rate and its source.
 */
function Foot({ state, onReset }: { state: PracticeState | undefined; onReset: (start: number) => void }) {
  const { tp } = usePracticeT()
  const [asking, setAsking] = useState(false)
  const [rules, setRules] = useState(false)
  return (
    <div className="space-y-4 text-[15px]">
      {asking && (
        <div className="max-w-md space-y-6">
          <Says mood="worried">
            <p className="bubble">{tp('resetAsk')}</p>
          </Says>
          <div className="grid grid-cols-3 gap-3.5 px-1">
            {START_CHOICES.map((n, i) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} USDT`}
                onClick={() => {
                  setAsking(false)
                  onReset(n)
                }}
                className={`link cursor-pointer rounded-md bg-white px-2 pt-3.5 pb-2.5 text-center text-[#15171c] shadow-[0_10px_18px_-10px_rgba(90,60,10,.45)] transition active:translate-y-0.5 ${TILT[i % TILT.length]}`}
              >
                <bdi dir="ltr" className="poster block text-[30px] leading-none">
                  {n}
                </bdi>
                <span className="mt-1 block text-xs font-semibold text-[#5e6068]" dir="ltr">
                  USDT
                </span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setAsking(false)} className="alt py-3">
            {tp('cancel')}
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-x-8 text-muted">
        {!asking && (
          <button type="button" onClick={() => setAsking(true)} className="alt py-3 font-medium">
            {tp('reset')}
          </button>
        )}
        <button type="button" onClick={() => setRules((r) => !r)} aria-expanded={rules} className="alt py-3 font-medium">
          {tp('rulesOpen')}
        </button>
      </div>
      {rules && (
        <div className="max-w-2xl space-y-2 text-[13.5px] leading-relaxed text-muted">
          <p>{tp('firstNote')}</p>
          <p>{tp('rules')}</p>
          <p>{tp('coachIntro')}</p>
          {state && (
            <p>
              {tp('tndNote', { rate: state.tnd_rate.toFixed(3) })}
              {!state.tnd_live && <> {tp('tndEstimate')}</>}
              {state.tnd_live && (
                <>
                  {' '}
                  <bdi dir="ltr">
                    (
                    <a
                      href="https://www.exchangerate-api.com"
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2 hover:text-text"
                    >
                      Rates By Exchange Rate API
                    </a>
                    )
                  </bdi>
                </>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
