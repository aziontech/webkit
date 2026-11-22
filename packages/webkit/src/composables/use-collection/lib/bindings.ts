import type { Ref } from 'vue'

import { type CollectionConfig, columnIdOf, DEFAULT_PAGE_SIZE, preferenceColumnsOf } from './config'
import type { CollectionColumnPreference, CollectionPreferencesValue } from './preferences'
import type {
  CollectionColumn,
  CollectionExportScope,
  CollectionPreferencesProps,
  CollectionSort,
  CollectionTableProps
} from './types'

export interface CollectionTableSource<T, C> {
  config: CollectionConfig<T>
  items: T[]
  columns: C[]
  loading: boolean
  sorting: CollectionSort[]
  page: Readonly<Ref<number>>
  pageSize: Readonly<Ref<number>>
  totalCount: number
  selectedKeys: string[]
  preferences: Readonly<Ref<Required<CollectionPreferencesValue>>>
  exportRows: (scope: CollectionExportScope) => Promise<T[]> | T[]
  setSorting: (sorting: CollectionSort[]) => void
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  setPreferences: (value: CollectionPreferencesValue) => void
  applyPageSelection: (nextOnPage: Set<string>) => void
}

function orderColumns<C extends CollectionColumn>(
  columns: C[],
  preferred: CollectionColumnPreference[]
): C[] {
  const order = preferred.map((c) => c.id)
  const byId = new Map(columns.map((column) => [columnIdOf(column), column]))
  const listed = order.map((id) => byId.get(id)).filter((c): c is C => c !== undefined)
  const rest = columns.filter((column) => !order.includes(columnIdOf(column)))
  return [...listed, ...rest]
}

const hiddenColumnsOf = (preferred: CollectionColumnPreference[]): Record<string, boolean> =>
  Object.fromEntries(preferred.filter((c) => !c.visible).map((c) => [c.id, false]))

export const visiblePageSize = (paginated: boolean, pageSize: number): number =>
  paginated ? pageSize : DEFAULT_PAGE_SIZE

export function tablePropsOf<T, C extends CollectionColumn>(
  source: CollectionTableSource<T, C>
): CollectionTableProps<T, C> {
  const { config, page, pageSize } = source
  const preferences = source.preferences.value
  return {
    data: source.items,
    columns: orderColumns(source.columns, preferences.columns),
    rowKey: config.itemKey,
    loading: source.loading,
    sorting: source.sorting,
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    paginated: config.paginated,
    page: page.value,
    pageSize: visiblePageSize(config.paginated, pageSize.value),
    rowCount: source.totalCount,
    pageSizeOptions: config.pageSizeOptions,
    selectable: config.selectionEnabled,
    selectedKeys: source.selectedKeys,
    columnVisibility: hiddenColumnsOf(preferences.columns),
    wrapLines: preferences.wrapLines,
    striped: preferences.striped,
    density: preferences.density,
    exportRows: source.exportRows,
    'onUpdate:sorting': (value) => source.setSorting(value ?? []),
    'onUpdate:page': (value) => {
      if (value !== undefined && value !== page.value) source.setPage(value)
    },
    'onUpdate:pageSize': (value) => {
      if (config.paginated && value !== pageSize.value) source.setPageSize(value)
    },
    'onUpdate:selectedKeys': (value = []) => source.applyPageSelection(new Set(value)),
    'onUpdate:columnVisibility': (value = {}) =>
      source.setPreferences({
        columns: source.preferences.value.columns.map((c) => ({
          id: c.id,
          visible: value[c.id] !== false
        }))
      })
  }
}

export function preferencesPropsOf<C extends CollectionColumn>(
  columns: C[],
  preferences: Required<CollectionPreferencesValue>,
  pageSizeOptions: number[],
  setPreferences: (value: CollectionPreferencesValue) => void
): CollectionPreferencesProps {
  return {
    preferences,
    columns: preferenceColumnsOf(columns).map((column) => ({
      id: columnIdOf(column),
      label: column.label ?? column.header ?? columnIdOf(column),
      locked: column.hideable === false
    })),
    pageSizeOptions,
    'onUpdate:preferences': setPreferences
  }
}
