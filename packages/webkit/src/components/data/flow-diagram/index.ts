import FlowDiagram from './flow-diagram.vue'
import FlowDiagramAnchor from './flow-diagram-anchor/flow-diagram-anchor.vue'
import FlowDiagramNode from './flow-diagram-node/flow-diagram-node.vue'
import FlowDiagramParallel from './flow-diagram-parallel/flow-diagram-parallel.vue'

type CompoundFlow = typeof FlowDiagram & {
  Node: typeof FlowDiagramNode
  Parallel: typeof FlowDiagramParallel
  Anchor: typeof FlowDiagramAnchor
}

const FlowDiagramRoot = Object.assign(FlowDiagram, {
  Node: FlowDiagramNode,
  Parallel: FlowDiagramParallel,
  Anchor: FlowDiagramAnchor
}) as CompoundFlow

export default FlowDiagramRoot
export { FlowDiagramAnchor, FlowDiagramNode, FlowDiagramParallel }
export type { FlowDiagramProps } from './flow-diagram.vue'
export type { FlowDiagramAnchorSide } from './flow-diagram-anchor/flow-diagram-anchor.vue'
export type { FlowDiagramAnchorProps } from './flow-diagram-anchor/flow-diagram-anchor.vue'
export type { FlowDiagramNodeProps } from './flow-diagram-node/flow-diagram-node.vue'
export type { FlowDiagramParallelAlign } from './flow-diagram-parallel/flow-diagram-parallel.vue'
export type { FlowDiagramParallelProps } from './flow-diagram-parallel/flow-diagram-parallel.vue'
export type { FlowDiagramAlign } from './injection-key'
