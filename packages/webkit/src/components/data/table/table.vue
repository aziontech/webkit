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
  import { computed, getCurrentInstance, provide, ref, useAttrs, useSlots, watch } from 'vue'

  import EmptyIllustration from '../../../svg/illustration-layers/illustration-layers.vue'
  import { downloadCsv, toCsv } from '../../../utils/csv'
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
      headerVariant?: 'default' | 'compact'
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
      headerVariant: 'default',
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
    'row-click': [row: RowRecord]
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

  // Per-column `cell-<id>` / `header-<id>` slots are looked up by a computed name,
  // which `defineSlots` cannot type as a static key — probe them through the raw
  // slots record so the dynamic index doesn't trip the typed `$slots`.
  const slots = useSlots()
  const hasSlot = (name: string): boolean => Boolean((slots as Record<string, unknown>)[name])

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'data-table'
  )

  // ScrollArea (the project's scroll primitive) is the scroll viewport. It only
  // forwards `class`, so the dynamic max-height is published as a CSS variable on
  // the root and consumed by a static `max-h-[var(--table-viewport-height)]` class.
  const viewportHeightVar = computed<Record<string, string> | undefined>(() =>
    props.maxHeight ? { '--table-viewport-height': props.maxHeight } : undefined
  )

  const dataDriven = computed<boolean>(() => props.columns.length > 0)

  // Controlled (v-model) with uncontrolled fallback. `state` / `initialState`
  // seed a concern only when its own per-concern v-model prop is absent, so a
  // bound `v-model:sorting` (etc.) always wins over the aggregate snapshot.
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
  // Keep the uncontrolled pagination state in sync when the pageSize prop
  // changes after mount; reset to the first page so it can't fall out of range.
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

  // --- Structured filters (Table.Filter / Table.AppliedFilters) --------------
  // The committed filter set is a v-model (`filters`); `Table.Search` still owns
  // the free-text `globalFilter` separately. Client-side, applied filters map to
  // TanStack columnFilters; under `manualFiltering` they are left to the app.
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

  // Per-column filter fn; the columnFilters value carries `{ operator, value }`.
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

  // The principal column defaults to `grow: 2`. A column may opt in via
  // `principal: true`; otherwise the first non-action column is principal
  // (the checkbox column is separate, so this is the first data column).
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
        // Default flex weight: the principal column gets 2, the rest 1, so the
        // columns fill the available space proportionally unless a column sets
        // its own `grow`. Action columns ignore weight (fixed 40px).
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
    onColumnFiltersChange: () => {
      // columnFilters are derived from the `filters` model; nothing to persist back.
    },
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

  // --- Column resize (native pointer events) ---------------------------------
  // The @tanstack/vue-table exception covers sorting / pagination / selection /
  // visibility — NOT column sizing. Resize is implemented with native pointer/
  // mouse events writing to a reactive width map keyed by column id. Only the
  // dragged column's entry ever changes, so a resize never touches the other
  // columns (PrimeVue "expand" behaviour): that column grows and the table
  // scrolls horizontally. Drives the body rows' v-memo for live updates.
  // The lower bound of a drag is the column's own content (header label + the
  // visible body cells), measured at drag start — see columnContentMinWidth.
  // This fallback only applies when that measurement can't run (no DOM handle).
  const RESIZE_FALLBACK_MIN_WIDTH = 40
  const resizeWidths = ref<Record<string, number>>({})
  const resizingColumnId = ref<string | null>(null)

  // Shared context exposed via inject so descendant slots/controls can reach the
  // TanStack instance, the current selection, and clearSelection.
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

  // The table owns no data source, so reload() just signals `refresh`; the app
  // refetches. No-op while loading so a refresh can't stack mid-fetch.
  const reload = (): void => {
    if (props.loading) return
    emit('refresh')
  }

  // Export: resolve rows by scope, emit `export`, then download unless a consumer
  // handles the event (server-side export). Columns come from the visible, ordered
  // leaf columns (so the file honors visibility + order), minus the action column.
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

  // Aggregate serializable state — a JSON-cloned façade over the per-concern refs.
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

  // Mirror any state change out through v-model:state (debounced), and apply an
  // incoming controlled `state` — guarded both ways so the two never loop.
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
  // Skeleton placeholder rows shown while `loading`. The count mirrors the number
  // of rows the table actually displays, so the placeholder reserves the same
  // vertical space the loaded content occupies (no jump on load → data): the
  // current page size when paginated (honouring a controlled `pagination` model
  // or the footer page-size selector), otherwise the current row count — falling
  // back to `pageSize` before the first data arrives.
  // Number of skeleton rows while loading. It mirrors the rows the current view
  // will actually show, so the placeholder and the loaded content share the same
  // height (no jump when the skeleton is swapped for data): the current page's
  // row count when paginated — which is fewer than pageSize on a partial last
  // page — else the dataset length, each falling back to pageSize before any
  // rows exist (e.g. the first server-side fetch).
  const skeletonRowCount = computed<number>(() => {
    const displayed = props.paginated
      ? rows.value.length || currentPageSize.value
      : props.data.length || props.pageSize
    return Math.max(displayed, 1)
  })

  type ColumnLike = { columnDef: { meta?: unknown } }
  // An action column is always pinned to the trailing (right) edge so the row's
  // actions stay reachable while the rest of the table scrolls horizontally. The
  // edge is forced unless the column opts into a different `frozen` explicitly.
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

  // Row click and cell click are distinct concerns, and the decision to swallow
  // a click belongs to the CELL, not the row. A TableCell that owns its click
  // (kind="action", kind="checkbox", or clickable) stops propagation itself, so
  // this row-level click fires only for inert cells. A table whose cells never
  // stop is therefore fully row-clickable. See table-cell.vue.
  // When `selectOnRowClick` is set, a click on the inert row area toggles that
  // row's selection (the checkbox cell already toggles it directly).
  const onRowClick = (row: Row<RowRecord>) => {
    if (props.selectOnRowClick && props.enableRowSelection) {
      row.toggleSelected()
    }
    emit('row-click', row.original)
  }

  // Cumulative sticky offsets so adjacent frozen columns stack instead of overlapping.
  // 40px = the fixed utility width shared by the checkbox and action columns.
  const SELECTION_WIDTH = 40
  const columnId = (c: TableColumn): string => c.id ?? c.accessorKey ?? c.header ?? ''
  // Effective edge of a column: an action column defaults to the trailing edge
  // (mirrors metaOf) so the sticky-offset maths sees it as frozen.
  const frozenEdgeOf = (c: TableColumn): 'start' | 'end' | undefined =>
    c.frozen ?? (c.kind === 'action' ? 'end' : undefined)
  // Width a frozen column contributes to a neighbour's sticky offset: its explicit
  // `width`, or the 40px utility width for an action column (which carries none).
  const frozenWidthOf = (c: TableColumn): number =>
    c.width ?? (c.kind === 'action' ? SELECTION_WIDTH : 0)
  const leftFrozenCols = computed<TableColumn[]>(() =>
    props.columns.filter((c: TableColumn) => frozenEdgeOf(c) === 'start')
  )
  const rightFrozenCols = computed<TableColumn[]>(() =>
    props.columns.filter((c: TableColumn) => frozenEdgeOf(c) === 'end')
  )
  const selectionFrozen = computed<boolean>(
    () => props.enableRowSelection && leftFrozenCols.value.length > 0
  )

  // Body enter animation. The translate-y + fade slide is reserved for the
  // "load and return" cycle (loading → data) and the initial mount; a filter or
  // search that merely crosses empty ↔ data uses an opacity-only fade, so the
  // body doesn't slide on an unrelated action. `justLoaded` gates the slide: set
  // when `loading` clears (or on first mount), reset once the body has entered.
  //
  // A `transform` on an ancestor also re-parents `position: sticky` descendants
  // (the sticky box then resolves against the transformed body instead of the
  // scroll viewport), so a translate-y enter makes pinned columns jump. When the
  // table has consumer-pinned columns, drop the slide and fade only.
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
    // Column width (px). A column is fixed ONLY when it has been resized (a
    // resizeWidths entry) or declares an explicit `width`; otherwise it has no
    // inline width and falls back to its `data-[grow]` flex weight, so the
    // columns distribute across — and fill — the available space. The first drag
    // of any divider snapshots every flexible column's current width into
    // resizeWidths (see startResize), freezing the whole row so a resize grows
    // only the dragged column. The action column keeps its fixed 40px utility
    // width (never resized).
    const width =
      meta.kind === 'action' ? undefined : (resizeWidths.value[column.id] ?? widthOf(column.id))
    // Fixed width (not min-width) so every row sizes the column identically and
    // the header lines up with the body — flex-grow would distribute differently per row.
    // `!important`: a fixed column carries BOTH this inline width and the
    // `data-[grow=N]:flex-[N_0_5rem]` weight class on the same element. Under a
    // Tailwind `important: true` config (Storybook, PrimeVue-hosted apps), that
    // weight class compiles to `flex: N 0 5rem !important` and would otherwise
    // beat this inline style — dropping the column back into grow/distribute mode,
    // where a resize redistributes space across siblings instead of growing only
    // the dragged column. Marking the fixed size important keeps each resized
    // column independent regardless of the host config.
    if (width) {
      style['flex'] = `0 0 ${width}px !important`
      style['width'] = `${width}px !important`
    }
    const frozen = meta.frozen
    if (frozen === 'start') style['left'] = `${leftOffsetOf(column.id)}px`
    else if (frozen === 'end') style['right'] = `${rightOffsetOf(column.id)}px`
    return Object.keys(style).length > 0 ? style : undefined
  }

  // A column is resizable only when it opts in (`resizable`) and is neither frozen
  // (its width feeds the sticky offsets) nor the fixed-width action column.
  const isResizableColumn = (column: ColumnLike & { id: string }): boolean =>
    metaOf(column).resizable === true && !metaOf(column).frozen && metaOf(column).kind !== 'action'

  // Starting width of a column before any drag: an explicit `width`, else a width
  // derived from its `grow` weight (the emphasized column starts wider).
  const initialColumnWidth = (column: ColumnLike & { id: string }): number =>
    widthOf(column.id) ?? (metaOf(column).grow ?? 1) * 150

  // Natural (max-content) width of a single header/body cell. The cell is cloned
  // off the live grid and sized purely to its content. The `data-grow` /
  // `data-frozen` attributes are removed so their Tailwind flex/sticky classes —
  // which a host `important: true` config emits as `!important` — no longer match
  // the clone, and the constraint properties are forced `important` inline so the
  // clone shrinks to its content regardless of the host config. Cloning preserves
  // arbitrary slot content (links, badges), so the measurement holds for any cell.
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

  // Lower bound of a column resize: the widest content the column currently
  // shows — its header label and every visible (rendered) body cell — so a drag
  // can shrink a column only until its content would clip, never past it. Indices
  // line up because header and body rows share the same leading checkbox column.
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

  // Native pointer resize: capture the pointer X and the column's current width,
  // then on move write ONLY this column's new width into the reactive map — the
  // other columns never change. The listeners live on the document so the drag
  // continues even when the pointer leaves the 3px handle.
  const startResize = (
    column: ColumnLike & { id: string },
    event: MouseEvent | globalThis.TouchEvent
  ): void => {
    const pointX = (e: MouseEvent | globalThis.TouchEvent): number =>
      'touches' in e ? (e.touches[0]?.clientX ?? 0) : e.clientX
    const target = event.currentTarget as HTMLElement | null
    const headEl = target?.closest('[role="columnheader"]') as HTMLElement | null
    // Freeze every flexible column at its current rendered width before the drag.
    // Until the first drag, un-resized columns are flex-distributed to fill the
    // space; from now on they become individually fixed, so moving one never
    // reflows the others. Measured from the header cells (header and body resolve
    // to the same per-column width). Frozen and action columns are already fixed,
    // and a column already in resizeWidths keeps its value.
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
    // Measure the content floor once, up front: the column's DOM doesn't change
    // during a drag, so re-measuring on every move would only cost reflows.
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
    v-bind="$attrs"
    role="table"
    :data-testid="testId"
    :data-border="border || null"
    :aria-busy="loading || undefined"
    :style="viewportHeightVar"
    class="flex w-full flex-col overflow-hidden rounded-[var(--shape-elements)] bg-[var(--bg-surface)] text-[var(--text-default)] text-body-sm data-[border]:border-[length:var(--border-width-default)] data-[border]:border-solid data-[border]:border-[var(--border-default)]"
  >
    <div
      v-if="$slots['title'] || $slots['toolbar']"
      role="presentation"
      :data-testid="`${testId}__toolbar`"
      class="flex items-center gap-[var(--spacing-xs)] border-b-[length:var(--border-width-default)] border-solid border-[var(--border-default)] p-[var(--spacing-sm)]"
    >
      <div
        v-if="$slots['title']"
        class="text-label-md text-[var(--text-default)]"
      >
        <slot name="title" />
      </div>
      <div
        v-if="$slots['toolbar']"
        class="flex flex-1 items-center justify-end gap-[var(--spacing-xs)]"
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
      class="flex flex-wrap items-center gap-[var(--spacing-xs)] border-b-[length:var(--border-width-default)] border-solid border-[var(--border-default)] p-[var(--spacing-sm)]"
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
      class="min-w-0 max-h-[var(--table-viewport-height)]"
    >
      <!-- Single width-defining container: the header and body share ONE
           max-content box, so every row resolves to the same width and the
           header columns stay aligned with the body columns. Without it each
           rowgroup sizes to its own content (short labels vs. long cell text)
           and the two drift apart once the table overflows horizontally. -->
      <div
        role="presentation"
        class="flex w-max min-w-full flex-col"
      >
        <template v-if="dataDriven">
          <TableHeader
            frozen
            :variant="headerVariant"
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
                v-memo="[row.getIsSelected(), row.original, resizeWidths]"
                :selected="row.getIsSelected()"
                @click="onRowClick(row)"
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

          <!-- Empty state — a plain block, NOT a row: it has no hover/selection
               affordance because it is not selectable data. It fades in so a
               filter/search that clears the results doesn't hard-cut to the
               illustration; the leave is instant so it never overlaps the body. -->
          <Transition
            enter-active-class="transition-opacity duration-300 ease-out motion-reduce:transition-none"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
          >
            <div
              v-if="!loading && rows.length === 0"
              role="presentation"
              :data-testid="`${testId}__empty`"
              class="flex w-full flex-col items-center justify-center gap-[var(--spacing-6)] px-[var(--spacing-8)] py-[var(--spacing-12)] text-center"
            >
              <slot name="empty">
                <EmptyIllustration class="mb-0!" />
                <div class="flex flex-col gap-[var(--spacing-2)]">
                  <p class="text-heading-sm text-[var(--text-default)]">No results yet</p>
                  <p class="text-body-sm text-[var(--text-muted)]">
                    Get started by creating your first resource.
                  </p>
                </div>
              </slot>
            </div>
          </Transition>
        </template>

        <slot v-else />
      </div>
    </ScrollArea>

    <TableFooter v-if="dataDriven && paginated">
      <div class="flex items-center px-[var(--spacing-sm)] py-[var(--spacing-xs)]">
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
