import { inject, provide } from 'vue'
import type { InjectionKey } from 'vue'

/**
 * How a heading takes the reader to itself.
 *
 * A documentation page owns its scroll container — the prose column scrolls,
 * not the window — so a heading cannot scroll to itself, and a native hash jump
 * would land hard and push a history entry. The page provides its
 * scroller-aware handler; every heading anchor calls it. When there is no
 * provider (a lone DocUpdate in a story or a test), the injected default is a
 * no-op and the browser's own hash navigation takes over — the correct
 * degradation rather than a broken link, which is why this inject never throws.
 */

/** The subject of a heading activation: the anchor id the reader is headed to. */
export interface HeadingNavItem {
  id: string
}

/**
 * Takes the reader to a heading. Receives the DOM event first and the item
 * second, and is responsible for calling preventDefault when it handles the
 * jump itself.
 */
export type HeadingNavigate = (event: MouseEvent, item: HeadingNavItem) => void

const HEADING_NAV_KEY: InjectionKey<HeadingNavigate> = Symbol('DocHeadingNav')

const NOOP: HeadingNavigate = () => {}

/**
 * Publish the page's heading navigation to the prose below it.
 *
 * @param navigate - takes the reader to a heading; responsible for calling
 *   preventDefault when it handles the jump itself.
 */
export function provideHeadingNav(navigate: HeadingNavigate): void {
  provide(HEADING_NAV_KEY, navigate)
}

/**
 * Read the page's heading navigation.
 *
 * @returns the provided handler, or a no-op when rendered outside a provider —
 *   native hash navigation then handles the jump.
 */
export function useHeadingNav(): HeadingNavigate {
  return inject(HEADING_NAV_KEY, NOOP)
}
