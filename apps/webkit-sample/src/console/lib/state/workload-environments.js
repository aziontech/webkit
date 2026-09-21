// THE ENVIRONMENTS A WORKLOAD PUBLISHES INTO — the seeded ones, plus the ones a domain
// added in this session.
//
// ── AN ENVIRONMENT ARRIVES WITH A DOMAIN ──
//
// This module used to hold "environments created on the workload": a name and a Deployment
// setting, captured by a Create Environment drawer on the summary card's picker. Both
// halves of that were wrong, and the product's own sentence says why
// (../state/workload-settings.js):
//
//   "Every environment used by a DOMAIN is linked to Deployment Settings automatically,
//    matching the deployment policy of that environment."
//
// So an environment is not something a workload makes. It is a record the account holds
// (../data/environments.js), and it reaches a workload because a DOMAIN on that workload
// answers there. That is the only way it reaches one — which is why the card's picker
// asks for a domain when the reader presses Add Environment, and why adding a domain has
// to name one.
//
// And the setting is not asked for either: the link is automatic, by policy. This module
// therefore stores NAMES, and reads the pairing back through `linkEnvironment` on every
// read — so a workload's environments and the settings they publish with stay one list,
// derived, never a second copy that can drift.
import { reactive } from 'vue'

import { environmentsForWorkload, linkEnvironment } from './workload-settings'

// `{ [workloadId]: string[] }` — the environment names this session's domains brought onto
// a workload. Session-only, the same shape every other "added in this session" store here
// has; the domains that named them are page-local too.
const added = reactive(new Map())

/** Every environment a workload publishes into, seeded first, newest connection last. */
export const environmentsFor = (workloadId) => {
  const seeded = environmentsForWorkload(workloadId)
  const taken = new Set(seeded.map((environment) => environment.name))
  const connected = (added.get(String(workloadId)) ?? [])
    .filter((name) => !taken.has(name))
    .map((name) => linkEnvironment(workloadId, name))
  return [...seeded, ...connected]
}

/**
 * Bring an environment onto a workload, because a domain now answers there. Idempotent —
 * a workload already publishing into it keeps the one list it has.
 *
 * Returns the linked record so the caller can SELECT it: a connection the reader cannot
 * see the result of is a connection that appears to have done nothing.
 *
 * @param {string} workloadId
 * @param {string} name The environment the domain names.
 * @returns {{ name: string, deploymentPolicy: string, settingsId: string, auto: boolean }}
 */
export const connectEnvironment = (workloadId, name) => {
  const key = String(workloadId)
  const environment = String(name).trim()
  const present = environmentsFor(key).some(
    (existing) => existing.name.toLowerCase() === environment.toLowerCase()
  )
  if (!present) added.set(key, [...(added.get(key) ?? []), environment])
  return linkEnvironment(key, environment)
}
