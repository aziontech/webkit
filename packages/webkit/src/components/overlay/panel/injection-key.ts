import type { InjectionKey } from 'vue'

export interface PanelContext {
  testId: string
}

export const PanelInjectionKey: InjectionKey<PanelContext> = Symbol('PanelContext')

export type PanelSize = 'small' | 'medium' | 'large'
