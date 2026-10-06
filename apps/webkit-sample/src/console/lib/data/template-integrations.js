import { addCacheSetting } from './cache-settings'
import { getTemplate, isIntegration } from './templates'

const text = (value) => String(value ?? '').trim()

const setting = (settings, name, fallback = '') => text(settings?.[name]) || fallback

const condition = (variable, operator, argument) => ({ join: null, variable, operator, argument })

const everyRequest = [{ conditions: [condition('${uri}', 'matches', '/*')] }]

const INTEGRATIONS = {
  'azion-proxy': {
    noun: 'proxy',
    creates: ['Connector', 'Rules Engine rule'],
    summary:
      'Adds an HTTP connector for the origin and one request rule that fetches every path through it.',
    connector: (settings, name) => ({
      name: `${name}-origin`,
      type: 'http',
      address: setting(settings, 'originAddress'),
      active: true
    }),
    rule: ({ settings, connector }) => ({
      name: `Proxy to ${setting(settings, 'originAddress', 'the origin')}`,
      description: `Fetches every request through the ${connector?.name ?? 'origin'} connector.`,
      phase: 'request',
      criteria: everyRequest,
      behaviors: [
        { type: 'set-connector', connectorId: connector?.id ?? '' },
        ...(setting(settings, 'hostHeader')
          ? [{ type: 'add-request-header', target: `host: ${setting(settings, 'hostHeader')}` }]
          : []),
        { type: 'deliver' }
      ],
      active: true
    })
  },

  'dynamic-static-optimization': {
    noun: 'CDN',
    creates: ['Connector', 'Cache policy', 'Rules Engine rule'],
    summary:
      'Adds an HTTP connector for the origin, a cache policy for what it returns, and one request rule that serves every path through both.',
    connector: (settings, name) => ({
      name: `${name}-origin`,
      type: 'http',
      address: setting(settings, 'originAddress'),
      active: true
    }),
    cachePolicy: (settings, name) => ({
      name: `${name} CDN`,
      browserCache: {
        behavior: 'override',
        maxAge: Number(setting(settings, 'browserCacheTtl', '7200')) || 7200
      },
      edgeCache: { behavior: 'override', maxAge: 604800 },
      tieredCache: true
    }),
    rule: ({ settings, connector, cachePolicy }) => ({
      name: 'Cache through Azion',
      description: `Serves every path from ${setting(settings, 'originAddress', 'the origin')} and caches it under ${cachePolicy?.name ?? 'the cache policy'}.`,
      phase: 'request',
      criteria: everyRequest,
      behaviors: [
        { type: 'set-connector', connectorId: connector?.id ?? '' },
        { type: 'set-cache-policy', cacheId: cachePolicy?.id ?? '' },
        { type: 'deliver' }
      ],
      active: true
    })
  },

  'azion-static-site': {
    noun: 'static site',
    creates: ['Connector', 'Rules Engine rule'],
    summary:
      'Adds a storage connector for the built files and one request rule that delivers them.',
    connector: (settings, name) => ({
      name: `${name}-static`,
      type: 'storage',
      bucket: setting(settings, 'outputDirectory'),
      active: true
    }),
    rule: ({ settings, connector }) => ({
      name: 'Serve the static site',
      description: `Delivers every path from the ${connector?.name ?? 'storage'} bucket, falling back to ${setting(settings, 'indexDocument', 'index.html')}.`,
      phase: 'request',
      criteria: everyRequest,
      behaviors: [{ type: 'set-connector', connectorId: connector?.id ?? '' }, { type: 'deliver' }],
      active: true
    })
  }
}

export const integrationFor = (slug) => INTEGRATIONS[slug] ?? null

export const integrationTemplates = () =>
  Object.keys(INTEGRATIONS).map(getTemplate).filter(isIntegration)

export const integrationPreview = (slug, settings, name) => {
  const spec = integrationFor(slug)
  if (!spec) return null
  const connector = spec.connector ? spec.connector(settings, name) : null
  const cachePolicy = spec.cachePolicy ? spec.cachePolicy(settings, name) : null
  return {
    creates: spec.creates,
    summary: spec.summary,
    connector,
    cachePolicy,
    rule: spec.rule({ settings, connector, cachePolicy })
  }
}

export const integrationRule = (slug, records) => {
  const spec = integrationFor(slug)
  return spec ? spec.rule(records) : null
}

export const installIntegration = (slug, settings, name, storeConnector) => {
  const spec = integrationFor(slug)
  if (!spec) return null

  const connectorForm = spec.connector ? spec.connector(settings, name) : null
  const connector = connectorForm
    ? { ...connectorForm, id: storeConnector(connectorForm).id }
    : null
  const cachePolicy = spec.cachePolicy ? addCacheSetting(spec.cachePolicy(settings, name)) : null

  return { connector, cachePolicy, rule: spec.rule({ settings, connector, cachePolicy }) }
}
