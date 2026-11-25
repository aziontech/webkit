import { useElementSize } from '@vueuse/core'
import {
  type ComponentPublicInstance,
  computed,
  type ComputedRef,
  onMounted,
  type Ref,
  ref,
  useId,
  watch
} from 'vue'

import type { UseTranslateReturn } from '../../../../composables/use-translate'
import type { DataTableColumnView, DataTableHeader, DataTableReorderView } from '../injection-key'
import {
  isResizableColumn,
  principalIndexOf,
  sortDirectionOf,
  stackedLabelOf
} from '../lib/column-meta'
import type { DataTableHost, UseDataTableCoreReturn } from './use-data-table-core'
import { useDataTableLayout } from './use-data-table-layout'
import { useDataTableLive } from './use-data-table-live'
import { useDataTableReorder } from './use-data-table-reorder'
import { useDataTableResize } from './use-data-table-resize'
import { useDataTableRowFocus } from './use-data-table-row-focus'
import { useDataTableWindow } from './use-data-table-window'

const FIRST_LOAD_ROWS = 10

const STACK_FALLBACK_WIDTH = 552

export interface DataTableViewHost extends DataTableHost {
  core: UseDataTableCoreReturn
  testId: ComputedRef<string>
  t: UseTranslateReturn['t']
  tableAttrs: () => Record<string, unknown>
  rootEl: Ref<HTMLElement | null>
  slotsVersion: Ref<number>
}

const useStacked = (host: DataTableViewHost): ComputedRef<boolean> => {
  const stackWidth = ref<number>(STACK_FALLBACK_WIDTH)
  const { width } = useElementSize(host.rootEl)
  onMounted(() => {
    const el = host.rootEl.value
    const token = el
      ? Number.parseFloat(globalThis.getComputedStyle(el).getPropertyValue('--container-lg'))
      : Number.NaN
    if (Number.isFinite(token) && token > 0) stackWidth.value = token
  })
  return computed(() => host.props.stackable && width.value > 0 && width.value < stackWidth.value)
}

const useBodyTransition = (
  loading: () => boolean,
  pinned: ComputedRef<boolean>
): {
  bodyTransition: ComputedRef<{ active: string; from: string; to: string }>
  onBodyEntered: () => void
} => {
  const justLoaded = ref<boolean>(true)
  watch(loading, (now, previous) => {
    if (previous && !now) justLoaded.value = true
  })
  return {
    bodyTransition: computed(() => {
      const slides = justLoaded.value && !pinned.value
      return {
        active: slides
          ? 'transition-[opacity,translate] duration-300 ease-out motion-reduce:transition-none'
          : 'transition-opacity duration-300 ease-out motion-reduce:transition-none',
        from: slides ? 'opacity-0 translate-y-2' : 'opacity-0',
        to: slides ? 'opacity-100 translate-y-0' : 'opacity-100'
      }
    }),
    onBodyEntered: () => (justLoaded.value = false)
  }
}

const useViewport = (
  host: DataTableViewHost,
  stacked: ComputedRef<boolean>,
  viewportEl: Ref<ComponentPublicInstance | null>,
  resizeWidths: () => unknown
): ReturnType<typeof useDataTableWindow> => {
  const { core, props } = host
  const viewport = (): HTMLElement | undefined => viewportEl.value?.$el as HTMLElement | undefined
  const win = useDataTableWindow({
    virtual: () => props.virtual,
    stacked: () => stacked.value,
    loading: () => props.loading,
    lean: core.lean,
    records: core.records,
    rows: core.rows,
    rowTotal: core.rowTotal,
    rowIdAt: core.rowIdAt,
    rowIndexById: core.rowIndexById,
    viewport,
    remeasureOn: () => [
      props.density,
      props.wrapLines,
      core.visibleColumnKey.value,
      resizeWidths()
    ],
    shrinkOn: () => [
      host.data.value,
      core.state.sorting.value.value,
      core.state.globalFilter.value.value,
      core.filters.columnFilters.value
    ],
    bindLeanSlice: core.setLeanSlice
  })
  return win
}

export type DataTableView = ReturnType<typeof assembleView>

export function useDataTableView(host: DataTableViewHost): DataTableView {
  const { core, props } = host
  const stacked = useStacked(host)
  const viewportEl = ref<ComponentPublicInstance | null>(null)
  const reorderActive = computed(() => props.reorderable && !core.tree())
  const leadingCells = (): number => (props.selectable ? 1 : 0) + (reorderActive.value ? 1 : 0)
  const resizeWidths = ref<Record<string, number>>({})
  const win = useViewport(host, stacked, viewportEl, () => resizeWidths.value)
  const resize = useDataTableResize({
    root: host.rootEl,
    columns: () => props.columns,
    headers: core.headers,
    leadingCells,
    skip: () => props.loading || stacked.value,
    resizeWidths,
    refit: () => [
      props.columns,
      props.loading,
      props.selectable,
      host.data.value,
      win.renderedRows.value.length,
      core.visibleColumnKey.value,
      stacked.value
    ]
  })
  const layout = useDataTableLayout({
    columns: () => props.columns,
    selectable: () => props.selectable,
    reorderable: () => props.reorderable,
    reorderActive: () => reorderActive.value,
    stacked: () => stacked.value,
    headers: core.headers,
    resizeWidths: resize.resizeWidths,
    autoWidths: resize.autoWidths
  })
  return assembleView(host, { stacked, viewportEl, reorderActive, resize, win, layout })
}

