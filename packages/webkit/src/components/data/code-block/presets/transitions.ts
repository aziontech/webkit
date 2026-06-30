import {
  curve,
  duration
} from '../../../../../../theme/src/tokens/primitives/animations/animate.js'

/** Tab underline indicator — values read only from `animate.js`. */
export const codeBlockIndicatorMotion = {
  slide: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

/** Panel content slide — values read only from `animate.js`. */
export const codeBlockPanelMotion = {
  enter: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

/** Staggered line entrance for marketing / website use cases. */
export const codeBlockLineEnterMotion = {
  stagger: '300ms',
  offsetClass: '-translate-x-2',
  enter: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

export type CodeBlockSlideDirection = 'left' | 'right' | null

export const getCodeBlockIndicatorTransitionStyle = (): { transition: string } => {
  const { duration: transitionDuration, curve: transitionTimingFunction } =
    codeBlockIndicatorMotion.slide

  return {
    transition: `transform ${transitionDuration} ${transitionTimingFunction}, width ${transitionDuration} ${transitionTimingFunction}`
  }
}

export const getCodeBlockPanelTransitionStyle = (): { transition: string } => {
  const { duration: transitionDuration, curve: transitionTimingFunction } =
    codeBlockPanelMotion.enter

  return {
    transition: `transform ${transitionDuration} ${transitionTimingFunction}, opacity ${transitionDuration} ${transitionTimingFunction}`
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

export const codeBlockEnterOffsetClasses = {
  right: 'translate-x-[var(--spacing-md)]',
  left: '-translate-x-[var(--spacing-md)]',
  none: 'translate-x-0'
} as const
