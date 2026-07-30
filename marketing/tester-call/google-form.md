# In-app feedback form — setup (10 minutes, once)

The app already has the form built in: a `30-second feedback` modal styled like the
rest of the desk, opened from a footer link and from a prompt that appears in the
bottom corner after 45 seconds. It posts answers straight to a Google Form.

Until you paste the two ids below, **every feedback entry point stays hidden** —
so this is safe to deploy right now.

---

## 1. Create the Google Form

New form → title **SignalDesk — what's missing?**

Add these six questions **in this order**. Types matter:

| # | Question | Type | Required |
|---|---|---|---|
| 1 | How long have you been in crypto? | Short answer | no |
| 2 | Was the 0–100 score clear? (1–5) | Short answer | no |
| 3 | Would you check this before a trade? | Short answer | no |
| 4 | What's missing? | Paragraph | no |
| 5 | Anything confusing or broken? | Paragraph | no |
| 6 | Contact (optional) | Short answer | no |

> ⚠️ **Use Short answer / Paragraph for all six — not multiple choice.**
> The app sends values as plain strings. A multiple-choice question rejects
> anything that isn't an exact option match, and because the browser posts
> `no-cors` the rejection is invisible — the visitor sees "sent" and the answer
> is gone. Text fields accept anything.
>
> Leave every question **not required** too. The app enforces its own rule (only
> "What's missing?" is mandatory); a required field the app leaves blank kills
> the whole submission silently.

In **Settings**:
- **Collect email addresses → Off** (this is the anonymous part)
- **Limit to 1 response → Off** (it would force a Google sign-in)
- Responses → **Link to Sheets** so answers land in a spreadsheet

## 2. Grab the ids

Send → 🔗 link → copy. You get:

```
https://docs.google.com/forms/d/e/1FAIpQLSd..................../viewform
                                  └──────── this is the FORM_ID ────────┘
```

Now the per-question ids — use the prefill trick, no page-source digging:

1. In the form editor: **⋮ (top right) → Get pre-filled link**
2. Type a throwaway value into every one of the six questions — `1`, `2`, `3`, `4`, `5`, `6` works and makes the next step obvious
3. **Get link → Copy link**. You'll get something like:

```
...viewform?usp=pp_url&entry.1234567890=1&entry.2345678901=2&entry.3456789012=3
            &entry.4567890123=4&entry.5678901234=5&entry.6789012345=6
```

Each `entry.NNNN` is one question, **in the order you added them**.

## 3. Paste them in

`frontend/src/lib/feedback.ts`, top of the file:

```ts
export const FEEDBACK = {
  formId: '1FAIpQLSd....................',
  entries: {
    experience: 'entry.1234567890',   // Q1 — how long in crypto
    clarity:    'entry.2345678901',   // Q2 — was the score clear
    wouldUse:   'entry.3456789012',   // Q3 — check before a trade
    missing:    'entry.4567890123',   // Q4 — what's missing
    friction:   'entry.5678901234',   // Q5 — confusing or broken
    contact:    'entry.6789012345',   // Q6 — contact
  },
}
```

Keep the `entry.` prefix. These aren't secrets — they're in the public form's own
HTML — so committing them is fine.

## 4. Verify before you promote it

Non-negotiable, because failures here are silent:

```powershell
cd frontend; npm run dev
```

Open the app, click **tell me what's missing** in the footer, fill it in, send —
then check the linked sheet. One row, six columns, values in the right columns.
If a column is empty or shifted, an entry id is on the wrong key.

Then `npm run build` and deploy.

---

## How it behaves

- **Footer link** — always visible, low-key: *"Testing this? tell me what's missing — 30 seconds, anonymous."*
- **Corner prompt** — appears after 45s (`FeedbackPrompt delayMs`). Deliberately delayed: asking "what's missing?" before someone has read a single score gets you noise. Dismissing it or sending sets `signaldesk.feedback.v1` in localStorage, so nobody gets nagged twice.
- **Anonymous for real** — no sign-in, no email field unless they volunteer one, and the POST goes browser → Google directly, so your own backend never sees the visitor at all.
- Only *"What's missing?"* is required. Every other field is one tap or skippable — that's what keeps completion high.

## Reading the answers

The one question that pays for the whole thing is **Q4**. Tally it by theme rather
than reading it as a list — five people asking for "alerts when a score crosses"
in five different phrasings is one feature, and it's your roadmap.

Q2 is your messaging check, not a UX score: if clarity is averaging below 4, the
problem is that the score's *purpose* isn't landing in the first 10 seconds, which
is a copy fix on the dashboard, not a feature.
