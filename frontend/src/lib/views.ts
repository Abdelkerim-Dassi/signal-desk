import type { ComponentType, SVGProps } from 'react'
import { IconPractice } from '../components/PracticeView'
import { IconHome, IconRecord, IconToday, IconWallet } from '../components/Icons'
import { IconLearn } from '../components/LearnBadge'
import type { UIKey } from './i18n'

// 'home' is the first screen (qirat.tn with nothing after it).
// 'replay' is the Time machine: it opens from the Practice screen (qirat.tn/#replay)
// and has no tab of its own, so it is not in VIEWS below.
// Asking Qirat is not a screen: it is the bubble on every screen (AskBubble).
// The Scam check screen was removed on 2026-11-20; its old link opens the first screen.
export type View = 'home' | 'today' | 'record' | 'portfolio' | 'practice' | 'replay' | 'learn'

// The Track record tab is hidden since 2026-11-07: results are measured
// privately (the API answers only scheduled jobs). Build with
// VITE_PUBLIC_TRACK_RECORD=1 to bring the tab back.
const PUBLIC_RECORD = import.meta.env.VITE_PUBLIC_TRACK_RECORD === '1'

// Order = the beginner's path: start, learn, practise, see the market, then
// track your own coins.
export const VIEWS: { id: View; label: UIKey; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { id: 'home' as const, label: 'nav.home' as const, Icon: IconHome },
  { id: 'learn' as const, label: 'nav.learn' as const, Icon: IconLearn },
  { id: 'practice' as const, label: 'nav.practice' as const, Icon: IconPractice },
  { id: 'today' as const, label: 'nav.today' as const, Icon: IconToday },
  { id: 'portfolio' as const, label: 'nav.portfolio' as const, Icon: IconWallet },
  { id: 'record' as const, label: 'nav.record' as const, Icon: IconRecord },
].filter((v) => v.id !== 'record' || PUBLIC_RECORD)

/** The phone's bottom bar holds five tabs; anything past them opens from "More",
 *  which shows only when there is something in it (the Track record, when public). */
const PHONE_PRIMARY: View[] = ['home', 'learn', 'practice', 'today', 'portfolio']
export const PHONE_TABS = VIEWS.filter((v) => PHONE_PRIMARY.includes(v.id))
export const PHONE_MORE = VIEWS.filter((v) => !PHONE_PRIMARY.includes(v.id))
