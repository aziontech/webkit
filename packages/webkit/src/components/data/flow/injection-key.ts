import type { ComputedRef, InjectionKey } from 'vue'

export type FlowAlign = 'start' | 'center'

export interface FlowContext {
  /** Base data-testid for BEM-derived sub-component ids. */
  testId: ComputedRef<string>
  /** Vertical alignment of nodes within the diagram. */
  align: ComputedRef<FlowAlign>
}

export const FlowInjectionKey: InjectionKey<FlowContext> = Symbol('FlowContext')
