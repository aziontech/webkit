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

const pushToken = (
  tokens: CodeBlockHighlightToken[],
  text: string,
  type: CodeBlockHighlightTokenType
) => {
  if (!text) {
    return
  }

  const last = tokens[tokens.length - 1]

  if (last && last.type === type) {
    last.text += text
    return
  }

  tokens.push({ text, type })
}

const LINE_COMMENT = /(?<=^|[\s;])(?:#|\/\/)/y
const JS_LINE_COMMENT = /\/\/|(?<=^|[\s;])#(?=\s|$|!)/y

const findLineCommentStart = (line: string, marker: RegExp): number => {
  let quote = ''

  for (let index = 0; index < line.length; index++) {
    const char = line[index]

    if (quote) {
      if (char === '\\') {
        index++
      } else if (char === quote) {
        quote = ''
      }
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }

    marker.lastIndex = index
    if (marker.test(line)) {
      return index
    }
  }

  return -1
}

const withLineComment = (
  line: string,
  marker: RegExp,
  highlightCode: (code: string) => CodeBlockHighlightToken[]
): CodeBlockHighlightToken[] => {
  const start = findLineCommentStart(line, marker)

  if (start === -1) {
    return highlightCode(line)
  }

  const tokens = start > 0 ? highlightCode(line.slice(0, start)) : []
  pushToken(tokens, line.slice(start), 'comment')
  return tokens
}

const JS_TOKEN = new RegExp(
  `\\/\\/.*$|\\b(?:${JS_KEYWORDS.join('|')})\\b|[{}\\[\\]().,:;=<>]|'(?:\\\\'|[^'])*'|"(?:\\\\"|[^"])*"|\\b[A-Z][A-Za-z0-9_]*\\b|\\b[a-zA-Z_$][\\w$]*\\b|\\s+|[^\\s]+`,
  'g'
)

const highlightJavaScriptLine = (line: string): CodeBlockHighlightToken[] => {
  const tokens: CodeBlockHighlightToken[] = []
  const keywordRegex = JS_TOKEN
  keywordRegex.lastIndex = 0

  let previousChunk = ''
  let match: RegExpExecArray | null

  while ((match = keywordRegex.exec(line)) !== null) {
    const chunk = match[0]

    if (chunk.startsWith('//')) {
      pushToken(tokens, chunk, 'comment')
      previousChunk = chunk
      continue
    }

    if (/^\s+$/.test(chunk)) {
      pushToken(tokens, chunk, 'identifier')
      previousChunk = chunk
      continue
    }

    if (JS_KEYWORDS.includes(chunk as (typeof JS_KEYWORDS)[number])) {
      pushToken(tokens, chunk, 'keyword')
      previousChunk = chunk
      continue
    }

    if (/^['"]/.test(chunk)) {
      pushToken(tokens, chunk, 'string')
      previousChunk = chunk
      continue
    }

    if (/^[{}[\]().,:;=<>]$/.test(chunk)) {
      pushToken(tokens, chunk, 'punctuation')
      previousChunk = chunk
      continue
    }

    if (/^[A-Z]/.test(chunk)) {
      pushToken(tokens, chunk, 'type')
      previousChunk = chunk
      continue
    }

    if (previousChunk === '.' && /^[a-zA-Z_$][\w$]*$/.test(chunk)) {
      pushToken(tokens, chunk, 'function')
      previousChunk = chunk
      continue
    }

    if (
      /^[a-zA-Z_$][\w$]*$/.test(chunk) &&
      previousChunk !== '.' &&
      !JS_KEYWORDS.includes(chunk as (typeof JS_KEYWORDS)[number])
    ) {
      const prevToken = tokens[tokens.length - 1]
      const prevNonSpace = prevToken?.text.trim()

      if (
        !prevNonSpace ||
        /[({[,;=\s]$/.test(prevNonSpace) ||
        JS_KEYWORDS.includes(prevNonSpace as (typeof JS_KEYWORDS)[number])
      ) {
        pushToken(tokens, chunk, 'function')
        previousChunk = chunk
        continue
      }
    }

    pushToken(tokens, chunk, 'identifier')
    previousChunk = chunk
  }

  return tokens.length ? tokens : [{ text: line || ' ', type: 'identifier' }]
}

const highlightShellLine = (line: string): CodeBlockHighlightToken[] => {
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

const HCL_LITERALS = ['true', 'false', 'null'] as const

const highlightHclLine = (line: string): CodeBlockHighlightToken[] => {
  const tokens: CodeBlockHighlightToken[] = []
  const hclRegex =
    /"(?:\\"|[^"])*"|-?\b\d+(?:\.\d+)?\b|[A-Za-z_][\w-]*|[{}[\]().,:=?<>!*/+-]|\s+|\S/g

  let isFirstWord = true
  let match: RegExpExecArray | null

  while ((match = hclRegex.exec(line)) !== null) {
    const chunk = match[0]
    const rest = line.slice(match.index + chunk.length)

    if (/^\s+$/.test(chunk)) {
      pushToken(tokens, chunk, 'identifier')
      continue
    }

    if (chunk.startsWith('"')) {
      pushToken(tokens, chunk, 'string')
      isFirstWord = false
      continue
    }

    if (/^-?\d/.test(chunk)) {
      pushToken(tokens, chunk, 'type')
      isFirstWord = false
      continue
    }

    if (!/^[A-Za-z_]/.test(chunk)) {
      pushToken(tokens, chunk, 'punctuation')
      isFirstWord = false
      continue
    }

    if (HCL_LITERALS.includes(chunk as (typeof HCL_LITERALS)[number])) {
      pushToken(tokens, chunk, 'type')
    } else if (/^\s*\(/.test(rest)) {
      pushToken(tokens, chunk, 'function')
    } else if (isFirstWord && /^\s*=(?!=)/.test(rest)) {
      pushToken(tokens, chunk, 'function')
    } else if (isFirstWord && /^\s*(?:"|\{|[A-Za-z_])/.test(rest)) {
      pushToken(tokens, chunk, 'keyword')
    } else {
      pushToken(tokens, chunk, 'identifier')
    }

    isFirstWord = false
  }

  return tokens.length ? tokens : [{ text: line || ' ', type: 'identifier' }]
}

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

const highlightGraphqlLine = (line: string): CodeBlockHighlightToken[] => {
  const tokens: CodeBlockHighlightToken[] = []
  const graphqlRegex =
    /"(?:\\"|[^"])*"|\$[A-Za-z_]\w*|@[A-Za-z_]\w*|-?\b\d+(?:\.\d+)?\b|\.\.\.|[A-Za-z_]\w*|[{}[\]()!:=,|&]|\s+|\S/g

  let isFirstWord = true
  let previousWord = ''
  let match: RegExpExecArray | null

  while ((match = graphqlRegex.exec(line)) !== null) {
    const chunk = match[0]
    const rest = line.slice(match.index + chunk.length)

    if (/^\s+$/.test(chunk)) {
      pushToken(tokens, chunk, 'identifier')
      continue
    }

    if (chunk.startsWith('"')) {
      pushToken(tokens, chunk, 'string')
    } else if (chunk.startsWith('$') || /^-?\d/.test(chunk)) {
      pushToken(tokens, chunk, 'type')
    } else if (chunk.startsWith('@')) {
      pushToken(tokens, chunk, 'keyword')
    } else if (!/^[A-Za-z_]/.test(chunk)) {
      pushToken(tokens, chunk, 'punctuation')
    } else if (
      (isFirstWord && GRAPHQL_KEYWORDS.includes(chunk as (typeof GRAPHQL_KEYWORDS)[number])) ||
      (chunk === 'on' && previousWord !== '')
    ) {
      pushToken(tokens, chunk, 'keyword')
    } else if (GRAPHQL_OPERATIONS.includes(previousWord as (typeof GRAPHQL_OPERATIONS)[number])) {
      pushToken(tokens, chunk, 'function')
    } else if (GRAPHQL_LITERALS.includes(chunk as (typeof GRAPHQL_LITERALS)[number])) {
      pushToken(tokens, chunk, 'type')
    } else if (/^\s*\(/.test(rest)) {
      pushToken(tokens, chunk, 'function')
    } else if (/^[A-Z]/.test(chunk)) {
      pushToken(tokens, chunk, 'type')
    } else {
      pushToken(tokens, chunk, 'identifier')
    }

    previousWord = /^[A-Za-z_]/.test(chunk) ? chunk : ''
    isFirstWord = false
  }

  return tokens.length ? tokens : [{ text: line || ' ', type: 'identifier' }]
}

const JSON_LITERALS = ['true', 'false', 'null'] as const

const JSONC_LINE_COMMENT = /\/\//y

const highlightJsonLine = (line: string): CodeBlockHighlightToken[] => {
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

const SQL_LINE_COMMENT = /--/y

const highlightSqlLine = (line: string): CodeBlockHighlightToken[] => {
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

const PYTHON_LINE_COMMENT = /#/y

const highlightPythonLine = (line: string): CodeBlockHighlightToken[] => {
  const tokens: CodeBlockHighlightToken[] = []
  const pythonRegex =
    /[rRbBfF]{0,2}(?:'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")|@[A-Za-z_][\w.]*|-?\b\d+(?:\.\d+)?\b|[A-Za-z_]\w*|[{}[\]().,:;=<>!+\-*/%]|\s+|\S/g

  let previousWord = ''
  let match: RegExpExecArray | null

  while ((match = pythonRegex.exec(line)) !== null) {
    const chunk = match[0]
    const rest = line.slice(match.index + chunk.length)

    if (/^\s+$/.test(chunk)) {
      pushToken(tokens, chunk, 'identifier')
      continue
    }

    if (/^[rRbBfF]{0,2}['"]/.test(chunk)) {
      pushToken(tokens, chunk, 'string')
    } else if (chunk.startsWith('@')) {
      pushToken(tokens, chunk, 'keyword')
    } else if (
      /^-?\d/.test(chunk) ||
      PYTHON_LITERALS.includes(chunk as (typeof PYTHON_LITERALS)[number])
    ) {
      pushToken(tokens, chunk, 'type')
    } else if (!/^[A-Za-z_]/.test(chunk)) {
      pushToken(tokens, chunk, 'punctuation')
    } else if (PYTHON_KEYWORDS.includes(chunk as (typeof PYTHON_KEYWORDS)[number])) {
      pushToken(tokens, chunk, 'keyword')
    } else if (PYTHON_DEFINERS.includes(previousWord as (typeof PYTHON_DEFINERS)[number])) {
      pushToken(tokens, chunk, previousWord === 'class' ? 'type' : 'function')
    } else if (/^\s*\(/.test(rest)) {
      pushToken(tokens, chunk, 'function')
    } else if (/^[A-Z]/.test(chunk)) {
      pushToken(tokens, chunk, 'type')
    } else {
      pushToken(tokens, chunk, 'identifier')
    }

    previousWord = /^[A-Za-z_]/.test(chunk) ? chunk : ''
  }

  return tokens.length ? tokens : [{ text: line || ' ', type: 'identifier' }]
}

export const highlightCodeLine = (
  language: string | undefined,
  line: string
): CodeBlockHighlightToken[] => {
  const lang = (language ?? 'javascript').toLowerCase()

  if (lang === 'javascript' || lang === 'typescript' || lang === 'js' || lang === 'ts') {
    return withLineComment(line, JS_LINE_COMMENT, highlightJavaScriptLine)
  }

  if (
    lang === 'bash' ||
    lang === 'sh' ||
    lang === 'shell' ||
    lang === 'zsh' ||
    lang === 'console'
  ) {
    const prompt = /^\$ /.exec(line)
    if (!prompt) return withLineComment(line, LINE_COMMENT, highlightShellLine)
    const rest = line.slice(prompt[0].length)
    return [
      { text: prompt[0], type: 'prompt' },
      ...(rest ? withLineComment(rest, LINE_COMMENT, highlightShellLine) : [])
    ]
  }

  if (lang === 'hcl' || lang === 'terraform' || lang === 'tf') {
    return withLineComment(line, LINE_COMMENT, highlightHclLine)
  }

  if (lang === 'graphql' || lang === 'gql') {
    return withLineComment(line, LINE_COMMENT, highlightGraphqlLine)
  }

  if (lang === 'json') {
    return highlightJsonLine(line)
  }

  if (lang === 'jsonc') {
    return withLineComment(line, JSONC_LINE_COMMENT, highlightJsonLine)
  }

  if (lang === 'sql' || lang === 'sqlite' || lang === 'postgresql' || lang === 'postgres') {
    return withLineComment(line, SQL_LINE_COMMENT, highlightSqlLine)
  }

  if (lang === 'python' || lang === 'py') {
    return withLineComment(line, PYTHON_LINE_COMMENT, highlightPythonLine)
  }

  if (lang === 'markdown' || lang === 'md') {
    return [{ text: line || ' ', type: 'comment' }]
  }

  return withLineComment(line, LINE_COMMENT, (code) => [{ text: code || ' ', type: 'identifier' }])
}

export const highlightCode = (
  code: string,
  language: string | undefined
): CodeBlockHighlightToken[][] => code.split('\n').map((line) => highlightCodeLine(language, line))

export const plainLines = (code: string): CodeBlockHighlightToken[][] =>
  code.split('\n').map((line) => [{ text: line || ' ', type: 'output' }])

export const formatLineNumber = (lineNumber: number): string => String(lineNumber).padStart(2, '0')
