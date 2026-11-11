import { inject } from 'vue'

import type { ChatMessageContext } from '../injection-key'
import { ChatMessageInjectionKey } from '../injection-key'

export function useChatMessageContext(): ChatMessageContext {
  const context = inject(ChatMessageInjectionKey, null)

  if (!context) {
    throw new Error('useChatMessageContext must be used within a ChatMessage.')
  }

  return context
}
