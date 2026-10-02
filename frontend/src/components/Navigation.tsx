import { useState } from 'react'
import { LANGS, useI18n } from '../lib/i18n'
import { effectiveTheme, setTheme } from '../lib/prefs'
import { VIEWS } from '../lib/views'
import type { View } from '../lib/views'
import { IconHelp, IconMoon, IconSun } from './Icons'
import Logo from './Logo'

const iconButton =
  'grid size-9 cursor-pointer place-items-center rounded-full text-lg text-muted transition hover:bg-subtle hover:text-text'

export function TopBar({
  view,
  onView,
  onHelp,
}: {
  view: View
  onView: (v: View) => void
  onHelp: () => void
}) {
  const { t, lang, setLang } = useI18n()
  const [theme, setThemeState] = useState(effectiveTheme)
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setThemeState(next)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        <button onClick={() => onView('today')} className="cursor-pointer" aria-label="Qirat">
          <Logo />
        </button>

        {/* desktop tabs; phones use the bottom bar */}
        <nav className="ms-6 hidden items-center gap-1 md:flex" aria-label="Main">
          {VIEWS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onView(id)}
              aria-current={view === id ? 'page' : undefined}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                view === id ? 'bg-text text-bg' : 'text-muted hover:bg-subtle hover:text-text'
              }`}
            >
              {t(label)}
            </button>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-1">
          <div className="flex rounded-full bg-subtle p-0.5" role="group" aria-label={t('top.language')}>
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                aria-pressed={lang === l.code}
                title={l.label}
                className={`min-w-8 cursor-pointer rounded-full px-2 py-1 text-xs font-semibold transition ${
                  lang === l.code ? 'bg-card text-text shadow-sm' : 'text-muted hover:text-text'
                }`}
              >
                {l.short}
              </button>
            ))}
          </div>
          <button onClick={toggleTheme} className={iconButton} aria-label={t('top.theme')} title={t('top.theme')}>
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
          </button>
          <button onClick={onHelp} className={iconButton} aria-label={t('top.help')} title={t('top.help')}>
            <IconHelp />
          </button>
        </div>
      </div>
    </header>
  )
}

export function BottomNav({ view, onView }: { view: View; onView: (v: View) => void }) {
  const { t } = useI18n()
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      aria-label="Main"
    >
      <div className="mx-auto grid max-w-md grid-cols-4">
        {VIEWS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onView(id)}
            aria-current={view === id ? 'page' : undefined}
            className={`flex cursor-pointer flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition ${
              view === id ? 'text-gold' : 'text-muted'
            }`}
          >
            <Icon className="text-[22px]" />
            {t(label)}
          </button>
        ))}
      </div>
    </nav>
  )
}
