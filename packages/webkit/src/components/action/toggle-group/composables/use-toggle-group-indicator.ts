import {
  computed,
  type ComputedRef,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref
} from 'vue'

export interface UseToggleGroupIndicatorReturn {
  visible: Readonly<Ref<boolean>>
  style: ComputedRef<Record<string, string>>
  schedule: () => void
}

export function useToggleGroupIndicator(
  rootEl: Ref<HTMLElement | null>,
  optionEls: Ref<HTMLElement[]>,
  selectedIndex: Readonly<Ref<number>>
): UseToggleGroupIndicatorReturn {
  const visible = ref(false)
  const width = ref(0)
  const height = ref(0)
  const offsetX = ref(0)
  const offsetY = ref(0)
  let resizeObserver: ResizeObserver | null = null

  const style = computed(() => ({
    left: '0',
    width: `${width.value}px`,
    height: `${height.value}px`,
    transform: `translate3d(${offsetX.value}px, ${offsetY.value}px, 0)`
  }))

  const sync = () => {
    const root = rootEl.value
    const activeOptionEl = optionEls.value[selectedIndex.value]

    if (!root || !activeOptionEl || selectedIndex.value < 0 || !activeOptionEl.offsetParent) {
      visible.value = false
      return
    }

    width.value = activeOptionEl.offsetWidth
    height.value = activeOptionEl.offsetHeight
    offsetX.value = activeOptionEl.offsetLeft
    offsetY.value = activeOptionEl.offsetTop
    visible.value = true
  }

  const observe = () => {
    if (!resizeObserver) return
    resizeObserver.disconnect()
    if (rootEl.value) resizeObserver.observe(rootEl.value)
    optionEls.value.forEach((el) => {
      if (el) resizeObserver?.observe(el)
    })
  }

  const schedule = () => {
    nextTick(() => {
      sync()
      observe()
    })
  }

  const disconnect = () => {
    resizeObserver?.disconnect()
    resizeObserver = null
  }

  onMounted(() => {
    if (typeof ResizeObserver !== 'undefined') resizeObserver = new ResizeObserver(sync)
    schedule()
  })

  onBeforeUnmount(disconnect)
  onScopeDispose(disconnect)

  return { visible: readonly(visible), style, schedule }
}
