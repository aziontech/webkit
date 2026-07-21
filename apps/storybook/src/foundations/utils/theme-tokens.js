/**
 * Semantic theme color catalog — generated from the `theme/*` token layer
 * (resolved against `primitives/`), so it can never drift from what ships in
 * `@aziontech/theme/globals.css`.
 *
 * `compileThemeVars()` resolves `tokens/theme/*` (background, border, text,
 * primary, secondary, accent, ring, code-sintax, feedback/*, surfaces) against
 * the color primitives, producing the component-facing theme set: `--bg-*`,
 * `--primary*`, `--accent*`, `--secondary*`, `--border-*`, `--text-*`,
 * `--ring-color`, feedback `--{info,success,warning,danger}{,-contrast,-border}`,
 * and `--code-sintax-*`. We keep only color-valued tokens, drop the `--surface-*`
 * primitive scale (documented on the Colors page), and group by role. Each token
 * carries its resolved `light` and `dark` value.
 *
 * Tokens from `tokens/semantic/*` are intentionally NOT sourced here.
 */
import { compileThemeVars } from '@aziontech/theme/theme-colors'

const isColor = (value) => typeof value === 'string' && /^#([0-9a-f]{3,8})$/i.test(value.trim())

// The surface scale is a primitive-level scale documented on the Colors page.
const isExcluded = (name) => /^--surface-/.test(name)

/** Resolve the theme layer into one { name: { light, dark } } map. */
function buildResolvedMap() {
  const { light, dark } = compileThemeVars()

  const map = {}
  for (const name of new Set([...Object.keys(light), ...Object.keys(dark)])) {
    if (isExcluded(name)) continue
    const l = light[name]
    const d = dark[name]
    if (!isColor(l) && !isColor(d)) continue
    map[name] = { light: l ?? d, dark: d ?? l }
  }

  return map
}

// Ordered sections. First matching predicate wins; the trailing catch-all
// guarantees a newly-added token always surfaces somewhere.
const SECTIONS = [
  {
    id: 'backgrounds',
    title: 'Backgrounds',
    description:
      'Surface and page backgrounds. Use --bg-canvas for pages and --bg-surface for elements on top; -raised / -overlay add elevation, and the state tokens (hover, active, selected, disabled) layer on interaction.',
    match: (n) => /^--bg-/.test(n)
  },
  {
    id: 'text',
    title: 'Text & Icons',
    description: 'Accessible foreground colors for text and icons.',
    match: (n) => /^--text-/.test(n)
  },
  {
    id: 'borders',
    title: 'Borders',
    description: 'Border colors for component outlines, separators and status surfaces.',
    match: (n) => /^--border-/.test(n)
  },
  {
    id: 'brand',
    title: 'Brand & Interactive',
    description:
      'Brand and interactive fills. Each role pairs a base color with a -contrast foreground for accessible content on top, plus -mask / -selected tints.',
    match: (n) => /^--(primary|secondary|accent)(-|$)/.test(n)
  },
  {
    id: 'feedback',
    title: 'Feedback Colors',
    description:
      'Status colors for info, success, warning and danger. Each set pairs a subtle background with an accessible -contrast foreground and a -border.',
    match: (n) => /^--(info|success|warning|danger)(-|$)/.test(n)
  },
  {
    id: 'focus',
    title: 'Focus',
    description: 'Focus-ring color for keyboard navigation.',
    match: (n) => /^--ring(-|$)/.test(n)
  },
  {
    id: 'code',
    title: 'Code Syntax',
    description: 'Syntax-highlighting colors for the CodeBlock component.',
    match: (n) => /^--code-sintax-/.test(n)
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Additional semantic color tokens.',
    match: () => true
  }
]

