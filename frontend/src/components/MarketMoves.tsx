import { useState } from 'react'
import type { Brief } from '../lib/api'
import { timeAgo } from '../lib/format'
import { useI18n } from '../lib/i18n'
import Caption from './brand/Caption'

/** RSS channel titles can be long ("CoinDesk: Bitcoin, Ethereum, …") — keep the masthead. */
function sourceName(source?: string): string {
  return (source ?? '').split(':')[0].trim()
}

const FIRST = 2 // headlines shown before "more"

export default function MarketMoves({ brief }: { brief: Brief | undefined }) {
  const { t } = useI18n()
  const [all, setAll] = useState(false)
  const news = (brief?.news ?? []).slice(0, 5)
  // Trending searches were removed (2026-11): mostly hyped micro-caps.
  if (news.length === 0) return null

  return (
    <section className="pt-6 md:pt-10" aria-labelledby="today-moves">
      <Caption id="today-moves" text={t('moves.title')} className="text-[2.1rem] md:text-5xl" />
      <ul className="mt-2 divide-y divide-text/10">
        {news.slice(0, all ? news.length : FIRST).map((item, i) => (
          <li key={`${item.url}-${i}`}>
            <a href={item.url} target="_blank" rel="noreferrer" className="link group block rounded-lg py-3.5" dir="auto">
              <p className="text-[15px] leading-snug font-medium group-hover:underline">{item.title}</p>
              <p className="mt-1 flex flex-wrap gap-x-2.5 text-[13px] text-muted" dir="ltr">
                {item.coins && item.coins.length > 0 && <span className="font-semibold text-gold">{item.coins.slice(0, 3).join(' ')}</span>}
                <span>{sourceName(item.source)}</span>
                {timeAgo(item.published_at) && <span>{timeAgo(item.published_at)}</span>}
              </p>
            </a>
          </li>
        ))}
      </ul>
      {!all && news.length > FIRST && (
        <button type="button" onClick={() => setAll(true)} className="alt mt-3 text-[15px]">
          {t('moves.more')}
        </button>
      )}
    </section>
  )
}
