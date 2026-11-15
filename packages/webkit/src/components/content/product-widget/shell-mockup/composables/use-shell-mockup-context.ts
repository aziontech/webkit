import { inject } from 'vue'

import { type ShellMockupContext, ShellMockupInjectionKey } from '../injection-key'

export function useShellMockupContext(): ShellMockupContext {
  const context = inject(ShellMockupInjectionKey, null)

  if (!context) {
    throw new Error('useShellMockupContext must be used within ShellMockup.')
  }

  return context
}
