/** A row when the items carry no type of their own. */
export type AttributeEditorItem = Record<string, unknown>

/** One column of every row: the key of the item field it edits, its label, placeholder and whether it is required. */
export type AttributeEditorColumn = {
  key: string
  label: string
  placeholder?: string
  required?: boolean
}

export type AttributeEditorRowErrors = Record<string, string | undefined>

export type AttributeEditorErrors =
  (AttributeEditorRowErrors | undefined)[] | (AttributeEditorRowErrors | undefined)[][]

export type AttributeEditorSize = 'small' | 'medium' | 'large'

/** Scope of a cell slot named cell- plus the column key; value is that field of the row, update takes whatever the control emits. */
export type AttributeEditorCellScope<TItem = AttributeEditorItem, TValue = unknown> = {
  item: TItem
  index: number
  groupIndex: number | undefined
  value: TValue
  update: (value: unknown) => void
  invalid: boolean
}

/** Cell slots: a column whose key is a field of the row gets that field's type as value. */
export type AttributeEditorCellSlots<TItem> = {
  [K in keyof TItem & string as `cell-${K}`]?: (
    scope: AttributeEditorCellScope<TItem, TItem[K]>
  ) => unknown
} & {
  [name: `cell-${string}`]: (scope: AttributeEditorCellScope<TItem, unknown>) => unknown
}

export type AttributeEditorRowScope<TItem = AttributeEditorItem> = {
  item: TItem
  index: number
  groupIndex: number | undefined
  errors: AttributeEditorRowErrors
  update: (key: keyof TItem & string, value: unknown) => void
  remove: (event: MouseEvent | KeyboardEvent) => void
  removable: boolean
  removeLabel: string
}

export type AttributeEditorRowActionsScope<TItem = AttributeEditorItem> = {
  item: TItem
  index: number
  groupIndex: number | undefined
  remove: (event: MouseEvent | KeyboardEvent) => void
  removable: boolean
  removeLabel: string
}
