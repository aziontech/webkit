import { curve, duration } from '@aziontech/theme/animations'

/**
 * Pick-list item transfer motion — values read only from `animate.js`
 * (`duration`, `curve`). Applied via inline `transition` (Tailwind does not emit
 * dynamic `duration-[…]` classes), so items fade in/out on the Design System
 * curve + speed rather than ad-hoc Tailwind timing utilities.
 */
export const pickListItemMotion = {
  duration: duration['moderate-01'],
  curve: curve['productive-entrance']
} as const

/** Inline transition for an item entering / leaving a list (opacity fade). */
export const getItemTransitionStyle = (): { transition: string } => ({
  transition: `opacity ${pickListItemMotion.duration} ${pickListItemMotion.curve}`
})

/** Reduced-motion escape applied on the enter/leave active class. */
export const pickListItemTransitionClasses = ['motion-reduce:transition-none'] as const
