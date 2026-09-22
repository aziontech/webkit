// Deployment vocabulary — the single table of statuses, resource types and
// environments every deployment surface reads from.
//
// A deployment shows up in three places (the Deployments module, a workload's
// Deployments tab and an application's) plus the deployment page. Each of
// them used to re-declare its own STATUS_SEVERITY map and its own environment
// list, so the same status could drift into a different severity per screen.
// One module, one answer: a status, a resource type and an environment read
// identically wherever they appear.

import { deployById, stepsOf } from '@shared/lib/azion-deploys'
import { computed } from 'vue'

import { DATE_PRESETS, formatDateRange, matchDate } from '../behavior/filter-bar'
import {
  applicationDeploymentRows,
  deploymentByVersion,
  deploymentRowsFor
} from './deployment-history'
import { environments } from './environments'
import { RESOURCES, resourceMeta, resourceTypeKey } from './versioning'
import { findDeploymentByVersion, provisionedDeployRow } from './provisioning'

/** Deployment status → StatusIndicator severity + spinner state. */
export const STATUS_SEVERITY = {
  Ready: { severity: 'success', loading: false },
  Building: { severity: 'info', loading: true },
  Queued: { severity: 'warning', loading: false },
  Error: { severity: 'danger', loading: false },
  Draft: { severity: 'neutral', loading: false }
}

/**
 * The severity + spinner state for a status, falling back to a neutral dot for
 * anything the table above does not name.
 *
 * @param {string} status
 * @returns {{ severity: string, loading: boolean }}
 */
export const statusMeta = (status) =>
  STATUS_SEVERITY[status] ?? { severity: 'neutral', loading: false }

/** Status options for a Select / filter field, in the order above. */
export const statusOptions = Object.keys(STATUS_SEVERITY).map((value) => ({
  value,
  label: value
}))

// A deployment targets exactly ONE resource — deploying an application, a
// firewall or a custom page each triggers its own deployment — so a row carries
// the resource's NAME and its TYPE. The label, the glyph and the module page it
// links to are all derived from the type, so the tag, the filter options, the
// deployment page and every list read the same vocabulary.
// The resource a deployment carries, named the way the API names it. The catalog and the
// labeller both live in ./versioning.js now — this module used to keep its own three-entry
// copy keyed `custom-page` while the release page kept a seven-entry one keyed
// `custom_page`, so the same resource had two labels, two icons and two spellings
// depending on which surface you opened.
export { RESOURCES, resourceMeta, resourceTypeKey }

/** The resource types present in a set of rows, as filter options. */
const resourceTypeOptions = (rows = []) =>
  [...new Set(rows.map((row) => row.resourceType).filter(Boolean))]
    .map((value) => ({ value, label: resourceMeta(value).label }))
    .sort((a, b) => a.label.localeCompare(b.label))

export const resourceHref = (row) => {
  const { path } = resourceMeta(row.resourceType)
  return path && row.resourceId ? `${path}/${row.resourceId}` : ''
}

/**
 * The Environment filter's options — every environment the ACCOUNT holds, not a literal
 * three. A deployment can have landed in any environment a workload publishes into, so a
 * filter built from a fixed list silently cannot narrow to one the reader has added
 * (./environments.js, the same store the Environments page writes).
 */
export const environmentOptions = computed(() =>
  environments.value.map((environment) => ({ value: environment.name, label: environment.name }))
)

/**
 * ONE colour for every environment.
 *
 * An environment is a CATEGORY — where a deployment landed — not a status, and the row
 * already spends colour on the thing that is a status. Painting `Production` blue and
 * the rest grey made the tag carry a second meaning nobody asked it to: a reader had
 * to learn that the colour meant "live" rather than "an environment named this". The
 * severity is a constant so the tag says one thing, and the environment's NAME is what
 * tells the environments apart.
 *
 * Kept as a function, and kept shared, so the Deployments, Applications and Firewall
 * lists cannot drift back into two palettes.
 */
export const environmentSeverity = () => 'secondary'

// ── The filter catalog every deployment surface shares ──────────────────────
// A deployment table renders in three places (the Deployments module, a
// workload's Deployments tab, an application's), and each one is narrowed by
// the same four columns. The catalog is built here rather than per page so a
// status that gains a value, or an environment that gains a name, reaches every
// surface at once — the same reason STATUS_SEVERITY lives in this file.
//
// AUTHORS COME FROM THE ROWS, so a surface can never offer someone with nothing
// in it: a workload's history lists the two people who deployed that workload,
// while the module list lists everyone. The value is the email (what a row
// carries) and the label is the name (what a person reads).

