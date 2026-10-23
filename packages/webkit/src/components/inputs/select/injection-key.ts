import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type SelectSize = 'small' | 'medium' | 'large'

export type SelectValue = string | number | unknown[] | undefined

export type SelectOpenTarget = 'selected' | 'first' | 'last'

export interface SelectContext {
  /** Stable id used to wire trigger `aria-controls` and content element id. */
  contentId: string
  inputId: ComputedRef<string>
  ariaLabel: ComputedRef<string>
  /** Trigger element ref; the content reads it to anchor below. */
  triggerRef: Ref<globalThis.HTMLElement | null>
  listboxRef: Ref<globalThis.HTMLElement | null>
  listboxLabel: Ref<string | undefined>
  /** Current open state. */
  open: Ref<boolean>
  setOpen: (value: boolean) => void
  openList: (target: SelectOpenTarget, char?: string) => void
  close: (restoreFocus: boolean) => void
  activeId: Ref<string | undefined>
  navigating: Ref<boolean>
  setNavigating: (value: boolean) => void
  onListKeydown: (event: globalThis.KeyboardEvent) => boolean
  /** Current selection. */
  modelValue: Ref<SelectValue>
  toggleValue: (value: unknown) => void
  isSelected: (value: unknown) => boolean
  registerNativeOption: (key: string, value: unknown) => () => void
  /** Computed selection mode. */
  multiple: ComputedRef<boolean>
  native: ComputedRef<boolean>
  /** Static state flags. */
  size: ComputedRef<SelectSize>
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

export const selectContextKey: InjectionKey<SelectContext> = Symbol('SelectContext')
