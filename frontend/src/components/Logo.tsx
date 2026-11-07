/** The Qirat mascot: a little 24K gold bar. A karat grades gold, Qirat grades coins. */
export function GemMark({ size = 28 }: { size?: number }) {
  return (
    <img
      src="/qirat-mark.png"
      width={size}
      height={size}
      alt=""
      aria-hidden
      draggable={false}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}

export default function Logo() {
  return (
    <span className="flex items-center gap-2" dir="ltr">
      <GemMark size={34} />
      <span className="text-xl font-semibold tracking-tight">qirat</span>
    </span>
  )
}
