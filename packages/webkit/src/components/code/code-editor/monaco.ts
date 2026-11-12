export interface CodeEditorDisposable {
  dispose(): void
}

/** The part of a Monaco text model CodeEditor uses. */
export interface CodeEditorMonacoModel extends CodeEditorDisposable {
  getValue(): string
  setValue(value: string): void
  onDidChangeContent(listener: (event: unknown) => void): CodeEditorDisposable
  getLineMaxColumn?(line: number): number
}

/** The part of a Monaco code editor CodeEditor uses. */
export interface CodeEditorMonacoEditor extends CodeEditorDisposable {
  getModel(): CodeEditorMonacoModel | null
  setModel(model: CodeEditorMonacoModel | null): void
  updateOptions(options: Record<string, unknown>): void
  focus(): void
  setPosition(position: { lineNumber: number; column: number }): void
  revealLineInCenter(line: number): void
}

/** The part of a Monaco diff editor CodeEditor uses. */
export interface CodeEditorMonacoDiffEditor extends CodeEditorDisposable {
  setModel(model: { original: CodeEditorMonacoModel; modified: CodeEditorMonacoModel }): void
  getModifiedEditor(): CodeEditorMonacoEditor
  getOriginalEditor?(): CodeEditorMonacoEditor
  updateOptions(options: Record<string, unknown>): void
}

/** A Monaco theme definition. */
export interface CodeEditorMonacoTheme {
  base: 'vs' | 'vs-dark' | 'hc-black' | 'hc-light'
  inherit: boolean
  rules: { token: string; foreground?: string; fontStyle?: string }[]
  colors: Record<string, string>
}

/** The structural subset of the `monaco-editor` module that CodeEditor needs. */
export interface CodeEditorMonaco {
  editor: {
    create(element: HTMLElement, options?: Record<string, unknown>): CodeEditorMonacoEditor
    createDiffEditor(
      element: HTMLElement,
      options?: Record<string, unknown>
    ): CodeEditorMonacoDiffEditor
    createModel(value: string, language?: string, uri?: unknown): CodeEditorMonacoModel
    defineTheme(name: string, theme: CodeEditorMonacoTheme): void
    setTheme(name: string): void
    setModelMarkers(model: CodeEditorMonacoModel, owner: string, markers: object[]): void
    setModelLanguage?(model: CodeEditorMonacoModel, language: string): void
  }
  MarkerSeverity: { Error: number; Warning: number; Info: number }
  Uri?: { parse(value: string): unknown }
  languages?: CodeEditorMonacoLanguages
}

/** A registered language; Monaco's built-in languages carry a `loader` for their Monarch grammar. */
export interface CodeEditorMonacoLanguage {
  id: string
  loader?: () => Promise<{ language?: unknown }>
}

/** The part of `monaco.languages` CodeEditor uses to colour function calls. */
export interface CodeEditorMonacoLanguages {
  getLanguages(): CodeEditorMonacoLanguage[]
  setMonarchTokensProvider(languageId: string, language: object): unknown
}

/** What `loader` resolves to: the module itself or a module with a default export. */
export type CodeEditorMonacoModule = CodeEditorMonaco | { default: CodeEditorMonaco }

export const CODE_EDITOR_THEME = 'webkit'

const RULES: { scopes: string[]; token: string; fontStyle?: string }[] = [
  { scopes: [''], token: '--code-sintax-identifier' },
  {
    scopes: ['keyword', 'keyword.json', 'keyword.flow', 'constant.language', 'predefined'],
    token: '--code-sintax-keyword'
  },
  {
    scopes: [
      'string',
      'string.escape',
      'string.sql',
      'string.yaml',
      'string.value.json',
      'attribute.value',
      'regexp'
    ],
    token: '--code-sintax-string'
  },
  {
    scopes: ['number', 'number.float', 'number.hex', 'constant', 'type', 'type.identifier', 'tag'],
    token: '--code-sintax-type'
  },
  {
    scopes: ['function', 'entity.name.function', 'support.function', 'annotation'],
    token: '--code-sintax-function'
  },
  {
    scopes: ['identifier', 'variable', 'attribute.name', 'key', 'string.key.json'],
    token: '--code-sintax-identifier'
  },
  {
    scopes: ['delimiter', 'delimiter.bracket', 'delimiter.parenthesis', 'operator'],
    token: '--code-sintax-punctuation'
  },
  { scopes: ['comment', 'comment.doc'], token: '--code-sintax-comment', fontStyle: 'italic' },
  { scopes: ['invalid'], token: '--danger-contrast' }
]

