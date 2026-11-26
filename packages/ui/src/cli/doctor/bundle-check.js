import { relative } from 'node:path'

import { planSync, resolveBundleRoot } from '../sync.js'

const byState =
  (...states) =>
  (e) =>
    states.includes(e.state)

function fragmentLines(sync, at) {
  const lines = []
  if (sync.fragment.state !== 'current') {
    lines.push(`fragment: ${at('CLAUDE.md')} is ${sync.fragment.state}`)
  }
  if (sync.agentsFragment && sync.agentsFragment.state !== 'current') {
    lines.push(`fragment: ${at('AGENTS.md')} is ${sync.agentsFragment.state}`)
  }
  return lines
}

function driftLines(sync, at) {
  return [
    ...sync.entries
      .filter(byState('missing', 'stale'))
      .map((e) => `${e.state}: ${at(`.claude/${e.rel}`)}`),
    ...sync.entries.filter(byState('orphan')).map((e) => `orphan: ${at(`.claude/${e.rel}`)}`),
    ...fragmentLines(sync, at)
  ]
}

function bundleState(sync, where) {
  const at = (path) => (where ? `${where}/${path}` : path)
  const syncHint = where
    ? `run \`npx @aziontech/ui sync\` in ${where} (the repository root that owns the agent files)`
    : 'run `npx @aziontech/ui sync`'
  if (sync.drift) {
    return ['fail', `out of date — ${syncHint}.\n${driftLines(sync, at).join('\n')}`]
  }
  const modified = sync.entries.filter(byState('modified', 'unstamped-different'))
  if (modified.length) {
    return [
      'warn',
      `${modified.length} file(s) edited locally after sync stamped them (left alone) — ${syncHint} with --force to overwrite, or ignore if intentional.\n${modified
        .map((e) => `modified: ${at(`.claude/${e.rel}`)}`)
        .join('\n')}`
    ]
  }
  return [
    'ok',
    where
      ? `every bundle file and the AGENTS.md / CLAUDE.md fragment in ${where} are current`
      : 'every bundle file and the AGENTS.md / CLAUDE.md fragment are current'
  ]
}

export function bundleCheck({ projectDir, add }) {
  const bundleRoot = resolveBundleRoot(projectDir)
  const where =
    bundleRoot.kind === 'own' ? '' : relative(projectDir, bundleRoot.dir) || bundleRoot.dir
  if (bundleRoot.kind === 'source') {
    add(
      'claude bundle',
      'ok',
      `${where} holds the bundle sources (skills/, rules/, adapters/) this app is built with — nothing to sync`
    )
    return
  }
  add('claude bundle', ...bundleState(planSync(bundleRoot.dir), where))
}
