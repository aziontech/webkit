// A deliberately small MDX parser for Azion documentation pages.
//
// It reads the subset of MDX that a docs author actually writes — frontmatter,
// markdown prose, fenced code, tables, and the documentation components
// (`<Note>`, `<Steps>`, `<CardGroup>`, …) — and returns a plain node tree that
// `doc-markdown.vue` renders through the webkit-backed Vue components.
//
// It is NOT a general MDX compiler: no JSX expressions, no imports, no
// arbitrary JavaScript. The supported surface is documented in
// `stories/documentation/Authoring.mdx` and is exactly what the components
// below can render. Anything outside it is left as literal text rather than
// silently dropped.

/** Component tags the renderer knows how to mount. */
export const COMPONENT_TAGS = new Set([
  'Note',
  'Info',
  'Tip',
  'Warning',
  'Danger',
  'Check',
  'Highlight',
  'Steps',
  'Step',
  'CardGroup',
  'Card',
  'ItemGroup',
  'Item',
  'AccordionGroup',
  'Accordion',
  'Tabs',
  'Tab',
  'CodeGroup',
  'Frame',
  'Columns',
  'Prompt',
  'Update'
])

/*
 * Component tags that live INSIDE a sentence rather than between paragraphs.
 *
 * A gloss (`<Tooltip>`) wraps one term mid-prose, so it cannot go through the
 * block reader: that reader owns whole lines, and everything after the closing
 * tag on the same line — the rest of the sentence — would be dropped. These are
 * tokenized by `parseInline` instead, and a paragraph that merely STARTS with
 * one still reads as a paragraph.
 */
export const INLINE_COMPONENT_TAGS = new Set(['Tooltip'])

const FENCE = /^\s*(```|~~~)(.*)$/
const HEADING = /^(#{1,4})\s+(.+?)\s*$/
const LIST_ITEM = /^(\s*)(?:([-*+])|(\d+)[.)])\s+(.*)$/
const BLOCKQUOTE = /^>\s?(.*)$/
const DIVIDER = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/
const TABLE_DELIM = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/
const OPEN_TAG = /^\s*<([A-Z][A-Za-z0-9]*)\b/
const INLINE_TAG = /<([A-Z][A-Za-z0-9]*)\b((?:"[^"]*"|'[^']*'|[^>"'])*?)(?:\/>|>([\s\S]*?)<\/\1>)/

/**
 * True when a line opens a BLOCK component — the only case that takes the line
 * away from the paragraph reader. A line that opens an inline component is
 * prose, and a tag we do not know at all stays literal text.
 *
 * @param {string} line - one body line.
 * @returns {boolean}
 */
const isBlockTagLine = (line) => {
  const name = line.match(OPEN_TAG)?.[1]
  return Boolean(name) && COMPONENT_TAGS.has(name) && !INLINE_COMPONENT_TAGS.has(name)
}

/**
 * Turn a heading's visible text into a stable anchor id.
 *
 * @param {string} text - heading text, possibly carrying inline markup.
 * @returns {string} a kebab-case slug.
 */
export const slugify = (text) =>
  String(text)
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')

/**
 * Read a bracketed list of strings into an array.
 *
 * @param {string} raw - the literal `["a", "b"]`, brackets included.
 * @returns {string[]} the entries, unquoted and trimmed; empty entries dropped.
 */
const parseList = (raw) =>
  raw
    .slice(1, -1)
    .split(',')
    .map((entry) => entry.trim().replace(/^['"]|['"]$/g, ''))
    .filter((entry) => entry !== '')

/**
 * Parse an attribute string from a component tag.
 * Supports `a="b"`, `a={1}`, `a={true}`, `a='b'` and bare booleans.
 *
 * @param {string} raw - everything between the tag name and the closing bracket.
 * @returns {Record<string, string | number | boolean>} the parsed props.
 */
const parseProps = (raw) => {
  const props = {}
  const attr = /([A-Za-z][A-Za-z0-9-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\}))?/g
  let match
  while ((match = attr.exec(raw)) !== null) {
    const [, name, dq, sq, brace] = match
    if (dq !== undefined) props[name] = dq
    else if (sq !== undefined) props[name] = sq
    else if (brace !== undefined) {
      const value = brace.trim()
      if (value === 'true' || value === 'false') props[name] = value === 'true'
      else if (value !== '' && !Number.isNaN(Number(value))) props[name] = Number(value)
      // A list of strings — `tags={["API", "CLI"]}` — is the one shape of JSX
      // value an author writes, and the only one this parser reads. It is split
      // on commas rather than evaluated, so a stray expression inside the
      // brackets stays a literal string instead of running.
      else if (value.startsWith('[') && value.endsWith(']')) props[name] = parseList(value)
      else props[name] = value.replace(/^['"]|['"]$/g, '')
    } else props[name] = true
  }
  return props
}

/**
 * Strip the smallest shared indentation from a block of lines.
 *
 * @param {string[]} lines - the raw inner lines of a component block.
 * @returns {string[]} the dedented lines.
 */
const dedent = (lines) => {
  const widths = lines
    .filter((line) => line.trim() !== '')
    .map((line) => line.match(/^\s*/)[0].length)
  const indent = widths.length ? Math.min(...widths) : 0
  return lines.map((line) => line.slice(indent))
}

/**
 * Split the YAML-ish frontmatter block off the top of a source file.
 * Only `key: value` pairs are read — enough for title, description and label.
 *
 * @param {string} source - the raw `.mdx` file contents.
 * @returns {{ frontmatter: Record<string, string>, body: string }}
 */
export const splitFrontmatter = (source) => {
  const normalized = source.replace(/\r\n/g, '\n')
  if (!normalized.startsWith('---\n')) return { frontmatter: {}, body: normalized }
  const end = normalized.indexOf('\n---', 3)
  if (end === -1) return { frontmatter: {}, body: normalized }
  const block = normalized.slice(4, end)
  const body = normalized.slice(end + 4).replace(/^\n/, '')
  const frontmatter = {}
  for (const line of block.split('\n')) {
    const pair = line.match(/^([A-Za-z][\w-]*)\s*:\s*(.*)$/)
    if (pair) frontmatter[pair[1]] = pair[2].trim().replace(/^["']|["']$/g, '')
  }
  return { frontmatter, body }
}

/**
 * Tokenize inline markdown: code spans, links, bold, italic.
 *
 * @param {string} text - one logical line (or joined paragraph) of prose.
 * @returns {Array<{ type: string, value: string, href?: string }>} inline tokens.
 */
const parseInlineMarkdown = (text) => {
  const tokens = []
  const pattern =
    /(`[^`]+`)|(\[[^\]]+\]\([^)\s]+(?:\s+"[^"]*")?\))|(\*\*[^*]+\*\*)|(__[^_]+__)|(\*[^*\n]+\*)/g
  let last = 0
  let match
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) tokens.push({ type: 'text', value: text.slice(last, match.index) })
    const raw = match[0]
    if (raw.startsWith('`')) {
      tokens.push({ type: 'code', value: raw.slice(1, -1) })
    } else if (raw.startsWith('[')) {
      const link = raw.match(/^\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/)
      tokens.push({ type: 'link', value: link[1], href: link[2], title: link[3] })
    } else if (raw.startsWith('**') || raw.startsWith('__')) {
      tokens.push({ type: 'strong', value: raw.slice(2, -2) })
    } else {
      tokens.push({ type: 'em', value: raw.slice(1, -1) })
    }
    last = match.index + raw.length
  }
  if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) })
  return tokens
}

