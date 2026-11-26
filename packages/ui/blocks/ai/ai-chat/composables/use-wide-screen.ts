import { onMounted, onScopeDispose, readonly, type Ref, ref } from 'vue'

export function useWideScreen(query = '(min-width: 48rem)'): Readonly<Ref<boolean>> {
  const wide = ref(false)
  let media: MediaQueryList | null = null
  const onChange = () => {
    wide.value = Boolean(media?.matches)
  }
  onMounted(() => {
    media = globalThis.matchMedia?.(query) ?? null
    onChange()
    media?.addEventListener('change', onChange)
  })
  onScopeDispose(() => media?.removeEventListener('change', onChange))
  return readonly(wide)
}
