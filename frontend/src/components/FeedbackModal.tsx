import { useEffect, useState } from 'react'
import {
  feedbackFormUrl,
  feedbackPreview,
  markFeedbackHandled,
  submitFeedback,
  type FeedbackAnswers,
} from '../lib/feedback'
import Caption from './brand/Caption'
import { IconX } from './Icons'
import MascotSays from './MascotSays'

/* ⚠️ `value` is posted verbatim to a multiple-choice question in the live Google
   Form, which accepts an exact option string and rejects everything else — and
   because we post `no-cors`, a rejection is invisible: the visitor sees "sent"
   and the answer is gone. If you rename an option in the form, rename the
   `value` here in the same commit. `label` is ours to style freely. */
const EXPERIENCE = [
  { label: '< 1 year', value: '< 1 year' },
  { label: '1–3 years', value: '1-3 years' },
  { label: '3+ years', value: '+3 years' },
]
const CLARITY = ['1', '2', '3', '4', '5'].map((v) => ({ label: v, value: v }))
const WOULD_USE = [
  { label: 'Yes', value: 'yes' },
  { label: 'Sometimes', value: 'sometimes' },
  { label: 'No', value: 'No' },
]

const EMPTY: FeedbackAnswers = {
  experience: '',
  clarity: '',
  wouldUse: '',
  missing: '',
  friction: '',
}

function Chips({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
  ariaLabel: string
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="mt-2.5 flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o.value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`link num min-w-11 cursor-pointer rounded-[10px] border-2 px-3.5 py-2 text-sm font-semibold transition ${
              // the answer you picked sits on the gold marker, like the tab you are on
              active ? 'border-candy bg-marker text-on-marker' : 'border-text/20 hover:border-text/50'
            }`}
          >
            {o.label}
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
      <p className="leading-snug font-semibold">{label}</p>
      {hint && <p className="mt-0.5 text-[13px] text-muted">{hint}</p>}
      {children}
    </div>
  )
}

const textareaClass =
  'mt-2.5 w-full resize-none rounded-[14px] border-2 border-text/15 bg-card px-3.5 py-2.5 text-[15px] leading-relaxed outline-none transition placeholder:text-muted/80 focus:border-text/60'

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
  // the three questions Google marks required — leave any blank and it rejects
  // the whole submission, silently (see lib/feedback.ts)
  const canSend =
    Boolean(answers.experience) &&
    Boolean(answers.wouldUse) &&
    answers.missing.trim().length > 2 &&
    state !== 'sending'

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
      className="fixed inset-0 z-[60] grid place-items-end bg-black/45 sm:place-items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Send anonymous feedback"
      // the form is in English only
      dir="ltr"
      lang="en"
    >
      {/* a sheet of the same paper as the page */}
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-[28px] bg-bg px-5 pt-5 pb-6 text-start shadow-2xl sm:rounded-[28px] sm:px-7 sm:pt-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <Caption text="Give [[feedback]]" className="text-[2.1rem]" />
            <p className="mt-1.5 text-sm text-muted">30 seconds. Anonymous, no sign-in, nothing stored about you.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close feedback"
            className="link -me-1.5 grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl text-xl text-muted transition hover:text-text"
          >
            <IconX />
          </button>
        </div>

        {state === 'sent' ? (
          <div className="pt-6 pb-2">
            <MascotSays mood="excited">
              {feedbackPreview ? (
                <>
                  Sent. This is the screen a tester sees. Nothing was actually sent: open the browser console to see the
                  payload Google would have received.
                </>
              ) : (
                <>
                  Sent. That genuinely changes what gets built next. If you left a contact, you'll hear when your
                  suggestion ships.
                </>
              )}
            </MascotSays>
            <button onClick={onClose} className="go go-sm mt-6 w-full">
              Back to Qirat
            </button>
          </div>
        ) : (
          <>
            {feedbackPreview && (
              <p className="mt-5 border-s-4 border-warn ps-3 text-[13px] leading-relaxed">
                <b className="font-semibold">Preview.</b> No Google Form is connected yet, so answers go to the browser
                console instead of a spreadsheet. Testers never see this note: in production the whole form stays
                hidden until it's wired up.
              </p>
            )}

            <div className="mt-6 space-y-6">
              <Field label="How long have you been in crypto?" hint="Required">
                <Chips
                  options={EXPERIENCE}
                  value={answers.experience}
                  onChange={(experience) => set({ experience })}
                  ariaLabel="How long have you been in crypto?"
                />
              </Field>

              <Field label="Was the 0–100 score clear?" hint="1 = no idea what it meant, 5 = obvious">
                <Chips
                  options={CLARITY}
                  value={answers.clarity}
                  onChange={(clarity) => set({ clarity })}
                  ariaLabel="Was the score clear?"
                />
              </Field>

              <Field label="Would you check this before a trade?" hint="Required">
                <Chips
                  options={WOULD_USE}
                  value={answers.wouldUse}
                  onChange={(wouldUse) => set({ wouldUse })}
                  ariaLabel="Would you check this before a trade?"
                />
              </Field>

              <Field label="What's missing?" hint="Required. The one that really matters.">
                <textarea
                  value={answers.missing}
                  onChange={(e) => set({ missing: e.target.value })}
                  rows={3}
                  maxLength={1200}
                  placeholder="What would make you open this every day? Alerts, entry/exit levels, more coins, a track record…"
                  className={textareaClass}
                />
              </Field>

              <Field label="Anything confusing or broken?" hint="Optional">
                <textarea
                  value={answers.friction}
                  onChange={(e) => set({ friction: e.target.value })}
                  rows={2}
                  maxLength={1200}
                  placeholder="Brutal honesty preferred."
                  className={textareaClass}
                />
              </Field>
            </div>

            {state === 'error' && (
              <p className="mt-5 text-sm text-down">
                Couldn't send. Check your connection and try again
                {feedbackFormUrl && (
                  <>
                    , or{' '}
                    <a href={feedbackFormUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-text">
                      open the form directly
                    </a>
                  </>
                )}
                .
              </p>
            )}

            <button onClick={send} disabled={!canSend} className="go go-sm mt-7 w-full disabled:cursor-not-allowed disabled:opacity-40">
              {state === 'sending' ? 'Sending…' : 'Send'}
            </button>
            <p className="mt-5 text-center text-[13px] text-muted">Goes to a Google Form. No account, no email required.</p>
          </>
        )}
      </div>
    </div>
  )
}
