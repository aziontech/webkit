<script setup>
  import Container from '@aziontech/ui/container'
  import Spacer from '@aziontech/ui/spacer'
  import StatsSection from '@aziontech/ui/stats-section'

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
  <Container max-width="site">
    <Spacer hatch />

    <StatsSection :items="items" />

    <Spacer hatch />
  </Container>
</template>
