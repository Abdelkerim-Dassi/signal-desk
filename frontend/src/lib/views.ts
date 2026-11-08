import type { ComponentType, SVGProps } from 'react'
import { IconAsk, IconRecord, IconToday, IconWallet } from '../components/Icons'
import type { UIKey } from './i18n'

export type View = 'today' | 'record' | 'ask' | 'portfolio'

// The Track record tab is hidden since 2026-11-07: results are measured
// privately (the API answers only scheduled jobs). Build with
// VITE_PUBLIC_TRACK_RECORD=1 to bring the tab back.
const PUBLIC_RECORD = import.meta.env.VITE_PUBLIC_TRACK_RECORD === '1'

export const VIEWS: { id: View; label: UIKey; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { id: 'today' as const, label: 'nav.today' as const, Icon: IconToday },
  { id: 'record' as const, label: 'nav.record' as const, Icon: IconRecord },
  { id: 'ask' as const, label: 'nav.ask' as const, Icon: IconAsk },
  { id: 'portfolio' as const, label: 'nav.portfolio' as const, Icon: IconWallet },
].filter((v) => v.id !== 'record' || PUBLIC_RECORD)
