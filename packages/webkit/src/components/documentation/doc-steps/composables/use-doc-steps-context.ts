import { inject } from 'vue'

import type { DocStepsContext } from '../injection-key'
import { DocStepsInjectionKey } from '../injection-key'

export function useDocStepsContext(): DocStepsContext {
  const ctx = inject(DocStepsInjectionKey, null)

  if (!ctx) {
    throw new Error('useDocStepsContext must be used within DocSteps.')
  }

  return ctx
}
