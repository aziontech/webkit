import type { ComputedRef, InjectionKey, Ref } from 'vue'

import type { SelectRootContext } from '../../../composables/use-select-root'

export type SelectSize = 'small' | 'medium' | 'large'

/** Trigger look: the bordered field, or no border or fill until hover for a switcher inside a line of text. */
export type SelectVariant = 'outline' | 'ghost'

export type SelectValue = string | number | undefined

/** One entry of an options list a consumer renders as Select.Item rows: the value, the label text and the option's own props. */
export interface SelectOptionItem<TValue = string> {
  /** Value the option writes to the model. */
  value: TValue
  /** Text of the option and of the trigger once selected. */
  label: string
  /** Azion icon class of the leading icon. */
  icon?: string
  /** Disables this option only. */
  disabled?: boolean
}

export interface SelectContext extends SelectRootContext {
  /** Current selection. */
  modelValue: Ref<SelectValue>
  /** Trigger look. */
  variant: ComputedRef<SelectVariant>
}

export const SelectInjectionKey: InjectionKey<SelectContext> = Symbol('Select')
