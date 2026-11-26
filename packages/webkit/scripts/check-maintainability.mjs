#!/usr/bin/env node

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { COUNTING, LIMITS, measure, RULES, summarize } from './lib/maintainability.mjs'

const PKG_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const describe = (v) =>
  `${v.rule} ${v.value} > ${v.limit}${v.name ? ` (${v.name})` : ''}${v.line > 1 ? ` at line ${v.line}` : ''}`

async function main() {
  const started = Date.now()
  const files = await measure(PKG_DIR)
  const failing = files.filter((f) => f.violations.length)
  const violations = failing.flatMap((f) => f.violations.map((v) => ({ file: f.file, ...v })))
  const summary = summarize(files)

  if (process.argv.includes('--json')) {
    console.log(
      JSON.stringify({ limits: LIMITS, counting: COUNTING, summary, violations, files }, null, 2)
    )
    process.exit(violations.length ? 1 : 0)
  }

  if (process.argv.includes('--report')) {
    for (const entry of failing) {
      console.log(entry.file)
      for (const v of entry.violations) console.log(`  ${describe(v)}`)
    }
    console.log('')
    const header = ['area', 'files', 'over', ...RULES]
    console.log(header.join('\t'))
    for (const [area, counts] of Object.entries(summary)) {
      console.log(
        [area, counts.files, counts.filesOver, ...RULES.map((r) => counts[r] || 0)].join('\t')
      )
    }
    console.log(`\nHow lines are counted: ${COUNTING}\n`)
  }

  const seconds = ((Date.now() - started) / 1000).toFixed(1)
  if (violations.length) {
    const byRule = RULES.map((r) => [r, violations.filter((v) => v.rule === r).length]).filter(
      ([, n]) => n
    )
    console.error(
      `✖ ${violations.length} maintainability violation(s) in ${failing.length} of ${files.length} file(s) (${seconds}s): ` +
        byRule.map(([r, n]) => `${r} ${n}`).join(', ')
    )
    console.error(
      'Split by feature (contributing/docs/CODE_QUALITY.md 3.2): logic to composables/, markup to parts/, helpers to lib/.\n' +
        'There is no baseline and no exemption (decision CQ-E). Run with --report for the list, --json for the data.'
    )
    process.exit(1)
  }
  console.log(`✓ ${files.length} file(s) within the limits of CODE_QUALITY.md 3.1 (${seconds}s)`)
}

main().catch((error) => {
  console.error(error)
  process.exit(2)
})
