// Derives the Claude Code bundle from cli-templates and fences the CLAUDE.md fragment.
// See docs/toolkit/cli.md for why (drift-proof bundle, in-place fragment updates,
// legacy-marker migration/repair).

import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'
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

function toPosix(path) {
  return sep === '/' ? path : path.split(sep).join('/')
}

function listDir(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true })
  } catch {
    return []
  }
}

// The bundle has a fixed shape; a template outside it (a skill's references/) is not
// shipped. bundle.test.mjs fails when the templates dir grows past this shape.
function flatMarkdown(dir) {
  return listDir(dir)
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => e.name)
}

function skillFiles(dir) {
  return listDir(dir)
    .filter((e) => e.isDirectory() && existsSync(join(dir, e.name, 'SKILL.md')))
    .map((e) => `${e.name}/SKILL.md`)
}

/** `rules/*.md`, `agents/*.md` and `skills/*\/SKILL.md`, as sorted POSIX paths relative to `templatesDir`. */
export function listBundle(templatesDir = CLAUDE_TEMPLATES) {
  const rels = [
    ...flatMarkdown(join(templatesDir, 'rules')).map((name) => `rules/${name}`),
    ...skillFiles(join(templatesDir, 'skills')).map((rel) => `skills/${rel}`),
    ...flatMarkdown(join(templatesDir, 'agents')).map((name) => `agents/${name}`)
  ]
  return rels.map(toPosix).sort()
}

// --- CLAUDE.md fragment fencing ------------------------------------------------------

export const FRAGMENT_START = '<!-- @aziontech/webkit:start -->'
export const FRAGMENT_END = '<!-- @aziontech/webkit:end -->'
// Pre-fence marker from older `init` runs; detected only to migrate/repair.
export const LEGACY_MARKER = '<!-- @aziontech/webkit -->'

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

const HEADING_RE = /^#{1,2}\s/

function headingsOf(text) {
  return new Set(
    text
      .split('\n')
      .filter((line) => HEADING_RE.test(line))
      .map((line) => line.trim())
  )
}

// A legacy block runs from its marker to the next foreign heading, the next marker, or EOF.
// Own (not foreign): the heading right after the marker, and any heading in `body`.
function findLegacyBlocks(source, body = '') {
  const ownHeadings = headingsOf(body)
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
    let firstLine = true
    while (cursor < source.length) {
      if (nextMarker !== undefined && cursor > nextMarker) break
      const lineEnd = source.indexOf('\n', cursor)
      const line = source.slice(cursor, lineEnd === -1 ? source.length : lineEnd)
      const isHeading = HEADING_RE.test(line)
      if (isHeading && !firstLine && !ownHeadings.has(line.trim())) {
        end = cursor
        break
      }
      if (line.trim() !== '') firstLine = false
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

  const legacy = findLegacyBlocks(source, body)
  if (legacy.length) {
    let result =
      source.slice(0, legacy[0].start) +
      fence(body, start, end) +
      '\n' +
      source.slice(legacy[0].end)
    for (let i = 1; i < legacy.length; i += 1) {
      const extra = findLegacyBlocks(result, body)[0]
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
// One inert HTML-comment line stamped into every copied bundle file: source, webkit
// version, and a content hash of its own body. See docs/toolkit/cli.md ("sync") for
// the marker format, placement rule, and how `sync` uses it to classify a file.

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
 * Classify a consumer file against its template counterpart (`consumerContent` is `null`
 * when it doesn't exist yet). States and their policy: docs/toolkit/cli.md ("sync").
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
