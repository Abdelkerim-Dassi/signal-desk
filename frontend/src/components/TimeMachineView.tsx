import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
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

const filled =
  'cursor-pointer rounded-full bg-text px-4 py-2.5 text-sm font-semibold text-balance text-bg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40'
const outlined =
  'cursor-pointer rounded-full border border-border-strong px-4 py-2.5 text-sm font-medium text-balance text-gold transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-40'

// percentages here show one decimal: a move too small to show is not coloured as a gain or a loss
const tone = (n: number | null | undefined) => (n == null || Math.abs(n) < 0.05 ? 'text-muted' : n > 0 ? 'text-up' : 'text-down')

// One colour and one line style per letter: never green or red, which mean up and down here.
const COLOR: Record<string, string> = { A: 'var(--color-gold-bright)', B: '#2f7fb8', C: '#8b5fbf', D: 'var(--color-neutral)' }
const DASH: Record<string, string | undefined> = { C: '7 4', D: '2 4' }

function SimBadge() {
  const { tr } = useReplayT()
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-warn/30 bg-warn/10 px-2.5 py-0.5 text-[11px] font-semibold text-warn">
      <span aria-hidden className="size-1.5 rounded-full bg-warn" />
      {tr('sim')}
    </span>
  )
}

/** The card on the Practice screen that leads to the Time machine. */
export function TimeMachineCard() {
  const { tr } = useReplayT()
  return (
    <div className="card space-y-2.5 p-4">
      <h3 className="font-semibold">{tr('cardTitle')}</h3>
      <p className="text-sm leading-relaxed text-muted">{tr('cardLine')}</p>
      <a href="#replay" className={`${outlined} block w-full text-center`}>
        {tr('cardButton')}
      </a>
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
    return <End sc={sc} game={game} onBegin={begin} onLeave={() => setOpen(false)} onView={onView} />
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
    <section className="space-y-4">
      <div className="space-y-2 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">{tr('title')}</h2>
          <SimBadge />
        </div>
        <p className="text-sm leading-relaxed text-muted">{tr('intro')}</p>
      </div>

      {REPLAYS.map((s, i) => {
        const mine = played(s.id)
        const inProgress = game?.id === s.id && game.day < s.days && (game.day > 0 || game.moves.length > 0)
        return (
          <div key={s.id} className={`card space-y-3 p-4 ${s.id === lead ? 'border-border-strong' : ''}`}>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold">{tr('trip', { n: i + 1 })}</h3>
              <span className="text-xs text-muted">{tr('tripSub')}</span>
            </div>
            {mine.last && (
              <p className="text-sm text-muted">
                {tr('lastResult', { you: dollars(mine.last.value, 0), hold: dollars(mine.last.hold, 0) })}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {inProgress ? (
                <>
                  <button type="button" onClick={() => onBegin(s.id, false)} className={`${filled} grow`}>
                    {tr('resume', { d: game.day, n: s.days })}
                  </button>
                  <button type="button" onClick={() => onBegin(s.id, true)} className={outlined}>
                    {tr('again')}
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => onBegin(s.id, true)} className={`${s.id === lead ? filled : outlined} grow`}>
                  {mine.finished ? tr('again') : tr('start')}
                </button>
              )}
            </div>
          </div>
        )
      })}

      <div className="card space-y-2 p-4 text-sm">
        <h3 className="font-semibold">{tr('howTitle')}</h3>
        <ul className="list-disc space-y-1.5 ps-5 leading-relaxed text-muted">
          <li>{tr('how1')}</li>
          <li>{tr('how2')}</li>
          <li>{tr('how3')}</li>
        </ul>
      </div>
      <p className="px-1 text-xs leading-relaxed text-muted">{tr('notAdvice')}</p>
      <button type="button" onClick={() => onView('practice')} className="cursor-pointer px-1 text-sm font-medium text-gold underline-offset-2 hover:underline">
        ← {tr('back')}
      </button>
    </section>
  )
}

// ── playing ─────────────────────────────────────────────────────────────────

function Play({ sc, game, onChange, onLeave }: { sc: ReplayScenario; game: Game; onChange: (g: Game) => void; onLeave: () => void }) {
  const { tr } = useReplayT()
  const { error } = usePracticeT()
  const { wallet } = useMemo(() => playMoves(sc, game.moves), [sc, game.moves])
  const [picked, setPicked] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<ReplayFill | null>(null)
  const [refused, setRefused] = useState<MoveError | null>(null)

  const day = game.day
  const value = valueOn(sc, wallet, day)
  const pct = (value / REPLAY_RULES.startUsdt - 1) * 100
  const trip = REPLAYS.findIndex((s) => s.id === sc.id) + 1
  const left = sc.days - day

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

  return (
    <section className="space-y-3">
      <div className="space-y-2 px-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">
            {tr('trip', { n: trip })} · <span className="num">{tr('day', { d: day, n: sc.days })}</span>
          </p>
          <button type="button" onClick={onLeave} className="cursor-pointer text-sm text-muted underline-offset-2 hover:underline">
            {tr('leave')}
          </button>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-subtle" dir="ltr" aria-hidden>
          <div className="h-full rounded-full bg-gold-bright transition-[width]" style={{ width: `${(day / sc.days) * 100}%` }} />
        </div>
      </div>

      <div className="card hero-wash flex items-end justify-between gap-3 px-4 py-3">
        <div>
          <p className="text-xs text-muted">{tr('wallet')}</p>
          <p className="num text-2xl font-semibold" dir="ltr">
            {dollars(value)}
          </p>
          <p className="text-xs text-muted">
            <span className={`num ${tone(pct)}`} dir="ltr">
              {signed(pct, 1, '%')}
            </span>{' '}
            {tr('sinceStart')}
          </p>
        </div>
        <div className="text-end">
          <p className="text-xs text-muted">{tr('cash')}</p>
          <p className="num text-base font-semibold" dir="ltr">
            {dollars(wallet.cash)}
          </p>
        </div>
      </div>

      <div className="card space-y-2 p-3">
        <IndexChart sc={sc} day={day} picked={picked} />
        <p className="text-[11px] text-muted">{tr('chartNote')}</p>
      </div>

      <div className="card divide-y divide-border overflow-hidden">
        {sc.coins.map((c) => (
          <CoinRow
            key={c.key}
            sc={sc}
            coinKey={c.key}
            day={day}
            wallet={wallet}
            open={picked === c.key}
            onPick={() => {
              setPicked(picked === c.key ? null : c.key)
              setRefused(null)
            }}
            onTrade={trade}
          />
        ))}
      </div>

      <div aria-live="polite" className="min-h-5 px-1 text-xs leading-relaxed">
        {refused && <p className="text-down">{error(refused)}</p>}
        {receipt && (
          <p className="text-muted">
            ✓{' '}
            {tr(receipt.side === 'buy' ? 'bought' : 'sold', {
              qty: qty(receipt.qty),
              k: receipt.coin,
              price: receipt.price.toFixed(2),
              cost: dollars(receipt.fee + receipt.spread_cost),
            })}
          </p>
        )}
        {!refused && !receipt && !picked && <p className="text-muted">{tr('pickCoin')}</p>}
      </div>

      {/* stays in reach above the phone's tab bar: the month is thirty taps long */}
      <div className="sticky bottom-[4.75rem] z-30 flex gap-2 rounded-full border border-border bg-card/95 p-1.5 shadow-lg backdrop-blur md:bottom-4">
        {left > 5 && (
          <button type="button" onClick={() => advance(5)} className={`${outlined} num shrink-0`}>
            {tr('skip')}
          </button>
        )}
        <button type="button" onClick={() => advance(1)} className={`${filled} grow`}>
          {left === 1 ? tr('seeResult') : `${tr('next')} ›`}
        </button>
      </div>
    </section>
  )
}

function CoinRow({
  sc,
  coinKey,
  day,
  wallet,
  open,
  onPick,
  onTrade,
}: {
  sc: ReplayScenario
  coinKey: string
  day: number
  wallet: ReplayWallet
  open: boolean
  onPick: () => void
  onTrade: (m: Move) => void
}) {
  const { tr } = useReplayT()
  const price = priceOn(sc, coinKey, day)
  const today = changeOn(sc, coinKey, day, day - 1)
  const held = wallet.positions[coinKey]
  const heldValue = held ? held.qty * price : 0
  const canBuy = wallet.cash >= REPLAY_RULES.minTradeUsdt
  return (
    <div className={open ? 'bg-subtle/50' : ''}>
      <button type="button" onClick={onPick} aria-expanded={open} className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-start">
        <svg width="22" height="8" viewBox="0 0 22 8" aria-hidden className="shrink-0">
          <line x1="1" x2="21" y1="4" y2="4" stroke={COLOR[coinKey]} strokeWidth="3" strokeLinecap="round" strokeDasharray={DASH[coinKey]} />
        </svg>
        <span className="min-w-0 grow">
          <span className="block font-semibold">{tr('coin', { k: coinKey })}</span>
          {held && <span className="num block text-xs text-muted">{tr('youHold', { v: dollars(heldValue) })}</span>}
        </span>
        <span className="text-end">
          <span className="num block font-semibold" dir="ltr">
            {price.toFixed(2)}
          </span>
          <span className="block text-xs text-muted">
            <span className={`num ${tone(today)}`} dir="ltr">
              {signed(today, 1, '%')}
            </span>{' '}
            {tr('today')}
          </span>
        </span>
      </button>
      {open && (
        <div className="space-y-3 px-4 pb-4">
          <div className="space-y-1.5">
            <p className="text-xs text-muted">{canBuy ? tr('buyWith') : tr('noCash')}</p>
            <div className="grid grid-cols-3 gap-2">
              {[0.25, 0.5, 1].map((f) => (
                <TradeButton
                  key={f}
                  disabled={!canBuy}
                  onClick={() => onTrade({ day, side: 'buy', coin: coinKey, usdt: f === 1 ? wallet.cash : wallet.cash * f })}
                >
                  <span className="num block text-sm font-semibold" dir="ltr">
                    {f * 100}%
                  </span>
                  <span className="num block text-[11px] text-muted" dir="ltr">
                    {dollars(wallet.cash * f, 0)}
                  </span>
                </TradeButton>
              ))}
            </div>
          </div>
          {held && (
            <div className="space-y-1.5">
              <p className="text-xs text-muted">{tr('sellPart')}</p>
              <div className="grid grid-cols-2 gap-2">
                {([0.5, 1] as const).map((f) => (
                  <TradeButton key={f} onClick={() => onTrade({ day, side: 'sell', coin: coinKey, fraction: f })}>
                    <span className="block text-sm font-semibold">{f === 1 ? tr('all') : tr('half')}</span>
                    <span className="num block text-[11px] text-muted" dir="ltr">
                      {dollars(heldValue * f, 0)}
                    </span>
                  </TradeButton>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TradeButton({ disabled, onClick, children }: { disabled?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="cursor-pointer rounded-2xl border border-border-strong bg-card px-2 py-2 text-center transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  )
}

/** Every coin's price from 7 days before the start up to today; the rest of the month is a blank. */
function IndexChart({ sc, day, picked }: { sc: ReplayScenario; day: number; picked: string | null }) {
  const W = 300
  const H = 130
  const pad = 6
  const total = sc.pre + sc.days
  const seen = sc.coins.flatMap((c) => c.index.slice(0, sc.pre + day + 1))
  let lo = Math.min(...seen, 100)
  let hi = Math.max(...seen, 100)
  const room = Math.max((hi - lo) * 0.08, 2)
  lo -= room
  hi += room
  const x = (i: number) => pad + (i / total) * (W - 2 * pad)
  const y = (v: number) => H - pad - ((v - lo) / (hi - lo)) * (H - 2 * pad)
  const now = x(sc.pre + day)

  // a letter at the end of each line, pushed apart where two lines end together
  const ends = sc.coins.map((c) => ({ key: c.key, at: (y(c.index[sc.pre + day]) / H) * 100 })).sort((a, b) => a.at - b.at)
  for (let i = 1; i < ends.length; i++) ends[i].at = Math.max(ends[i].at, ends[i - 1].at + 11)
  const over = Math.max(0, ends[ends.length - 1].at - 96)
  for (const e of ends) e.at -= over

  return (
    <div className="relative h-28 w-full" dir="ltr" aria-hidden>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <rect x={now} y={0} width={Math.max(0, W - now)} height={H} fill="var(--color-subtle)" opacity={0.7} />
        <line x1={pad} x2={W - pad} y1={y(100)} y2={y(100)} stroke="var(--color-muted)" strokeOpacity={0.35} strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
        <line x1={x(sc.pre)} x2={x(sc.pre)} y1={0} y2={H} stroke="var(--color-muted)" strokeOpacity={0.25} vectorEffect="non-scaling-stroke" />
        {sc.coins.map((c) => (
          <polyline
            key={c.key}
            points={c.index
              .slice(0, sc.pre + day + 1)
              .map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`)
              .join(' ')}
            fill="none"
            stroke={COLOR[c.key]}
            strokeWidth={picked === c.key ? 3.2 : 2}
            strokeOpacity={picked && picked !== c.key ? 0.35 : 1}
            strokeDasharray={DASH[c.key]}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {ends.map((e) => (
        <span
          key={e.key}
          className="absolute -translate-y-1/2 rounded px-1 text-[11px] leading-4 font-bold"
          style={{ left: `calc(${(now / W) * 100}% + 3px)`, top: `${e.at}%`, color: COLOR[e.key], opacity: picked && picked !== e.key ? 0.4 : 1 }}
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

function End({
  sc,
  game,
  onBegin,
  onLeave,
  onView,
}: {
  sc: ReplayScenario
  game: Game
  onBegin: (id: string, fresh: boolean) => void
  onLeave: () => void
  onView: (v: View) => void
}) {
  const { tr, lang } = useReplayT()
  const [copied, setCopied] = useState(false)
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

  return (
    <section className="space-y-4">
      <div className="card hero-wash rise space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">{tr('endTitle')}</h2>
          <SimBadge />
        </div>
        <div>
          <p className="text-xs text-muted">{tr('youEnded')}</p>
          <p className="num text-3xl font-semibold" dir="ltr">
            {dollars(value)}
          </p>
          <p className={`num text-sm ${tone(pct)}`} dir="ltr">
            {signed(pct, 1, '%')}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-subtle/60 p-3">
            <p className="text-xs text-muted">{tr('holdBtc')}</p>
            {result ? (
              <>
                <p className="num text-lg font-semibold" dir="ltr">
                  {dollars(result.hold_value)}
                </p>
                <p className={`num text-xs ${tone(result.hold_pct)}`} dir="ltr">
                  {signed(result.hold_pct, 1, '%')}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted">{scored.isError ? '--' : tr('counting')}</p>
            )}
          </div>
          <div className="rounded-2xl bg-subtle/60 p-3">
            <p className="text-xs text-muted">{tr('stayCash')}</p>
            <p className="num text-lg font-semibold" dir="ltr">
              {dollars(REPLAY_RULES.startUsdt)}
            </p>
            <p className="num text-xs text-muted" dir="ltr">
              {signed(0, 1, '%')}
            </p>
          </div>
        </div>
        {result && <ResultChart result={result} />}
        {diff != null && Math.abs(diff) >= 0.5 && (
          <p className="text-sm leading-relaxed">{tr(diff < 0 ? 'below' : 'above', { v: dollars(Math.abs(diff), 0) })}</p>
        )}
        <p className="text-xs leading-relaxed text-muted">{tr('oneMonth')}</p>
        {scored.isError && (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted">{tr('revealFailed')}</span>
            <button type="button" onClick={() => void scored.refetch()} className={outlined}>
              {tr('retry')}
            </button>
          </div>
        )}
      </div>

      {reveal && (
        <div className="card rise space-y-3 p-5">
          <h3 className="font-semibold">{tr('revealTitle')}</h3>
          <p className="text-sm font-medium text-gold">{tr('revealDates', { from: date(reveal.from), to: date(reveal.to) })}</p>
          {`event.${reveal.event}` in R && <p className="text-sm leading-relaxed">{tr(`event.${reveal.event}` as ReplayKey)}</p>}
          <p className="text-xs text-muted">{tr('revealMoves')}</p>
          <ul className="space-y-1.5 text-sm">
            {reveal.coins.map((c) => {
              const [before, after] = tr('coinWas', { k: c.key, name: c.name }).split('{pct}')
              return (
                <li key={c.key} className="flex items-baseline gap-2">
                  <svg width="18" height="8" viewBox="0 0 18 8" aria-hidden className="shrink-0">
                    <line x1="1" x2="17" y1="4" y2="4" stroke={COLOR[c.key]} strokeWidth="3" strokeLinecap="round" strokeDasharray={DASH[c.key]} />
                  </svg>
                  <span>
                    {before}
                    <span className={`num font-semibold ${tone(c.pct)}`} dir="ltr">
                      {signed(c.pct, 1, '%')}
                    </span>
                    {after}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {result && (
        <div className="card space-y-3 p-5">
          <h3 className="font-semibold">{tr('didTitle')}</h3>
          <p className="text-sm leading-relaxed">
            {result.trades === 0
              ? tr('noTrades')
              : tr(result.trades === 1 ? 'oneTrade' : 'tradesLine', { n: result.trades, cost: dollars(result.costs) })}
          </p>
          {result.notes.length > 0 ? (
            <ul className="space-y-2">
              {result.notes.map((n) => (
                <li key={n.id} className="rounded-2xl border border-border-strong/60 bg-gold-soft/60 p-3 text-sm leading-relaxed">
                  {tr(`note.${n.id}`, { day: n.day, name: n.name ?? '', pct: Math.abs(n.pct ?? 0), count: n.count ?? 0 })}
                  {READY_LESSONS.some((l) => l.slug === NOTE_LESSON[n.id]) && (
                    <a href={`#learn-${NOTE_LESSON[n.id]}`} className="mt-1 block text-xs font-medium text-gold underline-offset-2 hover:underline">
                      {tr('lesson')} →
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            result.trades > 0 && <p className="text-sm text-muted">{tr('noNotes')}</p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={!result} onClick={() => void share()} className={`${filled} grow`}>
          {copied ? tr('copied') : tr('share')}
        </button>
        <button type="button" onClick={() => onBegin(sc.id, true)} className={outlined}>
          {tr('again')}
        </button>
        {other && (
          <button type="button" onClick={() => onBegin(other.id, true)} className={`${outlined} grow`}>
            {tr('otherTrip')}
          </button>
        )}
      </div>
      <p className="px-1 text-xs leading-relaxed text-muted">{tr('notAdvice')}</p>
      <div className="flex flex-wrap gap-x-5 gap-y-2 px-1 text-sm font-medium text-gold">
        <button type="button" onClick={onLeave} className="cursor-pointer underline-offset-2 hover:underline">
          ← {tr('title')}
        </button>
        <button type="button" onClick={() => onView('practice')} className="cursor-pointer underline-offset-2 hover:underline">
          {tr('back')}
        </button>
      </div>
    </section>
  )
}

/** The wallet day by day next to the same start held in Bitcoin, with the start as a baseline. */
function ResultChart({ result }: { result: Finished['result'] }) {
  const { tr } = useReplayT()
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
  return (
    <div className="space-y-1.5">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-24 w-full" aria-hidden>
        <line x1={pad} x2={W - pad} y1={y(result.start)} y2={y(result.start)} stroke="var(--color-muted)" strokeOpacity={0.35} strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
        <polyline points={line('hold')} fill="none" stroke="var(--color-neutral)" strokeWidth={1.5} strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
        <polyline points={line('value')} fill="none" stroke="var(--color-gold-bright)" strokeWidth={2.2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-gold-bright" /> {tr('chartYou')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0 w-4 border-t-2 border-dashed border-neutral" /> {tr('chartHold')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0 w-4 border-t border-dotted border-muted" /> {tr('chartStart')}
        </span>
      </div>
    </div>
  )
}
