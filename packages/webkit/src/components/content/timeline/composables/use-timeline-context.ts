import { inject } from 'vue'

import type { TimelineContext } from '../injection-key'
import { TimelineInjectionKey } from '../injection-key'

export function useTimelineContext(): TimelineContext {
  const context = inject(TimelineInjectionKey, null)

  if (!context) {
    throw new Error('useTimelineContext must be used within a Timeline.')
  }

  return context
}
