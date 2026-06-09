import {
  curve,
  duration
} from '../../../../../../theme/src/tokens/primitives/animations/animate.js'

/** Tab underline indicator — values read only from `animate.js`. */
export const codeEditorIndicatorMotion = {
  slide: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

/** Panel content slide — values read only from `animate.js`. */
export const codeEditorPanelMotion = {
  enter: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

/** Staggered line entrance for marketing / website use cases. */
export const codeEditorLineEnterMotion = {
  stagger: '300ms',
  offsetClass: '-translate-x-2',
  enter: { duration: duration['moderate-02'], curve: curve['productive-entrance'] }
} as const

export type CodeEditorSlideDirection = 'left' | 'right' | null

export const getCodeEditorIndicatorTransitionStyle = (): { transition: string } => {
  const { duration: transitionDuration, curve: transitionTimingFunction } =
    codeEditorIndicatorMotion.slide

  return {
    transition: `transform ${transitionDuration} ${transitionTimingFunction}, width ${transitionDuration} ${transitionTimingFunction}`
  }
}

export const getCodeEditorPanelTransitionStyle = (): { transition: string } => {
  const { duration: transitionDuration, curve: transitionTimingFunction } =
    codeEditorPanelMotion.enter

  return {
    transition: `transform ${transitionDuration} ${transitionTimingFunction}, opacity ${transitionDuration} ${transitionTimingFunction}`
  }
}

export const getCodeEditorLineTransitionStyle = (
  lineIndex: number
): { transition: string; transitionDelay: string } => {
  const { duration: transitionDuration, curve: transitionTimingFunction } =
    codeEditorLineEnterMotion.enter

  return {
    transition: `transform ${transitionDuration} ${transitionTimingFunction}, opacity ${transitionDuration} ${transitionTimingFunction}`,
    transitionDelay: `calc(${lineIndex} * ${codeEditorLineEnterMotion.stagger})`
  }
}

export const codeEditorEnterOffsetClasses = {
  right: 'translate-x-[var(--spacing-md)]',
  left: '-translate-x-[var(--spacing-md)]',
  none: 'translate-x-0'
} as const
