<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import StatsSection from '@aziontech/webkit/stats-section'

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

    <StatsSection :items="items" />

    <SectionGap hatch />
  </SectionContainer>
</template>
