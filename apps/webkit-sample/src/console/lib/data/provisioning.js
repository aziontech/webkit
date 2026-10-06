import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'
import { computed, ref } from 'vue'

import { workloadById } from './workloads'

const PRESET_ALIASES = {
  nextjs: 'next',
  'next.js': 'next',
  nuxtjs: 'nuxt',
  sveltekit: 'svelte',
  reactjs: 'react',
  vuejs: 'vue'
}

const normalizePreset = (framework) => {
  const key = String(framework || '')
    .trim()
    .toLowerCase()
  return PRESET_ALIASES[key] ?? key
}

const slugify = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'my-application'

const resourceId = () => String(1_000_000_000 + Math.floor(Math.random() * 900_000_000))

export const AZION_DOMAIN_SUFFIX = '.azion.run'

const domainLabel = () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from(
    { length: 10 },
    () => alphabet[Math.floor(Math.random() * alphabet.length)]
  ).join('')
}

const STORAGE_KEY = 'webkit-sample:provisioned-deployments'

const toDate = (value) => (value ? new Date(value) : null)

const reviveRecord = (record) => ({
  ...record,
  createdAt: toDate(record.createdAt),
  workload: record.workload
    ? {
        ...record.workload,
        modifiedAt: toDate(record.workload.modifiedAt),
        createdAt: toDate(record.workload.createdAt ?? record.createdAt)
      }
    : null,
  application: { ...record.application, modifiedAt: toDate(record.application?.modifiedAt) }
})

const loadRecords = () => {
  try {
    const raw = globalThis.sessionStorage?.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.map(reviveRecord) : []
  } catch {
    return []
  }
}

const deployments = ref(loadRecords())

const persistRecords = () => {
  try {
    globalThis.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(deployments.value))
  } catch {}
}

export function provisionDeployment({
  repoName,
  scope = 'gab-az',
  framework = '',
  isPublic = true,
  templateTitle = '',
  applicationName = '',
  applicationBound = false,
  domain: domainInput = '',
  firewall = false,
  firewallName = '',
  firewallModules = [],
  firewallBound = false,
  firewallId = '',
  connector: connectorInput = null,
  cachePolicies: cachePoliciesInput = [],
  publish = true,
  source = 'git',
  customDomains = []
} = {}) {
  const name = slugify(repoName || templateTitle)
  const createdAt = new Date()
  const lastModified = formatListDate(createdAt)
  const author = authorAt(0)
  const preset = normalizePreset(framework)

  const domain = domainInput || `${domainLabel()}${AZION_DOMAIN_SUFFIX}`
  const appName = applicationName ? slugify(applicationName) : name
  const bucketName = `${name}-assets`

  const workload = publish
    ? {
        id: resourceId(),
        name,
        domain,
        domains: [domain],
        domainCount: 0,
        status: 'Live',
        url: `https://${domain}`,
        environment: 'Production',
        modifiedAt: createdAt,
        createdAt,
        lastModified,
        owner: author.name,
        ownerAvatar: author.avatar
      }
    : null

  const application = {
    id: resourceId(),
    name: appName,
    preset,
    bound: Boolean(applicationBound),
    source,
    repository: source === 'git' ? `${scope}/${appName}` : '',
    branch: source === 'git' ? 'main' : '',
    domainName: domain,
    customDomains,
    modifiedAt: createdAt,
    lastModified,
    author: author.name,
    authorAvatar: author.avatar
  }

  const connector =
    connectorInput || publish
      ? {
          id: resourceId(),
          name: connectorInput?.name || `${name}-storage`,
          kind: connectorInput?.kind || 'Object Storage',
          address: connectorInput?.address || bucketName,
          status: 'Active'
        }
      : null

  const cachePolicies = (cachePoliciesInput ?? []).map((policy) => ({
    id: resourceId(),
    name: policy.name,
    detail: policy.detail ?? '',
    status: 'Active'
  }))

  const firewallRecord = firewall
    ? {
        id: firewallId || resourceId(),
        name: firewallName || `${name}-firewall`,
        status: 'Active',
        bound: Boolean(firewallBound),
        modules: firewallModules,
        modifiedAt: createdAt,
        lastModified
      }
    : null

  const bucket = publish
    ? {
        id: bucketName,
        name: bucketName,
        access: isPublic ? 'Public' : 'Private',
        objects: 24,
        size: '1.2 MB',
        lastModified,
        author: author.name,
        authorAvatar: author.avatar
      }
    : null

  const record = {
    id: workload?.id ?? application.id,
    createdAt,
    published: publish,
    scope,
    visibility: isPublic ? 'Public' : 'Private',
    repository: `${scope}/${name}`,
    versionId: publish ? String(1_200_000_000 + Math.floor(Math.random() * 99_999_999)) : '',
    preset,
    author,
    workload,
    application,
    firewall: firewallRecord,
    connector,
    cachePolicies,
    bucket
  }

  deployments.value.unshift(record)
  persistRecords()
  return record
}

