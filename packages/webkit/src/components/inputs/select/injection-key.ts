import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type SelectSize = 'small' | 'medium' | 'large'

/** Trigger look: the bordered field, or no border or fill until hover for a switcher inside a line of text. */
export type SelectKind = 'outlined' | 'transparent'

export type SelectValue = string | number | unknown[] | undefined

/** One entry of an options list a consumer renders as Select.Option rows: the value, the label text and the option's own props. */
export interface SelectOptionItem<TValue = string> {
  /** Value the option writes to the model. */
  value: TValue
  /** Text of the option and of the trigger once selected. */
  label: string
  /** PrimeIcons class of the leading icon. */
  icon?: string
  /** Disables this option only. */
  disabled?: boolean
}

export interface SelectContext {
  /** Stable id used to wire trigger `aria-controls` and content element id. */
  contentId: string
  /** Trigger element ref; the content reads it to anchor below. */
  triggerRef: Ref<globalThis.HTMLElement | null>
  /** Current open state. */
  open: Ref<boolean>
  setOpen: (value: boolean) => void
  /** Current selection. */
  modelValue: Ref<SelectValue>
  toggleValue: (value: unknown) => void
  isSelected: (value: unknown) => boolean
  /** Computed selection mode. */
  multiple: ComputedRef<boolean>
  /** Static state flags. */
  size: ComputedRef<SelectSize>
  /** Trigger look. */
  kind: ComputedRef<SelectKind>
  disabled: ComputedRef<boolean>
  readonly: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
  required: ComputedRef<boolean>
  /** Id the enclosing Field assigns to the trigger. */
  controlId: ComputedRef<string | undefined>
  /** Description and error ids of the enclosing Field, for the trigger's aria-describedby. */
  describedBy: ComputedRef<string | undefined>
  /** `aria-label` set on the root, forwarded to the trigger. */
  ariaLabel: ComputedRef<string | undefined>
  /** `aria-labelledby` set on the root, forwarded to the trigger. */
  ariaLabelledby: ComputedRef<string | undefined>
  placeholder: ComputedRef<string | undefined>
  /** Formats the selected value(s) for the trigger label. */
  displayValue: ComputedRef<string>
  /** Whether the current selection is non-empty (drives data-filled). */
  filled: ComputedRef<boolean>
}

export const selectContextKey: InjectionKey<SelectContext> = Symbol('SelectContext')
