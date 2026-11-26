import { MARKETING_WORDS } from '../lexicon/marketing.js'
import { blockRenders, EXACT_BLOCK_SCORE } from '../lib/block-search.js'
import { marketingPageIntent } from '../lib/marketing-page.js'
import { aliasHits, conceptHits } from '../lib/name-matches.js'
import { componentCard, isSectionComponent, NOT_AVAILABLE, surfaceOf } from '../lib/results.js'
import { contentWords, hasPhrase, normalize, screenIntentOf } from '../lib/text.js'
import { searchBlocks } from './blocks.js'
import { searchComponents } from './search.js'

function fuzzySuggestion(catalog, q) {
  const fuzzy = catalog
    .suggestSubpaths(q.toLowerCase().replace(/\s+/g, '-'))
    .filter((sub) => catalog.getEntry(sub)?.kind === 'component')
    .map((sub) => componentCard(catalog, sub))
  return {
    ok: true,
    available: true,
    need: q,
    found: false,
    best: fuzzy[0] ?? null,
    alternatives: fuzzy.slice(1, 4),
    message: fuzzy.length
      ? `No strong match for "${q}". Closest names by spelling:`
      : `No component matches "${q}". Try listComponents or searchComponents with a broader term.`
  }
}

const STRONG_SCORE = 45

function isStrongMatch(catalog, match, query) {
  if (match.exact || match.aliasOf || match.renamedFrom) return true
  if (conceptHits(catalog, query).has(match.name)) return true
  return match.score >= STRONG_SCORE
}

function componentSuggestion(catalog, q, opts) {
  const search = searchComponents(catalog, q, opts)
  if (!search.matches.length) return fuzzySuggestion(catalog, q)
  if (!search.matches.some((m) => isStrongMatch(catalog, m, q))) {
    return {
      ok: true,
      available: true,
      need: q,
      found: false,
      best: null,
      alternatives: [],
      weakMatches: search.matches.slice(0, 3),
      message:
        `No WebKit component is made for "${q}". The weak matches only share a word with it: do not bend one into this job. ` +
        'Build the smallest custom piece from @aziontech/theme tokens and compose it with WebKit components (rule webkit-prefer-over-custom).'
    }
  }
  const [best, ...rest] = search.matches
  return {
    ok: true,
    available: true,
    need: q,
    found: true,
    best,
    alternatives: rest.slice(0, 3),
    ...(best.note ? { note: best.note } : {})
  }
}

function sectionScore(catalog, sub, words, aliases, concepts) {
  const e = catalog.getDetails(sub)
  const name = normalize(sub)
  const prose = normalize([e.purpose || '', ...(e.useWhen || [])].join(' '))
  let score = (aliases.get(sub)?.boost ?? 0) + (concepts.get(sub) ?? 0)
  for (const w of words) {
    if (hasPhrase(name, w)) score += 20
    else if (name.includes(w)) score += 10
    if (hasPhrase(prose, w)) score += 3
  }
  return score
}

function sectionSuggestion(catalog, need) {
  const words = contentWords(normalize(need))
  const aliases = aliasHits(catalog, need)
  const concepts = conceptHits(catalog, need)
  return catalog.subpaths
    .filter((sub) => isSectionComponent(catalog, sub))
    .map((sub) => ({ sub, score: sectionScore(catalog, sub, words, aliases, concepts) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.sub.localeCompare(b.sub))
}

function blockRecommendation(q, blocks, component, hint) {
  const topBlock = blocks.matches[0]
  return {
    ok: true,
    available: true,
    need: q,
    found: true,
    recommendation: 'block',
    block: topBlock,
    blockAlternatives: blocks.matches.slice(1, 3),
    hint,
    best: component.best,
    alternatives: component.alternatives
  }
}

function marketingPageSuggestion(catalog, q, opts, component) {
  const blocks = searchBlocks(catalog, q, opts)
  const topBlock = blocks.matches?.[0]
  if (!topBlock) return null
  return blockRecommendation(
    q,
    blocks,
    component,
    `A marketing page starts from the website shell: call get_block("${topBlock.id}") and copy ` +
      `its SFC, then fill the frame with page sections (the components below, in page order: the ` +
      `hero band first, the closing call to action last).`
  )
}

function sectionRecommendation(catalog, q, component) {
  const sections = sectionSuggestion(catalog, q)
  if (!sections.length) return null
  const [best, ...rest] = sections
  return {
    ...component,
    recommendation: 'section',
    best: { ...componentCard(catalog, best.sub), score: best.score },
    alternatives: rest
      .slice(0, 3)
      .map((r) => ({ ...componentCard(catalog, r.sub), score: r.score })),
    found: true,
    hint:
      'A marketing band is a page section: import it from its flat subpath ' +
      '(@aziontech/webkit/<name>, the site JSON _id), bind it with v-bind="section.props" and ' +
      'place it inside Container and Spacer (rule webkit-sections).'
  }
}

function isMarketingNeed(nq, wantedSurface) {
  if (wantedSurface) return wantedSurface === 'site'
  return MARKETING_WORDS.some((w) => hasPhrase(nq, normalize(w)))
}

function isExactComponent(best, nq) {
  if (!best) return false
  if (best.exact === true || normalize(best.name) === nq) return true
  return normalize(best.aliasOf ?? best.renamedFrom ?? '') === nq
}

function prefersBlock(catalog, q, nq, component, topBlock) {
  const screenIntent = screenIntentOf(nq)
  const exactBlock = topBlock.score >= EXACT_BLOCK_SCORE
  const namedComponent =
    !screenIntent &&
    component.best &&
    conceptHits(catalog, q).has(component.best.name) &&
    !blockRenders(catalog, topBlock.id, component.best.name)
  const blockWins = exactBlock || (!isExactComponent(component.best, nq) && !namedComponent)
  return blockWins && topBlock.score >= (screenIntent ? 25 : 60)
}

function screenSuggestion(catalog, q, nq, opts, component) {
  const blocks = searchBlocks(catalog, q, opts)
  const topBlock = blocks.matches?.[0]
  if (!topBlock || !prefersBlock(catalog, q, nq, component, topBlock)) return null
  return blockRecommendation(
    q,
    blocks,
    component,
    topBlock.kind === 'fragment'
      ? `This is a card, not a page: call get_block("${topBlock.id}") and drop its SFC into the page block that needs it.`
      : `This is a screen: start from the block. Call get_block("${topBlock.id}") and copy its SFC; use the components below only for pieces the block does not cover.`
  )
}

export function suggestComponent(catalog, need, { surface } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const q = String(need || '')
  const nq = normalize(q)
  const wantedSurface = surfaceOf(surface)
  const opts = wantedSurface ? { surface: wantedSurface } : {}
  const component = componentSuggestion(catalog, q, opts)
  const page = marketingPageIntent(q, wantedSurface)
  const pageSuggestion =
    page && !page.words.length ? marketingPageSuggestion(catalog, q, opts, component) : null
  if (pageSuggestion) return pageSuggestion
  const section = isMarketingNeed(nq, wantedSurface)
    ? sectionRecommendation(catalog, q, component)
    : null
  return (
    section ??
    screenSuggestion(catalog, q, nq, opts, component) ?? {
      ...component,
      recommendation: 'component'
    }
  )
}
