import type { InjectionKey, MaybeRefOrGetter } from 'vue'
import { inject, onMounted, onScopeDispose, provide, toValue } from 'vue'

/** The subject of a heading activation: the anchor id the reader is headed to. */
export interface HeadingNavigationItem {
  id: string
}

/** Takes the reader to a heading — (event, item); calls preventDefault when it handles the jump itself. */
export type HeadingNavigate = (event: MouseEvent, item: HeadingNavigationItem) => void

/** One entry of the layout's outline: the heading's anchor id, its visible text and its level. */
export interface HeadingOutlineItem {
  /** The heading's anchor id. */
  id: string
  /** The visible heading text. */
  text: string
  /** Heading level; 3 indents under the preceding 2. */
  depth: number
}

/** Adds a heading to the layout's outline and returns the function that removes it. */
export type RegisterHeading = (
  el: () => Element | null,
  item: () => HeadingOutlineItem | null
) => () => void

const HeadingNavigationInjectionKey: InjectionKey<HeadingNavigate> = Symbol('HeadingNavigation')

const HeadingOutlineInjectionKey: InjectionKey<RegisterHeading> = Symbol('HeadingOutline')

const NOOP: HeadingNavigate = () => {}

export function provideHeadingNavigation(navigate: HeadingNavigate): void {
  provide(HeadingNavigationInjectionKey, navigate)
}

export function useHeadingNavigation(): HeadingNavigate {
  return inject(HeadingNavigationInjectionKey, NOOP)
}

export function provideHeadingOutline(register: RegisterHeading): void {
  provide(HeadingOutlineInjectionKey, register)
}

export function useHeadingOutline(
  el: MaybeRefOrGetter<Element | null>,
  item: MaybeRefOrGetter<HeadingOutlineItem | null>
): void {
  const register = inject(HeadingOutlineInjectionKey, null)
  if (!register) return
  let release: (() => void) | null = null
  onMounted(() => {
    release = register(
      () => toValue(el),
      () => toValue(item)
    )
  })
  onScopeDispose(() => {
    release?.()
    release = null
  })
}
