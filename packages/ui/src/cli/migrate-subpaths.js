import { PREFIX, SUBPATH_LITERAL } from './migrate-syntax.js'

function matchComponent(subpath, components) {
  for (const [from, rule] of Object.entries(components)) {
    if (subpath === from) return { from, rule }
  }
  for (const [from, rule] of Object.entries(components)) {
    const extendsFrom = rule.to.startsWith(`${from}-`)
    const alreadyNew = extendsFrom && (subpath === rule.to || subpath.startsWith(`${rule.to}-`))
    if (subpath.startsWith(`${from}-`) && !alreadyNew) return { from, rule }
  }
  return null
}

export function renameSubpath(subpath, components) {
  const match = matchComponent(subpath, components)
  return match ? match.rule.to + subpath.slice(match.from.length) : subpath
}

export function legacyFor(migration, fromMajor) {
  const { legacy } = migration
  if (!legacy || fromMajor == null || fromMajor > legacy.major) return null
  return legacy
}

function isExport(subpath, exports) {
  if (!exports) return true
  return exports.has(subpath) || exports.has(subpath.replace(/\.(vue|js|ts|css)$/, ''))
}

export function resolveSubpath(subpath, migration, legacy, fromMajor) {
  const { components, removed, exports } = migration
  if (legacy && legacy.manual[subpath]) {
    return {
      next: subpath,
      manual: true,
      warning: `${PREFIX}${subpath} is a v${fromMajor} component with a different API in v6: ${legacy.manual[subpath]}`
    }
  }
  const base = (legacy && legacy.paths[subpath]) || subpath
  const match = matchComponent(base, components)
  const next = match ? match.rule.to + base.slice(match.from.length) : base
  if (removed[base]) {
    return { next, base, match, warning: `${PREFIX}${base} was removed in v6: ${removed[base]}` }
  }
  if (!isExport(next, exports)) {
    return {
      next,
      base,
      match,
      manual: true,
      warning: `${PREFIX}${next} is not an export of v6: find its replacement in the catalog (MIGRATION_V6.md)`
    }
  }
  return { next, base, match }
}

export function legacyMarkers(migration) {
  const { legacy, exports, components, removed } = migration
  if (!legacy) return new Set()
  const known = new Set([...(exports || []), ...Object.keys(components), ...Object.keys(removed)])
  return new Set(
    [...Object.keys(legacy.paths), ...Object.keys(legacy.manual)].filter((key) => !known.has(key))
  )
}

export function referencedSubpaths(source) {
  return new Set([...source.matchAll(SUBPATH_LITERAL)].map((m) => m[2]))
}
