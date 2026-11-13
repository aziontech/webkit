import { inject } from 'vue'

import { type MenuSubContext, MenuSubInjectionKey } from '../injection-key'

export function useMenuSubContext(): MenuSubContext {
  const ctx = inject(MenuSubInjectionKey, null)

  if (!ctx) {
    throw new Error('Menu.SubTrigger and Menu.SubContent must be used within Menu.Sub.')
  }

  return ctx
}
