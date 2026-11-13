import type { Slot, VNode, VNodeArrayChildren, VNodeNormalizedChildren } from 'vue'
import { cloneVNode, Comment, Fragment, isVNode, mergeProps } from 'vue'

function resolveSingleChild(
  nodes: VNodeArrayChildren | VNodeNormalizedChildren | undefined
): VNode | null {
  if (!Array.isArray(nodes)) {
    return null
  }
  let resolved: VNode | null = null
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

export function mergeAsChildSlot(
  attrs: Record<string, unknown>,
  defaultSlot: Slot | undefined
): VNode | null {
  const child = resolveSingleChild(defaultSlot?.())
  if (!child) {
    return null
  }
  return cloneVNode(child, mergeProps(attrs, child.props ?? {}))
}
