import { existsSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

export const PATTERN_GROUPS = ['headers', 'shells', 'platform']

const PKG_PREFIX = '@aziontech/webkit/'

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

export function listPatternStories(repoRoot) {
  const base = join(repoRoot, 'apps/storybook/src/stories/templates')
  const files = []
  for (const group of PATTERN_GROUPS) {
    const dir = join(base, group)
    if (!existsSync(dir)) continue
    const walk = (d) => {
      for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) =>
        a.name.localeCompare(b.name)
      )) {
        const p = join(d, e.name)
        if (e.isDirectory()) walk(p)
        else if (e.isFile() && e.name.endsWith('.stories.js')) files.push(p)
      }
    }
    walk(dir)
  }
  return files
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

function storyText(story, key) {
  const value = story?.parameters?.docs?.description?.[key]
  return typeof value === 'string' ? value.trim() : ''
}

function stringList(value) {
  return Array.isArray(value) ? value.map((v) => String(v).trim()).filter(Boolean) : []
}

export function patternFromModule(mod, { file, repoRoot }) {
  const meta = mod.default || {}
  const webkit = meta.parameters?.webkit || {}
  const exportsList = Object.entries(mod)
    .filter(([name, story]) => name !== 'default' && story && typeof story === 'object')
    .map(([name, story]) => ({
      name,
      summary: storyText(story, 'story'),
      sfc: story.parameters?.docs?.source?.code || ''
    }))
    .filter((v) => v.sfc)
  if (!exportsList.length) return null

  const primaryName = typeof webkit.primary === 'string' ? webkit.primary : exportsList[0].name
  const primary = exportsList.find((v) => v.name === primaryName) || exportsList[0]

  const imports = new Map()
  for (const variant of exportsList) {
    for (const imp of importsOf(variant.sfc)) {
      if (!imports.has(imp.subpath)) imports.set(imp.subpath, imp.binding)
    }
  }
  const subpaths = [...imports.keys()].sort()

  const title = meta.title || ''
  const entry = {
    name: title.split('/').pop() || primary.name,
    title,
    story: relative(repoRoot, file).split('\\').join('/'),
    summary: storyText(meta, 'component'),
    intents: stringList(webkit.intents),
    skills: stringList(webkit.skills)
  }
  const steps = stringList(webkit.steps)
  if (steps.length) entry.steps = steps
  entry.components = subpaths.map((s) => imports.get(s) || s)
  entry.imports = subpaths.map((s) => `${PKG_PREFIX}${s}`)
  entry.primary = primary.name
  entry.sfc = primary.sfc
  entry.variants = exportsList
    .filter((v) => v.name !== primary.name)
    .map((v) => ({ name: v.name, summary: v.summary, sfc: v.sfc }))
  return { id: patternIdFromTitle(title), entry }
}

export async function buildPatterns(repoRoot) {
  const storybookRoot = resolve(repoRoot, 'apps/storybook')
  const [{ createServer }, { default: vue }] = await Promise.all([
    import('vite'),
    import('@vitejs/plugin-vue')
  ])
  const server = await createServer({
    configFile: false,
    root: storybookRoot,
    logLevel: 'error',
    plugins: [vue()],
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] }
  })
  const patterns = {}
  const errors = []
  try {
    for (const file of listPatternStories(repoRoot)) {
      try {
        const mod = await server.ssrLoadModule(file)
        const built = patternFromModule(mod, { file, repoRoot })
        if (!built) {
          errors.push(`${relative(repoRoot, file)}: no export carries parameters.docs.source.code`)
          continue
        }
        if (patterns[built.id]) {
          errors.push(`${relative(repoRoot, file)}: pattern id "${built.id}" is already taken`)
          continue
        }
        patterns[built.id] = built.entry
      } catch (err) {
        errors.push(`${relative(repoRoot, file)}: ${String(err?.message || err).split('\n')[0]}`)
      }
    }
  } finally {
    await server.close()
  }
  if (errors.length) {
    throw new Error(`Could not build patterns:\n  ${errors.join('\n  ')}`)
  }
  return Object.fromEntries(Object.entries(patterns).sort(([a], [b]) => a.localeCompare(b)))
}
