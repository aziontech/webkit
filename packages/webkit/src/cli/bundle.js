// Derives the Claude Code bundle from cli-templates and fences the CLAUDE.md fragment.
// See docs/toolkit/cli.md for why (drift-proof bundle, in-place fragment updates,
// legacy-marker migration/repair).

import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES = join(__dirname, '../../cli-templates')
export const CLAUDE_TEMPLATES = join(TEMPLATES, 'claude')

// Version of the installed webkit, stamped into every provenance marker.
function resolveWebkitVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf8'))
    return pkg.version || '0.0.0'
  } catch {
    return '0.0.0'
  }
}
export const WEBKIT_VERSION = resolveWebkitVersion()

// Walked in this order; see listBundle().
const BUNDLE_DIRS = ['rules', 'skills', 'agents']

// Extension point for a template that ships on disk but should never be copied.
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

/** Every `.md` template under `rules/`, `skills/`, `agents/`, as sorted POSIX paths relative to `templatesDir`. */
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

export const FRAGMENT_START = '<!-- @aziontech/webkit:start -->'
export const FRAGMENT_END = '<!-- @aziontech/webkit:end -->'
// Pre-fence marker from older `init` runs; detected only to migrate/repair.
export const LEGACY_MARKER = '<!-- @aziontech/webkit -->'

// The fragment's own heading — excluded from the "next section" boundary check below.
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

function isForeignHeading(line) {
  return /^#{1,2}\s/.test(line) && line.trim() !== FRAGMENT_OWN_HEADING
}

// A legacy block runs from its marker to the next foreign heading, the next marker, or EOF.
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

// Collapses whitespace noise from splicing/removing blocks to: ≤1 blank line between
// sections, a blank line before an abutting heading, one trailing newline. Idempotent.
function normalize(text) {
  return `${text
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/([^\n])\n(#{1,2} )/g, '$1\n\n$2')
    .replace(/\s+$/, '')}\n`
}

/**
 * Splices `body` into `source` as the fenced @aziontech/webkit fragment.
 * Idempotent: splice(splice(source, body), body) === splice(source, body).
 * See docs/toolkit/cli.md for the fenced/legacy/append cases this covers.
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
      const extra = findLegacyBlocks(result)[0]
      if (!extra) break
      result = result.slice(0, extra.start) + result.slice(extra.end)
    }
    return normalize(result)
  }

  const trimmed = source.replace(/\s+$/, '')
  const separator = trimmed ? '\n\n' : ''
  return normalize(`${trimmed}${separator}${fence(body, start, end)}\n`)
}

// --- Provenance marker (webkit sync) -------------------------------------------------
//
// Every bundle file (rule/skill/agent) copied into a consumer's .claude/ carries one
// inert HTML-comment line recording where it came from, at what webkit version, and a
// content hash of its own body:
//
//   <!-- webkit-sync source=claude/rules/webkit-imports.md version=5.0.0 sha256=<16 hex> -->
//
// It is placed at line 1 for a file with no frontmatter, or as the first line after the
// closing `---` of a YAML frontmatter block (skills/agents) — never inside the
// frontmatter itself, so it never becomes a YAML key Claude Code would try to validate.
// `sha256` is the first 16 hex chars of sha256(body), where `body` is the file's content
// with the marker line removed and line endings normalized \r\n -> \n. Comparing that
// hash to a freshly computed one is how `sync` tells a pristine copy from a locally
// edited one without needing a second source of truth.

const MARKER_LINE_RE =
  /^<!-- webkit-sync source=(\S+) version=(\S+) sha256=([0-9a-f]{16}) -->\r?\n?/m

function normalizeNewlines(content) {
  return content.replace(/\r\n/g, '\n')
}

function sha256Short(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex').slice(0, 16)
}

/** Remove the provenance marker line, if present. Normalizes line endings first. */
export function stripMarker(content) {
  return normalizeNewlines(content).replace(MARKER_LINE_RE, '')
}

/** Parse the provenance marker out of `content`, or `null` when there is none. */
export function parseMarker(content) {
  const match = normalizeNewlines(content).match(MARKER_LINE_RE)
  if (!match) return null
  return { source: match[1], version: match[2], sha256: match[3] }
}

/** sha256 (first 16 hex chars) of `content`'s body — the marker line stripped first. */
export function bodyHash(content) {
  return sha256Short(stripMarker(content))
}

/**
 * Stamp `content` with a fresh provenance marker for `source`/`version`, computed over
 * its own body (any existing marker is stripped before hashing/re-inserting). Placement:
 * line 1, or right after a leading YAML frontmatter block's closing `---` line.
 */
export function stamp(content, { source, version }) {
  const body = stripMarker(content)
  const marker = `<!-- webkit-sync source=${source} version=${version} sha256=${sha256Short(body)} -->`
  const frontmatter = body.match(/^---\n[\s\S]*?\n---\n/)
  if (frontmatter) {
    const end = frontmatter[0].length
    return `${body.slice(0, end)}${marker}\n${body.slice(end)}`
  }
  return `${marker}\n${body}`
}

/**
 * Classify a consumer file against its template counterpart. `consumerContent` is `null`
 * when the file does not exist in the consumer yet.
 *
 *  - `missing`              — no consumer file at all.
 *  - `current`               — marker present; consumer body matches its own marker hash,
 *                              and the template's body hashes to the same value.
 *  - `stale`                 — marker present; consumer body still matches its own marker
 *                              hash (untouched since it was stamped), but the template has
 *                              since changed (its body hash differs from the marker).
 *  - `modified`              — marker present; the consumer body no longer hashes to its
 *                              own marker (locally edited after stamping).
 *  - `unstamped-identical`   — no marker; consumer body is byte-identical to the template
 *                              body (e.g. a copy made before sync existed).
 *  - `unstamped-different`   — no marker; consumer body differs from the template body —
 *                              treated the same as `modified` by the sync policy.
 *
 * Note: if a marker's `sha256` is tampered with (edited by hand) while the body stays
 * pristine, the recomputed body hash will no longer equal the (tampered) marker hash, so
 * this is classified as `modified` — the same outcome as a genuine local edit. There is
 * no way to distinguish "someone edited the body" from "someone edited the marker" from
 * content alone, and treating both as `modified` is the safe choice: sync never
 * overwrites either without `--force`.
 */
export function classify(templateContent, consumerContent) {
  const templateHash = bodyHash(templateContent)
  if (consumerContent === null || consumerContent === undefined) return 'missing'

  const marker = parseMarker(consumerContent)
  const consumerBody = stripMarker(consumerContent)
  const consumerHash = sha256Short(consumerBody)

  if (marker) {
    if (consumerHash !== marker.sha256) return 'modified'
    return templateHash === marker.sha256 ? 'current' : 'stale'
  }

  const templateBody = stripMarker(templateContent)
  return consumerBody === templateBody ? 'unstamped-identical' : 'unstamped-different'
}
