#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  checkBlocks,
  checkSubpaths,
  checkSuites,
  checkSynonyms,
  readBlockIds,
  readSuites,
  retiredNames
} from './lib/naming.mjs'
import {
  NAMING_STAGED_BLOCKS,
  RULE_DOC,
  RULES,
  countByRule,
  scanRepo
} from './lib/naming-rules.mjs'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = resolve(PKG, '../..')

export function exportSubpaths(pkg) {
  return Object.keys(pkg.exports || {})
    .filter((k) => k.startsWith('./'))
    .map((k) => k.slice(2))
}

export function checkNaming({ subpaths, blocks, retired }) {
  return [...checkSubpaths(subpaths), ...checkBlocks(blocks), ...checkSynonyms(subpaths, retired)]
}

export function parseArgs(argv) {
  const ruleAt = argv.indexOf('--rule')
  return {
    strict: argv.includes('--strict') || NAMING_STAGED_BLOCKS,
    json: argv.includes('--json'),
    rule: ruleAt >= 0 ? argv[ruleAt + 1] : null,
    limit: argv.includes('--all') ? Infinity : 5
  }
}

export function formatReport(staged, { rule, limit }) {
  const counts = countByRule(staged)
  const lines = []
  const total = staged.length
  lines.push(
    `Naming standard: ${total} violation${total === 1 ? '' : 's'} of the staged rules (${RULE_DOC}).`
  )
  for (const [id, n] of Object.entries(counts)) {
    if (RULES[id].stage !== 'staged' || (rule && id !== rule)) continue
    lines.push(
      `  ${id.padEnd(18)} ${String(n).padStart(5)}  ${RULES[id].decision.padEnd(16)} ${RULES[id].surface}`
    )
    if (!n) continue
    for (const x of staged.filter((s) => s.rule === id).slice(0, limit))
      lines.push(
        `      ${x.file}:${x.line} ${x.message.replace(` (${RULE_DOC}).`, '').replace(/ \(\.claude\/rules\/[\w-]+\.md\)\.?$/, '')}`
      )
  }
  return lines.join('\n')
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invoked) {
  const args = parseArgs(process.argv.slice(2))
  const pkg = JSON.parse(readFileSync(resolve(PKG, 'package.json'), 'utf8'))
  const migration = JSON.parse(readFileSync(resolve(PKG, 'src/cli/migrations/v6.json'), 'utf8'))
  const subpaths = exportSubpaths(pkg)
  const blocks = readBlockIds(resolve(PKG, 'blocks'))
  const suites = readSuites(PKG)
  const errors = [
    ...checkNaming({ subpaths, blocks, retired: retiredNames(migration) }),
    ...checkSuites(suites)
  ]
  const staged = scanRepo(ROOT).filter((x) => RULES[x.rule]?.stage === 'staged')
  if (args.json) {
    process.stdout.write(
      `${JSON.stringify({ enforced: errors, staged, counts: countByRule(staged) }, null, 2)}\n`
    )
  } else {
    console.log(formatReport(staged, args))
    console.log(
      args.strict
        ? 'Staged rules block (--strict or NAMING_STAGED_BLOCKS).'
        : 'Staged rules are reported, not blocking, until the rename lanes merge (--strict to block, --rule <id> --all to list one rule, --json for everything).'
    )
  }
  if (errors.length) {
    console.error(`Naming check failed (${errors.length}):`)
    for (const e of errors) console.error(`  - ${e}`)
    console.error(
      'Rules: kebab-case English ids, block ids match their folder, no synonym of an existing export, no retired v6 name, one top-level describe per test named after its component (scripts/lib/naming.mjs).'
    )
    process.exit(1)
  }
  if (args.strict && staged.length) process.exit(1)
  if (!args.json)
    console.log(
      `Naming OK: ${subpaths.length} exports, ${blocks.length} blocks, ${suites.length} suites, no synonyms or retired names.`
    )
}
