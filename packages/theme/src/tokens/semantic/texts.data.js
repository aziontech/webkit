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

export const textsData = {
  'text-big-number-md': {
    fontSize: { _: '1.25rem', sm: '1.5rem', md: '2.25rem' },
    lineHeight: '1.20',
    fontFamily: fontFamily.display
  },
  'text-big-number-sm': {
    fontSize: { _: '1rem', sm: '1.25rem' },
    lineHeight: '1.20',
    fontFamily: fontFamily.display
  },
  'text-big-number-lg': {
    fontSize: { _: '1.5rem', sm: '2.25rem', md: '3.75rem' },
    lineHeight: '1.20',
    fontFamily: fontFamily.display
  },
  'text-heading-2xl': {
    fontSize: { _: '1.875rem', sm: '3rem', md: '3.75rem' },
    lineHeight: '1.2'
  },
  'text-heading-xl': {
    fontSize: { _: '1.25rem', sm: '1.875rem', md: '2.25rem' },
    lineHeight: '1.2'
  },
  'text-heading-lg': {
    fontSize: { _: '1.125rem', md: '1.875rem' },
    lineHeight: '1.2'
  },
  'text-heading-md': {
    fontSize: { _: '1rem', sm: '1.25rem', md: '1.5rem' },
    lineHeight: '1.2'
  },
  'text-heading-sm': {
    fontSize: { _: '0.875rem', sm: '1rem', md: '1.125rem' },
    lineHeight: '1.2'
  },
  'text-label-lg': {
    fontSize: '1rem',
    lineHeight: '1.5',
    fontWeight: '500'
  },
  'text-label-md': {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    fontWeight: '500'
  },
  'text-label-sm': {
    fontSize: '0.75rem',
    lineHeight: '1.5',
    fontWeight: '500'
  },
  'text-body-lg': {
    fontSize: { _: '1rem', md: '1.125rem' },
    lineHeight: '1.5'
  },
  'text-body-md': {
    fontSize: '1rem',
    lineHeight: '1.5'
  },
  'text-body-sm': {
    fontSize: '0.875rem',
    lineHeight: '1.5'
  },
  'text-body-xs': {
    fontSize: '0.75rem',
    lineHeight: '1.5'
  },
  'text-body-xxs': {
    fontSize: '0.625rem',
    lineHeight: '1.5'
  },
  'text-overline-md': {
    fontFamily: fontFamily.display,
    fontSize: { _: '0.75rem', sm: '0.875rem' },
    lineHeight: '1.4',
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
  },
  'text-overline-sm': {
    fontFamily: fontFamily.display,
    fontSize: '0.75rem',
    lineHeight: '1.4',
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
  },
  'text-overline-xs': {
    fontFamily: fontFamily.display,
    fontSize: '0.625rem',
    lineHeight: '1.4',
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
  },
  'text-button-lg': {
    fontFamily: fontFamily.sans,
    fontSize: '0.875rem',
    fontWeight: '600',
    lineHeight: '1',
    letterSpacing: '0'
  },
  'text-button-md': {
    fontFamily: fontFamily.sans,
    fontSize: '0.75rem',
    fontWeight: '600',
    lineHeight: '1',
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
