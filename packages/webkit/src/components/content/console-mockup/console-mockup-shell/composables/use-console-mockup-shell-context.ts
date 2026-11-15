import { inject } from 'vue'

import { type ConsoleMockupShellContext, ConsoleMockupShellInjectionKey } from '../injection-key'

export function useConsoleMockupShellContext(): ConsoleMockupShellContext {
  const context = inject(ConsoleMockupShellInjectionKey, null)

  if (!context) {
    throw new Error('useConsoleMockupShellContext must be used within ConsoleMockupShell.')
  }

  return context
}
