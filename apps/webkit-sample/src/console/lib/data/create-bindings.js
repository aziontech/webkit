// WHAT A RESOURCE STILL NEEDS BEFORE IT DOES ANYTHING — read off the v4 API.
//
// Every resource in this table is created by a TOP-LEVEL endpoint (`POST /workspace/…`)
// and then does nothing at all until something else points at it. That gap is where a
// console loses people: the create succeeds, the list shows a row, and the thing never
// runs — so the reader goes looking for what they did wrong in a resource that is fine.
//
// So the create pages of exactly these resources open on the host question
// (../../components/resource/ApplicationGate.vue) instead of on their form. The friction is
// deliberate: it is cheaper to answer "which application" before writing the code than to
// discover afterwards that nothing calls it.
//
// ── THE TABLE, AND WHERE IT COMES FROM ──
//
// `host` and `mechanism` are the API's, not a product opinion — each row cites the endpoint
// that creates the resource and the one that binds it (./create-resources.js carries the
// same `api` strings on the create specs themselves):
//
//   function      POST /workspace/functions        → an INSTANCE on an application
//                                                    (POST /v4/workspace/applications/{id}/functions)
//                                                    plus a Rules Engine `run_function` rule.
//                                                    A function whose `execution_environment`
//                                                    is `firewall` binds to a FIREWALL instead.
//   connector     POST /workspace/connectors       → a Rules Engine `set_connector` rule on an
//                                                    application (or that application's origin).
//   WAF rule set  POST /workspace/wafs             → a FIREWALL rule (`set_waf_ruleset`). Its own
//                                                    create spec says so: "Attach it to a firewall
//                                                    to put it in the path of traffic."
//   network list  POST /workspace/network_lists    → referenced from a FIREWALL rule's criteria;
//                                                    it is never evaluated on its own.
//   custom pages  POST /workspace/custom_pages     → connected to a WORKLOAD: "a custom page set
//                                                    groups the responses one workload serves".
//
// Everything else the console creates is either a host itself (application, firewall,
// workload), standalone (bucket, certificate — bound at a domain, not here), or asks for its
// own sources inside its form (data stream's `inputs`). Those are not gated.
//
// ── WHY ONLY TWO ARE GATED TODAY ──
//
// `gate: true` means this prototype can actually FINISH the chain — bind the resource and
// land the reader on the surface that puts it to work. That is true for the two whose host is
// an APPLICATION, because the application's Rules Engine is built
// (../../pages/applications/panels/RulesEngine.vue). The other three name a host whose binding
// surface does not exist here: there is no firewall rules engine and no custom-pages field on
// a workload. Gating them would be friction that leads nowhere, which is the opposite of the
// point — so they are recorded with `gate: false` and the reason, and light up the day their
// surface lands.
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
    // NO RULE TO DRAFT. Nothing calls a firewall — the application it is created in runs
    // behind it, and what the firewall DOES is the rules it holds. So the create ends on
    // the firewall's own Rules Engine, empty and ready, rather than on a drafted rule.
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
    // THE ONLY BINDING THAT IS A CRITERION, NOT A BEHAVIOR. A network list is not something
    // a rule DOES — it is what a rule asks about. So this one writes its own draft: the
    // condition carries the list, and Deny is the behavior a reader who just made a list of
    // addresses is overwhelmingly reaching for. It is a draft, so the behavior is the first
    // thing they can change.
    ruleDraft: (record) => ({
      name: `Block ${record.name}`,
      description: `Refuses requests whose address is in the ${record.name} list.`,
      phase: 'request',
      criteria: [
        {
          conditions: [
            {
              join: null,
              variable: '${remote_addr}',
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

/** Every resource the API leaves inert until something points at it, gated or not. */
export const RESOURCE_BINDINGS = BINDINGS

/**
 * The binding a resource's create page asks about — only the ones whose chain this console
 * can finish. A resource that needs a host we cannot bind it to returns null rather than
 * asking a question with no useful answer.
 *
 * @param {string} resource A `createResources` id.
 * @returns {object|null}
 */
export const bindingFor = (resource) => {
  const entry = BINDINGS[resource]
  return entry?.gate ? entry : null
}

/**
 * Whether binding this resource ENDS IN A RULE the reader has to save — true for the three
 * that are named by one, false for a firewall, which is bound by simply being created
 * inside an application. What the success toast says next depends on it.
 *
 * @param {string} resource A `createResources` id.
 * @returns {boolean}
 */
export const bindingWritesRule = (resource) => {
  const binding = bindingFor(resource)
  return Boolean(binding?.behavior || binding?.ruleDraft)
}

/**
 * One record of a bound resource, by id — what the rule draft is named after.
 *
 * @param {string} resource A `createResources` id.
 * @param {string} id
 * @returns {{id: string, name: string}|null}
 */
export const bindingRecord = (resource, id) => {
  const binding = bindingFor(resource)
  if (!binding || !id) return null
  const record = binding.records().find((item) => String(item.id) === String(id))
  return record ? { id: String(record.id), name: record.name } : null
}

/**
 * The rule that puts a bound resource to work — what the Rules Engine opens already
 * written, for the reader to read and save.
 *
 * @param {string} resource A `createResources` id.
 * @param {{id: string, name: string}} record The resource that was just created.
 * @returns {object|null} A rule the create drawer opens on.
 */
export const bindingRuleDraft = (resource, record) => {
  const binding = bindingFor(resource)
  if (!binding || !record) return null
  // A binding that writes its OWN rule — the network list, whose reference is a criterion
  // rather than a behavior.
  if (binding.ruleDraft) return binding.ruleDraft(record)
  // A binding with neither has no rule to write: a firewall is not CALLED by anything, it
  // simply fronts the application it was created in.
  if (!binding.behavior) return null
  return {
    name: binding.ruleName(record.name),
    description: binding.ruleDescription(record.name),
    phase: 'request',
    criteria: [
      { conditions: [{ join: null, variable: '${uri}', operator: 'matches', argument: '/*' }] }
    ],
    behaviors: [{ type: binding.behavior, [binding.field]: record.id }],
    active: true
  }
}
