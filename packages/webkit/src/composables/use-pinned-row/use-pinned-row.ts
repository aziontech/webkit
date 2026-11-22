import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

import { measurePinnedRow, observeRowSize, rowShift } from './lib/measure'

/** The elements a pinned row is measured from. */
export interface PinnedRowElements {
  /** The tall box the page scrolls through while the band stays pinned. */
  runway: MaybeRefOrGetter<HTMLElement | null>
  /** The band that sticks under the header. */
  pinned: MaybeRefOrGetter<HTMLElement | null>
  /** The clipping window of the row. */
  viewport: MaybeRefOrGetter<HTMLElement | null>
  /** The row that slides sideways. */
  track: MaybeRefOrGetter<HTMLElement | null>
}

/** What a pinned row exposes to its band. */
export interface UsePinnedRowReturn {
  /** Height the runway takes so the page scroll covers the row's overflow; empty when not pinned. */
  runwayHeight: Readonly<Ref<string>>
  /** The row's `translate` value for the current scroll; undefined at rest. */
  shift: ComputedRef<string | undefined>
}

export function usePinnedRow(
  elements: PinnedRowElements,
  enabled: MaybeRefOrGetter<boolean>
): UsePinnedRowReturn {
  const runwayHeight = ref('')
  const offset = ref(0)

  let frame: number | null = null
  let observer: ResizeObserver | null = null
  let listening = false

  const reset = () => {
    runwayHeight.value = ''
    offset.value = 0
  }

  const measure = () => {
    frame = null
    const next = measurePinnedRow(elements, enabled)
    runwayHeight.value = next?.runwayHeight ?? ''
    offset.value = next?.offset ?? 0
  }

  const schedule = () => {
    if (frame === null) frame = requestAnimationFrame(measure)
  }

  const SCROLL_OPTIONS = { capture: true, passive: true }

  const start = () => {
    if (listening) return
    listening = true
    document.addEventListener('scroll', schedule, SCROLL_OPTIONS)
    window.addEventListener('resize', schedule, { passive: true })
    observer = observeRowSize(elements, schedule)
    measure()
  }

  const stop = () => {
    if (frame !== null) cancelAnimationFrame(frame)
    frame = null
    if (!listening) return
    listening = false
    document.removeEventListener('scroll', schedule, SCROLL_OPTIONS)
    window.removeEventListener('resize', schedule)
    observer?.disconnect()
    observer = null
  }

  onMounted(() => {
    watch(
      () => toValue(enabled),
      (on) => {
        if (on) start()
        else {
          stop()
          reset()
        }
      },
      { immediate: true }
    )
  })

  onScopeDispose(stop)

  const shift = computed(() => rowShift(offset.value, toValue(elements.runway)))

  return { runwayHeight: readonly(runwayHeight), shift }
}
