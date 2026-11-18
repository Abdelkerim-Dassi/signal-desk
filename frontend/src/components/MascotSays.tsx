import type { ReactNode } from 'react'
import Mascot from './brand/Mascot'
import type { Mood } from './brand/Mascot'

/** The gold bar saying one thing: a bubble, and the bar on its sun.
 *  The sun is not decoration: it keeps the bar off a dark page (dark theme).
 *  With no children the bar stands alone. */
export default function MascotSays({
  mood = 'happy',
  size = 92,
  children,
  className = '',
}: {
  mood?: Mood
  /** width of the bar; the sun is a little wider */
  size?: number
  children?: ReactNode
  className?: string
}) {
  const sun = Math.round(size * 1.26)
  return (
    <div className={`flex items-end gap-2.5 ${className}`}>
      {/* raised so the bubble's tail points at the bar's face, as in the videos */}
      {children != null && children !== '' && children !== false && (
        <div className="bubble min-w-0 flex-1 text-[15px]" style={{ marginBottom: Math.round(sun * 0.3) }}>
          {children}
        </div>
      )}
      <span className="relative ms-auto grid shrink-0 place-items-center" style={{ width: sun, height: sun }} aria-hidden>
        <span className="absolute inset-0 rounded-full bg-marker" />
        <Mascot mood={mood} size={size} className="relative translate-y-1" />
      </span>
    </div>
  )
}
