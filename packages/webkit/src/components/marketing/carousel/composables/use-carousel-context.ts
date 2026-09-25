import { inject } from 'vue'

import { type CarouselContext, CarouselInjectionKey } from '../injection-key'

export function useCarouselContext(): CarouselContext {
  const context = inject(CarouselInjectionKey, null)

  if (!context) {
    throw new Error('Carousel sub-components must be used within Carousel.')
  }

  return context
}
