#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { listPatternStories } from './lib/patterns.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(SCRIPT_DIR, '../../..')
const CATALOG_PATH = resolve(SCRIPT_DIR, '../catalog.json')
const BASELINE_PATH = resolve(SCRIPT_DIR, 'patterns-lint-baseline.json')
const SKILL_DIRS = [
  resolve(REPO_ROOT, 'skills'),
  resolve(REPO_ROOT, 'packages/webkit/cli-templates/claude/skills')
]

export function skillExists(name, dirs = SKILL_DIRS) {
  return dirs.some((dir) => existsSync(join(dir, name, 'SKILL.md')))
}

export function checkPatternMetadata(patterns, storyFiles, { repoRoot = REPO_ROOT } = {}) {
  const errors = []
  const warnings = []
  const byStory = new Map(Object.entries(patterns).map(([id, p]) => [p.story, id]))
  for (const file of storyFiles) {
    const rel = relative(repoRoot, file).split('\\').join('/')
    if (!byStory.has(rel))
      errors.push(`${rel}: no entry in catalog.json#patterns (run catalog:build)`)
  }
  for (const [id, p] of Object.entries(patterns)) {
    if (!Array.isArray(p.intents) || p.intents.length === 0) {
      warnings.push(`${id}: parameters.webkit.intents is missing or empty in ${p.story}`)
    }
    for (const skill of p.skills || []) {
      if (!skillExists(skill)) errors.push(`${id}: skill "${skill}" does not exist in skills/`)
    }
  }
  return { errors, warnings }
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
  const update = process.argv.includes('--update')
  const warnIntents = process.argv.includes('--warn-intents')
  const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf-8'))
  const patterns = catalog.patterns || {}
  const metadata = checkPatternMetadata(patterns, listPatternStories(REPO_ROOT))
  const errors = warnIntents ? metadata.errors : [...metadata.errors, ...metadata.warnings]
  if (warnIntents) {
    for (const w of metadata.warnings) process.stdout.write(`⚠ ${w}\n`)
  }

  const { counts, samples } = await lintPatterns(patterns)
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
      '\nEvery story in templates/headers, shells and platform is a pattern the AI copies: it needs parameters.webkit.intents, real skills, and an SFC that passes the consumer lint.\n'
    )
    process.exit(1)
  }
  process.stdout.write(
    `✓ ${Object.keys(patterns).length} patterns: intents, skills and consumer lint (baseline for ${Object.keys(baseline).length} legacy patterns)\n`
  )
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  await main()
}
