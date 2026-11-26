import type { CodeEditorMonacoTheme } from '../monaco'

export const CODE_EDITOR_THEME = 'ui'

const RULES: { scopes: string[]; token: string; fontStyle?: string }[] = [
  { scopes: [''], token: '--code-syntax-identifier' },
  {
    scopes: ['keyword', 'keyword.json', 'keyword.flow', 'constant.language', 'predefined'],
    token: '--code-syntax-keyword'
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
    token: '--code-syntax-string'
  },
  {
    scopes: ['number', 'number.float', 'number.hex', 'constant', 'type', 'type.identifier', 'tag'],
    token: '--code-syntax-type'
  },
  {
    scopes: ['function', 'entity.name.function', 'support.function', 'annotation'],
    token: '--code-syntax-function'
  },
  {
    scopes: ['identifier', 'variable', 'attribute.name', 'key', 'string.key.json'],
    token: '--code-syntax-identifier'
  },
  {
    scopes: ['delimiter', 'delimiter.bracket', 'delimiter.parenthesis', 'operator'],
    token: '--code-syntax-punctuation'
  },
  { scopes: ['comment', 'comment.doc'], token: '--code-syntax-comment', fontStyle: 'italic' },
  { scopes: ['invalid'], token: '--danger-foreground' }
]

const COLORS: Record<string, string> = {
  'editor.background': '--bg-surface',
  'editor.foreground': '--code-syntax-identifier',
  'editorCursor.foreground': '--text-default',
  'editor.lineHighlightBackground': '--bg-hover',
  'editor.selectionBackground': '--bg-selected',
  'editor.inactiveSelectionBackground': '--bg-hover',
  'editor.wordHighlightBackground': '--bg-hover',
  'editorBracketMatch.background': '--bg-selected',
  'editorBracketMatch.border': '--border-strong',
  'editorLineNumber.foreground': '--code-syntax-line-number',
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
  'editorError.foreground': '--danger-foreground',
  'editorWarning.foreground': '--warning-foreground',
  'editorInfo.foreground': '--info-foreground',
  'editorOverviewRuler.errorForeground': '--danger-foreground',
  'editorOverviewRuler.warningForeground': '--warning-foreground',
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

function readToken(element: Element, name: string): string | undefined {
  const value = getComputedStyle(element).getPropertyValue(name).trim()
  return HEX.test(value) ? expand(value).toLowerCase() : undefined
}

function isDark(hex: string | undefined): boolean {
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
