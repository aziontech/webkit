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
 * `textWrapStyle` — the LONGHAND, never the `textWrap` shorthand. `text-wrap: pretty`
 * is `text-wrap-mode: wrap` + `text-wrap-style: pretty`, so a typography utility
 * written that way does not just choose how lines break: it decides THAT the text
 * wraps, and it beats `truncate` / `whitespace-nowrap` on the same element (equal
 * specificity, and this utility sorts later). Every `truncate text-body-sm` in the
 * codebase therefore wrapped to two lines with an ellipsis that never appeared —
 * measurably, table rows grew from 48px to 56px wherever a cell's text was longer
 * than its column. The longhand keeps the balance/pretty intent and leaves wrapping
 * to whoever owns the element.
 *
 * Mapping used during the port:
 *   old `large`  (≤640) → `_`
 *   old `medium` (≤768) → `sm` (≥640)
 *   old `mobile` (default, applied >768) → `md` (≥768)
 */

import { curve, duration } from '../primitives/animations/animate.js'
import { fontFamily } from '../primitives/typography/font-family.js'
import { fontSize } from '../primitives/typography/font-size.js'
import { fontWeight } from '../primitives/typography/font-weight.js'
import { leading } from '../primitives/typography/leading.js'
import { tracking } from '../primitives/typography/tracking.js'

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
    textWrapStyle: 'balance',
    fontSize: { _: fontSize['3xl'], sm: fontSize['5xl'], md: fontSize['6xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.light
  },
  'text-heading-xl': {
    textWrapStyle: 'balance',
    fontSize: { _: fontSize.xl, sm: fontSize['3xl'], md: fontSize['4xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.light
  },
  'text-heading-lg': {
    textWrapStyle: 'balance',
    fontSize: { _: fontSize.lg, md: fontSize['3xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.light
  },
  'text-heading-md': {
    textWrapStyle: 'balance',
    fontSize: { _: fontSize.base, sm: fontSize.xl, md: fontSize['2xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.light
  },
  'text-heading-sm': {
    textWrapStyle: 'balance',
    fontSize: { _: fontSize.sm, sm: fontSize.base, md: fontSize.lg },
    lineHeight: leading.snug,
    fontWeight: fontWeight.light
  },
  'text-heading-xs': {
    textWrapStyle: 'balance',
    fontSize: fontSize.base,
    lineHeight: leading.snug,
    fontWeight: fontWeight.light
  },
  'text-heading-xxs': {
    textWrapStyle: 'balance',
    fontSize: fontSize.sm,
    lineHeight: leading.snug,
    fontWeight: fontWeight.light
  },
  'text-label-lg': {
    fontSize: fontSize.base,
    lineHeight: leading.normal,
    fontWeight: fontWeight.normal
  },
  'text-label-md': {
    fontSize: fontSize.sm,
    lineHeight: leading.normal,
    fontWeight: fontWeight.normal
  },
  'text-label-sm': {
    fontSize: fontSize.xs,
    lineHeight: leading.normal,
    fontWeight: fontWeight.normal
  },
  'text-label-code-sm': {
    fontFamily: fontFamily.code,
    fontSize: fontSize.xs,
    lineHeight: leading.none,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.normal
  },
  'text-body-code-sm': {
    textWrapStyle: 'pretty',
    fontFamily: fontFamily.code,
    fontSize: fontSize.xs,
    lineHeight: leading.relaxed,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.normal
  },
  'text-label-code-md': {
    fontFamily: fontFamily.code,
    fontSize: fontSize.sm,
    lineHeight: leading.none,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.normal
  },
  'text-label-code-lg': {
    fontFamily: fontFamily.code,
    fontSize: fontSize.base,
    lineHeight: leading.none,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.normal
  },
  'text-body-lg': {
    textWrapStyle: 'pretty',
    fontSize: { _: fontSize.base, md: fontSize.lg },
    fontWeight: fontWeight.light,
    lineHeight: leading.snug
  },
  'text-body-md': {
    textWrapStyle: 'pretty',
    fontSize: fontSize.base,
    fontWeight: fontWeight.light,
    lineHeight: leading.snug
  },
  'text-body-sm': {
    textWrapStyle: 'pretty',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.light,
    lineHeight: leading.snug
  },
  'text-body-xs': {
    textWrapStyle: 'pretty',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.light,
    lineHeight: leading.snug
  },
  'text-body-xxs': {
    textWrapStyle: 'pretty',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.light,
    lineHeight: leading.normal
  },
  'text-tag-sm': {
    fontSize: fontSize.xs,
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal
  },
  'text-tag-md': {
    fontSize: fontSize.xs,
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal
  },
  'text-overline-md': {
    fontFamily: fontFamily.display,
    fontSize: { _: fontSize.xs, sm: fontSize.sm },
    lineHeight: leading.snug,
    letterSpacing: tracking.widest,
    textTransform: 'uppercase'
  },
  'text-overline-sm': {
    fontFamily: fontFamily.display,
    fontSize: fontSize.xs,
    lineHeight: leading.snug,
    letterSpacing: tracking.widest,
    textTransform: 'uppercase'
  },
  'text-overline-xs': {
    fontFamily: fontFamily.display,
    fontSize: fontSize.xs,
    lineHeight: leading.snug,
    letterSpacing: tracking.widest,
    textTransform: 'uppercase'
  },
  'text-button-lg': {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: leading.tight,
    letterSpacing: tracking.normal
  },
  'text-button-md': {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    lineHeight: leading.tight,
    letterSpacing: tracking.normal
  },
  /** Inline `<a>` in body/heading — inherits parent size; not the navigation Link component. */
  'text-link': {
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'var(--text-link)',
    borderRadius: 'var(--shape-elements)',
    transition: `all ${duration['fast-02']} ${curve['productive-entrance']}`,
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
