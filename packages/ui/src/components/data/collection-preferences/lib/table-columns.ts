import type { Table as TanstackTable } from '@tanstack/vue-table'

import type { CollectionColumnPreference } from '../../../../composables/use-collection/lib/preferences'
import type { TableRowRecord } from '../../table/injection-key'

type ColumnMeta = { type?: string; label?: string }

type PanelColumn = { id: string; label: string; locked?: boolean }

type LinkedTable = TanstackTable<TableRowRecord>

export const tableColumns = (table: LinkedTable): PanelColumn[] =>
  table
    .getAllLeafColumns()
    .filter((column) => (column.columnDef.meta as ColumnMeta | undefined)?.type !== 'action')
    .map((column) => {
      const header = column.columnDef.header
      return {
        id: column.id,
        label:
          (column.columnDef.meta as ColumnMeta | undefined)?.label ??
          (typeof header === 'string' ? header : column.id),
        locked: !column.getCanHide()
      }
    })

const tableOrder = (table: LinkedTable, columns: PanelColumn[]): CollectionColumnPreference[] => {
  const ids = new Set(columns.map((c) => c.id))
  return table
    .getAllLeafColumns()
    .filter((column) => ids.has(column.id))
    .sort(
      (a, b) =>
        table.getState().columnOrder.indexOf(a.id) - table.getState().columnOrder.indexOf(b.id)
    )
    .map((column) => ({ id: column.id, visible: column.getIsVisible() }))
}

export const seedColumns = (
  table: LinkedTable | null,
  saved: CollectionColumnPreference[],
  columns: PanelColumn[]
): CollectionColumnPreference[] => {
  if (table) return tableOrder(table, columns)
  const known = new Set(columns.map((c) => c.id))
  const kept = saved.filter((c) => known.has(c.id))
  const seen = new Set(kept.map((c) => c.id))
  return [
    ...kept,
    ...columns.filter((c) => !seen.has(c.id)).map((c) => ({ id: c.id, visible: true }))
  ]
}

export const applyToTable = (table: LinkedTable, columns: CollectionColumnPreference[]): void => {
  table.setColumnVisibility(Object.fromEntries(columns.map((c) => [c.id, c.visible])))
  table.setColumnOrder(columns.map((c) => c.id))
}

export const moveColumn = (
  columns: CollectionColumnPreference[],
  index: number,
  target: number
): CollectionColumnPreference[] | null => {
  if (target < 0 || target >= columns.length) return null
  const next = [...columns]
  const [item] = next.splice(index, 1)
  if (!item) return null
  next.splice(target, 0, item)
  return next
}
