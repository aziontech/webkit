<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import NetworkSection from '@aziontech/webkit/network-section'

  const claims = [
    '100+ data centers',
    '100+ Tbps network capacity',
    '30 ms median latency',
    '100% availability'
  ]

  const benefits = [
    {
      icon: 'pi pi-globe',
      title: 'Global resilience beyond anycast',
      description:
        "Azion's software-defined global router steers traffic around failures and network degradation faster than BGP can reconverge. Always-on DDoS protection across 100+ data centers worldwide."
    },
    {
      icon: 'pi pi-stopwatch',
      title: 'Low latency everywhere',
      description:
        'Compute, AI, databases, and security run in every data center, close to your users. Median global latency stays under 30 ms, with a built-in CDN and tiered caching for every app.'
    },
    {
      icon: 'pi pi-arrows-v',
      title: 'Zero-ops autoscaling and failover',
      description:
        'Absorbs any traffic spike with no cold starts, instantly scaling from zero to millions. No capacity planning, no provisioning. Scale-to-zero with no idle costs: you pay only for what you run.'
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <NetworkSection
      kind="benefits"
      eyebrow="Region: Earth."
      title="One distributed infrastructure without the complexity of managing, securing and scaling it"
      lead="Built around your users. Distributed around your data."
      :claims="claims"
      :benefits="benefits"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
