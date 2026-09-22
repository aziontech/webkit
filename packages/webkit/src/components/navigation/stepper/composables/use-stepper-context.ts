import { inject } from 'vue'

import type { StepperContext } from '../injection-key'
import { StepperInjectionKey } from '../injection-key'

/**
 * Resolves the context a Stepper root provides. Throws when used outside one, so a
 * stray step fails loudly instead of rendering unnumbered and unreachable.
 */
export function useStepperContext(): StepperContext {
  const context = inject(StepperInjectionKey, null)

  if (!context) {
    throw new Error('useStepperContext must be used within a Stepper.')
  }

  return context
}
