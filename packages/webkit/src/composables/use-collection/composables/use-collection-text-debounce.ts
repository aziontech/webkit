import { onScopeDispose, watch } from 'vue'

import type { CollectionState } from '../lib/state'

export function useCollectionTextDebounce<T>(
  s: CollectionState<T>,
  debounce: number | undefined
): void {
  let textTimer: ReturnType<typeof setTimeout> | undefined
  watch(s.filteringText, (text) => {
    clearTimeout(textTimer)
    const wait = debounce ?? 300
    if (wait <= 0) s.debouncedText.value = text
    else textTimer = setTimeout(() => (s.debouncedText.value = text), wait)
  })
  onScopeDispose(() => clearTimeout(textTimer))
}
