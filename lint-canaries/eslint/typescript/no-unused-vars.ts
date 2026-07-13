// CANARY — must keep failing @typescript-eslint/no-unused-vars.
// `computed` is imported and never used; `event` is an unused parameter
// without the `_` prefix that would mark it intentional.
import { computed, ref } from 'vue'

export function onSelect(event: MouseEvent, item: { label: string }) {
  return ref(item.label)
}
