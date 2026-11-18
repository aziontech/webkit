import NodeDiagram from './node-diagram.vue'
import NodeDiagramAnchor from './node-diagram-anchor/node-diagram-anchor.vue'
import NodeDiagramDescription from './node-diagram-description/node-diagram-description.vue'
import NodeDiagramFooter from './node-diagram-footer/node-diagram-footer.vue'
import NodeDiagramGroup from './node-diagram-group/node-diagram-group.vue'
import NodeDiagramHeader from './node-diagram-header/node-diagram-header.vue'
import NodeDiagramItem from './node-diagram-item/node-diagram-item.vue'
import NodeDiagramNode from './node-diagram-node/node-diagram-node.vue'
import NodeDiagramTitle from './node-diagram-title/node-diagram-title.vue'

type CompoundNodeDiagram = typeof NodeDiagram & {
  Node: typeof NodeDiagramNode
  Group: typeof NodeDiagramGroup
  Anchor: typeof NodeDiagramAnchor
  Header: typeof NodeDiagramHeader
  Title: typeof NodeDiagramTitle
  Description: typeof NodeDiagramDescription
  Footer: typeof NodeDiagramFooter
  Item: typeof NodeDiagramItem
}

const NodeDiagramRoot = Object.assign(NodeDiagram, {
  Node: NodeDiagramNode,
  Group: NodeDiagramGroup,
  Anchor: NodeDiagramAnchor,
  Header: NodeDiagramHeader,
  Title: NodeDiagramTitle,
  Description: NodeDiagramDescription,
  Footer: NodeDiagramFooter,
  Item: NodeDiagramItem
}) as CompoundNodeDiagram

export default NodeDiagramRoot
export {
  NodeDiagramAnchor,
  NodeDiagramDescription,
  NodeDiagramFooter,
  NodeDiagramGroup,
  NodeDiagramHeader,
  NodeDiagramItem,
  NodeDiagramNode,
  NodeDiagramTitle
}
export type {
  NodeDiagramAlign,
  NodeDiagramBindOption,
  NodeDiagramEdgeData,
  NodeDiagramNodeData,
  NodeDiagramNodeField,
  NodeDiagramNodeMetric,
  NodeDiagramOrientation,
  NodeDiagramProps,
  NodeDiagramSeverity
} from './node-diagram.vue'
export type {
  NodeDiagramAnchorProps,
  NodeDiagramAnchorSide
} from './node-diagram-anchor/node-diagram-anchor.vue'
export type { NodeDiagramGroupProps } from './node-diagram-group/node-diagram-group.vue'
export type { NodeDiagramHeaderProps } from './node-diagram-header/node-diagram-header.vue'
export type { NodeDiagramItemProps } from './node-diagram-item/node-diagram-item.vue'
export type { NodeDiagramNodeProps } from './node-diagram-node/node-diagram-node.vue'
export type { NodeDiagramTitleProps } from './node-diagram-title/node-diagram-title.vue'