/**
 * Tokenize inline markdown AND the inline components that sit inside a sentence.
 *
 * An inline component (`<Tooltip tip="…">API</Tooltip>`) yields one `component`
 * token whose children are themselves inline tokens, so a glossed term may still
 * carry emphasis or code. A capitalized tag that is not a known inline component
 * is left alone: its text stays literal rather than disappearing.
 *
 * @param {string} text - one logical line (or joined paragraph) of prose.
 * @returns {Array<{ type: string, value?: string, href?: string, name?: string, props?: object, children?: object[] }>} inline tokens.
 */
export const parseInline = (text) => {
  const pattern = new RegExp(INLINE_TAG.source, 'g')
  const tokens = []
  let last = 0
  let match
  while ((match = pattern.exec(text)) !== null) {
    const [raw, name, attrs, inner] = match
    if (!INLINE_COMPONENT_TAGS.has(name)) continue
    if (match.index > last) tokens.push(...parseInlineMarkdown(text.slice(last, match.index)))
    tokens.push({
      type: 'component',
      name,
      props: parseProps(attrs ?? ''),
      children: parseInlineMarkdown(inner ?? '')
    })
    last = match.index + raw.length
  }
  if (last < text.length) tokens.push(...parseInlineMarkdown(text.slice(last)))
  return tokens
}

/**
 * Read one table starting at `start`; returns null when it is not a table.
 *
 * @param {string[]} lines - all body lines.
 * @param {number} start - index of the candidate header row.
 * @returns {{ node: object, next: number } | null}
 */
const readTable = (lines, start) => {
  if (!lines[start]?.trim().startsWith('|')) return null
  if (!TABLE_DELIM.test(lines[start + 1] ?? '')) return null
  const cells = (line) =>
    line
      .trim()
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((cell) => cell.trim())
  const head = cells(lines[start])
  const align = cells(lines[start + 1]).map((rule) => {
    const left = rule.startsWith(':')
    const right = rule.endsWith(':')
    if (left && right) return 'center'
    if (right) return 'right'
    return 'left'
  })
  const rows = []
  let index = start + 2
  while (index < lines.length && lines[index].trim().startsWith('|')) {
    rows.push(cells(lines[index]))
    index += 1
  }
  return { node: { type: 'table', head, align, rows }, next: index }
}

