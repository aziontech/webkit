import { onMounted, onScopeDispose, readonly, type Ref, ref } from 'vue'

export function usePhoneWidth(): Readonly<Ref<boolean>> {
  const phone = ref(false)
  let media: MediaQueryList | null = null
  const onChange = () => {
    phone.value = Boolean(media?.matches)
  }
  onMounted(() => {
    media = globalThis.matchMedia?.('(max-width: 767px)') ?? null
    onChange()
    media?.addEventListener('change', onChange)
  })
  onScopeDispose(() => media?.removeEventListener('change', onChange))
  return readonly(phone)
}
