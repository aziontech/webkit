import { isChartPaletteClass } from '../eslint-plugin/lib/chart-palette.js'
import { LAYOUT_CLASS_FAMILIES, nonLayoutClasses } from '../eslint-plugin/lib/layout-classes.js'
import {
  COMPONENT_TERMS,
  MARKETING_PAGE_FRAME,
  MARKETING_PAGE_GENERIC,
  MARKETING_PAGE_NOT,
  MARKETING_PAGES,
  MARKETING_WORDS,
  RENDERS_THROUGH,
  SCREEN_WORDS,
  STOPWORDS,
  SYNONYM_GROUPS
} from './search-lexicon.js'

const NOT_AVAILABLE = {
  ok: false,
  available: false,
  message:
    '@aziontech/webkit is not installed in this project (or its catalog.json is not resolvable). ' +
    'Install @aziontech/webkit, or set WEBKIT_CATALOG_PATH to its catalog.json.'
}

export function pascalCase(subpath) {
  const last = String(subpath).split('/').pop() || ''
  return last
    .split('-')
    .filter(Boolean)
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join('')
}

function subpathOf(catalog, importPath) {
  const prefix = catalog.prefix
  const s = String(importPath || '')
  return s.startsWith(prefix) ? s.slice(prefix.length) : s
}

function deprecationOf(entry) {
  if (!entry?.deprecated) return {}
  return {
    deprecated: true,
    ...(entry.deprecation ? { deprecation: entry.deprecation } : {}),
    ...(entry.replacedBy ? { replacedBy: entry.replacedBy } : {})
  }
}

function componentCard(catalog, name) {
  const e = catalog.getEntry(name)
  if (!e) return null
  return {
    name,
    category: e.category ?? null,
    surface: e.surface ?? null,
    structure: e.structure ?? null,
    import: e.import,
    treeShakeableImport: e.treeShakeableImport ?? e.import,
    binding: pascalCase(name),
    ...deprecationOf(e)
  }
}

export function listComponents(catalog, { category, surface, limit, cursor } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const wanted = category ? String(category).toLowerCase() : null
  const wantedSurface = surface ? String(surface).toLowerCase() : null
  const components = catalog.subpaths
    .filter((sub) => catalog.getEntry(sub)?.kind === 'component')
    .filter((sub) => !wanted || (catalog.getEntry(sub)?.category || '').toLowerCase() === wanted)
    .filter((sub) => !wantedSurface || catalog.getEntry(sub)?.surface === wantedSurface)
    .map((sub) => componentCard(catalog, sub))
    .sort((a, b) => a.name.localeCompare(b.name))
  const start = Math.max(0, Number.parseInt(cursor ?? '0', 10) || 0)
  const size = limit > 0 ? Math.floor(limit) : components.length
  const page = components.slice(start, start + size)
  const next = start + page.length
  return {
    ok: true,
    available: true,
    version: catalog.version,
    count: components.length,
    ...(wanted ? { category: wanted } : {}),
    ...(wantedSurface ? { surface: wantedSurface } : {}),
    ...(start || next < components.length ? { cursor: String(start) } : {}),
    ...(next < components.length ? { nextCursor: String(next) } : {}),
    components: page
  }
}

export function listCategories(catalog) {
  if (!catalog.available) return NOT_AVAILABLE
  const cats = new Set()
  for (const sub of catalog.subpaths) {
    const c = catalog.getEntry(sub)?.category
    if (c) cats.add(c)
  }
  return { ok: true, available: true, categories: [...cats].sort() }
}

export function listTokens(catalog, { category } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const tokens = catalog.tokens || { cssVars: [], typography: [], groups: {} }
  const groupNames = Object.keys(tokens.groups)

  if (category != null && String(category).length) {
    const key = String(category).toLowerCase().trim()
    if (key === 'animations' || key === 'animation' || key === 'animate' || key === 'motion') {
      return {
        ok: true,
        available: true,
        found: true,
        category: 'animations',
        tokens: (tokens.animations || []).map((name) => ({
          class: `animate-${name}`,
          ...(tokens.animationGuide?.[name] || {})
        })),
        hint: 'Every motion-bearing class pairs with a motion-reduce: fallback (e.g. `animate-slide-in-start motion-reduce:animate-none`). Panel/drawer open-close wraps the v-if region in a Vue Transition with enter-active-class / leave-active-class.'
      }
    }
    const group = tokens.groups[key]
    if (!group) {
      return {
        ok: false,
        available: true,
        found: false,
        category: key,
        groups: [...groupNames, 'animations'],
        message: `No token group "${key}". Available groups: ${groupNames.join(', ')}, animations.`
      }
    }
    return { ok: true, available: true, found: true, category: key, tokens: group }
  }

  return {
    ok: true,
    available: true,
    groups: [
      ...groupNames.map((name) => ({ name, count: tokens.groups[name].length })),
      { name: 'animations', count: (tokens.animations || []).length }
    ],
    typography: tokens.typography,
    vocabulary: catalog.vocabulary || null,
    hint: 'Call list_tokens with a category (e.g. "primary", "bg", "text", "spacing", "radius", "shadow", "animations") for that group — "animations" returns each animate-* class with its timing and when to use it.'
  }
}

