import type { Brief } from '../lib/api'
import { timeAgo } from '../lib/format'
import { useI18n } from '../lib/i18n'

/** RSS channel titles can be long ("CoinDesk: Bitcoin, Ethereum, …") — keep the masthead. */
function sourceName(source?: string): string {
  return (source ?? '').split(':')[0].trim()
}

export default function MarketMoves({ brief }: { brief: Brief | undefined }) {
  const { t } = useI18n()
  const news = brief?.news ?? []
  const trending = brief?.trending ?? []
  if (news.length === 0 && trending.length === 0) return null

  return (
    <section className="space-y-3">
      <h2 className="px-1 text-lg font-semibold">{t('moves.title')}</h2>
      <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        {news.length > 0 && (
          <div className="card p-4">
            <p className="tick-label mb-1">{t('moves.news')}</p>
            <div className="divide-y divide-border">
              {news.slice(0, 5).map((item, i) => (
                <a
                  key={`${item.url}-${i}`}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block py-3"
                  dir="auto"
                >
                  <p className="text-[15px] leading-snug font-medium transition group-hover:text-gold">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-muted" dir="ltr">
                    {item.coins && item.coins.length > 0 && (
                      <span className="font-medium text-gold">{item.coins.slice(0, 3).join(' · ')} · </span>
                    )}
                    {sourceName(item.source)}
                    {timeAgo(item.published_at) ? ` · ${timeAgo(item.published_at)}` : ''}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
        {trending.length > 0 && (
          <div className="card p-4">
            <p className="tick-label mb-3">{t('moves.trending')}</p>
            <div className="flex flex-wrap gap-2">
              {trending.slice(0, 8).map((coin, i) => (
                <span
                  key={`${coin.symbol}-${i}`}
                  className="inline-flex items-center gap-2 rounded-full bg-subtle py-1 ps-1 pe-3 text-sm"
                >
                  {coin.thumb ? (
                    <img src={coin.thumb} alt="" className="size-6 rounded-full" />
                  ) : (
                    <span className="size-6 rounded-full bg-gold-soft" />
                  )}
                  <span className="font-medium">{coin.symbol}</span>
                  {coin.market_cap_rank != null && (
                    <span className="num text-xs text-muted">#{coin.market_cap_rank}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
