import { createdRowsFor } from '../state/created-resources'
import { pendingTemplateInstall, templateInstallFor } from '../state/template-install'
import { CONNECTORS } from './connectors'
import { allCustomPages } from './custom-pages'
import { allFirewalls } from './firewalls'
import { functions } from './functions'
import { NETWORK_LISTS } from './network-lists'
import { WAF_RULES } from './waf-rules'

const workloadHandoff =
  (slot) =>
  ({ host, record }) => ({
    path: `/workloads/${host.id}`,
    query: { name: host.name, bind: slot, record: record.id }
  })

const BINDINGS = {
  applications: {
    title: 'Where it runs',
    description: 'Select or create a Workload.',
    noun: 'application',
    endpoint: 'POST /workspace/applications',
    parents: {
      workload: {
        canCreate: true,
        mechanism: 'A workload deploys it and serves it on its domains.',
        unboundNote: 'Nothing serves it until a workload deploys it.'
      }
    }
  },
  functions: {
    title: 'Where it runs',
    description: 'Select the Application or Firewall that runs it.',
    noun: 'function',
    endpoint: 'POST /workspace/functions',
    records: () => functions.value,
    parents: {
      application: {
        mechanism: 'A Rules Engine rule calls it, on the application it is instanced on.',
        unboundNote: 'It runs when a rule calls it, so it does nothing until one does.',
        behavior: 'run-function',
        field: 'functionId',
        ruleName: (name) => `Run ${name}`,
        ruleDescription: (name) => `Runs the ${name} function on requests this application serves.`,
        destination: ({ host, record }) => ({
          path: `/applications/${host.id}`,
          query: { name: host.name, tab: 'rules-engine', bind: 'functions', record: record.id }
        })
      },
      firewall: {
        mechanism: 'A firewall rule calls it, before the request reaches an application.',
        unboundNote: 'It runs when a firewall rule calls it, so it does nothing until one does.',
        behavior: 'run-function',
        field: 'functionId',
        ruleName: (name) => `Run ${name}`,
        ruleDescription: (name) => `Runs the ${name} function on requests this firewall inspects.`,
        destination: ({ host, record }) => ({
          path: `/firewall/${host.id}`,
          query: { name: host.name, tab: 'rules-engine', bind: 'functions', record: record.id }
        })
      }
    }
  },
  connectors: {
    title: "Where it's used",
    description: 'Select the Application or Custom Page that uses it.',
    noun: 'connector',
    endpoint: 'POST /workspace/connectors',
    records: () => [...createdRowsFor('connectors'), ...CONNECTORS],
    parents: {
      application: {
        mechanism: 'A Rules Engine rule points traffic at it.',
        unboundNote: 'Nothing fetches through it until a rule points traffic at it.',
        behavior: 'set-connector',
        field: 'connectorId',
        ruleName: (name) => `Fetch from ${name}`,
        ruleDescription: (name) => `Sends matching requests to the ${name} connector.`,
        destination: ({ host, record }) => ({
          path: `/applications/${host.id}`,
          query: { name: host.name, tab: 'rules-engine', bind: 'connectors', record: record.id }
        })
      },
      'custom-page': {
        mechanism: 'A custom page fetches its content from it.',
        unboundNote: 'No page is fetched from it until a custom page points at it.',
        settingsField: 'connector',
        destination: ({ host, record }) => ({
          path: `/custom-pages/${host.id}/settings`,
          query: { name: host.name, bind: 'connectors', record: record.id }
        })
      }
    }
  },
  firewall: {
    title: 'Where it runs',
    description: 'Select the Workload it protects.',
    noun: 'firewall',
    endpoint: 'POST /workspace/firewalls',
    records: () => allFirewalls(),
    parents: {
      workload: {
        mechanism: 'It runs in front of the application the workload serves.',
        unboundNote: 'A firewall protects a workload; it sees no traffic until it fronts one.',
        slot: 'firewall',
        destination: workloadHandoff('firewall')
      }
    }
  },
  'custom-pages': {
    title: 'Where it runs',
    description: 'Select the Workload it runs on.',
    noun: 'custom page',
    endpoint: 'POST /workspace/custom_pages',
    records: () => allCustomPages(),
    parents: {
      workload: {
        mechanism: 'A workload serves it for the responses it names.',
        unboundNote: 'It answers for nothing until a workload serves it.',
        slot: 'customPage',
        destination: workloadHandoff('customPage')
      }
    }
  },
  'waf-rules': {
    title: 'Where it runs',
    description: 'Select the Firewall that applies it.',
    noun: 'rule set',
    endpoint: 'POST /workspace/wafs',
    records: () => [...createdRowsFor('waf-rules'), ...WAF_RULES],
    parents: {
      firewall: {
        mechanism: 'A firewall rule applies it.',
        unboundNote: 'It scores nothing until a firewall rule applies it.',
        behavior: 'set-waf-ruleset',
        field: 'wafId',
        ruleName: (name) => `Inspect with ${name}`,
        ruleDescription: (name) => `Scores matching requests against the ${name} rule set.`,
        destination: ({ host, record }) => ({
          path: `/firewall/${host.id}`,
          query: { name: host.name, tab: 'rules-engine', bind: 'waf-rules', record: record.id }
        })
      }
    }
  },
  'network-lists': {
    title: 'Where it runs',
    description: 'Select the Firewall whose rules match it.',
    noun: 'network list',
    endpoint: 'POST /workspace/network_lists',
    records: () => [...createdRowsFor('network-lists'), ...NETWORK_LISTS],
    parents: {
      firewall: {
        mechanism: "A firewall rule's criteria reference it.",
        unboundNote: 'It matches nothing until a firewall rule references it.',
        ruleDraft: (record) => ({
          name: `Block ${record.name}`,
          description: `Refuses requests whose address is in the ${record.name} list.`,
          phase: 'request',
          criteria: [
            {
              conditions: [
                {
                  join: null,
                  variable: '${network}',
                  operator: 'is-in-network-list',
                  argument: record.id
                }
              ]
            }
          ],
          behaviors: [{ type: 'deny' }],
          active: true
        }),
        destination: ({ host, record }) => ({
          path: `/firewall/${host.id}`,
          query: {
            name: host.name,
            tab: 'rules-engine',
            bind: 'network-lists',
            record: record.id
          }
        })
      }
    }
  },
  domains: {
    title: 'Where it runs',
    description: 'Select the Workload that answers on it.',
    noun: 'domain',
    endpoint: 'POST /workspace/workloads',
    parents: {
      workload: {
        mechanism: "A domain is an entry in a workload's domains.",
        unboundNote: 'It resolves to nothing until a workload answers on it.'
      }
    }
  },
  certificates: {
    title: 'Where it runs',
    description: 'Select the Workload that presents it.',
    noun: 'certificate',
    endpoint: 'POST /workspace/certificates',
    parents: {
      workload: {
        mechanism: "A workload's binding presents it on the connections it answers.",
        unboundNote: 'It is stored, but presented by nothing until a workload binds it.'
      }
    }
  },
  'data-stream': {
    title: 'Where it runs',
    description: 'Select the Workload whose events it ships.',
    noun: 'stream',
    endpoint: 'POST /workspace/data_streams',
    parents: {
      workload: {
        mechanism: 'It ships the events of the workloads it names.',
        unboundNote: 'It ships nothing until it names the workloads to read.'
      }
    }
  },
  'object-storage': {
    title: "Where it's used",
    description: 'Select the Connector that reads from it.',
    noun: 'bucket',
    endpoint: 'POST /workspace/buckets',
    parents: {
      connector: {
        mechanism: 'A storage connector reads it by name.',
        unboundNote: 'Nothing reads from it until a storage connector names it.'
      }
    }
  },
  templates: {
    title: 'Where it runs',
    description: 'Select the Application it runs on.',
    noun: 'template',
    endpoint: 'POST /workspace/applications/{id}/rules',
    records: () => {
      const install = pendingTemplateInstall()
      return install ? [{ id: install.slug, name: install.title }] : []
    },
    parents: {
      application: {
        mechanism: 'An integration template IS a Rules Engine rule on the application it runs on.',
        unboundNote: 'It shapes no traffic until the rule that carries it is saved.',
        ruleDraft: (record) => templateInstallFor(record.id)?.rule ?? null,
        destination: ({ host, record }) => ({
          path: `/applications/${host.id}`,
          query: { name: host.name, tab: 'rules-engine', bind: 'templates', record: record.id }
        })
      }
    }
  }
}