interface ViewParts {
  stacked: ComputedRef<boolean>
  viewportEl: Ref<ComponentPublicInstance | null>
  reorderActive: ComputedRef<boolean>
  resize: ReturnType<typeof useDataTableResize>
  win: ReturnType<typeof useDataTableWindow>
  layout: ReturnType<typeof useDataTableLayout>
}

const reorderOf = (
  host: DataTableViewHost,
  parts: ViewParts,
  viewport: () => HTMLElement | undefined
): DataTableReorderView => {
  const { core, props } = host
  return useDataTableReorder({
    active: () => parts.reorderActive.value,
    locked: () => core.table.getState().sorting.length > 0,
    frozen: parts.layout.reorderHandleFrozen,
    data: host.data,
    rowKeyOf: core.rowKeyOf,
    orderedIds: core.orderedIds,
    nameKey: () => {
      const column = props.columns[principalIndexOf(props.columns)]
      return column?.accessorKey ?? column?.id
    },
    canMoveRow: (row) => !props.rowReorderable || (row ? props.rowReorderable(row) : false),
    t: host.t,
    root: () => host.rootEl.value,
    viewport,
    emit: host.emit.reorder
  })
}

const useRowInteraction = (host: DataTableViewHost, parts: ViewParts) => {
  const { core, props } = host
  const { win } = parts
  const viewport = (): HTMLElement | undefined =>
    parts.viewportEl.value?.$el as HTMLElement | undefined
  const rowFocusActive = computed(
    () => core.tree() || core.hasListener('onRowClick') || core.hasListener('onRowRemove')
  )
  const focus = useDataTableRowFocus({
    active: rowFocusActive,
    tree: core.tree,
    rows: core.rows,
    index: core.rowIndexById,
    root: () => host.rootEl.value,
    scrollTo: (index) => {
      const el = viewport()
      if (!win.virtualActive.value || !el) return false
      el.scrollTop = win.rowOffsets.value[index] ?? 0
      win.setScrollTop(el.scrollTop)
      return true
    },
    selectable: () => props.selectable,
    canActivate: () => core.hasListener('onRowClick'),
    activate: core.activateRow,
    canRemove: () => core.hasListener('onRowRemove'),
    remove: (event, row) => host.emit.rowRemove(event, row.original)
  })
  return {
    rowFocusActive,
    treeTabStop: focus.tabStop,
    treePlacement: focus.placement,
    toggleTreeRow: focus.toggle,
    onTreeFocusin: focus.onFocusin,
    onTreeKeydown: focus.onKeydown,
    liveBoundaryId: useDataTableLive({
      live: core.state.live.value,
      rowTotal: core.rowTotal,
      rowIdAt: core.rowIdAt,
      rowIndexById: core.rowIndexById,
      rowHeight: win.rowHeight,
      viewport,
      setScrollTop: win.setScrollTop
    }),
    reorder: reorderOf(host, parts, viewport)
  }
}

const EMPTY_VIEW: DataTableColumnView = {
  type: 'default',
  grow: 1,
  align: 'start',
  frozen: undefined,
  style: undefined,
  cellClass: undefined,
  stackedField: false,
  principal: false
}

const assembleView = (host: DataTableViewHost, parts: ViewParts) => {
  const { core, props } = host
  const { win, layout, resize } = parts
  return {
    testId: host.testId,
    slots: host.slots,
    hasSlot: (name: string): boolean => host.slotsVersion.value >= 0 && Boolean(host.slots[name]),
    t: host.t,
    table: core.table,
    props,
    stacked: parts.stacked,
    treeActive: computed(core.tree),
    headers: core.headers,
    rowTotal: core.rowTotal,
    skeletonRowCount: computed(() => {
      const known = core.paging.active.value ? core.rowTotal.value : core.records().length
      return Math.max(known || Math.min(core.paging.pageSize.value, FIRST_LOAD_ROWS), 1)
    }),
    tableAttrs: host.tableAttrs,
    selectAllId: `${useId()}-select-all`,
    pageSelection: core.pageSelection,
    toggleAllPageRows: core.toggleAllPageRows,
    setViewportEl: (el: Element | ComponentPublicInstance | null): void => {
      parts.viewportEl.value = el && '$el' in el ? el : null
    },
    viewportHeight: computed(() => props.maxHeight || (props.virtual ? '40rem' : '')),
    ...win,
    setLazySentinelEl: (el: Element | ComponentPublicInstance | null): void => {
      win.lazySentinelEl.value = el instanceof HTMLElement ? el : null
    },
    columnViews: layout.columnViews,
    viewOf: (id: string): DataTableColumnView => layout.columnViews.value.get(id) ?? EMPTY_VIEW,
    cellStyleOf: layout.cellStyleOf,
    sortDirectionOf: (header: DataTableHeader) => sortDirectionOf(header.column),
    isResizable: (header: DataTableHeader) => isResizableColumn(header.column),
    resizingColumnId: resize.resizingColumnId,
    startResize: (header: DataTableHeader, event: MouseEvent | TouchEvent) =>
      resize.startResize(header.column, event),
    selectionFrozen: layout.selectionFrozen,
    selectionStyle: layout.selectionStyle,
    stackedLabelOf,
    ...useBodyTransition(() => props.loading, layout.hasPinnedColumns),
    onRowClick: core.activateRow,
    ...useRowInteraction(host, parts)
  }
}
