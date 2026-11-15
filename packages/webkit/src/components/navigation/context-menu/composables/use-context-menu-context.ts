import { inject } from 'vue'

import { type ContextMenuContext, ContextMenuInjectionKey } from '../injection-key'

export function useContextMenuContext(): ContextMenuContext {
  const ctx = inject(ContextMenuInjectionKey)
  if (!ctx) throw new Error('ContextMenu.Trigger must be used inside <ContextMenu>.')
  return ctx
}
