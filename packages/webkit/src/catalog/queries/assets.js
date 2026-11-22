import { NOT_AVAILABLE } from '../lib/results.js'
import { normalize } from '../lib/text.js'

const ASSET_KIND_ALIASES = {
  illustration: 'illustrations',
  illustrations: 'illustrations',
  scene: 'illustrations',
  diagram: 'diagrams',
  diagrams: 'diagrams',
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

function kindMeta(catalog, kind) {
  const { file: _file, items: _items, ...meta } = catalog.assets[kind]
  return meta
}

function assetKinds(catalog, kinds, words) {
  return {
    ok: true,
    available: true,
    kinds: kinds.map((k) => {
      const matches = words.length
        ? catalog.assetItems(k).filter((item) => assetMatches(item, words)).length
        : undefined
      return { kind: k, ...kindMeta(catalog, k), ...(matches != null ? { matches } : {}) }
    }),
    hint:
      'Call list_assets with a kind ("illustrations", "diagrams", "brandMarks", "icons") for every ' +
      'valid name, and a query to filter by name, label or keyword. Never guess a name from a file ' +
      'in src/: an unregistered name renders a placeholder or nothing.'
  }
}

export function listAssets(catalog, { kind, query } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const kinds = Object.keys(catalog.assets || {})
  const words = normalize(query).split(' ').filter(Boolean)
  if (kind == null || !String(kind).trim()) return assetKinds(catalog, kinds, words)
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
  const all = catalog.assetItems(resolved)
  const items = words.length ? all.filter((item) => assetMatches(item, words)) : all
  return {
    ok: true,
    available: true,
    found: true,
    kind: resolved,
    ...kindMeta(catalog, resolved),
    ...(words.length ? { query: String(query) } : {}),
    count: items.length,
    items
  }
}

export function assetsFor(catalog, name) {
  return Object.entries(catalog.assets || {})
    .filter(([, meta]) => (meta.usedBy || []).includes(name))
    .map(([kind, meta]) => ({
      kind,
      title: meta.title,
      count: meta.count,
      list: `list_assets({ kind: "${kind}" })`
    }))
}