// Human-readable notes, keyed by token name. Missing entries render without a note.
const DESCRIPTIONS = {
  '--bg-canvas': 'Body / page background.',
  '--bg-surface': 'Primary element background (cards, panels).',
  '--bg-surface-raised': 'Raised element background — one step above the surface.',
  '--bg-surface-overlay': 'Floating surface for menus, popovers and dropdowns.',
  '--bg-hover': 'Hover overlay for interactive surfaces.',
  '--bg-active': 'Active / pressed overlay for interactive surfaces.',
  '--bg-selected': 'Background for a selected element.',
  '--bg-disabled': 'Background for a disabled element.',
  '--bg-mask': 'Scrim placed over content to dim it.',
  '--bg-backdrop': 'Dialog / modal backdrop.',
  '--bg-contrast': 'High-contrast inverse background.',

  '--text-default': 'Primary text and icons.',
  '--text-muted': 'Secondary text and icons.',
  '--text-disabled': 'Disabled text and icons.',
  '--text-link': 'Interactive link text.',
  '--text-contrast': 'Text and icons on a high-contrast surface.',

  '--border-default': 'Default border for UI components.',
  '--border-muted': 'Subtle, low-emphasis border.',
  '--border-strong': 'High-emphasis border.',
  '--border-selected': 'Border for a selected / active element.',

  '--primary': 'Primary action / brand fill.',
  '--primary-contrast': 'Text and icons on a primary fill.',
  '--primary-mask': 'Translucent primary tint for hover / wash.',
  '--primary-selected': 'Primary tint for a selected state.',
  '--secondary': 'Secondary fill.',
  '--secondary-contrast': 'Text and icons on a secondary fill.',
  '--secondary-mask': 'Translucent secondary tint for hover / wash.',
  '--secondary-selected': 'Secondary tint for a selected state.',
  '--accent': 'Accent fill.',
  '--accent-contrast': 'Text and icons on an accent fill.',
  '--accent-mask': 'Translucent accent tint for hover / wash.',
  '--accent-selected': 'Accent tint for a selected state.',

  '--info': 'Informational background.',
  '--info-contrast': 'Text and icons on an info background.',
  '--info-border': 'Border for info surfaces.',
  '--success': 'Success background.',
  '--success-contrast': 'Text and icons on a success background.',
  '--success-border': 'Border for success surfaces.',
  '--warning': 'Warning background.',
  '--warning-contrast': 'Text and icons on a warning background.',
  '--warning-border': 'Border for warning surfaces.',
  '--danger': 'Danger / error background.',
  '--danger-contrast': 'Text and icons on a danger background.',
  '--danger-border': 'Border for danger surfaces.',

  '--ring-color': 'Focus ring around a focused element.',

  '--code-sintax-identifier': 'Identifiers (variables, properties).',
  '--code-sintax-line-number': 'Gutter line numbers.',
  '--code-sintax-keyword': 'Language keywords.',
  '--code-sintax-punctuation': 'Punctuation and operators.',
  '--code-sintax-function': 'Function and method names.',
  '--code-sintax-type': 'Types and classes.',
  '--code-sintax-string': 'String literals.'
}

// A token's swatch style: filled by default; borders draw an outline; foreground
// (text / -contrast) roles render an "Aa" glyph on the surface (or on their base).
function swatchKind(name) {
  if (/^--border-/.test(name) || /-border$/.test(name) || name === '--ring-color') return 'border'
  if (/^--text-/.test(name) || /-contrast$/.test(name) || /^--code-sintax-/.test(name)) return 'text'
  return 'fill'
}

// For -contrast foregrounds, back the glyph with the base fill it sits on.
function backing(name) {
  const base = name.replace(/-contrast$/, '')
  if (base !== name) return `var(${base})`
  return null
}

export function buildThemeColorGroups() {
  const resolved = buildResolvedMap()
  const groups = SECTIONS.map((s) => ({ ...s, items: [] }))

  for (const name of Object.keys(resolved).sort()) {
    const section = groups.find((g) => g.match(name))
    section.items.push({
      name,
      light: resolved[name].light,
      dark: resolved[name].dark,
      description: DESCRIPTIONS[name] ?? '',
      kind: swatchKind(name),
      on: backing(name)
    })
  }

  return groups.filter((g) => g.items.length > 0).map(({ match, ...g }) => g)
}

export const themeColorGroups = buildThemeColorGroups()
