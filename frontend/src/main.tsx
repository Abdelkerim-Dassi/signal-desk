import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { inject } from '@vercel/analytics'
import './index.css'
import App from './App'
import I18nProvider from './components/I18nProvider'
import { applySavedTheme } from './lib/prefs'

applySavedTheme()
// Vercel Web Analytics: page views and visitors, no cookies
inject()

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <App />
      </I18nProvider>
    </QueryClientProvider>
  </StrictMode>,
)
