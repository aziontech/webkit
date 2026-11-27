import { inject } from 'vue'

import type { KeyValueListContext } from '../injection-key'
import { KeyValueListInjectionKey } from '../injection-key'

export function useKeyValueListContext(): KeyValueListContext {
  const context = inject(KeyValueListInjectionKey, null)

  if (!context) {
    throw new Error('useKeyValueListContext must be used within a KeyValueList.')
  }

  return context
}
