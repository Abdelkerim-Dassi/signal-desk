// The story videos shown on the first screen, and Qirat's accounts.
//
// Each video is a copy of a reel already posted on the accounts, made small
// for the web (540 x 960, about 1 MB): frontend/public/stories/<id>.mp4 and
// <id>.jpg for its first picture. Source files: marketing/content/week-*.
//
// `play` is the switch per card:
//   'here' the video plays on the site, and ends on "try it yourself"
//   'out'  the card opens `out` (the post on a platform) in a new tab
// At 20 visitors a week the site cannot feed the platforms' view counts, and
// a visitor who leaves rarely comes back, so every card plays here for now.

import type { Lang } from './i18n'

export type Cast = 'sami' | 'youssef' | 'mariem'

export interface Story {
  id: string
  title: Record<Lang, string>
  cast: Cast[]
  seconds: number
  play: 'here' | 'out'
  /** the same video on a platform; used when play is 'out' */
  out?: string
}

export const CAST_NAME: Record<Cast, Record<Lang, string>> = {
  sami: { en: 'Sami', fr: 'Sami', ar: 'سامي' },
  youssef: { en: 'Youssef', fr: 'Youssef', ar: 'يوسف' },
  mariem: { en: 'Mariem', fr: 'Mariem', ar: 'مريم' },
}

export const STORIES: Story[] = [
  {
    id: 'same-trade',
    title: { en: 'Same trade, two results', fr: 'Le même trade, deux résultats', ar: 'نفس الشرية، وزوز نتايج' },
    cast: ['sami', 'youssef'],
    seconds: 35,
    play: 'here',
  },
  {
    id: 'mariem-all-in',
    title: {
      en: 'Mariem put all 1000 in one coin',
      fr: 'Mariem a mis les 1000 sur une seule crypto',
      ar: 'مريم حطّت الـ 1000 الكل في coin وحدة',
    },
    cast: ['mariem'],
    seconds: 28,
    play: 'here',
  },
  {
    id: 'cheap-coin',
    title: {
      en: '“Bitcoin is too expensive, I’ll buy the cheap coin”',
      fr: '« Bitcoin est trop cher, j’achète la crypto pas chère »',
      ar: '«Bitcoin غالي، نشري الـ coin الرخيصة»',
    },
    cast: ['sami', 'youssef'],
    seconds: 38,
    play: 'here',
  },
  {
    id: 'ten-trades',
    title: {
      en: '10 trades in two minutes',
      fr: '10 trades en deux minutes',
      ar: '10 trades في دقيقتين',
    },
    cast: ['sami', 'youssef'],
    seconds: 34,
    play: 'here',
  },
]

export type SocialId = 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'telegram'

export const SOCIALS: { id: SocialId; name: string; url: string }[] = [
  { id: 'tiktok', name: 'TikTok', url: 'https://www.tiktok.com/@getqirat_app' },
  { id: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/getqirat' },
  { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/@getqirat' },
  { id: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61595670264268' },
  { id: 'telegram', name: 'Telegram', url: 'https://t.me/getqirat' },
]

export const clock = (seconds: number) => `0:${String(seconds).padStart(2, '0')}`
