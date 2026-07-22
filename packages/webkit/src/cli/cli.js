#!/usr/bin/env node
// @aziontech/webkit — bin name `webkit`.
//
//   npx @aziontech/webkit init [--dry-run] [--strict|--recommended] [-y|--yes]
//                              [--no-icons] [--no-entry]
//   npx @aziontech/webkit doctor
//
// `init` wires the design system into an existing project in one command: dependencies,
// lint configs, pre-commit, the webkit MCP, the Claude Code bundle, a CLAUDE.md fragment,
// and the style imports at the app entry (`--dry-run` plans without writing; idempotent
// by design). On a TTY it asks about the optional pieces — icons, entry wiring — unless
// `--yes`. Feature-scoped setup (e.g. the toast service) is deliberately NOT part of
// init: it is wired just-in-time at first use (the component's catalog `setup` recipe,
// surfaced by the MCP and the Claude bundle), and `doctor` flags it when missing.
// `doctor` checks that the wiring is healthy and reports resolved dependency versions.

import { applyPlan } from './apply.js'
import { planDoctor } from './doctor.js'
import { planInit } from './plan.js'

const HELP = `@aziontech/webkit — adopt the design system in one command

Usage:
  npx @aziontech/webkit init [options]
  npx @aziontech/webkit doctor

Commands:
  init            Wire @aziontech/webkit into the current project.
  doctor          Check the wiring is healthy; report resolved dependency versions.

Options (init):
  --dry-run       Print the plan without writing anything.
  --strict        Use the strict ESLint preset (default; every rule is an error).
  --recommended   Use the recommended ESLint preset (also every rule an error).
  -y, --yes       Accept every default; never prompt (CI / scripted runs).
  --no-icons      Skip @aziontech/icons (the icon font) and its entry import.
  --no-entry      Do not edit the app entry (src/main.*); print the imports instead.
  -h, --help      Show this help.

Run interactively (a TTY, no --yes) and init asks about the optional pieces —
icons, entry wiring — before writing anything.
`

const COMMANDS = new Set(['init', 'doctor'])
const KNOWN_FLAGS = new Set([
  '--dry-run',
  '--strict',
  '--recommended',
  '--yes',
  '-y',
  '--no-icons',
  '--no-entry',
  '-h',
  '--help'
])

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
    yes: flags.has('--yes') || flags.has('-y'),
    noIcons: flags.has('--no-icons'),
    noEntry: flags.has('--no-entry'),
    help: flags.has('-h') || flags.has('--help')
  }
}

// Ask about the optional pieces — icons, entry wiring — one Y/n question each.
// Only on a real TTY and without --yes: piped/CI runs never hang on a prompt, they take
// the defaults (all on) minus any --no-* flag. A --no-* flag also suppresses its question.
// Feature-scoped setup (toast, …) is not asked here — it is wired just-in-time at first
// use, from the component's catalog `setup` recipe; `doctor` flags it when missing.
async function resolveInitOptions(parsed) {
  const opts = {
    recommended: parsed.recommended,
    icons: !parsed.noIcons,
    wireEntry: !parsed.noEntry
  }
  const interactive = process.stdin.isTTY && process.stdout.isTTY && !parsed.yes
  if (!interactive) return opts

  const { createInterface } = await import('node:readline/promises')
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const ask = async (question) => {
    const answer = (await rl.question(`${question} [Y/n] `)).trim().toLowerCase()
    return answer === '' || answer === 'y' || answer === 'yes'
  }
  try {
    if (opts.icons) opts.icons = await ask('Install @aziontech/icons (the icon font)?')
    if (opts.wireEntry) {
      opts.wireEntry = await ask(
        'Add the style imports to your app entry (src/main.*) automatically?'
      )
    }
  } finally {
    rl.close()
  }
  return opts
}

const DOCTOR_LABEL = { ok: 'OK   ', warn: 'WARN ', fail: 'FAIL ' }

function runDoctor(projectDir) {
  process.stdout.write(`\n@aziontech/webkit doctor\nproject: ${projectDir}\n\n`)
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
      case 'patch-entry':
        process.stdout.write(`PLAN   patch ${action.path} (${action.imports.join(' · ')})\n`)
        break
      default:
        process.stdout.write(`PLAN   ${action.type} ${action.path || ''}\n`)
    }
  }
}

async function run(argv) {
  const parsed = parseArgs(argv)
  const { command, dryRun, recommended, help, unknown } = parsed

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

  const initOpts = await resolveInitOptions(parsed)
  const plan = planInit(projectDir, initOpts)

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

  const errors = results.filter((r) => r.result === 'error')
  if (errors.length) {
    process.stderr.write(
      `\n${errors.length} action(s) failed — nothing was overwritten. Fix the file(s) above and re-run.\n`
    )
    return 1
  }

  process.stdout.write('\nDone. Run your package manager install to fetch the new dependencies.\n')
  return 0
}

// Set exitCode rather than process.exit() so buffered stdout flushes before exit
// (process.exit can truncate piped output mid-write).
run(process.argv).then(
  (code) => {
    process.exitCode = code
  },
  (err) => {
    process.stderr.write(`${err?.message || err}\n`)
    process.exitCode = 1
  }
)
