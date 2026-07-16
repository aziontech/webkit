#!/usr/bin/env node
// CI gate for .claude/rules/testing.md (a `general` standard). One check:
//   existence — MANDATORY: every ROOT component .vue has a co-located <name>.test.ts.
//     Never grandfathered — a component without a test always fails the build.
// You cannot land a component without its test. Exit 1 (fail the PR) on any
// violation; exit 0 when clean.
//
// Whether an EXISTING test still covers a changed component is a review concern,
// not a diff gate — a style-only change (CSS/tokens) legitimately ships without
// touching the test, so no freshness check runs here.
//
// A ROOT component is a .vue whose basename equals its parent folder name
// (badge/badge.vue, content/badge/badge.vue) — composition sub-components
// (badge-part.vue) are tested through their root, so they are skipped.
// wip/ and the legacy whitelist (.claude/hooks/_lib/legacy-components.json) are exempt.

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { componentRootName } from '../../../.claude/hooks/_lib/spec.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url)) // packages/webkit/scripts
const ROOT = join(SCRIPT_DIR, '..', '..', '..') // repo root
const COMPONENTS = join(ROOT, 'packages/webkit/src/components')
const WIP = join(COMPONENTS, 'wip')

let legacyNames = new Set()
try {
  const legacy = JSON.parse(
    readFileSync(join(ROOT, '.claude/hooks/_lib/legacy-components.json'), 'utf-8')
  )
  legacyNames = new Set(legacy.map((c) => c.name))
} catch {
  /* no whitelist → nothing exempt */
}

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

// ── existence — MANDATORY, never grandfathered: every component must have a test ──
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
