// Derives the Claude Code bundle (rules/skills/agents copied into a consumer's .claude/)
// straight from the templates directory instead of a hand-maintained list that can drift
// from disk, and fences the CLAUDE.md fragment so it can be replaced in place — including
// migrating/repairing a pre-fence, marker-only fragment (even a duplicated one).

import { existsSync, readdirSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES = join(__dirname, '../../cli-templates')
export const CLAUDE_TEMPLATES = join(TEMPLATES, 'claude')

// Bundle subdirectories walked for `.md` templates, in the order their entries should
// appear in the derived list (rules, then skills, then agents).
const BUNDLE_DIRS = ['rules', 'skills', 'agents']

// Explicit exclusion list — empty today, kept as the extension point for a template that
// should ship on disk (e.g. as a fragment/include) but never be copied into a consumer.
const EXCLUDE = new Set()

function toPosix(path) {
  return sep === '/' ? path : path.split(sep).join('/')
}

/** Recursively collect `.md` files under `dir`, returned as POSIX paths relative to `dir`. */
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

/**
 * Derive the Claude bundle: every `.md` template under `rules/`, `skills/`, `agents/`
 * (in that order), as sorted POSIX paths relative to `templatesDir`
 * (e.g. `rules/webkit-imports.md`, `skills/webkit-usage/SKILL.md`, `agents/webkit-expert.md`).
 * Pure — reads the filesystem, writes nothing.
 */
export function listBundle(templatesDir = CLAUDE_TEMPLATES) {
  const rels = []
  for (const bundleDir of BUNDLE_DIRS) {
    const abs = join(templatesDir, bundleDir)
    for (const file of walkMarkdown(abs)) {
      const rel = toPosix(join(bundleDir, relative(abs, file)))
      if (!EXCLUDE.has(rel)) rels.push(rel)
    }
  }
  return rels.sort()
}

// --- CLAUDE.md fragment fencing ------------------------------------------------------

// Current fence markers — the fragment body lives between these two lines and is
// replaced wholesale on every `init`/`sync`, so template updates reach existing consumers.
export const FRAGMENT_START = '<!-- @aziontech/webkit:start -->'
export const FRAGMENT_END = '<!-- @aziontech/webkit:end -->'

// Pre-fence marker (single line, no closing fence) that older `init` runs appended. Kept
// only to detect and migrate/repair a legacy fragment; new fragments never use it alone.
export const LEGACY_MARKER = '<!-- @aziontech/webkit -->'

// The fragment's own first heading — the legacy-block scan must not treat this line as the
// boundary of "the next section", or a single legacy block would be truncated to nothing.
const FRAGMENT_OWN_HEADING = '## @aziontech/webkit design system'

function findFencedBlocks(source, startMarker, endMarker) {
  const blocks = []
  let searchFrom = 0
  for (;;) {
    const start = source.indexOf(startMarker, searchFrom)
    if (start === -1) break
    const end = source.indexOf(endMarker, start)
    if (end === -1) break
    const endLineEnd = source.indexOf('\n', end)
    blocks.push({ start, end: endLineEnd === -1 ? source.length : endLineEnd + 1 })
    searchFrom = blocks[blocks.length - 1].end
  }
  return blocks
}

// A line "starts a new section" for the legacy scan when it is a level 1/2 heading that
// is not the fragment's own heading (so the fragment's own body never ends the scan early).
function isForeignHeading(line) {
  return /^#{1,2}\s/.test(line) && line.trim() !== FRAGMENT_OWN_HEADING
}

function findLegacyBlocks(source) {
  const blocks = []
  const markerIndexes = []
  let searchFrom = 0
  for (;;) {
    const idx = source.indexOf(LEGACY_MARKER, searchFrom)
    if (idx === -1) break
    markerIndexes.push(idx)
    searchFrom = idx + LEGACY_MARKER.length
  }
  for (let i = 0; i < markerIndexes.length; i += 1) {
    const start = markerIndexes[i]
    const nextMarker = markerIndexes[i + 1]
    // Scan line-by-line from just after this marker for the next foreign heading, the next
    // marker, or EOF — whichever comes first.
    let end = source.length
    let cursor = source.indexOf('\n', start)
    cursor = cursor === -1 ? source.length : cursor + 1
    while (cursor < source.length) {
      if (nextMarker !== undefined && cursor > nextMarker) break
      const lineEnd = source.indexOf('\n', cursor)
      const line = source.slice(cursor, lineEnd === -1 ? source.length : lineEnd)
      if (isForeignHeading(line)) {
        end = cursor
        break
      }
      if (lineEnd === -1) {
        cursor = source.length
        break
      }
      cursor = lineEnd + 1
    }
    if (nextMarker !== undefined && end > nextMarker) end = nextMarker
    blocks.push({ start, end })
  }
  return blocks
}

function fence(body, startMarker, endMarker) {
  return `${startMarker}\n${body}\n${endMarker}`
}

// Collapse whitespace noise left behind by splicing/removing blocks: at most one blank
// line between sections, a blank line before any heading that directly follows other
// content (splicing/removing a block can leave one abutting the next section's heading),
// no trailing blank lines, exactly one trailing newline. Applied once at the end so every
// branch below can splice/remove without hand-tracking spacing — and because it only
// normalizes whitespace runs, it is itself idempotent.
function normalize(text) {
  return `${text
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/([^\n])\n(#{1,2} )/g, '$1\n\n$2')
    .replace(/\s+$/, '')}\n`
}

/**
 * Splice `body` into `source` as the @aziontech/webkit CLAUDE.md fragment. Pure and
 * idempotent: splice(splice(source, body), body) === splice(source, body).
 *
 *  a. A fenced block already exists → its content is replaced with `body`; any extra
 *     fenced block (a stray duplicate) is removed.
 *  b. No fenced block, but a legacy single-line marker exists → the first legacy block is
 *     converted to a fenced block with `body`; any other legacy block is removed (this
 *     repairs a duplicated legacy fragment, e.g. one appended at two positions).
 *  c. Neither → the fenced block is appended, separated from existing content by exactly
 *     one blank line.
 *
 * `start`/`end` default to the current fence markers; the `fence` apply action passes its
 * own `action.start`/`action.end` through, so a future marker change stays data-driven.
 */
export function spliceFragment(source, body, { start = FRAGMENT_START, end = FRAGMENT_END } = {}) {
  const fenced = findFencedBlocks(source, start, end)
  if (fenced.length) {
    let result =
      source.slice(0, fenced[0].start) +
      fence(body, start, end) +
      '\n' +
      source.slice(fenced[0].end)
    // Remove any further fenced blocks (recompute offsets against the shrinking string).
    for (let i = 1; i < fenced.length; i += 1) {
      const extra = findFencedBlocks(result, start, end).slice(1)[0]
      if (!extra) break
      result = result.slice(0, extra.start) + result.slice(extra.end)
    }
    return normalize(result)
  }

  const legacy = findLegacyBlocks(source)
  if (legacy.length) {
    let result =
      source.slice(0, legacy[0].start) +
      fence(body, start, end) +
      '\n' +
      source.slice(legacy[0].end)
    for (let i = 1; i < legacy.length; i += 1) {
      const remaining = findLegacyBlocks(result)
      // The first (already-converted) block is now a fenced block, not a legacy one, so
      // every legacy block still found is a stray duplicate to remove.
      const extra = remaining[0]
      if (!extra) break
      result = result.slice(0, extra.start) + result.slice(extra.end)
    }
    return normalize(result)
  }

  const trimmed = source.replace(/\s+$/, '')
  const separator = trimmed ? '\n\n' : ''
  return normalize(`${trimmed}${separator}${fence(body, start, end)}\n`)
}
