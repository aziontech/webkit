import { FIT_COLUMN, TAG_COLUMN_WIDE } from '../behavior/table-columns'

export const DEPLOYMENT_COLUMNS = [
  {
    accessorKey: 'versionId',
    header: 'Version',
    enableSorting: true,
    principal: true,
    hideable: false
  },
  { accessorKey: 'id', header: 'ID', minWidth: FIT_COLUMN },
  { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: FIT_COLUMN },
  { accessorKey: 'workloadName', header: 'Workload', enableSorting: true, grow: 2 },
  {
    accessorKey: 'environment',
    header: 'Environment',
    enableSorting: true,
    minWidth: TAG_COLUMN_WIDE
  },
  { accessorKey: 'author', header: 'Last Editor', enableSorting: true, minWidth: FIT_COLUMN },
  { accessorKey: 'date', header: 'Deployed', enableSorting: true, minWidth: FIT_COLUMN },
  { id: 'actions', kind: 'action', hideable: false }
]
