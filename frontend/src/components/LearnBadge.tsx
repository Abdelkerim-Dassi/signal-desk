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

const INGOT: Record<UserKarat, string> = {
  24: 'bg-[linear-gradient(140deg,#FFE58A,#F5B52A)] text-[#5A3A00]',
  22: 'bg-[linear-gradient(140deg,#FFEDB0,#F7C557)] text-[#5A3A00]',
  18: 'bg-[linear-gradient(140deg,#FFF3CF,#F2D48C)] text-[#6B4A08]',
  14: 'bg-[linear-gradient(140deg,#FBF5E6,#EADDBB)] text-[#6B4A08]',
  10: 'bg-[linear-gradient(140deg,#F4F0E6,#DCD3BF)] text-[#5b5546]',
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
      className={`num inline-grid shrink-0 place-items-center font-bold shadow-[inset_0_-2px_0_rgba(0,0,0,0.08)] ${INGOT[karat]} ${dims}`}
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
