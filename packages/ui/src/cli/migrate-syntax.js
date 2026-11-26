import { existsSync, readFileSync } from 'node:fs'

export const PREFIX = '@aziontech/webkit/'

export const SUBPATH_LITERAL = /(['"`])@aziontech\/webkit\/([^'"`\s]+)\1/g

export const readJson = (file) => (existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {})

export const kebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()

export const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const pascalCase = (s) => s.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase())

const stripType = (text) => text.replace(/^\s*type\s+(?=[\w${])/, '')

export function webkitImports(source) {
  const out = []
  const re = /import\s+([\w$\s{},*]+?)\s+from\s+(['"])@aziontech\/webkit\/([^'"]+)\2/g
  for (const m of source.matchAll(re)) {
    const clause = stripType(m[1])
    const names = []
    const named = []
    const def = clause.match(/^\s*([A-Za-z_$][\w$]*)/)
    if (def) names.push(def[1])
    const braces = clause.match(/\{([\s\S]*?)\}/)
    if (braces) {
      for (const part of braces[1].split(',')) {
        const [imported, alias] = stripType(part.trim()).split(/\s+as\s+/)
        if (!imported) continue
        const local = (alias || imported).trim()
        names.push(local)
        named.push({ imported: imported.trim(), local })
      }
    }
    out.push({ subpath: m[3], names, named, statement: m[0] })
  }
  return out
}

function commentRanges(source) {
  const ranges = []
  const re = /<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|(?:^|(?<=[\s;{}(),]))\/\/[^\n]*/gm
  for (const m of source.matchAll(re)) ranges.push([m.index, m.index + m[0].length])
  return ranges
}

export function replaceOutsideComments(source, re, replace) {
  const ranges = commentRanges(source)
  const inComment = (i) => ranges.some(([start, end]) => i >= start && i < end)
  return source.replace(re, (...args) => {
    const offset = args.find((a) => typeof a === 'number')
    return inComment(offset) ? args[0] : replace(...args)
  })
}

export function scanTag(source, start) {
  let quote = null
  let depth = 0
  for (let i = start; i < source.length; i++) {
    const ch = source[i]
    if (quote) {
      if (ch === quote) quote = null
    } else if (ch === '"' || ch === "'") {
      quote = ch
    } else if (ch === '{') {
      depth += 1
    } else if (ch === '}') {
      depth = Math.max(0, depth - 1)
    } else if (ch === '>' && depth === 0) {
      return i
    }
  }
  return -1
}
