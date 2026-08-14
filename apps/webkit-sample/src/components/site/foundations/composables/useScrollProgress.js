import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * useScrollProgress — where an element sits relative to the viewport, as one number that
 * updates while the page scrolls.
 *
 * `progress` is the signed distance from the element's centre to the viewport's, measured in
 * viewport heights:
 *
 *   +1   a screen below the middle (below the fold, on the way in)
 *    0   centred in the viewport
 *   -1   a screen above the middle (on the way out)
 *
 * One primitive, because scroll-linked motion on this page comes in two shapes and both need
 * the same measurement: the hero's pill rows multiply it by a direction to drift, and the
 * quote band's brand tile maps it to how far it still has to drop before it seats. Anything
 * else — easing, clamping, which axis — belongs to the caller, not here.
 *
 * WHY IT IS SCROLL POSITION AND NOT AN EVENT
 *
 * Position is reversible: scroll back up and the value comes back, so the motion it drives
 * runs both ways instead of firing once and staying fired. An IntersectionObserver would give
 * "it is on screen" — a one-shot boolean — which is a different, weaker thing.
 *
 * HOW IT LISTENS
 *
 * `document` + `capture: true`, not a listener on the scrolling element: a scroll event does
 * not bubble, and the element that scrolls on the marketing pages is SiteLayout's own column,
 * not the window. Capturing on the document catches whichever ancestor actually scrolls
 * without the caller having to know which one that is.
 *
 * Reads are coalesced into one `requestAnimationFrame`: a scroll fires far more often than the
 * screen refreshes, and `getBoundingClientRect` has to run at most once per frame or it
 * thrashes layout.
 *
 * Under `prefers-reduced-motion` nothing is registered and `progress` stays 0 — which is the
 * resting value, so every caller renders its designed composition rather than a degraded one.
 *
 * @param {import('vue').Ref<HTMLElement | null>} target element to measure
 * @returns {{ progress: import('vue').Ref<number> }}
 */
export function useScrollProgress(target) {
  const progress = ref(0)
  let frame = null

  const measure = () => {
    frame = null
    const el = target.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const viewport = window.innerHeight || 1
    progress.value = (rect.top + rect.height / 2 - viewport / 2) / viewport
  }

  const onScroll = () => {
    if (frame === null) frame = requestAnimationFrame(measure)
  }

  const OPTIONS = { capture: true, passive: true }

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.addEventListener('scroll', onScroll, OPTIONS)
    window.addEventListener('resize', onScroll, { passive: true })
    measure()
  })

  onBeforeUnmount(() => {
    if (frame !== null) cancelAnimationFrame(frame)
    document.removeEventListener('scroll', onScroll, OPTIONS)
    window.removeEventListener('resize', onScroll)
  })

  return { progress }
}
