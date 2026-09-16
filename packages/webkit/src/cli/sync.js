// Pure planner for `webkit sync`: reconciles the copied `.claude/` bundle and CLAUDE.md
// fragment with the templates this webkit version ships, without clobbering local edits.
// See docs/toolkit/cli.md ("sync") and bundle.js (stamp/parseMarker/classify).

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

/** Recursively collect `.md` files under `dir`, as POSIX paths relative to `dir`. */
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

// A consumer file "belongs" to the webkit naming convention (and is therefore a sync
// candidate for orphan detection) when it is a rule/agent named `webkit-*.md`, or a
// skill directory named `webkit-*` with a `SKILL.md`.
function isWebkitBundleName(rel) {
  return (
    /^rules\/webkit-[^/]+\.md$/.test(rel) ||
    /^agents\/webkit-[^/]+\.md$/.test(rel) ||
    /^skills\/webkit-[^/]+\/SKILL\.md$/.test(rel)
  )
}

/** Every `.md` file under the consumer's `.claude/{rules,skills,agents}`, as posix rels. */
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

// The CLAUDE.md fragment isn't part of the provenance-marker scheme (it is one
// long-lived fenced block, replaced wholesale by `spliceFragment` — see bundle.js), so
// its state is derived directly from fence presence/idempotency instead of a marker hash.
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

/**
 * Plan a `sync`: classify every bundle file + the CLAUDE.md fragment, and produce the
 * action list. Policy per state: docs/toolkit/cli.md ("sync"). Pure — writes nothing.
 */
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
    // `current` → no action.

    entries.push({ rel, state, action })
    if (action) actions.push(action)
  }

  // Orphans: files under .claude/{rules,skills,agents} named like a bundle entry, still
  // carrying a marker, whose source is no longer part of the current bundle.
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

  // CLAUDE.md fragment.
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
