// WHICH DEPLOYMENT SETTING AN ENVIRONMENT PUBLISHES WITH — the pairing, and the only
// place it is decided.
//
// ── THE RULE, AS THE PRODUCT STATES IT ──
//
// From console-kit's own workload form
// (`views/Workload/v6/FormFields/blocks/deploymentSettingsBlock.vue`):
//
//   "Every environment used by a domain is linked to Deployment Settings automatically,
//    matching the deployment policy of that environment. Select a different one here
//    when the automatic link isn't the one you want."
//
//   "Deployment Settings centralize the applications, firewall policies, and custom
//    pages that environments share."
//
// So three things are true, and this module is where all three live:
//
//   1. THE ENVIRONMENT IS THE CONSUMER. A workload's domain names an environment, and it
//      is the ENVIRONMENT that publishes with exactly one Deployment Setting — not the
//      workload, and not a resource.
//   2. THE LINK IS AUTOMATIC, AND IT IS BY POLICY. Both records carry the same
//      `deployment_policy` axis (`single_version` | `versioned_urls`), and an environment
//      is linked to a setting whose policy equals its own. Nothing is chosen by hand
//      until someone wants a different one.
//   3. ONLY A MATCHING SETTING MAY BE CHOSEN. The picker offers the settings whose policy
//      matches, plus whatever is currently bound — so a `Versioned` environment can never
//      be pointed at a `Single` setting.
//
// ── SHARING IS WHAT MAKES IT DANGEROUS ──
//
// Because settings CENTRALIZE what environments share, two environments on one setting
// mean a deploy into it reaches both — and the person starting it is usually looking at
// one. `boundEnvironments` is therefore the most important function here: it is the blast
// radius, derived on every read, so it cannot go stale.
import { provisionedWorkloads } from '../data/provisioning'
import { WORKLOADS } from '../data/workloads'
import { computed, ref, watch } from 'vue'

import {
  addStrategy,
  AZION_DEFAULT_ID,
  DEFAULT_DEPLOYMENT_POLICY,
  environmentSuffix,
  newWorkloadDefaults,
  strategies,
  workloadSettingsId
} from '../data/deployment-strategies'
import { DEFAULT_ENVIRONMENTS, policyForEnvironment } from '../data/environments'

// THE ENVIRONMENTS A WORKLOAD PUBLISHES INTO, in order — the `starter` records of
// ../data/environments.js, which is the one place the pair is declared. Both the NAMES
// and the POLICY are read from there: an environment is a record with its own settings,
// and its deployment policy is the field this whole pairing turns on. Change `Stage` to
// `Single` on the Environments page and the settings offered here change with it; mark a
// third environment as a starter and every workload publishes into it too.
export const ENVIRONMENT_ORDER = computed(() =>
  DEFAULT_ENVIRONMENTS.value.map((environment) => ({ name: environment.name }))
)

const environmentPolicy = (name) => policyForEnvironment(name) ?? DEFAULT_DEPLOYMENT_POLICY

// THE DEFAULT IS 1:1. A seeded workload publishes with the setting it was created with —
// `ws-<id>`, the row ../data/deployment-strategies.js mints for it. That is the state a
// new workload starts in and the state most of them stay in, which is what makes the
// shared ones worth a column.
// One per (workload, environment) — the id ../data/deployment-strategies.js mints, read
// back through the function that mints it so the two cannot spell it differently.
const ownSettingsId = workloadSettingsId

// THE EXCEPTIONS, and the only reason this file is interesting. A few seeded workloads
// are deliberately pointed at a setting they SHARE, keyed by list index because the
// fixture derives its ids from it (../../../shared/lib/workloads.js).
//
//   s1  a three-workload storefront fleet: one configuration, maintained once
//   s2  a pair that ships together
//
// Deploying into either reaches every environment on it — the case the Workloads column,
// the workload footer and the release composer all exist to report.
const SHARED_BY_INDEX = { 0: 's1', 4: 's1', 8: 's1', 1: 's2', 6: 's2' }

// THE OVERLAY: `{ [workloadId]: { [environment]: settingsId } }`. What this session has
// decided, over what the seed pairs. A binding is a record the operator changed, so it
// survives a reload the same way an authored setting does; the seed underneath it is a
// fixture and is not persisted.
const BINDINGS_KEY = 'webkit-sample:workload-settings'