const COLORS: Record<string, string> = {
  'editor.background': '--bg-surface',
  'editor.foreground': '--code-sintax-identifier',
  'editorCursor.foreground': '--text-default',
  'editor.lineHighlightBackground': '--bg-hover',
  'editor.selectionBackground': '--bg-selected',
  'editor.inactiveSelectionBackground': '--bg-hover',
  'editor.wordHighlightBackground': '--bg-hover',
  'editorBracketMatch.background': '--bg-selected',
  'editorBracketMatch.border': '--border-strong',
  'editorLineNumber.foreground': '--code-sintax-line-number',
  'editorLineNumber.activeForeground': '--text-default',
  'editorGutter.background': '--bg-canvas',
  'editorIndentGuide.background1': '--border-default',
  'editorWhitespace.foreground': '--border-default',
  'editorWidget.background': '--bg-surface-raised',
  'editorWidget.foreground': '--text-default',
  'editorWidget.border': '--border-default',
  'editorSuggestWidget.background': '--bg-surface-raised',
  'editorSuggestWidget.border': '--border-default',
  'editorSuggestWidget.foreground': '--text-default',
  'editorSuggestWidget.selectedBackground': '--bg-selected',
  'editorHoverWidget.background': '--bg-surface-raised',
  'editorHoverWidget.foreground': '--text-default',
  'editorHoverWidget.border': '--border-default',
  'input.background': '--bg-surface',
  'input.foreground': '--text-default',
  'input.border': '--border-default',
  focusBorder: '--ring-color',
  'editor.findMatchBackground': '--bg-selected',
  'editor.findMatchHighlightBackground': '--bg-hover',
  'list.hoverBackground': '--bg-hover',
  'list.focusBackground': '--bg-selected',
  'diffEditor.insertedTextBackground': '--success',
  'diffEditor.removedTextBackground': '--danger',
  'diffEditor.insertedLineBackground': '--success',
  'diffEditor.removedLineBackground': '--danger',
  'editorError.foreground': '--danger-contrast',
  'editorWarning.foreground': '--warning-contrast',
  'editorInfo.foreground': '--info-contrast',
  'editorOverviewRuler.errorForeground': '--danger-contrast',
  'editorOverviewRuler.warningForeground': '--warning-contrast',
  'scrollbarSlider.background': '--bg-selected',
  'scrollbarSlider.hoverBackground': '--bg-hover',
  'scrollbarSlider.activeBackground': '--bg-selected'
}

const CALL_LANGUAGES = ['javascript', 'typescript']

