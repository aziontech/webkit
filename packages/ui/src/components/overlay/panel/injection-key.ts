import type { Component, InjectionKey, Ref } from 'vue'

export interface PanelContext {
  testId: string
}

export const PanelInjectionKey: InjectionKey<PanelContext> = Symbol('Panel')

export type PanelSize = 'small' | 'medium' | 'large'

export interface PanelHeaderEndContext {
  /** Test id of the Panel whose header gets the element; nested panels are skipped. */
  panelTestId: string
  /** Rendered after the header slot, or nothing when it resolves to null. */
  component: Readonly<Ref<Component | null>>
}

export const PanelHeaderEndInjectionKey: InjectionKey<PanelHeaderEndContext> =
  Symbol('PanelHeaderEnd')
