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

let lines: string[] = []
let row = 0
let blocks: MarkdownBlock[] = []

function parseFence(line: string): boolean {
  const fence = FENCE.exec(line)
  if (!fence) return false
  const marker = fence[1] as string
  const body: string[] = []
  let closed = false
  while (++row < lines.length) {
    const current = lines[row] as string
    if (current.trim().startsWith(marker)) {
      closed = true
      row += 1
      break
    }
    body.push(current)
  }
  blocks.push({ type: 'code', language: fence[2] || 'text', value: body.join('\n'), closed })
  return true
}

function parseHeading(line: string): boolean {
  const heading = HEADING.exec(line)
  if (heading) {
    const level = Math.min(6, (heading[1] as string).length + 2) as 3 | 4 | 5 | 6
    blocks.push({ type: 'heading', level, children: parseInline(heading[2] as string) })
  } else if (RULE.test(line)) blocks.push({ type: 'rule' })
  else return false
  row += 1
  return true
}

function parseTable(line: string): boolean {
  if (!line.includes('|') || !TABLE_DIVIDER.test(lines[row + 1] ?? '')) return false
  const header = splitRow(line).map(parseInline)
  const rows: MarkdownInline[][][] = []
  row += 2
  while (
    row < lines.length &&
    (lines[row] as string).includes('|') &&
    (lines[row] as string).trim()
  ) {
    rows.push(splitRow(lines[row] as string).map(parseInline))
    row += 1
  }
  blocks.push({ type: 'table', header, rows })
  return true
}

function parseQuote(line: string): boolean {
  if (!QUOTE.test(line)) return false
  const body: string[] = []
  while (row < lines.length && QUOTE.test(lines[row] as string)) {
    body.push((QUOTE.exec(lines[row] as string) as RegExpExecArray)[1] as string)
    row += 1
  }
  blocks.push({ type: 'quote', children: parseInline(body.join('\n')) })
  return true
}

function parseList(line: string): boolean {
  const bullet = BULLET.exec(line)
  const ordered = ORDERED.exec(line)
  if (!bullet && !ordered) return false
  const isOrdered = !bullet
  const pattern = isOrdered ? ORDERED : BULLET
  const items: string[] = []
  while (row < lines.length) {
    const current = lines[row] as string
    const match = pattern.exec(current)
    if (match) items.push((isOrdered ? match[2] : match[1]) as string)
    else if (current.trim() && /^\s{2,}/.test(current) && items.length)
      items[items.length - 1] += `\n${current.trim()}`
    else break
    row += 1
  }
  blocks.push({
    type: 'list',
    ordered: isOrdered,
    start: isOrdered ? Number((ordered as RegExpExecArray)[1]) : 1,
    items: items.map(parseInline)
  })
  return true
}

const PARAGRAPH_BREAKS = [FENCE, HEADING, QUOTE, BULLET, ORDERED]

function parseParagraph(): void {
  const paragraph: string[] = []
  while (row < lines.length) {
    const current = lines[row] as string
    if (
      !current.trim() ||
      PARAGRAPH_BREAKS.some((pattern) => pattern.test(current)) ||
      (paragraph.length > 0 && RULE.test(current))
    )
      break
    paragraph.push(current)
    row += 1
  }
  blocks.push({ type: 'paragraph', children: parseInline(paragraph.join('\n')) })
}

function parseBlocks(source: string[]): { blocks: MarkdownBlock[]; starts: number[] } {
  const starts: number[] = []
  const offsets: number[] = []
  let offset = 0
  for (const line of source) {
    offsets.push(offset)
    offset += line.length + 1
  }
  lines = source
  row = 0
  blocks = []
  while (row < lines.length) {
    const line = lines[row] as string
    if (!line.trim()) row += 1
    else {
      starts[blocks.length] = offsets[row] as number
      if (!(
        parseFence(line) ||
        parseHeading(line) ||
        parseTable(line) ||
        parseQuote(line) ||
        parseList(line)
      ))
        parseParagraph()
    }
  }
  const result = { blocks, starts }
  lines = []
  blocks = []
  return result
}
