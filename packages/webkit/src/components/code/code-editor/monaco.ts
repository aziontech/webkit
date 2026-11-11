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

/** Builds the Monaco theme from the design tokens resolved on `element`. */
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

/** Font settings for Monaco from the `.text-body-code-sm` typography tokens. */
export function fontFromTokens(element: Element) {
  const style = getComputedStyle(element)
  const root = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  const raw = style.getPropertyValue('--text-body-code-sm-font-size').trim()
  const amount = parseFloat(raw)
  const fontSize = Number.isNaN(amount) ? 12 : raw.endsWith('rem') ? amount * root : amount
  const factor = parseFloat(style.getPropertyValue('--text-body-code-sm-line-height')) || 1.625
  const family = style.getPropertyValue('--text-body-code-sm-font-family').trim()
  return {
    fontFamily: family ? `${family}, monospace` : 'monospace',
    fontSize,
    lineHeight: Math.round(fontSize * factor)
  }
}
