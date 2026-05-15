/**
 * Declarative spacing tokens (mobile-first).
 *
 * Each value maps to two utilities: `.gap-<key>` and `.p-<key>`, both backed
 * by the same CSS variable. Values ported from `spacings.js`.
 */

export const spacingsData = {
  'spacing-elements-xxl': { _: '2rem', sm: '4rem', xl: '6rem' },
  'spacing-elements-xl': { _: '1.5rem', sm: '2rem', xl: '3rem' },
  'spacing-elements-lg': { _: '1rem', sm: '1.5rem' },
  'spacing-elements-md': { _: '1rem' },
  'spacing-elements-sm': { _: '0.75rem' },
  'spacing-elements-xs': { _: '0.5rem' },
  'spacing-elements-xxs': { _: '0.25rem' },
};

export default { spacingsData };
