import { inject } from 'vue'

import { type DataTableContext, DataTableInjectionKey } from '../injection-key'

export function useDataTableContext(): DataTableContext {
  const ctx = inject(DataTableInjectionKey)
  if (!ctx) {
    throw new Error('DataTable sub-components must be used within DataTable.')
  }
  return ctx
}

export function provideDataTableContext(ctx: DataTableContext) {
  return ctx
}
