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
  // ── ARRIVALS ──
  //
  // The two entrances an app shell needs, and they are a PAIR: a page arriving, and
  // content arriving inside a page that is already there. Never run both on one
  // element at once — the page's own entrance is the only one it gets (see `useWhen`
  // in ./animate.js).
  //
  // `pageEnter` travels along +X: it starts one layout boundary step to the LEFT of
  // where it lands and moves right into place while it fades up. The direction is the
  // whole point — navigation lives on the left edge of an app shell, so a page that
  // arrives from that edge reads as coming FROM the row that was clicked. A plain fade
  // has no origin, and a page arriving from the right reads as going BACK. Override
  // `--page-enter-distance` where a shell's inset is not the boundary token.
  //
  // NEITHER fills forwards, deliberately: an animation with no fill leaves NO
  // `translate` on the element once it ends. That matters for `pageEnter`, whose box is
  // usually the scroll container — a lingering transform would make it a containing
  // block for any `position: fixed` descendant and change what its sticky children
  // measure against.
  pageEnter: {
    '0%': 'opacity: 0; translate: calc(var(--page-enter-distance, var(--layout-boundary-inline)) * -1) 0',
    '100%': 'opacity: 1; translate: 0 0'
  },
  // Rises a hair instead of travelling: the page is already in place and only what is
  // inside it changed, so a second horizontal slide would re-announce the whole page.
  // Stagger a follower with `--content-enter-delay` (one `fast-01` is the house step)
  // so a two-column block assembles in reading order instead of popping as one slab.
  contentEnter: {
    '0%': 'opacity: 0; translate: 0 var(--spacing-xs)',
    '100%': 'opacity: 1; translate: 0 0'
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
  },
  // The rim light travelling around an illustration's edges. The ramp is lit at both
  // ends of its axis, so it repeats every HALF turn — 135° → 315° is one full visual
  // cycle and lands exactly where it started. A full 360° would replay the same cycle
  // twice per iteration, at double the speed for the same duration token.
  illustrationRimSweep: {
    '0%': '--illustration-rim-angle: 135deg',
    '100%': '--illustration-rim-angle: 315deg'
  },
  // A conversation advancing inside an illustrated window — one direction, bottom to top, the
  // way a chat moves when answers keep arriving.
  //
  // It STEPS rather than drifts: four holds, and between them a short slide of exactly one
  // message. A chat does not glide; it sits still until something arrives and then jumps. The
  // hold is also what the pop below needs — a message has to land somewhere still.
  //
  // The track it drives must be exactly TWICE its viewport (`h-[200%]`), hold FOUR messages per
  // screenful, and repeat those messages in its second half: each step is then 12.5% of the
  // track (one message), and after four steps the track shows the copy, pixel-identical to where
  // it started, so the loop has no seam. Equal-height messages are load-bearing here — the step
  // is a fixed 12.5%, so a taller message would drift out of phase with it. Length is carried by
  // the bubbles' WIDTH instead.
  illustrationChatScroll: {
    '0%, 18%': 'transform: translateY(0)',
    '25%, 43%': 'transform: translateY(-12.5%)',
    '50%, 68%': 'transform: translateY(-25%)',
    '75%, 93%': 'transform: translateY(-37.5%)',
    '100%': 'transform: translateY(-50%)'
  },
  // Each message landing in the gap that step just opened at the bottom. It runs on the SAME
  // duration as the scroll and is offset per message with a negative delay, so its pop fires on
  // the step boundary — the instant the slide finishes and that message is standing still, whole
  // and in view, at the bottom of the transcript. The rest of the cycle is a flat hold.
  //
  // One long keyframe with a 4% pop, rather than a short animation, because a short one would
  // have to be re-triggered once per pass and CSS has nothing to trigger it with. Phase-locking
  // two loops of equal duration is the same trick from the other side.
  illustrationChatPop: {
    '0%': 'opacity: 0; transform: scale(0.9)',
    '4%': 'opacity: 1; transform: scale(1)',
    '100%': 'opacity: 1; transform: scale(1)'
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
