import type { CSSProperties, ReactNode } from 'react'

// Paper is white in both themes, so inside a ticket the colour tokens go back
// to their light values: ink text, readable greys, the light theme's accents.
const ON_PAPER = {
  '--color-text': '#15171c',
  '--color-fg': '#15171c',
  '--color-muted': '#5e6068',
  '--color-mute': '#5e6068',
  '--color-card': '#ffffff',
  '--color-subtle': '#f1eee7',
  '--color-border': 'rgba(21, 23, 28, 0.08)',
  '--color-gold': '#9a6b14',
  '--color-up': '#0e9f6e',
  '--color-buy': '#0e9f6e',
  '--color-strong': '#0e9f6e',
  '--color-down': '#e0484e',
  '--color-sell': '#e0484e',
  '--color-weak': '#e0484e',
  '--color-warn': '#b45309',
  '--color-neutral': '#64748b',
} as CSSProperties

/** A paper record of something that happened (reel.css: .ticket-wrap, .ticket).
 *  `tilt` is in degrees; a long ticket leans less than the short one on Home. */
export default function Ticket({
  children,
  tilt = -1,
  className = '',
}: {
  children: ReactNode
  tilt?: number
  className?: string
}) {
  return (
    <div className={`ticket-wrap ${className}`} style={{ transform: `rotate(${tilt}deg)` }}>
      <div className="ticket text-[15px]" style={ON_PAPER}>
        {children}
      </div>
    </div>
  )
}
