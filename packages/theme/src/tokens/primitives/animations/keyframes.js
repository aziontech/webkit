/**
 * Raw `@keyframes` definitions used by `--animate-*` in `animate.js`.
 *
 * Consumed by `scripts/build-tokens.mjs` to emit real `@keyframes` blocks
 * in the Tailwind v4 `dist/v4/globals.css` output. Tailwind v4 registers
 * the utility via `@theme { --animate-<name>: ... }`, but does not
 * generate the `@keyframes` — those live here.
 *
 * Values are plain CSS-style declarations (strings), not the camelCase
 * object form used by the legacy v3 plugin — this way the build script
 * can serialize them verbatim.
 */

export const keyframes = {
  fadeIn: {
    '0%': 'opacity: 0',
    '100%': 'opacity: 1'
  },
  fadeOut: {
    '0%': 'opacity: 1',
    '100%': 'opacity: 0'
  },
  slideDown: {
    '0%': 'height: 0',
    '100%': 'height: auto'
  },
  blink: {
    '0%, 100%': 'opacity: 1',
    '50%': 'opacity: 0'
  },
  highlight: {
    '0%': 'background-color: var(--surface-hover); font-weight: 500',
    '100%': 'background-color: var(--surface-hover); font-weight: 500'
  },
  shimmer: {
    '0%': 'background-position: 200% 0',
    '100%': 'background-position: -200% 0'
  },
  popupScaleIn: {
    '0%': 'opacity: 0; transform: scale(0.9)',
    '100%': 'opacity: 1; transform: scale(1)'
  },
  popupScaleOut: {
    '0%': 'opacity: 1; transform: scale(1)',
    '100%': 'opacity: 0; transform: scale(0.9)'
  },
  slideInLeft: {
    '0%': 'transform: translateX(-100%)',
    '100%': 'transform: translateX(0)'
  },
  slideOutLeft: {
    '0%': 'transform: translateX(0)',
    '100%': 'transform: translateX(-100%)'
  },
  slideInRight: {
    '0%': 'transform: translateX(100%)',
    '100%': 'transform: translateX(0)'
  },
  slideOutRight: {
    '0%': 'transform: translateX(0)',
    '100%': 'transform: translateX(100%)'
  },
  progressIndeterminate: {
    '0%': 'inset-inline-start: -35%; inset-inline-end: 100%',
    '60%': 'inset-inline-start: 100%; inset-inline-end: -90%',
    '100%': 'inset-inline-start: 100%; inset-inline-end: -90%'
  },
  progressIndeterminateShort: {
    '0%': 'inset-inline-start: -200%; inset-inline-end: 100%',
    '60%': 'inset-inline-start: 107%; inset-inline-end: -8%',
    '100%': 'inset-inline-start: 107%; inset-inline-end: -8%'
  },
  // Marching dashes along an SVG stroke — the "flowing connection" of a node-based
  // diagram. The travel distance is 24, so the loop is seamless for any
  // `stroke-dasharray` whose cycle DIVIDES 24 (`4 4` = 8, `2 4` = 6, `8 4` = 12): the
  // pattern lands exactly where it started. A cycle that does not divide 24 (`5 5` = 10)
  // visibly jumps on repeat.
  flowDash: {
    '0%': 'stroke-dashoffset: 24',
    '100%': 'stroke-dashoffset: 0'
  }
}

/**
 * Utilities that need CSS properties beyond the `animation` shorthand
 * emitted by Tailwind v4 from `--animate-*`. Serialized into
 * `@layer components` in `dist/v4/globals.css`.
 */
export const animateExtras = {
  'animate-popup-scale-in': { 'transform-origin': 'var(--popup-origin, center)' },
  'animate-popup-scale-out': { 'transform-origin': 'var(--popup-origin, center)' }
}

export default { keyframes, animateExtras }
