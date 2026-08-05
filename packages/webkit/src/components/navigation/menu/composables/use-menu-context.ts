import { inject } from 'vue'

import { MenuInjectionKey } from '../injection-key'

export function useMenuContext() {
  const ctx = inject(MenuInjectionKey)

  if (!ctx) {
    throw new Error('Menu sub-components must be used within Menu.')
  }

  return ctx
}
