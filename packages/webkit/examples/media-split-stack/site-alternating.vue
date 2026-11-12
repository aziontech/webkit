<script setup>
  import MediaSplitStack from '@aziontech/webkit/media-split-stack'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'

  const bands = [
    {
      title: 'Run closer to users',
      description:
        'Handle requests close to users instead of sending everything back to a few central regions. That cuts latency, absorbs spikes automatically, and reduces backhaul.',
      illustration: 'fastest-path-to-live-website',
      illustrationLabel: 'Requests served from the data center nearest the user',
      action: {
        label: 'Learn more',
        href: '/en/products/application-accelerator/'
      }
    },
    {
      title: 'Keep delivery, logic, and data in one place',
      description:
        'Run delivery, execution, and data on one platform. APIs and dynamic applications get real-time request handling, origin protection, and state kept next to the code with KV Store.',
      illustration: 'runtime',
      illustrationLabel: 'Delivery, execution and data served from one platform',
      action: {
        label: 'Learn more',
        href: '/en/products/kv-store/'
      }
    },
    {
      title: 'Get better routes and more stable delivery',
      description:
        'Traffic enters inside ISP last-mile networks and connects through IXPs, peering, and Tier 1 transit. Fewer hops mean better routes and stable delivery during traffic spikes, upstream issues, and regional incidents.',
      illustration: 'distributed-apis',
      illustrationLabel: 'Entry points inside ISP networks, connected through IXPs and transit',
      action: {
        label: 'Learn more',
        href: '/en/products/load-balancer/'
      }
    },
    {
      title: 'Stop attack traffic earlier',
      description:
        'Block attack traffic in the delivery path, before it reaches your origin. Deploy code and policies and let the platform handle scaling, execution, and traffic steering. Your team manages fewer regions, less capacity, and fewer scaling rules.',
      illustration: 'automate-threat-mitigation',
      illustrationLabel: 'Attack traffic stopped in the delivery path, before the origin',
      action: {
        label: 'Learn more',
        href: '/en/products/ddos-protection/'
      }
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <MediaSplitStack
      kind="alternating"
      eyebrow="Managed Infrastructure"
      title="Stop managing regions and capacity by hand"
      :bands="bands"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
