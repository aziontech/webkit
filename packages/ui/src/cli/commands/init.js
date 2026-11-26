import { applyPlan } from '../apply.js'
import { planInit } from '../plan.js'
import { err, out } from './output.js'

async function askOptionalPieces(opts) {
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

async function resolveInitOptions(parsed) {
  const opts = {
    recommended: parsed.recommended,
    icons: !parsed.noIcons,
    wireEntry: !parsed.noEntry
  }
  const interactive = process.stdin.isTTY && process.stdout.isTTY && !parsed.yes && !parsed.dryRun
  if (!interactive) return opts
  return askOptionalPieces(opts)
}

const RESULT_LABELS = {
  written: 'WRITE ',
  merged: 'MERGE ',
  appended: 'APPEND',
  skipped: 'SKIP  ',
  advised: 'NOTE  ',
  error: 'ERROR '
}

function printResult({ action, result, detail }) {
  if (result === 'advised') {
    out(`\nNOTE   ${detail}\n`)
    return
  }
  const stream = result === 'error' ? process.stderr : process.stdout
  stream.write(`${RESULT_LABELS[result] || result.toUpperCase()} ${detail || action.type}\n`)
}

function addDepLine(action) {
  const { dev } = action
  const devLabel = dev ? '(dev) ' : ''
  if (action.keep) {
    return `PLAN   keep ${devLabel}${action.dep}@${action.keep} (WebKit needs ${action.version})\n`
  }
  const replaces = action.replace ? ` (replaces ${action.replace})` : ''
  return `PLAN   add-dep ${devLabel}${action.dep}@${action.version}${replaces}\n`
}

const PLAN_LINES = {
  'add-dep': addDepLine,
  advise: (action) => `\nPLAN   note: ${action.message}\n`,
  copy: (action) => `PLAN   copy ${action.to}\n`,
  'copy-stamped': (action) => `PLAN   copy (stamped) ${action.to}\n`,
  'patch-entry': (action) => `PLAN   patch ${action.path} (${action.imports.join(' · ')})\n`,
  'remove-starter': (action) =>
    `PLAN   remove the starter ${action.files.join(', ')} and its import in ${action.path}\n`,
  fence: (action) => `PLAN   fence ${action.path}\n`,
  report: (action) => `PLAN   report ${action.state}: .claude/${action.rel}\n`,
  'activate-hooks': () => 'PLAN   activate git hooks (npx husky)\n'
}

const otherLine = (action) => `PLAN   ${action.type} ${action.path || ''}\n`

function printPlan(plan) {
  for (const action of plan) {
    const line = Object.hasOwn(PLAN_LINES, action.type) ? PLAN_LINES[action.type] : otherLine
    out(line(action))
  }
}

export async function runInit(projectDir, parsed) {
  const { dryRun, recommended } = parsed
  const plan = planInit(projectDir, await resolveInitOptions(parsed))

  out(
    `\n@aziontech/webkit init — ${recommended ? 'recommended' : 'strict'} preset${dryRun ? ' (dry run)' : ''}\n`
  )
  out(`project: ${projectDir}\n\n`)

  if (dryRun) {
    printPlan(plan)
    out('\nDry run — no files were written.\n')
    return 0
  }

  const results = applyPlan(projectDir, plan)
  for (const r of results) printResult(r)

  const errors = results.filter((r) => r.result === 'error')
  if (errors.length) {
    err(
      `\n${errors.length} action(s) failed — nothing was overwritten. Fix the file(s) above and re-run.\n`
    )
    return 1
  }

  out('\nDone. Run your package manager install to fetch the new dependencies.\n')
  return 0
}
