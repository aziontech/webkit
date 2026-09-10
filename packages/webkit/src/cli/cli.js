#!/usr/bin/env node
// @aziontech/webkit — bin name `webkit`. `init` wires the design system into an
// existing project (idempotent; `--dry-run` plans only); `doctor` checks the wiring.
// Feature-scoped setup (e.g. toast) is deliberately NOT part of init: it is wired
// just-in-time from the component's catalog `setup` recipe; `doctor` flags it when missing.

import { applyPlan } from './apply.js'
import { runCanary } from './canary.js'
import { planDoctor } from './doctor.js'
import { planInit } from './plan.js'
import { FAIL_MODES, runReport } from './report.js'

const HELP = `@aziontech/webkit — adopt the design system in one command

Usage:
  npx @aziontech/webkit init [options]
  npx @aziontech/webkit doctor
  npx @aziontech/webkit report [options]
  npx @aziontech/webkit canary

Commands:
  init            Wire @aziontech/webkit into the current project.
  doctor          Check the wiring is healthy; report resolved dependency versions.
  report          Measure design-system adoption; Markdown on stdout for a CI summary.
  canary          Prove the design-system rules still reach this project.

Options (init):
  --dry-run       Print the plan without writing anything.
  --strict        Use the strict ESLint preset (default; every rule is an error).
  --recommended   Use the recommended ESLint preset (also every rule an error).
  -y, --yes       Accept every default; never prompt (CI / scripted runs).
  --no-icons      Skip @aziontech/icons (the icon font) and its entry import.
  --no-entry      Do not edit the app entry (src/main.*); print the imports instead.
  -h, --help      Show this help.

Options (report):
  --format <fmt>  markdown (default) or json.
  --baseline <f>  Baseline file (default .webkit-baseline.json).
  --update        Rewrite the baseline from this run, then exit.
  --fail-on <m>   never (default) · new (only violations absent from the baseline) · any.

Run interactively (a TTY, no --yes) and init asks about the optional pieces —
icons, entry wiring — before writing anything.
`

const COMMANDS = new Set(['init', 'doctor', 'report', 'canary'])
// Flags that take a value; parseArgs must not mistake the value for a command.
const VALUE_FLAGS = new Set(['--format', '--baseline', '--fail-on'])

const KNOWN_FLAGS = new Set([
  '--format',
  '--baseline',
  '--update',
  '--fail-on',
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
  const flagList = []
  const positional = []
  const values = new Map()

  // Walk in order: a VALUE_FLAG consumes the next token, so `report --format json`
  // does not read "json" as the command.
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (!arg.startsWith('-')) {
      positional.push(arg)
      continue
    }
    flagList.push(arg)
    if (VALUE_FLAGS.has(arg)) {
      const next = args[i + 1]
      if (next !== undefined && !next.startsWith('-')) {
        values.set(arg, next)
        i += 1
      } else {
        values.set(arg, null) // present but with no value — the command reports it
      }
    }
  }

  const unknown = flagList.filter((f) => !KNOWN_FLAGS.has(f))
  const flags = new Set(flagList)
  return {
    command: positional[0] ?? null,
    unknown,
    values,
    dryRun: flags.has('--dry-run'),
    recommended: flags.has('--recommended') && !flags.has('--strict'),
    yes: flags.has('--yes') || flags.has('-y'),
    noIcons: flags.has('--no-icons'),
    noEntry: flags.has('--no-entry'),
    update: flags.has('--update'),
    help: flags.has('-h') || flags.has('--help')
  }
}

// Prompts only on a real TTY without --yes, so piped/CI runs never hang; a --no-*
// flag also suppresses its question.
async function resolveInitOptions(parsed) {
  const opts = {
    recommended: parsed.recommended,
    icons: !parsed.noIcons,
    wireEntry: !parsed.noEntry
  }
  // --dry-run implies --yes: a plan-only run prints the plan, it never prompts.
  const interactive = process.stdin.isTTY && process.stdout.isTTY && !parsed.yes && !parsed.dryRun
  if (!interactive) return opts

  const { createInterface } = await import('node:readline/promises')
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  // Without a SIGINT listener, readline pauses the input stream on Ctrl+C and the
  // pending question never resolves (per Node docs) — exit like an interrupted CLI.
  rl.on('SIGINT', () => {
    rl.close()
    process.exit(130)
  })
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

async function runReportCommand(projectDir, parsed) {
  const format = parsed.values.get('--format') ?? 'markdown'
  if (format !== 'markdown' && format !== 'json') {
    process.stderr.write(`--format must be markdown or json (got "${format}").\n`)
    return 1
  }
  const failOn = parsed.values.get('--fail-on') ?? 'never'
  if (!FAIL_MODES.has(failOn)) {
    process.stderr.write(`--fail-on must be never, new or any (got "${failOn}").\n`)
    return 1
  }
  const baseline = parsed.values.get('--baseline') ?? undefined
  if (baseline === null) {
    process.stderr.write('--baseline needs a file path.\n')
    return 1
  }

  const result = await runReport(projectDir, {
    format,
    failOn,
    baseline,
    update: parsed.update,
    log: (line) => process.stderr.write(`${line}\n`)
  })

  if (result.error) {
    process.stderr.write(`${result.error}\n`)
    return result.exitCode
  }
  if (result.stdout) process.stdout.write(result.stdout)
  return result.exitCode
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

  // A silently ignored `--dryrun` would perform a real write run.
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

  if (command === 'report') {
    return runReportCommand(projectDir, parsed)
  }

  if (command === 'canary') {
    const { exitCode, lines } = runCanary(projectDir)
    process.stdout.write(`${lines.join('\n')}\n`)
    return exitCode
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
