import { inject } from 'vue'

import { type ProductWidgetContext, ProductWidgetInjectionKey } from '../injection-key'

export function useProductWidgetContext(): ProductWidgetContext {
  const context = inject(ProductWidgetInjectionKey, null)

  if (!context) {
    throw new Error('Product widget parts must be used within ProductWidget.')
  }

  return context
}
