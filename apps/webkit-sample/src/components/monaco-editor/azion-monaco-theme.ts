import type * as Monaco from 'monaco-editor'

/**
 * Monaco owns its DOM and paints from a JS theme object of literal hex colors — it
 * cannot read `var(--token)` the way the CodeMirror theme does. The project's token rule
 * still holds: not a single color is written here. Every value is READ at runtime from
 * the custom properties `@aziontech/theme` declares on `html[data-theme]`, so the theme
 * remains the only source of truth and a token change lands here for free.
 *
 * Because the tokens are read from the live document, one theme name is enough: flipping
 * `html[data-theme]` re-reads the new values and redefines the same theme, which Monaco
 * applies immediately to every mounted editor.
 */

/** The single theme name registered with Monaco. */
export const AZION_MONACO_THEME = 'azion'

/** Reads a custom property as currently resolved on the document element. */
function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/**
 * Monaco's `rules[].foreground` is parsed as a bare 6-digit hex — no `#`, no alpha.
 * Anything else throws, so a token that does not resolve is dropped instead.
 */
function ruleColor(name: string): string | undefined {
  const match = /^#([0-9a-f]{6})/i.exec(token(name))
  return match ? match[1] : undefined
}

/** Monaco's `colors` map takes `#RRGGBB` or `#RRGGBBAA`; the alpha tokens rely on it. */
function uiColor(name: string): string | undefined {
  const value = token(name)
  return /^#([0-9a-f]{6}|[0-9a-f]{8})$/i.test(value) ? value : undefined
}

/**
 * Monaco token scopes grouped onto the theme's dedicated syntax tokens.
 *
 * Scope matching is longest-prefix, so `keyword` covers `keyword.js`, `keyword.ts`, and
 * every other per-language suffix. The language-specific scopes listed here are the ones
 * `vs` / `vs-dark` themselves define more specifically (`delimiter.html`,
 * `attribute.value.number`, `string.value.json`, …) — without an equally specific rule of
 * our own, the built-in one would win and paint a color no token can reach.
 */
const RULES: { scopes: string[]; token?: string; fontStyle?: string }[] = [
  // The empty scope is the theme's default foreground — anything not matched below.
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
  // Errors read on the surface, so they take the readable danger foreground, not the
  // `--danger` surface tint.
  { scopes: ['invalid'], token: '--danger-contrast' },
  // Carried over explicitly: with `inherit: false` these would otherwise be lost.
  { scopes: ['emphasis'], fontStyle: 'italic' },
  { scopes: ['strong'], fontStyle: 'bold' }
]

/** Monaco color ids mapped onto the theme's semantic surface tokens. */
const COLORS: Record<string, string> = {
  'editor.background': '--bg-surface',
  'editor.foreground': '--text-default',
  'editorCursor.foreground': '--text-default',
  // `--bg-hover` is a darkening overlay in dark mode (#00000033), so on a dark canvas the
  // active-line fill alone is invisible. The border carries it there: `--border-default`
  // is a light overlay in dark and a faint dark one in light, so the current line reads
  // in both themes without inventing a value.
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
  // Overlays. Monaco resolves any color id left unset from its own registry defaults, and
  // those defaults are VS Code's palette — so every surface a user can actually open
  // (suggest, hover, find, context menu, command palette) is pinned here. The audit that
  // produced this list checked the resolved `--vscode-*` variables, not just the editor.
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
  // The find widget's text field, and the focus ring every widget shares.
  'input.background': '--bg-surface',
  'input.foreground': '--text-default',
  'input.border': '--border-default',
  'input.placeholderForeground': '--text-muted',
  focusBorder: '--ring-color',
  'editor.findMatchBackground': '--bg-selected',
  'editor.findMatchBorder': '--border-strong',
  'editor.findMatchHighlightBackground': '--bg-hover',
  'editor.findRangeHighlightBackground': '--bg-hover',
  // Lists inside those widgets (suggest rows, quick-pick rows).
  'list.hoverBackground': '--bg-hover',
  'list.hoverForeground': '--text-default',
  'list.focusBackground': '--bg-selected',
  'list.focusForeground': '--text-default',
  'list.highlightForeground': '--text-link',
  'list.focusHighlightForeground': '--text-link',
  // Right-click menu and the F1 palette.
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
  // The completion list draws one icon per symbol kind, each from its own color id —
  // VS Code's purple/orange/blue set. Grouped here onto the syntax tokens so the kind
  // signal survives while the palette stays the design system's.
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
  // Peeked problems (F8), inlay hints, code lens, ruler.
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
  // `--danger` / `--warning` are surface tints (light: #F9D2D2 / #FCE49C). The readable
  // foreground of each pair is the `-contrast` token — a squiggle drawn in the surface
  // tint would be invisible on `--bg-surface`.
  'editorError.foreground': '--danger-contrast',
  'editorWarning.foreground': '--warning-contrast',
  'editorInfo.foreground': '--text-link',
  // Bracket-pair colorization paints from a hardcoded rainbow palette that no syntax
  // rule can reach — it is a color id, not a token scope. Every level is pinned to the
  // punctuation token so brackets read like the rest of the delimiters, and only an
  // unmatched bracket breaks out, in the danger color.
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

/**
 * Defines (or redefines) the Azion theme from the tokens currently on the document, and
 * makes it the active theme. Call it after mount and again on every `data-theme` change.
 */
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

  // `inherit: false` is the point of this whole file. With inheritance on, every scope no
  // rule here matches keeps the `vs` / `vs-dark` color — and worse, a built-in rule that
  // is MORE specific than ours wins outright (`delimiter.html` #383838 beat `delimiter`,
  // `attribute.value` #0451A5 beat `attribute.name`). Turning it off means the syntax
  // palette is exactly the tokens above and nothing else.
  monaco.editor.defineTheme(AZION_MONACO_THEME, { base, inherit: false, rules, colors })
  monaco.editor.setTheme(AZION_MONACO_THEME)
}

/** The code font, resolved from the theme — Monaco takes a font stack, not a `var()`. */
export function monacoFontFamily(): string {
  return token('--font-code') || 'monospace'
}

/**
 * The code type scale in pixels. Monaco's `fontSize` is a number, so the `rem` token is
 * resolved against the root font size — same source of truth as the `text-label-code-*`
 * utilities the CodeMirror editor inherits, so the two editors render at one size.
 */
export function monacoFontSize(size: 'small' | 'medium' | 'large'): number {
  const scale = { small: 'sm', medium: 'md', large: 'lg' }[size]
  return monacoSpacing(`--text-label-code-${scale}-font-size`) || 14
}

/**
 * A spacing token in the pixels Monaco's layout options require. `rem` tokens are scaled
 * by the root font size so the editor keeps the same rhythm as the rest of the page.
 */
export function monacoSpacing(name: string): number {
  const value = token(name)
  const amount = Number.parseFloat(value)
  if (Number.isNaN(amount)) return 0
  if (value.endsWith('rem')) {
    return amount * Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
  }
  return amount
}
