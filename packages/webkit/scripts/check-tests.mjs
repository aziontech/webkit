#!/usr/bin/env node
// CI gate for .claude/rules/testing.md (a `general` standard). Two checks:
//   existence — MANDATORY: every ROOT component .vue has a co-located <name>.test.ts.
//     Never grandfathered — a component without a test always fails the build.
//   freshness — when TEST_GATE_BASE is set (a PR base branch, e.g. "dev"), any
//     ROOT component .vue changed in the diff must have its <name>.test.ts changed
//     in the SAME diff (transition-debt grandfathered via test-gate-baseline.json).
// Together: you cannot land a NEW or a CHANGED component without creating/updating
// its test. Exit 1 (fail the PR) on any violation; exit 0 when clean.
//
// A ROOT component is a .vue whose basename equals its parent folder name
// (badge/badge.vue, content/badge/badge.vue) — composition sub-components
// (badge-part.vue) are tested through their root, so they are skipped.
// wip/ and the legacy whitelist (.claude/hooks/_lib/legacy-components.json) are exempt.

import { execSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

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

// Ratchet baseline (same philosophy as check-authoring) — FRESHNESS ONLY. Existence
// is mandatory and never grandfathered: every component must have a test, no exceptions.
// This list only grandfathers freshness transition-debt: components already changed
// without a test touch on this branch, before the gate existed. New freshness debt (any
// name NOT listed) is blocked. Pay down + re-snapshot with `pnpm run test:gate:update`.
const BASELINE_PATH = join(SCRIPT_DIR, 'test-gate-baseline.json')
let grandfathered = new Set()
try {
  grandfathered = new Set(JSON.parse(readFileSync(BASELINE_PATH, 'utf-8')).grandfathered ?? [])
} catch {
  /* no baseline yet → nothing grandfathered */
}
const UPDATE = process.argv.includes('--update')

// A ROOT component .vue sits directly in its own component folder:
//   <category>/<name>/<name>.vue   (dir segments after components/ = [category, name])
//   <name>/<name>.vue              (flat, e.g. tag/tag.vue — 1 segment)
// Composition sub-components live deeper (<category>/<name>/<sub>/<sub>.vue) or are a
// dashed part next to the root (<name>-part.vue) — they are tested THROUGH their root,
// so only the root name matches here. Returns the component name, or null if not a root.
function componentRootName(relFromComponents) {
  if (!relFromComponents.endsWith('.vue')) return null
  const parts = relFromComponents.split('/')
  const name = basename(parts.pop(), '.vue')
  const base = name.endsWith('-root') ? name.slice(0, -5) : name
  if (parts.length === 2 && parts[1] === base) return base // <category>/<name>/<name>[-root].vue
  if (parts.length === 1 && parts[0] === base) return base // flat <name>/<name>[-root].vue
  return null
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

// ── freshness (PR diff only) ──
const base = process.env.TEST_GATE_BASE
const stale = []
const staleNames = [] // for --update
let freshnessRan = false
if (base) {
  let changed = null
  try {
    try {
      execSync(`git fetch --no-tags --depth=200 origin ${base}`, { cwd: ROOT, stdio: 'ignore' })
    } catch {
      /* base may already be present locally */
    }
    changed = execSync(`git diff --name-only origin/${base}...HEAD`, {
      cwd: ROOT,
      encoding: 'utf-8'
    })
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
  } catch (err) {
    console.error(
      `check-tests: could not diff against origin/${base} (${err?.message ?? err}); skipping freshness.`
    )
  }
  if (changed) {
    freshnessRan = true
    const changedSet = new Set(changed)
    const prefix = 'packages/webkit/src/components/'
    for (const rel of changed) {
      if (!rel.startsWith(prefix) || rel.startsWith(`${prefix}wip/`)) continue
      const name = componentRootName(rel.slice(prefix.length))
      if (!name || legacyNames.has(name)) continue // sub-components/legacy exempt
      if (!existsSync(join(ROOT, rel))) continue // deleted component — no test required
      const testRel = `${dirname(rel)}/${name}.test.ts`
      if (changedSet.has(testRel)) continue
      staleNames.push(name)
      if (!grandfathered.has(name)) stale.push({ vue: rel, test: testRel })
    }
  }
}

if (UPDATE) {
  if (!base) {
    console.error(
      'check-tests --update requires TEST_GATE_BASE=<branch>; refusing to wipe the freshness baseline.'
    )
    process.exit(1)
  }
  const names = [...new Set(staleNames)].sort()
  writeFileSync(
    BASELINE_PATH,
    JSON.stringify(
      {
        _comment:
          'FRESHNESS transition-debt only (see .claude/rules/testing.md). Existence is mandatory and NOT grandfathered — every component must have a test. Names here are components changed-without-test-touch before the gate existed; they are exempt from the freshness check only. New freshness debt is blocked. Re-snapshot with TEST_GATE_BASE=<base> pnpm --filter @aziontech/webkit run test:gate:update.',
        grandfathered: names
      },
      null,
      2
    ) + '\n'
  )
  console.log(
    `test-gate-baseline.json updated: ${names.length} grandfathered (freshness) component(s).`
  )
  process.exit(0)
}

if (!missing.length && !stale.length) {
  console.log(
    `✓ check-tests: ${roots.length} components, each with a co-located <name>.test.ts` +
      (freshnessRan ? '; every changed component ships its test.' : '.') +
      (grandfathered.size ? ` (${grandfathered.size} grandfathered)` : '')
  )
  process.exit(0)
}

if (missing.length) {
  console.error(
    `\n✖ ${missing.length} component(s) without a co-located <name>.test.ts — blocked (.claude/rules/testing.md):\n`
  )
  for (const m of missing) console.error(`  ${m}  →  add ${m.replace(/\.vue$/, '.test.ts')}`)
}
if (stale.length) {
  console.error(
    `\n✖ ${stale.length} component(s) changed WITHOUT touching their test — blocked (.claude/rules/testing.md):\n`
  )
  for (const s of stale) console.error(`  ${s.vue}  →  update ${s.test} in the same PR`)
}
console.error(
  `\nEvery component ships a <name>.test.ts and it moves with the component. See .claude/rules/testing.md.`
)
process.exit(1)
