import type { AdvisorConfig } from '../hooks/useBrief'
import type { Brief, HoldingInput } from '../lib/api'
import { baseOf, parseAssets, toAsset } from '../lib/assets'
import { changeColor, compactCurrency, percent } from '../lib/format'
import { useI18n } from '../lib/i18n'
import Caption from './brand/Caption'
import { IconX } from './Icons'
import MascotSays from './MascotSays'
import { CoinIcon, KaratBadge, RiskChip } from './Rating'
import Ticket from './Ticket'

const field =
  'h-11 w-full min-w-0 rounded-xl border-2 border-text/15 bg-card px-3 text-[15px] outline-none transition focus:border-text/60'

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
  const label = baseOf
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
    <section className="md:pt-6">
      <Caption
        as="h1"
        text={t('pf.title')}
        className="pt-1 text-[clamp(2.75rem,13.5vw,4rem)] md:text-[4.5rem] ltr:text-[clamp(2.4rem,11vw,3.4rem)] ltr:md:text-[4rem]"
      />
      <p className="mt-3 text-sm text-muted">{t('pf.intro')}</p>

      <div className={positions.length > 0 ? 'md:mt-2 md:grid md:grid-cols-2 md:items-start md:gap-x-12' : 'max-w-xl'}>
        {/* what you hold, as a record: one line per coin, the total at the foot */}
        {positions.length > 0 && (
          <div className="mx-auto mt-8 w-full max-w-md md:order-2">
            <Ticket tilt={-1.2} className="mx-1">
              <ul>
                {positions.map((p, i) => (
                  <li key={p.pair || p.symbol || i} className="flex items-center gap-3 pb-3.5">
                    <CoinIcon symbol={p.symbol} image={p.image} />
                    <div className="grid min-w-0 flex-1 gap-1">
                      <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="truncate font-semibold">{p.name || p.symbol}</span>
                        <KaratBadge karat={p.grade?.karat} size="sm" />
                      </p>
                      <RiskChip risk={p.grade?.risk} />
                      {p.holding?.note && <p className="text-xs text-muted">{te(p.holding.note)}</p>}
                    </div>
                    <div className="text-end">
                      <p className="num font-semibold" dir="ltr">
                        {compactCurrency(p.holding?.value)}
                      </p>
                      <p className={`num text-sm ${changeColor(p.holding?.unrealized_pnl)}`} dir="ltr">
                        {percent(p.holding?.unrealized_pnl)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="ticket-rule poster flex items-baseline justify-between gap-3 pt-3.5 text-[26px]">
                <span>{t('pf.total')}</span>
                <span dir="ltr">{compactCurrency(totalValue)}</span>
              </p>
              <p className="mt-1 flex items-baseline justify-between gap-3 font-medium">
                <span>{t('pf.pnl')}</span>
                <span className={`num font-semibold ${changeColor(totalPnl)}`} dir="ltr">
                  {percent(totalPnl)}
                </span>
              </p>
            </Ticket>
            <p className="mt-7 text-[13px] text-muted">{t('coin.notAdvice')}</p>
          </div>
        )}

        <div className="mt-8 md:order-1">
          {config.holdings.length === 0 ? (
            <div className="max-w-md">
              <MascotSays>{t('pf.empty')}</MascotSays>
              <button type="button" onClick={addHolding} className="go mt-5 w-full">
                {t('pf.add')}
              </button>
            </div>
          ) : (
            <>
              <div className="hidden grid-cols-[1.2fr_1fr_1fr_2.5rem] gap-2 pb-1 text-[13px] text-muted sm:grid">
                <span>{t('pf.coin')}</span>
                <span>{t('pf.amount')}</span>
                <span>{t('pf.avg')}</span>
                <span />
              </div>
              {config.holdings.map((h, i) => {
                const asset = toAsset(h.coin_id, config.quoteAsset)
                const remove = () => onConfigChange({ ...config, holdings: config.holdings.filter((_, idx) => idx !== i) })
                const removeButton = (extra: string) => (
                  <button
                    type="button"
                    aria-label={t('pf.remove')}
                    onClick={remove}
                    className={`link size-10 shrink-0 cursor-pointer place-items-center self-center rounded-xl text-lg text-muted transition hover:text-down ${extra}`}
                  >
                    <IconX />
                  </button>
                )
                return (
                  // phones: a small group (coin + remove, then labelled amount / price);
                  // desktop: one row under the column headers
                  <div
                    key={i}
                    className="grid grid-cols-2 gap-2 border-b border-text/10 py-3.5 sm:grid-cols-[1.2fr_1fr_1fr_2.5rem] sm:border-0 sm:py-1.5"
                  >
                    <div className="col-span-2 flex gap-2 sm:col-span-1">
                      <select
                        value={asset}
                        onChange={(e) => setHolding(i, { coin_id: e.target.value })}
                        aria-label={t('pf.coin')}
                        className={`${field} flex-1 cursor-pointer font-semibold`}
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
                      <span className="mb-1 block text-[13px] text-muted sm:sr-only">{t('pf.amount')}</span>
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
                      <span className="mb-1 block text-[13px] text-muted sm:sr-only">{t('pf.avg')}</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        value={h.average_buy_price}
                        placeholder="$"
                        onChange={(e) => setHolding(i, { average_buy_price: e.target.value === '' ? '' : Number(e.target.value) })}
                        className={field}
                      />
                    </label>
                    {removeButton('hidden sm:grid')}
                  </div>
                )
              })}
              <button type="button" onClick={addHolding} className="go go-sm mt-5 w-full sm:w-auto sm:px-8">
                {t('pf.add')}
              </button>
            </>
          )}
          <Settings config={config} onConfigChange={onConfigChange} />
        </div>
      </div>
    </section>
  )
}

/** One quiet line: the currency prices are shown in. */
function Settings({ config, onConfigChange }: { config: AdvisorConfig; onConfigChange: (c: AdvisorConfig) => void }) {
  const { t } = useI18n()
  return (
    <label className="mt-8 flex items-center gap-3 text-sm text-muted">
      {t('pf.quote')}
      <select
        value={config.quoteAsset}
        onChange={(e) => onConfigChange({ ...config, quoteAsset: e.target.value })}
        className="h-10 cursor-pointer rounded-xl border-2 border-text/15 bg-card px-2.5 text-[15px] font-semibold text-text outline-none transition focus:border-text/60"
      >
        <option value="USDT">USDT</option>
        <option value="USDC">USDC</option>
      </select>
    </label>
  )
}

export default function PortfolioView(props: {
  brief: Brief | undefined
  config: AdvisorConfig
  onConfigChange: (c: AdvisorConfig) => void
}) {
  return <Holdings brief={props.brief} config={props.config} onConfigChange={props.onConfigChange} />
}