const ASSET_KIND_ALIASES = {
  illustration: 'illustrations',
  illustrations: 'illustrations',
  scene: 'illustrations',
  diagram: 'diagrams',
  diagrams: 'diagrams',
  'line-figure': 'lineFigures',
  'line-figures': 'lineFigures',
  linefigure: 'lineFigures',
  linefigures: 'lineFigures',
  figure: 'lineFigures',
  figures: 'lineFigures',
  'brand-mark': 'brandMarks',
  'brand-marks': 'brandMarks',
  brandmark: 'brandMarks',
  brandmarks: 'brandMarks',
  brand: 'brandMarks',
  brands: 'brandMarks',
  mark: 'brandMarks',
  marks: 'brandMarks',
  logo: 'brandMarks',
  logos: 'brandMarks',
  icon: 'icons',
  icons: 'icons'
}

function assetKindOf(catalog, kind) {
  const key = String(kind || '')
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
  const resolved = ASSET_KIND_ALIASES[key] ?? key
  return catalog.assets?.[resolved] ? resolved : null
}

function assetMatches(item, words) {
  const text = normalize([item.name, item.label, ...(item.keywords || [])].join(' '))
  return words.every((w) => text.includes(w))
}

export function listAssets(catalog, { kind, query } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const kinds = Object.keys(catalog.assets || {})
  const words = normalize(query).split(' ').filter(Boolean)
  if (kind == null || !String(kind).trim()) {
    return {
      ok: true,
      available: true,
      kinds: kinds.map((k) => {
        const { file: _file, items: _items, ...meta } = catalog.assets[k]
        const matches = words.length
          ? catalog.assetItems(k).filter((item) => assetMatches(item, words)).length
          : undefined
        return { kind: k, ...meta, ...(matches != null ? { matches } : {}) }
      }),
      hint: 'Call list_assets with a kind ("illustrations", "diagrams", "lineFigures", "brandMarks", "icons") for every valid name, and a query to filter by name, label or keyword. Never guess a name from a file in src/: an unregistered name renders a placeholder or nothing.'
    }
  }
  const resolved = assetKindOf(catalog, kind)
  if (!resolved) {
    return {
      ok: false,
      available: true,
      found: false,
      kind: String(kind),
      kinds,
      message: `No asset kind "${kind}". Kinds: ${kinds.join(', ')}.`
    }
  }
  const { file: _file, items: _items, ...meta } = catalog.assets[resolved]
  const all = catalog.assetItems(resolved)
  const items = words.length ? all.filter((item) => assetMatches(item, words)) : all
  return {
    ok: true,
    available: true,
    found: true,
    kind: resolved,
    ...meta,
    ...(words.length ? { query: String(query) } : {}),
    count: items.length,
    items
  }
}

function assetsFor(catalog, name) {
  return Object.entries(catalog.assets || {})
    .filter(([, meta]) => (meta.usedBy || []).includes(name))
    .map(([kind, meta]) => ({
      kind,
      title: meta.title,
      count: meta.count,
      list: `list_assets({ kind: "${kind}" })`
    }))
}

function resolveAlias(catalog, name) {
  const key = normalize(name).replace(/ /g, '-')
  const to = catalog.aliases?.[key]
  return to && catalog.getEntry(to) ? { alias: key, to } : null
}

function retiredNote(catalog, key) {
  const name = normalize(key).replace(/ /g, '-')
  const to = catalog.renamed?.[name]
  if (to && catalog.getEntry(to)) {
    return {
      to,
      note: `"${name}" was renamed in WebKit v6: import ${catalog.prefix}${to}. Run \`npx @aziontech/webkit migrate v6\` to rewrite old imports.`
    }
  }
  const replacement = catalog.removed?.[name]
  return replacement
    ? { to: null, note: `"${name}" was removed in WebKit v6. Use ${replacement} instead.` }
    : null
}

function aliasNote(alias, to) {
  return `"${alias}" is not a webkit export: it is another name for "${to}". Import @aziontech/webkit/${to}.`
}

function aliasHits(catalog, query) {
  const nq = normalize(query)
  const hits = new Map()
  if (!nq) return hits
  for (const [alias, to] of Object.entries(catalog.aliases || {})) {
    if (!catalog.getEntry(to)) continue
    const phrase = normalize(alias)
    if (nq === phrase) hits.set(to, { alias, boost: 100 })
    else if (!hits.has(to) && hasPhrase(nq, phrase)) hits.set(to, { alias, boost: 30 })
  }
  for (const [from, to] of Object.entries(catalog.renamed || {})) {
    if (catalog.getEntry(to) && nq === normalize(from) && !hits.has(to)) {
      hits.set(to, { alias: from, boost: 100, renamed: true })
    }
  }
  return hits
}

