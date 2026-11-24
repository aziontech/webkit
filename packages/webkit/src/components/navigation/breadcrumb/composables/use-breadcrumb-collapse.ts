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

const breadcrumbCollapseWidth = 768
const breadcrumbCompactWidth = 360

export interface UseBreadcrumbCollapseReturn {
  /** The box is narrower than 768px: the middle segments fold into the overflow menu. */
  collapsed: Readonly<Ref<boolean>>
  /** The box is narrower than 360px: every ancestor folds into the overflow menu. */
  compact: Readonly<Ref<boolean>>
}

export function useBreadcrumbCollapse(
  target: MaybeRefOrGetter<globalThis.HTMLElement | null>
): UseBreadcrumbCollapseReturn {
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

  const below = (limit: number) =>
    readonly(computed(() => width.value !== null && width.value < limit))

  return { collapsed: below(breadcrumbCollapseWidth), compact: below(breadcrumbCompactWidth) }
}
