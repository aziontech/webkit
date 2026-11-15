import type { ComputedRef, InjectionKey } from 'vue'

export type FlowDiagramAlign = 'start' | 'center'

export interface FlowDiagramContext {
  /** Base data-testid for BEM-derived sub-component ids. */
  testId: ComputedRef<string>
  /** Vertical alignment of nodes within the diagram. */
  align: ComputedRef<FlowDiagramAlign>
}

export const FlowDiagramInjectionKey: InjectionKey<FlowDiagramContext> = Symbol('FlowDiagram')
