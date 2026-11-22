import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PACKAGE_ROOT = join(__dirname, '../..')
const REPO_ROOT = join(PACKAGE_ROOT, '../..')
function resolveTemplatesRoot() {
  return existsSync(join(PACKAGE_ROOT, 'skills')) && existsSync(join(PACKAGE_ROOT, 'rules'))
    ? PACKAGE_ROOT
    : REPO_ROOT
}

export const AI_TEMPLATES = resolveTemplatesRoot()

export function agentsDir(templatesDir = AI_TEMPLATES) {
  return join(templatesDir, 'adapters/claude/agents')
}

export function fragmentFile(templatesDir = AI_TEMPLATES) {
  return join(templatesDir, 'adapters/AGENTS_FRAGMENT.md')
}

export function templateFile(templatesDir, rel) {
  if (rel.startsWith('agents/')) return join(agentsDir(templatesDir), rel.slice('agents/'.length))
  return join(templatesDir, rel)
}

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

export function listBundle(templatesDir = AI_TEMPLATES) {
  const rels = [
    ...flatMarkdown(join(templatesDir, 'rules')).map((name) => `rules/${name}`),
    ...skillFiles(join(templatesDir, 'skills')).map((rel) => `skills/${rel}`),
    ...flatMarkdown(agentsDir(templatesDir)).map((name) => `agents/${name}`)
  ]
  return rels.map(toPosix).sort()
}

export const FRAGMENT_START = '<!-- @aziontech/webkit:start -->'
export const FRAGMENT_END = '<!-- @aziontech/webkit:end -->'
export const LEGACY_MARKER = '<!-- @aziontech/webkit -->'

function findFencedBlocks(source, startMarker, endMarker) {
  const blocks = []
  let searchFrom = 0
  for (;;) {
    const start = source.indexOf(startMarker, searchFrom)
    if (start === -1) break
    const end = source.indexOf(endMarker, start)
    if (end === -1) break
    const nextStart = source.indexOf(startMarker, start + startMarker.length)
    if (nextStart !== -1 && nextStart < end) {
      searchFrom = nextStart
      continue
    }
    const endLineEnd = source.indexOf('\n', end)
    blocks.push({ start, end: endLineEnd === -1 ? source.length : endLineEnd + 1 })
    searchFrom = blocks[blocks.length - 1].end
  }
  return blocks
}

function markerIndexesOf(source, marker) {
  const indexes = []
  let searchFrom = 0
  for (;;) {
    const idx = source.indexOf(marker, searchFrom)
    if (idx === -1) break
    indexes.push(idx)
    searchFrom = idx + marker.length
  }
  return indexes
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

function blocksFromMarkers(source, body, markerIndexes, boundaries = markerIndexes) {
  const ownHeadings = headingsOf(body)
  const blocks = []
  for (const start of markerIndexes) {
    const nextMarker = boundaries.find((idx) => idx > start)
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

function findLegacyBlocks(source, body = '') {
  return blocksFromMarkers(source, body, markerIndexesOf(source, LEGACY_MARKER))
}

function findLoneStartBlocks(source, body, startMarker, endMarker) {
  const starts = markerIndexesOf(source, startMarker)
  const fenced = findFencedBlocks(source, startMarker, endMarker).map((block) => block.start)
  const lone = starts.filter((idx) => !fenced.includes(idx))
  const boundaries = [...starts, ...markerIndexesOf(source, endMarker)].sort((a, b) => a - b)
  return blocksFromMarkers(source, body, lone, boundaries)
}

function replaceLoneStarts(source, body, start, end) {
  const lone = findLoneStartBlocks(source, body, start, end)
  if (!lone.length) return source
  const keepFirst = findFencedBlocks(source, start, end).length === 0
  let result = source
  for (let i = lone.length - 1; i >= 0; i -= 1) {
    const replacement = i === 0 && keepFirst ? `${fence(body, start, end)}\n` : ''
    result = result.slice(0, lone[i].start) + replacement + result.slice(lone[i].end)
  }
  return result
}

function fence(body, startMarker, endMarker) {
  return `${startMarker}\n${body}\n${endMarker}`
}

function normalize(text) {
  return `${text
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/([^\n])\n(#{1,2} )/g, '$1\n\n$2')
    .replace(/\s+$/, '')}\n`
}

export function spliceFragment(input, body, { start = FRAGMENT_START, end = FRAGMENT_END } = {}) {
  const source = replaceLoneStarts(input, body, start, end)
  const fenced = findFencedBlocks(source, start, end)
  if (fenced.length) {
    let result =
      source.slice(0, fenced[0].start) +
      fence(body, start, end) +
      '\n' +
      source.slice(fenced[0].end)
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

const MARKER_LINE_RE =
  /^<!-- webkit-sync source=(\S+) version=(\S+) sha256=([0-9a-f]{16}) -->\r?\n?/m

function normalizeNewlines(content) {
  return content.replace(/\r\n/g, '\n')
}

function sha256Short(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex').slice(0, 16)
}

export function stripMarker(content) {
  return normalizeNewlines(content).replace(MARKER_LINE_RE, '')
}

export function parseMarker(content) {
  const match = normalizeNewlines(content).match(MARKER_LINE_RE)
  if (!match) return null
  return { source: match[1], version: match[2], sha256: match[3] }
}

export function bodyHash(content) {
  return sha256Short(stripMarker(content))
}

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
