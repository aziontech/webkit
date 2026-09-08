import { curve, duration } from '@aziontech/theme/animations'

/**
 * Toast stack motion, read from the animate.js duration/curve primitives and
 * applied via inline transition — Tailwind cannot emit dynamic timing classes.
 */

export type ToastMotionPhase = 'enter' | 'exit'

export type ToastMotionToken = {
  duration: string
  curve: string
}

/** `enter` also drives the resting-stack reflow; `exit` slides off the anchored edge. */
export const toastMotion: Record<ToastMotionPhase, ToastMotionToken> = {
  enter: { duration: duration['moderate-02'], curve: curve['productive-entrance'] },
  exit: { duration: duration['slow-01'], curve: curve['productive-exit'] }
}

/** Defers DOM unmount one paint past the exit transition so it never clips. */
export const TOAST_UNMOUNT_MS = Number.parseInt(toastMotion.exit.duration, 10) + 32

/** Inline transition for the region container (height / anchor reflow). */
export const getRegionTransitionStyle = (): { transition: string } => ({
  transition: `all ${toastMotion.enter.duration} ${toastMotion.enter.curve}`
})

/** Inline transition for a toast card; enter and resting reflow share the entrance curve. */
export const getToastTransitionStyle = (removing: boolean): { transition: string } => {
  const { duration: d, curve: c } = removing ? toastMotion.exit : toastMotion.enter
  return {
    transition: `transform ${d} ${c}, opacity ${d} ${c}, height ${d} ${c}`
  }
}
