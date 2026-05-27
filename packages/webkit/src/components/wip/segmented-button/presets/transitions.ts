import {
  curve,
  duration
} from '../../../../../../theme/src/tokens/primitives/animations/animate.js'

/** Selection highlight pill — values read only from `animate.js`. */
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
