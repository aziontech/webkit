#!/usr/bin/env node
// CI ratchet for the webkit construction standards (.claude/rules/), dependency-free.
// Scans packages/webkit/src for the same checks the write-time hook enforces, and fails
// when a file introduces a violation that is NOT already recorded in authoring-baseline.json.
// Existing debt is grandfathered (frozen) so the gate lands without migrating everything;
// new code must comply. Migrate a file → its baseline entries disappear → prune with --update.
//
//   node scripts/check-authoring.mjs            # CI: fail on any NEW violation
//   node scripts/check-authoring.mjs --update   # re-snapshot the baseline (deliberate)
//
// Shares the check predicates with the hook via .claude/hooks/_lib/authoring-checks.mjs,
// so the write-time gate and the CI gate can never drift.

import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, resolve } from 'node:path'

import { scanFile, MESSAGES } from '../src/eslint-plugin/authoring-checks.js'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(SCRIPT_DIR, '../../..')
const SRC = join(ROOT, 'packages/webkit/src')
const BASELINE = join(SCRIPT_DIR, 'authoring-baseline.json')
const WIP_PREFIX = 'packages/webkit/src/components/wip/'

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(p))
    else if (/\.(vue|ts|js)$/.test(entry.name)) out.push(p)
  }
  return out
}

function currentViolations() {
  const keys = []
  for (const abs of walk(SRC)) {
    const rel = relative(ROOT, abs).split('\\').join('/')
    if (rel.startsWith(WIP_PREFIX)) continue
    const content = readFileSync(abs, 'utf-8')
    for (const id of scanFile(rel, content)) keys.push(`${rel}::${id}`)
  }
  return keys.sort()
}

const update = process.argv.includes('--update')
const current = currentViolations()

if (update) {
  writeFileSync(BASELINE, JSON.stringify(current, null, 2) + '\n')
  console.log(`authoring-baseline.json updated: ${current.length} known violations recorded.`)
  process.exit(0)
}

let baseline = []
try {
  baseline = JSON.parse(readFileSync(BASELINE, 'utf-8'))
} catch {
  console.error(
    'No authoring-baseline.json — run `node scripts/check-authoring.mjs --update` once to snapshot.'
  )
  process.exit(1)
}

const baselineSet = new Set(baseline)
const currentSet = new Set(current)
const introduced = current.filter((k) => !baselineSet.has(k))
const fixed = baseline.filter((k) => !currentSet.has(k))

if (fixed.length) {
  console.log(
    `\n↓ ${fixed.length} baseline violation(s) fixed — prune with the authoring:update script:`
  )
  for (const k of fixed) console.log(`  - ${k}`)
}

if (introduced.length) {
  console.error(`\n✖ ${introduced.length} NEW construction-standard violation(s) — blocked:\n`)
  for (const k of introduced) {
    const idx = k.lastIndexOf('::')
    const file = k.slice(0, idx)
    const id = k.slice(idx + 2)
    console.error(`  ${file}`)
    console.error(`    [${id}] ${MESSAGES[id] ?? id}`)
  }
  console.error(
    '\nFix the pattern (see .claude/rules/). Re-baselining is only for a deliberate, reviewed exception.'
  )
  process.exit(1)
}

console.log(`✓ authoring ratchet: ${current.length} known violations, 0 new.`)
process.exit(0)
