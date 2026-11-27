import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, posix } from 'node:path'

const CANDIDATE_PKGS = ['@aziontech/ui']
const DEFAULT_PKG = CANDIDATE_PKGS[0]

let cache = null
let warned = false

function resolveCatalogPath(cwd) {
  if (process.env.AZION_UI_CATALOG_PATH) return process.env.AZION_UI_CATALOG_PATH
  const require = createRequire(join(cwd || process.cwd(), '__azion_ui_resolve__.js'))
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
  process.stderr.write(`[azion-ui-mcp] ${message}\n`)
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

function readPart(baseDir, file) {
  if (!baseDir || !file) return null
  try {
    return JSON.parse(readFileSync(join(baseDir, file), 'utf-8'))
  } catch (err) {
    warnOnce(`failed to read ${file} next to the Azion UI catalog (${err.message}).`)
    return null
  }
}

function readSource(baseDir, file) {
  if (!baseDir || !file) return ''
  try {
    return readFileSync(join(baseDir, file), 'utf-8').replace(/\n$/, '')
  } catch (err) {
    warnOnce(`failed to read ${file} next to the Azion UI catalog (${err.message}).`)
    return ''
  }
}

export function hydratePart(part, readText) {
  if (!part) return part
  const { sfcFile, guidelinesFile, fileSources, ...out } = part
  if (sfcFile) out.sfc = readText(sfcFile)
  if (fileSources) {
    const dir = posix.dirname(sfcFile || '')
    const sources = Array.isArray(fileSources)
      ? fileSources.map((name) => [name, `${dir}/${name}`])
      : Object.entries(fileSources)
    out.files = Object.fromEntries(sources.map(([name, file]) => [name, readText(file)]))
  }
  if (guidelinesFile) out.guidelines = readText(guidelinesFile)
  for (const key of ['variants', 'examples']) {
    if (!Array.isArray(out[key])) continue
    out[key] = out[key].map((x) =>
      x.file && x.sfc === undefined ? { ...x, sfc: readText(x.file) } : x
    )
  }
  return out
}

function catalogFields(json) {
  const pkg = json.package || DEFAULT_PKG
  return {
    available: true,
    package: pkg,
    prefix: `${pkg}/`,
    bare: pkg,
    version: json.azionUiVersion || null,
    deniedPrefixes: json.deniedPrefixes || [],
    tokenRules: (json.tokenRules || []).map((r) => ({
      id: r.id,
      re: new RegExp(r.pattern, (r.flags || '').replace('g', '')),
      message: r.message
    })),
    tokens: json.tokens || { cssVars: [], typography: [], groups: {} },
    vocabulary: json.vocabulary || null,
    aliases: json.aliases || {},
    renamed: json.renamed || {},
    removed: json.removed || {}
  }
}

function cached(cache, key, load) {
  if (!cache.has(key)) cache.set(key, load())
  return cache.get(key)
}

function partReaders(imports, blocks, assets, baseDir) {
  const source = (file) => readSource(baseDir, file)
  const blockCache = new Map()
  const exampleCache = new Map()
  const detailCache = new Map()
  const assetCache = new Map()
  return {
    assetItems(kind) {
      const meta = assets[kind]
      if (!meta) return []
      if (!meta.file) return meta.items || []
      return cached(assetCache, kind, () => readPart(baseDir, meta.file)?.items || [])
    },
    getDetails(sub) {
      const e = imports[sub]
      if (!e) return null
      if (!e.docsFile) return e
      const { docsFile, ...rest } = e
      return cached(detailCache, sub, () => ({ ...rest, ...(readPart(baseDir, docsFile) || {}) }))
    },
    block(id) {
      const meta = blocks[id]
      if (!meta) return null
      if (!meta.file) return meta
      const { file, ...rest } = meta
      return cached(blockCache, id, () => ({
        ...rest,
        ...(hydratePart(readPart(baseDir, file), source) || {})
      }))
    },
    examples(sub) {
      const e = imports[sub]
      if (!e) return []
      if (!e.examplesFile) return e.examples || []
      return cached(
        exampleCache,
        sub,
        () => hydratePart(readPart(baseDir, e.examplesFile), source)?.examples || []
      )
    }
  }
}

function subpathLookups(subpaths) {
  const set = new Set(subpaths)
  return {
    has: (sub) => set.has(sub),
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

function build(json, baseDir) {
  const imports = json.imports || {}
  const blocks = json.blocks || {}
  const assets = json.assets || {}
  const subpaths = Object.keys(imports)
  return {
    ...catalogFields(json),
    subpaths,
    imports,
    blocks,
    blockAliases: json.blockAliases || {},
    assets,
    getEntry: (sub) => imports[sub] || null,
    ...partReaders(imports, blocks, assets, baseDir),
    ...subpathLookups(subpaths)
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
    aliases: {},
    renamed: {},
    removed: {},
    subpaths: [],
    imports: {},
    blocks: {},
    blockAliases: {},
    assets: {},
    assetItems: () => [],
    has: () => false,
    getEntry: () => null,
    getDetails: () => null,
    block: () => null,
    examples: () => [],
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
      'could not resolve an Azion UI catalog.json — answers will degrade to "not available". ' +
        'Install @aziontech/ui, or set AZION_UI_CATALOG_PATH.'
    )
  } else {
    try {
      value = build(JSON.parse(readFileSync(path, 'utf-8')), dirname(path))
    } catch (err) {
      value = empty()
      warnOnce(
        `failed to read the Azion UI catalog at ${path} (${err.message}) — answers will degrade to "not available".`
      )
    }
  }
  cache = { path, value }
  return value
}

export function loadCatalogFrom(path) {
  return build(JSON.parse(readFileSync(path, 'utf-8')), dirname(path))
}

export function _resetCatalogCache() {
  cache = null
  warned = false
}
