import { curve, duration } from '@aziontech/theme/animations'

export const segmentedButtonIndicatorMotion = {
  slide: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

export const getSegmentedButtonIndicatorTransitionStyle = (): { transition: string } => {
  const { duration: transitionDuration, curve: transitionTimingFunction } =
    segmentedButtonIndicatorMotion.slide

  return {
    transition: `transform ${transitionDuration} ${transitionTimingFunction}, width ${transitionDuration} ${transitionTimingFunction}, height ${transitionDuration} ${transitionTimingFunction}`
  }
}
