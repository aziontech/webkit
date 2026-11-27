import { RENDERS_THROUGH } from '../lexicon/component-terms.js'
import { SYNONYM_GROUPS } from '../lexicon/synonyms.js'
import { stabilityOf } from './results.js'
import {
  contentWords,
  firstSentence,
  hasPhrase,
  longestMatches,
  normalize,
  NORMALIZED_SCREEN_WORDS
} from './text.js'

const NORMALIZED_GROUPS = SYNONYM_GROUPS.map((group) => [...new Set(group.map(normalize))])

const CARD_INTENTS = 5

export const EXACT_BLOCK_SCORE = 1000

export const FRAGMENT_NOTE =
  'A card, not a page: drop this fragment into the page block that needs it; it is never a whole screen.'

export function expandQuery(query) {
  const q = normalize(query)
  const candidates = NORMALIZED_GROUPS.flatMap((group, key) => group.map((term) => ({ key, term })))
  const hits = longestMatches(q, candidates)
  const keys = [...new Set(hits.map((h) => h.key))]
  const groups = keys.map((k) => NORMALIZED_GROUPS[k].filter((t) => t !== q))
  const words = contentWords(q)
  const generic = hits.length > 0 && words.every((w) => hits.some((h) => hasPhrase(h.term, w)))
  return { q, groups, generic, phrases: [q, ...groups.flat()], words }
}

export function blockCard(id, p, score) {
  return {
    id,
    name: p.name,
    summary: firstSentence(p.summary),
    ...(p.guidelinesSummary ? { guidelinesSummary: p.guidelinesSummary } : {}),
    intents: (p.intents || []).slice(0, CARD_INTENTS),
    components: p.components || [],
    skills: p.skills || [],
    ...(p.steps ? { steps: p.steps } : {}),
    variants: (p.variants || []).map((v) => v.name),
    source: p.source,
    surface: p.surface ?? 'app',
    ...(p.kind === 'fragment' ? { kind: 'fragment', note: FRAGMENT_NOTE } : {}),
    ...stabilityOf(p),
    ...(score != null ? { score } : {})
  }
}

export function blockRenders(catalog, id, name) {
  return (catalog.blocks[id]?.imports || []).some((imp) => {
    if (!imp.startsWith(catalog.prefix)) return false
    const used = imp.slice(catalog.prefix.length)
    return used === name || (RENDERS_THROUGH[used] || []).includes(name)
  })
}

export function isExactBlock(id, p, q) {
  return [id, id.split('/').pop(), p.name].some((s) => normalize(s) === q)
}

function blockTexts(id, p) {
  return {
    intents: (p.intents || []).map(normalize),
    nameText: normalize(`${id} ${p.name}`),
    components: normalize((p.components || []).join(' ')),
    summary: normalize(p.summary)
  }
}

function phraseScore({ intents, nameText }, phrase, exact = 100) {
  let s = 0
  if (intents.includes(phrase)) s += exact
  else if (
    intents.some((i) => hasPhrase(i, phrase) || (phrase.length >= 4 && hasPhrase(phrase, i)))
  )
    s += 60
  if (hasPhrase(nameText, phrase)) s += 40
  return s
}

function blockWordScore({ intents, nameText, components, summary }, w) {
  let s = 0
  if (intents.some((i) => hasPhrase(i, w))) s += 12
  if (hasPhrase(nameText, w)) s += 10
  if (hasPhrase(components, w)) s += 4
  if (hasPhrase(summary, w)) s += 2
  return s
}

export function scoreBlock(id, p, { q, groups, generic, words }) {
  const texts = blockTexts(id, p)
  const genericScreen = (phrase) =>
    NORMALIZED_SCREEN_WORDS.some((w) => texts.intents.includes(`${phrase} ${w}`))
  let score = isExactBlock(id, p, q) ? EXACT_BLOCK_SCORE : 0
  score += phraseScore(texts, q, 160)
  for (const group of groups) {
    score += 0.8 * Math.max(0, ...group.map((t) => phraseScore(texts, t)))
    if (generic && group.some(genericScreen)) score += 15
  }
  for (const w of words) score += blockWordScore(texts, w)
  return Math.round(score)
}
