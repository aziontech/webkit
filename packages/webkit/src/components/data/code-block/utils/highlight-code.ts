export type CodeBlockHighlightTokenType =
  'keyword' | 'string' | 'function' | 'type' | 'punctuation' | 'identifier' | 'comment'

export type CodeBlockHighlightToken = {
  text: string
  type: CodeBlockHighlightTokenType
}

const TOKEN_CLASS: Record<CodeBlockHighlightTokenType, string> = {
  keyword: 'text-(--code-sintax-keyword)',
  string: 'text-(--code-sintax-string)',
  function: 'text-(--code-sintax-function)',
  type: 'text-(--code-sintax-type)',
  punctuation: 'text-(--code-sintax-punctuation)',
  identifier: 'text-(--code-sintax-identifier)',
  comment: 'text-(--code-sintax-comment)'
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

// Shell words that are language, not a program: they read as keywords, the same as
// `const` / `return` do in JavaScript.
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

// The keywords another PROGRAM follows, so the word after them is still a command.
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

const highlightJavaScriptLine = (line: string): CodeBlockHighlightToken[] => {
  const tokens: CodeBlockHighlightToken[] = []
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

// Shell reuses the same seven token types as JavaScript: the program (first word,
// or the word after a pipe/joiner) is `function`, shell language words and flags
// are `keyword`, quoted text is `string`, a variable expansion is `type`, joining
// operators are `punctuation`, and sub-commands / paths / URLs fall to `identifier`.
const highlightShellLine = (line: string): CodeBlockHighlightToken[] => {
  const tokens: CodeBlockHighlightToken[] = []

  // A comment runs to end of line, so it is decided before tokenising anything.
  const commentStart = line.search(/(^|\s)#/)
  if (commentStart !== -1) {
    const before = line.slice(0, commentStart === 0 ? 0 : commentStart + 1)
    const comment = line.slice(before.length)
    if (before) {
      tokens.push(...highlightShellLine(before))
    }
    pushToken(tokens, comment, 'comment')
    return tokens.length ? tokens : [{ text: line || ' ', type: 'comment' }]
  }

  // The catch-all word must stop at a quote and at `$`, or it swallows the value in
  // `TOKEN="$VAR"` as one word and the string/expansion alternatives never get to match.
  const shellRegex =
    /'[^']*'|"(?:\\"|[^"])*"|\$\{[^}]*\}|\$[A-Za-z_][\w]*|&&|\|\||--?[A-Za-z][-\w]*|[|;><()]|\s+|[^\s|;><()'"$]+/g

  // The next non-space word starts a command: true at the start of the line, and again
  // after every operator that begins a new one.
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
      // `sudo curl …` / `then azion …` run a program next; `export FOO=…` does not.
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

export const highlightCodeLine = (
  language: string | undefined,
  line: string
): CodeBlockHighlightToken[] => {
  const lang = (language ?? 'javascript').toLowerCase()

  if (lang === 'javascript' || lang === 'typescript' || lang === 'js' || lang === 'ts') {
    return highlightJavaScriptLine(line)
  }

  if (
    lang === 'bash' ||
    lang === 'sh' ||
    lang === 'shell' ||
    lang === 'zsh' ||
    lang === 'console'
  ) {
    return highlightShellLine(line)
  }

  // Prose in a code block (a markdown snippet, an agent prompt) is commentary, not code:
  // it takes the comment colour as one token rather than being tokenised as identifiers.
  if (lang === 'markdown' || lang === 'md') {
    return [{ text: line || ' ', type: 'comment' }]
  }

  return [{ text: line || ' ', type: 'identifier' }]
}

export const highlightCode = (
  code: string,
  language: string | undefined
): CodeBlockHighlightToken[][] => code.split('\n').map((line) => highlightCodeLine(language, line))

export const formatLineNumber = (lineNumber: number): string => String(lineNumber).padStart(2, '0')