const loadBindings = () => {
  try {
    const raw = globalThis.sessionStorage?.getItem(BINDINGS_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const bindings = ref(loadBindings())

const persist = () => {
  try {
    globalThis.sessionStorage?.setItem(BINDINGS_KEY, JSON.stringify(bindings.value))
  } catch {
    // A full or unavailable sessionStorage must not break a binding change.
  }
}

/**
 * THE PAIRING: a workload's environments, each with its own deployment policy and the ONE
 * Deployment Setting it publishes with.
 *
 * The overlay wins; otherwise the environment is LINKED AUTOMATICALLY — `autoLink` picks
 * the first setting whose policy matches the environment's, preferring the one the
 * workload was created with. That is the product's own rule, not a fixture convenience:
 * an environment is never left without a setting, and never linked to an incompatible
 * one.
 *
 * @param {string} workloadId
 * @returns {Array<{ name, deploymentPolicy, settingsId, auto }>}
 */
export const environmentsForWorkload = (workloadId) => {
  const key = String(workloadId)
  const overlay = bindings.value[key] ?? {}
  const names = [
    ...ENVIRONMENT_ORDER.value.map((environment) => environment.name),
    ...Object.keys(overlay)
  ]

  return [...new Set(names)].map((name) => linkEnvironment(key, name))
}

/**
 * ONE environment of one workload, linked. The overlay wins; otherwise the link is
 * automatic, by policy.
 *
 * Exported because an environment does not only arrive from the seed: a DOMAIN brings one
 * onto a workload by naming it (../state/workload-environments.js), and that environment
 * has to be linked by the same rule the seeded ones are. Derived on every read, so the
 * link a domain's environment publishes with can never go stale against the settings
 * store.
 *
 * @param {string} workloadId
 * @param {string} name The environment name, as a domain names it.
 * @returns {{ name: string, deploymentPolicy: string, settingsId: string, auto: boolean }}
 */
export const linkEnvironment = (workloadId, name) => {
  const key = String(workloadId)
  const policy = environmentPolicy(name)
  const chosen = (bindings.value[key] ?? {})[name]
  if (chosen) return { name, deploymentPolicy: policy, settingsId: chosen, auto: false }
  const index = WORKLOADS.findIndex((workload) => workload.id === key)
  return {
    name,
    deploymentPolicy: policy,
    settingsId: autoLink(key, index, policy, name),
    auto: true
  }
}

/**
 * Whether a workload may point an environment at a setting AT ALL — the share gate,
 * before any policy question.
 *
 * A setting born with a workload is DEDICATED (`shared: false`): it belongs to that
 * workload and no other may bind it. Turning `shared` on is the act the product calls
 * activating the feature — it is what lets one setting serve several workloads, so one
 * deploy reaches every environment bound to it. Azion Default is always reachable,
 * because a picker that can offer nothing is a dead end.
 *
 * @param {object} strategy
 * @param {string} workloadId The workload asking.
 */
const reachableBy = (strategy, workloadId) =>
  strategy.system ||
  strategy.shared ||
  String(strategy.ownerWorkloadId) === String(workloadId)

/**
 * THE AUTOMATIC LINK. The first setting whose `deploymentPolicy` matches the
 * environment's, preferring the one this workload was created with, then the one the
 * fixture deliberately shares, then anything compatible, and finally Azion Default — so
 * an environment is never without a setting.
 *
 * Mirrors console-kit's `pickDefaultDeployment(deployments, { policy, preferredIds })`.
 */
const autoLink = (workloadId, index, policy, environmentName) => {
  // The fixture's deliberate share applies to PRODUCTION only: `s1` and `s2` are
  // `single_version`, and the filter below would drop them for a `versioned_urls`
  // environment anyway — listing them here for Stage would just be a preference that
  // never wins.
  const shared = environmentName === 'Production' ? SHARED_BY_INDEX[index] : ''
  const preferred = [shared, ownSettingsId(workloadId, environmentName)].filter(Boolean)
  const compatible = strategies.value.filter(
    (strategy) =>
      strategy.deploymentPolicy === policy &&
      strategy.status === 'Active' &&
      reachableBy(strategy, workloadId)
  )
  const hit = preferred.map((id) => compatible.find((strategy) => strategy.id === id)).find(Boolean)
  return hit?.id ?? compatible[0]?.id ?? AZION_DEFAULT_ID
}

/**
 * The settings an environment may be pointed at: the ones whose policy matches AND that
 * this workload is allowed to reach, plus whatever is bound today so the current value is
 * never missing from its own Select.
 *
 * This is `filterDeploymentsByPolicy` plus the share gate — a `Versioned` environment
 * cannot take a `Single` setting, and no environment can take another workload's
 * dedicated one.
 *
 * @param {string} policy The environment's deployment policy.
 * @param {string} [boundId] What it is bound to today, so the Select always shows it.
 * @param {string} [workloadId] The workload asking. Omitted, only shareable settings show.
 */
export const settingsForPolicy = (policy, boundId = '', workloadId = '') =>
  strategies.value.filter(
    (strategy) =>
      strategy.id === String(boundId) ||
      (strategy.deploymentPolicy === policy && reachableBy(strategy, workloadId))
  )

/** The setting ids a workload publishes with, in environment order. */
export const settingsIdsForWorkload = (workloadId) =>
  environmentsForWorkload(workloadId).map((environment) => environment.settingsId)

/** Every workload the console knows about — the seed plus what this session provisioned. */
export const allWorkloads = computed(() => [...provisionedWorkloads.value, ...WORKLOADS])

/**
 * THE BLAST RADIUS: the workloads a given Deployment setting publishes to.
 *
 * Derived on every read from the pairing above, so it can never disagree with what a
 * deploy would actually reach. This is the number every surface prints before someone
 * deploys into a shared setting.
 *
 * @param {string} settingsId
 * @returns {Array<object>} The bound workloads.
 */
export const boundWorkloads = (settingsId) =>
  allWorkloads.value.filter((workload) =>
    settingsIdsForWorkload(workload.id).includes(String(settingsId))
  )

/** Whether a setting publishes to more than one workload — the case worth warning about. */
export const isShared = (settingsId) => boundWorkloads(settingsId).length > 1

/**
 * Point a workload's environment at a Deployment setting. This is the act that makes a
 * setting shared, and the caller is expected to have shown the reader what it will reach.
 *
 * @param {string} workloadId
 * @param {string} environment The environment name (`Production`, `Stage`).
 * @param {string} settingsId
 */
export function bindWorkloadSettings(workloadId, environment, settingsId) {
  const key = String(workloadId)
  bindings.value = {
    ...bindings.value,
    [key]: { ...(bindings.value[key] ?? {}), [environment]: String(settingsId) }
  }
  persist()
}

/**
 * The settings created WITH a workload — ONE PER STARTER ENVIRONMENT, each bound to the
 * environment it was made for. Idempotent: a workload that already has bindings keeps them.
 *
 * It is a setting per environment rather than one per workload because a setting carries
 * exactly ONE deployment policy, and the starters deliberately do not share one — Production
 * is `single_version`, Stage is `versioned_urls`. One setting therefore cannot serve both,
 * and a workload created with only a Production setting would have its Stage environment
 * auto-linked to somebody else's compatible setting, which is precisely the accident that
 * makes an account look shared when nothing was shared.
 *
 * The account default (`newWorkloadDefaults`) supplies everything EXCEPT the deployment
 * policy, which is the environment's to state.
 *
 * @param {{ id: string, name: string }} workload
 * @returns {object[]} The settings created, empty when the workload already had them.
 */
export function createSettingsForWorkload(workload) {
  if (!workload?.id) return []
  const key = String(workload.id)
  if (Object.keys(bindings.value[key] ?? {}).length) return []

  const defaults = newWorkloadDefaults.value
  return DEFAULT_ENVIRONMENTS.value.map((environment) => {
    const setting = addStrategy({
      name: `${workload.name}${environmentSuffix(environment.name)}`,
      description: `Created with the ${workload.name} workload for ${environment.name}.`,
      firewall: defaults.firewall,
      customPage: defaults.customPage,
      bindingPolicy: defaults.bindingPolicy,
      deploymentPolicy: environment.deploymentPolicy,
      ownerWorkloadId: key
    })
    bindWorkloadSettings(key, environment.name, setting.id)
    return setting
  })
}

// EVERY WORKLOAD HAS ONE, kept true by watching the provisioned list rather than by
// editing the five create flows that mint a workload (Create Workload, the template
// deploy, an application create that publishes, a CLI-style run). A workload arriving in
// that list is the one event all of them share, so this is the one place that has to
// know. `immediate` covers a reload, where the workloads are restored before this module
// is first read.
watch(provisionedWorkloads, (workloads) => workloads.forEach(createSettingsForWorkload), {
  immediate: true,
  deep: false
})

/**
 * How a setting's reach reads on screen, in the console's own words. One sentence, used
 * by the settings list, the workload footer and the release composer so the three cannot
 * describe the same setting three ways.
 *
 * @param {number} count How many workloads are bound.
 */
export const reachLabel = (count) => {
  if (count === 0) return 'No workloads'
  if (count === 1) return '1 workload'
  return `${count} workloads`
}

/** Every setting, with the workloads it reaches — what the account list is built from. */
export const settingsReach = computed(() =>
  strategies.value.map((strategy) => {
    const workloads = boundWorkloads(strategy.id)
    return {
      id: strategy.id,
      workloads,
      count: workloads.length,
      shared: workloads.length > 1,
      // A setting born with a workload that is still the only one on it is DEDICATED:
      // deploying it reaches nothing else. That is the state every workload starts in.
      dedicated: Boolean(strategy.ownerWorkloadId) && workloads.length <= 1
    }
  })
)

/** One setting's reach by id. */
export const reachFor = (settingsId) =>
  settingsReach.value.find((entry) => entry.id === String(settingsId))

/**
 * Every workload, with the environments it publishes into and the setting each one uses —
 * the shape the account page's "All workloads" disclosure is built from.
 *
 * It is the pairing read the other way round: `boundWorkloads` answers "who does this
 * setting reach", this answers "what does this workload publish with". One derivation
 * behind both, so the account card and the workload page cannot disagree.
 */
export const workloadBindings = computed(() =>
  allWorkloads.value.map((workload) => ({
    id: String(workload.id),
    name: workload.name,
    environments: environmentsForWorkload(workload.id)
  }))
)
