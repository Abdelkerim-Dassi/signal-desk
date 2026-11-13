import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import type { ReactNode, SVGProps } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { usePracticeT } from '../lib/i18n-practice'
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
import BotInvite from './BotInvite'
import { CoinIcon, KaratBadge, RiskChip } from './Rating'

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

const field =
  'w-full min-w-0 rounded-xl border border-border bg-subtle/60 px-3 py-2 text-sm outline-none transition focus:border-border-strong'

const tone = (n: number | null | undefined) => (n == null || Math.abs(n) < 0.005 ? 'text-muted' : n > 0 ? 'text-up' : 'text-down')

function SimBadge({ short = false }: { short?: boolean }) {
  const { tp } = usePracticeT()
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-warn/30 bg-warn/10 px-2.5 py-0.5 text-[11px] font-semibold text-warn">
      <span aria-hidden className="size-1.5 rounded-full bg-warn" />
      {short ? tp('simShort') : tp('sim')}
    </span>
  )
}

export default function PracticeView({ onToast }: { onToast: (msg: string) => void }) {
  const { tp } = usePracticeT()
  const [ledger, setLedger] = useState<Ledger>(loadLedger)
  const [lastNotes, setLastNotes] = useState<{ trade: Trade } | null>(() => {
    const last = loadLedger().trades.at(-1)
    return last ? { trade: last } : null
  })
  useEffect(() => saveLedger(ledger), [ledger])

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
    onToast(tp('resetDone', { start }))
  }

  const onTraded = (result: QuoteResult) => {
    const next = withTrade(ledger, result)
    setLedger(next)
    setLastNotes({ trade: next.trades.at(-1)! })
    onToast(tp('traded'))
  }

  return (
    <section className="space-y-4">
      <div className="space-y-2 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">{tp('title', { start: ledger.startUsdt })}</h2>
          <SimBadge />
        </div>
        <p className="text-sm text-muted">{tp('intro', { start: ledger.startUsdt })}</p>
      </div>

      {!state && stateQuery.isLoading && <div className="card p-5 text-sm text-muted">{tp('loading')}</div>}
      {/* also shown over prices already on screen, so stale numbers never pass for live ones */}
      {stateQuery.isError && (
        <div className="card flex flex-wrap items-center gap-3 p-5 text-sm">
          <span className="text-muted">{tp('loadFailed')}</span>
          <button
            onClick={() => stateQuery.refetch()}
            className="cursor-pointer rounded-full border border-border-strong px-4 py-1.5 font-medium text-gold transition hover:bg-gold-soft"
          >
            {tp('retry')}
          </button>
        </div>
      )}

      {state && (
        // phones: one column, balance → trade → coach → holdings → history;
        // desktop: wallet on one side, trading and the coach on the other
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div className="contents lg:block lg:space-y-4">
            <div className="order-1">
              <BalanceCard ledger={ledger} state={state} />
            </div>
            <div className="order-4">
              <Holdings state={state} />
            </div>
            {ledger.trades.length > 0 && (
              <div className="order-5">
                <History trades={ledger.trades} rate={state.tnd_rate} />
              </div>
            )}
          </div>
          <div className="contents lg:block lg:space-y-4">
            <div className="order-2">
              <TradeCard ledger={ledger} state={state} onTraded={onTraded} />
            </div>
            <div className="order-3">
              <CoachCard last={lastNotes?.trade ?? null} />
            </div>
            {ledger.trades.length > 0 && (
              <div className="order-3">
                <BotInvite place="practice" />
              </div>
            )}
          </div>
        </div>
      )}

      <ResetBar onReset={reset} />

      <p className="px-1 text-xs leading-relaxed text-muted">
        {tp('rules')}
        {state && (
          <>
            {' '}
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
                    className="underline underline-offset-2 hover:text-gold"
                  >
                    Rates By Exchange Rate API
                  </a>
                  )
                </bdi>
              </>
            )}
          </>
        )}
      </p>
    </section>
  )
}

