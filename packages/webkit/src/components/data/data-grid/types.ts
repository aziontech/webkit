/** The editor a column uses. */
export type DataGridColumnType = 'text' | 'number' | 'boolean' | 'select'

/** A column of the grid. */
export interface DataGridColumn {
  /** Field read from and written to each row. */
  id: string
  /** Header text. */
  header: string
  /** Editor and display of the value; `text` when unset. */
  type?: DataGridColumnType
  /** Choices of a `select` column. */
  options?: { label: string; value: string | number }[]
  /** `false` keeps the column read-only. */
  editable?: boolean
  /** Starting width in px (160 when unset). */
  width?: number
  /** Narrowest width a resize reaches, in px (64 when unset). */
  minWidth?: number
  /** Cell alignment. */
  align?: 'start' | 'end'
}

/** One committed cell edit. */
export interface DataGridCellEdit<TRow> {
  /** The row with the new value. */
  row: TRow
  /** Id of the edited column. */
  columnId: string
  /** The new value. */
  value: unknown
  /** The value before the edit. */
  previous: unknown
}
