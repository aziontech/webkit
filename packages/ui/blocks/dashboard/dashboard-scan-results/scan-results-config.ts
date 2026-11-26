import type { ChartColor } from '@aziontech/ui/chart'
import type { TableColumn } from '@aziontech/ui/data-table'
import type { TagSeverity } from '@aziontech/ui/tag'

import type {
  ScanResultsSource,
  ScanResultsSummary,
  ScanResultsVerdict
} from './dashboard-scan-results.vue'

/** One option of a Submissions filter. */
export interface ScanFilterOption {
  /** The value the filter writes. */
  value: string
  /** The label the filter shows. */
  label: string
}

export const scanFigures: {
  key: keyof ScanResultsSummary
  label: string
  description: string
}[] = [
  {
    key: 'submitted',
    label: 'Submitted',
    description: 'Items sent for analysis in the selected period.'
  },
  {
    key: 'analyzing',
    label: 'In analysis',
    description: 'Items waiting for a verdict right now.'
  },
  {
    key: 'last24h',
    label: 'Last 24 hours',
    description: 'Items submitted in the last 24 hours.'
  },
  {
    key: 'flagged',
    label: 'Flagged',
    description: 'Items whose verdict marks them as harmful.'
  },
  {
    key: 'held',
    label: 'Held for a verdict',
    description: 'Deliveries paused until their analysis finishes.'
  },
  {
    key: 'alertsOpen',
    label: 'Open alerts',
    description: 'Items delivered before they were flagged that nobody has reviewed yet.'
  }
]

export const scanVerdicts: Record<
  ScanResultsVerdict,
  { label: string; severity: TagSeverity; color: ChartColor }
> = {
  clean: {
    label: 'Clean',
    severity: 'success',
    color: 'success'
  },
  suspicious: {
    label: 'Suspicious',
    severity: 'warning',
    color: 'warning'
  },
  flagged: {
    label: 'Flagged',
    severity: 'danger',
    color: 'danger'
  },
  pending: {
    label: 'Pending',
    severity: 'neutral',
    color: 'other'
  }
}

export const scanSourceLabels: Record<ScanResultsSource, string> = {
  inline: 'Inline scan',
  api: 'API submission',
  upload: 'Manual upload',
  scheduled: 'Scheduled scan'
}

export const scanStatusOptions: ScanFilterOption[] = [
  {
    value: 'all',
    label: 'Any status'
  },
  {
    value: 'analyzing',
    label: 'In analysis'
  },
  {
    value: 'completed',
    label: 'Completed'
  }
]

export const scanVerdictOptions: ScanFilterOption[] = [
  {
    value: 'all',
    label: 'Any verdict'
  },
  {
    value: 'clean',
    label: 'Clean'
  },
  {
    value: 'suspicious',
    label: 'Suspicious'
  },
  {
    value: 'flagged',
    label: 'Flagged'
  }
]

export const scanSourceOptions: ScanFilterOption[] = [
  {
    value: 'all',
    label: 'Any source'
  },
  {
    value: 'inline',
    label: 'Inline scan'
  },
  {
    value: 'api',
    label: 'API submission'
  },
  {
    value: 'upload',
    label: 'Manual upload'
  },
  {
    value: 'scheduled',
    label: 'Scheduled scan'
  }
]

export const scanColumns: TableColumn[] = [
  {
    accessorKey: 'name',
    id: 'name',
    header: 'Name',
    align: 'start',
    sortable: true,
    principal: true,
    grow: 2
  },
  {
    accessorKey: 'verdict',
    id: 'verdict',
    header: 'Verdict',
    align: 'start',
    sortable: true,
    minWidth: 112
  },
  {
    accessorKey: 'category',
    id: 'category',
    header: 'Category',
    align: 'start',
    sortable: true,
    minWidth: 112
  },
  {
    accessorKey: 'score',
    id: 'score',
    header: 'Score',
    align: 'end',
    sortable: true,
    minWidth: 80
  },
  {
    accessorKey: 'type',
    id: 'type',
    header: 'Type',
    align: 'start',
    sortable: true,
    minWidth: 128
  },
  {
    accessorKey: 'size',
    id: 'size',
    header: 'Size',
    align: 'end',
    sortable: true,
    minWidth: 88
  },
  {
    accessorKey: 'source',
    id: 'source',
    header: 'Source',
    align: 'start',
    sortable: true,
    minWidth: 128
  },
  {
    accessorKey: 'submitter',
    id: 'submitter',
    header: 'First submitter',
    align: 'start',
    sortable: true,
    minWidth: 128
  },
  {
    accessorKey: 'lastSeen',
    id: 'lastSeen',
    header: 'Last seen',
    align: 'start',
    sortable: true,
    minWidth: 136
  }
]

const sizeUnits = ['B', 'KB', 'MB', 'GB']

export const formatScanSize = (
  value: number,
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
): string => {
  let size = value
  let unit = 0
  while (size >= 1000 && unit < sizeUnits.length - 1) {
    size /= 1000
    unit += 1
  }
  return `${formatNumber(size, { minimumFractionDigits: unit ? 1 : 0, maximumFractionDigits: unit ? 1 : 0 })} ${sizeUnits[unit]}`
}

export const formatScanScore = (value: number | null): string =>
  value === null ? '—' : String(value)
