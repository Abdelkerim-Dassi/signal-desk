/**
 * Section header in the desk idiom: title, a hairline rule, and an optional
 * right-aligned mono meta that carries real information (a count, a source,
 * a legend) — never decoration.
 */
export default function DeskHead({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="font-display text-sm font-semibold tracking-widest text-teal uppercase">
        {title}
      </h2>
      <span className="h-px min-w-4 flex-1 bg-line" aria-hidden />
      {meta && <span className="tick-label shrink-0 !tracking-wider">{meta}</span>}
    </div>
  )
}
