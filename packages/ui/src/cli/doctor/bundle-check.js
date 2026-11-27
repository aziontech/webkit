import { relative } from 'node:path'

import { planSync, resolveBundleRoot } from '../sync.js'

const byState =
  (...states) =>
  (e) =>
    states.includes(e.state)

function fragmentLines(sync, at) {
  const lines = []
  if (sync.fragment.state !== 'current') {
    lines.push(`fragment: ${at('AGENTS.md')} is ${sync.fragment.state}`)
  }
  if (sync.claudeFragment && sync.claudeFragment.state !== 'current') {
    lines.push(`fragment: ${at('CLAUDE.md')} is ${sync.claudeFragment.state}`)
  }
  return lines
}

function driftLines(sync, at) {
  return [
    ...sync.entries.filter(byState('missing', 'stale')).map((e) => `${e.state}: ${at(e.path)}`),
    ...sync.entries.filter(byState('orphan')).map((e) => `orphan: ${at(e.path)}`),
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
        .map((e) => `modified: ${at(e.path)}`)
        .join('\n')}`
    ]
  }
  return [
    'ok',
    where
      ? `every agent file and the AGENTS.md fragment in ${where} are current`
      : 'every agent file and the AGENTS.md fragment are current'
  ]
}

export function bundleCheck({ projectDir, add }) {
  const bundleRoot = resolveBundleRoot(projectDir)
  const where =
    bundleRoot.kind === 'own' ? '' : relative(projectDir, bundleRoot.dir) || bundleRoot.dir
  if (bundleRoot.kind === 'source') {
    add(
      'agent files',
      'ok',
      `${where} holds the bundle sources (skills/, rules/, agents/) this app is built with — nothing to sync`
    )
    return
  }
  add('agent files', ...bundleState(planSync(bundleRoot.dir), where))
}
