import { cloneVNode, Comment, Fragment, isVNode, mergeProps } from 'vue'

function resolveSingleChild(nodes) {
  if (!nodes) {
    return null
  }
  let resolved = null
  for (const node of nodes) {
    if (!isVNode(node)) {
      continue
    }
    if (node.type === Comment) {
      continue
    }
    if (node.type === Fragment) {
      const inner = resolveSingleChild(node.children)
      if (!inner) {
        continue
      }
      if (resolved) {
        return null
      }
      resolved = inner
      continue
    }
    if (resolved) {
      return null
    }
    resolved = node
  }
  return resolved
}
/** Merge `attrs` onto the single default-slot vnode (as-child pattern). */
export function mergeAsChildSlot(attrs, defaultSlot) {
  const child = resolveSingleChild(defaultSlot?.())
  if (!child) {
    return null
  }
  return cloneVNode(child, mergeProps(attrs, child.props ?? {}))
}
