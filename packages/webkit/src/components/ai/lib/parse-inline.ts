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

type ScanStep = 'next' | 'stop' | undefined

const ESCAPABLE = /[\\`*_[\]()#>|-]/
const CITATION = /^\[(\d{1,3})\](?!\()/

let text = ''
let at = 0
let plain = ''
let out: MarkdownInline[] = []

function flushPlain(): void {
  pushText(out, plain)
  plain = ''
}

function scanPlain(char: string): ScanStep {
  if (char === '\\' && at + 1 < text.length && ESCAPABLE.test(text[at + 1] as string)) {
    plain += text[at + 1]
    at += 2
    return 'next'
  }
  if (char !== '\n' && char !== '`') return
  flushPlain()
  if (char === '\n') {
    out.push({ type: 'break' })
    at += 1
    return 'next'
  }
  const end = text.indexOf('`', at + 1)
  const stop = end === -1 ? text.length : end
  out.push({ type: 'code', value: text.slice(at + 1, stop) })
  at = stop + 1
  return 'next'
}

function scanStrong(): ScanStep {
  const pair = text.slice(at, at + 2)
  if (pair !== '**' && pair !== '__') return
  flushPlain()
  const end = findClosing(text, pair, at + 2)
  const stop = end === -1 ? text.length : end
  const inner = text.slice(at + 2, stop)
  if (inner) out.push({ type: 'strong', children: parseInline(inner) })
  at = stop + 2
  return 'next'
}

function scanEmphasis(char: string): ScanStep {
  if ((char !== '*' && char !== '_') || text[at + 1] === ' ' || at + 1 >= text.length) return
  const end = char === '_' && /\w/.test(text[at - 1] ?? '') ? -1 : findClosing(text, char, at + 1)
  if (end <= at + 1) return
  flushPlain()
  out.push({ type: 'em', children: parseInline(text.slice(at + 1, end)) })
  at = end + 1
  return 'next'
}

function scanLink(close: number): ScanStep {
  flushPlain()
  const end = text.indexOf(')', close + 2)
  const label = parseInline(text.slice(at + 1, close))
  if (end === -1) {
    out.push(...label)
    return 'stop'
  }
  const href = safeHref(text.slice(close + 2, end))
  if (href) out.push({ type: 'link', href, children: label })
  else out.push(...label)
  at = end + 1
  return 'next'
}

function scanBracket(char: string): ScanStep {
  if (char === '[') {
    const citation = CITATION.exec(text.slice(at))
    if (citation) {
      flushPlain()
      out.push({ type: 'citation', index: Number(citation[1]) })
      at += citation[0].length
      return 'next'
    }
    const close = text.indexOf(']', at + 1)
    if (close === -1) {
      flushPlain()
      pushText(out, text.slice(at + 1))
      return 'stop'
    }
    if (text[close + 1] === '(') return scanLink(close)
  }
  if (char !== '!' || text[at + 1] !== '[') return
  const close = text.indexOf(']', at + 2)
  if (close === -1 || text[close + 1] !== '(') return
  const end = text.indexOf(')', close + 2)
  plain += text.slice(at + 2, close)
  at = end === -1 ? text.length : end + 1
  return 'next'
}

function scanAll(): MarkdownInline[] {
  while (at < text.length) {
    const char = text[at] as string
    const step = scanPlain(char) || scanStrong() || scanEmphasis(char) || scanBracket(char)
    if (step === 'stop') break
    if (!step) {
      plain += char
      at += 1
    }
  }
  flushPlain()
  return out
}

export function parseInline(source: string): MarkdownInline[] {
  const outer = [text, at, plain, out] as const
  text = source
  at = 0
  plain = ''
  out = []
  const result = scanAll()
  ;[text, at, plain, out] = outer
  return result
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
