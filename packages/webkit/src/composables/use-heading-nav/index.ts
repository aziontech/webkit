import type { InjectionKey } from 'vue'
import { inject, provide } from 'vue'

/** The subject of a heading activation: the anchor id the reader is headed to. */
export interface HeadingNavItem {
  id: string
}

/** Takes the reader to a heading — (event, item); calls preventDefault when it handles the jump itself. */
export type HeadingNavigate = (event: MouseEvent, item: HeadingNavItem) => void

const HEADING_NAV_KEY: InjectionKey<HeadingNavigate> = Symbol('DocHeadingNav')

const NOOP: HeadingNavigate = () => {}

export function provideHeadingNav(navigate: HeadingNavigate): void {
  provide(HEADING_NAV_KEY, navigate)
}

export function useHeadingNav(): HeadingNavigate {
  return inject(HEADING_NAV_KEY, NOOP)
}
