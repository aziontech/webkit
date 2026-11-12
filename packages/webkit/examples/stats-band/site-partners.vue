<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import StatsBand from '@aziontech/webkit/stats-band'

  const items = [
    {
      prefix: '+',
      value: '100',
      label: 'Data centers worldwide'
    },
    {
      prefix: '+',
      value: '3k',
      label: 'ASNs directly connected to Azion'
    },
    {
      value: '100',
      suffix: '%',
      label: 'Availability, guaranteed by SLA'
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <StatsBand :items="items" />

    <SectionGap hatch />
  </SectionContainer>
</template>
