import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type AccordionType = 'single' | 'multiple'

export type AccordionSize = 'medium' | 'large'

export type AccordionArrowPosition = 'left' | 'right'

export type AccordionValue = string | string[] | null

export interface AccordionItemRegistration {
  /** Unique identifier of the item. */
  value: string
  /** Whether the item is non-interactive. */
  disabled: boolean
  /** Item root element ref, used by roving focus to locate triggers. */
  el: Ref<globalThis.HTMLElement | null>
}

export interface AccordionContext {
  /** Resolved open item(s): a string (or null) in single mode, an array in multiple mode. */
  value: ComputedRef<AccordionValue>
  /** Toggles the item identified by `value`, honoring type/collapsible rules. */
  toggle: (value: string) => void
  /** Whether the item identified by `value` is currently open. */
  isOpen: (value: string) => boolean
  /** Selection mode. */
  type: ComputedRef<AccordionType>
  /** In single mode, whether the open item may collapse to none. */
  collapsible: ComputedRef<boolean>
  /** Size token, mirrored onto every item. */
  size: ComputedRef<AccordionSize>
  /** Side the chevron sits on, mirrored onto every item. */
  arrowPosition: ComputedRef<AccordionArrowPosition>
  /** Registers an item so roving focus can find its trigger. */
  register: (registration: AccordionItemRegistration) => void
  /** Removes a previously registered item. */
  unregister: (value: string) => void
  /** Moves focus to the next/previous enabled trigger (wraps). */
  focusSibling: (value: string, direction: 1 | -1) => void
  /** Moves focus to the first/last enabled trigger. */
  focusEdge: (edge: 'first' | 'last') => void
  /** Stable id for an item's trigger button. */
  triggerId: (value: string) => string
  /** Stable id for an item's content panel. */
  contentId: (value: string) => string
}

export const AccordionInjectionKey: InjectionKey<AccordionContext> = Symbol('AccordionContext')

export interface AccordionItemContext {
  /** This item's unique identifier. */
  value: string
  /** Whether this item is non-interactive. */
  disabled: ComputedRef<boolean>
  /** Whether this item is currently open. */
  open: ComputedRef<boolean>
  /** Stable id of this item's trigger button. */
  triggerId: ComputedRef<string>
  /** Stable id of this item's content panel. */
  contentId: ComputedRef<string>
}

export const AccordionItemInjectionKey: InjectionKey<AccordionItemContext> =
  Symbol('AccordionItemContext')
