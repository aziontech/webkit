import {
  curve,
  duration
} from '../../../../../../theme/src/tokens/primitives/animations/animate.js'
/** Panel content slide — values read only from `animate.js`. */
export const tabViewPanelMotion = {
  enter: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
}
/** Tab list highlight pill — values read only from `animate.js`. */
export const tabViewIndicatorMotion = {
  slide: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
}
export const getTabViewPanelTransitionStyle = () => {
  const { duration: transitionDuration, curve: transitionTimingFunction } = tabViewPanelMotion.enter
  return {
    transition: `transform ${transitionDuration} ${transitionTimingFunction}, opacity ${transitionDuration} ${transitionTimingFunction}`
  }
}
export const getTabViewIndicatorTransitionStyle = () => {
  const { duration: transitionDuration, curve: transitionTimingFunction } =
    tabViewIndicatorMotion.slide
  return {
    transition: `transform ${transitionDuration} ${transitionTimingFunction}, width ${transitionDuration} ${transitionTimingFunction}, height ${transitionDuration} ${transitionTimingFunction}`
  }
}
/** Enter offset when moving to a tab on the right (positive → 0). */
export const tabViewEnterOffsetClasses = {
  right: 'translate-x-[var(--spacing-4)]',
  left: '-translate-x-[var(--spacing-4)]',
  none: 'translate-x-0'
}
