import type { ComponentType, SVGProps } from 'react'
import { IconAsk, IconRecord, IconToday, IconWallet } from '../components/Icons'
import { IconLearn } from '../components/LearnBadge'
import type { UIKey } from './i18n'

export type View = 'today' | 'record' | 'ask' | 'portfolio' | 'learn'

export const VIEWS: { id: View; label: UIKey; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { id: 'today', label: 'nav.today', Icon: IconToday },
  { id: 'record', label: 'nav.record', Icon: IconRecord },
  { id: 'learn', label: 'nav.learn', Icon: IconLearn },
  { id: 'ask', label: 'nav.ask', Icon: IconAsk },
  { id: 'portfolio', label: 'nav.portfolio', Icon: IconWallet },
]
