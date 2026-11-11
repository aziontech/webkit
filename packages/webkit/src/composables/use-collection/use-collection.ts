import {
  computed,
  type ComputedRef,
  getCurrentInstance,
  type MaybeRefOrGetter,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  shallowRef,
  toValue,
  watch
} from 'vue'

import {
  type CollectionColumnPreference,
  type CollectionDensity,
  type CollectionPreferencesValue,
  defaultStorage,
  mergeColumns,
  type PreferencesStorage,
  readPreferences,
  writePreferences
} from './preferences'
import {
  emptyQuery,
  type FilteringProperty,
  matchesQuery,
  matchesText,
  type PropertyFilterQuery
} from './property-filter'
import { type CollectionUrlAdapter, historyAdapter, readUrlState, writeUrlState } from './url'

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
  kind?: 'default' | 'action'
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
export type CollectionSelectionMode = 'single' | 'multi'

export interface UseCollectionOptions<
  T extends object,
  C extends CollectionColumn = CollectionColumn
> {
  /** Client mode: every item, filtered, sorted and paged in memory. */
  items?: MaybeRefOrGetter<readonly T[]>
  /** Server mode: loads one page for the current filter, sort and page. */
  fetch?: (params: CollectionFetchParams) => Promise<CollectionFetchResult<T>>
  /** Server mode: loads every item an export writes (`Table.Export`, `exportCsv()`, `exportItems`); without it the loaded page is exported. */
  exportAll?: (params: CollectionExportParams) => Promise<T[]>
  /** Field that identifies an item (selection, row keys). */
  trackBy?: keyof T & string
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
  pagination: { pageIndex: number; pageSize: number }
  pageSize: number
  rowCount: number
  rowsPerPageOptions: number[]
  enableRowSelection: boolean
  rowSelection: Record<string, boolean>
  columnVisibility: Record<string, boolean>
  wrapLines: boolean
  striped: boolean
  density: CollectionDensity
  exportRows: (scope: CollectionExportScope) => Promise<T[]> | T[]
  'onUpdate:sorting': (value: CollectionSort[]) => void
  'onUpdate:pagination': (value: { pageIndex: number; pageSize: number }) => void
  'onUpdate:rowSelection': (value: Record<string, boolean>) => void
  'onUpdate:columnVisibility': (value: Record<string, boolean>) => void
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

export interface CollectionCardsProps<T> {
  items: T[]
  trackBy: string
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
  cardsProps: ComputedRef<CollectionCardsProps<T>>
}

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_PAGE_SIZES = [10, 25, 50, 100]

const columnIdOf = (column: CollectionColumn): string =>
  column.id ?? column.accessorKey ?? column.header ?? ''

let collator: Intl.Collator | undefined

function compareValues(a: unknown, b: unknown): number {
  const missingA = a === null || a === undefined || a === ''
  const missingB = b === null || b === undefined || b === ''
  if (missingA || missingB) return missingA === missingB ? 0 : missingA ? 1 : -1
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b)
  collator ??= new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
  return collator.compare(String(a), String(b))
}

function resolveUrl(
  option: UseCollectionOptions<object>['url']
): { adapter: CollectionUrlAdapter; prefix: string } | null {
  if (!option) return null
  if (option === true) return { adapter: historyAdapter(), prefix: '' }
  if ('read' in option) return { adapter: option, prefix: '' }
  return { adapter: option.adapter ?? historyAdapter(), prefix: option.prefix ?? '' }
}

