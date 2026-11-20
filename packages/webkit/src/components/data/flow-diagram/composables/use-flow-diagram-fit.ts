import { useResizeObserver } from '@vueuse/core'
import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  onMounted,
  onScopeDispose,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

export type FlowDiagramDirection = 'row' | 'column'

export interface UseFlowDiagramFitReturn {
  /** The direction the steps are laid out in. */
  direction: ComputedRef<FlowDiagramDirection>
  /** Content is scrolled past the inline start. */
  overflowStart: ComputedRef<boolean>
  /** Content continues past the inline end. */
  overflowEnd: ComputedRef<boolean>
  /** Re-reads the overflow edges; bind it to the scroll event. */
  measureEdges: () => void
}

const overflows = (el: HTMLElement): boolean => el.scrollWidth > el.clientWidth + 1

export const useFlowDiagramFit = (
  scrollEl: Ref<HTMLElement | null>,
  listEl: Ref<HTMLElement | null>,
  orientation: MaybeRefOrGetter<'horizontal' | 'vertical' | 'responsive'>
): UseFlowDiagramFitReturn => {
  const fixed = (): FlowDiagramDirection | null =>
    (({ horizontal: 'row', vertical: 'column', responsive: null }) as const)[toValue(orientation)]

  const direction = ref<FlowDiagramDirection>(fixed() ?? 'column')
  const overflowStart = ref<boolean>(false)
  const overflowEnd = ref<boolean>(false)

  const measureEdges = (): void => {
    const el = scrollEl.value
    if (!el) return
    const offset = Math.abs(el.scrollLeft)
    overflowStart.value = offset > 1
    overflowEnd.value = el.scrollWidth - el.clientWidth - offset > 1
  }

  const fit = (): void => {
    const el = scrollEl.value
    const list = listEl.value
    if (!el || !list) return
    let next = fixed()
    if (!next) {
      list.setAttribute('data-direction', 'row')
      next = overflows(el) ? 'column' : 'row'
      list.setAttribute('data-direction', next)
    }
    direction.value = next
    measureEdges()
  }

  let frame = 0
  const schedule = (): void => {
    globalThis.cancelAnimationFrame(frame)
    frame = globalThis.requestAnimationFrame(fit)
  }

  onMounted(fit)
  onScopeDispose(() => globalThis.cancelAnimationFrame(frame))
  watch(() => toValue(orientation), schedule)
  useResizeObserver(() => scrollEl.value, schedule)
  useResizeObserver(() => listEl.value, schedule)

  return {
    direction: computed(() => direction.value),
    overflowStart: computed(() => overflowStart.value),
    overflowEnd: computed(() => overflowEnd.value),
    measureEdges
  }
}
