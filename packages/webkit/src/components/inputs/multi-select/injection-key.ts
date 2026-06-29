import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type MultiSelectSize = 'small' | 'medium' | 'large'

export interface MultiSelectContext {
  /** Stable id used to wire trigger `aria-controls` and content element id. */
  contentId: string
  /** Trigger element ref; the content reads it to anchor below. */
  triggerRef: Ref<globalThis.HTMLElement | null>
  /** Current open state. */
  open: Ref<boolean>
  setOpen: (value: boolean) => void
  /** Current selection. Always an array. */
  modelValue: Ref<unknown[]>
  toggleValue: (value: unknown) => void
  isSelected: (value: unknown) => boolean
  /** Static state flags. */
  size: ComputedRef<MultiSelectSize>
  disabled: ComputedRef<boolean>
  readonly: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
  required: ComputedRef<boolean>
  placeholder: ComputedRef<string>
  /** Formats the selected values for the trigger label. */
  displayValue: ComputedRef<string>
  /** Whether the current selection is non-empty (drives data-filled). */
  filled: ComputedRef<boolean>
}

export const multiSelectContextKey: InjectionKey<MultiSelectContext> = Symbol('MultiSelectContext')
