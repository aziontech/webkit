import { useResizeObserver } from '@vueuse/core'
import {
  computed,
  type MaybeRefOrGetter,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue
} from 'vue'

export const breadcrumbCollapseWidth = 768

export function useBreadcrumbCollapse(
  target: MaybeRefOrGetter<globalThis.HTMLElement | null>
): Readonly<Ref<boolean>> {
  const width = ref<number | null>(null)
  let frame = 0

  const measure = () => {
    const el = toValue(target)
    if (el) width.value = el.getBoundingClientRect().width
  }

  onMounted(measure)

  useResizeObserver(
    () => toValue(target),
    () => {
      if (typeof globalThis.requestAnimationFrame !== 'function') return
      globalThis.cancelAnimationFrame(frame)
      frame = globalThis.requestAnimationFrame(measure)
    }
  )

  onScopeDispose(() => {
    if (typeof globalThis.cancelAnimationFrame === 'function') {
      globalThis.cancelAnimationFrame(frame)
    }
  })

  return readonly(computed(() => width.value !== null && width.value < breadcrumbCollapseWidth))
}
