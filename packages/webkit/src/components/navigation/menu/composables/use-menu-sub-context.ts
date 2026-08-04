import { inject } from 'vue'

import { MenuSubInjectionKey } from '../injection-key'

export function useMenuSubContext() {
  const ctx = inject(MenuSubInjectionKey)

  if (!ctx) {
    throw new Error('Menu.SubTrigger and Menu.SubContent must be used within Menu.Sub.')
  }

  return ctx
}
