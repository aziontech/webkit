// The ONE deployment history — the records behind every list of deployments.
//
// A deployment BELONGS to exactly one workload (the thing that publishes it) and
// TARGETS exactly one resource (deploying an application, a firewall or a custom
// page each triggers its own deployment — see ./deployments.js). Those two facts are
// what make the two lists one list:
//
//   /deployments            → every record here, newest first
//   /workloads/:id?tab=…    → the records whose `workloadId` is that workload's
//
// The workload's list is a FILTER of the module's list, never a second fixture. It
// used to be one: both pages seeded their own rows and both started at version
// `1293183210`, so the same version id was a 99s Ready application in the module and
// a Building one on the workload page — two contradictory records under one id, and
// no row in common between a workload and the module that supposedly lists it.
//
// Every seeded workload gets a history, so no workload page can land on an empty
// list (its Active Deployment card reads the newest row and has nothing to show
// without one). A workload this sample does not seed — an id typed into the URL, or
// one provisioned in this session — gets the same shape derived from its own id, the
// way ./provisioning.js derives its demo chain.
import { applicationAt } from './applications'
import { formatListDate, hoursAgo } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'
import { findDeploymentByApplication, provisionedDeployRow } from './provisioning'
import { workloadById, WORKLOADS } from './workloads'

// What a workload's deployments targeted, newest first. A workload binds three
// resources, and each one deploys on its own, so its history reads as one of each.
// The newest is the APPLICATION: it is the deployment the Active Deployment card
// presents, and an application is what a workload exists to serve.
const TARGETS = ['application', 'firewall', 'custom-page']

// Status by slot. The newest deployment is the workload's CURRENT one, so it is live
// or on its way there; the ones behind it carry the mix a real history has. Indexed
// by the workload's position so two neighbours never read identically.
const STATUSES = [
  ['Ready', 'Ready', 'Building', 'Ready'],
  ['Ready', 'Error', 'Ready', 'Queued'],
  ['Ready', 'Draft', 'Error', 'Ready']
]

// A finished build reports how long it took; one that has not finished has nothing
// honest to show (the rule the table's Status cell follows).
const DURATIONS = ['99s', '1m 12s', '58s', '72s', '41s', '1m 04s']

/**
 * The resource a slot deployed, named from the workload's own application.
 *
 * The firewall and the custom page are named after it (`<app>-firewall`,
 * `<app>-error-pages`) — the convention the workload's topology already uses — and
 * carry no id, because those two modules are nav-only in this sample and their rows
 * render as plain text rather than a link (see `resourceHref`).
 */
const resourceFor = (target, application) => {
  if (target === 'firewall') {
    return { resourceType: target, resourceName: `${application.name}-firewall`, resourceId: '' }
  }
  if (target === 'custom-page') {
    return { resourceType: target, resourceName: `${application.name}-error-pages`, resourceId: '' }
  }
  return {
    resourceType: target,
    resourceName: application.name,
    resourceId: application.id
  }
}

/**
 * Every Nth workload publishes into TWO environments. The Deployment settings pairing
 * (`settingsIdsForWorkload` in the console's lib/data/releases.js) reads the same rule
 * off the same index, which is what keeps one environment paired to one setting.
 */
export const ENVIRONMENT_SPREAD = 3

/**
 * One workload's deployment history, newest first.
 *
 * Deterministic in `(workload, index)`: the same workload reads the same history on
 * every render and after a reload, instead of re-rolling per visit.
 *
 * @param {object} workload A workload record (needs `id` and `name`).
 * @param {number} index Its position in the seed — what varies the statuses,
 *   environments and timestamps between workloads.
 * @returns {Array<object>} Rows satisfying ui/DeploymentsTable.vue's row contract.
 */
