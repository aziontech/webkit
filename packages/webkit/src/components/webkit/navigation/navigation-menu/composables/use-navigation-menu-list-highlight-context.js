import { inject, provide } from 'vue'

export const NAVIGATION_MENU_LIST_HIGHLIGHT_KEY = Symbol('NavigationMenuListHighlight')

/** @param {import('./use-navigation-menu-list-highlight.js').NavigationMenuListHighlightContext} context */
export function provideNavigationMenuListHighlight(context) {
  provide(NAVIGATION_MENU_LIST_HIGHLIGHT_KEY, context)
}

export function useNavigationMenuListHighlight() {
  return inject(NAVIGATION_MENU_LIST_HIGHLIGHT_KEY, null)
}
