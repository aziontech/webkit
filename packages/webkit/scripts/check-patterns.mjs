#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { readBlocks } from './lib/blocks.mjs'
import { checkGuidelines, primaryComponents } from './lib/guidelines.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(SCRIPT_DIR, '../../..')
const CATALOG_PATH = resolve(SCRIPT_DIR, '../catalog.json')
const BASELINE_PATH = resolve(SCRIPT_DIR, 'patterns-lint-baseline.json')
const PENDING_PATH = resolve(SCRIPT_DIR, 'guidelines-pending.json')
const SKILL_DIRS = [resolve(REPO_ROOT, 'skills')]

export function skillExists(name, dirs = SKILL_DIRS) {
  return dirs.some((dir) => existsSync(join(dir, name, 'SKILL.md')))
}

export function checkPatternMetadata(patterns, blockIds) {
  const errors = []
  const warnings = []
  for (const id of blockIds) {
    if (!patterns[id])
      errors.push(`blocks/${id}: no entry in catalog.json#patterns (run catalog:build)`)
  }
  for (const [id, p] of Object.entries(patterns)) {
    if (!Array.isArray(p.intents) || p.intents.length === 0) {
      warnings.push(`${id}: "intents" is missing or empty in blocks/${id}/block.json`)
    }
    for (const skill of p.skills || []) {
      if (!skillExists(skill)) errors.push(`${id}: skill "${skill}" does not exist in skills/`)
    }
  }
  return { errors, warnings }
}

export function checkSummaryComponents(patterns) {
  const errors = []
  for (const [id, p] of Object.entries(patterns)) {
    const imported = new Set(
      [p.sfc, ...(p.variants || []).map((v) => v.sfc)].flatMap((sfc) => primaryComponents(sfc))
    )
    const named = [...String(p.summary || '').matchAll(/`([A-Z][A-Za-z0-9]*)`/g)].map((m) => m[1])
    for (const name of new Set(named)) {
      if (!imported.has(name))
        errors.push(
          `blocks/${id}/block.json: the summary names \`${name}\`, which neither the primary nor a variant SFC imports`
        )
    }
  }
  return errors
}

export function checkPatternGuidelines(patterns, { pending = [], only = [] } = {}) {
  const errors = []
  const notes = []
  const waiting = new Set(pending)
  for (const id of pending) {
    if (!patterns[id]) errors.push(`scripts/guidelines-pending.json: "${id}" is not a block`)
  }
  for (const [id, p] of Object.entries(patterns)) {
    if (only.length && !only.some((prefix) => id.startsWith(prefix))) continue
    if (waiting.has(id)) {
      if (p.guidelines)
        notes.push(`${id} has guidelines.md: remove it from scripts/guidelines-pending.json`)
      else continue
    }
    errors.push(...checkGuidelines(id, p))
  }
  return { errors, notes }
}

export function parseCheckArgs(argv) {
  const opts = { update: false, warnIntents: false, only: [] }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--update') opts.update = true
    else if (arg === '--warn-intents') opts.warnIntents = true
    else if (arg === '--only') opts.only.push(...(argv[++i] ?? '').split(',').filter(Boolean))
    else if (arg.startsWith('--only=')) opts.only.push(...arg.slice(7).split(',').filter(Boolean))
  }
  return opts
}

async function consumerLinter() {
  process.env.WEBKIT_CATALOG_PATH = CATALOG_PATH
  const [{ Linter }, vueParser, { default: plugin }] = await Promise.all([
    import('eslint'),
    import('vue-eslint-parser'),
    import('../src/eslint-plugin/index.js')
  ])
  const rules = Object.fromEntries(
    Object.keys(plugin.rules)
      .filter((rule) => rule !== 'authoring-standards')
      .map((rule) => [`webkit/${rule}`, 'error'])
  )
  const config = [
    {
      files: ['**/*.vue'],
      languageOptions: { parser: vueParser, ecmaVersion: 2022, sourceType: 'module' },
      plugins: { webkit: plugin },
      rules
    }
  ]
  const linter = new Linter({ configType: 'flat' })
  return (sfc, filename) => linter.verify(sfc, config, { filename })
}

