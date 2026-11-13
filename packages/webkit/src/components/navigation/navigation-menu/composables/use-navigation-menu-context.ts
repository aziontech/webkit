import { computed, type ComputedRef, inject, type InjectionKey, provide } from 'vue'

import type {
  NavigationMenuItemValue,
  NavigationMenuRootOrientation,
  UseNavigationMenuRootStateReturn
} from './use-navigation-menu-root'

export type NavigationMenuRootContext = UseNavigationMenuRootStateReturn

export interface NavigationMenuItemContext {
  itemValue: ComputedRef<NavigationMenuItemValue>
  open: ComputedRef<boolean>
}

export interface UseNavigationMenuRootReturn extends NavigationMenuRootContext {
  menuOpen: ComputedRef<boolean>
  menuOrientation: ComputedRef<NavigationMenuRootOrientation>
  menuPopupMounted: ComputedRef<boolean>
}

export interface UseNavigationMenuItemReturn extends NavigationMenuItemContext {
  itemOpen: ComputedRef<boolean>
}

export const NAVIGATION_MENU_ROOT_KEY: InjectionKey<NavigationMenuRootContext> =
  Symbol('NavigationMenu')
export const NAVIGATION_MENU_ITEM_KEY: InjectionKey<NavigationMenuItemContext> =
  Symbol('NavigationMenuItem')

export function provideNavigationMenuRoot(context: NavigationMenuRootContext): void {
  provide(NAVIGATION_MENU_ROOT_KEY, context)
}

export function useNavigationMenuRoot(): UseNavigationMenuRootReturn {
  const context = inject(NAVIGATION_MENU_ROOT_KEY, null)

  if (!context) {
    throw new Error('NavigationMenu parts must be used within NavigationMenu (Root).')
  }

  return {
    ...context,
    menuOpen: computed(() => context.open.value),
    menuOrientation: computed(() => context.orientation.value),
    menuPopupMounted: computed(() => context.popupMounted.value)
  }
}

export function provideNavigationMenuItem(context: NavigationMenuItemContext): void {
  provide(NAVIGATION_MENU_ITEM_KEY, context)
}

export function useNavigationMenuItem(): UseNavigationMenuItemReturn {
  const context = inject(NAVIGATION_MENU_ITEM_KEY, null)

  if (!context) {
    throw new Error('NavigationMenu.Item parts must be used within NavigationMenu.Item.')
  }

  return {
    ...context,
    itemOpen: computed(() => context.open.value)
  }
}

export function useOptionalNavigationMenuItem(): NavigationMenuItemContext | null {
  return inject(NAVIGATION_MENU_ITEM_KEY, null)
}
