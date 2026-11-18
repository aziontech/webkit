import { type MarkdownInline, parseInline, plainText } from '../../ai/lib/parse-markdown'
import { slugify } from '../doc-changelog-entry/slugify'

/** A JSON value inside a braced MDX attribute. */
export type DocMarkdownData =
  string | number | boolean | null | DocMarkdownData[] | { [key: string]: DocMarkdownData }

/** An attribute value an MDX tag may carry. */
export type DocMarkdownValue =
  string | number | boolean | DocMarkdownData[] | { [key: string]: DocMarkdownData }

/** The attributes of one MDX tag, keyed by name. */
export type DocMarkdownAttributes = Record<string, DocMarkdownValue>

/** One heading of the page, in the shape `DocTableOfContents` takes. */
export type DocMarkdownHeading = {
  /** The heading's anchor id. */
  id: string
  /** The heading's plain text. */
  text: string
  /** Heading level, 2 or 3. */
  depth: number
}

/** What `parseDocMarkdown` returns. */
export type DocMarkdownParsed = {
  /** The frontmatter's `key: value` pairs. */
  frontmatter: Record<string, string>
  /** The page's level 2 and 3 headings and changelog entries, in document order. */
  headings: DocMarkdownHeading[]
}

/** A token inside a sentence: Markdown inline markup or an inline MDX tag. */
export type DocMarkdownInline =
  | MarkdownInline
  | { type: 'component'; name: string; props: DocMarkdownAttributes; children: MarkdownInline[] }

/** One list item. */
export type DocMarkdownListItem = { text: string; children: DocMarkdownNode[] }

/** A table column's alignment. */
export type DocMarkdownAlign = 'start' | 'center' | 'end'

/** One block of the parsed page. */
export type DocMarkdownNode =
  | { type: 'heading'; depth: 1 | 2 | 3 | 4; text: string; id: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: DocMarkdownListItem[] }
  | { type: 'code'; lang: string; meta: DocMarkdownAttributes; code: string }
  | { type: 'table'; head: string[]; align: DocMarkdownAlign[]; rows: string[][] }
  | { type: 'blockquote'; children: DocMarkdownNode[] }
  | { type: 'divider' }
  | { type: 'component'; name: string; props: DocMarkdownAttributes; children: DocMarkdownNode[] }

export const DOC_MARKDOWN_BLOCK_TAGS: readonly string[] = [
  'Note',
  'Info',
  'Tip',
  'Check',
  'Warning',
  'Danger',
  'Steps',
  'Step',
  'CardGroup',
  'Columns',
  'Card',
  'ItemGroup',
  'Item',
  'AccordionGroup',
  'Accordion',
  'Tabs',
  'Tab',
  'CodeGroup',
  'Frame',
  'Prompt',
  'Update',
  'AgentCard',
  'CallToAction',
  'FlowDiagram',
  'Carousel',
  'CarouselItem',
  'ConsoleMockup',
  'Diagram',
  'Embed',
  'Faq',
  'Illustration',
  'IntegrationCard',
  'NetworkMap',
  'PlanFeatureList',
  'PricingCard',
  'Quote',
  'Stats',
  'ThirdPartyLogo',
  'BarList',
  'Chart',
  'ChartArea',
  'ChartAxis',
  'ChartBar',
  'ChartCrosshair',
  'ChartGrid',
  'ChartLegend',
  'ChartLine',
  'ChartReference',
  'ChartScatter',
  'ChartTooltip',
  'DonutChart',
  'GaugeChart',
  'KeyValueList',
  'KeyValueListGroup',
  'KeyValueListItem',
  'MapChart',
  'SparkChart',
  'StatTileGroup',
  'StatTile',
  'Tracker'
]

export const DOC_MARKDOWN_INLINE_TAGS: readonly string[] = ['Tooltip']

