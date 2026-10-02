// Types mirror the `brief` dict produced by advisor_engine.build_market_brief.

export interface Sentiment {
  score?: number
  status?: string
}

export interface GlobalStats {
  total_market_cap_usd?: number
  market_cap_change_24h?: number
  btc_dominance?: number
  eth_dominance?: number
}

export interface HoldingInfo {
  amount?: number
  value?: number
  unrealized_pnl?: number | null
  note?: string
}

export interface ScoreComponent {
  label: string
  delta: number
}

export interface ScoreCap {
  value: number
  reason: string
}

export interface ScoreBreakdown {
  base: number
  components: ScoreComponent[]
  raw?: number
  final: number
  cap?: ScoreCap | null
}

export interface Regime {
  state: 'risk_on' | 'risk_off' | 'unknown'
  label: string
  btc_price?: number
  btc_ma200?: number
  distance_pct?: number | null
}

export interface Opportunity {
  symbol?: string
  name?: string
  image?: string
  pair?: string
  source?: string
  market_cap_rank?: number
  rating?: string
  score?: number
  score_breakdown?: ScoreBreakdown
  risk_level?: string
  current_price?: number
  change_24h?: number
  change_7d?: number
  change_30d?: number
  sparkline?: number[]
  reasons?: string[]
  risks?: string[]
  holding?: HoldingInfo
}

export interface TrendingCoin {
  name?: string
  symbol?: string
  thumb?: string
  market_cap_rank?: number
}

export interface NewsItem {
  title?: string
  url?: string
  source?: string
  published_at?: string
  coins?: string[]
}

export interface Brief {
  generated_at?: string
  exchange_label?: string
  quote_asset?: string
  assets?: string[]
  sentiment?: Sentiment
  regime?: Regime
  global?: GlobalStats
  opportunities?: Opportunity[]
  portfolio?: Opportunity[]
  trending?: TrendingCoin[]
  news?: NewsItem[]
  errors?: string[]
}

export interface ReturnStats {
  n: number
  mean?: number
  median?: number
  hit_rate?: number
}

/** Rating bucket → stats per horizon, e.g. ratings.STRONG['30d']. */
export type RatingStats = Record<'ALL' | 'STRONG' | 'NEUTRAL' | 'WEAK', Record<string, ReturnStats>>

export interface LoggedCall {
  symbol: string
  rating: string
  score: number
  price: number
  return?: number
}

export interface LiveTrackRecord {
  started_on: string | null
  days_logged: number
  first_results_on: string | null
  universe: string[]
  horizons: Record<string, { ratings: Record<string, ReturnStats>; pending_calls: number }>
  today: { day: string; regime: string; rows: LoggedCall[] } | null
  latest_resolved: { day: string; horizon: number; rows: LoggedCall[] } | null
  error?: string
}

export interface Backtest {
  generated_at: string
  period: { start: string; end: string }
  coins: string[]
  coin_days: number
  ratings: RatingStats
  by_year: Record<string, { ALL: Record<string, ReturnStats>; STRONG: Record<string, ReturnStats> }>
  caveats: string[]
}

export interface TrackRecord {
  live: LiveTrackRecord
  backtest: Backtest | null
}

export interface HoldingInput {
  coin_id: string
  amount: number | ''
  average_buy_price: number | ''
}

export interface AnalyzeParams {
  market_source: string
  quote_asset: string
  assets: string[]
  holdings: { coin_id: string; amount: number; average_buy_price: number | null }[]
}

export interface AppStatus {
  notifications: { discord: boolean; whatsapp: boolean }
  ai_enabled: boolean
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

async function asJson<T>(res: Response): Promise<T> {
  const payload = await res.json()
  if (!res.ok || payload.ok === false) {
    throw new Error(payload.error || `Request failed (${res.status})`)
  }
  return payload as T
}

export async function analyze(params: AnalyzeParams): Promise<Brief> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  const payload = await asJson<{ brief: Brief }>(res)
  return payload.brief
}

export async function getTrackRecord(): Promise<TrackRecord> {
  const res = await fetch('/api/track-record')
  return asJson<TrackRecord>(res)
}

export async function getStatus(): Promise<AppStatus> {
  const res = await fetch('/api/status')
  return asJson<AppStatus>(res)
}

export async function generateBriefing(
  brief: Brief,
): Promise<{ text: string; cached: boolean }> {
  const res = await fetch('/api/ai/briefing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brief }),
  })
  return asJson<{ text: string; cached: boolean }>(res)
}

export async function sendAlert(
  brief: Brief,
  channels: string[],
): Promise<{ ok: boolean; results: { ok: boolean }[] }> {
  const res = await fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brief, channels }),
  })
  return res.json()
}

/**
 * Stream a chat answer over SSE. Calls onChunk per text delta; resolves when
 * the server signals done. Mid-stream errors arrive as {error} events.
 */
export async function streamChat(
  question: string,
  brief: Brief | null,
  history: ChatMessage[],
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, brief, history }),
    signal,
  })
  if (!res.ok) {
    const payload = await res.json().catch(() => null)
    throw new Error(payload?.error || `Chat failed (${res.status})`)
  }
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    // SSE frames are separated by a blank line
    const frames = buffer.split('\n\n')
    buffer = frames.pop() ?? ''
    for (const frame of frames) {
      const line = frame.trim()
      if (!line.startsWith('data:')) continue
      const event = JSON.parse(line.slice(5).trim())
      if (event.error) throw new Error(event.error)
      if (event.text) onChunk(event.text)
      if (event.done) return
    }
  }
}
