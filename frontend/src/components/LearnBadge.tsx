import type { SVGProps } from 'react'
import { useLearnProgress } from '../lib/learnProgress'
import type { UserKarat } from '../lib/learnProgress'

/** An open book, in the same stroke style as Icons.tsx. */
export const IconLearn = (p: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...p}
  >
    <path d="M12 6.5C10.3 5.2 7.9 4.6 4 4.8v13.4c3.9-.2 6.3.4 8 1.7 1.7-1.3 4.1-1.9 8-1.7V4.8c-3.9-.2-6.3.4-8 1.7Z" />
    <path d="M12 6.5v13.4" />
  </svg>
)

// The learner's gold, from dull at 10K to the videos' gold at 24K. Flat colours,
// the same on a light and a dark page: it is an object, not a surface.
const INGOT: Record<UserKarat, string> = {
  24: 'bg-[#f5a524] text-[#15171c]',
  22: 'bg-[#ffce54] text-[#15171c]',
  18: 'bg-[#fbdc80] text-[#4a3200]',
  14: 'bg-[#f6e6b4] text-[#5a3a00]',
  10: 'bg-[#e9e2d0] text-[#5b5546]',
}
const PUNCH: Record<UserKarat, { face: string; under: string }> = {
  24: { face: '#f5a524', under: '#b9740a' },
  22: { face: '#ffce54', under: '#d9981b' },
  18: { face: '#fbdc80', under: '#d6aa3c' },
  14: { face: '#f6e6b4', under: '#d3bd7c' },
  10: { face: '#e4dac1', under: '#b9ad8e' },
}

/** The learner's karat as a little gold ingot. */
export function UserKaratIngot({ karat, size = 'sm' }: { karat: UserKarat; size?: 'xs' | 'sm' | 'lg' }) {
  const dims =
    size === 'lg'
      ? 'h-16 min-w-20 rounded-2xl px-3 text-3xl'
      : size === 'sm'
        ? 'h-6 min-w-9 rounded-lg px-1.5 text-xs'
        : 'h-4 min-w-6 rounded-md px-1 text-[9px] leading-none'
  return (
    <span
      // the paper-coloured ring keeps it apart from the gold tab it sits on
      className={`num inline-grid shrink-0 place-items-center font-bold shadow-[0_0_0_1.5px_var(--color-bg),inset_0_-2px_0_rgba(0,0,0,0.1)] ${INGOT[karat]} ${dims}`}
      dir="ltr"
    >
      {karat}K
    </span>
  )
}

/** Small badge next to the Learn tab: the learner's current karat. */
export function LearnKaratPip({ size = 'sm' }: { size?: 'xs' | 'sm' }) {
  const { karat } = useLearnProgress()
  return <UserKaratIngot karat={karat} size={size} />
}

const OCTAGON = 'M29 3H71L97 29V71L71 97H29L3 71V29Z'

/** The learner's karat as a hallmark: the punch a goldsmith strikes into a bar.
 *  A face and an underside, like the buttons, so it reads as something to press. */
export function KaratHallmark({ karat, size = 84, className = '' }: { karat: UserKarat; size?: number; className?: string }) {
  const { face, under } = PUNCH[karat]
  return (
    <span className={`relative inline-grid shrink-0 place-items-center ${className}`} style={{ width: size, height: size * 1.07 }} dir="ltr">
      <svg viewBox="0 0 100 107" className="absolute inset-0 size-full" aria-hidden>
        <path d={OCTAGON} transform="translate(0 7)" fill={under} stroke={under} strokeWidth="6" strokeLinejoin="round" />
        <path d={OCTAGON} fill={face} stroke={face} strokeWidth="6" strokeLinejoin="round" />
        <path
          d="M33 12H67L88 33V67L67 88H33L12 67V33Z"
          fill="none"
          stroke="#15171c"
          strokeOpacity=".3"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="0.1 4.4"
        />
      </svg>
      <span className="poster relative text-[#15171c]" style={{ fontSize: size * 0.4, marginTop: -size * 0.04 }}>
        {karat}K
      </span>
    </span>
  )
}
