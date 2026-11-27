import type { CodeBlockHighlightToken, CodeBlockHighlightTokenType } from '../highlight-code'
import { pushToken } from './tokens'

const JS_KEYWORDS = [
  'export',
  'default',
  'import',
  'from',
  'return',
  'const',
  'let',
  'var',
  'function',
  'class',
  'new',
  'if',
  'else',
  'for',
  'while',
  'switch',
  'case',
  'break',
  'continue',
  'try',
  'catch',
  'finally',
  'throw',
  'async',
  'await',
  'typeof',
  'instanceof',
  'in'
] as const

const JS_TOKEN = new RegExp(
  `\\/\\/.*$|\\b(?:${JS_KEYWORDS.join('|')})\\b|[{}\\[\\]().,:;=<>]|'(?:\\\\'|[^'])*'|"(?:\\\\"|[^"])*"|\\b[A-Z][A-Za-z0-9_]*\\b|\\b[a-zA-Z_$][\\w$]*\\b|\\s+|[^\\s]+`,
  'g'
)

const IDENTIFIER = /^[a-zA-Z_$][\w$]*$/

const isKeyword = (word: string | undefined): boolean =>
  JS_KEYWORDS.includes(word as (typeof JS_KEYWORDS)[number])

const startsCall = (last: CodeBlockHighlightToken | undefined): boolean => {
  const previous = last?.text.trim()
  return !previous || /[({[,;=\s]$/.test(previous) || isKeyword(previous)
}

const classify = (
  chunk: string,
  previous: string,
  last: CodeBlockHighlightToken | undefined
): CodeBlockHighlightTokenType => {
  if (chunk.startsWith('//')) return 'comment'
  if (/^\s+$/.test(chunk)) return 'identifier'
  if (isKeyword(chunk)) return 'keyword'
  if (/^['"]/.test(chunk)) return 'string'
  if (/^[{}[\]().,:;=<>]$/.test(chunk)) return 'punctuation'
  if (/^[A-Z]/.test(chunk)) return 'type'
  if (!IDENTIFIER.test(chunk)) return 'identifier'
  if (previous === '.') return 'function'
  return startsCall(last) ? 'function' : 'identifier'
}

export const highlightJavaScriptLine = (line: string): CodeBlockHighlightToken[] => {
  const tokens: CodeBlockHighlightToken[] = []
  JS_TOKEN.lastIndex = 0
  let previous = ''
  let match: RegExpExecArray | null
  while ((match = JS_TOKEN.exec(line)) !== null) {
    const chunk = match[0]
    pushToken(tokens, chunk, classify(chunk, previous, tokens[tokens.length - 1]))
    previous = chunk
  }
  return tokens.length ? tokens : [{ text: line || ' ', type: 'identifier' }]
}
