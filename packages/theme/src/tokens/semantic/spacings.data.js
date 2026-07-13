/**
 * Declarative spacing tokens (mobile-first).
 *
 * Each value maps to two utilities: `.gap-<key>` and `.p-<key>`, both backed
 * by the same CSS variable. Values ported from `spacings.js`.
 */

export const spacingsData = {
  'spacing-xxl': { _: '2rem', sm: '4rem', xl: '6rem' },
  'spacing-xl': { _: '1.5rem', sm: '2rem', xl: '3rem' },
  'spacing-lg': { _: '1rem', sm: '1.5rem' },
  'spacing-md': { _: '1rem' },
  'spacing-sm': { _: '0.75rem' },
  'spacing-xs': { _: '0.5rem' },
  'spacing-xxs': { _: '0.25rem' }
}

export default { spacingsData }
