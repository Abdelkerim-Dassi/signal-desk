import type { ComponentType, SVGProps } from 'react'
import { IconPractice } from '../components/PracticeView'
import { IconAsk, IconRecord, IconShield, IconToday, IconWallet } from '../components/Icons'
import { IconLearn } from '../components/LearnBadge'
import type { UIKey } from './i18n'

export type View = 'today' | 'record' | 'ask' | 'portfolio' | 'practice' | 'learn' | 'scamcheck'

// The Track record tab is hidden since 2026-11-07: results are measured
// privately (the API answers only scheduled jobs). Build with
// VITE_PUBLIC_TRACK_RECORD=1 to bring the tab back.
const PUBLIC_RECORD = import.meta.env.VITE_PUBLIC_TRACK_RECORD === '1'

// Order = the beginner's path: see the market, learn, practise, stay safe,
// then ask or track your own coins.
export const VIEWS: { id: View; label: UIKey; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { id: 'today' as const, label: 'nav.today' as const, Icon: IconToday },
  { id: 'learn' as const, label: 'nav.learn' as const, Icon: IconLearn },
  { id: 'practice' as const, label: 'nav.practice' as const, Icon: IconPractice },
  { id: 'scamcheck' as const, label: 'nav.scamcheck' as const, Icon: IconShield },
  { id: 'ask' as const, label: 'nav.ask' as const, Icon: IconAsk },
  { id: 'portfolio' as const, label: 'nav.portfolio' as const, Icon: IconWallet },
  { id: 'record' as const, label: 'nav.record' as const, Icon: IconRecord },
].filter((v) => v.id !== 'record' || PUBLIC_RECORD)

/** The phone's bottom bar has room for four tabs plus "More"; the rest open from "More". */
const PHONE_PRIMARY: View[] = ['today', 'learn', 'practice', 'scamcheck']
export const PHONE_TABS = VIEWS.filter((v) => PHONE_PRIMARY.includes(v.id))
export const PHONE_MORE = VIEWS.filter((v) => !PHONE_PRIMARY.includes(v.id))