const FENCE = /^\s*(```|~~~)(.*)$/
const HEADING = /^(#{1,4})\s+(.+?)\s*#*\s*$/
const LIST_ITEM = /^(\s*)(?:([-*+])|(\d+)[.)])\s+(.*)$/
const BLOCKQUOTE = /^>\s?(.*)$/
const DIVIDER = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/
const TABLE_DELIM = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/
const OPEN_TAG = /^\s*<([A-Z][A-Za-z0-9]*)\b/
const INLINE_TAG = /<([A-Z][A-Za-z0-9]*)\b((?:"[^"]*"|'[^']*'|[^>"'])*?)(?:\/>|>([\s\S]*?)<\/\1>)/g
const ATTRIBUTE_NAME = /[A-Za-z][A-Za-z0-9-]*/y

const parseList = (raw: string): string[] =>
  raw
    .slice(1, -1)
    .split(',')
    .map((entry) => entry.trim().replace(/^['"]|['"]$/g, ''))
    .filter((entry) => entry !== '')

const relaxedJson = (raw: string): string =>
  raw
    .replace(/'((?:[^'\\]|\\.)*)'/g, (_, inner: string) =>
      JSON.stringify(inner.replace(/\\'/g, "'"))
    )
    .replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":')
    .replace(/,\s*([}\]])/g, '$1')

const parseData = (raw: string): DocMarkdownData | undefined => {
  for (const candidate of [raw, relaxedJson(raw)]) {
    try {
      return JSON.parse(candidate) as DocMarkdownData
    } catch {
      continue
    }
  }
  return undefined
}

const braceValue = (raw: string): DocMarkdownValue => {
  const value = raw.trim()
  if (value === 'true' || value === 'false') return value === 'true'
  if (value !== '' && !Number.isNaN(Number(value))) return Number(value)
  if (value.startsWith('{') || value.startsWith('[')) {
    const data = parseData(value)
    if (Array.isArray(data) || (data !== null && typeof data === 'object')) return data
    if (value.startsWith('[') && value.endsWith(']')) return parseList(value)
  }
  return value.replace(/^['"]|['"]$/g, '')
}

const closingBrace = (raw: string, open: number): number => {
  let depth = 0
  let quote = ''
  for (let index = open; index < raw.length; index += 1) {
    const char = raw[index] as string
    if (quote) {
      if (char === '\\') index += 1
      else if (char === quote) quote = ''
      continue
    }
    if (char === '"' || char === "'" || char === '`') quote = char
    else if (char === '{') depth += 1
    else if (char === '}') {
      depth -= 1
      if (depth === 0) return index
    }
  }
  return raw.length
}

export const parseAttributes = (raw: string): DocMarkdownAttributes => {
  const props: DocMarkdownAttributes = {}
  let index = 0
  while (index < raw.length) {
    ATTRIBUTE_NAME.lastIndex = index
    const name = ATTRIBUTE_NAME.exec(raw)?.[0]
    if (!name) {
      index += 1
      continue
    }
    index += name.length
    const rest = raw.slice(index).match(/^\s*=\s*/)
    if (!rest) {
      props[name] = true
      continue
    }
    index += rest[0].length
    const quote = raw[index]
    if (quote === '"' || quote === "'") {
      const end = raw.indexOf(quote, index + 1)
      const stop = end === -1 ? raw.length : end
      props[name] = raw.slice(index + 1, stop)
      index = stop + 1
    } else if (quote === '{') {
      const end = closingBrace(raw, index)
      props[name] = braceValue(raw.slice(index + 1, end))
      index = end + 1
    } else props[name] = true
  }
  return props
}

const dedent = (lines: string[]): string[] => {
  const widths = lines
    .filter((line) => line.trim() !== '')
    .map((line) => (line.match(/^\s*/)?.[0] ?? '').length)
  const indent = widths.length ? Math.min(...widths) : 0
  return lines.map((line) => line.slice(indent))
}

