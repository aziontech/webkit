import { inject } from 'vue'

import type { StepperContext } from '../injection-key'
import { StepperInjectionKey } from '../injection-key'

export function useStepperContext(): StepperContext {
  const context = inject(StepperInjectionKey, null)

  if (!context) {
    throw new Error('useStepperContext must be used within a Stepper.')
  }

  return context
}
