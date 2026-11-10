import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

import { EXAMPLE_MAX_CHARS, EXAMPLES_PER_COMPONENT, importsOf } from './patterns.mjs'

const PKG_PREFIX = '@aziontech/webkit/'

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
  const patterns = {}
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
      sfc: readText(join(dir, v.file))
    }))
    const imports = new Map()
    for (const sfc of [primarySfc, ...variants.map((v) => v.sfc)]) {
      for (const imp of importsOf(sfc))
        if (!imports.has(imp.subpath)) imports.set(imp.subpath, imp.binding)
    }
    const subpaths = [...imports.keys()].sort()
    const entry = {
      name: block.name,
      title: block.title,
      source: `blocks/${block.id}/${block.primary.file}`,
      surface: block.surface || 'product',
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
    patterns[block.id] = entry
  }
  if (errors.length) throw new Error(`Could not read blocks:\n  ${errors.join('\n  ')}`)
  return Object.fromEntries(Object.entries(patterns).sort(([a], [b]) => a.localeCompare(b)))
}

export function readExamples(pkgRoot, knownSubpaths) {
  const root = join(pkgRoot, 'examples')
  const out = {}
  if (!existsSync(root)) return out
  for (const sub of readdirSync(root).sort()) {
    if (!knownSubpaths.has(sub)) continue
    const manifestPath = join(root, sub, 'examples.json')
    if (!existsSync(manifestPath)) continue
    const manifest = JSON.parse(readText(manifestPath))
    const list = (manifest.examples || [])
      .map((e) => ({
        name: e.name,
        summary: e.summary || '',
        sfc: readText(join(root, sub, e.file))
      }))
      .filter((e) => e.sfc && e.sfc.length <= EXAMPLE_MAX_CHARS)
      .slice(0, EXAMPLES_PER_COMPONENT)
    if (list.length) out[sub] = list
  }
  return out
}
