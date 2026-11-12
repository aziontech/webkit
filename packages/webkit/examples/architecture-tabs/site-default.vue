<script setup>
  import ArchitectureTabs from '@aziontech/webkit/architecture-tabs'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'

  const tabs = [
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
      description: 'Premium tokens go only where they pay off; everyone else gets a lighter model.',
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
  ]

  const primaryAction = {
    label: 'Docs',
    href: '/product-preview',
    trailing: true
  }
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <ArchitectureTabs
      eyebrow="Routing"
      title="Every AI request through one control point"
      description="Every client calls one endpoint. Firewall stops abuse, then a function checks the key, routes the call, and logs it."
      position="bottom"
      :tabs="tabs"
      :primary-action="primaryAction"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
