import type { InjectionKey } from 'vue'

export interface SidebarContext {
  testId: string
  collapsible?: boolean
}

export const SidebarInjectionKey: InjectionKey<SidebarContext> = Symbol('SidebarContext')
