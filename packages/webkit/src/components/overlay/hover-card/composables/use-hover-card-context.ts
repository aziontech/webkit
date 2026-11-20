import { inject } from 'vue'

import { type HoverCardContext, HoverCardInjectionKey } from '../injection-key'

export function useHoverCardContext(): HoverCardContext {
  const ctx = inject(HoverCardInjectionKey)
  if (!ctx) throw new Error('HoverCard.* sub-components must be used inside <HoverCard>.')
  return ctx
}
