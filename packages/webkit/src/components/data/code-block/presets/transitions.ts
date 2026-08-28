import { curve, duration } from '@aziontech/theme/animations'

/** Tab pill indicator — values read only from `animate.js`. */
export const codeBlockIndicatorMotion = {
  slide: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

/**
 * Per-line entrance on a tab swap. The marketing stagger below is 300ms a line —
 * three seconds for a ten-line file — so a swap gets its own, much shorter step,
 * and the step count is capped: past `maxSteps` every remaining line shares the
 * last delay, so a 200-line file swaps in the same time a 12-line one does.
 */
export const codeBlockLineSwapMotion = {
  stagger: '24ms',
  maxSteps: 12,
  enter: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

/** Shell height across a tab swap — the two panels rarely have the same line count. */
export const codeBlockHeightMotion = {
  resize: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

/** Staggered line entrance for marketing / website use cases. */
export const codeBlockLineEnterMotion = {
  stagger: '300ms',
  offsetClass: '-translate-x-2',
  enter: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

export type CodeBlockSlideDirection = 'left' | 'right' | null

/** Which per-line stagger is running: the marketing entrance, a tab swap, or none. */
export type CodeBlockLineMotionMode = 'enter' | 'swap' | null

export const getCodeBlockIndicatorTransitionStyle = (): { transition: string } => {
  const { duration: transitionDuration, curve: transitionTimingFunction } =
    codeBlockIndicatorMotion.slide

  return {
    transition: `transform ${transitionDuration} ${transitionTimingFunction}, width ${transitionDuration} ${transitionTimingFunction}`
  }
}

export const getCodeBlockLineTransitionStyle = (
  lineIndex: number
): { transition: string; transitionDelay: string } => {
  const { duration: transitionDuration, curve: transitionTimingFunction } =
    codeBlockLineEnterMotion.enter

  return {
    transition: `transform ${transitionDuration} ${transitionTimingFunction}, opacity ${transitionDuration} ${transitionTimingFunction}`,
    transitionDelay: `calc(${lineIndex} * ${codeBlockLineEnterMotion.stagger})`
  }
}

export const getCodeBlockLineSwapTransitionStyle = (
  lineIndex: number
): { transition: string; transitionDelay: string } => {
  const { duration: transitionDuration, curve: transitionTimingFunction } =
    codeBlockLineSwapMotion.enter
  const step = Math.min(lineIndex, codeBlockLineSwapMotion.maxSteps)

  return {
    transition: `transform ${transitionDuration} ${transitionTimingFunction}, opacity ${transitionDuration} ${transitionTimingFunction}`,
    transitionDelay: `calc(${step} * ${codeBlockLineSwapMotion.stagger})`
  }
}

export const codeBlockEnterOffsetClasses = {
  right: 'translate-x-(--spacing-md)',
  left: '-translate-x-(--spacing-md)',
  none: 'translate-x-0'
} as const
