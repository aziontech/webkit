/** One exported column: `id` reads the field off each row, `header` is the label written to the file. */
export interface CsvColumn {
  id: string
  header: string
}

export interface CsvSerializeOptions {
  columns: CsvColumn[]
  rows: Record<string, unknown>[]
  /** Field separator. Defaults to a comma. */
  delimiter?: string
}

function escapeField(value: unknown, delimiter: string): string {
  const raw = value === null || value === undefined ? '' : String(value)
  const mustQuote =
    raw.includes(delimiter) || raw.includes('"') || raw.includes('\n') || raw.includes('\r')
  return mustQuote ? `"${raw.replace(/"/g, '""')}"` : raw
}

export function toCsv(options: CsvSerializeOptions): string {
  const { columns, rows, delimiter = ',' } = options
  const header = columns.map((column) => escapeField(column.header, delimiter)).join(delimiter)
  const body = rows.map((row) =>
    columns.map((column) => escapeField(row[column.id], delimiter)).join(delimiter)
  )
  return [header, ...body].join('\r\n')
}

export function downloadCsv(filename: string, csv: string): void {
  if (typeof globalThis.document === 'undefined') return
  const blob = new globalThis.Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = globalThis.URL.createObjectURL(blob)
  const link = globalThis.document.createElement('a')
  link.href = url
  link.download = filename || 'export.csv'
  globalThis.document.body.appendChild(link)
  link.click()
  globalThis.document.body.removeChild(link)
  globalThis.URL.revokeObjectURL(url)
}
