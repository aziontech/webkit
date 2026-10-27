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
  import { useDebounceFn } from '@vueuse/core'
  import {
    computed,
    getCurrentInstance,
    nextTick,
    onMounted,
    provide,
    ref,
    useAttrs,
    useSlots,
    watch
  } from 'vue'

  import { downloadCsv, toCsv } from '../../../utils/csv'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import Checkbox from '../../inputs/checkbox/checkbox.vue'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import Paginator from '../paginator/paginator.vue'
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
    'grow' | 'frozen' | 'align' | 'kind' | 'resizable' | 'label'
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
      border?: boolean
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
      /** Render a Paginator in the footer. */
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
    }>(),
    {
      maxHeight: '',
      border: false,
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
      exportFilename: 'export.csv'
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

  const slots = useSlots()
  const hasSlot = (name: string): boolean => Boolean((slots as Record<string, unknown>)[name])

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'data-table'
  )

  const viewportHeightVar = computed<Record<string, string> | undefined>(() =>
    props.maxHeight ? { '--table-viewport-height': props.maxHeight } : undefined
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
        label: col.label
      } satisfies TableColumnMeta
    }))
  )

  const table = useVueTable({
    get data() {
      return props.data
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
    getRowId: (row) => String((row as RowRecord)[props.rowKey] ?? ''),
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
  const rows = computed(() => table.getRowModel().rows)

  const RESIZE_FALLBACK_MIN_WIDTH = 40
  const resizeWidths = ref<Record<string, number>>({})
  const resizingColumnId = ref<string | null>(null)
  const autoWidths = ref<Record<string, number>>({})

  const selectedRows = computed<RowRecord[]>(() =>
    table.getSelectedRowModel().rows.map((row) => row.original)
  )
  const selectedCount = computed<number>(() => table.getSelectedRowModel().rows.length)
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
    if (scope === 'all') return table.getCoreRowModel().rows.map((row) => row.original)
    if (scope === 'page') return rows.value.map((row) => row.original)
    return table.getFilteredRowModel().rows.map((row) => row.original)
  }
  const exportCsv = (options?: {
    filename?: string
    scope?: 'page' | 'filtered' | 'all'
  }): void => {
    const data = resolveExportRows(options?.scope ?? 'filtered')
    emit('export', data)
    if (hasExportListener()) return
    const columns = table
      .getVisibleLeafColumns()
      .filter((column) => metaOf(column).kind !== 'action')
      .map((column) => ({
        id: column.id,
        header: typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id
      }))
    downloadCsv(options?.filename || props.exportFilename, toCsv({ columns, rows: data }))
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
    reload
  })

  defineExpose({ reload, clearFilters, exportCsv, getState, setState })

  const totalRows = computed<number>(() =>
    props.manualPagination && props.rowCount !== undefined
      ? props.rowCount
      : table.getFilteredRowModel().rows.length
  )
  const pageIndex = computed<number>(() => table.getState().pagination.pageIndex)
  const currentPageSize = computed<number>(() => table.getState().pagination.pageSize)
  const skeletonRowCount = computed<number>(() => {
    const displayed = props.paginated
      ? rows.value.length || currentPageSize.value
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

  const measureAutoWidths = (): void => {
    const root = rootEl.value
    if (!root || props.loading) return
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
    void nextTick(() => measureAutoWidths())
    const fonts = (globalThis.document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts
    if (fonts?.ready) void fonts.ready.then(() => measureAutoWidths())
  })

  watch(
    () => [
      props.columns,
      props.loading,
      props.enableRowSelection,
      rows.value.map((row) => row.original),
      headers.value.map((header) => header.column.id).join('|')
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
    v-bind="$attrs"
    role="table"
    :data-testid="testId"
    :data-border="border || null"
    :aria-busy="loading || undefined"
    :style="viewportHeightVar"
    class="flex w-full flex-col overflow-hidden rounded-(--shape-elements) bg-(--bg-surface) text-(--text-default) text-body-sm data-[border]:border-(length:--border-width-default) data-[border]:border-solid data-[border]:border-(--border-default)"
  >
    <div
      v-if="$slots['title'] || $slots['toolbar']"
      role="presentation"
      :data-testid="`${testId}__toolbar`"
      class="flex items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-solid border-(--border-default) p-(--spacing-sm)"
    >
      <div
        v-if="$slots['title']"
        class="text-label-md text-(--text-default)"
      >
        <slot name="title" />
      </div>
      <div
        v-if="$slots['toolbar']"
        class="flex flex-1 items-center justify-end gap-(--spacing-xs)"
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
      :orientation="maxHeight ? 'both' : 'horizontal'"
      :data-testid="`${testId}__viewport`"
      class="min-w-0 max-h-(--table-viewport-height)"
    >
      <div
        role="presentation"
        class="flex w-max min-w-full flex-col"
      >
        <template v-if="dataDriven">
          <TableHeader
            frozen
            :kind="headerKind"
          >
            <TableRow>
              <TableHeadCell
                v-if="enableRowSelection"
                kind="checkbox"
                :frozen="selectionFrozen ? 'start' : undefined"
              >
                <Checkbox
                  binary
                  :model-value="table.getIsAllPageRowsSelected()"
                  :indeterminate="table.getIsSomePageRowsSelected()"
                  aria-label="Select all rows"
                  @update:model-value="(v) => table.toggleAllPageRowsSelected(!!v)"
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
                <template v-else>{{ header.column.columnDef.header }}</template>
              </TableHeadCell>
            </TableRow>
          </TableHeader>

          <TableBody
            v-if="loading"
            key="skeleton"
          >
            <TableRow
              v-for="n in skeletonRowCount"
              :key="'sk-' + n"
            >
              <TableCell
                v-if="enableRowSelection"
                kind="checkbox"
                :frozen="selectionFrozen ? 'start' : undefined"
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
                :style="cellStyleOf(header.column)"
                :grow="metaOf(header.column).grow ?? 1"
                :align="metaOf(header.column).align ?? 'start'"
                :frozen="metaOf(header.column).frozen"
                :kind="metaOf(header.column).kind ?? 'default'"
              >
                <Skeleton
                  v-if="metaOf(header.column).kind !== 'action'"
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
              v-if="!loading && rows.length > 0"
              key="rows"
            >
              <TableRow
                v-for="row in rows"
                :key="row.id"
                v-memo="[row.getIsSelected(), row.original, resizeWidths, autoWidths]"
                :selected="row.getIsSelected()"
                @click="onRowClick($event, row)"
              >
                <TableCell
                  v-if="enableRowSelection"
                  kind="checkbox"
                  :frozen="selectionFrozen ? 'start' : undefined"
                >
                  <Checkbox
                    binary
                    :model-value="row.getIsSelected()"
                    aria-label="Select row"
                    @update:model-value="(v) => row.toggleSelected(!!v)"
                  />
                </TableCell>
                <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  :style="cellStyleOf(cell.column)"
                  :grow="metaOf(cell.column).grow ?? 1"
                  :align="metaOf(cell.column).align ?? 'start'"
                  :frozen="metaOf(cell.column).frozen"
                  :kind="metaOf(cell.column).kind ?? 'default'"
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
            </TableBody>
          </Transition>

          <Transition
            enter-active-class="transition-opacity duration-300 ease-out motion-reduce:transition-none"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
          >
            <div
              v-if="!loading && rows.length === 0"
              role="presentation"
              :data-testid="`${testId}__empty`"
              class="w-full"
            >
              <slot name="empty">
                <EmptyState
                  size="small"
                  icon="pi pi-table"
                  title="No results yet"
                  description="Get started by creating your first resource."
                />
              </slot>
            </div>
          </Transition>
        </template>

        <slot v-else />
      </div>
    </ScrollArea>

    <TableFooter v-if="dataDriven && paginated">
      <div class="flex items-center px-(--spacing-sm) py-(--spacing-xs)">
        <Paginator
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
