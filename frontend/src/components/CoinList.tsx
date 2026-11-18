import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { AdvisorConfig } from '../hooks/useBrief'
import { getCoins, symbolExists } from '../lib/api'
import type { Brief, CoinOption, Opportunity } from '../lib/api'
import { changeColor, compactCurrency, percent } from '../lib/format'
import { baseOf, parseAssets, POPULAR, toAsset } from '../lib/assets'
import { useI18n } from '../lib/i18n'
import Caption from './brand/Caption'
import { IconChevron, IconPlus, IconX } from './Icons'
import MascotSays from './MascotSays'
import { CoinIcon, KaratBadge, RiskChip } from './Rating'
import CandleChart from './CandleChart'

/** One fact of a grade: its name, the number, and a line that reads the number. */
function Fact({ label, sub, children }: { label: string; sub?: string; children: ReactNode }) {
  return (
    <div className="py-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <dt>{label}</dt>
        <dd className="num font-semibold">{children}</dd>
      </div>
      {sub && <p className="mt-0.5 text-[13px] text-muted">{sub}</p>}
    </div>
  )
}

function ScoreDetails({ item }: { item: Opportunity }) {
  const { t } = useI18n()
  const g = item.grade
  return (
    <div className="space-y-6 pt-1 pb-6">
      {(item.candles?.length ?? 0) >= 2 && (
        <div>
          <p className="mb-1 text-[13px] text-muted">{t('chart.title')}</p>
          <CandleChart candles={item.candles} />
        </div>
      )}

      {g && (
        <div>
          <p className="font-semibold">{g.karat ? t('karat.title', { k: g.karat }) : t('karat.young')}</p>
          <dl className="mt-1 divide-y divide-text/10 text-[15px]">
            {g.mom90_pct != null && (
              <Fact label={t('karat.trend')} sub={t('karat.trendSub', { n: g.momentum_pct ?? '--' })}>
                <span className={changeColor(g.mom90_pct)} dir="ltr">
                  {percent(g.mom90_pct)}
                </span>
              </Fact>
            )}
            <Fact label={t('karat.calm')} sub={t('karat.calmSub', { n: g.calm_pct })}>
              {t('karat.perDay', { v: g.typical_day_pct.toFixed(1) })}
            </Fact>
          </dl>
          <p className="mt-2 text-[13px] text-muted">{t('karat.compare')}</p>
        </div>
      )}

      {g && (
        <div>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-semibold">
            {t('risk.title')}
            <RiskChip risk={g.risk} />
          </p>
          <dl className="mt-1 divide-y divide-text/10 text-[15px]">
            <Fact label={t('risk.day')}>
              <span dir="ltr">±{g.typical_day_pct.toFixed(1)}%</span>
            </Fact>
            <Fact label={t('risk.month')}>
              <span className="text-down" dir="ltr">
                {g.rough_month_pct.toFixed(0)}%
              </span>
            </Fact>
          </dl>
          <p className="mt-2 text-sm">{t('risk.money', { v: Math.abs(Math.round(g.rough_month_pct)) })}</p>
          <a href="#learn-price-swings" className="alt mt-1.5 text-sm">
            {t('risk.learn')}
          </a>
          <p className="mt-3 text-[13px] text-muted">{t('risk.note')}</p>
        </div>
      )}

      <p className="text-[13px] text-muted">{t('coin.notAdvice')}</p>
    </div>
  )
}

