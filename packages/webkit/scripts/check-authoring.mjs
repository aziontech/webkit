#!/usr/bin/env node

import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, resolve } from 'node:path'

import { CONTENT_CHECKS, scanFile, MESSAGES } from '../src/eslint-plugin/authoring-checks.js'
import { scanTokens, tokenChecksApply, TOKEN_MESSAGES } from '../src/eslint-plugin/token-checks.js'
import noPhysicalDirection from '../src/eslint-plugin/rules/no-physical-direction.js'
import { Linter } from 'eslint'
import * as vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'
import {
  appliesToBuiltInStrings,
  scanBuiltInStrings,
  STRING_MESSAGES
} from './lib/built-in-strings.mjs'
import { collectSpecViolations } from '../../../.claude/hooks/_lib/spec-compliance-checks.mjs'

const ALL_MESSAGES = { ...MESSAGES, ...TOKEN_MESSAGES, ...STRING_MESSAGES }
const DIRECTION_DIRS = ['src/components', 'blocks', 'examples']
const DETAILS = new Map()

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(SCRIPT_DIR, '../../..')
const SRC = join(ROOT, 'packages/webkit/src')
const PACKAGES = join(ROOT, 'packages')
const SKIP_DIRS = new Set(['node_modules', 'dist', '.turbo', 'coverage'])
const PROSE_COMMENT = CONTENT_CHECKS.find((c) => c.id === 'prose-comment')
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

function directionViolations() {
  const linter = new Linter({ configType: 'flat' })
  const config = [
    {
      files: ['**/*.vue', '**/*.ts', '**/*.js'],
      languageOptions: {
        parser: vueParser,
        parserOptions: { parser: tsParser, ecmaVersion: 'latest', sourceType: 'module' }
      },
      plugins: { webkit: { rules: { 'no-physical-direction': noPhysicalDirection } } },
      rules: { 'webkit/no-physical-direction': 'error' }
    }
  ]
  const keys = []
  for (const dir of DIRECTION_DIRS) {
    for (const abs of walk(join(ROOT, 'packages/webkit', dir))) {
      if (!/\.(vue|ts|js)$/.test(abs) || /\.(test|stories)\.ts$/.test(abs)) continue
      const rel = relative(ROOT, abs).split('\\').join('/')
      const messages = linter.verify(readFileSync(abs, 'utf-8'), config, { filename: abs })
      for (const m of messages) {
        if (m.ruleId !== 'webkit/no-physical-direction') continue
        const key = `${rel}::direction:no-physical-direction`
        keys.push(key)
        DETAILS.set(key, `line ${m.line}: ${m.message}`)
      }
    }
  }
  return keys
}

function currentViolations() {
  const keys = [...directionViolations()]
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
    if (appliesToBuiltInStrings(rel)) {
      for (const id of scanBuiltInStrings(content)) keys.push(`${rel}::i18n:${id}`)
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
    } else if (id.startsWith('direction:')) {
      console.error(`    [${id}] ${DETAILS.get(k) ?? id.slice(10)}`)
    } else {
      console.error(`    [${id}] ${ALL_MESSAGES[id.replace(/^(token|i18n):/, '')] ?? id}`)
    }
  }
  console.error(
    '\nFix the pattern (see .claude/rules/). Re-baselining is only for a deliberate, reviewed exception.'
  )
  process.exit(1)
}

console.log(`✓ authoring ratchet: ${current.length} known violations, 0 new.`)
process.exit(0)
