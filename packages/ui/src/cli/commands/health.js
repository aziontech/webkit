import { runCanary } from '../canary.js'
import { exitCodeFor, formatCheck, runCheck, withNavigation } from '../check.js'
import { planSources, SOURCES_FILE, writeSources } from '../css-sources.js'
import { planDoctor } from '../doctor.js'
import { FAIL_MODES, FORMATS, runReport } from '../report.js'
import { resolveWebkit } from '../source.js'
import { err, json, out } from './output.js'

const DOCTOR_LABEL = { ok: 'OK   ', warn: 'WARN ', fail: 'FAIL ' }

export function runDoctor(projectDir) {
  out(`\n@aziontech/webkit doctor\nproject: ${projectDir}\n\n`)
  const report = planDoctor(projectDir)
  for (const { check, status, detail } of report) {
    const [head, ...rest] = detail.split('\n')
    out(`${DOCTOR_LABEL[status] || status} ${check} — ${head}\n`)
    for (const line of rest) out(`       ${line}\n`)
  }
  const fails = report.filter((c) => c.status === 'fail').length
  const warns = report.filter((c) => c.status === 'warn').length
  out(`\n${fails} fail, ${warns} warn, ${report.length - fails - warns} ok\n`)
  return fails ? 1 : 0
}

export function runCss(projectDir, parsed) {
  const plan = planSources(projectDir)
  const summary = `${plan.files.length} WebKit file(s) for ${plan.subpaths.length} import(s)`
  if (!plan.resolved && plan.subpaths.length) {
    err(
      `@aziontech/webkit is not installed here, so ${SOURCES_FILE} cannot list the files of ${plan.subpaths.length} import(s). Install it first.\n`
    )
    return 1
  }
  if (parsed.check) {
    out(`${SOURCES_FILE}: ${plan.stale ? 'stale' : 'current'} — ${summary}\n`)
    return plan.stale ? 1 : 0
  }
  if (parsed.dryRun) {
    out(`${plan.stale ? 'would write' : 'current'} ${SOURCES_FILE} — ${summary}\n`)
    return 0
  }
  const written = writeSources(plan)
  out(`${written ? 'wrote' : 'current'} ${SOURCES_FILE} — ${summary}\n`)
  return 0
}

export async function runCheckCommand(projectDir, parsed) {
  let maxWarnings = null
  if (parsed.maxWarnings != null) {
    maxWarnings = Number(parsed.maxWarnings)
    if (!Number.isInteger(maxWarnings)) {
      err(`--max-warnings takes an integer (got ${parsed.maxWarnings})\n`)
      return 2
    }
  }
  const result = await withNavigation(
    runCheck(projectDir, resolveWebkit(projectDir), { lint: !parsed.noLint }),
    projectDir,
    parsed.urls
  )
  const code = exitCodeFor(result, maxWarnings)
  if (parsed.json) json({ ...result, maxWarnings, exitCode: code })
  else out(formatCheck(result, maxWarnings))
  return code
}

export function runReportCommand(projectDir, parsed) {
  const format = parsed.format ?? 'markdown'
  const failOn = parsed.failOn ?? 'never'
  if (!FORMATS.has(format)) {
    err(`Unknown --format value: ${format} (expected markdown or json)\n`)
    return 1
  }
  if (!FAIL_MODES.has(failOn)) {
    err(`Unknown --fail-on value: ${failOn} (expected never or any)\n`)
    return 1
  }
  const patterns = parsed.args.length ? parsed.args : ['.']
  const result = runReport(projectDir, {
    format,
    failOn,
    patterns,
    log: (line) => err(`${line}\n`)
  })
  if (result.error) {
    err(`${result.error}\n`)
    return result.exitCode
  }
  out(result.stdout)
  return result.exitCode
}

export function runCanaryCommand(projectDir) {
  const result = runCanary(projectDir)
  for (const line of result.lines) out(`${line}\n`)
  return result.exitCode
}
