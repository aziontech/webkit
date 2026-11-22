import type { TableColumn } from '@aziontech/webkit/data-table'
import { toast } from '@aziontech/webkit/toast'
import { copyText } from '@aziontech/webkit/utils/clipboard'
import { type CsvColumn, downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'

import type { SecurityCardId, SecurityPeriodRange } from './dashboard-security.vue'

/** The fixed part of one card: its title, its query and its CSV columns. */
export interface SecurityCardSpec {
  /** The card title. */
  label: string
  /** One sentence on what the card counts. */
  description: string
  /** What did not load, written in the error alert. */
  subject: string
  /** Fields the copied query returns. */
  fields: string[]
  /** Order of the rows of the copied query. */
  orderBy: string
  /** The CSV columns. */
  columns: CsvColumn[]
}

/** What a card menu copies and exports. */
export interface SecurityOption {
  /** The query Copy query writes. */
  query: string
  /** The file Export CSV downloads. */
  filename: string
  /** The CSV columns. */
  columns: CsvColumn[]
  /** The CSV rows, read when the export runs. */
  rows: () => object[]
}

const ipColumn = (id: string, header: string): TableColumn => ({
  accessorKey: id,
  id,
  header,
  align: id === 'requests' ? 'end' : 'start',
  sortable: true,
  principal: id === 'remoteAddress'
})

export const ipColumns: TableColumn[] = [
  ipColumn('remoteAddress', 'IP address'),
  ipColumn('asn', 'Network'),
  ipColumn('country', 'Country'),
  ipColumn('category', 'Main attack'),
  ipColumn('requests', 'Blocked requests')
]

const blockedColumn: CsvColumn = { header: 'Blocked requests', id: 'value' }

export const securityCards: Record<SecurityCardId, SecurityCardSpec> = {
  matched: {
    label: 'Matched requests over time',
    description: 'Requests that matched a rule: blocked, or logged and allowed through.',
    subject: 'matched requests over time',
    fields: ['ts', 'action', 'requests'],
    orderBy: 'ts_ASC',
    columns: [
      { header: 'Time', id: 'ts' },
      { header: 'Blocked', id: 'blocked' },
      { header: 'Logged', id: 'logged' }
    ]
  },
  categories: {
    label: 'Blocked requests by attack category',
    description: 'Blocked requests, broken down by the attack category of the rule they matched.',
    subject: 'blocked requests by attack category',
    fields: ['attackCategory', 'requests'],
    orderBy: 'requests_DESC',
    columns: [{ header: 'Attack category', id: 'name' }, blockedColumn]
  },
  countries: {
    label: 'Blocked requests by country',
    description: 'Blocked requests, broken down by the country they came from.',
    subject: 'blocked requests by country',
    fields: ['country', 'requests'],
    orderBy: 'requests_DESC',
    columns: [{ header: 'Country', id: 'name' }, blockedColumn]
  },
  ips: {
    label: 'Top source IPs by blocked requests',
    description: 'The addresses blocked most often, with their network and main attack.',
    subject: 'top source IPs by blocked requests',
    fields: ['remoteAddress', 'asn', 'country', 'attackCategory', 'requests'],
    orderBy: 'requests_DESC',
    columns: ipColumns.map((column) => ({
      header: String(column.header),
      id: column.id ?? ''
    }))
  }
}

export const securityQuery = (card: SecurityCardSpec, range: SecurityPeriodRange): string => {
  const lines = [
    'query {',
    '  securityMetrics(',
    '    limit: 5000',
    '    aggregate: { sum: requests }'
  ]
  lines.push(`    filter: { tsRange: { begin: "${range.begin}", end: "${range.end}" } }`)
  lines.push(`    orderBy: [${card.orderBy}]`, '  ) {')
  for (const field of card.fields) lines.push(`    ${field}`)
  lines.push('  }', '}')
  return lines.join('\n')
}

export const runSecurityOption = async (
  value: string | number,
  option: SecurityOption
): Promise<void> => {
  if (value !== 'query') {
    downloadCsv(option.filename, toCsv({ columns: option.columns, rows: option.rows() }))
    toast.success('CSV exported.', { description: option.filename })
    return
  }
  if (await copyText(option.query)) {
    toast.success('Query copied.', {
      description: 'Paste it into any GraphQL client that sends your token.'
    })
  } else {
    toast.error('The query could not be copied.')
  }
}
