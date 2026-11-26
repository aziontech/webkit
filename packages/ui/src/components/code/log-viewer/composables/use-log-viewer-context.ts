import { inject } from 'vue'

import { type LogViewerContext, LogViewerInjectionKey } from '../injection-key'

export function useLogViewerContext(): LogViewerContext {
  const ctx = inject(LogViewerInjectionKey, null)

  if (!ctx) {
    throw new Error('LogViewer sub-components must be used within LogViewer.')
  }

  return ctx
}
