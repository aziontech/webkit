import { inject } from 'vue'

import { type SidebarMenuContext, SidebarMenuInjectionKey } from '../injection-key'

export function useSidebarMenuContext(): SidebarMenuContext {
  const ctx = inject(SidebarMenuInjectionKey, null)

  if (!ctx) {
    throw new Error('SidebarMenu sub-components must be used within SidebarMenu.')
  }

  return ctx
}
