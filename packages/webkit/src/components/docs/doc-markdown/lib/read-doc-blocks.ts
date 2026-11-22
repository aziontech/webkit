import { slugify } from '../../doc-changelog-entry/slugify'
import type { DocMarkdownAlign, DocMarkdownListItem, DocMarkdownNode } from '../parse-doc-markdown'
import { parseAttributes } from './parse-doc-attributes'

const FENCE = /^\s*(```|~~~)(.*)$/
const HEADING = /^(#{1,4})\s+(.+?)\s*#*\s*$/
const LIST_ITEM = /^(\s*)(?:([-*+])|(\d+)[.)])\s+(.*)$/
const BLOCKQUOTE = /^>\s?(.*)$/
const DIVIDER = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/
const TABLE_DELIM = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/
const OPEN_TAG = /^\s*<([A-Z][A-Za-z0-9]*)\b/

export type DocMarkdownReader = {
  blockTags: ReadonlySet<string>
}

type Reader = DocMarkdownReader
type Block = { node?: DocMarkdownNode; next: number }

const dedent = (lines: string[]): string[] => {
  const widths = lines
    .filter((line) => line.trim() !== '')
    .map((line) => (line.match(/^\s*/)?.[0] ?? '').length)
  const indent = widths.length ? Math.min(...widths) : 0
  return lines.map((line) => line.slice(indent))
}

const isBlockTagLine = (reader: Reader, line: string): boolean => {
  const name = line.match(OPEN_TAG)?.[1]
  return Boolean(name) && reader.blockTags.has(name as string)
}

const readTable = (lines: string[], start: number): Block | null => {
  if (!lines[start]?.trim().startsWith('|')) return null
  if (!TABLE_DELIM.test(lines[start + 1] ?? '')) return null
  const cells = (line: string) =>
    line
      .trim()
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((cell) => cell.trim())
  const head = cells(lines[start] as string)
  const align = cells(lines[start + 1] as string).map((rule): DocMarkdownAlign => {
    const left = rule.startsWith(':')
    const right = rule.endsWith(':')
    if (left && right) return 'center'
    return right ? 'end' : 'start'
  })
  const rows: string[][] = []
  let index = start + 2
  while (index < lines.length && (lines[index] as string).trim().startsWith('|')) {
    rows.push(cells(lines[index] as string))
    index += 1
  }
  return { node: { type: 'table', head, align, rows }, next: index }
}

const listItemOf = (line: string) => {
  const match = line.match(LIST_ITEM)
  if (!match) return null
  return { indent: (match[1] ?? '').length, ordered: Boolean(match[3]), text: match[4] ?? '' }
}

const readList = (lines: string[], start: number): Block & { node: DocMarkdownNode } => {
  const { indent: baseIndent, ordered } = listItemOf(lines[start] as string) ?? {
    indent: 0,
    ordered: false
  }
  const items: DocMarkdownListItem[] = []
  let index = start
  while (index < lines.length) {
    const line = lines[index] as string
    if (line.trim() === '') {
      if (!LIST_ITEM.test(lines[index + 1] ?? '')) break
      index += 1
      continue
    }
    const item = listItemOf(line)
    if (!item || item.ordered !== ordered || item.indent < baseIndent) break
    if (item.indent > baseIndent) {
      const nested = readList(lines, index)
      items[items.length - 1]?.children.push(nested.node)
      index = nested.next
      continue
    }
    items.push({ text: item.text, children: [] })
    index += 1
  }
  return { node: { type: 'list', ordered, items }, next: index }
}

const readTagHeader = (name: string, lines: string[], start: number) => {
  const tagPattern = new RegExp(`^\\s*<${name}\\b((?:"[^"]*"|'[^']*'|[^>"'])*?)(\\/?)>`)
  let header = lines[start] as string
  let index = start
  while (!tagPattern.test(header) && index + 1 < lines.length) {
    index += 1
    header = `${header} ${(lines[index] as string).trim()}`
  }
  const tag = header.match(tagPattern)
  return tag ? { tag, trailing: header.slice(tag[0].length), index } : null
}

const readTagBody = (name: string, lines: string[], from: number, trailing: string) => {
  const open = new RegExp(`<${name}\\b`, 'g')
  const close = new RegExp(`</${name}>`, 'g')
  const selfClose = new RegExp(`<${name}\\b(?:"[^"]*"|'[^']*'|[^>"'])*?/>`, 'g')
  let depth = 1
  const inner = trailing.trim() === '' ? [] : [trailing]
  let cursor = from
  while (cursor < lines.length) {
    const line = lines[cursor] as string
    const opens = (line.match(open) ?? []).length - (line.match(selfClose) ?? []).length
    depth += opens - (line.match(close) ?? []).length
    cursor += 1
    if (depth <= 0) {
      const before = line.slice(0, line.lastIndexOf(`</${name}>`))
      if (before.trim() !== '') inner.push(before)
      break
    }
    inner.push(line)
  }
  return { inner, cursor }
}

const readComponent = (reader: Reader, lines: string[], start: number): Block | null => {
  const name = (lines[start] as string).match(OPEN_TAG)?.[1]
  if (!name || !reader.blockTags.has(name)) return null
  const header = readTagHeader(name, lines, start)
  if (!header) return null
  const { tag, trailing, index } = header
  const props = parseAttributes(tag[1] ?? '')
  const component = (children: DocMarkdownNode[]): DocMarkdownNode => ({
    type: 'component',
    name,
    props,
    children
  })
  if (tag[2] === '/') return { node: component([]), next: index + 1 }
  const sameLineClose = trailing.lastIndexOf(`</${name}>`)
  if (sameLineClose !== -1) {
    const body = trailing.slice(0, sameLineClose)
    return {
      node: component(body.trim() === '' ? [] : parseBlocks(reader, dedent([body]))),
      next: index + 1
    }
  }
  const { inner, cursor } = readTagBody(name, lines, index + 1, trailing)
  return { node: component(parseBlocks(reader, dedent(inner))), next: cursor }
}

const readFence = (lines: string[], start: number): Block | null => {
  const fence = (lines[start] as string).match(FENCE)
  if (!fence) return null
  const marker = fence[1] as string
  const info = (fence[2] ?? '').trim()
  const lang = info.split(/\s+/)[0] ?? ''
  const code: string[] = []
  let index = start + 1
  while (index < lines.length && !(lines[index] as string).trim().startsWith(marker)) {
    code.push(lines[index] as string)
    index += 1
  }
  const meta = parseAttributes(info.slice(lang.length))
  return { node: { type: 'code', lang, meta, code: code.join('\n') }, next: index + 1 }
}

const readHeading = (line: string, start: number): Block | null => {
  const heading = line.match(HEADING)
  if (!heading) return null
  const text = heading[2] as string
  const depth = (heading[1] as string).length as 1 | 2 | 3 | 4
  return { node: { type: 'heading', depth, text, id: slugify(text) }, next: start + 1 }
}

const readBlockquote = (reader: Reader, lines: string[], start: number): Block => {
  const quoted: string[] = []
  let index = start
  while (index < lines.length && BLOCKQUOTE.test(lines[index] as string)) {
    quoted.push(((lines[index] as string).match(BLOCKQUOTE) as RegExpMatchArray)[1] ?? '')
    index += 1
  }
  return { node: { type: 'blockquote', children: parseBlocks(reader, quoted) }, next: index }
}

const endsParagraph = (reader: Reader, line: string): boolean =>
  line.trim() === '' ||
  HEADING.test(line) ||
  FENCE.test(line) ||
  DIVIDER.test(line) ||
  LIST_ITEM.test(line) ||
  BLOCKQUOTE.test(line) ||
  isBlockTagLine(reader, line)

const readParagraph = (reader: Reader, lines: string[], start: number): Block => {
  const paragraph: string[] = []
  let index = start
  while (index < lines.length && !endsParagraph(reader, lines[index] as string)) {
    paragraph.push((lines[index] as string).trim())
    index += 1
  }
  if (!paragraph.length) return { next: index + 1 }
  return { node: { type: 'paragraph', text: paragraph.join(' ') }, next: index }
}

const readBlock = (reader: Reader, lines: string[], index: number): Block => {
  const line = lines[index] as string
  return (
    readFence(lines, index) ??
    (isBlockTagLine(reader, line) ? readComponent(reader, lines, index) : null) ??
    readHeading(line, index) ??
    (DIVIDER.test(line) ? { node: { type: 'divider' }, next: index + 1 } : null) ??
    readTable(lines, index) ??
    (LIST_ITEM.test(line) ? readList(lines, index) : null) ??
    (BLOCKQUOTE.test(line) ? readBlockquote(reader, lines, index) : null) ??
    readParagraph(reader, lines, index)
  )
}

export const parseBlocks = (reader: Reader, lines: string[]): DocMarkdownNode[] => {
  const nodes: DocMarkdownNode[] = []
  let index = 0
  while (index < lines.length) {
    if ((lines[index] as string).trim() === '') {
      index += 1
      continue
    }
    const block = readBlock(reader, lines, index)
    if (block.node) nodes.push(block.node)
    index = block.next
  }
  return nodes
}