export function publishDeployment(recordId) {
  const record = deployments.value.find((entry) => entry.id === String(recordId))
  if (!record) return undefined
  if (record.published) return record

  const name = record.application.name
  const createdAt = new Date()
  const lastModified = formatListDate(createdAt)
  const author = record.author ?? authorAt(0)
  const domain = `${domainLabel()}${AZION_DOMAIN_SUFFIX}`
  const bucketName = `${name}-assets`

  record.workload = {
    id: resourceId(),
    name,
    domain,
    domains: [domain],
    domainCount: 0,
    status: 'Live',
    url: `https://${domain}`,
    environment: 'Production',
    modifiedAt: createdAt,
    lastModified,
    owner: author.name,
    ownerAvatar: author.avatar
  }

  record.bucket = {
    id: bucketName,
    name: bucketName,
    access: record.visibility === 'Private' ? 'Private' : 'Public',
    objects: 24,
    size: '1.2 MB',
    lastModified,
    author: author.name,
    authorAvatar: author.avatar
  }

  record.connector ??= {
    id: resourceId(),
    name: `${name}-storage`,
    kind: 'Object Storage',
    address: bucketName,
    status: 'Active'
  }

  record.versionId = String(1_200_000_000 + Math.floor(Math.random() * 99_999_999))
  record.published = true
  record.id = record.workload.id
  persistRecords()
  return record
}

const derivedId = (seed) => {
  let hash = 0
  for (const char of String(seed)) hash = (hash * 31 + char.codePointAt(0)) % 900_000_000
  return String(1_000_000_000 + hash)
}

export function demoDeployment(workloadId, workloadName = 'Workload Name') {
  const id = String(workloadId)
  const author = authorAt(0)
  const seeded = workloadById(id)
  const name = slugify(seeded?.name || workloadName)
  const domain = seeded?.domain || `w${id}${AZION_DOMAIN_SUFFIX}`
  const bucketName = `${name}-assets`

  return {
    id,
    createdAt: null,
    scope: 'gab-az',
    visibility: 'Public',
    repository: `gab-az/${name}`,
    versionId: derivedId(`version-${id}`),
    preset: 'vue',
    author,
    workload: {
      id,
      name: seeded?.name || workloadName,
      domain,
      domains: seeded?.domains ?? [domain],
      domainCount: seeded?.domainCount ?? 0,
      status: seeded?.status || 'Live',
      url: `https://${domain}`,
      environment: 'Production',
      modifiedAt: seeded?.modifiedAt ?? null,
      createdAt: seeded?.createdAt ?? daysAgo(60 + (Number(derivedId(`created-${id}`)) % 300)),
      lastModified: seeded?.lastModified || '',
      owner: seeded?.owner || author.name,
      ownerAvatar: seeded?.ownerAvatar || author.avatar
    },
    application: {
      id: derivedId(`application-${id}`),
      name,
      preset: 'vue',
      source: 'git',
      repository: `gab-az/${name}`,
      branch: 'main',
      domainName: domain,
      status: 'Active'
    },
    connector: {
      id: derivedId(`connector-${id}`),
      name: `${name}-storage`,
      kind: 'Object Storage',
      address: bucketName,
      status: 'Active'
    },
    bucket: {
      id: bucketName,
      name: bucketName,
      access: 'Public',
      objects: 24,
      size: '1.2 MB'
    }
  }
}

export const findDeploymentByWorkload = (workloadId) =>
  deployments.value.find((record) => record.workload?.id === String(workloadId))

export const findDeploymentByVersion = (versionId) =>
  deployments.value.find((record) => record.versionId === String(versionId))

