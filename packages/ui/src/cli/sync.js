import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'

import {
  AI_TEMPLATES,
  AZION_UI_VERSION,
  classify,
  FRAGMENT_END,
  FRAGMENT_START,
  fragmentFile,
  LEGACY_MARKER,
  listBundle,
  spliceFragment,
  stamp,
  templateFile
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
const AGENTS_DIR = '.agents'
const CLAUDE_DIR = '.claude'
const CLAUDE_BUNDLE_DIRS = new Set(['skills', 'agents'])
export const CLAUDE_FRAGMENT = '@AGENTS.md\n'

function isAzionUiBundleName(rel) {
  return (
    /^rules\/azion-ui-[^/]+\.md$/.test(rel) ||
    /^agents\/azion-ui-[^/]+\.md$/.test(rel) ||
    /^skills\/azion-ui-[^/]+\/SKILL\.md$/.test(rel)
  )
}

function listBundleFiles(baseDir) {
  const out = []
  for (const bundleDir of BUNDLE_DIRS) {
    const abs = join(baseDir, bundleDir)
    for (const file of walkMarkdown(abs)) {
      out.push(toPosix(join(bundleDir, file.slice(abs.length + 1))))
    }
  }
  return out
}

function classifyFragment(content, fragmentBody) {
  if (content === null) return 'missing'
  const hasFence = content.includes(FRAGMENT_START) && content.includes(FRAGMENT_END)
  if (!hasFence) {
    if (content.includes(LEGACY_MARKER)) return 'legacy'
    return content.includes(FRAGMENT_START) ? 'stale' : 'missing'
  }
  const next = spliceFragment(content, fragmentBody, {
    start: FRAGMENT_START,
    end: FRAGMENT_END
  })
  return next === content ? 'current' : 'stale'
}

function hasFragment(dir, name) {
  const content = readOrNull(join(dir, name))
  return Boolean(content && (content.includes(FRAGMENT_START) || content.includes(LEGACY_MARKER)))
}

export function hasBundle(dir) {
  if (listBundleFiles(join(dir, AGENTS_DIR)).some(isAzionUiBundleName)) return true
  if (listBundleFiles(join(dir, CLAUDE_DIR)).some(isAzionUiBundleName)) return true
  return ['AGENTS.md', 'CLAUDE.md'].some((name) => hasFragment(dir, name))
}

function usesClaudeCode(projectDir) {
  return existsSync(join(projectDir, CLAUDE_DIR)) || existsSync(join(projectDir, 'CLAUDE.md'))
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

function copyStamped(entry, state, { version, forced }) {
  const action = {
    type: 'copy-stamped',
    to: entry.path,
    content: stamp(entry.template, { source: entry.source, version }),
    state
  }
  return forced ? { ...action, forced: true } : action
}

function bundleAction(entry, state, { force, version }) {
  if (COPY_STATES.has(state)) return copyStamped(entry, state, { version })
  if (!EDITED_STATES.has(state)) return null
  if (force) return copyStamped(entry, state, { version, forced: true })
  return {
    type: 'report',
    rel: entry.rel,
    path: entry.path,
    state,
    reportResult: 'skipped',
    detail: `${entry.path} was edited after sync stamped it — skipped (use --force to overwrite)`
  }
}

function frontmatterOf(content) {
  const match = content.match(/^---\n[\s\S]*?\n---\n/)
  return match ? match[0] : ''
}

function claudePointer(rel, templateContent) {
  const kind = rel.startsWith('skills/') ? 'skill' : 'agent'
  return `${frontmatterOf(templateContent)}\nRead \`${AGENTS_DIR}/${rel}\` and follow it: it is this ${kind}. This file only lets Claude Code find it.\n`
}

function targets(projectDir, bundleRels, { templatesDir, claude }) {
  const out = []
  for (const rel of bundleRels) {
    const template = readOrNull(templateFile(templatesDir, rel)) ?? ''
    out.push({ rel, path: toPosix(join(AGENTS_DIR, rel)), source: rel, template })
    if (claude && CLAUDE_BUNDLE_DIRS.has(rel.split('/')[0])) {
      out.push({
        rel,
        path: toPosix(join(CLAUDE_DIR, rel)),
        source: `claude/${rel}`,
        template: claudePointer(rel, template)
      })
    }
  }
  return out
}

function bundleEntries(projectDir, list, options) {
  return list.map((entry) => {
    const state = classify(entry.template, readOrNull(join(projectDir, entry.path)))
    return {
      rel: entry.rel,
      path: entry.path,
      state,
      action: bundleAction(entry, state, options)
    }
  })
}

const SYNC_MARKER = /^<!-- azion-ui-sync source=(\S+) version=(\S+) sha256=([0-9a-f]{16}) -->/m

function orphanEntry(projectDir, base, rel) {
  const path = toPosix(join(base, rel))
  const content = readOrNull(join(projectDir, path))
  if (content === null) return null
  const marker = content.match(SYNC_MARKER)
  if (!marker) return null
  const action = {
    type: 'report',
    rel,
    path,
    state: 'orphan',
    reportResult: 'skipped',
    detail: `${path} carries an azion-ui-sync marker for "${marker[1]}", which no longer exists in the bundle — left in place`
  }
  return { rel, path, state: 'orphan', action }
}

function orphanEntries(projectDir, bundleRelSet) {
  return [AGENTS_DIR, CLAUDE_DIR].flatMap((base) =>
    listBundleFiles(join(projectDir, base))
      .filter((rel) => !bundleRelSet.has(rel) && isAzionUiBundleName(rel))
      .map((rel) => orphanEntry(projectDir, base, rel))
      .filter(Boolean)
  )
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
  {
    force = false,
    templatesDir = AI_TEMPLATES,
    version = AZION_UI_VERSION,
    claude = usesClaudeCode(projectDir)
  } = {}
) {
  const bundleRels = listBundle(templatesDir)
  const list = targets(projectDir, bundleRels, { templatesDir, claude })
  const entries = [
    ...bundleEntries(projectDir, list, { force, version }),
    ...orphanEntries(projectDir, new Set(bundleRels))
  ]
  const fragmentBody = readOrNull(fragmentFile(templatesDir)) || ''
  const fragment = fenceFor(projectDir, 'AGENTS.md', fragmentBody)
  const claudeFragment = claude ? fenceFor(projectDir, 'CLAUDE.md', CLAUDE_FRAGMENT) : null
  const actions = [...entries.map((e) => e.action), fragment.action, claudeFragment?.action].filter(
    Boolean
  )
  const drift =
    entries.some(isEntryDrift) ||
    isFragmentDrift(fragment.state) ||
    Boolean(claudeFragment && isFragmentDrift(claudeFragment.state))
  return { entries, fragment, claudeFragment, claude, actions, drift }
}
