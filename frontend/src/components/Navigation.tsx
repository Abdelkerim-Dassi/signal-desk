import { useState } from 'react'
import { LANGS, useI18n } from '../lib/i18n'
import { effectiveTheme, setTheme } from '../lib/prefs'
import { PHONE_MORE, PHONE_TABS, VIEWS } from '../lib/views'
import type { View } from '../lib/views'
import { IconHelp, IconMore, IconMoon, IconSun } from './Icons'
import { LearnKaratPip } from './LearnBadge'
import Logo from './Logo'

const iconButton =
  'link grid size-10 cursor-pointer place-items-center rounded-xl text-xl text-muted transition hover:bg-subtle hover:text-text'

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
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-2 px-4 md:px-6">
        <button onClick={() => onView('home')} className="link cursor-pointer rounded-xl" aria-label="Qirat">
          <Logo />
        </button>

        {/* desktop tabs; phones use the bottom bar. The logo is the way home. */}
        <nav className="ms-3 hidden items-center gap-0.5 md:flex lg:ms-6 lg:gap-1" aria-label="Main">
          {VIEWS.filter((v) => v.id !== 'home').map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onView(id)}
              aria-current={view === id ? 'page' : undefined}
              className={`link flex cursor-pointer items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-semibold whitespace-nowrap transition lg:px-3.5 ${
                view === id ? 'bg-marker text-on-marker' : 'text-muted hover:bg-subtle hover:text-text'
              }`}
            >
              {t(label)}
              {id === 'learn' && <LearnKaratPip size="xs" />}
            </button>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-0.5">
          <div className="flex gap-0.5" role="group" aria-label={t('top.language')}>
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                aria-pressed={lang === l.code}
                title={l.label}
                className={`link min-w-9 cursor-pointer rounded-[10px] px-2 py-2 text-center text-[13px] font-semibold transition ${
                  lang === l.code ? 'bg-text text-bg' : 'text-muted hover:text-text'
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

const tabClass = (on: boolean) =>
  `link grid cursor-pointer justify-items-center gap-0.5 rounded-xl py-1 text-[11.5px] font-semibold transition ${on ? 'text-text' : 'text-muted'}`
// the tab you are on: its icon sits on a dab of the gold marker
const blobClass = (on: boolean) => `relative grid h-8 w-[46px] place-items-center rounded-xl text-[25px] ${on ? 'bg-marker text-on-marker' : ''}`

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
      className="fixed inset-x-0 bottom-0 z-40 bg-bg pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_0_rgba(21,23,28,.1)] md:hidden"
      aria-label="Main"
    >
      {moreOpen && (
        <>
          <button className="fixed inset-0 -z-10 cursor-default" aria-label={t('nav.more')} onClick={() => setMoreOpen(false)} />
          <div className="absolute end-3 bottom-full mb-2 min-w-48 overflow-hidden rounded-2xl bg-card shadow-[0_14px_30px_-12px_rgba(60,40,5,.5)]">
            {PHONE_MORE.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => pick(id)}
                aria-current={view === id ? 'page' : undefined}
                className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-[15px] font-semibold transition hover:bg-subtle ${
                  view === id ? 'bg-marker text-on-marker' : 'text-text'
                }`}
              >
                <Icon className="text-xl" />
                {t(label)}
              </button>
            ))}
          </div>
        </>
      )}
      <div className="mx-auto grid max-w-md px-2 py-2" style={{ gridTemplateColumns: `repeat(${PHONE_TABS.length + 1}, minmax(0, 1fr))` }}>
        {PHONE_TABS.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => pick(id)} aria-current={view === id ? 'page' : undefined} className={tabClass(view === id)}>
            <span className={blobClass(view === id)}>
              <Icon />
              {id === 'learn' && (
                <span className="absolute -top-1.5 left-7 text-base">
                  <LearnKaratPip size="xs" />
                </span>
              )}
            </span>
            {t(label)}
          </button>
        ))}
        <button onClick={() => setMoreOpen((open) => !open)} aria-expanded={moreOpen} className={tabClass(inMore || moreOpen)}>
          <span className={blobClass(inMore || moreOpen)}>
            <IconMore />
          </span>
          {t('nav.more')}
        </button>
      </div>
    </nav>
  )
}
