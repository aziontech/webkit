import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

import type {
  CollectionDensity,
  CollectionPreferencesValue,
  PreferencesStorage
} from './preferences'
import type { FilteringProperty, PropertyFilterQuery } from './property-filter'
import type { CollectionUrlAdapter } from './url'

/** One sorted column; the same shape as the Table `sorting` model. */
export interface CollectionSort {
  id: string
  desc: boolean
}

/** The column fields `useCollection` reads; a Table column satisfies it. */
export interface CollectionColumn {
  id?: string
  accessorKey?: string
  header?: string
  label?: string
  hideable?: boolean
  type?: 'default' | 'action'
}

/** What a server-mode `fetch` receives. */
export interface CollectionFetchParams {
  filteringText: string
  filter: PropertyFilterQuery
  sort: CollectionSort[]
  page: number
  pageSize: number
  signal: AbortSignal
}

/** What a server-mode `fetch` resolves to: one page and the total that matches. */
export interface CollectionFetchResult<T> {
  items: T[]
  total: number
}

/** Which matches an export writes: every item that matches the filters, or every item. */
export type CollectionExportScope = 'filtered' | 'all'

/** What a server-mode `exportAll` receives: the current filters and sort, without paging. */
export interface CollectionExportParams {
  filteringText: string
  filter: PropertyFilterQuery
  sort: CollectionSort[]
  scope: CollectionExportScope
}

/** Where the collection is: loading, failed, no items at all, no item matches the filters, or ready. */
export type CollectionStatus = 'loading' | 'error' | 'empty' | 'no-match' | 'ready'

/** Single or multiple selection. */
export type CollectionSelectionMode = 'single' | 'multiple'

export interface UseCollectionOptions<
  T extends object,
  C extends CollectionColumn = CollectionColumn
> {
  /** Client mode: every item, filtered, sorted and paged in memory. */
  items?: MaybeRefOrGetter<readonly T[]>
  /** Server mode: loads one page for the current filter, sort and page. */
  fetch?: (params: CollectionFetchParams) => Promise<CollectionFetchResult<T>>
  /** Server mode: loads every item an export writes (`TableExportButton`, `exportCsv()`, `exportItems`); without it the loaded page is exported. */
  exportAll?: (params: CollectionExportParams) => Promise<T[]>
  /** Field that identifies an item (selection, row keys). */
  itemKey?: keyof T & string
  /** Columns bound to a Table; their order and visibility follow the preferences. */
  columns?: MaybeRefOrGetter<readonly C[]>
  /** Free-text filtering: fields searched (all scalar fields by default), initial text, server debounce in ms. */
  filtering?: { fields?: string[]; defaultText?: string; debounce?: number }
  /** Property filtering: the properties offered and the initial query. */
  propertyFiltering?: {
    properties: MaybeRefOrGetter<readonly FilteringProperty[]>
    defaultQuery?: PropertyFilterQuery
  }
  /** Sorting: initial state, several columns at once, custom comparators by column id. */
  sorting?: {
    defaultState?: CollectionSort[]
    multiple?: boolean
    comparators?: Record<string, (a: T, b: T) => number>
  }
  /** Pagination: page size and the sizes offered. Without it every match shows on one page. */
  pagination?: { pageSize?: number; pageSizeOptions?: number[] }
  /** Selection: single or multi, initial keys, keep selected items hidden by a filter. */
  selection?: {
    mode?: CollectionSelectionMode
    defaultSelectedKeys?: string[]
    keepSelection?: boolean
  }
  /** Keep filter, sort and page in the query string: `true` (history), an adapter, or an adapter with a key prefix. */
  url?: boolean | CollectionUrlAdapter | { adapter?: CollectionUrlAdapter; prefix?: string }
  /** Saved preferences: storage key, defaults, storage (`localStorage` by default). */
  preferences?: {
    storageKey?: string
    defaults?: CollectionPreferencesValue
    storage?: PreferencesStorage | null
  }
}

