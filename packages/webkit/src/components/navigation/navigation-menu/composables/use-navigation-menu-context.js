import { computed, inject, provide } from 'vue'

export const NAVIGATION_MENU_ROOT_KEY = Symbol('NavigationMenuRoot')
export const NAVIGATION_MENU_ITEM_KEY = Symbol('NavigationMenuItem')
export const NAVIGATION_MENU_PORTAL_KEY = Symbol('NavigationMenuPortal')

/** @param {import('./use-navigation-menu-root.js').NavigationMenuRootContext} context */
export function provideNavigationMenuRoot(context) {
  provide(NAVIGATION_MENU_ROOT_KEY, context)
}

export function useNavigationMenuRoot() {
  const context = inject(NAVIGATION_MENU_ROOT_KEY, null)

  if (!context) {
    throw new Error('NavigationMenu parts must be used within NavigationMenu (Root).')
  }

  return {
    ...context,
    menuOpen: computed(() => context.open.value),
    menuValue: computed(() => context.value.value),
    menuOrientation: computed(() => context.orientation.value),
    menuPopupMounted: computed(() => context.popupMounted.value)
  }
}

/** @param {import('./use-navigation-menu-root.js').NavigationMenuItemContext} context */
export function provideNavigationMenuItem(context) {
  provide(NAVIGATION_MENU_ITEM_KEY, context)
}

export function useNavigationMenuItem() {
  const context = inject(NAVIGATION_MENU_ITEM_KEY, null)

  if (!context) {
    throw new Error('NavigationMenu.Item parts must be used within NavigationMenu.Item.')
  }

  return {
    ...context,
    itemOpen: computed(() => context.open.value),
    itemValueResolved: computed(() => context.itemValue.value)
  }
}

/** @param {import('./use-navigation-menu-root.js').NavigationMenuPortalContext} context */
export function provideNavigationMenuPortal(context) {
  provide(NAVIGATION_MENU_PORTAL_KEY, context)
}

export function useNavigationMenuPortal() {
  return inject(NAVIGATION_MENU_PORTAL_KEY, null)
}
