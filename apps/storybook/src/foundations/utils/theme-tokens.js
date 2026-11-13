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
    id: 'chart',
    title: 'Data Viz',
    description:
      'Chart colors. Six categorical series in a fixed order plus Other, the chart chrome, the inverse tooltip, a sequential ramp, a diverging pair and status aliases. Marks bind these to SVG fill and stroke; text never wears a series color.',
    match: (n) => /^--chart-/.test(n)
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
  '--bg-placeholder':
    'Translucent fill for loading placeholders (skeletons, image stand-ins) — composites over any surface.',
  '--bg-placeholder-highlight': 'Sweep highlight passing over a loading placeholder.',
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
  '--code-sintax-comment': 'Comments, and prose rendered inside a code block.',
  '--code-sintax-function': 'Function and method names.',
  '--code-sintax-type': 'Types and classes.',
  '--code-sintax-string': 'String literals.',

  '--chart-series-1': 'First categorical series. Assigned in declaration order, never cycled.',
  '--chart-series-2': 'Second categorical series.',
  '--chart-series-3': 'Third categorical series.',
  '--chart-series-4': 'Fourth categorical series.',
  '--chart-series-5': 'Fifth categorical series.',
  '--chart-series-6': 'Sixth categorical series. A seventh folds into Other.',
  '--chart-series-other': 'The folded tail past six series, and de-emphasised context.',
  '--chart-grid': 'Hairline gridlines inside the plot.',
  '--chart-axis': 'The baseline and axis rule.',
  '--chart-label': 'Tick and axis labels.',
  '--chart-crosshair': 'The vertical hairline that tracks the pointer.',
  '--chart-tooltip-bg': 'The inverse tooltip surface. Every series clears 3:1 on it.',
  '--chart-tooltip-text': 'Values and labels inside the tooltip.',
  '--chart-tooltip-muted': 'Secondary text inside the tooltip.',
  '--chart-sequential-1': 'Sequential ramp, lowest magnitude.',
  '--chart-sequential-2': 'Sequential ramp, step 2.',
  '--chart-sequential-3': 'Sequential ramp, step 3.',
  '--chart-sequential-4': 'Sequential ramp, step 4.',
  '--chart-sequential-5': 'Sequential ramp, step 5.',
  '--chart-sequential-6': 'Sequential ramp, step 6.',
  '--chart-sequential-7': 'Sequential ramp, highest magnitude.',
  '--chart-diverging-negative': 'Diverging scale, below the midpoint.',
  '--chart-diverging-neutral': 'Diverging scale midpoint. Reads as nothing.',
  '--chart-diverging-positive': 'Diverging scale, above the midpoint.',
  '--chart-status-success': 'A series whose color means healthy.',
  '--chart-status-warning': 'A series whose color means degraded.',
  '--chart-status-danger': 'A series whose color means failed or blocked.',
  '--chart-status-info': 'A series whose color means informational.'
}

// A token's swatch style: filled by default; borders draw an outline; foreground
// (text / -contrast) roles render an "Aa" glyph on the surface (or on their base).
function swatchKind(name) {
  if (/^--border-/.test(name) || /-border$/.test(name) || name === '--ring-color') return 'border'
  if (/^--chart-(grid|axis|crosshair)$/.test(name)) return 'border'
  if (/^--text-/.test(name) || /-contrast$/.test(name) || /^--code-sintax-/.test(name)) return 'text'
  if (/^--chart-(label|tooltip-text|tooltip-muted)$/.test(name)) return 'text'
  return 'fill'
}

// For -contrast foregrounds, back the glyph with the base fill it sits on.
function backing(name) {
  if (/^--chart-tooltip-(text|muted)$/.test(name)) return 'var(--chart-tooltip-bg)'
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

export const chartColorGroup = themeColorGroups.find((group) => group.id === 'chart')
