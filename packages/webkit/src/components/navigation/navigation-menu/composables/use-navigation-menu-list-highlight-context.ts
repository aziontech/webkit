import { inject, type InjectionKey, provide } from 'vue'

export interface NavigationMenuListHighlightContext {
  setTarget: (element: HTMLElement | null) => void
  handleTargetPointerLeave: (event: PointerEvent, element: HTMLElement | null) => void
}

export const NAVIGATION_MENU_LIST_HIGHLIGHT_KEY: InjectionKey<NavigationMenuListHighlightContext> =
  Symbol('NavigationMenuListHighlight')

export function provideNavigationMenuListHighlight(
  context: NavigationMenuListHighlightContext
): void {
  provide(NAVIGATION_MENU_LIST_HIGHLIGHT_KEY, context)
}

export function useNavigationMenuListHighlight(): NavigationMenuListHighlightContext | null {
  return inject(NAVIGATION_MENU_LIST_HIGHLIGHT_KEY, null)
}
