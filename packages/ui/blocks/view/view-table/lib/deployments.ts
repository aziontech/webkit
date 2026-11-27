import type { TableColumn } from '@aziontech/ui/data-table'
import type { StatusIndicatorSeverity } from '@aziontech/ui/status-indicator'
import type { TagSeverity } from '@aziontech/ui/tag'
import type { FilteringProperty } from '@aziontech/ui/use-collection'

/** Where a deployment run stands. */
export type DeploymentStatus = 'Ready' | 'Building' | 'Failed' | 'Queued' | 'Canceled'

/** One run of the deployments list. */
export interface Deployment {
  /** The run id, the row key. */
  id: string
  /** The version the run deployed. */
  version: string
  /** The run serves its project's environment now. */
  current: boolean
  /** Where the run stands. */
  status: DeploymentStatus
  /** How long the run took, empty while it has not finished. */
  duration: string
  /** The project name. */
  project: string
  /** The project id, for its link. */
  projectId: string
  /** The environment the run deployed to. */
  environment: string
  /** Who started the run. */
  author: string
  /** When the run started. */
  deployedAt: Date
}

export const DEPLOYMENT_STATUS: Record<
  DeploymentStatus,
  { severity: StatusIndicatorSeverity; loading: boolean }
> = {
  Ready: { severity: 'success', loading: false },
  Building: { severity: 'info', loading: true },
  Failed: { severity: 'danger', loading: false },
  Queued: { severity: 'neutral', loading: false },
  Canceled: { severity: 'neutral', loading: false }
}

export const environmentSeverity = (environment: string): TagSeverity =>
  environment === 'Production' ? 'info' : 'neutral'

const authors = ['Jane Doe', 'John Smith', 'Alex Morgan', 'Sam Lee', 'Priya Patel']

export const deploymentProperties: FilteringProperty[] = [
  { key: 'version', label: 'Version' },
  {
    key: 'status',
    label: 'Status',
    options: (Object.keys(DEPLOYMENT_STATUS) as DeploymentStatus[]).map((value) => ({ value }))
  },
  { key: 'project', label: 'Project' },
  {
    key: 'environment',
    label: 'Environment',
    options: [{ value: 'Production' }, { value: 'Staging' }, { value: 'Preview' }]
  },
  { key: 'author', label: 'Author', options: authors.map((value) => ({ value })) }
]

export const deploymentColumns: TableColumn[] = [
  {
    accessorKey: 'version',
    header: 'Version',
    sortable: true,
    principal: true,
    hideable: false
  },
  { accessorKey: 'id', header: 'ID', minWidth: 80 },
  { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 128 },
  { accessorKey: 'project', header: 'Project', sortable: true, grow: 2 },
  { accessorKey: 'environment', header: 'Environment', sortable: true, minWidth: 104 },
  { accessorKey: 'deployedAt', header: 'Deployed', sortable: true, minWidth: 120 },
  { id: 'actions', type: 'action', hideable: false }
]
