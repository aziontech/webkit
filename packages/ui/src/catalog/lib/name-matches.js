import { COMPONENT_TERMS } from '../lexicon/component-terms.js'
import { contentWords, hasPhrase, longestMatches, normalize } from './text.js'

export function resolveAlias(catalog, name) {
  const key = normalize(name).replace(/ /g, '-')
  const to = catalog.aliases?.[key]
  return to && catalog.getEntry(to) ? { alias: key, to } : null
}

export function retiredNote(catalog, key) {
  const name = normalize(key).replace(/ /g, '-')
  const to = catalog.renamed?.[name]
  if (to && catalog.getEntry(to)) {
    return {
      to,
      note: `"${name}" was renamed in Azion UI v6: import ${catalog.prefix}${to}. Run \`npx @aziontech/ui migrate v6\` to rewrite old imports.`
    }
  }
  const replacement = catalog.removed?.[name]
  return replacement
    ? { to: null, note: `"${name}" was removed in Azion UI v6. Use ${replacement} instead.` }
    : null
}

export function aliasNote(alias, to) {
  return `"${alias}" is not an Azion UI export: it is another name for "${to}". Import @aziontech/ui/${to}.`
}

function addAliasPhraseHits(catalog, nq, hits) {
  for (const [alias, to] of Object.entries(catalog.aliases || {})) {
    if (!catalog.getEntry(to)) continue
    const phrase = normalize(alias)
    if (nq === phrase) hits.set(to, { alias, boost: 100 })
    else if (!hits.has(to) && hasPhrase(nq, phrase)) hits.set(to, { alias, boost: 30 })
  }
}

function addRenamedHits(catalog, nq, hits) {
  for (const [from, to] of Object.entries(catalog.renamed || {})) {
    if (catalog.getEntry(to) && nq === normalize(from) && !hits.has(to)) {
      hits.set(to, { alias: from, boost: 100, renamed: true })
    }
  }
}

export function aliasHits(catalog, query) {
  const nq = normalize(query)
  const hits = new Map()
  if (!nq) return hits
  addAliasPhraseHits(catalog, nq, hits)
  addRenamedHits(catalog, nq, hits)
  return hits
}

const NORMALIZED_TERMS = Object.entries(COMPONENT_TERMS).flatMap(([key, terms]) =>
  terms.map((term) => ({ key, term: normalize(term) }))
)

function coveredTerms(catalog, q, hits) {
  const owners = new Map()
  const covered = new Map()
  for (const { key, term } of longestMatches(q, NORMALIZED_TERMS)) {
    if (!catalog.getEntry(key)) continue
    const owner = owners.get(term)
    if (owner && owner !== key) continue
    owners.set(term, key)
    if (term === q) {
      hits.set(key, 90)
      continue
    }
    const tokens = covered.get(key) ?? new Set()
    for (const w of term.split(' ')) tokens.add(w)
    covered.set(key, tokens)
  }
  return covered
}

export function conceptHits(catalog, query) {
  const q = normalize(query)
  const hits = new Map()
  if (!q) return hits
  const words = contentWords(q)
  const covered = coveredTerms(catalog, q, hits)
  for (const [key, tokens] of covered) {
    if (hits.has(key)) continue
    const share = words.length ? words.filter((w) => tokens.has(w)).length / words.length : 0
    hits.set(key, Math.round(30 + 50 * Math.min(1, share)))
  }
  return hits
}
