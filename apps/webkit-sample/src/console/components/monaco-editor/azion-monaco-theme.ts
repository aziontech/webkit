import type * as Monaco from 'monaco-editor'

export const AZION_MONACO_THEME = 'azion'

function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function ruleColor(name: string): string | undefined {
  const match = /^#([0-9a-f]{6})/i.exec(token(name))
  return match ? match[1] : undefined
}

function uiColor(name: string): string | undefined {
  const value = token(name)
  return /^#([0-9a-f]{6}|[0-9a-f]{8})$/i.test(value) ? value : undefined
}

const RULES: { scopes: string[]; token?: string; fontStyle?: string }[] = [
  { scopes: [''], token: '--code-sintax-identifier' },
  {
    scopes: ['keyword', 'keyword.json', 'keyword.flow', 'constant.language', 'predefined'],
    token: '--code-sintax-keyword'
  },
  {
    scopes: [
      'string',
      'string.escape',
      'string.html',
      'string.sql',
      'string.yaml',
      'string.value.json',
      'string.link',
      'attribute.value',
      'attribute.value.html',
      'attribute.value.xml',
      'regexp',
      'regexp.escape',
      'regexp.escape.control'
    ],
    token: '--code-sintax-string'
  },
  {
    scopes: [
      'number',
      'number.float',
      'number.hex',
      'number.octal',
      'number.binary',
      'constant',
      'attribute.value.number',
      'attribute.value.unit'
    ],
    token: '--code-sintax-type'
  },
  {
    scopes: ['type', 'type.identifier', 'tag', 'tag.id', 'tag.class', 'metatag', 'meta'],
    token: '--code-sintax-type'
  },
  {
    scopes: ['function', 'entity.name.function', 'support.function', 'annotation'],
    token: '--code-sintax-function'
  },
  {
    scopes: [
      'identifier',
      'variable',
      'variable.predefined',
      'attribute.name',
      'key',
      'string.key.json'
    ],
    token: '--code-sintax-identifier'
  },
  {
    scopes: [
      'delimiter',
      'delimiter.bracket',
      'delimiter.parenthesis',
      'delimiter.angle',
      'delimiter.html',
      'delimiter.xml',
      'operator',
      'operator.scss',
      'operator.sql'
    ],
    token: '--code-sintax-punctuation'
  },
  {
    scopes: ['comment', 'comment.doc', 'comment.content'],
    token: '--text-muted',
    fontStyle: 'italic'
  },
  { scopes: ['invalid'], token: '--danger-contrast' },
  { scopes: ['emphasis'], fontStyle: 'italic' },
  { scopes: ['strong'], fontStyle: 'bold' }
]

