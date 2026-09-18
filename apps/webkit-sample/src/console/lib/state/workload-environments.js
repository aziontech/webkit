// The environments a workload publishes into — the seeded ones, plus the ones added in
// this session.
//
// An environment is not decoration on a workload: it is the thing a deployment lands in,
// and it carries exactly ONE Deployment setting (`strategy` is an object in the deployment
// request body, not a list — see ../data/releases.js). So "add an environment" is really
// "add a place to publish, and say what it publishes with", which is why the create asks
// for both and the store keeps them together.
//
// SEEDED ENVIRONMENTS COME FROM THE PAIRING, not from here: `environmentsForWorkload`
// derives them from the same index rule the deployment history stamps its rows with, so a
// workload's environments and the settings it deploys with are one list read two ways.
// This module only adds to that, and only for the session — the same shape every other
// "created in this session" store in the console has.
import { reactive } from 'vue'

import { environmentsForWorkload } from '../data/releases'

const added = reactive(new Map())

/** Every environment a workload publishes into, seeded first, newest addition last. */
export const environmentsFor = (workloadId) => [
  ...environmentsForWorkload(workloadId),
  ...(added.get(String(workloadId)) ?? [])
]

/** Whether a name is already taken on this workload — the create's one real rule. */
export const environmentExists = (workloadId, name) =>
  environmentsFor(workloadId).some(
    (environment) => environment.name.toLowerCase() === String(name).trim().toLowerCase()
  )

/**
 * Add one. Returns the record so the caller can select it — a create the reader cannot
 * see the result of is a create that appears to have done nothing.
 *
 * @param {string} workloadId
 * @param {{ name: string, settingsId: string }} environment
 */
export const addEnvironment = (workloadId, { name, settingsId }) => {
  const key = String(workloadId)
  const record = { name: String(name).trim(), settingsId: String(settingsId) }
  added.set(key, [...(added.get(key) ?? []), record])
  return record
}
