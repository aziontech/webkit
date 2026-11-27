import { computed, type ComputedRef, onMounted, onScopeDispose, ref } from 'vue'

export function useNarrowViewport(query: string): ComputedRef<boolean> {
  const narrow = ref(false)
  const media = globalThis.matchMedia?.(query)
  const onChange = (event: MediaQueryListEvent) => {
    narrow.value = event.matches
  }
  onMounted(() => {
    if (!media) return
    narrow.value = media.matches
    media.addEventListener('change', onChange)
  })
  onScopeDispose(() => media?.removeEventListener('change', onChange))
  return computed(() => narrow.value)
}
