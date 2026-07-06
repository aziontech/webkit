#!/usr/bin/env node
// @aziontech/webkit-cli — bin name `webkit`.
//
//   npx @aziontech/webkit-cli init [--dry-run] [--strict|--recommended]
//   npx @aziontech/webkit-cli doctor
//
// `init` wires the design system into an existing project in one command: dependencies,
// lint configs, pre-commit, the webkit MCP, the Claude Code bundle, and a CLAUDE.md
// fragment (`--dry-run` plans without writing; idempotent by design). `doctor` checks
// that the wiring is healthy and reports resolved dependency versions.

import { planInit } from './plan.js'
import { applyPlan } from './apply.js'
import { planDoctor } from './doctor.js'

const HELP = `@aziontech/webkit-cli — adopt the design system in one command

Usage:
  npx @aziontech/webkit-cli init [options]
  npx @aziontech/webkit-cli doctor

Commands:
  init            Wire @aziontech/webkit into the current project.
  doctor          Check the wiring is healthy; report resolved dependency versions.

Options (init):
  --dry-run       Print the plan without writing anything.
  --strict        Use the strict ESLint preset (default).
  --recommended   Use the recommended ESLint preset (correctness=error, perf=warn).
  -h, --help      Show this help.
`

const COMMANDS = new Set(['init', 'doctor'])
const KNOWN_FLAGS = new Set(['--dry-run', '--strict', '--recommended', '-h', '--help'])

function parseArgs(argv) {
  const args = argv.slice(2)
  const command = args.find((a) => !a.startsWith('-')) || null
  const flagList = args.filter((a) => a.startsWith('-'))
  const unknown = flagList.filter((f) => !KNOWN_FLAGS.has(f))
  const flags = new Set(flagList)
  return {
    command,
    unknown,
    dryRun: flags.has('--dry-run'),
    recommended: flags.has('--recommended') && !flags.has('--strict'),
    help: flags.has('-h') || flags.has('--help')
  }
}

const DOCTOR_LABEL = { ok: 'OK   ', warn: 'WARN ', fail: 'FAIL ' }

function runDoctor(projectDir) {
  process.stdout.write(`\n@aziontech/webkit-cli doctor\nproject: ${projectDir}\n\n`)
  const report = planDoctor(projectDir)
  for (const { check, status, detail } of report) {
    const [head, ...rest] = detail.split('\n')
    process.stdout.write(`${DOCTOR_LABEL[status] || status} ${check} — ${head}\n`)
    for (const line of rest) process.stdout.write(`       ${line}\n`)
  }
  const fails = report.filter((c) => c.status === 'fail').length
  const warns = report.filter((c) => c.status === 'warn').length
  process.stdout.write(`\n${fails} fail, ${warns} warn, ${report.length - fails - warns} ok\n`)
  return fails ? 1 : 0
}

function labelFor(result) {
  return (
    {
      written: 'WRITE ',
      merged: 'MERGE ',
      appended: 'APPEND',
      skipped: 'SKIP  ',
      advised: 'NOTE  ',
      error: 'ERROR '
    }[result] || result.toUpperCase()
  )
}

function printResult({ action, result, detail }) {
  if (result === 'advised') {
    // Multi-line reminders / snippets get their own block.
    process.stdout.write(`\nNOTE   ${detail}\n`)
    return
  }
  const stream = result === 'error' ? process.stderr : process.stdout
  stream.write(`${labelFor(result)} ${detail || action.type}\n`)
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
  const { command, dryRun, recommended, help, unknown } = parseArgs(argv)

  if (help || !command) {
    process.stdout.write(HELP)
    return command ? 0 : help ? 0 : 1
  }

  // Reject typo'd flags loudly — silently ignoring `--dryrun` would perform a real
  // write run when the user meant `--dry-run`.
  if (unknown.length) {
    process.stderr.write(`Unknown option(s): ${unknown.join(', ')}\n\n${HELP}`)
    return 1
  }

  if (!COMMANDS.has(command)) {
    process.stderr.write(`Unknown command: ${command}\n\n${HELP}`)
    return 1
  }

  const projectDir = process.cwd()

  if (command === 'doctor') {
    return runDoctor(projectDir)
  }

  const plan = planInit(projectDir, { recommended })

  process.stdout.write(
    `\n@aziontech/webkit-cli init — ${recommended ? 'recommended' : 'strict'} preset${dryRun ? ' (dry run)' : ''}\n`
  )
  process.stdout.write(`project: ${projectDir}\n\n`)

  if (dryRun) {
    printPlan(plan)
    process.stdout.write('\nDry run — no files were written.\n')
    return 0
  }

  const results = applyPlan(projectDir, plan)
  for (const r of results) printResult(r)

  const errors = results.filter((r) => r.result === 'error')
  if (errors.length) {
    process.stderr.write(`\n${errors.length} action(s) failed — nothing was overwritten. Fix the file(s) above and re-run.\n`)
    return 1
  }

  process.stdout.write('\nDone. Run your package manager install to fetch the new dependencies.\n')
  return 0
}

// Set exitCode rather than process.exit() so buffered stdout flushes before exit
// (process.exit can truncate piped output mid-write).
process.exitCode = run(process.argv)
