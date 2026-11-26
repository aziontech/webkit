import { inject } from 'vue'

import { type ConsoleMockupContext, ConsoleMockupInjectionKey } from '../injection-key'

export function useConsoleMockupContext(): ConsoleMockupContext {
  const context = inject(ConsoleMockupInjectionKey, null)

  if (!context) {
    throw new Error('Product widget parts must be used within ConsoleMockup.')
  }

  return context
}
