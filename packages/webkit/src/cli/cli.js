#!/usr/bin/env node
// @aziontech/webkit — bin name `webkit`. `init` wires the design system into an
// existing project (idempotent; `--dry-run` plans only); `doctor` checks the wiring.
// Feature-scoped setup (e.g. toast) is deliberately NOT part of init: it is wired
// just-in-time from the component's catalog `setup` recipe; `doctor` flags it when missing.

import { applyPlan } from './apply.js'
import { runCanary } from './canary.js'
import { planDoctor } from './doctor.js'
import { planInit } from './plan.js'
import { FAIL_MODES, FORMATS, runReport } from './report.js'
import { planSync } from './sync.js'

const HELP = `@aziontech/webkit — adopt the design system in one command

Usage:
  npx @aziontech/webkit init [options]
  npx @aziontech/webkit doctor
  npx @aziontech/webkit report [options] [patterns...]
  npx @aziontech/webkit canary
  npx @aziontech/webkit sync [options]

Commands:
  init            Wire @aziontech/webkit into the current project.
  doctor          Check the wiring is healthy; report resolved dependency versions.
  report          Measure webkit adoption via this project's own ESLint.
  canary          Prove the design-system lint rules still reach this project.
  sync            Reconcile the copied .claude/ bundle + CLAUDE.md fragment against
                   this webkit version's templates.

Options (init):
  --dry-run       Print the plan without writing anything.
  --strict        Use the strict ESLint preset (default; every rule is an error).
  --recommended   Use the recommended ESLint preset (also every rule an error).
  -y, --yes       Accept every default; never prompt (CI / scripted runs).
  --no-icons      Skip @aziontech/icons (the icon font) and its entry import.
  --no-entry      Do not edit the app entry (src/main.*); print the imports instead.
  -h, --help      Show this help.

Options (report):
  --format <markdown|json>   Output format (default: markdown).
  --fail-on <never|any>      Exit 1 when violations exist (default: never).
  [patterns...]              ESLint file patterns to lint (default: .).

Options (sync):
  --check         Apply nothing; print the state table; exit 1 if anything has drifted.
  --dry-run       Apply nothing; print what would happen; always exits 0.
  --force         Also overwrite files edited locally after they were stamped.
  --json          Print the report as JSON instead of the state table.

Run interactively (a TTY, no --yes) and init asks about the optional pieces —
icons, entry wiring — before writing anything.
`

const COMMANDS = new Set(['init', 'doctor', 'report', 'canary', 'sync'])
const KNOWN_FLAGS = new Set([
  '--dry-run',
  '--strict',
  '--recommended',
  '--yes',
  '-y',
  '--no-icons',
  '--no-entry',
  '--check',
  '--force',
  '--json',
  '-h',
  '--help'
])
// Flags that take a value as the next argv token (report only, so far).
const VALUE_FLAGS = new Set(['--format', '--fail-on'])

