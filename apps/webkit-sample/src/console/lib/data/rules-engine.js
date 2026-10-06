import { createdRowsFor } from '../state/created-resources'
import { useCacheSettings } from './cache-settings'
import { CONNECTORS } from './connectors'
import { functions } from './functions'

export const PHASES = [
  {
    value: 'request',
    label: 'Request Phase',
    description: 'Configure the requests made to the edge.'
  },
  {
    value: 'response',
    label: 'Response Phase',
    description: 'Configure the responses delivered to end-users.'
  }
]

export const PHASE_HINT =
  'When the rule runs. Request rules act on what arrives at the edge; response rules act on what leaves it. The two are separate programs and never interleave.'

const VARIABLES = [
  '${arg_}',
  '${args}',
  '${cookie_}',
  '${device_group}',
  '${domain}',
  '${geoip_city}',
  '${geoip_city_continent_code}',
  '${geoip_city_country_code}',
  '${geoip_city_country_name}',
  '${geoip_continent_code}',
  '${geoip_country_code}',
  '${geoip_country_name}',
  '${geoip_region}',
  '${geoip_region_name}',
  '${host}',
  '${http_}',
  '${remote_addr}',
  '${remote_port}',
  '${remote_user}',
  '${request}',
  '${request_body}',
  '${request_method}',
  '${request_uri}',
  '${scheme}',
  '${uri}'
]

const REQUEST_VARIABLES = ['${server_addr}', '${server_port}']

const RESPONSE_VARIABLES = [
  '${sent_http_name}',
  '${status}',
  '${tcpinfo_rtt}',
  '${upstream_addr}',
  '${upstream_cookie_}',
  '${upstream_http_}',
  '${upstream_status}'
]

export const variablesFor = (phase) =>
  [...VARIABLES, ...(phase === 'response' ? RESPONSE_VARIABLES : REQUEST_VARIABLES)]
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ value }))

export const OPERATORS = [
  { value: 'is-equal', label: 'is equal' },
  { value: 'is-not-equal', label: 'is not equal' },
  { value: 'starts-with', label: 'starts with' },
  { value: 'does-not-start-with', label: 'does not start with' },
  { value: 'matches', label: 'matches' },
  { value: 'does-not-match', label: 'does not match' },
  { value: 'exists', label: 'exists' },
  { value: 'does-not-exist', label: 'does not exist' }
]

export const operatorLabel = (value) => OPERATORS.find((o) => o.value === value)?.label ?? ''

export const takesArgument = (operator) => operator !== 'exists' && operator !== 'does-not-exist'

export const operatorArgument = () => ({ kind: 'text' })

const text = (field, placeholder, label) => ({ kind: 'text', field, placeholder, label })

