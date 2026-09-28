import { inject } from 'vue'

import type { DocStepsContext } from '../injection-key'
import { DocStepsInjectionKey } from '../injection-key'

/**
 * Resolves the context a DocSteps root provides. Throws when used outside one,
 * so a stray step fails loudly instead of rendering unnumbered.
 */
export function useDocStepsContext(): DocStepsContext {
  const ctx = inject(DocStepsInjectionKey, null)

  if (!ctx) {
    throw new Error('useDocStepsContext must be used within DocSteps.')
  }

  return ctx
}
