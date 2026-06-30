/**
 * Declarative text style tokens (mobile-first).
 *
 * Each entry is a bundle of CSS properties; each property is either a string
 * (static) or a breakpoint map `{ _, sm, md, lg, xl, 2xl }`. Values ported
 * from the legacy `texts.js` plugin — direction inverted from desktop-first
 * (max-width) to mobile-first (min-width).
 *
 * Optional `states` emits pseudo-class rules (e.g. `.text-link:hover`). Bundles
 * with `fontSize: 'inherit'` are omitted from the Tailwind `fontSize` preset.
 *
 * Mapping used during the port:
 *   old `large`  (≤640) → `_`
 *   old `medium` (≤768) → `sm` (≥640)
 *   old `mobile` (default, applied >768) → `md` (≥768)
 */

import { fontFamily } from '../primitives/typography/font-family.js'
import { fontSize } from '../primitives/typography/font-size.js'
import { fontWeight } from '../primitives/typography/font-weight.js'
import { leading } from '../primitives/typography/leading.js'

export const textsData = {
  'text-big-number-md': {
    fontSize: { _: fontSize.xl, sm: fontSize['2xl'], md: fontSize['4xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal,
    fontFamily: fontFamily.display
  },
  'text-big-number-sm': {
    fontSize: { _: fontSize.base, sm: fontSize.xl },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal,
    fontFamily: fontFamily.display
  },
  'text-big-number-lg': {
    fontSize: { _: fontSize['2xl'], sm: fontSize['4xl'], md: fontSize['6xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal,
    fontFamily: fontFamily.display
  },
  'text-heading-2xl': {
    fontSize: { _: fontSize['3xl'], sm: fontSize['5xl'], md: fontSize['6xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal
  },
  'text-heading-xl': {
    fontSize: { _: fontSize.xl, sm: fontSize['3xl'], md: fontSize['4xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal
  },
  'text-heading-lg': {
    fontSize: { _: fontSize.lg, md: fontSize['3xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal
  },
  'text-heading-md': {
    fontSize: { _: fontSize.base, sm: fontSize.xl, md: fontSize['2xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal
  },
  'text-heading-sm': {
    fontSize: { _: fontSize.sm, sm: fontSize.base, md: fontSize.lg },
    lineHeight: leading.snug,
    fontWeight: fontWeight.normal
  },
  'text-heading-xs': {
    fontSize: fontSize.base,
    lineHeight: leading.snug,
    fontWeight: fontWeight.normal
  },
  'text-heading-xxs': {
    fontSize: fontSize.sm,
    lineHeight: leading.snug,
    fontWeight: fontWeight.normal
  },
  'text-label-lg': {
    fontSize: fontSize.base,
    lineHeight: leading.normal,
    fontWeight: fontWeight.medium
  },
  'text-label-md': {
    fontSize: fontSize.sm,
    lineHeight: leading.normal,
    fontWeight: fontWeight.medium
  },
  'text-label-sm': {
    fontSize: fontSize.xs,
    lineHeight: leading.normal,
    fontWeight: fontWeight.medium
  },
  'text-body-lg': {
    fontSize: { _: fontSize.base, md: fontSize.lg },
    lineHeight: leading.normal
  },
  'text-body-md': {
    fontSize: fontSize.base,
    lineHeight: leading.normal
  },
  'text-body-sm': {
    fontSize: fontSize.sm,
    lineHeight: leading.normal
  },
  'text-body-xs': {
    fontSize: fontSize.xs,
    lineHeight: leading.normal
  },
  'text-tag-sm': {
    fontSize: fontSize.xs,
    lineHeight: leading.tight,
    fontWeight: fontWeight.semibold
  },
  'text-tag-md': {
    fontSize: fontSize.xs,
    lineHeight: leading.tight,
    fontWeight: fontWeight.semibold
  },
  'text-body-xxs': {
    fontSize: fontSize.xs,
    lineHeight: leading.normal
  },
  'text-overline-md': {
    fontFamily: fontFamily.display,
    fontSize: { _: fontSize.xs, sm: fontSize.sm },
    lineHeight: leading.snug,
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
  },
  'text-overline-sm': {
    fontFamily: fontFamily.display,
    fontSize: fontSize.xs,
    lineHeight: leading.snug,
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
  },
  'text-overline-xs': {
    fontFamily: fontFamily.display,
    fontSize: fontSize.xs,
    lineHeight: leading.snug,
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
  },
  'text-button-lg': {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: leading.tight,
    letterSpacing: '0'
  },
  'text-button-md': {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    lineHeight: leading.tight,
    letterSpacing: '0'
  },
  /** Inline `<a>` in body/heading — inherits parent size; not the navigation Link component. */
  'text-link': {
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'var(--text-link)',
    borderRadius: 'var(--shape-elements)',
    transition: 'all 110ms cubic-bezier(0.39, 0.57, 0.56, 1)',
    states: {
      hover: {
        color: 'var(--text-link-hover)',
        textDecoration: 'underline'
      },
      'focus-visible': {
        outline: '2px solid var(--ring-color)',
        outlineOffset: '2px'
      }
    }
  }
}

export default { textsData }
