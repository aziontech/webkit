import {
  curve,
  duration
} from '../../../../../../theme/src/tokens/primitives/animations/animate.js'
import {
  bottomSheetPanelMotionClasses,
  bottomSheetPanelStateClasses
} from '../../presets/bottom-sheet-transitions'

export type DrawerMotionState = 'open' | 'closed'

/**
 * Drawer motion presets — values read only from `animate.js` (`duration`, `curve`).
 * Applied via inline `transition` (Tailwind does not emit dynamic `duration-[…]` classes).
 */

export type DrawerMotionPhase = 'open' | 'close'

export type DrawerMotionTarget = 'panel' | 'overlay'

export type DrawerMotionToken = {
  duration: string
  curve: string
}

/**
 * Drawer targets mapped to `duration` / `curve` primitives from animate.js.
 */
export const drawerMotion: Record<
  DrawerMotionTarget,
  Record<DrawerMotionPhase, DrawerMotionToken>
> = {
  panel: {
    open: { duration: duration['slow-02'], curve: curve['expressive-entrance'] },
    close: { duration: duration['slow-01'], curve: curve['expressive-exit'] }
  },
  overlay: {
    open: { duration: duration['slow-01'], curve: curve['productive-entrance'] },
    close: { duration: duration['slow-02'], curve: curve['productive-exit'] }
  }
}

export const drawerDurations = {
  panelOpen: drawerMotion.panel.open.duration,
  panelClose: drawerMotion.panel.close.duration,
  overlayOpen: drawerMotion.overlay.open.duration,
  overlayClose: drawerMotion.overlay.close.duration
} as const

export const drawerCurves = {
  entrance: curve['productive-entrance'],
  exit: curve['productive-exit']
} as const

/** Longest close transition — defers portal unmount until exit finishes. */
export const DRAWER_EXIT_MS = Math.max(
  Number.parseInt(drawerDurations.panelClose, 10),
  Number.parseInt(drawerDurations.overlayClose, 10)
)

const motionPhaseForState = (state: DrawerMotionState): DrawerMotionPhase =>
  state === 'open' ? 'open' : 'close'

/** Inline transition for the active `data-state` (matches animate.js values in computed styles). */
export const getDrawerTransitionStyle = (
  state: DrawerMotionState,
  target: DrawerMotionTarget
): { transition: string } => {
  const phase = motionPhaseForState(state)
  const { duration: transitionDuration, curve: transitionTimingFunction } =
    drawerMotion[target][phase]
  const property = target === 'panel' ? 'transform' : 'opacity'

  return {
    transition: `${property} ${transitionDuration} ${transitionTimingFunction}`
  }
}

export const drawerPanelTransitionClasses = bottomSheetPanelMotionClasses

export const drawerPanelStateClasses = {
  left: [
    ...bottomSheetPanelStateClasses,
    'md:data-[state=closed]:-translate-x-full',
    'md:data-[state=open]:translate-x-0',
    'md:translate-y-0'
  ] as const,
  right: [
    ...bottomSheetPanelStateClasses,
    'md:data-[state=closed]:translate-x-full',
    'md:data-[state=open]:translate-x-0',
    'md:translate-y-0'
  ] as const
}

export const drawerOverlayTransitionClasses = [
  'opacity-0',
  'data-[state=open]:opacity-100',
  'motion-reduce:transition-none'
] as const
