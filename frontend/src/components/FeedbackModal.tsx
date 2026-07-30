import { useEffect, useState } from 'react'
import {
  feedbackFormUrl,
  feedbackHandled,
  feedbackPreview,
  feedbackVisible,
  markFeedbackHandled,
  submitFeedback,
  type FeedbackAnswers,
} from '../lib/feedback'

/* Values are sent verbatim to the Google Form, so keep every question there a
   short-answer field — a multiple-choice question silently rejects anything
   that isn't an exact option match. See lib/feedback.ts. */
const EXPERIENCE = ['just curious', 'under 1 year', '1–3 years', '3+ years']
const CLARITY = ['1/5', '2/5', '3/5', '4/5', '5/5']
const WOULD_USE = ['yes, daily', 'sometimes', 'no']

const EMPTY: FeedbackAnswers = {
  experience: '',
  clarity: '',
  wouldUse: '',
  missing: '',
  friction: '',
  contact: '',
}

function Chips({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  ariaLabel: string
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="mt-2 flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={active}
            // tapping the active chip clears it — every quick question is optional
            onClick={() => onChange(active ? '' : o)}
            className={`num cursor-pointer rounded-md border px-3 py-1.5 text-xs transition ${
              active
                ? 'border-line-2 bg-teal/12 text-teal'
                : 'border-line text-mute hover:border-line-2 hover:text-fg'
            }`}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="font-display text-sm font-semibold tracking-wide text-fg">{label}</p>
      {hint && <p className="tick-label mt-0.5">{hint}</p>}
      {children}
    </div>
  )
}

const textareaClass =
  'mt-2 w-full resize-none rounded-md border border-line bg-panel-2 px-3 py-2 text-[13px] leading-relaxed text-fg outline-none transition placeholder:text-mute/70 focus:border-line-2'

