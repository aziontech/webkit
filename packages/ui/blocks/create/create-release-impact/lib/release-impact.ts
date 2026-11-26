import type {
  ReleaseImpactResource,
  ReleaseImpactResourceType,
  ReleaseImpactVersion
} from '../types'

export interface ResourceTypeMeta {
  label: string
  icon: string
}

export interface VersionedResource {
  versionId: string
  versions: ReleaseImpactVersion[]
}

export const LATEST = 'latest'

export const resourceTypes: Record<ReleaseImpactResourceType, ResourceTypeMeta> = {
  service: { label: 'Service', icon: 'az az-server' },
  policy: { label: 'Policy', icon: 'az az-shield' },
  storage: { label: 'Storage', icon: 'az az-inbox' },
  errorPage: { label: 'Error page', icon: 'az az-file' },
  module: { label: 'Modules', icon: 'az az-code' },
  integration: { label: 'Integrations', icon: 'az az-link' }
}

export const cloneResource = (card: ReleaseImpactResource): ReleaseImpactResource => ({
  ...card,
  versions: card.versions.map((version) => ({ ...version })),
  groups: card.groups.map((group) => ({
    ...group,
    rows: group.rows.map((row) => ({
      ...row,
      versions: row.versions.map((version) => ({ ...version }))
    }))
  }))
})

export const plural = (count: number, one: string, other: string) =>
  `${count} ${count === 1 ? one : other}`

export const versionLabel = (card: VersionedResource, id: unknown) => {
  if (id === LATEST) return 'Track latest Ready'
  return card.versions.find((version) => version.id === id)?.id ?? String(id)
}

export const resolvedVersion = (card: ReleaseImpactResource) =>
  card.versionId === LATEST
    ? (card.versions.find((version) => version.current)?.id ?? '')
    : card.versionId

export const dependencyCount = (card: ReleaseImpactResource) =>
  card.groups.reduce((total, group) => total + group.rows.length, 0)
