import type { DataGridColumn } from '../types'

export type DataGridCell = { row: number; col: number }

export type DataGridBounds = { top: number; bottom: number; start: number; end: number }

export type DataGridBooleanLabels = { yes: string; no: string }

export const HEADER = -1

export const rawText = (value: unknown): string =>
  value === null || value === undefined ? '' : String(value)

export const displayText = (
  value: unknown,
  column: DataGridColumn,
  labels: DataGridBooleanLabels,
  format: Intl.NumberFormat
): string => {
  if (value === null || value === undefined || value === '') return ''
  if (column.type === 'boolean') return value ? labels.yes : labels.no
  if (column.type === 'number' && typeof value === 'number') return format.format(value)
  if (column.type === 'select')
    return column.options?.find((option) => option.value === value)?.label ?? String(value)
  return String(value)
}

const parseBoolean = (text: string, labels: DataGridBooleanLabels) => {
  const key = text.trim().toLowerCase()
  const yes = ['true', '1', 'yes', labels.yes.toLowerCase()].includes(key)
  const no = ['false', '0', 'no', labels.no.toLowerCase()].includes(key)
  return { value: yes, valid: yes || no }
}

export const parseCell = (
  column: DataGridColumn,
  text: string,
  labels: DataGridBooleanLabels
): { value: unknown; valid: boolean } => {
  if (column.type === 'number') {
    if (text.trim() === '') return { value: null, valid: true }
    const number = Number(text)
    return { value: number, valid: !Number.isNaN(number) }
  }
  if (column.type === 'select') {
    const option =
      column.options?.find((entry) => String(entry.value) === text) ??
      column.options?.find((entry) => entry.label.toLowerCase() === text.trim().toLowerCase())
    return { value: option?.value, valid: Boolean(option) }
  }
  if (column.type === 'boolean') return parseBoolean(text, labels)
  return { value: text, valid: true }
}

export const boundsOf = (anchor: DataGridCell, active: DataGridCell): DataGridBounds => ({
  top: Math.min(anchor.row, active.row),
  bottom: Math.max(anchor.row, active.row),
  start: Math.min(anchor.col, active.col),
  end: Math.max(anchor.col, active.col)
})

const tsvCell = (value: string): string =>
  /[\t\r\n"]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value

export const toTsv = (lines: string[][]): string =>
  lines.map((cells) => cells.map(tsvCell).join('\t')).join('\n')

export const parseTsv = (text: string): string[][] => {
  const lines: string[][] = [[]]
  for (const [, quoted, plain, end] of text.matchAll(
    /(?:"((?:[^"]|"")*)"|([^\t\r\n]*))(\t|\r?\n|\r|$)/g
  )) {
    lines.at(-1)?.push(quoted?.replaceAll('""', '"') ?? plain ?? '')
    if (!end) break
    if (end !== '\t') lines.push([])
  }
  if (lines.length > 1 && lines.at(-1)?.join('\t') === '') lines.pop()
  return lines
}

export const pasteArea = (
  block: string[][],
  bounds: DataGridBounds,
  offset: number,
  rowCount: number,
  colCount: number
) => {
  const fill = block.length === 1 && block[0]?.length === 1
  const first = { row: Math.max(bounds.top, 0), col: Math.max(bounds.start, offset) }
  const height = fill ? bounds.bottom - first.row + 1 : block.length
  const width = fill ? bounds.end - first.col + 1 : Math.max(...block.map((line) => line.length))
  const last = {
    row: Math.min(first.row + height, rowCount) - 1,
    col: Math.min(first.col + width, colCount) - 1
  }
  const valueAt = (r: number, c: number): string | undefined =>
    fill ? block[0]?.[0] : block[r - first.row]?.[c - first.col]
  return { first, last, valueAt }
}
