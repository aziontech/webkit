import { inject } from 'vue'

import { type CommandContext, CommandInjectionKey } from '../injection-key'

export function useCommandMenuContext(): CommandContext {
  const ctx = inject(CommandInjectionKey)
  if (!ctx) {
    throw new Error('Command.* sub-components must be used inside <Command>.')
  }
  return ctx
}
