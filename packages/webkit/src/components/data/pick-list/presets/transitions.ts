import { curve, duration } from '@aziontech/theme/animations'

export const pickListItemMotion = {
  duration: duration['moderate-01'],
  curve: curve['productive-entrance']
} as const

export const getItemTransitionStyle = (): { transition: string } => ({
  transition: `opacity ${pickListItemMotion.duration} ${pickListItemMotion.curve}`
})

export const pickListItemTransitionClasses = ['motion-reduce:transition-none'] as const
