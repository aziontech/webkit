import { existsSync } from 'node:fs'
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path'

import { read, toPosix } from './manifest.js'

const ROUTER_CANDIDATES = [
  'src/router/index.ts',
  'src/router/index.js',
  'src/router/routes.ts',
  'src/router/routes.js',
  'src/router.ts',
  'src/router.js'
]

const VITE_CONFIGS = ['vite.config.ts', 'vite.config.js', 'vite.config.mts', 'vite.config.mjs']

const TS_CONFIGS = ['tsconfig.app.json', 'tsconfig.json', 'jsconfig.json']

function firstExisting(projectDir, candidates) {
  return candidates.find((c) => existsSync(join(projectDir, c))) || null
}

function vueImportDirs(projectDir, routerRel) {
  const src = read(join(projectDir, routerRel)) || ''
  const routerDir = dirname(join(projectDir, routerRel))
  const counts = new Map()
  for (const m of src.matchAll(/['"]((?:@\/|\.{1,2}\/)[^'"]+\.vue)['"]/g)) {
    const spec = m[1]
    const abs = spec.startsWith('@/')
      ? join(projectDir, 'src', spec.slice(2))
      : resolve(routerDir, spec)
    const rel = toPosix(relative(projectDir, abs)).split('/')
    if (rel[0] === '..' || rel.length < 2) continue
    const dir =
      rel[0] === 'src' && rel.length > 2 ? rel.slice(0, 2).join('/') : rel.slice(0, -1).join('/')
    counts.set(dir, (counts.get(dir) || 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([dir]) => dir)
}

function detectViewsDir(projectDir) {
  const router = firstExisting(projectDir, ROUTER_CANDIDATES)
  if (router) {
    const [top] = vueImportDirs(projectDir, router)
    if (top) return { dir: top, reason: `the views ${router} imports` }
  }
  for (const dir of ['src/views', 'src/pages']) {
    if (existsSync(join(projectDir, dir))) return { dir, reason: `${dir} exists` }
  }
  return { dir: 'src/views', reason: 'default' }
}

function hasAtAlias(projectDir) {
  for (const file of VITE_CONFIGS) {
    const src = read(join(projectDir, file))
    if (src && /['"]@['"]\s*:/.test(src)) return true
    if (src && /find:\s*['"]@['"]/.test(src)) return true
  }
  for (const file of TS_CONFIGS) {
    const src = read(join(projectDir, file))
    if (src && /"@\/\*"\s*:/.test(src)) return true
  }
  return false
}

function kebab(s) {
  return String(s)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

export function suggestRoute(projectDir, { id, name, file }) {
  const router = firstExisting(projectDir, ROUTER_CANDIDATES)
  const abs = join(projectDir, file)
  let spec
  const underSrc = toPosix(relative(join(projectDir, 'src'), abs))
  if (hasAtAlias(projectDir) && !underSrc.startsWith('..')) spec = `@/${underSrc}`
  else {
    const from = router ? dirname(join(projectDir, router)) : join(projectDir, 'src')
    spec = toPosix(relative(from, abs))
    if (!spec.startsWith('.')) spec = `./${spec}`
  }
  const slug = id.split('/').pop() || kebab(name)
  return {
    router,
    entry: `{ path: '/${slug}', name: '${slug}', component: () => import('${spec}') }`
  }
}

export function variantFile(stem, variant) {
  if (/[A-Z]/.test(stem)) return `${stem}${variant.name}.vue`
  return `${stem}-${basename(variant.file, '.vue')}.vue`
}

const pascalOf = (s) => s.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase())

function vuePartFile(stem, part) {
  if (/[A-Z]/.test(stem)) {
    const name = pascalOf(part)
    return `${name.startsWith(stem) ? name : `${stem}${name}`}.vue`
  }
  return `${part.startsWith(`${stem}-`) ? part : `${stem}-${part}`}.vue`
}

export function extraFile(stem, file) {
  if (file.endsWith('.vue')) return vuePartFile(stem, basename(file, '.vue'))
  return `${stem}.${basename(file)}`
}

export function longExtraFile(stem, file) {
  if (file.endsWith('.vue')) return vuePartFile(stem, file.slice(0, -4).split('/').join('-'))
  return `${stem}.${file.split('/').join('.')}`
}

export function targetPaths(projectDir, block, dest) {
  const name = block.id.split('/').pop() || kebab(block.meta.name)
  let dir
  let primaryName = `${name}.vue`
  let viewsReason = null
  if (dest && dest.endsWith('.vue')) {
    dir = dirname(dest)
    primaryName = basename(dest)
  } else if (dest) {
    dir = dest
  } else {
    const detected = detectViewsDir(projectDir)
    dir = detected.dir
    viewsReason = detected.reason
  }
  const relDir =
    toPosix(isAbsolute(dir) ? relative(projectDir, dir) : dir).replace(/\/$/, '') || '.'
  const stem = basename(primaryName, '.vue')
  const at = (file) => (relDir === '.' ? file : `${relDir}/${file}`)
  const reserved = new Set([
    at(primaryName),
    ...(block.meta.variants || []).map((variant) => at(variantFile(stem, variant)))
  ])
  const extraPath = (file) => {
    const short = at(extraFile(stem, file))
    return reserved.has(short) ? at(longExtraFile(stem, file)) : short
  }
  return {
    reserved,
    viewsReason,
    at,
    stem,
    primary: at(primaryName),
    variant: block.variant ? at(variantFile(stem, block.variant)) : null,
    extras: (block.meta.files || []).map((file) => ({ file, path: extraPath(file) })),
    guidelines: at(`${stem}.guidelines.md`)
  }
}
