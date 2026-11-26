/** Which tab the page shows. */
export type QueryEditorTab = 'tables' | 'editor'

/** Which view of the selected table the pane shows. */
export type QueryEditorTableView = 'data' | 'definition'

/** One column of a table's definition. */
export interface QueryEditorColumn {
  /** Stable key. */
  id: string
  /** Column name, also the row field it reads. */
  name: string
  /** SQL type, shown beside the name. */
  type: string
  /** Part of the primary key; the header shows a key. */
  primaryKey: boolean
  /** The column rejects NULL. */
  notNull: boolean
}

/** One stored row: the stable key and one value per column name. */
export interface QueryEditorRow {
  /** Stable row key. */
  __k: string
  [column: string]: string | number | null
}

/** One table of the database, with its rows. */
export interface QueryEditorTable {
  /** Stable key. */
  id: string
  /** Table name, listed in the side panel. */
  name: string
  /** The table definition. */
  columns: QueryEditorColumn[]
  /** The rows shown in the Data view. */
  rows: QueryEditorRow[]
}

/** One row of a query result: the stable key and one value per result column. */
export interface QueryEditorResultRow {
  /** Stable row key. */
  __k: number
  [column: string]: string | number | null
}

/** What the last query returned: rows, a failure on a line, or a message. */
export type QueryEditorResult =
  | { type: 'rows'; columns: string[]; rows: QueryEditorResultRow[] }
  | { type: 'error'; line: number; text: string }
  | { type: 'message'; text: string }

/** One past query in the history panel. */
export interface QueryEditorHistoryEntry {
  /** Stable key. */
  id: string
  /** The statement that ran. */
  sql: string
}
