// Provisioning registry — what a deploy actually creates.
//
// Finishing a deploy in the console does not create "an app": it provisions a
// CHAIN of four resources, in this order —
//
//   Workload  →  Application  →  Connector  →  Storage (bucket)
//
// the workload is the public entry point (domain + environments), the
// application is the built code behind it, the connector is the origin binding
// the application reads from, and the storage bucket holds the uploaded static
// assets. Every screen that shows one of them shows the same record, so the
// chain is consistent from the success screen through the workload topology and
// the module lists.
//
// This module is the single store for those records, kept in `sessionStorage` so
// a reload does not erase what the demo just created (a new tab starts clean).
// `provisionDeployment()` is called once, when the deployment finishes; the list views prepend
// `provisionedWorkloads` / `provisionedApplications` / `provisionedBuckets` to
// their mock data so a just-deployed resource is immediately manageable.
import { computed, ref } from 'vue'

import { formatListDate } from './dates'
import { authorAt, emailOf } from './people'

// The framework the template declares (`framework` in templates.js) is not
// always the build preset the console shows on an Application row — normalize
// the aliases onto the preset keys Applications.vue knows how to render.
const PRESET_ALIASES = {
  nextjs: 'next',
  'next.js': 'next',
  nuxtjs: 'nuxt',
  sveltekit: 'svelte',
  solidjs: 'solid',
  reactjs: 'react',
  vuejs: 'vue'
}

const normalizePreset = (framework) => {
  const key = String(framework || '')
    .trim()
    .toLowerCase()
  return PRESET_ALIASES[key] ?? key
}

/** Repository-safe slug: lowercase, dash-separated, no leading/trailing dashes. */
const slugify = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'my-application'

/** Azion-style numeric resource id (10 digits). */
const resourceId = () => String(1_000_000_000 + Math.floor(Math.random() * 900_000_000))

/** The random subdomain label an Azion workload domain gets on creation. */
const domainLabel = () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from(
    { length: 10 },
    () => alphabet[Math.floor(Math.random() * alphabet.length)]
  ).join('')
}

// Session-scoped persistence: the demo is clicked through and reloaded, and a
// resource that disappears on F5 reads as a bug rather than as a mock. The
// records live in `sessionStorage` (not `localStorage`) so a new tab starts from
// the clean catalog. `Date` fields are revived by hand — JSON has no date type,
// and the list views compare `modifiedAt` as a real Date.
const STORAGE_KEY = 'webkit-sample:provisioned-deployments'

const toDate = (value) => (value ? new Date(value) : null)