const splitFrontmatter = (
  source: string
): { frontmatter: Record<string, string>; body: string } => {
  const normalized = source.replace(/\r\n?/g, '\n')
  if (!normalized.startsWith('---\n')) return { frontmatter: {}, body: normalized }
  const end = normalized.indexOf('\n---', 3)
  if (end === -1) return { frontmatter: {}, body: normalized }
  const frontmatter: Record<string, string> = {}
  for (const line of normalized.slice(4, end).split('\n')) {
    const pair = line.match(/^([A-Za-z][\w-]*)\s*:\s*(.*)$/)
    if (pair?.[1]) frontmatter[pair[1]] = (pair[2] ?? '').trim().replace(/^["']|["']$/g, '')
  }
  return { frontmatter, body: normalized.slice(end + 4).replace(/^\n/, '') }
}

export const parseDocInline = (
  text: string,
  inlineTags: readonly string[] = DOC_MARKDOWN_INLINE_TAGS
): DocMarkdownInline[] => {
  const tokens: DocMarkdownInline[] = []
  let last = 0
  for (const match of text.matchAll(INLINE_TAG)) {
    const [raw, name, attributes, inner] = match
    if (!name || !inlineTags.includes(name)) continue
    const start = match.index ?? 0
    if (start > last) tokens.push(...parseInline(text.slice(last, start)))
    tokens.push({
      type: 'component',
      name,
      props: parseAttributes(attributes ?? ''),
      children: parseInline(inner ?? '')
    })
    last = start + raw.length
  }
  if (last < text.length) tokens.push(...parseInline(text.slice(last)))
  return tokens
}

type Reader = {
  blockTags: ReadonlySet<string>
}

const isBlockTagLine = (reader: Reader, line: string): boolean => {
  const name = line.match(OPEN_TAG)?.[1]
  return Boolean(name) && reader.blockTags.has(name as string)
}

const readTable = (
  lines: string[],
  start: number
): { node: DocMarkdownNode; next: number } | null => {
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

const readList = (lines: string[], start: number): { node: DocMarkdownNode; next: number } => {
  const first = (lines[start] as string).match(LIST_ITEM) as RegExpMatchArray
  const baseIndent = (first[1] ?? '').length
  const ordered = Boolean(first[3])
  const items: DocMarkdownListItem[] = []
  let index = start
  while (index < lines.length) {
    const line = lines[index] as string
    if (line.trim() === '') {
      const upcoming = lines[index + 1]
      if (!upcoming || !LIST_ITEM.test(upcoming)) break
      index += 1
      continue
    }
    const match = line.match(LIST_ITEM)
    if (!match || Boolean(match[3]) !== ordered) break
    const indent = (match[1] ?? '').length
    if (indent < baseIndent) break
    if (indent > baseIndent) {
      const nested = readList(lines, index)
      items[items.length - 1]?.children.push(nested.node)
      index = nested.next
      continue
    }
    items.push({ text: match[4] ?? '', children: [] })
    index += 1
  }
  return { node: { type: 'list', ordered, items }, next: index }
}

const readComponent = (
  reader: Reader,
  lines: string[],
  start: number
): { node: DocMarkdownNode; next: number } | null => {
  const name = (lines[start] as string).match(OPEN_TAG)?.[1]
  if (!name || !reader.blockTags.has(name)) return null
  const tagPattern = new RegExp(`^\\s*<${name}\\b((?:"[^"]*"|'[^']*'|[^>"'])*?)(\\/?)>`)
  let header = lines[start] as string
  let index = start
  while (!tagPattern.test(header) && index + 1 < lines.length) {
    index += 1
    header = `${header} ${(lines[index] as string).trim()}`
  }
  const tag = header.match(tagPattern)
  if (!tag) return null
  const props = parseAttributes(tag[1] ?? '')
  if (tag[2] === '/') {
    return { node: { type: 'component', name, props, children: [] }, next: index + 1 }
  }
  const trailing = header.slice(tag[0].length)
  const sameLineClose = trailing.lastIndexOf(`</${name}>`)
  if (sameLineClose !== -1) {
    const body = trailing.slice(0, sameLineClose)
    return {
      node: {
        type: 'component',
        name,
        props,
        children: body.trim() === '' ? [] : parseBlocks(reader, dedent([body]))
      },
      next: index + 1
    }
  }
  const open = new RegExp(`<${name}\\b`, 'g')
  const close = new RegExp(`</${name}>`, 'g')
  const selfClose = new RegExp(`<${name}\\b(?:"[^"]*"|'[^']*'|[^>"'])*?/>`, 'g')
  let depth = 1
  const inner = trailing.trim() === '' ? [] : [trailing]
  let cursor = index + 1
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
  return {
    node: { type: 'component', name, props, children: parseBlocks(reader, dedent(inner)) },
    next: cursor
  }
}

const parseBlocks = (reader: Reader, lines: string[]): DocMarkdownNode[] => {
  const nodes: DocMarkdownNode[] = []
  let index = 0
  while (index < lines.length) {
    const line = lines[index] as string
    if (line.trim() === '') {
      index += 1
      continue
    }
    const fence = line.match(FENCE)
    if (fence) {
      const marker = fence[1] as string
      const info = (fence[2] ?? '').trim()
      const lang = info.split(/\s+/)[0] ?? ''
      const code: string[] = []
      index += 1
      while (index < lines.length && !(lines[index] as string).trim().startsWith(marker)) {
        code.push(lines[index] as string)
        index += 1
      }
      index += 1
      nodes.push({
        type: 'code',
        lang,
        meta: parseAttributes(info.slice(lang.length)),
        code: code.join('\n')
      })
      continue
    }
    if (isBlockTagLine(reader, line)) {
      const component = readComponent(reader, lines, index)
      if (component) {
        nodes.push(component.node)
        index = component.next
        continue
      }
    }
    const heading = line.match(HEADING)
    if (heading) {
      const text = heading[2] as string
      const depth = (heading[1] as string).length as 1 | 2 | 3 | 4
      nodes.push({ type: 'heading', depth, text, id: slugify(text) })
      index += 1
      continue
    }
    if (DIVIDER.test(line)) {
      nodes.push({ type: 'divider' })
      index += 1
      continue
    }
    const table = readTable(lines, index)
    if (table) {
      nodes.push(table.node)
      index = table.next
      continue
    }
    if (LIST_ITEM.test(line)) {
      const list = readList(lines, index)
      nodes.push(list.node)
      index = list.next
      continue
    }
    if (BLOCKQUOTE.test(line)) {
      const quoted: string[] = []
      while (index < lines.length && BLOCKQUOTE.test(lines[index] as string)) {
        quoted.push(((lines[index] as string).match(BLOCKQUOTE) as RegExpMatchArray)[1] ?? '')
        index += 1
      }
      nodes.push({ type: 'blockquote', children: parseBlocks(reader, quoted) })
      continue
    }
    const paragraph: string[] = []
    while (index < lines.length) {
      const current = lines[index] as string
      if (
        current.trim() === '' ||
        HEADING.test(current) ||
        FENCE.test(current) ||
        DIVIDER.test(current) ||
        LIST_ITEM.test(current) ||
        BLOCKQUOTE.test(current) ||
        isBlockTagLine(reader, current)
      )
        break
      paragraph.push(current.trim())
      index += 1
    }
    if (paragraph.length) nodes.push({ type: 'paragraph', text: paragraph.join(' ') })
    else index += 1
  }
  return nodes
}

const updateAnchor = (props: DocMarkdownAttributes): string => {
  const label = String(props['label'] ?? '')
  const title = String(props['title'] ?? '')
  const anchor = props['anchor']
  return anchor ? String(anchor) : slugify(title ? `${label} ${title}` : label)
}

const dedupeIds = (nodes: DocMarkdownNode[], seen: Map<string, number>): void => {
  const claim = (base: string) => {
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    return count > 0 ? `${base}-${count + 1}` : base
  }
  for (const node of nodes) {
    if (node.type === 'heading' && node.id) node.id = claim(node.id)
    if (node.type === 'component' && node.name === 'Update') {
      const base = updateAnchor(node.props)
      if (base) node.props['anchor'] = claim(base)
    }
    if (node.type === 'component' || node.type === 'blockquote') dedupeIds(node.children, seen)
  }
}

const collectHeadings = (
  nodes: DocMarkdownNode[],
  acc: DocMarkdownHeading[] = []
): DocMarkdownHeading[] => {
  for (const node of nodes) {
    if (node.type === 'heading' && node.depth >= 2 && node.depth <= 3 && node.id) {
      acc.push({ id: node.id, text: plainText(parseInline(node.text)), depth: node.depth })
    }
    if (node.type === 'component' && node.name === 'Update' && node.props['anchor']) {
      const text = String(node.props['title'] || node.props['label'] || '')
      acc.push({ id: String(node.props['anchor']), text, depth: 2 })
    }
    if (node.type === 'component' || node.type === 'blockquote') collectHeadings(node.children, acc)
  }
  return acc
}

export const readDocMarkdown = (
  source: string,
  extraTags: readonly string[] = []
): DocMarkdownParsed & { nodes: DocMarkdownNode[] } => {
  const { frontmatter, body } = splitFrontmatter(source)
  const reader: Reader = {
    blockTags: new Set(
      [...DOC_MARKDOWN_BLOCK_TAGS, ...extraTags].filter(
        (tag) => !DOC_MARKDOWN_INLINE_TAGS.includes(tag)
      )
    )
  }
  const nodes = parseBlocks(reader, body.split('\n'))
  dedupeIds(nodes, new Map())
  return { frontmatter, nodes, headings: collectHeadings(nodes) }
}

export const parseDocMarkdown = (
  source: string,
  components: Record<string, unknown> = {}
): DocMarkdownParsed => {
  const { frontmatter, headings } = readDocMarkdown(source, Object.keys(components))
  return { frontmatter, headings }
}
