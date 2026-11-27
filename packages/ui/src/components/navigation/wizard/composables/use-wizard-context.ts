import { inject } from 'vue'

import type { WizardContext } from '../injection-key'
import { WizardInjectionKey } from '../injection-key'

export function useWizardContext(): WizardContext {
  const context = inject(WizardInjectionKey, null)

  if (!context) {
    throw new Error('useWizardContext must be used within a Wizard.')
  }

  return context
}
