import { inject } from 'vue'

import { type SidebarMenuSubContext, SidebarMenuSubInjectionKey } from '../injection-key'

export function useSidebarMenuSubContext(): SidebarMenuSubContext {
  const ctx = inject(SidebarMenuSubInjectionKey, null)

  if (!ctx) {
    throw new Error(
      'SidebarMenu.SubTrigger and SidebarMenu.SubContent must be used within SidebarMenu.Sub.'
    )
  }

  return ctx
}
