import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { inject } from '@vercel/analytics'
import './index.css'
import App from './App'
import CrashGuard from './components/CrashGuard'
import I18nProvider from './components/I18nProvider'
import { takeKeepLink } from './lib/keep'
import { applySavedTheme } from './lib/prefs'
import { isOwner, ownerSwitchAtLoad } from './lib/source'

applySavedTheme()
// Vercel Web Analytics: page views and visitors, no cookies.
// A browser marked as ours (qirat.tn/#own-on) sends none; the switch is read
// here, before the first page view can leave. So is a "keep my wallet" link
// (qirat.tn/#keep-<id>): its id is a secret and must never be in a page view.
ownerSwitchAtLoad()
takeKeepLink()
inject({ beforeSend: (event) => (isOwner() ? null : { ...event, url: event.url.replace(/#keep-.*$/i, '') }) })

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CrashGuard>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <App />
        </I18nProvider>
      </QueryClientProvider>
    </CrashGuard>
  </StrictMode>,
)
