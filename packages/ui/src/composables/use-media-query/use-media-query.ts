import {
  getCurrentInstance,
  getCurrentScope,
  type MaybeRefOrGetter,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

export function useMediaQuery(
  query: MaybeRefOrGetter<string>,
  serverValue = false
): Readonly<Ref<boolean>> {
  const matches = ref(serverValue)
  let media: MediaQueryList | null = null

  const onChange = (event: MediaQueryListEvent) => {
    matches.value = event.matches
  }

  const stop = () => {
    media?.removeEventListener('change', onChange)
    media = null
  }

  const start = () => {
    stop()
    if (typeof globalThis.matchMedia !== 'function') return
    media = globalThis.matchMedia(toValue(query))
    matches.value = media.matches
    media.addEventListener('change', onChange)
  }

  let ready = false
  const begin = () => {
    ready = true
    start()
  }

  watch(
    () => toValue(query),
    () => {
      if (ready) start()
    }
  )
  if (getCurrentInstance()) onMounted(begin)
  else begin()
  if (getCurrentScope()) onScopeDispose(stop)

  return readonly(matches)
}
