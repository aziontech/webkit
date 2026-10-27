#!/usr/bin/env node

import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, resolve } from 'node:path'

import { CONTENT_CHECKS, scanFile, MESSAGES } from '../src/eslint-plugin/authoring-checks.js'
import { scanTokens, tokenChecksApply, TOKEN_MESSAGES } from '../src/eslint-plugin/token-checks.js'
import { collectSpecViolations } from '../../../.claude/hooks/_lib/spec-compliance-checks.mjs'
import {
  checks as storyChecks,
  STORY_RE
} from '../../../.claude/hooks/_lib/story-source-checks.mjs'

const ALL_MESSAGES = { ...MESSAGES, ...TOKEN_MESSAGES }
const DETAILS = new Map()

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(SCRIPT_DIR, '../../..')
const SRC = join(ROOT, 'packages/webkit/src')
const PACKAGES = join(ROOT, 'packages')
const SKIP_DIRS = new Set(['node_modules', 'dist', '.turbo', 'coverage'])
const PROSE_COMMENT = CONTENT_CHECKS.find((c) => c.id === 'prose-comment')
const STORIES = join(ROOT, 'apps/storybook/src')
const BASELINE = join(SCRIPT_DIR, 'authoring-baseline.json')
const WIP_PREFIX = 'packages/webkit/src/components/wip/'

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) out.push(...walk(p))
    } else if (/\.(vue|ts|tsx|js|jsx|mjs|css|scss)$/.test(entry.name)) out.push(p)
  }
  return out
}

function currentViolations() {
  const keys = []
  for (const abs of walk(SRC)) {
    const rel = relative(ROOT, abs).split('\\').join('/')
    if (rel.startsWith(WIP_PREFIX)) continue
    const content = readFileSync(abs, 'utf-8')
    if (/\.(vue|ts|js)$/.test(rel)) {
      for (const id of scanFile(rel, content)) keys.push(`${rel}::${id}`)
    }
    if (tokenChecksApply(rel)) {
      for (const id of scanTokens(content)) keys.push(`${rel}::token:${id}`)
    }
    if (rel.endsWith('.vue')) {
      const result = collectSpecViolations(abs, ROOT, { requireSpec: true })
      if (result) {
        for (const v of result.violations) keys.push(`${rel}::spec:${v}`)
      }
    }
  }
  for (const abs of walk(PACKAGES)) {
    if (abs.startsWith(SRC + '/')) continue
    const rel = relative(ROOT, abs).split('\\').join('/')
    if (!PROSE_COMMENT.applies(rel)) continue
    const n = PROSE_COMMENT.count(readFileSync(abs, 'utf-8'), rel)
    for (let i = 0; i < n; i++) keys.push(`${rel}::prose-comment`)
  }
  for (const abs of walk(STORIES)) {
    const rel = relative(ROOT, abs).split('\\').join('/')
    if (!STORY_RE.test(rel)) continue
    const content = readFileSync(abs, 'utf-8')
    for (const v of storyChecks(content, rel)) {
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
