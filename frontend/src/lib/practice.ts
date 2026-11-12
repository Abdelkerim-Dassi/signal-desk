// Practice with pretend dollars (100, 500 or 1000): a paper-money wallet. Simulation only, never real money.
// The ledger lives in this browser (accounts come later); every price, fee and
// coach note comes from the server (server/paper.py), so the maths is tested
// in one place. Storage can be blocked, so every access is guarded and the
// screen still works for the visit without it.

export interface Position {
  qty: number
  cost: number
}

export interface Wallet {
  cash: number
  positions: Record<string, Position>
}

export type CoachNote =
  | { id: 'fomo'; base: string; pct: number }
  | { id: 'panic'; base: string; pct: number }
  | { id: 'concentration'; base: string; pct: number }
  | { id: 'storm'; base: string }
  | { id: 'overtrading'; count: number }

export interface Fill {
  side: 'buy' | 'sell'
  base: string
  mid: number
  price: number
  qty: number
  gross: number
  fee: number
  spread_cost: number
  net: number
}

export interface Trade extends Fill {
  ts: number
  notes: CoachNote[]
}

export interface CurvePoint {
  ts: number
  value: number
  hold: number | null
}

export interface Ledger {
  v: 1
  startedAt: number
  startUsdt: number
  wallet: Wallet
  /** BTC the starting balance bought on day one: the "if you had just held BTC" line */
  btcHoldQty: number | null
  trades: Trade[]
  curve: CurvePoint[]
}

export interface PracticeCoin {
  base: string
  name: string
  price: number
  change_24h: number
  change_7d: number | null
  karat: 24 | 22 | 18 | 14 | 10 | null
  risk: 'low' | 'medium' | 'high' | null
}

export interface PositionValue {
  base: string
  qty: number
  cost: number
  price: number | null
  value: number | null
  pnl: number | null
  pnl_pct: number | null
  share: number | null
}

export interface Valuation {
  cash: number
  positions: PositionValue[]
  value: number
  pnl: number
  pnl_pct: number | null
  btc_hold_value: number | null
  btc_hold_pnl_pct: number | null
}

export interface PracticeState {
  coins: PracticeCoin[]
  weather: 'calm' | 'choppy' | 'stormy' | 'unknown'
  tnd_rate: number
  tnd_live: boolean
  rules: { start_usdt: number; fee_rate: number; spread: number; min_trade_usdt: number }
  wallet: Wallet
  valuation: Valuation
  benchmark_btc_qty: number | null
}

export interface QuoteResult {
  fill: Fill
  wallet_after: Wallet
  notes: CoachNote[]
  ts: number
}

export type TradeErrorCode =
  | 'min_trade'
  | 'insufficient_cash'
  | 'no_position'
  | 'bad_amount'
  | 'unknown_coin'
  | 'price_unavailable'

export class PracticeError extends Error {
  code: TradeErrorCode
  constructor(code: TradeErrorCode, message: string) {
    super(message)
    this.code = code
  }
}

const KEY = 'qirat.practice.v1'
/** Starting amounts a visitor can choose; a first visit starts with the largest. */
export const START_CHOICES = [100, 500, 1000] as const
export const DEFAULT_START = 1000
const LEGACY_START = 10 // the wallet started at 10 USDT until 2026-11-12
const MAX_TRADES = 200
const MAX_CURVE = 400
const CURVE_EVERY_MS = 30 * 60 * 1000

export function freshLedger(startUsdt: number = DEFAULT_START): Ledger {
  return {
    v: 1,
    startedAt: Date.now(),
    startUsdt,
    wallet: { cash: startUsdt, positions: {} },
    btcHoldQty: null,
    trades: [],
    curve: [],
  }
}

export function loadLedger(): Ledger {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return freshLedger()
    const saved = JSON.parse(raw) as Partial<Ledger>
    if (saved.v !== 1 || !saved.wallet || typeof saved.wallet.cash !== 'number') return freshLedger()
    // an old 10 USDT wallet that was never traded moves to the new starting amount
    const untouched = !Array.isArray(saved.trades) || saved.trades.length === 0
    if ((saved.startUsdt ?? LEGACY_START) === LEGACY_START && untouched) return freshLedger()
    return {
      ...freshLedger(),
      ...saved,
      trades: Array.isArray(saved.trades) ? saved.trades : [],
      curve: Array.isArray(saved.curve) ? saved.curve : [],
    } as Ledger
  } catch {
    return freshLedger()
  }
}

export function saveLedger(ledger: Ledger): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(ledger))
  } catch {
    // not persisted; fine for this visit
  }
}

/** Add a point to the wallet-vs-BTC line, at most every half hour unless forced (after a trade). */
export function withCurvePoint(ledger: Ledger, point: CurvePoint, force = false): Ledger {
  const last = ledger.curve[ledger.curve.length - 1]
  if (!force && last && point.ts - last.ts < CURVE_EVERY_MS) return ledger
  return { ...ledger, curve: [...ledger.curve, point].slice(-MAX_CURVE) }
}

export function withTrade(ledger: Ledger, result: QuoteResult): Ledger {
  const trade: Trade = { ...result.fill, ts: result.ts, notes: result.notes }
  return { ...ledger, wallet: result.wallet_after, trades: [...ledger.trades, trade].slice(-MAX_TRADES) }
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const payload = await res.json().catch(() => ({ ok: false, code: 'price_unavailable', error: `HTTP ${res.status}` }))
  if (!res.ok || payload.ok === false) {
    throw new PracticeError(payload.code || 'price_unavailable', payload.error || `Request failed (${res.status})`)
  }
  return payload as T
}

export function getPracticeState(ledger: Ledger): Promise<PracticeState> {
  return post('/api/paper/state', {
    wallet: ledger.wallet,
    start_usdt: ledger.startUsdt,
    btc_hold_qty: ledger.btcHoldQty,
  })
}

export function quoteTrade(
  ledger: Ledger,
  order: { side: 'buy'; base: string; usdt: number } | { side: 'sell'; base: string; fraction: number },
): Promise<QuoteResult> {
  return post('/api/paper/quote', {
    ...order,
    wallet: ledger.wallet,
    recent_ts: ledger.trades.slice(-20).map((t) => t.ts),
  })
}

// ── formatting ──────────────────────────────────────────────────────────────

export function usdt(n: number | null | undefined, digits = 2): string {
  if (n == null || !Number.isFinite(n)) return '--'
  return `${n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })} USDT`
}

export function tnd(n: number | null | undefined, rate: number): string {
  if (n == null || !Number.isFinite(n)) return '--'
  return `≈ ${(n * rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TND`
}

export function qty(n: number): string {
  return n.toLocaleString('en-US', { maximumSignificantDigits: 6 })
}

export function price(n: number): string {
  const digits = n >= 1000 ? 2 : n >= 1 ? 3 : 5
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: digits })}`
}

export function signed(n: number | null | undefined, digits = 2, suffix = ''): string {
  if (n == null || !Number.isFinite(n)) return '--'
  const s = Math.abs(n) < 0.5 * 10 ** -digits ? 0 : n
  return `${s > 0 ? '+' : s < 0 ? '−' : ''}${Math.abs(s).toFixed(digits)}${suffix}`
}