function BalanceCard({ ledger, state }: { ledger: Ledger; state: PracticeState }) {
  const { tp, lang } = usePracticeT()
  const v = state.valuation
  const started = new Date(ledger.startedAt).toLocaleDateString(lang === 'ar' ? 'ar-TN' : lang, {
    day: 'numeric',
    month: 'short',
  })
  return (
    <div className="card hero-wash rise space-y-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted">{tp('balance')}</p>
          <p className="num text-3xl font-semibold" dir="ltr">
            {usdt(v.value)}
          </p>
          <p className="num text-sm text-muted" dir="ltr">
            {tnd(v.value, state.tnd_rate)}
          </p>
        </div>
        <SimBadge short />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-subtle/60 p-3">
          <p className="text-xs text-muted">{tp('pnl')}</p>
          <p className={`num text-lg font-semibold ${tone(v.pnl)}`} dir="ltr">
            {signed(v.pnl)} USDT
          </p>
          <p className={`num text-xs ${tone(v.pnl_pct)}`} dir="ltr">
            {signed(v.pnl_pct, 2, '%')}
          </p>
        </div>
        <div className="rounded-2xl bg-subtle/60 p-3">
          <p className="text-xs text-muted">{tp('hold', { start: ledger.startUsdt })}</p>
          {v.btc_hold_value != null ? (
            <>
              <p className="num text-lg font-semibold" dir="ltr">
                {usdt(v.btc_hold_value)}
              </p>
              <p className={`num text-xs ${tone(v.btc_hold_pnl_pct)}`} dir="ltr">
                {signed(v.btc_hold_pnl_pct, 2, '%')}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted">{tp('holdWaiting')}</p>
          )}
        </div>
      </div>
      <CurveChart ledger={ledger} />
      <p className="text-xs text-muted">{tp('startedOn', { date: started, start: ledger.startUsdt })}</p>
    </div>
  )
}

/** Wallet value vs "just held BTC" over time, with the starting amount as a baseline. */
function CurveChart({ ledger }: { ledger: Ledger }) {
  const { tp } = usePracticeT()
  const pts = ledger.curve
  if (pts.length < 2) return null
  const W = 300
  const H = 90
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
    <div className="space-y-1.5">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-24 w-full" aria-hidden>
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
          strokeWidth={2.2}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-gold-bright" /> {tp('chartYou')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0 w-4 border-t-2 border-dashed border-neutral" /> {tp('chartHold')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0 w-4 border-t border-dotted border-muted" /> {tp('chartStart', { start: ledger.startUsdt })}
        </span>
      </div>
    </div>
  )
}