const CATALOG = [
  {
    value: 'add-request-cookie',
    label: 'Add Request Cookie',
    phases: ['request'],
    argument: text('target', 'cookie-name=value', 'Cookie')
  },
  {
    value: 'add-request-header',
    label: 'Add Request Header',
    phases: ['request'],
    argument: text('target', 'header-name: value', 'Header')
  },
  {
    value: 'add-response-cookie',
    label: 'Add Response Cookie',
    phases: ['response'],
    argument: text('target', 'cookie-name=value', 'Cookie')
  },
  {
    value: 'add-response-header',
    label: 'Add Response Header',
    phases: ['response'],
    argument: text('target', 'header-name: value', 'Header')
  },
  { value: 'bypass-cache', label: 'Bypass Cache', phases: ['request'], argument: null },
  {
    value: 'capture-match-groups',
    label: 'Capture Match Groups',
    phases: ['request', 'response'],
    argument: {
      kind: 'group',
      fields: [
        { field: 'capturedArray', placeholder: 'Captured array name', label: 'Captured array' },
        { field: 'subject', placeholder: 'Subject', label: 'Subject' },
        { field: 'regex', placeholder: 'Regex', label: 'Regex' }
      ]
    }
  },
  { value: 'deliver', label: 'Deliver', phases: ['request', 'response'], argument: null },
  { value: 'deny', label: 'Deny (403 Forbidden)', phases: ['request'], argument: null },
  { value: 'enable-gzip', label: 'Enable Gzip', phases: ['request', 'response'], argument: null },
  {
    value: 'filter-request-cookie',
    label: 'Filter Request Cookie',
    phases: ['request'],
    argument: text('target', 'cookie-name or cookie-name=cookie-value', 'Cookie')
  },
  {
    value: 'filter-request-header',
    label: 'Filter Request Header',
    phases: ['request'],
    argument: text('target', 'header-name', 'Header')
  },
  {
    value: 'filter-response-cookie',
    label: 'Filter Response Cookie',
    phases: ['response'],
    argument: text('target', 'cookie-name or cookie-name=cookie-value', 'Cookie')
  },
  {
    value: 'filter-response-header',
    label: 'Filter Response Header',
    phases: ['response'],
    argument: text('target', 'header-name', 'Header')
  },
  { value: 'forward-cookies', label: 'Forward Cookies', phases: ['request'], argument: null },
  { value: 'no-content', label: 'No Content (204)', phases: ['request'], argument: null },
  { value: 'optimize-images', label: 'Optimize Images', phases: ['request'], argument: null },
  {
    value: 'redirect-http-to-https',
    label: 'Redirect HTTP to HTTPS',
    phases: ['request'],
    argument: null
  },
  {
    value: 'redirect-301',
    label: 'Redirect To (301 Moved Permanently)',
    phases: ['request', 'response'],
    argument: text('target', 'https://example.com${uri}', 'Location')
  },
  {
    value: 'redirect-302',
    label: 'Redirect To (302 Found)',
    phases: ['request', 'response'],
    argument: text('target', 'https://example.com${uri}', 'Location')
  },
  {
    value: 'rewrite-request',
    label: 'Rewrite Request',
    phases: ['request'],
    argument: text('target', 'URL-path', 'Path')
  },
  {
    value: 'run-function',
    label: 'Run Function',
    phases: ['request', 'response'],
    argument: { kind: 'select', field: 'functionId', source: 'functions', label: 'Function' }
  },
  {
    value: 'set-cache-policy',
    label: 'Set Cache Policy',
    phases: ['request'],
    argument: { kind: 'select', field: 'cacheId', source: 'cache-settings', label: 'Cache policy' }
  },
  {
    value: 'set-connector',
    label: 'Set Connector',
    phases: ['request'],
    argument: { kind: 'select', field: 'connectorId', source: 'connectors', label: 'Connector' }
  }
]

const BY_VALUE = Object.fromEntries(CATALOG.map((behavior) => [behavior.value, behavior]))

export const behaviorLabel = (value) => BY_VALUE[value]?.label ?? ''

export const behaviorArgument = (value) => BY_VALUE[value]?.argument ?? null

export const behaviorsFor = (phase) => CATALOG.filter((behavior) => behavior.phases.includes(phase))

export const behaviorAllowedIn = (value, phase) => Boolean(BY_VALUE[value]?.phases.includes(phase))

const TERMINAL = ['deliver', 'deny', 'no-content', 'redirect-301', 'redirect-302']

export const isTerminalBehavior = (value) => TERMINAL.includes(value)

export const behaviorOptions = (source, phase) => {
  if (source === 'cache-settings') {
    return useCacheSettings().value.map((setting) => ({ value: setting.id, label: setting.name }))
  }
  if (source === 'connectors') {
    return [...createdRowsFor('connectors'), ...CONNECTORS].map((connector) => ({
      value: connector.id,
      label: connector.name
    }))
  }
  if (source === 'functions') {
    return functions.value
      .filter((fn) => fn.executionEnvironment === 'application')
      .filter((fn) => phase !== 'response' || fn.runtimeApi === 'azion_lua')
      .map((fn) => ({ value: fn.id, label: fn.name }))
  }
  return []
}

export const behaviorArgumentNote = (source, phase) =>
  source === 'functions' && phase === 'response'
    ? 'Only functions with the Lua runtime run in the response phase.'
    : ''
