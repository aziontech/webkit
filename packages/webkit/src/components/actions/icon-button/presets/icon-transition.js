/**
 * Icon swap motion — timing from `animate.js` (`moderate-01`/`productive-entrance` enter,
 * `fast-02`/`productive-exit` leave). Enter/leave glyphs stay centered in the host box.
 */

const iconTransitionLayerClasses =
  'pointer-events-none absolute inset-0 inline-flex items-center justify-center'

export const iconTransitionEnterActiveClasses = [
  iconTransitionLayerClasses,
  'transition-[transform,opacity] duration-moderate-01 ease-productive-entrance',
  'motion-reduce:transition-none motion-reduce:transform-none'
].join(' ')

export const iconTransitionEnterFromClasses =
  'scale-0 opacity-0 motion-reduce:scale-100 motion-reduce:opacity-100'

export const iconTransitionEnterToClasses = 'scale-100 opacity-100'

export const iconTransitionLeaveActiveClasses = [
  iconTransitionLayerClasses,
  'transition-opacity duration-fast-02 ease-productive-exit',
  'motion-reduce:transition-none'
].join(' ')

export const iconTransitionLeaveFromClasses = 'opacity-100'

export const iconTransitionLeaveToClasses = 'opacity-0'

/** Fixed box for swap motion; width/height come from IconButton size tokens. */
export const iconTransitionHostClasses =
  'relative z-[1] inline-flex shrink-0 items-center justify-center overflow-hidden'

/** Keeps glyphs out of flow so copy/check metrics cannot resize the button. */
export const iconTransitionIconClasses = iconTransitionLayerClasses
