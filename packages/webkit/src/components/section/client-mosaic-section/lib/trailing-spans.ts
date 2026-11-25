export interface GridCellSize {
  width: number
  height: number
}

interface Placement extends GridCellSize {
  index: number
  row: number
}

function place(
  cells: GridCellSize[],
  columns: number
): { placements: Placement[]; rows: boolean[][] } {
  const rows: boolean[][] = []
  const free = (row: number, column: number, cell: GridCellSize) => {
    for (let r = row; r < row + cell.height; r += 1) {
      for (let c = column; c < column + cell.width; c += 1) if (rows[r]?.[c]) return false
    }
    return true
  }
  const placements: Placement[] = []
  let cursor = { row: 0, column: 0 }
  cells.forEach((cell, index) => {
    let { row, column } = cursor
    while (column + cell.width > columns || !free(row, column, cell)) {
      column += 1
      if (column + cell.width > columns) {
        column = 0
        row += 1
      }
    }
    for (let r = row; r < row + cell.height; r += 1) {
      rows[r] ??= []
      for (let c = column; c < column + cell.width; c += 1) rows[r]![c] = true
    }
    placements.push({ ...cell, index, row })
    cursor = { row, column: column + cell.width }
  })
  return { placements, rows }
}

export function trailingSpans(cells: GridCellSize[], columns: number): Map<number, number> {
  const spans = new Map<number, number>()
  const { placements, rows } = place(cells, columns)
  const lastRow = rows.length - 1
  const last = placements.filter((placement) => placement.row === lastRow)
  const used = last.reduce((sum, placement) => sum + placement.width, 0)
  if (lastRow < 0 || used >= columns || last.some((placement) => placement.height > 1)) return spans
  if (rows[lastRow]!.filter(Boolean).length !== used) return spans
  for (let spare = columns - used, i = last.length - 1; spare > 0; spare -= 1) {
    const placement = last[i]!
    spans.set(placement.index, (spans.get(placement.index) ?? placement.width) + 1)
    i = i > 0 ? i - 1 : last.length - 1
  }
  return spans
}
