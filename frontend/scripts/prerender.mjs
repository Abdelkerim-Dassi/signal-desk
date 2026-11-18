// After `vite build`: write a real HTML page for the course and for every
// lesson, in Arabic, French and English, and the sitemap that lists them.
//
//   dist/learn/index.html              qirat.tn/learn
//   dist/learn/<slug>/index.html       qirat.tn/learn/<slug>
//   dist/fr/learn/...  dist/en/learn/...
//   dist/sitemap.xml
//
// Each page is the built index.html with its own title, description, address
// and language in the <head>, and the lesson's text inside #root. The app
// replaces that text when it starts and shows the same lesson (lib/route.ts),
// so a visitor sees the app and a crawler that runs no script still reads the
// lesson. vercel.json sends /learn... to these files.
//
// Runs under Node 22.18+ (it imports the lessons' .ts files directly).

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const dist = resolve(here, '..', 'dist')
const SITE = 'https://qirat.tn'
const LANGS = ['ar', 'fr', 'en']
const LOCALE = { ar: 'ar_TN', fr: 'fr_FR', en: 'en_US' }

const { LESSONS, LEVELS, LEARN_UI, isReady, courseTitle, pageTitle } = await import('../src/lib/lessons.ts')

const template = readFileSync(resolve(dist, 'index.html'), 'utf8')
const lessons = LESSONS.filter(isReady)
const pathFor = (lang, slug) => `${lang === 'ar' ? '' : `/${lang}`}/learn${slug ? `/${slug}` : ''}`
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const para = (s) => esc(s).replace(/\n+/g, '<br>')

/** Replace exactly one thing in the page, or stop the build: a silent miss would ship a page with the wrong head. */
function swap(html, pattern, replacement, what) {
  let hits = 0
  const out = html.replace(pattern, () => {
    hits += 1
    return replacement
  })
  if (hits !== 1) throw new Error(`prerender: expected one ${what} in dist/index.html, found ${hits}`)
  return out
}

