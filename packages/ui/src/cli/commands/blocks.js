import { applyAdd, applyRemove, MANIFEST, planAdd, planDiff, planRemove } from '../blocks.js'
import { planSources, SOURCES_FILE, writeSources } from '../css-sources.js'
import { catalogFor, resolveWebkit } from '../source.js'
import { colorize, diffStats } from '../text-diff.js'
import { err, json, out, useColor } from './output.js'

function refreshSourcesAfterAdd(projectDir) {
  const plan = planSources(projectDir)
  if (plan.current === null || !plan.resolved) return
  if (writeSources(plan)) out(`updated ${SOURCES_FILE} — ${plan.files.length} WebKit file(s)\n`)
}

function addReport(plan, parsed, written) {
  return {
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
  }
}

function printAddFailure(plan) {
  for (const e of plan.errors) err(`ERROR ${e}\n`)
  if (plan.suggestions?.length) err(`Did you mean: ${plan.suggestions.join(', ')}?\n`)
}

function printAddFiles(plan, dryRun) {
  const verb = dryRun ? 'would write' : 'wrote'
  for (const f of plan.files) {
    out(`${verb} ${f.path}${f.exists ? ' (overwritten)' : ''}  ← ${f.variant}\n`)
  }
  if (plan.guidelines) out(`${verb} ${plan.guidelines.path}  ← guidelines\n`)
  out(`${dryRun ? 'would record' : 'recorded'} ${plan.id} in ${MANIFEST}\n`)
}

function printAdded(plan, dryRun) {
  out(`\n${plan.id} (${plan.name}) from @aziontech/webkit@${plan.version}\n`)
  if (plan.viewsReason) out(`views directory: ${plan.viewsReason}\n`)
  out('\n')
  printAddFiles(plan, dryRun)
  out(`imports: ${plan.imports.webkit.length} @aziontech/webkit subpath(s), all exported\n`)
  out(
    `\nAdd the route${plan.route.router ? ` in ${plan.route.router}` : ''}:\n  ${plan.route.entry}\n`
  )
  out(
    `\nChange only the content (copy, data, handlers); keep the components, their order and the classes. Read the guidelines: npx @aziontech/webkit view ${plan.id}\n`
  )
  if (dryRun) out('\nDry run — no files were written.\n')
}

export function runAdd(projectDir, id, parsed) {
  if (!id) {
    err('Usage: npx @aziontech/webkit add <block-id> (find one with `search`)\n')
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
  if (written.length && !parsed.json) refreshSourcesAfterAdd(projectDir)
  if (parsed.json) {
    json(addReport(plan, parsed, written))
    return plan.ok ? 0 : 1
  }
  for (const w of plan.warnings || []) err(`WARN  ${w}\n`)
  if (!plan.ok) {
    printAddFailure(plan)
    return 1
  }
  printAdded(plan, parsed.dryRun)
  return 0
}

function printRemoved(plan, dryRun) {
  const verb = dryRun ? 'would delete' : 'deleted'
  for (const file of plan.files) {
    out(
      file.exists
        ? `${verb} ${file.path}\n`
        : `${file.path}: already gone, dropped from ${MANIFEST}\n`
    )
  }
  out(
    `${dryRun ? 'would drop' : 'dropped'} ${plan.whole ? plan.id : `${plan.files.length} file(s) of ${plan.id}`} from ${MANIFEST}\n`
  )
  for (const path of plan.outside) out(`${path}: outside the project, left in place\n`)
  if (plan.importers.length) {
    out('\nStill imported by (remove these imports and the route):\n')
    for (const hit of plan.importers) out(`  ${hit.file}: ${hit.imports}\n`)
  }
  if (dryRun) out('\nDry run — no files were deleted.\n')
}

export function runRemove(projectDir, target, parsed) {
  if (!target) {
    err('Usage: npx @aziontech/webkit remove <block-id|path> [--dry-run]\n')
    return 2
  }
  const plan = planRemove(projectDir, target)
  if (!plan.ok) {
    if (parsed.json) json(plan)
    else err(`${plan.error}\n`)
    return 1
  }
  const removed = parsed.dryRun ? [] : applyRemove(projectDir, plan)
  if (removed.length && !parsed.json) refreshSourcesAfterAdd(projectDir)
  if (parsed.json) {
    json({ ...plan, dryRun: parsed.dryRun, removed })
    return 0
  }
  printRemoved(plan, parsed.dryRun)
  return 0
}

function upstreamNote(f, result) {
  if (!f.upstreamChanged) return ''
  return result.recordedVersion === result.version
    ? ` — the installed canonical block differs from the copy recorded at the same version (${result.version})`
    : ` — the canonical block changed since it was copied (${result.recordedVersion} → ${result.version})`
}

function printDiffFile(f, result, color) {
  const upstream = upstreamNote(f, result)
  if (f.status === 'identical') {
    out(`${f.path}: identical to ${f.source}${upstream}\n`)
  } else if (f.status === 'missing') {
    out(`${f.path}: missing (recorded in ${MANIFEST})\n`)
  } else if (f.status === 'removed-upstream') {
    out(`${f.path}: ${f.source} is not in @aziontech/webkit@${result.version}\n`)
  } else {
    const { added, removed } = diffStats(f.patch)
    out(`${f.path}: +${added} -${removed} against ${f.source}${upstream}\n`)
    out(color ? `${colorize(f.patch)}\n` : f.patch)
  }
}

export function runDiff(projectDir, target, parsed) {
  if (!target) {
    err('Usage: npx @aziontech/webkit diff <block-id|path>\n')
    return 2
  }
  const result = planDiff(projectDir, resolveWebkit(projectDir), target)
  if (!result.ok) {
    if (parsed.json) json(result)
    else err(`${result.error}\n`)
    return 2
  }
  const differs = result.files.some((f) => f.status !== 'identical')
  if (parsed.json) {
    json({ ...result, differs })
    return differs ? 1 : 0
  }
  const color = useColor()
  for (const f of result.files) printDiffFile(f, result, color)
  return differs ? 1 : 0
}
