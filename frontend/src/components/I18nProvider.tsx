import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { I18nContext, initialLang, makeI18n, saveLang } from '../lib/i18n'
import type { Lang } from '../lib/i18n'
import { tidyAddress } from '../lib/route'

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  // A course or lesson address carries its language (lib/route.ts): keep the
  // address right when the page opens, when a link is followed, and when the
  // language is switched.
  useEffect(() => {
    const tidy = () => tidyAddress(lang)
    tidy()
    window.addEventListener('hashchange', tidy)
    return () => window.removeEventListener('hashchange', tidy)
  }, [lang])

  const value = useMemo(
    () =>
      makeI18n(lang, (next) => {
        setLangState(next)
        saveLang(next)
      }),
    [lang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
