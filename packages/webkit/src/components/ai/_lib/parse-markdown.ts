export type MarkdownInline =
  | { type: 'text'; value: string }
  | { type: 'strong'; children: MarkdownInline[] }
  | { type: 'em'; children: MarkdownInline[] }
  | { type: 'code'; value: string }
  | { type: 'link'; href: string; children: MarkdownInline[] }
  | { type: 'citation'; index: number }
  | { type: 'break' }

export type MarkdownBlock =
  | { type: 'paragraph'; children: MarkdownInline[] }
  | { type: 'heading'; level: 3 | 4 | 5 | 6; children: MarkdownInline[] }
  | { type: 'list'; ordered: boolean; start: number; items: MarkdownInline[][] }
  | { type: 'code'; language: string; value: string; closed: boolean }
  | { type: 'quote'; children: MarkdownInline[] }
  | { type: 'table'; header: MarkdownInline[][]; rows: MarkdownInline[][][] }
  | { type: 'rule' }

const SAFE_HREF = /^(https?:\/\/|mailto:|\/(?!\/)|#)/i

export function safeHref(href: string): string | null {
  const value = href.trim()
  if (!value || [...value].some((char) => char.charCodeAt(0) < 32)) return null
  return SAFE_HREF.test(value) ? value : null
}

function pushText(out: MarkdownInline[], value: string): void {
  if (!value) return
  const last = out[out.length - 1]
  if (last && last.type === 'text') last.value += value
  else out.push({ type: 'text', value })
}

function findClosing(text: string, marker: string, from: number): number {
  let index = text.indexOf(marker, from)
  while (index !== -1 && text[index - 1] === '\\') index = text.indexOf(marker, index + 1)
  return index
}

export function parseInline(text: string): MarkdownInline[] {
  const out: MarkdownInline[] = []
  let i = 0
  let plain = ''
  const flush = (): void => {
    pushText(out, plain)
    plain = ''
  }
  while (i < text.length) {
    const char = text[i] as string
    const pair = text.slice(i, i + 2)
    if (char === '\\' && i + 1 < text.length && /[\\`*_[\]()#>|-]/.test(text[i + 1] as string)) {
      plain += text[i + 1]
      i += 2
      continue
    }
    if (char === '\n') {
      flush()
      out.push({ type: 'break' })
      i += 1
      continue
    }
    if (char === '`') {
      flush()
      const end = text.indexOf('`', i + 1)
      const stop = end === -1 ? text.length : end
      out.push({ type: 'code', value: text.slice(i + 1, stop) })
      i = stop + 1
      continue
    }
    if (pair === '**' || pair === '__') {
      flush()
      const end = findClosing(text, pair, i + 2)
      const stop = end === -1 ? text.length : end
      const inner = text.slice(i + 2, stop)
      if (inner) out.push({ type: 'strong', children: parseInline(inner) })
      i = stop + 2
      continue
    }
    if ((char === '*' || char === '_') && text[i + 1] !== ' ' && i + 1 < text.length) {
      const wordBefore = char === '_' && /\w/.test(text[i - 1] ?? '')
      const end = wordBefore ? -1 : findClosing(text, char, i + 1)
      if (end > i + 1) {
        flush()
        out.push({ type: 'em', children: parseInline(text.slice(i + 1, end)) })
        i = end + 1
        continue
      }
    }
    if (char === '[') {
      const citation = /^\[(\d{1,3})\](?!\()/.exec(text.slice(i))
      if (citation) {
        flush()
        out.push({ type: 'citation', index: Number(citation[1]) })
        i += citation[0].length
        continue
      }
      const close = text.indexOf(']', i + 1)
      if (close === -1) {
        flush()
        pushText(out, text.slice(i + 1))
        break
      }
      if (text[close + 1] === '(') {
        flush()
        const end = text.indexOf(')', close + 2)
        const label = parseInline(text.slice(i + 1, close))
        if (end === -1) {
          out.push(...label)
          break
        }
        const href = safeHref(text.slice(close + 2, end))
        if (href) out.push({ type: 'link', href, children: label })
        else out.push(...label)
        i = end + 1
        continue
      }
    }
    if (char === '!' && text[i + 1] === '[') {
      const close = text.indexOf(']', i + 2)
      if (close !== -1 && text[close + 1] === '(') {
        const end = text.indexOf(')', close + 2)
        plain += text.slice(i + 2, close)
        i = end === -1 ? text.length : end + 1
        continue
      }
    }
    plain += char
    i += 1
  }
  flush()
  return out
}

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

export function parseMarkdown(source: string): MarkdownBlock[] {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const blocks: MarkdownBlock[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i] as string
    if (!line.trim()) {
      i += 1
      continue
    }
    const fence = FENCE.exec(line)
    if (fence) {
      const marker = fence[1] as string
      const body: string[] = []
      i += 1
      let closed = false
      while (i < lines.length) {
        const current = lines[i] as string
        if (current.trim().startsWith(marker)) {
          closed = true
          i += 1
          break
        }
        body.push(current)
        i += 1
      }
      blocks.push({ type: 'code', language: fence[2] || 'text', value: body.join('\n'), closed })
      continue
    }
    const heading = HEADING.exec(line)
    if (heading) {
      const level = Math.min(6, (heading[1] as string).length + 2) as 3 | 4 | 5 | 6
      blocks.push({ type: 'heading', level, children: parseInline(heading[2] as string) })
      i += 1
      continue
    }
    if (RULE.test(line)) {
      blocks.push({ type: 'rule' })
      i += 1
      continue
    }
    if (line.includes('|') && TABLE_DIVIDER.test(lines[i + 1] ?? '')) {
      const header = splitRow(line).map(parseInline)
      const rows: MarkdownInline[][][] = []
      i += 2
      while (
        i < lines.length &&
        (lines[i] as string).includes('|') &&
        (lines[i] as string).trim()
      ) {
        rows.push(splitRow(lines[i] as string).map(parseInline))
        i += 1
      }
      blocks.push({ type: 'table', header, rows })
      continue
    }
    if (QUOTE.test(line)) {
      const body: string[] = []
      while (i < lines.length && QUOTE.test(lines[i] as string)) {
        body.push((QUOTE.exec(lines[i] as string) as RegExpExecArray)[1] as string)
        i += 1
      }
      blocks.push({ type: 'quote', children: parseInline(body.join('\n')) })
      continue
    }
    const bullet = BULLET.exec(line)
    const ordered = ORDERED.exec(line)
    if (bullet || ordered) {
      const isOrdered = !bullet
      const pattern = isOrdered ? ORDERED : BULLET
      const items: string[] = []
      while (i < lines.length) {
        const current = lines[i] as string
        const match = pattern.exec(current)
        if (match) {
          items.push((isOrdered ? match[2] : match[1]) as string)
        } else if (current.trim() && /^\s{2,}/.test(current) && items.length) {
          items[items.length - 1] += `\n${current.trim()}`
        } else break
        i += 1
      }
      blocks.push({
        type: 'list',
        ordered: isOrdered,
        start: isOrdered ? Number((ordered as RegExpExecArray)[1]) : 1,
        items: items.map(parseInline)
      })
      continue
    }
    const paragraph: string[] = []
    while (i < lines.length) {
      const current = lines[i] as string
      if (
        !current.trim() ||
        FENCE.test(current) ||
        HEADING.test(current) ||
        QUOTE.test(current) ||
        BULLET.test(current) ||
        ORDERED.test(current) ||
        (paragraph.length > 0 && RULE.test(current))
      )
        break
      paragraph.push(current)
      i += 1
    }
    blocks.push({ type: 'paragraph', children: parseInline(paragraph.join('\n')) })
  }
  return blocks
}

export function plainText(nodes: MarkdownInline[]): string {
  return nodes
    .map((node) => {
      if (node.type === 'text' || node.type === 'code') return node.value
      if (node.type === 'break') return ' '
      if (node.type === 'citation') return `[${node.index}]`
      return plainText(node.children)
    })
    .join('')
}
