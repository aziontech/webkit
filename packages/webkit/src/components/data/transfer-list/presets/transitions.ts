import { curve, duration } from '@aziontech/theme/animations'

export const transferListItemMotion = {
  duration: duration['moderate-01'],
  curve: curve['productive-entrance']
} as const

export const getItemTransitionStyle = (): { transition: string } => ({
  transition: `opacity ${transferListItemMotion.duration} ${transferListItemMotion.curve}`
})
