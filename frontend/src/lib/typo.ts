import type { Lang } from './i18n'

const NBSP = ' '

/** Keep a line from breaking where it should not, without changing a word:
 *  French puts a space before ? ! : ; and inside « », and that space must not
 *  start a new line ("C'est quoi la crypto" / "? On commence"). In Arabic,
 *  «الـ» and «بـ» stay with the Latin word after them. */
export function glue(text: string, lang: Lang): string {
  if (lang === 'fr') return text.replace(/ ([?!:;»])/g, `${NBSP}$1`).replace(/« /g, `«${NBSP}`)
  if (lang === 'ar') return text.replace(/ـ /g, `ـ${NBSP}`)
  return text
}
