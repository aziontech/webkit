#!/usr/bin/env node

import { applyPlan } from './apply.js'
import { applyAdd, MANIFEST, planAdd, planDiff } from './blocks.js'
import { runCanary } from './canary.js'
import { exitCodeFor, formatCheck, runCheck } from './check.js'
import { planDoctor } from './doctor.js'
import { planMigrate, SUPPORTED_VERSIONS } from './migrate.js'
import { planInit } from './plan.js'
import { formatSearch, formatView, runSearch, runView } from './query.js'
import { FAIL_MODES, FORMATS, runReport } from './report.js'
import { catalogFor, resolveWebkit } from './source.js'
import { planSync } from './sync.js'
import { colorize, diffStats } from './text-diff.js'

const HELP = `@aziontech/webkit — adopt the design system in one command

Usage:
  npx @aziontech/webkit init [options]
  npx @aziontech/webkit add <block-id> [--variant <name>] [--dest <dir|file.vue>] [options]
  npx @aziontech/webkit diff <block-id|path> [--json]
  npx @aziontech/webkit search <query> [--json]
  npx @aziontech/webkit view <id> [--variant <name>] [--example <name>] [--json]
  npx @aziontech/webkit check [--json] [--max-warnings <n>] [--no-lint]
  npx @aziontech/webkit doctor
  npx @aziontech/webkit report [options] [patterns...]
  npx @aziontech/webkit canary
  npx @aziontech/webkit sync [options]
  npx @aziontech/webkit migrate v6 [--dry-run] [--from <major>]

Commands:
  init            Wire @aziontech/webkit into the current project.
  add             Start a screen: copy a block (the reviewed SFC) into the project, check
                   its imports against the installed webkit, record it in webkit.blocks.json
                   and print the route entry to add.
  diff            Compare a copied block with the canonical one of the installed version.
  search          Find blocks, components and examples by plain words.
  view            Show a block (guidelines, variants, SFC) or a component (API, examples).
  check           CI gate: doctor + v5 names + unknown imports + ESLint + Stylelint
                   + block drift.
  doctor          Check the wiring is healthy; report resolved dependency versions.
  report          Measure webkit adoption via this project's own ESLint.
  canary          Prove the design-system lint rules still reach this project.
  sync            Reconcile the copied .claude/ bundle + CLAUDE.md fragment against
                   this webkit version's templates.
  migrate v6      Rewrite this project for the v6 major: renamed imports and components,
                   renamed props and values; lists removed components to replace by hand.
                   --from <major> sets the version the project is on (read from
                   package.json, or detected from v3-only imports, when omitted).

Options (init):
  --dry-run       Print the plan without writing anything.
  --strict        Use the strict ESLint preset (default; every rule is an error).
  --recommended   Use the recommended ESLint preset (also every rule an error).
  -y, --yes       Accept every default; never prompt (CI / scripted runs).
  --no-icons      Skip @aziontech/icons (the icon font) and its entry import.
  --no-entry      Do not edit the app entry (src/main.*); print the imports instead.
  -h, --help      Show this help.

Options (add):
  --variant <name>  Also copy this variant (state) of the block, as <Name><Variant>.vue.
  --dest <path>     Directory (or .vue file) for the copy; default: the router's views
                    directory, else src/views, else src/pages.
  --with-guidelines Copy the block guidelines next to it as <Name>.guidelines.md.
  --dry-run         Print what would be written; write nothing.
  --force           Overwrite files that already exist.

Options (diff, search, view, check):
  --json            Machine-readable output.
  --example <name>  view: print this example of a component instead of the first.
  --max-warnings <n> check: also fail when there are more than n warnings.
  --no-lint         check: skip the project's ESLint and Stylelint runs (built-in
                    scans only).
  diff exits 0 when the copy matches the canonical block, 1 when it differs.

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

const COMMANDS = new Set([
  'init',
  'add',
  'diff',
  'search',
  'view',
  'check',
  'doctor',
  'report',
  'canary',
  'sync',
  'migrate'
])
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
  '--with-guidelines',
  '--no-lint',
  '-h',
  '--help'
])
const VALUE_FLAGS = new Set([
  '--format',
  '--fail-on',
  '--from',
  '--dest',
  '--variant',
  '--example',
  '--max-warnings'
])

function parseArgs(argv) {
  const args = argv.slice(2)
  const command = args.find((a) => !a.startsWith('-')) || null

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
    from: values['--from'],
    patterns: positionals,
    check: flags.has('--check'),
    force: flags.has('--force'),
    json: flags.has('--json'),
    withGuidelines: flags.has('--with-guidelines'),
    noLint: flags.has('--no-lint'),
    dest: values['--dest'],
    variant: values['--variant'],
    example: values['--example'],
    maxWarnings: values['--max-warnings']
  }
}

async function resolveInitOptions(parsed) {
  const opts = {
    recommended: parsed.recommended,
    icons: !parsed.noIcons,
    wireEntry: !parsed.noEntry
  }
  const interactive = process.stdin.isTTY && process.stdout.isTTY && !parsed.yes && !parsed.dryRun
  if (!interactive) return opts

  const { createInterface } = await import('node:readline/promises')
  const rl = createInterface({ input: process.stdin, output: process.stdout })
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
      case 'activate-hooks':
        process.stdout.write('PLAN   activate git hooks (npx husky)\n')
        break
      default:
        process.stdout.write(`PLAN   ${action.type} ${action.path || ''}\n`)
    }
  }
}

function runMigrate(projectDir, target, { dryRun, from }) {
  const version = Number(String(target || '').replace(/^v/i, ''))
  if (!SUPPORTED_VERSIONS.includes(version)) {
    process.stderr.write(
      `Usage: npx @aziontech/webkit migrate v6 [--dry-run] (supported: ${SUPPORTED_VERSIONS.map((v) => `v${v}`).join(', ')})\n`
    )
    return 1
  }
  const fromMajor = from == null ? null : Number(String(from).replace(/^v/i, ''))
  if (fromMajor != null && !Number.isInteger(fromMajor)) {
    process.stderr.write(`--from takes a major version, such as 3 or v5 (got ${from})\n`)
    return 1
  }
  const results = planMigrate(projectDir, { version, dryRun, fromMajor })
  let changed = 0
  let manual = 0
  for (const { file, changes, warnings } of results) {
    if (changes.length) changed += 1
    if (warnings.length) manual += 1
    process.stdout.write(`${file}\n`)
    for (const c of changes)
      process.stdout.write(`  ${dryRun ? 'would change' : 'changed'}: ${c}\n`)
    for (const w of warnings) process.stdout.write(`  MANUAL: ${w}\n`)
  }
  process.stdout.write(
    `\n${changed} file(s) ${dryRun ? 'to rewrite' : 'rewritten'}, ${manual} file(s) need a manual change. See MIGRATION-v6.md.\n`
  )
  return 0
}

const json = (value) => process.stdout.write(`${JSON.stringify(value, null, 2)}\n`)
const useColor = () =>
  !process.env.NO_COLOR && (Boolean(process.env.FORCE_COLOR) || Boolean(process.stdout.isTTY))

function runAdd(projectDir, id, parsed) {
  if (!id) {
    process.stderr.write('Usage: npx @aziontech/webkit add <block-id> (find one with `search`)\n')
    return 1
  }
  const webkit = resolveWebkit(projectDir)
  const plan = planAdd(projectDir, webkit, catalogFor(webkit), id, {
    dest: parsed.dest,
    variant: parsed.variant,
    withGuidelines: parsed.withGuidelines,
    force: parsed.force
  })
  const written = plan.ok && !parsed.dryRun ? applyAdd(projectDir, plan) : []
  if (parsed.json) {
    json({
      ok: plan.ok,
      dryRun: parsed.dryRun,
      ...(plan.id ? { id: plan.id, version: plan.version } : {}),
      files: (plan.files || []).map(({ content: _content, ...f }) => f),
      ...(plan.guidelines ? { guidelines: plan.guidelines.path } : {}),
      imports: plan.imports,
      route: plan.route,
      written,
      errors: plan.errors,
      warnings: plan.warnings || [],
      ...(plan.suggestions?.length ? { suggestions: plan.suggestions } : {})
    })
    return plan.ok ? 0 : 1
  }
  for (const w of plan.warnings || []) process.stderr.write(`WARN  ${w}\n`)
  if (!plan.ok) {
    for (const e of plan.errors) process.stderr.write(`ERROR ${e}\n`)
    if (plan.suggestions?.length) {
      process.stderr.write(`Did you mean: ${plan.suggestions.join(', ')}?\n`)
    }
    return 1
  }
  const verb = parsed.dryRun ? 'would write' : 'wrote'
  process.stdout.write(`\n${plan.id} (${plan.name}) from @aziontech/webkit@${plan.version}\n`)
  if (plan.viewsReason) process.stdout.write(`views directory: ${plan.viewsReason}\n`)
  process.stdout.write('\n')
  for (const f of plan.files) {
    process.stdout.write(`${verb} ${f.path}${f.exists ? ' (overwritten)' : ''}  ← ${f.variant}\n`)
  }
  if (plan.guidelines) process.stdout.write(`${verb} ${plan.guidelines.path}  ← guidelines\n`)
  process.stdout.write(`${parsed.dryRun ? 'would record' : 'recorded'} ${plan.id} in ${MANIFEST}\n`)
  const ok = plan.imports.webkit.length
  process.stdout.write(`imports: ${ok} @aziontech/webkit subpath(s), all exported\n`)
  process.stdout.write(
    `\nAdd the route${plan.route.router ? ` in ${plan.route.router}` : ''}:\n  ${plan.route.entry}\n`
  )
  process.stdout.write(
    `\nChange only the content (copy, data, handlers); keep the components, their order and the classes. Read the guidelines: npx @aziontech/webkit view ${plan.id}\n`
  )
  if (parsed.dryRun) process.stdout.write('\nDry run — no files were written.\n')
  return 0
}

function runDiff(projectDir, target, parsed) {
  if (!target) {
    process.stderr.write('Usage: npx @aziontech/webkit diff <block-id|path>\n')
    return 2
  }
  const result = planDiff(projectDir, resolveWebkit(projectDir), target)
  if (!result.ok) {
    if (parsed.json) json(result)
    else process.stderr.write(`${result.error}\n`)
    return 2
  }
  const differs = result.files.some((f) => f.status !== 'identical')
  if (parsed.json) {
    json({ ...result, differs })
    return differs ? 1 : 0
  }
  const color = useColor()
  for (const f of result.files) {
    const upstream = f.upstreamChanged
      ? ` — the canonical block changed since it was copied (${result.recordedVersion} → ${result.version})`
      : ''
    if (f.status === 'identical') {
      process.stdout.write(`${f.path}: identical to ${f.source}${upstream}\n`)
    } else if (f.status === 'missing') {
      process.stdout.write(`${f.path}: missing (recorded in ${MANIFEST})\n`)
    } else if (f.status === 'removed-upstream') {
      process.stdout.write(`${f.path}: ${f.source} is not in @aziontech/webkit@${result.version}\n`)
    } else {
      const { added, removed } = diffStats(f.patch)
      process.stdout.write(`${f.path}: +${added} -${removed} against ${f.source}${upstream}\n`)
      process.stdout.write(color ? `${colorize(f.patch)}\n` : f.patch)
    }
  }
  return differs ? 1 : 0
}

function runQuery(projectDir, command, parsed) {
  const query = parsed.patterns.join(' ').trim()
  if (!query) {
    process.stderr.write(
      `Usage: npx @aziontech/webkit ${command} <${command === 'view' ? 'id' : 'query'}>\n`
    )
    return 1
  }
  const catalog = catalogFor(resolveWebkit(projectDir))
  if (command === 'search') {
    const result = runSearch(catalog, query)
    if (parsed.json) json(result)
    else process.stdout.write(formatSearch(result))
    return 0
  }
  const result = runView(catalog, query, { variant: parsed.variant, example: parsed.example })
  if (parsed.json) {
    json(result)
    return result.ok ? 0 : 1
  }
  if (!result.ok) {
    process.stderr.write(`${result.error}\n`)
    if (result.suggestions?.length) {
      process.stderr.write(`Did you mean: ${result.suggestions.join(', ')}?\n`)
    }
    return 1
  }
  process.stdout.write(formatView(result))
  return 0
}

function runCheckCommand(projectDir, parsed) {
  let maxWarnings = null
  if (parsed.maxWarnings != null) {
    maxWarnings = Number(parsed.maxWarnings)
    if (!Number.isInteger(maxWarnings)) {
      process.stderr.write(`--max-warnings takes an integer (got ${parsed.maxWarnings})\n`)
      return 2
    }
  }
  const result = runCheck(projectDir, resolveWebkit(projectDir), { lint: !parsed.noLint })
  const code = exitCodeFor(result, maxWarnings)
  if (parsed.json) json({ ...result, maxWarnings, exitCode: code })
  else process.stdout.write(formatCheck(result, maxWarnings))
  return code
}

async function run(argv) {
  const parsed = parseArgs(argv)
  const { command, dryRun, recommended, help, unknown } = parsed

  if (help || !command) {
    process.stdout.write(HELP)
    return command ? 0 : help ? 0 : 1
  }

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

  if (command === 'add') return runAdd(projectDir, parsed.patterns[0], parsed)
  if (command === 'diff') return runDiff(projectDir, parsed.patterns[0], parsed)
  if (command === 'search' || command === 'view') return runQuery(projectDir, command, parsed)
  if (command === 'check') return runCheckCommand(projectDir, parsed)

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

  if (command === 'migrate') {
    return runMigrate(projectDir, parsed.patterns[0], { dryRun, from: parsed.from })
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

run(process.argv).then(
  (code) => {
    process.exitCode = code
  },
  (err) => {
    process.stderr.write(`${err?.message || err}\n`)
    process.exitCode = 1
  }
)
