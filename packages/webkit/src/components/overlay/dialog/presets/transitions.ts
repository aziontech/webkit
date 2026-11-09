import { curve, duration } from '@aziontech/theme/animations'

import { DRAWER_EXIT_MS, getDrawerTransitionStyle } from '../../drawer/presets/transitions'
import {
  bottomSheetPanelMotionClasses,
  bottomSheetPanelStateClasses
} from '../../presets/bottom-sheet-transitions'

export type DialogMotionState = 'open' | 'closed'

export type DialogMotionPhase = 'open' | 'close'

export type DialogMotionTarget = 'panel' | 'overlay'

export type DialogMotionToken = {
  duration: string
  curve: string
}

export const dialogMotion: Record<
  DialogMotionTarget,
  Record<DialogMotionPhase, DialogMotionToken>
> = {
  panel: {
    open: { duration: duration['moderate-01'], curve: curve['productive-entrance'] },
    close: { duration: duration['moderate-01'], curve: curve['productive-exit'] }
  },
  overlay: {
    open: { duration: duration['moderate-01'], curve: curve['productive-entrance'] },
    close: { duration: duration['moderate-01'], curve: curve['productive-exit'] }
  }
}

export const dialogDurations = {
  panelOpen: dialogMotion.panel.open.duration,
  panelClose: dialogMotion.panel.close.duration,
  overlayOpen: dialogMotion.overlay.open.duration,
  overlayClose: dialogMotion.overlay.close.duration
} as const

const dialogExitDurationMs = Math.max(
  Number.parseInt(dialogDurations.panelClose, 10),
  Number.parseInt(dialogDurations.overlayClose, 10)
)

export const DIALOG_EXIT_MS = Math.max(dialogExitDurationMs + 32, DRAWER_EXIT_MS + 32)

const motionPhaseForState = (state: DialogMotionState): DialogMotionPhase =>
  state === 'open' ? 'open' : 'close'

export const getDialogTransitionStyle = (
  state: DialogMotionState,
  target: DialogMotionTarget
): { transition: string } => {
  const phase = motionPhaseForState(state)
  const { duration: transitionDuration, curve: transitionTimingFunction } =
    dialogMotion[target][phase]
  if (target === 'panel') {
    const t = `${transitionDuration} ${transitionTimingFunction}`
    const transition = `translate ${t}, scale ${t}, opacity ${t}`
    return { transition }
  }

  return {
    transition: `opacity ${transitionDuration} ${transitionTimingFunction}`
  }
}

export const getDialogResponsiveTransitionStyle = (
  state: DialogMotionState,
  target: DialogMotionTarget,
  isMobile: boolean
): { transition: string } =>
  isMobile ? getDrawerTransitionStyle(state, target) : getDialogTransitionStyle(state, target)

export const dialogPanelTransitionClasses = [
  ...bottomSheetPanelStateClasses,
  ...bottomSheetPanelMotionClasses,
  'md:origin-center',
  'md:translate-y-0',
  'md:scale-[0.9]',
  'md:opacity-0',
  'md:data-[state=open]:scale-100',
  'md:data-[state=open]:opacity-100',
  'motion-reduce:scale-100',
  'motion-reduce:translate-y-0',
  'motion-reduce:opacity-100'
] as const

export const dialogOverlayTransitionClasses = [
  'opacity-0',
  'data-[state=open]:opacity-100',
  'motion-reduce:transition-none'
] as const
