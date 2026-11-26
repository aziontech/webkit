import {
  type MaybeRefOrGetter,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue
} from 'vue'

export interface UseMockupAnchorsOptions {
  observe?: boolean
}

export interface UseMockupAnchorsReturn {
  offsets: Readonly<Ref<readonly number[]>>
  measure: () => void
}

export function useMockupAnchors(
  column: MaybeRefOrGetter<globalThis.HTMLElement | null>,
  { observe = false }: UseMockupAnchorsOptions = {}
): UseMockupAnchorsReturn {
  const offsets = ref<number[]>([])
  let observer: globalThis.ResizeObserver | null = null

  const measure = () => {
    const anchors = toValue(column)?.querySelectorAll<globalThis.HTMLElement>('[data-anchor]')
    if (!anchors?.length) return
    offsets.value = [...anchors].map((anchor) => anchor.offsetTop)
  }

  onMounted(() => {
    const element = toValue(column)
    if (observe && element) {
      observer = new globalThis.ResizeObserver(measure)
      observer.observe(element)
    }
    measure()
  })

  onScopeDispose(() => observer?.disconnect())

  return { offsets: readonly(offsets), measure }
}
