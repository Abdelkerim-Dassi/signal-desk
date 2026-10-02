// Watchlist asset helpers shared by the coin list and the portfolio.

export const POPULAR = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'DOGE', 'ADA', 'AVAX', 'LINK', 'TON', 'SUI', 'DOT']
const QUOTES = ['USDT', 'USDC', 'FDUSD', 'BTC', 'ETH', 'BNB', 'EUR', 'TRY']

export function parseAssets(raw: string): string[] {
  return raw
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean)
}

/** "sol" → "SOLUSDT" on Binance; CoinGecko takes ids as typed. */
export function toAsset(input: string, source: string, quote: string): string {
  const raw = input.trim()
  if (!raw) return ''
  if (source !== 'binance') return raw.toLowerCase()
  const up = raw.toUpperCase().replace(/[/\-_\s]/g, '')
  const hasQuote = QUOTES.some((q) => up.endsWith(q) && up.length > q.length)
  return hasQuote ? up : `${up}${quote}`
}

export function baseOf(asset: string): string {
  const up = asset.toUpperCase()
  const q = QUOTES.find((x) => up.endsWith(x) && up.length > x.length)
  return q ? up.slice(0, -q.length) : up
}
