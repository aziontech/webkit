const PKG_PREFIX = '@aziontech/webkit/'

export const EXAMPLES_PER_COMPONENT = 3
export const EXAMPLE_MAX_CHARS = 8000

export function kebab(segment) {
  return String(segment)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

export function patternIdFromTitle(title) {
  const parts = String(title || '')
    .split('/')
    .map((p) => p.trim())
    .filter(Boolean)
  if (parts[0] === 'Templates') parts.shift()
  return parts.map(kebab).join('/')
}

export function importsOf(sfc) {
  const out = []
  for (const m of String(sfc).matchAll(/^\s*import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/gm)) {
    const source = m[2]
    if (!source.startsWith(PKG_PREFIX)) continue
    const clause = m[1].trim()
    const def = clause.match(/^([A-Za-z_$][\w$]*)/)
    out.push({ binding: def ? def[1] : null, subpath: source.slice(PKG_PREFIX.length) })
  }
  return out
}