export const RESOURCE_BINDINGS = BINDINGS

export const bindingFor = (resource, kind = '') => {
  const entry = BINDINGS[resource]
  if (!entry) return null
  const kinds = Object.keys(entry.parents)
  const host = kinds.includes(kind) ? kind : kinds[0]
  return { ...entry, ...entry.parents[host], host, kinds }
}

export const bindingWritesRule = (resource, kind = '') => {
  const binding = bindingFor(resource, kind)
  return Boolean(binding?.behavior || binding?.ruleDraft)
}

export const bindingRecord = (resource, id) => {
  const binding = bindingFor(resource)
  if (!binding?.records || !id) return null
  const record = binding.records().find((item) => String(item.id) === String(id))
  return record ? { id: String(record.id), name: record.name } : null
}

export const bindingRuleDraft = (resource, record, kind = '') => {
  const binding = bindingFor(resource, kind)
  if (!binding || binding.host !== (kind || binding.host) || !record) return null
  if (binding.ruleDraft) return binding.ruleDraft(record)
  if (!binding.behavior) return null
  const path = binding.host === 'firewall' ? '${request_uri}' : '${uri}'
  return {
    name: binding.ruleName(record.name),
    description: binding.ruleDescription(record.name),
    phase: 'request',
    criteria: [
      { conditions: [{ join: null, variable: path, operator: 'matches', argument: '/*' }] }
    ],
    behaviors: [{ type: binding.behavior, [binding.field]: record.id }],
    active: true
  }
}

const SETTINGS_HOSTS = { 'custom-pages': 'custom-page' }

export const bindingSettingsSeed = (resource, record, hostResource) => {
  const kind = SETTINGS_HOSTS[hostResource]
  const binding = bindingFor(resource, kind)
  if (!binding?.settingsField || binding.host !== kind || !record) return null
  return { [binding.settingsField]: record.name }
}

export const resourceForSlot = (slot) =>
  Object.keys(BINDINGS).find((resource) => BINDINGS[resource].parents.workload?.slot === slot) ??
  null
