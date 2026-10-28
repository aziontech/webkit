#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { componentRootName } from '../../../.claude/hooks/_lib/spec.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = join(SCRIPT_DIR, '..', '..', '..')
const COMPONENTS = join(ROOT, 'packages/webkit/src/components')
const WIP = join(COMPONENTS, 'wip')

let legacyNames = new Set()
try {
  const legacy = JSON.parse(
    readFileSync(join(ROOT, '.claude/hooks/_lib/legacy-components.json'), 'utf-8')
  )
  legacyNames = new Set(legacy.map((c) => c.name))
} catch {}

const relToComponents = (abs) => relative(COMPONENTS, abs).split(sep).join('/')

function walk(dir, out) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) {
      if (p !== WIP) walk(p, out)
    } else if (e.isFile() && e.name.endsWith('.vue')) {
      const name = componentRootName(relToComponents(p))
      if (name && !legacyNames.has(name)) out.push(p)
    }
  }
  return out
}

const roots = existsSync(COMPONENTS) ? walk(COMPONENTS, []) : []
const missing = []
for (const vue of roots) {
  const name = componentRootName(relToComponents(vue))
  const test = join(dirname(vue), `${name}.test.ts`)
  if (!existsSync(test)) missing.push(relative(ROOT, vue))
}

if (!missing.length) {
  console.log(`✓ check-tests: ${roots.length} components, each with a co-located <name>.test.ts.`)
  process.exit(0)
}

console.error(
  `\n✖ ${missing.length} component(s) without a co-located <name>.test.ts — blocked (.claude/rules/testing.md):\n`
)
for (const m of missing) console.error(`  ${m}  →  add ${m.replace(/\.vue$/, '.test.ts')}`)
console.error(
  `\nEvery component ships a <name>.test.ts and it moves with the component. See .claude/rules/testing.md.`
)
process.exit(1)
