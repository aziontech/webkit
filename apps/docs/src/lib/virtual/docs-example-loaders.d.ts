import type { Component } from 'vue'

import type { Highlighted } from '../types'

export type ExampleFiles = {
  components: Record<string, () => Promise<Component>>
  sources: Record<string, () => Promise<Highlighted>>
}

declare const loaders: Record<string, () => Promise<ExampleFiles>>
export default loaders
