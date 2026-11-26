import type { BehaviorDefinition, BuilderPhase, RuleDetails } from './lib/rule-builder'
import type { RuleListPhase, RuleListRule } from './view-rule-list.vue'

export const sampleApplicationRules: RuleListRule[] = [
  {
    id: 're-default',
    name: 'Default rule',
    description: 'Sends every request to the origin when no other rule matches first.',
    phase: 'request',
    author: 'Maya Chen',
    modified: '2026-08-12T12:00:00Z',
    active: true,
    locked: true
  },
  {
    id: 're-maintenance',
    name: 'Maintenance page',
    description: 'Serves the maintenance page while the maintenance header is set.',
    phase: 'request',
    author: 'Leo Park',
    modified: '2026-10-11T12:00:00Z',
    active: false,
    locked: false
  },
  {
    id: 're-www',
    name: 'Redirect www',
    description: 'Sends the www host to the apex domain.',
    phase: 'request',
    author: 'Emily Clark',
    modified: '2026-10-29T12:00:00Z',
    active: true,
    locked: false
  },
  {
    id: 're-gateway',
    name: 'API gateway',
    description: 'Sends API traffic to the gateway service, through the auth check.',
    phase: 'request',
    author: 'Maya Chen',
    modified: '2026-11-08T12:00:00Z',
    active: true,
    locked: false
  },
  {
    id: 're-docs',
    name: 'Docs rewrite',
    description: 'Rewrites the docs path and caches it as a static asset.',
    phase: 'request',
    author: 'Sam Okafor',
    modified: '2026-10-20T12:00:00Z',
    active: true,
    locked: false
  },
  {
    id: 're-cache-bypass',
    name: 'Cache bypass',
    description: 'Keeps API responses out of the cache.',
    phase: 'response',
    author: 'Leo Park',
    modified: '2026-11-05T12:00:00Z',
    active: true,
    locked: false
  },
  {
    id: 're-security-headers',
    name: 'Security headers',
    description: 'Adds the security header set to successful responses.',
    phase: 'response',
    author: 'Emily Clark',
    modified: '2026-11-01T12:00:00Z',
    active: true,
    locked: false
  },
  {
    id: 're-compress',
    name: 'Compress assets',
    description: 'Compresses script bundles on the way out.',
    phase: 'response',
    author: 'Sam Okafor',
    modified: '2026-09-22T12:00:00Z',
    active: false,
    locked: false
  }
]

export const sampleFirewallRules: RuleListRule[] = [
  {
    id: 'fw-office',
    name: 'Allow office network',
    description: 'Lets the office network through before any other rule looks at it.',
    phase: 'request',
    author: 'Maya Chen',
    modified: '2026-09-11T12:00:00Z',
    active: true,
    locked: false
  },
  {
    id: 'fw-scanners',
    name: 'Block scanners',
    description: 'Refuses requests from the scanner network list.',
    phase: 'request',
    author: 'Leo Park',
    modified: '2026-10-20T12:00:00Z',
    active: true,
    locked: false
  },
  {
    id: 'fw-login-rate',
    name: 'Rate limit sign-in',
    description: 'Allows 20 sign-in requests per minute from one address.',
    phase: 'request',
    author: 'Emily Clark',
    modified: '2026-11-04T12:00:00Z',
    active: true,
    locked: false
  },
  {
    id: 'fw-geo',
    name: 'Restrict countries',
    description: 'Refuses requests from countries outside the allowed list.',
    phase: 'request',
    author: 'Sam Okafor',
    modified: '2026-10-11T12:00:00Z',
    active: false,
    locked: false
  },
  {
    id: 'fw-waf-api',
    name: 'WAF on API',
    description: 'Runs the API rule set on every request to the API path.',
    phase: 'request',
    author: 'Maya Chen',
    modified: '2026-11-09T12:00:00Z',
    active: true,
    locked: false
  }
]

export const sampleBehaviorCatalog: BehaviorDefinition[] = [
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

export const sampleVariables = [
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

export const samplePhaseVariables: Record<RuleListPhase, string[]> = {
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

export const samplePolicies = [
  { value: '4021884', label: 'auth-check', scope: 'request' },
  { value: '4021885', label: 'rate-limit', scope: 'request' },
  { value: '4021886', label: 'geo-routing', scope: 'request' },
  { value: '4021887', label: 'ab-test-split', scope: 'request' },
  { value: '4021890', label: 'security-headers', scope: 'any' }
]

export const sampleOptionSources = {
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

export const sampleRuleDetails: Partial<Record<string, RuleDetails>> = {
  're-docs': {
    criteria: [
      {
        conditions: [{ join: null, variable: '${uri}', operator: 'matches', argument: '/docs/*' }]
      }
    ],
    behaviors: [
      { type: 'rewrite-request', target: '/documentation${uri}' },
      { type: 'set-cache-policy', cacheId: 'cs-static' }
    ]
  },
  're-www': {
    criteria: [
      {
        conditions: [
          { join: null, variable: '${host}', operator: 'is-equal', argument: 'www.example.com' }
        ]
      }
    ],
    behaviors: [{ type: 'redirect-301', target: 'https://example.com${uri}' }]
  },
  're-cache-bypass': {
    criteria: [
      {
        conditions: [{ join: null, variable: '${uri}', operator: 'starts-with', argument: '/api/' }]
      }
    ],
    behaviors: [{ type: 'bypass-cache' }]
  }
}

export const sampleBuilderPhases: BuilderPhase[] = [
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
export const sampleOperators = [
  { value: 'is-equal', label: 'is equal' },
  { value: 'is-not-equal', label: 'is not equal' },
  { value: 'starts-with', label: 'starts with' },
  { value: 'does-not-start-with', label: 'does not start with' },
  { value: 'matches', label: 'matches' },
  { value: 'does-not-match', label: 'does not match' },
  { value: 'exists', label: 'exists' },
  { value: 'does-not-exist', label: 'does not exist' }
]