const CALL_RULES: unknown[] = [
  [/(\.)(\s*)([a-zA-Z_$][\w$]*)(?=\s*\()/, ['delimiter', '', 'function']],
  [/#?[a-z_$][\w$]*(?=\s*\()/, { cases: { '@keywords': 'keyword', '@default': 'function' } }],
  [/\b(?:true|false|null|undefined)\b/, 'constant'],
  [/[A-Z][A-Z0-9_$]+(?![\w$])/, 'identifier']
]

interface MonarchGrammar {
  tokenizer: Record<string, unknown[]>
}

const isGrammar = (value: unknown): value is MonarchGrammar =>
  typeof value === 'object' &&
  value !== null &&
  'tokenizer' in value &&
  Array.isArray((value as MonarchGrammar).tokenizer['common'])

export function withCallRules(grammar: MonarchGrammar): MonarchGrammar {
  return {
    ...grammar,
    tokenizer: {
      ...grammar.tokenizer,
      common: [...CALL_RULES, ...(grammar.tokenizer['common'] ?? [])]
    }
  }
}

const highlighted = new WeakMap<object, Promise<void>>()

export function highlightCalls(api: { languages?: CodeEditorMonacoLanguages }): Promise<void> {
  const languages = api.languages
  if (!languages?.getLanguages || !languages.setMonarchTokensProvider) return Promise.resolve()
  const pending = highlighted.get(api)
  if (pending) return pending
  const run = Promise.all(
    languages
      .getLanguages()
      .filter((entry) => CALL_LANGUAGES.includes(entry.id) && entry.loader)
      .map(async (entry) => {
        const grammar = (await entry.loader?.())?.language
        if (isGrammar(grammar)) languages.setMonarchTokensProvider(entry.id, withCallRules(grammar))
      })
  ).then(
    () => undefined,
    () => undefined
  )
  highlighted.set(api, run)
  return run
}

export function padLineNumber(line: number): string {
  return String(line).padStart(2, '0')
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i

const expand = (hex: string) =>
  hex.length === 4
    ? `#${hex
        .slice(1)
        .split('')
        .map((c) => c + c)
        .join('')}`
    : hex

export function readToken(element: Element, name: string): string | undefined {
  const value = getComputedStyle(element).getPropertyValue(name).trim()
  return HEX.test(value) ? expand(value).toLowerCase() : undefined
}

export function isDark(hex: string | undefined): boolean {
  if (!hex) return false
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [
    number,
    number,
    number
  ]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.5
}

export function themeFromTokens(element: Element): CodeEditorMonacoTheme {
  const rules: CodeEditorMonacoTheme['rules'] = []
  for (const rule of RULES) {
    const color = readToken(element, rule.token)
    if (!color) continue
    for (const scope of rule.scopes) {
      rules.push({
        token: scope,
        foreground: color.slice(1, 7),
        ...(rule.fontStyle ? { fontStyle: rule.fontStyle } : {})
      })
    }
  }
  const colors: Record<string, string> = {}
  for (const [id, token] of Object.entries(COLORS)) {
    const color = readToken(element, token)
    if (color) colors[id] = color
  }
  return {
    base: isDark(readToken(element, '--bg-surface')) ? 'vs-dark' : 'vs',
    inherit: true,
    rules,
    colors
  }
}

const appliedThemes = new WeakMap<object, string>()

export function applyThemeOnce(
  api: {
    editor: {
      defineTheme(name: string, theme: CodeEditorMonacoTheme): void
      setTheme(name: string): void
    }
  },
  name: string,
  theme: CodeEditorMonacoTheme
): boolean {
  const key = `${name}:${JSON.stringify(theme)}`
  if (appliedThemes.get(api) === key) return false
  appliedThemes.set(api, key)
  api.editor.defineTheme(name, theme)
  api.editor.setTheme(name)
  return true
}

const CODE_EDITOR_LINE_HEIGHT = 16

const toPixels = (raw: string, root: number, fallback: number): number => {
  const amount = parseFloat(raw)
  if (Number.isNaN(amount) || amount <= 0) return fallback
  return raw.endsWith('rem') ? amount * root : amount
}

export function fontFromTokens(element: Element) {
  const style = getComputedStyle(element)
  const root = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  const fontSize = toPixels(
    style.getPropertyValue('--text-body-code-sm-font-size').trim(),
    root,
    12
  )
  const lineHeight = toPixels(
    style.getPropertyValue('--code-editor-line-height').trim(),
    root,
    CODE_EDITOR_LINE_HEIGHT
  )
  const family = style.getPropertyValue('--text-body-code-sm-font-family').trim()
  return {
    fontFamily: family ? `${family}, monospace` : 'monospace',
    fontSize,
    lineHeight: Math.round(lineHeight)
  }
}
