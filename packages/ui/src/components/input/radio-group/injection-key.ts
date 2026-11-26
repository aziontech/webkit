import type { ComputedRef, InjectionKey } from 'vue'

/** Layout axis of a RadioGroup. */
export type RadioGroupOrientation = 'vertical' | 'horizontal'

/** Look of every option: a circle beside its label, or a bordered card. */
export type RadioGroupVariant = 'default' | 'card'

/** One option of a data-driven RadioGroup. */
export interface RadioGroupOption {
  /** Value written to the group when the option is selected. */
  value: string
  /** Text of the option. */
  label: string
  /** One-line explanation under the label. */
  description?: string
  /** Azion icon class of a glyph before the label. */
  icon?: string
  /** Accessible name when the label alone is ambiguous. */
  ariaLabel?: string
  /** Disables this option only. */
  disabled?: boolean
}

/** Props of RadioGroup. */
export interface RadioGroupProps<TOption extends RadioGroupOption = RadioGroupOption> {
  /** Form field name shared by every radio; the selected value submits under it. */
  name?: string
  /** Layout axis: options stacked, or in a wrapping row. */
  orientation?: RadioGroupOrientation
  /** Look of every option: a circle beside its label, or a bordered card. */
  variant?: RadioGroupVariant
  /** Options rendered as RadioGroup.Item rows, in place of composed items. */
  options?: TOption[]
  /** Disables every option. */
  disabled?: boolean
  /** Shows the selection but blocks changing it. */
  readonly?: boolean
  /** Requires a selection. */
  required?: boolean
  /** Marks the group invalid. */
  invalid?: boolean
}

/** What RadioGroup hands to every RadioGroup.Item. */
export interface RadioGroupContext {
  /** Name shared by every radio of the group. */
  name: ComputedRef<string>
  /** The selected value. */
  value: ComputedRef<string | undefined>
  /** Look of every option. */
  variant: ComputedRef<RadioGroupVariant>
  /** Whether the whole group is disabled. */
  disabled: ComputedRef<boolean>
  /** Whether the selection is read-only. */
  readonly: ComputedRef<boolean>
  /** Root test id; items derive theirs from it. */
  testId: ComputedRef<string>
  /** Writes a value to the group. */
  select: (value: string) => void
}

export const RadioGroupInjectionKey: InjectionKey<RadioGroupContext> = Symbol('RadioGroup')
