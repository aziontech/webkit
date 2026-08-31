import { curve, duration } from '@aziontech/theme/animations'

/**
 * Item transfer motion, read from the theme animation tokens. Applied as an
 * inline transition because Tailwind cannot emit dynamic duration utilities.
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
