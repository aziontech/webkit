#!/usr/bin/env node

import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, resolve } from 'node:path'

import { CONTENT_CHECKS, scanFile, MESSAGES } from '../src/eslint-plugin/lib/authoring-checks.js'
import {
  scanTokens,
  tokenChecksApply,
  TOKEN_MESSAGES
} from '../src/eslint-plugin/lib/token-checks.js'
import { scanSignatures } from '../src/eslint-plugin/lib/signature-checks.js'
import {
  EXAMPLE_DATA_DIRS,
  EXAMPLE_DATA_MESSAGES,
  exampleDataApplies,
  RETIRED_NAME_DIRS,
  scanExampleData,
  scanRetiredNames
} from '../src/eslint-plugin/lib/example-data.js'
import {
  scanTextureBackdrop,
  TEXTURE_BACKDROP_DIRS,
  TEXTURE_BACKDROP_MESSAGES,
  textureBackdropApplies
} from '../src/eslint-plugin/lib/texture-backdrop.js'
import noClockInSetup from '../src/eslint-plugin/rules/no-clock-in-setup.js'
import noPhysicalDirection from '../src/eslint-plugin/rules/no-physical-direction.js'
import noViewportHeightCalc from '../src/eslint-plugin/rules/no-viewport-height-calc.js'
import { Linter } from 'eslint'
import * as vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'
import {
  appliesToBuiltInStrings,
  scanBuiltInStrings,
  STRING_MESSAGES
} from '../src/eslint-plugin/lib/built-in-strings.js'
import { collectSpecViolations } from '../../../contributing/hooks/lib/spec-compliance-checks.mjs'
import {
  REPO_WIDE_TOKEN_DIRS,
  repoTokenChecksFor
} from '../../../contributing/hooks/lib/token-checks.mjs'

const ALL_MESSAGES = { ...MESSAGES, ...TOKEN_MESSAGES, ...STRING_MESSAGES }
const DIRECTION_DIRS = ['src/components', 'blocks', 'examples']
const CLOCK_DIRS = ['blocks', 'examples']
const PAGE_BODY_DIRS = ['blocks', 'examples']
const DETAILS = new Map()

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(SCRIPT_DIR, '../../..')
const SRC = join(ROOT, 'packages/ui/src')
const PACKAGES = join(ROOT, 'packages')
const SKIP_DIRS = new Set(['node_modules', 'dist', '.turbo', 'coverage'])
const PROSE_COMMENT = CONTENT_CHECKS.find((c) => c.id === 'prose-comment')
const BASELINE = join(SCRIPT_DIR, 'authoring-baseline.json')
const WIP_PREFIX = 'packages/ui/src/components/wip/'

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
      plugins: { 'azion-ui': { rules: { 'no-physical-direction': noPhysicalDirection } } },
      rules: { 'azion-ui/no-physical-direction': 'error' }
    }
  ]
  const keys = []
  for (const dir of DIRECTION_DIRS) {
    for (const abs of walk(join(ROOT, 'packages/ui', dir))) {
      if (!/\.(vue|ts|js)$/.test(abs) || /\.test\.ts$/.test(abs)) continue
      const rel = relative(ROOT, abs).split('\\').join('/')
      const messages = linter.verify(readFileSync(abs, 'utf-8'), config, { filename: abs })
      for (const m of messages) {
        if (m.ruleId !== 'azion-ui/no-physical-direction') continue
        const key = `${rel}::direction:no-physical-direction`
        keys.push(key)
        DETAILS.set(key, `line ${m.line}: ${m.message}`)
      }
    }
  }
  return keys
}

function clockViolations() {
  const linter = new Linter({ configType: 'flat' })
  const config = [
    {
      files: ['**/*.vue', '**/*.ts', '**/*.js'],
      languageOptions: {
        parser: vueParser,
        parserOptions: { parser: tsParser, ecmaVersion: 'latest', sourceType: 'module' }
      },
      plugins: { 'azion-ui': { rules: { 'no-clock-in-setup': noClockInSetup } } },
      rules: { 'azion-ui/no-clock-in-setup': 'error' }
    }
  ]
  const keys = []
  for (const dir of CLOCK_DIRS) {
    for (const abs of walk(join(ROOT, 'packages/ui', dir))) {
      if (!/\.(vue|ts|js)$/.test(abs) || /\.test\.ts$/.test(abs)) continue
      const source = readFileSync(abs, 'utf-8')
      if (!/\bDate\b/.test(source)) continue
      const rel = relative(ROOT, abs).split('\\').join('/')
      for (const m of linter.verify(source, config, { filename: abs })) {
        if (m.ruleId !== 'azion-ui/no-clock-in-setup') continue
        const key = `${rel}::clock:no-clock-in-setup`
        keys.push(key)
        DETAILS.set(key, `line ${m.line}: ${m.message}`)
      }
    }
  }
  return keys
}

