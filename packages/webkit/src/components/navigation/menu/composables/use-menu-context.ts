import { inject } from 'vue'

import { type MenuContext, MenuInjectionKey } from '../injection-key'

export function useMenuContext(): MenuContext {
  const ctx = inject(MenuInjectionKey, null)

  if (!ctx) {
    throw new Error('Menu sub-components must be used within Menu.')
  }

  return ctx
}
