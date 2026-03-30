/**
 * Color token data for Foundations/Colors documentation.
 * Dynamically sourced from @aziontech/theme/tokens — no hardcoded values.
 */

import {
  createCssVars,
  primitives,
  brandPrimitives,
  surfacePrimitives,
  textSemantic,
  backgroundSemantic,
  borderSemantic,
} from '@aziontech/theme/tokens'

const { light, dark } = createCssVars()

// ─── Usage descriptions ──────────────────────────────────────────────────────

const textUsage = {
  default: 'Primary text content',
  muted: 'Secondary / supporting text',
  link: 'Interactive link text',
  code: 'Code and monospace text',
  linkHover: 'Hovered link text',
  primary: 'Brand primary — CTAs and highlights',
  primaryHover: 'Hovered primary text',
  accent: 'Accent / violet highlight',
  accentHover: 'Hovered accent text',
  danger: 'Error and destructive states',
  dangerHover: 'Hovered danger text',
  warning: 'Warning / caution states',
  warningHover: 'Hovered warning text',
  success: 'Success and positive states',
  successHover: 'Hovered success text',
}

const backgroundUsage = {
  surfaceRaised: 'Elevated surface — cards, panels',
  surfaceOverlay: 'Floating overlay — tooltips, dropdowns',
  surface: 'Base surface — page body',
  canvas: 'Outermost page canvas',
  primary: 'Brand primary background',
  primaryHover: 'Hovered primary background',
  danger: 'Error / danger background',
  dangerHover: 'Hovered danger background',
  warning: 'Warning background',
  warningHover: 'Hovered warning background',
  success: 'Success background',
  successHover: 'Hovered success background',
  backdrop: 'Modal / dialog backdrop overlay',
}

const borderUsage = {
  default: 'Standard divider border',
  subtle: 'Subtle / low-contrast border',
  strong: 'High-contrast border',
  primary: 'Brand primary border',
  primaryHover: 'Hovered primary border',
  accent: 'Accent brand border',
  accentHover: 'Hovered accent border',
  danger: 'Error / destructive border',
  dangerHover: 'Hovered danger border',
  warning: 'Warning border',
  warningHover: 'Hovered warning border',
  success: 'Success border',
  successHover: 'Hovered success border',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildSemanticRows(semanticMap, cssVarPrefix, tailwindPrefix, usageMap) {
  return Object.keys(semanticMap.light).map((key) => ({
    name: `${tailwindPrefix}${key}`,
    cssVar: `--${cssVarPrefix}${key}`,
    tailwindClass: `${tailwindPrefix}${key}`,
    lightValue: light[`--${cssVarPrefix}${key}`] ?? 'N/A',
    darkValue: dark[`--${cssVarPrefix}${key}`] ?? 'N/A',
    usage: usageMap[key] ?? '',
  }))
}

// ─── Primitive color groups ───────────────────────────────────────────────────
// Ordered for display (most commonly used first)

const PRIMITIVE_ORDER = ['neutral', 'orange', 'violet', 'red', 'green', 'blue', 'yellow', 'gray', 'slate']

export const primitiveColorGroups = PRIMITIVE_ORDER
  .filter((family) => primitives[family])
  .map((family) => ({
    group: family.charAt(0).toUpperCase() + family.slice(1),
    tokens: Object.entries(primitives[family]).map(([shade, value]) => ({
      name: `${family}-${shade}`,
      value,
    })),
  }))

// ─── Surface scale ────────────────────────────────────────────────────────────

export const surfaceColorGroup = {
  group: 'Surface (Neutral aliases)',
  description: 'Surface tokens alias the neutral palette and form the layered elevation system.',
  tokens: Object.entries(surfacePrimitives.surface).map(([shade, value]) => ({
    name: `surface-${shade}`,
    value,
  })),
}

// ─── Brand color groups ───────────────────────────────────────────────────────

export const brandColorGroups = [
  {
    group: 'Primary (Orange)',
    description: 'Used for interactive elements, CTAs, and brand accents.',
    tokens: Object.entries(brandPrimitives.primary).map(([shade, value]) => ({
      name: `primary-${shade}`,
      value,
    })),
  },
  {
    group: 'Accent (Violet)',
    description: 'Used for secondary highlights and accent states.',
    tokens: Object.entries(brandPrimitives.accent).map(([shade, value]) => ({
      name: `accent-${shade}`,
      value,
    })),
  },
  {
    group: 'Absolute',
    description: 'Fixed white/black extremes — always the same in both themes.',
    tokens: Object.entries(brandPrimitives.absolute).map(([name, value]) => ({
      name,
      value,
    })),
  },
]

// ─── Semantic color groups ────────────────────────────────────────────────────
// Resolved hex values for both light and dark themes.

export const semanticColorGroups = [
  {
    group: 'Text',
    description: 'Consumed via Tailwind as `text-{name}`. Controls font color.',
    rows: buildSemanticRows(textSemantic, 'text-', 'text-', textUsage),
  },
  {
    group: 'Background',
    description: 'Consumed via Tailwind as `bg-{name}`. Controls background color.',
    rows: buildSemanticRows(backgroundSemantic, 'background-', 'bg-', backgroundUsage),
  },
  {
    group: 'Border',
    description: 'Consumed via Tailwind as `border-{name}`. Controls border color.',
    rows: buildSemanticRows(borderSemantic, 'border-', 'border-', borderUsage),
  },
]
