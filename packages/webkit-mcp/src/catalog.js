// Version-locked catalog loader for the webkit MCP server.
//
// Resolves `@aziontech/webkit/catalog.json` from the CONSUMING project's node_modules
// (so every tool answer — allowed imports, props/events/slots, token rules — always
// matches the webkit version that project installed). Fail-open: if webkit (or its
// catalog) is not resolvable, the catalog reports `available: false` and every query
// degrades to a helpful "not available" answer instead of crashing the server.
//
// Test / monorepo-dogfood override: set WEBKIT_CATALOG_PATH to an explicit file.
//
// This mirrors the loader pattern in @aziontech/eslint-plugin-webkit so the two
// tools always read the catalog the same way.

import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

// webkit publishes under two names: the release channel (`@aziontech/webkit`) and the
// dev channel (`@aziontech/webkit.dev`). Resolve whichever the consuming project has
// installed; the import PREFIX every answer uses is read from the resolved catalog's
// own `package` field, so it always matches the installed name.
const CANDIDATE_PKGS = ['@aziontech/webkit', '@aziontech/webkit.dev']
const DEFAULT_PKG = CANDIDATE_PKGS[0]

/** True when `src` is a bare import of either webkit package name. */
export function isWebkitBare(src) {
  return typeof src === 'string' && CANDIDATE_PKGS.includes(src)
}

let cache = null // { path, value }
let warned = false

function resolveCatalogPath(cwd) {
  if (process.env.WEBKIT_CATALOG_PATH) return process.env.WEBKIT_CATALOG_PATH
  const require = createRequire(join(cwd || process.cwd(), '__webkit_resolve__.js'))
  for (const pkg of CANDIDATE_PKGS) {
    try {
      return require.resolve(`${pkg}/catalog.json`)
    } catch {
      /* try next candidate */
    }
    try {
      return join(dirname(require.resolve(`${pkg}/package.json`)), 'catalog.json')
    } catch {
      /* try next candidate */
    }
  }
  return null
}

function warnOnce(message) {
  if (warned) return
  warned = true
  // MCP speaks JSON-RPC over stdio, so diagnostics MUST go to stderr — never stdout.
  // Fail-open must not be silent: announce the disabled state once.
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
    // Compile WITHOUT the global flag so `.test()` is stateless.
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
    /** Positive token inventory: { cssVars, typography, groups }. */
    tokens: json.tokens || { cssVars: [], typography: [], groups: {} },
    /** Every subpath key in the catalog, in declared order. */
    subpaths,
    /** Raw import entries keyed by subpath. */
    imports,
    has: (sub) => set.has(sub),
    getEntry: (sub) => imports[sub] || null,
    /** Nearest published ancestor of a slash path, e.g. `table/x/y` → `table` if published. */
    nearestPublishedPrefix(sub) {
      if (!sub.includes('/')) return null
      const parts = sub.split('/')
      for (let i = parts.length - 1; i > 0; i--) {
        const cand = parts.slice(0, i).join('/')
        if (set.has(cand)) return cand
      }
      return null
    },
    /** Up to 3 close published subpaths (edit distance ≤ 2), catches typos / singular↔plural. */
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
        'Install @aziontech/webkit (or @aziontech/webkit.dev), or set WEBKIT_CATALOG_PATH.'
    )
  } else {
    try {
      value = build(JSON.parse(readFileSync(path, 'utf-8')))
    } catch (err) {
      value = empty()
      warnOnce(`failed to read the webkit catalog at ${path} (${err.message}) — answers will degrade to "not available".`)
    }
  }
  cache = { path, value }
  return value
}

/** Test-only: clear the memoized catalog + warn latch (a single process may swap WEBKIT_CATALOG_PATH). */
export function _resetCatalogCache() {
  cache = null
  warned = false
}

// Static defaults for callers without a loaded catalog. The loaded catalog's own
// `.prefix` / `.bare` (derived from its `package` field) take precedence.
export const WEBKIT_PREFIX = `${DEFAULT_PKG}/`
export const WEBKIT_BARE = DEFAULT_PKG
