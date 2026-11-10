import { inject, type InjectionKey, type Ref } from 'vue'

export type DropdownMenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

/** Prop-level placement; `'auto'` lets the dropdown pick the best fit at open time. */
export type DropdownMenuPlacementInput = DropdownMenuPlacement | 'auto'

export type DropdownMenuOptionValue = string | number

export interface DropdownMenuContext {
  /** Stable test-id prefix derived from the root component. */
  testId: string
  /** Current open state, exposed reactively to sub-components. */
  isOpen: Ref<boolean>
  /** Whether the root is disabled — trigger refuses to open. */
  disabled: Ref<boolean>
  /** Resolved placement passed to the panel as data-placement. */
  placement: Ref<DropdownMenuPlacement>
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
    value: DropdownMenuOptionValue,
    event: globalThis.MouseEvent | globalThis.KeyboardEvent
  ) => void
  /**
   * Called once on mount per group. Returns the 0-based registration index
   * so the group can render a top divider when it is not the first.
   */
  registerGroup: () => number
  /**
   * Registers a global shortcut for an option's `command` hint; the root listens at the
   * window level and calls `activate` with the original event on match. Returns an
   * unregister function the caller must invoke on unmount.
   */
  registerCommand: (
    command: string,
    activate: (event: globalThis.KeyboardEvent) => void
  ) => () => void
  /** Focus helpers driven by the root keyboard handler. */
  focusFirstOption: () => void
  focusLastOption: () => void
  focusNextOption: () => void
  focusPrevOption: () => void
  /** Returns focus to the trigger element (used on Esc, Tab, outside-click). */
  focusTrigger: () => void
}

export const DropdownMenuInjectionKey: InjectionKey<DropdownMenuContext> =
  Symbol('DropdownMenuContext')

export function useDropdownContext(): DropdownMenuContext {
  const ctx = inject(DropdownMenuInjectionKey)
  if (!ctx) {
    throw new Error('DropdownMenu.* sub-components must be used inside <DropdownMenu>.')
  }
  return ctx
}
