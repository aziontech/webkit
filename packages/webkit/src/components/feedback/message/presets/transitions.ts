import {
  curve,
  duration
} from '../../../../../../theme/src/tokens/primitives/animations/animate.js'

/**
 * Message dismiss motion — values read only from `animate.js` (`duration`, `curve`).
 * Applied via inline `transition` (Tailwind does not emit dynamic `duration-[…]` classes).
 */
export const messageDismissMotion = {
  duration: duration['fast-02'],
  curve: curve['productive-exit']
} as const

/** Defers unmount until the opacity exit finishes. */
export const MESSAGE_DISMISS_MS = Number.parseInt(messageDismissMotion.duration, 10)

/** Inline transition for dismiss (opacity fade-out). */
export const getMessageDismissTransitionStyle = (): { transition: string } => ({
  transition: `opacity ${messageDismissMotion.duration} ${messageDismissMotion.curve}`
})

export const messageDismissTransitionClasses = ['motion-reduce:transition-none'] as const
