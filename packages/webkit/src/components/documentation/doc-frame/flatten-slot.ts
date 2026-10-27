import type { VNode } from 'vue'
import { Comment, Fragment, Text } from 'vue'

export const flattenSlot = (children: readonly unknown[] = []): VNode[] => {
  const out: VNode[] = []
  for (const raw of children) {
    if (!raw) continue
    const child = raw as VNode
    if (child.type === Comment) continue
    if (child.type === Fragment) {
      out.push(...flattenSlot(Array.isArray(child.children) ? child.children : []))
      continue
    }
    if (child.type === Text && String(child.children).trim() === '') continue
    out.push(child)
  }
  return out
}
