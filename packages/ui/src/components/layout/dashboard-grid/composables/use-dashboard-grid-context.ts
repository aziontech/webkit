import { inject } from 'vue'

import { type DashboardGridContext, DashboardGridInjectionKey } from '../injection-key'

export function useDashboardGridContext(): DashboardGridContext {
  const context = inject(DashboardGridInjectionKey, null)
  if (!context) throw new Error('Board.* sub-components must be used inside <DashboardGrid>.')
  return context
}
