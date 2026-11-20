import type { InjectionKey } from 'vue'

export interface StatTileGroupContext {
  grouped: true
}

export const StatTileGroupInjectionKey: InjectionKey<StatTileGroupContext> = Symbol('StatTileGroup')
