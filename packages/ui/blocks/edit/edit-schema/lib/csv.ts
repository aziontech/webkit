import { splitCsvLine } from '@aziontech/ui/utils/csv'

export type CsvRow = Record<string, string>

export const inferType = (values: string[]) => {
  const filled = values.filter((value) => value !== '')
  if (!filled.length) return 'text'
  if (filled.every((value) => /^-?\d+$/.test(value))) return 'int8'
  if (filled.every((value) => /^-?\d+(\.\d+)?$/.test(value))) return 'numeric'
  if (filled.every((value) => /^(true|false)$/i.test(value))) return 'bool'
  if (filled.every((value) => /^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2})?.*)?$/.test(value)))
    return 'timestamptz'
  return 'text'
}

export const parseCsv = (text: string): { headers: string[]; rows: CsvRow[] } | null => {
  const lines = text.split(/\r?\n/).filter((line) => line.trim())
  const headers = lines.length ? splitCsvLine(lines[0]) : []
  if (!headers.length || headers.some((header) => !header)) return null
  const rows = lines
    .slice(1)
    .map((line): CsvRow =>
      Object.fromEntries(splitCsvLine(line).map((value, index) => [headers[index], value]))
    )
  return { headers, rows }
}
