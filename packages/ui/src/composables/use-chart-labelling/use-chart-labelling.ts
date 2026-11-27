import { computed, type ComputedRef, inject, type MaybeRefOrGetter, toValue } from 'vue'

import { ChartCardInjectionKey } from '../../components/chart/chart-card/injection-key'

export interface UseChartLabellingReturn {
  accessibleName: ComputedRef<string | undefined>
  labelledBy: ComputedRef<string | undefined>
  describedBy: ComputedRef<string>
}

export function useChartLabelling(
  ariaLabel: MaybeRefOrGetter<string>,
  summaryId: string
): UseChartLabellingReturn {
  const card = inject(ChartCardInjectionKey, null)

  const accessibleName = computed(() => toValue(ariaLabel) || undefined)
  const labelledBy = computed(() =>
    !toValue(ariaLabel) && card?.hasTitle.value ? card.titleId : undefined
  )
  const describedBy = computed(() =>
    card?.hasDescription.value ? `${card.descriptionId} ${summaryId}` : summaryId
  )

  return { accessibleName, labelledBy, describedBy }
}
