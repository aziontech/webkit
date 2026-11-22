import type { ChartLabel, ChartSeries } from '@aziontech/webkit/chart'
import { toast } from '@aziontech/webkit/toast'
import { copyText } from '@aziontech/webkit/utils/clipboard'
import { type CsvColumn, downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'

/** The unit a figure is written in. */
export type MetricFormat = 'count' | 'bytes' | 'percentage' | 'ms' | 'seconds'

/** The parts of a Real-Time Metrics API query a card copies. */
export interface MetricQuery {
  /** Dataset the query reads. */
  dataset: string
  /** Field the query sums. */
  measure: string
  /** Most rows returned. */
  limit: number
  /** Fields the rows are grouped by. */
  groupBy: string[]
  /** Order of the rows. */
  orderBy: string
  /** Start of the window, as an ISO timestamp. */
  begin: string
  /** End of the window, as an ISO timestamp. */
  end: string
}

/** What a card menu copies and exports. */
export interface CardExport {
  /** The query Copy query writes to the clipboard. */
  query: string
  /** The file name Export CSV downloads. */
  filename: string
  /** The CSV columns. */
  columns: CsvColumn[]
  /** The CSV rows, read when the export runs. */
  rows: () => object[]
}

const byteUnits = ['B', 'KB', 'MB', 'GB', 'TB']

const apiTime = (iso: string): string => iso.replace(/(\.\d+)?Z$/, '')

export const metricQuery = (query: MetricQuery): string =>
  [
    'query {',
    `  ${query.dataset}(`,
    `    limit: ${query.limit}`,
    `    filter: { tsRange: { begin: "${apiTime(query.begin)}", end: "${apiTime(query.end)}" } }`,
    `    aggregate: { sum: ${query.measure} }`,
    `    groupBy: [${query.groupBy.join(', ')}]`,
    `    orderBy: [${query.orderBy}]`,
    '  ) {',
    ...[...query.groupBy, 'sum'].map((field) => `    ${field}`),
    '  }',
    '}'
  ].join('\n')

export const copyQuery = async (query: string): Promise<void> => {
  if (!(await copyText(query))) {
    toast.error('The query could not be copied.')
    return
  }
  toast.success('Query copied.', {
    description: 'Paste it into any GraphQL client that sends your token.'
  })
}

export const exportCsv = (filename: string, columns: CsvColumn[], rows: object[]): void => {
  downloadCsv(filename, toCsv({ columns, rows }))
  toast.success('CSV exported.', { description: filename })
}

export const runCardOption = (value: string | number, card: CardExport): void => {
  if (value === 'query') {
    copyQuery(card.query)
    return
  }
  exportCsv(card.filename, card.columns, card.rows())
}

export const seriesRows = (
  series: readonly ChartSeries[],
  axis: readonly ChartLabel[]
): Record<string, string | number | null>[] =>
  axis.map((label, index) => ({
    ts: label instanceof Date ? label.toISOString() : label,
    ...Object.fromEntries(series.map((entry) => [entry.id, entry.values[index] ?? '']))
  }))

export const seriesColumns = (series: readonly ChartSeries[]): CsvColumn[] => [
  { id: 'ts', header: 'Time' },
  ...series.map((entry) => ({ id: entry.id, header: entry.name }))
]

export const formatBytes = (value: number, units: readonly string[] = byteUnits): string => {
  let current = value
  let index = 0
  while (current >= 1000 && index < units.length - 1) {
    current /= 1000
    index += 1
  }
  return `${current.toFixed(current >= 100 || index === 0 ? 0 : 1)} ${units[index]}`
}

export const metricFormatters = (
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
): Record<MetricFormat, (value: number) => string> => {
  const compact = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })
  return {
    count: (value) => compact(value),
    bytes: (value) => formatBytes(value),
    percentage: (value) => `${value.toFixed(1)}%`,
    ms: (value) => `${formatNumber(value, { maximumFractionDigits: 1 })} ms`,
    seconds: (value) => `${compact(value)} s`
  }
}

/** A period of the Period Select, with the comparison label of its deltas. */
export interface ComparedPeriod {
  /** The period key. */
  value: string
  /** The label the Select shows. */
  label: string
  /** The comparison label of every delta. */
  comparison: string
}

export const comparedPeriods: ComparedPeriod[] = [
  { value: '1h', label: 'Last hour', comparison: 'vs previous hour' },
  { value: '24h', label: 'Last 24 hours', comparison: 'vs previous 24 hours' },
  { value: '7d', label: 'Last 7 days', comparison: 'vs previous 7 days' },
  { value: '30d', label: 'Last 30 days', comparison: 'vs previous 30 days' }
]

export const comparedPeriod = (value: string): ComparedPeriod =>
  comparedPeriods.find((entry) => entry.value === value) ?? comparedPeriods[1]!

export const periodSlug = (period: ComparedPeriod): string =>
  period.label.toLowerCase().replaceAll(' ', '-')

export const chartForms = [
  { label: 'Line', value: 'line' },
  { label: 'Bar', value: 'bar' }
]
