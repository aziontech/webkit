/** Colour of a node's status tag. */
export type TopologyNodeSeverity = 'success' | 'info' | 'warning' | 'danger' | 'neutral'

/** One labelled value in the expanded body of a node. */
export interface TopologyNodeField {
  /** Field name, e.g. `ID` or `Domain`. */
  label: string
  /** Field value. */
  value: string
  /** Opens the value in a new tab when set. */
  href?: string
  /** Adds a copy button for the value. */
  copyable?: boolean
}

/** An existing resource a bindable node can be bound to. */
export interface TopologyBindOption {
  value: string
  label: string
}

/** One resource in the topology. A node without `name` is an unbound slot. */
export interface TopologyNode {
  /** Stable identity, used by `expanded` and the bind events. */
  key: string
  /** Resource kind shown in the header, e.g. `Policy`. */
  kind: string
  /** Icon class of the kind. */
  icon?: string
  /** Resource name. Empty renders the dashed, unbound slot. */
  name?: string
  /** Status tag label. Empty on an unbound node uses the locale catalog (`Not bound`). */
  status?: string
  /** Colour of the status tag. */
  severity?: TopologyNodeSeverity
  /** Dashed outline, for a staged change or an unbound slot. */
  dashed?: boolean
  /** One sentence in the expanded body. */
  message?: string
  /** Labelled values in the expanded body. */
  fields?: TopologyNodeField[]
  /** Links the name. */
  href?: string
  /** Ends the branch: the node gets an incoming connector and originates none. */
  terminal?: boolean
  /** Shows the bind control (bind, change, create). */
  bindable?: boolean
  /** Existing resources the bind control offers. */
  bindOptions?: TopologyBindOption[]
  /** The option the node is bound to; marks it selected in the menu. */
  boundValue?: string
  /** Shows the remove control on a bound, bindable node. */
  removable?: boolean
}

/** One column of the diagram: the nodes that sit at the same depth. */
export interface TopologyLevel {
  key: string
  /** Name of the column for assistive technology. */
  label?: string
  nodes: TopologyNode[]
}
