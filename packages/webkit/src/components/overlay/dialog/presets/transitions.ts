import {
  curve,
  duration
} from '../../../../../../theme/src/tokens/primitives/animations/animate.js'
import { DRAWER_EXIT_MS, getDrawerTransitionStyle } from '../../drawer/presets/transitions'
import {
  bottomSheetPanelMotionClasses,
  bottomSheetPanelStateClasses
} from '../../presets/bottom-sheet-transitions'

export type DialogMotionState = 'open' | 'closed'

/**
 * Dialog motion presets — values read only from `animate.js` (`duration`, `curve`).
 * Applied via inline `transition` (Tailwind does not emit dynamic `duration-[…]` classes).
 */

export type DialogMotionPhase = 'open' | 'close'

export type DialogMotionTarget = 'panel' | 'overlay'

export type DialogMotionToken = {
  duration: string
  curve: string
}

/**
 * Dialog targets mapped to `duration` / `curve` primitives from animate.js.
 * Panel scales 0.98 → 1 and fades opacity 0 → 1; overlay fades opacity.
 */
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

/** Defers portal unmount until exit finishes (+ buffer for `paintClose` rAF). */
export const DIALOG_EXIT_MS = Math.max(dialogExitDurationMs + 32, DRAWER_EXIT_MS + 32)

const motionPhaseForState = (state: DialogMotionState): DialogMotionPhase =>
  state === 'open' ? 'open' : 'close'

/** Inline transition for the active `data-state` (matches animate.js values in computed styles). */
export const getDialogTransitionStyle = (
  state: DialogMotionState,
  target: DialogMotionTarget
): { transition: string } => {
  const phase = motionPhaseForState(state)
  const { duration: transitionDuration, curve: transitionTimingFunction } =
    dialogMotion[target][phase]
  if (target === 'panel') {
    const transition = `transform ${transitionDuration} ${transitionTimingFunction}, opacity ${transitionDuration} ${transitionTimingFunction}`
    return { transition }
  }

  return {
    transition: `opacity ${transitionDuration} ${transitionTimingFunction}`
  }
}

/** Mobile bottom sheet uses Drawer panel/overlay timing (transform-only on panel). */
export const getDialogResponsiveTransitionStyle = (
  state: DialogMotionState,
  target: DialogMotionTarget,
  isMobile: boolean
): { transition: string } =>
  isMobile ? getDrawerTransitionStyle(state, target) : getDialogTransitionStyle(state, target)

export const dialogPanelTransitionClasses = [
  ...bottomSheetPanelStateClasses,
  ...bottomSheetPanelMotionClasses,
  // Desktop (≥ md): centered scale + fade
  'md:origin-center',
  'md:translate-y-0',
  'md:scale-[0.98]',
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
