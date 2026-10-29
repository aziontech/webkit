import { curve, duration } from '@aziontech/theme/animations'

export const messageDismissMotion = {
  duration: duration['fast-02'],
  curve: curve['productive-exit']
} as const

export const MESSAGE_DISMISS_MS = Number.parseInt(messageDismissMotion.duration, 10)

export const getMessageDismissTransitionStyle = (): { transition: string } => ({
  transition: `opacity ${messageDismissMotion.duration} ${messageDismissMotion.curve}`
})

export const messageDismissTransitionClasses = ['motion-reduce:transition-none'] as const
