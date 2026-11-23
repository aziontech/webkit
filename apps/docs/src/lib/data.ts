import index from 'virtual:docs-index'

export * from './route-data'
export { index }

export function findBlock(id: string) {
  return index.blocks.find((block) => block.id === id)
}
