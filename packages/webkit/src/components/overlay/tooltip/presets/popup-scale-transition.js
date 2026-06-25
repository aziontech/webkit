import {
  curve,
  duration
} from '../../../../../../theme/src/tokens/primitives/animations/animate.js'

/**
 * Tooltip popup motion — timing from `animate.js` (`popup-scale-in` / `popup-scale-out`).
 * Uses CSS transitions (scale 0.95 → 1, opacity 0 → 1) so Vue `<Transition>` can drive enter/leave.
 * Matches semantic `animate-popup-scale-*` keyframes (150ms · productive-entrance / 110ms · productive-exit).
 */

export const tooltipMotion = {
  open: { duration: duration['moderate-01'], curve: curve['productive-entrance'] },
  close: { duration: duration['fast-02'], curve: curve['productive-exit'] }
}

/** Close duration — defer unmount until exit animation finishes. */
export const TOOLTIP_EXIT_MS = Number.parseInt(tooltipMotion.close.duration, 10)

export const popupScaleTransitionEnterActiveClasses = [
  'transition-[transform,opacity]',
  'duration-moderate-01',
  'ease-productive-entrance',
  'motion-reduce:transition-none',
  'motion-reduce:transform-none'
].join(' ')

export const popupScaleTransitionEnterFromClasses =
  'scale-[0.95] opacity-0 motion-reduce:scale-100 motion-reduce:opacity-100'

export const popupScaleTransitionEnterToClasses = 'scale-100 opacity-100'

export const popupScaleTransitionLeaveActiveClasses = [
  'transition-[transform,opacity]',
  'duration-fast-02',
  'ease-productive-exit',
  'motion-reduce:transition-none',
  'motion-reduce:transform-none'
].join(' ')

export const popupScaleTransitionLeaveFromClasses = 'scale-100 opacity-100'

export const popupScaleTransitionLeaveToClasses =
  'scale-[0.95] opacity-0 motion-reduce:scale-100 motion-reduce:opacity-100'
