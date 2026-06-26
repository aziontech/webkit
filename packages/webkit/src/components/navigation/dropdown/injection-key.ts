import { inject, type InjectionKey, type Ref } from 'vue'

export type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

export type DropdownOptionValue = string | number

export interface DropdownContext {
  /** Stable test-id prefix derived from the root component. */
  testId: string
  /** Current open state, exposed reactively to sub-components. */
  isOpen: Ref<boolean>
  /** Whether the root is disabled — trigger refuses to open. */
  disabled: Ref<boolean>
  /** Resolved placement passed to the panel as data-placement. */
  placement: Ref<DropdownPlacement>
  /** Stable element ids used to wire aria-controls / aria-labelledby. */
  triggerId: string
  panelId: string
  /** Mutable refs the sub-components attach DOM elements to. */
  triggerRef: Ref<globalThis.HTMLElement | null>
  panelRef: Ref<globalThis.HTMLElement | null>
  /** Teleport target inside the open panel; groups portal their content here. */
  panelBodyRef: Ref<globalThis.HTMLElement | null>
  /** Drives open state. Sub-components never call defineEmits directly. */
  setOpen: (value: boolean) => void
  /** Activates an option — emits select and closes the panel. */
  selectOption: (
    value: DropdownOptionValue,
    event: globalThis.MouseEvent | globalThis.KeyboardEvent
  ) => void
  /**
   * Called once on mount per group. Returns the 0-based registration index
   * so the group can render a top divider when it is not the first.
   */
  registerGroup: () => number
  /** Focus helpers driven by the root keyboard handler. */
  focusFirstOption: () => void
  focusLastOption: () => void
  focusNextOption: () => void
  focusPrevOption: () => void
  /** Returns focus to the trigger element (used on Esc, Tab, outside-click). */
  focusTrigger: () => void
}

export const DropdownInjectionKey: InjectionKey<DropdownContext> = Symbol('DropdownContext')

/**
 * Consumes the Dropdown context, throwing when used outside `<Dropdown>`.
 * Narrows the type to `DropdownContext` for the calling sub-component.
 */
export function useDropdownContext(): DropdownContext {
  const ctx = inject(DropdownInjectionKey)
  if (!ctx) {
    throw new Error('Dropdown.* sub-components must be used inside <Dropdown>.')
  }
  return ctx
}
