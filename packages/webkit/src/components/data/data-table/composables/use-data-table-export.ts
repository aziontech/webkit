import type { Table as TanstackTable } from '@tanstack/vue-table'

import { downloadCsv, toCsv } from '../../../../utils/csv'
import type { TableExportButtonScope } from '../../table/injection-key'
import type { DataTableRecord } from '../injection-key'
import { metaOf } from '../lib/column-meta'

const DEFAULT_EXPORT_FILENAME = 'export.csv'

export interface DataTableExportOptions {
  table: TanstackTable<DataTableRecord>
  records: () => DataTableRecord[]
  lean: () => boolean
  hasListener: () => boolean
  emit: (event: Event, rows: DataTableRecord[]) => void
}

export type DataTableExportCsv = (
  options?: { filename?: string; scope?: TableExportButtonScope; rows?: DataTableRecord[] },
  event?: Event
) => Promise<void>

const rowsOf = (o: DataTableExportOptions, scope: TableExportButtonScope): DataTableRecord[] => {
  if (o.lean()) return o.records()
  if (scope === 'all') return o.table.getCoreRowModel().rows.map((row) => row.original)
  if (scope === 'page') return o.table.getRowModel().rows.map((row) => row.original)
  return o.table.getFilteredRowModel().rows.map((row) => row.original)
}

const csvColumns = (table: TanstackTable<DataTableRecord>): { id: string; header: string }[] =>
  table
    .getVisibleLeafColumns()
    .filter((column) => metaOf(column).type !== 'action')
    .map((column) => ({
      id: (column.columnDef as { accessorKey?: string }).accessorKey ?? column.id,
      header: typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id
    }))

export function useDataTableExport(o: DataTableExportOptions): DataTableExportCsv {
  return (options, event = new Event('export')) => {
    const rows = options?.rows ?? rowsOf(o, options?.scope ?? 'filtered')
    o.emit(event, rows)
    if (!o.hasListener())
      downloadCsv(
        options?.filename || DEFAULT_EXPORT_FILENAME,
        toCsv({ columns: csvColumns(o.table), rows })
      )
    return Promise.resolve()
  }
}
