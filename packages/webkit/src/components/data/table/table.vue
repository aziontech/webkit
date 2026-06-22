<script setup lang="ts">
  import {
    type ColumnDef,
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
  import { computed, provide, ref, useAttrs, useSlots, watch } from 'vue'

  import Checkbox from '../../inputs/checkbox/checkbox.vue'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import PaginationButton from '../paginator/pagination-button/pagination-button.vue'
  import Paginator from '../paginator/paginator.vue'
  import PaginatorInfo from '../paginator/paginator-info/paginator-info.vue'
  import PaginatorPageSize from '../paginator/paginator-page-size/paginator-page-size.vue'
  import { TableInjectionKey } from './injection-key'
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
    /** Flex weight; the emphasized first column uses 2. */
    grow?: 1 | 2 | 3
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
  }

  type TableColumnMeta = Pick<TableColumn, 'grow' | 'frozen' | 'align' | 'kind' | 'resizable'>

  defineOptions({
    name: 'Table',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Max height (CSS length). Vertical scroll engages only when set smaller than the content; horizontal scroll is always automatic. */
      maxHeight?: string
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
    }>(),
    {
      maxHeight: '',
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
      rowsPerPageOptions: () => [10, 25, 50, 100]
    }
  )

  const emit = defineEmits<{
    'update:sorting': [value: SortingState]
    'update:rowSelection': [value: RowSelectionState]
    'update:columnVisibility': [value: VisibilityState]
    'update:globalFilter': [value: string]
    'update:pagination': [value: PaginationState]
    'row-click': [row: RowRecord]
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

  // Controlled (v-model) with uncontrolled fallback.
  const internalSorting = ref<SortingState>(props.sorting ?? [])
  const internalRowSelection = ref<RowSelectionState>(props.rowSelection ?? {})
  const internalColumnVisibility = ref<VisibilityState>(props.columnVisibility ?? {})
  const internalGlobalFilter = ref<string>(props.globalFilter ?? '')
  const internalPagination = ref<PaginationState>(
    props.pagination ?? { pageIndex: 0, pageSize: props.pageSize }
  )
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

  const tableColumns = computed<ColumnDef<RowRecord>[]>(() =>
    props.columns.map((col, index) => ({
      id: col.id ?? col.accessorKey ?? col.header ?? '',
      accessorKey: col.accessorKey,
      header: col.header,
      enableSorting: col.enableSorting ?? props.enableSorting,
      size: col.width,
      meta: {
        // Default flex weight: the first (emphasized) column gets 2, the rest 1,
        // so the columns fill the available space proportionally unless a column
        // sets its own `grow`. Action columns ignore weight (fixed 40px).
        grow: col.grow ?? (index === 0 ? 2 : 1),
        frozen: col.frozen,
        align: col.align,
        kind: col.kind,
        resizable: col.resizable
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

  provide(TableInjectionKey, {
    testId: testId.value,
    table: computed(() => (dataDriven.value ? table : null)),
    selectedRows,
    selectedCount,
    clearSelection
  })

  const totalRows = computed<number>(() =>
    props.manualPagination && props.rowCount !== undefined
      ? props.rowCount
      : table.getFilteredRowModel().rows.length
  )
  const pageIndex = computed<number>(() => table.getState().pagination.pageIndex)
  const currentPageSize = computed<number>(() => table.getState().pagination.pageSize)
  const rangeStart = computed<number>(() =>
    totalRows.value === 0 ? 0 : pageIndex.value * currentPageSize.value + 1
  )
  const rangeEnd = computed<number>(() =>
    Math.min((pageIndex.value + 1) * currentPageSize.value, totalRows.value)
  )

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
    :style="viewportHeightVar"
    class="flex w-full flex-col overflow-hidden rounded-[var(--shape-elements)] border-[length:var(--border-width-default)] border-solid border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-default)] text-body-sm"
  >
    <div
      v-if="$slots['title'] || $slots['toolbar'] || $slots['filters']"
      role="presentation"
      :data-testid="`${testId}__toolbar`"
      class="flex flex-col gap-[var(--spacing-xs)] border-b-[length:var(--border-width-default)] border-solid border-[var(--border-default)] px-[var(--spacing-sm)] py-[var(--spacing-xs)]"
    >
      <div
        v-if="$slots['title'] || $slots['toolbar']"
        class="flex items-center gap-[var(--spacing-sm)]"
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
          />
        </div>
      </div>
      <div
        v-if="$slots['filters']"
        class="flex flex-wrap items-center gap-[var(--spacing-xs)]"
      >
        <slot
          name="filters"
          :table="dataDriven ? table : undefined"
        />
      </div>
    </div>

    <TableCaption v-if="dataDriven && $slots['caption']">
      <slot name="caption" />
    </TableCaption>

    <ScrollArea
      orientation="both"
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
                  :model-value="table.getIsAllRowsSelected()"
                  aria-label="Select all rows"
                  @update:model-value="(v) => table.toggleAllRowsSelected(!!v)"
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

          <TableBody>
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

            <TableRow v-if="rows.length === 0">
              <TableCell>
                <slot name="empty">No data</slot>
              </TableCell>
            </TableRow>
          </TableBody>
        </template>

        <slot v-else />
      </div>
    </ScrollArea>

    <TableFooter v-if="dataDriven && paginated">
      <div class="flex items-center px-[var(--spacing-sm)] py-[var(--spacing-xs)]">
        <Paginator class="w-full">
          <template #info>
            <PaginatorInfo>
              Showing {{ rangeStart }} to {{ rangeEnd }} of {{ totalRows }} entries
            </PaginatorInfo>
          </template>
          <PaginationButton
            kind="previous"
            :disabled="!table.getCanPreviousPage()"
            @click="table.previousPage()"
          >
            Previous
          </PaginationButton>
          <PaginationButton
            v-for="n in table.getPageCount()"
            :key="n"
            kind="number"
            :selected="pageIndex === n - 1"
            @click="table.setPageIndex(n - 1)"
          >
            {{ n }}
          </PaginationButton>
          <PaginationButton
            kind="next"
            :disabled="!table.getCanNextPage()"
            @click="table.nextPage()"
          >
            Next
          </PaginationButton>
          <template #controls>
            <PaginatorPageSize
              :model-value="currentPageSize"
              :options="rowsPerPageOptions"
              @update:model-value="(value) => table.setPageSize(value)"
            />
          </template>
        </Paginator>
      </div>
    </TableFooter>
    <slot
      v-else-if="!dataDriven"
      name="footer"
    />
  </div>
</template>
