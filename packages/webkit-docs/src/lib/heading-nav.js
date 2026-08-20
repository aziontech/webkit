import { inject, provide } from 'vue'

/**
 * How a heading takes the reader to itself.
 *
 * The page owns the scroll container — the prose column scrolls, not the window
 * — so `DocMarkdown` cannot scroll to its own headings, and a native hash jump
 * would land hard and push a history entry. The page provides its scroller-aware
 * handler; every heading anchor calls it. When there is no page (a bare
 * `DocMarkdown` in a story), the default is a no-op and the browser's own hash
 * navigation takes over, which is the correct fallback rather than a broken link.
 */
const HEADING_NAV_KEY = Symbol('DocHeadingNav')

/**
 * Publish the page's heading navigation to the prose below it.
 *
 * @param {(event: MouseEvent, item: { id: string }) => void} navigate - takes
 *   the reader to a heading, and is responsible for `preventDefault`.
 * @returns {void}
 */
export function provideHeadingNav(navigate) {
  provide(HEADING_NAV_KEY, navigate)
}

/**
 * Read the page's heading navigation.
 *
 * @returns {(event: MouseEvent, item: { id: string }) => void} the handler, or a
 *   no-op when the prose is rendered outside a `DocPage`.
 */
export function useHeadingNav() {
  return inject(
    HEADING_NAV_KEY,
    () => {}
  )
}
