import { DEFAULT_MODULES, defaultModuleState } from './application-modules'
import { defaultFirewallModuleState, FIREWALL_MODULES } from './firewalls'

export const RESOURCE_DEPENDENCY_MATRIX = {
  application: [
    { by: 'release', path: 'resources[]', as: 'ver', required: true },
    { by: 'variables', path: 'scope[]', as: 'id' }
  ],
  firewall: [
    { by: 'release', path: 'resources[]', as: 'ver' },
    { by: 'variables', path: 'scope[]', as: 'id' }
  ],
  'custom-pages': [{ by: 'release', path: 'resources[]', as: 'ver' }],
  connectors: [
    {
      by: 'application',
      path: 'set_connector',
      as: 'id',
      needsActive: true,
      note: 'A request rule sends traffic to it. The connector must be active, and the rule cannot also deny, redirect or answer no content.'
    },
    {
      by: 'custom-pages',
      path: 'pages[].connector',
      as: 'id',
      required: true,
      note: 'Every page points at an active connector, and the POST takes at least one page.'
    },
    { by: 'release', path: 'dependency', as: 'ver' }
  ],
  functions: [
    { by: 'application', path: 'via Function Instance', as: 'via', indirect: 'function-instance' },
    { by: 'firewall', path: 'via Function Instance', as: 'via', indirect: 'function-instance' },
    {
      by: 'function-instance',
      path: 'function',
      as: 'id',
      required: true,
      requires: 'functions',
      note: "The function's runtime must match its parent, and modules.functions must be on."
    },
    { by: 'release', path: 'dependency', as: 'ver' }
  ],
  'function-instance': [
    {
      by: 'application',
      path: 'run_function',
      as: 'id',
      requires: 'functions',
      note: 'The behavior points at the instance, not the function. The response phase takes Lua only.'
    },
    { by: 'firewall', path: 'run_function', as: 'id', requires: 'functions' }
  ],
  'cache-settings': [{ by: 'application', path: 'set_cache_policy', as: 'id' }],
  'device-groups': [
    {
      by: 'application',
      path: '${device_group}',
      as: 'str',
      note: 'Matched by name, with no cross-validation — renaming the group breaks the rule silently.'
    },
    {
      by: 'cache-settings',
      path: 'device_group[]',
      as: 'id',
      requires: 'application_accelerator',
      note: 'cache_vary_by_devices: allowlist needs at least one group, ignore needs none.'
    }
  ],
  'network-lists': [
    {
      by: 'firewall',
      path: '${network}',
      as: 'id',
      requires: 'network_protection',
      note: 'The only external dependency that enters through criteria. The list must be active and visible to the rules engine.'
    },
    { by: 'release', path: 'dependency', as: 'ver' }
  ],
  'waf-rules': [
    {
      by: 'firewall',
      path: 'set_waf',
      as: 'id',
      requires: 'waf',
      note: 'One set_waf per rule, carrying waf_id and mode. modules.waf is false by default on the API.'
    },
    { by: 'release', path: 'dependency', as: 'ver' }
  ],
  'object-storage': [
    {
      by: 'connector',
      path: 'attributes.bucket',
      as: 'str',
      required: true,
      note: 'Storage connectors only. The bucket is written by name and validated by the Variables API.'
    }
  ],
  certificates: [
    { by: 'connector', path: 'mtls.config', as: 'id', note: 'An http connector with mTLS: trusted CA and CRL.' },
    {
      by: 'workload',
      path: 'bindings[].certificate',
      as: 'id',
      note: 'An edge certificate that is not pending. Zero means a certificate Azion manages.'
    }
  ],
  environment: [
    {
      by: 'workload',
      path: 'bindings[].environment_id',
      as: 'id',
      required: true,
      note: 'One binding per environment, and at most one single_version environment per workload.'
    },
    { by: 'variables', path: 'scope[]', as: 'id' }
  ],
  deployment: [
    {
      by: 'workload',
      path: 'bindings[].deployment_id',
      as: 'id',
      required: true,
      note: 'Its deployment_policy must equal the environment’s.'
    },
    { by: 'release', path: '{dsId}', as: 'id', note: 'The release is created inside the deployment.' },
    { by: 'variables', path: 'scope[]', as: 'id' }
  ],
  workload: [
    {
      by: 'data-stream',
      path: 'filter_workloads',
      as: 'id',
      note: 'When the stream reads every workload the filter is omitted.'
    }
  ]
}

