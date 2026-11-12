<script setup>
  import NetworkSection from '@aziontech/webkit/network-section'
  import dafitiExtendedMono from '@aziontech/webkit/assets/dafiti-extended-mono.svg'
  import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'
  import madeiramadeiraExtendedReversed from '@aziontech/webkit/assets/madeiramadeira-extended-reversed.svg'
  import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'
</script>

<template>
  <NetworkSection
    kind="outcomes"
    eyebrow="Region: Earth."
    title="One distributed infrastructure without the complexity of managing, securing and scaling it"
    lead="Built around your users. Distributed around your data."
    :claims="[
      '100+ data centers',
      '100+ Tbps network capacity',
      '30 ms median latency',
      '100% availability'
    ]"
    :outcomes="[
      {
        logo: dafitiExtendedMono,
        logoAlt: 'Dafiti',
        logoTreatment: 'monochrome',
        text: '86% faster load times, with a 45% cost reduction in data transfer.',
        highlights: ['86% faster load times', '45% cost reduction']
      },
      {
        logo: madeiramadeiraExtendedReversed,
        logoAlt: 'MadeiraMadeira',
        logoTreatment: 'as-is',
        text: '90% lower cloud costs and faster applications at scale.',
        highlights: ['90% lower cloud costs']
      },
      {
        logo: rennerExtendedColor,
        logoAlt: 'Renner',
        logoTreatment: 'as-is',
        text: '67% saved on data transfer, even during massive traffic spikes.',
        highlights: ['67% saved']
      },
      {
        logo: fourbankExtendedReversed,
        logoAlt: 'Fourbank',
        logoTreatment: 'monochrome',
        text: 'DDoS mitigated on applications and APIs, with a programmable security layer.',
        highlights: ['DDoS mitigated']
      }
    ]"
  />
</template>
