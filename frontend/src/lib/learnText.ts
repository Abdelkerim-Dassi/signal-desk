// What the Learn screens share: how they read their strings.

import { useI18n } from './i18n'
import { LEARN_UI } from './lessons'
import type { LearnKey, Text } from './lessons'

export function useLearnText() {
  const { lang } = useI18n()
  // keep «الـ» / «بـ» on the same line as the Latin word after them
  const glue = (s: string) => (lang === 'ar' ? s.replace(/\u0640 /g, '\u0640\u00a0') : s)
  const tx = (x: Text) => glue(x[lang])
  const lt = (key: LearnKey, vars?: Record<string, string | number>) => {
    let s: string = LEARN_UI[key][lang]
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
    return glue(s)
  }
  return { lang, tx, lt }
}
