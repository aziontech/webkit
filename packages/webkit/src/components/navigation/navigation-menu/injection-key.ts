import type { ComputedRef, CSSProperties, InjectionKey } from 'vue'

import type { Align } from '../../../composables/use-placement'
import type {
  NavigationMenuItemValue,
  UseNavigationMenuRootReturn
} from './composables/use-navigation-menu-root'

export type NavigationMenuRootContext = UseNavigationMenuRootReturn

export interface NavigationMenuItemContext {
  itemValue: ComputedRef<NavigationMenuItemValue>
  open: ComputedRef<boolean>
  contentId: string
}

export interface NavigationMenuListHighlightContext {
  setTarget: (element: HTMLElement | null) => void
  onTargetPointerleave: (event: PointerEvent, element: HTMLElement | null) => void
}

export interface NavigationMenuPositionerContext {
  arrowStyles: ComputedRef<CSSProperties>
  setArrowEl: (element: HTMLElement | null) => void
  resolvedSide: ComputedRef<'top' | 'end' | 'bottom' | 'start'>
  resolvedAlign: ComputedRef<Align>
}

export const NavigationMenuInjectionKey: InjectionKey<NavigationMenuRootContext> =
  Symbol('NavigationMenu')
export const NavigationMenuItemInjectionKey: InjectionKey<NavigationMenuItemContext> =
  Symbol('NavigationMenuItem')
export const NavigationMenuListHighlightInjectionKey: InjectionKey<NavigationMenuListHighlightContext> =
  Symbol('NavigationMenuListHighlight')
export const NavigationMenuPositionerInjectionKey: InjectionKey<NavigationMenuPositionerContext> =
  Symbol('NavigationMenuPositioner')
