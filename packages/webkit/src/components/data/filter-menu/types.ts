/** One value a field offers. */
export interface FilterMenuOption {
  /** Stored in the model when picked. */
  value: string | number
  /** Text of the row and of the chip. */
  label: string
  /** When present, an Avatar is drawn: an image URL, or an empty string for initials from the label. */
  avatar?: string
}

/** How a field is picked: several values, one value, or a date period. */
export type FilterMenuFieldKind = 'multi' | 'single' | 'date'

/** One field the menu lists. */
export interface FilterMenuField {
  /** Key of the field in the model. */
  id: string
  /** Name of the field in the menu and in its chip. */
  label: string
  /** Defaults to `multi`. */
  kind?: FilterMenuFieldKind
  /** Values offered; a date field without options offers the built-in periods. */
  options?: FilterMenuOption[]
}

/** A custom date range picked on the calendar. */
export interface FilterMenuRange {
  /** First day, or null for an open start. */
  start: Date | null
  /** Last day, or null for an open end. */
  end: Date | null
}

/** One applied value: an option value, a date period id, or a custom range. */
export type FilterMenuValue = string | number | FilterMenuRange

/** Applied values per field id; a field with no key or an empty array is not applied. */
export type FilterMenuModel = Record<string, FilterMenuValue[]>

/** Size token of the trigger button. */
export type FilterMenuSize = 'small' | 'medium' | 'large'
