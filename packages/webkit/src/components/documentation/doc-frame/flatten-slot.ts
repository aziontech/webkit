import type { VNode } from 'vue'
import { Comment, Fragment, Text } from 'vue'

/**
 * Flatten a slot's vnodes to the real children: unwraps v-for / template
 * fragments and drops v-if comment placeholders. Hand-written Vue and the MDX
 * renderer both land here, so a parent can always read its children's props.
 */
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