const reviveRecord = (record) => ({
  ...record,
  createdAt: toDate(record.createdAt),
  workload: { ...record.workload, modifiedAt: toDate(record.workload?.modifiedAt) },
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

// Newest first — a deploy unshifts its record, so the lists show it on top.
const deployments = ref(loadRecords())

const persistRecords = () => {
  try {
    globalThis.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(deployments.value))
  } catch {
    // A full or unavailable sessionStorage must not break the deploy flow.
  }
}

/**
 * Provision the resource chain for a finished deployment.
 *
 * @param {object} input
 * @param {string} input.repoName Repository name entered on the deploy form.
 * @param {string} [input.scope] Git scope (account / organization).
 * @param {string} [input.framework] Template framework, mapped to a build preset.
 * @param {boolean} [input.isPublic] Repository visibility; also the bucket access.
 * @param {string} [input.templateTitle] Fallback name when there is no repo name.
 * @returns {object} The stored record: `{ id, workload, application, connector, bucket, … }`.
 */
export function provisionDeployment({
  repoName,
  scope = 'gab-az',
  framework = '',
  isPublic = true,
  templateTitle = ''
} = {}) {
  const name = slugify(repoName || templateTitle)
  const createdAt = new Date()
  const lastModified = formatListDate(createdAt)
  // The deploying user — index 0 of the shared roster, so the author already
  // exists in every list's author filter options.
  const author = authorAt(0)
  const preset = normalizePreset(framework)

  const domain = `${domainLabel()}.map.azionedge.net`
  const bucketName = `${name}-assets`

  const workload = {
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

  const application = {
    id: resourceId(),
    name,
    preset,
    repository: `${scope}/${name}`,
    branch: 'main',
    domainName: domain,
    infrastructure: 'Production',
    status: 'Active',
    modifiedAt: createdAt,
    lastModified,
    author: author.name,
    authorAvatar: author.avatar
  }

  const connector = {
    id: resourceId(),
    name: `${name}-storage`,
    kind: 'Edge Storage',
    address: bucketName,
    status: 'Active'
  }

  const bucket = {
    id: bucketName,
    name: bucketName,
    access: isPublic ? 'Public' : 'Private',
    objects: 24,
    size: '1.2 MB',
    lastModified,
    author: author.name,
    authorAvatar: author.avatar
  }

  const record = {
    id: workload.id,
    createdAt,
    scope,
    visibility: isPublic ? 'Public' : 'Private',
    repository: `${scope}/${name}`,
    versionId: String(1_200_000_000 + Math.floor(Math.random() * 99_999_999)),
    preset,
    author,
    workload,
    application,
    connector,
    bucket
  }

  deployments.value.unshift(record)
  persistRecords()
  return record
}

/** A stable pseudo-random id derived from a seed, so a re-render never changes it. */
const derivedId = (seed) => {
  let hash = 0
  for (const char of String(seed)) hash = (hash * 31 + char.codePointAt(0)) % 900_000_000
  return String(1_000_000_000 + hash)
}

/**
 * The same chain for a workload that predates this session — the mock rows in
 * the Workloads list were never "provisioned" here, but their detail view still
 * has to show the four resources. Derived from the id + name, so it is stable
 * across renders and reloads instead of re-randomizing per visit.
 *
 * @param {string} workloadId The workload's id (from the route).
 * @param {string} [workloadName] Display name carried by the list link.
 * @returns {object} A record shaped exactly like `provisionDeployment()`'s.
 */
export function demoDeployment(workloadId, workloadName = 'Workload Name') {
  const id = String(workloadId)
  const name = slugify(workloadName)
  const author = authorAt(0)
  const domain = `w${id}.map.azion.net`
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
      name: workloadName,
      domain,
      domains: [domain],
      domainCount: 0,
      status: 'Live',
      url: `https://${domain}`,
      environment: 'Production',
      owner: author.name,
      ownerAvatar: author.avatar
    },
    application: {
      id: derivedId(`application-${id}`),
      name,
      preset: 'vue',
      repository: `gab-az/${name}`,
      branch: 'main',
      domainName: domain,
      infrastructure: 'Production',
      status: 'Active'
    },
    connector: {
      id: derivedId(`connector-${id}`),
      name: `${name}-storage`,
      kind: 'Edge Storage',
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

/** The provisioned record a workload id belongs to, or `undefined`. */
export const findDeploymentByWorkload = (workloadId) =>
  deployments.value.find((record) => record.workload.id === String(workloadId))

/**
 * The provisioned record a deployment VERSION id belongs to, or `undefined`.
 *
 * Every deployment in this console is read on `/deployments/:versionId`, and the
 * version a provisioned chain published is a deployment like any other — it leads
 * its workload's history (see `provisionedDeployRow`). Without this lookup its row
 * linked to a page that could not resolve it, so a deployment the demo had just
 * created answered "Deployment not found": the ids are minted here and exist in no
 * fixture. The store is workload-agnostic, so the URL resolves on a reload too.
 */
export const findDeploymentByVersion = (versionId) =>
  deployments.value.find((record) => record.versionId === String(versionId))

/**
 * The deployment a provisioned chain published, as a deployments-table ROW.
 *
 * One shape, read by both surfaces that show it — the workload's history
 * (components/WorkloadDetail.vue) and the deployment PAGE, which maps this row the
 * same way it maps a seeded one (src/lib/azion-deploys.js `deployPageRecord`). It
 * used to be built inline on the workload page only, which is how the row and the
 * page could disagree about the very deployment they both named.
 *
 * Beyond the row contract it carries the two facts only this family knows: the
 * workload's `url` (a provisioned chain is live, so the page's Visit works and its
 * banner can say where), and `trigger: 'console'` — this record exists because
 * somebody finished a deploy in this UI.
 *
 * @param {object} record A record from `provisionDeployment()`.
 * @returns {object} A row satisfying ui/DeploymentsTable.vue's row contract.
 */
export const provisionedDeployRow = (record) => ({
  id: `deployment-${record.versionId}`,
  versionId: record.versionId,
  workloadId: record.workload.id,
  workloadName: record.workload.name,
  environment: 'Production',
  // A just-provisioned chain is what its workload serves.
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

/**
 * The provisioned record an application id belongs to, or `undefined`.
 *
 * The chain is provisioned as one unit, so an application created here already
 * knows the workload that publishes it — which is what lets the deploy drawer
 * preselect that workload instead of asking for something it can derive.
 */
export const findDeploymentByApplication = (applicationId) =>
  deployments.value.find((record) => record.application.id === String(applicationId))

/**
 * Drop a provisioned record by any of its resource ids.
 *
 * The four resources are provisioned together, so the demo tears them down
 * together: deleting the workload, the application or the bucket removes the
 * whole chain rather than leaving a half-provisioned record behind.
 *
 * @param {string} resourceIdentifier Id of the workload, application or bucket.
 * @returns {boolean} Whether a record was removed.
 */
export function removeDeployment(resourceIdentifier) {
  const id = String(resourceIdentifier)
  const index = deployments.value.findIndex(
    (record) =>
      record.workload.id === id ||
      record.application.id === id ||
      record.connector.id === id ||
      record.bucket.id === id
  )
  if (index === -1) return false
  deployments.value.splice(index, 1)
  persistRecords()
  return true
}

/** Rows to prepend to the Workloads / Applications / Object Storage lists. */
export const provisionedWorkloads = computed(() =>
  deployments.value.map((record) => record.workload)
)
export const provisionedApplications = computed(() =>
  deployments.value.map((record) => record.application)
)
export const provisionedBuckets = computed(() => deployments.value.map((record) => record.bucket))

/**
 * The four resources of a record, in provisioning order, shaped for a topology
 * node: identity + the fields that node shows. One source for the success
 * screen's "Resources created" list and the workload's deployment topology.
 *
 * @param {object} record A record returned by `provisionDeployment()`.
 * @returns {Array<object>} `{ key, kind, icon, name, status, href, reference, fields[] }`
 */
export function resourceChain(record) {
  const { workload, application, connector, bucket } = record
  return [
    {
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
    {
      key: 'application',
      kind: 'Application',
      icon: 'ai ai-edge-application',
      name: application.name,
      status: 'Active',
      href: `/applications/${application.id}`,
      reference: application.id,
      fields: [
        { label: 'ID', value: application.id },
        { label: 'Repository', value: application.repository },
        { label: 'Branch', value: application.branch }
      ]
    },
    {
      key: 'connector',
      kind: 'Connector',
      icon: 'ai ai-edge-connectors',
      name: connector.name,
      status: 'Active',
      href: '',
      reference: connector.id,
      fields: [
        { label: 'ID', value: connector.id },
        { label: 'Type', value: connector.kind },
        { label: 'Address', value: connector.address }
      ]
    },
    {
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
  ]
}
