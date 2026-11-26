import { planMigrate, REVIEW_WARNING, SUPPORTED_VERSIONS } from '../migrate.js'
import { err, out } from './output.js'

const majorOf = (value) => Number(String(value).replace(/^v/i, ''))

function printFile({ file, changes, warnings }, dryRun) {
  out(`${file}\n`)
  for (const c of changes) out(`  ${dryRun ? 'would change' : 'changed'}: ${c}\n`)
  for (const w of warnings) out(`  ${REVIEW_WARNING.test(w) ? 'REVIEW' : 'MANUAL'}: ${w}\n`)
}

function tally(results) {
  const counts = { changed: 0, manual: 0, review: 0 }
  for (const { changes, warnings } of results) {
    const toReview = warnings.filter((w) => REVIEW_WARNING.test(w))
    if (changes.length) counts.changed += 1
    if (warnings.length > toReview.length) counts.manual += 1
    else if (toReview.length) counts.review += 1
  }
  return counts
}

function parseFrom(from) {
  const fromMajor = from == null ? null : majorOf(from)
  if (fromMajor != null && !Number.isInteger(fromMajor)) return { error: true }
  return { fromMajor }
}

export function runMigrate(projectDir, target, { dryRun, from }) {
  const version = majorOf(target || '')
  if (!SUPPORTED_VERSIONS.includes(version)) {
    err(
      `Usage: npx @aziontech/webkit migrate v6 [--dry-run] (supported: ${SUPPORTED_VERSIONS.map((v) => `v${v}`).join(', ')})\n`
    )
    return 1
  }
  const { fromMajor, error } = parseFrom(from)
  if (error) {
    err(`--from takes a major version, such as 3 or v5 (got ${from})\n`)
    return 1
  }
  const results = planMigrate(projectDir, { version, dryRun, fromMajor })
  for (const result of results) printFile(result, dryRun)
  const { changed, manual, review } = tally(results)
  out(
    `\n${changed} file(s) ${dryRun ? 'to rewrite' : 'rewritten'}, ${manual} file(s) need a manual change${review ? `, ${review} more to review` : ''}. See MIGRATION_V6.md.\n`
  )
  return 0
}
