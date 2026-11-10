import type { InjectionKey, Ref } from 'vue'

import type { TabsSlideDirection } from './presets/transitions'

export type TabsValue = string | number

export interface TabsTabRegistration {
  value: TabsValue
  disabled: boolean
  el: Ref<HTMLElement | null>
}

export interface TabsContext {
  testId: string
  baseId: string
  value: Ref<TabsValue | null>
  /** Last horizontal slide direction when the active tab changed. */
  slideDirection: Ref<TabsSlideDirection>
  setValue: (next: TabsValue | null) => void
  registerTab: (registration: TabsTabRegistration) => void
  unregisterTab: (value: TabsValue) => void
  tabs: Ref<TabsTabRegistration[]>
  focusTab: (value: TabsValue) => void
  onListKeydown: (event: globalThis.KeyboardEvent) => void
  tabId: (value: TabsValue) => string
  panelId: (value: TabsValue) => string
}

export const TabsInjectionKey: InjectionKey<TabsContext> = Symbol('TabsContext')
