export const crumbs = [{ label: 'Applications', href: '/docs/applications' }, { label: 'Overview' }]

export const metaActions = [
  { value: 'copy', label: 'Copy as Markdown', icon: 'az az-copy' },
  { value: 'markdown', label: 'View as Markdown', icon: 'az az-eye' },
  {
    value: 'agent-setup',
    label: 'Agent setup',
    icon: 'az az-microchip-ai',
    href: '/docs/agent-setup'
  }
]

export const ruleTabs = [
  {
    label: 'JSON',
    value: 'json',
    language: 'json',
    code:
      '{\n  "name": "Cache images",\n  "active": true,\n' +
      '  "criteria": [[{ "variable": "${uri}", "operator": "starts_with", "argument": "/images" }]],\n' +
      '  "behaviors": [{ "type": "set_cache_policy", "attributes": { "value": 1020 } }]\n}'
  }
]

export const scope = [
  { term: 'Phases', text: 'Request rules run before the origin, response rules after it.' },
  { term: 'Origins', text: 'A connector names where a request goes when the cache misses.' },
  { term: 'Functions', text: 'An instance runs your code on the request or the response.' },
  { term: 'Limits', text: 'Up to 1,000 rules per application, evaluated in order.' }
]
