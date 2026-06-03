/**
 * Icon swap motion — timing from `animate.js` (`moderate-01`/`productive-entrance` enter,
 * `fast-02`/`productive-exit` leave).
 */

export const iconTransitionEnterActiveClasses = [
  'transition-[transform,opacity] duration-moderate-01 ease-productive-entrance',
  'motion-reduce:transition-none motion-reduce:transform-none'
].join(' ')

export const iconTransitionEnterFromClasses =
  'scale-0 opacity-0 motion-reduce:scale-100 motion-reduce:opacity-100'

export const iconTransitionEnterToClasses = 'scale-100 opacity-100'

export const iconTransitionLeaveActiveClasses = [
  'pointer-events-none absolute inset-0 inline-flex items-center justify-center',
  'transition-opacity duration-fast-02 ease-productive-exit',
  'motion-reduce:transition-none'
].join(' ')

export const iconTransitionLeaveFromClasses = 'opacity-100'

export const iconTransitionLeaveToClasses = 'opacity-0'
