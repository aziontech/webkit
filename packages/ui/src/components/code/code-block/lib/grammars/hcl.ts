import type { CodeBlockHighlightToken } from '../highlight-code'
import { scanLine } from './tokens'

const HCL_LITERALS = ['true', 'false', 'null'] as const

const HCL_PATTERN =
  /"(?:\\"|[^"])*"|-?\b\d+(?:\.\d+)?\b|[A-Za-z_][\w-]*|[{}[\]().,:=?<>!*/+-]|\s+|\S/g

export const highlightHclLine = (line: string): CodeBlockHighlightToken[] => {
  let isFirstWord = true

  return scanLine(line, HCL_PATTERN, (chunk, rest) => {
    const first = isFirstWord
    isFirstWord = false

    if (chunk.startsWith('"')) return 'string'
    if (/^-?\d/.test(chunk)) return 'type'
    if (!/^[A-Za-z_]/.test(chunk)) return 'punctuation'
    if (HCL_LITERALS.includes(chunk as (typeof HCL_LITERALS)[number])) return 'type'
    if (/^\s*\(/.test(rest)) return 'function'
    if (first && /^\s*=(?!=)/.test(rest)) return 'function'
    if (first && /^\s*(?:"|\{|[A-Za-z_])/.test(rest)) return 'keyword'
    return 'identifier'
  })
}
