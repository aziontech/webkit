/**
 * Compound API — each sub-component stays available as its own import
 * (`@aziontech/webkit/flow-node`, ...) and is also attached to the root for
 * dot-notation usage: `<Flow.Node>`, `<Flow.Parallel>`, `<Flow.Anchor>`.
 *
 * This is a `.ts` file so vue-tsc generates the adjacent `index.d.ts`, giving
 * `<Flow.Node>` full type-checking. `Object.assign` keeps one source of truth;
 * the explicit `CompoundFlow` annotation lets declaration emit reference the
 * sub-component types instead of expanding the root's private `Props`.
 * See `.claude/rules/compound-api.md`.
 */
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
