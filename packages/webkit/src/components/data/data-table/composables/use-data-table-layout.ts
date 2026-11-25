import { computed, type ComputedRef, type Ref } from 'vue'

import type { TableColumn } from '../../table/injection-key'
import type { DataTableColumnView, DataTableHeader } from '../injection-key'
import {
  columnId,
  type ColumnLike,
  frozenEdgeOf,
  isStackedField,
  metaOf,
  SELECTION_WIDTH
} from '../lib/column-meta'

const STACKED_FIELD_CLASS =
  'order-1 basis-full! min-h-8! justify-start! text-start! whitespace-normal static! before:hidden! after:hidden!'
const STACKED_CELL_CLASS = 'static! before:hidden! after:hidden!'
const NARROW_HIDDEN_CLASS = '@max-sm/table:hidden'

export interface DataTableLayoutOptions {
  columns: () => TableColumn[]
  selectable: () => boolean
  reorderable: () => boolean
  reorderActive: () => boolean
  stacked: () => boolean
  headers: ComputedRef<DataTableHeader[]>
  resizeWidths: Ref<Record<string, number>>
  autoWidths: Readonly<Ref<Record<string, number>>>
}

export interface UseDataTableLayoutReturn {
  selectionFrozen: ComputedRef<boolean>
  reorderHandleFrozen: ComputedRef<boolean>
  selectionStyle: ComputedRef<Record<string, string> | undefined>
  hasPinnedColumns: ComputedRef<boolean>
  cellStyleOf: (column: ColumnLike) => Record<string, string> | undefined
  columnViews: ComputedRef<Map<string, DataTableColumnView>>
}

const frozenOffsets = (
  o: DataTableLayoutOptions
): {
  leftFrozen: ComputedRef<TableColumn[]>
  startOf: (id: string, lead: number) => number
  endOf: (id: string) => number
} => {
  const widthOf = (c: TableColumn): number =>
    c.width ?? o.autoWidths.value[columnId(c)] ?? (c.type === 'action' ? SELECTION_WIDTH : 0)
  const leftFrozen = computed(() => o.columns().filter((c) => frozenEdgeOf(c) === 'start'))
  const rightFrozen = computed(() => o.columns().filter((c) => frozenEdgeOf(c) === 'end'))
  const sumUntil = (list: TableColumn[], id: string, start: number): number => {
    let offset = start
    for (const c of list) {
      if (columnId(c) === id) break
      offset += widthOf(c)
    }
    return offset
  }
  return {
    leftFrozen,
    startOf: (id, lead) => sumUntil(leftFrozen.value, id, lead),
    endOf: (id) => sumUntil([...rightFrozen.value].reverse(), id, 0)
  }
}

const resolvedWidthOf = (o: DataTableLayoutOptions, id: string): number | undefined => {
  const column = o.columns().find((c) => columnId(c) === id)
  return o.resizeWidths.value[id] ?? column?.width ?? o.autoWidths.value[id] ?? column?.minWidth
}

export function useDataTableLayout(o: DataTableLayoutOptions): UseDataTableLayoutReturn {
  const { leftFrozen, startOf, endOf } = frozenOffsets(o)
  const selectionFrozen = computed(() => o.selectable() && leftFrozen.value.length > 0)
  const reorderHandleFrozen = computed(() => o.reorderActive() && leftFrozen.value.length > 0)
  const lead = (): number =>
    (selectionFrozen.value ? SELECTION_WIDTH : 0) +
    (o.reorderable() && leftFrozen.value.length > 0 ? SELECTION_WIDTH : 0)
  const cellStyleOf = (column: ColumnLike): Record<string, string> | undefined => {
    if (o.stacked()) return undefined
    const style: Record<string, string> = {}
    const meta = metaOf(column)
    const width = meta.type === 'action' ? undefined : resolvedWidthOf(o, column.id)
    if (width) {
      style['flex'] = `0 0 ${width}px !important`
      style['width'] = `${width}px !important`
    }
    if (meta.frozen === 'start') style['insetInlineStart'] = `${startOf(column.id, lead())}px`
    else if (meta.frozen === 'end') style['insetInlineEnd'] = `${endOf(column.id)}px`
    return Object.keys(style).length > 0 ? style : undefined
  }
  const viewOf = (column: ColumnLike): DataTableColumnView => {
    const meta = metaOf(column)
    const stacked = o.stacked()
    const stackedField = stacked && isStackedField(column)
    return {
      type: meta.type ?? 'default',
      grow: meta.grow ?? 1,
      align: meta.align ?? 'start',
      frozen: meta.frozen,
      style: cellStyleOf(column),
      cellClass: stacked
        ? stackedField
          ? STACKED_FIELD_CLASS
          : STACKED_CELL_CLASS
        : meta.narrow === false
          ? NARROW_HIDDEN_CLASS
          : undefined,
      stackedField,
      principal: Boolean(meta.principal)
    }
  }
  return {
    selectionFrozen,
    reorderHandleFrozen,
    selectionStyle: computed(() =>
      reorderHandleFrozen.value && selectionFrozen.value && !o.stacked()
        ? { insetInlineStart: `${SELECTION_WIDTH}px` }
        : undefined
    ),
    hasPinnedColumns: computed(
      () =>
        selectionFrozen.value || o.columns().some((c) => c.frozen === 'start' || c.frozen === 'end')
    ),
    cellStyleOf,
    columnViews: computed(
      () => new Map(o.headers.value.map((header) => [header.column.id, viewOf(header.column)]))
    )
  }
}