/** A coin is a row on the paper: its name, price and risk, and its hallmark. Tap it for the reasons. */
function CoinRow({ item }: { item: Opportunity }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const symbol = (item.symbol || '').toUpperCase()
  return (
    <li className="border-b border-text/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t('coin.details')}
        className="link flex w-full cursor-pointer items-center gap-3 rounded-lg py-3.5 text-start"
      >
        <CoinIcon symbol={symbol} image={item.image} />
        <span className="grid min-w-0 flex-1 gap-0.5">
          <span className="truncate text-[17px] leading-snug font-semibold">{item.name || symbol}</span>
          <span className="num text-sm rtl:text-end" dir="ltr">
            {compactCurrency(item.current_price)} <span className={changeColor(item.change_24h)}>{percent(item.change_24h)}</span>
          </span>
          <RiskChip risk={item.grade?.risk} />
        </span>
        <KaratBadge karat={item.grade?.karat} />
        <IconChevron className={`shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <ScoreDetails item={item} />}
    </li>
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
  // the real list of tradable coins: the picker only offers these
  const coinsQuery = useQuery({
    queryKey: ['coins', config.quoteAsset],
    queryFn: () => getCoins(config.quoteAsset),
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
    if (coins && !known) {
      // pick from the real list; Enter only adds an exact ticker or the only match,
      // otherwise the suggestions stay open so "X" doesn't silently become XRP
      const q = raw.trim().toUpperCase().replace(/USDT$/, '')
      const exact = matches.find((c) => c.base === q)
      if (exact) addPair(exact.pair)
      else if (matches.length === 1) addPair(matches[0].pair)
      else if (matches.length === 0) setUnknown(raw.trim())
      return
    }
    const asset = toAsset(raw, config.quoteAsset)
    if (!asset || assets.includes(asset)) {
      setInput('')
      return
    }
    // list unavailable: check the pair first, so a typo never breaks the coin list
    if (!known) {
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
    <div className="space-y-4 pt-1 pb-3">
      {/* a solid tag is a coin on the list, a dashed one is a coin you could add */}
      <ul className="flex flex-wrap gap-2">
        {assets.map((a) => (
          <li key={a} className="inline-flex items-center rounded-[10px] border-2 border-text/70 ps-3 text-[13.5px] font-semibold">
            <bdi>{baseOf(a)}</bdi>
            <button
              onClick={() => setAssets(assets.filter((x) => x !== a))}
              aria-label={t('coins.remove', { coin: a })}
              className="link grid size-8 cursor-pointer place-items-center rounded-lg text-muted transition hover:text-down"
            >
              <IconX />
            </button>
          </li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          add(input)
        }}
        className="flex items-start gap-2.5"
      >
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setUnknown(null)
          }}
          placeholder={coins ? t('coins.search') : t('coins.addPlaceholder')}
          aria-invalid={unknown ? true : undefined}
          autoComplete="off"
          spellCheck={false}
          className="h-[46px] min-w-0 flex-1 rounded-[14px] border-2 border-text/15 bg-card px-4 text-[15px] outline-none transition placeholder:text-muted/80 focus:border-text/60"
        />
        <button type="submit" disabled={!input.trim() || checking} className="go go-sm shrink-0 px-5 disabled:cursor-default disabled:opacity-40">
          {checking ? t('coins.checking') : t('coins.add')}
        </button>
      </form>
      {coins && input.trim() && matches.length > 0 && (
        <ul className="divide-y divide-text/10" role="listbox">
          {matches.map((c) => {
            const added = present.has(c.base)
            return (
              <li key={c.pair}>
                <button
                  type="button"
                  disabled={added}
                  onClick={() => addPair(c.pair)}
                  className="link flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg py-3 text-start text-[15px] disabled:cursor-default disabled:opacity-50"
                >
                  <span>
                    <bdi className="font-semibold">{c.base}</bdi>
                    {c.name && <span className="ms-2 text-muted">{c.name}</span>}
                  </span>
                  <span className="text-[13px] font-semibold">{added ? t('coins.added') : <IconPlus />}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
      {coins && input.trim() && matches.length === 0 && !unknown && (
        <p className="text-sm text-muted">{t('coins.noMatch', { q: input.trim() })}</p>
      )}
      {unknown && (
        <p role="alert" className="text-sm text-down">
          {coins ? t('coins.noMatch', { q: unknown }) : t('coins.unknown', { coin: unknown })}
        </p>
      )}
      <div>
        <p className="mb-2 text-[13px] text-muted">{t('coins.popular')}</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR.filter((p) => !present.has(p) && (!listed || listed.has(p))).map((p) => (
            <button
              key={p}
              onClick={() => add(p, true)}
              className="link cursor-pointer rounded-[10px] border-2 border-dashed border-text/35 px-3 py-1.5 text-[13.5px] font-semibold transition hover:border-text/70"
              dir="ltr"
            >
              + {p}
            </button>
          ))}
        </div>
      </div>
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

  // an empty list: the gold bar says so and holds the one action itself
  const empty = !isLoading && !error && rows.length === 0

  return (
    <section className="pt-6 md:pt-10" aria-labelledby="today-coins">
      <div className="flex items-end justify-between gap-3">
        <Caption id="today-coins" text={t('coins.title')} className="text-[2.1rem] md:text-5xl" />
        {(!empty || editing) && (
          <button onClick={() => setEditing((v) => !v)} aria-expanded={editing} className="alt mb-1 shrink-0 text-[15px]">
            {editing ? t('coins.done') : t('coins.edit')}
          </button>
        )}
      </div>
      {/* the scale, read off its two ends */}
      <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted">
        <span className="inline-flex items-center gap-2">
          <KaratBadge karat={24} size="sm" />
          {t('karat.top')}
        </span>
        <span className="inline-flex items-center gap-2">
          <KaratBadge karat={10} size="sm" />
          {t('karat.bottom')}
        </span>
      </p>

      {editing && (
        <div className="mt-4">
          <WatchlistEditor config={config} onConfigChange={onConfigChange} />
        </div>
      )}

      {failedNames.length > 0 && <p className="mt-3 text-[13px] text-warn">{t('coins.notFound', { list: failedNames.join(', ') })}</p>}
      {isLoading && rows.length === 0 && (
        <p className="mt-5 text-sm text-muted">
          {t('coins.loading')}
          <span className="caret">▋</span>
        </p>
      )}
      {!isLoading && error && rows.length === 0 && <p className="mt-5 text-sm text-down">{error}</p>}
      {empty && (
        <div className="mt-5 max-w-md">
          <MascotSays mood="thinking">{t('coins.empty')}</MascotSays>
          {!editing && (
            <button type="button" onClick={() => setEditing(true)} className="go go-sm mt-4 w-full">
              {t('coins.edit')}
            </button>
          )}
        </div>
      )}
      {rows.length > 0 && (
        <ul className="mt-2 grid items-start lg:grid-cols-2 lg:gap-x-12">
          {rows.map((item, i) => (
            <CoinRow key={item.pair || item.symbol || i} item={item} />
          ))}
        </ul>
      )}
    </section>
  )
}
