#!/usr/bin/env node
// CI ratchet for .claude/rules/authoring-docs.md. Scans the four skill/agent doc
// populations with the SAME engine the write-time hook runs
// (.claude/hooks/_lib/authoring-docs-checks.mjs) and fails when a file introduces a
// violation NOT already in doc-standards-baseline.json. Existing debt is grandfathered;
// new/edited docs must comply even from an editor that never ran the hook. Dependency-free.
//
//   node scripts/check-authoring-docs.mjs            # CI: fail on any NEW violation
//   node scripts/check-authoring-docs.mjs --update   # re-snapshot the baseline (deliberate)

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, resolve } from 'node:path'

import {
  docFileKind,
  scanDoc,
  MESSAGES
} from '../../../.claude/hooks/_lib/authoring-docs-checks.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(SCRIPT_DIR, '../../..')
const BASELINE = join(SCRIPT_DIR, 'doc-standards-baseline.json')
const DIRS = [
  '.claude/skills',
  '.claude/agents',
  'packages/webkit/cli-templates/claude/skills',
  'packages/webkit/cli-templates/claude/agents'
]

function walk(dir) {
  const out = []
  if (!existsSync(dir)) return out
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(p))
    else if (e.name.endsWith('.md')) out.push(p)
  }
  return out
}

function currentViolations() {
  const keys = []
  for (const base of DIRS) {
    for (const abs of walk(join(ROOT, base))) {
      const rel = relative(ROOT, abs).split('\\').join('/')
      if (!docFileKind(rel)) continue // skips _README.md, non-SKILL.md .md
      const content = readFileSync(abs, 'utf-8')
      for (const v of scanDoc(rel, content)) keys.push(`${rel}::doc:${v.id}`)
    }
  }
  return keys.sort()
}

const update = process.argv.includes('--update')
const current = currentViolations()

if (update) {
  writeFileSync(BASELINE, JSON.stringify(current, null, 2) + '\n')
  console.log(`doc-standards-baseline.json updated: ${current.length} known violations recorded.`)
  process.exit(0)
}

let baseline = []
try {
  baseline = JSON.parse(readFileSync(BASELINE, 'utf-8'))
} catch {
  console.error(
    'No doc-standards-baseline.json — run `node scripts/check-authoring-docs.mjs --update` once.'
  )
  process.exit(1)
}

function counts(keys) {
  const m = new Map()
  for (const k of keys) m.set(k, (m.get(k) ?? 0) + 1)
  return m
}
const baseCounts = counts(baseline)
const currCounts = counts(current)
const introduced = []
for (const [k, n] of currCounts) {
  const extra = n - (baseCounts.get(k) ?? 0)
  for (let i = 0; i < extra; i++) introduced.push(k)
}
const fixed = []
for (const [k, n] of baseCounts) {
  const gone = n - (currCounts.get(k) ?? 0)
  for (let i = 0; i < gone; i++) fixed.push(k)
}

if (fixed.length) {
  console.log(`\n↓ ${fixed.length} baseline violation(s) fixed — prune with doc-standards:update:`)
  for (const k of fixed) console.log(`  - ${k}`)
}

if (introduced.length) {
  console.error(`\n✖ ${introduced.length} NEW skill/agent doc-standard violation(s) — blocked:\n`)
  for (const k of introduced) {
    const [file, id] = k.split('::doc:')
    console.error(`  ${file}\n    [${id}] ${MESSAGES[id] ?? id}`)
  }
  console.error(
    '\nFix per .claude/rules/authoring-docs.md. Re-baselining is only for a reviewed exception.'
  )
  process.exit(1)
}

console.log(`✓ doc-standards ratchet: ${current.length} known violations, 0 new.`)
process.exit(0)
