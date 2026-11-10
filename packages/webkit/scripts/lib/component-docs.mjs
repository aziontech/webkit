export const COMPONENT_DOC_FIELDS = [
  ['purpose', 'Purpose'],
  ['useWhen', 'When to use'],
  ['avoidWhen', 'When NOT to use']
]

export function missingComponentDocs(imports) {
  const missing = []
  for (const [subpath, entry] of Object.entries(imports)) {
    if (entry.kind !== 'component') continue
    const gaps = COMPONENT_DOC_FIELDS.filter(([field]) => {
      const value = entry[field]
      return Array.isArray(value) ? value.length === 0 : !value
    }).map(([, heading]) => heading)
    if (gaps.length) missing.push(`${subpath}: ${gaps.join(', ')}`)
  }
  return missing
}
