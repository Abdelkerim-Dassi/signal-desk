import type { SVGProps } from 'react'
import { track } from '../../lib/source'
import { SOCIALS } from '../../lib/stories'
import type { SocialId } from '../../lib/stories'

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function Glyph({ id, ...p }: { id: SocialId } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden {...stroke} {...p}>
      {id === 'tiktok' && <path d="M14 3v11a4 4 0 1 1-4-4M14 3c.4 2.6 2 4.3 4.5 4.6" />}
      {id === 'instagram' && (
        <>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="3.8" />
          <path d="M17.2 6.8h.01" />
        </>
      )}
      {id === 'youtube' && (
        <>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="M10.2 9.3v5.4l4.6-2.7z" />
        </>
      )}
      {id === 'facebook' && <path d="M14.5 21v-8h2.7l.5-3.2h-3.2V7.9c0-1 .4-1.7 1.8-1.7h1.5V3.3c-.7-.1-1.5-.2-2.3-.2-2.5 0-4 1.5-4 4.2v2.5H8.8V13h2.7v8" />}
      {id === 'telegram' && <path d="M21 4 3 11l5.5 2M21 4l-3 15-9.5-6M21 4 8.5 13m0 0v5.5l3.2-3.4" />}
    </svg>
  )
}

/** Qirat's accounts, as plain named links. `only` keeps a few (the player
 *  offers the two where the stories are watched most). */
export default function Socials({ only, className = '' }: { only?: SocialId[]; className?: string }) {
  const list = only ? SOCIALS.filter((s) => only.includes(s.id)) : SOCIALS
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {list.map((s) => (
        <li key={s.id}>
          <a
            href={s.url}
            target="_blank"
            rel="noreferrer"
            onClick={() => track('social', s.id)}
            className="link flex items-center gap-1.5 rounded-xl bg-card px-3 py-2 text-sm font-medium text-text transition hover:bg-subtle"
            dir="ltr"
          >
            <Glyph id={s.id} className="text-[1.15em]" />
            {s.name}
          </a>
        </li>
      ))}
    </ul>
  )
}
