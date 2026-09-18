// Firewall Rules Engine — the VOCABULARY of a firewall rule.
//
// Same anatomy as the application's (./rules-engine.js): `if <criteria> then <behaviors>`,
// the same operators, the same conditional-argument shape. What differs is WHEN it runs and
// WHAT it can do — and those two differences are the whole reason it is a separate engine:
//
//   ONE PHASE. A firewall rule runs before the request reaches the application it protects.
//     There is no response phase to speak of — by the time an answer exists, the firewall
//     has already let the request through.
//   IT CAN REFUSE. The application's engine shapes a request; this one can end it — `Deny`
//     and `Drop` are terminal, and nothing after them runs. That is what a firewall is for.
//
// The behaviors are what the firewall's MODULES make possible (./firewalls.js): WAF is what
// `Set WAF Rule Set` applies, Functions is what `Run Function` runs. A firewall with a
// module off can still hold the rule; the module is what makes it act.
import { createdRowsFor } from '../state/created-resources'
import { functions } from './functions'
import { NETWORK_LISTS } from './network-lists'
import {
  OPERATORS as SHARED_OPERATORS,
  takesArgument as sharedTakesArgument
} from './rules-engine'
import { WAF_RULES } from './waf-rules'

// ── THE OPERATORS, PLUS THE TWO ONLY A FIREWALL HAS ──
//
// A firewall decides whether a request is allowed at all, and the fact it decides on most
// often is WHERE the request came from — an address, against a list of them. So this engine
// can compare against a NETWORK LIST (./network-lists.js), which is a record the account
// owns rather than a value anyone types: `is in network list` takes a list, picked.
//
// That is also the whole reason a network list exists. Created on its own it matches
// nothing; the rule that references it is what puts it to work (./create-bindings.js), the
// same way a WAF rule set waits for the rule that applies it.
const NETWORK_LIST_OPERATORS = [
  { value: 'is-in-network-list', label: 'is in network list' },
  { value: 'is-not-in-network-list', label: 'is not in network list' }
]

const NETWORK_LIST_OPERATOR_VALUES = NETWORK_LIST_OPERATORS.map((operator) => operator.value)

/** The shared comparisons, then the two this engine adds. */
export const OPERATORS = [...SHARED_OPERATORS, ...NETWORK_LIST_OPERATORS]

export const operatorLabel = (value) => OPERATORS.find((o) => o.value === value)?.label ?? ''

export const takesArgument = (operator) =>
  NETWORK_LIST_OPERATOR_VALUES.includes(operator) || sharedTakesArgument(operator)

/**
 * What the operator compares against. The network-list pair takes a RECORD, so the row
 * offers the account's lists instead of a text box that would accept a name nothing
 * resolves.
 *
 * @param {string} operator
 * @returns {{kind: string, source?: string, label?: string}}
 */
export const operatorArgument = (operator) =>
  NETWORK_LIST_OPERATOR_VALUES.includes(operator)
    ? { kind: 'select', source: 'network-lists', label: 'Network list' }
    : { kind: 'text' }

/**
 * One phase, declared as a list anyway, so the drawer renders both engines from the same
 * shape — and drops the Phase question entirely when there is only one answer.
 */
export const PHASES = [
  {
    value: 'request',
    label: 'Request Phase',
    description: 'Runs before the request reaches the application.'
  }
]

export const PHASE_HINT =
  'A firewall rule runs on the way in, before the application sees the request.'

const text = (field, placeholder, label) => ({ kind: 'text', field, placeholder, label })

const CATALOG = [
  {
    value: 'deny',
    label: 'Deny (403 Forbidden)',
    phases: ['request'],
    argument: null
  },
  {
    value: 'drop',
    label: 'Drop (close connection)',
    phases: ['request'],
    argument: null
  },
  {
    value: 'run-function',
    label: 'Run Function',
    phases: ['request'],
    argument: {
      kind: 'select',
      field: 'functionId',
      source: 'firewall-functions',
      label: 'Function'
    }
  },
  {
    value: 'set-waf-ruleset',
    label: 'Set WAF Rule Set',
    phases: ['request'],
    argument: { kind: 'select', field: 'wafId', source: 'waf-rulesets', label: 'Rule set' }
  },
  {
    value: 'set-rate-limit',
    label: 'Set Rate Limit',
    phases: ['request'],
    argument: {
      kind: 'group',
      fields: [
        { field: 'average', placeholder: 'Requests per second', label: 'Average rate' },
        { field: 'burst', placeholder: 'Maximum burst', label: 'Burst' }
      ]
    }
  },
  {
    value: 'set-custom-response',
    label: 'Set Custom Response',
    phases: ['request'],
    argument: {
      kind: 'group',
      fields: [
        { field: 'status', placeholder: 'Status code', label: 'Status' },
        { field: 'contentType', placeholder: 'Content type', label: 'Content type' },
        { field: 'body', placeholder: 'Response body', label: 'Body' }
      ]
    }
  },
  {
    value: 'tag-event',
    label: 'Tag Event',
    phases: ['request'],
    argument: text('tag', 'tag-name', 'Tag')
  }
]

const BY_VALUE = Object.fromEntries(CATALOG.map((behavior) => [behavior.value, behavior]))

/** The behavior's display name — what a list, a log line or a diff calls it. */
export const behaviorLabel = (value) => BY_VALUE[value]?.label ?? ''

/** What the behavior is given, or `null` when it reads nothing. */
export const behaviorArgument = (value) => BY_VALUE[value]?.argument ?? null

/** The behaviors this phase offers, in the catalog's order. */
export const behaviorsFor = (phase) => CATALOG.filter((behavior) => behavior.phases.includes(phase))

export const behaviorAllowedIn = (value, phase) => Boolean(BY_VALUE[value]?.phases.includes(phase))

/** A rule that refuses the request ends there — nothing after it can run. */
const TERMINAL = ['deny', 'drop']

export const isTerminalBehavior = (value) => TERMINAL.includes(value)

/**
 * The records a `select`-kind argument offers, read live from the store that owns them.
 *
 * `run-function` lists only functions whose `execution_environment` is `firewall`: an
 * application function receives a different request object and the firewall cannot run it.
 */
export const behaviorOptions = (source) => {
  if (source === 'firewall-functions') {
    return functions.value
      .filter((fn) => fn.executionEnvironment === 'firewall')
      .map((fn) => ({ value: fn.id, label: fn.name }))
  }
  if (source === 'network-lists') {
    return [...createdRowsFor('network-lists'), ...NETWORK_LISTS].map((list) => ({
      value: list.id,
      label: list.name
    }))
  }
  if (source === 'waf-rulesets') {
    return [...createdRowsFor('waf-rules'), ...WAF_RULES].map((ruleSet) => ({
      value: ruleSet.id,
      label: ruleSet.name
    }))
  }
  return []
}

/** The one note a `select` argument carries under it, or `''`. */
export const behaviorArgumentNote = (source) =>
  source === 'firewall-functions'
    ? 'Only functions whose execution environment is Firewall can run here.'
    : ''
