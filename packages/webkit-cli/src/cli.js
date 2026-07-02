#!/usr/bin/env node
// @aziontech/webkit CLI — bin name `webkit`.
//
//   npx @aziontech/webkit init [--dry-run] [--strict|--recommended]
//
// Wires the design system into an existing project in one command: dependencies,
// lint configs, pre-commit, the webkit MCP, the Claude Code bundle, and a
// CLAUDE.md fragment. `--dry-run` plans without writing. Idempotent by design.

import { planInit } from './plan.js'
import { applyPlan } from './apply.js'

const HELP = `@aziontech/webkit — adopt the design system in one command

Usage:
  npx @aziontech/webkit init [options]

Commands:
  init            Wire @aziontech/webkit into the current project.

Options:
  --dry-run       Print the plan without writing anything.
  --strict        Use the strict ESLint preset (default).
  --recommended   Use the recommended ESLint preset (correctness=error, perf=warn).
  -h, --help      Show this help.
`

function parseArgs(argv) {
  const args = argv.slice(2)
  const command = args.find((a) => !a.startsWith('-')) || null
  const flags = new Set(args.filter((a) => a.startsWith('-')))
  return {
    command,
    dryRun: flags.has('--dry-run'),
    recommended: flags.has('--recommended') && !flags.has('--strict'),
    help: flags.has('-h') || flags.has('--help')
  }
}

function labelFor(result) {
  return (
    {
      written: 'WRITE ',
      merged: 'MERGE ',
      appended: 'APPEND',
      skipped: 'SKIP  ',
      advised: 'NOTE  '
    }[result] || result.toUpperCase()
  )
}

function printResult({ action, result, detail }) {
  if (result === 'advised') {
    // Multi-line reminders / snippets get their own block.
    process.stdout.write(`\nNOTE   ${detail}\n`)
    return
  }
  process.stdout.write(`${labelFor(result)} ${detail || action.type}\n`)
}

function printPlan(plan) {
  for (const action of plan) {
    switch (action.type) {
      case 'add-dep':
        process.stdout.write(
          `PLAN   add-dep ${action.dev ? '(dev) ' : ''}${action.dep}@${action.version}\n`
        )
        break
      case 'advise':
        process.stdout.write(`\nPLAN   note: ${action.message}\n`)
        break
      case 'copy':
        process.stdout.write(`PLAN   copy ${action.to}\n`)
        break
      default:
        process.stdout.write(`PLAN   ${action.type} ${action.path || ''}\n`)
    }
  }
}

function run(argv) {
  const { command, dryRun, recommended, help } = parseArgs(argv)

  if (help || !command) {
    process.stdout.write(HELP)
    return command ? 0 : help ? 0 : 1
  }

  if (command !== 'init') {
    process.stderr.write(`Unknown command: ${command}\n\n${HELP}`)
    return 1
  }

  const projectDir = process.cwd()
  const plan = planInit(projectDir, { recommended })

  process.stdout.write(
    `\n@aziontech/webkit init — ${recommended ? 'recommended' : 'strict'} preset${dryRun ? ' (dry run)' : ''}\n`
  )
  process.stdout.write(`project: ${projectDir}\n\n`)

  if (dryRun) {
    printPlan(plan)
    process.stdout.write('\nDry run — no files were written.\n')
    return 0
  }

  const results = applyPlan(projectDir, plan)
  for (const r of results) printResult(r)

  process.stdout.write('\nDone. Run your package manager install to fetch the new dependencies.\n')
  return 0
}

process.exit(run(process.argv))
