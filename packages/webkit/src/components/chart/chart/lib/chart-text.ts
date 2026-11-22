import type { MessageKey, MessageParams } from '../../../../i18n/types'
import { type ChartLabel, type ChartRange, isFiniteNumber, type NormalizedSeries } from '../../lib'
import type { ChartReferenceRegistration } from '../injection-key'

export interface ChartText {
  t: (key: MessageKey, params?: MessageParams) => string
  value: (value: number) => string
  label: (label: ChartLabel) => string
}

export function chartSummary(
  text: ChartText,
  labels: ChartLabel[],
  series: number,
  references: ChartReferenceRegistration[]
): string {
  const { t } = text
  const first = labels[0]
  const last = labels[labels.length - 1]
  const range =
    first !== undefined && last !== undefined
      ? t('chart.summaryRange', { from: text.label(first), to: text.label(last) })
      : ''
  const notes = references.map((entry) => {
    const label = entry.label || t('chart.reference')
    return entry.band
      ? t('chart.referenceBand', { label, from: text.value(entry.low), to: text.value(entry.high) })
      : t('chart.referenceLine', { label, value: text.value(entry.high) })
  })
  return [t('chart.summary', { series, points: labels.length, range }), ...notes].join(' ')
}

export function chartReadings(
  text: ChartText,
  label: ChartLabel | undefined,
  series: NormalizedSeries[],
  focused: string | null,
  index: number
): string {
  const focus = series.some((entry) => entry.id === focused) ? focused : null
  const readings = series
    .filter((entry) => focus === null || entry.id === focus)
    .map((entry) => {
      const value = entry.values[index]
      return `${entry.name} ${isFiniteNumber(value) ? text.value(value) : text.t('chart.noData')}`
    })
    .join(', ')
  return `${label === undefined ? '' : text.label(label)}: ${readings}`
}

export function chartRangeText(
  text: ChartText,
  key: 'chart.rangeDraft' | 'chart.rangeSelected',
  labels: ChartLabel[],
  span: ChartRange
): string {
  const from = labels[span[0]]
  const to = labels[span[1]]
  return text.t(key, {
    from: from === undefined ? '' : text.label(from),
    to: to === undefined ? '' : text.label(to)
  })
}
