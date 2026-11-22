import { onScopeDispose, readonly, type Ref, ref, watch, type WatchSource } from 'vue'

export const RELOAD_MS = 600

export function useReloadFlag<T>(
  source: WatchSource<T>,
  shouldReload: (next: T, previous: T | undefined) => boolean = () => true
): Readonly<Ref<boolean>> {
  const reloading = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(source, (next, previous) => {
    if (!shouldReload(next, previous)) return
    clearTimeout(timer)
    reloading.value = true
    timer = setTimeout(() => {
      reloading.value = false
    }, RELOAD_MS)
  })

  onScopeDispose(() => clearTimeout(timer))

  return readonly(reloading)
}
