import { type MarkdownInline, parseInline, plainText } from '../../ai/lib/parse-markdown'
import { slugify } from '../doc-changelog-entry/slugify'
import { parseAttributes } from './lib/parse-doc-attributes'
import { type DocMarkdownReader, parseBlocks } from './lib/read-doc-blocks'

export { parseAttributes } from './lib/parse-doc-attributes'

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

const DOC_MARKDOWN_BLOCK_TAGS: readonly string[] = [
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
  'ContributionGraph',
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

const DOC_MARKDOWN_INLINE_TAGS: readonly string[] = ['StatusIndicator', 'Tooltip']

const INLINE_TAG = /<([A-Z][A-Za-z0-9]*)\b((?:"[^"]*"|'[^']*'|[^>"'])*?)(?:\/>|>([\s\S]*?)<\/\1>)/g

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

const headingOf = (node: DocMarkdownNode): DocMarkdownHeading | null => {
  if (node.type === 'heading')
    return node.depth >= 2 && node.depth <= 3 && node.id
      ? { id: node.id, text: plainText(parseInline(node.text)), depth: node.depth }
      : null
  if (node.type !== 'component' || node.name !== 'Update' || !node.props['anchor']) return null
  const text = String(node.props['title'] || node.props['label'] || '')
  return { id: String(node.props['anchor']), text, depth: 2 }
}

const collectHeadings = (
  nodes: DocMarkdownNode[],
  acc: DocMarkdownHeading[] = []
): DocMarkdownHeading[] => {
  for (const node of nodes) {
    const heading = headingOf(node)
    if (heading) acc.push(heading)
    if (node.type === 'component' || node.type === 'blockquote') collectHeadings(node.children, acc)
  }
  return acc
}

export const readDocMarkdown = (
  source: string,
  extraTags: readonly string[] = []
): DocMarkdownParsed & { nodes: DocMarkdownNode[] } => {
  const { frontmatter, body } = splitFrontmatter(source)
  const reader: DocMarkdownReader = {
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
