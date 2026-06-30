import type { InjectionKey } from 'vue'

export type FlowAlign = 'start' | 'center'

export interface FlowContext {
  /** Base data-testid for BEM-derived sub-component ids. */
  testId: string
  /** Vertical alignment of nodes within the diagram. */
  align: FlowAlign
}

export const FlowInjectionKey: InjectionKey<FlowContext> = Symbol('FlowContext')
