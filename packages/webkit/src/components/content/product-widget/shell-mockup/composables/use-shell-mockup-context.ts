import { inject } from 'vue'

import { SHELL_MOCKUP_KEY, type ShellMockupContext } from '../injection-key'

export function useShellMockupContext(): ShellMockupContext {
  const context = inject(SHELL_MOCKUP_KEY, null)

  if (!context) {
    throw new Error('useShellMockupContext must be used within ShellMockup.')
  }

  return context
}
