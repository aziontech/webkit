import FlowRoot from './flow.vue'
import FlowAnchor from './flow-anchor/flow-anchor.vue'
import FlowNode from './flow-node/flow-node.vue'
import FlowParallel from './flow-parallel/flow-parallel.vue'

interface FlowStatic {
  Node: typeof FlowNode
  Parallel: typeof FlowParallel
  Anchor: typeof FlowAnchor
}

const Flow = FlowRoot as typeof FlowRoot & FlowStatic
Flow.Node = FlowNode
Flow.Parallel = FlowParallel
Flow.Anchor = FlowAnchor

export default Flow
export { FlowAnchor, FlowNode, FlowParallel }
