import { curve, duration } from '@aziontech/theme/animations'

/**
 * Toast stack motion — values read only from animate.js (`duration`, `curve`).
 * Applied via inline `transition` (Tailwind does not emit dynamic `duration-[…]`
 * classes), so the stack uses the Design System curves and speeds rather than
 * ad-hoc Tailwind timing utilities.
 */

export type ToastMotionPhase = 'enter' | 'exit' | 'reveal'

export type ToastMotionToken = {
  duration: string
  curve: string
}

/**
 * Stack motion mapped to `duration` / `curve` primitives from animate.js.
 * `enter` settles a new card in (and drives the resting-stack reflow);
 * `exit` slides a dismissed card back off the anchored edge;
 * `reveal` fades the hover/focus close affordance in.
 */
export const toastMotion: Record<ToastMotionPhase, ToastMotionToken> = {
  enter: { duration: duration['moderate-02'], curve: curve['productive-entrance'] },
  exit: { duration: duration['slow-01'], curve: curve['productive-exit'] },
  reveal: { duration: duration['moderate-01'], curve: curve['productive-entrance'] }
}

/** Defers DOM unmount one paint past the exit transition so it never clips. */
export const TOAST_UNMOUNT_MS = Number.parseInt(toastMotion.exit.duration, 10) + 32

/** Inline transition for the region container (height / anchor reflow). */
export const getRegionTransitionStyle = (): { transition: string } => ({
  transition: `all ${toastMotion.enter.duration} ${toastMotion.enter.curve}`
})

/**
 * Inline transition for a toast card (transform / opacity / height). The exit
 * phase uses the exit curve + duration; enter and resting-stack reflow share
 * the entrance curve.
 */
export const getToastTransitionStyle = (removing: boolean): { transition: string } => {
  const { duration: d, curve: c } = removing ? toastMotion.exit : toastMotion.enter
  return {
    transition: `transform ${d} ${c}, opacity ${d} ${c}, height ${d} ${c}`
  }
}

/** Inline transition for the close affordance reveal (hover / focus-within). */
export const getCloseRevealTransitionStyle = (): { transition: string } => ({
  transition: `opacity ${toastMotion.reveal.duration} ${toastMotion.reveal.curve}`
})
