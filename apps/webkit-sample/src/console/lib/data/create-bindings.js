import { createdRowsFor } from '../state/created-resources'
import { pendingTemplateInstall, templateInstallFor } from '../state/template-install'
import { CONNECTORS } from './connectors'
import { allFirewalls } from './firewalls'
import { functions } from './functions'
import { NETWORK_LISTS } from './network-lists'
import { WAF_RULES } from './waf-rules'

const BINDINGS = {
  functions: {
    gate: true,
    host: 'application',
    noun: 'function',
    endpoint: 'POST /workspace/functions',
    mechanism: 'A Rules Engine rule calls it, on the application it is instanced on.',
    behavior: 'run-function',
    field: 'functionId',
    unboundNote: 'It runs when a rule calls it, so it does nothing until one does.',
    ruleName: (name) => `Run ${name}`,
    ruleDescription: (name) => `Runs the ${name} function on requests this application serves.`,
    records: () => functions.value,
    destination: ({ host, record }) => ({
      path: `/applications/${host.id}`,
      query: { name: host.name, tab: 'rules-engine', bind: 'functions', record: record.id }
    })
  },
  connectors: {
    gate: true,
    host: 'application',
    noun: 'connector',
    endpoint: 'POST /workspace/connectors',
    mechanism: 'A Rules Engine rule points traffic at it.',
    behavior: 'set-connector',
    field: 'connectorId',
    unboundNote: 'Nothing fetches through it until a rule points traffic at it.',
    ruleName: (name) => `Fetch from ${name}`,
    ruleDescription: (name) => `Sends matching requests to the ${name} connector.`,
    records: () => [...createdRowsFor('connectors'), ...CONNECTORS],
    destination: ({ host, record }) => ({
      path: `/applications/${host.id}`,
      query: { name: host.name, tab: 'rules-engine', bind: 'connectors', record: record.id }
    })
  },
  firewall: {
    gate: true,
    host: 'application',
    noun: 'firewall',
    endpoint: 'POST /workspace/firewalls',
    mechanism: 'It runs in front of the application it is created in.',
    unboundNote: 'A firewall protects an application; it sees no traffic until it fronts one.',
    records: () => allFirewalls(),
    destination: ({ host, record }) => ({
      path: `/firewall/${record.id}`,
      query: { name: record.name, application: host.name, tab: 'rules-engine' }
    })
  },
  'waf-rules': {
    gate: true,
    host: 'firewall',
    noun: 'rule set',
    endpoint: 'POST /workspace/wafs',
    mechanism: 'A firewall rule applies it.',
    unboundNote: 'It scores nothing until a firewall rule applies it.',
    behavior: 'set-waf-ruleset',
    field: 'wafId',
    ruleName: (name) => `Inspect with ${name}`,
    ruleDescription: (name) => `Scores matching requests against the ${name} rule set.`,
    records: () => [...createdRowsFor('waf-rules'), ...WAF_RULES],
    destination: ({ host, record }) => ({
      path: `/firewall/${host.id}`,
      query: { name: host.name, tab: 'rules-engine', bind: 'waf-rules', record: record.id }
    })
  },
  'network-lists': {
    gate: true,
    host: 'firewall',
    noun: 'network list',
    endpoint: 'POST /workspace/network_lists',
    mechanism: "A firewall rule's criteria reference it.",
    unboundNote: 'It matches nothing until a firewall rule references it.',
    records: () => [...createdRowsFor('network-lists'), ...NETWORK_LISTS],
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
  },
  templates: {
    gate: true,
    host: 'application',
    noun: 'template',
    endpoint: 'POST /workspace/applications/{id}/rules',
    mechanism: 'An integration template IS a Rules Engine rule on the application it runs on.',
    unboundNote: 'It shapes no traffic until the rule that carries it is saved.',
    records: () => {
      const install = pendingTemplateInstall()
      return install ? [{ id: install.slug, name: install.title }] : []
    },
    ruleDraft: (record) => templateInstallFor(record.id)?.rule ?? null,
    destination: ({ host, record }) => ({
      path: `/applications/${host.id}`,
      query: { name: host.name, tab: 'rules-engine', bind: 'templates', record: record.id }
    })
  },

  'custom-pages': {
    gate: false,
    host: 'workload',
    noun: 'custom page set',
    endpoint: 'POST /workspace/custom_pages',
    mechanism: 'A workload serves it for the responses it names.',
    blocked: 'A workload has no custom-pages field in this prototype.'
  }
}

export const RESOURCE_BINDINGS = BINDINGS

export const bindingFor = (resource) => {
  const entry = BINDINGS[resource]
  return entry?.gate ? entry : null
}

export const bindingWritesRule = (resource) => {
  const binding = bindingFor(resource)
  return Boolean(binding?.behavior || binding?.ruleDraft)
}

export const bindingRecord = (resource, id) => {
  const binding = bindingFor(resource)
  if (!binding || !id) return null
  const record = binding.records().find((item) => String(item.id) === String(id))
  return record ? { id: String(record.id), name: record.name } : null
}

export const bindingRuleDraft = (resource, record) => {
  const binding = bindingFor(resource)
  if (!binding || !record) return null
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
