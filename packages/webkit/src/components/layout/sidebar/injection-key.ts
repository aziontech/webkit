import type { InjectionKey } from 'vue'

export interface SidebarContext {
  testId: string
}

export const SidebarInjectionKey: InjectionKey<SidebarContext> = Symbol('SidebarContext')
