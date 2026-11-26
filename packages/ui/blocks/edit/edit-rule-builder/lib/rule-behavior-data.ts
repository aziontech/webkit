import type { SelectOptionItem } from '@aziontech/ui/select'

type ArgumentInput = { field: string; placeholder: string; label: string }
export type BehaviorArgument =
  | ({ kind: 'text' } & ArgumentInput)
  | { kind: 'select'; field: string; source: string; label: string }
  | { kind: 'group'; fields: ArgumentInput[] }
type BehaviorDefinition = {
  value: string
  label: string
  phases: string[]
  argument: BehaviorArgument | null
}
export type Condition = { variable: string; id: string; operator: string; argument: string }
export type RuleBehavior = { type: string; id: string; [field: string]: string }

export const PHASES = [
  {
    value: 'request',
    label: 'Request phase',
    description: 'Configure the requests the service receives.'
  },
  {
    value: 'response',
    label: 'Response phase',
    description: 'Configure the responses sent back to clients.'
  }
]
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
export const catalog: BehaviorDefinition[] = [
  {
    value: 'add-request-cookie',
    label: 'Add Request Cookie',
    phases: ['request'],
    argument: { kind: 'text', field: 'target', placeholder: 'cookie-name=value', label: 'Cookie' }
  },
  {
    value: 'add-request-header',
    label: 'Add Request Header',
    phases: ['request'],
    argument: {
      kind: 'text',
      field: 'target',
      placeholder: 'header-name: value',
      label: 'Header'
    }
  },
  {
    value: 'add-response-cookie',
    label: 'Add Response Cookie',
    phases: ['response'],
    argument: { kind: 'text', field: 'target', placeholder: 'cookie-name=value', label: 'Cookie' }
  },
  {
    value: 'add-response-header',
    label: 'Add Response Header',
    phases: ['response'],
    argument: {
      kind: 'text',
      field: 'target',
      placeholder: 'header-name: value',
      label: 'Header'
    }
  },
  {
    value: 'apply-policy',
    label: 'Apply Policy',
    phases: ['request', 'response'],
    argument: { kind: 'select', field: 'policyId', source: 'policies', label: 'Policy' }
  },
  {
    value: 'bypass-cache',
    label: 'Bypass Cache',
    phases: ['request'],
    argument: null
  },
  {
    value: 'capture-match-groups',
    label: 'Capture Match Groups',
    phases: ['request', 'response'],
    argument: {
      kind: 'group',
      fields: [
        {
          field: 'capturedArray',
          placeholder: 'Captured array name',
          label: 'Captured array'
        },
        { field: 'subject', placeholder: 'Subject', label: 'Subject' },
        { field: 'regex', placeholder: 'Regex', label: 'Regex' }
      ]
    }
  },
  {
    value: 'deliver',
    label: 'Deliver',
    phases: ['request', 'response'],
    argument: null
  },
  {
    value: 'deny',
    label: 'Deny (403 Forbidden)',
    phases: ['request'],
    argument: null
  },
  {
    value: 'enable-gzip',
    label: 'Enable Gzip',
    phases: ['request', 'response'],
    argument: null
  },
  {
    value: 'filter-request-cookie',
    label: 'Filter Request Cookie',
    phases: ['request'],
    argument: {
      kind: 'text',
      field: 'target',
      placeholder: 'cookie-name or cookie-name=cookie-value',
      label: 'Cookie'
    }
  },
  {
    value: 'filter-request-header',
    label: 'Filter Request Header',
    phases: ['request'],
    argument: { kind: 'text', field: 'target', placeholder: 'header-name', label: 'Header' }
  },
  {
    value: 'filter-response-cookie',
    label: 'Filter Response Cookie',
    phases: ['response'],
    argument: {
      kind: 'text',
      field: 'target',
      placeholder: 'cookie-name or cookie-name=cookie-value',
      label: 'Cookie'
    }
  },
  {
    value: 'filter-response-header',
    label: 'Filter Response Header',
    phases: ['response'],
    argument: { kind: 'text', field: 'target', placeholder: 'header-name', label: 'Header' }
  },
  {
    value: 'forward-cookies',
    label: 'Forward Cookies',
    phases: ['request'],
    argument: null
  },
  {
    value: 'no-content',
    label: 'No Content (204)',
    phases: ['request'],
    argument: null
  },
  {
    value: 'optimize-images',
    label: 'Optimize Images',
    phases: ['request'],
    argument: null
  },
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
    argument: {
      kind: 'text',
      field: 'target',
      placeholder: 'https://example.com${uri}',
      label: 'Location'
    }
  },
  {
    value: 'redirect-302',
    label: 'Redirect To (302 Found)',
    phases: ['request', 'response'],
    argument: {
      kind: 'text',
      field: 'target',
      placeholder: 'https://example.com${uri}',
      label: 'Location'
    }
  },
  {
    value: 'rewrite-request',
    label: 'Rewrite Request',
    phases: ['request'],
    argument: { kind: 'text', field: 'target', placeholder: 'URL-path', label: 'Path' }
  },
  {
    value: 'route-to-service',
    label: 'Route to Service',
    phases: ['request'],
    argument: { kind: 'select', field: 'serviceId', source: 'services', label: 'Service' }
  },
  {
    value: 'set-cache-policy',
    label: 'Set Cache Policy',
    phases: ['request'],
    argument: {
      kind: 'select',
      field: 'cacheId',
      source: 'cache-settings',
      label: 'Cache policy'
    }
  }
]
export const variables = [
  '${arg_}',
  '${args}',
  '${cookie_}',
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
export const phaseVariables: Record<string, string[]> = {
  request: ['${server_addr}', '${server_port}'],
  response: [
    '${sent_http_name}',
    '${status}',
    '${tcpinfo_rtt}',
    '${upstream_addr}',
    '${upstream_cookie_}',
    '${upstream_http_}',
    '${upstream_status}'
  ]
}
export const policies = [
  { value: '4021884', label: 'auth-check', scope: 'request' },
  { value: '4021885', label: 'rate-limit', scope: 'request' },
  { value: '4021886', label: 'geo-routing', scope: 'request' },
  { value: '4021887', label: 'ab-test-split', scope: 'request' },
  { value: '4021890', label: 'security-headers', scope: 'any' }
]
export const sources: Record<string, SelectOptionItem[]> = {
  'cache-settings': [
    { value: 'cs-default', label: 'Default Cache' },
    { value: 'cs-static', label: 'Static Assets' }
  ],
  services: [
    { value: '7710021', label: 'api-primary' },
    { value: '7710022', label: 'static-assets' },
    { value: '7710023', label: 'api-failover' },
    { value: '7710024', label: 'uploads' },
    { value: '7710025', label: 'live-events' },
    { value: '7710026', label: 'legacy-cms' },
    { value: '7710027', label: 'docs-static' }
  ]
}
