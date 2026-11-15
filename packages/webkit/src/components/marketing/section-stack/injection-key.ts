import type { InjectionKey } from 'vue'

export interface SectionStackContext {
  /** The stack draws each band's rules, so a band frames its own cells and marks their corners. */
  framesCells: boolean
}

export const SectionStackInjectionKey: InjectionKey<SectionStackContext> = Symbol('SectionStack')
