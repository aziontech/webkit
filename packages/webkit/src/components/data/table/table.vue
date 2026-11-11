<script setup lang="ts">
  import {
    type ColumnDef,
    type ColumnFiltersState,
    type ColumnOrderState,
    type FilterFn,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type PaginationState,
    type Row,
    type RowSelectionState,
    type SortingState,
    type Updater,
    useVueTable,
    type VisibilityState
  } from '@tanstack/vue-table'
  import { useDebounceFn, useElementSize } from '@vueuse/core'
  import {
    type ComponentPublicInstance,
    computed,
    getCurrentInstance,
    nextTick,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
    useAttrs,
    useId,
    useSlots,
    watch
  } from 'vue'

  import { scrollParent } from '../../../composables/use-lazy-chunks'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { downloadCsv, toCsv } from '../../../utils/csv'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import Checkbox from '../../inputs/checkbox/checkbox.vue'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import Pagination from '../pagination/pagination.vue'
  import {
    type AppliedFilter,
    type FilterField,
    type FilterOperator,
    type FilterValue,
    TableInjectionKey,
    type TableStateSnapshot
  } from './injection-key'
  import TableBody from './table-body/table-body.vue'
  import TableCaption from './table-caption/table-caption.vue'
  import TableCell from './table-cell/table-cell.vue'
  import TableFooter from './table-footer/table-footer.vue'
  import TableHeadCell from './table-head-cell/table-head-cell.vue'
  import TableHeader from './table-header/table-header.vue'
  import TableRow from './table-row/table-row.vue'

  type RowRecord = Record<string, unknown>

  export interface TableColumn {
    /** Column id; falls back to accessorKey. */
    id?: string
    /** Field read from each row record. */
    accessorKey?: string
    /** Header label (overridden by a `header-<id>` slot). */
    header?: string
    /** Allow sorting on this column. */
    enableSorting?: boolean
    /** Flex weight; the principal column uses 2 (see `principal`). */
    grow?: 1 | 2 | 3
    /** Mark this as the principal column — it defaults to `grow: 2`. When no column sets it, the first non-checkbox column is principal. */
    principal?: boolean
    /** Pin this column to the start or end edge. */
    frozen?: 'start' | 'end'
    /** Fixed width (px) — needed for a frozen column that precedes another frozen column on the same edge, so sticky offsets can be summed. */
    width?: number
    /** Minimum width (px). The column resolves to the widest of this floor and its own content (its header, with the sort affordance, and every rendered cell) — one width for the whole column, so a chip column reserves nothing it is not using and never clips a chip. `width` wins when both are set. */
    minWidth?: number
    /** Cell alignment. */
    align?: 'start' | 'center' | 'end'
    /** Body cell kind (action renders a 40px trailing cell, auto-pinned to the right edge). */
    kind?: 'default' | 'action'
    /** Allow drag-to-resize on this column's header (ignored for frozen/action columns). */
    resizable?: boolean
    /** Column-selector label when `header` is not a string. */
    label?: string
    /** Exclude from Table.ColumnSelector (defaults true; action columns default false). */
    hideable?: boolean
    /** Opt this column into columnOrder serialization. */
    orderable?: boolean
  }

  type TableColumnMeta = Pick<
    TableColumn,
    'grow' | 'frozen' | 'align' | 'kind' | 'resizable' | 'label' | 'principal'
  >

  defineOptions({
    name: 'Table',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Max height (CSS length). Vertical scroll engages only when set smaller than the content; horizontal scroll is always automatic. */
      maxHeight?: string
      /** Draw the outer card border around the table (off by default; the table is typically framed by a surrounding surface). */
      bordered?: boolean
      /** Data-driven mode: row records. */
      data?: RowRecord[]
      /** Data-driven mode: column definitions. When set, the table renders itself via TanStack. */
      columns?: TableColumn[]
      /** Field used as the stable row id (for selection). */
      rowKey?: string
      /** Enable sorting globally (per-column `enableSorting` overrides). */
      enableSorting?: boolean
      /** Add a leading selection-checkbox column. */
      enableRowSelection?: boolean
      /** Data-driven mode: clicking a row toggles its selection (requires enableRowSelection). */
      selectOnRowClick?: boolean
      /** Header density: `compact` shrinks the column-header row's height and padding. */
      headerKind?: 'default' | 'compact'
      /** Render a Pagination in the footer. */
      paginated?: boolean
      /** Rows per page when paginated. */
      pageSize?: number
      /** v-model:sorting (TanStack SortingState). */
      sorting?: SortingState
      /** v-model:rowSelection (TanStack RowSelectionState). */
      rowSelection?: RowSelectionState
      /** v-model:columnVisibility (TanStack VisibilityState). */
      columnVisibility?: VisibilityState
      /** v-model:globalFilter text. */
      globalFilter?: string
      /** v-model:pagination (TanStack PaginationState). */
      pagination?: PaginationState
      /** Server-side sorting: emit events, do not sort locally. */
      manualSorting?: boolean
      /** Server-side pagination: emit events, do not slice locally. */
      manualPagination?: boolean
      /** Server-side filtering: emit events, do not filter locally. */
      manualFiltering?: boolean
      /** Total row count for manual pagination. */
      rowCount?: number
      /** Rows-per-page options shown in the footer selector. */
      rowsPerPageOptions?: number[]
      /** Data-driven mode: render skeleton rows and set aria-busy while true. */
      loading?: boolean
      /** v-model:filters — structured applied conditions (distinct from globalFilter). */
      filters?: AppliedFilter[]
      /** Field catalog the built-in Table.Filter builder offers. */
      filterFields?: FilterField[]
      /** v-model:state — aggregate serializable snapshot layered over the per-concern models. */
      state?: TableStateSnapshot
      /** Uncontrolled seed applied once on mount (per-concern v-model wins over it). */
      initialState?: Partial<TableStateSnapshot>
      /** Default filename for Table.Export and exportCsv(). */
      exportFilename?: string
      /** Rows Table.Export and exportCsv() write for the `filtered` and `all` scopes in place of the rows the table holds; useCollection binds every match, not only the page. */
      exportRows?: (scope: 'filtered' | 'all') => RowRecord[] | Promise<RowRecord[]>
      /** Data-driven mode: when the table's own box is narrower than `--container-lg`, each row renders as a card of label and value pairs instead of a horizontally scrolling grid. Set false to keep the grid at every width. */
      stackable?: boolean
      /** Data-driven mode: cell text wraps onto several lines instead of truncating. */
      wrapLines?: boolean
      /** Data-driven mode: every other body row takes the raised surface. */
      striped?: boolean
      /** Row density: `compact` shrinks body rows and cell padding. */
      density?: 'comfortable' | 'compact'
      /** Data-driven mode: render only the rows in view, for thousands of rows. The viewport scrolls vertically within `maxHeight` (40rem when empty). Ignored in the stacked layout. */
      virtual?: boolean
      /** Row height (px) assumed in `virtual` mode until a row is measured. */
      estimateRowHeight?: number
    }>(),
    {
      maxHeight: '',
      bordered: false,
      data: () => [],
      columns: () => [],
      rowKey: 'id',
      enableSorting: false,
      enableRowSelection: false,
      selectOnRowClick: false,
      headerKind: 'default',
      paginated: false,
      pageSize: 10,
      sorting: undefined,
      rowSelection: undefined,
      columnVisibility: undefined,
      globalFilter: undefined,
      pagination: undefined,
      manualSorting: false,
      manualPagination: false,
      manualFiltering: false,
      rowCount: undefined,
      rowsPerPageOptions: () => [10, 25, 50, 100],
      loading: false,
      filters: undefined,
      filterFields: () => [],
      state: undefined,
      initialState: undefined,
      exportFilename: 'export.csv',
      exportRows: undefined,
      stackable: true,
      wrapLines: false,
      striped: false,
      density: 'comfortable',
      virtual: false,
      estimateRowHeight: 48
    }
  )

  const emit = defineEmits<{
    'update:sorting': [value: SortingState]
    'update:rowSelection': [value: RowSelectionState]
    'update:columnVisibility': [value: VisibilityState]
    'update:globalFilter': [value: string]
    'update:pagination': [value: PaginationState]
    'row-click': [event: MouseEvent, row: RowRecord]
    'update:filters': [value: AppliedFilter[]]
    'update:state': [value: TableStateSnapshot]
    'filter-apply': [filters: AppliedFilter[]]
    'filter-remove': [filter: AppliedFilter]
    refresh: []
    export: [rows: RowRecord[]]
  }>()

  defineSlots<{
    /** Composition mode: scrollable region (TableCaption, TableHeader, TableBody). */
    default(): unknown
    /** Title text at the start of the toolbar band. */
    title(): unknown
    /** Toolbar action band; scoped with the TanStack table instance in data-driven mode. */
    toolbar(props?: Record<string, unknown>): unknown
    /** Active-filter chips row; same table scope as toolbar. */
    filters(props?: Record<string, unknown>): unknown
    /** Data-driven caption content, wrapped in TableCaption. */
    caption(): unknown
    /** Data-driven empty state when there are no rows. */
    empty(): unknown
    /** Footer region below the scroll viewport, auto-rendered when data-driven and paginated. */
    footer(): unknown
    /** Per-column slots (data-driven): cell- and header- prefixed names, resolved at runtime. */
    [name: string]: (props?: Record<string, unknown>) => unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ table: en.table })

  const slots = useSlots()
  const hasSlot = (name: string): boolean => Boolean((slots as Record<string, unknown>)[name])

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'data-table'
  )

  const captionId = `${useId()}-caption`
  const captions = ref<number>(0)
  const registerCaption = (): (() => void) => {
    captions.value++
    return () => captions.value--
  }
  const splitAttrs = computed<Record<string, unknown>[]>(() => {
    const frame: Record<string, unknown> = {}
    const own: Record<string, unknown> = {}
    for (const name in attrs) (name.startsWith('aria-') ? own : frame)[name] = attrs[name]
    if (
      (captions.value || (dataDriven.value && slots.caption)) &&
      !own['aria-label'] &&
      !own['aria-labelledby']
    )
      own['aria-labelledby'] = captionId
    return [frame, own]
  })

  const viewportHeight = computed<string>(() => props.maxHeight || (props.virtual ? '40rem' : ''))
  const viewportHeightVar = computed<Record<string, string> | undefined>(() =>
    viewportHeight.value ? { '--table-viewport-height': viewportHeight.value } : undefined
  )

  const dataDriven = computed<boolean>(() => props.columns.length > 0)

  const seed = <K extends keyof TableStateSnapshot>(key: K): TableStateSnapshot[K] | undefined =>
    props.state?.[key] ?? props.initialState?.[key]
  const internalSorting = ref<SortingState>(props.sorting ?? seed('sorting') ?? [])
  const internalRowSelection = ref<RowSelectionState>(props.rowSelection ?? {})
  const internalColumnVisibility = ref<VisibilityState>(
    props.columnVisibility ?? seed('columnVisibility') ?? {}
  )
  const internalGlobalFilter = ref<string>(props.globalFilter ?? seed('globalFilter') ?? '')
  const internalPagination = ref<PaginationState>(
    props.pagination ?? seed('pagination') ?? { pageIndex: 0, pageSize: props.pageSize }
  )
  const internalColumnOrder = ref<ColumnOrderState>(seed('columnOrder') ?? [])
  const internalFilters = ref<AppliedFilter[]>(props.filters ?? seed('filters') ?? [])
  watch(
    () => props.sorting,
    (v) => v && (internalSorting.value = v)
  )
  watch(
    () => props.rowSelection,
    (v) => v && (internalRowSelection.value = v)
  )
  watch(
    () => props.columnVisibility,
    (v) => v && (internalColumnVisibility.value = v)
  )
  watch(
    () => props.globalFilter,
    (v) => v !== undefined && (internalGlobalFilter.value = v)
  )
  watch(
    () => props.filters,
    (v) => v !== undefined && (internalFilters.value = v)
  )
  watch(
    () => props.pagination,
    (v) => v && (internalPagination.value = v)
  )
  watch(
    () => props.pageSize,
    (size: number) => {
      if (props.pagination) return
      internalPagination.value = { pageIndex: 0, pageSize: size }
    }
  )

  function applyUpdater<T>(updater: Updater<T>, current: T): T {
    return typeof updater === 'function' ? (updater as (old: T) => T)(current) : updater
  }

  const appliedFilters = computed<AppliedFilter[]>(() => props.filters ?? internalFilters.value)
  const filterFields = computed<FilterField[]>(() => props.filterFields)

  const matchesApplied = (raw: unknown, operator: FilterOperator, value: FilterValue): boolean => {
    const text = (input: unknown): string => String(input ?? '').toLowerCase()
    const list = Array.isArray(value) ? value.map(String) : []
    switch (operator) {
      case 'eq':
        return raw === value
      case 'neq':
        return raw !== value
      case 'contains':
        return text(raw).includes(text(value))
      case 'not-contains':
        return !text(raw).includes(text(value))
      case 'starts-with':
        return text(raw).startsWith(text(value))
      case 'ends-with':
        return text(raw).endsWith(text(value))
      case 'gt':
        return Number(raw) > Number(value)
      case 'gte':
        return Number(raw) >= Number(value)
      case 'lt':
        return Number(raw) < Number(value)
      case 'lte':
        return Number(raw) <= Number(value)
      case 'in':
        return list.includes(String(raw))
      case 'not-in':
        return !list.includes(String(raw))
      case 'is-empty':
        return raw === null || raw === undefined || raw === ''
      case 'is-not-empty':
        return !(raw === null || raw === undefined || raw === '')
      default:
        return true
    }
  }

  const appliedFilterFn: FilterFn<RowRecord> = (row, columnId, filterValue) => {
    const { operator, value } = filterValue as { operator: FilterOperator; value: FilterValue }
    const raw: unknown = row.getValue(columnId)
    return matchesApplied(raw, operator, value)
  }

  const mappedColumnFilters = computed<ColumnFiltersState>(() =>
    props.manualFiltering
      ? []
      : appliedFilters.value.map((filter) => ({
          id: filter.field,
          value: { operator: filter.operator, value: filter.value }
        }))
  )

  const principalIndex = computed<number>(() => {
    const flagged = props.columns.findIndex((col) => col.principal)
    if (flagged !== -1) return flagged
    return props.columns.findIndex((col) => col.kind !== 'action')
  })

  const tableColumns = computed<ColumnDef<RowRecord>[]>(() =>
    props.columns.map((col, index) => ({
      id: col.id ?? col.accessorKey ?? col.header ?? '',
      accessorKey: col.accessorKey,
      header: col.header,
      enableSorting: col.enableSorting ?? props.enableSorting,
      enableHiding: col.hideable ?? col.kind !== 'action',
      filterFn: appliedFilterFn,
      size: col.width,
      meta: {
        grow: col.grow ?? (index === principalIndex.value ? 2 : 1),
        frozen: col.frozen,
        align: col.align,
        kind: col.kind,
        resizable: col.resizable,
        label: col.label,
        principal: index === principalIndex.value
      } satisfies TableColumnMeta
    }))
  )

  const leanRows = computed<boolean>(
    () => props.manualSorting && props.manualFiltering && props.manualPagination
  )
  const rowKeyOf = (row: RowRecord): string => String(row[props.rowKey] ?? '')
  const leanSource: { slice?: { readonly value: RowRecord[] } } = {}

  const table = useVueTable({
    get data() {
      return leanRows.value && leanSource.slice ? leanSource.slice.value : props.data
    },
    get columns() {
      return tableColumns.value
    },
    state: {
      get sorting() {
        return props.sorting ?? internalSorting.value
      },
      get rowSelection() {
        return props.rowSelection ?? internalRowSelection.value
      },
      get columnVisibility() {
        return props.columnVisibility ?? internalColumnVisibility.value
      },
      get globalFilter() {
        return props.globalFilter ?? internalGlobalFilter.value
      },
      get pagination() {
        return props.pagination ?? internalPagination.value
      },
      get columnFilters() {
        return mappedColumnFilters.value
      },
      get columnOrder() {
        return internalColumnOrder.value
      }
    },
    getRowId: (row) => rowKeyOf(row as RowRecord),
    enableRowSelection: () => props.enableRowSelection,
    manualSorting: props.manualSorting,
    manualPagination: props.manualPagination,
    manualFiltering: props.manualFiltering,
    get rowCount() {
      return props.rowCount
    },
    onSortingChange: (updater: Updater<SortingState>) => {
      const next = applyUpdater(updater, props.sorting ?? internalSorting.value)
      internalSorting.value = next
      emit('update:sorting', next)
    },
    onRowSelectionChange: (updater: Updater<RowSelectionState>) => {
      const next = applyUpdater(updater, props.rowSelection ?? internalRowSelection.value)
      internalRowSelection.value = next
      emit('update:rowSelection', next)
    },
    onColumnVisibilityChange: (updater: Updater<VisibilityState>) => {
      const next = applyUpdater(updater, props.columnVisibility ?? internalColumnVisibility.value)
      internalColumnVisibility.value = next
      emit('update:columnVisibility', next)
    },
    onGlobalFilterChange: (updater: Updater<string>) => {
      const next = applyUpdater(updater, props.globalFilter ?? internalGlobalFilter.value)
      internalGlobalFilter.value = next
      emit('update:globalFilter', next)
    },
    onPaginationChange: (updater: Updater<PaginationState>) => {
      const next = applyUpdater(updater, props.pagination ?? internalPagination.value)
      internalPagination.value = next
      emit('update:pagination', next)
    },
    onColumnFiltersChange: () => {},
    onColumnOrderChange: (updater: Updater<ColumnOrderState>) => {
      internalColumnOrder.value = applyUpdater(updater, internalColumnOrder.value)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: props.paginated ? getPaginationRowModel() : undefined
  })

  const headers = computed(() => table.getHeaderGroups()[0]?.headers ?? [])
  const visibleColumnKey = computed<string>(() => headers.value.map((h) => h.id).join('|'))
  const rows = computed(() => table.getRowModel().rows)
  const sourceIds = computed<string[]>(() => (leanRows.value ? props.data.map(rowKeyOf) : []))
  const rowTotal = computed<number>(() => (leanRows.value ? props.data.length : rows.value.length))
  const rowIdAt = (index: number): string =>
    leanRows.value ? (sourceIds.value[index] ?? '') : (rows.value[index]?.id ?? '')

  const RESIZE_FALLBACK_MIN_WIDTH = 40
  const resizeWidths = ref<Record<string, number>>({})
  const resizingColumnId = ref<string | null>(null)
  const autoWidths = ref<Record<string, number>>({})

  const selectedRows = computed<RowRecord[]>(() => {
    if (!leanRows.value) return table.getSelectedRowModel().rows.map((row) => row.original)
    const selection = table.getState().rowSelection
    return props.data.filter((row) => selection[rowKeyOf(row)])
  })
  const selectedCount = computed<number>(() => selectedRows.value.length)
  const pageSelection = computed<'all' | 'some' | 'none'>(() => {
    const all = leanRows.value
      ? selectedCount.value === props.data.length
      : table.getIsAllPageRowsSelected()
    const some = leanRows.value ? selectedCount.value > 0 : table.getIsSomePageRowsSelected()
    return all && (some || !leanRows.value) ? 'all' : some ? 'some' : 'none'
  })
  const toggleAllPageRows = (value: boolean): void => {
    if (!leanRows.value) return table.toggleAllPageRowsSelected(value)
    table.setRowSelection((current) => {
      const next = { ...current }
      for (const id of sourceIds.value) value ? (next[id] = true) : delete next[id]
      return next
    })
  }
  const clearSelection = () => table.resetRowSelection()

  const editingFilter = ref<AppliedFilter | null>(null)

  const filterKey = (filter: AppliedFilter): string =>
    `${filter.field}|${filter.operator}|${JSON.stringify(filter.value)}`

  const applyFilters = (next: AppliedFilter[]): void => {
    internalFilters.value = next
    emit('update:filters', next)
    emit('filter-apply', next)
  }
  const removeFilter = (filter: AppliedFilter): void => {
    const key = filterKey(filter)
    const next = appliedFilters.value.filter((entry) => filterKey(entry) !== key)
    internalFilters.value = next
    emit('update:filters', next)
    emit('filter-remove', filter)
  }
  const clearFilters = (): void => {
    if (appliedFilters.value.length > 0) {
      internalFilters.value = []
      emit('update:filters', [])
    }
    if (internalGlobalFilter.value !== '') {
      internalGlobalFilter.value = ''
      emit('update:globalFilter', '')
    }
  }
  const editFilter = (filter: AppliedFilter): void => {
    editingFilter.value = filter
  }

  const reload = (): void => {
    if (props.loading) return
    emit('refresh')
  }

  const instance = getCurrentInstance()
  const hasExportListener = (): boolean =>
    Boolean((instance?.vnode.props as Record<string, unknown> | null | undefined)?.['onExport'])
  const resolveExportRows = (scope: 'page' | 'filtered' | 'all'): RowRecord[] => {
    if (leanRows.value) return props.data
    if (scope === 'all') return table.getCoreRowModel().rows.map((row) => row.original)
    if (scope === 'page') return rows.value.map((row) => row.original)
    return table.getFilteredRowModel().rows.map((row) => row.original)
  }
  const writeExport = (data: RowRecord[], filename?: string): void => {
    emit('export', data)
    if (hasExportListener()) return
    const columns = table
      .getVisibleLeafColumns()
      .filter((column) => metaOf(column).kind !== 'action')
      .map((column) => ({
        id: (column.columnDef as { accessorKey?: string }).accessorKey ?? column.id,
        header: typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id
      }))
    downloadCsv(filename || props.exportFilename, toCsv({ columns, rows: data }))
  }
  const exportCsv = (options?: {
    filename?: string
    scope?: 'page' | 'filtered' | 'all'
    rows?: RowRecord[]
  }): Promise<void> => {
    const scope = options?.scope ?? 'filtered'
    const source =
      options?.rows ??
      (scope !== 'page' && props.exportRows ? props.exportRows(scope) : resolveExportRows(scope))
    if (source instanceof Promise)
      return source.then((data) => writeExport(data, options?.filename))
    writeExport(source, options?.filename)
    return Promise.resolve()
  }

  const snapshot = (): TableStateSnapshot =>
    JSON.parse(
      JSON.stringify({
        sorting: table.getState().sorting,
        pagination: table.getState().pagination,
        columnVisibility: table.getState().columnVisibility,
        columnOrder: internalColumnOrder.value,
        globalFilter: table.getState().globalFilter ?? '',
        filters: appliedFilters.value
      })
    ) as TableStateSnapshot
  const getState = (): TableStateSnapshot => snapshot()
  const setState = (next: Partial<TableStateSnapshot>): void => {
    if (next.sorting !== undefined) {
      internalSorting.value = next.sorting
      emit('update:sorting', next.sorting)
    }
    if (next.pagination !== undefined) {
      internalPagination.value = next.pagination
      emit('update:pagination', next.pagination)
    }
    if (next.columnVisibility !== undefined) {
      internalColumnVisibility.value = next.columnVisibility
      emit('update:columnVisibility', next.columnVisibility)
    }
    if (next.columnOrder !== undefined) {
      internalColumnOrder.value = next.columnOrder
    }
    if (next.globalFilter !== undefined) {
      internalGlobalFilter.value = next.globalFilter
      emit('update:globalFilter', next.globalFilter)
    }
    if (next.filters !== undefined) {
      internalFilters.value = next.filters
      emit('update:filters', next.filters)
    }
  }

  const emitState = useDebounceFn((value: TableStateSnapshot) => emit('update:state', value), 60)
  let lastStateJson = ''
  watch(
    () => snapshot(),
    (value) => {
      const json = JSON.stringify(value)
      if (json === lastStateJson) return
      lastStateJson = json
      emitState(value)
    },
    { deep: true }
  )
  watch(
    () => props.state,
    (value) => {
      if (!value) return
      if (JSON.stringify(value) === JSON.stringify(snapshot())) return
      setState(value)
    },
    { deep: true }
  )

  provide(TableInjectionKey, {
    testId: testId.value,
    table: computed(() => (dataDriven.value ? table : null)),
    selectedRows,
    selectedCount,
    clearSelection,
    loading: computed(() => props.loading),
    filterFields,
    appliedFilters,
    applyFilters,
    removeFilter,
    clearFilters,
    editingFilter,
    editFilter,
    exportCsv,
    reload,
    captionId,
    registerCaption
  })

  defineExpose({ reload, clearFilters, exportCsv, getState, setState })

  const totalRows = computed<number>(() =>
    props.manualPagination && props.rowCount !== undefined
      ? props.rowCount
      : leanRows.value
        ? props.data.length
        : table.getFilteredRowModel().rows.length
  )
  const pageIndex = computed<number>(() => table.getState().pagination.pageIndex)
  const currentPageSize = computed<number>(() => table.getState().pagination.pageSize)
  const skeletonRowCount = computed<number>(() => {
    const displayed = props.paginated
      ? rowTotal.value || currentPageSize.value
      : props.data.length || props.pageSize
    return Math.max(displayed, 1)
  })

  type ColumnLike = { columnDef: { meta?: unknown } }
  const metaOf = (column: ColumnLike): TableColumnMeta => {
    const meta = (column.columnDef.meta as TableColumnMeta | undefined) ?? {}
    return meta.kind === 'action' && !meta.frozen ? { ...meta, frozen: 'end' } : meta
  }

  type SortableColumn = { getIsSorted: () => 'asc' | 'desc' | false }
  const sortDirectionOf = (column: SortableColumn): 'none' | 'ascending' | 'descending' => {
    const sorted = column.getIsSorted()
    if (sorted === 'asc') return 'ascending'
    if (sorted === 'desc') return 'descending'
    return 'none'
  }

  const onRowClick = (event: MouseEvent, row: Row<RowRecord>) => {
    if (props.selectOnRowClick && props.enableRowSelection) {
      row.toggleSelected()
    }
    emit('row-click', event, row.original)
  }

  const SELECTION_WIDTH = 40
  const columnId = (c: TableColumn): string => c.id ?? c.accessorKey ?? c.header ?? ''
  const frozenEdgeOf = (c: TableColumn): 'start' | 'end' | undefined =>
    c.frozen ?? (c.kind === 'action' ? 'end' : undefined)
  const frozenWidthOf = (c: TableColumn): number =>
    c.width ?? autoWidths.value[columnId(c)] ?? (c.kind === 'action' ? SELECTION_WIDTH : 0)
  const leftFrozenCols = computed<TableColumn[]>(() =>
    props.columns.filter((c: TableColumn) => frozenEdgeOf(c) === 'start')
  )
  const rightFrozenCols = computed<TableColumn[]>(() =>
    props.columns.filter((c: TableColumn) => frozenEdgeOf(c) === 'end')
  )
  const selectionFrozen = computed<boolean>(
    () => props.enableRowSelection && leftFrozenCols.value.length > 0
  )

  const justLoaded = ref<boolean>(true)
  watch(
    () => props.loading,
    (now, previous) => {
      if (previous && !now) justLoaded.value = true
    }
  )
  const onBodyEntered = (): void => {
    justLoaded.value = false
  }
  const hasPinnedColumns = computed<boolean>(
    () =>
      selectionFrozen.value ||
      props.columns.some((c: TableColumn) => c.frozen === 'start' || c.frozen === 'end')
  )
  const bodySlides = computed<boolean>(() => justLoaded.value && !hasPinnedColumns.value)
  const bodyEnterActiveClass = computed<string>(() =>
    bodySlides.value
      ? 'transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none'
      : 'transition-opacity duration-300 ease-out motion-reduce:transition-none'
  )
  const bodyEnterFromClass = computed<string>(() =>
    bodySlides.value ? 'opacity-0 translate-y-2' : 'opacity-0'
  )
  const bodyEnterToClass = computed<string>(() =>
    bodySlides.value ? 'opacity-100 translate-y-0' : 'opacity-100'
  )

  const leftOffsetOf = (id: string): number => {
    let offset = selectionFrozen.value ? SELECTION_WIDTH : 0
    for (const c of leftFrozenCols.value) {
      if (columnId(c) === id) break
      offset += frozenWidthOf(c)
    }
    return offset
  }
  const rightOffsetOf = (id: string): number => {
    let offset = 0
    for (const c of [...rightFrozenCols.value].reverse()) {
      if (columnId(c) === id) break
      offset += frozenWidthOf(c)
    }
    return offset
  }
  const widthOf = (id: string): number | undefined =>
    props.columns.find((c: TableColumn) => columnId(c) === id)?.width
  const cellStyleOf = (column: ColumnLike & { id: string }): Record<string, string> | undefined => {
    if (stacked.value) return undefined
    const style: Record<string, string> = {}
    const meta = metaOf(column)
    const width =
      meta.kind === 'action'
        ? undefined
        : (resizeWidths.value[column.id] ?? widthOf(column.id) ?? autoWidths.value[column.id])
    if (width) {
      style['flex'] = `0 0 ${width}px !important`
      style['width'] = `${width}px !important`
    }
    const frozen = meta.frozen
    if (frozen === 'start') style['left'] = `${leftOffsetOf(column.id)}px`
    else if (frozen === 'end') style['right'] = `${rightOffsetOf(column.id)}px`
    return Object.keys(style).length > 0 ? style : undefined
  }

  const isResizableColumn = (column: ColumnLike & { id: string }): boolean =>
    metaOf(column).resizable === true && !metaOf(column).frozen && metaOf(column).kind !== 'action'

  const initialColumnWidth = (column: ColumnLike & { id: string }): number =>
    widthOf(column.id) ?? autoWidths.value[column.id] ?? (metaOf(column).grow ?? 1) * 150

  const measureCellContentWidth = (cellEl: HTMLElement, host: HTMLElement): number => {
    const clone = cellEl.cloneNode(true) as HTMLElement
    clone.removeAttribute('data-grow')
    clone.removeAttribute('data-frozen')
    clone.querySelectorAll('[role="separator"]').forEach((handle) => handle.remove())
    clone.style.setProperty('position', 'absolute', 'important')
    clone.style.setProperty('left', '0', 'important')
    clone.style.setProperty('top', '0', 'important')
    clone.style.setProperty('flex', 'none', 'important')
    clone.style.setProperty('width', 'max-content', 'important')
    clone.style.setProperty('max-width', 'none', 'important')
    clone.style.setProperty('visibility', 'hidden', 'important')
    clone.style.setProperty('pointer-events', 'none', 'important')
    host.appendChild(clone)
    const width = clone.getBoundingClientRect().width
    clone.remove()
    return width
  }

  const columnContentMinWidth = (headEl: HTMLElement): number => {
    const tableEl = headEl.closest('[role="table"]') as HTMLElement | null
    const row = headEl.closest('[role="row"]') as HTMLElement | null
    const host = tableEl ?? globalThis.document.body
    const colIndex = row ? Array.from(row.children).indexOf(headEl) : -1
    const cells: HTMLElement[] =
      tableEl && colIndex >= 0
        ? Array.from(tableEl.querySelectorAll<HTMLElement>('[role="row"]'))
            .map((r) => r.children[colIndex])
            .filter((c): c is HTMLElement => c instanceof globalThis.HTMLElement)
        : [headEl]
    let max = 0
    for (const cell of cells) max = Math.max(max, measureCellContentWidth(cell, host))
    return Math.ceil(max) || RESIZE_FALLBACK_MIN_WIDTH
  }

  const rootEl = ref<HTMLElement | null>(null)

  const STACK_FALLBACK_WIDTH = 552
  const stackWidth = ref<number>(STACK_FALLBACK_WIDTH)
  const { width: rootWidth } = useElementSize(rootEl)
  const stacked = computed<boolean>(
    () =>
      props.stackable &&
      dataDriven.value &&
      rootWidth.value > 0 &&
      rootWidth.value < stackWidth.value
  )
  const selectAllId = `${useId()}-select-all`

  const viewportRef = ref<ComponentPublicInstance | null>(null)
  const viewportEl = (): HTMLElement | undefined =>
    viewportRef.value?.$el as HTMLElement | undefined
  const scrollTop = ref<number>(0)
  const viewportClientHeight = ref<number>(0)
  const VIRTUAL_OVERSCAN = 8
  const virtualActive = computed<boolean>(
    () => props.virtual && dataDriven.value && !stacked.value && !props.loading
  )

  const LAZY_THRESHOLD = 200
  const LAZY_CHUNK = 50
  const LAZY_MARGIN = 600
  const lazyLimit = ref<number>(LAZY_CHUNK)
  const lazyActive = computed<boolean>(
    () =>
      !virtualActive.value &&
      dataDriven.value &&
      !props.loading &&
      rowTotal.value > LAZY_THRESHOLD &&
      lazyLimit.value < rowTotal.value
  )

  const rowHeights = new Map<string, number>()
  const heightsVersion = ref<number>(0)
  const measuredEstimate = ref<number>(0)
  const rowHeight = computed<number>(
    () => measuredEstimate.value || Math.max(1, props.estimateRowHeight)
  )
  const rowOffsets = computed<Float64Array>(() => {
    void heightsVersion.value
    const total = rowTotal.value
    const estimate = rowHeight.value
    const offsets = new Float64Array(total + 1)
    for (let i = 0; i < total; i++)
      offsets[i + 1] = offsets[i] + (rowHeights.get(rowIdAt(i)) ?? estimate)
    return offsets
  })
  const indexAt = (offsets: Float64Array, y: number): number => {
    let lo = 0
    let hi = offsets.length - 2
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (offsets[mid] <= y) lo = mid
      else hi = mid - 1
    }
    return Math.max(0, lo)
  }
  const windowStart = computed<number>(() => {
    if (!virtualActive.value) return 0
    const first = Math.max(0, indexAt(rowOffsets.value, scrollTop.value) - VIRTUAL_OVERSCAN)
    return first - (first % 2)
  })
  const windowEnd = computed<number>(() => {
    if (lazyActive.value) return Math.min(rowTotal.value, lazyLimit.value)
    if (!virtualActive.value) return rowTotal.value
    const bottom = scrollTop.value + (viewportClientHeight.value || 640)
    const last = indexAt(rowOffsets.value, bottom) + 1
    return Math.min(rowTotal.value, Math.max(last, windowStart.value) + VIRTUAL_OVERSCAN)
  })
  leanSource.slice = computed<RowRecord[]>(() =>
    virtualActive.value || lazyActive.value
      ? props.data.slice(windowStart.value, windowEnd.value)
      : props.data
  )
  const renderedRows = computed(() =>
    !leanRows.value && (virtualActive.value || lazyActive.value)
      ? rows.value.slice(windowStart.value, windowEnd.value)
      : rows.value
  )
  const virtualPadding = computed<Record<string, string> | undefined>(() => {
    if (!virtualActive.value) return undefined
    const offsets = rowOffsets.value
    return {
      paddingBlockStart: `${offsets[windowStart.value]}px`,
      paddingBlockEnd: `${offsets[rowTotal.value] - offsets[windowEnd.value]}px`
    }
  })
  const visibleHeightOf = (el: HTMLElement): number =>
    Math.min(el.clientHeight, globalThis.innerHeight || el.clientHeight)
  const onViewportScroll = (event: Event): void => {
    if (!props.virtual) return
    const el = event.currentTarget as HTMLElement
    scrollTop.value = el.scrollTop
    viewportClientHeight.value = visibleHeightOf(el)
  }

  const rowIndexById = computed<Map<string, number>>(
    () =>
      new Map(
        leanRows.value
          ? sourceIds.value.map((id, index) => [id, index])
          : rows.value.map((row, index) => [row.id, index])
      )
  )
  const trackedRows = new Map<string, HTMLElement>()
  const trackedIds = new WeakMap<Element, string>()
  let rowObserver: ResizeObserver | null = null
  let heightsFrame = 0
  const onRowsResized = (entries: ResizeObserverEntry[]): void => {
    const el = viewportEl()
    const anchor = el ? indexAt(rowOffsets.value, el.scrollTop) : 0
    const estimate = rowHeight.value
    let shift = 0
    let changed = false
    let firstSum = 0
    let firstCount = 0
    for (const entry of entries) {
      const target = entry.target as HTMLElement
      const id = trackedIds.get(target)
      const height = target.offsetHeight
      if (id === undefined || height <= 0) continue
      const previous = rowHeights.get(id)
      if (previous !== undefined && Math.abs(previous - height) < 0.5) continue
      const index = rowIndexById.value.get(id)
      if (index !== undefined && index < anchor) shift += height - (previous ?? estimate)
      rowHeights.set(id, height)
      firstSum += height
      firstCount += 1
      changed = true
    }
    if (!changed) return
    const estimateNext = measuredEstimate.value || (firstCount ? firstSum / firstCount : 0)
    if (!measuredEstimate.value) shift = 0
    if (el && shift) el.scrollTop += shift
    globalThis.cancelAnimationFrame(heightsFrame)
    heightsFrame = globalThis.requestAnimationFrame(() => {
      measuredEstimate.value = estimateNext
      heightsVersion.value += 1
      if (el) scrollTop.value = el.scrollTop
    })
  }
  const trackRow = (instance: unknown, id: string): void => {
    const el = (instance as ComponentPublicInstance | null)?.$el as HTMLElement | undefined
    const previous = trackedRows.get(id)
    if (previous && previous !== el) {
      rowObserver?.unobserve(previous)
      trackedRows.delete(id)
    }
    if (!el || !virtualActive.value || previous === el) return
    if (!rowObserver) {
      if (typeof ResizeObserver === 'undefined') return
      rowObserver = new ResizeObserver(onRowsResized)
    }
    trackedRows.set(id, el)
    trackedIds.set(el, id)
    rowObserver.observe(el)
  }
  const resetRowHeights = (): void => {
    rowHeights.clear()
    measuredEstimate.value = 0
    heightsVersion.value += 1
    for (const el of trackedRows.values()) {
      rowObserver?.unobserve(el)
      rowObserver?.observe(el)
    }
  }
  watch(
    () => [props.density, props.wrapLines, visibleColumnKey.value, resizeWidths.value],
    resetRowHeights
  )
  watch(
    () => [virtualActive.value, renderedRows.value.length],
    () =>
      void nextTick(() => {
        const el = viewportEl()
        if (el && virtualActive.value) viewportClientHeight.value = visibleHeightOf(el)
      }),
    { flush: 'post' }
  )

  const lazyGap = computed<number>(() =>
    lazyActive.value ? (rowTotal.value - windowEnd.value) * rowHeight.value : 0
  )
  const windowed = computed<boolean>(() => virtualActive.value || lazyActive.value)
  const lazySentinel = ref<HTMLElement | null>(null)
  let lazyObserver: IntersectionObserver | null = null
  const onLazyIntersect = (entries: IntersectionObserverEntry[]): void => {
    const entry = entries[entries.length - 1]
    if (!entry?.isIntersecting) return
    const rootBottom = entry.rootBounds?.bottom ?? globalThis.innerHeight
    const reach = rootBottom + LAZY_MARGIN - entry.boundingClientRect.top
    const extra = Math.max(LAZY_CHUNK, Math.ceil(reach / rowHeight.value) + LAZY_CHUNK / 2)
    lazyLimit.value = Math.min(rowTotal.value, lazyLimit.value + extra)
  }
  const observeSentinel = (): void => {
    lazyObserver?.disconnect()
    lazyObserver = null
    const el = lazySentinel.value
    if (!el || !lazyActive.value || typeof IntersectionObserver === 'undefined') return
    lazyObserver = new IntersectionObserver(onLazyIntersect, {
      root: scrollParent(el),
      rootMargin: `${LAZY_MARGIN}px`
    })
    lazyObserver.observe(el)
  }
  watch([lazySentinel, lazyLimit, lazyActive], observeSentinel, { flush: 'post' })
  onBeforeUnmount(() => {
    lazyObserver?.disconnect()
    rowObserver?.disconnect()
    globalThis.cancelAnimationFrame(heightsFrame)
  })

  const isStackedField = (column: ColumnLike): boolean => {
    const meta = metaOf(column)
    return !meta.principal && (meta.kind ?? 'default') === 'default'
  }
  const stackedLabelOf = (column: ColumnLike & { id: string }): string => {
    const header = (column.columnDef as { header?: unknown }).header
    return metaOf(column).label ?? (typeof header === 'string' ? header : column.id)
  }

  const STACKED_FIELD_CLASS =
    'order-1 basis-full! min-h-8! justify-start! text-start! whitespace-normal static! before:hidden! after:hidden!'
  const STACKED_CELL_CLASS = 'static! before:hidden! after:hidden!'
  interface ColumnView {
    kind: 'default' | 'action'
    grow: 1 | 2 | 3
    align: 'start' | 'center' | 'end'
    frozen: 'start' | 'end' | undefined
    style: Record<string, string> | undefined
    stackedClass: string | undefined
    stackedField: boolean
  }
  const columnViews = computed<Map<string, ColumnView>>(() => {
    const views = new Map<string, ColumnView>()
    for (const header of headers.value) {
      const column = header.column
      const meta = metaOf(column)
      const stackedField = stacked.value && isStackedField(column)
      views.set(column.id, {
        kind: meta.kind ?? 'default',
        grow: meta.grow ?? 1,
        align: meta.align ?? 'start',
        frozen: meta.frozen,
        style: cellStyleOf(column),
        stackedClass: stacked.value
          ? stackedField
            ? STACKED_FIELD_CLASS
            : STACKED_CELL_CLASS
          : undefined,
        stackedField
      })
    }
    return views
  })
  const viewOf = (id: string): ColumnView => columnViews.value.get(id) as ColumnView

  const measureAutoWidths = (): void => {
    const root = rootEl.value
    if (!root || props.loading || stacked.value) return
    const headCells = Array.from(root.querySelectorAll<HTMLElement>('[role="columnheader"]'))
    const offset = props.enableRowSelection ? 1 : 0
    const next: Record<string, number> = {}
    headers.value.forEach((header, index) => {
      const column = props.columns.find((c: TableColumn) => columnId(c) === header.column.id)
      if (column?.minWidth == null || column.width != null) return
      const cell = headCells[index + offset]
      if (!cell) return
      next[header.column.id] = Math.max(column.minWidth, columnContentMinWidth(cell))
    })
    const current = autoWidths.value
    const ids = new Set([...Object.keys(next), ...Object.keys(current)])
    for (const id of ids) {
      if (next[id] !== current[id]) {
        autoWidths.value = next
        return
      }
    }
  }

  const scheduleAutoFit = useDebounceFn(() => measureAutoWidths(), 32)

  onMounted(() => {
    const token = rootEl.value
      ? Number.parseFloat(
          globalThis.getComputedStyle(rootEl.value).getPropertyValue('--container-lg')
        )
      : Number.NaN
    if (Number.isFinite(token) && token > 0) stackWidth.value = token
    void nextTick(() => measureAutoWidths())
    const fonts = (globalThis.document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts
    if (fonts?.ready) void fonts.ready.then(() => measureAutoWidths())
  })

  watch(
    () => [
      props.columns,
      props.loading,
      props.enableRowSelection,
      props.data,
      renderedRows.value.length,
      headers.value.map((header) => header.column.id).join('|'),
      stacked.value
    ],
    () => void scheduleAutoFit()
  )

  const startResize = (
    column: ColumnLike & { id: string },
    event: MouseEvent | globalThis.TouchEvent
  ): void => {
    const pointX = (e: MouseEvent | globalThis.TouchEvent): number =>
      'touches' in e ? (e.touches[0]?.clientX ?? 0) : e.clientX
    const target = event.currentTarget as HTMLElement | null
    const headEl = target?.closest('[role="columnheader"]') as HTMLElement | null
    const headerRow = headEl?.closest('[role="row"]') as HTMLElement | null
    if (headerRow) {
      const headerCells = Array.from(
        headerRow.querySelectorAll<HTMLElement>('[role="columnheader"]')
      )
      const offset = props.enableRowSelection ? 1 : 0
      const snapshot = { ...resizeWidths.value }
      headers.value.forEach((header, columnIndex: number) => {
        const m = metaOf(header.column)
        if (m.frozen || m.kind === 'action' || snapshot[header.column.id] != null) return
        const cell = headerCells[columnIndex + offset]
        if (cell) snapshot[header.column.id] = Math.round(cell.getBoundingClientRect().width)
      })
      resizeWidths.value = snapshot
    }
    const startX = pointX(event)
    const startWidth =
      resizeWidths.value[column.id] ??
      headEl?.getBoundingClientRect().width ??
      initialColumnWidth(column)
    const minWidth = headEl ? columnContentMinWidth(headEl) : RESIZE_FALLBACK_MIN_WIDTH
    resizingColumnId.value = column.id
    const doc = globalThis.document
    const onMove = (moveEvent: MouseEvent | globalThis.TouchEvent): void => {
      moveEvent.preventDefault()
      const next = Math.max(minWidth, Math.round(startWidth + (pointX(moveEvent) - startX)))
      resizeWidths.value = { ...resizeWidths.value, [column.id]: next }
    }
    const onEnd = (): void => {
      resizingColumnId.value = null
      doc.removeEventListener('mousemove', onMove)
      doc.removeEventListener('mouseup', onEnd)
      doc.removeEventListener('touchmove', onMove)
      doc.removeEventListener('touchend', onEnd)
    }
    doc.addEventListener('mousemove', onMove)
    doc.addEventListener('mouseup', onEnd)
    doc.addEventListener('touchmove', onMove, { passive: false })
    doc.addEventListener('touchend', onEnd)
    event.preventDefault()
  }
</script>

<template>
  <div
    ref="rootEl"
    v-bind="splitAttrs[0]"
    :data-testid="testId"
    :data-border="bordered || null"
    :data-stacked="stacked || null"
    :data-density="density"
    :data-wrap="wrapLines || null"
    :style="viewportHeightVar"
    class="@container/table data-[density=compact]:[&_[role=cell]]:min-h-9 data-[density=compact]:[&_[role=cell]]:py-(--spacing-xxs) data-[wrap]:[&_[role=cell]]:whitespace-normal data-[wrap]:[&_[role=cell]_.truncate]:whitespace-normal data-[wrap]:[&_[role=cell]_.truncate]:break-words flex w-full flex-col overflow-hidden rounded-(--shape-elements) bg-(--bg-surface) text-(--text-default) text-body-sm data-[border]:border-(length:--border-width-default) data-[border]:border-solid data-[border]:border-(--border-default)"
  >
    <div
      v-if="$slots['title'] || $slots['toolbar']"
      role="presentation"
      :data-testid="`${testId}__toolbar`"
      class="flex flex-wrap items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-solid border-(--border-default) p-(--spacing-sm)"
    >
      <div
        v-if="$slots['title']"
        class="text-label-md text-(--text-default)"
      >
        <slot name="title" />
      </div>
      <div
        v-if="$slots['toolbar']"
        class="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-(--spacing-xs) @max-md/table:basis-full @max-md/table:justify-start"
      >
        <slot
          name="toolbar"
          :table="dataDriven ? table : undefined"
          :selected-rows="selectedRows"
          :selected-count="selectedCount"
          :clear-selection="clearSelection"
          :loading="loading"
        />
      </div>
    </div>
    <div
      v-if="$slots['filters'] && appliedFilters.length > 0"
      role="presentation"
      :data-testid="`${testId}__filters`"
      class="flex flex-wrap items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-solid border-(--border-default) p-(--spacing-sm)"
    >
      <slot
        name="filters"
        :table="dataDriven ? table : undefined"
        :selected-rows="selectedRows"
        :selected-count="selectedCount"
        :clear-selection="clearSelection"
        :loading="loading"
      />
    </div>

    <TableCaption v-if="dataDriven && $slots['caption']">
      <slot name="caption" />
    </TableCaption>

    <ScrollArea
      ref="viewportRef"
      :orientation="viewportHeight ? 'both' : 'horizontal'"
      :data-testid="`${testId}__viewport`"
      class="min-w-0 max-h-(--table-viewport-height)"
      @scroll.passive="onViewportScroll"
    >
      <div
        v-bind="splitAttrs[1]"
        role="table"
        :data-testid="`${testId}__table`"
        :aria-busy="loading || undefined"
        :aria-rowcount="windowed ? rowTotal + 1 : undefined"
        class="flex w-max min-w-full flex-col"
        :class="stacked ? 'w-full!' : undefined"
      >
        <template v-if="dataDriven">
          <TableHeader
            frozen
            :kind="headerKind"
            :class="stacked ? 'sr-only!' : undefined"
          >
            <TableRow>
              <TableHeadCell
                v-if="enableRowSelection"
                kind="checkbox"
                :frozen="selectionFrozen ? 'start' : undefined"
              >
                <Checkbox
                  v-if="!stacked"
                  binary
                  :model-value="pageSelection === 'all'"
                  :indeterminate="pageSelection === 'some'"
                  :aria-label="t('table.selectAll')"
                  @update:model-value="(v) => toggleAllPageRows(!!v)"
                />
              </TableHeadCell>
              <TableHeadCell
                v-for="header in headers"
                :key="header.id"
                :kind="metaOf(header.column).kind ?? 'default'"
                :grow="metaOf(header.column).grow ?? 1"
                :align="metaOf(header.column).align ?? 'start'"
                :frozen="metaOf(header.column).frozen"
                :style="cellStyleOf(header.column)"
                :sortable="header.column.getCanSort()"
                :sort-direction="sortDirectionOf(header.column)"
                :resizable="isResizableColumn(header.column)"
                :resizing="resizingColumnId === header.column.id"
                :resize-handler="(event) => startResize(header.column, event)"
                @sort="(direction) => header.column.toggleSorting(direction === 'descending')"
              >
                <slot
                  v-if="hasSlot('header-' + header.column.id)"
                  :name="'header-' + header.column.id"
                  :column="header.column"
                />
                <template v-else-if="header.column.columnDef.header">{{
                  header.column.columnDef.header
                }}</template>
              </TableHeadCell>
            </TableRow>
          </TableHeader>

          <div
            v-if="stacked && enableRowSelection && !loading && rowTotal > 0"
            role="presentation"
            :data-testid="`${testId}__stacked-select-all`"
            class="flex min-h-10 items-center gap-(--spacing-xs) px-(--spacing-sm) pt-(--spacing-xs)"
          >
            <Checkbox
              binary
              :input-id="selectAllId"
              :model-value="pageSelection === 'all'"
              :indeterminate="pageSelection === 'some'"
              @update:model-value="(v) => toggleAllPageRows(!!v)"
            />
            <label
              :for="selectAllId"
              class="cursor-pointer text-label-sm text-(--text-default)"
              >{{ t('table.selectAll') }}</label
            >
          </div>

          <TableBody
            v-if="loading"
            key="skeleton"
            :class="stacked ? 'gap-(--spacing-xs) p-(--spacing-xs)' : undefined"
          >
            <TableRow
              v-for="n in skeletonRowCount"
              :key="'sk-' + n"
              :class="
                stacked
                  ? 'flex-wrap rounded-(--shape-elements) border! py-(--spacing-xxs)'
                  : undefined
              "
            >
              <TableCell
                v-if="enableRowSelection"
                kind="checkbox"
                :frozen="selectionFrozen ? 'start' : undefined"
                :class="stacked ? 'static! before:hidden! after:hidden!' : undefined"
              >
                <Skeleton
                  kind="shape"
                  width="16px"
                  height="16px"
                />
              </TableCell>
              <TableCell
                v-for="header in headers"
                :key="header.id"
                :style="viewOf(header.column.id).style"
                :grow="viewOf(header.column.id).grow"
                :align="viewOf(header.column.id).align"
                :frozen="viewOf(header.column.id).frozen"
                :kind="viewOf(header.column.id).kind"
                :class="viewOf(header.column.id).stackedClass"
              >
                <Skeleton
                  v-if="viewOf(header.column.id).kind !== 'action'"
                  height="0.875rem"
                />
              </TableCell>
            </TableRow>
          </TableBody>

          <Transition
            appear
            :enter-active-class="bodyEnterActiveClass"
            :enter-from-class="bodyEnterFromClass"
            :enter-to-class="bodyEnterToClass"
            @after-enter="onBodyEntered"
            @enter-cancelled="onBodyEntered"
          >
            <TableBody
              v-if="!loading && rowTotal > 0"
              key="rows"
              :class="stacked ? 'gap-(--spacing-xs) p-(--spacing-xs)' : undefined"
              :style="virtualPadding"
            >
              <TableRow
                v-for="(row, index) in renderedRows"
                :key="row.id"
                :ref="virtualActive ? (el) => trackRow(el, row.id) : undefined"
                v-memo="[
                  row.getIsSelected(),
                  row.original,
                  columnViews,
                  striped,
                  windowed,
                  virtualActive,
                  windowStart + index
                ]"
                :selected="row.getIsSelected()"
                :aria-rowindex="windowed ? windowStart + index + 2 : undefined"
                :class="[
                  stacked
                    ? 'flex-wrap rounded-(--shape-elements) border! py-(--spacing-xxs)'
                    : undefined,
                  striped && (windowStart + index) % 2 === 1
                    ? '[--table-row-bg:var(--bg-surface-raised)]'
                    : undefined
                ]"
                @click="onRowClick($event, row)"
              >
                <TableCell
                  v-if="enableRowSelection"
                  kind="checkbox"
                  :frozen="selectionFrozen ? 'start' : undefined"
                  :class="stacked ? 'static! before:hidden! after:hidden!' : undefined"
                >
                  <Checkbox
                    binary
                    :model-value="row.getIsSelected()"
                    :aria-label="t('table.selectRow')"
                    @update:model-value="(v) => row.toggleSelected(!!v)"
                  />
                </TableCell>
                <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  :style="viewOf(cell.column.id).style"
                  :grow="viewOf(cell.column.id).grow"
                  :align="viewOf(cell.column.id).align"
                  :frozen="viewOf(cell.column.id).frozen"
                  :kind="viewOf(cell.column.id).kind"
                  :class="viewOf(cell.column.id).stackedClass"
                >
                  <span
                    v-if="viewOf(cell.column.id).stackedField"
                    aria-hidden="true"
                    :data-testid="`${testId}__stacked-label`"
                    class="w-2/5 shrink-0 truncate text-label-sm text-(--text-muted)"
                    >{{ stackedLabelOf(cell.column) }}</span
                  >
                  <slot
                    v-if="hasSlot('cell-' + cell.column.id)"
                    :name="'cell-' + cell.column.id"
                    :row="row.original"
                    :value="cell.getValue()"
                  />
                  <span
                    v-else
                    class="min-w-0 flex-1 truncate"
                    >{{ cell.getValue() }}</span
                  >
                </TableCell>
              </TableRow>
              <div
                v-if="lazyActive"
                ref="lazySentinel"
                role="presentation"
                aria-hidden="true"
                :data-testid="`${testId}__lazy-rows`"
                :style="{ height: `${lazyGap}px` }"
              />
            </TableBody>
          </Transition>
        </template>

        <slot v-else />
      </div>
      <Transition
        v-if="dataDriven"
        enter-active-class="transition-opacity duration-300 ease-out motion-reduce:transition-none"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div
          v-if="!loading && rowTotal === 0"
          :data-testid="`${testId}__empty`"
          class="sticky start-0 w-full"
        >
          <slot name="empty">
            <EmptyState
              size="small"
              icon="pi pi-table"
              :title="t('table.emptyTitle')"
              :description="t('table.emptyDescription')"
            />
          </slot>
        </div>
      </Transition>
    </ScrollArea>

    <TableFooter v-if="dataDriven && paginated">
      <div class="flex items-center px-(--spacing-sm) py-(--spacing-xs)">
        <Pagination
          class="w-full"
          :page="pageIndex + 1"
          :total="totalRows"
          :page-size="currentPageSize"
          :page-size-options="rowsPerPageOptions"
          @update:page="(page) => table.setPageIndex(page - 1)"
          @update:page-size="(size) => table.setPageSize(size)"
        />
      </div>
    </TableFooter>
    <slot
      v-else-if="!dataDriven"
      name="footer"
    />
  </div>
</template>
