import { inject } from 'vue'

import { type ChartCardContext, ChartCardInjectionKey } from '../injection-key'

export function useChartCardContext(): ChartCardContext {
  const context = inject(ChartCardInjectionKey, null)
  if (!context) throw new Error('ChartCard.* sub-components must be used inside <ChartCard>.')
  return context
}
