// RESOURCE VERSIONING — the model console-kit actually runs, as data.
//
// A VERSION is a snapshot of a resource with its own identity (`versionId`, a ULID on the
// wire), distinct from the resource's id. Editing is not mutation: a version that has been
// built is IMMUTABLE, and editing it forks a NEW DRAFT from it. A build is the async
// transition that freezes a draft into an artifact something can be deployed from.
//
// The whole model is three tables and the predicates over them, ported from
// console-kit `src/composables/versioning/version-machine.js` + `version-capability.js`
// (docs/VERSION-SHELL.md §7). The VOCABULARY is copied verbatim on purpose — a sample that
// renames these states is a sample that teaches the wrong words for the product.
//
// ── WHY THIS IS HERE AT ALL ──
//
// This sample used to know two states, `ready` and `active`, derived from a name hash, and
// an escape-hatch Set per narrative it wanted to tell ("this one has no deployable
// version", "this one fails detection once"). Those are states, and naming them as states
// is what lets one table answer what a reader may DO with a version instead of each screen
// deciding for itself.
//
// ── WHAT IS DELIBERATELY NOT HERE ──
//
// The lifecycle UI — the action bar, the processing overlay, fork-on-edit — is console-kit's
// shell, not this sample's. This module is the spine: the states, the matrix, the capability
// gate and the resource catalog. Screens read real states through it; nothing here renders.

/** The eight states a version can be in. */
export const VERSION_STATES = {
  DRAFT: 'draft',
  QUEUED: 'queued',
  BUILDING: 'building',
  READY: 'ready',
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  CANCELED: 'canceled',
  ERROR: 'error'
}

/** A version the reader may still change. A build that failed or was canceled resumes the
 *  SAME draft, which is why both are editable rather than terminal. */
export const isEditable = (state) =>
  [VERSION_STATES.DRAFT, VERSION_STATES.CANCELED, VERSION_STATES.ERROR].includes(state)

/** A build is in flight. The surface is read-only and shows progress. */
export const isProcessing = (state) =>
  state === VERSION_STATES.QUEUED || state === VERSION_STATES.BUILDING

/** Built, and therefore frozen. Editing one forks a new draft instead of mutating it. */
export const isImmutable = (state) =>
  [VERSION_STATES.READY, VERSION_STATES.ACTIVE, VERSION_STATES.ARCHIVED].includes(state)

/** Built and deployable, but not the one serving. */
export const isReady = (state) => state === VERSION_STATES.READY

/** Archivable: something that finished, one way or another, and is not serving. */
export const canArchive = (state) =>
  [VERSION_STATES.READY, VERSION_STATES.ERROR, VERSION_STATES.CANCELED].includes(state)

/** The seven acts a version surface can offer. */
export const VERSION_ACTIONS = {
  SAVE: 'SAVE',
  SAVE_AND_BUILD: 'SAVE_AND_BUILD',
  CANCEL_BUILD: 'CANCEL_BUILD',
  NEW_DRAFT_FROM: 'NEW_DRAFT_FROM',
  ARCHIVE: 'ARCHIVE',
  DELETE: 'DELETE',
  DEPLOY: 'DEPLOY'
}

/**
 * THE AUTHORITATIVE MATRIX: state → what may be done in it.
 *
 * Every surface reads this rather than deciding for itself, which is what keeps a row's
 * kebab, a page's footer and a picker's disabled state from disagreeing about the same
 * version.
 */
export const STATE_ACTIONS = {
  draft: ['SAVE', 'SAVE_AND_BUILD', 'NEW_DRAFT_FROM', 'DELETE'],
  queued: ['CANCEL_BUILD'],
  building: ['CANCEL_BUILD'],
  ready: ['NEW_DRAFT_FROM', 'ARCHIVE', 'DELETE', 'DEPLOY'],
  active: ['NEW_DRAFT_FROM', 'ARCHIVE', 'DELETE', 'DEPLOY'],
  archived: ['NEW_DRAFT_FROM', 'DELETE'],
  canceled: ['SAVE', 'SAVE_AND_BUILD', 'NEW_DRAFT_FROM', 'DELETE'],
  error: ['SAVE', 'SAVE_AND_BUILD', 'NEW_DRAFT_FROM', 'DELETE']
}

// ── CAPABILITY — the one axis resources are allowed to differ on ────────────
//
// Every resource is versioned the same way. What differs is whether a version of it can be
// DEPLOYED at all: a connector, a function, a network list and a WAF are carried INTO a
// deployment by the application or firewall that references them — they are never the
// subject of one. So they are `versioned-only`, and every deploy affordance is stripped
// without forking the surface that renders them.

export const DEFAULT_CAPABILITY = Object.freeze({
  canDeploy: true,
  canPromote: true,
  canRollback: true
})

export const VERSIONED_ONLY = Object.freeze({
  canDeploy: false,
  canPromote: false,
  canRollback: false
})

/** The four that are versioned but never deployed on their own. */
export const RESOURCE_CAPABILITY = Object.freeze({
  connector: VERSIONED_ONLY,
  function: VERSIONED_ONLY,
  network_list: VERSIONED_ONLY,
  waf: VERSIONED_ONLY
})

/**
 * What may be done with versions of a resource type. Unknown types are deployable, which
 * is the permissive default console-kit ships — the gate below is what fails closed.
 *
 * @param {string} [resourceType]
 */
export const getVersionCapability = (resourceType) =>
  RESOURCE_CAPABILITY[resourceType] ?? DEFAULT_CAPABILITY

