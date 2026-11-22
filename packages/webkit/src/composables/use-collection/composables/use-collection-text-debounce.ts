import { onScopeDispose, watch } from 'vue'

import type { CollectionState } from '../lib/state'

export function useCollectionTextDebounce<T>(
  state: CollectionState<T>,
  debounce: number | undefined
): void {
  let textTimer: ReturnType<typeof setTimeout> | undefined
  watch(state.filteringText, (text) => {
    clearTimeout(textTimer)
    const wait = debounce ?? 300
    if (wait <= 0) state.debouncedText.value = text
    else textTimer = setTimeout(() => (state.debouncedText.value = text), wait)
  })
  onScopeDispose(() => clearTimeout(textTimer))
}
