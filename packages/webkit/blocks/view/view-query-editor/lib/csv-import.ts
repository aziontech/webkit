import type { QueryEditorColumn } from '../types'

export interface ImportFile {
  name: string
  size: number
  type: string
}

export interface ImportRow {
  line: number
  cells: Record<string, string>
}

export type TypeCheck = [test: (value: string) => boolean, expected: string]

export const SKIP = '__skip'

export const splitCsvLine = (line: string) => {
  const cells: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (quoted && char === '"' && line[i + 1] === '"') {
      cell += '"'
      i += 1
    } else if (char === '"') quoted = !quoted
    else if (char === ',' && !quoted) {
      cells.push(cell.trim())
      cell = ''
    } else cell += char
  }
  cells.push(cell.trim())
  return cells
}

export const TYPE_CHECKS: Record<string, TypeCheck> = {
  int2: [(value) => /^-?\d+$/.test(value), 'a whole number'],
  int4: [(value) => /^-?\d+$/.test(value), 'a whole number'],
  int8: [(value) => /^-?\d+$/.test(value), 'a whole number'],
  numeric: [(value) => /^-?\d+(\.\d+)?$/.test(value), 'a number'],
  bool: [(value) => /^(true|false|t|f|1|0)$/i.test(value), 'true or false'],
  timestamptz: [
    (value) =>
      /^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2})?.*)?$/.test(value) &&
      !Number.isNaN(Date.parse(value.replace(' ', 'T'))),
    'a date as YYYY-MM-DD'
  ]
}

/** A CSV whose header names every column and that holds rows, or why it does not. */
export type ParsedCsv = { headers: string[]; rows: ImportRow[] } | { error: string }

export function parseCsv(text: string): ParsedCsv {
  const lines = text.split(/\r?\n/).filter((line) => line.trim())
  const headers = lines.length ? splitCsvLine(lines[0]) : []
  if (!headers.length || headers.some((header) => !header))
    return { error: 'The first line must name every column.' }
  if (lines.length < 2) return { error: 'The file has a header but no rows.' }
  const rows = lines.slice(1).map((line, index) => ({
    line: index + 2,
    cells: Object.fromEntries(splitCsvLine(line).map((value, cell) => [headers[cell], value]))
  }))
  return { headers, rows }
}

/** One CSV row checked against the table columns it maps to. */
export interface CheckedRow {
  line: number
  values: Record<string, string | null>
  problems: string[]
}

export function checkRows(
  rows: ImportRow[],
  headers: string[],
  targetOf: (header: string) => QueryEditorColumn | null
): CheckedRow[] {
  return rows.map((row) => {
    const values: Record<string, string | null> = {}
    const problems: string[] = []
    for (const header of headers) {
      const column = targetOf(header)
      if (!column) continue
      const raw = row.cells[header] ?? ''
      if (raw === '') {
        if (column.notNull) problems.push(`${column.name} is empty and cannot be.`)
        values[column.name] = null
        continue
      }
      const check = TYPE_CHECKS[column.type]
      if (check && !check[0](raw))
        problems.push(`${column.name} “${raw}” is not ${check[1]} (${column.type}).`)
      values[column.name] = raw
    }
    return { line: row.line, values, problems }
  })
}