const CAPABILITY_GATED_ACTIONS = {
  DEPLOY: 'canDeploy',
  PROMOTE: 'canPromote',
  ROLLBACK: 'canRollback'
}

const isAllowedByCapability = (action, capability) => {
  const flag = CAPABILITY_GATED_ACTIONS[action]
  return flag ? capability[flag] !== false : true
}

/**
 * What may be done with a version in this state, for this kind of resource.
 *
 * FAILS CLOSED: a state nothing recognizes offers NOTHING, rather than falling through to
 * a permissive default. A surface that cannot name the state it is in has no business
 * offering a Deploy button.
 *
 * @param {string} state One of VERSION_STATES.
 * @param {object} [capability] From `getVersionCapability(resourceType)`.
 * @returns {string[]} The allowed VERSION_ACTIONS.
 */
export const getAvailableActions = (state, capability = DEFAULT_CAPABILITY) => {
  const actions = Object.hasOwn(STATE_ACTIONS, state) ? STATE_ACTIONS[state] : []
  return actions.filter((action) => isAllowedByCapability(action, capability))
}

/** Whether one action is allowed. */
export const isActionAvailable = (state, action, capability = DEFAULT_CAPABILITY) =>
  getAvailableActions(state, capability).includes(action)

// ── THE RESOURCE CATALOG — one list, one spelling ───────────────────────────
//
// Nine resources are plugged into versioning (console-kit docs/VERSION-SHELL.md §19), and
// this is the one place they are named. It exists because they used to be named in four
// places that disagreed — a deployments table keyed `custom-page`, a release keyed
// `custom_page`, a topology keyed `customPage`, each with its own label and icon, plus a
// translation map (`BINDING_KEY`) whose whole job was to bridge two of them.
//
// The key is the API's `resource_type`, verbatim. `endpoint` is where its versions live, so
// a reader can see that these are the same nine resources the platform versions and not a
// list this sample invented.
export const RESOURCES = {
  application: {
    label: 'Application',
    one: 'application',
    many: 'applications',
    icon: 'ai ai-edge-application',
    endpoint: 'v4/workspace/applications',
    // Only some modules have a page in this sample. An empty `path` means a row renders
    // the resource's name as plain text rather than linking somewhere that does not exist.
    path: '/applications'
  },
  workload: {
    label: 'Workload',
    one: 'workload',
    many: 'workloads',
    icon: 'ai ai-domains',
    endpoint: 'v4/workspace/workloads',
    path: '/workloads'
  },
  custom_page: {
    label: 'Custom Pages',
    one: 'custom page',
    many: 'custom pages',
    icon: 'ai ai-custom-pages',
    endpoint: 'v4/workspace/custom_pages',
    path: ''
  },
  firewall: {
    label: 'Firewall',
    one: 'firewall',
    many: 'firewalls',
    icon: 'ai ai-edge-firewall',
    endpoint: 'v4/workspace/firewalls',
    path: '/firewall'
  },
  connector: {
    label: 'Connectors',
    one: 'connector',
    many: 'connectors',
    icon: 'ai ai-edge-connectors',
    endpoint: 'v4/workspace/connectors',
    path: ''
  },
  function: {
    label: 'Functions',
    one: 'function',
    many: 'functions',
    icon: 'ai ai-edge-functions',
    endpoint: 'v4/workspace/functions',
    path: '/functions'
  },
  network_list: {
    label: 'Network Lists',
    one: 'network list',
    many: 'network lists',
    icon: 'ai ai-network-lists',
    endpoint: 'v4/workspace/network_lists',
    path: ''
  },
  waf: {
    label: 'WAF',
    one: 'WAF rule',
    many: 'WAF rules',
    icon: 'ai ai-waf-rules',
    endpoint: 'v4/workspace/wafs',
    path: ''
  },
  deployment: {
    label: 'Deployment',
    one: 'deployment',
    many: 'deployments',
    icon: 'ai ai-deployments',
    endpoint: '/deployment-api/v6/deployments',
    path: '/deployments'
  }
}

// The spellings this console has used for the same resource, mapped onto the API's. Kept
// so a stored record, a query string or a component prop written in an older spelling still
// resolves — and so nothing new has to invent a fifth one.
const RESOURCE_ALIASES = {
  'custom-page': 'custom_page',
  customPage: 'custom_page',
  custompage: 'custom_page',
  'network-list': 'network_list',
  networkList: 'network_list',
  edge_application: 'application',
  edge_function: 'function',
  edge_connector: 'connector'
}

/**
 * Coerce any spelling of a resource type to the API's `resource_type`.
 *
 * @param {string} value
 * @returns {string} The canonical key, or `''` when nothing matches.
 */
export const resourceTypeKey = (value) => {
  const raw = String(value ?? '').trim()
  if (Object.hasOwn(RESOURCES, raw)) return raw
  return RESOURCE_ALIASES[raw] ?? ''
}

/**
 * One resource's identity, by any spelling. Falls back to a record shaped like the others
 * so a caller never has to guard — an unknown type reads as its own raw name with no icon
 * and no link, which is honest rather than blank.
 *
 * @param {string} type
 */
export const resourceMeta = (type) =>
  RESOURCES[resourceTypeKey(type)] ?? {
    label: String(type ?? ''),
    one: String(type ?? ''),
    many: String(type ?? ''),
    icon: '',
    endpoint: '',
    path: ''
  }

/** Options for a Select or a filter over resource types. */
export const resourceTypeOptions = Object.entries(RESOURCES).map(([value, meta]) => ({
  value,
  label: meta.label
}))
