import type { ComputedRef, InjectionKey } from 'vue'

export type FieldOrientation = 'vertical' | 'horizontal' | 'responsive'

export type FieldPartKind = 'description' | 'error' | 'title'

export interface FieldContext {
  /** Id the wrapped control renders and FieldLabel targets with `for`. */
  controlId: string
  /** Space-separated ids of the mounted FieldDescription and FieldError parts. */
  describedBy: ComputedRef<string | undefined>
  /** Ids of the mounted FieldTitle parts; a choice-card control is labelled by them. */
  labelledBy: ComputedRef<string | undefined>
  /** Whether the field is invalid; the control sets aria-invalid. */
  invalid: ComputedRef<boolean>
  /** Whether the field is disabled; the control disables itself. */
  disabled: ComputedRef<boolean>
  /** Whether the field is required; FieldLabel shows the marker and the control sets required. */
  required: ComputedRef<boolean>
  /** Whether a FieldError is mounted; FieldDescription then keeps its neutral tone. */
  hasError: ComputedRef<boolean>
  /** Registers a description, error or title id; returns the function that unregisters it. */
  register: (kind: FieldPartKind, id: string) => () => void
}

export const fieldContextKey: InjectionKey<FieldContext | null> = Symbol('Field')
