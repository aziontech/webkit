import { inject } from 'vue'

import type { PromptInputContext } from '../injection-key'
import { PromptInputInjectionKey } from '../injection-key'

export function usePromptInputContext(): PromptInputContext {
  const context = inject(PromptInputInjectionKey, null)

  if (!context) {
    throw new Error('usePromptInputContext must be used within a PromptInput.')
  }

  return context
}