export function historyFor(workload, index) {
  const application = applicationAt(index)
  const twoEnvironments = index % ENVIRONMENT_SPREAD === 0

  return TARGETS.map((target, slot) => {
    const status = STATUSES[slot][(index + slot) % STATUSES[slot].length]
    const person = authorAt(index + slot)
    const resource = resourceFor(target, application)
    // Spread ~4 days apart per workload so the module list's Deployed range has a
    // couple of months to narrow, and hours apart inside one workload's history.
    const deployedAt = hoursAgo(index * 96 + slot * 11 + 1)

    return {
      id: `dep-${workload.id}-${slot + 1}`,
      // Derived from the workload's own id, so it is stable if the seed is reordered
      // and unique across every workload (their ids are 173 apart).
      versionId: String(1200000000 + Number(workload.id) * 13 + slot * 7),
      workloadId: workload.id,
      workloadName: workload.name,
      // The newest deployment is the one serving the workload.
      current: slot === 0,
      status,
      duration: status === 'Ready' ? DURATIONS[(index + slot) % DURATIONS.length] : '',
      // ONE ENVIRONMENT PER SETTING, and they agree by construction: a workload
      // publishes into a second environment on exactly the rule the Deployment
      // settings pairing uses (`settingsIdsForWorkload`, every third workload), so
      // the environments a workload has and the settings it deploys with are the
      // same list read two ways. They used to be rolled independently — `(index +
      // slot) % 2` — which gave half the two-setting workloads no Stage deployment
      // at all and stamped Stage on workloads that publish into one environment.
      environment: twoEnvironments && slot === 1 ? 'Stage' : 'Production',
      // `deployedAt` is the real instant — the Deployed range compares it and the
      // cell renders it relative; `date` (the sortable, exportable display string)
      // is derived from it by one formatter, never hand-written per row.
      deployedAt,
      date: formatListDate(deployedAt),
      // `resourceType` + `resourceName` + `resourceId`: the ONE resource this
      // deployment targeted. It used to ALSO be stamped under a per-type key
      // (`application` / `firewall` / `customPage`) for the read-only drawer to read;
      // the drawer is gone — every deployment is a page now — and the page reads the
      // resource through its type, so the duplicate key went with it.
      ...resource,
      author: person.name,
      // The address is what the table's Authors selector keys each person by.
      authorEmail: emailOf(person.name),
      authorAvatar: person.avatar
    }
  })
}

/** Newest first — the order every deployment list opens in. */
const byNewest = (a, b) => b.deployedAt - a.deployedAt

/**
 * Every seeded deployment, newest first.
 *
 * The deployments that have a PAGE behind them (@shared/lib/azion-deploys.js — the real
 * `azion deploy` runs, whose whole pipeline is recorded) are part of the same list:
 * they satisfy the same row contract, so no list can tell them apart. They are not
 * imported here — that module maps them itself and the Deployments module spreads
 * them in — because they are records of real runs rather than seeded history.
 */
export const DEPLOYMENT_HISTORY = WORKLOADS.flatMap((workload, index) =>
  historyFor(workload, index)
).sort(byNewest)

/**
 * A workload's deployments, newest first.
 *
 * A seeded workload's rows come straight out of `DEPLOYMENT_HISTORY`, so they are the
 * very rows the module lists. One this sample does not seed gets a history derived
 * from its own id, so its page has something coherent to show rather than an empty
 * list its Active Deployment card cannot read.
 *
 * @param {string} workloadId The workload's id (from the route).
 * @param {string} [workloadName] Display name, for a workload that is not seeded.
 * @returns {Array<object>} Rows satisfying ui/DeploymentsTable.vue's row contract.
 */
/**
 * A seeded deployment by the VERSION id a URL names, or `undefined`.
 *
 * Every deployment in this console is read on its own page (`/deployments/:id`), so
 * the row a list clicked has to be findable again from the URL alone. The version id
 * is what identifies it: it is the column the table shows, the string a support
 * thread quotes, and — for the recorded `azion deploy` runs in @shared/lib/azion-deploys.js —
 * the same value as the deployment's own id, so one lookup order covers both
 * families.
 *
 * @param {string} versionId
 * @returns {object|undefined} A row satisfying ui/DeploymentsTable.vue's contract.
 */
export const deploymentByVersion = (versionId) =>
  DEPLOYMENT_HISTORY.find((deployment) => deployment.versionId === String(versionId))

export function deploymentRowsFor(workloadId, workloadName = 'Workload Name') {
  const id = String(workloadId)
  const seeded = DEPLOYMENT_HISTORY.filter((deployment) => deployment.workloadId === id)
  if (seeded.length) return seeded

  const workload = workloadById(id) ?? { id, name: workloadName }
  // A derived index, so an unseeded workload still picks a stable application and a
  // stable set of statuses instead of always reading like the first workload.
  const index = Number(id.slice(-2)) || 0
  return historyFor(workload, index).sort(byNewest)
}

