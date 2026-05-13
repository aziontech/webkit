/**
 * Foundations / Colors — data layer
 *
 * Single source of truth for color token data consumed by documentation stories.
 * All values are resolved at import time from @aziontech/theme/tokens.
 */

import {
  primitives,
  surfacePrimitives,
  brandPrimitives,
} from '@aziontech/theme/tokens';

// ─── Primitive Colors ─────────────────────────────────────────────────────────

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export const PRIMITIVE_FAMILIES = [
  { name: 'neutral', label: 'Neutral', role: 'Surfaces & text baseline' },
  { name: 'orange',  label: 'Orange',  role: 'Primary brand'            },
  { name: 'violet',  label: 'Violet',  role: 'Accent / secondary brand' },
  { name: 'green',   label: 'Green',   role: 'Success states'           },
  { name: 'red',     label: 'Red',     role: 'Danger / error states'    },
  { name: 'yellow',  label: 'Yellow',  role: 'Warning states'           },
  { name: 'blue',    label: 'Blue',    role: 'Links & informational'    },
  { name: 'slate',   label: 'Slate',   role: 'Secondary UI'             },
  { name: 'gray',    label: 'Gray',    role: 'General purpose neutral'  },
];

export const primitiveColors = PRIMITIVE_FAMILIES.map(({ name, label, role }) => ({
  name,
  label,
  role,
  shades: SHADES
    .filter((shade) => primitives[name]?.[shade] !== undefined)
    .map((shade) => ({
      shade: String(shade),
      hex:    primitives[name][shade],
      cssVar: `--primitives-${name}-${shade}`,
    })),
}));

export const backgroundTokens = [];
export const textTokens = [];
export const borderTokens = [];
