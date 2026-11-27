import { inject } from 'vue'

import { type DataTableContext, DataTableInjectionKey } from '../injection-key'

export function useDataTableContext(): DataTableContext {
  const ctx = inject(DataTableInjectionKey, null)
  if (!ctx) throw new Error('useDataTableContext must be used within <DataTable>.')
  return ctx
}
