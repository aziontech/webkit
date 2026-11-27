import type { ComputedRef, InjectionKey } from 'vue'

import type { FlowDiagramAlign } from './types'

export interface FlowDiagramContext {
  /** Base data-testid of the diagram. */
  testId: ComputedRef<string>
  /** Vertical alignment of the steps. */
  align: ComputedRef<FlowDiagramAlign>
}

export const FlowDiagramInjectionKey: InjectionKey<FlowDiagramContext> = Symbol('FlowDiagram')
