import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'

import {
  AI_TEMPLATES,
  classify,
  FRAGMENT_END,
  FRAGMENT_START,
  fragmentFile,
  LEGACY_MARKER,
  listBundle,
  spliceFragment,
  stamp,
  templateFile,
  WEBKIT_VERSION
} from './bundle.js'

function toPosix(path) {
  return sep === '/' ? path : path.split(sep).join('/')
}

function readOrNull(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : null
}

function walkMarkdown(dir) {
  if (!existsSync(dir)) return []
  const out = []
  const stack = [dir]
  while (stack.length) {
    const current = stack.pop()
    let entries = []
    try {
      entries = readdirSync(current, { withFileTypes: true })
    } catch {
      continue
    }
    for (const entry of entries) {
      const full = join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(full)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        out.push(full)
      }
    }
  }
  return out
}

const BUNDLE_DIRS = ['rules', 'skills', 'agents']

function isWebkitBundleName(rel) {
  return (
    /^rules\/webkit-[^/]+\.md$/.test(rel) ||
    /^agents\/webkit-[^/]+\.md$/.test(rel) ||
    /^skills\/webkit-[^/]+\/SKILL\.md$/.test(rel)
  )
}

function listConsumerClaudeFiles(claudeDir) {
  const out = []
  for (const bundleDir of BUNDLE_DIRS) {
    const abs = join(claudeDir, bundleDir)
    for (const file of walkMarkdown(abs)) {
      out.push(toPosix(join(bundleDir, file.slice(abs.length + 1))))
    }
  }
  return out
}

function classifyFragment(claudeMdContent, fragmentBody) {
  if (claudeMdContent === null) return 'missing'
  const hasFence =
    claudeMdContent.includes(FRAGMENT_START) && claudeMdContent.includes(FRAGMENT_END)
  if (!hasFence) {
    if (claudeMdContent.includes(LEGACY_MARKER)) return 'legacy'
    return claudeMdContent.includes(FRAGMENT_START) ? 'stale' : 'missing'
  }
  const next = spliceFragment(claudeMdContent, fragmentBody, {
    start: FRAGMENT_START,
    end: FRAGMENT_END
  })
  return next === claudeMdContent ? 'current' : 'stale'
}

export function hasBundle(dir) {
  if (listConsumerClaudeFiles(join(dir, '.claude')).some(isWebkitBundleName)) return true
  return ['AGENTS.md', 'CLAUDE.md'].some((name) => {
    const content = readOrNull(join(dir, name))
    return Boolean(content && (content.includes(FRAGMENT_START) || content.includes(LEGACY_MARKER)))
  })
}

function canonical(path) {
  try {
    return realpathSync(path)
  } catch {
    return path
  }
}

export function resolveBundleRoot(projectDir, { templatesDir = AI_TEMPLATES } = {}) {
  const own = { dir: projectDir, kind: 'own' }
  if (hasBundle(projectDir)) return own
  const ancestors = []
  let dir = canonical(projectDir)
  while (!existsSync(join(dir, '.git'))) {
    const parent = dirname(dir)
    if (parent === dir) return own
    dir = parent
    ancestors.push(dir)
  }
  const source = canonical(templatesDir)
  for (const ancestor of ancestors) {
    if (ancestor === source) return { dir: ancestor, kind: 'source' }
    if (hasBundle(ancestor)) return { dir: ancestor, kind: 'ancestor' }
  }
  return own
}

const COPY_STATES = new Set(['missing', 'stale', 'unstamped-identical'])
const EDITED_STATES = new Set(['modified', 'unstamped-different'])

function copyStamped(rel, templateContent, state, { version, forced }) {
  const action = {
    type: 'copy-stamped',
    to: join('.claude', rel),
    content: stamp(templateContent, { source: `claude/${rel}`, version }),
    state
  }
  return forced ? { ...action, forced: true } : action
}

function bundleAction(rel, templateContent, state, { force, version }) {
  if (COPY_STATES.has(state)) return copyStamped(rel, templateContent, state, { version })
  if (!EDITED_STATES.has(state)) return null
  if (force) return copyStamped(rel, templateContent, state, { version, forced: true })
  return {
    type: 'report',
    rel,
    state,
    reportResult: 'skipped',
    detail: `${join('.claude', rel)} was edited after sync stamped it — skipped (use --force to overwrite)`
  }
}

function bundleEntries(claudeDir, bundleRels, options) {
  return bundleRels.map((rel) => {
    const templateContent = readOrNull(templateFile(options.templatesDir, rel)) ?? ''
    const consumerContent = readOrNull(join(claudeDir, rel))
    const state = classify(templateContent, consumerContent)
    return { rel, state, action: bundleAction(rel, templateContent, state, options) }
  })
}

const SYNC_MARKER = /^<!-- webkit-sync source=(\S+) version=(\S+) sha256=([0-9a-f]{16}) -->/m

function orphanEntry(claudeDir, rel) {
  const content = readOrNull(join(claudeDir, rel))
  if (content === null) return null
  const marker = content.match(SYNC_MARKER)
  if (!marker) return null
  const action = {
    type: 'report',
    rel,
    state: 'orphan',
    reportResult: 'skipped',
    detail: `${join('.claude', rel)} carries a webkit-sync marker for "${marker[1]}", which no longer exists in the bundle — left in place`
  }
  return { rel, state: 'orphan', action }
}

function orphanEntries(claudeDir, bundleRelSet) {
  return listConsumerClaudeFiles(claudeDir)
    .filter((rel) => !bundleRelSet.has(rel) && isWebkitBundleName(rel))
    .map((rel) => orphanEntry(claudeDir, rel))
    .filter(Boolean)
}

function fenceFor(projectDir, path, fragmentBody) {
  const content = readOrNull(join(projectDir, path))
  const state = classifyFragment(content, fragmentBody)
  const action =
    state === 'current'
      ? null
      : { type: 'fence', path, start: FRAGMENT_START, end: FRAGMENT_END, content: fragmentBody }
  return { state, action }
}

const isFragmentDrift = (state) => state === 'legacy' || state === 'stale' || state === 'missing'
const isEntryDrift = (e) => e.state === 'missing' || e.state === 'stale' || e.state === 'orphan'

export function planSync(
  projectDir,
  { force = false, templatesDir = AI_TEMPLATES, version = WEBKIT_VERSION } = {}
) {
  const claudeDir = join(projectDir, '.claude')
  const bundleRels = listBundle(templatesDir)
  const entries = [
    ...bundleEntries(claudeDir, bundleRels, { force, templatesDir, version }),
    ...orphanEntries(claudeDir, new Set(bundleRels))
  ]
  const fragmentBody = readOrNull(fragmentFile(templatesDir)) || ''
  const agentsFragment = fenceFor(projectDir, 'AGENTS.md', fragmentBody)
  const claudeFragment = fenceFor(projectDir, 'CLAUDE.md', fragmentBody)
  const actions = [
    ...entries.map((e) => e.action),
    agentsFragment.action,
    claudeFragment.action
  ].filter(Boolean)
  const drift =
    entries.some(isEntryDrift) ||
    isFragmentDrift(claudeFragment.state) ||
    isFragmentDrift(agentsFragment.state)
  return { entries, fragment: claudeFragment, agentsFragment, actions, drift }
}
