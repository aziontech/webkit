import { inject } from 'vue'

import type { KeyValuePairsContext } from '../injection-key'
import { KeyValuePairsInjectionKey } from '../injection-key'

export function useKeyValuePairsContext(): KeyValuePairsContext {
  const context = inject(KeyValuePairsInjectionKey, null)

  if (!context) {
    throw new Error('useKeyValuePairsContext must be used within a KeyValuePairs.')
  }

  return context
}
