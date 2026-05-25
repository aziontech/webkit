import type { InjectionKey, Ref } from 'vue'

import type { TabViewSlideDirection } from './presets/transitions'

export type TabViewValue = string | number

export interface TabViewTabRegistration {
  value: TabViewValue
  disabled: boolean
  el: Ref<HTMLElement | null>
}

export interface TabViewContext {
  testId: string
  baseId: string
  value: Ref<TabViewValue | null>
  /** Last horizontal slide direction when the active tab changed. */
  slideDirection: Ref<TabViewSlideDirection>
  setValue: (next: TabViewValue | null) => void
  registerTab: (registration: TabViewTabRegistration) => void
  unregisterTab: (value: TabViewValue) => void
  tabs: Ref<TabViewTabRegistration[]>
  focusTab: (value: TabViewValue) => void
  onListKeydown: (event: globalThis.KeyboardEvent) => void
  tabId: (value: TabViewValue) => string
  panelId: (value: TabViewValue) => string
}

export const TabViewInjectionKey: InjectionKey<TabViewContext> = Symbol('TabViewContext')
