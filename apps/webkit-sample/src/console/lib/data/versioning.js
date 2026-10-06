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

export const isEditable = (state) =>
  [VERSION_STATES.DRAFT, VERSION_STATES.CANCELED, VERSION_STATES.ERROR].includes(state)

export const isProcessing = (state) =>
  state === VERSION_STATES.QUEUED || state === VERSION_STATES.BUILDING

export const isImmutable = (state) =>
  [VERSION_STATES.READY, VERSION_STATES.ACTIVE, VERSION_STATES.ARCHIVED].includes(state)

export const isReady = (state) => state === VERSION_STATES.READY

export const canArchive = (state) =>
  [VERSION_STATES.READY, VERSION_STATES.ERROR, VERSION_STATES.CANCELED].includes(state)

export const VERSION_ACTIONS = {
  SAVE: 'SAVE',
  SAVE_AND_BUILD: 'SAVE_AND_BUILD',
  CANCEL_BUILD: 'CANCEL_BUILD',
  NEW_DRAFT_FROM: 'NEW_DRAFT_FROM',
  ARCHIVE: 'ARCHIVE',
  DELETE: 'DELETE',
  DEPLOY: 'DEPLOY'
}

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

export const RESOURCE_CAPABILITY = Object.freeze({
  connector: VERSIONED_ONLY,
  function: VERSIONED_ONLY,
  network_list: VERSIONED_ONLY,
  waf: VERSIONED_ONLY
})

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

export const getAvailableActions = (state, capability = DEFAULT_CAPABILITY) => {
  const actions = Object.hasOwn(STATE_ACTIONS, state) ? STATE_ACTIONS[state] : []
  return actions.filter((action) => isAllowedByCapability(action, capability))
}

export const isActionAvailable = (state, action, capability = DEFAULT_CAPABILITY) =>
  getAvailableActions(state, capability).includes(action)

export const RESOURCES = {
  application: {
    label: 'Application',
    one: 'application',
    many: 'applications',
    icon: 'ai ai-edge-application',
    endpoint: 'v4/workspace/applications',
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

export const resourceTypeKey = (value) => {
  const raw = String(value ?? '').trim()
  if (Object.hasOwn(RESOURCES, raw)) return raw
  return RESOURCE_ALIASES[raw] ?? ''
}

export const resourceMeta = (type) =>
  RESOURCES[resourceTypeKey(type)] ?? {
    label: String(type ?? ''),
    one: String(type ?? ''),
    many: String(type ?? ''),
    icon: '',
    endpoint: '',
    path: ''
  }

export const resourceTypeOptions = Object.entries(RESOURCES).map(([value, meta]) => ({
  value,
  label: meta.label
}))
