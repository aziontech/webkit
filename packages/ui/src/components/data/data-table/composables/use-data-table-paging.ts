import type { Table as TanstackTable } from '@tanstack/vue-table'
import { computed, shallowRef, type Slot } from 'vue'

import type {
  DataTablePagingContext,
  DataTablePagingOptions,
  DataTableRecord
} from '../injection-key'
import { slotPartProps } from '../lib/slot-part-props'
import type { UseDataTableStateReturn } from './use-data-table-state'

export interface DataTablePagingHost {
  table: TanstackTable<DataTableRecord>
  state: UseDataTableStateReturn
  records: () => DataTableRecord[]
  lean: () => boolean
  footer: Slot | undefined
}

export interface UseDataTablePagingReturn extends DataTablePagingContext {
  manualPagination: () => boolean
  rowCount: () => number | undefined
}

const isOn = (value: unknown): boolean => value !== undefined && value !== false

const seedFrom = (host: DataTablePagingHost): (() => DataTablePagingOptions) | null => {
  const props = slotPartProps(host.footer, 'DataTablePagination')
  if (!props) return null
  const page = typeof props['page'] === 'number' ? props['page'] : 1
  const size = typeof props['pageSize'] === 'number' ? props['pageSize'] : undefined
  host.state.pagination.set({
    pageIndex: page - 1,
    pageSize: size ?? host.state.pagination.value.value.pageSize
  })
  const options: DataTablePagingOptions = {
    manual: isOn(props['manual']),
    total: typeof props['total'] === 'number' ? props['total'] : undefined
  }
  return () => options
}

export function useDataTablePaging(host: DataTablePagingHost): UseDataTablePagingReturn {
  const { table, state } = host
  const source = shallowRef<(() => DataTablePagingOptions) | null>(seedFrom(host))
  const options = computed<DataTablePagingOptions | null>(() => source.value?.() ?? null)
  const active = computed<boolean>(() => options.value !== null)
  const manual = computed<boolean>(() => options.value?.manual ?? false)
  const total = computed<number>(() => {
    const given = options.value?.total
    if (manual.value && given !== undefined) return given
    return host.lean() ? host.records().length : table.getFilteredRowModel().rows.length
  })
  return {
    active,
    page: computed<number>(() => state.pagination.value.value.pageIndex + 1),
    pageSize: computed<number>(() => state.pagination.value.value.pageSize),
    total,
    setPage: (page) => table.setPageIndex(page - 1),
    setPageSize: (size) => table.setPageSize(size),
    register: (next) => {
      source.value = next
      return () => {
        if (source.value === next) source.value = null
      }
    },
    manualPagination: () => !active.value || manual.value,
    rowCount: () => (manual.value ? options.value?.total : undefined)
  }
}
