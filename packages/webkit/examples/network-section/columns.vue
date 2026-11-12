<script setup>
  import NetworkSection from '@aziontech/webkit/network-section'

  const claims = [
    '100+ data centers',
    '100+ Tbps network capacity',
    '30 ms median latency',
    '100% availability'
  ]

  const outcomes = [
    {
      logo: '/marketing-components/logos/dafiti-extended-mono.svg',
      logoAlt: 'Dafiti',
      logoTreatment: 'monochrome',
      text: '86% faster load times, with a 45% cost reduction in data transfer.',
      highlights: ['86% faster load times', '45% cost reduction']
    },
    {
      logo: '/marketing-components/clients/madeiramadeira.svg',
      logoAlt: 'MadeiraMadeira',
      logoTreatment: 'as-is',
      text: '90% lower cloud costs and faster applications at scale.',
      highlights: ['90% lower cloud costs']
    },
    {
      logo: '/marketing-components/clients/renner-color.svg',
      logoAlt: 'Renner',
      logoTreatment: 'as-is',
      text: '67% saved on data transfer, even during massive traffic spikes.',
      highlights: ['67% saved']
    },
    {
      logo: '/marketing-components/clients/fourbank.svg',
      logoAlt: 'Fourbank',
      logoTreatment: 'monochrome',
      text: 'DDoS mitigated on applications and APIs, with a programmable security layer.',
      highlights: ['DDoS mitigated']
    }
  ]

  const benefits = [
    {
      icon: 'pi pi-globe',
      title: 'Global resilience beyond anycast',
      description:
        'Traffic is steered around failures and network degradation faster than BGP can reconverge.'
    },
    {
      icon: 'pi pi-stopwatch',
      title: 'Low latency everywhere',
      description:
        'Compute, AI, databases, and security run in every data center, close to your users.'
    },
    {
      icon: 'pi pi-arrows-v',
      title: 'Zero-ops autoscaling and failover',
      description:
        'Absorbs any traffic spike with no cold starts, no capacity planning and no provisioning.'
    },
    {
      icon: 'pi pi-shield',
      title: 'Always-on protection',
      description:
        'DDoS mitigation and a programmable security layer run in front of every application.'
    }
  ]

  const counts = [2, 3, 4]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <NetworkSection
      v-for="count in counts"
      :key="`outcomes-${count}`"
      kind="outcomes"
      eyebrow="Region: Earth."
      :title="`${count} outcomes set the floor in ${count} columns`"
      lead="Built around your users. Distributed around your data."
      :claims="claims"
      :outcomes="outcomes.slice(0, count)"
    />
    <NetworkSection
      v-for="count in counts"
      :key="`benefits-${count}`"
      kind="benefits"
      eyebrow="Region: Earth."
      :title="`${count} benefits set the floor in ${count} columns`"
      lead="Built around your users. Distributed around your data."
      :claims="claims"
      :benefits="benefits.slice(0, count)"
    />
  </div>
</template>
