import type { Severity } from '../../../utils/severity'

/** Colour of a node status or an edge. */
export type NodeDiagramSeverity = Severity

/** Vertical alignment of the steps in a horizontal diagram. */
export type NodeDiagramAlign = 'start' | 'center'

/** One figure in the footer of a node, such as a latency or a request rate. */
export interface NodeDiagramNodeMetric {
  /** Name of the figure, e.g. `p95`. */
  label: string
  /** Formatted value, e.g. `38 ms`. */
  value: string
}

/** One labelled value in the details of a node. */
export interface NodeDiagramNodeField {
  /** Field name, e.g. `ID`. */
  label: string
  /** Field value. */
  value: string
  /** Opens the value in a new tab when set. */
  href?: string
  /** Adds a copy button for the value. */
  copyable?: boolean
}

/** An existing resource a bindable node can be bound to. */
export interface NodeDiagramBindOption {
  /** Value emitted by the bind event. */
  value: string
  /** Text shown in the menu. */
  label: string
}

/** One node of a data-driven diagram. */
export interface NodeDiagramNodeData {
  /** Stable identity, used by edges, openKeys and the actions slot. */
  id: string
  /** Main text of the node, e.g. a resource name. Empty on a bindable node draws the unbound slot. */
  title?: string
  /** Short label above the title, e.g. the resource type. */
  eyebrow?: string
  /** Icon class shown before the eyebrow. */
  icon?: string
  /** Secondary line under the title, e.g. a location. */
  description?: string
  /** Links the title. */
  href?: string
  /** Status text shown with a coloured dot. */
  status?: string
  /** Colour of the status dot. */
  severity?: NodeDiagramSeverity
  /** Figures in the node footer. */
  metrics?: NodeDiagramNodeMetric[]
  /** One sentence in the details. */
  message?: string
  /** Labelled values in the details. */
  fields?: NodeDiagramNodeField[]
  /** Dashed outline, for a staged change or an unbound slot. */
  dashed?: boolean
  /** Dims the node and the connectors that touch it. */
  disabled?: boolean
  /** Ends the branch when no edges are given: the node receives a connector and sends none. */
  terminal?: boolean
  /** Marks a slot that holds one resource; the bind control reads the fields below. */
  bindable?: boolean
  /** Existing resources the bind control offers. */
  bindOptions?: NodeDiagramBindOption[]
  /** The option the node is bound to. */
  boundValue?: string
  /** Lets the bind control remove the binding. */
  removable?: boolean
}

/** One connector between two nodes. */
export interface NodeDiagramEdgeData {
  /** Id of the node the connector leaves. */
  from: string
  /** Id of the node the connector enters. */
  to: string
  /** Text on the connector, e.g. a latency. */
  label?: string
  /** Colour of the connector and its label. */
  severity?: NodeDiagramSeverity
}