/**
 * Read a list (and its nested children) starting at `start`.
 *
 * @param {string[]} lines - all body lines.
 * @param {number} start - index of the first list item.
 * @returns {{ node: object, next: number }}
 */
const readList = (lines, start) => {
  const first = lines[start].match(LIST_ITEM)
  const baseIndent = first[1].length
  const ordered = Boolean(first[3])
  const items = []
  let index = start
  while (index < lines.length) {
    const line = lines[index]
    if (line.trim() === '') {
      const upcoming = lines[index + 1]
      if (!upcoming || !LIST_ITEM.test(upcoming)) break
      index += 1
      continue
    }
    const match = line.match(LIST_ITEM)
    if (!match) break
    const indent = match[1].length
    if (indent < baseIndent) break
    if (indent > baseIndent) {
      const nested = readList(lines, index)
      const previous = items[items.length - 1]
      if (previous) previous.children.push(nested.node)
      index = nested.next
      continue
    }
    items.push({ text: match[4], children: [] })
    index += 1
  }
  return { node: { type: 'list', ordered, items }, next: index }
}

/**
 * Read a component block (`<Note> … </Note>` or `<Card … />`).
 *
 * @param {string[]} lines - all body lines.
 * @param {number} start - index of the opening tag.
 * @returns {{ node: object, next: number } | null}
 */
const readComponent = (lines, start) => {
  const name = lines[start].match(OPEN_TAG)?.[1]
  if (!name || !COMPONENT_TAGS.has(name)) return null

  /*
   * Read the opening tag, wherever it ends.
   *
   * It is NOT safe to assume the line ends with the tag: an author writes a
   * one-sentence callout on a single line (`<Note>Copy.</Note>`), and treating
   * that whole line as the tag turned the sentence into boolean props and left
   * the reader hunting for a close tag it had already passed — which then
   * swallowed every block that followed. So the tag is matched explicitly, and
   * anything after it on the same line is content.
   *
   * The attribute scan skips over quoted values, so a prop may hold `>`.
   */
  const TAG = new RegExp(`^\\s*<${name}\\b((?:"[^"]*"|'[^']*'|[^>"'])*?)(\\/?)>`)
  let header = lines[start]
  let index = start
  while (!TAG.test(header) && index + 1 < lines.length) {
    index += 1
    header = `${header} ${lines[index].trim()}`
  }
  const tag = header.match(TAG)
  if (!tag) return null
  const props = parseProps(tag[1])
  const selfClosing = tag[2] === '/'

  if (selfClosing) {
    return { node: { type: 'component', name, props, children: [] }, next: index + 1 }
  }

  // Content that shares the opening tag's line — the one-line callout case.
  const trailing = header.slice(tag[0].length)
  const sameLineClose = trailing.lastIndexOf(`</${name}>`)
  if (sameLineClose !== -1) {
    const body = trailing.slice(0, sameLineClose)
    return {
      node: {
        type: 'component',
        name,
        props,
        children: body.trim() === '' ? [] : parseBlocks(dedent([body]))
      },
      next: index + 1
    }
  }

  // Walk forward to the matching close tag, counting same-name nesting.
  const open = new RegExp(`<${name}\\b`, 'g')
  const close = new RegExp(`</${name}>`, 'g')
  /*
   * A self-closing tag opens and closes at once, so counting it as an open
   * leaves the depth permanently one ahead and the walk runs past the real
   * close tag — swallowing every block after it. `<Steps>` holding a
   * `<Step … />` inside another `<Step>` is exactly that shape.
   */
  const selfClose = new RegExp(`<${name}\\b(?:"[^"]*"|'[^']*'|[^>"'])*?/>`, 'g')
  let depth = 1
  const inner = trailing.trim() === '' ? [] : [trailing]
  let cursor = index + 1
  while (cursor < lines.length) {
    const line = lines[cursor]
    const opens = (line.match(open) || []).length - (line.match(selfClose) || []).length
    const closes = (line.match(close) || []).length
    depth += opens - closes
    if (depth <= 0) {
      const before = line.slice(0, line.lastIndexOf(`</${name}>`))
      if (before.trim() !== '') inner.push(before)
      cursor += 1
      break
    }
    inner.push(line)
    cursor += 1
  }

  return {
    node: { type: 'component', name, props, children: parseBlocks(dedent(inner)) },
    next: cursor
  }
}

/**
 * Parse a list of lines into block nodes.
 *
 * @param {string[]} lines - body lines, already dedented for the current level.
 * @returns {object[]} block nodes.
 */
