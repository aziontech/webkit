import type { CodeBlockHighlightToken } from '../highlight-code'
import { pushToken } from './tokens'

const JSON_LITERALS = ['true', 'false', 'null'] as const

export const JSONC_LINE_COMMENT = /\/\//y

export const highlightJsonLine = (line: string): CodeBlockHighlightToken[] => {
  const tokens: CodeBlockHighlightToken[] = []
  const jsonRegex =
    /"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[A-Za-z_]\w*|[{}[\]:,]|\s+|\S/g

  let match: RegExpExecArray | null

  while ((match = jsonRegex.exec(line)) !== null) {
    const chunk = match[0]
    const rest = line.slice(match.index + chunk.length)

    if (/^\s+$/.test(chunk)) {
      pushToken(tokens, chunk, 'identifier')
    } else if (chunk.startsWith('"')) {
      pushToken(tokens, chunk, /^\s*:/.test(rest) ? 'function' : 'string')
    } else if (
      /^-?\d/.test(chunk) ||
      JSON_LITERALS.includes(chunk as (typeof JSON_LITERALS)[number])
    ) {
      pushToken(tokens, chunk, 'type')
    } else if (/^[{}[\]:,]$/.test(chunk)) {
      pushToken(tokens, chunk, 'punctuation')
    } else {
      pushToken(tokens, chunk, 'identifier')
    }
  }

  return tokens.length ? tokens : [{ text: line || ' ', type: 'identifier' }]
}
