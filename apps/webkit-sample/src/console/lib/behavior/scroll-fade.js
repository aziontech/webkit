// EDGE FADES ON A SCROLL BOX — the cue that content continues past the edge.
//
// A scroll box that ends at a hard line reads as finished. That is the wrong answer
// twice over: at the top, where rows slide under a pinned header and get clipped
// mid-glyph, and at the bottom, where a fixed action bar sits over content that
// simply stops behind it. So each edge dissolves into the page instead, and the
// reader can see there is more.
//
// EACH EDGE FADES ONLY WHILE THERE IS CONTENT PAST IT. Nothing at rest, a top band
// once the first row has scrolled away, a bottom band that shrinks to zero as the
// last row arrives. Fixed bands would dim the first and last rows permanently and
// pop off at the ends of the travel; tracking the actual scroll distance means the
// fade eases itself in and out as the reader moves, with no transition to declare.
//
// WHY A MASK AND NOT A GRADIENT OVERLAY. A gradient can only fade to ONE colour, so
// it has to be the canvas — and the moment the content behind it is a card
// (`--bg-surface`) the band reads as a wash of the wrong colour laid over the card
// rather than as the card running out. A mask removes the pixels, so it is correct
// over the canvas, over a card, and in both themes, with no colour to keep in sync.
//
// WHAT THIS ADDS OVER THE HAND-ROLLED COPY IT WAS LIFTED FROM
// (../../components/marketplace/TemplateBrowser.vue, the first place it shipped):
//
//   IT WATCHES THE CONTENT, not just the viewport. A `ResizeObserver` on the box
//     alone catches the WINDOW resizing and nothing else, so every call site had to
//     re-measure by hand from a `watch` over whatever it renders — and a step that
//     swaps, a disclosure that opens, or a list that arrives late would otherwise
//     leave a fade sized for the previous content. Observing the box AND what is
//     inside it covers all of it, so a call site declares nothing.
//   IT SURVIVES THE CONTENT BEING REPLACED. Sizing the content observer once would
//     hold a detached node the first time a list `v-if`s over to its empty state —
//     the fade would then freeze at whatever the list last measured. The child list
//     is re-synced whenever it changes.
//   IT RE-OBSERVES WHEN THE BOX ITSELF CHANGES. The box is often behind a `v-if`
//     too, so unmount/remount needs no call-site hook either.
//   IT NEVER FADES MORE THAN A SIXTH OF THE BOX. A 64px band on each edge of a
//     120px list leaves almost nothing at full strength. A short scroller gets a
//     proportional hint instead of a wash.
//
// CLEANUP is on `onScopeDispose` rather than `onBeforeUnmount`: the listener and the
// observers then also come down when the composable is used inside a detached
// `effectScope`, and there is one teardown path instead of two.
import { computed, onScopeDispose, ref, watch } from 'vue'

// px. The widest a band ever gets — one --layout-section-gap of dissolve, which is
// the same step the bands it fades keep between each other.
const MAX_FADE = 64

// The most of the box a single band may cover, so a short scroller keeps a legible
// middle: two thirds of it stay at full strength in the worst case.
const MAX_FADE_RATIO = 1 / 6

/**
 * @param {{ max?: number }} [options]
 *   `max` overrides the widest band, in px.
 * @returns {{
 *   scroller: import('vue').Ref<unknown>,
 *   fadeStyle: import('vue').ComputedRef<Record<string, string> | undefined>,
 *   measure: () => void
 * }}
 *   Bind `scroller` as the ref of the element that scrolls — or of a component that
 *   owns it, whose `$el` is read — and `fadeStyle` to that same element's `:style`.
 *   `fadeStyle` carries the matching `scroll-padding-block` too, so the call site adds
 *   no scroll-padding class of its own.
 *   `measure` is there for the rare change neither observer can see; nothing routine
 *   needs to call it.
 */
