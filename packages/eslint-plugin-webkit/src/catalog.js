// Version-locked catalog loader shared by every rule.
//
// Resolves `@aziontech/webkit/catalog.json` from the LINTED project's node_modules
// (so the allowed-import list / token rules always match the webkit version that
// project installed). Fail-open: if webkit (or its catalog) is not resolvable, the
// catalog reports `available: false` and catalog-dependent rules no-op instead of
// crashing ESLint on unrelated repos.
//
// Test / monorepo-dogfood override: set WEBKIT_CATALOG_PATH to an explicit file.

import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const PKG = '@aziontech/webkit'

let cache = null // { path, value }

function resolveCatalogPath(cwd) {
  if (process.env.WEBKIT_CATALOG_PATH) return process.env.WEBKIT_CATALOG_PATH
  const require = createRequire(join(cwd || process.cwd(), '__webkit_resolve__.js'))
  try {
    return require.resolve(`${PKG}/catalog.json`)
  } catch {
    /* fall through */
  }
  try {
    return join(dirname(require.resolve(`${PKG}/package.json`)), 'catalog.json')
  } catch {
    return null
  }
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

  return {
    available: true,
    version: json.webkitVersion || null,
    deniedPrefixes: json.deniedPrefixes || [],
    tokenRules,
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
    version: null,
    deniedPrefixes: [],
    tokenRules: [],
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
  } else {
    try {
      value = build(JSON.parse(readFileSync(path, 'utf-8')))
    } catch {
      value = empty()
    }
  }
  cache = { path, value }
  return value
}

/** Test-only: clear the memoized catalog (RuleTester runs in one process). */
export function _resetCatalogCache() {
  cache = null
}

export const WEBKIT_PREFIX = `${PKG}/`
export const WEBKIT_BARE = PKG
