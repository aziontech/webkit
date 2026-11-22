import { computed, type ComputedRef, type Ref } from 'vue'

import { type ChartLabel, type ChartRange, isFiniteNumber, type NormalizedSeries } from '../../lib'
import type { ChartReferenceRegistration } from '../injection-key'
import { twinRowsOf } from '../lib/chart-layout'
import { chartRangeText, chartReadings, chartSummary, type ChartText } from '../lib/chart-text'
import type { ChartDataTableRow } from '../parts/chart-data-table.vue'

export interface UseChartReadoutOptions {
  text: ChartText
  labels: Readonly<Ref<ChartLabel[]>>
  visibleSeries: Readonly<Ref<NormalizedSeries[]>>
  references: Readonly<Ref<ChartReferenceRegistration[]>>
  selection: Readonly<Ref<ChartRange | null>>
  activeIndex: Readonly<Ref<number | null>>
  focusedSeries: Readonly<Ref<string | null>>
  draft: Readonly<Ref<ChartRange | null>>
  committed: Readonly<Ref<boolean>>
  showMarks: Readonly<Ref<boolean>>
}

export interface UseChartReadoutReturn {
  summary: ComputedRef<string>
  announcement: ComputedRef<string>
  tableColumns: ComputedRef<string[]>
  tableRows: ComputedRef<ChartDataTableRow[]>
  twinTableRows: ComputedRef<ChartDataTableRow[]>
}

export function useChartReadout(options: UseChartReadoutOptions): UseChartReadoutReturn {
  const { text, labels, visibleSeries, selection } = options
  const announcement = computed(() => {
    if (!options.showMarks.value) return ''
    if (options.draft.value && selection.value)
      return chartRangeText(text, 'chart.rangeDraft', labels.value, selection.value)
    if (options.committed.value && selection.value)
      return chartRangeText(text, 'chart.rangeSelected', labels.value, selection.value)
    const index = options.activeIndex.value
    if (index === null) return ''
    const focused = options.focusedSeries.value
    return chartReadings(text, labels.value[index], visibleSeries.value, focused, index)
  })
  const tableRow = ({ label, index }: { label: ChartLabel; index: number }): ChartDataTableRow => ({
    key: index,
    header: text.label(label),
    cells: visibleSeries.value.map((entry) => {
      const value = entry.values[index]
      return isFiniteNumber(value) ? text.value(value) : ''
    })
  })
  return {
    summary: computed(() =>
      chartSummary(text, labels.value, visibleSeries.value.length, options.references.value)
    ),
    announcement,
    tableColumns: computed(() => [
      text.t('chart.label'),
      ...visibleSeries.value.map((entry) => entry.name)
    ]),
    tableRows: computed(() => labels.value.map((label, index) => tableRow({ label, index }))),
    twinTableRows: computed(() => twinRowsOf(labels.value).map(tableRow))
  }
}
