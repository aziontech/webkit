#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { checkBlockCodeNames } from './lib/block-code-names.mjs'
import { checkDataContract } from './lib/block-data.mjs'
import { readBlocks } from './lib/blocks.mjs'
import {
  checkGuidelines,
  checkToastRegion,
  partSfcs,
  primaryComponents
} from './lib/guidelines.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(SCRIPT_DIR, '../../..')
const CATALOG_PATH = resolve(SCRIPT_DIR, '../catalog.json')
const BASELINE_PATH = resolve(SCRIPT_DIR, 'blocks-baseline.json')
const PENDING_PATH = resolve(SCRIPT_DIR, 'guidelines-baseline.json')
const DATA_BASELINE_PATH = resolve(SCRIPT_DIR, 'blocks-data-baseline.json')
const DATA_MESSAGES = {
  'variant-copy':
    'the VARIANT variant repeats 90 % or more of the primary SFC. Import the primary and pass it other props or slots.',
  'variant-fork':
    'the VARIANT variant copies 60 % or more of the primary SFC and adds its own code, so it misses every later fix to the primary. ' +
    'Import the primary and give it the prop, slot or event the state needs.',
  'variant-sibling-copy':
    'the VARIANT variant repeats 80 % or more of another variant of the block. Move the shared screen into a part or the primary and render it with props.',
  'no-props':
    'the primary SFC declares no props. Take the records, loading and error through typed props and emit the actions.',
  'inline-records':
    'the primary SFC holds sample records. Move them to a sample file listed in block.json "files" and pass them in as props.'
}
const SKILL_DIRS = [resolve(REPO_ROOT, 'skills')]

export function skillExists(name, dirs = SKILL_DIRS) {
  return dirs.some((dir) => existsSync(join(dir, name, 'SKILL.md')))
}

export function checkBlockMetadata(catalogBlocks, blockIds) {
  const errors = []
  const warnings = []
  for (const id of blockIds) {
    if (!catalogBlocks[id])
      errors.push(`blocks/${id}: no entry in catalog.json#blocks (run build:catalog)`)
  }
  for (const [id, p] of Object.entries(catalogBlocks)) {
    if (!Array.isArray(p.intents) || p.intents.length === 0) {
      warnings.push(`${id}: "intents" is missing or empty in blocks/${id}/block.json`)
    }
    for (const skill of p.skills || []) {
      if (!skillExists(skill)) errors.push(`${id}: skill "${skill}" does not exist in skills/`)
    }
  }
  return { errors, warnings }
}

export function checkSummaryComponents(blocks) {
  const errors = []
  for (const [id, p] of Object.entries(blocks)) {
    const imported = new Set(
      [p.sfc, ...(p.variants || []).map((v) => v.sfc), ...partSfcs(p)].flatMap((sfc) =>
        primaryComponents(sfc)
      )
    )
    const named = [...String(p.summary || '').matchAll(/`([A-Z][A-Za-z0-9]*)`/g)].map((m) => m[1])
    for (const name of new Set(named)) {
      if (!imported.has(name))
        errors.push(
          `blocks/${id}/block.json: the summary names \`${name}\`, which no SFC of the block (primary, variant or part) imports`
        )
    }
  }
  return errors
}

export function checkToastRegions(blocks) {
  return Object.entries(blocks).flatMap(([id, p]) => checkToastRegion(id, p))
}

