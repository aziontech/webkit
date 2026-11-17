import { readdirSync } from 'node:fs'

import { COLOR_DIR, MONO_DIR, PREFIX, loadManifest } from './lib/icons-manifest.mjs'

const manifest = loadManifest()
const errors = []
const fail = (name, message) => errors.push(`  ${name}: ${message}`)

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/
const BANNED_PARTS = new Set(['alt', 'logo', 'icon', 'old', 'final', 'cor', 'color'])
const kebab = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const files = (dir) =>
  new Set(
    readdirSync(dir)
      .filter((f) => f.endsWith('.svg'))
      .map((f) => f.slice(0, -4))
  )
const onDisk = { mono: files(MONO_DIR), color: files(COLOR_DIR) }
const seen = { mono: new Set(), color: new Set() }
const legacySeen = { mono: new Set(), color: new Set() }

for (const entry of manifest.icons) {
  const id = `${entry.set}/${entry.name}`
  if (!['mono', 'color'].includes(entry.set)) {
    fail(id, `set must be "mono" or "color", got "${entry.set}"`)
    continue
  }
  if (!KEBAB.test(entry.name)) fail(id, 'name must be kebab-case')
  if (/^(az|ai-ai)-/.test(entry.name)) fail(id, 'name must not carry a class prefix')
  for (const part of entry.name.split('-'))
    if (BANNED_PARTS.has(part))
      fail(id, `"${part}" says nothing about the icon; name what it shows`)
  if (seen[entry.set].has(entry.name)) fail(id, 'duplicate name')
  seen[entry.set].add(entry.name)
  if (!onDisk[entry.set].has(`${PREFIX}-${entry.name}`))
    fail(
      id,
      `no file ${PREFIX}-${entry.name}.svg in src/svg-raw/${entry.set === 'mono' ? 'az' : 'az-color'}/`
    )

  const group = manifest.groups[entry.group]
  if (!group) fail(id, `unknown group "${entry.group}"`)
  else if (!group.categories[entry.category])
    fail(id, `unknown category "${entry.category}" for group "${entry.group}"`)
  for (const field of ['shows', 'means'])
    if (typeof entry[field] !== 'string' || !entry[field].trim()) fail(id, `"${field}" is empty`)

  const isProduct = entry.group === 'azion' && ['product', 'feature'].includes(entry.category)
  if (isProduct && !entry.product) fail(id, 'a product or feature icon names its "product"')
  if (
    entry.group === 'azion' &&
    entry.category === 'product' &&
    entry.status !== 'deprecated' &&
    kebab(entry.product ?? '') !== entry.name
  )
    fail(id, `a product icon is named after its product: expected "${kebab(entry.product ?? '')}"`)
  if (entry.name.startsWith('edge-') && !(entry.product ?? '').startsWith('Edge '))
    fail(
      id,
      '"edge-" is kept only for products whose name starts with "Edge" (Edge DNS, Edge Pulse, Edge Orchestrator)'
    )

  if (entry.status !== 'stable')
    fail(
      id,
      'status must be "stable" (6.0 is a clean break: a retired icon is removed and mapped in the codemod)'
    )
  if (!Array.isArray(entry.legacy))
    fail(
      id,
      '"legacy" lists the old classes webkit migrate rewrites to this icon ([] for a new icon)'
    )
  for (const old of entry.legacy ?? []) {
    if (legacySeen[entry.set].has(old)) fail(id, `legacy name "${old}" is claimed twice`)
    legacySeen[entry.set].add(old)
  }
}

for (const set of ['mono', 'color'])
  for (const file of onDisk[set])
    if (!seen[set].has(file.replace(`${PREFIX}-`, '')))
      fail(`${set}/${file}`, 'SVG file with no entry in src/icons.json')

if (errors.length) {
  console.error(`\n🔴 src/icons.json has ${errors.length} problem(s):\n${errors.join('\n')}\n`)
  process.exit(1)
}
console.log(`  ✔ src/icons.json documents all ${manifest.icons.length} icons`)
