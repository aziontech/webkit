import type { TableColumn } from '@aziontech/webkit/data-table'
import type { CsvColumn } from '@aziontech/webkit/utils/csv'

import type { AnalyticsDashboardCardId, AnalyticsDashboardKpiId } from './dashboard-analytics.vue'

export type FigureFormat = 'count' | 'bytes' | 'percentage'

export interface FigureDefinition {
  id: AnalyticsDashboardKpiId
  label: string
  description: string
  format: FigureFormat
  inverse: boolean
}

export const trafficFigures: FigureDefinition[] = [
  {
    label: 'Requests',
    id: 'requests',
    description: 'Sum of requests served by every service in the period.',
    format: 'count',
    inverse: false
  },
  {
    label: 'Data transferred',
    id: 'data-transferred',
    description: 'Sum of data delivered to users by every service in the period.',
    format: 'bytes',
    inverse: false
  },
  {
    label: 'Success rate',
    id: 'success-rate',
    description: 'Share of requests that ended in a 2xx or 3xx status.',
    format: 'percentage',
    inverse: false
  },
  {
    label: 'Status 5xx',
    id: 'status-5xx',
    description: 'Requests that ended in a server error. A rise is a regression.',
    format: 'count',
    inverse: true
  }
]

const hostColumn = (id: string, header: string, align: 'start' | 'end'): TableColumn => ({
  accessorKey: id,
  id,
  header,
  align,
  sortable: true,
  ...(id === 'host' ? { principal: true } : {})
})
export const hostColumns: TableColumn[] = [
  hostColumn('host', 'Host', 'start'),
  hostColumn('service', 'Service', 'start'),
  hostColumn('requests', 'Requests', 'end')
]

export interface TrafficCard {
  label: string
  description: string
  limit: number
  groupBy: string[]
  orderBy: string
  columns: CsvColumn[]
}

const timeColumn: CsvColumn = { header: 'Time', id: 'ts' }

export const trafficCards: Record<AnalyticsDashboardCardId, TrafficCard> = {
  requests: {
    label: 'Requests over time',
    description: 'Sum of requests served by every service, per interval.',
    limit: 10000,
    groupBy: ['ts'],
    orderBy: 'ts_ASC',
    columns: [timeColumn, { header: 'Requests', id: 'requests' }]
  },
  'status-codes': {
    label: 'Status codes',
    description: 'Sum of requests per status class. Switch to Bar to stack the classes.',
    limit: 10000,
    groupBy: ['ts', 'status'],
    orderBy: 'ts_ASC',
    columns: [
      timeColumn,
      ...['2xx', '3xx', '4xx', '5xx'].map((id) => ({ header: `Status ${id}`, id }))
    ]
  },
  countries: {
    label: 'Requests by country',
    description: 'Sum of requests per country of origin, top countries first.',
    limit: 10,
    groupBy: ['geolocCountryName'],
    orderBy: 'sum_DESC',
    columns: [
      { header: 'Country', id: 'country' },
      { header: 'Requests', id: 'requests' }
    ]
  },
  hosts: {
    label: 'Top hosts',
    description: 'Hosts that served the most requests in the period, with their service.',
    limit: 1000,
    groupBy: ['host', 'configurationId'],
    orderBy: 'sum_DESC',
    columns: [
      { header: 'Host', id: 'host' },
      { header: 'Service', id: 'service' },
      { header: 'Requests', id: 'requests' }
    ]
  }
}