function parseArgs(argv) {
  const args = argv.slice(2)
  const command = args.find((a) => !a.startsWith('-')) || null

  // Pull out `--flag value` pairs first so their value never gets mistaken for another
  // flag or for a positional pattern.
  const values = {}
  const rest = []
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (VALUE_FLAGS.has(a)) {
      values[a] = args[i + 1]
      i += 1
      continue
    }
    rest.push(a)
  }

  const flagList = rest.filter((a) => a.startsWith('-'))
  const unknown = flagList.filter((f) => !KNOWN_FLAGS.has(f))
  const flags = new Set(flagList)
  // Positional args after the command (and after the value-flag pairs already removed).
  const positionals = rest.filter((a) => a !== command && !a.startsWith('-'))

  return {
    command,
    unknown,
    dryRun: flags.has('--dry-run'),
    recommended: flags.has('--recommended') && !flags.has('--strict'),
    yes: flags.has('--yes') || flags.has('-y'),
    noIcons: flags.has('--no-icons'),
    noEntry: flags.has('--no-entry'),
    help: flags.has('-h') || flags.has('--help'),
    format: values['--format'],
    failOn: values['--fail-on'],
    patterns: positionals,
    check: flags.has('--check'),
    force: flags.has('--force'),
    json: flags.has('--json')
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

// Labels for `sync`'s state table — one line per acted-on entry, plus a summary. `force`
// only changes the label for modified/unstamped-different entries (the only states whose
// action depends on it); every other state's action is unconditional.
function syncLabel(state, forced) {
  switch (state) {
    case 'missing':
      return 'COPY  '
    case 'stale':
      return 'UPDATE'
    case 'unstamped-identical':
      return 'STAMP '
    case 'modified':
    case 'unstamped-different':
      return forced ? 'STAMP ' : 'SKIP  '
    case 'orphan':
      return 'ORPHAN'
    default:
      return state.toUpperCase()
  }
}

function printSyncTable(plan) {
  let acted = 0
  for (const entry of plan.entries) {
    if (!entry.action) continue
    acted += 1
    const forced = entry.action.forced === true
    process.stdout.write(
      `${syncLabel(entry.state, forced)} .claude/${entry.rel} (${entry.state})\n`
    )
  }
  if (plan.fragment.action) {
    acted += 1
    process.stdout.write(`FENCE  CLAUDE.md (fragment ${plan.fragment.state})\n`)
  }
  const current = plan.entries.length - plan.entries.filter((e) => e.action).length
  process.stdout.write(
    `\n${acted} action(s), ${current} current, fragment ${plan.fragment.state}, drift: ${plan.drift ? 'yes' : 'no'}\n`
  )
}

function runSync(projectDir, { check, dryRun, force, json }) {
  const applyNothing = check || dryRun
  try {
    const plan = planSync(projectDir, { force })

    if (json) {
      process.stdout.write(
        `${JSON.stringify(
          {
            drift: plan.drift,
            fragment: plan.fragment.state,
            entries: plan.entries.map((e) => ({
              rel: e.rel,
              state: e.state,
              action: e.action ? e.action.type : null
            }))
          },
          null,
          2
        )}\n`
      )
    } else {
      process.stdout.write(
        `\n@aziontech/webkit sync${applyNothing ? ' (no changes applied)' : ''}\nproject: ${projectDir}\n\n`
      )
      printSyncTable(plan)
    }

    if (!applyNothing) {
      applyPlan(projectDir, plan.actions)
    }

    return check && plan.drift ? 1 : 0
  } catch (err) {
    process.stderr.write(`${err?.message || err}\n`)
    return 2
  }
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
      case 'copy-stamped':
        process.stdout.write(`PLAN   copy (stamped) ${action.to}\n`)
        break
      case 'patch-entry':
        process.stdout.write(`PLAN   patch ${action.path} (${action.imports.join(' · ')})\n`)
        break
      case 'fence':
        process.stdout.write(`PLAN   fence ${action.path}\n`)
        break
      case 'report':
        process.stdout.write(`PLAN   report ${action.state}: .claude/${action.rel}\n`)
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
    const format = parsed.format ?? 'markdown'
    const failOn = parsed.failOn ?? 'never'
    if (!FORMATS.has(format)) {
      process.stderr.write(`Unknown --format value: ${format} (expected markdown or json)\n`)
      return 1
    }
    if (!FAIL_MODES.has(failOn)) {
      process.stderr.write(`Unknown --fail-on value: ${failOn} (expected never or any)\n`)
      return 1
    }
    const patterns = parsed.patterns.length ? parsed.patterns : ['.']
    const result = runReport(projectDir, {
      format,
      failOn,
      patterns,
      log: (line) => process.stderr.write(`${line}\n`)
    })
    if (result.error) {
      process.stderr.write(`${result.error}\n`)
      return result.exitCode
    }
    process.stdout.write(result.stdout)
    return result.exitCode
  }

  if (command === 'canary') {
    const result = runCanary(projectDir)
    for (const line of result.lines) process.stdout.write(`${line}\n`)
    return result.exitCode
  }

  if (command === 'sync') {
    return runSync(projectDir, {
      check: parsed.check,
      dryRun: dryRun,
      force: parsed.force,
      json: parsed.json
    })
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
