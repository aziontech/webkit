import { curve, duration } from '@aziontech/theme/animations'

export type TabsSlideDirection = 'left' | 'right' | null

export const tabViewPanelMotion = {
  enter: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

export const getTabViewPanelTransitionStyle = (): { transition: string } => {
  const { duration: transitionDuration, curve: transitionTimingFunction } = tabViewPanelMotion.enter

  return {
    transition: `translate ${transitionDuration} ${transitionTimingFunction}, transform ${transitionDuration} ${transitionTimingFunction}, opacity ${transitionDuration} ${transitionTimingFunction}`
  }
}
