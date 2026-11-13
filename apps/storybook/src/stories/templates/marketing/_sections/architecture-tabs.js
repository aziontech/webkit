export const SITE_SECTION = {
  _id: 'architecture-tabs',
  props: {
    eyebrow: 'Routing',
    title: 'Every AI request through one control point',
    description:
      'Every client calls one endpoint. Firewall stops abuse, then a function checks the key, routes the call, and logs it.',
    position: 'bottom',
    tabs: [
      {
        value: 'request-path',
        title: 'Request path',
        description:
          'A call crosses Firewall, the application and the function before it reaches a model.',
        diagram: 'ai-gateway'
      },
      {
        value: 'failover',
        title: 'Provider failover',
        description: 'When a provider degrades, the gateway moves to the next model on the alias.',
        diagram: 'ai-gateway-provider-failover'
      },
      {
        value: 'costs',
        title: 'Cost routing',
        description:
          'Premium tokens go only where they pay off; everyone else gets a lighter model.',
        diagram: 'ai-gateway-model-routing'
      },
      {
        value: 'latency',
        title: 'Latency routing',
        description: 'Real-time tasks run on AI Inference, close to the user, in under 30 ms.',
        diagram: 'ai-gateway-latency-routing'
      },
      {
        value: 'cache',
        title: 'Response cache',
        description:
          'A repeated prompt is answered from cache, with no model call and no tokens spent.',
        diagram: 'ai-gateway-response-cache'
      }
    ],
    primaryAction: { label: 'Docs', href: '/product-preview', trailing: true }
  }
}

export const PLATFORM_SECTION = {
  _id: 'architecture-tabs',
  props: {
    anchor: 'platform-architecture',
    eyebrow: 'Platform',
    title: 'One request through the Azion platform',
    description:
      'The base architecture every product plugs into: a workload answers near the user, Firewall filters first, a function runs where logic is needed, data sits in the same data center, and every request is seen.',
    position: 'bottom',
    tabs: [
      {
        value: 'request-path',
        title: 'Request path',
        description:
          'Routing sends the request to the nearest data center, where the workload answers from cache or the origin.',
        diagram: 'workloads'
      },
      {
        value: 'security',
        title: 'Security first',
        description:
          'Network lists, the WAF and rate limits run in order before any application code.',
        diagram: 'firewall'
      },
      {
        value: 'compute',
        title: 'Code at the edge',
        description: 'A rule runs a function on the routes that need logic, with no cold start.',
        diagram: 'functions'
      },
      {
        value: 'data',
        title: 'Data close by',
        description:
          'Reads come from the nearest replica; writes are applied once on the primary.',
        diagram: 'sql-database'
      },
      {
        value: 'observe',
        title: 'Every request seen',
        description:
          'Each request becomes a queryable event within seconds, in the Console or over GraphQL.',
        diagram: 'real-time-events'
      }
    ],
    primaryAction: { label: 'See every product', href: '/site/products', trailing: true }
  }
}
