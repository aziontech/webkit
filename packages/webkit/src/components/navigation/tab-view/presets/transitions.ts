import { curve, duration } from '@aziontech/theme/animations'

export type TabViewSlideDirection = 'left' | 'right' | null

export const tabViewPanelMotion = {
  enter: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

export const tabViewIndicatorMotion = {
  slide: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

export const getTabViewPanelTransitionStyle = (): { transition: string } => {
  const { duration: transitionDuration, curve: transitionTimingFunction } = tabViewPanelMotion.enter

  return {
    transition: `translate ${transitionDuration} ${transitionTimingFunction}, transform ${transitionDuration} ${transitionTimingFunction}, opacity ${transitionDuration} ${transitionTimingFunction}`
  }
}

export const getTabViewIndicatorTransitionStyle = (): { transition: string } => {
  const { duration: transitionDuration, curve: transitionTimingFunction } =
    tabViewIndicatorMotion.slide

  return {
    transition: `transform ${transitionDuration} ${transitionTimingFunction}, width ${transitionDuration} ${transitionTimingFunction}, height ${transitionDuration} ${transitionTimingFunction}`
  }
}

export const tabViewEnterOffsetClasses = {
  right: 'translate-x-(--spacing-md)',
  left: '-translate-x-(--spacing-md)',
  none: 'translate-x-0'
} as const