export function checkBlockGuidelines(blocks, { pending = [], only = [] } = {}) {
  const errors = []
  const notes = []
  const waiting = new Set(pending)
  for (const id of pending) {
    if (!blocks[id]) errors.push(`scripts/guidelines-baseline.json: "${id}" is not a block`)
  }
  for (const [id, p] of Object.entries(blocks)) {
    if (only.length && !only.some((prefix) => id.startsWith(prefix))) continue
    if (waiting.has(id)) {
      if (p.guidelines)
        notes.push(`${id} has guidelines.md: remove it from scripts/guidelines-baseline.json`)
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
  process.env.AZION_UI_CATALOG_PATH = CATALOG_PATH
  const [{ Linter }, vueParser, tsParser, { default: plugin }] = await Promise.all([
    import('eslint'),
    import('vue-eslint-parser'),
    import('@typescript-eslint/parser'),
    import('../src/eslint-plugin/index.js')
  ])
  const rules = Object.fromEntries(
    Object.keys(plugin.rules)
      .filter((rule) => rule !== 'require-authoring-standards')
      .map((rule) => [`azion-ui/${rule}`, 'error'])
  )
  const config = [
    {
      files: ['**/*.vue'],
      languageOptions: {
        parser: vueParser,
        parserOptions: { parser: tsParser },
        ecmaVersion: 2022,
        sourceType: 'module'
      },
      plugins: { 'azion-ui': plugin },
      rules
    },
    {
      files: ['**/*.{ts,js,mjs}'],
      languageOptions: { parser: tsParser, ecmaVersion: 2022, sourceType: 'module' },
      plugins: { 'azion-ui': plugin },
      rules
    }
  ]
  const linter = new Linter({ configType: 'flat' })
  return (sfc, filename) => linter.verify(sfc, config, { filename })
}

const LINTED_LOCAL = /\.(vue|ts|js|mjs)$/

export function blockSources(id, p) {
  const sources = [
    { name: p.primary, file: `${id.replace(/\//g, '__')}__${p.primary}.vue`, sfc: p.sfc },
    ...(p.variants || []).map((v) => ({
      name: v.name,
      file: `${id.replace(/\//g, '__')}__${v.name}.vue`,
      sfc: v.sfc
    }))
  ]
  const local = { ...(p.files || {}), ...(p.localSources || {}) }
  for (const [file, sfc] of Object.entries(local).sort(([a], [b]) => a.localeCompare(b)))
    if (LINTED_LOCAL.test(file))
      sources.push({ name: file, file: resolve(SCRIPT_DIR, '..', 'blocks', id, file), sfc })
  return sources
}

export async function lintBlocks(blocks) {
  const lint = await consumerLinter()
  const counts = {}
  const samples = {}
  for (const [id, p] of Object.entries(blocks)) {
    for (const source of blockSources(id, p)) {
      const messages = lint(source.sfc, source.file)
      for (const m of messages) {
        const rule = m.ruleId || 'parse-error'
        counts[id] ||= {}
        counts[id][rule] = (counts[id][rule] || 0) + 1
        samples[id] ||= `${source.name}:${m.line}: ${m.message}`
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
  const catalogBlocks = catalog.blocks || {}
  const blocks = readBlocks(resolve(SCRIPT_DIR, '..'))
  const metadata = checkBlockMetadata(catalogBlocks, Object.keys(blocks))
  const pending = existsSync(PENDING_PATH) ? JSON.parse(readFileSync(PENDING_PATH, 'utf-8')) : []
  const guidelines = checkBlockGuidelines(blocks, { pending, only })
  for (const n of guidelines.notes) process.stdout.write(`ℹ ${n}\n`)
  const errors = [
    ...(warnIntents ? metadata.errors : [...metadata.errors, ...metadata.warnings]),
    ...guidelines.errors,
    ...checkSummaryComponents(blocks),
    ...checkToastRegions(blocks),
    ...checkBlockCodeNames(blocks)
  ]
  if (warnIntents) {
    for (const w of metadata.warnings) process.stdout.write(`⚠ ${w}\n`)
  }

  const dataBaseline = existsSync(DATA_BASELINE_PATH)
    ? JSON.parse(readFileSync(DATA_BASELINE_PATH, 'utf-8'))
    : []
  const data = checkDataContract(blocks, update ? [] : dataBaseline)
  if (update) {
    writeFileSync(DATA_BASELINE_PATH, JSON.stringify(data.keys.sort(), null, 2) + '\n', 'utf-8')
    process.stdout.write(`blocks-data-baseline.json updated (${data.keys.length} keys)\n`)
  } else {
    for (const key of data.introduced) {
      const [id, kind, variant] = key.split(':')
      errors.push(`blocks/${id}: ${DATA_MESSAGES[kind].replace('VARIANT', variant)}`)
    }
    if (data.fixed.length)
      process.stdout.write(
        `ℹ ${data.fixed.length} data-contract findings fixed — run \`pnpm --filter @aziontech/ui run check:blocks --update\` to lock in: ${data.fixed.join(', ')}\n`
      )
  }

  const { counts, samples } = await lintBlocks(blocks)
  if (update) {
    const sorted = Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)))
    writeFileSync(BASELINE_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf-8')
    process.stdout.write(`blocks-baseline.json updated (${Object.keys(sorted).length} blocks)\n`)
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
      `✖ ${r.id}: ${r.count} × ${r.rule} in the block page, variants and local files (baseline allows ${r.allowed}). ${samples[r.id] ?? ''}\n`
    )
  }
  if (fixed.length && !update) {
    process.stdout.write(
      `ℹ fewer lint findings than the baseline — run \`pnpm --filter @aziontech/ui run check:blocks --update\` to lock in: ${fixed.join(', ')}\n`
    )
  }
  if (errors.length || regressions.length) {
    process.stderr.write(
      '\nEvery block in packages/ui/blocks is a screen the AI copies: it needs intents in block.json, real skills, a guidelines.md whose building blocks and states match the SFC and block.json, a page, variants and local parts, lib modules and composables that pass the consumer lint, no Toaster outside an app root (blocks/shell), no block code name (AccountBilling) in text a person reads, and a data contract: typed props in, events out, sample records in a separate file, variants that import the primary instead of copying it.\n'
    )
    process.exit(1)
  }
  process.stdout.write(
    `✓ ${Object.keys(catalogBlocks).length} blocks: intents, skills, guidelines (${pending.length} pending) and consumer lint (baseline for ${Object.keys(baseline).length} legacy blocks)\n`
  )
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  await main()
}
