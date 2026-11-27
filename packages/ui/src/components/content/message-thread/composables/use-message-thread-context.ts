import { inject } from 'vue'

import type { MessageThreadContext } from '../injection-key'
import { MessageThreadInjectionKey } from '../injection-key'

export function useMessageThreadContext(): MessageThreadContext {
  const context = inject(MessageThreadInjectionKey, null)

  if (!context) {
    throw new Error('useMessageThreadContext must be used within a MessageThread.')
  }

  return context
}
