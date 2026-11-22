import { LAYOUT_CLASS_FAMILIES } from '../../eslint-plugin/lib/layout-classes.js'
import { aliasNote, resolveAlias, retiredNote } from '../lib/name-matches.js'
import {
  componentCard,
  deprecationOf,
  noExport,
  NOT_AVAILABLE,
  pickWithDefaults,
  subpathOf
} from '../lib/results.js'
import { pascalCase } from '../lib/text.js'
import { assetsFor } from './assets.js'

const GUIDANCE_DEFAULTS = {
  purpose: null,
  setup: null,
  useWhen: [],
  avoidWhen: [],
  related: [],
  bestPractices: []
}

function lowerOrNull(value) {
  return value ? String(value).toLowerCase() : null
}

function matchesFilters(catalog, sub, category, surface) {
  const e = catalog.getEntry(sub)
  if (e?.kind !== 'component') return false
  if (category && (e.category || '').toLowerCase() !== category) return false
  return !surface || e.surface === surface
}

function pageOf(items, limit, cursor) {
  const start = Math.max(0, Number.parseInt(cursor ?? '0', 10) || 0)
  const size = limit > 0 ? Math.floor(limit) : items.length
  const page = items.slice(start, start + size)
  return { start, page, next: start + page.length }
}

export function listComponents(catalog, { category, surface, limit, cursor } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const wanted = lowerOrNull(category)
  const wantedSurface = lowerOrNull(surface)
  const components = catalog.subpaths
    .filter((sub) => matchesFilters(catalog, sub, wanted, wantedSurface))
    .map((sub) => componentCard(catalog, sub))
    .sort((a, b) => a.name.localeCompare(b.name))
  const { start, page, next } = pageOf(components, limit, cursor)
  const more = next < components.length
  return {
    ok: true,
    available: true,
    version: catalog.version,
    count: components.length,
    ...(wanted ? { category: wanted } : {}),
    ...(wantedSurface ? { surface: wantedSurface } : {}),
    ...(start || more ? { cursor: String(start) } : {}),
    ...(more ? { nextCursor: String(next) } : {}),
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

function unknownComponent(catalog, key) {
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
  return noExport(catalog, key, retired ? retired.note : undefined)
}

function componentDetails(catalog, key, e) {
  return {
    ok: true,
    available: true,
    found: true,
    name: key,
    binding: pascalCase(key),
    ...deprecationOf(e),
    kind: e.kind,
    ...pickWithDefaults(e, { category: null, surface: null, channels: null, structure: null }),
    import: e.import,
    treeShakeableImport: e.treeShakeableImport ?? e.import,
    ...pickWithDefaults(e, { compoundRoot: false, subcomponents: [], parent: null, rootOf: null }),
    ...pickWithDefaults(e, GUIDANCE_DEFAULTS),
    ...pickWithDefaults(e, { props: [], events: [], slots: [] }),
    examples: catalog.examples(key),
    assets: assetsFor(catalog, key),
    allowedClasses: allowedClassesFor(e)
  }
}

export function getComponent(catalog, name) {
  if (!catalog.available) return NOT_AVAILABLE
  const key = String(name || '').trim()
  const e = catalog.getDetails(key)
  return e ? componentDetails(catalog, key, e) : unknownComponent(catalog, key)
}

export function getBestPractices(catalog, name) {
  if (!catalog.available) return NOT_AVAILABLE
  const key = String(name || '').trim()
  const e = catalog.getDetails(key)
  if (!e) return noExport(catalog, key)
  return {
    ok: true,
    available: true,
    found: true,
    name: key,
    ...pickWithDefaults(e, GUIDANCE_DEFAULTS)
  }
}

function compoundImportNote(catalog, key, e, binding) {
  const subs = e.subcomponents ?? []
  const subExample = subs[0] ?? `${catalog.prefix}name-part`
  if (e.treeShakeableImport == null || e.treeShakeableImport === e.import) {
    return {
      subcomponents: subs,
      note:
        `${key} owns sub-components (e.g. ${subExample}). The import above is already the lean ` +
        `root; import each sub-component from its own subpath as needed.`
    }
  }
  const compoundBinding = pascalCase(key)
  const part = pascalCase(subpathOf(catalog, subExample).replace(`${key}-`, ''))
  return {
    compoundAlternative: {
      import: `import ${compoundBinding} from '${e.import}'`,
      importPath: e.import,
      binding: compoundBinding,
      note:
        `The compound import (${e.import}) attaches every sub-component for dot-notation ` +
        `(${compoundBinding}.${part}, …); it is the form the examples and blocks use. It keeps ` +
        `every sub-component in the bundle even when you render only the root.`,
      subcomponents: subs
    },
    note:
      `${key} is a compound root. When you render its parts with dot-notation, import the ` +
      `compound (${compoundBinding}). The import above is the root alone, bound as ${binding}: ` +
      `it has no dot-notation parts, so import each part you render from its own subpath ` +
      `(e.g. ${subExample}).`
  }
}

export function getImport(catalog, name) {
  if (!catalog.available) return NOT_AVAILABLE
  const key = String(name || '').trim()
  const e = catalog.getEntry(key)
  if (!e) return noExport(catalog, key)
  const tree = e.treeShakeableImport ?? e.import
  const binding = pascalCase(subpathOf(catalog, tree))
  return {
    ok: true,
    available: true,
    found: true,
    name: key,
    binding,
    import: `import ${binding} from '${tree}'`,
    importPath: tree,
    treeShakeable: e.treeShakeableImport != null,
    ...(e.compoundRoot ? compoundImportNote(catalog, key, e, binding) : {})
  }
}
