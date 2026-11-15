import { inject } from 'vue'

import type { TutorialPanelContext } from '../injection-key'
import { TutorialPanelInjectionKey } from '../injection-key'

export function useTutorialPanelContext(): TutorialPanelContext {
  const context = inject(TutorialPanelInjectionKey, null)

  if (!context) {
    throw new Error('TutorialPanel must be used within a TutorialPanel.Provider.')
  }

  return context
}

export function useOptionalTutorialPanelContext(): TutorialPanelContext | null {
  return inject(TutorialPanelInjectionKey, null)
}
