export type CodeEditorHighlightTokenType =
  | 'keyword'
  | 'string'
  | 'function'
  | 'type'
  | 'punctuation'
  | 'identifier'
  | 'comment'

export type CodeEditorHighlightToken = {
  text: string
  type: CodeEditorHighlightTokenType
}

const TOKEN_CLASS: Record<CodeEditorHighlightTokenType, string> = {
  keyword: 'text-[var(--code-sintax-keyword)]',
  string: 'text-[var(--code-sintax-string)]',
  function: 'text-[var(--code-sintax-function)]',
  type: 'text-[var(--code-sintax-type)]',
  punctuation: 'text-[var(--code-sintax-punctuation)]',
  identifier: 'text-[var(--code-sintax-identifier)]',
  comment: 'text-[var(--code-sintax-punctuation)]'
}

export const getHighlightTokenClass = (type: CodeEditorHighlightTokenType): string =>
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

const pushToken = (
  tokens: CodeEditorHighlightToken[],
  text: string,
  type: CodeEditorHighlightTokenType
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

const highlightJavaScriptLine = (line: string): CodeEditorHighlightToken[] => {
  const tokens: CodeEditorHighlightToken[] = []
  const keywordRegex = new RegExp(
    `\\b(?:${JS_KEYWORDS.join('|')})\\b|[{}\\[\\]().,:;=<>]|'(?:\\\\'|[^'])*'|"(?:\\\\"|[^"])*"|\\b[A-Z][A-Za-z0-9_]*\\b|\\b[a-zA-Z_$][\\w$]*\\b|\\s+|[^\\s]+`,
    'g'
  )

  let previousChunk = ''
  let match: RegExpExecArray | null

  while ((match = keywordRegex.exec(line)) !== null) {
    const chunk = match[0]

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

export const highlightCodeLine = (
  language: string | undefined,
  line: string
): CodeEditorHighlightToken[] => {
  const lang = (language ?? 'javascript').toLowerCase()

  if (lang === 'javascript' || lang === 'typescript' || lang === 'js' || lang === 'ts') {
    return highlightJavaScriptLine(line)
  }

  return [{ text: line || ' ', type: 'identifier' }]
}

export const highlightCode = (
  code: string,
  language: string | undefined
): CodeEditorHighlightToken[][] => code.split('\n').map((line) => highlightCodeLine(language, line))

export const formatLineNumber = (lineNumber: number): string => String(lineNumber).padStart(2, '0')
