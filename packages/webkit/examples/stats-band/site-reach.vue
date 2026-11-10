<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import StatsBand from '@aziontech/webkit/stats-band'

  const items = [
    {
      value: '100',
      suffix: 'ms',
      label: 'Median response, worldwide'
    },
    {
      value: '24',
      suffix: '/7',
      label: 'Support on every plan'
    },
    {
      value: '99.99',
      suffix: '%',
      label: 'Availability, contractual'
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