export function getComponent(catalog, name) {
  if (!catalog.available) return NOT_AVAILABLE
  const key = String(name || '').trim()
  const e = catalog.getDetails(key)
  if (!e) {
    const resolved = resolveAlias(catalog, key)
    if (resolved) {
      return {
        ...getComponent(catalog, resolved.to),
        requested: key,
        aliasOf: resolved.to,
        note: aliasNote(resolved.alias, resolved.to)
      }
    }
    const retired = retiredNote(catalog, key)
    if (retired?.to) {
      return {
        ...getComponent(catalog, retired.to),
        requested: key,
        renamedFrom: key,
        note: retired.note
      }
    }
    return {
      ok: false,
      available: true,
      found: false,
      name: key,
      suggestions: catalog.suggestSubpaths(key),
      message: retired ? retired.note : `No webkit export named "${key}".`
    }
  }
  return {
    ok: true,
    available: true,
    found: true,
    name: key,
    binding: pascalCase(key),
    ...deprecationOf(e),
    kind: e.kind,
    category: e.category ?? null,
    surface: e.surface ?? null,
    structure: e.structure ?? null,
    import: e.import,
    treeShakeableImport: e.treeShakeableImport ?? e.import,
    compoundRoot: e.compoundRoot ?? false,
    subcomponents: e.subcomponents ?? [],
    parent: e.parent ?? null,
    rootOf: e.rootOf ?? null,
    purpose: e.purpose ?? null,
    setup: e.setup ?? null,
    useWhen: e.useWhen ?? [],
    avoidWhen: e.avoidWhen ?? [],
    related: e.related ?? [],
    bestPractices: e.bestPractices ?? [],
    props: e.props ?? [],
    events: e.events ?? [],
    slots: e.slots ?? [],
    examples: catalog.examples(key),
    assets: assetsFor(catalog, key),
    allowedClasses: allowedClassesFor(e)
  }
}

function allowedClassesFor(entry) {
  if (entry.styleSeam) {
    return { any: true, note: 'Built to be personalized (style seam): any class is accepted.' }
  }
  return {
    any: false,
    families: [...LAYOUT_CLASS_FAMILIES],
    note: 'Only these layout utilities may go on the component tag. Anything else goes on a wrapper element or inside its slots.'
  }
}

export function getBestPractices(catalog, name) {
  if (!catalog.available) return NOT_AVAILABLE
  const key = String(name || '').trim()
  const e = catalog.getDetails(key)
  if (!e) {
    return {
      ok: false,
      available: true,
      found: false,
      name: key,
      suggestions: catalog.suggestSubpaths(key),
      message: `No webkit export named "${key}".`
    }
  }
  return {
    ok: true,
    available: true,
    found: true,
    name: key,
    purpose: e.purpose ?? null,
    setup: e.setup ?? null,
    useWhen: e.useWhen ?? [],
    avoidWhen: e.avoidWhen ?? [],
    related: e.related ?? [],
    bestPractices: e.bestPractices ?? []
  }
}

export function getImport(catalog, name) {
  if (!catalog.available) return NOT_AVAILABLE
  const key = String(name || '').trim()
  const e = catalog.getEntry(key)
  if (!e) {
    return {
      ok: false,
      available: true,
      found: false,
      name: key,
      suggestions: catalog.suggestSubpaths(key),
      message: `No webkit export named "${key}".`
    }
  }

  const hasLeanRoot = e.treeShakeableImport != null
  const tree = e.treeShakeableImport ?? e.import
  const binding = pascalCase(subpathOf(catalog, tree))
  const result = {
    ok: true,
    available: true,
    found: true,
    name: key,
    binding,
    import: `import ${binding} from '${tree}'`,
    importPath: tree,
    treeShakeable: hasLeanRoot
  }

  if (e.compoundRoot) {
    const subs = e.subcomponents ?? []
    const subExample = subs[0] ?? `${catalog.prefix}name-part`
    if (hasLeanRoot && tree !== e.import) {
      const compoundBinding = pascalCase(key)
      const part = pascalCase(subpathOf(catalog, subExample).replace(`${key}-`, ''))
      result.compoundAlternative = {
        import: `import ${compoundBinding} from '${e.import}'`,
        importPath: e.import,
        binding: compoundBinding,
        note:
          `The compound import (${e.import}) attaches every sub-component for dot-notation ` +
          `(${compoundBinding}.${part}, …); it is the form the examples and blocks use. It keeps ` +
          `every sub-component in the bundle even when you render only the root.`,
        subcomponents: subs
      }
      result.note =
        `${key} is a compound root. When you render its parts with dot-notation, import the ` +
        `compound (${compoundBinding}). The import above is the root alone, bound as ${binding}: ` +
        `it has no dot-notation parts, so import each part you render from its own subpath ` +
        `(e.g. ${subExample}).`
    } else {
      result.subcomponents = subs
      result.note =
        `${key} owns sub-components (e.g. ${subExample}). The import above is already the lean ` +
        `root; import each sub-component from its own subpath as needed.`
    }
  }

  return result
}

