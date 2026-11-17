/** The gold bar, as drawn for the videos (marketing/assets/brand/mascot.py).
 *  The art is a 240 x 240 square with empty space above the bar, so the frame
 *  crops to the bar itself: `size` is the width of what you see. */

export type Mood = 'happy' | 'excited' | 'worried' | 'thinking' | 'wink'

export default function Mascot({
  mood = 'happy',
  size = 240,
  blink = false,
  className = '',
  label = '',
}: {
  mood?: Mood
  size?: number
  /** closes its eyes now and then; drawn for the happy face only */
  blink?: boolean
  className?: string
  /** what a screen reader says; empty when the bar is decoration */
  label?: string
}) {
  // the bar fills x 22..220, y 84..208 of the 240 square
  const art = size * (240 / 198)
  const frame = { width: size, height: size * 0.66 }
  const img = {
    position: 'absolute' as const,
    width: art,
    height: art,
    maxWidth: 'none',
    left: -art * (22 / 240),
    top: -art * (78 / 240),
  }
  return (
    <span className={`relative block shrink-0 ${className}`} style={frame} role={label ? 'img' : undefined} aria-label={label || undefined}>
      <img src={`/mascot/bar-${mood}.svg`} alt="" draggable={false} style={img} />
      {blink && mood === 'happy' && <img src="/mascot/bar-blink.svg" alt="" draggable={false} className="blink opacity-0" style={img} />}
    </span>
  )
}
