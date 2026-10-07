// Animate a region's height across a content change (a wizard step swap, a
// disclosure opening) with tokens only — no animation library.
//
// CSS cannot transition to or from `height: auto`, and `auto` is exactly what the
// region has to be at rest: a card whose height is pinned in JS stops responding to
// a window resize, a font that loads late, or a validation line appearing. So the
// height is only ever measured and pinned for the length of the move, and released
// back to `auto` the moment it lands:
//
//   1. measure the CURRENT height (the region is `auto`, so this is what the user
//      is looking at);
//   2. apply the content change and measure the NEW natural height — still `auto`,
//      and still before the browser paints, so the jump is never seen;
//   3. pin the height back to the OLD value, let that paint, then set the new one:
//      px → px is interpolable, so the region eases between them;
//   4. release to `auto` on `transitionend`, which is what keeps the region
//      responsive afterwards.
//
// Step 2 is the part that is easy to get wrong. The obvious shortcut — pin the old
// height first, then read `scrollHeight` — silently breaks every SHRINK: with a
// height pinned, `scrollHeight` returns the greater of the content and the box, so
// a step that got shorter reports the old height and never animates. Measuring
// while still `auto` is what makes growing and shrinking behave the same.
//
// The two `requestAnimationFrame`s are the same guard `auth-entrance.js` documents:
// a single frame can land in the frame the browser is already painting, so the
// start value is never committed and the move snaps.
import { nextTick, ref } from 'vue'

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

// Long enough to outlast duration-moderate-02 (240ms) with room for a delayed
// frame. A fallback release only matters when `transitionend` never arrives — an
// interrupted transition, a region unmounted mid-move — and its whole job is to
// make sure the height cannot stay pinned.
const RELEASE_FALLBACK_MS = 600

/**
 * @returns {{
 *   region: import('vue').Ref<HTMLElement | null>,
 *   height: import('vue').Ref<string>,
 *   animateHeight: (mutate: () => void) => Promise<void>
 * }}
 *   Bind `region` as the ref of the element to animate and `height` to its inline
 *   height (`''` means `auto`), then make every content change through
 *   `animateHeight`.
 */
export function useAnimatedHeight() {
  const region = ref(null)
  // '' = auto, which is the resting state. Any other value is a move in flight.
  const height = ref('')

  // Releases the run currently in flight, if there is one.
  let release = null

  const animateHeight = async (mutate) => {
    const node = region.value

    // No element yet, or the user asked for no motion: apply the change and leave
    // the height alone entirely.
    if (!node || prefersReducedMotion()) {
      mutate()
      return
    }

    // A second Continue pressed mid-move: land the first one before measuring, so
    // `from` is a real height and not a value the previous run is still easing
    // through.
    release?.()

    const from = node.offsetHeight

    mutate()
    await nextTick() // new content, height still auto — nothing painted yet
    const to = node.offsetHeight

    if (to === from) return // nothing to animate; height stays auto

    height.value = `${from}px`

    let timer = null
    const finish = () => {
      node.removeEventListener('transitionend', onEnd)
      clearTimeout(timer)
      height.value = '' // back to auto — the region is responsive again
      release = null
    }
    const onEnd = (event) => {
      if (event.propertyName === 'height' && event.target === node) finish()
    }

    node.addEventListener('transitionend', onEnd)
    timer = setTimeout(finish, RELEASE_FALLBACK_MS)
    release = finish

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        // Guard against a release that happened between the two frames.
        if (release === finish) height.value = `${to}px`
      })
    )
  }

  return { region, height, animateHeight }
}
