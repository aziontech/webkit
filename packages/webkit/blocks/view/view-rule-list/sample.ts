import type { RuleListRule } from './view-rule-list.vue'

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
    modified: 'yesterday',
    active: true,
    locked: false
  }
]
