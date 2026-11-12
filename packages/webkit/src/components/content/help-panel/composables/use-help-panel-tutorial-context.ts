import { inject } from 'vue'

import type { HelpPanelTutorialContext } from '../injection-key'
import { HelpPanelTutorialInjectionKey } from '../injection-key'

export function useHelpPanelTutorialContext(): HelpPanelTutorialContext {
  const context = inject(HelpPanelTutorialInjectionKey, null)

  if (!context) {
    throw new Error('useHelpPanelTutorialContext must be used within a HelpPanel.Tutorial.')
  }

  return context
}
