import Flow from './flow.vue'
import FlowAnchor from './flow-anchor/flow-anchor.vue'
import FlowNode from './flow-node/flow-node.vue'
import FlowParallel from './flow-parallel/flow-parallel.vue'

type CompoundFlow = typeof Flow & {
  Node: typeof FlowNode
  Parallel: typeof FlowParallel
  Anchor: typeof FlowAnchor
}

const FlowRoot = Object.assign(Flow, {
  Node: FlowNode,
  Parallel: FlowParallel,
  Anchor: FlowAnchor
}) as CompoundFlow

export default FlowRoot
export { FlowAnchor, FlowNode, FlowParallel }
export type { FlowProps } from './flow.vue'
export type { FlowAnchorSide } from './flow-anchor/flow-anchor.vue'
export type { FlowAnchorProps } from './flow-anchor/flow-anchor.vue'
export type { FlowNodeProps } from './flow-node/flow-node.vue'
export type { FlowParallelAlign } from './flow-parallel/flow-parallel.vue'
export type { FlowParallelProps } from './flow-parallel/flow-parallel.vue'
export type { FlowAlign } from './injection-key'
