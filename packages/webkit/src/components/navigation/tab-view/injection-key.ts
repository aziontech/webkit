import type { InjectionKey, Ref } from 'vue'

import type { TabViewSlideDirection } from './presets/transitions'

export type TabViewValue = string | number

/** Visual variant: `default` slides a filled pill under the active tab; `underline` draws a bar under it on a hairline baseline. */
export type TabViewKind = 'default' | 'underline'

export interface TabViewTabRegistration {
  value: TabViewValue
  disabled: boolean
  el: Ref<HTMLElement | null>
}

export interface TabViewContext {
  testId: string
  baseId: string
  /** Visual variant set on the root and read by the list and every item. */
  kind: Readonly<Ref<TabViewKind>>
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