export function useScrollFade(options = {}) {
  const { max = MAX_FADE } = options

  const scroller = ref(null)
  const fadeTop = ref(0)
  const fadeBottom = ref(0)
  // Height of whatever is pinned over the top edge right now (see `stickyCover`).
  const stickyTop = ref(0)

  // The observed nodes are held outside the ref so teardown still reaches them after
  // a `v-if` has already dropped it.
  let observedEl = null
  let observedChildren = []
  let sizeObserver = null
  let childObserver = null

  // A webkit component instance when the box belongs to one (ScrollArea), a plain
  // element otherwise.
  const viewportEl = () => scroller.value?.$el ?? scroller.value ?? null

  // WHAT IS PINNED OVER THE TOP EDGE, in px, so the top band can start BELOW it.
  //
  // A sticky header inside the box (a group heading in a long list) is painted over the
  // scrolling content but is part of the same element, so the mask covers it too. Start
  // the band at the scrollport's own top edge and two things go wrong at once: most of
  // the band is spent behind an opaque header where nothing can be seen dissolving, and
  // what is left of it lands as a dim wash on the FIRST ROW BELOW the header — so the
  // header reads as crisp, the row under it reads as broken, and the rows further down
  // read as normal. The header has to stay fully painted and the dissolve has to happen
  // where content actually emerges: at its bottom edge.
  //
  // Found by HIT-TESTING the top edge rather than by scanning for sticky descendants:
  // one call per measure instead of a `getComputedStyle` sweep over every node in the
  // box, and it is always current — whichever header is pinned right now is the one
  // painted there, including the frames where an outgoing header is being pushed off by
  // the next. Anything that is not inside the box (a teleported overlay covering the
  // point) fails the `contains` check and reports nothing, which is the safe answer.
  const stickyCover = (el, box) => {
    let node = globalThis.document?.elementFromPoint(
      Math.round(box.left + box.width / 2),
      Math.round(box.top + 1)
    )
    while (node && node !== el && el.contains(node)) {
      if (getComputedStyle(node).position === 'sticky') {
        return Math.max(0, Math.round(node.getBoundingClientRect().bottom - box.top))
      }
      node = node.parentElement
    }
    return 0
  }

  const measure = () => {
    const el = viewportEl()
    if (!el) {
      fadeTop.value = 0
      fadeBottom.value = 0
      stickyTop.value = 0
      return
    }
    const box = el.getBoundingClientRect()
    // Only while there is something scrolled away — an unscrolled box has no top band,
    // so there is nothing to offset and no reason to hit-test.
    const cover = el.scrollTop > 0 ? stickyCover(el, box) : 0
    // The band is measured against what is LEFT of the box under the pinned header: a
    // list whose header eats half its height should not then dissolve most of the rest.
    // Rounded to whole px, because a fractional scroll offset would otherwise rewrite
    // the mask string on every frame of a trackpad glide for a difference no one can see.
    const ceiling = Math.min(max, Math.round((el.clientHeight - cover) * MAX_FADE_RATIO))
    const clamp = (distance) => Math.max(0, Math.min(ceiling, Math.round(distance)))
    stickyTop.value = cover
    fadeTop.value = clamp(el.scrollTop)
    fadeBottom.value = clamp(el.scrollHeight - el.clientHeight - el.scrollTop)
  }

  const fadeStyle = computed(() => {
    // THE BAND IS ALSO SCROLL PADDING, from the same number — which is why it is here
    // and not a class at the call site: a hand-picked spacing token can only agree with
    // `max` by coincidence, and stops agreeing the moment either moves. It keeps
    // anything scrolled into view from landing INSIDE the band, where it would arrive
    // half-dissolved.
    //
    // MEASURED, so the next reader does not have to re-derive it: `scrollIntoView`
    // honours this (a `nearest` call that parked an element 1px from the bottom edge
    // parks it at 65px with the padding on), and Chromium's FOCUS scroll does not — it
    // centres the focused element instead, which lands it clear of both bands anyway.
    // So this is not what makes tabbing safe in Chromium; it is what keeps an explicit
    // scroll-into-view honest, and the correct declaration for an engine that aligns
    // focus to `nearest` rather than centring it.
    const style = { scrollPaddingBlock: `${max}px` }
    // No mask at rest. An always-on one costs a compositing layer for the whole scroll
    // box and would leave the first and last rows permanently half-lit. (Both bands are
    // zero only when there is nothing past either edge, i.e. nothing to scroll.)
    if (!fadeTop.value && !fadeBottom.value) return style
    // The pinned header's own band stays at full strength (`#000` through `cover`), and
    // the ramp starts at its bottom edge — so content dissolves as it goes UNDER the
    // header rather than in a strip below it.
    const cover = stickyTop.value
    const rampStart = cover + fadeTop.value
    const mask =
      `linear-gradient(to bottom, #000 0, #000 ${cover}px, transparent ${cover}px,` +
      ` #000 ${rampStart}px, #000 calc(100% - ${fadeBottom.value}px), transparent 100%)`
    return { ...style, maskImage: mask, WebkitMaskImage: mask }
  })

  // The box's own size answers a window resize; its CHILDREN answer a scroll height
  // that changes under a fixed viewport — a part of a flow swapping in, a disclosure
  // opening, a list arriving late. Both go through one observer.
  const syncChildren = () => {
    for (const child of observedChildren) sizeObserver?.unobserve(child)
    observedChildren = observedEl ? Array.from(observedEl.children) : []
    for (const child of observedChildren) sizeObserver?.observe(child)
  }

  const unobserve = () => {
    if (observedEl) observedEl.removeEventListener('scroll', measure)
    sizeObserver?.disconnect()
    childObserver?.disconnect()
    observedEl = null
    observedChildren = []
    sizeObserver = null
    childObserver = null
  }

  const observe = () => {
    const el = viewportEl()
    if (el === observedEl) {
      measure()
      return
    }
    unobserve()
    if (!el) {
      measure()
      return
    }
    observedEl = el
    // The listener is attached here rather than as a template `@scroll` because the
    // box may belong to a component that does not forward `$attrs` (ScrollArea), in
    // which case the binding would never reach the element that actually scrolls.
    el.addEventListener('scroll', measure, { passive: true })
    sizeObserver = new ResizeObserver(measure)
    sizeObserver.observe(el)
    // `childList` only, NOT `subtree`: a deep mutation changes a child's SIZE, which
    // the ResizeObserver above already reports. This observer exists for the one
    // thing resize cannot see — a child being replaced by a different element, which
    // would otherwise leave the size observer holding a detached node.
    childObserver = new MutationObserver(() => {
      syncChildren()
      measure()
    })
    childObserver.observe(el, { childList: true })
    syncChildren()
    measure()
  }

  // `post` so the element is in the DOM by the time this runs. Immediate, so a box
  // already mounted when the composable is set up gets observed without a separate
  // `onMounted`.
  watch(scroller, observe, { flush: 'post', immediate: true })

  onScopeDispose(unobserve)

  return { scroller, fadeStyle, measure }
}
