import { computed, type ComputedRef, inject, provide } from 'vue'

import {
  NavigationMenuInjectionKey,
  type NavigationMenuItemContext,
  NavigationMenuItemInjectionKey,
  type NavigationMenuRootContext
} from '../injection-key'
import type { NavigationMenuRootOrientation } from './use-navigation-menu-root'

export interface UseNavigationMenuContextReturn extends NavigationMenuRootContext {
  menuOpen: ComputedRef<boolean>
  menuOrientation: ComputedRef<NavigationMenuRootOrientation>
  menuPopupMounted: ComputedRef<boolean>
}

export interface UseNavigationMenuItemContextReturn extends NavigationMenuItemContext {
  itemOpen: ComputedRef<boolean>
}

export function provideNavigationMenuContext(context: NavigationMenuRootContext): void {
  provide(NavigationMenuInjectionKey, context)
}

export function useNavigationMenuContext(): UseNavigationMenuContextReturn {
  const context = inject(NavigationMenuInjectionKey, null)

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

export function provideNavigationMenuItemContext(context: NavigationMenuItemContext): void {
  provide(NavigationMenuItemInjectionKey, context)
}

export function useNavigationMenuItemContext(): UseNavigationMenuItemContextReturn {
  const context = inject(NavigationMenuItemInjectionKey, null)

  if (!context) {
    throw new Error('NavigationMenu.Item parts must be used within NavigationMenu.Item.')
  }

  return {
    ...context,
    itemOpen: computed(() => context.open.value)
  }
}

export function useOptionalNavigationMenuItemContext(): NavigationMenuItemContext | null {
  return inject(NavigationMenuItemInjectionKey, null)
}
