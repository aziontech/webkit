import type { RuleBuilderRule } from './rule-builder.vue'

export const sampleRule: RuleBuilderRule = {
  name: 'Docs rewrite',
  description: 'Rewrites the docs path and caches it as a static asset.',
  phase: 'request',
  criteria: [[{ variable: '${uri}', operator: 'matches', argument: '/docs/*' }]],
  behaviors: [
    { type: 'rewrite-request', target: '/documentation${uri}' },
    { type: 'set-cache-policy', cacheId: 'cs-static' }
  ],
  active: true
}
