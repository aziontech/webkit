import { inject } from 'vue'

import type { TutorialContext } from '../injection-key'
import { TutorialPanelInjectionKey } from '../injection-key'

export function useTutorialPanelContext(): TutorialContext {
  const context = inject(TutorialPanelInjectionKey, null)

  if (!context) {
    throw new Error('TutorialPanel must be used within a TutorialPanel.Provider.')
  }

  return context
}

export function useOptionalTutorialPanelContext(): TutorialContext | null {
  return inject(TutorialPanelInjectionKey, null)
}