export async function lintPatterns(patterns) {
  const lint = await consumerLinter()
  const counts = {}
  const samples = {}
  for (const [id, p] of Object.entries(patterns)) {
    for (const variant of [{ name: p.primary, sfc: p.sfc }, ...(p.variants || [])]) {
      const messages = lint(variant.sfc, `${id.replace(/\//g, '__')}__${variant.name}.vue`)
      for (const m of messages) {
        const rule = m.ruleId || 'parse-error'
        counts[id] ||= {}
        counts[id][rule] = (counts[id][rule] || 0) + 1
        samples[id] ||= `${variant.name}: ${m.message}`
      }
    }
  }
  return { counts, samples }
}

export function compareToBaseline(counts, baseline) {
  const regressions = []
  for (const [id, rules] of Object.entries(counts)) {
    for (const [rule, n] of Object.entries(rules)) {
      const allowed = baseline[id]?.[rule] ?? 0
      if (n > allowed) regressions.push({ id, rule, count: n, allowed })
    }
  }
  return regressions
}

async function main() {
  const { update, warnIntents, only } = parseCheckArgs(process.argv.slice(2))
  const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf-8'))
  const patterns = catalog.patterns || {}
  const blocks = readBlocks(resolve(SCRIPT_DIR, '..'))
  const metadata = checkPatternMetadata(patterns, Object.keys(blocks))
  const pending = existsSync(PENDING_PATH) ? JSON.parse(readFileSync(PENDING_PATH, 'utf-8')) : []
  const guidelines = checkPatternGuidelines(blocks, { pending, only })
  for (const n of guidelines.notes) process.stdout.write(`ℹ ${n}\n`)
  const errors = [
    ...(warnIntents ? metadata.errors : [...metadata.errors, ...metadata.warnings]),
    ...guidelines.errors,
    ...checkSummaryComponents(blocks)
  ]
  if (warnIntents) {
    for (const w of metadata.warnings) process.stdout.write(`⚠ ${w}\n`)
  }

  const { counts, samples } = await lintPatterns(blocks)
  if (update) {
    const sorted = Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)))
    writeFileSync(BASELINE_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf-8')
    process.stdout.write(
      `patterns-lint-baseline.json updated (${Object.keys(sorted).length} patterns)\n`
    )
  }
  const baseline = existsSync(BASELINE_PATH) ? JSON.parse(readFileSync(BASELINE_PATH, 'utf-8')) : {}
  const regressions = update ? [] : compareToBaseline(counts, baseline)
  const fixed = Object.entries(baseline).flatMap(([id, rules]) =>
    Object.entries(rules)
      .filter(([rule, n]) => (counts[id]?.[rule] ?? 0) < n)
      .map(([rule]) => `${id} ${rule}`)
  )

  for (const e of errors) process.stderr.write(`✖ ${e}\n`)
  for (const r of regressions) {
    process.stderr.write(
      `✖ ${r.id}: ${r.count} × ${r.rule} in the pattern SFC (baseline allows ${r.allowed}). ${samples[r.id] ?? ''}\n`
    )
  }
  if (fixed.length && !update) {
    process.stdout.write(
      `ℹ fewer lint findings than the baseline — run \`pnpm --filter @aziontech/webkit run patterns:check --update\` to lock in: ${fixed.join(', ')}\n`
    )
  }
  if (errors.length || regressions.length) {
    process.stderr.write(
      '\nEvery block in packages/webkit/blocks is a pattern the AI copies: it needs intents in block.json, real skills, a guidelines.md whose building blocks and states match the SFC and block.json, and SFCs that pass the consumer lint.\n'
    )
    process.exit(1)
  }
  process.stdout.write(
    `✓ ${Object.keys(patterns).length} patterns: intents, skills, guidelines (${pending.length} pending) and consumer lint (baseline for ${Object.keys(baseline).length} legacy patterns)\n`
  )
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  await main()
}
