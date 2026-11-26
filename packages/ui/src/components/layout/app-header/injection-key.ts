import type { InjectionKey } from 'vue'

export interface AppHeaderContext {
  testId: string
}

export const AppHeaderInjectionKey: InjectionKey<AppHeaderContext> = Symbol('AppHeader')
