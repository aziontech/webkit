import { createdRowsFor } from '../state/created-resources'
import { functions } from './functions'
import { NETWORK_LISTS } from './network-lists'
import { OPERATORS as SHARED_OPERATORS, takesArgument as sharedTakesArgument } from './rules-engine'
import { WAF_RULES } from './waf-rules'

const NETWORK_LIST_OPERATORS = [
  { value: 'is-in-network-list', label: 'is in network list' },
  { value: 'is-not-in-network-list', label: 'is not in network list' }
]

const NETWORK_LIST_OPERATOR_VALUES = NETWORK_LIST_OPERATORS.map((operator) => operator.value)

export const OPERATORS = [...SHARED_OPERATORS, ...NETWORK_LIST_OPERATORS]

export const operatorLabel = (value) => OPERATORS.find((o) => o.value === value)?.label ?? ''

export const takesArgument = (operator) =>
  NETWORK_LIST_OPERATOR_VALUES.includes(operator) || sharedTakesArgument(operator)

export const operatorArgument = (operator) =>
  NETWORK_LIST_OPERATOR_VALUES.includes(operator)
    ? { kind: 'select', source: 'network-lists', label: 'Network list' }
    : { kind: 'text' }

const VARIABLES = [
  { value: '${client_certificate_validation}', label: 'Client Certificate Validation' },
  { value: '${header_accept}', label: 'Header Accept' },
  { value: '${header_accept_encoding}', label: 'Header Accept Encoding' },
  { value: '${header_accept_language}', label: 'Header Accept Language' },
  { value: '${header_cookie}', label: 'Header Cookie' },
  { value: '${header_origin}', label: 'Header Origin' },
  { value: '${header_referer}', label: 'Header Referer' },
  { value: '${header_user_agent}', label: 'Header User Agent' },
  { value: '${host}', label: 'Host' },
  { value: '${network}', label: 'Network' },
  { value: '${request_args}', label: 'Request Args' },
  { value: '${request_method}', label: 'Request Method' },
  { value: '${request_uri}', label: 'Request URI' },
  { value: '${scheme}', label: 'Scheme' },
  { value: '${ssl_verification_status}', label: 'SSL Verification Status' }
]

export const variablesFor = () => VARIABLES

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

export const behaviorLabel = (value) => BY_VALUE[value]?.label ?? ''

export const behaviorArgument = (value) => BY_VALUE[value]?.argument ?? null

export const behaviorsFor = (phase) => CATALOG.filter((behavior) => behavior.phases.includes(phase))

export const behaviorAllowedIn = (value, phase) => Boolean(BY_VALUE[value]?.phases.includes(phase))

const TERMINAL = ['deny', 'drop']

export const isTerminalBehavior = (value) => TERMINAL.includes(value)

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

export const behaviorArgumentNote = (source) =>
  source === 'firewall-functions'
    ? 'Only functions whose execution environment is Firewall can run here.'
    : ''
