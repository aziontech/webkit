<script setup lang="ts" generic="TRow extends object = Record<string, unknown>">
  import {
    type Column,
    type ColumnDef,
    type ColumnFiltersState,
    type ColumnOrderState,
    type ExpandedState,
    type FilterFn,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type PaginationState,
    type Row,
    type RowSelectionState,
    type SortingState,
    type Table as TanstackTable,
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

  import { eventDirection, logicalArrowKey } from '../../../composables/use-direction'
  import { scrollParent } from '../../../composables/use-lazy-chunks'
  import { useScrollEdges } from '../../../composables/use-scroll-edges'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { downloadCsv, toCsv } from '../../../utils/csv'
  import Button from '../../action/button/button.vue'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import Spinner from '../../feedback/spinner/spinner.vue'
  import Checkbox from '../../input/checkbox/checkbox.vue'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import Pagination from '../pagination/pagination.vue'
  import {
    type TableAppliedFilter,
    type TableCellSlots,
    type TableColumn,
    type TableDensity,
    type TableExportButtonScope,
    type TableExposed,
    type TableFilterField,
    type TableFilterOperator,
    type TableFilterValue,
    type TableHeaderSlots,
    TableInjectionKey,
    type TableStateSnapshot,
    type TableToolbarSlotProps
  } from '../table/injection-key'
  import TableBody from '../table/table-body/table-body.vue'
  import TableCaption from '../table/table-caption/table-caption.vue'
  import TableCell from '../table/table-cell/table-cell.vue'
  import TableHeadCell from '../table/table-head-cell/table-head-cell.vue'
  import TableHeader from '../table/table-header/table-header.vue'
  import TableRow from '../table/table-row/table-row.vue'

  type RowRecord = Record<string, unknown>

  type TableColumnMeta = Pick<
    TableColumn,
    'grow' | 'frozen' | 'align' | 'type' | 'resizable' | 'label' | 'principal'
  >

  defineOptions({
    name: 'DataTable',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Max height (CSS length). Vertical scroll engages only when set smaller than the content; horizontal scroll is always automatic. */
      maxHeight?: string
      /** Draw the outer card border around the table (off by default; the table is typically framed by a surrounding surface). */
      bordered?: boolean
      /** Column definitions; the table renders its header and rows from them. */
      columns?: TableColumn[]
      /** Field used as the stable row id (for selection). */
      rowKey?: string
      /** Sorts every column on header click (a column's own `sortable` overrides). */
      sortable?: boolean
      /** Adds a leading selection-checkbox column. */
      selectable?: boolean
      /** Decides per row whether it can be selected (`(row) => row.type === 'file'`). A row it rejects draws no checkbox, ignores row clicks and stays out of Select all. */
      rowSelectable?: (row: TRow) => boolean
      /** Clicking a row toggles its selection (requires selectable). */
      selectOnRowClick?: boolean
      /** Render a Pagination in the footer. */
      paginated?: boolean
      /** Server-side sorting: emit events, do not sort locally. */
      manualSorting?: boolean
      /** Server-side pagination: emit events, do not slice locally. */
      manualPagination?: boolean
      /** Server-side filtering: emit events, do not filter locally. */
      manualFiltering?: boolean
      /** Total row count for manual pagination. */
      rowCount?: number
      /** Page-size options shown in the footer selector (the same name as Pagination). */
      pageSizeOptions?: number[]
      /** Render skeleton rows and set aria-busy while true. */
      loading?: boolean
      /** Message of a failed load, shown in place of the rows (the `error` slot replaces it). Empty shows the rows. */
      error?: string
      /** Fields TableFilter offers, as facets in the menu or as properties in the property filter. */
      filterFields?: TableFilterField[]
      /** Uncontrolled snapshot seed applied once on mount (per-concern v-model wins over it). */
      defaultSnapshot?: Partial<TableStateSnapshot>
      /** Default filename for TableExportButton and exportCsv(). */
      exportFilename?: string
      /** Rows TableExportButton and exportCsv() write for the `filtered` and `all` scopes in place of the rows the table holds; useCollection binds every match, not only the page. */
      exportRows?: (scope: 'filtered' | 'all') => TRow[] | Promise<TRow[]>
      /**
       * Opt in to stacked rows. When the table's own box is narrower than `--container-lg`, each row renders
       * as a card of label and value pairs instead of the horizontally scrolling grid. Off by default: a
       * console list scrolls sideways on a phone.
       */
      stackable?: boolean
      /** Cell text wraps onto several lines instead of truncating. */
      wrapLines?: boolean
      /** Every other body row takes the raised surface. */
      striped?: boolean
      /** Density of the header and the body rows: `compact` shrinks their height and padding. */
      density?: TableDensity
      /** Render only the rows in view, for thousands of rows. The viewport scrolls vertically within `maxHeight` (40rem when empty). Ignored in the stacked layout. */
      virtual?: boolean
      /** Row height (px) assumed in `virtual` mode until a row is measured. */
      estimateRowHeight?: number
      /**
       * A leading grip lets people drag rows, or move the focused one with Arrow Up, Arrow Down, Home and
       * End, into a new order. The table emits `update:data` with the reordered records (bind `v-model:data`)
       * and `reorder`; it is locked while a sort is applied.
       */
      reorderable?: boolean
      /**
       * With `reorderable`: decides per row whether it can move (`(row) => !row.locked`). A row it rejects
       * keeps its place: its grip is disabled, and no other row is dropped onto it or moved past it with the
       * keys.
       */
      rowReorderable?: (row: TRow) => boolean
      /** Tree rows. Returns a row's children; rows with children expand in place under a chevron in the principal column and the grid becomes a `treegrid`. */
      getSubRows?: (row: TRow) => TRow[] | undefined
      /**
       * More rows exist after the last one. The table emits `load-more` as the end of the rows nears the
       * viewport (also in `virtual` mode) and offers a Load more button; false shows the end-of-results line
       * once more rows were requested.
       */
      moreRows?: boolean
      /** The next rows are loading; shows a loading line under the rows and holds further `load-more` requests. */
      loadingMore?: boolean
    }>(),
    {
      maxHeight: '',
      bordered: false,
      columns: () => [],
      rowKey: 'id',
      sortable: false,
      selectable: false,
      rowSelectable: undefined,
      selectOnRowClick: false,
      paginated: false,
      manualSorting: false,
      manualPagination: false,
      manualFiltering: false,
      rowCount: undefined,
      pageSizeOptions: () => [10, 25, 50, 100],
      loading: false,
      error: '',
      filterFields: () => [],
      defaultSnapshot: undefined,
      exportFilename: 'export.csv',
      exportRows: undefined,
      stackable: false,
      wrapLines: false,
      striped: false,
      density: 'comfortable',
      virtual: false,
      estimateRowHeight: 48,
      reorderable: false,
      rowReorderable: undefined,
      getSubRows: undefined,
      moreRows: false,
      loadingMore: false
    }
  )

  const emit = defineEmits<{
    'row-click': [event: MouseEvent | KeyboardEvent, row: TRow]
    'row-remove': [event: KeyboardEvent, row: TRow]
    'filter-apply': [event: Event, filters: TableAppliedFilter[]]
    'filter-remove': [event: Event, filter: TableAppliedFilter]
    refresh: [event: Event]
    export: [event: Event, rows: TRow[]]
    reorder: [event: KeyboardEvent | PointerEvent, payload: { from: number; to: number; row: TRow }]
    'load-more': [event: Event]
  }>()

  /** Row records; `reorderable` writes the new order back (v-model:data). */
  const data = defineModel<TRow[]>('data', { default: () => [] })
  /** TanStack SortingState (v-model:sorting). */
  const sorting = defineModel<SortingState>('sorting')
  /** Keys of the selected rows, read from `rowKey` (v-model:selectedKeys). */
  const selectedKeys = defineModel<string[]>('selectedKeys')
  /** TanStack VisibilityState (v-model:columnVisibility). */
  const columnVisibility = defineModel<VisibilityState>('columnVisibility')
  /** Search text across every column (v-model:globalFilter). */
  const globalFilter = defineModel<string>('globalFilter')
  /** Current page, 1-based (v-model:page). */
  const page = defineModel<number>('page')
  /** Rows per page when paginated (v-model:pageSize); a new size returns to the first page. */
  const pageSize = defineModel<number>('pageSize', { default: 10 })
  /** Structured applied conditions, distinct from globalFilter (v-model:filters). */
  const filters = defineModel<TableAppliedFilter[]>('filters')
  /** Aggregate serializable snapshot layered over the per-concern models (v-model:snapshot). */
  const snapshotModel = defineModel<TableStateSnapshot>('snapshot')
  /** Keys of the open tree rows (v-model:openKeys). */
  const openKeys = defineModel<string[]>('openKeys')

  /** Live tail: while true new rows are expected on top; the table scrolls to the newest row and marks the first row older than the live start. Bound with v-model:live; TableLiveButton toggles it. */
  const live = defineModel<boolean>('live', { default: false })

  defineSlots<
    {
      /** Title text at the start of the toolbar band. */
      title(): unknown
      /** Toolbar action band; scoped with the TanStack table instance. */
      toolbar(props: TableToolbarSlotProps<TRow>): unknown
      /** Active-filter chips row; same scope as toolbar. */
      filters(props: TableToolbarSlotProps<TRow>): unknown
      /** Caption content, wrapped in TableCaption. */
      caption(): unknown
      /** Empty state when there are no rows. */
      empty(): unknown
      /** Error state shown in place of the rows while `error` is set. */
      error(props: { message: string }): unknown
    } & TableCellSlots<TRow> &
      TableHeaderSlots<TRow>
  >()

  const attrs = useAttrs()
  const { t } = useTranslate({ table: en.table, dataTable: en.dataTable })

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
    return [frame, own]
  })
  const tableAttrs = (): Record<string, unknown> => {
    const own = splitAttrs.value[1]
    const captioned = captions.value || Boolean(slots['caption'])
    return captioned && !own['aria-label'] && !own['aria-labelledby']
      ? { ...own, 'aria-labelledby': captionId }
      : own
  }

  const viewportHeight = computed<string>(() => props.maxHeight || (props.virtual ? '40rem' : ''))
  const viewportHeightVar = computed<Record<string, string> | undefined>(() =>
    viewportHeight.value ? { '--table-viewport-height': viewportHeight.value } : undefined
  )

  const seed = <K extends keyof TableStateSnapshot>(key: K): TableStateSnapshot[K] | undefined =>
    snapshotModel.value?.[key] ?? props.defaultSnapshot?.[key]
  const internalSorting = ref<SortingState>(sorting.value ?? seed('sorting') ?? [])
  const keysToRecord = (keys: string[]): Record<string, boolean> =>
    Object.fromEntries(keys.map((key) => [key, true]))
  const recordToKeys = (record: Record<string, boolean>): string[] =>
    Object.keys(record).filter((key) => record[key])
  const internalRowSelection = ref<RowSelectionState>(keysToRecord(selectedKeys.value ?? []))
  const internalColumnVisibility = ref<VisibilityState>(
    columnVisibility.value ?? seed('columnVisibility') ?? {}
  )
  const internalGlobalFilter = ref<string>(globalFilter.value ?? seed('globalFilter') ?? '')
  const internalPagination = ref<PaginationState>({
    pageIndex: (page.value ?? seed('page') ?? 1) - 1,
    pageSize: seed('pageSize') ?? pageSize.value
  })
  const internalColumnOrder = ref<ColumnOrderState>(seed('columnOrder') ?? [])
  const internalFilters = ref<TableAppliedFilter[]>(filters.value ?? seed('filters') ?? [])
  const internalExpanded = ref<Record<string, boolean>>(keysToRecord(openKeys.value ?? []))
  watch(
    () => openKeys.value,
    (v) => v !== undefined && (internalExpanded.value = keysToRecord(v))
  )
  watch(
    () => sorting.value,
    (v) => v && (internalSorting.value = v)
  )
  watch(
    () => selectedKeys.value,
    (v) => v && (internalRowSelection.value = keysToRecord(v))
  )
  watch(
    () => columnVisibility.value,
    (v) => v && (internalColumnVisibility.value = v)
  )
  watch(
    () => globalFilter.value,
    (v) => v !== undefined && (internalGlobalFilter.value = v)
  )
  watch(
    () => filters.value,
    (v) => v !== undefined && (internalFilters.value = v)
  )
  watch(
    () => page.value,
    (v) => v && (internalPagination.value = { ...internalPagination.value, pageIndex: v - 1 })
  )
  const writePagination = (next: PaginationState): void => {
    if (next.pageSize !== internalPagination.value.pageSize)
      next = { pageIndex: 0, pageSize: (pageSize.value = next.pageSize) }
    internalPagination.value = next
    page.value = next.pageIndex + 1
  }
  watch(
    () => pageSize.value,
    (size: number) =>
      size !== internalPagination.value.pageSize &&
      writePagination({ pageIndex: 0, pageSize: size })
  )

  function applyUpdater<T>(updater: Updater<T>, current: T): T {
    return typeof updater === 'function' ? (updater as (old: T) => T)(current) : updater
  }

  const appliedFilters = computed<TableAppliedFilter[]>(
    () => filters.value ?? internalFilters.value
  )
  const filterFields = computed<TableFilterField[]>(() => props.filterFields)

  const timeOf = (raw: unknown): number | null => {
    if (raw instanceof Date) return raw.getTime()
    if (typeof raw === 'number') return raw
    if (typeof raw !== 'string' || raw === '') return null
    const time = Date.parse(raw)
    return Number.isNaN(time) ? null : time
  }
  const PERIOD_MS: Record<string, number> = {
    '24h': 86_400_000,
    '7d': 604_800_000,
    '30d': 2_592_000_000
  }
  const periodStart = (period: string): number | null => {
    if (period === '3m') {
      const date = new Date()
      date.setMonth(date.getMonth() - 3)
      return date.getTime()
    }
    const span = PERIOD_MS[period]
    return span === undefined ? null : Date.now() - span
  }

  const matchesApplied = (
    raw: unknown,
    operator: TableFilterOperator,
    value: TableFilterValue
  ): boolean => {
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
      case 'within': {
        const start = periodStart(String(value))
        const time = timeOf(raw)
        return start === null || (time !== null && time >= start)
      }
      case 'between': {
        const [from, to] = Array.isArray(value) ? value : []
        const time = timeOf(raw)
        if (time === null) return false
        return (
          (from === undefined || from === '' || time >= Number(from)) &&
          (to === undefined || to === '' || time <= Number(to))
        )
      }
      default:
        return true
    }
  }

  const appliedFilterFn: FilterFn<RowRecord> = (row, columnId, filterValue) => {
    const { operator, value } = filterValue as {
      operator: TableFilterOperator
      value: TableFilterValue
    }
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
    return props.columns.findIndex((col) => col.type !== 'action')
  })

  const tableColumns = computed<ColumnDef<RowRecord>[]>(() =>
    props.columns.map((col, index) => ({
      id: col.id ?? col.accessorKey ?? col.header ?? '',
      accessorKey: col.accessorKey,
      header: col.header,
      enableSorting: col.sortable ?? props.sortable,
      enableHiding: col.hideable ?? col.type !== 'action',
      filterFn: appliedFilterFn,
      size: col.width,
      meta: {
        grow: col.grow ?? (index === principalIndex.value ? 2 : 1),
        frozen: col.frozen,
        align: col.align,
        type: col.type,
        resizable: col.resizable,
        label: col.label,
        principal: index === principalIndex.value
      } satisfies TableColumnMeta
    }))
  )

  const treeActive = computed<boolean>(() => Boolean(props.getSubRows))
  const leanRows = computed<boolean>(
    () =>
      props.manualSorting && props.manualFiltering && props.manualPagination && !props.getSubRows
  )
  const records = (): RowRecord[] => data.value as unknown as RowRecord[]
  const typed = <T,>(value: unknown): T => value as T
  const cellSlotOf = (id: string): `cell-${string}` => `cell-${id}`
  const headerSlotOf = (id: string): `header-${string}` => `header-${id}`
  const rowKeyOf = (row: RowRecord): string => String(row[props.rowKey] ?? '')
  const isSelectable = (row: RowRecord): boolean => props.rowSelectable?.(typed<TRow>(row)) ?? true
  const leanSource: { slice?: { readonly value: RowRecord[] } } = {}

  const table = useVueTable({
    get data() {
      return leanRows.value && leanSource.slice ? leanSource.slice.value : records()
    },
    get columns() {
      return tableColumns.value
    },
    state: {
      get sorting() {
        return sorting.value ?? internalSorting.value
      },
      get rowSelection() {
        return internalRowSelection.value
      },
      get columnVisibility() {
        return columnVisibility.value ?? internalColumnVisibility.value
      },
      get globalFilter() {
        return globalFilter.value ?? internalGlobalFilter.value
      },
      get pagination() {
        return internalPagination.value
      },
      get columnFilters() {
        return mappedColumnFilters.value
      },
      get columnOrder() {
        return internalColumnOrder.value
      },
      get expanded() {
        return internalExpanded.value
      }
    },
    getSubRows: (row) => {
      return typed<RowRecord[] | undefined>(props.getSubRows?.(typed<TRow>(row)))
    },
    enableSubRowSelection: false,
    getRowId: (row) => rowKeyOf(row as RowRecord),
    enableRowSelection: (row) => props.selectable && isSelectable(row.original),
    manualSorting: props.manualSorting,
    manualPagination: props.manualPagination,
    manualFiltering: props.manualFiltering,
    get rowCount() {
      return props.rowCount
    },
    onSortingChange: (updater: Updater<SortingState>) => {
      const next = applyUpdater(updater, sorting.value ?? internalSorting.value)
      internalSorting.value = next
      sorting.value = next
    },
    onRowSelectionChange: (updater: Updater<RowSelectionState>) => {
      const next = applyUpdater(updater, internalRowSelection.value)
      internalRowSelection.value = next
      selectedKeys.value = recordToKeys(next)
    },
    onColumnVisibilityChange: (updater: Updater<VisibilityState>) => {
      const next = applyUpdater(updater, columnVisibility.value ?? internalColumnVisibility.value)
      internalColumnVisibility.value = next
      columnVisibility.value = next
    },
    onGlobalFilterChange: (updater: Updater<string>) => {
      const next = applyUpdater(updater, globalFilter.value ?? internalGlobalFilter.value)
      internalGlobalFilter.value = next
      globalFilter.value = next
    },
    onPaginationChange: (updater: Updater<PaginationState>) => {
      writePagination(applyUpdater(updater, internalPagination.value))
    },
    onColumnFiltersChange: () => {},
    onColumnOrderChange: (updater: Updater<ColumnOrderState>) => {
      internalColumnOrder.value = applyUpdater(updater, internalColumnOrder.value)
    },
    onExpandedChange: (updater: Updater<ExpandedState>) => {
      const applied = applyUpdater<ExpandedState>(updater, internalExpanded.value)
      const next =
        applied === true
          ? keysToRecord(table.getCoreRowModel().flatRows.map((row) => row.id))
          : applied
      internalExpanded.value = next
      openKeys.value = recordToKeys(next)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: props.getSubRows ? getExpandedRowModel() : undefined,
    getPaginationRowModel: props.paginated ? getPaginationRowModel() : undefined
  })

  const headers = computed(() => table.getHeaderGroups()[0]?.headers ?? [])
  const visibleColumnKey = computed<string>(() => headers.value.map((h) => h.id).join('|'))
  const rows = computed(() => table.getRowModel().rows)
  const sourceIds = computed<string[]>(() => (leanRows.value ? records().map(rowKeyOf) : []))
  const selectableIds = computed<string[]>(() =>
    leanRows.value && props.rowSelectable
      ? records().filter(isSelectable).map(rowKeyOf)
      : sourceIds.value
  )
  const rowTotal = computed<number>(() => (leanRows.value ? records().length : rows.value.length))
  const rowIdAt = (index: number): string =>
    leanRows.value ? (sourceIds.value[index] ?? '') : (rows.value[index]?.id ?? '')

  const RESIZE_FALLBACK_MIN_WIDTH = 40
  const resizeWidths = ref<Record<string, number>>({})
  const resizingColumnId = ref<string | null>(null)
  const autoWidths = ref<Record<string, number>>({})

  const selectedRows = computed<RowRecord[]>(() => {
    if (!leanRows.value)
      return (
        treeActive.value ? table.getSelectedRowModel().flatRows : table.getSelectedRowModel().rows
      ).map((row) => row.original)
    const selection = table.getState().rowSelection
    return records().filter((row) => selection[rowKeyOf(row)])
  })
  const selectedCount = computed<number>(() => selectedRows.value.length)
  const pageSelection = computed<'all' | 'some' | 'none'>(() => {
    const all = leanRows.value
      ? selectedCount.value === selectableIds.value.length
      : table.getIsAllPageRowsSelected()
    const some = leanRows.value ? selectedCount.value > 0 : table.getIsSomePageRowsSelected()
    return all && (some || !leanRows.value) ? 'all' : some ? 'some' : 'none'
  })
  const toggleAllPageRows = (value: boolean): void => {
    if (!leanRows.value) return table.toggleAllPageRowsSelected(value)
    table.setRowSelection((current) => {
      const next = { ...current }
      for (const id of selectableIds.value) value ? (next[id] = true) : delete next[id]
      return next
    })
  }
  const clearSelection = () => table.resetRowSelection()

  const editingFilter = ref<TableAppliedFilter | null>(null)

  const filterKey = (filter: TableAppliedFilter): string =>
    `${filter.field}|${filter.operator}|${JSON.stringify(filter.value)}`

  const applyFilters = (event: Event, next: TableAppliedFilter[]): void => {
    internalFilters.value = next
    filters.value = next
    emit('filter-apply', event, next)
  }
  const removeFilter = (event: Event, filter: TableAppliedFilter): void => {
    const key = filterKey(filter)
    const next = appliedFilters.value.filter((entry) => filterKey(entry) !== key)
    internalFilters.value = next
    filters.value = next
    emit('filter-remove', event, filter)
  }
  const clearFilters = (): void => {
    if (appliedFilters.value.length > 0) {
      internalFilters.value = []
      filters.value = []
    }
    if (internalGlobalFilter.value !== '') {
      internalGlobalFilter.value = ''
      globalFilter.value = ''
    }
  }
  const editFilter = (filter: TableAppliedFilter): void => {
    editingFilter.value = filter
  }

  const reload = (event: Event = new Event('refresh')): void => {
    if (props.loading) return
    emit('refresh', event)
  }

  const instance = getCurrentInstance()
  const hasExportListener = (): boolean =>
    Boolean((instance?.vnode.props as Record<string, unknown> | null | undefined)?.['onExport'])
  const resolveExportRows = (scope: TableExportButtonScope): RowRecord[] => {
    if (leanRows.value) return records()
    if (scope === 'all') return table.getCoreRowModel().rows.map((row) => row.original)
    if (scope === 'page') return rows.value.map((row) => row.original)
    return table.getFilteredRowModel().rows.map((row) => row.original)
  }
  const writeExport = (event: Event, data: RowRecord[], filename?: string): void => {
    emit('export', event, typed<TRow[]>(data))
    if (hasExportListener()) return
    const columns = table
      .getVisibleLeafColumns()
      .filter((column) => metaOf(column).type !== 'action')
      .map((column) => ({
        id: (column.columnDef as { accessorKey?: string }).accessorKey ?? column.id,
        header: typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id
      }))
    downloadCsv(filename || props.exportFilename, toCsv({ columns, rows: data }))
  }
  const exportCsv = (
    options?: {
      filename?: string
      scope?: TableExportButtonScope
      rows?: RowRecord[]
    },
    event: Event = new Event('export')
  ): Promise<void> => {
    const scope = options?.scope ?? 'filtered'
    const source =
      options?.rows ??
      (scope !== 'page' && props.exportRows
        ? typed<RowRecord[] | Promise<RowRecord[]>>(props.exportRows(scope))
        : resolveExportRows(scope))
    if (source instanceof Promise)
      return source.then((data) => writeExport(event, data, options?.filename))
    writeExport(event, source, options?.filename)
    return Promise.resolve()
  }

  const currentSnapshot = (): TableStateSnapshot =>
    JSON.parse(
      JSON.stringify({
        sorting: table.getState().sorting,
        page: table.getState().pagination.pageIndex + 1,
        pageSize: table.getState().pagination.pageSize,
        columnVisibility: table.getState().columnVisibility,
        columnOrder: internalColumnOrder.value,
        globalFilter: table.getState().globalFilter ?? '',
        filters: appliedFilters.value
      })
    ) as TableStateSnapshot
  const getSnapshot = (): TableStateSnapshot => currentSnapshot()
  const setSnapshot = (next: Partial<TableStateSnapshot>): void => {
    if (next.sorting !== undefined) {
      internalSorting.value = next.sorting
      sorting.value = next.sorting
    }
    if (next.page !== undefined || next.pageSize !== undefined) {
      internalPagination.value = {
        pageIndex: (next.page ?? 1) - 1,
        pageSize: (pageSize.value = next.pageSize ?? pageSize.value)
      }
      page.value = next.page ?? 1
    }
    if (next.columnVisibility !== undefined) {
      internalColumnVisibility.value = next.columnVisibility
      columnVisibility.value = next.columnVisibility
    }
    if (next.columnOrder !== undefined) {
      internalColumnOrder.value = next.columnOrder
    }
    if (next.globalFilter !== undefined) {
      internalGlobalFilter.value = next.globalFilter
      globalFilter.value = next.globalFilter
    }
    if (next.filters !== undefined) {
      internalFilters.value = next.filters
      filters.value = next.filters
    }
  }

  const emitSnapshot = useDebounceFn(
    (value: TableStateSnapshot) => (snapshotModel.value = value),
    60
  )
  let lastSnapshotJson = ''
  watch(
    () => currentSnapshot(),
    (value) => {
      const json = JSON.stringify(value)
      if (json === lastSnapshotJson) return
      lastSnapshotJson = json
      emitSnapshot(value)
    },
    { deep: true }
  )
  watch(
    () => snapshotModel.value,
    (value) => {
      if (!value) return
      if (JSON.stringify(value) === JSON.stringify(currentSnapshot())) return
      setSnapshot(value)
    },
    { deep: true }
  )

  provide(TableInjectionKey, {
    testId: testId.value,
    table: computed(() => table),
    selectedRows,
    selectedCount,
    clearSelection,
    loading: computed(() => props.loading),
    live: computed(() => live.value),
    setLive: (value: boolean) => (live.value = value),
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

  const exposed: TableExposed<TRow> = {
    reload,
    clearFilters,
    exportCsv: typed<TableExposed<TRow>['exportCsv']>(exportCsv),
    getSnapshot,
    setSnapshot
  }
  defineExpose(exposed)

  const totalRows = computed<number>(() =>
    props.manualPagination && props.rowCount !== undefined
      ? props.rowCount
      : leanRows.value
        ? records().length
        : table.getFilteredRowModel().rows.length
  )
  const pageIndex = computed<number>(() => table.getState().pagination.pageIndex)
  const currentPageSize = computed<number>(() => table.getState().pagination.pageSize)
  const skeletonRowCount = computed<number>(() => {
    const displayed = props.paginated
      ? rowTotal.value || currentPageSize.value
      : records().length || pageSize.value
    return Math.max(displayed, 1)
  })

  type ColumnLike = { columnDef: { meta?: unknown } }
  const metaOf = (column: ColumnLike): TableColumnMeta => {
    const meta = (column.columnDef.meta as TableColumnMeta | undefined) ?? {}
    return meta.type === 'action' && !meta.frozen ? { ...meta, frozen: 'end' } : meta
  }

  type SortableColumn = { getIsSorted: () => 'asc' | 'desc' | false }
  const sortDirectionOf = (column: SortableColumn): 'none' | 'ascending' | 'descending' => {
    const sorted = column.getIsSorted()
    if (sorted === 'asc') return 'ascending'
    if (sorted === 'desc') return 'descending'
    return 'none'
  }

  const onRowClick = (event: MouseEvent | KeyboardEvent, row: Row<RowRecord>) => {
    if (props.selectOnRowClick && props.selectable && row.getCanSelect()) {
      row.toggleSelected()
    }
    emit('row-click', event, typed<TRow>(row.original))
  }

  const SELECTION_WIDTH = 40
  const columnId = (c: TableColumn): string => c.id ?? c.accessorKey ?? c.header ?? ''
  const frozenEdgeOf = (c: TableColumn): 'start' | 'end' | undefined =>
    c.frozen ?? (c.type === 'action' ? 'end' : undefined)
  const frozenWidthOf = (c: TableColumn): number =>
    c.width ?? autoWidths.value[columnId(c)] ?? (c.type === 'action' ? SELECTION_WIDTH : 0)
  const leftFrozenCols = computed<TableColumn[]>(() =>
    props.columns.filter((c: TableColumn) => frozenEdgeOf(c) === 'start')
  )
  const rightFrozenCols = computed<TableColumn[]>(() =>
    props.columns.filter((c: TableColumn) => frozenEdgeOf(c) === 'end')
  )
  const selectionFrozen = computed<boolean>(
    () => props.selectable && leftFrozenCols.value.length > 0
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
    let offset =
      (selectionFrozen.value ? SELECTION_WIDTH : 0) +
      (props.reorderable && leftFrozenCols.value.length > 0 ? SELECTION_WIDTH : 0)
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
      meta.type === 'action'
        ? undefined
        : (resizeWidths.value[column.id] ?? widthOf(column.id) ?? autoWidths.value[column.id])
    if (width) {
      style['flex'] = `0 0 ${width}px !important`
      style['width'] = `${width}px !important`
    }
    const frozen = meta.frozen
    if (frozen === 'start') style['insetInlineStart'] = `${leftOffsetOf(column.id)}px`
    else if (frozen === 'end') style['insetInlineEnd'] = `${rightOffsetOf(column.id)}px`
    return Object.keys(style).length > 0 ? style : undefined
  }

  const isResizableColumn = (column: ColumnLike & { id: string }): boolean =>
    metaOf(column).resizable === true && !metaOf(column).frozen && metaOf(column).type !== 'action'

  const initialColumnWidth = (column: ColumnLike & { id: string }): number =>
    widthOf(column.id) ?? autoWidths.value[column.id] ?? (metaOf(column).grow ?? 1) * 150

  const contentClone = (cellEl: HTMLElement): HTMLElement => {
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
    return clone
  }

  const columnContentMinWidths = (headEls: HTMLElement[]): number[] => {
    const groups = headEls.map((headEl) => {
      const tableEl = headEl.closest('[role="table"], [role="treegrid"]') as HTMLElement | null
      const row = headEl.closest('[role="row"]') as HTMLElement | null
      const host = tableEl ?? globalThis.document.body
      const colIndex = row ? Array.from(row.children).indexOf(headEl) : -1
      const cells: HTMLElement[] =
        tableEl && colIndex >= 0
          ? Array.from(tableEl.querySelectorAll<HTMLElement>('[role="row"]'))
              .map((r) => r.children[colIndex])
              .filter((c): c is HTMLElement => c instanceof globalThis.HTMLElement)
          : [headEl]
      const clones = cells.map(contentClone)
      host.append(...clones)
      return clones
    })
    const widths = groups.map(
      (clones) =>
        Math.ceil(Math.max(0, ...clones.map((c) => c.getBoundingClientRect().width))) ||
        RESIZE_FALLBACK_MIN_WIDTH
    )
    for (const clones of groups) for (const clone of clones) clone.remove()
    return widths
  }

  const rootEl = ref<HTMLElement | null>(null)

  const STACK_FALLBACK_WIDTH = 552
  const stackWidth = ref<number>(STACK_FALLBACK_WIDTH)
  const { width: rootWidth } = useElementSize(rootEl)
  const stacked = computed<boolean>(
    () => props.stackable && rootWidth.value > 0 && rootWidth.value < stackWidth.value
  )
  const selectAllId = `${useId()}-select-all`

  const viewportEl = ref<ComponentPublicInstance | null>(null)
  const viewportElement = (): HTMLElement | undefined =>
    viewportEl.value?.$el as HTMLElement | undefined
  const scrollTop = ref<number>(0)
  const viewportClientHeight = ref<number>(0)
  const VIRTUAL_OVERSCAN = 8
  const virtualActive = computed<boolean>(() => props.virtual && !stacked.value && !props.loading)

  const LAZY_THRESHOLD = 200
  const LAZY_CHUNK = 50
  const LAZY_MARGIN = 600
  const lazyLimit = ref<number>(LAZY_CHUNK)
  const lazyActive = computed<boolean>(
    () =>
      !virtualActive.value &&
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
      ? records().slice(windowStart.value, windowEnd.value)
      : records()
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
  const {
    start: overflowStart,
    end: overflowEnd,
    measure: measureEdges
  } = useScrollEdges(() => viewportElement() ?? null)

  const onViewportScroll = (event: Event): void => {
    measureEdges()
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
    const el = viewportElement()
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
        const el = viewportElement()
        if (el && virtualActive.value) viewportClientHeight.value = visibleHeightOf(el)
      }),
    { flush: 'post' }
  )

  const lazyGap = computed<number>(() =>
    lazyActive.value ? (rowTotal.value - windowEnd.value) * rowHeight.value : 0
  )
  const windowed = computed<boolean>(() => virtualActive.value || lazyActive.value)
  const lazySentinelEl = ref<HTMLElement | null>(null)
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
    const el = lazySentinelEl.value
    if (!el || !lazyActive.value || typeof IntersectionObserver === 'undefined') return
    lazyObserver = new IntersectionObserver(onLazyIntersect, {
      root: scrollParent(el),
      rootMargin: `${LAZY_MARGIN}px`
    })
    lazyObserver.observe(el)
  }
  watch([lazySentinelEl, lazyLimit, lazyActive], observeSentinel, { flush: 'post' })
  const rowsInReach = (): number => {
    const el = viewportElement()
    if (!el || typeof el.getBoundingClientRect !== 'function') return LAZY_CHUNK
    const scrollsItself =
      el.scrollHeight > el.clientHeight &&
      /(auto|scroll|overlay)/.test(getComputedStyle(el).overflowY)
    const root = scrollsItself ? el : scrollParent(el)
    const rootBottom = root ? root.getBoundingClientRect().bottom : globalThis.innerHeight
    const top = el.getBoundingClientRect().top - (scrollsItself ? el.scrollTop : 0)
    const reach = rootBottom + LAZY_MARGIN - top
    return Math.max(LAZY_CHUNK, Math.ceil(reach / rowHeight.value) + LAZY_CHUNK / 2)
  }
  watch(
    [
      () => data.value,
      () => sorting.value ?? internalSorting.value,
      () => globalFilter.value ?? internalGlobalFilter.value,
      () => mappedColumnFilters.value
    ],
    () => {
      if (lazyLimit.value <= LAZY_CHUNK) return
      lazyLimit.value = Math.min(lazyLimit.value, rowsInReach())
    }
  )

  const moreRequested = ref<boolean>(false)
  const requestMore = (event: Event = new Event('load-more')): void => {
    if (!props.moreRows || props.loadingMore || props.loading) return
    moreRequested.value = true
    emit('load-more', event)
  }
  const moreShown = computed<boolean>(
    () =>
      !props.loading &&
      rowTotal.value > 0 &&
      (props.moreRows || props.loadingMore || moreRequested.value)
  )
  const moreArmed = computed<boolean>(
    () => moreShown.value && props.moreRows && !props.loadingMore && !lazyActive.value
  )
  const moreSentinelEl = ref<HTMLElement | null>(null)
  let moreObserver: IntersectionObserver | null = null
  const observeMore = (): void => {
    moreObserver?.disconnect()
    moreObserver = null
    const el = moreSentinelEl.value
    if (!el || !moreArmed.value || typeof IntersectionObserver === 'undefined') return
    moreObserver = new IntersectionObserver(
      (entries) => {
        if (entries[entries.length - 1]?.isIntersecting) requestMore()
      },
      { root: scrollParent(el), rootMargin: `${LAZY_MARGIN}px` }
    )
    moreObserver.observe(el)
  }
  watch([moreSentinelEl, moreArmed, rowTotal], observeMore, { flush: 'post' })

  const liveStartId = ref<string | null>(null)
  const liveBoundaryId = computed<string | null>(() => {
    const id = liveStartId.value
    if (!live.value || id === null) return null
    return (rowIndexById.value.get(id) ?? 0) > 0 ? id : null
  })
  const scrollToNewest = (): void => {
    const el = viewportElement()
    if (el) el.scrollTop = 0
    scrollTop.value = 0
  }
  watch(
    live,
    (on) => {
      liveStartId.value = on && rowTotal.value > 0 ? rowIdAt(0) : null
      if (on) scrollToNewest()
    },
    { immediate: true, flush: 'post' }
  )
  watch(rowTotal, (total, previous) => {
    if (!live.value) return
    if (liveStartId.value === null && total > 0) liveStartId.value = rowIdAt(0)
    if (total > (previous ?? 0) && (viewportElement()?.scrollTop ?? 0) < rowHeight.value)
      void nextTick(scrollToNewest)
  })

  onBeforeUnmount(() => {
    moreObserver?.disconnect()
    lazyObserver?.disconnect()
    rowObserver?.disconnect()
    globalThis.cancelAnimationFrame(heightsFrame)
  })

  const isStackedField = (column: ColumnLike): boolean => {
    const meta = metaOf(column)
    return !meta.principal && (meta.type ?? 'default') === 'default'
  }
  const stackedLabelOf = (column: ColumnLike & { id: string }): string => {
    const header = (column.columnDef as { header?: unknown }).header
    return metaOf(column).label ?? (typeof header === 'string' ? header : column.id)
  }

  const STACKED_FIELD_CLASS =
    'order-1 basis-full! min-h-8! justify-start! text-start! whitespace-normal static! before:hidden! after:hidden!'
  const STACKED_CELL_CLASS = 'static! before:hidden! after:hidden!'
  const DATA_ROW_CLASS =
    'relative transition-[opacity] duration-fast-02 ease-productive-entrance ' +
    'motion-reduce:transition-none after:pointer-events-none after:absolute after:inset-0 after:z-20 ' +
    'data-[dragging]:opacity-60 data-[dragging]:after:outline-dashed data-[dragging]:after:outline-2 data-[dragging]:after:-outline-offset-2 data-[dragging]:after:outline-(--accent) ' +
    'data-[drop=before]:after:shadow-[inset_0_2px_0_var(--accent)] data-[drop=after]:after:shadow-[inset_0_-2px_0_var(--accent)] ' +
    'data-[live-boundary]:shadow-[inset_0_2px_0_var(--success)] ' +
    'outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-solid focus-visible:after:outline-(--ring-color)'
  interface ColumnView {
    type: 'default' | 'action'
    grow: 1 | 2 | 3
    align: 'start' | 'center' | 'end'
    frozen: 'start' | 'end' | undefined
    style: Record<string, string> | undefined
    stackedClass: string | undefined
    stackedField: boolean
    principal: boolean
  }
  const columnViews = computed<Map<string, ColumnView>>(() => {
    const views = new Map<string, ColumnView>()
    for (const header of headers.value) {
      const column = header.column
      const meta = metaOf(column)
      const stackedField = stacked.value && isStackedField(column)
      views.set(column.id, {
        type: meta.type ?? 'default',
        grow: meta.grow ?? 1,
        align: meta.align ?? 'start',
        frozen: meta.frozen,
        style: cellStyleOf(column),
        stackedClass: stacked.value
          ? stackedField
            ? STACKED_FIELD_CLASS
            : STACKED_CELL_CLASS
          : undefined,
        stackedField,
        principal: Boolean(meta.principal)
      })
    }
    return views
  })
  const viewOf = (id: string): ColumnView => columnViews.value.get(id) as ColumnView

  const measureAutoWidths = (): void => {
    const root = rootEl.value
    if (!root || props.loading || stacked.value) return
    const headCells = Array.from(root.querySelectorAll<HTMLElement>('[role="columnheader"]'))
    const offset = leadingCells.value
    const next: Record<string, number> = {}
    const measuredIds: string[] = []
    const cells: HTMLElement[] = []
    headers.value.forEach((header, index) => {
      const column = props.columns.find((c: TableColumn) => columnId(c) === header.column.id)
      const cell = headCells[index + offset]
      if (column?.minWidth == null || column.width != null || !cell) return
      next[header.column.id] = column.minWidth
      measuredIds.push(header.column.id)
      cells.push(cell)
    })
    columnContentMinWidths(cells).forEach(
      (w, i) => (next[measuredIds[i]!] = Math.max(next[measuredIds[i]!]!, w))
    )
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
    void nextTick(() => {
      measureAutoWidths()
    })
    const fonts = (globalThis.document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts
    if (fonts?.ready) void fonts.ready.then(() => measureAutoWidths())
  })

  watch(
    () => [
      props.columns,
      props.loading,
      props.selectable,
      data.value,
      renderedRows.value.length,
      headers.value.map((header) => header.column.id).join('|'),
      stacked.value
    ],
    () => void scheduleAutoFit()
  )

  const reorderActive = computed<boolean>(() => props.reorderable && !treeActive.value)
  const reorderLocked = computed<boolean>(() => table.getState().sorting.length > 0)
  const leadingCells = computed<number>(
    () => (props.selectable ? 1 : 0) + (reorderActive.value ? 1 : 0)
  )
  const reorderHandleFrozen = computed<boolean>(
    () => reorderActive.value && leftFrozenCols.value.length > 0
  )
  const selectionStyle = computed<Record<string, string> | undefined>(() =>
    reorderHandleFrozen.value && selectionFrozen.value && !stacked.value
      ? { insetInlineStart: `${SELECTION_WIDTH}px` }
      : undefined
  )
  const reorderHintId = `${useId()}-reorder-hint`
  const reorderMessage = ref<string>('')
  const dragId = ref<string | null>(null)
  const overId = ref<string | null>(null)
  let focusAfterMove: string | null = null

  const orderedIds = computed<string[]>(() =>
    leanRows.value ? sourceIds.value : rows.value.map((row) => row.id)
  )
  const principalKey = computed<string | undefined>(() => {
    const column = props.columns[principalIndex.value]
    return column?.accessorKey ?? column?.id
  })
  const rowNameOf = (id: string): string => {
    const record = records().find((row) => rowKeyOf(row) === id)
    const key = principalKey.value
    const value = record && key ? record[key] : undefined
    return value === undefined || value === null || value === '' ? id : String(value)
  }
  const reorderHandleLabelOf = (id: string, index: number): string =>
    t('dataTable.reorderHandle', {
      name: rowNameOf(id),
      position: index + 1,
      total: orderedIds.value.length
    })
  const canMoveId = (id: string): boolean => {
    if (!props.rowReorderable) return true
    const record = records().find((row) => rowKeyOf(row) === id)
    return record ? props.rowReorderable(typed<TRow>(record)) : false
  }
  const dropOf = (id: string): 'before' | 'after' | undefined => {
    if (!dragId.value || overId.value !== id || dragId.value === id) return undefined
    const ids = orderedIds.value
    return ids.indexOf(dragId.value) < ids.indexOf(id) ? 'after' : 'before'
  }

  const moveRow = (
    event: KeyboardEvent | PointerEvent,
    id: string,
    targetId: string,
    message: 'moved' | 'dropped'
  ): void => {
    const from = records().findIndex((row) => rowKeyOf(row) === id)
    const to = records().findIndex((row) => rowKeyOf(row) === targetId)
    if (from < 0 || to < 0 || from === to) return
    const next = [...records()]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    reorderMessage.value = t(
      message === 'moved' ? 'dataTable.reorderMoved' : 'dataTable.reorderDropped',
      {
        name: rowNameOf(id),
        position: orderedIds.value.indexOf(targetId) + 1,
        total: orderedIds.value.length
      }
    )
    focusAfterMove = id
    data.value = typed<TRow[]>(next)
    emit('reorder', event, { from, to, row: typed<TRow>(moved) })
  }

  const focusHandle = (id: string): void => {
    const handle = Array.from(
      rootEl.value?.querySelectorAll<HTMLElement>('[data-reorder-handle]') ?? []
    ).find((el) => el.getAttribute('data-reorder-handle') === id)
    handle?.focus()
  }
  watch(
    () => data.value,
    () => {
      const id = focusAfterMove
      if (!id) return
      focusAfterMove = null
      void nextTick(() => focusHandle(id))
    },
    { flush: 'post' }
  )

  const onHandleKeydown = (event: KeyboardEvent, id: string): void => {
    if (event.key === 'Escape' && dragId.value) {
      dragId.value = null
      overId.value = null
      reorderMessage.value = t('dataTable.reorderCancelled')
      event.preventDefault()
      return
    }
    if (reorderLocked.value || !canMoveId(id)) return
    const ids = orderedIds.value
    const index = ids.indexOf(id)
    const movable = ids.filter(canMoveId)
    const targets: Record<string, number> = {
      ArrowUp: index - 1,
      ArrowDown: index + 1,
      Home: ids.indexOf(movable[0] ?? id),
      End: ids.indexOf(movable[movable.length - 1] ?? id)
    }
    const target = targets[event.key]
    if (target === undefined) return
    event.preventDefault()
    if (target < 0 || target >= ids.length || target === index || !canMoveId(ids[target])) return
    moveRow(event, id, ids[target], 'moved')
  }

  const REORDER_EDGE = 32
  const onHandlePointerdown = (event: PointerEvent, id: string): void => {
    if (reorderLocked.value || event.button !== 0 || !canMoveId(id)) return
    const handle = event.currentTarget as HTMLElement
    if (event.isTrusted) handle.setPointerCapture(event.pointerId)
    event.preventDefault()
    handle.focus()
    dragId.value = id
    overId.value = id
  }
  const onHandlePointermove = (event: PointerEvent): void => {
    if (!dragId.value) return
    const hit = globalThis.document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>('[data-reorder-row]')
    const hitId = hit && rootEl.value?.contains(hit) ? hit.getAttribute('data-reorder-row') : null
    if (hitId && canMoveId(hitId)) overId.value = hitId
    const viewport = viewportElement()
    if (!viewport) return
    const box = viewport.getBoundingClientRect()
    if (event.clientY < box.top + REORDER_EDGE) viewport.scrollTop -= REORDER_EDGE / 2
    else if (event.clientY > box.bottom - REORDER_EDGE) viewport.scrollTop += REORDER_EDGE / 2
  }
  const onHandlePointerup = (event: PointerEvent): void => {
    const id = dragId.value
    const target = overId.value
    dragId.value = null
    overId.value = null
    if (id && target && target !== id) moveRow(event, id, target, 'dropped')
  }
  const onHandlePointercancel = (): void => {
    dragId.value = null
    overId.value = null
  }

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
      const offset = leadingCells.value
      const snapshot = { ...resizeWidths.value }
      headers.value.forEach((header, columnIndex: number) => {
        const m = metaOf(header.column)
        if (m.frozen || m.type === 'action' || snapshot[header.column.id] != null) return
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
    const minWidth = headEl ? columnContentMinWidths([headEl])[0]! : RESIZE_FALLBACK_MIN_WIDTH
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
  const hasListener = (name: string): boolean =>
    Boolean((instance?.vnode.props as Record<string, unknown> | null | undefined)?.[name])
  const rowFocusActive = computed<boolean>(
    () => treeActive.value || hasListener('onRowClick') || hasListener('onRowRemove')
  )
  const treeFocusId = ref<string | null>(null)
  const treeTabStop = computed<string | undefined>(() =>
    rowFocusActive.value
      ? treeFocusId.value && rowIndexById.value.has(treeFocusId.value)
        ? treeFocusId.value
        : rows.value[0]?.id
      : undefined
  )
  const treePlacement = computed<Map<string, { setsize: number; posinset: number }>>(() => {
    const placement = new Map<string, { setsize: number; posinset: number }>()
    if (!treeActive.value) return placement
    const groups = new Map<string, string[]>()
    for (const row of rows.value) {
      const key = row.parentId ?? ''
      const group = groups.get(key) ?? []
      group.push(row.id)
      groups.set(key, group)
    }
    for (const group of groups.values())
      group.forEach((id, index) =>
        placement.set(id, { setsize: group.length, posinset: index + 1 })
      )
    return placement
  })
  const treeRowEl = (id: string): HTMLElement | undefined =>
    Array.from(rootEl.value?.querySelectorAll<HTMLElement>('[data-focus-row]') ?? []).find(
      (el) => el.getAttribute('data-focus-row') === id
    )
  const focusTreeRow = async (id: string): Promise<void> => {
    treeFocusId.value = id
    await nextTick()
    let el = treeRowEl(id)
    const viewport = viewportElement()
    const index = rowIndexById.value.get(id)
    if (!el && virtualActive.value && viewport && index !== undefined) {
      viewport.scrollTop = rowOffsets.value[index] ?? 0
      scrollTop.value = viewport.scrollTop
      await nextTick()
      el = treeRowEl(id)
    }
    el?.focus()
  }
  const toggleTreeRow = (row: Row<RowRecord>, open?: boolean): void => {
    const active = globalThis.document?.activeElement
    const holder = active?.closest?.('[data-tree-row]')?.getAttribute('data-tree-row')
    const closing = open === false || (open === undefined && row.getIsExpanded())
    const inside =
      closing && holder !== undefined && holder !== row.id
        ? row.getLeafRows().some((leaf) => leaf.id === holder)
        : false
    row.toggleExpanded(open)
    if (inside) void focusTreeRow(row.id)
  }
  let focusedIndex = -1
  const onTreeFocusin = (row: Row<RowRecord>): void => {
    treeFocusId.value = row.id
    focusedIndex = rowIndexById.value.get(row.id) ?? -1
  }
  const focusLost = (): boolean => {
    const active = globalThis.document?.activeElement
    return !active || active === globalThis.document.body
  }
  const focusAfterRemoval = (attempt = 0): void => {
    const list = rows.value
    const id = treeFocusId.value
    if (!id || rowIndexById.value.has(id) || focusedIndex < 0) return
    const modalOpen = Boolean(globalThis.document?.querySelector('[aria-modal="true"]'))
    if ((modalOpen || !focusLost()) && attempt < 60) {
      globalThis.requestAnimationFrame(() => focusAfterRemoval(attempt + 1))
      return
    }
    if (!focusLost()) return
    const target = list[focusedIndex] ?? list[focusedIndex - 1]
    if (target) {
      void focusTreeRow(target.id)
      return
    }
    treeFocusId.value = null
    rootEl.value?.querySelector<HTMLElement>('[data-focus-table]')?.focus()
  }
  watch(
    () => rowIndexById.value,
    () => {
      if (!rowFocusActive.value || !treeFocusId.value) return
      if (rowIndexById.value.has(treeFocusId.value)) return
      if (typeof globalThis.requestAnimationFrame !== 'function') return
      void nextTick(() => focusAfterRemoval())
    },
    { flush: 'post' }
  )
  const onTreeKeydown = (event: KeyboardEvent, row: Row<RowRecord>): void => {
    if (!rowFocusActive.value || event.target !== event.currentTarget) return
    if (event.altKey || event.ctrlKey || event.metaKey) return
    const list = rows.value
    const index = rowIndexById.value.get(row.id) ?? -1
    const go = (target: Row<RowRecord> | undefined): void => {
      event.preventDefault()
      if (target) void focusTreeRow(target.id)
    }
    switch (logicalArrowKey(event.key, eventDirection(event))) {
      case 'ArrowDown':
        return go(list[index + 1])
      case 'ArrowUp':
        return go(list[index - 1])
      case 'Home':
        return go(list[0])
      case 'End':
        return go(list[list.length - 1])
      case 'ArrowRight':
        if (!treeActive.value) return
        event.preventDefault()
        if (row.getCanExpand() && !row.getIsExpanded()) toggleTreeRow(row, true)
        else if (row.getIsExpanded()) go(list[index + 1])
        return
      case 'ArrowLeft':
        if (!treeActive.value) return
        event.preventDefault()
        if (row.getIsExpanded()) toggleTreeRow(row, false)
        else {
          const parent = row.getParentRow()
          if (parent) void focusTreeRow(parent.id)
        }
        return
      case 'Enter':
        if (treeActive.value && row.getCanExpand()) {
          event.preventDefault()
          toggleTreeRow(row)
          return
        }
        if (!hasListener('onRowClick')) return
        event.preventDefault()
        onRowClick(event, row)
        return
      case ' ':
        if (!props.selectable || !row.getCanSelect()) return
        event.preventDefault()
        row.toggleSelected()
        return
      case 'Delete':
      case 'Backspace':
        if (!hasListener('onRowRemove') || event.shiftKey) return
        event.preventDefault()
        emit('row-remove', event, typed<TRow>(row.original))
        return
      default:
    }
  }

  const ROOT_CLASS =
    '@container/table ' +
    'data-[density=compact]:[&_[role=cell]]:min-h-9 data-[density=compact]:[&_[role=cell]]:py-(--spacing-2xs) ' +
    'data-[wrap]:[&_[role=cell]]:whitespace-normal data-[wrap]:[&_[role=cell]_.truncate]:whitespace-normal data-[wrap]:[&_[role=cell]_.truncate]:break-words ' +
    'flex w-full flex-col overflow-hidden rounded-(--shape-control) bg-(--bg-surface) text-(--text-default) text-body-sm ' +
    'data-[bordered]:border-(length:--border-width-default) data-[bordered]:border-solid data-[bordered]:border-(--border-default)'

  const EXPAND_TOGGLE_CLASS =
    'flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-(--shape-button) border-(length:--border-width-default) border-solid border-(--border-default) ' +
    'bg-(--bg-surface) text-(--text-default) transition-colors duration-150 ease-out ' +
    'hover:bg-(--bg-canvas) motion-reduce:transition-none'

  const FADE_START_CLASS =
    'pointer-events-none absolute inset-y-0 start-0 z-5 hidden bg-gradient-to-l from-transparent to-(--bg-surface) ' +
    'group-data-[overflow-start]/scroll:block ' +
    'rtl:bg-gradient-to-r forced-colors:forced-color-adjust-none forced-colors:to-[Canvas]'

  const FADE_END_CLASS =
    'pointer-events-none absolute inset-y-0 end-0 z-5 hidden bg-gradient-to-r from-transparent to-(--bg-surface) ' +
    'group-data-[overflow-end]/scroll:block ' +
    'rtl:bg-gradient-to-l forced-colors:forced-color-adjust-none forced-colors:to-[Canvas]'
</script>

<script lang="ts">
  export type { DropdownMenuItemValue } from '../../navigation/dropdown-menu/injection-key'
  export type {
    TableCellSlotProps,
    TableCellSlots,
    TableColumn,
    TableDensity,
    TableExportButtonScope,
    TableExposed,
    TableHeaderSlotProps,
    TableHeaderSlots,
    TableToolbarSlotProps
  } from '../table/injection-key'
</script>

<template>
  <div
    ref="rootEl"
    v-bind="splitAttrs[0]"
    :data-testid="testId"
    :data-bordered="bordered || null"
    :data-stacked="stacked || null"
    :data-density="density"
    :data-wrap="wrapLines || null"
    :style="viewportHeightVar"
    :class="ROOT_CLASS"
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
          :table="typed<TanstackTable<TRow>>(table)"
          :selected-rows="typed<TRow[]>(selectedRows)"
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
        :table="typed<TanstackTable<TRow>>(table)"
        :selected-rows="typed<TRow[]>(selectedRows)"
        :selected-count="selectedCount"
        :clear-selection="clearSelection"
        :loading="loading"
      />
    </div>

    <div
      :data-testid="`${testId}__scroll`"
      :data-overflow-start="overflowStart || undefined"
      :data-overflow-end="overflowEnd || undefined"
      class="group/scroll relative flex min-h-0 min-w-0 flex-col"
    >
      <ScrollArea
        ref="viewportEl"
        :orientation="viewportHeight ? 'both' : 'horizontal'"
        :data-testid="`${testId}__viewport`"
        class="min-w-0 max-h-(--table-viewport-height)"
        @scroll.passive="onViewportScroll"
      >
        <div
          class="flex w-max min-w-full flex-col"
          :class="stacked ? 'w-full!' : undefined"
        >
          <div
            v-if="stacked && selectable && !loading && rowTotal > 0"
            :data-testid="`${testId}__stacked-select-all`"
            class="flex min-h-10 items-center gap-(--spacing-xs) px-(--spacing-sm) pt-(--spacing-xs)"
          >
            <Checkbox
              :id="selectAllId"
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
          <div
            v-bind="tableAttrs()"
            :role="treeActive ? 'treegrid' : 'table'"
            :data-tree="treeActive || undefined"
            :tabindex="rowFocusActive ? -1 : undefined"
            :data-focus-table="rowFocusActive || undefined"
            :data-testid="`${testId}__table`"
            :aria-busy="loading || loadingMore || undefined"
            :aria-rowcount="windowed ? rowTotal + 1 : undefined"
            class="flex w-full flex-col outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-color)"
          >
            <TableCaption v-if="$slots['caption']">
              <slot name="caption" />
            </TableCaption>
            <template v-if="columns.length > 0">
              <TableHeader
                frozen
                :density="density"
                :class="stacked ? 'sr-only!' : undefined"
              >
                <TableRow>
                  <TableHeadCell
                    v-if="reorderActive"
                    key="reorder"
                    type="checkbox"
                    :frozen="reorderHandleFrozen ? 'start' : undefined"
                    data-slot="reorder-cell"
                  >
                    <span class="sr-only">{{ t('dataTable.reorderColumn') }}</span>
                  </TableHeadCell>
                  <TableHeadCell
                    v-if="selectable"
                    key="select"
                    type="checkbox"
                    :frozen="selectionFrozen ? 'start' : undefined"
                    :style="selectionStyle"
                  >
                    <Checkbox
                      v-if="!stacked"
                      :model-value="pageSelection === 'all'"
                      :indeterminate="pageSelection === 'some'"
                      :aria-label="t('table.selectAll')"
                      @update:model-value="(v) => toggleAllPageRows(!!v)"
                    />
                  </TableHeadCell>
                  <TableHeadCell
                    v-for="header in headers"
                    :key="header.id"
                    :type="metaOf(header.column).type ?? 'default'"
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
                      :name="headerSlotOf(header.column.id)"
                      :column="typed<Column<TRow, unknown>>(header.column)"
                    />
                    <template v-else-if="header.column.columnDef.header">{{
                      header.column.columnDef.header
                    }}</template>
                  </TableHeadCell>
                </TableRow>
              </TableHeader>

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
                      ? 'flex-wrap rounded-(--shape-control) border! py-(--spacing-2xs)'
                      : undefined
                  "
                >
                  <TableCell
                    v-if="reorderActive"
                    key="reorder"
                    type="checkbox"
                    :frozen="reorderHandleFrozen ? 'start' : undefined"
                    :class="stacked ? 'static! before:hidden! after:hidden!' : undefined"
                  />
                  <TableCell
                    v-if="selectable"
                    key="select"
                    type="checkbox"
                    :frozen="selectionFrozen ? 'start' : undefined"
                    :style="selectionStyle"
                    :class="stacked ? 'static! before:hidden! after:hidden!' : undefined"
                  >
                    <Skeleton
                      variant="rectangle"
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
                    :type="viewOf(header.column.id).type"
                    :class="viewOf(header.column.id).stackedClass"
                  >
                    <Skeleton
                      v-if="viewOf(header.column.id).type !== 'action'"
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
                  v-if="!loading && !error && rowTotal > 0"
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
                      windowStart + index,
                      reorderActive,
                      reorderLocked,
                      dragId === row.id,
                      dropOf(row.id),
                      orderedIds.length,
                      treeActive,
                      rowFocusActive,
                      row.getIsExpanded(),
                      row.id === treeTabStop,
                      treePlacement.get(row.id),
                      row.id === liveBoundaryId
                    ]"
                    :selected="row.getIsSelected()"
                    :aria-rowindex="windowed ? windowStart + index + 2 : undefined"
                    :aria-level="treeActive ? row.depth + 1 : undefined"
                    :aria-setsize="treePlacement.get(row.id)?.setsize"
                    :aria-posinset="treePlacement.get(row.id)?.posinset"
                    :aria-expanded="
                      treeActive && row.getCanExpand() ? row.getIsExpanded() : undefined
                    "
                    :tabindex="rowFocusActive ? (row.id === treeTabStop ? 0 : -1) : undefined"
                    :data-tree-row="treeActive ? row.id : undefined"
                    :data-focus-row="rowFocusActive ? row.id : undefined"
                    :data-depth="treeActive ? row.depth : undefined"
                    :data-reorder-row="reorderActive ? row.id : undefined"
                    :data-dragging="dragId === row.id || undefined"
                    :data-drop="dropOf(row.id)"
                    :data-live-boundary="row.id === liveBoundaryId || undefined"
                    :class="[
                      stacked
                        ? 'flex-wrap rounded-(--shape-control) border! py-(--spacing-2xs)'
                        : undefined,
                      striped && (windowStart + index) % 2 === 1
                        ? '[--table-row-bg:var(--bg-surface-raised)]'
                        : undefined,
                      DATA_ROW_CLASS
                    ]"
                    @click="onRowClick($event, row)"
                    @keydown="onTreeKeydown($event, row)"
                    @focusin="rowFocusActive && onTreeFocusin(row)"
                  >
                    <TableCell
                      v-if="reorderActive"
                      key="reorder"
                      type="checkbox"
                      :frozen="reorderHandleFrozen ? 'start' : undefined"
                      data-slot="reorder-cell"
                      :class="stacked ? 'static! before:hidden! after:hidden!' : undefined"
                    >
                      <IconButton
                        icon="az az-menu"
                        variant="outline"
                        size="small"
                        :ariaLabel="reorderHandleLabelOf(row.id, windowStart + index)"
                        :aria-describedby="reorderHintId"
                        :disabled="reorderLocked || !canMoveId(row.id)"
                        :data-reorder-handle="row.id"
                        :data-testid="`${testId}__reorder-handle`"
                        class="cursor-grab touch-none active:cursor-grabbing"
                        @click.stop
                        @keydown="(event: KeyboardEvent) => onHandleKeydown(event, row.id)"
                        @pointerdown="(event: PointerEvent) => onHandlePointerdown(event, row.id)"
                        @pointermove="onHandlePointermove"
                        @pointerup="onHandlePointerup"
                        @pointercancel="onHandlePointercancel"
                      />
                    </TableCell>
                    <TableCell
                      v-if="selectable"
                      key="select"
                      type="checkbox"
                      :frozen="selectionFrozen ? 'start' : undefined"
                      :style="selectionStyle"
                      :class="stacked ? 'static! before:hidden! after:hidden!' : undefined"
                    >
                      <Checkbox
                        v-if="row.getCanSelect()"
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
                      :type="viewOf(cell.column.id).type"
                      :class="viewOf(cell.column.id).stackedClass"
                    >
                      <span
                        v-if="viewOf(cell.column.id).stackedField"
                        aria-hidden="true"
                        :data-testid="`${testId}__stacked-label`"
                        class="w-2/5 shrink-0 truncate text-label-sm text-(--text-muted)"
                        >{{ stackedLabelOf(cell.column) }}</span
                      >
                      <span
                        v-if="treeActive && viewOf(cell.column.id).principal"
                        aria-hidden="true"
                        data-slot="tree-gutter"
                        class="flex shrink-0 justify-end"
                        :style="{
                          inlineSize: `calc(var(--spacing-md) * ${row.depth} + var(--size-7))`
                        }"
                      >
                        <span
                          v-if="row.getCanExpand()"
                          aria-hidden="true"
                          :data-testid="`${testId}__expand-toggle`"
                          :class="EXPAND_TOGGLE_CLASS"
                          @click.stop="toggleTreeRow(row)"
                        >
                          <i
                            class="text-body-xs"
                            :class="
                              row.getIsExpanded()
                                ? 'az az-chevron-down'
                                : 'az az-chevron-right rtl:-scale-x-100'
                            "
                          />
                        </span>
                      </span>
                      <slot
                        v-if="hasSlot('cell-' + cell.column.id)"
                        :name="cellSlotOf(cell.column.id)"
                        :row="typed<TRow>(row.original)"
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
                    ref="lazySentinelEl"
                    role="presentation"
                    aria-hidden="true"
                    :data-testid="`${testId}__lazy-rows`"
                    :style="{ height: `${lazyGap}px` }"
                  />
                </TableBody>
              </Transition>
            </template>
          </div>
        </div>
        <div
          v-if="moreShown"
          :data-testid="`${testId}__more`"
          class="sticky start-0 flex w-full flex-col"
        >
          <div
            v-if="moreArmed"
            ref="moreSentinelEl"
            aria-hidden="true"
            :data-testid="`${testId}__more-sentinel`"
            class="h-px w-full"
          />
          <div
            role="status"
            class="flex min-h-10 items-center justify-center gap-(--spacing-xs) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
          >
            <template v-if="loadingMore">
              <Spinner
                aria-hidden="true"
                class="size-4"
              />
              <span :data-testid="`${testId}__more-loading`">{{ t('dataTable.loadingMore') }}</span>
            </template>
            <Button
              v-else-if="moreRows"
              variant="ghost"
              size="small"
              :label="t('dataTable.loadMore')"
              :data-testid="`${testId}__more-button`"
              @click="requestMore"
            />
            <span
              v-else
              :data-testid="`${testId}__more-end`"
              >{{ t('dataTable.noMoreRows') }}</span
            >
          </div>
        </div>
        <Transition
          enter-active-class="transition-opacity duration-300 ease-out motion-reduce:transition-none"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
        >
          <div
            v-if="!loading && error"
            role="alert"
            :data-testid="`${testId}__error`"
            class="sticky start-0 w-full"
          >
            <slot
              name="error"
              :message="error"
            >
              <EmptyState
                size="small"
                icon="az az-triangle-alert"
                :title="t('table.errorTitle')"
                :description="error"
              />
            </slot>
          </div>
          <div
            v-else-if="!loading && rowTotal === 0"
            :data-testid="`${testId}__empty`"
            class="sticky start-0 w-full"
          >
            <slot name="empty">
              <EmptyState
                size="small"
                icon="az az-table"
                :title="t('table.emptyTitle')"
                :description="t('table.emptyDescription')"
              />
            </slot>
          </div>
        </Transition>
      </ScrollArea>
      <span
        aria-hidden="true"
        :data-testid="`${testId}__fade-start`"
        :style="{ width: `${overflowStart}px` }"
        :class="FADE_START_CLASS"
      />
      <span
        aria-hidden="true"
        :data-testid="`${testId}__fade-end`"
        :style="{ width: `${overflowEnd}px` }"
        :class="FADE_END_CLASS"
      />
    </div>
    <template v-if="reorderActive">
      <span
        :id="reorderHintId"
        class="sr-only"
        >{{ reorderLocked ? t('dataTable.reorderLocked') : t('dataTable.reorderHint') }}</span
      >
      <span
        role="status"
        :data-testid="`${testId}__reorder-status`"
        class="sr-only"
        >{{ reorderMessage }}</span
      >
    </template>

    <div
      v-if="paginated"
      :data-testid="`${testId}__footer`"
      class="flex min-w-full flex-col border-t-(length:--border-width-default) border-solid border-(--border-default) bg-(--bg-surface) text-(--text-muted)"
    >
      <div class="flex items-center px-(--spacing-sm) py-(--spacing-xs)">
        <Skeleton
          v-if="loading && totalRows === 0"
          width="12rem"
          height="1rem"
          :data-testid="`${testId}__footer-loading`"
        />
        <Pagination
          v-else
          class="w-full"
          :page="pageIndex + 1"
          :total="totalRows"
          :page-size="currentPageSize"
          :page-size-options="pageSizeOptions"
          @update:page="(page) => table.setPageIndex(page - 1)"
          @update:page-size="(size) => table.setPageSize(size)"
        >
          <template
            v-if="loading"
            #info
          >
            <Skeleton
              width="12rem"
              height="1rem"
              :data-testid="`${testId}__footer-loading`"
            />
          </template>
        </Pagination>
      </div>
    </div>
  </div>
</template>
