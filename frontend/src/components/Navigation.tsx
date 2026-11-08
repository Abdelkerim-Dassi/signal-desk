import { useState } from 'react'
import { LANGS, useI18n } from '../lib/i18n'
import { effectiveTheme, setTheme } from '../lib/prefs'
import { PHONE_MORE, PHONE_TABS, VIEWS } from '../lib/views'
import type { View } from '../lib/views'
import { IconHelp, IconMore, IconMoon, IconSun } from './Icons'
import { LearnKaratPip } from './LearnBadge'
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
        <nav className="ms-3 hidden items-center gap-0.5 md:flex lg:ms-6 lg:gap-1" aria-label="Main">
          {VIEWS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onView(id)}
              aria-current={view === id ? 'page' : undefined}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium whitespace-nowrap transition lg:px-3.5 ${
                view === id ? 'bg-text text-bg' : 'text-muted hover:bg-subtle hover:text-text'
              }`}
            >
              {t(label)}
              {id === 'learn' && <LearnKaratPip size="xs" />}
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
  const [moreOpen, setMoreOpen] = useState(false)
  const inMore = PHONE_MORE.some((v) => v.id === view)
  const pick = (id: View) => {
    setMoreOpen(false)
    onView(id)
  }
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      aria-label="Main"
    >
      {moreOpen && (
        <>
          <button
            className="fixed inset-0 -z-10 cursor-default"
            aria-label={t('nav.more')}
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute end-3 bottom-full mb-2 min-w-44 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            {PHONE_MORE.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => pick(id)}
                aria-current={view === id ? 'page' : undefined}
                className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium transition hover:bg-subtle ${
                  view === id ? 'text-gold' : 'text-text'
                }`}
              >
                <Icon className="text-lg" />
                {t(label)}
              </button>
            ))}
          </div>
        </>
      )}
      <div className="mx-auto grid max-w-md" style={{ gridTemplateColumns: `repeat(${PHONE_TABS.length + 1}, minmax(0, 1fr))` }}>
        {PHONE_TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => pick(id)}
            aria-current={view === id ? 'page' : undefined}
            className={`flex cursor-pointer flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition ${
              view === id ? 'text-gold' : 'text-muted'
            }`}
          >
            <span className="relative">
              <Icon className="text-[22px]" />
              {id === 'learn' && (
                <span className="absolute -top-1.5 left-3.5">
                  <LearnKaratPip size="xs" />
                </span>
              )}
            </span>
            {t(label)}
          </button>
        ))}
        <button
          onClick={() => setMoreOpen((open) => !open)}
          aria-expanded={moreOpen}
          className={`flex cursor-pointer flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition ${
            inMore || moreOpen ? 'text-gold' : 'text-muted'
          }`}
        >
          <IconMore className="text-[22px]" />
          {t('nav.more')}
        </button>
      </div>
    </nav>
  )
}
