const WORD = /(?<![\w-])-{0,2}[A-Za-z][\w-]*/g
const RTL_SWAP = /rtl:[\w:[\]=-]*animate-slide-(?:in|out)-(?:left|right)(?![\w-])/
const THEME_IMPORT =
  /import\s+(\{[^}]*\})\s+from\s+(['"])(@aziontech\/theme\/[\w-]+)\2|(['"])(@aziontech\/theme\/[\w-]+)\4/g

function wordMap(tokens) {
  const map = new Map()
  for (const [from, to] of Object.entries(tokens.variables || {})) map.set(`--${from}`, `--${to}`)
  for (const [from, to] of Object.entries(tokens.classes || {})) map.set(from, to)
  return map
}

function renameImportNames(clause, names) {
  return clause.replace(/\{([^}]*)\}/, (all, body) => {
    const parts = body.split(',').map((part) => {
      const [imported, alias] = part.trim().split(/\s+as\s+/)
      const to = names[imported]
      if (!imported || !to) return part
      const lead = part.match(/^\s*/)[0]
      const tail = part.match(/\s*$/)[0]
      return `${lead}${to} as ${alias || imported}${tail}`
    })
    return `{${parts.join(',')}}`
  })
}

function migrateThemeImports(source, imports, changes) {
  if (!source.includes('@aziontech/theme/')) return source
  return source.replace(THEME_IMPORT, (all, clause, quote, path, bareQuote, barePath) => {
    const from = path || barePath
    const rule = imports[from]
    if (!rule) return all
    changes.push(`${from} → ${rule.to}`)
    if (!clause) return `${bareQuote}${rule.to}${bareQuote}`
    return `import ${renameImportNames(clause, rule.names || {})} from ${quote}${rule.to}${quote}`
  })
}

export function migrateTokens(source, tokens = {}) {
  const changes = []
  const warnings = []
  const map = wordMap(tokens)
  const removed = tokens.removed || {}
  if (!map.size && !Object.keys(removed).length && !tokens.imports) {
    return { source, changes, warnings }
  }
  if (RTL_SWAP.test(source)) {
    warnings.push(
      'an rtl: variant swaps a slide animation by hand: the start/end animations flip with the reading direction, so drop the rtl: class after the rename'
    )
  }
  let out = source.replace(WORD, (word) => {
    const to = map.get(word)
    if (to) {
      changes.push(`${word} → ${to}`)
      return to
    }
    if (Object.hasOwn(removed, word)) warnings.push(`${word} was removed in v6: ${removed[word]}`)
    return word
  })
  out = migrateThemeImports(out, tokens.imports || {}, changes)
  return { source: out, changes: [...new Set(changes)], warnings: [...new Set(warnings)] }
}
