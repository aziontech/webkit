export const TYPES_DIR = 'types'
export const CSS_TYPES = `./${TYPES_DIR}/css.d.ts`

export function exportTarget(entry) {
  if (typeof entry === 'string') return entry
  if (entry && typeof entry === 'object' && typeof entry.default === 'string') return entry.default
  return ''
}

export function typesFor(target) {
  if (!target.startsWith('./src/')) return null
  const rel = target.slice('./src/'.length)
  if (rel.endsWith('.vue')) return `./${TYPES_DIR}/${rel}.d.ts`
  if (/\.(ts|js)$/.test(rel) && !rel.endsWith('.d.ts')) {
    return `./${TYPES_DIR}/${rel.replace(/\.(ts|js)$/, '.d.ts')}`
  }
  if (rel.endsWith('.css')) return CSS_TYPES
  return null
}

export function typedEntry(entry) {
  const target = exportTarget(entry)
  const types = typesFor(target)
  return types ? { types, default: target } : target
}

export function typedExports(exportsMap) {
  return Object.fromEntries(
    Object.entries(exportsMap).map(([key, entry]) => [key, typedEntry(entry)])
  )
}

export function typesTargets(exportsMap) {
  return [
    ...new Set(
      Object.values(exportsMap)
        .map((entry) => (entry && typeof entry === 'object' ? entry.types : null))
        .filter(Boolean)
    )
  ]
}