export interface CollectionTableProps<T, C> {
  data: T[]
  columns: C[]
  rowKey: string
  loading: boolean
  sorting: CollectionSort[]
  manualSorting: true
  manualFiltering: true
  manualPagination: true
  paginated: boolean
  page: number
  pageSize: number
  rowCount: number
  pageSizeOptions: number[]
  selectable: boolean
  selectedKeys: string[]
  columnVisibility: Record<string, boolean>
  wrapLines: boolean
  striped: boolean
  density: CollectionDensity
  exportRows: (scope: CollectionExportScope) => Promise<T[]> | T[]
  'onUpdate:sorting': (value: CollectionSort[] | undefined) => void
  'onUpdate:page': (value: number | undefined) => void
  'onUpdate:pageSize': (value: number) => void
  'onUpdate:selectedKeys': (value: string[] | undefined) => void
  'onUpdate:columnVisibility': (value: Record<string, boolean> | undefined) => void
}

export interface CollectionPaginationProps {
  page: number
  total: number
  pageSize: number
  pageSizeOptions: number[]
  'onUpdate:page': (page: number) => void
  'onUpdate:pageSize': (size: number) => void
}

export interface CollectionTextFilterProps {
  modelValue: string
  'onUpdate:modelValue': (value: string) => void
}

export interface CollectionPropertyFilterProps {
  query: PropertyFilterQuery
  properties: FilteringProperty[]
  totalCount: number
  'onUpdate:query': (query: PropertyFilterQuery) => void
}

export interface CollectionPreferenceColumn {
  id: string
  label: string
  locked: boolean
}

export interface CollectionPreferencesProps {
  preferences: Required<CollectionPreferencesValue>
  columns: CollectionPreferenceColumn[]
  pageSizeOptions: number[]
  'onUpdate:preferences': (value: CollectionPreferencesValue) => void
}

export interface CollectionCardListProps<T> {
  items: T[]
  itemKey: string
  loading: boolean
  selectionMode: 'none' | CollectionSelectionMode
  selectedKeys: string[]
  'onUpdate:selectedKeys': (keys: string[]) => void
}

export interface UseCollectionReturn<T, C> {
  items: ComputedRef<T[]>
  matchingItems: ComputedRef<T[]>
  totalCount: ComputedRef<number>
  pageCount: ComputedRef<number>
  loading: Readonly<Ref<boolean>>
  error: Readonly<Ref<unknown>>
  status: ComputedRef<CollectionStatus>
  filtersActive: ComputedRef<boolean>
  filteringText: Readonly<Ref<string>>
  query: Readonly<Ref<PropertyFilterQuery>>
  sorting: Readonly<Ref<CollectionSort[]>>
  page: Readonly<Ref<number>>
  pageSize: ComputedRef<number>
  preferences: ComputedRef<Required<CollectionPreferencesValue>>
  selectedKeys: ComputedRef<string[]>
  selectedItems: ComputedRef<T[]>
  selectedCount: ComputedRef<number>
  allMatchingSelected: Readonly<Ref<boolean>>
  pageSelected: ComputedRef<boolean>
  setFilteringText: (text: string) => void
  setQuery: (query: PropertyFilterQuery) => void
  setSorting: (sorting: CollectionSort[]) => void
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  setPreferences: (value: CollectionPreferencesValue) => void
  clearFilters: () => void
  refresh: () => Promise<void>
  exportItems: (scope?: CollectionExportScope) => Promise<T[]>
  isSelected: (key: string) => boolean
  toggleSelection: (key: string, selected?: boolean) => void
  selectPage: (selected?: boolean) => void
  selectAllMatching: () => void
  clearSelection: () => void
  tableProps: ComputedRef<CollectionTableProps<T, C>>
  paginationProps: ComputedRef<CollectionPaginationProps>
  filterProps: ComputedRef<CollectionTextFilterProps>
  propertyFilterProps: ComputedRef<CollectionPropertyFilterProps>
  preferencesProps: ComputedRef<CollectionPreferencesProps>
  cardListProps: ComputedRef<CollectionCardListProps<T>>
}
