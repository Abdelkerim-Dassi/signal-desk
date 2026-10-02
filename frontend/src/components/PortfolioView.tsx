import { useState } from 'react'
import type { AdvisorConfig } from '../hooks/useBrief'
import type { AppStatus, Brief, HoldingInput } from '../lib/api'
import { sendAlert } from '../lib/api'
import { baseOf, parseAssets, toAsset } from '../lib/assets'
import { changeColor, compactCurrency, percent } from '../lib/format'
import { useI18n } from '../lib/i18n'
import { IconPlus, IconX } from './Icons'
import { CoinIcon, RatingPill } from './Rating'

const field =
  'w-full min-w-0 rounded-xl border border-border bg-subtle/60 px-3 py-2 text-sm outline-none transition focus:border-border-strong'

function Holdings({
  brief,
  config,
  onConfigChange,
}: {
  brief: Brief | undefined
  config: AdvisorConfig
  onConfigChange: (c: AdvisorConfig) => void
}) {
  const { t, te } = useI18n()
  const binance = config.marketSource === 'binance'
  const label = (asset: string) => (binance ? baseOf(asset) : asset)
  const watchlist = parseAssets(config.assetsRaw)

  const setHolding = (index: number, patch: Partial<HoldingInput>) =>
    onConfigChange({
      ...config,
      holdings: config.holdings.map((h, i) => (i === index ? { ...h, ...patch } : h)),
    })
  const addHolding = () =>
    onConfigChange({
      ...config,
      holdings: [...config.holdings, { coin_id: watchlist[0] ?? '', amount: '', average_buy_price: '' }],
    })

  const positions = brief?.portfolio ?? []
  const totalValue = positions.reduce((sum, p) => sum + (p.holding?.value ?? 0), 0)
  const cost = config.holdings.reduce((sum, h) => {
    if (h.amount === '' || h.average_buy_price === '') return sum
    return sum + Number(h.amount) * Number(h.average_buy_price)
  }, 0)
  const pricedValue = positions.reduce((sum, p) => {
    const h = p.holding
    return h?.unrealized_pnl != null && h.value != null ? sum + h.value : sum
  }, 0)
  const totalPnl = cost > 0 ? ((pricedValue - cost) / cost) * 100 : null

  return (
    <section className="space-y-4">
      <div className="px-1">
        <h2 className="text-2xl font-semibold tracking-tight">{t('pf.title')}</h2>
        <p className="text-sm text-muted">{t('pf.intro')}</p>
      </div>

      {positions.length > 0 && (
        <div className="card hero-wash rise grid grid-cols-2 gap-4 p-5">
          <div>
            <p className="text-xs text-muted">{t('pf.total')}</p>
            <p className="num text-2xl font-semibold" dir="ltr">
              {compactCurrency(totalValue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">{t('pf.pnl')}</p>
            <p className={`num text-2xl font-semibold ${changeColor(totalPnl)}`} dir="ltr">
              {percent(totalPnl)}
            </p>
          </div>
        </div>
      )}

      {positions.length > 0 && (
        <div className="grid gap-3 lg:grid-cols-2">
          {positions.map((p, i) => (
            <div key={p.pair || p.symbol || i} className="card flex items-center gap-3 p-4">
              <CoinIcon symbol={p.symbol} image={p.image} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold">{p.name || p.symbol}</p>
                  <RatingPill rating={p.rating} size="sm" />
                </div>
                <p className="text-xs text-muted">{te(p.holding?.note) || t('coin.notAdvice')}</p>
              </div>
              <div className="text-end">
                <p className="num font-semibold" dir="ltr">
                  {compactCurrency(p.holding?.value)}
                </p>
                <p className={`num text-sm ${changeColor(p.holding?.unrealized_pnl)}`} dir="ltr">
                  {percent(p.holding?.unrealized_pnl)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card space-y-3 p-5">
        {config.holdings.length === 0 && <p className="text-sm text-muted">{t('pf.empty')}</p>}
        {config.holdings.length > 0 && (
          <div className="hidden grid-cols-[1.2fr_1fr_1fr_2.25rem] gap-2 px-1 text-xs text-muted sm:grid">
            <span>{t('pf.coin')}</span>
            <span>{t('pf.amount')}</span>
            <span>{t('pf.avg')}</span>
            <span />
          </div>
        )}
        {config.holdings.map((h, i) => {
          const asset = toAsset(h.coin_id, config.marketSource, config.quoteAsset)
          const remove = () =>
            onConfigChange({ ...config, holdings: config.holdings.filter((_, idx) => idx !== i) })
          const removeButton = (extra: string) => (
            <button
              type="button"
              aria-label={t('pf.remove')}
              onClick={remove}
              className={`size-9 shrink-0 cursor-pointer place-items-center self-center rounded-xl text-muted transition hover:bg-subtle hover:text-down ${extra}`}
            >
              <IconX />
            </button>
          )
          return (
            // phones: a small card (coin + remove, then labelled amount / price);
            // desktop: one row under the column headers
            <div
              key={i}
              className="grid grid-cols-2 gap-2 rounded-2xl bg-subtle/50 p-2.5 sm:grid-cols-[1.2fr_1fr_1fr_2.25rem] sm:bg-transparent sm:p-0"
            >
              <div className="col-span-2 flex gap-2 sm:col-span-1">
                <select
                  value={asset}
                  onChange={(e) => setHolding(i, { coin_id: e.target.value })}
                  aria-label={t('pf.coin')}
                  className={`${field} flex-1 cursor-pointer`}
                >
                  {!watchlist.includes(asset) && h.coin_id && <option value={h.coin_id}>{label(h.coin_id)}</option>}
                  {watchlist.map((a) => (
                    <option key={a} value={a}>
                      {label(a)}
                    </option>
                  ))}
                </select>
                {removeButton('grid sm:hidden')}
              </div>
              <label className="block">
                <span className="mb-1 block text-xs text-muted sm:sr-only">{t('pf.amount')}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  value={h.amount}
                  placeholder="0"
                  onChange={(e) => setHolding(i, { amount: e.target.value === '' ? '' : Number(e.target.value) })}
                  className={field}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted sm:sr-only">{t('pf.avg')}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  value={h.average_buy_price}
                  placeholder="$"
                  onChange={(e) =>
                    setHolding(i, { average_buy_price: e.target.value === '' ? '' : Number(e.target.value) })
                  }
                  className={field}
                />
              </label>
              {removeButton('hidden sm:grid')}
            </div>
          )
        })}
        <button
          type="button"
          onClick={addHolding}
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-sm text-muted transition hover:border-border-strong hover:text-gold"
        >
          <IconPlus /> {t('pf.add')}
        </button>
      </div>
    </section>
  )
}

function Settings({ config, onConfigChange }: { config: AdvisorConfig; onConfigChange: (c: AdvisorConfig) => void }) {
  const { t } = useI18n()
  const switchSource = (source: string) => {
    let assetsRaw = config.assetsRaw
    if (source === 'binance' && /bitcoin|ethereum/i.test(assetsRaw)) assetsRaw = 'BTCUSDT, ETHUSDT, SOLUSDT'
    if (source === 'coingecko' && /USDT/i.test(assetsRaw)) assetsRaw = 'bitcoin, ethereum, solana'
    onConfigChange({ ...config, marketSource: source, assetsRaw, holdings: [] })
  }
  return (
    <section className="card space-y-3 p-5">
      <h3 className="font-semibold">{t('pf.settings')}</h3>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm">
          <span className="mb-1 block text-xs text-muted">{t('pf.source')}</span>
          <select
            value={config.marketSource}
            onChange={(e) => switchSource(e.target.value)}
            className={`${field} cursor-pointer`}
          >
            <option value="binance">Binance</option>
            <option value="coingecko">CoinGecko</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-xs text-muted">{t('pf.quote')}</span>
          <select
            value={config.quoteAsset}
            onChange={(e) => onConfigChange({ ...config, quoteAsset: e.target.value })}
            disabled={config.marketSource !== 'binance'}
            className={`${field} cursor-pointer disabled:opacity-50`}
          >
            <option value="USDT">USDT</option>
            <option value="USDC">USDC</option>
          </select>
        </label>
      </div>
    </section>
  )
}

function Alerts({
  brief,
  status,
  onToast,
}: {
  brief: Brief | undefined
  status: AppStatus | undefined
  onToast: (msg: string) => void
}) {
  const { t } = useI18n()
  const [channels, setChannels] = useState<string[]>([])
  const [sending, setSending] = useState(false)
  const notifications = status?.notifications
  if (!notifications?.discord && !notifications?.whatsapp) return null

  const toggle = (c: string) => setChannels((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]))
  const send = async () => {
    if (!brief) return
    if (channels.length === 0) return onToast(t('pf.pickChannel'))
    setSending(true)
    try {
      const payload = await sendAlert(brief, channels)
      const sent = (payload.results || []).filter((r) => r.ok).length
      onToast(sent ? t('pf.sent', { n: sent }) : t('pf.noChannel'))
    } catch (e) {
      onToast(e instanceof Error ? e.message : 'Alert failed.')
    } finally {
      setSending(false)
    }
  }
  const rows = [
    { id: 'discord', label: 'Discord', ready: notifications?.discord },
    { id: 'whatsapp', label: 'WhatsApp', ready: notifications?.whatsapp },
  ]
  return (
    <section className="card space-y-3 p-5">
      <div>
        <h3 className="font-semibold">{t('pf.alerts')}</h3>
        <p className="text-sm text-muted">{t('pf.alertsIntro')}</p>
      </div>
      {rows.map((r) => (
        <label key={r.id} className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={channels.includes(r.id)}
            onChange={() => toggle(r.id)}
            className="accent-(--color-gold)"
          />
          {r.label}
          <span className={`ms-auto text-xs ${r.ready ? 'text-up' : 'text-muted'}`}>
            {r.ready ? t('pf.ready') : t('pf.notSet')}
          </span>
        </label>
      ))}
      <button
        onClick={send}
        disabled={sending}
        className="w-full cursor-pointer rounded-full bg-text py-2 text-sm font-medium text-bg transition hover:opacity-90 disabled:opacity-40"
      >
        {sending ? t('pf.sending') : t('pf.send')}
      </button>
    </section>
  )
}

export default function PortfolioView(props: {
  brief: Brief | undefined
  config: AdvisorConfig
  onConfigChange: (c: AdvisorConfig) => void
  status: AppStatus | undefined
  onToast: (msg: string) => void
}) {
  return (
    <div className="space-y-4">
      <Holdings brief={props.brief} config={props.config} onConfigChange={props.onConfigChange} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Settings config={props.config} onConfigChange={props.onConfigChange} />
        <Alerts brief={props.brief} status={props.status} onToast={props.onToast} />
      </div>
    </div>
  )
}
