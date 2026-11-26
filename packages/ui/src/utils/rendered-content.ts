import type { VNode, VNodeArrayChildren } from 'vue'
import { Comment, Fragment, Text } from 'vue'

export function hasRenderedContent(nodes: VNodeArrayChildren): boolean {
  return nodes.some((node) => {
    if (Array.isArray(node)) return hasRenderedContent(node)
    if (typeof node === 'string' || typeof node === 'number') return String(node).trim() !== ''
    if (typeof node !== 'object' || node === null) return false
    const vnode = node as VNode
    if (vnode.type === Comment) return false
    if (vnode.type === Text) return String(vnode.children ?? '').trim() !== ''
    if (vnode.type === Fragment)
      return hasRenderedContent((vnode.children ?? []) as VNodeArrayChildren)
    return true
  })
}

export function countRenderedNodes(nodes: VNodeArrayChildren): number {
  return nodes.reduce<number>((total, node) => {
    if (Array.isArray(node)) return total + countRenderedNodes(node)
    if (typeof node === 'object' && node !== null && (node as VNode).type === Fragment)
      return total + countRenderedNodes(((node as VNode).children ?? []) as VNodeArrayChildren)
    return total + (hasRenderedContent([node]) ? 1 : 0)
  }, 0)
}