export const provisionedDeployRow = (record) => ({
  id: `deployment-${record.versionId}`,
  versionId: record.versionId,
  workloadId: record.workload.id,
  workloadName: record.workload.name,
  environment: 'Production',
  current: true,
  status: 'Ready',
  duration: '42s',
  deployedAt: record.createdAt,
  date: formatListDate(record.createdAt),
  resourceType: 'application',
  resourceName: record.application.name,
  resourceId: record.application.id,
  author: record.author.name,
  authorEmail: emailOf(record.author.name),
  authorAvatar: record.author.avatar,
  url: record.workload.url,
  trigger: 'console'
})

export const findDeploymentByApplication = (applicationId) =>
  deployments.value.find((record) => record.application.id === String(applicationId))

export function removeDeployment(resourceIdentifier) {
  const id = String(resourceIdentifier)
  const index = deployments.value.findIndex(
    (record) =>
      record.workload?.id === id ||
      record.application.id === id ||
      record.connector?.id === id ||
      record.bucket?.id === id
  )
  if (index === -1) return false
  deployments.value.splice(index, 1)
  persistRecords()
  return true
}

export const provisionedWorkloads = computed(() =>
  deployments.value.map((record) => record.workload).filter(Boolean)
)
export const provisionedApplications = computed(() =>
  deployments.value.map((record) => record.application).filter((app) => app && !app.bound)
)
export const provisionedBuckets = computed(() =>
  deployments.value.map((record) => record.bucket).filter(Boolean)
)

export function resourceChain(record) {
  const { workload, application, firewall, connector, bucket } = record
  const cachePolicies = record.cachePolicies ?? (record.cachePolicy ? [record.cachePolicy] : [])
  return [
    workload && {
      key: 'workload',
      kind: 'Workload',
      icon: 'ai ai-workloads',
      name: workload.name,
      status: 'Live',
      href: `/workloads/${workload.id}`,
      reference: workload.id,
      fields: [
        { label: 'ID', value: workload.id },
        { label: 'Domain', value: workload.domain, copy: true, url: workload.url },
        { label: 'Environment', value: workload.environment }
      ]
    },
    firewall && {
      key: 'firewall',
      kind: 'Firewall',
      icon: 'ai ai-edge-firewall',
      name: firewall.name,
      status: firewall.status,
      state: firewall.bound ? 'bound' : 'created',
      href: `/firewall/${firewall.id}/settings`,
      reference: firewall.id,
      fields: [
        { label: 'ID', value: firewall.id },
        { label: 'Modules', value: firewall.modules.join(', ') || 'None' },
        { label: 'Status', value: firewall.status }
      ]
    },
    {
      key: 'application',
      kind: 'Application',
      icon: 'ai ai-edge-application',
      name: application.name,
      status: 'Active',
      state: application.bound ? 'bound' : 'created',
      href: `/applications/${application.id}`,
      reference: application.id,
      fields: [
        { label: 'ID', value: application.id },
        { label: 'Repository', value: application.repository },
        { label: 'Branch', value: application.branch }
      ]
    },
    connector && {
      key: 'connector',
      kind: 'Connector',
      icon: 'ai ai-edge-connectors',
      name: connector.name,
      status: 'Active',
      href: `/connectors/${connector.id}/settings`,
      reference: connector.id,
      fields: [
        { label: 'ID', value: connector.id },
        { label: 'Type', value: connector.kind },
        { label: 'Address', value: connector.address }
      ]
    },
    ...cachePolicies.map((cachePolicy) => ({
      key: `cache-policy-${cachePolicy.id}`,
      kind: 'Cache Settings',
      icon: 'ai ai-tiered-cache',
      name: cachePolicy.name,
      status: 'Active',
      href: `/applications/${application.id}`,
      reference: cachePolicy.id,
      fields: [
        { label: 'ID', value: cachePolicy.id },
        { label: 'Template', value: cachePolicy.detail || '—' },
        { label: 'Status', value: cachePolicy.status }
      ]
    })),
    bucket && {
      key: 'storage',
      kind: 'Storage',
      icon: 'ai ai-edge-storage',
      name: bucket.name,
      status: bucket.access,
      href: `/object-storage/${bucket.name}`,
      reference: `${bucket.objects} objects · ${bucket.size}`,
      fields: [
        { label: 'Access', value: bucket.access },
        { label: 'Objects', value: String(bucket.objects) },
        { label: 'Size', value: bucket.size }
      ]
    }
  ].filter(Boolean)
}
