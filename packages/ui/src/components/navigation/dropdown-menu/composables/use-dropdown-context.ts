import { inject } from 'vue'

import { type DropdownMenuContext, DropdownMenuInjectionKey } from '../injection-key'

export function useDropdownContext(): DropdownMenuContext {
  const ctx = inject(DropdownMenuInjectionKey)
  if (!ctx) {
    throw new Error('DropdownMenu.* sub-components must be used inside <DropdownMenu>.')
  }
  return ctx
}
