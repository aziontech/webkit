import { computed, type ComputedRef, type Ref } from 'vue'

import type { DateRangeDuration, DateRangeValue, RelativeOption } from '../date-range'
import { draftErrorOf, draftValueOf } from '../lib/range-draft'
import type { DateRangePanel } from '../lib/range-panel'
import { type DateRangeTranslate, durationText } from '../lib/range-text'

export interface UseDateRangeDraftReturn {
  parsedAmount: ComputedRef<number | null>
  draftValue: ComputedRef<DateRangeValue | null>
  draftError: ComputedRef<string>
  visibleError: ComputedRef<string>
}

export function useDateRangeDraft(
  panel: Ref<DateRangePanel>,
  options: ComputedRef<RelativeOption[]>,
  props: { maxDuration?: DateRangeDuration },
  text: { t: DateRangeTranslate; locale: Ref<string> },
  bounds: { min: () => Date; max: () => Date; now: () => Date }
): UseDateRangeDraftReturn {
  const { t } = text
  const parsedAmount = computed<number | null>(() => {
    const amount = Number(panel.value.amount)
    return Number.isInteger(amount) && amount > 0 ? amount : null
  })
  const draft = computed(() => ({ ...panel.value, amount: parsedAmount.value }))
  const draftValue = computed(() => draftValueOf(draft.value, options.value))
  const tooLong = computed<string>(() =>
    props.maxDuration
      ? t('dateRangePicker.tooLong', {
          duration: durationText(text.locale.value, props.maxDuration)
        })
      : ''
  )
  const draftError = computed<string>(() =>
    draftErrorOf(t, draft.value, draftValue.value, {
      now: bounds.now(),
      min: bounds.min(),
      max: bounds.max(),
      duration: props.maxDuration,
      tooLong: tooLong.value
    })
  )
  const visibleError = computed<string>(() => {
    const error = draftError.value
    if (panel.value.showError) return error
    const shown = error === t('dateRangePicker.order') || (tooLong.value && error === tooLong.value)
    return panel.value.mode === 'absolute' && draftValue.value && shown ? error : ''
  })
  return { parsedAmount, draftValue, draftError, visibleError }
}
