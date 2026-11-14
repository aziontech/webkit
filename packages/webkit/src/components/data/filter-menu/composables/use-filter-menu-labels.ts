import { computed } from 'vue'

import type { UseLocaleReturn } from '../../../../composables/use-locale'
import { useLocale } from '../../../../composables/use-locale'
import * as en from '../../../../i18n/messages/en'
import { DATE_PERIODS, type FilterMenuSummary, kindOf, summarize, valuesOf } from '../summarize'
import type { FilterMenuField, FilterMenuModel, FilterMenuOption, FilterMenuRange } from '../types'

export interface UseFilterMenuLabelsReturn {
  t: UseLocaleReturn['t']
  dir: UseLocaleReturn['dir']
  locale: UseLocaleReturn['locale']
  optionsOf: (field: FilterMenuField) => FilterMenuOption[]
  summaryOf: (model: FilterMenuModel, field: FilterMenuField) => FilterMenuSummary | null
  summaryText: (model: FilterMenuModel, field: FilterMenuField) => string
}

export function useFilterMenuLabels(): UseFilterMenuLabelsReturn {
  const { t, dir, locale, formatDate } = useLocale({ filterMenu: en.filterMenu })

  const periodOptions = computed<FilterMenuOption[]>(() => {
    const labels = [
      t('filterMenu.last24Hours'),
      t('filterMenu.last7Days'),
      t('filterMenu.last30Days'),
      t('filterMenu.last3Months')
    ]
    return DATE_PERIODS.map((value, index) => ({ value, label: labels[index] ?? value }))
  })

  const optionsOf = (field: FilterMenuField): FilterMenuOption[] =>
    kindOf(field) === 'date' && !field.options?.length ? periodOptions.value : (field.options ?? [])

  const shortDate = (date: Date): string => formatDate(date, { month: 'short', day: 'numeric' })

  const formatRange = (range: FilterMenuRange): string => {
    if (range.start && range.end)
      return t('filterMenu.rangeBetween', {
        start: shortDate(range.start),
        end: shortDate(range.end)
      })
    if (range.start) return t('filterMenu.rangeSince', { date: shortDate(range.start) })
    if (range.end) return t('filterMenu.rangeUntil', { date: shortDate(range.end) })
    return ''
  }

  const summaryOf = (model: FilterMenuModel, field: FilterMenuField): FilterMenuSummary | null =>
    summarize(valuesOf(model, field), optionsOf(field), formatRange)

  const summaryText = (model: FilterMenuModel, field: FilterMenuField): string => {
    const summary = summaryOf(model, field)
    if (!summary) return ''
    return summary.extra
      ? `${summary.label} ${t('filterMenu.more', { count: summary.extra })}`
      : summary.label
  }

  return { t, dir, locale, optionsOf, summaryOf, summaryText }
}