/**
 * The fields a deployment table can be narrowed by, in column order.
 *
 * @param {Array<object>} rows The rows this surface shows — the Author options come from them.
 * @param {{ deployed?: boolean }} [options] `deployed` adds the date field. The module
 *   list wants it (it spans every deployment ever made); a workload's own history is
 *   already short enough that a date window narrows nothing worth the chip.
 */
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
      // The types PRESENT, not every type the platform versions: a deployment carries an
      // application, a firewall or a custom page, and offering the other six would be six
      // filters that can only ever return nothing.
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

/**
 * The record `/deployments/:id` renders — for ANY deployment in the console.
 *
 * EVERY deployment is read on a page. It used to be two surfaces: the deployments
 * whose pipeline this module records opened a page, and every other row opened a
 * read-only drawer — so the same click produced two different depths of answer, and
 * the shallower one closed on Escape and could not be linked to. One surface means
 * one lookup, which is what this function is.
 *
 * The two families it resolves are genuinely different in what they KNOW, and the
 * shape says so rather than papering over it:
 *
 *   • a RECORDED run (@shared/lib/azion-deploys.js) knows its build artifacts, what triggered
 *     it, and every step it ran — `edge`, `trigger` and `steps` are populated.
 *   • a seeded HISTORY row (./deployment-history.js) is row-shaped: who deployed
 *     what, where and when. `edge` and `trigger` are null and `steps` is empty, and
 *     the page renders the fields it actually has instead of inventing the rest.
 *
 * The page therefore reads ONE shape with honestly-optional parts, instead of
 * branching on which family it got.
 *
 * @param {string} id The version id from the URL (a recorded run's id IS its version).
 * @param {object} [context] What the link carried about where the row came from.
 * @param {string} [context.workloadId] The workload whose history holds it. Only
 *   needed for a workload this sample does not seed: its history is DERIVED from its
 *   own id (./deployment-history.js), so those rows are not in the seeded list
 *   and the version id alone cannot find them. The link that opened the page knows
 *   which workload it was listing, so it passes it — and a reload of that URL still
 *   resolves, which is the whole reason the page exists.
 * @param {string} [context.workloadName] Its display name, for the same reason.
 * @param {string} [context.applicationId] The application whose history holds it. Needed
 *   for the same reason as `workloadId`: an application's activity list is partly
 *   DERIVED from its own id (./deployment-history.js), so those version ids exist only
 *   relative to that application and the link that listed them passes it along.
 * @param {string} [context.applicationName] Its display name, for the same reason.
 * @returns {object|undefined} The page record, or undefined for an id nothing matches.
 */
export const deployPageRecord = (
  id,
  { workloadId = '', workloadName = '', applicationId = '', applicationName = '' } = {}
) => {
  const recorded = deployById(String(id))
  if (recorded)
    return {
      ...recorded,
      // The one resource it deployed. A recorded run is always an application
      // deploy — that is what `azion deploy` does — so the page can read the same
      // `resource` block for both families.
      resource: {
        type: 'application',
        name: recorded.application.name,
        id: recorded.application.id
      },
      steps: stepsOf(recorded)
    }

  // A chain provisioned in this session (./provisioning.js) publishes a deployment
  // too, and its version id is minted at deploy time — it is in no fixture, so it
  // has to be looked up in that store or the page it links to finds nothing. It is
  // read as the same ROW every other family is, so the mapping below is one mapping.
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
    // Not known for a seeded row, and left empty rather than guessed: a "Triggered
    // By: Console" on a deployment nobody recorded the trigger of is a made-up fact,
    // and the page drops the field instead of printing one. A provisioned chain DOES
    // know — it exists because somebody finished a deploy in this UI — so it carries
    // the trigger on its row and the page prints it.
    trigger: row.trigger ?? '',
    // Build artifacts belong to a run this module recorded; no row family has them.
    edge: null,
    // Where it published, for the families that are live and know their address. A
    // seeded row has none, so Visit stays inert rather than linking nowhere.
    url: row.url ?? '',
    error: null,
    // No recorded pipeline. The page streams the canonical one as an ILLUSTRATION of
    // where this deployment is (which is what the drawer did for these rows), so
    // `steps` stays empty and the page decides — it is the surface that can say so.
    steps: [],
    failedAt: '',
    activeStep: ''
  }
}
