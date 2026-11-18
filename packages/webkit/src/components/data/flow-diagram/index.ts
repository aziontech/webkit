import FlowDiagram from './flow-diagram.vue'
import FlowDiagramAnchor from './flow-diagram-anchor/flow-diagram-anchor.vue'
import FlowDiagramDescription from './flow-diagram-description/flow-diagram-description.vue'
import FlowDiagramFooter from './flow-diagram-footer/flow-diagram-footer.vue'
import FlowDiagramGroup from './flow-diagram-group/flow-diagram-group.vue'
import FlowDiagramHeader from './flow-diagram-header/flow-diagram-header.vue'
import FlowDiagramItem from './flow-diagram-item/flow-diagram-item.vue'
import FlowDiagramNode from './flow-diagram-node/flow-diagram-node.vue'
import FlowDiagramTitle from './flow-diagram-title/flow-diagram-title.vue'

type CompoundFlowDiagram = typeof FlowDiagram & {
  Node: typeof FlowDiagramNode
  Group: typeof FlowDiagramGroup
  Anchor: typeof FlowDiagramAnchor
  Header: typeof FlowDiagramHeader
  Title: typeof FlowDiagramTitle
  Description: typeof FlowDiagramDescription
  Footer: typeof FlowDiagramFooter
  Item: typeof FlowDiagramItem
}

const FlowDiagramRoot = Object.assign(FlowDiagram, {
  Node: FlowDiagramNode,
  Group: FlowDiagramGroup,
  Anchor: FlowDiagramAnchor,
  Header: FlowDiagramHeader,
  Title: FlowDiagramTitle,
  Description: FlowDiagramDescription,
  Footer: FlowDiagramFooter,
  Item: FlowDiagramItem
}) as CompoundFlowDiagram

export default FlowDiagramRoot
export {
  FlowDiagramAnchor,
  FlowDiagramDescription,
  FlowDiagramFooter,
  FlowDiagramGroup,
  FlowDiagramHeader,
  FlowDiagramItem,
  FlowDiagramNode,
  FlowDiagramTitle
}
export type {
  FlowDiagramAlign,
  FlowDiagramBindOption,
  FlowDiagramEdgeData,
  FlowDiagramNodeData,
  FlowDiagramNodeField,
  FlowDiagramNodeMetric,
  FlowDiagramOrientation,
  FlowDiagramProps,
  FlowDiagramSeverity
} from './flow-diagram.vue'
export type {
  FlowDiagramAnchorProps,
  FlowDiagramAnchorSide
} from './flow-diagram-anchor/flow-diagram-anchor.vue'
export type { FlowDiagramBindProps } from './flow-diagram-bind/flow-diagram-bind.vue'
export type { FlowDiagramGroupProps } from './flow-diagram-group/flow-diagram-group.vue'
export type { FlowDiagramHeaderProps } from './flow-diagram-header/flow-diagram-header.vue'
export type { FlowDiagramItemProps } from './flow-diagram-item/flow-diagram-item.vue'
export type { FlowDiagramNodeProps } from './flow-diagram-node/flow-diagram-node.vue'
export type { FlowDiagramTitleProps } from './flow-diagram-title/flow-diagram-title.vue'
