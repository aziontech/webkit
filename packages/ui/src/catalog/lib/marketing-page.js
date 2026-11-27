import {
  MARKETING_PAGE_FRAME,
  MARKETING_PAGE_GENERIC,
  MARKETING_PAGE_NOT,
  MARKETING_PAGES
} from '../lexicon/marketing.js'
import { isSectionComponent } from './results.js'
import { contentWords, hasPhrase, normalize } from './text.js'

const NORMALIZED_PAGES = MARKETING_PAGES.map((page) => ({
  terms: page.terms.map(normalize),
  prose: page.prose.map(normalize)
}))
const NORMALIZED_PAGE_NOT = MARKETING_PAGE_NOT.map(normalize)
const NORMALIZED_PAGE_GENERIC = new Set(MARKETING_PAGE_GENERIC.map(normalize))

export function marketingPageIntent(query, surface) {
  const nq = normalize(query)
  if (!nq || (surface && surface !== 'site')) return null
  if (NORMALIZED_PAGE_NOT.some((w) => hasPhrase(nq, w))) return null
  const pages = NORMALIZED_PAGES.filter((page) => page.terms.some((t) => hasPhrase(nq, t)))
  if (!pages.length) return null
  return {
    prose: [...new Set(pages.flatMap((page) => page.prose))],
    words: contentWords(nq).filter((w) => !NORMALIZED_PAGE_GENERIC.has(w))
  }
}

function sectionScore(catalog, sub, intent) {
  const e = catalog.getDetails(sub)
  const name = normalize(sub)
  const prose = normalize(
    [e.purpose || '', ...(e.useWhen || []), ...(e.bestPractices || [])].join(' ')
  )
  let score = MARKETING_PAGE_FRAME[sub] ?? 0
  if (intent.prose.some((p) => hasPhrase(prose, p))) score += 20
  for (const w of intent.words) {
    if (hasPhrase(name, w)) score += 40
    else if (name.includes(w)) score += 20
    if (hasPhrase(prose, w)) score += 4
  }
  return score
}

export function marketingPageSections(catalog, intent) {
  return catalog.subpaths
    .filter((sub) => isSectionComponent(catalog, sub))
    .map((sub) => ({ sub, score: sectionScore(catalog, sub, intent) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.sub.localeCompare(b.sub))
}
