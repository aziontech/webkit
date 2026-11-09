import { inject } from 'vue'

import { type ChartContext, ChartInjectionKey } from '../injection-key'

export function useChartContext(): ChartContext {
  const context = inject(ChartInjectionKey, null)
  if (!context) throw new Error('Chart.* sub-components must be used inside <Chart>.')
  return context
}
