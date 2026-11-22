import type { CodeBlockHighlightToken } from '../highlight-code'
import { pushToken } from './tokens'

const SHELL_KEYWORDS = [
  'if',
  'then',
  'elif',
  'else',
  'fi',
  'for',
  'in',
  'do',
  'done',
  'while',
  'until',
  'case',
  'esac',
  'function',
  'return',
  'export',
  'local',
  'source',
  'sudo',
  'cd',
  'set',
  'unset',
  'echo',
  'exit'
] as const

const SHELL_COMMAND_PREFIXES = [
  'sudo',
  'source',
  'then',
  'else',
  'elif',
  'do',
  'if',
  'while',
  'until'
] as const

export const highlightShellLine = (line: string): CodeBlockHighlightToken[] => {
  const tokens: CodeBlockHighlightToken[] = []

  const shellRegex =
    /'[^']*'|"(?:\\"|[^"])*"|\$\{[^}]*\}|\$[A-Za-z_][\w]*|&&|\|\||--?[A-Za-z][-\w]*|[|;><()]|\s+|[^\s|;><()'"$]+/g

  let expectsCommand = true
  let match: RegExpExecArray | null

  while ((match = shellRegex.exec(line)) !== null) {
    const chunk = match[0]

    if (/^\s+$/.test(chunk)) {
      pushToken(tokens, chunk, 'identifier')
      continue
    }

    if (/^['"]/.test(chunk)) {
      pushToken(tokens, chunk, 'string')
      expectsCommand = false
      continue
    }

    if (chunk.startsWith('$')) {
      pushToken(tokens, chunk, 'type')
      expectsCommand = false
      continue
    }

    if (/^(?:&&|\|\||[|;><()])$/.test(chunk)) {
      pushToken(tokens, chunk, 'punctuation')
      expectsCommand = true
      continue
    }

    if (/^--?[A-Za-z]/.test(chunk)) {
      pushToken(tokens, chunk, 'keyword')
      continue
    }

    if (SHELL_KEYWORDS.includes(chunk as (typeof SHELL_KEYWORDS)[number])) {
      pushToken(tokens, chunk, 'keyword')
      expectsCommand = SHELL_COMMAND_PREFIXES.includes(
        chunk as (typeof SHELL_COMMAND_PREFIXES)[number]
      )
      continue
    }

    if (expectsCommand) {
      pushToken(tokens, chunk, 'function')
      expectsCommand = false
      continue
    }

    pushToken(tokens, chunk, 'identifier')
  }

  return tokens.length ? tokens : [{ text: line || ' ', type: 'identifier' }]
}
