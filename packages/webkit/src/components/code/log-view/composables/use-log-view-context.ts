import { inject } from 'vue'

import { LogViewInjectionKey } from '../injection-key'

export function useLogViewContext() {
  const ctx = inject(LogViewInjectionKey)

  if (!ctx) {
    throw new Error('LogView sub-components must be used within LogView.')
  }

  return ctx
}
