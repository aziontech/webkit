import type { InjectionKey } from 'vue'

export interface BandStackContext {
  /** The stack draws each band's rules, so a band frames its own cells and marks their corners. */
  framesCells: boolean
}

export const BandStackInjectionKey: InjectionKey<BandStackContext> = Symbol('BandStack')
