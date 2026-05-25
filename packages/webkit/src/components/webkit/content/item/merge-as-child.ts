import {
  cloneVNode,
  Comment,
  Fragment,
  isVNode,
  mergeProps,
  type VNode,
  type VNodeArrayChildren
} from 'vue'

function resolveSingleChild(nodes: VNodeArrayChildren | undefined): VNode | null {
  if (!nodes) {
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
      const inner = resolveSingleChild(node.children as VNodeArrayChildren)

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
export function mergeAsChildSlot(
  attrs: Record<string, unknown>,
  defaultSlot: (() => VNode[]) | undefined
): VNode | null {
  const child = resolveSingleChild(defaultSlot?.())

  if (!child) {
    return null
  }

  return cloneVNode(child, mergeProps(attrs, child.props ?? {}))
}
