/**
 * Declarative text style tokens (mobile-first).
 *
 * Each entry is a bundle of CSS properties; each property is either a string
 * (static) or a breakpoint map `{ _, sm, md, lg, xl, 2xl }`. Values ported
 * from the legacy `texts.js` plugin — direction inverted from desktop-first
 * (max-width) to mobile-first (min-width).
 *
 * Mapping used during the port:
 *   old `large`  (≤640) → `_`
 *   old `medium` (≤768) → `sm` (≥640)
 *   old `mobile` (default, applied >768) → `md` (≥768)
 *
 * Font families reference primitive tokens (`font-family.js` → `--font-sans`,
 * `--font-display`) so stacks stay centralized.
 */

const fontSans = 'var(--font-sans)'
const fontDisplay = 'var(--font-display)'

export const textsData = {
  'text-big-number-md': {
    fontFamily: fontSans,
    fontSize: { _: '1.25rem', sm: '1.5rem', md: '2.25rem' },
    lineHeight: '1.20'
  },
  'text-big-number-sm': {
    fontFamily: fontSans,
    fontSize: { _: '1rem', sm: '1.25rem' },
    lineHeight: '1.20'
  },
  'text-big-number-lg': {
    fontFamily: fontSans,
    fontSize: { _: '1.5rem', sm: '2.25rem', md: '3.75rem' },
    lineHeight: '1.20'
  },
  'text-heading-2xl': {
    fontFamily: fontSans,
    fontSize: { _: '1.875rem', sm: '3rem', md: '3.75rem' },
    lineHeight: '1.2'
  },
  'text-heading-xl': {
    fontFamily: fontSans,
    fontSize: { _: '1.25rem', sm: '1.875rem', md: '2.25rem' },
    lineHeight: '1.2'
  },
  'text-heading-lg': {
    fontFamily: fontSans,
    fontSize: { _: '1.125rem', md: '1.875rem' },
    lineHeight: '1.2'
  },
  'text-heading-md': {
    fontFamily: fontSans,
    fontSize: { _: '1rem', sm: '1.25rem', md: '1.5rem' },
    lineHeight: '1.2'
  },
  'text-heading-sm': {
    fontFamily: fontSans,
    fontSize: { _: '0.875rem', sm: '1rem', md: '1.125rem' },
    lineHeight: '1.2'
  },
  'text-body-lg': {
    fontFamily: fontSans,
    fontSize: { _: '1rem', md: '1.125rem' },
    lineHeight: '1.5'
  },
  'text-body-md': {
    fontFamily: fontSans,
    fontSize: '1rem',
    lineHeight: '1.5'
  },
  'text-body-sm': {
    fontFamily: fontSans,
    fontSize: '0.875rem',
    lineHeight: '1.5'
  },
  'text-body-xs': {
    fontFamily: fontSans,
    fontSize: '0.75rem',
    lineHeight: '1.5'
  },
  'text-body-xxs': {
    fontFamily: fontSans,
    fontSize: '0.75rem',
    lineHeight: '1.5'
  },
  'text-label-sm': {
    fontFamily: fontSans,
    fontSize: '0.75rem',
    lineHeight: '1'
  },
  'text-label-md': {
    fontFamily: fontSans,
    fontSize: '0.875rem',
    lineHeight: '1'
  },
  'text-label-lg': {
    fontFamily: fontSans,
    fontSize: '1rem',
    lineHeight: '1'
  },
  'text-overline-md': {
    fontFamily: fontDisplay,
    fontSize: { _: '0.75rem', sm: '0.875rem' },
    lineHeight: '1.4',
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
  },
  'text-overline-sm': {
    fontFamily: fontDisplay,
    fontSize: '0.75rem',
    lineHeight: '1.4',
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
  },
  'text-overline-xs': {
    fontFamily: fontDisplay,
    fontSize: '0.625rem',
    lineHeight: '1.4',
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
  },
  'text-button-lg': {
    fontFamily: fontSans,
    fontSize: '0.875rem',
    fontWeight: '600',
    lineHeight: '1',
    letterSpacing: '0'
  },
  'text-button-md': {
    fontFamily: fontDisplay,
    fontSize: '0.75rem',
    fontWeight: '500',
    lineHeight: '1',
    letterSpacing: '0'
  }
}

export default { textsData }
