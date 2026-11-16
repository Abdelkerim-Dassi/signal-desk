// The Time machine's maths in the browser, so a tap on "Next day" or "Buy"
// answers at once, with no request.
//
// This is a copy, line for line, of the practice wallet's rules in
// server/paper.py (quote_buy, quote_sell, apply_buy, apply_sell, value_wallet).
// The server plays a finished game again with the original and its result is
// the one shown at the end; tests/test_replay.py runs both on the same moves
// and fails if they ever differ. No imports here, so that test can load this
// file by itself.

export interface ReplayRules {
  startUsdt: number
  feeRate: number
  spread: number
  minTradeUsdt: number
}

/** Same numbers as START_USDT, FEE_RATE, SPREAD and MIN_TRADE_USDT on the server. */
export const REPLAY_RULES: ReplayRules = { startUsdt: 1000, feeRate: 0.001, spread: 0.0005, minTradeUsdt: 1 }

export interface ReplayCoin {
  /** the letter the coin plays under */
  key: string
  /** price on each day, from a base of 100 on day 0; the first `pre` entries are the run-up */
  index: number[]
}

export interface ReplayScenario {
  id: string
  /** days to play: day 0 is the start, day `days` is the end */
  days: number
  pre: number
  coins: ReplayCoin[]
}

export type Move =
  | { day: number; side: 'buy'; coin: string; usdt: number }
  | { day: number; side: 'sell'; coin: string; fraction: number }

export interface ReplayWallet {
  cash: number
  positions: Record<string, { qty: number; cost: number }>
}

export interface ReplayFill {
  side: 'buy' | 'sell'
  coin: string
  mid: number
  price: number
  qty: number
  gross: number
  fee: number
  spread_cost: number
  net: number
}

export type MoveError = 'min_trade' | 'insufficient_cash' | 'no_position' | 'bad_amount'

const EPS = 1e-9
const tidy = (x: number) => (Math.abs(x) < EPS ? 0 : x)

export function priceOn(sc: ReplayScenario, key: string, day: number): number {
  const coin = sc.coins.find((c) => c.key === key)
  return coin ? coin.index[sc.pre + day] : NaN
}

/** Percent move of a coin between two days of the scenario (days before 0 are the run-up). */
export function changeOn(sc: ReplayScenario, key: string, day: number, since: number): number {
  return (priceOn(sc, key, day) / priceOn(sc, key, since) - 1) * 100
}

export function freshWallet(rules: ReplayRules = REPLAY_RULES): ReplayWallet {
  return { cash: rules.startUsdt, positions: {} }
}

/** Apply one move at its day's price. Gives the fill and the wallet after it, or why it cannot be made. */
export function applyMove(
  sc: ReplayScenario,
  wallet: ReplayWallet,
  move: Move,
  rules: ReplayRules = REPLAY_RULES,
): { fill: ReplayFill; wallet: ReplayWallet } | { error: MoveError } {
  const mid = priceOn(sc, move.coin, move.day)
  const positions: ReplayWallet['positions'] = {}
  for (const [k, p] of Object.entries(wallet.positions)) positions[k] = { ...p }

  if (move.side === 'buy') {
    let usdt = move.usdt
    if (usdt < rules.minTradeUsdt - EPS) return { error: 'min_trade' }
    if (usdt > wallet.cash + EPS) return { error: 'insufficient_cash' }
    usdt = Math.min(usdt, wallet.cash)
    const price = mid * (1 + rules.spread)
    const fee = usdt * rules.feeRate
    const qty = (usdt - fee) / price
    const pos = positions[move.coin] ?? (positions[move.coin] = { qty: 0, cost: 0 })
    pos.qty += qty
    pos.cost += usdt
    return {
      fill: { side: 'buy', coin: move.coin, mid, price, qty, gross: usdt, fee, spread_cost: qty * (price - mid), net: usdt - fee },
      wallet: { cash: tidy(wallet.cash - usdt), positions },
    }
  }

  const pos = wallet.positions[move.coin]
  if (!pos || pos.qty <= 0) return { error: 'no_position' }
  if (!(move.fraction > 0 && move.fraction <= 1)) return { error: 'bad_amount' }
  const sellAll = move.fraction >= 1 - EPS
  const qty = sellAll ? pos.qty : pos.qty * move.fraction
  const price = mid * (1 - rules.spread)
  const gross = qty * price
  const fee = gross * rules.feeRate
  const net = gross - fee
  if (!sellAll && gross < rules.minTradeUsdt - EPS) return { error: 'min_trade' }
  if (sellAll) delete positions[move.coin]
  else positions[move.coin] = { qty: pos.qty - qty, cost: pos.cost * (1 - move.fraction) }
  return {
    fill: { side: 'sell', coin: move.coin, mid, price, qty, gross, fee, spread_cost: qty * (mid - price), net },
    wallet: { cash: tidy(wallet.cash + net), positions },
  }
}

/** The wallet at market prices on a day: cash plus every coin held. */
export function valueOn(sc: ReplayScenario, wallet: ReplayWallet, day: number): number {
  let coins = 0
  for (const [key, pos] of Object.entries(wallet.positions)) coins += pos.qty * priceOn(sc, key, day)
  return wallet.cash + coins
}

/** The wallet after a list of moves, and what fees and spread took. Moves that cannot be made are left out. */
export function playMoves(sc: ReplayScenario, moves: Move[], rules: ReplayRules = REPLAY_RULES): { wallet: ReplayWallet; costs: number } {
  let wallet = freshWallet(rules)
  let costs = 0
  for (const move of moves) {
    const done = applyMove(sc, wallet, move, rules)
    if ('error' in done) continue
    wallet = done.wallet
    costs += done.fill.fee + done.fill.spread_cost
  }
  return { wallet, costs }
}
