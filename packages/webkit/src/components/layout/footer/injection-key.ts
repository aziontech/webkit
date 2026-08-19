import type { InjectionKey } from 'vue'

export interface FooterContext {
  testId: string
}

export const FooterInjectionKey: InjectionKey<FooterContext> = Symbol('FooterContext')