const MODULE_ALIASES = {
  firewall: {
    network_protection: 'network-shield',
    waf: 'waf',
    functions: 'functions'
  },
  application: {
    functions: 'functions',
    application_accelerator: 'application_accelerator'
  }
}

const moduleLabel = (host, key) => {
  if (host === 'firewall') return FIREWALL_MODULES[key] ?? key
  return DEFAULT_MODULES.find((module) => module.key === key)?.title ?? key
}

const moduleDescription = (host, key) => {
  if (host === 'application') {
    return DEFAULT_MODULES.find((module) => module.key === key)?.description ?? ''
  }
  return ''
}

export const moduleRequirementFor = (resource, host) => {
  const rows = RESOURCE_DEPENDENCY_MATRIX[resource] ?? []
  let entry = rows.find((row) => row.by === host && row.requires)
  if (!entry) {
    const hop = rows.find((row) => row.by === host && row.indirect)
    if (hop) {
      entry =
        rows.find((row) => row.by === hop.indirect && row.requires) ??
        (RESOURCE_DEPENDENCY_MATRIX[hop.indirect] ?? []).find(
          (row) => row.by === host && row.requires
        )
    }
  }
  if (!entry) return null
  const key = MODULE_ALIASES[host]?.[entry.requires]
  if (!key) return null
  return {
    host,
    key,
    api: `modules.${entry.requires}`,
    label: moduleLabel(host, key),
    description: moduleDescription(host, key),
    via: entry.path,
    note: entry.note ?? ''
  }
}

const defaultModulesFor = (host) =>
  host === 'firewall' ? defaultFirewallModuleState() : defaultModuleState()

export const hostHasModule = (record, requirement) => {
  if (!requirement) return true
  if (!record) return false
  if (Array.isArray(record.modules)) return record.modules.includes(requirement.key)
  if (record.modules && typeof record.modules === 'object') {
    return Boolean(record.modules[requirement.key])
  }
  return Boolean(defaultModulesFor(requirement.host)[requirement.key])
}

export const consumersOf = (resource) => RESOURCE_DEPENDENCY_MATRIX[resource] ?? []

const MATRIX_HOSTS = {
  domains: {
    host: 'workload',
    noun: 'domain',
    endpoint: 'POST /workspace/workloads',
    mechanism: "A domain is an entry in a workload's `domains[]`.",
    unboundNote: 'It resolves to nothing until a workload answers on it.'
  },
  'custom-pages': {
    host: 'workload',
    noun: 'custom page set',
    endpoint: 'POST /workspace/custom_pages',
    mechanism: 'A workload serves it for the responses it names.',
    unboundNote: 'It answers for nothing until a workload serves it.'
  },
  certificates: {
    host: 'workload',
    noun: 'certificate',
    endpoint: 'POST /workspace/certificates',
    mechanism: "A workload's binding presents it on the connections it answers.",
    unboundNote: 'It is stored, but presented by nothing until a workload binds it.'
  },
  'object-storage': {
    host: 'connector',
    noun: 'bucket',
    endpoint: 'POST /workspace/buckets',
    mechanism: 'A storage connector reads it by name (`attributes.bucket`).',
    unboundNote: 'Nothing reads from it until a storage connector names it.'
  },
  'data-stream': {
    host: 'workload',
    noun: 'stream',
    endpoint: 'POST /workspace/data_streams',
    mechanism: 'It ships the events of the workloads its `filter_workloads` names.',
    unboundNote: 'It ships nothing until it names the workloads to read.'
  }
}

export const matrixBindingFor = (resource) => MATRIX_HOSTS[resource] ?? null