function CoinRow({ coin, selected, onPick }: { coin: PracticeCoin; selected: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={selected}
      aria-label={`${coin.base} ${coin.name}`}
      className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 text-start transition ${
        selected ? 'bg-gold-soft ring-1 ring-border-strong' : 'hover:bg-subtle'
      }`}
    >
      <span className="*:size-7">
        <CoinIcon symbol={coin.base} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold" dir="ltr">
          {coin.base}
        </span>
        <span className="block truncate text-[11px] text-muted">{coin.name}</span>
      </span>
      <KaratBadge karat={coin.karat} size="sm" />
      <RiskChip risk={coin.risk} />
      <span className={`num hidden w-14 text-end text-xs sm:block ${tone(coin.change_7d)}`} dir="ltr">
        {signed(coin.change_7d, 1, '%')}
      </span>
    </button>
  )
}

/** Quick buy amounts sized to the wallet: 5%, 10% and 25% of the start (1, 2, 5 for an old 10 USDT wallet). */
function buyChips(start: number): number[] {
  if (start >= 1000) return [50, 100, 250]
  if (start >= 500) return [25, 50, 100]
  if (start >= 100) return [5, 10, 25]
  return [1, 2, 5]
}
const SELL_CHIPS = [0.25, 0.5, 1]

function TradeCard({
  ledger,
  state,
  onTraded,
}: {
  ledger: Ledger
  state: PracticeState
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
    <div className="card space-y-4 p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{tp('trade')}</h3>
        <SimBadge short />
      </div>

      <div className="max-h-72 space-y-0.5 overflow-y-auto pe-1" role="group" aria-label={tp('coin')}>
        {state.coins.map((c) => (
          <CoinRow key={c.base} coin={c} selected={c.base === coin.base} onPick={() => setBase(c.base)} />
        ))}
      </div>

      <div className="space-y-3 rounded-2xl bg-subtle/50 p-3.5">
        <div className="flex items-center gap-3">
          <CoinIcon symbol={coin.base} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold">{coin.name}</span>
              <KaratBadge karat={coin.karat} size="sm" />
              <RiskChip risk={coin.risk} />
            </div>
            <p className="num text-xs text-muted">
              <bdi dir="ltr">{price(coin.price)}</bdi> · {tp('day1')}{' '}
              <bdi dir="ltr" className={tone(coin.change_24h)}>
                {signed(coin.change_24h, 1, '%')}
              </bdi>{' '}
              · {tp('day7')}{' '}
              <bdi dir="ltr" className={tone(coin.change_7d)}>
                {signed(coin.change_7d, 1, '%')}
              </bdi>
            </p>
          </div>
        </div>
        <p className="text-xs text-muted">
          {tp('weatherNow')}: <span className="font-medium text-text">{tp(`weather.${state.weather}`)}</span>
        </p>

        <div className="grid grid-cols-2 rounded-full bg-card p-1" role="group">
          {(['buy', 'sell'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSide(s)}
              aria-pressed={side === s}
              className={`cursor-pointer rounded-full py-1.5 text-sm font-semibold transition ${
                side === s ? 'bg-text text-bg' : 'text-muted hover:text-text'
              }`}
            >
              {tp(s)}
            </button>
          ))}
        </div>

        {side === 'buy' ? (
          <div className="space-y-2">
            <label className="block">
              <span className="mb-1 block text-xs text-muted">{tp('amount')}</span>
              <input
                type="number"
                inputMode="decimal"
                min={1}
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`${field} num`}
                dir="ltr"
              />
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {chips.map((n) => (
                <Chip key={n} active={Number(amount) === n} onClick={() => setAmount(String(n))}>
                  {n}
                </Chip>
              ))}
              <Chip active={Math.abs(Number(amount) - cash) < 1e-6} onClick={() => setAmount(String(Math.floor(cash * 100) / 100))}>
                {tp('max')}
              </Chip>
              <span className="num ms-auto text-xs text-muted">
                {tp('cashLeft')}: <bdi dir="ltr">{usdt(cash)}</bdi>
              </span>
            </div>
            {Number(amount) > 0 && (
              <p className="num text-xs text-muted" dir="ltr">
                {usdt(Number(amount))} {tnd(Number(amount), state.tnd_rate)}
              </p>
            )}
          </div>
        ) : held ? (
          <div className="space-y-2">
            <span className="block text-xs text-muted">{tp('sellShare', { base: coin.base })}</span>
            <div className="flex gap-1.5">
              {SELL_CHIPS.map((f) => (
                <Chip key={f} active={fraction === f} onClick={() => setFraction(f)}>
                  {f * 100}%
                </Chip>
              ))}
            </div>
            <p className="num text-xs text-muted" dir="ltr">
              {qty(held.qty)} {coin.base} ≈ {usdt(held.qty * coin.price)}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted">{tp('noneHeld', { base: coin.base })}</p>
        )}

        {valid && (
          <dl className="num space-y-1 border-t border-border pt-3 text-xs">
            {preview.isFetching && !fill && <p className="text-muted">{tp('quoting')}</p>}
            {fill && !preview.error && (
              <>
                <Row label={tp('youGet')}>
                  <span className="font-semibold text-text">
                    {side === 'buy' ? `${qty(fill.qty)} ${fill.base}` : usdt(fill.net, 4)}
                  </span>
                </Row>
                <Row label={tp('fillAt')}>{price(fill.price)}</Row>
                <Row label={tp('fee')}>{usdt(fill.fee, 4)}</Row>
                <Row label={tp('spread')}>{usdt(fill.spread_cost, 4)}</Row>
              </>
            )}
          </dl>
        )}

        {err && <p className="text-sm text-down">{error(err.code)}</p>}

        <button
          type="button"
          // an order the wallet can't make stays blocked; a failed price lookup
          // does not, so pressing the button is also the way to try again
          disabled={!valid || place.isPending || isOrderError(preview.error)}
          onClick={() => place.mutate()}
          className="w-full cursor-pointer rounded-full bg-text py-2.5 text-sm font-semibold text-bg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {place.isPending ? tp('working') : side === 'buy' ? tp('confirmBuy') : tp('confirmSell')}
        </button>
      </div>
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`num min-w-12 cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition ${
        active ? 'border-border-strong bg-gold-soft text-gold' : 'border-border text-muted hover:text-text'
      }`}
      dir="ltr"
    >
      {children}
    </button>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-3 text-muted">
      <dt>{label}</dt>
      <dd dir="ltr">{children}</dd>
    </div>
  )
}

/** The lesson that explains a habit note, when one is written: practice leads back to learning. */
const NOTE_LESSON: Partial<Record<CoachNote['id'], string>> = {
  fomo: 'fomo',
  panic: 'price-swings',
  storm: 'price-swings',
}

function NoteLesson({ id }: { id: CoachNote['id'] }) {
  const { lang } = usePracticeT()
  const index = READY_LESSONS.findIndex((l) => l.slug === NOTE_LESSON[id])
  if (index < 0) return null
  const lesson = READY_LESSONS[index]
  const n = LESSONS.findIndex((l) => l.slug === lesson.slug) + 1
  return (
    <a
      href={`#learn-${lesson.slug}`}
      className="mt-1.5 block text-xs font-medium text-gold underline-offset-2 hover:underline"
    >
      {LEARN_UI.lessonN[lang].replace('{n}', String(n))}: {lesson.title[lang]}
    </a>
  )
}

