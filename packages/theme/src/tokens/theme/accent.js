import { tokenRef } from '../../scripts/refs.js'

// The accent family points at the BLUE primitive ramp (`primitives.blue`, the
// #0072F5 hue). These values mirror the Figma Theme collection's `accent/*`
// variables 1-to-1 — Figma is the source of truth, and it already aliases its
// whole `colors/brand/accent/accent-*` ramp onto `colors/blue/*` (it carries no
// violet primitives at all). The violet mapping this replaces existed only here.
//
// Accent is MODE-INVARIANT, exactly as Figma declares it: Light and Dark resolve
// to the same values. `accent-contrast` stays black — black on blue-500 is
// 4.73:1, clearing WCAG AA on the filled accent surface.
//
// `brand.accent` still holds violet values in code and ships as
// `--color-brand-accent-*`; only the semantic `--accent*` group turns blue here.
export const accent = {
  light: {
    accent: tokenRef('primitives.blue.500'),
    'accent-mask': tokenRef('primitives.alpha.blue.100'),
    'accent-selected': tokenRef('primitives.blue.500'),
    'accent-contrast': tokenRef('primitives.base.black')
  },
  dark: {
    accent: tokenRef('primitives.blue.500'),
    'accent-mask': tokenRef('primitives.alpha.blue.100'),
    'accent-selected': tokenRef('primitives.blue.500'),
    'accent-contrast': tokenRef('primitives.base.black')
  }
}

export default { accent }
