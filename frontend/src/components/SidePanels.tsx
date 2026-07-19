import { useState } from 'react'
import type { Brief, AppStatus } from '../lib/api'
import { sendAlert } from '../lib/api'
import { timeAgo } from '../lib/format'
import DeskHead from './DeskHead'

export function Trending({ brief }: { brief: Brief | undefined }) {
  const rows = brief?.trending ?? []
  if (rows.length === 0) return null
  return (
    <section className="glass rise p-4" style={{ animationDelay: '260ms' }}>
      <DeskHead title="Trending" meta="coingecko search" />
      <div className="mt-3 grid grid-cols-2 gap-2">
        {rows.slice(0, 8).map((coin, i) => (
          <div
            key={`${coin.symbol}-${i}`}
            className="flex items-center gap-2 rounded-md border border-line bg-panel-2/60 px-2.5 py-2"
          >
            {coin.thumb && <img src={coin.thumb} alt="" className="size-6 rounded-full" />}
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">{coin.name}</p>
              <p className="num text-[10px] text-mute">
                {coin.symbol} · #{coin.market_cap_rank ?? '--'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/** RSS channel titles can be long ("CoinDesk: Bitcoin, Ethereum, …") — keep the masthead. */
function sourceName(source?: string): string {
  return (source ?? '').split(':')[0].trim()
}

export function News({ brief }: { brief: Brief | undefined }) {
  const rows = brief?.news ?? []
  if (rows.length === 0) return null
  const watchlisted = rows.some((item) => (item.coins?.length ?? 0) > 0)
  const feeds = new Set(rows.map((item) => sourceName(item.source))).size
  return (
    <section className="glass rise p-4" style={{ animationDelay: '300ms' }}>
      <DeskHead
        title="Headlines"
        meta={watchlisted ? 'your watchlist' : `${feeds} feed${feeds === 1 ? '' : 's'}`}
      />
      <div className="mt-2 divide-y divide-line">
        {rows.slice(0, 6).map((item, i) => (
          <a
            key={`${item.url}-${i}`}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="group block py-2.5"
          >
            <p className="text-[13px] leading-snug font-medium transition group-hover:text-teal">
              {item.title}
            </p>
            <p className="num mt-0.5 text-[10px] text-mute">
              {item.coins && item.coins.length > 0 && (
                <span className="text-teal-dim">{item.coins.slice(0, 3).join(' · ')} · </span>
              )}
              {sourceName(item.source)}
              {timeAgo(item.published_at) ? ` · ${timeAgo(item.published_at)}` : ''}
            </p>
          </a>
        ))}
      </div>
    </section>
  )
}

function Channel({
  label,
  ready,
  checked,
  onToggle,
}: {
  label: string
  ready?: boolean
  checked: boolean
  onToggle: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs">
      <input type="checkbox" checked={checked} onChange={onToggle} className="accent-(--color-teal)" />
      <span>{label}</span>
      <span className={`num ml-auto text-[10px] ${ready ? 'text-buy' : 'text-mute'}`}>
        {ready ? 'ready' : 'not set'}
      </span>
    </label>
  )
}

export function AlertPanel({
  brief,
  status,
  onToast,
}: {
  brief: Brief | undefined
  status: AppStatus | undefined
  onToast: (msg: string) => void
}) {
  const [channels, setChannels] = useState<string[]>([])
  const [sending, setSending] = useState(false)
  const notifications = status?.notifications

  const toggle = (channel: string) =>
    setChannels((c) => (c.includes(channel) ? c.filter((x) => x !== channel) : [...c, channel]))

  const send = async () => {
    if (!brief) return onToast('Run an analysis first.')
    if (channels.length === 0) return onToast('Select at least one alert channel.')
    setSending(true)
    try {
      const payload = await sendAlert(brief, channels)
      const sent = (payload.results || []).filter((r) => r.ok).length
      onToast(sent ? `Alert sent to ${sent} channel(s).` : 'No alert channel is configured yet.')
    } catch (e) {
      onToast(e instanceof Error ? e.message : 'Alert failed.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="glass rise p-4" style={{ animationDelay: '340ms' }}>
      <DeskHead title="Alerts" />
      <div className="mt-3 space-y-2">
        <Channel
          label="Discord webhook"
          ready={notifications?.discord}
          checked={channels.includes('discord')}
          onToggle={() => toggle('discord')}
        />
        <Channel
          label="WhatsApp (Twilio)"
          ready={notifications?.whatsapp}
          checked={channels.includes('whatsapp')}
          onToggle={() => toggle('whatsapp')}
        />
      </div>
      <button
        onClick={send}
        disabled={sending}
        className="mt-3 w-full cursor-pointer rounded-md border border-line-2 bg-teal/10 py-1.5 font-display text-xs font-semibold tracking-widest text-teal uppercase transition hover:bg-teal/20 disabled:opacity-40"
      >
        {sending ? 'sending…' : 'send market alert'}
      </button>
    </section>
  )
}
