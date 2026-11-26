import { inject } from 'vue'

import { type DropdownMenuSubContext, DropdownMenuSubInjectionKey } from '../injection-key'

export function useDropdownSubContext(): DropdownMenuSubContext {
  const ctx = inject(DropdownMenuSubInjectionKey)
  if (!ctx) {
    throw new Error(
      'DropdownMenu.SubTrigger and SubContent must be used inside <DropdownMenu.Sub>.'
    )
  }
  return ctx
}
