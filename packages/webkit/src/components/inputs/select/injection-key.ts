import type { ComputedRef, InjectionKey, Ref } from 'vue'

import type { ListboxFocusIntent } from '../../../composables/use-listbox'

export type SelectSize = 'small' | 'medium' | 'large'

/** Trigger look: the bordered field, or no border or fill until hover for a switcher inside a line of text. */
export type SelectKind = 'outlined' | 'transparent'

export type SelectValue = string | number | undefined

/** One entry of an options list a consumer renders as Select.Option rows: the value, the label text and the option's own props. */
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
  /** Label ids of the enclosing Field; they name the list when the root has no aria-label. */
  labelledBy: ComputedRef<string | undefined>
  /** Where focus lands when the list opens: the selected option, the first, the last, or the first match of a typed character. */
  pendingFocus: Ref<ListboxFocusIntent>
  /** `aria-label` set on the root, forwarded to the trigger. */
  ariaLabel: ComputedRef<string | undefined>
  /** `aria-labelledby` set on the root, forwarded to the trigger. */
  ariaLabelledby: ComputedRef<string | undefined>
  placeholder: ComputedRef<string | undefined>
  /** Formats the selected value(s) for the trigger label. */
  displayValue: ComputedRef<string>
  /** Whether the current selection is non-empty (drives data-filled). */
  filled: ComputedRef<boolean>
  /** Records the visible label of an option so the trigger can show labels, not values. */
  registerLabel: (value: unknown, label: string) => void
  /** True while a selected value has no recorded label yet (options not mounted). */
  labelsPending: ComputedRef<boolean>
}

export const selectContextKey: InjectionKey<SelectContext> = Symbol('SelectContext')