export function parseBlocks(lines) {
  const nodes = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (line.trim() === '') {
      index += 1
      continue
    }

    const fence = line.match(FENCE)
    if (fence) {
      const marker = fence[1]
      const meta = parseProps(fence[2].replace(/^\s*([\w+-]*)/, ''))
      const lang = fence[2].trim().split(/\s+/)[0] || ''
      const code = []
      index += 1
      while (index < lines.length && !lines[index].trim().startsWith(marker)) {
        code.push(lines[index])
        index += 1
      }
      index += 1
      nodes.push({ type: 'code', lang, meta, code: code.join('\n') })
      continue
    }

    if (isBlockTagLine(line)) {
      const component = readComponent(lines, index)
      if (component) {
        nodes.push(component.node)
        index = component.next
        continue
      }
    }

    const heading = line.match(HEADING)
    if (heading) {
      const text = heading[2]
      nodes.push({ type: 'heading', depth: heading[1].length, text, id: slugify(text) })
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
      const quoted = []
      while (index < lines.length && BLOCKQUOTE.test(lines[index])) {
        quoted.push(lines[index].match(BLOCKQUOTE)[1])
        index += 1
      }
      nodes.push({ type: 'blockquote', children: parseBlocks(quoted) })
      continue
    }

    const paragraph = []
    while (
      index < lines.length &&
      lines[index].trim() !== '' &&
      !HEADING.test(lines[index]) &&
      !FENCE.test(lines[index]) &&
      !DIVIDER.test(lines[index]) &&
      !LIST_ITEM.test(lines[index]) &&
      !BLOCKQUOTE.test(lines[index]) &&
      !isBlockTagLine(lines[index])
    ) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    if (paragraph.length) nodes.push({ type: 'paragraph', text: paragraph.join(' ') })
    else index += 1
  }

  return nodes
}

/**
 * Parse a full `.mdx` document.
 *
 * @param {string} source - the raw file contents.
 * @returns {{ frontmatter: Record<string, string>, nodes: object[], headings: object[] }}
 */
export function parseMdx(source) {
  const { frontmatter, body } = splitFrontmatter(source)
  const nodes = parseBlocks(body.split('\n'))
  dedupeHeadingIds(nodes)
  return { frontmatter, nodes, headings: collectHeadings(nodes) }
}

/**
 * Make every heading id unique in document order.
 *
 * A tutorial legitimately repeats a heading ("Test it" after each path), and
 * two elements sharing an id would break both the anchor and the scroll spy —
 * so repeats get a numeric suffix the way GitHub and Starlight do it.
 *
 * @param {object[]} nodes - the parsed tree, mutated in place.
 * @param {Map<string, number>} [seen] - accumulator used by the recursion.
 * @returns {void}
 */
function dedupeHeadingIds(nodes, seen = new Map()) {
  for (const node of nodes) {
    if (node.type === 'heading') {
      const count = seen.get(node.id) ?? 0
      seen.set(node.id, count + 1)
      if (count > 0) node.id = `${node.id}-${count + 1}`
    }
    // A changelog entry is a section of the page too: its label is an anchor and
    // an outline entry, so it takes an id from the same pool the headings take
    // theirs from and cannot collide with one.
    if (node.type === 'component' && node.name === 'Update') {
      const base = updateAnchor(node)
      if (base) {
        const count = seen.get(base) ?? 0
        seen.set(base, count + 1)
        node.props.anchor = count > 0 ? `${base}-${count + 1}` : base
      }
    }
    if (node.children) dedupeHeadingIds(node.children, seen)
  }
}

/**
 * The anchor an `<Update>` is addressed by, before deduplication.
 *
 * @param {object} node - a parsed `component` node named `Update`.
 * @returns {string} the slug, or an empty string when the entry has no label.
 */
const updateAnchor = (node) => String(node.props?.anchor || slugify(node.props?.label ?? ''))

/**
 * Walk the tree and collect every heading, so the page can build its
 * "On this page" rail from the same source the body renders from.
 *
 * @param {object[]} nodes - block nodes.
 * @param {object[]} [acc] - accumulator used by the recursion.
 * @returns {Array<{ id: string, text: string, depth: number }>} headings in document order.
 */
export function collectHeadings(nodes, acc = []) {
  for (const node of nodes) {
    if (node.type === 'heading' && node.depth >= 2 && node.depth <= 3) {
      acc.push({ id: node.id, text: node.text, depth: node.depth })
    }
    // An `<Update>` label renders as an `h2` and is what a reader of a changelog
    // navigates by, so the rail lists it beside the page's own headings.
    if (node.type === 'component' && node.name === 'Update' && node.props?.anchor) {
      acc.push({ id: node.props.anchor, text: String(node.props.label ?? ''), depth: 2 })
    }
    if (node.children) collectHeadings(node.children, acc)
  }
  return acc
}
