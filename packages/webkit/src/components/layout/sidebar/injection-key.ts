import type { InjectionKey } from 'vue'

export interface SidebarContext {
  testId: string
  /**
   * Whether the sidebar renders its own collapse trigger. When it does, the footer band — the
   * separator and the space above it — belongs to the sidebar's footer region so that the line
   * spans the trigger too, and `SidebarFooter` contributes neither.
   */
  collapsible?: boolean
}

export const SidebarInjectionKey: InjectionKey<SidebarContext> = Symbol('SidebarContext')
