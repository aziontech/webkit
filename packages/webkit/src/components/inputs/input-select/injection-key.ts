import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type InputSelectSize = 'small' | 'medium' | 'large'

export type InputSelectValue = string | number | unknown[] | undefined

export interface InputSelectContext {
  /** Stable id used to wire trigger `aria-controls` and content element id. */
  contentId: string
  /** Trigger element ref; the content reads it to anchor below. */
  triggerRef: Ref<globalThis.HTMLElement | null>
  /** Current open state. */
  open: Ref<boolean>
  setOpen: (value: boolean) => void
  /** Current selection. */
  modelValue: Ref<InputSelectValue>
  toggleValue: (value: unknown) => void
  isSelected: (value: unknown) => boolean
  /** Computed selection mode. */
  multiple: ComputedRef<boolean>
  /** Static state flags. */
  size: ComputedRef<InputSelectSize>
  disabled: ComputedRef<boolean>
  readonly: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
  required: ComputedRef<boolean>
  placeholder: ComputedRef<string | undefined>
  /** Formats the selected value(s) for the trigger label. */
  displayValue: ComputedRef<string>
  /** Whether the current selection is non-empty (drives data-filled). */
  filled: ComputedRef<boolean>
}

export const inputSelectContextKey: InjectionKey<InputSelectContext> = Symbol('InputSelectContext')
