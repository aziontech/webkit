import { inject } from 'vue'

import type { TutorialPanelTasksContext } from '../injection-key'
import { TutorialPanelTasksInjectionKey } from '../injection-key'

export function useTutorialPanelTasksContext(): TutorialPanelTasksContext {
  const context = inject(TutorialPanelTasksInjectionKey, null)

  if (!context) {
    throw new Error('useTutorialPanelTasksContext must be used within a TutorialPanel.')
  }

  return context
}
