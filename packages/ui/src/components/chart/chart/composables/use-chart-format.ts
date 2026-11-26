import { computed, type Ref } from 'vue'

import { type ChartLabel, dateSpan, formatCompact, formatLabel } from '../../lib'

export interface UseChartFormatOptions {
  locale: Readonly<Ref<string>>
  mounted: Readonly<Ref<boolean>>
  labels: () => ChartLabel[]
  timeZone: () => string
  formatValue: () => (value: number) => string
  formatLabel: () => (label: ChartLabel) => string
}

export interface UseChartFormatReturn {
  valueText: (value: number) => string
  labelText: (label: ChartLabel) => string
}

export function useChartFormat(options: UseChartFormatOptions): UseChartFormatReturn {
  const { locale } = options
  const zone = computed<string | undefined>(
    () => options.timeZone() || (options.mounted.value ? undefined : 'UTC')
  )
  const span = computed(() => dateSpan(options.labels()))
  return {
    valueText: (value) => {
      const format = options.formatValue()
      return format === formatCompact ? formatCompact(value, locale.value) : format(value)
    },
    labelText: (label) => {
      const format = options.formatLabel()
      return format === formatLabel
        ? formatLabel(label, locale.value, zone.value, span.value)
        : format(label)
    }
  }
}
