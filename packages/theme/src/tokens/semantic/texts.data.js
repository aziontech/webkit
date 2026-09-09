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
  // ── The amount ladder (Currency) ─────────────────────────────────────────
  //
  // The three sizes `Currency` typesets a monetary amount at, one per reading
  // distance: `sm` inside a table row or list cell, `md` an amount stated as a fact on
  // a card, `lg` the headline figure of a pricing card. Each MIRRORS the heading/label
  // token it used to borrow (`text-label-lg`, `text-heading-md`, `text-heading-2xl`) —
  // same size ramp, same leading, same weight — and adds the one thing that made
  // borrowing wrong: the amount's negative tracking.
  //
  // `-0.08em` is PROPORTIONAL, and deliberately so, which is why it lives here and not
  // in `tracking.js`. That scale is absolute (`rem`) on purpose so a step resolves to a
  // fixed measure at any font size (see its docstring), and it therefore holds no
  // `-0.08em`-equivalent step. A figure is the one place where the tracking has to
  // scale WITH the glyphs: the Figma amount specifies −1.28px @16px, −1.92px @24px and
  // −4.48px @56px, which is one ratio, not three steps. Expressing it as `em` is what
  // makes a single declaration correct at all three sizes and at every breakpoint of
  // `lg`'s responsive ramp.
  //
  // Dedicated tokens rather than tracking added to the borrowed ones: `text-heading-2xl`
  // sets every hero headline in the system, and a hero is prose, not a numeral.
  'text-amount-lg': {
    textWrapStyle: 'balance',
    fontSize: { _: fontSize['3xl'], sm: fontSize['5xl'], md: fontSize['6xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal,
    letterSpacing: '-0.08em'
  },
  'text-amount-md': {
    textWrapStyle: 'balance',
    fontSize: { _: fontSize.base, sm: fontSize.xl, md: fontSize['2xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal,
    letterSpacing: '-0.08em'
  },
  'text-amount-sm': {
    fontSize: fontSize.base,
    lineHeight: leading.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: '-0.08em'
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
    fontSize: { _: fontSize.base, md: fontSize.lg },
    fontWeight: fontWeight.normal,
    lineHeight: leading.snug
  },
  'text-body-md': {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: leading.snug
  },
  'text-body-prose-md': {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: leading.relaxed
  },
  'text-body-sm': {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: leading.snug
  },
  'text-body-xs': {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    lineHeight: leading.snug
  },
  'text-body-xxs': {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
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
