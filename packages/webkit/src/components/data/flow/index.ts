// Compound API (see .claude/rules/compound-api.md). The explicit CompoundFlow
// annotation makes declaration emit reference the sub-component types instead
// of expanding the root's private Props.
import Flow from './flow.vue'
import FlowAnchor from './flow-anchor/flow-anchor.vue'
import FlowNode from './flow-node/flow-node.vue'
import FlowNodeCard from './flow-node-card/flow-node-card.vue'
import FlowParallel from './flow-parallel/flow-parallel.vue'

type CompoundFlow = typeof Flow & {
  Node: typeof FlowNode
  NodeCard: typeof FlowNodeCard
  Parallel: typeof FlowParallel
  Anchor: typeof FlowAnchor
}

const FlowRoot = Object.assign(Flow, {
  Node: FlowNode,
  NodeCard: FlowNodeCard,
  Parallel: FlowParallel,
  Anchor: FlowAnchor
}) as CompoundFlow

export default FlowRoot
export { FlowAnchor, FlowNode, FlowNodeCard, FlowParallel }
