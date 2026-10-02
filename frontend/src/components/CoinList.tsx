import { useState } from 'react'
import type { AdvisorConfig } from '../hooks/useBrief'
import type { Brief, Opportunity } from '../lib/api'
import { changeColor, compactCurrency, percent } from '../lib/format'
import { baseOf, parseAssets, POPULAR, toAsset } from '../lib/assets'
import { useI18n } from '../lib/i18n'
import { IconChevron, IconPlus, IconX } from './Icons'
import { CoinIcon, RatingPill, ScoreRing } from './Rating'
import Sparkline from './Sparkline'

function ScoreDetails({ item }: { item: Opportunity }) {
  const { t, te } = useI18n()
  const sb = item.score_breakdown
  const up = Number(item.change_7d ?? 0) >= 0
  return (
    <div className="mt-4 space-y-4 border-t border-border pt-4">
      <div>
        <p className="mb-1 text-xs text-muted">{t('coin.7d')}</p>
        <Sparkline points={item.sparkline} up={up} />
      </div>

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

function WatchlistEditor({
  config,
  onConfigChange,
}: {
  config: AdvisorConfig
  onConfigChange: (c: AdvisorConfig) => void
}) {
  const { t } = useI18n()
  const [input, setInput] = useState('')
  const assets = parseAssets(config.assetsRaw)
  const setAssets = (next: string[]) => onConfigChange({ ...config, assetsRaw: next.join(', ') })
  const add = (raw: string) => {
    const asset = toAsset(raw, config.marketSource, config.quoteAsset)
    if (asset && !assets.includes(asset)) setAssets([...assets, asset])
    setInput('')
  }
  const present = new Set(assets.map(baseOf))

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
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('coins.addPlaceholder')}
          className="min-w-0 flex-1 rounded-full border border-border bg-subtle/60 px-4 py-2 text-sm outline-none transition focus:border-border-strong"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="flex cursor-pointer items-center gap-1 rounded-full bg-text px-4 text-sm font-medium text-bg transition disabled:opacity-40"
        >
          <IconPlus /> {t('coins.add')}
        </button>
      </form>
      {config.marketSource === 'binance' && (
        <div>
          <p className="mb-1.5 text-xs text-muted">{t('coins.popular')}</p>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR.filter((p) => !present.has(p)).map((p) => (
              <button
                key={p}
                onClick={() => add(p)}
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
    .map((e) => (typeof e === 'object' && e && 'symbol' in e ? String((e as { symbol: string }).symbol) : String(e)))
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