function page({ lang, slug, title, description, body, ld }) {
  const url = SITE + pathFor(lang, slug)
  const alternates = [
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}${pathFor(l, slug)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${SITE}${pathFor('ar', slug)}" />`,
  ].join('\n    ')
  let html = template
  html = swap(html, /<html lang="[^"]*">/, `<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">`, '<html> tag')
  html = swap(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`, '<title>')
  html = swap(html, /<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${esc(description)}" />`, 'description')
  html = swap(html, /<meta property="og:url"[^>]*\/>/, `<meta property="og:url" content="${url}" />`, 'og:url')
  html = swap(html, /<meta property="og:locale" content="[^"]*" \/>/, `<meta property="og:locale" content="${LOCALE[lang]}" />`, 'og:locale')
  html = swap(html, /<meta property="og:title"[^>]*\/>/, `<meta property="og:title" content="${esc(title)}" />`, 'og:title')
  html = swap(html, /<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${esc(description)}" />`, 'og:description')
  html = swap(html, /<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${url}" />\n    ${alternates}`, 'canonical link')
  html = swap(html, /<\/head>/, `  <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>\n  </head>`, '</head>')
  html = swap(
    html,
    /<div id="root"><\/div>/,
    `<div id="root"><main style="max-width:42rem;margin:0 auto;padding:1.5rem 1.25rem 4rem;font-family:'Readex Pro',system-ui,sans-serif;line-height:1.75">${body}</main></div>`,
    '#root',
  )
  const file = resolve(dist, `.${pathFor(lang, slug)}`, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

const org = { '@type': 'Organization', name: 'Qirat', url: `${SITE}/` }

for (const lang of LANGS) {
  const t = (key, vars = {}) => Object.entries(vars).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), LEARN_UI[key][lang])
  const course = courseTitle(lang)

  // the course: every lesson, by level
  const levels = LEVELS.map((lv) => {
    const list = lessons.filter((l) => l.level === lv.level)
    if (!list.length) return ''
    const items = list
      .map((l) => `<li><a href="${pathFor(lang, l.slug)}">${esc(l.title[lang])}</a><br>${esc(l.hook[lang])}</li>`)
      .join('')
    return `<h2>${esc(lv.name[lang])}</h2><p>${esc(lv.about[lang])}</p><ol start="${lessons.indexOf(list[0]) + 1}">${items}</ol>`
  }).join('')
  page({
    lang,
    slug: null,
    title: pageTitle(course, lang),
    description: LEARN_UI.subtitle[lang],
    body: `<h1>${esc(course)}</h1><p>${esc(LEARN_UI.subtitle[lang])}</p>${levels}<p>${esc(t('notAdvice'))}</p>`,
    ld: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course,
      description: LEARN_UI.subtitle[lang],
      inLanguage: lang,
      isAccessibleForFree: true,
      url: SITE + pathFor(lang),
      provider: org,
      hasPart: lessons.map((l) => ({ '@type': 'LearningResource', name: l.title[lang], url: SITE + pathFor(lang, l.slug) })),
    },
  })

  // one page per lesson
  lessons.forEach((l, i) => {
    const prev = lessons[i - 1]
    const next = lessons[i + 1]
    const level = LEVELS.find((lv) => lv.level === l.level)
    const sections = (l.sections ?? []).map((s) => `<section><h2>${esc(s.h[lang])}</h2><p>${para(s.p[lang])}</p></section>`).join('')
    const around = [
      prev && `<a href="${pathFor(lang, prev.slug)}">${esc(t('lessonN', { n: i }))}: ${esc(prev.title[lang])}</a>`,
      next && `<a href="${pathFor(lang, next.slug)}">${esc(t('lessonN', { n: i + 2 }))}: ${esc(next.title[lang])}</a>`,
    ]
      .filter(Boolean)
      .join('<br>')
    page({
      lang,
      slug: l.slug,
      title: pageTitle(l.title[lang], lang),
      description: l.hook[lang],
      body:
        `<p><a href="${pathFor(lang)}">${esc(course)}</a><br>${esc(level.name[lang])}, ${esc(t('lessonN', { n: i + 1 }))}</p>` +
        `<h1>${esc(l.title[lang])}</h1><p>${esc(l.hook[lang])}</p>${sections}` +
        (l.takeaway ? `<section><h2>${esc(t('takeaway'))}</h2><p><strong>${para(l.takeaway[lang])}</strong></p></section>` : '') +
        `<p>${around}</p><p>${esc(t('notAdvice'))}</p>`,
      ld: {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: l.title[lang],
        description: l.hook[lang],
        inLanguage: lang,
        isAccessibleForFree: true,
        learningResourceType: 'lesson',
        timeRequired: `PT${l.minutes}M`,
        url: SITE + pathFor(lang, l.slug),
        isPartOf: { '@type': 'Course', name: course, url: SITE + pathFor(lang) },
        provider: org,
      },
    })
  })
}

// the sitemap: the first screen, the course and every lesson, each with its three languages
const today = new Date().toISOString().slice(0, 10)
const entry = (slug) =>
  LANGS.map(
    (lang) =>
      `  <url><loc>${SITE}${pathFor(lang, slug)}</loc><lastmod>${today}</lastmod>` +
      LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${pathFor(l, slug)}"/>`).join('') +
      `</url>`,
  ).join('\n')
writeFileSync(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    `  <url><loc>${SITE}/</loc><changefreq>daily</changefreq></url>\n` +
    [entry(null), ...lessons.map((l) => entry(l.slug))].join('\n') +
    `\n</urlset>\n`,
)

console.log(`prerender: ${LANGS.length} course pages, ${lessons.length * LANGS.length} lesson pages, sitemap with ${1 + (lessons.length + 1) * LANGS.length} addresses`)
