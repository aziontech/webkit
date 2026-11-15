import type { InjectionKey } from 'vue'
import { inject, provide } from 'vue'

/** The subject of a heading activation: the anchor id the reader is headed to. */
export interface HeadingNavigationItem {
  id: string
}

/** Takes the reader to a heading — (event, item); calls preventDefault when it handles the jump itself. */
export type HeadingNavigate = (event: MouseEvent, item: HeadingNavigationItem) => void

const HeadingNavigationInjectionKey: InjectionKey<HeadingNavigate> = Symbol('HeadingNavigation')

const NOOP: HeadingNavigate = () => {}

export function provideHeadingNavigation(navigate: HeadingNavigate): void {
  provide(HeadingNavigationInjectionKey, navigate)
}

export function useHeadingNavigation(): HeadingNavigate {
  return inject(HeadingNavigationInjectionKey, NOOP)
}
