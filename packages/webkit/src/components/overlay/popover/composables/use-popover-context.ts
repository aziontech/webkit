import { inject } from 'vue'

import { type PopoverContext, PopoverInjectionKey } from '../injection-key'

export function usePopoverContext(): PopoverContext {
  const ctx = inject(PopoverInjectionKey)
  if (!ctx) {
    throw new Error('Popover.* sub-components must be used inside <Popover>.')
  }
  return ctx
}
