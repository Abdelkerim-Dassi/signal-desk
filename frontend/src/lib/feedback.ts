/**
 * Anonymous in-app feedback, posted straight to a Google Form.
 *
 * The browser POSTs to Google's `formResponse` endpoint directly. Google sends
 * no CORS headers there, so the request goes out `no-cors`: the row lands in
 * the linked sheet, but we get back an opaque response we can't read. That's
 * the trade for having no backend, no database and no visitor data of our own —
 * the submission is genuinely anonymous, we never see an IP or a session.
 *
 * The cost of that opacity: a wrong entry id, or a value a multiple-choice
 * question rejects, fails SILENTLY. So keep every question in the Google Form a
 * short-answer/paragraph field (they accept any string), and after wiring the
 * ids up submit once for real and confirm the row appears.
 * Setup walkthrough: marketing/tester-call/google-form.md
 *
 * None of these ids are secrets — they're in the public form's own HTML.
 */
export const FEEDBACK = {
  /** From the form's share link: .../forms/d/e/<FORM_ID>/viewform */
  formId: '',
  /** The `entry.NNNNNNNNN` id of each question, in form order. */
  entries: {
    experience: '',
    clarity: '',
    wouldUse: '',
    missing: '',
    friction: '',
    contact: '',
  },
}

export interface FeedbackAnswers {
  experience: string
  clarity: string
  wouldUse: string
  missing: string
  friction: string
  contact: string
}

/** Until the ids are filled in, the app hides every feedback entry point. */
export const feedbackConfigured = Boolean(FEEDBACK.formId && FEEDBACK.entries.missing)

/**
 * Lets you look at and click through the form before any Google Form exists.
 * On in `npm run dev`, or on a deployed build with `?feedback=preview` in the
 * URL. Answers are logged to the console and go nowhere — which is exactly why
 * this can't turn itself on for real visitors in production.
 */
export const feedbackPreview =
  !feedbackConfigured &&
  (import.meta.env.DEV ||
    (typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('feedback') === 'preview'))

/** Whether to show the footer link and the corner prompt at all. */
export const feedbackVisible = feedbackConfigured || feedbackPreview

export const feedbackFormUrl = FEEDBACK.formId
  ? `https://docs.google.com/forms/d/e/${FEEDBACK.formId}/viewform`
  : ''

export async function submitFeedback(answers: FeedbackAnswers): Promise<void> {
  if (!feedbackConfigured) {
    if (!feedbackPreview) throw new Error('feedback form is not configured')
    // eslint-disable-next-line no-console
    console.info('[feedback preview] not sent — this is what Google would receive:', answers)
    await new Promise((r) => setTimeout(r, 500)) // so the sending state is visible
    return
  }

  const body = new URLSearchParams()
  for (const [key, entryId] of Object.entries(FEEDBACK.entries)) {
    const value = answers[key as keyof FeedbackAnswers]?.trim()
    if (entryId && value) body.append(entryId, value)
  }

  await fetch(`https://docs.google.com/forms/d/e/${FEEDBACK.formId}/formResponse`, {
    method: 'POST',
    mode: 'no-cors',
    // safelisted content type — no preflight, which `no-cors` forbids anyway
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
}

/**
 * Remembers that this visitor already answered (or waved it away) so the
 * prompt never nags twice. Wrapped because Safari private mode throws on
 * localStorage access.
 */
const STORAGE_KEY = 'signaldesk.feedback.v1'

export function feedbackHandled(): boolean {
  try {
    return Boolean(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return false
  }
}

export function markFeedbackHandled(how: 'sent' | 'dismissed'): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, how)
  } catch {
    /* private mode — the prompt just reappears next visit */
  }
}
