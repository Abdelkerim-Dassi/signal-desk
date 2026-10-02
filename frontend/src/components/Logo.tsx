import { useId } from 'react'

/** The Qirat mark: a cut gem — a karat grades gold, Qirat grades coins. */
export function GemMark({ size = 28 }: { size?: number }) {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3cf7a" />
          <stop offset="55%" stopColor="#d4a03a" />
          <stop offset="100%" stopColor="#9a6b14" />
        </linearGradient>
      </defs>
      <path d="M9 5h14l6 8-13 15L3 13l6-8Z" fill={`url(#${id}-g)`} />
      <path
        d="M3 13h26M9 5l4 8 3-8 3 8 4-8M13 13l3 15 3-15"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.55"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Logo() {
  return (
    <span className="flex items-center gap-2" dir="ltr">
      <GemMark />
      <span className="text-xl font-semibold tracking-tight">qirat</span>
    </span>
  )
}
