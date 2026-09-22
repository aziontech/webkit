// THE HOST HALF OF A BOUND CREATE — the applications on offer, and what answering the
// question actually does.
//
// The question itself is the gate the create page opens on
// (../../components/resource/ApplicationGate.vue); this module is the two facts behind it:
// which applications exist, and what picking one — or naming a new one — resolves to. Both
// create pages that ask it (../../pages/build/CreateFunction.vue and
// ../../pages/resources/CreateResource.vue) share this, so the list they offer and the way
// a new application is provisioned cannot drift into two versions of one act.
import { APPLICATIONS } from '../data/applications'
import { provisionDeployment, provisionedApplications } from '../data/provisioning'
import { computed } from 'vue'

import { CONNECTORS } from '../data/connectors'
import { allFirewalls } from '../data/firewalls'
import { createdRowsFor } from '../state/created-resources'
import { allWorkloads } from '../state/workload-settings'

/** Everything the account can bind to — what this session made, then the seeded list. */
export const accountApplications = computed(() => [
  ...provisionedApplications.value,
  ...APPLICATIONS
])

/** The same list as chooser rows: the name is the answer, the domain says which one it is. */
export const applicationOptions = computed(() =>
  accountApplications.value.map((application) => ({
    value: application.name,
    label: application.name,
    description: application.domainName ?? ''
  }))
)

/**
 * The application a gate answer names — found on the existing branch, provisioned on the
 * new one. An application created here is the from-scratch door's record: it exists, and
 * nothing is deployed to it yet.
 *
 * Called at COMMIT time, never when the answer is given: a reader who picks "new", reaches
 * the form and leaves must not have spent an application on the way through.
 *
 * @param {{mode: string, name: string}|null} choice What the gate emitted.
 * @returns {{id: string, name: string, created: boolean}|null} Null when there is no answer,
 *   or it names an application that is no longer there.
 */
export const resolveApplicationChoice = (choice) => {
  const wanted = String(choice?.name ?? '').trim()
  if (!wanted) return null
  if (choice.mode === 'new') {
    const { application } = provisionDeployment({
      repoName: wanted,
      applicationName: wanted,
      publish: false
    })
    return { id: String(application.id), name: application.name, created: true }
  }
  const application = accountApplications.value.find((item) => item.name === wanted)
  return application
    ? { id: String(application.id), name: application.name, created: false }
    : null
}

/**
 * The hosts a bound create can be asked about — what the gate calls each one, what it looks
 * like, and what to do when the account has none.
 *
 * `canCreate` is the difference between the two: an application can be named right in the
 * gate, because naming it is all creating one takes here. A firewall cannot — it is itself
 * created inside an application (../data/create-bindings.js), so making one is its own
 * gated create rather than a field in this chooser.
 */
export const HOSTS = {
  application: {
    noun: 'application',
    icon: 'ai ai-edge-application',
    canCreate: true,
    emptyPath: '/create',
    emptyLabel: 'Go to the Creation Center'
  },
  firewall: {
    noun: 'firewall',
    icon: 'ai ai-edge-firewall',
    canCreate: false,
    emptyPath: '/firewall/new',
    emptyLabel: 'Create a firewall'
  },
  workload: {
    noun: 'workload',
    icon: 'ai ai-workloads',
    canCreate: false,
    emptyPath: '/workloads/new',
    emptyLabel: 'Create a workload'
  },
  connector: {
    noun: 'connector',
    icon: 'ai ai-edge-connectors',
    canCreate: false,
    emptyPath: '/connectors/new',
    emptyLabel: 'Create a connector'
  }
}

/** Every workload the account can bind to, as chooser rows. */
export const workloadOptions = computed(() =>
  allWorkloads.value.map((workload) => ({
    value: workload.name,
    label: workload.name,
    description: workload.domain ?? ''
  }))
)

/** Every connector the account can bind to, as chooser rows. */
export const connectorOptions = computed(() =>
  [...createdRowsFor('connectors'), ...CONNECTORS].map((connector) => ({
    value: connector.name,
    label: connector.name,
    description: connector.address ?? connector.type ?? ''
  }))
)

/** Every firewall the account can bind to, as chooser rows. */
export const firewallOptions = computed(() =>
  allFirewalls().map((firewall) => ({
    value: firewall.name,
    label: firewall.name,
    description: firewall.application || (firewall.modules ?? []).join(', ')
  }))
)

/**
 * The hosts on offer for a binding.
 *
 * @param {string} kind `application` | `firewall`.
 * @returns {Array<{value: string, label: string, description: string}>}
 */
export const hostOptions = (kind) => {
  if (kind === 'firewall') return firewallOptions.value
  if (kind === 'workload') return workloadOptions.value
  if (kind === 'connector') return connectorOptions.value
  return applicationOptions.value
}

/**
 * The host ROWS behind those options — the records themselves, so a caller that needs more
 * than a label (which modules a host has on, say) reads the same list the chooser offers
 * rather than a second one that can disagree with it.
 *
 * @param {string} kind `application` | `firewall`.
 * @returns {Array<object>}
 */
export const hostRecords = (kind) => {
  if (kind === 'firewall') return allFirewalls()
  if (kind === 'workload') return allWorkloads.value
  if (kind === 'connector') return [...createdRowsFor('connectors'), ...CONNECTORS]
  return accountApplications.value
}

/**
 * One host row, by the name a chooser answer carries.
 *
 * @param {string} kind `application` | `firewall`.
 * @param {string} name
 * @returns {object|null}
 */
export const hostRecord = (kind, name) =>
  hostRecords(kind).find((item) => item.name === name) ?? null

/**
 * The host a gate answer names, resolved at COMMIT time.
 *
 * @param {string} kind `application` | `firewall`.
 * @param {{mode: string, name: string}|null} choice What the gate emitted.
 * @returns {{id: string, name: string, created: boolean}|null}
 */
export const resolveHostChoice = (kind, choice) => {
  if (kind === 'application' || !kind) return resolveApplicationChoice(choice)
  const wanted = String(choice?.name ?? '').trim()
  const record = hostRecords(kind).find((item) => item.name === wanted)
  return record ? { id: String(record.id), name: record.name, created: false } : null
}
