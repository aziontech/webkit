import { inject } from 'vue'

import { type ShellMockupContext, ShellMockupKey } from '../injection-key'

export function useShellMockupContext(): ShellMockupContext {
  const context = inject(ShellMockupKey, null)
  if (!context) throw new Error('useShellMockupContext must be used within ShellMockup.')
  return context
}