function viewportHeightViolations() {
  const linter = new Linter({ configType: 'flat' })
  const config = [
    {
      files: ['**/*.vue', '**/*.ts', '**/*.js'],
      languageOptions: {
        parser: vueParser,
        parserOptions: { parser: tsParser, ecmaVersion: 'latest', sourceType: 'module' }
      },
      plugins: { 'azion-ui': { rules: { 'no-viewport-height-calc': noViewportHeightCalc } } },
      rules: { 'azion-ui/no-viewport-height-calc': 'error' }
    }
  ]
  const keys = []
  for (const dir of PAGE_BODY_DIRS) {
    for (const abs of walk(join(ROOT, 'packages/ui', dir))) {
      if (!/\.(vue|ts|js)$/.test(abs) || /\.test\.ts$/.test(abs)) continue
      const source = readFileSync(abs, 'utf-8')
      if (!/100[dsl]?vh/.test(source)) continue
      const rel = relative(ROOT, abs).split('\\').join('/')
      for (const m of linter.verify(source, config, { filename: abs })) {
        if (m.ruleId !== 'azion-ui/no-viewport-height-calc') continue
        const key = `${rel}::layout:no-viewport-height-calc`
        keys.push(key)
        DETAILS.set(key, `line ${m.line}: ${m.message}`)
      }
    }
  }
  return keys
}

function walkAll(dir) {
  const out = []
  let entries = []
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) out.push(...walkAll(p))
    } else out.push(p)
  }
  return out
}

function exampleDataViolations() {
  const keys = []
  for (const dir of EXAMPLE_DATA_DIRS) {
    for (const abs of walkAll(join(ROOT, dir))) {
      const rel = relative(ROOT, abs).split('\\').join('/')
      if (!exampleDataApplies(rel)) continue
      for (const id of scanExampleData(readFileSync(abs, 'utf-8'))) {
        keys.push(`${rel}::example-data:${id}`)
      }
    }
  }
  for (const dir of RETIRED_NAME_DIRS) {
    for (const abs of walkAll(join(ROOT, dir))) {
      const rel = relative(ROOT, abs).split('\\').join('/')
      if (!exampleDataApplies(rel)) continue
      for (const id of scanRetiredNames(readFileSync(abs, 'utf-8'))) {
        keys.push(`${rel}::example-data:${id}`)
      }
    }
  }
  return keys
}

function textureBackdropViolations() {
  const keys = []
  for (const dir of TEXTURE_BACKDROP_DIRS) {
    for (const abs of walkAll(join(ROOT, dir))) {
      const rel = relative(ROOT, abs).split('\\').join('/')
      if (!textureBackdropApplies(rel)) continue
      for (const id of scanTextureBackdrop(readFileSync(abs, 'utf-8'), rel)) {
        keys.push(`${rel}::texture-backdrop:${id}`)
      }
    }
  }
  return keys
}

function wideTokenViolations() {
  const keys = []
  for (const dir of REPO_WIDE_TOKEN_DIRS) {
    for (const abs of walkAll(join(ROOT, dir))) {
      const rel = relative(ROOT, abs).split('\\').join('/')
      if (tokenChecksApply(rel)) continue
      const checks = repoTokenChecksFor(rel)
      if (checks.length === 0) continue
      for (const id of scanTokens(readFileSync(abs, 'utf-8'), checks)) {
        keys.push(`${rel}::token:${id}`)
      }
    }
  }
  return keys
}

function currentViolations() {
  const keys = [
    ...wideTokenViolations(),
    ...directionViolations(),
    ...clockViolations(),
    ...viewportHeightViolations(),
    ...exampleDataViolations(),
    ...textureBackdropViolations()
  ]
  for (const abs of walk(SRC)) {
    const rel = relative(ROOT, abs).split('\\').join('/')
    if (rel.startsWith(WIP_PREFIX) || rel.endsWith('.d.ts')) continue
    const content = readFileSync(abs, 'utf-8')
    if (/\.(vue|ts|js)$/.test(rel)) {
      for (const id of scanFile(rel, content)) keys.push(`${rel}::${id}`)
    }
    for (const found of scanSignatures(abs, content)) {
      const key = `${rel}::signature:${found.id}`
      keys.push(key)
      DETAILS.set(key, `line ${found.line}: ${found.message}`)
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
const prune = process.argv.includes('--prune')
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

if (prune) {
  const drop = counts(fixed)
  const kept = baseline.filter((k) => {
    const n = drop.get(k) ?? 0
    if (!n) return true
    drop.set(k, n - 1)
    return false
  })
  writeFileSync(BASELINE, JSON.stringify(kept, null, 2) + '\n')
  console.log(
    `authoring-baseline.json pruned: ${fixed.length} fixed violation(s) removed, nothing added.`
  )
} else if (fixed.length) {
  console.log(
    `\n↓ ${fixed.length} baseline violation(s) fixed — prune with \`node scripts/check-authoring.mjs --prune\`:`
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
    } else if (
      id.startsWith('direction:') ||
      id.startsWith('clock:') ||
      id.startsWith('layout:') ||
      id.startsWith('signature:')
    ) {
      console.error(`    [${id}] ${DETAILS.get(k) ?? id.slice(id.indexOf(':') + 1)}`)
    } else if (id.startsWith('texture-backdrop:')) {
      console.error(
        `    [${id}] ${TEXTURE_BACKDROP_MESSAGES[id.slice('texture-backdrop:'.length)]}`
      )
    } else if (id.startsWith('example-data:')) {
      console.error(`    [${id}] ${EXAMPLE_DATA_MESSAGES[id.slice('example-data:'.length)]}`)
    } else {
      console.error(`    [${id}] ${ALL_MESSAGES[id.replace(/^(token|i18n):/, '')] ?? id}`)
    }
  }
  console.error(
    '\nFix the pattern (see contributing/rules/). Re-baselining is only for a deliberate, reviewed exception.'
  )
  process.exit(1)
}

console.log(`✓ authoring ratchet: ${current.length} known violations, 0 new.`)
process.exit(0)
