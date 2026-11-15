import type { ComputedRef, CSSProperties, InjectionKey } from 'vue'

import type { Align } from '../../../../composables/use-placement'

export interface NavigationMenuPositionerContext {
  arrowStyles: ComputedRef<CSSProperties>
  setArrowEl: (element: HTMLElement | null) => void
  resolvedSide: ComputedRef<'top' | 'end' | 'bottom' | 'start'>
  resolvedAlign: ComputedRef<Align>
}

export const NAVIGATION_MENU_POSITIONER_KEY: InjectionKey<NavigationMenuPositionerContext> = Symbol(
  'NavigationMenuPositioner'
)
