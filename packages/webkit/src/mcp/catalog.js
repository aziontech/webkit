import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const CANDIDATE_PKGS = ['@aziontech/webkit']
const DEFAULT_PKG = CANDIDATE_PKGS[0]

export function isWebkitBare(src) {
  return typeof src === 'string' && CANDIDATE_PKGS.includes(src)
}

let cache = null
let warned = false

function resolveCatalogPath(cwd) {
  if (process.env.WEBKIT_CATALOG_PATH) return process.env.WEBKIT_CATALOG_PATH
  const require = createRequire(join(cwd || process.cwd(), '__webkit_resolve__.js'))
  for (const pkg of CANDIDATE_PKGS) {
    try {
      return require.resolve(`${pkg}/catalog.json`)
    } catch {}
    try {
      return join(dirname(require.resolve(`${pkg}/package.json`)), 'catalog.json')
    } catch {}
  }
  return null
}

function warnOnce(message) {
  if (warned) return
  warned = true
  process.stderr.write(`[webkit-mcp] ${message}\n`)
}

function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  if (!m) return n
  if (!n) return m
  const prev = new Array(n + 1)
  const curr = new Array(n + 1)
  for (let j = 0; j <= n; j++) prev[j] = j
  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j]
  }
  return prev[n]
}

function build(json) {
  const imports = json.imports || {}
  const subpaths = Object.keys(imports)
  const set = new Set(subpaths)
  const tokenRules = (json.tokenRules || []).map((r) => ({
    id: r.id,
    re: new RegExp(r.pattern, (r.flags || '').replace('g', '')),
    message: r.message
  }))

  const pkg = json.package || DEFAULT_PKG

  return {
    available: true,
    package: pkg,
    prefix: `${pkg}/`,
    bare: pkg,
    version: json.webkitVersion || null,
    deniedPrefixes: json.deniedPrefixes || [],
    tokenRules,
    tokens: json.tokens || { cssVars: [], typography: [], groups: {} },
    vocabulary: json.vocabulary || null,
    subpaths,
    imports,
    has: (sub) => set.has(sub),
    getEntry: (sub) => imports[sub] || null,
    nearestPublishedPrefix(sub) {
      if (!sub.includes('/')) return null
      const parts = sub.split('/')
      for (let i = parts.length - 1; i > 0; i--) {
        const cand = parts.slice(0, i).join('/')
        if (set.has(cand)) return cand
      }
      return null
    },
    suggestSubpaths(sub) {
      const scored = []
      for (const s of subpaths) {
        const d = levenshtein(sub, s)
        if (d <= 2) scored.push([d, s])
      }
      return scored
        .sort((a, b) => a[0] - b[0] || a[1].length - b[1].length)
        .slice(0, 3)
        .map((x) => x[1])
    }
  }
}

function empty() {
  return {
    available: false,
    package: DEFAULT_PKG,
    prefix: `${DEFAULT_PKG}/`,
    bare: DEFAULT_PKG,
    version: null,
    deniedPrefixes: [],
    tokenRules: [],
    tokens: { cssVars: [], typography: [], groups: {} },
    subpaths: [],
    imports: {},
    has: () => false,
    getEntry: () => null,
    nearestPublishedPrefix: () => null,
    suggestSubpaths: () => []
  }
}

export function loadCatalog(cwd) {
  const path = resolveCatalogPath(cwd)
  if (cache && cache.path === path) return cache.value
  let value
  if (!path) {
    value = empty()
    warnOnce(
      'could not resolve a webkit catalog.json — answers will degrade to "not available". ' +
        'Install @aziontech/webkit, or set WEBKIT_CATALOG_PATH.'
    )
  } else {
    try {
      value = build(JSON.parse(readFileSync(path, 'utf-8')))
    } catch (err) {
      value = empty()
      warnOnce(
        `failed to read the webkit catalog at ${path} (${err.message}) — answers will degrade to "not available".`
      )
    }
  }
  cache = { path, value }
  return value
}

export function _resetCatalogCache() {
  cache = null
  warned = false
}

export const WEBKIT_PREFIX = `${DEFAULT_PKG}/`
export const WEBKIT_BARE = DEFAULT_PKG
