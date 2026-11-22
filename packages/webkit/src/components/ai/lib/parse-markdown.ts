import { type MarkdownInline, parseInline } from './parse-inline'

export type { MarkdownInline } from './parse-inline'
export { parseInline, plainText } from './parse-inline'

export type MarkdownBlock =
  | { type: 'paragraph'; children: MarkdownInline[] }
  | { type: 'heading'; level: 3 | 4 | 5 | 6; children: MarkdownInline[] }
  | { type: 'list'; ordered: boolean; start: number; items: MarkdownInline[][] }
  | { type: 'code'; language: string; value: string; closed: boolean }
  | { type: 'quote'; children: MarkdownInline[] }
  | { type: 'table'; header: MarkdownInline[][]; rows: MarkdownInline[][][] }
  | { type: 'rule' }

const FENCE = /^ {0,3}(```|~~~)\s*([\w+#.-]*)\s*$/
const HEADING = /^ {0,3}(#{1,6})\s+(.*?)\s*#*\s*$/
const BULLET = /^ {0,3}[-*+]\s+(.*)$/
const ORDERED = /^ {0,3}(\d{1,9})[.)]\s+(.*)$/
const QUOTE = /^ {0,3}>\s?(.*)$/
const RULE = /^ {0,3}([-*_])(\s*\1){2,}\s*$/
const TABLE_DIVIDER = /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)*\|?\s*$/

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())
}

export interface MarkdownParse {
  source: string
  blocks: MarkdownBlock[]
  starts: number[]
}

const normalizeNewlines = (source: string): string =>
  source.includes('\r') ? source.replace(/\r\n?/g, '\n') : source

export function parseMarkdown(source: string): MarkdownBlock[] {
  return parseBlocks(normalizeNewlines(source).split('\n')).blocks
}

const sameBlock = (a: MarkdownBlock, b: MarkdownBlock): boolean =>
  a.type === b.type && JSON.stringify(a) === JSON.stringify(b)

export function parseMarkdownIncremental(source: string, previous?: MarkdownParse): MarkdownParse {
  const text = normalizeNewlines(source)
  if (previous && previous.source === text) return previous
  const appended = Boolean(previous && text.startsWith(previous.source))
  const keep = previous && appended ? Math.max(0, previous.blocks.length - 2) : 0
  const from = previous && keep > 0 ? (previous.starts[keep] as number) : 0
  const tail = parseBlocks(text.slice(from).split('\n'))
  const blocks = previous ? previous.blocks.slice(0, keep) : []
  const starts = previous ? previous.starts.slice(0, keep) : []
  tail.blocks.forEach((block, j) => {
    const index = keep + j
    const old = previous?.blocks[index]
    blocks.push(old && sameBlock(old, block) ? old : block)
    starts.push(from + (tail.starts[j] as number))
  })
  return { source: text, blocks, starts }
}

interface BlockScan {
  lines: string[]
  i: number
  blocks: MarkdownBlock[]
}

const lineAt = (scan: BlockScan, index = scan.i): string => scan.lines[index] ?? ''

function parseFence(scan: BlockScan): boolean {
  const fence = FENCE.exec(lineAt(scan))
  if (!fence) return false
  const marker = fence[1] ?? ''
  const body: string[] = []
  scan.i += 1
  let closed = false
  while (scan.i < scan.lines.length) {
    const current = lineAt(scan)
    scan.i += 1
    if (current.trim().startsWith(marker)) {
      closed = true
      break
    }
    body.push(current)
  }
  scan.blocks.push({ type: 'code', language: fence[2] || 'text', value: body.join('\n'), closed })
  return true
}

function parseHeading(scan: BlockScan): boolean {
  const heading = HEADING.exec(lineAt(scan))
  if (!heading) return false
  const level = Math.min(6, (heading[1] ?? '').length + 2) as 3 | 4 | 5 | 6
  scan.blocks.push({ type: 'heading', level, children: parseInline(heading[2] ?? '') })
  scan.i += 1
  return true
}

function parseRule(scan: BlockScan): boolean {
  if (!RULE.test(lineAt(scan))) return false
  scan.blocks.push({ type: 'rule' })
  scan.i += 1
  return true
}

function parseTable(scan: BlockScan): boolean {
  const line = lineAt(scan)
  if (!line.includes('|') || !TABLE_DIVIDER.test(lineAt(scan, scan.i + 1))) return false
  const header = splitRow(line).map(parseInline)
  const rows: MarkdownInline[][][] = []
  scan.i += 2
  while (scan.i < scan.lines.length && lineAt(scan).includes('|') && lineAt(scan).trim()) {
    rows.push(splitRow(lineAt(scan)).map(parseInline))
    scan.i += 1
  }
  scan.blocks.push({ type: 'table', header, rows })
  return true
}

function parseQuote(scan: BlockScan): boolean {
  const body: string[] = []
  let match = QUOTE.exec(lineAt(scan))
  if (!match) return false
  while (match && scan.i < scan.lines.length) {
    body.push(match[1] ?? '')
    scan.i += 1
    match = QUOTE.exec(lineAt(scan))
  }
  scan.blocks.push({ type: 'quote', children: parseInline(body.join('\n')) })
  return true
}

function collectListItems(scan: BlockScan, pattern: RegExp, ordered: boolean): string[] {
  const items: string[] = []
  while (scan.i < scan.lines.length) {
    const current = lineAt(scan)
    const match = pattern.exec(current)
    if (match) items.push((ordered ? match[2] : match[1]) ?? '')
    else if (current.trim() && /^\s{2,}/.test(current) && items.length)
      items[items.length - 1] += `\n${current.trim()}`
    else break
    scan.i += 1
  }
  return items
}

function parseList(scan: BlockScan): boolean {
  const line = lineAt(scan)
  const bullet = BULLET.exec(line)
  const ordered = ORDERED.exec(line)
  if (!bullet && !ordered) return false
  const isOrdered = !bullet
  const items = collectListItems(scan, isOrdered ? ORDERED : BULLET, isOrdered)
  scan.blocks.push({
    type: 'list',
    ordered: isOrdered,
    start: isOrdered ? Number(ordered?.[1]) : 1,
    items: items.map(parseInline)
  })
  return true
}

const PARAGRAPH_BREAKS = [FENCE, HEADING, QUOTE, BULLET, ORDERED]

function endsParagraph(current: string, length: number): boolean {
  if (!current.trim()) return true
  if (PARAGRAPH_BREAKS.some((pattern) => pattern.test(current))) return true
  return length > 0 && RULE.test(current)
}

function parseParagraph(scan: BlockScan): boolean {
  const paragraph: string[] = []
  while (scan.i < scan.lines.length && !endsParagraph(lineAt(scan), paragraph.length)) {
    paragraph.push(lineAt(scan))
    scan.i += 1
  }
  scan.blocks.push({ type: 'paragraph', children: parseInline(paragraph.join('\n')) })
  return true
}

const BLOCK_PARSERS = [
  parseFence,
  parseHeading,
  parseRule,
  parseTable,
  parseQuote,
  parseList,
  parseParagraph
]

function lineOffsets(lines: string[]): number[] {
  const offsets: number[] = []
  let offset = 0
  for (const line of lines) {
    offsets.push(offset)
    offset += line.length + 1
  }
  return offsets
}

function parseBlocks(lines: string[]): { blocks: MarkdownBlock[]; starts: number[] } {
  const scan: BlockScan = { lines, i: 0, blocks: [] }
  const starts: number[] = []
  const offsets = lineOffsets(lines)
  while (scan.i < lines.length) {
    if (!lineAt(scan).trim()) {
      scan.i += 1
      continue
    }
    starts[scan.blocks.length] = offsets[scan.i] ?? 0
    BLOCK_PARSERS.some((parse) => parse(scan))
  }
  return { blocks: scan.blocks, starts }
}
