import Mascot from './brand/Mascot'

/** The Qirat mascot as a small mark: a little 24K gold bar. A karat grades gold, Qirat grades coins. */
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
    <span className="flex items-center gap-1.5" dir="ltr">
      <Mascot mood="wink" size={38} />
      <span className="font-poster text-[1.9rem] leading-none">qirat</span>
    </span>
  )
}
