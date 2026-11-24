import type { Component } from 'vue'

import type { GuidelinesDoc, Highlighted } from '../types'

export type BlockFiles = {
  components: Record<string, () => Promise<Component>>
  sources: Record<string, () => Promise<Highlighted>>
  manifest: () => Promise<Record<string, unknown>>
  guidelines: (() => Promise<GuidelinesDoc>) | undefined
}

declare const loaders: Record<string, () => Promise<BlockFiles>>
export default loaders
