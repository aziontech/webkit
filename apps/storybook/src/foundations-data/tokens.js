/**
 * Color token data for Foundations/Colors documentation.
 * Dynamically sourced from @aziontech/theme/tokens — no hardcoded values.
 */

import {
  primitives,
  brandPrimitives,
  surfacePrimitives,
} from '@aziontech/theme/tokens'


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
    rows: [],
  },
  {
    group: 'Background',
    description: 'Consumed via Tailwind as `bg-{name}`. Controls background color.',
    rows: [],
  },
  {
    group: 'Border',
    description: 'Consumed via Tailwind as `border-{name}`. Controls border color.',
    rows: [],
  },
]
