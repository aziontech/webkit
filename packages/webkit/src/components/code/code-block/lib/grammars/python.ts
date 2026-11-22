import type { CodeBlockHighlightToken, CodeBlockHighlightTokenType } from '../highlight-code'
import { scanLine } from './tokens'

const PYTHON_KEYWORDS = [
  'and',
  'as',
  'assert',
  'async',
  'await',
  'break',
  'class',
  'continue',
  'def',
  'del',
  'elif',
  'else',
  'except',
  'finally',
  'for',
  'from',
  'global',
  'if',
  'import',
  'in',
  'is',
  'lambda',
  'nonlocal',
  'not',
  'or',
  'pass',
  'raise',
  'return',
  'try',
  'while',
  'with',
  'yield'
] as const

const PYTHON_LITERALS = ['True', 'False', 'None'] as const

const PYTHON_DEFINERS = ['def', 'class'] as const

export const PYTHON_LINE_COMMENT = /#/y

const PYTHON_PATTERN =
  /[rRbBfF]{0,2}(?:'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")|@[A-Za-z_][\w.]*|-?\b\d+(?:\.\d+)?\b|[A-Za-z_]\w*|[{}[\]().,:;=<>!+\-*/%]|\s+|\S/g

const classify = (chunk: string, previous: string, rest: string): CodeBlockHighlightTokenType => {
  if (/^[rRbBfF]{0,2}['"]/.test(chunk)) return 'string'
  if (chunk.startsWith('@')) return 'keyword'
  if (/^-?\d/.test(chunk) || PYTHON_LITERALS.includes(chunk as (typeof PYTHON_LITERALS)[number]))
    return 'type'
  if (!/^[A-Za-z_]/.test(chunk)) return 'punctuation'
  if (PYTHON_KEYWORDS.includes(chunk as (typeof PYTHON_KEYWORDS)[number])) return 'keyword'
  if (PYTHON_DEFINERS.includes(previous as (typeof PYTHON_DEFINERS)[number]))
    return previous === 'class' ? 'type' : 'function'
  if (/^\s*\(/.test(rest)) return 'function'
  if (/^[A-Z]/.test(chunk)) return 'type'
  return 'identifier'
}

export const highlightPythonLine = (line: string): CodeBlockHighlightToken[] => {
  let previousWord = ''
  return scanLine(line, PYTHON_PATTERN, (chunk, rest) => {
    const previous = previousWord
    previousWord = /^[A-Za-z_]/.test(chunk) ? chunk : ''
    return classify(chunk, previous, rest)
  })
}
