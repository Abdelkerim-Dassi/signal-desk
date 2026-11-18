// What the Learn screens share: how they read their strings.

import { useI18n } from './i18n'
import { LEARN_UI } from './lessons'
import { glue as glueText } from './typo'
import type { LearnKey, Text } from './lessons'

export function useLearnText() {
  const { lang } = useI18n()
  // no line break before French punctuation, nor after «الـ» / «بـ» (lib/typo.ts)
  const glue = (s: string) => glueText(s, lang)
  const tx = (x: Text) => glue(x[lang])
  const lt = (key: LearnKey, vars?: Record<string, string | number>) => {
    let s: string = LEARN_UI[key][lang]
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
    return glue(s)
  }
  return { lang, tx, lt }
}
