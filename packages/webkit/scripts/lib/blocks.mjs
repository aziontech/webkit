import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

import { GUIDELINE_FILE, guidelinesSummary } from './guidelines.mjs'

const PKG_PREFIX = '@aziontech/webkit/'

const EXAMPLES_PER_COMPONENT = 3
const EXAMPLE_MAX_CHARS = 8000

export function kebab(segment) {
  return String(segment)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

export function blockIdFromTitle(title) {
  const parts = String(title || '')
    .split('/')
    .map((p) => p.trim())
    .filter(Boolean)
  if (parts[0] === 'Blocks') parts.shift()
  return parts.map(kebab).join('/')
}

export function importsOf(sfc) {
  const out = []
  for (const m of String(sfc).matchAll(/^\s*import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/gm)) {
    const source = m[2]
    if (!source.startsWith(PKG_PREFIX)) continue
    const clause = m[1].trim()
    if (/^type\s/.test(clause)) continue
    const def = clause.match(/^([A-Za-z_$][\w$]*)/)
    out.push({ binding: def ? def[1] : null, subpath: source.slice(PKG_PREFIX.length) })
  }
  return out
}

function blockDirs(root, out = []) {
  if (!existsSync(root)) return out
  for (const e of readdirSync(root, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  )) {
    if (!e.isDirectory()) continue
    const dir = join(root, e.name)
    if (existsSync(join(dir, 'block.json'))) out.push(dir)
    else blockDirs(dir, out)
  }
  return out
}

const readText = (file) => readFileSync(file, 'utf8').replace(/\n$/, '')

export function readBlocks(pkgRoot) {
  const root = join(pkgRoot, 'blocks')
  const blocks = {}
  const errors = []
  for (const dir of blockDirs(root)) {
    const block = JSON.parse(readText(join(dir, 'block.json')))
    const expectedId = relative(root, dir).split('\\').join('/')
    if (block.id !== expectedId) {
      errors.push(`${expectedId}/block.json: id "${block.id}" does not match its folder`)
      continue
    }
    const primarySfc = readText(join(dir, block.primary.file))
    const variants = (block.variants || []).map((v) => ({
      name: v.name,
      summary: v.summary || '',
      file: `blocks/${block.id}/${v.file}`,
      sfc: readText(join(dir, v.file))
    }))
    const sharedSfcs = (block.files || [])
      .filter((file) => file.endsWith('.vue'))
      .map((file) => readText(join(dir, file)))
    const imports = new Map()
    for (const sfc of [primarySfc, ...variants.map((v) => v.sfc), ...sharedSfcs]) {
      for (const imp of importsOf(sfc))
        if (!imports.has(imp.subpath)) imports.set(imp.subpath, imp.binding)
    }
    const subpaths = [...imports.keys()].sort()
    const entry = {
      name: block.name,
      title: block.title,
      source: `blocks/${block.id}/${block.primary.file}`,
      surface: block.surface || 'app',
      ...(block.kind === 'fragment' ? { kind: 'fragment' } : {}),
      summary: block.summary || '',
      intents: block.intents || [],
      skills: block.skills || []
    }
    if (block.steps?.length) entry.steps = block.steps
    entry.components = subpaths.map((s) => imports.get(s) || s)
    entry.imports = subpaths.map((s) => `${PKG_PREFIX}${s}`)
    entry.primary = block.primary.name
    entry.sfc = primarySfc
    entry.variants = variants
    if (block.files?.length) {
      entry.files = Object.fromEntries(block.files.map((file) => [file, readText(join(dir, file))]))
    }
    const guidelinesPath = join(dir, GUIDELINE_FILE)
    if (existsSync(guidelinesPath)) {
      entry.guidelines = readText(guidelinesPath)
      entry.guidelinesSummary = guidelinesSummary(entry.guidelines)
    }
    blocks[block.id] = entry
  }
  if (errors.length) throw new Error(`Could not read blocks:\n  ${errors.join('\n  ')}`)
  return Object.fromEntries(Object.entries(blocks).sort(([a], [b]) => a.localeCompare(b)))
}

export function readExamples(pkgRoot, knownSubpaths) {
  const root = join(pkgRoot, 'examples')
  const out = {}
  if (!existsSync(root)) return out
  for (const sub of readdirSync(root).sort()) {
    const manifestPath = join(root, sub, 'examples.json')
    if (!existsSync(manifestPath)) continue
    const manifest = JSON.parse(readText(manifestPath))
    const id = manifest.component || sub
    if (!knownSubpaths.has(id)) continue
    const list = (manifest.examples || [])
      .map((e) => ({
        name: e.name,
        summary: e.summary || '',
        file: `examples/${sub}/${e.file}`,
        sfc: readText(join(root, sub, e.file))
      }))
      .filter((e) => e.sfc && e.sfc.length <= EXAMPLE_MAX_CHARS)
      .slice(0, EXAMPLES_PER_COMPONENT)
    if (list.length) out[id] = list
  }
  return out
}
