import {
  computed,
  type ComputedRef,
  hasInjectionContext,
  inject,
  type MaybeRefOrGetter,
  ref,
  toValue
} from 'vue'

import {
  type DateRangeValue,
  type RelativeOption,
  resolveDateRange
} from '../../components/input/date-range-picker/date-range'
import { LocaleInjectionKey } from '../use-translate'

export type { DateRangeValue, RelativeOption }

/** Key of a preset in `TIME_RANGE_PRESETS`. */
export type TimeRangePresetKey = 'last-1-hour' | 'last-24-hours' | 'last-7-days' | 'last-30-days'

const PRESETS: Record<TimeRangePresetKey, RelativeOption> = {
  'last-1-hour': { key: 'last-1-hour', amount: 1, unit: 'hour' },
  'last-24-hours': { key: 'last-24-hours', amount: 24, unit: 'hour' },
  'last-7-days': { key: 'last-7-days', amount: 7, unit: 'day' },
  'last-30-days': { key: 'last-30-days', amount: 30, unit: 'day' }
}

export const TIME_RANGE_PRESETS: RelativeOption[] = Object.values(PRESETS)

export function timeRangePreset(key: TimeRangePresetKey): DateRangeValue {
  const { amount, unit } = PRESETS[key]
  return { type: 'relative', amount, unit, key }
}

/** Options of `useTimeRange`. */
export interface UseTimeRangeOptions {
  /** Reference clock. A ref or getter that changes re-resolves the range; unset reads the nearest ConfigProvider now, then the real clock. */
  now?: MaybeRefOrGetter<Date | number | undefined>
}

/** What `useTimeRange` returns. */
export interface UseTimeRangeReturn {
  /** Start instant of the range; null with no range. */
  from: ComputedRef<Date | null>
  /** End instant of the range; null with no range. */
  to: ComputedRef<Date | null>
  /** Resolves a relative range again against the clock, so the window ends now. */
  refresh: () => void
}

export function useTimeRange(
  value: MaybeRefOrGetter<DateRangeValue | null | undefined>,
  options: UseTimeRangeOptions = {}
): UseTimeRangeReturn {
  const provided = hasInjectionContext() ? inject(LocaleInjectionKey, null)?.now : undefined
  const generation = ref(0)

  const clock = (): Date => {
    const instant = toValue(options.now) ?? provided?.value ?? Date.now()
    return new Date(instant instanceof Date ? instant.getTime() : instant)
  }

  const range = computed(() => {
    void generation.value
    return resolveDateRange(toValue(value), clock())
  })

  return {
    from: computed(() => range.value?.start ?? null),
    to: computed(() => range.value?.end ?? null),
    refresh: () => {
      generation.value += 1
    }
  }
}
