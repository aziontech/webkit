import { safeHref } from '../../../utils/safe-href'

export type MarkdownInline =
  | { type: 'text'; value: string }
  | { type: 'strong'; children: MarkdownInline[] }
  | { type: 'em'; children: MarkdownInline[] }
  | { type: 'code'; value: string }
  | { type: 'link'; href: string; children: MarkdownInline[] }
  | { type: 'citation'; index: number }
  | { type: 'break' }

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

interface InlineScan {
  text: string
  i: number
  plain: string
  out: MarkdownInline[]
}

type ScanStep = 'next' | 'stop' | undefined

const ESCAPABLE = /[\\`*_[\]()#>|-]/
const CITATION = /^\[(\d{1,3})\](?!\()/

function flushPlain(scan: InlineScan): void {
  pushText(scan.out, scan.plain)
  scan.plain = ''
}

function scanEscape(scan: InlineScan): ScanStep {
  const { text, i } = scan
  if (text[i] !== '\\' || i + 1 >= text.length || !ESCAPABLE.test(text[i + 1] ?? '')) return
  scan.plain += text[i + 1]
  scan.i += 2
  return 'next'
}

function scanBreak(scan: InlineScan): ScanStep {
  if (scan.text[scan.i] !== '\n') return
  flushPlain(scan)
  scan.out.push({ type: 'break' })
  scan.i += 1
  return 'next'
}

function scanCode(scan: InlineScan): ScanStep {
  const { text, i } = scan
  if (text[i] !== '`') return
  flushPlain(scan)
  const end = text.indexOf('`', i + 1)
  const stop = end === -1 ? text.length : end
  scan.out.push({ type: 'code', value: text.slice(i + 1, stop) })
  scan.i = stop + 1
  return 'next'
}

function scanStrong(scan: InlineScan): ScanStep {
  const { text, i } = scan
  const pair = text.slice(i, i + 2)
  if (pair !== '**' && pair !== '__') return
  flushPlain(scan)
  const end = findClosing(text, pair, i + 2)
  const stop = end === -1 ? text.length : end
  const inner = text.slice(i + 2, stop)
  if (inner) scan.out.push({ type: 'strong', children: parseInline(inner) })
  scan.i = stop + 2
  return 'next'
}

function scanEmphasis(scan: InlineScan): ScanStep {
  const { text, i } = scan
  const char = text[i] ?? ''
  if ((char !== '*' && char !== '_') || text[i + 1] === ' ' || i + 1 >= text.length) return
  const wordBefore = char === '_' && /\w/.test(text[i - 1] ?? '')
  const end = wordBefore ? -1 : findClosing(text, char, i + 1)
  if (end <= i + 1) return
  flushPlain(scan)
  scan.out.push({ type: 'em', children: parseInline(text.slice(i + 1, end)) })
  scan.i = end + 1
  return 'next'
}

function scanLink(scan: InlineScan, close: number): ScanStep {
  const { text, i } = scan
  flushPlain(scan)
  const end = text.indexOf(')', close + 2)
  const label = parseInline(text.slice(i + 1, close))
  if (end === -1) {
    scan.out.push(...label)
    return 'stop'
  }
  const href = safeHref(text.slice(close + 2, end))
  if (href) scan.out.push({ type: 'link', href, children: label })
  else scan.out.push(...label)
  scan.i = end + 1
  return 'next'
}

function scanBracket(scan: InlineScan): ScanStep {
  const { text, i } = scan
  if (text[i] !== '[') return
  const citation = CITATION.exec(text.slice(i))
  if (citation) {
    flushPlain(scan)
    scan.out.push({ type: 'citation', index: Number(citation[1]) })
    scan.i += citation[0].length
    return 'next'
  }
  const close = text.indexOf(']', i + 1)
  if (close === -1) {
    flushPlain(scan)
    pushText(scan.out, text.slice(i + 1))
    return 'stop'
  }
  return text[close + 1] === '(' ? scanLink(scan, close) : undefined
}

function scanImage(scan: InlineScan): ScanStep {
  const { text, i } = scan
  if (text[i] !== '!' || text[i + 1] !== '[') return
  const close = text.indexOf(']', i + 2)
  if (close === -1 || text[close + 1] !== '(') return
  const end = text.indexOf(')', close + 2)
  scan.plain += text.slice(i + 2, close)
  scan.i = end === -1 ? text.length : end + 1
  return 'next'
}

const INLINE_SCANNERS = [
  scanEscape,
  scanBreak,
  scanCode,
  scanStrong,
  scanEmphasis,
  scanBracket,
  scanImage
]

function scanInline(scan: InlineScan): ScanStep {
  for (const scanner of INLINE_SCANNERS) {
    const step = scanner(scan)
    if (step) return step
  }
  return undefined
}

export function parseInline(text: string): MarkdownInline[] {
  const scan: InlineScan = { text, i: 0, plain: '', out: [] }
  while (scan.i < text.length) {
    const step = scanInline(scan)
    if (step === 'stop') break
    if (!step) {
      scan.plain += text[scan.i]
      scan.i += 1
    }
  }
  flushPlain(scan)
  return scan.out
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
