import type { ComputedRef, InjectionKey } from 'vue'

import type { NodeDiagramAlign } from './types'

export interface NodeDiagramContext {
  /** Base data-testid of the diagram. */
  testId: ComputedRef<string>
  /** Vertical alignment of the steps. */
  align: ComputedRef<NodeDiagramAlign>
}

export const NodeDiagramInjectionKey: InjectionKey<NodeDiagramContext> = Symbol('NodeDiagram')
