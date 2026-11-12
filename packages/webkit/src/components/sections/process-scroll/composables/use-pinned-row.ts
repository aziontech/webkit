import {
  computed,
  onMounted,
  onScopeDispose,
  readonly,
  ref,
  toValue,
  watch,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref
} from 'vue'

/** The elements a pinned row is measured from. */
export interface PinnedRowElements {
  /** The tall box the page scrolls through while the band stays pinned. */
  runway: Ref<HTMLElement | null>
  /** The band that sticks under the header. */
  pinned: Ref<HTMLElement | null>
  /** The clipping window of the row. */
  viewport: Ref<HTMLElement | null>
  /** The row that slides sideways. */
  track: Ref<HTMLElement | null>
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
    const runway = elements.runway.value
    const pinned = elements.pinned.value
    const viewport = elements.viewport.value
    const track = elements.track.value
    if (!toValue(enabled) || !runway || !pinned || !viewport || !track) return reset()
    if (getComputedStyle(pinned).position !== 'sticky') return reset()

    const overflow = Math.max(0, track.scrollWidth - viewport.clientWidth)
    runwayHeight.value = `${pinned.offsetHeight + overflow}px`
    const travelled = pinned.getBoundingClientRect().top - runway.getBoundingClientRect().top
    offset.value = Math.min(overflow, Math.max(0, travelled))
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
    observer = new ResizeObserver(schedule)
    if (elements.pinned.value) observer.observe(elements.pinned.value)
    if (elements.track.value) observer.observe(elements.track.value)
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

  const shift = computed(() => {
    if (!offset.value) return undefined
    const rtl = elements.runway.value?.closest('[dir]')?.getAttribute('dir') === 'rtl'
    return `${rtl ? offset.value : -offset.value}px 0`
  })

  return { runwayHeight: readonly(runwayHeight), shift }
}
