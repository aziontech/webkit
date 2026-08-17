// A TAB SWITCH IS A PAGE CHANGE, so it arrives like one.
//
// Every tabbed shell in the console — an application, a workload, a zone, a database,
// the account — swaps its whole content region when a tab is picked. Until this
// existed, that swap was the only navigation in the app that happened with no
// entrance at all: routing between pages plays `animate-page-enter`, but moving from
// Build to Main Settings replaced one full screen of content with another in a single
// frame. The reader gets no signal that the thing they are looking at is now a
// different thing, which is exactly what an entrance is for.
//
// WHY A CLASS REPLAY AND NOT `<Transition>`. These shells hold their views in
// `<KeepAlive>` so work in progress in one tab survives a visit to another — a
// half-filled form is still there when you come back. That rules out the two obvious
// approaches:
//
//   - `<Transition mode="out-in">` around `<component :is>` renders BLANK on a
//     switch (fine on reload, empty on navigation) unless the transitioning child is
//     a keyed wrapper ELEMENT rather than the component itself;
//   - a keyed wrapper element re-mounts on every switch, which unmounts the
//     `<KeepAlive>` inside it and throws away the cache it exists to keep.
//
// So the entrance is replayed on a STABLE wrapper instead: strip the animation class,
// commit that with a forced reflow (without it the browser folds both writes into one
// style recalculation, sees no change, and never restarts the animation), then put it
// back. Nothing re-mounts, the cache survives, and the animation is the same one every
// routed page already plays.
//
// The scroll position resets with it. A tab is a different screen; arriving at it
// halfway down because the previous tab was scrolled there is disorienting, and the
// entrance would play on content that is off-screen.
import { watch } from 'vue'

import { suppressEntranceMotion } from './interaction'

const ENTER_CLASS = 'animate-page-enter'

const prefersReducedMotion = () =>
  globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

/**
 * Replay the page entrance whenever `key` changes.
 *
 * @param {import('vue').Ref<HTMLElement | null>} target
 *   The STABLE wrapper around the tab's content — never a keyed element, or the
 *   `<KeepAlive>` inside it is destroyed on every switch.
 * @param {() => unknown} key
 *   The active tab. Any change replays the entrance.
 * @param {import('vue').Ref<HTMLElement | null>} [scroller]
 *   The scrolling region to send back to the top. Defaults to the wrapper's own
 *   scrolling ancestor when omitted.
 */
export function useTabEnter(target, key, scroller = null) {
  watch(key, () => {
    // Before anything mounts: the arriving tab is an entrance, so its bands must not
    // each animate their own height on the way in (see lib/interaction.js).
    suppressEntranceMotion()

    const node = target.value
    if (!node) return

    // The scroll reset is NOT motion, so it happens even under reduced motion:
    // landing mid-page on a screen you have not seen is a correctness problem, not
    // a decorative one.
    const region = scroller?.value ?? node.parentElement
    if (region) region.scrollTop = 0

    if (prefersReducedMotion()) return

    node.classList.remove(ENTER_CLASS)
    void node.offsetWidth // commit the removal, or the class never restarts
    node.classList.add(ENTER_CLASS)
  })
}
