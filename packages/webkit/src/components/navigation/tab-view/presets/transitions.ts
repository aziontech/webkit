import {
  curve,
  duration
} from '../../../../../../../theme/src/tokens/primitives/animations/animate.js'

export type TabViewSlideDirection = 'left' | 'right' | null

/** Panel content slide — values read only from `animate.js`. */
export const tabViewPanelMotion = {
  enter: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

/** Tab list highlight pill — values read only from `animate.js`. */
export const tabViewIndicatorMotion = {
  slide: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

export const getTabViewPanelTransitionStyle = (): { transition: string } => {
  const { duration: transitionDuration, curve: transitionTimingFunction } = tabViewPanelMotion.enter

  return {
    transition: `transform ${transitionDuration} ${transitionTimingFunction}, opacity ${transitionDuration} ${transitionTimingFunction}`
  }
}

export const getTabViewIndicatorTransitionStyle = (): { transition: string } => {
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
} as const
