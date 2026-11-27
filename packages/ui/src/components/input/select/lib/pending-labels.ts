import { Comment, Fragment, isVNode, type VNode, type VNodeArrayChildren } from 'vue'

const pickPending = (nodes: VNodeArrayChildren, isSelected: (value: unknown) => boolean): VNode[] =>
  nodes.flatMap((node): VNode[] => {
    if (Array.isArray(node)) return pickPending(node, isSelected)
    if (!isVNode(node) || node.type === Comment) return []
    if (node.type === Fragment && Array.isArray(node.children)) {
      return pickPending(node.children as VNodeArrayChildren, isSelected)
    }
    const props = node.props as Record<string, unknown> | null
    if (props && 'value' in props) return isSelected(props['value']) ? [node] : []
    return [node]
  })

export const pendingLabelNodes = (
  content: unknown,
  isSelected: (value: unknown) => boolean
): VNode[] => pickPending((content ?? []) as VNodeArrayChildren, isSelected)