function scoreMatch(name, entry, query) {
  const q = normalize(query)
  if (!q) return 0
  const n = normalize(name)
  const c = normalize(entry.category || '')
  const words = q.split(' ').filter((w) => w.length >= 3 && !STOPWORDS.has(w))
  const prose = normalize([entry.purpose || '', ...(entry.useWhen || [])].join(' '))

  let score = 0
  if (n === q) score += 100
  if (hasPhrase(n, q)) score += 40
  if (hasPhrase(q, n) && n.length >= 3) score += 30
  if (c && (c === q || hasPhrase(q, c))) score += 10
  for (const w of words) {
    if (n === w) score += 25
    else if (hasPhrase(n, w)) score += 15
    else if (w.includes(n) && n.length >= 3) score += 12
    if (c.includes(w)) score += 4
    if (hasPhrase(prose, w)) score += 6
  }
  return score
}

const NORMALIZED_TERMS = Object.entries(COMPONENT_TERMS).flatMap(([key, terms]) =>
  terms.map((term) => ({ key, term: normalize(term) }))
)

function conceptHits(catalog, query) {
  const q = normalize(query)
  const hits = new Map()
  if (!q) return hits
  const words = contentWords(q)
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
  for (const [key, tokens] of covered) {
    if (hits.has(key)) continue
    const share = words.length ? words.filter((w) => tokens.has(w)).length / words.length : 0
    hits.set(key, Math.round(30 + 50 * Math.min(1, share)))
  }
  return hits
}

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

