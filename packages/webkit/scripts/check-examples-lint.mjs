#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { _internals } from '../src/cli/plan.js'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const PKG = resolve(SCRIPT_DIR, '..')
const EXAMPLES_DIR = resolve(PKG, 'examples')
const BASELINE_PATH = resolve(SCRIPT_DIR, 'examples-lint-baseline.json')
const PRESET = 'strict'

export function consumerConfigSource(preset = PRESET) {
  return _internals.eslintFlatConfig(preset)
}

export function resolveConfigImports(source, resolveSpecifier) {
  return source.replace(
    /^(import\s+[\w{}\s,*]+\s+from\s+)'([^']+)'/gm,
    (_, head, spec) => `${head}'${resolveSpecifier(spec)}'`
  )
}

export async function loadConsumerConfig(preset = PRESET) {
  const source = resolveConfigImports(consumerConfigSource(preset), (spec) =>
    import.meta.resolve(spec)
  )
  const mod = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
  return mod.default
}

export function countMessages(results, root = EXAMPLES_DIR) {
  const counts = {}
  const samples = {}
  for (const result of results) {
    const file = relative(root, result.filePath).split('\\').join('/')
    for (const m of result.messages) {
      const rule = m.ruleId || 'parse-error'
      counts[file] ||= {}
      counts[file][rule] = (counts[file][rule] || 0) + 1
      samples[`${file} ${rule}`] ||= `${m.line}:${m.column} ${m.message}`
    }
  }
  return { counts, samples }
}

export function sortCounts(counts) {
  return Object.fromEntries(
    Object.keys(counts)
      .sort()
      .map((file) => [
        file,
        Object.fromEntries(
          Object.keys(counts[file])
            .sort()
            .map((rule) => [rule, counts[file][rule]])
        )
      ])
  )
}

export function compareToBaseline(counts, baseline) {
  const regressions = []
  const fixed = []
  for (const [file, rules] of Object.entries(counts)) {
    for (const [rule, count] of Object.entries(rules)) {
      const allowed = baseline[file]?.[rule] ?? 0
      if (count > allowed) regressions.push({ file, rule, count, allowed })
    }
  }
  for (const [file, rules] of Object.entries(baseline)) {
    for (const [rule, allowed] of Object.entries(rules)) {
      const count = counts[file]?.[rule] ?? 0
      if (count < allowed) fixed.push({ file, rule, count, allowed })
    }
  }
  return { regressions, fixed }
}

export function total(counts) {
  return Object.values(counts).reduce(
    (sum, rules) => sum + Object.values(rules).reduce((a, b) => a + b, 0),
    0
  )
}

export async function lintExamples({ dir = EXAMPLES_DIR, preset = PRESET } = {}) {
  process.env.WEBKIT_CATALOG_PATH ||= resolve(PKG, 'catalog.json')
  const { ESLint } = await import('eslint')
  const eslint = new ESLint({
    cwd: dir,
    overrideConfigFile: true,
    overrideConfig: await loadConsumerConfig(preset),
    errorOnUnmatchedPattern: false,
    cache: false
  })
  const results = await eslint.lintFiles(['**/*.vue', '**/*.{js,jsx,ts,tsx,mjs,cjs}'])
  return { results, ...countMessages(results, dir) }
}

async function main() {
  const update = process.argv.includes('--update')
  const started = Date.now()
  const { results, counts, samples } = await lintExamples()
  const seconds = ((Date.now() - started) / 1000).toFixed(1)

  if (update) {
    writeFileSync(BASELINE_PATH, JSON.stringify(sortCounts(counts), null, 2) + '\n', 'utf-8')
    process.stdout.write(
      `examples-lint-baseline.json updated: ${total(counts)} findings in ${Object.keys(counts).length} files\n`
    )
    return
  }

  const baseline = existsSync(BASELINE_PATH) ? JSON.parse(readFileSync(BASELINE_PATH, 'utf-8')) : {}
  const { regressions, fixed } = compareToBaseline(counts, baseline)

  for (const r of regressions) {
    process.stderr.write(
      `✖ examples/${r.file}: ${r.count} × ${r.rule} (baseline allows ${r.allowed}). ${samples[`${r.file} ${r.rule}`] ?? ''}\n`
    )
  }
  if (regressions.length) {
    process.stderr.write(
      `\nExamples are what AI agents copy, so they must pass the lint \`npx @aziontech/webkit init\` installs (webkit ${PRESET} preset). Fix the example; the baseline only shrinks.\n`
    )
    process.exit(1)
  }
  if (fixed.length) {
    process.stdout.write(
      `ℹ ${fixed.length} baseline entr${fixed.length === 1 ? 'y' : 'ies'} improved — lock in with \`node scripts/check-examples-lint.mjs --update\`:\n`
    )
    for (const f of fixed)
      process.stdout.write(`  - examples/${f.file} ${f.rule}: ${f.allowed} → ${f.count}\n`)
  }
  process.stdout.write(
    `✓ ${results.length} example files pass the consumer lint (${PRESET}); ${total(counts)} legacy findings in ${Object.keys(counts).length} files held by the baseline (${seconds} s)\n`
  )
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  await main()
}
