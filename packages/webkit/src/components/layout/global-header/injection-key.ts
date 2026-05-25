import type { InjectionKey } from 'vue'

export interface GlobalHeaderContext {
  testId: string
}

export const GlobalHeaderInjectionKey: InjectionKey<GlobalHeaderContext> =
  Symbol('GlobalHeaderContext')
