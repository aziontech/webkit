import { inject, type InjectionKey, type Ref } from 'vue'

import type { Placement } from '../../../composables/use-placement'

/** Side of the trigger the card opens on, optionally aligned to its start or end. */
export type HoverCardPlacement = Placement

/** Prop-level placement; `'auto'` picks the side with the most room at open time. */
export type HoverCardPlacementInput = HoverCardPlacement | 'auto'

/** State the hover-card root shares with its trigger and card. */
export interface HoverCardContext {
  /** Stable test-id prefix derived from the root component. */
  testId: string
  /** Element id of the card, referenced by the trigger's aria-describedby. */
  contentId: string
  /** Current open state. */
  isOpen: Readonly<Ref<boolean>>
  /** Resolved placement of the card. */
  placement: Readonly<Ref<HoverCardPlacement>>
  /** Inline position style computed by the shared placement engine. */
  panelStyle: Readonly<Ref<Record<string, string>>>
  /** Trigger wrapper element, the positioning anchor. */
  triggerEl: Ref<globalThis.HTMLElement | null>
  /** The floating card element. */
  panelEl: Ref<globalThis.HTMLElement | null>
  /** Opens after the open delay, cancelling a pending close. */
  scheduleOpen: () => void
  /** Closes after the close delay, cancelling a pending open. */
  scheduleClose: () => void
  /** Cancels a pending close (the pointer or focus reached the card). */
  cancelClose: () => void
  /** Moves focus to the first focusable element in the open card; false when it has none. */
  focusContent: () => boolean
  /** Moves focus back to the trigger's focusable element. */
  focusTrigger: () => void
}

export const HOVER_CARD_FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export const HoverCardInjectionKey: InjectionKey<HoverCardContext> = Symbol('HoverCard')

export function useHoverCardContext(): HoverCardContext {
  const ctx = inject(HoverCardInjectionKey)
  if (!ctx) throw new Error('HoverCard.* sub-components must be used inside <HoverCard>.')
  return ctx
}
