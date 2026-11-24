import { computed, type ComputedRef, onMounted, onScopeDispose, type Ref, ref, watch } from 'vue'

import { useLocaleContext } from '../../../../composables/use-translate'
import { localTimezone } from '../../date-picker/format'
import type { ResolveDateRangeOptions } from '../date-range'
import { maxBound, minBound } from '../lib/range-bounds'

export interface UseDateRangeClockReturn {
  zone: ComputedRef<string>
  resolveOptions: ComputedRef<ResolveDateRangeOptions>
  bounds: { min: () => Date; max: () => Date; now: () => Date }
}

export function useDateRangeClock(
  props: { now?: Date; min?: Date; max?: Date },
  timeZone: Ref<string>,
  refresh: { seconds: Ref<number>; active: () => boolean; onTick: () => void }
): UseDateRangeClockReturn {
  const { context: localeContext } = useLocaleContext()
  const mounted = ref(false)
  onMounted(() => {
    mounted.value = true
  })
  const zone = computed<string>(
    () =>
      timeZone.value || localeContext?.timeZone?.value || (mounted.value ? localTimezone() : 'UTC')
  )
  const now = (): Date => {
    if (props.now) return props.now
    const provided = localeContext?.now?.value
    return provided === undefined ? new Date() : new Date(provided)
  }
  let timer: ReturnType<typeof setInterval> | undefined
  const stop = (): void => {
    if (timer !== undefined) clearInterval(timer)
    timer = undefined
  }
  watch([refresh.seconds, () => mounted.value && refresh.active()], ([seconds, active]) => {
    stop()
    if (!active || !seconds || seconds <= 0) return
    timer = setInterval(() => {
      if (globalThis.document?.visibilityState !== 'hidden') refresh.onTick()
    }, seconds * 1000)
  })
  onScopeDispose(stop)

  return {
    zone,
    resolveOptions: computed(() => ({ timeZone: zone.value, weekStart: 0 })),
    bounds: {
      min: () => minBound(props.min, now(), zone.value),
      max: () => maxBound(props.max, now(), zone.value),
      now
    }
  }
}
