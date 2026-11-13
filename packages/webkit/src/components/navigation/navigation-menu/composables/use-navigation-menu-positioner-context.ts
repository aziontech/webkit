import type { ComputedRef, CSSProperties, InjectionKey } from 'vue'

import type { Align, Side } from '../../../../composables/use-placement'

export interface NavigationMenuPositionerContext {
  arrowStyles: ComputedRef<CSSProperties>
  setArrowEl: (element: HTMLElement | null) => void
  resolvedSide: ComputedRef<Side>
  resolvedAlign: ComputedRef<Align>
}

export const NAVIGATION_MENU_POSITIONER_KEY: InjectionKey<NavigationMenuPositionerContext> = Symbol(
  'NavigationMenuPositioner'
)
