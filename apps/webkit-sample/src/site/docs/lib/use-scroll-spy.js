import { onMounted, onScopeDispose, readonly, ref, watch } from 'vue'

import { scrollParent } from './scroll-parent.js'

/** Distance below the top of the scroll container at which a heading becomes current. */
const TRIP_LINE = 96

/**
 * Track which heading the reader is actually at, so the "On This Page" rail can
 * light it.
 *
 * READ POSITIONS, DON'T OBSERVE INTERSECTIONS. This was an IntersectionObserver
 * over a band at the top of the page, and that model is wrong for an outline in
 * three ways that all surface as the marker sitting on a section the reader is
 * nowhere near:
 *
 *   · NOTHING IN THE BAND IS THE COMMON CASE. A section is usually taller than
 *     the band, so scrolling through the middle of one leaves the band empty —
 *     and "empty" has no answer, so it fell back to the FIRST heading of the
 *     page. The marker jumped to the top of the outline mid-section.
 *   · THE BAND RUNS AHEAD. A heading counted the moment it entered the band's
 *     lower edge, hundreds of pixels below the reading line, so the rail marked
 *     the next section while the reader was still finishing the previous one.
 *   · THE LAST HEADING COULD NEVER WIN. Once the page is scrolled to the bottom
 *     there is no scrolling left to bring the final heading up into the band, so
 *     the marker stayed stuck on the previous entry for the whole last screenful.
 *
 * Positions answer all three: the current heading is the last one to have crossed
 * the line, it HOLDS until the next one crosses (so the middle of a section is
 * never ambiguous), and the bottom of the scroll resolves to the last heading
 * regardless of where its heading sits.
 *
 * The other half of the fix is measuring against the right thing. A documentation
 * page scrolls its own column, not the window, and that column is usually inset
 * under fixed chrome — so the line is measured from the SCROLL CONTAINER's box,
 * resolved by `scrollParent` (the same resolution the heading nav scrolls with).
 * Rooted at the viewport, as it was, a heading scrolled up behind a sticky bar
 * still counted as being in view.
 *
 * @param {import('vue').Ref<HTMLElement | null>} container - the rendered body.
 * @param {import('vue').Ref<Array<{ id: string }>>} items - the headings, in order.
 * @param {{ tripLine?: number }} [options] - `tripLine` overrides the reading line,
 *   in px below the top of the scroll container. Raise it past any sticky chrome
 *   the container carries inside itself.
 * @returns {{ activeId: Readonly<import('vue').Ref<string>> }}
 */
export function useScrollSpy(container, items, options = {}) {
  const tripLine = options.tripLine ?? TRIP_LINE
  const activeId = ref('')

  let scroller = null
  let headings = []
  let observer = null

  const sync = () => {
    if (!scroller || headings.length === 0) return

    // At the bottom there is no scrolling left to reveal the last section, so it
    // is the answer wherever its heading happens to sit.
    if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2) {
      activeId.value = headings[headings.length - 1].id
      return
    }

    // The document scrolls in viewport coordinates; a nested column is offset by
    // wherever its own box starts.
    const isDocument = scroller === globalThis.document.scrollingElement
    const line = (isDocument ? 0 : scroller.getBoundingClientRect().top) + tripLine

    // The last heading at or above the line. Until one passes it, the first
    // heading holds — a reader at the top of the page is in its first section.
    let current = headings[0]
    for (const heading of headings) {
      if (heading.getBoundingClientRect().top > line) break
      current = heading
    }
    activeId.value = current.id
  }

  const connect = () => {
    disconnect()
    const root = container.value
    if (!root) {
      activeId.value = items.value[0]?.id ?? ''
      return
    }

    scroller = scrollParent(root)
    headings = items.value
      .map((item) => root.querySelector(`#${globalThis.CSS.escape(item.id)}`))
      .filter(Boolean)

    if (!scroller || headings.length === 0) {
      activeId.value = items.value[0]?.id ?? ''
      return
    }

    scroller.addEventListener('scroll', sync, { passive: true })
    // A heading's position moves when anything above it changes height — an
    // accordion opening, an image loading, the column reflowing at a breakpoint —
    // none of which fires a scroll event.
    if (typeof globalThis.ResizeObserver === 'function') {
      observer = new globalThis.ResizeObserver(sync)
      observer.observe(root)
    }
    sync()
  }

  const disconnect = () => {
    scroller?.removeEventListener('scroll', sync)
    observer?.disconnect()
    scroller = null
    observer = null
    headings = []
  }

  onMounted(connect)
  watch(items, connect)
  onScopeDispose(disconnect)

  return { activeId: readonly(activeId) }
}
