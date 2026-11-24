import { pascalCase } from './text.js'

export const NOT_AVAILABLE = {
  ok: false,
  available: false,
  message:
    '@aziontech/webkit is not installed in this project (or its catalog.json is not resolvable). ' +
    'Install @aziontech/webkit, or set WEBKIT_CATALOG_PATH to its catalog.json.'
}

export function subpathOf(catalog, importPath) {
  const prefix = catalog.prefix
  const s = String(importPath || '')
  return s.startsWith(prefix) ? s.slice(prefix.length) : s
}

export function surfaceOf(wanted) {
  return wanted ? String(wanted).toLowerCase().trim() : null
}

export function deprecationOf(entry) {
  if (!entry?.deprecated) return {}
  return {
    deprecated: true,
    ...(entry.deprecation ? { deprecation: entry.deprecation } : {}),
    ...(entry.replacedBy ? { replacedBy: entry.replacedBy } : {})
  }
}

export const PREVIEW_NOTE =
  'Preview: the API (props, events, slots, parts) may still change in a minor release, named in the changelog, before the owner marks it GA. Tell the user, and pin the WebKit version if they need it frozen.'

export function stabilityOf(entry) {
  return entry?.stability === 'preview' ? { stability: 'preview', stabilityNote: PREVIEW_NOTE } : {}
}

export function pickWithDefaults(entry, defaults) {
  return Object.fromEntries(
    Object.entries(defaults).map(([key, fallback]) => [
      key,
      entry[key] ?? (Array.isArray(fallback) ? [] : fallback)
    ])
  )
}

export function componentCard(catalog, name) {
  const e = catalog.getEntry(name)
  if (!e) return null
  return {
    name,
    ...pickWithDefaults(e, { category: null, surface: null, structure: null }),
    import: e.import,
    treeShakeableImport: e.treeShakeableImport ?? e.import,
    binding: pascalCase(name),
    ...deprecationOf(e),
    ...stabilityOf(e)
  }
}

export function noExport(catalog, key, message = `No webkit export named "${key}".`) {
  return {
    ok: false,
    available: true,
    found: false,
    name: key,
    suggestions: catalog.suggestSubpaths(key),
    message
  }
}

export function isSectionComponent(catalog, sub) {
  const e = catalog.getEntry(sub)
  return e?.kind === 'component' && e.category === 'section'
}
