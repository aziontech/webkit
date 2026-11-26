import { applyPlan } from '../apply.js'
import { planSync, resolveBundleRoot } from '../sync.js'
import { err, out } from './output.js'

const SYNC_LABELS = {
  missing: 'COPY  ',
  stale: 'UPDATE',
  'unstamped-identical': 'STAMP ',
  orphan: 'ORPHAN'
}

function syncLabel(state, forced) {
  if (state === 'modified' || state === 'unstamped-different') return forced ? 'STAMP ' : 'SKIP  '
  return Object.hasOwn(SYNC_LABELS, state) ? SYNC_LABELS[state] : state.toUpperCase()
}

function printSyncTable(plan) {
  let acted = 0
  for (const entry of plan.entries) {
    if (!entry.action) continue
    acted += 1
    const forced = entry.action.forced === true
    out(`${syncLabel(entry.state, forced)} .claude/${entry.rel} (${entry.state})\n`)
  }
  if (plan.fragment.action) {
    acted += 1
    out(`FENCE  CLAUDE.md (fragment ${plan.fragment.state})\n`)
  }
  const current = plan.entries.length - plan.entries.filter((e) => e.action).length
  out(
    `\n${acted} action(s), ${current} current, fragment ${plan.fragment.state}, drift: ${plan.drift ? 'yes' : 'no'}\n`
  )
}

function printSourceRoot(bundleRoot, json) {
  out(
    json
      ? `${JSON.stringify({ drift: false, source: bundleRoot.dir, entries: [] }, null, 2)}\n`
      : `\n@aziontech/webkit sync\n${bundleRoot.dir} holds the bundle sources (skills/, rules/, adapters/) — nothing to sync.\n`
  )
}

function printSyncJson(plan) {
  const report = {
    drift: plan.drift,
    fragment: plan.fragment.state,
    entries: plan.entries.map((e) => ({
      rel: e.rel,
      state: e.state,
      action: e.action ? e.action.type : null
    }))
  }
  out(`${JSON.stringify(report, null, 2)}\n`)
}

function printSyncText(plan, bundleRoot, applyNothing) {
  const owner =
    bundleRoot.kind === 'ancestor' ? ' (the repository root that owns the agent files)' : ''
  out(
    `\n@aziontech/webkit sync${applyNothing ? ' (no changes applied)' : ''}\nproject: ${bundleRoot.dir}${owner}\n\n`
  )
  printSyncTable(plan)
}

function syncBundle(appDir, { check, dryRun, force, json }) {
  const applyNothing = check || dryRun
  const bundleRoot = resolveBundleRoot(appDir)
  if (bundleRoot.kind === 'source') {
    printSourceRoot(bundleRoot, json)
    return 0
  }
  const plan = planSync(bundleRoot.dir, { force })
  if (json) printSyncJson(plan)
  else printSyncText(plan, bundleRoot, applyNothing)
  if (!applyNothing) applyPlan(bundleRoot.dir, plan.actions)
  return check && plan.drift ? 1 : 0
}

export function runSync(appDir, options) {
  try {
    return syncBundle(appDir, options)
  } catch (error) {
    err(`${error?.message || error}\n`)
    return 2
  }
}
