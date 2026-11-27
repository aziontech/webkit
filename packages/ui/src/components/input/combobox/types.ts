/** One suggestion of the Combobox. */
export type ComboboxOption = {
  /** The committed value; also matched by the typed text. */
  value: string
  /** Text shown instead of the value. */
  label?: string
  /** Muted text at the end of the row. */
  description?: string
  /** Title of the group the option sits under. */
  group?: string
  /** Shown but not selectable. */
  disabled?: boolean
}

/** Size token, as `Input`: 28 / 32 / 40 px. */
export type ComboboxSize = 'small' | 'medium' | 'large'
