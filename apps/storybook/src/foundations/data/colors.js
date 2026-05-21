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
  textSemantic,
  backgroundSemantic,
  borderSemantic,
  resolveRefsToCssVars,
} from '@aziontech/theme/tokens';

// Resolve all token refs to concrete hex values for both modes
const { light: lightVars, dark: darkVars } = resolveRefsToCssVars({
  primitives,
  surfacePrimitives,
  brandPrimitives,
  textSemantic,
  backgroundSemantic,
  borderSemantic,
});

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

// ─── Semantic Tokens ──────────────────────────────────────────────────────────

const TOKEN_DESCRIPTIONS = {
  background: {
    surface:        'Main content areas — cards, panels, sidebars',
    surfaceRaised:  'Elevated surfaces — modals, dropdowns, tooltips',
    surfaceOverlay: 'Overlay panel backgrounds',
    canvas:         'Page / app root background',
    primary:        'Brand primary interactive fill',
    primaryHover:   'Primary fill hover state',
    danger:         'Error / destructive state fill',
    dangerHover:    'Danger hover state',
    warning:        'Warning state fill',
    warningHover:   'Warning hover state',
    success:        'Success state fill',
    successHover:   'Success hover state',
    backdrop:       'Modal / overlay backdrop',
  },
  text: {
    default:      'Primary text content',
    muted:        'Secondary / supporting text',
    link:         'Interactive link text',
    linkHover:    'Link hover state',
    code:         'Code / monospace text',
    primary:      'Brand-colored text',
    primaryHover: 'Brand text hover',
    accent:       'Accent (violet) text',
    accentHover:  'Accent hover state',
    danger:       'Error / destructive text',
    dangerHover:  'Danger text hover',
    warning:      'Warning text',
    warningHover: 'Warning hover',
    success:      'Success text',
    successHover: 'Success hover',
  },
  border: {
    default:      'Standard borders and dividers',
    subtle:       'Lightweight / low-contrast borders',
    strong:       'High-contrast borders',
    primary:      'Brand-colored borders',
    primaryHover: 'Primary border hover',
    accent:       'Accent-colored borders',
    accentHover:  'Accent border hover',
    danger:       'Error state borders',
    dangerHover:  'Danger border hover',
    warning:      'Warning state borders',
    warningHover: 'Warning border hover',
    success:      'Success state borders',
    successHover: 'Success border hover',
  },
};

/**
 * Build a resolved token data array for a semantic category.
 * Tailwind class names match the semantic-colors-plugin (no camelCase → kebab conversion).
 */
const buildTokens = (semanticLight, category, tailwindPrefix) =>
  Object.keys(semanticLight).map((key) => ({
    name:          key,
    cssVar:        `--${category}-${key}`,
    tailwindClass: `${tailwindPrefix}-${key}`,
    description:   TOKEN_DESCRIPTIONS[category]?.[key] ?? '',
    lightHex:      lightVars[`--${category}-${key}`] ?? null,
    darkHex:       darkVars[`--${category}-${key}`]  ?? null,
  }));

export const backgroundTokens = buildTokens(backgroundSemantic.light, 'background', 'bg');
export const textTokens        = buildTokens(textSemantic.light,       'text',       'text');
export const borderTokens      = buildTokens(borderSemantic.light,     'border',     'border');
