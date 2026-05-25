import { inject } from 'vue'

import { DataTableInjectionKey } from '../injection-key'

export function useDataTableContext() {
  const ctx = inject(DataTableInjectionKey)
  if (!ctx) {
    throw new Error('DataTable sub-components must be used within DataTable.')
  }
  return ctx
}
export function provideDataTableContext(ctx) {
  return ctx
}
