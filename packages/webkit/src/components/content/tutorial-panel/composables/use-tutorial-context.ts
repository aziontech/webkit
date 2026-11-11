import { inject } from 'vue'

import type { TutorialContext } from '../injection-key'
import { TutorialInjectionKey } from '../injection-key'

export function useTutorialContext(): TutorialContext {
  const context = inject(TutorialInjectionKey, null)

  if (!context) {
    throw new Error('TutorialPanel must be used within a TutorialPanel.Provider.')
  }

  return context
}

export function useOptionalTutorialContext(): TutorialContext | null {
  return inject(TutorialInjectionKey, null)
}
