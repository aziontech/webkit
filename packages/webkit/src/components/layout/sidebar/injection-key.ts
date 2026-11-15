import type { Component, InjectionKey } from 'vue'

export interface SidebarContext {
  testId: string
  collapsible?: boolean
  /** Whether the sidebar is collapsed to its icon rail. */
  readonly rail?: boolean
  /** Side a rail row opens its label tooltip on, the inline end of the sidebar. */
  readonly tooltipPlacement?: 'left' | 'right'
  /** Tooltip component a rail row wraps itself in, handed down so a menu does not bundle its own. */
  readonly tooltip?: Component
  /** Brings a collapsed sidebar back to its sized width. */
  expand?: () => void
}

export const SidebarInjectionKey: InjectionKey<SidebarContext> = Symbol('Sidebar')