function CoachCard({ last }: { last: Trade | null }) {
  const { tp, note } = usePracticeT()
  return (
    <div className="card space-y-3 p-5">
      <div>
        <h3 className="font-semibold">{tp('coach')}</h3>
        <p className="text-xs text-muted">{tp('coachIntro')}</p>
      </div>
      {!last && <p className="text-sm text-muted">{tp('coachEmpty')}</p>}
      {last && (
        <>
          <p className="text-xs text-muted">
            {tp('lastTrade', { side: last.side === 'buy' ? tp('bought') : tp('sold'), base: last.base })}
          </p>
          {last.notes.length === 0 ? (
            <p className="rounded-2xl bg-subtle/60 p-3 text-sm">{tp('coachNone')}</p>
          ) : (
            <ul className="space-y-2">
              {last.notes.map((n: CoachNote, i) => (
                <li key={i} className="rounded-2xl border border-border-strong/60 bg-gold-soft/60 p-3 text-sm leading-relaxed">
                  {note(n)}
                  <NoteLesson id={n.id} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

function Holdings({ state }: { state: PracticeState }) {
  const { tp } = usePracticeT()
  const v = state.valuation
  const coin = (b: string) => state.coins.find((c) => c.base === b)
  return (
    <div className="card space-y-3 p-5">
      <h3 className="font-semibold">{tp('positions')}</h3>
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-subtle text-xs font-semibold text-muted">
          USDT
        </span>
        <span className="flex-1 font-medium">{tp('cash')}</span>
        <span className="text-end">
          <span className="num block font-semibold" dir="ltr">
            {usdt(v.cash)}
          </span>
          <span className="num block text-xs text-muted" dir="ltr">
            {tnd(v.cash, state.tnd_rate)}
          </span>
        </span>
      </div>
      {v.positions.length === 0 && <p className="text-sm text-muted">{tp('noPositions')}</p>}
      {v.positions.map((p) => (
        <div key={p.base} className="flex items-center gap-3">
          <CoinIcon symbol={p.base} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold" dir="ltr">
                {p.base}
              </span>
              <KaratBadge karat={coin(p.base)?.karat} size="sm" />
            </div>
            <p className="num text-xs text-muted">
              <bdi dir="ltr">{qty(p.qty)}</bdi>
              {p.share != null && <> · {tp('ofWallet', { v: Math.round(p.share * 100) })}</>}
            </p>
          </div>
          <span className="text-end">
            <span className="num block font-semibold" dir="ltr">
              {usdt(p.value)}
            </span>
            <span className="num block text-xs text-muted" dir="ltr">
              {tnd(p.value, state.tnd_rate)}
            </span>
            <span className={`num block text-xs ${tone(p.pnl)}`} dir="ltr">
              {signed(p.pnl, 3)} ({signed(p.pnl_pct, 1, '%')})
            </span>
          </span>
        </div>
      ))}
    </div>
  )
}

function History({ trades, rate }: { trades: Trade[]; rate: number }) {
  const { tp, lang } = usePracticeT()
  if (trades.length === 0) return null
  const fmt = (ts: number) =>
    new Date(ts).toLocaleString(lang === 'ar' ? 'ar-TN' : lang, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  return (
    <div className="card space-y-2 p-5">
      <h3 className="font-semibold">{tp('history')}</h3>
      <ul className="divide-y divide-border">
        {trades
          .slice(-10)
          .reverse()
          .map((tr) => (
            <li key={tr.ts} className="flex items-center gap-3 py-2 text-sm">
              <span
                className={`w-14 shrink-0 rounded-full px-2 py-0.5 text-center text-[11px] font-semibold ${
                  tr.side === 'buy' ? 'bg-up/10 text-up' : 'bg-subtle text-muted'
                }`}
              >
                {tr.side === 'buy' ? tp('bought') : tp('sold')}
              </span>
              <span className="min-w-0 flex-1">
                <span className="num block" dir="ltr">
                  {qty(tr.qty)} {tr.base} @ {price(tr.price)}
                </span>
                <span className="block text-[11px] text-muted">{fmt(tr.ts)}</span>
              </span>
              <span className="text-end">
                <span className="num block" dir="ltr">
                  {usdt(tr.side === 'buy' ? tr.gross : tr.net)}
                </span>
                <span className="num block text-[11px] text-muted" dir="ltr">
                  {tnd(tr.side === 'buy' ? tr.gross : tr.net, rate)}
                </span>
              </span>
            </li>
          ))}
      </ul>
    </div>
  )
}

function ResetBar({ onReset }: { onReset: (start: number) => void }) {
  const { tp } = usePracticeT()
  const [asking, setAsking] = useState(false)
  if (!asking) {
    return (
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setAsking(true)}
          className="cursor-pointer rounded-full border border-border px-5 py-2 text-sm font-medium text-muted transition hover:border-border-strong hover:text-gold"
        >
          {tp('reset')}
        </button>
      </div>
    )
  }
  return (
    <div className="card flex flex-wrap items-center justify-center gap-3 p-4 text-sm">
      <span className="w-full text-center text-muted sm:w-auto">{tp('resetAsk')}</span>
      {START_CHOICES.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => {
            setAsking(false)
            onReset(n)
          }}
          className="num cursor-pointer rounded-full bg-text px-4 py-1.5 font-semibold text-bg transition hover:opacity-90"
        >
          <bdi dir="ltr">{n} USDT</bdi>
        </button>
      ))}
      <button
        type="button"
        onClick={() => setAsking(false)}
        className="cursor-pointer rounded-full border border-border px-4 py-1.5 font-medium text-muted transition hover:text-text"
      >
        {tp('cancel')}
      </button>
    </div>
  )
}
