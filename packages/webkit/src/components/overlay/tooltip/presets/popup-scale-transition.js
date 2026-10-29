import { curve, duration } from '@aziontech/theme/animations'

export const tooltipMotion = {
  open: { duration: duration['moderate-01'], curve: curve['productive-entrance'] },
  close: { duration: duration['fast-02'], curve: curve['productive-exit'] }
}

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
