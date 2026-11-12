import { inject } from 'vue'

import { type ConsoleLayoutContext, ConsoleLayoutInjectionKey } from '../injection-key'

export type { ConsoleLayoutContext }

export function useConsoleLayout(): ConsoleLayoutContext {
  const ctx = inject(ConsoleLayoutInjectionKey, null)
  if (!ctx) throw new Error('useConsoleLayout must be used within <ConsoleLayout>.')
  return ctx
}
