import { STOPWORDS } from '../lexicon/query-words.js'
import { marketingPageIntent, marketingPageSections } from '../lib/marketing-page.js'
import { aliasHits, aliasNote, conceptHits, retiredNote } from '../lib/name-matches.js'
import { componentCard, NOT_AVAILABLE, subpathOf, surfaceOf } from '../lib/results.js'
import { hasPhrase, normalize, pascalCase } from '../lib/text.js'

const PRODUCT_BONUS = 15
const SEARCHABLE_KINDS = new Set(['component', 'subcomponent'])

function wholeQueryScore(n, c, q) {
  let score = 0
  if (n === q) score += 100
  if (hasPhrase(n, q)) score += 40
  if (hasPhrase(q, n) && n.length >= 3) score += 30
  if (c && (c === q || hasPhrase(q, c))) score += 10
  return score
}

function wordScore(n, c, prose, w) {
  let score = 0
  if (n === w) score += 25
  else if (hasPhrase(n, w)) score += 15
  else if (w.includes(n) && n.length >= 3) score += 12
  if (c.includes(w)) score += 4
  if (hasPhrase(prose, w)) score += 6
  return score
}

function scoreMatch(name, entry, query) {
  const q = normalize(query)
  if (!q) return 0
  const n = normalize(name)
  const c = normalize(entry.category || '')
  const words = q.split(' ').filter((w) => w.length >= 3 && !STOPWORDS.has(w))
  const prose = normalize([entry.purpose || '', ...(entry.useWhen || [])].join(' '))
  return words.reduce((score, w) => score + wordScore(n, c, prose, w), wholeQueryScore(n, c, q))
}

function nameScore(sub, entry, query) {
  const score = scoreMatch(sub, entry, query)
  if (entry?.kind !== 'subcomponent' || !entry.parent) return score
  return hasPhrase(normalize(query), normalize(entry.parent)) ? score : Math.round(score / 2)
}

function partBinding(parent, sub) {
  const rest = sub.startsWith(`${parent}-`) ? sub.slice(parent.length + 1) : sub
  return `${pascalCase(parent)}.${pascalCase(rest)}`
}

function searchCard(catalog, sub) {
  const card = componentCard(catalog, sub)
  const e = catalog.getEntry(sub)
  if (e?.kind !== 'subcomponent' || !e.parent) return card
  const parent = pascalCase(e.parent)
  if (e.attached === false) {
    return {
      ...card,
      kind: 'subcomponent',
      parent: e.parent,
      hint: `${card.binding} goes inside ${parent} but is not attached to the ${parent} compound: import it from '${card.import}'.`
    }
  }
  const compound = partBinding(e.parent, sub)
  return {
    ...card,
    kind: 'subcomponent',
    parent: e.parent,
    compoundBinding: compound,
    hint: `${card.binding} is a part of ${parent}: compose it inside ${parent} as ${compound} (import ${parent} from '${catalog.prefix}${e.parent}'), or import it alone from '${card.import}'.`
  }
}

const popularityCache = new WeakMap()

function popularity(catalog) {
  if (popularityCache.has(catalog)) return popularityCache.get(catalog)
  const counts = new Map()
  for (const p of Object.values(catalog.blocks || {})) {
    for (const imp of p.imports || []) {
      const sub = subpathOf(catalog, imp)
      counts.set(sub, (counts.get(sub) ?? 0) + 1)
    }
  }
  popularityCache.set(catalog, counts)
  return counts
}

function isProductEntry(entry) {
  return (entry?.surface ?? 'app') === 'app'
}

function tieBreak(catalog, a, b) {
  const product =
    Number(isProductEntry(catalog.getEntry(b))) - Number(isProductEntry(catalog.getEntry(a)))
  if (product) return product
  const uses = popularity(catalog)
  return (uses.get(b) ?? 0) - (uses.get(a) ?? 0) || a.localeCompare(b)
}

function marketingPageSearch(catalog, q, wantedSurface, page) {
  const matches = marketingPageSections(catalog, page)
    .slice(0, 10)
    .map((r) => ({ ...componentCard(catalog, r.sub), score: r.score }))
  return {
    ok: true,
    available: true,
    query: q,
    ...(wantedSurface ? { surface: wantedSurface } : {}),
    count: matches.length,
    matches,
    hint:
      'A marketing page is the shell/shell-site block (get_block("shell/shell-site")) filled with ' +
      'page sections: import each from its flat subpath, bind it with v-bind="section.props" and ' +
      'place it inside Container and Spacer (rule webkit-sections).'
  }
}

function rankedSubpaths(catalog, q, wantedSurface, aliases, concepts) {
  return catalog.subpaths
    .filter((sub) => SEARCHABLE_KINDS.has(catalog.getEntry(sub)?.kind))
    .filter((sub) => !wantedSurface || catalog.getEntry(sub)?.surface === wantedSurface)
    .map((sub) => {
      const e = catalog.getDetails(sub)
      const base = nameScore(sub, e, q) + (aliases.get(sub)?.boost ?? 0) + (concepts.get(sub) ?? 0)
      const productBonus = !wantedSurface && base > 0 && isProductEntry(e) ? PRODUCT_BONUS : 0
      return { sub, score: base + productBonus }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || tieBreak(catalog, a.sub, b.sub))
    .slice(0, 10)
}

function matchCard(catalog, r, nq, aliases, concepts) {
  const card = { ...searchCard(catalog, r.sub), score: r.score }
  if (normalize(r.sub) === nq || concepts.get(r.sub) === 90) card.exact = true
  const hit = aliases.get(r.sub)
  if (!hit) return card
  return {
    ...card,
    exact: hit.boost === 100,
    ...(hit.renamed ? { renamedFrom: hit.alias } : { aliasOf: hit.alias }),
    note: hit.renamed ? retiredNote(catalog, hit.alias).note : aliasNote(hit.alias, r.sub)
  }
}

export function searchComponents(catalog, query, { surface } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const q = String(query || '')
  const nq = normalize(q)
  const wantedSurface = surfaceOf(surface)
  const page = marketingPageIntent(q, wantedSurface)
  if (page) return marketingPageSearch(catalog, q, wantedSurface, page)
  const aliases = aliasHits(catalog, q)
  const concepts = conceptHits(catalog, q)
  const ranked = rankedSubpaths(catalog, q, wantedSurface, aliases, concepts).map((r) =>
    matchCard(catalog, r, nq, aliases, concepts)
  )
  return {
    ok: true,
    available: true,
    query: q,
    ...(wantedSurface ? { surface: wantedSurface } : {}),
    count: ranked.length,
    matches: ranked
  }
}
