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

export const iconTransitionHostClasses =
  'relative z-1 inline-flex shrink-0 items-center justify-center overflow-hidden'

export const iconTransitionIconClasses = iconTransitionLayerClasses
