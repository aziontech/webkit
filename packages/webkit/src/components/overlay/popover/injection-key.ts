import { inject, type InjectionKey, type Ref } from 'vue'

export type PopoverPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

/** Prop-level placement; `'auto'` lets the popover pick the best fit at open time. */
export type PopoverPlacementInput = PopoverPlacement | 'auto'

export interface PopoverContext {
  /** Stable test-id prefix derived from the root component. */
  testId: string
  /** Current open state, exposed reactively to sub-components. */
  isOpen: Ref<boolean>
  /** Whether the root is disabled — trigger refuses to open. */
  disabled: Ref<boolean>
  /** Resolved placement passed to the floating panel as data-placement. */
  placement: Ref<PopoverPlacement>
  /** Stable element ids used to wire aria-controls / aria-labelledby / aria-describedby. */
  triggerId: string
  contentId: string
  titleId: string
  descriptionId: string
  /** Mutable refs the sub-components attach DOM elements to. */
  triggerRef: Ref<globalThis.HTMLElement | null>
  panelRef: Ref<globalThis.HTMLElement | null>
  /** Teleport target inside the open panel; the content portals here. */
  panelBodyRef: Ref<globalThis.HTMLElement | null>
  /** Drives open state. Sub-components never call defineEmits directly. */
  setOpen: (value: boolean) => void
  /** Returns focus to the trigger element (used on Esc and Popover.Close). */
  focusTrigger: () => void
  /** Title registers presence so the panel wires aria-labelledby only when a title exists. */
  registerTitle: () => void
  unregisterTitle: () => void
  /** Description registers presence so the panel wires aria-describedby only when present. */
  registerDescription: () => void
  unregisterDescription: () => void
  /** Whether a Popover.Title is mounted; gates aria-labelledby on the panel. */
  hasTitle: Ref<boolean>
  /** Whether a Popover.Description is mounted; gates aria-describedby on the panel. */
  hasDescription: Ref<boolean>
}

export const PopoverInjectionKey: InjectionKey<PopoverContext> = Symbol('PopoverContext')

/**
 * Consumes the Popover context, throwing when used outside the root component.
 * Narrows the type to PopoverContext for the calling sub-component.
 */
export function usePopoverContext(): PopoverContext {
  const ctx = inject(PopoverInjectionKey)
  if (!ctx) {
    throw new Error('Popover.* sub-components must be used inside <Popover>.')
  }
  return ctx
}
