import { computed, type ComputedRef, type Ref } from 'vue'

import {
  type DateRangeValue,
  endsNow,
  type RelativeOption,
  resolveDateRange,
  type ResolveDateRangeOptions,
  stepDateRange
} from '../date-range'
import { type DateRangeTranslate, refreshText, triggerText } from '../lib/range-text'

export interface UseDateRangeTriggerReturn {
  triggerParts: ComputedRef<{ text: string; zone: string }>
  triggerText: ComputedRef<string>
  triggerLabel: ComputedRef<string>
  step: (direction: -1 | 1) => void
  canStepBack: ComputedRef<boolean>
  canStepForward: ComputedRef<boolean>
}

const span = (range: { start: Date; end: Date }) => range.end.getTime() - range.start.getTime()

export function useDateRangeTrigger(
  model: Ref<DateRangeValue | null>,
  props: { relativeOptions: RelativeOption[]; placeholder: string; ariaLabel: string; max?: Date },
  text: { t: DateRangeTranslate; locale: Ref<string>; refresh: () => number },
  state: { disabled: ComputedRef<boolean>; zone: ComputedRef<string> },
  options: ComputedRef<ResolveDateRangeOptions>,
  bounds: { min: () => Date; now: () => Date }
): UseDateRangeTriggerReturn {
  const { t } = text
  const parts = computed(() =>
    triggerText(
      t,
      model.value,
      props.relativeOptions,
      state.zone.value,
      text.locale.value,
      bounds.now()
    )
  )
  const full = computed<string>(() =>
    [parts.value.text, parts.value.zone].filter(Boolean).join(' ')
  )
  const resolved = computed(() => resolveDateRange(model.value, bounds.now(), options.value))
  return {
    triggerParts: parts,
    triggerText: full,
    triggerLabel: computed<string>(() => {
      const refresh = refreshText(t, text.refresh())
      const shown = full.value || props.placeholder || t('dateRangePicker.placeholder')
      return `${props.ariaLabel || t('dateRangePicker.label')}: ${shown}${refresh ? `, ${refresh}` : ''}`
    }),
    step: (direction) => {
      if (state.disabled.value) return
      const next = stepDateRange(model.value, direction, bounds.now(), options.value)
      if (next) model.value = next
    },
    canStepBack: computed<boolean>(() => {
      const range = resolved.value
      if (!range || state.disabled.value) return false
      return range.start.getTime() - span(range) >= bounds.min().getTime()
    }),
    canStepForward: computed<boolean>(() => {
      const range = resolved.value
      if (!range || state.disabled.value || endsNow(model.value)) return false
      return range.end.getTime() + span(range) <= (props.max ?? bounds.now()).getTime()
    })
  }
}
