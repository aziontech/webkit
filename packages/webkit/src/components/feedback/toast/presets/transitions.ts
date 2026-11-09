import { curve, duration } from '@aziontech/theme/animations'

export type ToastMotionPhase = 'enter' | 'exit'

export type ToastMotionToken = {
  duration: string
  curve: string
}

export const toastMotion: Record<ToastMotionPhase, ToastMotionToken> = {
  enter: { duration: duration['moderate-02'], curve: curve['productive-entrance'] },
  exit: { duration: duration['slow-01'], curve: curve['productive-exit'] }
}

export const TOAST_UNMOUNT_MS = Number.parseInt(toastMotion.exit.duration, 10) + 32

export const getRegionTransitionStyle = (): { transition: string } => ({
  transition: `all ${toastMotion.enter.duration} ${toastMotion.enter.curve}`
})

export const getToastTransitionStyle = (removing: boolean): { transition: string } => {
  const { duration: d, curve: c } = removing ? toastMotion.exit : toastMotion.enter
  return {
    transition: `transform ${d} ${c}, opacity ${d} ${c}, height ${d} ${c}`
  }
}
