// Per-device conveniences: theme and the user's watchlist/holdings. Browser
// storage can be blocked (private mode, previews), so every access is guarded
// and the app works without it.

import type { AdvisorConfig } from '../hooks/useBrief'

const THEME_KEY = 'qirat.theme'
const CONFIG_KEY = 'qirat.config.v1'

export type Theme = 'light' | 'dark'

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // not persisted; fine for this visit
  }
}

export function effectiveTheme(): Theme {
  const attr = document.documentElement.dataset.theme
  if (attr === 'light' || attr === 'dark') return attr
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Apply a saved explicit theme on boot; with none saved, the system preference rules. */
export function applySavedTheme(): void {
  const saved = read(THEME_KEY)
  if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  write(THEME_KEY, theme)
}

export function loadConfig(fallback: AdvisorConfig): AdvisorConfig {
  const raw = read(CONFIG_KEY)
  if (!raw) return fallback
  try {
    const saved = JSON.parse(raw) as Partial<AdvisorConfig>
    return {
      ...fallback,
      marketSource: typeof saved.marketSource === 'string' ? saved.marketSource : fallback.marketSource,
      quoteAsset: typeof saved.quoteAsset === 'string' ? saved.quoteAsset : fallback.quoteAsset,
      assetsRaw: typeof saved.assetsRaw === 'string' && saved.assetsRaw.trim() ? saved.assetsRaw : fallback.assetsRaw,
      holdings: Array.isArray(saved.holdings) ? saved.holdings : fallback.holdings,
    }
  } catch {
    return fallback
  }
}

export function saveConfig(config: AdvisorConfig): void {
  const { marketSource, quoteAsset, assetsRaw, holdings } = config
  write(CONFIG_KEY, JSON.stringify({ marketSource, quoteAsset, assetsRaw, holdings }))
}
