import { Comment, Fragment, Text } from 'vue'

/**
 * Flatten a slot's vnodes into the real child components, unwrapping the
 * fragments Vue creates for `v-for` / template blocks and dropping comment
 * placeholders left by `v-if`.
 *
 * Both authoring paths land here: hand-written Vue (`<DocSteps><DocStep …>`)
 * and the MDX renderer (which builds the same vnodes), so a parent can always
 * read its children's props to number them or build a tab list.
 *
 * @param {unknown[]} children - the result of calling a slot function.
 * @returns {import('vue').VNode[]} the meaningful child vnodes, in order.
 */
export const flattenSlot = (children = []) => {
  const out = []
  for (const child of children) {
    if (!child || child.type === Comment) continue
    if (child.type === Fragment) {
      out.push(...flattenSlot(child.children || []))
      continue
    }
    if (child.type === Text && String(child.children).trim() === '') continue
    out.push(child)
  }
  return out
}
