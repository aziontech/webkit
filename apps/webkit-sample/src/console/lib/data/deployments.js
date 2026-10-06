import { deployById, stepsOf } from '@shared/lib/azion-deploys'
import { computed } from 'vue'

import { DATE_PRESETS, formatDateRange, matchDate } from '../behavior/filter-bar'
import {
  applicationDeploymentRows,
  deploymentByVersion,
  deploymentRowsFor
} from './deployment-history'
import { environments } from './environments'
import { findDeploymentByVersion, provisionedDeployRow } from './provisioning'
import { resourceMeta, RESOURCES, resourceTypeKey } from './versioning'

export const STATUS_SEVERITY = {
  Ready: { severity: 'success', loading: false },
  Building: { severity: 'info', loading: true },
  Queued: { severity: 'warning', loading: false },
  Error: { severity: 'danger', loading: false },
  Draft: { severity: 'neutral', loading: false }
}

export const statusMeta = (status) =>
  STATUS_SEVERITY[status] ?? { severity: 'neutral', loading: false }

export const statusOptions = Object.keys(STATUS_SEVERITY).map((value) => ({
  value,
  label: value
}))

export { resourceMeta, RESOURCES, resourceTypeKey }

const resourceTypeOptions = (rows = []) =>
  [...new Set(rows.map((row) => row.resourceType).filter(Boolean))]
    .map((value) => ({ value, label: resourceMeta(value).label }))
    .sort((a, b) => a.label.localeCompare(b.label))

export const resourceHref = (row) => {
  const { path } = resourceMeta(row.resourceType)
  return path && row.resourceId ? `${path}/${row.resourceId}` : ''
}

export const environmentOptions = computed(() =>
  environments.value.map((environment) => ({ value: environment.name, label: environment.name }))
)

export const environmentSeverity = () => 'secondary'

export const deploymentFilterFields = (rows = [], { deployed = false } = {}) => {
  const authorOptions = [...new Map(rows.map((row) => [row.authorEmail, row])).values()]
    .filter((row) => row.authorEmail)
    .map((row) => ({
      value: row.authorEmail,
      label: row.author || row.authorEmail,
      avatar: row.authorAvatar
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  return [
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: statusOptions,
      match: (row, values) => values.includes(row.status)
    },
    {
      id: 'resourceType',
      label: 'Type',
      kind: 'options',
      options: resourceTypeOptions(rows),
      match: (row, values) => values.includes(row.resourceType)
    },
    {
      id: 'environment',
      label: 'Environment',
      kind: 'options',
      options: environmentOptions.value,
      match: (row, values) => values.includes(row.environment)
    },
    {
      id: 'author',
      label: 'Author',
      kind: 'options',
      options: authorOptions,
      match: (row, values) => values.includes(row.authorEmail)
    },
    ...(deployed
      ? [
          {
            id: 'deployed',
            label: 'Deployed',
            kind: 'range',
            options: DATE_PRESETS,
            formatValue: formatDateRange,
            match: (row, values) => matchDate(row.date, values)
          }
        ]
      : [])
  ]
}

export const deployPageRecord = (
  id,
  { workloadId = '', workloadName = '', applicationId = '', applicationName = '' } = {}
) => {
  const recorded = deployById(String(id))
  if (recorded)
    return {
      ...recorded,
      resource: {
        type: 'application',
        name: recorded.application.name,
        id: recorded.application.id
      },
      steps: stepsOf(recorded)
    }

  const provisioned = findDeploymentByVersion(id)
  const row =
    deploymentByVersion(id) ??
    (provisioned ? provisionedDeployRow(provisioned) : undefined) ??
    (workloadId
      ? deploymentRowsFor(workloadId, workloadName || undefined).find(
          (candidate) => candidate.versionId === String(id)
        )
      : undefined) ??
    (applicationId
      ? applicationDeploymentRows(applicationId, applicationName || undefined).find(
          (candidate) => candidate.versionId === String(id)
        )
      : undefined)
  if (!row) return undefined

  return {
    id: row.versionId,
    status: row.status,
    environment: row.environment,
    createdAt: row.deployedAt,
    duration: row.duration,
    author: row.author,
    authorEmail: row.authorEmail,
    authorAvatar: row.authorAvatar,
    current: row.current,
    workload: { id: row.workloadId, name: row.workloadName, domain: '' },
    resource: { type: row.resourceType, name: row.resourceName, id: row.resourceId },
    trigger: row.trigger ?? '',
    edge: null,
    url: row.url ?? '',
    error: null,
    steps: [],
    failedAt: '',
    activeStep: ''
  }
}
