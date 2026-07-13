/**
 * Declarative container tokens (mobile-first).
 *
 * Each entry maps a token key to a breakpoint map. `_` is the default;
 * any other key must exist in tokens/primitives/breakpoints.js.
 *
 * Values are ported from the legacy `containers.js` plugin. The `xl` bucket
 * used to be wrapped in `@media (max-width: xl)` — orphan / never matched
 * cleanly — and was corrected to `min-width` here.
 */

export const containersData = {
  px: { _: '1rem', sm: '2.5rem', xl: '0' },
  py: { _: '4rem', sm: '8rem', xl: '12rem' },
  'max-width': { _: '28rem', sm: '64rem', xl: '80rem' }
}

export default { containersData }
