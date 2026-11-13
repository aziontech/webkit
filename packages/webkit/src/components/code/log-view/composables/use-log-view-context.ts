import { inject } from 'vue'

import { type LogViewContext, LogViewInjectionKey } from '../injection-key'

export function useLogViewContext(): LogViewContext {
  const ctx = inject(LogViewInjectionKey, null)

  if (!ctx) {
    throw new Error('LogView sub-components must be used within LogView.')
  }

  return ctx
}
