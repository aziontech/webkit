import { type MarkdownInline, parseInline } from './parse-inline'

export type { MarkdownInline } from './parse-inline'
export { parseInline, plainText } from './parse-inline'

export interface MarkdownListItem {
  children: MarkdownInline[]
  list?: MarkdownList
}

export interface MarkdownList {
  type: 'list'
  ordered: boolean
  start: number
  items: MarkdownListItem[]
}

export type MarkdownBlock =
  | { type: 'paragraph'; children: MarkdownInline[] }
  | { type: 'heading'; level: 3 | 4 | 5 | 6; children: MarkdownInline[] }
  | MarkdownList
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

const indentOf = (line: string): number => line.length - line.trimStart().length

interface ListMarker {
  ordered: boolean
  start: number
  text: string
}

function listMarker(line: string): ListMarker | null {
  const trimmed = line.trimStart()
  const bullet = BULLET.exec(trimmed)
  if (bullet) return { ordered: false, start: 1, text: bullet[1] ?? '' }
  const ordered = ORDERED.exec(trimmed)
  return ordered ? { ordered: true, start: Number(ordered[1]), text: ordered[2] ?? '' } : null
}

interface ListDraft {
  text: string
  nested: string[]
}

function lineAt(source: string[], at: number): string {
  return source[at] ?? ''
}

function buildList(source: string[], from: number): { list: MarkdownList; end: number } {
  const first = listMarker(lineAt(source, from)) ?? { ordered: false, start: 1, text: '' }
  const base = indentOf(lineAt(source, from))
  const drafts: ListDraft[] = []
  let at = from
  while (at < source.length) {
    const current = lineAt(source, at)
    const indent = indentOf(current)
    const marker = listMarker(current)
    const last = drafts[drafts.length - 1]
    if (marker && indent <= base + 1) {
      if (marker.ordered !== first.ordered) break
      drafts.push({ text: marker.text, nested: [] })
    } else if (current.trim() && indent > base && last) {
      if (last.nested.length || marker) last.nested.push(current)
      else last.text += `\n${current.trim()}`
    } else break
    at += 1
  }
  const items = drafts.map<MarkdownListItem>((draft) => {
    const item: MarkdownListItem = { children: parseInline(draft.text) }
    if (draft.nested.length && listMarker(lineAt(draft.nested, 0)))
      item.list = buildList(draft.nested, 0).list
    return item
  })
  return { list: { type: 'list', ordered: first.ordered, start: first.start, items }, end: at }
}

function parseList(line: string): boolean {
  if (!BULLET.test(line) && !ORDERED.test(line)) return false
  const { list, end } = buildList(lines, row)
  blocks.push(list)
  row = end
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
