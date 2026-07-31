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
import { formatListDate, hoursAgo } from './dates'
import { resourceMeta } from './deployments'
import { authorAt, emailOf } from './people'
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

  return TARGETS.map((target, slot) => {
    const status = STATUSES[slot][(index + slot) % STATUSES[slot].length]
    const person = authorAt(index + slot)
    const resource = resourceFor(target, application)
    // The deployment carries its resource under the field the details drawer reads
    // it as, so the drawer names the ONE resource this deployment targeted instead
    // of claiming all three (see ui/WorkloadDeploymentDrawer.vue).
    const drawerField = resourceMeta(target).drawerField
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
      environment: slot === 0 || (index + slot) % 2 === 0 ? 'Production' : 'Stage',
      // `deployedAt` is the real instant — the Deployed range compares it and the
      // cell renders it relative; `date` (the sortable, exportable display string)
      // is derived from it by one formatter, never hand-written per row.
      deployedAt,
      date: formatListDate(deployedAt),
      ...resource,
      [drawerField]: resource.resourceName,
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
 * The deployments that have a PAGE behind them (src/lib/azion-deploys.js — the real
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
