import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { AdvisorConfig } from '../hooks/useBrief'
import { getCoins, symbolExists } from '../lib/api'
import type { Brief, CoinOption, Opportunity } from '../lib/api'
import { changeColor, compactCurrency, percent } from '../lib/format'
import { baseOf, parseAssets, POPULAR, toAsset } from '../lib/assets'
import { useI18n } from '../lib/i18n'
import { IconChevron, IconPlus, IconX } from './Icons'
import { CoinIcon, RatingPill, ScoreRing } from './Rating'
import CandleChart from './CandleChart'
import Sparkline from './Sparkline'

function ScoreDetails({ item }: { item: Opportunity }) {
  const { t, te } = useI18n()
  const sb = item.score_breakdown
  const up = Number(item.change_7d ?? 0) >= 0
  return (
    <div className="mt-4 space-y-4 border-t border-border pt-4">
      {(item.candles?.length ?? 0) >= 2 ? (
        <div>
          <p className="mb-1 text-xs text-muted">{t('chart.title')}</p>
          <CandleChart candles={item.candles} />
        </div>
      ) : (
        // CoinGecko source has no daily candles: keep the 7-day line
        <div>
          <p className="mb-1 text-xs text-muted">{t('coin.7d')}</p>
          <Sparkline points={item.sparkline} up={up} />
        </div>
      )}

      {sb && sb.components?.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold">{t('coin.why')}</p>
          <div className="space-y-1.5 rounded-2xl bg-subtle/70 p-3 text-sm">
            <div className="flex justify-between gap-3 text-muted">
              <span>{t('coin.base')}</span>
              <span className="num">{sb.base}</span>
            </div>
            {sb.components.map((c, i) => (
              <div key={`${c.label}-${i}`} className="flex justify-between gap-3">
                <span>{te(c.label)}</span>
                <span className={`num font-semibold ${c.delta >= 0 ? 'text-up' : 'text-down'}`} dir="ltr">
                  {c.delta > 0 ? '+' : ''}
                  {c.delta}
                </span>
              </div>
            ))}
            {sb.cap && (
              <div className="flex justify-between gap-3 border-t border-dashed border-weak/30 pt-1.5 text-weak">
                <span>
                  {t('coin.cap')}
                  <span className="block text-xs text-muted">
                    {te(sb.cap.reason)} · {t('coin.beforeCap', { n: sb.raw ?? '--' })}
                  </span>
                </span>
                <span className="num font-semibold" dir="ltr">
                  ≤{sb.cap.value}
                </span>
              </div>
            )}
            <div className="flex justify-between gap-3 border-t border-border pt-1.5 font-semibold">
              <span>{t('coin.score')}</span>
              <span className="num text-gold">{sb.final}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {(item.reasons?.length ?? 0) > 0 && (
          <div>
            <p className="mb-1.5 text-sm font-semibold">{t('coin.helps')}</p>
            <ul className="space-y-1 text-sm text-muted">
              {item.reasons!.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-strong">+</span>
                  {te(r)}
                </li>
              ))}
            </ul>
          </div>
        )}
        {(item.risks?.length ?? 0) > 0 && (
          <div>
            <p className="mb-1.5 text-sm font-semibold">{t('coin.watch')}</p>
            <ul className="space-y-1 text-sm text-muted">
              {item.risks!.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-warn">!</span>
                  {te(r)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="text-xs text-muted">
        {t('coin.risk')}: <span className="font-medium text-text">{te(item.risk_level)}</span> · {t('coin.notAdvice')}
      </p>
    </div>
  )
}

function CoinCard({ item, delay }: { item: Opportunity; delay: number }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const symbol = (item.symbol || '').toUpperCase()
  return (
    <article className="card rise p-4" style={{ animationDelay: `${delay}ms` }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t('coin.details')}
        className="flex w-full cursor-pointer items-center gap-3 text-start"
      >
        <CoinIcon symbol={symbol} image={item.image} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="truncate font-semibold">{item.name || symbol}</p>
            <RatingPill rating={item.rating} size="sm" />
            {item.score_breakdown?.cap && (
              <span className="text-[11px] font-medium text-weak">{t('coin.capped')}</span>
            )}
          </div>
          <p className="num mt-0.5 text-sm text-muted" dir="ltr">
            <span className="text-text">{compactCurrency(item.current_price)}</span>{' '}
            <span className={changeColor(item.change_24h)}>{percent(item.change_24h)}</span>
          </p>
        </div>
        <ScoreRing score={item.score} rating={item.rating} />
        <IconChevron className={`shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <ScoreDetails item={item} />}
    </article>
  )
}

/** Up to 8 coins for a query: exact ticker, then tickers starting with it, then name matches. */
function searchCoins(coins: CoinOption[] | undefined, raw: string): CoinOption[] {
  const q = raw.trim().toLowerCase().replace(/usdt$/, '')
  if (!coins || !q) return []
  const rank = (c: CoinOption) => {
    const base = c.base.toLowerCase()
    if (base === q) return 0
    if (base.startsWith(q)) return 1
    if (c.name.toLowerCase().startsWith(q)) return 2
    if (c.name.toLowerCase().includes(q)) return 3
    return -1
  }
  return coins
    .map((c) => ({ c, r: rank(c) }))
    .filter((x) => x.r >= 0)
    .sort((a, b) => a.r - b.r || a.c.rank - b.c.rank)
    .slice(0, 8)
    .map((x) => x.c)
}

function WatchlistEditor({
  config,
  onConfigChange,
}: {
  config: AdvisorConfig
  onConfigChange: (c: AdvisorConfig) => void
}) {
  const { t } = useI18n()
  const [input, setInput] = useState('')
  const [checking, setChecking] = useState(false)
  const [unknown, setUnknown] = useState<string | null>(null)
  const assets = parseAssets(config.assetsRaw)
  const setAssets = (next: string[]) => onConfigChange({ ...config, assetsRaw: next.join(', ') })
  const binance = config.marketSource === 'binance'
  // the real list of tradable coins: the picker only offers these
  const coinsQuery = useQuery({
    queryKey: ['coins', config.quoteAsset],
    queryFn: () => getCoins(config.quoteAsset),
    enabled: binance,
    staleTime: 6 * 3600_000,
    retry: 1,
  })
  const coins = coinsQuery.data
  const present = new Set(assets.map(baseOf))
  const listed = coins ? new Set(coins.map((c) => c.base)) : null
  const matches = useMemo(() => searchCoins(coins, input), [coins, input])

  const addPair = (pair: string) => {
    setUnknown(null)
    if (!assets.includes(pair)) setAssets([...assets, pair])
    setInput('')
  }
  const add = async (raw: string, known = false) => {
    setUnknown(null)
    if (!raw.trim()) return
    if (binance && coins && !known) {
      // pick from the real list; Enter only adds an exact ticker or the only match,
      // otherwise the suggestions stay open so "X" doesn't silently become XRP
      const q = raw.trim().toUpperCase().replace(/USDT$/, '')
      const exact = matches.find((c) => c.base === q)
      if (exact) addPair(exact.pair)
      else if (matches.length === 1) addPair(matches[0].pair)
      else if (matches.length === 0) setUnknown(raw.trim())
      return
    }
    const asset = toAsset(raw, config.marketSource, config.quoteAsset)
    if (!asset || assets.includes(asset)) {
      setInput('')
      return
    }
    // list unavailable: check the pair first, so a typo never breaks the coin list
    if (!known && binance) {
      setChecking(true)
      const exists = await symbolExists(asset)
      setChecking(false)
      if (exists === false) {
        setUnknown(raw.trim().toUpperCase())
        return
      }
    }
    addPair(asset)
  }

  return (
    <div className="card rise space-y-3 p-4">
      <div className="flex flex-wrap gap-2">
        {assets.map((a) => (
          <span key={a} className="inline-flex items-center gap-1 rounded-full bg-subtle py-1 ps-3 pe-1 text-sm">
            {config.marketSource === 'binance' ? baseOf(a) : a}
            <button
              onClick={() => setAssets(assets.filter((x) => x !== a))}
              aria-label={t('coins.remove', { coin: a })}
              className="grid size-6 cursor-pointer place-items-center rounded-full text-muted transition hover:bg-card hover:text-down"
            >
              <IconX />
            </button>
          </span>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          add(input)
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setUnknown(null)
          }}
          placeholder={binance && coins ? t('coins.search') : t('coins.addPlaceholder')}
          aria-invalid={unknown ? true : undefined}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 rounded-full border border-border bg-subtle/60 px-4 py-2 text-sm outline-none transition focus:border-border-strong"
        />
        <button
          type="submit"
          disabled={!input.trim() || checking}
          className="flex cursor-pointer items-center gap-1 rounded-full bg-text px-4 text-sm font-medium text-bg transition disabled:opacity-40"
        >
          {checking ? (
            t('coins.checking')
          ) : (
            <>
              <IconPlus /> {t('coins.add')}
            </>
          )}
        </button>
      </form>
      {binance && coins && input.trim() && matches.length > 0 && (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border" role="listbox">
          {matches.map((c) => {
            const added = present.has(c.base)
            return (
              <li key={c.pair}>
                <button
                  type="button"
                  disabled={added}
                  onClick={() => addPair(c.pair)}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-start text-sm transition hover:bg-subtle disabled:cursor-default disabled:opacity-50"
                >
                  <span>
                    <span className="font-semibold">{c.base}</span>
                    {c.name && <span className="ms-2 text-muted">{c.name}</span>}
                  </span>
                  <span className="text-xs text-gold">{added ? t('coins.added') : <IconPlus />}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
      {binance && coins && input.trim() && matches.length === 0 && !unknown && (
        <p className="px-1 text-sm text-muted">{t('coins.noMatch', { q: input.trim() })}</p>
      )}
      {unknown && (
        <p role="alert" className="px-1 text-sm text-down">
          {coins ? t('coins.noMatch', { q: unknown }) : t('coins.unknown', { coin: unknown })}
        </p>
      )}
      {binance && (
        <div>
          <p className="mb-1.5 text-xs text-muted">{t('coins.popular')}</p>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR.filter((p) => !present.has(p) && (!listed || listed.has(p))).map((p) => (
              <button
                key={p}
                onClick={() => add(p, true)}
                className="cursor-pointer rounded-full border border-border px-3 py-1 text-xs font-medium transition hover:border-border-strong hover:text-gold"
              >
                + {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CoinList({
  brief,
  isLoading,
  error,
  config,
  onConfigChange,
}: {
  brief: Brief | undefined
  isLoading: boolean
  error: string | null
  config: AdvisorConfig
  onConfigChange: (c: AdvisorConfig) => void
}) {
  const { t } = useI18n()
  const [editing, setEditing] = useState(false)
  const rows = brief?.opportunities ?? []
  const failed = (brief?.errors ?? []) as unknown[]
  const failedNames = failed
    .map((e) => (typeof e === 'object' && e && 'symbol' in e ? baseOf(String((e as { symbol: string }).symbol)) : String(e)))
    .filter(Boolean)

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          <h2 className="text-lg font-semibold">{t('coins.title')}</h2>
          <p className="text-xs text-muted">{t('coins.legend')}</p>
        </div>
        <button
          onClick={() => setEditing((v) => !v)}
          className="cursor-pointer rounded-full border border-border px-3.5 py-1.5 text-sm font-medium transition hover:border-border-strong hover:text-gold"
        >
          {editing ? t('coins.done') : t('coins.edit')}
        </button>
      </div>

      {editing && <WatchlistEditor config={config} onConfigChange={onConfigChange} />}

      {failedNames.length > 0 && (
        <p className="px-1 text-xs text-warn">{t('coins.notFound', { list: failedNames.join(', ') })}</p>
      )}
      {isLoading && rows.length === 0 && (
        <div className="card p-6 text-center text-sm text-muted">
          {t('coins.loading')}
          <span className="caret">▋</span>
        </div>
      )}
      {!isLoading && error && rows.length === 0 && (
        <div className="card p-6 text-center text-sm text-down">{error}</div>
      )}
      {!isLoading && !error && rows.length === 0 && (
        <div className="card p-6 text-center text-sm text-muted">{t('coins.empty')}</div>
      )}
      <div className="grid gap-3 lg:grid-cols-2">
        {rows.map((item, i) => (
          <CoinCard key={item.pair || item.symbol || i} item={item} delay={40 + i * 40} />
        ))}
      </div>
    </section>
  )
}
