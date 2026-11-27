import { usePreferredReducedMotion } from '@vueuse/core'
import { type MaybeRefOrGetter, onScopeDispose, readonly, type Ref, ref, toValue, watch } from 'vue'

export interface UseChartEntranceOptions {
  show: MaybeRefOrGetter<boolean>
  ready: MaybeRefOrGetter<boolean>
}

export interface UseChartEntranceReturn {
  entered: Readonly<Ref<boolean>>
  scheduleEnter: () => void
  resetEnter: () => void
}

export function useChartEntrance(options?: UseChartEntranceOptions): UseChartEntranceReturn {
  const reducedMotion = usePreferredReducedMotion()
  const entered = ref(false)
  let frame = 0

  function cancelEnter() {
    if (frame) globalThis.cancelAnimationFrame(frame)
    frame = 0
  }

  function scheduleEnter() {
    cancelEnter()
    entered.value = false
    if (reducedMotion.value === 'reduce') {
      entered.value = true
      return
    }
    frame = globalThis.requestAnimationFrame(() => {
      frame = globalThis.requestAnimationFrame(() => {
        frame = 0
        entered.value = true
      })
    })
  }

  function resetEnter() {
    cancelEnter()
    entered.value = false
  }

  if (options) {
    watch(
      [() => toValue(options.show), () => toValue(options.ready)],
      ([show, ready]) => {
        if (show && ready) scheduleEnter()
        else if (!show) resetEnter()
      },
      { immediate: true }
    )
  }

  onScopeDispose(cancelEnter)

  return { entered: readonly(entered), scheduleEnter, resetEnter }
}
