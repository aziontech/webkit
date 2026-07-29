import { curve, duration } from '@aziontech/theme/animations'

export type TabViewSlideDirection = 'left' | 'right' | null

/** Panel content slide — values read only from `animate.js`. */
export const tabViewPanelMotion = {
  enter: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

/** Tab list highlight pill — values read only from `animate.js`. */
export const tabViewIndicatorMotion = {
  slide: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

/*
 * `translate` is listed alongside `transform` on purpose. Tailwind v4 compiles
 * `translate-x-*` to the standalone `translate` property (`translate: var(--tw-translate-x)
 * var(--tw-translate-y)`), and its `.transform` utility no longer covers translation —
 * it only composes rotate/skew. A list of just `transform, opacity` therefore leaves the
 * slide offset un-interpolated: it snaps to its final position while only the fade plays,
 * so a panel/month swap reads as a pop instead of a slide. Tailwind's own
 * `transition-transform` expands to `transform, translate, scale, rotate` for the same
 * reason. Any offset expressed with a `translate-*` utility must keep `translate` here.
 */
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

/** Enter offset when moving to a tab on the right (positive → 0). */
export const tabViewEnterOffsetClasses = {
  right: 'translate-x-[var(--spacing-md)]',
  left: '-translate-x-[var(--spacing-md)]',
  none: 'translate-x-0'
} as const
