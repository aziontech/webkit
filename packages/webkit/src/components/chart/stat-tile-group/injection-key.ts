import type { InjectionKey, Ref } from 'vue'

export interface StatTileGroupContext {
  grouped: true
  /** How many tiles in the group draw a band; above zero every tile keeps its band row. */
  bands: Readonly<Ref<number>>
  /** Counts one tile's band; the returned function stops counting it. */
  showBand: () => () => void
}

export const StatTileGroupInjectionKey: InjectionKey<StatTileGroupContext> = Symbol('StatTileGroup')
