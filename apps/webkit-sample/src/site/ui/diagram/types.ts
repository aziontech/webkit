/** How a leaf of the diagram is drawn. */
export type DiagramNodeKind = 'card' | 'pill' | 'tile' | 'app'

/** A leaf the edges can attach to. */
export interface DiagramNode {
  /** Id the layout and the edges refer to. */
  key: string
  /** How the leaf is drawn. */
  kind: DiagramNodeKind
  /** Main text of the leaf. */
  title: string
  /** Secondary line, set in the code face. */
  subtitle?: string
  /** Icon class drawn in the leaf's icon box. */
  icon?: string
  /** Full-colour brand mark, drawn as an image. */
  logo?: string
  /** Single-ink brand mark, drawn in the current text colour. */
  mark?: string
  /** Marks the leaf as part of the highlighted path. */
  active?: boolean
}

/** Cross axis alignment of a row in the wide layout. */
export type DiagramRowAlign = 'start' | 'center'

/** Space between the items of a row in the wide layout; wide leaves room for edge labels. */
export type DiagramRowGap = 'default' | 'wide'

/** Border style of a group. */
export type DiagramGroupKind = 'solid' | 'dashed'

/** One node of the layout tree. */
export type DiagramLayoutItem =
  | { node: string }
  | { row: DiagramLayoutItem[]; align?: DiagramRowAlign; gap?: DiagramRowGap }
  | { branches: DiagramLayoutItem[] }
  | { grid: DiagramLayoutItem[]; columns?: 2 | 3 }
  | { group: string; label: string; kind?: DiagramGroupKind; content: DiagramLayoutItem }

/** A connector between two nodes or groups. */
export interface DiagramEdge {
  /** Key of the node or group the connector leaves. */
  from: string
  /** Key of the node or group the connector reaches. */
  to: string
  /** Short chip drawn on the connector. */
  label?: string
  /** Draws the connector as part of the highlighted path. */
  active?: boolean
}

/** Everything a diagram draws. */
export interface DiagramSpec {
  /** The leaves. */
  nodes: DiagramNode[]
  /** How the leaves are arranged. */
  layout: DiagramLayoutItem
  /** The connectors. */
  edges: DiagramEdge[]
}
