<script setup>
  import ArchitectureTabsSection from '@aziontech/webkit/architecture-tabs-section'
  import Container from '@aziontech/webkit/container'
  import Spacer from '@aziontech/webkit/spacer'

  const tabs = [
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
      description: 'Reads come from the nearest replica; writes are applied once on the primary.',
      diagram: 'sql-database'
    },
    {
      value: 'observe',
      title: 'Every request seen',
      description:
        'Each request becomes a queryable event within seconds, in the Console or over GraphQL.',
      diagram: 'real-time-events'
    }
  ]

  const primaryAction = {
    label: 'See every product',
    href: '/site/products',
    trailing: true
  }

  const DESCRIPTION =
    'The base architecture every product plugs into: a workload answers near the user, Firewall filters first, a function runs where logic is needed, data sits in the same data center, ' +
    'and every request is seen.'
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <ArchitectureTabsSection
      anchor="platform-architecture"
      eyebrow="Platform"
      title="One request through the Azion platform"
      :description="DESCRIPTION"
      tabs-side="bottom"
      :tabs="tabs"
      :primary-action="primaryAction"
    />

    <Spacer hatch />
  </Container>
</template>
