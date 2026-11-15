import { inject } from 'vue'

import type { TutorialTasksContext } from '../injection-key'
import { TutorialTasksInjectionKey } from '../injection-key'

export function useTutorialTasksContext(): TutorialTasksContext {
  const context = inject(TutorialTasksInjectionKey, null)

  if (!context) {
    throw new Error('useTutorialTasksContext must be used within a TutorialPanel.')
  }

  return context
}
