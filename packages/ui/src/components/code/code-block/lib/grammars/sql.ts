import type { CodeBlockHighlightToken } from '../highlight-code'
import { pushToken } from './tokens'

const SQL_KEYWORDS = [
  'select',
  'from',
  'where',
  'and',
  'or',
  'not',
  'in',
  'is',
  'null',
  'as',
  'on',
  'join',
  'left',
  'right',
  'inner',
  'outer',
  'cross',
  'group',
  'by',
  'order',
  'having',
  'limit',
  'offset',
  'distinct',
  'insert',
  'into',
  'values',
  'update',
  'set',
  'delete',
  'create',
  'table',
  'index',
  'view',
  'drop',
  'alter',
  'add',
  'if',
  'exists',
  'primary',
  'key',
  'foreign',
  'references',
  'unique',
  'default',
  'with',
  'union',
  'all',
  'case',
  'when',
  'then',
  'else',
  'end',
  'asc',
  'desc',
  'like',
  'between',
  'returning',
  'begin',
  'commit',
  'rollback'
] as const

const SQL_TYPES = [
  'integer',
  'int',
  'text',
  'real',
  'blob',
  'numeric',
  'boolean',
  'varchar',
  'char',
  'date',
  'timestamp',
  'float',
  'vector',
  'true',
  'false'
] as const

export const SQL_LINE_COMMENT = /--/y

export const highlightSqlLine = (line: string): CodeBlockHighlightToken[] => {
  const tokens: CodeBlockHighlightToken[] = []
  const sqlRegex =
    /'(?:''|[^'])*'|"(?:""|[^"])*"|-?\b\d+(?:\.\d+)?\b|[A-Za-z_][\w]*|[(),;.*=<>!+\-/]|\s+|\S/g

  let match: RegExpExecArray | null

  while ((match = sqlRegex.exec(line)) !== null) {
    const chunk = match[0]
    const rest = line.slice(match.index + chunk.length)
    const word = chunk.toLowerCase()

    if (/^\s+$/.test(chunk)) {
      pushToken(tokens, chunk, 'identifier')
    } else if (chunk.startsWith("'")) {
      pushToken(tokens, chunk, 'string')
    } else if (/^-?\d/.test(chunk)) {
      pushToken(tokens, chunk, 'type')
    } else if (!/^[A-Za-z_"]/.test(chunk)) {
      pushToken(tokens, chunk, 'punctuation')
    } else if (SQL_KEYWORDS.includes(word as (typeof SQL_KEYWORDS)[number])) {
      pushToken(tokens, chunk, 'keyword')
    } else if (SQL_TYPES.includes(word as (typeof SQL_TYPES)[number])) {
      pushToken(tokens, chunk, 'type')
    } else if (/^\s*\(/.test(rest)) {
      pushToken(tokens, chunk, 'function')
    } else {
      pushToken(tokens, chunk, 'identifier')
    }
  }

  return tokens.length ? tokens : [{ text: line || ' ', type: 'identifier' }]
}
