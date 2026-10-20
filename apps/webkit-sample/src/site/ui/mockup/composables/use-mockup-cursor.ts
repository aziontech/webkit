import {
  type MaybeRefOrGetter,
  nextTick,
  onMounted,
  onScopeDispose,
  readonly,
  ref,
  type Ref,
  toValue,
  watch
} from 'vue'

export interface MockupCursorTarget {
  /** The `data-cursor` value of the element the cursor points at. */
  key: string
  /** Horizontal point on the element, 0 at its left edge and 1 at its right. */
  x?: number
  /** Vertical point on the element, 0 at its top edge and 1 at its bottom. */
  y?: number
}

export interface MockupCursorPosition {
  x: number
  y: number
}

export interface UseMockupCursorReturn {
  position: Readonly<Ref<MockupCursorPosition>>
}

const SETTLE_DELAYS = [0, 200]
const ENTRANCE_DELAYS = [0, 200, 1400]

export function useMockupCursor(
  container: Ref<globalThis.HTMLElement | null>,
  target: MaybeRefOrGetter<MockupCursorTarget>,
  scroller?: Ref<globalThis.HTMLElement | null>
): UseMockupCursorReturn {
  const position = ref<MockupCursorPosition>({ x: 0, y: 0 })
  const timers = new Set<ReturnType<typeof globalThis.setTimeout>>()

  const locate = () => {
    const root = container.value
    const { key, x = 0.5, y = 0.5 } = toValue(target)
    const element = root?.querySelector<globalThis.HTMLElement>(`[data-cursor="${key}"]`)
    if (!root || !element) return
    const outer = root.getBoundingClientRect()
    const scale = outer.width / (root.offsetWidth || 1)
    const box = element.getBoundingClientRect()
    position.value = {
      x: (box.left - outer.left + box.width * x) / scale,
      y: (box.top - outer.top + box.height * y) / scale
    }
  }

  const settle = async (delays = SETTLE_DELAYS) => {
    await nextTick()
    for (const delay of delays) {
      const timer = globalThis.setTimeout(() => {
        timers.delete(timer)
        locate()
      }, delay)
      timers.add(timer)
    }
  }

  const onScrolled = (event: globalThis.TransitionEvent) => {
    if (event.target === scroller?.value && event.propertyName === 'translate') locate()
  }

  watch(
    () => toValue(target),
    () => settle()
  )

  onMounted(() => {
    scroller?.value?.addEventListener('transitionend', onScrolled)
    settle(ENTRANCE_DELAYS)
  })

  onScopeDispose(() => {
    scroller?.value?.removeEventListener('transitionend', onScrolled)
    for (const timer of timers) globalThis.clearTimeout(timer)
    timers.clear()
  })

  return { position: readonly(position) }
}
