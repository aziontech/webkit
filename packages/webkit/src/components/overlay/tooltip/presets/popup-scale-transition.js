/**
 * Popup scale motion (0.95 → 1, opacity 0 → 1) — timing from `animate.js`
 * (`moderate-01` / `productive-entrance` enter, `fast-02` / `productive-exit` leave).
 * Spec also lists `animate-popup-scale-in` / `animate-popup-scale-out` (semantic keyframes).
 */

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
