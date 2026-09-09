import type { InjectionKey } from 'vue'
import { inject, provide } from 'vue'

// A doc page owns its scroll container (the prose column scrolls, not the window), so
// the page provides a scroller-aware jump handler that every heading anchor calls. With
// no provider the injected default is a no-op and native hash navigation takes over —
// the correct degradation, which is why this inject never throws.

/** The subject of a heading activation: the anchor id the reader is headed to. */
export interface HeadingNavItem {
  id: string
}

/** Takes the reader to a heading — (event, item); calls preventDefault when it handles the jump itself. */
export type HeadingNavigate = (event: MouseEvent, item: HeadingNavItem) => void

const HEADING_NAV_KEY: InjectionKey<HeadingNavigate> = Symbol('DocHeadingNav')

const NOOP: HeadingNavigate = () => {}

/** Publish the page's heading navigation to the prose below it. */
export function provideHeadingNav(navigate: HeadingNavigate): void {
  provide(HEADING_NAV_KEY, navigate)
}

/** The provided handler, or a no-op outside a provider (native hash navigation then handles the jump). */
export function useHeadingNav(): HeadingNavigate {
  return inject(HEADING_NAV_KEY, NOOP)
}
