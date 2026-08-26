import type { VNode } from 'vue'
import { Comment, Fragment, Text } from 'vue'

/**
 * Flatten a slot's vnodes into the real child components, unwrapping the
 * fragments Vue creates for v-for / template blocks and dropping comment
 * placeholders left by v-if.
 *
 * Both authoring paths land here: hand-written Vue (a DocSteps parent wrapping
 * its DocStep children) and an MDX renderer building the same vnodes, so a
 * parent can always read its children's props to number them or build a tab
 * list.
 *
 * @param children - the result of calling a slot function.
 * @returns the meaningful child vnodes, in order.
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
