# In-app feedback form — how it's wired

**Live and collecting.** The app has a `Give feedback` CTA in the footer and a
prompt that appears bottom-right after 45 seconds. Both open a short modal
styled like the rest of the desk; answers POST straight to the Google Form.

- Form: https://forms.gle/f3ZH4cme3Uk7kLE47
- Form id: `1FAIpQLSdneGODdpJYTBr7GWGt6YYWMl86m_13WkFRIyPgDBJZ43lIgg`
- Wiring: `frontend/src/lib/feedback.ts`
- Verified 2026-07-30 with a live submission (HTTP 200, row landed).

## The mapping

| # | Question | Entry id | Type | Required | Values the app sends |
|---|---|---|---|---|---|
| 1 | How long have you been in crypto? | `entry.1271786998` | multiple choice | **yes** | `< 1 year` · `1-3 years` · `+3 years` |
| 2 | Was the 0–100 score clear? | `entry.2033865039` | multiple choice | no | `1` … `5` |
| 3 | Would you check this before a trade? | `entry.182064027` | multiple choice | **yes** | `yes` · `sometimes` · `No` |
| 4 | What's missing? | `entry.22660724` | short answer | **yes** | free text |
| 5 | Anything confusing or broken? | `entry.752842110` | short answer | no | free text |

## ⚠️ The rule that keeps it working

Three questions are **multiple choice**, which accepts an exact option string and
rejects anything else, and three are **required**. The browser posts `no-cors`,
so a rejection is invisible — the visitor sees "sent" and the answer is gone.

Measured on the live form:

```
correct values           → HTTP 200, row created
"yes, daily" on Q3       → HTTP 400, silently discarded
```

So: **if you rename an option or flip a required toggle in Google Forms, change
`FeedbackModal.tsx` in the same commit.** The app currently mirrors both — the
send button stays disabled until Q1, Q3 and Q4 are answered, and the chip
`value`s match the option strings character for character (note Q3's capital
`No`, and Q1's plain hyphen in `1-3 years`).

Re-verify after any form edit:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST \
  "https://docs.google.com/forms/d/e/1FAIpQLSdneGODdpJYTBr7GWGt6YYWMl86m_13WkFRIyPgDBJZ43lIgg/formResponse" \
  --data-urlencode "entry.1271786998=1-3 years" \
  --data-urlencode "entry.182064027=yes" \
  --data-urlencode "entry.22660724=verification row - delete me"
```

`200` = accepted. `400` = you just broke the form.

To re-read the ids after adding a question, download the form page and parse
`FB_PUBLIC_LOAD_DATA_` (the script in `scratchpad/parse_form.py` does exactly
this), or use ⋮ → **Get pre-filled link**.

## Where the answers land

1. **Form → Responses tab** — summary charts per question.
2. **Google Sheets** — click the green Sheets icon in that tab once. Creates a
   linked spreadsheet, one row per submission with a timestamp, live. This is
   where to actually work.
3. **Email per response** — Responses → ⋮ → *Get email notifications for new
   responses*. Worth having on for the first week, while early testers are still
   reachable.

## Two things worth fixing when you get a minute

- **No contact question.** There's no way to reach a tester who writes something
  brilliant. Add a `Contact (optional)` short-answer question, send me the new
  entry id, and I'll add the field back to the modal — it's already designed.
- **Q1 and Q3 are marked required.** That's why the app now blocks sending until
  they're answered. Making them optional in Google Forms would let someone fire
  off a one-line "add alerts" and leave, which is usually the feedback you most
  want. Your call — tell me and I'll relax the app side to match.

## Behaviour notes

- The corner prompt waits 45s on purpose: asking "what's missing?" before someone
  has read a single score returns noise. Dismissing or sending writes
  `signaldesk.feedback.v1` to localStorage, so nobody is asked twice.
- Anonymous for real — no sign-in, no email collection, and the POST goes
  browser → Google directly, so your own backend never sees the visitor.
- `?feedback=preview` on any URL (and `npm run dev` always) renders the flow
  with answers logged to the console instead of submitted.

## Reading the results

Q4 is the one that pays for all of this. Tally it by theme rather than reading it
as a list — five people asking for "alerts when a score crosses" in five
phrasings is one feature, and it's your roadmap.

Q2 is a messaging check, not a UX score: averaging below 4 means the score's
*purpose* isn't landing in the first ten seconds, which is a copy fix on the
dashboard, not a feature request.
