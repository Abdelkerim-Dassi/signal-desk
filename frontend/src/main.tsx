import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { inject } from '@vercel/analytics'
import './index.css'
import App from './App'
import CrashGuard from './components/CrashGuard'
import I18nProvider from './components/I18nProvider'
import { applySavedTheme } from './lib/prefs'
import { isOwner, ownerSwitchAtLoad } from './lib/source'

applySavedTheme()
// Vercel Web Analytics: page views and visitors, no cookies.
// A browser marked as ours (qirat.tn/#own-on) sends none; the switch is read
// here, before the first page view can leave.
ownerSwitchAtLoad()
inject({ beforeSend: (event) => (isOwner() ? null : event) })

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
