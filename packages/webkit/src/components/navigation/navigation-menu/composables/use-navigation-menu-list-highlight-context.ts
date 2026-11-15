import { inject, provide } from 'vue'

import {
  type NavigationMenuListHighlightContext,
  NavigationMenuListHighlightInjectionKey
} from '../injection-key'

export function provideNavigationMenuListHighlightContext(
  context: NavigationMenuListHighlightContext
): void {
  provide(NavigationMenuListHighlightInjectionKey, context)
}

export function useNavigationMenuListHighlightContext(): NavigationMenuListHighlightContext | null {
  return inject(NavigationMenuListHighlightInjectionKey, null)
}
