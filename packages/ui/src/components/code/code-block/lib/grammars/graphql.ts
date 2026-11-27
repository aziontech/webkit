import type { CodeBlockHighlightToken, CodeBlockHighlightTokenType } from '../highlight-code'
import { scanLine } from './tokens'

const GRAPHQL_KEYWORDS = [
  'query',
  'mutation',
  'subscription',
  'fragment',
  'type',
  'input',
  'enum',
  'interface',
  'union',
  'scalar',
  'schema',
  'extend',
  'directive',
  'implements'
] as const

const GRAPHQL_OPERATIONS = ['query', 'mutation', 'subscription', 'fragment'] as const

const GRAPHQL_LITERALS = ['true', 'false', 'null'] as const

const GRAPHQL_PATTERN =
  /"(?:\\"|[^"])*"|\$[A-Za-z_]\w*|@[A-Za-z_]\w*|-?\b\d+(?:\.\d+)?\b|\.\.\.|[A-Za-z_]\w*|[{}[\]()!:=,|&]|\s+|\S/g

const classifyWord = (
  chunk: string,
  first: boolean,
  previous: string,
  rest: string
): CodeBlockHighlightTokenType => {
  if (first && GRAPHQL_KEYWORDS.includes(chunk as (typeof GRAPHQL_KEYWORDS)[number]))
    return 'keyword'
  if (chunk === 'on' && previous !== '') return 'keyword'
  if (GRAPHQL_OPERATIONS.includes(previous as (typeof GRAPHQL_OPERATIONS)[number]))
    return 'function'
  if (GRAPHQL_LITERALS.includes(chunk as (typeof GRAPHQL_LITERALS)[number])) return 'type'
  if (/^\s*\(/.test(rest)) return 'function'
  if (/^[A-Z]/.test(chunk)) return 'type'
  return 'identifier'
}

export const highlightGraphqlLine = (line: string): CodeBlockHighlightToken[] => {
  let isFirstWord = true
  let previousWord = ''

  return scanLine(line, GRAPHQL_PATTERN, (chunk, rest) => {
    const first = isFirstWord
    const previous = previousWord
    const word = /^[A-Za-z_]/.test(chunk)
    isFirstWord = false
    previousWord = word ? chunk : ''

    if (chunk.startsWith('"')) return 'string'
    if (chunk.startsWith('$') || /^-?\d/.test(chunk)) return 'type'
    if (chunk.startsWith('@')) return 'keyword'
    if (!word) return 'punctuation'
    return classifyWord(chunk, first, previous, rest)
  })
}