export default function FeedbackModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [answers, setAnswers] = useState<FeedbackAnswers>(EMPTY)
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // reset a moment after closing, so the form doesn't visibly wipe mid-fade
  useEffect(() => {
    if (open) return
    const t = window.setTimeout(() => {
      setAnswers(EMPTY)
      setState('idle')
    }, 300)
    return () => window.clearTimeout(t)
  }, [open])

  if (!open) return null

  const set = (patch: Partial<FeedbackAnswers>) => setAnswers((a) => ({ ...a, ...patch }))
  const canSend = answers.missing.trim().length > 2 && state !== 'sending'

  async function send() {
    setState('sending')
    try {
      await submitFeedback(answers)
      // in preview the prompt should keep coming back, so you can retest it
      if (!feedbackPreview) markFeedbackHandled('sent')
      setState('sent')
    } catch {
      setState('error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-ink/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Send anonymous feedback"
    >
      <div
        className="glass rise max-h-[88vh] w-full max-w-xl overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-wide">
              Give <span className="text-teal">feedback</span>
            </h2>
            <p className="tick-label mt-1">
              30 seconds · anonymous · no sign-in · nothing stored about you
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close feedback"
            className="cursor-pointer rounded-md border border-line px-2.5 py-1 text-sm text-mute transition hover:border-line-2 hover:text-fg"
          >
            ×
          </button>
        </div>

        {state === 'sent' ? (
          <div className="py-10 text-center">
            <p className="font-display text-2xl font-semibold tracking-wide text-teal">sent ✦</p>
            <p className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-mute">
              {feedbackPreview ? (
                <>
                  This is the screen a tester sees. Nothing was actually sent — open the browser
                  console to see the payload Google would have received.
                </>
              ) : (
                <>
                  That genuinely changes what gets built next. If you left a contact, you'll hear
                  when your suggestion ships.
                </>
              )}
            </p>
            <button
              onClick={onClose}
              className="glass mt-6 cursor-pointer px-5 py-2 font-display text-xs font-semibold tracking-widest text-teal uppercase transition hover:border-line-2"
            >
              back to the desk
            </button>
          </div>
        ) : (
          <>
            {feedbackPreview && (
              <p className="mt-4 rounded-md border border-hold/40 bg-hold/10 px-3 py-2 text-[12px] leading-relaxed text-hold">
                <b className="font-semibold">Preview.</b> No Google Form is connected yet, so
                answers go to the browser console instead of a spreadsheet. Testers never see this
                banner — in production the whole form stays hidden until it's wired up.
              </p>
            )}

            <div className="mt-5 space-y-5">
              <Field label="How long have you been in crypto?">
                <Chips
                  options={EXPERIENCE}
                  value={answers.experience}
                  onChange={(experience) => set({ experience })}
                  ariaLabel="How long have you been in crypto?"
                />
              </Field>

              <Field label="Was the 0–100 score clear?" hint="1 = no idea what it meant · 5 = obvious">
                <Chips
                  options={CLARITY}
                  value={answers.clarity}
                  onChange={(clarity) => set({ clarity })}
                  ariaLabel="Was the score clear?"
                />
              </Field>

              <Field label="Would you check this before a trade?">
                <Chips
                  options={WOULD_USE}
                  value={answers.wouldUse}
                  onChange={(wouldUse) => set({ wouldUse })}
                  ariaLabel="Would you check this before a trade?"
                />
              </Field>

              <Field label="What's missing?" hint="the only question that really matters — required">
                <textarea
                  value={answers.missing}
                  onChange={(e) => set({ missing: e.target.value })}
                  rows={3}
                  maxLength={1200}
                  placeholder="What would make you open this every day? Alerts, entry/exit levels, more coins, a track record…"
                  className={textareaClass}
                />
              </Field>

              <Field label="Anything confusing or broken?" hint="optional">
                <textarea
                  value={answers.friction}
                  onChange={(e) => set({ friction: e.target.value })}
                  rows={2}
                  maxLength={1200}
                  placeholder="Brutal honesty preferred."
                  className={textareaClass}
                />
              </Field>

              <Field label="Contact" hint="optional — leave blank to stay fully anonymous">
                <input
                  value={answers.contact}
                  onChange={(e) => set({ contact: e.target.value })}
                  maxLength={160}
                  placeholder="email or @handle"
                  className={textareaClass.replace('resize-none ', '')}
                />
              </Field>
            </div>

            {state === 'error' && (
              <p className="mt-4 text-[13px] text-sell">
                Couldn't send — check your connection and try again
                {feedbackFormUrl && (
                  <>
                    , or{' '}
                    <a
                      href={feedbackFormUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-fg"
                    >
                      open the form directly
                    </a>
                  </>
                )}
                .
              </p>
            )}

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-4">
              <p className="text-[11px] leading-relaxed text-mute">
                Goes to a Google Form. No account, no email required.
              </p>
              <button
                onClick={send}
                disabled={!canSend}
                className="cursor-pointer rounded-lg bg-teal px-5 py-2 font-display text-xs font-bold tracking-widest text-ink uppercase transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {state === 'sending' ? 'sending…' : 'send'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * A quiet nudge in the bottom corner. Held back for a while on purpose —
 * asking "what's missing?" before someone has read a single score gets you
 * nothing useful. Shows once per visitor until they answer or dismiss it.
 */
export function FeedbackPrompt({
  onOpen,
  // short in preview so you don't sit waiting to see it
  delayMs = feedbackPreview ? 4_000 : 45_000,
}: {
  onOpen: () => void
  delayMs?: number
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!feedbackVisible || feedbackHandled()) return
    const t = window.setTimeout(() => setShow(true), delayMs)
    return () => window.clearTimeout(t)
  }, [delayMs])

  if (!show) return null

  return (
    <div className="rise fixed right-4 bottom-4 z-40 flex max-w-[calc(100vw-2rem)] items-stretch gap-px overflow-hidden rounded-xl shadow-[0_16px_50px_-12px_rgba(94,234,212,0.55)]">
      <button
        onClick={() => {
          setShow(false)
          onOpen()
        }}
        // same glow + sheen as the header's "How to use" CTA — this is the one
        // thing we actively want a visitor to notice
        className="guide-cta flex cursor-pointer items-center gap-2.5 bg-teal px-5 py-3.5 font-display text-base font-bold tracking-widest text-ink uppercase transition sm:text-lg"
      >
        <span aria-hidden className="text-lg leading-none">✎</span>
        Give feedback
      </button>
      <button
        onClick={() => {
          markFeedbackHandled('dismissed')
          setShow(false)
        }}
        aria-label="Dismiss feedback prompt"
        className="cursor-pointer bg-teal px-3 text-lg text-ink/50 transition hover:text-ink"
      >
        ×
      </button>
    </div>
  )
}