/** How many rows an application's activity list reads as a history rather than a stub. */
const APPLICATION_HISTORY_LENGTH = 4

/**
 * One application's deployments, newest first — every deployment that shipped IT,
 * whichever workload published it.
 *
 * An application CREATED IN THIS SESSION is not padded at all: it has exactly the
 * deployments it has made — the one its create published, or none when the create made
 * the application and stopped (`publish: false` in ./provisioning.js). A minutes-old
 * application with a year of invented history is the one thing this list must not show,
 * and the row it would have led with was derived rather than the deploy that just ran.
 *
 * A SEEDED application is padded. The seed pairs each one to one or two workloads, so
 * the rows already in `DEPLOYMENT_HISTORY` that target it are a true but very short
 * history. The rest are derived from the application's own id, deterministically and
 * strictly OLDER than every seeded row, so the current version stays the one the
 * workload's own page and the Deployments module both report.
 *
 * Derived version ids live in their own band (1.5e9), clear of the workload-derived
 * ones (1.2e9), and resolve on the deployment page through the `application` context
 * the link carries — the same way a derived workload history resolves through
 * `workloadId`.
 *
 * @param {string} applicationId The application's id (from the route).
 * @param {string} [applicationName] Display name, for an application that is not seeded.
 * @returns {Array<object>} Rows satisfying components/deployment/DeploymentsTable.vue's contract.
 */
export function applicationDeploymentRows(applicationId, applicationName = 'Application') {
  const id = String(applicationId)
  const provisioned = findDeploymentByApplication(id)
  if (provisioned) {
    return provisioned.versionId && provisioned.workload ? [provisionedDeployRow(provisioned)] : []
  }

  const seeded = DEPLOYMENT_HISTORY.filter(
    (deployment) => deployment.resourceType === 'application' && deployment.resourceId === id
  )
  const name = seeded[0]?.resourceName || applicationName
  const seed = Number(id.slice(-3)) || 0
  const oldest = seeded.reduce(
    (earliest, deployment) => Math.min(earliest, deployment.deployedAt.getTime()),
    Date.now()
  )

  const derived = Array.from(
    { length: Math.max(APPLICATION_HISTORY_LENGTH - seeded.length, 0) },
    (_, slot) => {
      const workload = WORKLOADS[(seed + slot) % WORKLOADS.length]
      const status = STATUSES[slot % STATUSES.length][(seed + slot) % STATUSES[0].length]
      const person = authorAt(seed + slot)
      const deployedAt = new Date(oldest - (slot + 1) * (29 + (seed % 7)) * 3_600_000)

      return {
        id: `dep-app-${id}-${slot + 1}`,
        versionId: String(1500000000 + (Number(id) % 9_000_000) + slot * 7),
        workloadId: workload.id,
        workloadName: workload.name,
        current: false,
        status,
        duration: status === 'Ready' ? DURATIONS[(seed + slot) % DURATIONS.length] : '',
        environment: (seed + slot) % 4 === 1 ? 'Stage' : 'Production',
        deployedAt,
        date: formatListDate(deployedAt),
        resourceType: 'application',
        resourceName: name,
        resourceId: id,
        author: person.name,
        authorEmail: emailOf(person.name),
        authorAvatar: person.avatar
      }
    }
  )

  return [...seeded, ...derived]
    .sort(byNewest)
    .map((row, index) => (row.current === (index === 0) ? row : { ...row, current: index === 0 }))
}

/**
 * The newest deployment that shipped an application, or `null`.
 *
 * An application has no status of its own (./applications.js): what the module list, its
 * filter and the application's own summary all report is the state of THIS record. They
 * read it through one function so the row a reader clicks and the page it opens can never
 * name two different states of the same application.
 *
 * @param {string} applicationId The application's id.
 * @param {string} [applicationName] Display name, for an application that is not seeded.
 * @returns {object|null} The newest row of `applicationDeploymentRows`.
 */
export const latestApplicationDeployment = (applicationId, applicationName) =>
  applicationDeploymentRows(applicationId, applicationName)[0] ?? null
