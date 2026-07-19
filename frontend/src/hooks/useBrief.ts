import { useQuery } from '@tanstack/react-query'
import { analyze, getStatus } from '../lib/api'
import type { AnalyzeParams, HoldingInput } from '../lib/api'

export interface AdvisorConfig {
  marketSource: string
  quoteAsset: string
  assetsRaw: string
  holdings: HoldingInput[]
  live: boolean
  intervalMs: number
}

export const DEFAULT_CONFIG: AdvisorConfig = {
  marketSource: 'binance',
  quoteAsset: 'USDT',
  assetsRaw: 'BTCUSDT, ETHUSDT',
  holdings: [
    { coin_id: 'BTCUSDT', amount: '', average_buy_price: '' },
    { coin_id: 'ETHUSDT', amount: '', average_buy_price: '' },
  ],
  live: true,
  intervalMs: 120_000,
}

export function toAnalyzeParams(config: AdvisorConfig): AnalyzeParams {
  return {
    market_source: config.marketSource,
    quote_asset: config.quoteAsset,
    assets: config.assetsRaw
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean),
    holdings: config.holdings
      .filter((h) => h.coin_id.trim() && Number(h.amount) > 0)
      .map((h) => ({
        coin_id: h.coin_id.trim().toLowerCase(),
        amount: Number(h.amount),
        average_buy_price: h.average_buy_price === '' ? null : Number(h.average_buy_price),
      })),
  }
}

/** Polls the free heuristic endpoint only — the AI endpoints are never polled. */
export function useBrief(config: AdvisorConfig) {
  const params = toAnalyzeParams(config)
  return useQuery({
    queryKey: ['brief', params],
    queryFn: () => analyze(params),
    refetchInterval: config.live ? config.intervalMs : false,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
    retry: 1,
  })
}

export function useAppStatus() {
  return useQuery({
    queryKey: ['status'],
    queryFn: getStatus,
    staleTime: Infinity,
    retry: 1,
  })
}