const COLORS: Record<string, string> = {
  'editor.background': '--bg-surface',
  'editor.foreground': '--text-default',
  'editorCursor.foreground': '--text-default',
  'editor.lineHighlightBackground': '--bg-hover',
  'editor.lineHighlightBorder': '--border-default',
  'editor.selectionBackground': '--bg-selected',
  'editor.inactiveSelectionBackground': '--bg-hover',
  'editor.selectionHighlightBackground': '--bg-hover',
  'editor.wordHighlightBackground': '--bg-hover',
  'editor.wordHighlightStrongBackground': '--bg-selected',
  'editorBracketMatch.background': '--bg-selected',
  'editorBracketMatch.border': '--border-strong',
  'editorOverviewRuler.border': '--border-default',
  'editorLineNumber.foreground': '--code-sintax-line-number',
  'editorLineNumber.activeForeground': '--text-default',
  'editorGutter.background': '--bg-canvas',
  'editorIndentGuide.background1': '--border-default',
  'editorWhitespace.foreground': '--border-default',
  'editorWidget.background': '--bg-surface-raised',
  'editorWidget.foreground': '--text-default',
  'editorWidget.border': '--border-default',
  'widget.border': '--border-default',
  'editorSuggestWidget.background': '--bg-surface-raised',
  'editorSuggestWidget.border': '--border-default',
  'editorSuggestWidget.foreground': '--text-default',
  'editorSuggestWidget.selectedBackground': '--bg-selected',
  'editorSuggestWidget.selectedForeground': '--text-default',
  'editorSuggestWidget.highlightForeground': '--text-link',
  'editorSuggestWidget.focusHighlightForeground': '--text-link',
  'editorHoverWidget.background': '--bg-surface-raised',
  'editorHoverWidget.foreground': '--text-default',
  'editorHoverWidget.border': '--border-default',
  'input.background': '--bg-surface',
  'input.foreground': '--text-default',
  'input.border': '--border-default',
  'input.placeholderForeground': '--text-muted',
  focusBorder: '--ring-color',
  'editor.findMatchBackground': '--bg-selected',
  'editor.findMatchBorder': '--border-strong',
  'editor.findMatchHighlightBackground': '--bg-hover',
  'editor.findRangeHighlightBackground': '--bg-hover',
  'list.hoverBackground': '--bg-hover',
  'list.hoverForeground': '--text-default',
  'list.focusBackground': '--bg-selected',
  'list.focusForeground': '--text-default',
  'list.highlightForeground': '--text-link',
  'list.focusHighlightForeground': '--text-link',
  'menu.background': '--bg-surface-raised',
  'menu.foreground': '--text-default',
  'menu.border': '--border-default',
  'menu.selectionBackground': '--bg-selected',
  'menu.selectionForeground': '--text-default',
  'menu.separatorBackground': '--border-default',
  'quickInput.background': '--bg-surface-raised',
  'quickInput.foreground': '--text-default',
  'quickInputList.focusBackground': '--bg-selected',
  'quickInputList.focusForeground': '--text-default',
  'toolbar.hoverBackground': '--bg-hover',
  'icon.foreground': '--text-default',
  descriptionForeground: '--text-muted',
  'editorGhostText.foreground': '--text-muted',
  'editorLightBulb.foreground': '--warning-contrast',
  'editorLightBulbAutoFix.foreground': '--warning-contrast',
  'symbolIcon.functionForeground': '--code-sintax-function',
  'symbolIcon.methodForeground': '--code-sintax-function',
  'symbolIcon.constructorForeground': '--code-sintax-function',
  'symbolIcon.eventForeground': '--code-sintax-function',
  'symbolIcon.classForeground': '--code-sintax-type',
  'symbolIcon.interfaceForeground': '--code-sintax-type',
  'symbolIcon.structForeground': '--code-sintax-type',
  'symbolIcon.enumeratorForeground': '--code-sintax-type',
  'symbolIcon.typeParameterForeground': '--code-sintax-type',
  'symbolIcon.moduleForeground': '--code-sintax-type',
  'symbolIcon.packageForeground': '--code-sintax-type',
  'symbolIcon.numberForeground': '--code-sintax-type',
  'symbolIcon.booleanForeground': '--code-sintax-type',
  'symbolIcon.nullForeground': '--code-sintax-type',
  'symbolIcon.arrayForeground': '--code-sintax-type',
  'symbolIcon.objectForeground': '--code-sintax-type',
  'symbolIcon.variableForeground': '--code-sintax-identifier',
  'symbolIcon.fieldForeground': '--code-sintax-identifier',
  'symbolIcon.propertyForeground': '--code-sintax-identifier',
  'symbolIcon.constantForeground': '--code-sintax-identifier',
  'symbolIcon.enumeratorMemberForeground': '--code-sintax-identifier',
  'symbolIcon.valueForeground': '--code-sintax-identifier',
  'symbolIcon.keywordForeground': '--code-sintax-keyword',
  'symbolIcon.operatorForeground': '--code-sintax-keyword',
  'symbolIcon.stringForeground': '--code-sintax-string',
  'symbolIcon.textForeground': '--text-muted',
  'symbolIcon.snippetForeground': '--text-muted',
  'symbolIcon.referenceForeground': '--text-muted',
  'symbolIcon.colorForeground': '--text-muted',
  'symbolIcon.fileForeground': '--text-muted',
  'symbolIcon.folderForeground': '--text-muted',
  'symbolIcon.unitForeground': '--text-muted',
  'editorMarkerNavigation.background': '--bg-surface-raised',
  'editorMarkerNavigationError.background': '--danger-contrast',
  'editorMarkerNavigationWarning.background': '--warning-contrast',
  'editorMarkerNavigationInfo.background': '--text-link',
  'editorInlayHint.background': '--bg-selected',
  'editorInlayHint.foreground': '--text-muted',
  'editorCodeLens.foreground': '--text-muted',
  'editorRuler.foreground': '--border-default',
  'editorUnicodeHighlight.border': '--warning-contrast',
  'textLink.foreground': '--text-link',
  'editorLink.activeForeground': '--text-link',
  'progressBar.background': '--primary',
  'editorError.foreground': '--danger-contrast',
  'editorWarning.foreground': '--warning-contrast',
  'editorInfo.foreground': '--text-link',
  'editorBracketHighlight.foreground1': '--code-sintax-punctuation',
  'editorBracketHighlight.foreground2': '--code-sintax-punctuation',
  'editorBracketHighlight.foreground3': '--code-sintax-punctuation',
  'editorBracketHighlight.foreground4': '--code-sintax-punctuation',
  'editorBracketHighlight.foreground5': '--code-sintax-punctuation',
  'editorBracketHighlight.foreground6': '--code-sintax-punctuation',
  'editorBracketHighlight.unexpectedBracket.foreground': '--danger-contrast',
  'editorOverviewRuler.errorForeground': '--danger-contrast',
  'editorOverviewRuler.warningForeground': '--warning-contrast',
  'editorOverviewRuler.infoForeground': '--text-link',
  'scrollbarSlider.background': '--bg-selected',
  'scrollbarSlider.hoverBackground': '--bg-hover',
  'scrollbarSlider.activeBackground': '--bg-selected',
  'scrollbar.shadow': '--border-default',
  'minimap.background': '--bg-surface',
  'editorStickyScroll.background': '--bg-surface'
}

export function applyAzionMonacoTheme(monaco: typeof Monaco, base: 'vs' | 'vs-dark'): void {
  const rules: Monaco.editor.ITokenThemeRule[] = []
  for (const rule of RULES) {
    const foreground = rule.token ? ruleColor(rule.token) : undefined
    if (rule.token && !foreground) continue
    for (const scope of rule.scopes) {
      rules.push({
        token: scope,
        ...(foreground ? { foreground } : {}),
        ...(rule.fontStyle ? { fontStyle: rule.fontStyle } : {})
      })
    }
  }

  const colors: Record<string, string> = {}
  for (const [id, name] of Object.entries(COLORS)) {
    const value = uiColor(name)
    if (value) colors[id] = value
  }

  monaco.editor.defineTheme(AZION_MONACO_THEME, { base, inherit: false, rules, colors })
  monaco.editor.setTheme(AZION_MONACO_THEME)
}

export function monacoFontFamily(): string {
  return token('--font-code') || 'monospace'
}

export function monacoFontSize(size: 'small' | 'medium' | 'large'): number {
  const scale = { small: 'sm', medium: 'md', large: 'lg' }[size]
  return monacoSpacing(`--text-label-code-${scale}-font-size`) || 14
}

export function monacoSpacing(name: string): number {
  const value = token(name)
  const amount = Number.parseFloat(value)
  if (Number.isNaN(amount)) return 0
  if (value.endsWith('rem')) {
    return amount * Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
  }
  return amount
}
