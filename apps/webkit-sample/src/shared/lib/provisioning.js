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

/** The suffix every Azion-provided workload domain carries. ONE literal for the whole
 *  sample: the create's domain field shows it, the derivation appends it, the provisioning
 *  chain mints one with it and the workload's own page reads it back — four surfaces that
 *  cannot be allowed to name different hostnames for the same workload. Re-exported by
 *  console/lib/data/workload-provisioning.js, which is where the console reads it. */
export const AZION_DOMAIN_SUFFIX = '.azion.run'

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
  // `workload` is NULL on an unpublished record (see `publish` below), and spreading null
  // would revive it as `{ modifiedAt: null }` — an object where every consumer checks for
  // its absence, so every list would show a nameless row.
  workload: record.workload
    ? { ...record.workload, modifiedAt: toDate(record.workload.modifiedAt) }
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
 * @param {string} [input.applicationName] The application's OWN name, when the create
 *   named it separately from the workload. A template deploy names both after the
 *   repository, so it passes nothing and both keep the one name; the workload create asks
 *   for each on its own part, and a chain that renamed the application after the workload
 *   would contradict the name the reader typed two parts earlier.
 * @param {boolean} [input.applicationBound] True when an EXISTING application was bound
 *   rather than a new one created — the same claim `firewallBound` makes, for the same
 *   reason: the success screen says "Created" per row, and a row that already existed must
 *   not say it.
 * @param {string} [input.domain] The workload's domain, when the create CHOSE one. Omitted,
 *   a random Azion label is minted (a template deploy does not ask for an address); the
 *   workload create shows the reader their domain before the commit, so the chain has to
 *   report that one and not a second, different address.
 * @param {boolean} [input.firewall] Whether the chain has a firewall at all.
 * @param {string} [input.firewallName] Its name; defaults to `<name>-firewall`.
 * @param {Array<string>} [input.firewallModules] The module labels it runs with.
 * @param {boolean} [input.firewallBound] True when an EXISTING firewall was bound
 *   rather than a new one created.
 * @param {string} [input.firewallId] The existing firewall's id, when bound.
 * @param {object} [input.connector] The connector the create CONFIGURED — `{ name, kind,
 *   address }`. Omitted, the chain gets the storage connector a deploy implies; supplied,
 *   the chain gets the one the reader chose (see console/pages/applications/CreateApplication.vue,
 *   the from-scratch flow, where the connector is a question rather than a consequence).
 * @param {Array<object>} [input.cachePolicies] The cache policies the create made — each
 *   `{ name, detail }`. Empty for the flows that do not ask for any, and for a create whose
 *   policy switches were all left off.
 * @param {boolean} [input.publish] Whether this create PUBLISHES. True (the default) is a
 *   deploy: the whole chain exists, workload and bucket included, and the application is
 *   reachable. False is a create that stopped at the application — no workload, no bucket,
 *   nothing served — which is what the from-scratch door makes. Such a record is turned
 *   into a published one later by `publishDeployment()`, so the application the reader
 *   made is the one that ends up live rather than a second copy of it.
 * @returns {object} The stored record: `{ id, workload, application, connector, bucket, … }`.
 */
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
  publish = true
} = {}) {
  const name = slugify(repoName || templateTitle)
  const createdAt = new Date()
  const lastModified = formatListDate(createdAt)
  // The deploying user — index 0 of the shared roster, so the author already
  // exists in every list's author filter options.
  const author = authorAt(0)
  const preset = normalizePreset(framework)

  // The address the create CHOSE, when it asked for one. A template deploy does not, so it
  // still gets a minted label.
  const domain = domainInput || `${domainLabel()}${AZION_DOMAIN_SUFFIX}`
  // The application's own name, when the create named it apart from the workload.
  const appName = slugify(applicationName) || name
  const bucketName = `${name}-assets`

  // THE PUBLIC HALF OF THE CHAIN, and only for a create that publishes. A workload is the
  // hostname traffic arrives on and the bucket is what the upload went to; an application
  // created on its own has neither, and minting them anyway would put a Live workload in
  // the list for a deploy nobody ran.
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
        lastModified,
        owner: author.name,
        ownerAvatar: author.avatar
      }
    : null

  const application = {
    id: resourceId(),
    name: appName,
    preset,
    // Bound rather than created — the chain's application row reads this the way the
    // firewall row reads `bound`, so neither claims work that never ran.
    bound: Boolean(applicationBound),
    repository: `${scope}/${appName}`,
    branch: 'main',
    domainName: domain,
    infrastructure: 'Production',
    status: 'Active',
    modifiedAt: createdAt,
    lastModified,
    author: author.name,
    authorAvatar: author.avatar
  }

  // THE CONNECTOR, and it is not always the same one. A deploy provisions the bucket it
  // uploads to, so its connector reads from that bucket — that is a CONSEQUENCE of
  // deploying. A create that ASKED where the application fetches from already has the
  // answer, and overriding it here is what keeps the chain honest: a reader who chose an
  // HTTP origin must not find a storage connector in the list of what was created.
  // A configured connector is the reader's; the default one only exists because a deploy
  // uploaded to a bucket. So a create that publishes nothing AND configured nothing has no
  // connector at all — inventing a storage connector pointed at a bucket that was never
  // made would put a broken row in the chain.
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

  // The cache policies, when the create made any. Each is a resource of the application,
  // so they belong to the record and to the chain the outcome screen lists — not a field
  // on the application row. A LIST and not one: the templates are independent of each
  // other, so a create can switch several on and the chain has to show every one it made
  // (console/pages/applications/wizard/ScratchStep.vue).
  const cachePolicies = (cachePoliciesInput ?? []).map((policy) => ({
    id: resourceId(),
    name: policy.name,
    detail: policy.detail ?? '',
    status: 'Active'
  }))

  // Only when the create asked for it. A firewall is a SEPARATE resource, not a module
  // flag on the application, so the chain either has one or does not — and the success
  // screen lists exactly what was provisioned.
  //
  // `bound` is the difference between the two ways a create gets one: a NEW firewall is
  // created with the chain, an EXISTING one is bound to it. The record carries which,
  // because "created" is a claim and the success screen makes it per row.
  const firewallRecord = firewall
    ? {
        id: firewallId || resourceId(),
        name: firewallName || `${name}-firewall`,
        status: 'Active',
        bound: Boolean(firewallBound),
        // The labels the create's Protection card settled on — the ones it switched on for
        // a new firewall, the ones an existing one already has. The vocabulary lives on the
        // console side (console/lib/data/firewalls.js), which owns it; this module stores
        // what it is handed.
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
    // The workload is the chain's identity when there is one; an unpublished record is
    // identified by the only resource it has.
    id: workload?.id ?? application.id,
    createdAt,
    published: publish,
    scope,
    visibility: isPublic ? 'Public' : 'Private',
    repository: `${scope}/${name}`,
    // A version is what a DEPLOY produced. An unpublished record has none, so nothing
    // resolves it as a deployment (`findDeploymentByVersion`) and no history row claims it.
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

/**
 * Publish an unpublished record: give it the workload that serves it, the bucket its
 * assets go to, and the version the deploy produced.
 *
 * THE SAME RECORD, mutated — not a second one. A from-scratch create makes an application
 * and stops (`publish: false` above); deploying it later is that application going live,
 * so the row the reader sees in the Applications list has to be the row that ends up
 * served. Provisioning a fresh chain instead would leave two applications of the same name
 * behind, one of them serving nothing.
 *
 * A record that is already published is returned untouched — deploying twice publishes a
 * new VERSION of the same workload, it does not mint a second one.
 *
 * @param {string} recordId The record's id (the application id, while unpublished).
 * @returns {object|undefined} The published record, or `undefined` when the id is unknown.
 */
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

  // A connector the create never asked for arrives with the deploy that needs one: the
  // bundle went to a bucket, so something has to read from it. One the reader configured
  // is left alone — it is the answer they gave.
  record.connector ??= {
    id: resourceId(),
    name: `${name}-storage`,
    kind: 'Object Storage',
    address: bucketName,
    status: 'Active'
  }

  record.versionId = String(1_200_000_000 + Math.floor(Math.random() * 99_999_999))
  record.published = true
  // The chain's identity moves to the workload, which is what every lookup and every
  // resource link uses once one exists.
  record.id = record.workload.id
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
  const domain = `w${id}${AZION_DOMAIN_SUFFIX}`
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

/** The provisioned record a workload id belongs to, or `undefined`. */
export const findDeploymentByWorkload = (workloadId) =>
  deployments.value.find((record) => record.workload?.id === String(workloadId))

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
 * knows the workload that publishes it — which is what lets a deploy of that
 * application resolve its workload instead of asking for something it can derive.
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

// Rows to prepend to the Workloads / Applications / Object Storage lists.
//
// FILTERED, because a record does not always have all three: an application created on its
// own (`publish: false`) has no workload and no bucket until it is deployed, and letting a
// `null` through would put an empty row at the top of two lists.
export const provisionedWorkloads = computed(() =>
  deployments.value.map((record) => record.workload).filter(Boolean)
)
// A BOUND application is filtered out: it already exists in the seeded list, and letting it
// through would put a second `edge-shop` in every applications picker the moment a workload
// was created in front of the first one.
export const provisionedApplications = computed(() =>
  deployments.value.map((record) => record.application).filter((app) => app && !app.bound)
)
export const provisionedBuckets = computed(() =>
  deployments.value.map((record) => record.bucket).filter(Boolean)
)

/**
 * The four resources of a record, in provisioning order, shaped for a topology
 * node: identity + the fields that node shows. One source for the success
 * screen's "Resources created" list and the workload's deployment topology.
 *
 * @param {object} record A record returned by `provisionDeployment()`.
 * @returns {Array<object>} `{ key, kind, icon, name, status, href, reference, fields[] }`
 */
export function resourceChain(record) {
  const { workload, application, firewall, connector, bucket } = record
  // `cachePolicy` is the shape a record written before a create could make several
  // carries — a session that stored one is still readable after a reload.
  const cachePolicies = record.cachePolicies ?? (record.cachePolicy ? [record.cachePolicy] : [])
  return [
    // The workload, the connector and the bucket are each absent on an unpublished record
    // — an application created on its own is served by nothing and has uploaded nothing.
    // `null` entries are filtered out at the end, alongside the firewall's.
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
    // In traffic order, so the list reads as the path a request takes: the firewall is
    // between the domain and the code. `null` entries are filtered out below.
    firewall && {
      key: 'firewall',
      kind: 'Firewall',
      icon: 'ai ai-edge-firewall',
      name: firewall.name,
      status: firewall.status,
      // The one row of the chain that may already have existed: a create can BIND a
      // firewall instead of making one, and a bound resource listed as created would
      // claim work that never ran.
      state: firewall.bound ? 'bound' : 'created',
      href: '',
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
      // Like the firewall above, this row may name a resource that already existed: the
      // workload create can BIND an application instead of making one.
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
      href: '',
      reference: connector.id,
      fields: [
        { label: 'ID', value: connector.id },
        { label: 'Type', value: connector.kind },
        { label: 'Address', value: connector.address }
      ]
    },
    // AFTER the connector, because that is where they act: a policy decides whether the
    // request reaches the connector at all. Empty for the flows that never asked for one,
    // and one node per policy for a create that switched several on — the key carries the
    // policy's own id, since two of them share the kind.
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
