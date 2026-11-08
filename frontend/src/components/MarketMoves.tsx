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
  // Trending searches were removed (2026-11): mostly hyped micro-caps.
  if (news.length === 0) return null

  return (
    <section className="space-y-3">
      <h2 className="px-1 text-lg font-semibold">{t('moves.title')}</h2>
      <div className="grid gap-3">
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
      </div>
    </section>
  )
}
