export interface GraphChunk {
  file: string
  editor: boolean
  foreignModules: string[]
  imports: string[]
  dynamicImports: string[]
}
export interface Graph {
  version: number
  chunks: GraphChunk[]
}
export interface PageEntry {
  route: string
  seeds: string[]
}
export function indexGraph(graph: Graph): Map<string, GraphChunk>
export function staticClosure(byFile: Map<string, GraphChunk>, seeds: Iterable<string>): Set<string>
export function pageSeeds(html: string): string[]
export function findEditorLeaks(graph: Graph, pages: PageEntry[]): string[]
