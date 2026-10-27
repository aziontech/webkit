import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, sep } from 'node:path'

import {
  classify,
  CLAUDE_TEMPLATES,
  FRAGMENT_END,
  FRAGMENT_START,
  LEGACY_MARKER,
  listBundle,
  spliceFragment,
  stamp,
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
    return claudeMdContent.includes(LEGACY_MARKER) ? 'legacy' : 'missing'
  }
  const next = spliceFragment(claudeMdContent, fragmentBody, {
    start: FRAGMENT_START,
    end: FRAGMENT_END
  })
  return next === claudeMdContent ? 'current' : 'stale'
}

export function planSync(
  projectDir,
  { force = false, templatesDir = CLAUDE_TEMPLATES, version = WEBKIT_VERSION } = {}
) {
  const claudeDir = join(projectDir, '.claude')
  const bundleRels = listBundle(templatesDir)
  const bundleRelSet = new Set(bundleRels)

  const entries = []
  const actions = []

  for (const rel of bundleRels) {
    const templatePath = join(templatesDir, rel)
    const templateContent = readOrNull(templatePath) ?? ''
    const consumerPath = join(claudeDir, rel)
    const consumerContent = readOrNull(consumerPath)
    const source = `claude/${rel}`
    const state = classify(templateContent, consumerContent)

    let action = null
    if (state === 'missing' || state === 'stale' || state === 'unstamped-identical') {
      action = {
        type: 'copy-stamped',
        to: join('.claude', rel),
        content: stamp(templateContent, { source, version }),
        state
      }
    } else if (state === 'modified' || state === 'unstamped-different') {
      if (force) {
        action = {
          type: 'copy-stamped',
          to: join('.claude', rel),
          content: stamp(templateContent, { source, version }),
          state,
          forced: true
        }
      } else {
        action = {
          type: 'report',
          rel,
          state,
          reportResult: 'skipped',
          detail: `${join('.claude', rel)} was edited after sync stamped it — skipped (use --force to overwrite)`
        }
      }
    }

    entries.push({ rel, state, action })
    if (action) actions.push(action)
  }

  for (const rel of listConsumerClaudeFiles(claudeDir)) {
    if (bundleRelSet.has(rel)) continue
    if (!isWebkitBundleName(rel)) continue
    const content = readOrNull(join(claudeDir, rel))
    if (content === null) continue
    const marker = content.match(
      /^<!-- webkit-sync source=(\S+) version=(\S+) sha256=([0-9a-f]{16}) -->/m
    )
    if (!marker) continue
    const action = {
      type: 'report',
      rel,
      state: 'orphan',
      reportResult: 'skipped',
      detail: `${join('.claude', rel)} carries a webkit-sync marker for "${marker[1]}", which no longer exists in the bundle — left in place`
    }
    entries.push({ rel, state: 'orphan', action })
    actions.push(action)
  }

  const claudeMdPath = join(projectDir, 'CLAUDE.md')
  const claudeMdContent = readOrNull(claudeMdPath)
  const fragmentBody = readOrNull(join(templatesDir, 'CLAUDE.fragment.md')) || ''
  const fragmentState = classifyFragment(claudeMdContent, fragmentBody)
  let fragmentAction = null
  if (fragmentState !== 'current') {
    fragmentAction = {
      type: 'fence',
      path: 'CLAUDE.md',
      start: FRAGMENT_START,
      end: FRAGMENT_END,
      content: fragmentBody
    }
    actions.push(fragmentAction)
  }

  const drift =
    entries.some((e) => e.state === 'missing' || e.state === 'stale' || e.state === 'orphan') ||
    fragmentState === 'legacy' ||
    fragmentState === 'stale' ||
    fragmentState === 'missing'

  return {
    entries,
    fragment: { state: fragmentState, action: fragmentAction },
    actions,
    drift
  }
}
