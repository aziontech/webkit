import { JS_LINE_COMMENT, LINE_COMMENT, withLineComment } from './grammars/comments'
import { highlightGraphqlLine } from './grammars/graphql'
import { highlightHclLine } from './grammars/hcl'
import { highlightJavaScriptLine } from './grammars/javascript'
import { highlightJsonLine, JSONC_LINE_COMMENT } from './grammars/json'
import { highlightPythonLine, PYTHON_LINE_COMMENT } from './grammars/python'
import { highlightShellLine } from './grammars/shell'
import { highlightSqlLine, SQL_LINE_COMMENT } from './grammars/sql'

export type CodeBlockHighlightTokenType =
  | 'keyword'
  | 'string'
  | 'function'
  | 'type'
  | 'punctuation'
  | 'identifier'
  | 'comment'
  | 'prompt'
  | 'output'

export type CodeBlockHighlightToken = {
  text: string
  type: CodeBlockHighlightTokenType
}

const TOKEN_CLASS: Record<CodeBlockHighlightTokenType, string> = {
  keyword: 'text-(--code-syntax-keyword)',
  string: 'text-(--code-syntax-string)',
  function: 'text-(--code-syntax-function)',
  type: 'text-(--code-syntax-type)',
  punctuation: 'text-(--code-syntax-punctuation)',
  identifier: 'text-(--code-syntax-identifier)',
  comment: 'text-(--code-syntax-comment)',
  prompt: 'text-(--code-syntax-line-number) select-none',
  output: 'text-(--text-muted)'
}

export const getHighlightTokenClass = (type: CodeBlockHighlightTokenType): string =>
  TOKEN_CLASS[type] ?? TOKEN_CLASS.identifier

type LineHighlighter = (line: string) => CodeBlockHighlightToken[]

const plain: LineHighlighter = (code) => [{ text: code || ' ', type: 'identifier' }]

const commented =
  (marker: RegExp, highlight: LineHighlighter): LineHighlighter =>
  (line) =>
    withLineComment(line, marker, highlight)

const shellLine: LineHighlighter = (line) => {
  const prompt = /^\$ /.exec(line)
  if (!prompt) return withLineComment(line, LINE_COMMENT, highlightShellLine)
  const rest = line.slice(prompt[0].length)
  return [
    { text: prompt[0], type: 'prompt' },
    ...(rest ? withLineComment(rest, LINE_COMMENT, highlightShellLine) : [])
  ]
}

const GRAMMARS: [string[], LineHighlighter][] = [
  [['javascript', 'typescript', 'js', 'ts'], commented(JS_LINE_COMMENT, highlightJavaScriptLine)],
  [['bash', 'sh', 'shell', 'zsh', 'console'], shellLine],
  [['hcl', 'terraform', 'tf'], commented(LINE_COMMENT, highlightHclLine)],
  [['graphql', 'gql'], commented(LINE_COMMENT, highlightGraphqlLine)],
  [['json'], highlightJsonLine],
  [['jsonc'], commented(JSONC_LINE_COMMENT, highlightJsonLine)],
  [['sql', 'sqlite', 'postgresql', 'postgres'], commented(SQL_LINE_COMMENT, highlightSqlLine)],
  [['python', 'py'], commented(PYTHON_LINE_COMMENT, highlightPythonLine)],
  [['markdown', 'md'], (line) => [{ text: line || ' ', type: 'comment' }]]
]

const BY_LANGUAGE = new Map<string, LineHighlighter>()
for (const [names, highlight] of GRAMMARS)
  for (const name of names) BY_LANGUAGE.set(name, highlight)

const fallback = commented(LINE_COMMENT, plain)

export const highlightCodeLine = (
  language: string | undefined,
  line: string
): CodeBlockHighlightToken[] =>
  (BY_LANGUAGE.get((language ?? 'javascript').toLowerCase()) ?? fallback)(line)
export const highlightCode = (
  code: string,
  language: string | undefined
): CodeBlockHighlightToken[][] => code.split('\n').map((line) => highlightCodeLine(language, line))

export const plainLines = (code: string): CodeBlockHighlightToken[][] =>
  code.split('\n').map((line) => [{ text: line || ' ', type: 'output' }])

export const formatLineNumber = (lineNumber: number): string => String(lineNumber).padStart(2, '0')