function marketingPageSections(catalog, intent) {
  return catalog.subpaths
    .filter((sub) => {
      const e = catalog.getEntry(sub)
      return e?.kind === 'component' && e.category === 'section'
    })
    .map((sub) => {
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
      return { sub, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.sub.localeCompare(b.sub))
}

export function searchComponents(catalog, query, { surface } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const q = String(query || '')
  const nq = normalize(q)
  const wantedSurface = surfaceOf(surface)
  const page = marketingPageIntent(q, wantedSurface)
  if (page) {
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
      hint: 'A marketing page is the shell/site block (get_block("shell/site")) filled with page sections: import each from its flat subpath, bind it with v-bind="section.props" and place it inside SectionContainer and SectionGap (rule webkit-sections).'
    }
  }
  const aliases = aliasHits(catalog, q)
  const concepts = conceptHits(catalog, q)
  const ranked = catalog.subpaths
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
    .map((r) => {
      const card = { ...searchCard(catalog, r.sub), score: r.score }
      if (normalize(r.sub) === nq || concepts.get(r.sub) === 90) card.exact = true
      const hit = aliases.get(r.sub)
      return hit
        ? {
            ...card,
            exact: hit.boost === 100,
            ...(hit.renamed ? { renamedFrom: hit.alias } : { aliasOf: hit.alias }),
            note: hit.renamed ? retiredNote(catalog, hit.alias).note : aliasNote(hit.alias, r.sub)
          }
        : card
    })

  return {
    ok: true,
    available: true,
    query: q,
    ...(wantedSurface ? { surface: wantedSurface } : {}),
    count: ranked.length,
    matches: ranked
  }
}

const PRODUCT_BONUS = 15
const SEARCHABLE_KINDS = new Set(['component', 'subcomponent'])

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

function tieBreak(catalog, a, b) {
  const product =
    Number(isProductEntry(catalog.getEntry(b))) - Number(isProductEntry(catalog.getEntry(a)))
  if (product) return product
  const uses = popularity(catalog)
  return (uses.get(b) ?? 0) - (uses.get(a) ?? 0) || a.localeCompare(b)
}

function isProductEntry(entry) {
  return (entry?.surface ?? 'app') === 'app'
}

function componentSuggestion(catalog, need, opts) {
  if (!catalog.available) return NOT_AVAILABLE
  const q = String(need || '')
  const search = searchComponents(catalog, q, opts)
  if (search.matches.length > 0) {
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

function exampleProps(props) {
  const scalar = (t) => /^('.*'|string|number|boolean)/.test(String(t || '').trim())
  const literalDefault = (p) => {
    const d = String(p.default ?? '').trim()
    if (d && d !== '—' && d !== "''" && d !== '[]' && d !== '{}') return d.replace(/^'|'$/g, '')
    const t = String(p.type || '').trim()
    if (/^'/.test(t)) return t.split('|')[0].trim().replace(/^'|'$/g, '')
    if (t === 'boolean') return true
    if (t === 'number') return 0
    return 'text'
  }

  const isRequired = (p) => ['true', 'yes'].includes(String(p.required).toLowerCase())

  const required = props.filter(isRequired)
  const leading = props.filter((p) => !isRequired(p) && scalar(p.type))
  const chosen = [...required, ...leading].slice(0, Math.max(required.length, 2)).slice(0, 3)

  return chosen.map((p) => {
    const t = String(p.type || '').trim()
    if (t === 'boolean') {
      const v = literalDefault(p)
      const on = v === true || v === 'true'
      return { name: p.name, attr: on ? p.name : null }
    }
    if (t === 'number') return { name: p.name, attr: `:${p.name}="${literalDefault(p)}"` }
    if (scalar(t)) {
      return { name: p.name, attr: `${p.name}="${literalDefault(p)}"` }
    }
    const isArray = /\[\]\s*$|^Array\s*<|^readonly\s/.test(t)
    const isFn = /=>|\bFunction\b/.test(t)
    const literal = isArray ? '[]' : isFn ? '() => {}' : '{}'
    return { name: p.name, attr: `:${p.name}="${literal}"` }
  })
}

export function getUsageExample(catalog, name, { fromStory = true } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const comp = getComponent(catalog, name)
  if (!comp.found) return comp

  if (fromStory && comp.examples.length) {
    const [example] = comp.examples
    return {
      ok: true,
      available: true,
      found: true,
      name: comp.name,
      binding: comp.binding,
      source: `example ${example.name}`,
      sfc: example.sfc,
      otherExamples: comp.examples.slice(1).map((ex) => ex.name),
      note: 'Taken from the component examples (the same SFC the docs site shows). get_component returns every example.'
    }
  }

  const tree = comp.treeShakeableImport
  const binding = pascalCase(subpathOf(catalog, tree))
  const importLine = `import ${binding} from '${tree}'`

  const attrs = exampleProps(comp.props)
    .map((p) => p.attr)
    .filter(Boolean)
  const hasDefaultSlot = comp.slots.some((s) => s.name === 'default' || s.name === '—' || !s.name)
  const openTag = attrs.length ? `<${binding} ${attrs.join(' ')}` : `<${binding}`

  let tag
  if (hasDefaultSlot) {
    tag = `${openTag}>${binding} content</${binding}>`
  } else {
    tag = `${openTag} />`
  }

  const sfc = `<script setup>\n${importLine}\n</script>\n\n<template>\n  ${tag}\n</template>\n`

  return {
    ok: true,
    available: true,
    found: true,
    name: comp.name,
    binding,
    import: importLine,
    sfc,
    note: comp.compoundRoot
      ? `${comp.name} is a compound root — sub-components (${(comp.subcomponents ?? [])
          .slice(0, 3)
          .join(', ')}${(comp.subcomponents ?? []).length > 3 ? ', ...' : ''}) compose inside it.`
      : undefined
  }
}

export function validateUsage(catalog, { import: importPath, classes, component } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const problems = []

  if (importPath != null && String(importPath).length) {
    const raw = String(importPath).trim()
    const bare = catalog.bare
    const prefix = catalog.prefix
    const isWebkit = raw === bare || raw.startsWith(prefix)
    if (!isWebkit) {
      problems.push({
        kind: 'import',
        severity: 'info',
        import: raw,
        message: `Not a @aziontech/webkit import — nothing to validate against the catalog.`
      })
    } else {
      const sub = raw === bare ? '' : raw.slice(prefix.length)
      const denied = catalog.deniedPrefixes.find((p) => raw.startsWith(p))
      if (denied) {
        problems.push({
          kind: 'import',
          severity: 'error',
          import: raw,
          message: `Denied import path (private internals): starts with "${denied}". Use a published export.`,
          suggestions: catalog.suggestSubpaths(sub)
        })
      } else if (!catalog.has(sub)) {
        const nearest = catalog.nearestPublishedPrefix(sub)
        problems.push({
          kind: 'import',
          severity: 'error',
          import: raw,
          message: `Unknown webkit export "${raw}".`,
          nearestPublishedPrefix: nearest ? `${prefix}${nearest}` : null,
          suggestions: catalog.suggestSubpaths(sub)
        })
      }
    }
  }

  if (component != null && String(component).length && classes != null && String(classes).length) {
    const key = String(component).trim()
    const entry = catalog.getEntry(key)
    if (entry && !entry.styleSeam) {
      const rejected = nonLayoutClasses(classes).filter((cls) => !isChartPaletteClass(cls))
      if (rejected.length) {
        problems.push({
          kind: 'style-override',
          severity: 'error',
          component: key,
          classes: rejected,
          allowed: [...LAYOUT_CLASS_FAMILIES],
          message: `Classes ${rejected.join(' ')} override the webkit component "${key}". Only layout utilities (${LAYOUT_CLASS_FAMILIES.join(', ')}) may go on its tag; move the rest to a wrapper element.`
        })
      }
    }
  }

  if (classes != null && String(classes).length) {
    const str = String(classes)
    for (const rule of catalog.tokenRules) {
      if (rule.re.test(str)) {
        problems.push({
          kind: 'token',
          severity: 'error',
          ruleId: rule.id,
          message: rule.message
        })
      }
    }
  }

  return { ok: problems.length === 0, available: true, problems }
}

export function sameVariant(a, b) {
  const key = (s) =>
    String(s || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
  return Boolean(a) && key(a) === key(b)
}

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-_/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function hasPhrase(haystack, phrase) {
  const h = ` ${haystack} `
  return h.includes(` ${phrase} `)
}

const NORMALIZED_GROUPS = SYNONYM_GROUPS.map((group) => [...new Set(group.map(normalize))])
const NORMALIZED_SCREEN_WORDS = SCREEN_WORDS.map(normalize)

function longestMatches(q, candidates) {
  const hits = candidates.filter((c) => c.term && hasPhrase(q, c.term))
  return hits.filter(
    (h) =>
      !hits.some(
        (o) => o.key !== h.key && o.term.length > h.term.length && hasPhrase(o.term, h.term)
      )
  )
}

function contentWords(q) {
  return q
    .split(' ')
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w) && !NORMALIZED_SCREEN_WORDS.includes(w))
}

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

const CARD_INTENTS = 5

function firstSentence(text) {
  const s = String(text || '').trim()
  const m = s.match(/^[\s\S]*?[.!?](?=\s|$)/)
  return (m ? m[0] : s).trim()
}

function blockCard(id, p, score) {
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
    ...(score != null ? { score } : {})
  }
}

const FRAGMENT_NOTE =
  'A card, not a page: drop this fragment into the page block that needs it; it is never a whole screen.'

function screenIntentOf(nq) {
  return SCREEN_WORDS.some((w) => hasPhrase(nq, normalize(w)))
}

const EXACT_BLOCK_SCORE = 1000

function blockRenders(catalog, id, name) {
  return (catalog.blocks[id]?.imports || []).some((imp) => {
    if (!imp.startsWith(catalog.prefix)) return false
    const used = imp.slice(catalog.prefix.length)
    return used === name || (RENDERS_THROUGH[used] || []).includes(name)
  })
}

function isExactBlock(id, p, q) {
  return [id, id.split('/').pop(), p.name].some((s) => normalize(s) === q)
}

function scoreBlock(id, p, { q, groups, generic, words }) {
  const intents = (p.intents || []).map(normalize)
  const nameText = normalize(`${id} ${p.name}`)
  const components = normalize((p.components || []).join(' '))
  const summary = normalize(p.summary)
  const phraseScore = (phrase, exact = 100) => {
    let s = 0
    if (intents.includes(phrase)) s += exact
    else if (
      intents.some((i) => hasPhrase(i, phrase) || (phrase.length >= 4 && hasPhrase(phrase, i)))
    )
      s += 60
    if (hasPhrase(nameText, phrase)) s += 40
    return s
  }
  const genericScreen = (phrase) =>
    NORMALIZED_SCREEN_WORDS.some((w) => intents.includes(`${phrase} ${w}`))
  let score = isExactBlock(id, p, q) ? EXACT_BLOCK_SCORE : 0
  score += phraseScore(q, 160)
  for (const group of groups) {
    score += 0.8 * Math.max(0, ...group.map((t) => phraseScore(t)))
    if (generic && group.some(genericScreen)) score += 15
  }
  for (const w of words) {
    if (intents.some((i) => hasPhrase(i, w))) score += 12
    if (hasPhrase(nameText, w)) score += 10
    if (hasPhrase(components, w)) score += 4
    if (hasPhrase(summary, w)) score += 2
  }
  return Math.round(score)
}

function surfaceOf(wanted) {
  return wanted ? String(wanted).toLowerCase().trim() : null
}

export function searchBlocks(catalog, query, { surface, fragments } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const wantedSurface = surfaceOf(surface)
  const raw = String(query || '').trim()
  const nq = normalize(raw)
  const hideFragments = fragments === false || (fragments !== true && screenIntentOf(nq))
  const entries = Object.entries(catalog.blocks || {})
    .filter(([, p]) => !wantedSurface || (p.surface ?? 'app') === wantedSurface)
    .filter(([id, p]) => !hideFragments || p.kind !== 'fragment' || isExactBlock(id, p, nq))
  const scope = wantedSurface ? { surface: wantedSurface } : {}
  if (!raw) {
    return {
      ok: true,
      available: true,
      query: raw,
      ...scope,
      count: entries.length,
      matches: entries.map(([id, p]) => blockCard(id, p))
    }
  }
  const expanded = expandQuery(raw)
  const page = marketingPageIntent(raw, wantedSurface)
  const pageBoost = (id, p) =>
    page && (p.surface ?? 'app') === 'site' ? 120 + (id.startsWith('shell/') ? 40 : 0) : 0
  const matches = entries
    .map(([id, p]) => ({ id, p, score: scoreBlock(id, p, expanded) + pageBoost(id, p) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, 5)
    .map((r) => blockCard(r.id, r.p, r.score))
  return {
    ok: true,
    available: true,
    query: raw,
    ...scope,
    count: matches.length,
    matches,
    hint: matches.length
      ? 'Call get_block with the best id, read its guidelines, copy its SFC and change only the content (copy, data, handlers). Keep the components, their order and the classes.'
      : 'No block matches. Build from components: suggest_component, then get_component.'
  }
}

function movedBlock(catalog, key, variant) {
  const aliases = catalog.blockAliases || {}
  const n = normalize(key)
  const from = aliases[key]
    ? key
    : Object.keys(aliases).find(
        (old) => !old.includes('#') && normalize(old.split('/').pop()) === n
      )
  if (!from) return null
  const variantAlias = variant
    ? Object.keys(aliases).find((old) => {
        const [base, state] = old.split('#')
        return base === from && state && sameVariant(state, variant)
      })
    : null
  const renamed = variantAlias ? aliases[variantAlias] : null
  const [id, state] = (renamed || aliases[from]).split('#')
  return { from, id, variant: renamed ? state : variant || state || null }
}

function movedNote(moved, p) {
  const state = moved.variant && moved.variant !== p.primary ? `, state "${moved.variant}"` : ''
  return `Block "${moved.from}" was renamed in WebKit v6: it is now "${moved.id}"${state}. Use the new id.`
}

const BLOCK_SECTIONS = ['sfc', 'guidelines']

export function getBlock(catalog, id, { variant, sections } = {}) {
  const wanted = Array.isArray(sections) && sections.length ? sections : BLOCK_SECTIONS
  const omitted = BLOCK_SECTIONS.filter((k) => !wanted.includes(k))
  if (!catalog.available) return NOT_AVAILABLE
  const blocks = catalog.blocks || {}
  const key = String(id || '').trim()
  let resolved = blocks[key] ? key : null
  if (!resolved) {
    const n = normalize(key)
    resolved =
      Object.keys(blocks).find((pid) => normalize(pid.split('/').pop()) === n) ||
      Object.keys(blocks).find((pid) => normalize(blocks[pid].name) === n) ||
      null
  }
  const moved = resolved ? null : movedBlock(catalog, key, variant)
  if (moved && blocks[moved.id]) {
    resolved = moved.id
    variant = moved.variant || undefined
  }
  if (!resolved) {
    const search = searchBlocks(catalog, key)
    return {
      ok: false,
      available: true,
      found: false,
      id: key,
      suggestions: (search.matches || []).slice(0, 3).map((m) => m.id),
      message: `No block "${key}". Use search_blocks to find one by intent.`
    }
  }
  const p = catalog.block(resolved)
  const isPrimary = sameVariant(variant, p.primary)
  const chosen =
    variant && !isPrimary ? (p.variants || []).find((v) => sameVariant(v.name, variant)) : null
  if (variant && !isPrimary && !chosen) {
    return {
      ok: false,
      available: true,
      found: false,
      id: resolved,
      variants: [p.primary, ...(p.variants || []).map((v) => v.name)],
      message: `Block "${resolved}" has no variant "${variant}".`
    }
  }
  return {
    ok: true,
    available: true,
    found: true,
    id: resolved,
    name: p.name,
    summary: p.summary,
    intents: p.intents || [],
    ...(p.steps ? { steps: p.steps } : {}),
    components: p.components || [],
    imports: p.imports || [],
    skills: p.skills || [],
    source: p.source,
    surface: p.surface ?? 'app',
    ...(p.kind === 'fragment' ? { kind: 'fragment', fragmentNote: FRAGMENT_NOTE } : {}),
    ...(moved ? { movedFrom: moved.from, note: movedNote(moved, p) } : {}),
    variant: chosen ? chosen.name : p.primary,
    ...(wanted.includes('sfc') ? { sfc: chosen ? chosen.sfc : p.sfc } : {}),
    ...(wanted.includes('sfc') && p.files ? { files: p.files } : {}),
    variants: [
      { name: p.primary, summary: 'primary' },
      ...(p.variants || []).map((v) => ({ name: v.name, summary: v.summary }))
    ],
    ...(p.guidelines && wanted.includes('guidelines') ? { guidelines: p.guidelines } : {}),
    ...(omitted.length
      ? {
          omitted,
          omittedNote: `Call get_block again with sections ${JSON.stringify(omitted)} for the rest.`
        }
      : {}),
    howToUse: p.guidelines
      ? "Read `guidelines` first: when to use this screen and when not, what each building block is for, do and don't, the copy rules and the accessibility rules. Then copy this SFC as the starting point of the screen and change only the content (copy, data, handlers, routes), following the guidelines. A block with `files` takes its data through typed props and emits its actions: copy each file next to the SFC (`webkit add` does it and fixes the imports), pass your records, `loading` and `error` as props, and handle the events; a variant imports the primary SFC and only passes it other props. Keep the components, their order, the props and the classes: they are the reviewed Azion layout. Pass `variant` to get another state of the same screen. Follow the listed skills."
      : 'Copy this SFC as the starting point of the screen and change only the content (copy, data, handlers, routes). Keep the components, their order, the props and the classes: they are the reviewed Azion layout. Pass `variant` to get another state of the same screen. Follow the listed skills.'
  }
}

function sectionSuggestion(catalog, need) {
  const q = normalize(need)
  const words = contentWords(q)
  const aliases = aliasHits(catalog, need)
  const concepts = conceptHits(catalog, need)
  const ranked = catalog.subpaths
    .filter((sub) => {
      const e = catalog.getEntry(sub)
      return e?.kind === 'component' && e.category === 'section'
    })
    .map((sub) => {
      const e = catalog.getDetails(sub)
      const name = normalize(sub)
      const prose = normalize([e.purpose || '', ...(e.useWhen || [])].join(' '))
      let score = (aliases.get(sub)?.boost ?? 0) + (concepts.get(sub) ?? 0)
      for (const w of words) {
        if (hasPhrase(name, w)) score += 20
        else if (name.includes(w)) score += 10
        if (hasPhrase(prose, w)) score += 3
      }
      return { sub, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.sub.localeCompare(b.sub))
  return ranked
}

export function suggestComponent(catalog, need, { surface } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const q = String(need || '')
  const nq = normalize(q)
  const wantedSurface = surfaceOf(surface)
  const opts = wantedSurface ? { surface: wantedSurface } : {}
  const isMarketing =
    wantedSurface === 'site' ||
    (!wantedSurface && MARKETING_WORDS.some((w) => hasPhrase(nq, normalize(w))))
  const component = componentSuggestion(catalog, q, opts)

  const page = marketingPageIntent(q, wantedSurface)
  if (page && !page.words.length) {
    const blocks = searchBlocks(catalog, q, opts)
    const topBlock = blocks.matches?.[0]
    if (topBlock) {
      return {
        ok: true,
        available: true,
        need: q,
        found: true,
        recommendation: 'block',
        block: topBlock,
        blockAlternatives: blocks.matches.slice(1, 3),
        hint: `A marketing page starts from the website shell: call get_block("${topBlock.id}") and copy its SFC, then fill the frame with page sections (the components below, in page order: the hero band first, the closing call to action last).`,
        best: component.best,
        alternatives: component.alternatives
      }
    }
  }

  if (isMarketing) {
    const sections = sectionSuggestion(catalog, q)
    if (sections.length) {
      const [best, ...rest] = sections
      return {
        ...component,
        recommendation: 'section',
        best: { ...componentCard(catalog, best.sub), score: best.score },
        alternatives: rest
          .slice(0, 3)
          .map((r) => ({ ...componentCard(catalog, r.sub), score: r.score })),
        found: true,
        hint: 'A marketing band is a page section: import it from its flat subpath (@aziontech/webkit/<name>, the site JSON _id), bind it with v-bind="section.props" and place it inside SectionContainer and SectionGap (rule webkit-sections).'
      }
    }
  }

  const blocks = searchBlocks(catalog, q, opts)
  const topBlock = blocks.matches?.[0]
  const screenIntent = screenIntentOf(nq)
  const exactComponent =
    component.best &&
    (component.best.exact === true ||
      normalize(component.best.name) === nq ||
      normalize(component.best.aliasOf ?? component.best.renamedFrom ?? '') === nq)
  const exactBlock = topBlock && topBlock.score >= EXACT_BLOCK_SCORE
  const namedComponent =
    !screenIntent &&
    component.best &&
    conceptHits(catalog, q).has(component.best.name) &&
    !blockRenders(catalog, topBlock?.id, component.best.name)
  if (
    topBlock &&
    (exactBlock || (!exactComponent && !namedComponent)) &&
    (screenIntent ? topBlock.score >= 25 : topBlock.score >= 60)
  ) {
    return {
      ok: true,
      available: true,
      need: q,
      found: true,
      recommendation: 'block',
      block: topBlock,
      blockAlternatives: blocks.matches.slice(1, 3),
      hint:
        topBlock.kind === 'fragment'
          ? `This is a card, not a page: call get_block("${topBlock.id}") and drop its SFC into the page block that needs it.`
          : `This is a screen: start from the block. Call get_block("${topBlock.id}") and copy its SFC; use the components below only for pieces the block does not cover.`,
      best: component.best,
      alternatives: component.alternatives
    }
  }
  return { ...component, recommendation: 'component' }
}
