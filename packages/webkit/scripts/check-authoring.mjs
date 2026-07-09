#!/usr/bin/env node
// CI ratchet for the webkit construction + token standards (.claude/rules/), dependency-
// free. Scans packages/webkit/src with the SAME engines the write-time hooks run
// (authoring-checks + token-checks) and fails when a file introduces a violation that is
// NOT already recorded in authoring-baseline.json. Existing debt is grandfathered
// (frozen) so the gate lands without migrating everything; new code must comply — even
// when pushed from an editor that never ran the hooks. Migrate a file → its baseline
// entries disappear → prune with --update.
//
//   node scripts/check-authoring.mjs            # CI: fail on any NEW violation
//   node scripts/check-authoring.mjs --update   # re-snapshot the baseline (deliberate)

import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, resolve } from 'node:path'

import { scanFile, MESSAGES } from '../src/eslint-plugin/authoring-checks.js'
import { scanTokens, tokenChecksApply, TOKEN_MESSAGES } from '../src/eslint-plugin/token-checks.js'
// DS-internal engine (depends on .specs/): the same spec⇄code checks the PostToolUse
// hook runs — no-invention, vocabulary, naming, defaults drift, testid, animations.
import { collectSpecViolations } from '../../../.claude/hooks/_lib/spec-compliance-checks.mjs'
// Storybook "Show code" checks — same engine as validate-story-source.
import {
  checks as storyChecks,
  STORY_RE
} from '../../../.claude/hooks/_lib/story-source-checks.mjs'

const ALL_MESSAGES = { ...MESSAGES, ...TOKEN_MESSAGES }
// key → full message, for violations whose detail is computed at scan time
const DETAILS = new Map()

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(SCRIPT_DIR, '../../..')
const SRC = join(ROOT, 'packages/webkit/src')
const STORIES = join(ROOT, 'apps/storybook/src')
const BASELINE = join(SCRIPT_DIR, 'authoring-baseline.json')
const WIP_PREFIX = 'packages/webkit/src/components/wip/'

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(p))
    else if (/\.(vue|ts|js|css|scss)$/.test(entry.name)) out.push(p)
  }
  return out
}

function currentViolations() {
  const keys = []
  for (const abs of walk(SRC)) {
    const rel = relative(ROOT, abs).split('\\').join('/')
    if (rel.startsWith(WIP_PREFIX)) continue
    const content = readFileSync(abs, 'utf-8')
    // construction standards (defineModel, typed props/emits/slots, composables, @deprecated)
    if (/\.(vue|ts|js)$/.test(rel)) {
      for (const id of scanFile(rel, content)) keys.push(`${rel}::${id}`)
    }
    // token discipline (hex/palette/raw typography/class presets/<style>/keyframes…) —
    // the same checks validate-tokens runs at write time, so an editor push can't bypass them
    if (tokenChecksApply(rel)) {
      for (const id of scanTokens(content)) keys.push(`${rel}::token:${id}`)
    }
    // spec ⇄ code compliance (no-invention, vocabulary, naming, testid, animations) —
    // the same checks validate-spec-compliance runs post-write; skips files with no spec
    // mapping and the legacy whitelist, exactly like the hook.
    if (rel.endsWith('.vue')) {
      const result = collectSpecViolations(abs, ROOT)
      if (result) {
        for (const v of result.violations) keys.push(`${rel}::spec:${v}`)
      }
    }
  }
  // Storybook "Show code" discipline — the same checks validate-story-source runs at
  // write time, over every *.stories.* file (existing debt frozen in the baseline).
  for (const abs of walk(STORIES)) {
    const rel = relative(ROOT, abs).split('\\').join('/')
    if (!STORY_RE.test(rel)) continue
    const content = readFileSync(abs, 'utf-8')
    for (const v of storyChecks(content, '', true)) {
      const key = `${rel}::story:${v.id}`
      keys.push(key)
      DETAILS.set(key, v.message)
    }
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
    const idx = k.indexOf('::')
    const file = k.slice(0, idx)
    const id = k.slice(idx + 2)
    console.error(`  ${file}`)
    if (id.startsWith('spec:')) {
      // spec-compliance keys carry the full violation message
      console.error(`    [spec] ${id.slice(5)}`)
    } else if (id.startsWith('story:')) {
      console.error(`    [${id}] ${DETAILS.get(k) ?? id.slice(6)}`)
    } else {
      console.error(`    [${id}] ${ALL_MESSAGES[id.replace(/^token:/, '')] ?? id}`)
    }
  }
  console.error(
    '\nFix the pattern (see .claude/rules/). Re-baselining is only for a deliberate, reviewed exception.'
  )
  process.exit(1)
}

console.log(`✓ authoring ratchet: ${current.length} known violations, 0 new.`)
process.exit(0)
