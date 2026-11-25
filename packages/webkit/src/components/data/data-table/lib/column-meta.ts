import type { ColumnDef, FilterFn } from '@tanstack/vue-table'

import type { TableColumn, TableFilterOperator, TableFilterValue } from '../../table/injection-key'
import type { DataTableRecord } from '../injection-key'
import { matchesApplied } from './applied-filter'

export type TableColumnMeta = Pick<
  TableColumn,
  'grow' | 'frozen' | 'align' | 'type' | 'resizable' | 'label' | 'principal' | 'narrow'
>

export type ColumnLike = { id: string; columnDef: { meta?: unknown; header?: unknown } }

export const SELECTION_WIDTH = 40

export const columnId = (c: TableColumn): string => c.id ?? c.accessorKey ?? c.header ?? ''

export const frozenEdgeOf = (c: TableColumn): 'start' | 'end' | undefined =>
  c.frozen ?? (c.type === 'action' ? 'end' : undefined)

export const principalIndexOf = (columns: TableColumn[]): number => {
  const flagged = columns.findIndex((col) => col.principal)
  if (flagged !== -1) return flagged
  return columns.findIndex((col) => col.type !== 'action')
}

const appliedFilterFn: FilterFn<DataTableRecord> = (row, id, filterValue) => {
  const { operator, value } = filterValue as {
    operator: TableFilterOperator
    value: TableFilterValue
  }
  return matchesApplied(row.getValue(id), operator, value)
}

export const toColumnDefs = (
  columns: TableColumn[],
  sortable: boolean
): ColumnDef<DataTableRecord>[] => {
  const principal = principalIndexOf(columns)
  return columns.map((col, index) => ({
    id: columnId(col),
    accessorKey: col.accessorKey,
    header: col.header,
    enableSorting: col.sortable ?? sortable,
    enableHiding: col.hideable ?? col.type !== 'action',
    filterFn: appliedFilterFn,
    size: col.width,
    meta: {
      grow: col.grow ?? (index === principal ? 2 : 1),
      frozen: col.frozen,
      align: col.align,
      type: col.type,
      resizable: col.resizable,
      label: col.label,
      narrow: col.narrow,
      principal: index === principal
    } satisfies TableColumnMeta
  }))
}

export const metaOf = (column: Pick<ColumnLike, 'columnDef'>): TableColumnMeta => {
  const meta = (column.columnDef.meta as TableColumnMeta | undefined) ?? {}
  return meta.type === 'action' && !meta.frozen ? { ...meta, frozen: 'end' } : meta
}

export const sortDirectionOf = (column: {
  getIsSorted: () => 'asc' | 'desc' | false
}): 'none' | 'ascending' | 'descending' => {
  const sorted = column.getIsSorted()
  if (sorted === 'asc') return 'ascending'
  if (sorted === 'desc') return 'descending'
  return 'none'
}

export const isStackedField = (column: Pick<ColumnLike, 'columnDef'>): boolean => {
  const meta = metaOf(column)
  return !meta.principal && (meta.type ?? 'default') === 'default'
}

export const stackedLabelOf = (column: ColumnLike): string => {
  const header = column.columnDef.header
  return metaOf(column).label ?? (typeof header === 'string' ? header : column.id)
}

export const isResizableColumn = (column: ColumnLike): boolean => {
  const meta = metaOf(column)
  return meta.resizable === true && !meta.frozen && meta.type !== 'action'
}