export function useCollection<T extends object, C extends CollectionColumn = CollectionColumn>(
  options: UseCollectionOptions<T, C>
): UseCollectionReturn<T, C> {
  const serverMode = typeof options.fetch === 'function'
  const trackBy = (options.trackBy ?? 'id') as string
  const keyOf = (item: T): string => String((item as Record<string, unknown>)[trackBy] ?? '')
  const paginated = Boolean(options.pagination)
  const pageSizeOptions = options.pagination?.pageSizeOptions ?? DEFAULT_PAGE_SIZES
  const multiSort = options.sorting?.multiple ?? false
  const selectionMode = options.selection?.mode ?? 'multi'
  const selectionEnabled = Boolean(options.selection)

  const columns = computed<C[]>(() => [...(toValue(options.columns) ?? [])])
  const properties = computed<FilteringProperty[]>(() => [
    ...(toValue(options.propertyFiltering?.properties) ?? [])
  ])

  const filteringText = ref<string>(options.filtering?.defaultText ?? '')
  const query = ref<PropertyFilterQuery>(
    options.propertyFiltering?.defaultQuery ?? emptyQuery()
  ) as Ref<PropertyFilterQuery>
  const sorting = ref<CollectionSort[]>(options.sorting?.defaultState ?? [])
  const page = ref<number>(1)

  const prefColumnsSource = computed<CollectionColumn[]>(() =>
    columns.value.filter((column) => column.kind !== 'action')
  )
  const basePreferences = (): Required<CollectionPreferencesValue> => ({
    pageSize: options.pagination?.pageSize ?? DEFAULT_PAGE_SIZE,
    columns: [],
    wrapLines: false,
    striped: false,
    density: 'comfortable',
    ...options.preferences?.defaults
  })
  const storedPreferences = ref<CollectionPreferencesValue>({})
  const preferences = computed<Required<CollectionPreferencesValue>>(() => {
    const base = basePreferences()
    const merged = { ...base, ...storedPreferences.value }
    const ids = prefColumnsSource.value.map(columnIdOf)
    const hiddenByDefault = (base.columns ?? []).filter((c) => !c.visible).map((c) => c.id)
    return {
      ...merged,
      columns: mergeColumns(storedPreferences.value.columns, ids, hiddenByDefault)
    }
  })
  const pageSize = computed<number>(() =>
    paginated ? preferences.value.pageSize : Number.MAX_SAFE_INTEGER
  )

  const loading = ref<boolean>(false)
  const error = shallowRef<unknown>(null)
  const serverItems = shallowRef<T[]>([])
  const serverTotal = ref<number>(0)
  const seen = new Map<string, T>()

  const filtersActive = computed<boolean>(
    () => filteringText.value.trim() !== '' || query.value.tokens.length > 0
  )

  const fieldOf = (id: string): string => {
    const column = columns.value.find((c) => columnIdOf(c) === id)
    return column?.accessorKey ?? id
  }

  const sourceItems = computed<readonly T[]>(() => toValue(options.items) ?? [])

  const matchingItems = computed<T[]>(() => {
    if (serverMode) return serverItems.value
    const fields = options.filtering?.fields
    const filtered = sourceItems.value.filter(
      (item) =>
        matchesText(item, filteringText.value, fields) &&
        matchesQuery(item, query.value, properties.value, fields)
    )
    if (!sorting.value.length) return filtered
    const comparators = options.sorting?.comparators ?? {}
    const keys = sorting.value.map((sort) => ({
      desc: sort.desc,
      custom: comparators[sort.id],
      field: fieldOf(sort.id)
    }))
    return filtered.sort((a, b) => {
      for (const { desc, custom, field } of keys) {
        const result = custom
          ? custom(a, b)
          : compareValues(
              (a as Record<string, unknown>)[field],
              (b as Record<string, unknown>)[field]
            )
        if (result !== 0) return desc ? -result : result
      }
      return 0
    })
  })

  const totalCount = computed<number>(() =>
    serverMode ? serverTotal.value : matchingItems.value.length
  )
  const pageCount = computed<number>(() =>
    paginated ? Math.max(1, Math.ceil(totalCount.value / pageSize.value)) : 1
  )

  const items = computed<T[]>(() => {
    if (serverMode || !paginated) return matchingItems.value
    const start = (page.value - 1) * pageSize.value
    return matchingItems.value.slice(start, start + pageSize.value)
  })

  const status = computed<CollectionStatus>(() => {
    if (loading.value) return 'loading'
    if (error.value) return 'error'
    if (totalCount.value > 0) return 'ready'
    return filtersActive.value ? 'no-match' : 'empty'
  })

  const selected = ref<string[]>([...(options.selection?.defaultSelectedKeys ?? [])])
  const allMatching = ref<boolean>(false)
  const excluded = ref<string[]>([])

  const isSelected = (key: string): boolean =>
    allMatching.value ? !excluded.value.includes(key) : selected.value.includes(key)

  const pageKeys = computed<string[]>(() => items.value.map(keyOf))

  const setKeys = (keys: string[], value: boolean): void => {
    if (!selectionEnabled) return
    if (allMatching.value) {
      const set = new Set(excluded.value)
      for (const key of keys) {
        if (value) set.delete(key)
        else set.add(key)
      }
      excluded.value = [...set]
      return
    }
    if (selectionMode === 'single') {
      const last = keys[keys.length - 1]
      if (value && last !== undefined) selected.value = [last]
      else selected.value = selected.value.filter((key) => !keys.includes(key))
      return
    }
    const set = new Set(selected.value)
    for (const key of keys) {
      if (value) set.add(key)
      else set.delete(key)
    }
    selected.value = [...set]
  }

  const toggleSelection = (key: string, value?: boolean): void =>
    setKeys([key], value ?? !isSelected(key))

  const pageSelected = computed<boolean>(
    () => pageKeys.value.length > 0 && pageKeys.value.every(isSelected)
  )

  const selectPage = (value?: boolean): void => {
    if (selectionMode === 'single') return
    setKeys(pageKeys.value, value ?? !pageSelected.value)
  }

  const clearSelection = (): void => {
    allMatching.value = false
    excluded.value = []
    selected.value = []
  }

  const selectAllMatching = (): void => {
    if (!selectionEnabled || selectionMode === 'single') return
    if (serverMode) {
      allMatching.value = true
      excluded.value = []
      return
    }
    selected.value = matchingItems.value.map(keyOf)
  }

  const selectedCount = computed<number>(() =>
    allMatching.value
      ? Math.max(0, totalCount.value - excluded.value.length)
      : selected.value.length
  )

  const selectedKeys = computed<string[]>(() =>
    allMatching.value ? pageKeys.value.filter(isSelected) : selected.value
  )

  const selectedItems = computed<T[]>(() => {
    if (serverMode) {
      if (allMatching.value) return serverItems.value.filter((item) => isSelected(keyOf(item)))
      return selected.value
        .map((key) => seen.get(key))
        .filter((item): item is T => item !== undefined)
    }
    const set = new Set(selected.value)
    return sourceItems.value.filter((item) => set.has(keyOf(item)))
  })

  const applyPageSelection = (nextOnPage: Set<string>): void => {
    const turnedOn = pageKeys.value.filter((key) => nextOnPage.has(key) && !isSelected(key))
    const turnedOff = pageKeys.value.filter((key) => !nextOnPage.has(key) && isSelected(key))
    if (turnedOff.length) setKeys(turnedOff, false)
    if (turnedOn.length) setKeys(turnedOn, true)
  }

  const onFiltersChanged = (): void => {
    page.value = 1
    allMatching.value = false
    excluded.value = []
    if (options.selection?.keepSelection || serverMode) {
      if (serverMode && !options.selection?.keepSelection) selected.value = []
      return
    }
    const visible = new Set(matchingItems.value.map(keyOf))
    selected.value = selected.value.filter((key) => visible.has(key))
  }

  const setFilteringText = (text: string): void => {
    if (text === filteringText.value) return
    filteringText.value = text
    onFiltersChanged()
  }

  const setQuery = (next: PropertyFilterQuery): void => {
    query.value = { tokens: [...next.tokens], operation: next.operation }
    onFiltersChanged()
  }

  const clearFilters = (): void => {
    filteringText.value = ''
    query.value = { tokens: [], operation: query.value.operation }
    onFiltersChanged()
  }

  const setSorting = (next: CollectionSort[]): void => {
    sorting.value = multiSort ? [...next] : next.slice(0, 1)
    page.value = 1
  }

  const setPage = (next: number): void => {
    const target = Math.max(1, Math.floor(next))
    page.value = serverMode ? target : Math.min(target, pageCount.value)
  }

  const storage =
    options.preferences?.storage === undefined ? defaultStorage() : options.preferences.storage
  const storageKey = options.preferences?.storageKey

  const setPreferences = (value: CollectionPreferencesValue): void => {
    const sizeChanged =
      value.pageSize !== undefined && value.pageSize !== preferences.value.pageSize
    storedPreferences.value = { ...storedPreferences.value, ...value }
    if (storageKey) writePreferences(storage, storageKey, storedPreferences.value)
    if (sizeChanged) page.value = 1
  }

  const setPageSize = (size: number): void => setPreferences({ pageSize: size })

  watch(totalCount, () => {
    if (!serverMode && page.value > pageCount.value) page.value = pageCount.value
  })

  let controller: AbortController | null = null
  let requestId = 0
  const debouncedText = ref<string>(filteringText.value)
  let textTimer: ReturnType<typeof setTimeout> | undefined

  const refresh = async (): Promise<void> => {
    if (!serverMode || !options.fetch) return
    controller?.abort()
    const current = new AbortController()
    controller = current
    const id = ++requestId
    loading.value = true
    error.value = null
    try {
      const result = await options.fetch({
        filteringText: debouncedText.value,
        filter: { tokens: [...query.value.tokens], operation: query.value.operation },
        sort: [...sorting.value],
        page: page.value,
        pageSize: pageSize.value,
        signal: current.signal
      })
      if (id !== requestId) return
      for (const item of result.items) seen.set(keyOf(item), item)
      serverItems.value = result.items
      serverTotal.value = result.total
      const lastPage = Math.max(1, Math.ceil(result.total / pageSize.value))
      if (page.value > lastPage && result.total > 0) page.value = lastPage
    } catch (cause) {
      if (id !== requestId || current.signal.aborted) return
      error.value = cause
    } finally {
      if (id === requestId) {
        loading.value = false
        controller = null
      }
    }
  }

  const exportItems = async (scope: CollectionExportScope = 'filtered'): Promise<T[]> => {
    if (!serverMode) return scope === 'all' ? [...sourceItems.value] : [...matchingItems.value]
    if (!options.exportAll) return [...serverItems.value]
    return options.exportAll({
      filteringText: filteringText.value,
      filter: { tokens: [...query.value.tokens], operation: query.value.operation },
      sort: [...sorting.value],
      scope
    })
  }

  const exportRows = (scope: CollectionExportScope): Promise<T[]> | T[] =>
    serverMode
      ? exportItems(scope)
      : scope === 'all'
        ? [...sourceItems.value]
        : [...matchingItems.value]

  const url = resolveUrl(options.url as UseCollectionOptions<object>['url'])
  let applyingUrl = false
  const applyUrl = (): void => {
    if (!url) return
    const state = readUrlState(url.adapter.read(), url.prefix)
    applyingUrl = true
    filteringText.value = state.filteringText ?? options.filtering?.defaultText ?? ''
    debouncedText.value = filteringText.value
    query.value = state.query ?? options.propertyFiltering?.defaultQuery ?? emptyQuery()
    sorting.value = state.sorting ?? options.sorting?.defaultState ?? []
    if (state.pageSize !== undefined)
      storedPreferences.value = { ...storedPreferences.value, pageSize: state.pageSize }
    page.value = state.page ?? 1
    applyingUrl = false
  }
  applyUrl()

  let mounted = !serverMode
  const loadStored = (): void => {
    if (!storageKey) return
    const saved = readPreferences(storage, storageKey)
    if (!saved) return
    const fromUrl = url ? readUrlState(url.adapter.read(), url.prefix).pageSize : undefined
    storedPreferences.value = { ...saved, ...(fromUrl !== undefined ? { pageSize: fromUrl } : {}) }
  }

  const start = (): void => {
    loadStored()
    mounted = true
    if (serverMode) void refresh()
  }
  if (getCurrentInstance()) onMounted(start)
  else start()

  if (url) {
    watch(
      [filteringText, query, sorting, page, pageSize],
      () => {
        if (applyingUrl) return
        url.adapter.write(
          writeUrlState(
            url.adapter.read(),
            {
              filteringText: filteringText.value,
              query: query.value,
              sorting: sorting.value,
              page: page.value,
              pageSize: paginated ? pageSize.value : 0
            },
            { pageSize: paginated ? basePreferences().pageSize : 0 },
            url.prefix
          )
        )
      },
      { deep: true }
    )
    const stop = url.adapter.subscribe?.(applyUrl)
    if (stop) onScopeDispose(stop)
  }

  if (serverMode) {
    watch(filteringText, (text) => {
      clearTimeout(textTimer)
      const wait = options.filtering?.debounce ?? 300
      if (wait <= 0) debouncedText.value = text
      else textTimer = setTimeout(() => (debouncedText.value = text), wait)
    })
    watch(
      [debouncedText, query, sorting, page, pageSize],
      () => {
        if (mounted) void refresh()
      },
      { deep: true }
    )
  }

  onScopeDispose(() => {
    clearTimeout(textTimer)
    controller?.abort()
  })

  const orderedColumns = computed<C[]>(() => {
    const order = preferences.value.columns.map((c) => c.id)
    const byId = new Map(columns.value.map((column) => [columnIdOf(column), column]))
    const listed = order.map((id) => byId.get(id)).filter((c): c is C => c !== undefined)
    const rest = columns.value.filter((column) => !order.includes(columnIdOf(column)))
    return [...listed, ...rest]
  })

  const columnVisibility = computed<Record<string, boolean>>(() =>
    Object.fromEntries(
      preferences.value.columns
        .filter((c: CollectionColumnPreference) => !c.visible)
        .map((c) => [c.id, false])
    )
  )

  const rowSelection = computed<Record<string, boolean>>(() =>
    Object.fromEntries(pageKeys.value.filter(isSelected).map((key) => [key, true]))
  )

  const tableProps = computed<CollectionTableProps<T, C>>(() => ({
    data: items.value,
    columns: orderedColumns.value,
    rowKey: trackBy,
    loading: loading.value,
    sorting: sorting.value,
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    paginated,
    pagination: {
      pageIndex: page.value - 1,
      pageSize: paginated ? pageSize.value : items.value.length || 1
    },
    pageSize: paginated ? pageSize.value : DEFAULT_PAGE_SIZE,
    rowCount: totalCount.value,
    rowsPerPageOptions: pageSizeOptions,
    enableRowSelection: selectionEnabled,
    rowSelection: rowSelection.value,
    columnVisibility: columnVisibility.value,
    wrapLines: preferences.value.wrapLines,
    striped: preferences.value.striped,
    density: preferences.value.density,
    exportRows,
    'onUpdate:sorting': setSorting,
    'onUpdate:pagination': (value) => {
      if (value.pageSize !== pageSize.value && paginated) setPageSize(value.pageSize)
      else setPage(value.pageIndex + 1)
    },
    'onUpdate:rowSelection': (value) =>
      applyPageSelection(new Set(Object.keys(value).filter((key) => value[key]))),
    'onUpdate:columnVisibility': (value) =>
      setPreferences({
        columns: preferences.value.columns.map((c) => ({
          id: c.id,
          visible: value[c.id] !== false
        }))
      })
  }))

  const paginationProps = computed<CollectionPaginationProps>(() => ({
    page: page.value,
    total: totalCount.value,
    pageSize: paginated ? pageSize.value : DEFAULT_PAGE_SIZE,
    pageSizeOptions,
    'onUpdate:page': setPage,
    'onUpdate:pageSize': setPageSize
  }))

  const filterProps = computed<CollectionTextFilterProps>(() => ({
    modelValue: filteringText.value,
    'onUpdate:modelValue': setFilteringText
  }))

  const propertyFilterProps = computed<CollectionPropertyFilterProps>(() => ({
    query: query.value,
    properties: properties.value,
    totalCount: totalCount.value,
    'onUpdate:query': setQuery
  }))

  const preferencesProps = computed<CollectionPreferencesProps>(() => ({
    preferences: preferences.value,
    columns: prefColumnsSource.value.map((column) => ({
      id: columnIdOf(column),
      label: column.label ?? column.header ?? columnIdOf(column),
      locked: column.hideable === false
    })),
    pageSizeOptions: paginated ? pageSizeOptions : [],
    'onUpdate:preferences': setPreferences
  }))

  const cardsProps = computed<CollectionCardsProps<T>>(() => ({
    items: items.value,
    trackBy,
    loading: loading.value,
    selectionMode: selectionEnabled ? selectionMode : 'none',
    selectedKeys: pageKeys.value.filter(isSelected),
    'onUpdate:selectedKeys': (keys) => applyPageSelection(new Set(keys))
  }))

  return {
    items,
    matchingItems,
    totalCount,
    pageCount,
    loading: readonly(loading),
    error: readonly(error),
    status,
    filtersActive,
    filteringText: readonly(filteringText),
    query: readonly(query) as Readonly<Ref<PropertyFilterQuery>>,
    sorting: readonly(sorting) as Readonly<Ref<CollectionSort[]>>,
    page: readonly(page),
    pageSize,
    preferences,
    selectedKeys,
    selectedItems,
    selectedCount,
    allMatchingSelected: readonly(allMatching),
    pageSelected,
    setFilteringText,
    setQuery,
    setSorting,
    setPage,
    setPageSize,
    setPreferences,
    clearFilters,
    refresh,
    exportItems,
    isSelected,
    toggleSelection,
    selectPage,
    selectAllMatching,
    clearSelection,
    tableProps,
    paginationProps,
    filterProps,
    propertyFilterProps,
    preferencesProps,
    cardsProps
  }
}
