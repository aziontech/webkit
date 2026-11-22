import { computed, type ComputedRef, provide, type Ref } from 'vue'

import { startOfDay } from '../../date-picker/format'
import {
  type DatePickerDraft,
  DatePickerInjectionKey,
  type DatePickerSize
} from '../../date-picker/injection-key'
import { type DateRangeDuration, shiftWallClock, toWallClock } from '../date-range'
import { earliestWall, latestWall } from '../lib/range-bounds'
import {
  type DateRangePanel,
  selectDay,
  selectValue,
  setEndpoint,
  setZone
} from '../lib/range-panel'

export function provideDateRangeGrid(
  props: {
    size: DatePickerSize
    showTime: boolean
    timeZones: string[]
    maxDuration?: DateRangeDuration
  },
  panel: Ref<DateRangePanel>,
  testId: string,
  open: ComputedRef<boolean>,
  disabled: ComputedRef<boolean>,
  bounds: { min: () => Date; max: () => Date; now: () => Date }
): void {
  const pickingEnd = (): boolean =>
    !panel.value.untilNow && Boolean(panel.value.range.start) && !panel.value.range.end
  const anchor = (): Date | null => {
    const start = panel.value.range.start
    if (panel.value.untilNow) return toWallClock(bounds.now(), panel.value.zone)
    return pickingEnd() && start ? shiftWallClock(startOfDay(start), 1, 'day') : null
  }
  const minWall = computed<Date>(() => {
    const floor = toWallClock(bounds.min(), panel.value.zone)
    return open.value ? earliestWall(floor, props.maxDuration, anchor()) : floor
  })
  const maxWall = computed<Date>(() => {
    const ceiling = toWallClock(bounds.max(), panel.value.zone)
    if (!open.value || !pickingEnd()) return ceiling
    return latestWall(ceiling, props.maxDuration, panel.value.range.start)
  })

  provide(DatePickerInjectionKey, {
    testId,
    mode: computed(() => (panel.value.untilNow ? ('single' as const) : ('range' as const))),
    size: computed(() => props.size),
    disabled,
    min: minWall,
    max: maxWall,
    showTime: computed(() => props.showTime),
    horizontal: computed(() => false),
    trimWeeks: computed(() => true),
    draft: computed<DatePickerDraft>(() =>
      panel.value.untilNow ? panel.value.range.start : panel.value.range
    ),
    hasSelection: computed(() => Boolean(panel.value.range.start || panel.value.range.end)),
    timezone: computed(() => panel.value.zone),
    timezones: computed(() => props.timeZones),
    selectDay: (date) => selectDay(panel.value, date),
    selectValue: (_event, value) => selectValue(panel.value, value),
    setEndpoint: (which, date) => setEndpoint(panel.value, which, date),
    clear: () => {
      panel.value.range = { start: null, end: null }
    },
    setTimezone: (next) => setZone(panel.value, next),
    changeMonth: () => undefined
  })
}
