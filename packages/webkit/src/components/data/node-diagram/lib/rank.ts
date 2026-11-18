import type { NodeDiagramEdgeData, NodeDiagramNodeData } from '../types'

export const rankColumns = (
  nodes: NodeDiagramNodeData[],
  edges: NodeDiagramEdgeData[]
): NodeDiagramNodeData[][] => {
  if (!edges.length) {
    return nodes.map((node) => [node])
  }
  const rank = new Map<string, number>(nodes.map((node) => [node.id, 0]))
  for (let pass = 0; pass < nodes.length; pass += 1) {
    let changed = false
    for (const edge of edges) {
      const from = rank.get(edge.from)
      const to = rank.get(edge.to)
      if (from === undefined || to === undefined || to > from) continue
      rank.set(edge.to, from + 1)
      changed = true
    }
    if (!changed) break
  }
  const columns: NodeDiagramNodeData[][] = []
  for (const node of nodes) {
    const index = rank.get(node.id) ?? 0
    columns[index] = [...(columns[index] ?? []), node]
  }
  return columns.filter((column) => column.length > 0)
}
